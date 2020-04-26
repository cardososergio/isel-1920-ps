using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DAL;
using DataAccess.DAO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using PEES.Classes;

namespace PEES.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        public UsersController(IConfiguration configuration)
        {
            Global.connectionString = configuration.GetConnectionString("SqlServer");
            Management.connectionString = configuration.GetConnectionString("SqlServer");
        }

        [Route("/api/[controller]/[action]")]
        [HttpGet]
        public IActionResult Check()
        {
            try
            {
                string sessionToken = HttpContext.Session.GetString("AccessToken");
                bool valid = Request.Cookies.TryGetValue("AccessToken", out string cookieToken) && sessionToken != null && sessionToken == cookieToken;

                return new JsonResult(valid);
            }
            catch (Exception)
            {
                return new BadRequestResult();
            }
        }

        [Route("/api/[controller]/[action]")]
        [HttpPost]
        public ActionResult Login([FromBody] RequestLogin login)
        {
            bool result = false;

            try
            {
                var passwordSalt = Global.GetPasswordSlat(login.Email);

                if (passwordSalt.Password != "" && passwordSalt.Salt != "")
                    result = (Utils.CreatePasswordHash(login.Password, passwordSalt.Salt) == passwordSalt.Password);
            }
            catch (Exception)
            {
                return new BadRequestResult();
            }

            var token = result ? Guid.NewGuid().ToString() : "";
            HttpContext.Session.SetString("AccessToken", token);
            Response.Cookies.Append("AccessToken", token, new CookieOptions() { SameSite = SameSiteMode.Strict, IsEssential = true });

            return new OkResult();
        }

        [Route("/api/[controller]/[action]")]
        [HttpGet]
        public ActionResult Configuration()
        {
            // check for cookie
            try
            {
                string sessionToken = HttpContext.Session.GetString("AccessToken");

                if (!Request.Cookies.TryGetValue("AccessToken", out string cookieToken) || sessionToken == null || cookieToken != sessionToken)
                {
                    return new BadRequestResult();
                }
            }
            catch (Exception)
            {
                return new BadRequestResult();
            }

            Configuration result = new Configuration();

            try
            {
                result = Management.GetConfiguration();
            }
            catch (Exception)
            {
                return new BadRequestResult();
            }

            return new JsonResult(result);
        }
    }
}
