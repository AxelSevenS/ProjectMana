using System.Text.Json;

namespace ProjectMana;

public abstract class Repository<T> where T : class
{
	protected RepoData Data = new();

    public Repository(string fileName)
    {
        using FileStream? file = File.Open(fileName, FileMode.OpenOrCreate);

        if (file.Length == 0)
        {
            Data = new();
			return;
        }

		Span<byte> buffer = new byte[file.Length];
		file.Read(buffer);

		Data = JsonSerializer.Deserialize<RepoData>(buffer) ?? new();
    }

    /// <summary>
    /// Get a new id for a product
    /// </summary>
    /// <returns>
    /// A new id
    /// </returns>
    public uint GetNewId() => Data.CurrentId++;


    public abstract void SaveChanges();

	public sealed record RepoData
	{
		public readonly List<T> Values = [];
		public uint CurrentId = 1;
	}

}