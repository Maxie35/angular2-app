import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class SpotifyService {

	private API_URL = "https://api.spotify.com/";

	constructor(private http: Http) {}

	searchMusic(str: string, type='artist') {
		let searchUrl = this.API_URL + 'v1/search?query=' + str + '&offset=0&limit=20&type=' + type + '&market=NL';

		return this.http.get(searchUrl)
			.map(res => res.json());
	};

	getArtist(id) {
		let searchUrl = this.API_URL + 'v1/artists/' + id;

		return this.http.get(searchUrl)
			.map(res => res.json());
	};

	getAlbums(artistId) {
		let searchUrl = this.API_URL + 'v1/artists/' + artistId + '/albums';

		return this.http.get(searchUrl)
			.map(res => res.json());
	};

	getAlbum(id) {
		let searchUrl = this.API_URL + 'v1/albums/' + id;

		return this.http.get(searchUrl)
			.map(res => res.json());
	};

}