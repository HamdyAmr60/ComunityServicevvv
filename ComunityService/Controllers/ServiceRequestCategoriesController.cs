using ComunityService.DTOs;
using ComunityService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ServiceRequestCategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ServiceRequestCategoriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Get all categories (available to all users)
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _context.ServiceRequestCategories.ToListAsync();
        return Ok(categories);
    }

    // Add new category (Admin only)
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateServiceRequestCategoryDto dto)
    {
        var category = new ServiceRequestCategory
        {
            Name = dto.Name,
            Description = dto.Description
        };

        _context.ServiceRequestCategories.Add(category);
        await _context.SaveChangesAsync();
        return Ok(category);
    }

    // Update category (Admin only)
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateServiceRequestCategoryDto dto)
    {
        var category = await _context.ServiceRequestCategories.FindAsync(id);
        if (category == null) return NotFound();

        category.Name = dto.Name;
        category.Description = dto.Description;

        await _context.SaveChangesAsync();
        return Ok(category);
    }

    // Delete category (Admin only)
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _context.ServiceRequestCategories.FindAsync(id);
        if (category == null) return NotFound();

        _context.ServiceRequestCategories.Remove(category);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}