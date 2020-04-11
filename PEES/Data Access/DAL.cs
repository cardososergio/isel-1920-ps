using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text.Json;
using DataAccess.DAO;

namespace DataAccess.DAL
{
    public static class Management
    {
        public static string connectionString;

        public static PasswordSalt GetPasswordSlat(string email)
        {
            var result = new PasswordSalt();

            using (Database db = new Database(connectionString))
            {
                List<SqlParameter> parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter("@Email", email));

                using (SqlDataReader reader = db.ExecSPDataReader("dbo.spGetUserPassword", parameters))
                {
                    reader.Read();

                    result.Password = (string)reader["Password"];
                    result.Salt = (string)reader["Salt"];
                }
            }

            return result;
        }

        public static Configuration GetConfiguration()
        {
            var result = new Configuration();

            using (Database db = new Database(connectionString))
            {
                using (SqlDataReader reader = db.ExecSPDataReader("dbo.spGetConfiguration"))
                {
                    reader.Read();

                    result = JsonSerializer.Deserialize<Configuration>((string)reader["Configuration"]);
                    result.SchoolName = (string)reader["SchoolName"];
                }

                using (SqlDataReader reader = db.ExecSPDataReader("dbo.spGetCurricularUnits"))
                {
                    result.CurricularUnits = new List<Configuration.DefaultStringValue>();
                    while (reader.Read())
                    {
                        result.CurricularUnits.Add(new Configuration.DefaultStringValue() { id = ((Guid)reader["CurricularUnitId"]).ToString(), value = (string)reader["CurricularUnit"] });
                    }
                }
            }

            return result;
        }
    }
}
