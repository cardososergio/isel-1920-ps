using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text.Json;
using DataAccess.DAO;

namespace DataAccess.DAL
{
    public static class Global
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
    }

    public static class Management
    {
        public static string connectionString;

        public static Configuration GetConfiguration()
        {
            var result = new Configuration();

            using (Database db = new Database(connectionString))
            {
                using (DataSet ds = db.ExecSPDataSet("dbo.spGetConfiguration"))
                {
                    if (ds.Tables.Count != 6)
                        throw new Exception("Missing tables");

                    foreach (DataRow item in ds.Tables[0].Rows)
                    {
                        result.ConfigurationId = item["ApplicationId"].ToString();
                        result.SchoolName = (string)item["SchoolName"];
                        result.NumeringTypes = JsonSerializer.Deserialize<List<Configuration.DefaultIntValue>>((string)item["NumeringTypes"]);
                    }
                    // Curricular Years
                    result.CurricularYears = new List<Configuration.DefaultStringValue>();
                    foreach (DataRow item in ds.Tables[1].Rows)
                        result.CurricularYears.Add(new Configuration.DefaultStringValue() { id = item["CurricularYearId"].ToString(), value = (string)item["CurricularYear"], revisionId = (int)item["Revision"] });
                    // Semesters
                    result.Semesters = new List<Configuration.DefaultStringValue>();
                    foreach (DataRow item in ds.Tables[2].Rows)
                        result.Semesters.Add(new Configuration.DefaultStringValue() { id = item["SemesterId"].ToString(), value = (string)item["Semester"], revisionId = (int)item["Revision"] });
                    // Seasons
                    result.Seasons = new List<Configuration.DefaultStringValue>();
                    foreach (DataRow item in ds.Tables[3].Rows)
                        result.Seasons.Add(new Configuration.DefaultStringValue() { id = item["SeasonId"].ToString(), value = (string)item["Season"], revisionId = (int)item["Revision"] });
                    // Instruction Types
                    result.InstructionTypes = new List<Configuration.DefaultStringValue>();
                    foreach (DataRow item in ds.Tables[4].Rows)
                        result.InstructionTypes.Add(new Configuration.DefaultStringValue() { id = item["InstructionTypeId"].ToString(), value = (string)item["InstructionType"], revisionId = (int)item["Revision"] });
                    // Curricular Units
                    result.CurricularUnits = new List<Configuration.DefaultStringValue>();
                    foreach (DataRow item in ds.Tables[5].Rows)
                        result.CurricularUnits.Add(new Configuration.DefaultStringValue() { id = item["CurricularUnitId"].ToString(), value = (string)item["CurricularUnit"], revisionId = (int)item["Revision"] });
                }
            }

            return result;
        }

        public static bool SetConfiguration(Configuration configuration)
        {
            using (Database db = new Database(connectionString))
            {
                List<SqlParameter> parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter("@SchoolName", configuration.SchoolName));
                db.ExecSPNonQuery("dbo.spSetSchoolName", parameters);

                foreach (var item in configuration.CurricularYears)
                {
                    if ((!item.isNew && !item.isChange && !item.isDelete) || (item.isNew && item.isDelete)) continue;

                    parameters = new List<SqlParameter>();

                    if (!item.isNew)
                        parameters.Add(new SqlParameter("@CurricularYearId", item.id));
                    parameters.Add(new SqlParameter("@CurricularYear", item.value));
                    parameters.Add(new SqlParameter("@toDelete", item.isDelete));
                    db.ExecSPNonQuery("dbo.spSetCurricularYear", parameters);
                }

                foreach (var item in configuration.Semesters)
                {
                    if ((!item.isNew && !item.isChange && !item.isDelete) || (item.isNew && item.isDelete)) continue;

                    parameters = new List<SqlParameter>();

                    if (!item.isNew)
                        parameters.Add(new SqlParameter("@SemesterId", item.id));
                    parameters.Add(new SqlParameter("@Semester", item.value));
                    parameters.Add(new SqlParameter("@toDelete", item.isDelete));
                    db.ExecSPNonQuery("dbo.spSetSemester", parameters);
                }

                foreach (var item in configuration.Seasons)
                {
                    if ((!item.isNew && !item.isChange && !item.isDelete) || (item.isNew && item.isDelete)) continue;

                    parameters = new List<SqlParameter>();

                    if (!item.isNew)
                        parameters.Add(new SqlParameter("@SeasonId", item.id));
                    parameters.Add(new SqlParameter("@Season", item.value));
                    parameters.Add(new SqlParameter("@toDelete", item.isDelete));
                    db.ExecSPNonQuery("dbo.spSetSeason", parameters);
                }

                foreach (var item in configuration.InstructionTypes)
                {
                    if ((!item.isNew && !item.isChange && !item.isDelete) || (item.isNew && item.isDelete)) continue;

                    parameters = new List<SqlParameter>();

                    if (!item.isNew)
                        parameters.Add(new SqlParameter("@InstructionTypeId", item.id));
                    parameters.Add(new SqlParameter("@InstructionType", item.value));
                    parameters.Add(new SqlParameter("@toDelete", item.isDelete));
                    db.ExecSPNonQuery("dbo.spSetInstructionType", parameters);
                }

                foreach (var item in configuration.CurricularUnits)
                {
                    if ((!item.isNew && !item.isChange && !item.isDelete) || (item.isNew && item.isDelete)) continue;

                    parameters = new List<SqlParameter>();

                    if (!item.isNew)
                        parameters.Add(new SqlParameter("@CurricularUnitId", item.id));
                    parameters.Add(new SqlParameter("@CurricularUnit", item.value));
                    parameters.Add(new SqlParameter("@toDelete", item.isDelete));
                    db.ExecSPNonQuery("dbo.spSetCurricularUnit", parameters);
                }
            }

            return true;
        }
    }
}
