using Microsoft.Azure.KeyVault;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.KeyVault.WebKey;
using AuthenticationContext = Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext;

namespace PEES.Classes
{
    public class Utils
    {
        public static string keyIdentifier;
        public static string clientId;
        public static string clientSecret;

        private static KeyVaultClient kvc;

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

        public static byte[] DecryptKey(byte[] encKey)
        {
            if (kvc == null) kvc = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(GetToken));

            var rr = kvc.DecryptAsync(keyIdentifier, JsonWebKeyEncryptionAlgorithm.RSAOAEP, encKey).GetAwaiter().GetResult();
            return rr.Result;
        }

        public static string EncryptKey(byte[] key)
        {
            if (kvc == null) kvc = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(GetToken));

            var rr = kvc.EncryptAsync(keyIdentifier, JsonWebKeyEncryptionAlgorithm.RSAOAEP, key).GetAwaiter().GetResult();
            return Convert.ToBase64String(rr.Result);
        }

        private static async Task<string> GetToken(string authority, string resource, string scope)
        {
            var authContext = new AuthenticationContext(authority);
            ClientCredential clientCred = new ClientCredential(clientId, clientSecret);
            AuthenticationResult result = await authContext.AcquireTokenAsync(resource, clientCred);

            if (result == null)
                throw new InvalidOperationException("Failed to obtain the JWT token");

            return result.AccessToken;
        }
    }
}
