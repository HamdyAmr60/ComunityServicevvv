// Controllers/AuthController.cs
using ComunityService.DTOs;
using ComunityService.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;

    public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            FullName = model.FullName,
            NationalId = model.NationalId,
            City = model.City,
            PhoneNumber = model.PhoneNumber
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description);
            return BadRequest(new { Errors = errors });
        }

        // Always assign "User" role
        await _userManager.AddToRoleAsync(user, "User");

        // TODO: Send email verification
        return Ok("Registration successful. Please verify your email.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
            return Unauthorized("Invalid credentials.");

        var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
        if (!result.Succeeded)
            return Unauthorized("Invalid credentials.");

        
        var token = await CreateToken(user, _userManager);

        return Ok(new { 
            Token = token,
            ExpiresIn = DateTime.Now.AddDays(double.Parse(_configuration["JWT:Duration"])),
            UserId = user.Id,
            Roles = await _userManager.GetRolesAsync(user)
        });
    }


    private async Task<string> CreateToken(ApplicationUser User, UserManager<ApplicationUser> manager)
    {
        var AuthClaims = new List<Claim>
            {
                
                new Claim(ClaimTypes.Email , User.Email),
                new Claim(ClaimTypes.MobilePhone , User.PhoneNumber),
            };
        var UserRoles = await manager.GetRolesAsync(User);
        foreach (var UserRole in UserRoles)
        {
            AuthClaims.Add(new Claim(ClaimTypes.Role, UserRole));
        }
        var Key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]));
        var Token = new JwtSecurityToken(
            issuer: _configuration["JWT:Issuer"],
            audience: _configuration["JWT:Aud"],
            expires: DateTime.Now.AddDays(double.Parse(_configuration["JWT:Duration"])),
            claims: AuthClaims,
            signingCredentials: new SigningCredentials(Key, SecurityAlgorithms.HmacSha256Signature)
            );

        return new JwtSecurityTokenHandler().WriteToken(Token);
    }
}