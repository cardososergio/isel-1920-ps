using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using PEES.Classes;
using DataAccess.DAL;
using DataAccess.DAO;
using System.Text;

namespace PEES.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagementController : ControllerBase
    {
        public ManagementController(IConfiguration configuration)
        {
            Management.connectionString = configuration.GetConnectionString("SqlServer");
        }

        [Route("/api/[controller]/[action]")]
        [HttpPost]
        public ActionResult Login([FromBody] RequestLogin login)
        {
            bool result = false;

            try
            {
                var passwordSalt = Management.GetPasswordSlat(login.Email);

                if (passwordSalt.Password != "" && passwordSalt.Salt != "")
                    result = (Utils.CreatePasswordHash(login.Password, passwordSalt.Salt) == passwordSalt.Password);
            }
            catch (Exception)
            {
                return new BadRequestResult();
            }

            var token = result ? Guid.NewGuid().ToString() : "";
            HttpContext.Session.SetString("ManagementToken", token);
            
            return new JsonResult(new ManagementStatus() { Status = result, Token = token });
        }

        [HttpGet]
        public ActionResult Index()
        {
            // check for cookie
            try
            {
                string sessionToken = HttpContext.Session.GetString("ManagementToken");

                if (!Request.Cookies.TryGetValue("managementToken", out string cookieToken) || sessionToken == null || cookieToken != sessionToken)
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

        [HttpPost]
        public ActionResult Post([FromBody] Configuration conf)
        {
            // check for cookie
            try
            {
                string sessionToken = HttpContext.Session.GetString("ManagementToken");

                if (!Request.Cookies.TryGetValue("managementToken", out string cookieToken) || sessionToken == null || cookieToken != sessionToken)
                {
                    return new BadRequestResult();
                }
            }
            catch (Exception)
            {
                return new BadRequestResult();
            }

            var result = new Configuration();

            try
            {
                if (Management.SetConfiguration(conf))
                    result = Management.GetConfiguration();
                else
                    throw new Exception("Not able to save");
            }
            catch (Exception)
            {
                return new BadRequestResult();
            }

            return new JsonResult(result);
        }
    }
}
