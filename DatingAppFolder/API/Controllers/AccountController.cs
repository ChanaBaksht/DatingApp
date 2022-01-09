using System.Security.Cryptography;
using API.Entities;
using API.Data;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        public AccountController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AppUser>> Register(RegisterDto registerDto)
        {
            using var hmac = new HMACSHA512();

            var user = new AppUser
            {
                UserName = registerDto.Username.ToLower(),
                PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();
            return user;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AppUser>> Login(LoginDto loginDto)
        {
            var user = await this._context.Users.SingleOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());
            if (user == null) return Unauthorized("Invalid userName");

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash=hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(loginDto.Password));
            
            for(int i=0;i<computedHash.Length;i++){
                if(computedHash[i]!=user.PasswordHash[i]) return Unauthorized("Invalid password");
            }
            
            return user;
        }


         private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
        }
    }

}