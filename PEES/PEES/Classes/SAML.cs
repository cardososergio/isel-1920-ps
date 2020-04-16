using System;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Security.Cryptography.Xml;
using System.Text;
using System.Xml;

namespace PEES.Classes
{
    namespace SAML
    {
        public class Response
        {
            private XmlDocument xmlDoc;

            public Response()
            {
            }

            public void LoadXml(string xml)
            {
                xmlDoc = new XmlDocument
                {
                    PreserveWhitespace = true,
                    XmlResolver = null
                };
                xmlDoc.LoadXml(xml);
            }

            public void LoadXmlFromBase64(string response)
            {
                ASCIIEncoding enc = new ASCIIEncoding();
                LoadXml(enc.GetString(Convert.FromBase64String(response)));
            }

            public bool IsValid()
            {
                bool status = true;

                XmlNamespaceManager manager = new XmlNamespaceManager(xmlDoc.NameTable);
                manager.AddNamespace("ds", SignedXml.XmlDsigNamespaceUrl);
                manager.AddNamespace("saml", "urn:oasis:names:tc:SAML:2.0:assertion");
                manager.AddNamespace("samlp", "urn:oasis:names:tc:SAML:2.0:protocol");
                XmlNodeList nodeList = xmlDoc.SelectNodes("//ds:Signature", manager);

                SignedXml signedXml = new SignedXml(xmlDoc);
                signedXml.LoadXml((XmlElement)nodeList[0]);

                var notBefore = NotBefore();
                status &= !notBefore.HasValue || (notBefore <= DateTime.Now);

                var notOnOrAfter = NotOnOrAfter();
                status &= !notOnOrAfter.HasValue || (notOnOrAfter > DateTime.Now);

                return status;
            }

            public DateTime? NotBefore()
            {
                XmlNamespaceManager manager = new XmlNamespaceManager(xmlDoc.NameTable);
                manager.AddNamespace("saml", "urn:oasis:names:tc:SAML:2.0:assertion");
                manager.AddNamespace("samlp", "urn:oasis:names:tc:SAML:2.0:protocol");

                var nodes = xmlDoc.SelectNodes("/samlp:Response/saml:Assertion/saml:Conditions", manager);
                string value = null;
                if (nodes != null && nodes.Count > 0 && nodes[0] != null && nodes[0].Attributes != null && nodes[0].Attributes["NotBefore"] != null)
                {
                    value = nodes[0].Attributes["NotBefore"].Value;
                }
                return value != null ? DateTime.Parse(value) : (DateTime?)null;
            }

            public DateTime? NotOnOrAfter()
            {
                XmlNamespaceManager manager = new XmlNamespaceManager(xmlDoc.NameTable);
                manager.AddNamespace("saml", "urn:oasis:names:tc:SAML:2.0:assertion");
                manager.AddNamespace("samlp", "urn:oasis:names:tc:SAML:2.0:protocol");

                var nodes = xmlDoc.SelectNodes("/samlp:Response/saml:Assertion/saml:Conditions", manager);
                string value = null;
                if (nodes != null && nodes.Count > 0 && nodes[0] != null && nodes[0].Attributes != null && nodes[0].Attributes["NotOnOrAfter"] != null)
                {
                    value = nodes[0].Attributes["NotOnOrAfter"].Value;
                }
                return value != null ? DateTime.Parse(value) : (DateTime?)null;
            }

            public string GetEmail()
            {
                XmlNamespaceManager manager = new XmlNamespaceManager(xmlDoc.NameTable);
                manager.AddNamespace("ds", SignedXml.XmlDsigNamespaceUrl);
                manager.AddNamespace("saml", "urn:oasis:names:tc:SAML:2.0:assertion");
                manager.AddNamespace("samlp", "urn:oasis:names:tc:SAML:2.0:protocol");

                XmlNode node = xmlDoc.SelectSingleNode("/samlp:Response/saml:Assertion/saml:AttributeStatement/saml:Attribute/saml:AttributeValue", manager);
                return node.InnerText;
            }
        }

        public class AuthRequest
        {
            public string id;
            private readonly string issue_instant;
            private readonly string idpUrl;
            private readonly string assertionUrl;
            private readonly string issuer;

