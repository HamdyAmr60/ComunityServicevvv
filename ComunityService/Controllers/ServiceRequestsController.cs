using ComunityService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ServiceRequestsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public ServiceRequestsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // Create a new service request
    [HttpPost]
    public async Task<IActionResult> CreateServiceRequest([FromBody] CreateServiceRequestDto dto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var request = new ServiceRequest
        {
            Title = dto.Title,
            Description = dto.Description,
            RequesterId = userId,
            CategoryId = dto.CategoryId
        };
        _context.ServiceRequests.Add(request);
        await _context.SaveChangesAsync();
        return Ok(request);
    }

    // Get all service requests
    [HttpGet("all")]
    public async Task<IActionResult> GetAll()
    {
        var requests = await _context.ServiceRequests
            .Include(r => r.Requester)
            .Include(r => r.Category)  // Add this line
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
        return Ok(requests);
    }

    // Get a single service request by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var request = await _context.ServiceRequests
            .Include(r => r.Requester)
            .FirstOrDefaultAsync(r => r.Id == id);
        if (request == null) return NotFound();
        return Ok(request);
    }

    // Update status
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateServiceRequestStatusDto dto)
    {
        var request = await _context.ServiceRequests.FindAsync(id);
        if (request == null) return NotFound();

        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var isAdmin = User.IsInRole("Admin");

        // Only the requester or admin can update
        if (request.RequesterId != userId && !isAdmin)
            return Forbid();

        if (dto.Status == ServiceStatus.Cancelled && string.IsNullOrWhiteSpace(dto.CancelReason))
            return BadRequest("Cancel reason is required.");

        request.Status = dto.Status;
        request.CancelReason = dto.Status == ServiceStatus.Cancelled ? dto.CancelReason : null;
        await _context.SaveChangesAsync();
        return Ok(request);
    }

    // Admin: Update service request status
    [HttpPut("{id}/admin-status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatusAdmin(int id, [FromBody] UpdateServiceRequestStatusDto dto)
    {
        var request = await _context.ServiceRequests.FindAsync(id);
        if (request == null) return NotFound();

        if (dto.Status == ServiceStatus.Cancelled && string.IsNullOrWhiteSpace(dto.CancelReason))
            return BadRequest("Cancel reason is required.");

        request.Status = dto.Status;
        request.CancelReason = dto.Status == ServiceStatus.Cancelled ? dto.CancelReason : null;
        await _context.SaveChangesAsync();
        return Ok(request);
    }

    // Delete a service request (Admin only)
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var request = await _context.ServiceRequests.FindAsync(id);
        if (request == null) return NotFound();
        _context.ServiceRequests.Remove(request);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetByStatus([FromQuery] ServiceStatus? status)
    {
        var query = _context.ServiceRequests
            .Include(r => r.Requester)
            .AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(r => r.Status == status.Value);
        }

        var requests = await query
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return Ok(requests);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeaturedRequests()
    {
        var featuredRequests = await _context.ServiceRequests
            .Include(r => r.Requester)
            .Where(r => r.Status == ServiceStatus.InProgress)
            .OrderByDescending(r => r.CreatedAt)
            .Take(6)
            .ToListAsync();

        return Ok(featuredRequests);
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.ServiceRequests
            .Select(r => r.Category)
            .Distinct()
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("statistics")]
    public async Task<IActionResult> GetStatistics()
    {
        var totalRequests = await _context.ServiceRequests.CountAsync();
        var completedRequests = await _context.ServiceRequests
            .CountAsync(r => r.Status == ServiceStatus.Completed);
        var inProgressRequests = await _context.ServiceRequests
            .CountAsync(r => r.Status == ServiceStatus.InProgress);
        var cancelledRequests = await _context.ServiceRequests
            .CountAsync(r => r.Status == ServiceStatus.Cancelled);

        return Ok(new
        {
            TotalRequests = totalRequests,
            CompletedRequests = completedRequests,
            InProgressRequests = inProgressRequests,
            CancelledRequests = cancelledRequests,
            CompletionRate = totalRequests > 0 ? (double)completedRequests / totalRequests * 100 : 0
        });
    }
}