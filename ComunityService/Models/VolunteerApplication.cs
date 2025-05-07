using ComunityService.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public enum VolunteerApplicationStatus
{
    Pending,
    Accepted,
    Rejected
}

public class VolunteerApplication
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int ServiceRequestId { get; set; }

    [ForeignKey("ServiceRequestId")]
    public ServiceRequest ServiceRequest { get; set; }

    [Required]
    public string VolunteerId { get; set; }

    [ForeignKey("VolunteerId")]
    public ApplicationUser Volunteer { get; set; }

    public VolunteerApplicationStatus Status { get; set; } = VolunteerApplicationStatus.Pending;

    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
}