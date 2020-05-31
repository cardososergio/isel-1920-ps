using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.DAO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace PEES.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VersionControlController : ControllerBase
    {
        public VersionControlController(IConfiguration configuration)
        {
            DataAccess.DAL.VersionControl.connectionString = configuration.GetConnectionString("SqlServer");
        }

        [HttpGet("{id}")]
        public ActionResult Get(string id, [FromQuery] string type)
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

            // check if type is valid
            switch (type.ToLower())
            {
                case "curricularunit":
                case "curricularyear":
                case "semester":
                case "season":
                case "instructiontype":
                    break;
                default:
                    return new BadRequestResult();
            }

            var result = new List<VersionControl>();

            try
            {
                result = DataAccess.DAL.VersionControl.GetRevisions(id, type.ToLower());
            }
            catch (Exception)
            {
                return new BadRequestResult();
            }

            return new JsonResult(result);
        }

        [HttpPut("{id}")]
        public ActionResult Put(string id, [FromBody] string revision, [FromQuery] string type)
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

            // check if type is valid
            switch (type.ToLower())
            {
                case "curricularunit":
                case "curricularyear":
                case "semester":
                case "season":
                case "instructiontype":
                    break;
                default:
                    return new BadRequestResult();
            }

            int result;

            try
            {
                result = DataAccess.DAL.VersionControl.SetRevision(id, Convert.ToInt32(revision), type);
            }
            catch (Exception)
            {
                return new BadRequestResult();
            }

            return new JsonResult(result);
        }
    }
}
