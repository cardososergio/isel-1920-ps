using Microsoft.AspNetCore.Mvc;
using OneLogin.Saml;
using Microsoft.Extensions.Configuration;

namespace SchoolStatements.Controllers
{
    [Route("auth")]
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
            /*var keyIdentifier = "https://saml.vault.azure.net/secrets/testing";
            KeyVaultClient kvc = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(GetToken));
            SecretBundle secret = Task.Run(() => kvc.GetSecretAsync(keyIdentifier)).ConfigureAwait(false).GetAwaiter().GetResult();
            var bytes = Convert.FromBase64String(secret.Value);*/

            AuthRequest req = new AuthRequest(configuration["Saml:Issuer"], configuration["Saml:IdPUrl"], configuration["Saml:AssertionUrl"]);

            return Redirect(configuration["Saml:IdPUrl"] + "?SAMLRequest=" + req.GetRequest() + "&ReplayState=" + req.GetRelayState());
        }

        [HttpPost]
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

        /*public async Task<string> GetToken(string authority, string resource, string scope)
        {
            var authContext = new AuthenticationContext(authority);
            ClientCredential clientCred = new ClientCredential("6ed4ba48-1536-4d37-b157-e2572ae16144", "DG7mzdn-8YthjsW0jvtuGFWNmVTd6[[_");
            AuthenticationResult result = await authContext.AcquireTokenAsync(resource, clientCred);

            if (result == null)
                throw new InvalidOperationException("Failed to obtain the JWT token");

            return result.AccessToken;
        }*/
    }
}