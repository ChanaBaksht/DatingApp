using System.Linq;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            //AppUser =>MemberDto
            CreateMap<AppUser, MemberDto>()
            .ForMember(
                dest => dest.PhotoUrl,
                opt =>
                 {
                     opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                 }
            )
            .ForMember(
                dest => dest.Age,
                opt =>
                {
                    opt.MapFrom(src => src.DateOfBirth.CalculateAge());
                }
            );

            //Photo => PhotosDto
            CreateMap<Photo, PhotoDto>();

            //MemberUpdateDTO => AppUser
            CreateMap<MemberUpdateDTO, AppUser>();

            //RegisterDto => AppUser
            CreateMap<RegisterDto, AppUser>();

        }
    }
}