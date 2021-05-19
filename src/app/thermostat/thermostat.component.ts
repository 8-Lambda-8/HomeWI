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


  constructor(
    private mqttService: MqttService,
  ) { }

  ngOnInit(): void {
    this.subscription = this.mqttService.observe(this.tempTopic + "#").subscribe(msg => {

      //console.log(msg);

      let field = msg.topic.replace(this.tempTopic, "");
      console.log(msg.topic, " ", msg.payload.toString());
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

  sendMessage(id: string, state: boolean) {
    //let msg: string = state ? "0" : "1"
    //console.log(id + " " + state + " " + msg);
    //this.mqttService.publish(this.lightSwitchTopic + id, msg, { retain: true, }).subscribe(/* msg=>console.log(msg) */);
  }

}
