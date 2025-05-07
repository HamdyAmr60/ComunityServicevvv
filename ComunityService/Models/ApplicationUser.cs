using Microsoft.AspNetCore.Identity;

namespace ComunityService.Models
{
    public class ApplicationUser: IdentityUser
    {
        public string FullName { get; set; }
        public string NationalId { get; set; }
        public string City { get; set; }
    }
}

