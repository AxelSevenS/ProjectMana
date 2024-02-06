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
            User user => Ok( jwtOptions.GenerateFrom(user).Write() ),
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
    [HttpPut("{id}")]
	[Authorize]
    public async Task<ActionResult<User>> UpdateUser(uint id, [FromForm] User user)
    {
		if (
			! VerifyAuthenticatedId(id) && 
			! VerifyAuthorization(ProjectMana.User.Authorizations.EditAnyUser)
		)
		{
			return NotFound(); // 404 to avoid giving too much information.
		}
		
        if (user is null)
        {
            return BadRequest();
        }

		User? current = await repository.Users.FindAsync(id);
        if ( current is null )
        {
            return NotFound();
        }

		EntityEntry<User>? updated = repository.Users.Update( current.WithUpdatesFrom(user) );

        repository.SaveChanges();
        return Ok(updated.Entity);
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
		if ( 
			! VerifyAuthenticatedId(id) &&
			! VerifyAuthorization(ProjectMana.User.Authorizations.DeleteAnyUser)
		)
		{
			return NotFound(); // 404 to avoid giving too much information.
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