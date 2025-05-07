using ComunityService.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Donation
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int ServiceRequestId { get; set; }

    [ForeignKey("ServiceRequestId")]
    public ServiceRequest ServiceRequest { get; set; }

    [Required]
    public string DonorId { get; set; }

    [ForeignKey("DonorId")]
    public ApplicationUser Donor { get; set; }

    [Required]
    [Range(1, double.MaxValue, ErrorMessage = "Amount must be positive.")]
    public decimal Amount { get; set; }

    public DateTime DonatedAt { get; set; } = DateTime.UtcNow;
}