using ComunityService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = _userManager.Users.ToList();
        var userDtos = new List<object>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userDtos.Add(new
            {
                user.Id,
                user.Email,
                user.FullName,
                user.NationalId,
                user.City,
                user.PhoneNumber,
                Roles = roles
            });
        }

        return Ok(userDtos);
    }

    [HttpPut("{userId}/promote")]
    public async Task<IActionResult> PromoteToAdmin(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound("User not found");

        var result = await _userManager.AddToRoleAsync(user, "Admin");
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok("User promoted to admin successfully");
    }
} 