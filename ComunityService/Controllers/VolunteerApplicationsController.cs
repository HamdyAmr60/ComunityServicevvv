using ComunityService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class VolunteerApplicationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public VolunteerApplicationsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // Volunteer applies to a service request
    [HttpPost]
    [Authorize(Roles = "Volunteer")]
    public async Task<IActionResult> Apply([FromBody] CreateVolunteerApplicationDto dto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        // Check if already applied
        var exists = await _context.VolunteerApplications
            .AnyAsync(a => a.ServiceRequestId == dto.ServiceRequestId && a.VolunteerId == userId);
        if (exists)
            return BadRequest("You have already applied to this service request.");

        // Check if service request exists and is in progress
        var serviceRequest = await _context.ServiceRequests.FindAsync(dto.ServiceRequestId);
        if (serviceRequest == null || serviceRequest.Status != ServiceStatus.InProgress)
            return BadRequest("Service request not found or not open for applications.");

        var application = new VolunteerApplication
        {
            ServiceRequestId = dto.ServiceRequestId,
            VolunteerId = userId
        };
        _context.VolunteerApplications.Add(application);
        await _context.SaveChangesAsync();
        return Ok(application);
    }

    // Get all applications for a service request (Requester or Admin)
    [HttpGet("by-request/{serviceRequestId}")]
    [Authorize]
    public async Task<IActionResult> GetByServiceRequest(int serviceRequestId)
    {
        var serviceRequest = await _context.ServiceRequests.FindAsync(serviceRequestId);
        if (serviceRequest == null) return NotFound();

        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var isAdmin = User.IsInRole("Admin");

        if (serviceRequest.RequesterId != userId && !isAdmin)
            return Forbid();

        var applications = await _context.VolunteerApplications
            .Include(a => a.Volunteer)
            .Where(a => a.ServiceRequestId == serviceRequestId)
            .ToListAsync();

        return Ok(applications);
    }

    // Get all applications by the current volunteer
    [HttpGet("my-applications")]
    [Authorize(Roles = "Volunteer")]
    public async Task<IActionResult> GetMyApplications()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var applications = await _context.VolunteerApplications
            .Include(a => a.ServiceRequest)
            .Where(a => a.VolunteerId == userId)
            .ToListAsync();

        return Ok(applications);
    }

    // Update application status (Requester or Admin)
    [HttpPut("{id}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateVolunteerApplicationStatusDto dto)
    {
        var application = await _context.VolunteerApplications
            .Include(a => a.ServiceRequest)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (application == null) return NotFound();

        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var isAdmin = User.IsInRole("Admin");

        if (application.ServiceRequest.RequesterId != userId && !isAdmin)
            return Forbid();

        application.Status = dto.Status;
        await _context.SaveChangesAsync();
        return Ok(application);
    }

    [HttpGet("statistics")]
    [Authorize]
    public async Task<IActionResult> GetStatistics()
    {
        var totalApplications = await _context.VolunteerApplications.CountAsync();
        var acceptedApplications = await _context.VolunteerApplications
            .CountAsync(a => a.Status == VolunteerApplicationStatus.Accepted);
        var pendingApplications = await _context.VolunteerApplications
            .CountAsync(a => a.Status == VolunteerApplicationStatus.Pending);
        var rejectedApplications = await _context.VolunteerApplications
            .CountAsync(a => a.Status == VolunteerApplicationStatus.Rejected);

        return Ok(new
        {
            TotalApplications = totalApplications,
            AcceptedApplications = acceptedApplications,
            PendingApplications = pendingApplications,
            RejectedApplications = rejectedApplications,
            AcceptanceRate = totalApplications > 0 ? (double)acceptedApplications / totalApplications * 100 : 0
        });
    }

    [HttpGet("top-volunteers")]
    [Authorize]
    public async Task<IActionResult> GetTopVolunteers([FromQuery] int limit = 10)
    {
        var topVolunteers = await _context.VolunteerApplications
            .Where(a => a.Status == VolunteerApplicationStatus.Accepted)
            .GroupBy(a => a.VolunteerId)
            .Select(g => new
            {
                VolunteerId = g.Key,
                CompletedServices = g.Count(),
                Volunteer = g.First().Volunteer
            })
            .OrderByDescending(v => v.CompletedServices)
            .Take(limit)
            .ToListAsync();

        return Ok(topVolunteers);
    }
}