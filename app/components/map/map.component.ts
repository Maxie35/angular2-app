import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import 'rxjs/add/operator/map';

import { MapService }        from '../../services/map.service';
import { Marker }            from './marker';
import { AgmCoreModule }     from 'angular2-google-maps/core';
import { NgbDropdownConfig}  from '@ng-bootstrap/ng-bootstrap';



@Component({
    selector: 'my-map',
    templateUrl: 'app/components/map/map.template.html',
    providers: [MapService]
})
export class MapComponent implements OnInit {

    // google maps properties
    zoom: number = 10;
    icon = "client/images/pin.png";
    markers: Marker[] = [];
    showRed = true;
    showBlack = true;  

    // initial center position for the map
    lat: number = 52.321071488;
    lng: number = 5.00152587890625;

    constructor(private mapService: MapService, config: NgbDropdownConfig) {
        config.autoClose = false; 
    }

    ngOnInit(): void {
        this.getMarkers();
    }

    clickedMarker(marker: Marker, index: number) {
        console.log(`clicked the marker: ${marker.label || index}`);
        marker.isOpen = true;
    }

    mapClicked($event) {
        console.log(`Clicked on: ${$event.coords.lat}, ${$event.coords.lng}`);
        for(var marker of this.markers) {
            marker.isOpen = false;
        }
            // this.markers.push({
            //     lat: $event.coords.lat,
            //     lng: $event.coords.lng,
            //     label: "",
            //     draggable: true,
            //     visible: true,
            //     icon: this.icon
            // });
    }

    markerDragEnd(m: Marker, $event) {
        console.log(`Old coords: ${m.lat}, ${m.lng}\nNew coords: ${$event.coords.lat}, ${$event.coords.lng}`);
        m.lat = $event.coords.lat;
        m.lng = $event.coords.lng;
    }

    getMarkers(): void {
        this.mapService.getMarkers()
        .subscribe(markers => this.markers = markers, err => {console.log(err);})
    };

    toggleMarkers(color) {
        //this.showRed = !this.showRed;

        if(color === "red") {
            for(var marker of this.markers) {
                if(marker.icon === "client/images/pin.png") {
                    marker.visible = !marker.visible;
                }
            }        
        } else if(color === "black") {
            for(var marker of this.markers) {
                if(marker.icon === "client/images/pin2.png") {
                    marker.visible = !marker.visible;
                } 
            }          
        } else {
            return;
        }
    };

}

