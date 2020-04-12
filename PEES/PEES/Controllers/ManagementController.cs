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
                Response.StatusCode = 500;
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
                    Response.StatusCode = 401;
                    return Content("Falta de autenticação");
                }
            }
            catch (Exception)
            {
                Response.StatusCode = 500;
                throw;
            }

            Configuration result;

            try
            {
                result = Management.GetConfiguration();
            }
            catch (Exception)
            {
                Response.StatusCode = 500;
                throw;
            }

            return new JsonResult(Response.StatusCode != 500 ? result :  null);
        }

        /*
        // GET: api/Management
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Management/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }

        // PUT: api/Management/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
        */
    }
}
