using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace School_Statements.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        // GET: api/User
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/User/5
        [HttpGet("{id}", Name = "Get")]
        public ActionResult<string> Get(int id)
        {
            return id.ToString();
        }
    }
}
