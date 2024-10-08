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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';



import { IMqttServiceOptions, MqttModule } from "ngx-mqtt";
import { environment as env } from '../environments/environment';
import { ThermostatComponent } from './thermostat/thermostat.component';
import { EditAutoTempDialogComponent } from './edit-auto-temp-dialog/edit-auto-temp-dialog.component';
import { SettingsComponent } from './settings/settings.component';
import { AmbientComponent } from './ambient/ambient.component';
import { ColorPickerDialogComponent } from './color-picker-dialog/color-picker-dialog.component';

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
    ThermostatComponent,
    EditAutoTempDialogComponent,
    SettingsComponent,
    AmbientComponent,
    ColorPickerDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSliderModule,
    MatInputModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatListModule,
    MatTooltipModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
