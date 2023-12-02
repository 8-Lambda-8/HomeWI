import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MqttService } from 'ngx-mqtt';
import { MatDialog } from '@angular/material/dialog';
import { EditAutoTempDialogComponent } from '../edit-auto-temp-dialog/edit-auto-temp-dialog.component';

interface heatingZone {
  name:
    | 'Bad'
    | 'Schlafzimmer'
    | 'Küche'
    | 'Gang'
    | 'Wohnzimmer'
    | 'Büro'
    | 'WC';
  targetTemp: number;
}
interface targetTempsType {
  Bad: number;
  Schlafzimmer: number;
  Küche: number;
  Gang: number;
  Wohnzimmer: number;
  Büro: number;
  WC: number;
}

@Component({
  selector: 'app-thermostat',
  templateUrl: './thermostat.component.html',
  styleUrls: ['./thermostat.component.scss'],
})
export class ThermostatComponent implements OnInit {
  subscription: Subscription = new Subscription();
  targetTopic: string = '/Thermostat/targetTemps';

  selectedZone = 'Gang';
  url =
    'https://grafana.lambda8.at/d-solo/DhONJMiRz/thermostat?orgId=1&panelId=14&var-Zone=HT-' +
    this.selectedZone;

  zones: heatingZone[] = [
    { name: 'Bad', targetTemp: 0 },
    { name: 'Schlafzimmer', targetTemp: 0 },
    { name: 'Küche', targetTemp: 0 },
    { name: 'Gang', targetTemp: 0 },
    { name: 'Wohnzimmer', targetTemp: 0 },
    { name: 'Büro', targetTemp: 0 },
    { name: 'WC', targetTemp: 0 },
  ];

  targetTemps = {
    Bad: 0,
    Schlafzimmer: 0,
    Küche: 0,
    Gang: 0,
    Wohnzimmer: 0,
    Büro: 0,
    WC: 0,
  };

  floatValue: (value: number) => string;

  constructor(private mqttService: MqttService, public dialog: MatDialog) {
    this.floatValue = function (value: number): string {
      return `${value.toFixed(1)}`;
    };
  }

  ngOnInit(): void {
    this.subscription = this.mqttService
      .observe(this.targetTopic)
      .subscribe((msg) => {
        console.log(msg.topic, '\n', msg.payload.toString());
        const msgObj = JSON.parse(msg.payload.toString()) as targetTempsType;

        for (const obj of this.zones) {
          obj.targetTemp = msgObj[obj.name];
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  updateTargetTemp() {
    for (const zone of this.zones) {
      this.targetTemps[zone.name] = zone.targetTemp;
    }
    console.log(this.targetTemps);
    this.mqttService
      .publish(this.targetTopic, '' + JSON.stringify(this.targetTemps), {
        retain: true,
      })
      .subscribe();
  }

  openDialog() {
    const dialogRef = this.dialog.open(EditAutoTempDialogComponent, {
      width: '80%',
      data: { mqttService: this.mqttService },
    });
  }
}
