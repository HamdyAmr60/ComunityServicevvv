using ComunityService.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }




    public DbSet<ServiceRequestCategory> ServiceRequestCategories { get; set; }
    public DbSet<ServiceRequest> ServiceRequests { get; set; }
    public DbSet<VolunteerApplication> VolunteerApplications { get; set; }
    public DbSet<Donation> Donations { get; set; }
    public DbSet<Feedback> Feedbacks { get; set; }

}