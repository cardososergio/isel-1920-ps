using System;
using System.Collections.Generic;

namespace DataAccess.DAO
{
    public struct RequestLogin
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public struct PasswordSalt
    {
        public string Password { get; set; }
        public string Salt { get; set; }
    }

    public struct User
    {
        public string UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }

    public class Configuration
    {
        public string ConfigurationId { get; set; }
        public string SchoolName { get; set; }
        public List<DefaultStringValue> CurricularYears { get; set; }
        public List<DefaultStringValue> Semesters { get; set; }
        public List<DefaultStringValue> Seasons { get; set; }
        public List<DefaultIntValue> NumeringTypes { get; set; }
        public List<DefaultStringValue> InstructionTypes { get; set; }
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
