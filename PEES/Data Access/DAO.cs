using System;
using System.Collections.Generic;

namespace DataAccess.DAO
{
    public struct RequestLogin
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public struct ManagementStatus
    {
        public bool Status { get; set; }
        public string Token { get; set; }
    }

    public struct PasswordSalt
    {
        public string Password { get; set; }
        public string Salt { get; set; }
    }

    public class Configuration
    {
        public string SchoolName { get; set; }
        public List<DefaultIntValue> CurricularYears { get; set; }
        public List<DefaultIntValue> Semesters { get; set; }
        public List<DefaultIntValue> Seasons { get; set; }
        public List<DefaultIntValue> NumeringTypes { get; set; }
        public List<DefaultIntValue> InstructionTypes { get; set; }
        public List<DefaultStringValue> CurricularUnits { get; set; }

        public struct DefaultIntValue
        {
            public int id { get; set; }
            public string value { get; set; }
            public bool isNew { get; set; }
            public bool isChange { get; set; }
            public bool isDelete { get; set; }
            public bool gotError { get; set; }
        }

        public struct DefaultStringValue
        {
            public string id { get; set; }
            public string value { get; set; }
            public bool isNew { get; set; }
            public bool isChange { get; set; }
            public bool isDelete { get; set; }
            public bool gotError { get; set; }
        }
    }
}
