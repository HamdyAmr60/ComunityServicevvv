using ComunityService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class DonationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public DonationsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // Donor makes a donation to a service request
    [HttpPost]
    [Authorize(Roles = "Donor")]
    public async Task<IActionResult> Donate([FromBody] CreateDonationDto dto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        // Check if service request exists and is in progress
        var serviceRequest = await _context.ServiceRequests.FindAsync(dto.ServiceRequestId);
        if (serviceRequest == null || serviceRequest.Status != ServiceStatus.InProgress)
            return BadRequest("Service request not found or not open for donations.");

        if (dto.Amount <= 0)
            return BadRequest("Donation amount must be positive.");

        var donation = new Donation
        {
            ServiceRequestId = dto.ServiceRequestId,
            DonorId = userId,
            Amount = dto.Amount
        };
        _context.Donations.Add(donation);
        await _context.SaveChangesAsync();
        return Ok(donation);
    }

    // Get all donations for a service request (Requester or Admin)
    [HttpGet("by-request/{serviceRequestId}")]
    public async Task<IActionResult> GetByServiceRequest(int serviceRequestId)
    {
        var serviceRequest = await _context.ServiceRequests.FindAsync(serviceRequestId);
        if (serviceRequest == null) return NotFound();

        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var isAdmin = User.IsInRole("Admin");

        if (serviceRequest.RequesterId != userId && !isAdmin)
            return Forbid();

        var donations = await _context.Donations
            .Include(d => d.Donor)
            .Where(d => d.ServiceRequestId == serviceRequestId)
            .ToListAsync();

        return Ok(donations);
    }

    // Get all donations by the current donor
    [HttpGet("my-donations")]
    public async Task<IActionResult> GetMyDonations()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var donations = await _context.Donations
            .Include(d => d.ServiceRequest)
            .Where(d => d.DonorId == userId)
            .ToListAsync();

        return Ok(donations);
    }

    // Admin: Get all donations
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var donations = await _context.Donations
            .Include(d => d.Donor)
            .Include(d => d.ServiceRequest)
            .ToListAsync();

        return Ok(donations);
    }

    [HttpGet("statistics")]
    public async Task<IActionResult> GetStatistics()
    {
        var totalDonations = await _context.Donations.CountAsync();
        var totalAmount = await _context.Donations.SumAsync(d => d.Amount);
        var averageDonation = totalDonations > 0 ? totalAmount / totalDonations : 0;
        var uniqueDonors = await _context.Donations.Select(d => d.DonorId).Distinct().CountAsync();

        return Ok(new
        {
            TotalDonations = totalDonations,
            TotalAmount = totalAmount,
            AverageDonation = averageDonation,
            UniqueDonors = uniqueDonors
        });
    }

    [HttpGet("top-donors")]
    public async Task<IActionResult> GetTopDonors([FromQuery] int limit = 10)
    {
        var topDonors = await _context.Donations
            .GroupBy(d => d.DonorId)
            .Select(g => new
            {
                DonorId = g.Key,
                TotalAmount = g.Sum(d => d.Amount),
                DonationCount = g.Count(),
                Donor = g.First().Donor
            })
            .OrderByDescending(d => d.TotalAmount)
            .Take(limit)
            .ToListAsync();

        return Ok(topDonors);
    }
}