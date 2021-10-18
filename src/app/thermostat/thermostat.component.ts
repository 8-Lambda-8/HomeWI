import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MqttService } from "ngx-mqtt";

@Component({
  selector: 'app-thermostat',
  templateUrl: './thermostat.component.html',
  styleUrls: ['./thermostat.component.scss']
})
export class ThermostatComponent implements OnInit {

  subscription: Subscription = new Subscription;
  tempTopic: string = "/Thermostat/Temp/";

  sensorHum: number = 0;
  sensorTemp: number = 0;
  targetTemp: number = 0;
  H: number = 0;
  heaterState: boolean = false;

  floatValue: (value: number) => string;
  percentageValue: (value: number) => string;

  constructor(
    private mqttService: MqttService,
    public dialog: MatDialog,
  ) {
    this.floatValue = function (value: number): string {
      return `${value.toFixed(1)}`;
    };
    this.percentageValue = function (value: number): string {
      return `${value.toFixed(1)} %`;
    };
  }

  ngOnInit(): void {
    this.subscription = this.mqttService.observe(this.tempTopic + "#").subscribe(msg => {

      //console.log(msg);

      let field = msg.topic.replace(this.tempTopic, "");
      //console.log(msg.topic, " ", msg.payload.toString());
      switch (field) {
        case "sensorTemp":
          this.sensorTemp = +msg.payload.toString();
          break;
        case "targetTemp":
          this.targetTemp = +msg.payload.toString();
          break;
        case "H":
          this.H = +msg.payload.toString();
          break;
        case "heaterState":
          this.heaterState = +msg.payload.toString()==1;
          break;
        case "sensorHum":
          this.sensorHum = +msg.payload.toString();
          break;

        default:
          break;
      }
      /* if (isNaN(parseInt(msg.topic.slice(-1)))) return;*/


    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  updateTargetTemp(){
    console.log(this.targetTemp);
    this.mqttService.publish(this.tempTopic+"targetTemp",""+this.targetTemp,{ retain: true, }).subscribe();
  }
  updateH(){
    console.log(this.H);
    this.mqttService.publish(this.tempTopic+"targetTemp",""+this.targetTemp,{ retain: true, }).subscribe();
  }

}