            public AuthRequest(string Issuer, string IdPUrl, string AssertionUrl)
            {
                id = System.Guid.NewGuid().ToString();
                issue_instant = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ");

                this.issuer = Issuer;
                this.idpUrl = IdPUrl;
                this.assertionUrl = AssertionUrl;
            }

            public string GetRequest()
            {
                using StringWriter sw = new StringWriter();
                XmlWriterSettings xws = new XmlWriterSettings
                {
                    OmitXmlDeclaration = true
                };

                using (XmlWriter xw = XmlWriter.Create(sw, xws))
                {
                    xw.WriteStartElement("saml2p", "AuthnRequest", "urn:oasis:names:tc:SAML:2.0:protocol");
                    xw.WriteAttributeString("AssertionConsumerServiceURL", assertionUrl);
                    xw.WriteAttributeString("Destination", idpUrl);
                    xw.WriteAttributeString("ID", id);
                    xw.WriteAttributeString("IssueInstant", issue_instant);
                    xw.WriteAttributeString("ProtocolBinding", "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST");
                    xw.WriteAttributeString("Version", "2.0");

                    xw.WriteStartElement("saml2", "Issuer", "urn:oasis:names:tc:SAML:2.0:assertion");
                    xw.WriteString(issuer);
                    xw.WriteEndElement();

                    xw.WriteStartElement("saml2p", "NameIDPolicy", "urn:oasis:names:tc:SAML:2.0:protocol");
                    xw.WriteAttributeString("Format", "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified");
                    xw.WriteEndElement();

                    xw.WriteEndElement();
                }

                byte[] toEncodeAsBytes = ASCIIEncoding.ASCII.GetBytes(sw.ToString());

                using var outputStream = new MemoryStream();
                using (var gZipStream = new DeflateStream(outputStream, CompressionMode.Compress))
                    gZipStream.Write(toEncodeAsBytes, 0, toEncodeAsBytes.Length);

                return WebUtility.UrlEncode(Convert.ToBase64String(outputStream.ToArray()));
            }

            public string GetRelayState()
            {
                return WebUtility.UrlEncode(Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(assertionUrl)));
            }
        }

        public class AuthMetadata
        {
            private readonly string assertionUrl;
            private readonly string issuer;
            private readonly string certificate;

            public AuthMetadata(string assertionUrl, string issuer, string certificate)
            {
                this.assertionUrl = assertionUrl;
                this.issuer = issuer;
                this.certificate = certificate;
            }

