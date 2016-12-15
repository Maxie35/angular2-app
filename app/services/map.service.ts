import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Marker } from '../components/map/marker';


@Injectable()
export class MapService {

	private API_URL = "http://localhost:5000/api/";
	private headers = new Headers({'Content-Type': 'application/json'});

	constructor(private http: Http) {}

	getMarkers(): Observable<Marker[]> {
	  return this.http.request('../../client/resources/markers.json')
                 .map(res => res.json());
	};


}