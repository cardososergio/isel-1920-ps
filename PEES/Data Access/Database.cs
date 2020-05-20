using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess
{
    public class Database : IDisposable
    {
        private readonly SqlConnection conn;

        public Database()
        {
            if (conn == null) conn = new SqlConnection();
        }

        public Database(string connectionString)
        {
            if (conn == null) conn = new SqlConnection(connectionString);
        }

        public DataSet ExecSPDataSet(string sp, List<SqlParameter> parameters = null)
        {
            DataSet result = new DataSet();

            try
            {
                // Check if closed, then open it
                if (conn.State == ConnectionState.Closed) conn.Open();

                SqlCommand Cmd = new SqlCommand(sp, conn);
                Cmd.CommandType = CommandType.StoredProcedure;
                if (parameters != null) Cmd.Parameters.AddRange(parameters.ToArray());

                SqlDataAdapter da = new SqlDataAdapter(Cmd);
                da.Fill(result);
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                if (conn.State == ConnectionState.Open) conn.Close();
            }

            return result;
        }

        public DataTable ExecSPDataTable(string sp, List<SqlParameter> parameters = null)
        {
            DataTable Result = new DataTable();

            try
            {
                // Check if closed, then open it
                if (conn.State == ConnectionState.Closed) conn.Open();

                SqlCommand Cmd = new SqlCommand(sp, conn);
                Cmd.CommandType = CommandType.StoredProcedure;
                if (parameters != null) Cmd.Parameters.AddRange(parameters.ToArray());

                SqlDataAdapter da = new SqlDataAdapter(Cmd);
                da.Fill(Result);
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                if (conn.State == ConnectionState.Open) conn.Close();
            }

            return Result;
        }

        public SqlDataReader ExecSPDataReader(string sp, List<SqlParameter> parameters = null)
        {
            SqlDataReader Result;

            try
            {
                // Check if closed, then open it
                if (conn.State == ConnectionState.Closed) conn.Open();

                SqlCommand Cmd = new SqlCommand(sp, conn);
                Cmd.CommandType = CommandType.StoredProcedure;
                if (parameters != null) Cmd.Parameters.AddRange(parameters.ToArray());

                Result = Cmd.ExecuteReader();
            }
            catch (Exception)
            {
                throw;
            }

            return Result;
        }

        public void ExecSPNonQuery(string sp, List<SqlParameter> parameters)
        {
            try
            {
                // Check if closed, then open it
                if (conn.State == ConnectionState.Closed) conn.Open();

                SqlCommand Cmd = new SqlCommand(sp, conn);
                Cmd.CommandType = CommandType.StoredProcedure;
                Cmd.Parameters.AddRange(parameters.ToArray());

                Cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                if (conn.State == ConnectionState.Open) conn.Close();
            }
        }

        public object ExecSPScalar(string sp, List<SqlParameter> parameters)
        {
            object result;

            try
            {
                // Check if closed, then open it
                if (conn.State == ConnectionState.Closed) conn.Open();

                SqlCommand Cmd = new SqlCommand(sp, conn);
                Cmd.CommandType = CommandType.StoredProcedure;
                Cmd.Parameters.AddRange(parameters.ToArray());

                result = Cmd.ExecuteScalar();
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                if (conn.State == ConnectionState.Open) conn.Close();
            }

            return result;
        }

        #region "dispose"

        private bool disposed = false;

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    if (conn.State != ConnectionState.Closed) conn.Close();

                    conn.Dispose();
                }
            }
            disposed = true;
        }

        #endregion
    }
}
