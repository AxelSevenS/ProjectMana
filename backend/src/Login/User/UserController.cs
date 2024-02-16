using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;


namespace ProjectMana;

[ApiController]
[Route("api/users")]
public class UserController(AppDbContext repo, JwtOptions jwtOptions) : Controller<User>(repo)
{
	/// <summary>
	/// Get all users
	/// </summary>
	/// <returns>
	/// All users
	/// </returns>
	[HttpGet]
	public async Task<List<User>> GetAll() =>
		await repository.Users.ToListAsync();

	/// <summary>
	/// Get a user by id
	/// </summary>
	/// <param name="id">The id of the user</param>
	/// <returns>
	/// The user with the given id
	/// </returns>
	[HttpGet("{id}")]
	public async Task<ActionResult<User>> GetById(uint id) =>
		await repository.Users.FindAsync(id) switch
		{
			User user => Ok(user),
			null => NotFound(),
		};

	/// <summary>
	/// Authenticate a user
	/// </summary>
	/// <param name="username">The username of the user</param>
	/// <param name="password">The password of the user</param>
	/// <returns>
	/// The JWT token of the user,
	///     or NotFound if the user does not exist
	/// </returns>
	[HttpPost("auth")]
	public async Task<ActionResult> AuthenticateUser([FromForm]string username, [FromForm]string password)
	{
		password = jwtOptions.HashPassword(password);
		return await repository.Users.FirstOrDefaultAsync(u => u.Username == username && u.Password == password) switch
		{
			User user => Ok( JsonSerializer.Serialize(jwtOptions.GenerateFrom(user).Write()) ),
			null => NotFound(),
		};
	}

	/// <summary>
	/// Register a user
	/// </summary>
	/// <param name="username">The username of the user</param>
	/// <param name="password">The password of the user</param>
	/// <returns>
	/// The user,
	///    or BadRequest if the user already exists
	/// </returns>
	[HttpPut]
	public ActionResult<User> RegisterUser([FromForm]string username, [FromForm]string password)
	{
		EntityEntry<User>? result = repository.Users.Add(
			new()
			{
				Username = username,
				Password = jwtOptions.HashPassword(password)
			}
		);

		if (result.Entity is not User user)
		{
			return BadRequest();
		}

		repository.SaveChanges();
		return Ok(user);
	}

	/// <summary>
	/// Update a user
	/// </summary>
	/// <param name="id">The id of the user</param>
	/// <param name="user">The user to update</param>
	/// <returns>
	/// The updated user
	/// </returns>
	[HttpPatch("{id}")]
	[Authorize]
	public async Task<ActionResult<User>> UpdateUser(uint id, [FromForm] string? username, [FromForm] string? password, [FromForm] User.Authorizations? roles)
	{
		if (username is null && password is null && roles is null)
		{
			return BadRequest();
		}

		if ( ! VerifyOwnershipOrAuthZ(id, ProjectMana.User.Authorizations.EditAnyUser, out ActionResult<User> error))
		{
			return error;
		}

		User? user = await repository.Users.FindAsync(id);
		if ( user is null )
		{
			return NotFound();
		}

		user.Username = username ?? user.Username;
		user.Password = password is not null ? jwtOptions.HashPassword(password) : user.Password;

		if ( roles is User.Authorizations auth && VerifyAuthorization(ProjectMana.User.Authorizations.EditUserAuths | auth) ) {
			user.Auth = auth;
		}

		repository.SaveChanges();
		return Ok(user);
	}

	/// <summary>
	/// Update a user's authorizations
	/// </summary>
	/// <param name="id">The id of the user</param>
	/// <param name="user">The user to update</param>
	/// <returns>
	/// The updated user
	/// </returns>
	[HttpPut("auths/{id}")]
	[Authorize]
	public async Task<ActionResult<User>> UpdateUserAuths(uint id, [FromForm] User.Authorizations authorizations)
	{
		if ( ! VerifyOwnershipOrAuthZ(id, authorizations | ProjectMana.User.Authorizations.EditUserAuths, out ActionResult<User> error))
			// Cannot give authorizations you do not have;
			// in principle, someone who can edit auths will be Admin (and as such, have all rights), but we check just in case.
		{
			return error;
		}

		User? current = await repository.Users.FindAsync(id);
		if ( current is null )
		{
			return NotFound();
		}
		current.Auth = authorizations;

		repository.SaveChanges();
		return Ok(current);
	}

	/// <summary>
	/// Delete a user
	/// </summary>
	/// <param name="id">The id of the user</param>
	/// <returns>
	/// The deleted user
	/// </returns>
	[HttpDelete("{id}")]
	[Authorize]
	public async Task<ActionResult<User>> DeleteUser(uint id)
	{
		if ( ! VerifyOwnershipOrAuthZ(id, ProjectMana.User.Authorizations.DeleteAnyUser, out ActionResult<User> error))
		{
			return error;
		}

		User? current = await repository.Users.FindAsync(id);
		if ( current is null )
		{
			return NotFound();
		}

		EntityEntry<User> deleted = repository.Users.Remove(current);

		repository.SaveChanges();
		return Ok(deleted.Entity);
	}
}