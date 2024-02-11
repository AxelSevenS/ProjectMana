import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { Song } from 'src/app/song/song.model';
import { SongService } from 'src/app/song/song.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-library',
  templateUrl: 'user-library.page.html',
  styleUrls: ['user-library.page.scss'],
})
export class UserLibraryPage implements OnInit {

  public get isOwner(): boolean { return this._authentication.user?.id == this.requestId }
  public get isAdmin(): boolean { return this._authentication.user?.roles == "Admin" }
  public get requestId(): number { return this.activatedRoute.snapshot.params['id'] }

  public get user() { return this._user }
  private _user?: User | null;

  public get song() { return this._song }
  private _song?: Song[] | null;



  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private songService: SongService,
    private _authentication: AuthenticationService
  ) {}
  
  ngOnInit(): void {
    this.userService.getUserById(this.requestId)
      .subscribe(user => {
        this._user = user;
      })
    this.songService.getSongByAuthorId(this.requestId)
      .subscribe(song => {
        this._song = song;
      });
  }

  onInfiniteScroll(event: Event) {
  }

}
