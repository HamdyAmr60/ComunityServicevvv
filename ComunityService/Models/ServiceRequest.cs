using ComunityService.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public enum ServiceStatus
{
    InProgress,
    Completed,
    Cancelled
}

public class ServiceRequest
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Title { get; set; }

    public string Description { get; set; }

    [Required]
    public string RequesterId { get; set; } // Foreign key to ApplicationUser

    [ForeignKey("RequesterId")]
    public ApplicationUser Requester { get; set; }

    public ServiceStatus Status { get; set; } = ServiceStatus.InProgress;

    public string? CancelReason { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int? CategoryId { get; set; }
    
    [ForeignKey("CategoryId")]
    public ServiceRequestCategory? Category { get; set; }
}