using DataAccess.DAL;
using DataAccess.DAO;
using System;
using System.IO;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace TestingFunctions
{
    class Program
    {
        public static object StringCipher { get; private set; }

        static void Main(string[] args)
        {
            var dataKey = "AW2Q7XDHQY6E/eChGUx/xntojuBogcSG5gaBxbnEhFljClWuemTMaeYlBLtWVJ9AYYFsovSZcuQYL5lC4CEUaNIGw+KSoMP+NEMfxsSI2d1U+M60Gcf1wXnbDEQ9G7c3Cp1lFfvZ8CUVPWX0kbIiUrF6xGoim0RvkvD/JkH5YZiR3taUG4TBGes67CV0a4y+b2Y0gAoukjaHrXP1V3Rfm45C74P17LOm8xz4OmbPnFC0fW346jZVLxNi+Sbe/IsNrjYxeaQj0l26kntPJUwlN6O4z2OFGdMAT/2xY+Q5Q/P5vFyjXHO5EnaLv4MIhfMtZlMQMbwl3AP6MZSbFlyE+g==";
            var dataXml = "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";

            var certificate = GetCertificate();

            using (var rsa = certificate.GetRSAPrivateKey())
            {
                var dataBytes = Convert.FromBase64String(dataKey);
                //var decryptedBytes = rsa.DecryptValue(dataBytes);
                var decryptedBytes = rsa.Decrypt(dataBytes, RSAEncryptionPadding.OaepSHA1);

                var secretKey = Convert.ToBase64String(decryptedBytes);

                string decryptedstring = Decrypt(Convert.FromBase64String(dataXml), decryptedBytes);

                string result = decryptedstring.Substring(16, decryptedstring.Length-20);
                Console.WriteLine(result);
            }

            /*Configuration result;
            Management.connectionString = "Server=.;Database=PEES;Trusted_Connection=True;";

            try
            {
                result = Management.GetConfiguration();
            }
            catch (Exception)
            {
                throw;
            }*/

            /*string salt = "rVHVy/tQ1m1eM3S5OA1hhQ==";// CreateSalt();
            Console.WriteLine(salt);
            Console.WriteLine(CreatePasswordHash("cardoso.sergio@outlook.com", salt));*/
        }

        static string Decrypt(byte[] cipherText, byte[] Key)
        {
            string plaintext = null;
            byte[] iv = new byte[16];

            // Create AesManaged    
            using (AesManaged aes = new AesManaged())
            {
                aes.Padding = PaddingMode.None;

                // Create a decryptor    
                ICryptoTransform decryptor = aes.CreateDecryptor(Key, iv);

                // Create the streams used for decryption.    
                using (MemoryStream ms = new MemoryStream(cipherText))
                {
                    // Create crypto stream    
                    using (CryptoStream cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                    {
                        // Read crypto stream    
                        using (StreamReader reader = new StreamReader(cs))
                            plaintext = reader.ReadToEnd();
                    }
                }
            }
            return plaintext;
        }

        private static X509Certificate2 GetCertificate()
        {
            var certificate = new X509Certificate2("C:\\Users\\Sergio\\Downloads\\certificateskeys-AppCertificate-20200415.pfx");
            return certificate;
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
