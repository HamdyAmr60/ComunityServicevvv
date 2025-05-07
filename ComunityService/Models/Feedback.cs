using ComunityService.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Feedback
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int ServiceRequestId { get; set; }

    [ForeignKey("ServiceRequestId")]
    public ServiceRequest ServiceRequest { get; set; }

    [Required]
    public string AuthorId { get; set; }

    [ForeignKey("AuthorId")]
    public ApplicationUser Author { get; set; }

    [Required]
    [Range(1, 5)]
    public int Rating { get; set; } // 1 to 5 stars

    [MaxLength(1000)]
    public string Comment { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}