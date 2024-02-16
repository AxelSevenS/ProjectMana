export interface User {
	id: number,
	username: string,
	password?: string,
	roles: string,
}

export interface UserAuths {
  UserEditor: boolean,
  AuthEditor: boolean,
  UserDeleter: boolean,
  SongCreator: boolean,
  SongEditor: boolean,
  SongDeleter: boolean,
  PlaylistCreator: boolean,
  PlaylistEditor: boolean,
  PlaylistDeleter: boolean,
}