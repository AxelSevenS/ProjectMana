import { Song } from "../song/song.model";

export interface Playlist {
	id: number,
	authorId: number,
	name: string,
	songs: Song[]
}