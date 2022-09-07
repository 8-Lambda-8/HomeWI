import { Component, isDevMode, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MqttService } from "ngx-mqtt";

enum ambientTypes {
  schneckenkatze = <any>"schneckenkatze",
  cat = <any>"cat",
  ambient = <any>"Ambient",
}

interface ambientLight {
  name: string;
  path: string;
  ip?: string;
  status: string;
  version: string;
  voltage?: number;

  animation: number
  brightness: number;
  color: string;
  color0: string;
  color1: string;
  speed: number;
}

interface Anination {
  value: number;
  name: string;
}

@Component({
  selector: 'app-ambient',
  templateUrl: './ambient.component.html',
  styleUrls: ['./ambient.component.scss']
})
export class AmbientComponent implements OnInit {

  subscriptions: Subscription[] = [];
  ambientLights = new Map<string, ambientLight>();
  animations: Anination[] = [
    { value: 0, name: 'Solid' },
    { value: 1, name: 'Fade' },
    { value: 2, name: '2 col Fade' },
    { value: 3, name: 'Breathing' },
    { value: 4, name: '2 col Breathing' },
    { value: 5, name: 'Random Breathing' },

  ];

  constructor(
    private mqttService: MqttService,
  ) { }

  newAmbientLight(path: string): ambientLight {
    return {
      name: "", path: path, animation: 0, brightness: 0,
      color: "#000000", color0: "#000000", color1: "#000000",
      status: "", version: "", speed: 255,
    };
  }

  ngOnInit(): void {
    for (const type in ambientTypes) {
      this.subscriptions.push(this.mqttService.observe("/" + type + "/#").subscribe(msg => {
        if (isDevMode()) console.log(msg.topic, ":", msg.payload.toString());
        let payload: string = msg.payload.toString();

        let path: string = msg.topic.split("/", 3).join("/");

        if (!this.ambientLights.has(path)) {
          this.ambientLights.set(path, this.newAmbientLight(path));
        }

        let amb = this.ambientLights.get(path);
        if (amb === undefined) return;
        switch (msg.topic.split("/")[3]) {
          case undefined:
            amb.name = payload;
            break;
          case "IP":
            amb.ip = payload;
            break;
          case "Status":
            amb.status = payload;
            break;
          case "Version":
            amb.version = payload;
            break;
          case "Voltage":
            amb.voltage = +payload;
            break;


          case "animation":
            amb.animation = +payload;
            break;
          case "brightness":
            amb.brightness = +payload;
            break;
          case "color":
            amb.color = payload;
            break;
          case "color0":
            amb.color0 = payload;
            break;
          case "color1":
            amb.color1 = payload;
            break;
          case "speed":
            amb.speed = +payload;
            break;
        }
        this.ambientLights.set(path, amb);
      }));
    }
  }

  animationChange(path: string) {
    let msg = this.ambientLights.get(path)?.animation.toString();
    if (msg == undefined) return;
    this.mqttService.publish(path + "/animation", msg, { retain: true, }).subscribe();
  }

  brightnessChange(path: string) {
    let msg = this.ambientLights.get(path)?.brightness.toString()
    if (msg == undefined) return;
    this.mqttService.publish(path + "/brightness", msg, { retain: true, }).subscribe();
  }

  colorChange(path: string, i: number) {
    let msg = "" + this.ambientLights.get(path)?.color0;
    if (i == 1) msg = "" + this.ambientLights.get(path)?.color1;
    if (msg == undefined) return;
    this.mqttService.publish(path + "/color" + i, msg, { retain: true, }).subscribe();
  }

  speedChange(path: string) {
    let msg = this.ambientLights.get(path)?.speed.toString();
    if (msg == undefined) return;
    this.mqttService.publish(path + "/speed", msg, { retain: true, }).subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

}
