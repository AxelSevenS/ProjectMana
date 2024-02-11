export interface User {
	id: number,
	username: string,
	password?: string,
	roles: "Admin" | "Client"
}