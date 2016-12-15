import { Component, Input, OnInit } from '@angular/core';

import { SpotifyService } from '../../../services/spotify.service';
import { Artist } from '../artist';


@Component({
  selector: 'search-component',
  templateUrl: 'app/components/spotify/search/search.template.html',
  providers: [SpotifyService]
})
export class SearchComponent implements OnInit {

  @Input()
  searchStr: string; 

  artistResult: Artist[];
  

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit(): void {}

  searchMusic(): void {
    if(!!this.searchStr) {
    	this.spotifyService.searchMusic(this.searchStr)
        .subscribe(res => this.artistResult = res.artists.items, err => console.log(err));
    }
  };



}