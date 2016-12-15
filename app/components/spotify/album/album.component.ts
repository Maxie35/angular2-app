import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';

import 'rxjs/add/operator/map';

import { SpotifyService } from '../../../services/spotify.service';
import { Artist } from '../artist';
import { Album } from '../album';


@Component({
  selector: 'album-detail',
  templateUrl: 'app/components/spotify/album/album.template.html',
  providers: [SpotifyService]
})
export class AlbumComponent implements OnInit {

  id: string;
  artist: Artist;
  album: Album;

  constructor(
    private spotifyService: SpotifyService,
    private route: ActivatedRoute) { 
  }

  ngOnInit(): void {
    this.route.params
    .map((params: Params) => params['id'])
    .subscribe((id) => {
      this.spotifyService.getAlbum(id)
      .subscribe(album => this.album = album);
      console.log(this.album);
    })
  };

}