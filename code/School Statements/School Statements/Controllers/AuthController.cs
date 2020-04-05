using ITfoxtec.Identity.Saml2;
using ITfoxtec.Identity.Saml2.Schemas;
using ITfoxtec.Identity.Saml2.MvcCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Security.Authentication;
using School_Statements.Identity;
using ITfoxtec.Identity.Saml2.Schemas.Metadata;
using System.Security.Cryptography.X509Certificates;

namespace School_Statements.Controllers
{
    [Route("auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // GET: api/User
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "value1", "value2" };
        }

        const string relayStateReturnUrl = "https://schoolstatements.azurewebsites.net/auth/callback";
        //private readonly Saml2Configuration config;

        /*public AuthController(IOptions<Saml2Configuration> configAccessor)
        {
            config = configAccessor.Value;
        }*/

        [Route("login")]
        public IActionResult Login(string returnUrl = null)
        {
            Saml2Configuration config = new Saml2Configuration();
            config.AllowedAudienceUris.Add("https://schoolstatements.azurewebsites.net/auth/metadata");
            config.AudienceRestricted = true;
            config.AuthnResponseSignType = Saml2AuthnResponseSignTypes.SignResponse;
            config.CertificateValidationMode = System.ServiceModel.Security.X509CertificateValidationMode.ChainTrust;
            config.Issuer = "https://schoolstatements.azurewebites.net/auth/metadata";
            config.RevocationMode = X509RevocationMode.NoCheck;
            config.SaveBootstrapContext = false;
            config.SignAuthnRequest = true;
            config.SignatureAlgorithm = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
            config.SigningCertificate = new X509Certificate2("itfoxtec.identity.saml2.testwebappcore_Certificate.pfx", "!QAZ2wsx");
            config.SingleSignOnDestination = new Uri("https://idp.net.ipl.pt/simplesaml/saml2/idp/SSOService.php");

            var binding = new Saml2RedirectBinding();
            binding.SetRelayStateQuery(new Dictionary<string, string> { { relayStateReturnUrl, returnUrl ?? Url.Content("~/") } });

            return binding.Bind(new Saml2AuthnRequest(config)
            {
                Subject = new Subject { NameID = new NameID { ID = "abcd" } },
            }).ToActionResult();
        }

        /*[Route("Callback")]
        public async Task<IActionResult> Callback()
        {
            var binding = new Saml2PostBinding();
            var saml2AuthnResponse = new Saml2AuthnResponse(config);

            binding.ReadSamlResponse(Request.ToGenericHttpRequest(), saml2AuthnResponse);
            if (saml2AuthnResponse.Status != Saml2StatusCodes.Success)
            {
                throw new AuthenticationException($"SAML Response status: {saml2AuthnResponse.Status}");
            }
            binding.Unbind(Request.ToGenericHttpRequest(), saml2AuthnResponse);
            await saml2AuthnResponse.CreateSession(HttpContext, claimsTransform: (claimsPrincipal) => ClaimsTransform.Transform(claimsPrincipal));

            var relayStateQuery = binding.GetRelayStateQuery();
            var returnUrl = relayStateQuery.ContainsKey(relayStateReturnUrl) ? relayStateQuery[relayStateReturnUrl] : Url.Content("~/");
            return Redirect(returnUrl);
        }

        [Route("Logout")]
        public async Task<IActionResult> Logout()
        {
            Saml2StatusCodes status;
            var requestBinding = new Saml2PostBinding();
            var logoutRequest = new Saml2LogoutRequest(config, User);
            try
            {
                requestBinding.Unbind(Request.ToGenericHttpRequest(), logoutRequest);
                status = Saml2StatusCodes.Success;
                await logoutRequest.DeleteSession(HttpContext);
            }
            catch (Exception exc)
            {
                status = Saml2StatusCodes.RequestDenied;
            }

            var responsebinding = new Saml2PostBinding();
            responsebinding.RelayState = requestBinding.RelayState;
            var saml2LogoutResponse = new Saml2LogoutResponse(config)
            {
                InResponseToAsString = logoutRequest.IdAsString,
                Status = status,
            };
            return responsebinding.Bind(saml2LogoutResponse).ToActionResult();
        }

        [Route("metadata")]
        public IActionResult Metadata()
        {
            var defaultSite = new Uri($"{Request.Scheme}://{Request.Host.ToUriComponent()}/");

            var entityDescriptor = new EntityDescriptor(config);
            entityDescriptor.ValidUntil = 365;
            entityDescriptor.SPSsoDescriptor = new SPSsoDescriptor
            {
                WantAssertionsSigned = true,
                SigningCertificates = new X509Certificate2[]
                {
                    config.SigningCertificate
                },
                SingleLogoutServices = new SingleLogoutService[]
                {
                    new SingleLogoutService { Binding = ProtocolBindings.HttpPost, Location = new Uri(defaultSite, "Auth/Logout") }
                },
                NameIDFormats = new Uri[] { NameIdentifierFormats.X509SubjectName },
                AssertionConsumerServices = new AssertionConsumerService[]
                {
                    new AssertionConsumerService {  Binding = ProtocolBindings.HttpPost, Location = new Uri(defaultSite, "Auth/Callback") }
                },
                AttributeConsumingServices = new AttributeConsumingService[]
                {
                    new AttributeConsumingService { ServiceName = new ServiceName("Editor de enunciados", "en"), RequestedAttributes = CreateRequestedAttributes() }
                },
            };
            entityDescriptor.ContactPerson = new ContactPerson(ContactTypes.Administrative)
            {
                GivenName = "Sérgio",
                SurName = "Cardoso",
                EmailAddress = "a32263@alunos.isel.pt"
            };
            return new Saml2Metadata(entityDescriptor).CreateMetadata().ToActionResult();
        }

        private IEnumerable<RequestedAttribute> CreateRequestedAttributes()
        {
            yield return new RequestedAttribute("urn:oid:2.5.4.4");
            yield return new RequestedAttribute("urn:oid:2.5.4.3", false);
        }*/
    }
}