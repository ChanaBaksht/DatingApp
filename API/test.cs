using System;
using System.Collections.ObjectModel;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace API.Data
{
    public class UserTest
    {
        public string UserNameT { get; set; }
        public byte[] PasswordHashT { get; set; }
        public byte[] PasswordSaltT { get; set; }

    }
    public class test
    {
        public static void SeedUsers()
        {
            Collection<string> usersName = new Collection<string>(){
                "gili","galit","gal","golda","jeni","gidon","gil","joe", "jermi","joni"
            };

            Collection<UserTest> usersTest = new Collection<UserTest>();

            foreach (var user in usersName)
            {
                using var hmac = new HMACSHA512();
                UserTest userToAdd = new UserTest();
                userToAdd.UserNameT = user.ToLower();
                userToAdd.PasswordHashT = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));
                userToAdd.PasswordSaltT = hmac.Key;

                usersTest.Add(userToAdd);
            }
            int i = 1;
            foreach (UserTest user in usersTest)
            {
                Console.WriteLine($"({++i},{user.UserNameT},{user.PasswordHashT},{user.PasswordSaltT}, )");
            }

        }
    }
}