import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'my-homepage',
  templateUrl: 'app/components/homepage/homepage.template.html',
})
export class HomepageComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {}

  title = "Hallo";

}