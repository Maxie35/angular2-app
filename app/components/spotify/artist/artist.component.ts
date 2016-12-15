import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { SpotifyService } from '../../../services/spotify.service';
import { Artist } from '../artist';
import { Album } from '../album';


@Component({
  selector: 'artist-detail',
  templateUrl: 'app/components/spotify/artist/artist.template.html',
  providers: [SpotifyService]
})
export class ArtistComponent implements OnInit {

  id: string;
  artist: Artist;
  albums: Album[];

  constructor(
    private spotifyService: SpotifyService,
    private route: ActivatedRoute) { 
  }

  ngOnInit(): void {
    this.route.params
    .map((params: Params) => params['id'])
    .subscribe((id) => {
      this.spotifyService.getArtist(id)
      .subscribe(artist => this.artist = artist);

      this.spotifyService.getAlbums(id)
      .subscribe(albums => this.albums = albums.items);
    })
  };

}