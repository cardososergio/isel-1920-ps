using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using PEES.Classes.SAML;
using System.Collections.Generic;

namespace PEES.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        readonly IConfiguration configuration;

        public AuthController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        [HttpGet]
        public IActionResult Get()
        {
            AuthRequest req = new AuthRequest(configuration["Saml:Issuer"], configuration["Saml:IdPUrl"], configuration["Saml:AssertionUrl"]);

            return Redirect(configuration["Saml:IdPUrl"] + "?SAMLRequest=" + req.GetRequest() + "&ReplayState=" + req.GetRelayState());
        }

        [HttpGet("{metadata}", Name = "Metadata")]
        [Produces("application/xml")]
        public IActionResult GetByMetadata(string metadata)
        {
            if (metadata.ToLower() == "metadata")
                return Ok(new AuthMetadata(configuration["Saml:AssertionUrl"], configuration["Saml:Issuer"], configuration["Saml:Certificate"]).getMetadata());

            return null;
        }

        [HttpPost]
        [Consumes("application/xml")]
        public void Post()
        {
            if (Request.Form["SAMLResponse"].ToString() != null)
            {
                Response samlResponse = new Response();
                samlResponse.LoadXmlFromBase64(Request.Form["SAMLResponse"].ToString());

                if (samlResponse.IsValid())
                {
                    var email = samlResponse.GetEmail();
                }

                Redirect("/counter");
            }
        }
    }

    /*var keyIdentifier = "https://saml.vault.azure.net/secrets/testing";
            KeyVaultClient kvc = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(GetToken));
            SecretBundle secret = Task.Run(() => kvc.GetSecretAsync(keyIdentifier)).ConfigureAwait(false).GetAwaiter().GetResult();
            var bytes = Convert.FromBase64String(secret.Value);*/
}
