using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using API.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using API.Helpers;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            // var query= _context.Users
            // .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            // .AsNoTracking();
            var query = _context.Users.AsQueryable();
            query = query.Where(x => x.UserName != userParams.CurrentUsername);
            query = query.Where(x => x.Gender == userParams.Gender);

            //20 - 30
            //minDob = (Today -30)
            //maxDob = (Today -20)
            //if was born AFTER (today - 30) && BEFORE (today-20) = GOOD!
            var minbDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxbDob = DateTime.Today.AddYears(-userParams.MinAge);

            query = query.Where(x => x.DateOfBirth >= minbDob && x.DateOfBirth <= maxbDob);

            return await PagedList<MemberDto>.CreateAsync
            (
                query.ProjectTo<MemberDto>(_mapper.ConfigurationProvider).AsNoTracking(),
                userParams.PageNumber,
                userParams.PageSize
            );
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
            return await _context.Users
            .Where(x => x.UserName == username)
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUserNameAsync(string username)
        {

            return await _context.Users
            .Include(x => x.Photos) //Eager loading:
            .SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users
            .Include(x => x.Photos)
            .ToListAsync();
        }

        public async Task<bool> SavingAllAsync()
        {
            // var changes=_context.ChangeTracker.Entries<AppUser>().Count();
            // var numOfChanges=await _context.SaveChangesAsync();
            // return numOfChanges==changes;
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            _context.Entry<AppUser>(user).State = EntityState.Modified;
        }
    }
}