namespace PulsePlay;

public record User
{
    public uint id { get; set; }
    public string? email { get; set; }
    public string? password { get; set; }
}