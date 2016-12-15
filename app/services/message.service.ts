import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Message } from '../components/messageboard/message';

@Injectable()
export class MessageService {

	private API_URL = "http://localhost:5000/api/";
	private headers = new Headers({'Content-Type': 'application/json'});

	constructor(private http: Http) {}

	getMessages(): Observable<Message[]> {
	  return this.http.get(this.API_URL + 'message')
	  			.map((res) => res.json())
	  			.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	};

	postMessage(message: Message): Observable<Message[]> {
		return this.http.post(this.API_URL + 'message', {msg: message}, {headers: this.headers})
					.map((res) => res.json());
	};	

}