import { Component, OnInit } from '@angular/core';
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'HomeWI';
  selectedTab: number = 0;

  constructor(private cookieService: CookieService) { }

  ngOnInit(): void {
    this.selectedTab = +this.cookieService.get("selectedTab") || 0;
  }

  setTabState(tabId: number): void {
    this.selectedTab = tabId;
    this.cookieService.set("selectedTab", "" + this.selectedTab);
  }



}
