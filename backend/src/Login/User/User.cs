namespace ProjectMana;

public record User
{
    public uint Id { get; set; } = 1;
    public string? Username { get; set; } = null;
    public string? Password { get; set; } = null;
    public Authorizations Auth { get; set; } = Authorizations.User;

	public enum Authorizations : byte
	{
		User = 0
	}
}