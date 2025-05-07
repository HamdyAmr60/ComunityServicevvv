//using ComunityService.Models;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;

//[ApiController]
//[Route("api/[controller]")]
//public class FeedbackController : ControllerBase
//{
//    private readonly ApplicationDbContext _context;
//    private readonly UserManager<ApplicationUser> _userManager;

//    public FeedbackController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
//    {
//        _context = context;
//        _userManager = userManager;
//    }

//    // Leave feedback on a completed service request
//    [HttpPost]
//    [Authorize]
//    public async Task<IActionResult> LeaveFeedback([FromBody] CreateFeedbackDto dto)
//    {
//        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

//        // Check if service request exists and is completed
//        var serviceRequest = await _context.ServiceRequests.FindAsync(dto.ServiceRequestId);
//        if (serviceRequest == null || serviceRequest.Status != ServiceStatus.Completed)
//            return BadRequest("Service request not found or not completed.");

//        // Prevent duplicate feedback from the same user for the same request
//        var exists = await _context.Feedbacks
//            .AnyAsync(f => f.ServiceRequestId == dto.ServiceRequestId && f.AuthorId == userId);
//        if (exists)
//            return BadRequest("You have already left feedback for this service request.");

//        var feedback = new Feedback
//        {
//            ServiceRequestId = dto.ServiceRequestId,
//            AuthorId = userId,
//            Rating = dto.Rating,
//            Comment = dto.Comment
//        };
//        _context.Feedbacks.Add(feedback);
//        await _context.SaveChangesAsync();
//        return Ok(feedback);
//    }

//    // Get all feedback for a service request (any authenticated user)
//    [HttpGet("by-request/{serviceRequestId}")]
//    [Authorize]
//    public async Task<IActionResult> GetByServiceRequest(int serviceRequestId)
//    {
//        var feedbacks = await _context.Feedbacks
//            .Include(f => f.Author)
//            .Where(f => f.ServiceRequestId == serviceRequestId)
//            .OrderByDescending(f => f.CreatedAt)
//            .ToListAsync();

//        return Ok(feedbacks);
//    }

//    // Admin: Get all feedback
//    [HttpGet]
//    [Authorize(Roles = "Admin")]
//    public async Task<IActionResult> GetAll()
//    {
//        var feedbacks = await _context.Feedbacks
//            .Include(f => f.Author)
//            .Include(f => f.ServiceRequest)
//            .OrderByDescending(f => f.CreatedAt)
//            .ToListAsync();

//        return Ok(feedbacks);
//    }

//    [HttpGet("testimonials")]
//    [Authorize]
//    public async Task<IActionResult> GetTestimonials([FromQuery] int limit = 6)
//    {
//        var testimonials = await _context.Feedbacks
//            .Include(f => f.Author)
//            .Include(f => f.ServiceRequest)
//            .Where(f => f.Rating >= 4) // Only high-rated feedback
//            .OrderByDescending(f => f.CreatedAt)
//            .Take(limit)
//            .Select(f => new
//            {
//                f.Id,
//                AuthorName = f.Author.FullName,
//                AuthorRole = f.Author.Roles.FirstOrDefault(),
//                Content = f.Comment,
//                Rating = f.Rating,
//                ServiceRequestTitle = f.ServiceRequest.Title,
//                Date = f.CreatedAt
//            })
//            .ToListAsync();

//        return Ok(testimonials);
//    }

//    [HttpGet("statistics")]
//    [Authorize]
//    public async Task<IActionResult> GetStatistics()
//    {
//        var totalFeedback = await _context.Feedbacks.CountAsync();
//        var averageRating = await _context.Feedbacks.AverageAsync(f => f.Rating);
//        var ratingDistribution = await _context.Feedbacks
//            .GroupBy(f => f.Rating)
//            .Select(g => new
//            {
//                Rating = g.Key,
//                Count = g.Count(),
//                Percentage = (double)g.Count() / totalFeedback * 100
//            })
//            .OrderBy(r => r.Rating)
//            .ToListAsync();

//        return Ok(new
//        {
//            TotalFeedback = totalFeedback,
//            AverageRating = averageRating,
//            RatingDistribution = ratingDistribution
//        });
//    }
//}