import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { Song } from 'src/app/song/song.model';
import { SongService } from 'src/app/song/song.service';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs';

@Component({
  selector: 'app-user-library',
  templateUrl: 'user-library.page.html',
  styleUrls: ['user-library.page.scss'],
})
export class UserLibraryPage implements OnInit {

  public get authentication() { return this._authentication }
  public get requestId(): number { return this.activatedRoute.snapshot.params['id'] }

  public get user() { return this._user }
  private _user?: User | null;

  public get songs() { return this._songs }
  private _songs?: Song[] | null;



  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private songService: SongService,
    private _authentication: AuthenticationService
  ) {}
  
  ngOnInit(): void {
    this.userService.getUserById(this.requestId)
      .pipe(first())
      .subscribe(user => {
        this._user = null;
        if (user instanceof HttpErrorResponse) return;

        this._user = user;
      })
    this.songService.getSongsByAuthorId(this.requestId)
      .pipe(first())
      .subscribe(songs => {
        this._songs = null;
        if (songs instanceof HttpErrorResponse) return;

        this._songs = songs;
      });
  }

  onInfiniteScroll(event: Event) {
  }

}
