    import { NgModule }       from '@angular/core';
    import { BrowserModule }  from '@angular/platform-browser';
    import { FormsModule }    from '@angular/forms';
    import { HttpModule }     from '@angular/http';
    import { NgbModule }      from '@ng-bootstrap/ng-bootstrap';

    import { AppRoutingModule }     from './app-routing.module';
    
    import { AppComponent }         from './app.component';
    import { HeaderComponent }      from './components/header/header.component';
    import { HomepageComponent }      from './components/homepage/homepage.component';
    import { MessageComponent }     from './components/messageboard/message.component';
    import { SearchComponent }     from './components/spotify/search/search.component';
    import { ArtistComponent }     from './components/spotify/artist/artist.component';
    import { AlbumComponent }     from './components/spotify/album/album.component';
    import { MapComponent }     from './components/map/map.component';
    import { ReversePipe }          from './pipes/reverse.pipe';

    import { AgmCoreModule } from 'angular2-google-maps/core';

    @NgModule({
      imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        NgbModule.forRoot(),
        HttpModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyBBKmp6EGFVDNzSEdEkunacJGMOVMVl4gs'
        })
      ],
      declarations: [
        AppComponent,
        HeaderComponent,
        HomepageComponent,
        MessageComponent,
        SearchComponent,
        ArtistComponent,
        AlbumComponent,
        MapComponent,
        ReversePipe
      ],
      providers: [],
      bootstrap: [ AppComponent ]
    })
    export class AppModule { }