using Microsoft.AspNetCore.Authorization;
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
    /// Get a song by id
    /// </summary>
    /// <param name="id">The id of the song</param>
    /// <returns>
    /// The song with the given id
    /// </returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<Song>> GetById(uint id) =>
		await repository.Songs.FindAsync(id) switch
        {
            Song song => Ok(song),
            null => NotFound(),
        };

    /// <summary>
    /// Register a song
    /// </summary>
    /// <param name="songname">The songname of the song</param>
    /// <param name="password">The password of the song</param>
    /// <returns>
    /// The song,
    ///    or BadRequest if the song already exists
    /// </returns>
    [HttpPut]
	[Authorize]
    public async Task<ActionResult<Song>> AddSong([FromForm]string name, [FromForm]IFormFile file)
    {
		if (
			! TryGetAuthenticatedUserId(out uint authorId) ||
			! VerifyAuthorization(ProjectMana.User.Authorizations.AddSongs)
		)
		{
			return NotFound(); // 404 to avoid giving too much information.
		}


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

    /// <summary>
    /// Update a song
    /// </summary>
    /// <param name="id">The id of the song</param>
    /// <param name="song">The song to update</param>
    /// <returns>
    /// The updated song
    /// </returns>
    [HttpPut("{id}")]
	[Authorize]
    public async Task<ActionResult<Song>> UpdateSong(uint id, [FromForm] Song song)
    {
        if (song is null)
        {
            return BadRequest();
        }

		Song? current = await repository.Songs.FindAsync(id);
        if ( current is null )
        {
            return NotFound();
        }

		if (
			! TryGetAuthenticatedUserId(out uint authorId) &&
			current.AuthorId != authorId &&
			! VerifyAuthorization(ProjectMana.User.Authorizations.EditAnySong)
		)
		{
			return NotFound(); // 404 to avoid giving too much information.
		}

		EntityEntry<Song> updated = repository.Songs.Update( current.WithUpdatesFrom(song) );

        repository.SaveChanges();
        return Ok(updated);
    }

    /// <summary>
    /// Delete a song
    /// </summary>
    /// <param name="id">The id of the song</param>
    /// <returns>
    /// The deleted song
    /// </returns>
    [HttpDelete("{id}")]
	[Authorize]
    public async Task<ActionResult<Song>> DeleteSong(uint id)
    {
		Song? current = await repository.Songs.FindAsync(id);
        if ( current is null )
        {
            return NotFound();
        }

		if (
			! TryGetAuthenticatedUserId(out uint authorId) &&
			current.AuthorId != authorId &&
			! VerifyAuthorization(ProjectMana.User.Authorizations.DeleteAnySong)
		)
		{
			return NotFound(); // 404 to avoid giving too much information.
		}

        repository.Songs.Remove(current);

        repository.SaveChanges();
        return Ok(current);
    }
}