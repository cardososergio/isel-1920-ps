﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Runtime.InteropServices;
using System.Text.Json;
using DataAccess.DAO;

namespace DataAccess.DAL
{
    public static class Global
    {
        public static string connectionString;

        public static User GetUser(string email, int profile)
        {
            var result = new User();

            using (Database db = new Database(connectionString))
            {
                List<SqlParameter> parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter("@Email", email));
                parameters.Add(new SqlParameter("@Profile", profile));

                using (SqlDataReader reader = db.ExecSPDataReader("dbo.spGetUser", parameters))
                {
                    if (reader.HasRows)
                    {
                        reader.Read();

                        result.UserId = reader["UserId"].ToString();
                        result.Name = (string)reader["Name"];
                        result.Email = email;
                        result.Password = (string)reader["Password"];
                        result.Salt = (string)reader["Salt"];
                        result.ProfileId = (int)reader["ProfileId"];
                    }
                }
            }

            return result;
        }

        public static bool SetUser(User user)
        {
            bool result = false;

            using (Database db = new Database(connectionString))
            {
                List<SqlParameter> parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter("@Name", user.Name));
                parameters.Add(new SqlParameter("@Email", user.Email));
                parameters.Add(new SqlParameter("@Password", user.Password));
                parameters.Add(new SqlParameter("@Salt", user.Salt));
                parameters.Add(new SqlParameter("@ProfileId", user.ProfileId));

                var response = (string)db.ExecSPScalar("dbo.spSetUser", parameters);

                result = response == "new_user";
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

    public static class VersionControl
    {
        public static string connectionString;

        public static List<DAO.VersionControl> GetRevisions(string id, string type)
        {
            var result = new List<DAO.VersionControl>();

            string sp = "";

            switch (type)
            {
                case "curricularunit":
                    sp = "spGetCurricularUnitRevisions";
                    break;
                case "curricularyear":
                    sp = "spGetCurricularYearRevisions";
                    break;
                case "semester":
                    sp = "spGetSemesterRevisions";
                    break;
                case "season":
                    sp = "spGetSeasonRevisions";
                    break;
                case "instructiontype":
                    sp = "spGetInstructionTypeRevisions";
                    break;
            }

            using (Database db = new Database(connectionString))
            {
                List<SqlParameter> parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter("@Id", id));

                var dt = db.ExecSPDataTable(string.Concat("dbo.", sp), parameters);

                foreach (DataRow row in dt.Rows)
                    result.Add(new DAO.VersionControl() { Value = (string)row["Value"], Revision = (int)row["Revision"], RevisionDate = (DateTime)row["RevisionDate"], IsDeleted = (bool)row["isDelete"] });
            }

            return result;
        }

        public static int SetRevision(string id, int revision, string type)
        {
            int result;
            string sp = "";

            switch (type)
            {
                case "curricularunit":
                    sp = "spSetCurricularUnitRevisions";
                    break;
                case "curricularyear":
                    sp = "spSetCurricularYearRevisions";
                    break;
                case "semester":
                    sp = "spSetSemesterRevisions";
                    break;
                case "season":
                    sp = "spSetSeasonRevisions";
                    break;
                case "instructiontype":
                    sp = "spSetInstructionTypeRevisions";
                    break;
            }

            using (Database db = new Database(connectionString))
            {
                List<SqlParameter> parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter("@Id", id));
                parameters.Add(new SqlParameter("@Revision", revision));

                result = (int)db.ExecSPScalar(string.Concat("dbo.", sp), parameters);
            }

            return result;
        }
    }
}
