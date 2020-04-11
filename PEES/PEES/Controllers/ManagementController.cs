using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using PEES.Classes;

namespace PEES.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagementController : ControllerBase
    {
        readonly IConfiguration configuration;

        public ManagementController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        [Route("/api/[controller]/[action]")]
        [HttpGet]
        public ActionResult Login([FromBody] RequestLogin login)
        {
            bool result = false;

            try
            {
                string dbPassword = "";
                string dbSalt = "";

                using (SqlConnection sqlConnection = new SqlConnection(configuration["ConnectionString:SqlServer"]))
                {
                    sqlConnection.Open();

                    using (SqlCommand sqlCommand = new SqlCommand("dbo.spGetUserPassword", sqlConnection))
                    {
                        sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;

                        sqlCommand.Parameters.AddWithValue("@Email", login.Email);

                        using (SqlDataReader reader = sqlCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                dbPassword = (string)reader["Password"];
                                dbSalt = (string)reader["Salt"];
                            }
                        }
                    }
                }

                if (dbPassword != "" && dbSalt != "")
                    result = (Utils.CreatePasswordHash(login.Password, dbSalt) == dbPassword);
            }
            catch (Exception)
            {
                Response.StatusCode = 500;
                //throw;
            }

            var token = result ? Guid.NewGuid().ToString() : "";
            HttpContext.Session.SetString("managementToken", token);

            return new JsonResult(new ManagementStatus() { Status = result, Token = token });
        }

        private class ManagementStatus
        {
            public bool Status { get; set; }
            public string Token { get; set; }
        }

        public class RequestLogin
        {
            public string Email { get; set; }
            public string Password { get; set; }
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
