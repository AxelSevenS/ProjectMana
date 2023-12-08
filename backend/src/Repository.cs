using System.Text.Json;

namespace PulsePlay;

public abstract class Repository<T> where T : class {


    protected readonly List<T> Data = new();

    public Repository(string fileName)
    {
        using var file = File.Open(fileName, FileMode.OpenOrCreate);

        if (file.Length > 0)
        {
            Span<byte> buffer = new byte[file.Length];
            file.Read(buffer);

            Data = JsonSerializer.Deserialize<List<T>>(buffer) ?? new();
        }
        else
        {
            Data = new();
        }
    }


    public abstract void SaveChanges();

}