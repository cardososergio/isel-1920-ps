using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace PEES.Classes
{
    public class Utils
    {
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
