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
        public ActionResult Get(string id)
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

            var result = new List<VersionControl>();

            try
            {
                result = DataAccess.DAL.VersionControl.GetRevisions(id);
            }
            catch (Exception)
            {
                return new BadRequestResult();
            }

            return new JsonResult(result);
        }

        [HttpPut("{id}")]
        public ActionResult Put(string id, [FromBody] string revision)
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

            try
            {
                DataAccess.DAL.VersionControl.SetRevision(id, Convert.ToInt32(revision));
            }
            catch (Exception)
            {
                return new BadRequestResult();
            }

            return new JsonResult(true);
        }

        //// GET: api/<VersionControlController>
        //[HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        //// POST api/<VersionControlController>
        //[HttpPost]
        //public void Post([FromBody] string value)
        //{
        //}

        //// DELETE api/<VersionControlController>/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
