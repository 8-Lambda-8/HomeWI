import { Component, OnInit } from '@angular/core';
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  debug: boolean = false;

  constructor(
    private cookieService: CookieService,
  ) { }

  ngOnInit(): void {
    this.debug = this.cookieService.get("debug") == "1";
  }

  updateDebug() {
    this.cookieService.set("debug", this.debug ? '1' : '0');
  }

}
