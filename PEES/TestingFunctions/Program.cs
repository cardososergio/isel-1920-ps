using System;
using System.Security.Cryptography;
using System.Text;

namespace TestingFunctions
{
    class Program
    {
        static void Main(string[] args)
        {
            string salt = "rVHVy/tQ1m1eM3S5OA1hhQ==";// CreateSalt();
            Console.WriteLine(salt);
            Console.WriteLine(CreatePasswordHash("cardoso.sergio@outlook.com", salt));
        }

        public static string CreateSalt()
        {
            byte[] salt;
            new RNGCryptoServiceProvider().GetBytes(salt = new byte[16]);

            return Convert.ToBase64String(salt);
        }

        public static string CreatePasswordHash(string pwd, string salt)
        {
            return Convert.ToBase64String(new Rfc2898DeriveBytes(Encoding.ASCII.GetBytes(pwd), Convert.FromBase64String(salt), 1000).GetBytes(20));
        }
    }
}