            public XmlDocument getMetadata()
            {
                using StringWriter sw = new StringWriter();
                XmlWriterSettings xws = new XmlWriterSettings()
                {
                    OmitXmlDeclaration = true
                };

                using (XmlWriter xw = XmlWriter.Create(sw, xws))
                {
                    xw.WriteStartElement("md", "EntityDescriptor", "urn:oasis:names:tc:SAML:2.0:metadata");
                    xw.WriteAttributeString("entityID", issuer);
                    xw.WriteAttributeString("xmlns", "ds", null, "http://www.w3.org/2000/09/xmldsig#");
                    xw.WriteAttributeString("xmlns", "xsi", null, "http://www.w3.org/2001/XMLSchema-instance");
                    xw.WriteAttributeString("xmlns", "mdui", null, "urn:oasis:names:tc:SAML:metadata:ui");

                    xw.WriteStartElement("md", "SPSSODescriptor", "urn:oasis:names:tc:SAML:2.0:metadata");
                    xw.WriteAttributeString("protocolSupportEnumeration", "urn:oasis:names:tc:SAML:2.0:protocol");

                    xw.WriteStartElement("md", "Extensions", "urn:oasis:names:tc:SAML:2.0:metadata");
                    xw.WriteStartElement("mdui", "UIInfo", "urn:oasis:names:tc:SAML:metadata:ui");
                    xw.WriteStartElement("mdui", "DisplayName", "urn:oasis:names:tc:SAML:metadata:ui");
                    xw.WriteAttributeString("lang", "pt");
                    xw.WriteString("PEES SP");
                    xw.WriteEndElement();
                    xw.WriteEndElement();
                    xw.WriteEndElement();

                    xw.WriteStartElement("md", "KeyDescriptor", "urn:oasis:names:tc:SAML:2.0:metadata");
                    xw.WriteStartElement("ds", "KeyInfo", "http://www.w3.org/2000/09/xmldsig#");
                    xw.WriteStartElement("ds", "X509Data", "http://www.w3.org/2000/09/xmldsig#");
                    xw.WriteStartElement("ds", "X509Certificate", "http://www.w3.org/2000/09/xmldsig#");
                    xw.WriteString(certificate);
                    xw.WriteEndElement();
                    xw.WriteEndElement();
                    xw.WriteEndElement();
                    xw.WriteEndElement();

                    xw.WriteStartElement("md", "AssertionConsumerService", "urn:oasis:names:tc:SAML:2.0:metadata");
                    xw.WriteAttributeString("Binding", "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST");
                    xw.WriteAttributeString("Location", assertionUrl);
                    xw.WriteAttributeString("index", "0");
                    xw.WriteEndElement();

                    xw.WriteStartElement("md", "AttributeConsumingService", "urn:oasis:names:tc:SAML:2.0:metadata");
                    xw.WriteAttributeString("index", "1");

                    xw.WriteStartElement("md", "ServiceName", "urn:oasis:names:tc:SAML:2.0:metadata");
                    xw.WriteAttributeString("xml", "lang", null, "pt");
                    xw.WriteString("PEES - SAML");
                    xw.WriteEndElement();
                    xw.WriteStartElement("md", "RequestedAttribute", "urn:oasis:names:tc:SAML:2.0:metadata");
                    xw.WriteAttributeString("FriendlyName", "displayName");
                    xw.WriteAttributeString("Name", "urn:oid:2.16.840.1.113730.3.1.241");
                    xw.WriteAttributeString("NameFormat", "urn:oasis:names:tc:SAML:2.0:attrname-format:uri");
                    xw.WriteAttributeString("isRequired", "true");
                    xw.WriteEndElement();
                    xw.WriteStartElement("md", "RequestedAttribute", "urn:oasis:names:tc:SAML:2.0:metadata");
                    xw.WriteAttributeString("FriendlyName", "mail");
                    xw.WriteAttributeString("Name", "urn:oid:0.9.2342.19200300.100.1.3");
                    xw.WriteAttributeString("NameFormat", "urn:oasis:names:tc:SAML:2.0:attrname-format:uri");
                    xw.WriteAttributeString("isRequired", "true");
                    xw.WriteEndElement();
                    xw.WriteEndElement();

                    xw.WriteEndElement();

                    xw.WriteStartElement("md", "Organization", "urn:oasis:names:tc:SAML:2.0:metadata");
                    
                    xw.WriteStartElement("md", "OrganizationName", "urn:oasis:names:tc:SAML:2.0:metadata");
                    xw.WriteAttributeString("xml", "lang", null, "pt");
                    xw.WriteString("ISEL-PS-1920");
                    xw.WriteEndElement();

                    xw.WriteStartElement("md", "OrganizationDisplayName", "urn:oasis:names:tc:SAML:2.0:metadata");
                    xw.WriteAttributeString("xml", "lang", null, "pt");
                    xw.WriteString("Plataforma de edicao de enunciados escolares");
                    xw.WriteEndElement();

                    xw.WriteStartElement("md", "OrganizationURL", "urn:oasis:names:tc:SAML:2.0:metadata");
                    xw.WriteAttributeString("xml", "lang", null, "pt");
                    xw.WriteString("https://pees.azurewebsites.net");
                    xw.WriteEndElement();

                    xw.WriteEndElement();

                    xw.WriteStartElement("md", "ContactPerson", "urn:oasis:names:tc:SAML:2.0:metadata");
                    xw.WriteAttributeString("contactType", "technical");

                    xw.WriteStartElement("md", "EmailAddress", "urn:oasis:names:tc:SAML:2.0:metadata");
                    xw.WriteString("a32263@alunos.isel.pt");
                    xw.WriteEndElement();

                    xw.WriteEndElement();

                    xw.WriteEndElement();
                }

                XmlDocument xml = new XmlDocument();
                xml.LoadXml(sw.ToString());

                return xml;
            }
        }
    }
}