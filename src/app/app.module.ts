import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { LightsComponent } from './lights/lights.component';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GaugeModule } from 'angular-gauge';



import { IMqttServiceOptions, MqttModule } from "ngx-mqtt";
import { environment as env } from '../environments/environment';
import { ThermostatComponent } from './thermostat/thermostat.component';

const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  connectOnCreate: true,
  hostname: env.mqtt.server,
  port: env.mqtt.port,
  protocol: (env.mqtt.protocol === "wss") ? "wss" : "ws",
  path: '',
  username: env.mqtt.username,
  password: env.mqtt.password,
};

@NgModule({
  declarations: [
    AppComponent,
    LightsComponent,
    ThermostatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatTabsModule,
    MatSliderModule,
    MatInputModule,
    FlexLayoutModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    GaugeModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
