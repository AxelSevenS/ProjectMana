using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;


namespace ProjectMana;

[ApiController]
[Route("api/songs")]
public class SongController(AppDbContext repo) : Controller<Song>(repo)
{
	/// <summary>
	/// Get all Songs
	/// </summary>
	/// <returns>
	/// All Songs
	/// </returns>
	[HttpGet]
    public async Task<List<Song>> GetAll() =>
		await repository.Songs.ToListAsync();

    /// <summary>
    /// Get a user by id
    /// </summary>
    /// <param name="id">The id of the user</param>
    /// <returns>
    /// The user with the given id
    /// </returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<Song>> GetById(uint id) =>
		await repository.Songs.FindAsync(id) switch
        {
            Song user => Ok(user),
            null => NotFound(),
        };

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
    public async Task<ActionResult<Song>> AddSong([FromForm]string name, [FromForm]IFormFile file)
    {

		// TODO: Get Auth here
		User.Authorizations auth = ProjectMana.User.Authorizations.Admin;
		if ( (auth & ProjectMana.User.Authorizations.CreateSongs) == 0)
		{
			return Unauthorized();
		}
		uint authorId = 1;

        if (file.Length == 0)
        {
			return BadRequest(file);
		}

		if ( ! file.ContentType.StartsWith("audio") )
		{
			return BadRequest("File is incorrect format");
		}

		Stream stream = file.OpenReadStream();

		byte[] bytes = new byte[stream.Length];
		int count = await stream.ReadAsync(bytes);

		if (count == 0)
		{
			return BadRequest("Could not read file");
		}


        EntityEntry<Song> result = repository.Songs.Add(
			new()
			{
				AuthorId = authorId,
				Name = name,
				FileName = file.FileName,
				MimeType = file.ContentType,
				FileBytes = bytes
			}
		);

        repository.SaveChanges();
        return Ok(result.Entity);
    }

    // /// <summary>
    // /// Update a user
    // /// </summary>
    // /// <param name="id">The id of the user</param>
    // /// <param name="user">The user to update</param>
    // /// <returns>
    // /// The updated user
    // /// </returns>
    // [HttpPut("{id}")]
    // public async Task<ActionResult<Song>> UpdateSong(uint id, [FromForm] Song user)
    // {
	// 	// TODO: Add Auth check
		
    //     if (user is null)
    //     {
    //         return BadRequest();
    //     }

	// 	Song? current = await repository.Songs.FindAsync(id);
    //     if ( current is null )
    //     {
    //         return NotFound();
    //     }

	// 	EntityEntry<Song>? updated = repository.Songs.Update( current.WithUpdatesFrom(user) );

    //     repository.SaveChanges();
    //     return Ok(updated);
    // }

    /// <summary>
    /// Delete a user
    /// </summary>
    /// <param name="id">The id of the user</param>
    /// <returns>
    /// The deleted user
    /// </returns>
    [HttpDelete("{id}")]
    public async Task<ActionResult<Song>> DeleteSong(uint id)
    {
		// TODO: Add Auth check

		Song? current = await repository.Songs.FindAsync(id);
        if ( current is null )
        {
            return NotFound();
        }

        repository.Songs.Remove(current);

        repository.SaveChanges();
        return Ok(current);
    }
}