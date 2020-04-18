using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using PEES.Classes;
using PEES.Classes.SAML;
using System.Text;

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
        public IActionResult Post()
        {
            if (Request.Form["SAMLResponse"].ToString() != null)
            {
                Response samlResponse = new Response(configuration["KeyVault:KeyIdentifier"], configuration["KeyVault:client_id"], configuration["KeyVault:client_secret"]);
                samlResponse.LoadXmlFromBase64(Request.Form["SAMLResponse"].ToString());
                var user = samlResponse.Check();

                Response.Cookies.Append("AccessToken", Utils.EncryptKey(Encoding.ASCII.GetBytes(user.Email)));

                return RedirectPermanent("/");
            }

            return RedirectPermanent("/error");
        }
    }
}
