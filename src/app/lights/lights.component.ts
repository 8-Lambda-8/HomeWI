import { Component, OnInit, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { IMqttMessage, MqttService } from "ngx-mqtt";


interface lightButton {
  id: string;
  name: string;
  state: boolean;
  offline: boolean;
  ip: String;
  version: String;
}

@Component({
  selector: 'app-lights',
  templateUrl: './lights.component.html',
  styleUrls: ['./lights.component.scss']
})
export class LightsComponent implements OnInit {

  subscription: Subscription = new Subscription;
  lightSwitchTopic: string = "/LightSwitch/"

  cols = 1;

  constructor(
    private mqttService: MqttService,
  ) {  }

  lightButtons: lightButton[] = [
    { id: "0/0", name: "WZ Wand", state: false, offline: false, ip: "", version: "" },
    { id: "0/1", name: "WZ Decke", state: false, offline: false, ip: "", version: "" },
    { id: "3/0", name: "Küche Theke", state: false, offline: false, ip: "", version: "" },
    { id: "3/1", name: "Küche Tisch", state: false, offline: false, ip: "", version: "" },
    { id: "1/0", name: "Büro Dose", state: false, offline: false, ip: "", version: "" },
    { id: "1/1", name: "Büro Licht", state: false, offline: false, ip: "", version: "" },
    { id: "2/0", name: "Terrasse", state: false, offline: false, ip: "", version: "" }
  ]

  ngOnInit(): void {
    this.subscription = this.mqttService.observe(this.lightSwitchTopic + "#").subscribe(msg => {
      //console.log(msg);

      let id = msg.topic.replace(this.lightSwitchTopic, "");
      let indexes: number[] = (this.lightButtons.map((elm, idx) => elm.id.startsWith(id.substring(0, 1)) ? idx : .5).filter(Number.isInteger));

      //onsole.log(id);
      //console.log(msg.topic);
      //console.log(msg.payload.toString());
      //console.log(indexes);

      indexes.forEach(btnIndex => {
        if (msg.topic.endsWith("IP"))
          this.lightButtons[btnIndex].ip = msg.payload.toString();
        if (msg.topic.endsWith("Version"))
          this.lightButtons[btnIndex].version = msg.payload.toString();
        if (msg.topic.endsWith("Status"))
          this.lightButtons[btnIndex].offline = msg.payload.toString() == "OFFLINE";
      });

      let btn = this.lightButtons.find(btn => btn.id == id);
      if (!btn) return;
      if (isNaN(parseInt(msg.topic.slice(-1)))) return;

      btn.state = (msg.payload.toString() == "1")

    });
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])

  onResize() {

    console.log("Width: %d", window.innerWidth);
    console.log("Height: %d", window.innerHeight);
    console.log("DIV: %d", window.innerWidth/window.innerHeight);
    
    if((window.innerWidth/window.innerHeight)>1){
      this.cols = 2;
    }else{
      this.cols = 1;
    }
    
    console.log("this.cols",this.cols);
  }
  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  sendMessage(id: string, state: boolean) {
    let msg: string = state ? "0" : "1"
    //console.log(id + " " + state + " " + msg);
    this.mqttService.publish(this.lightSwitchTopic + id, msg, { retain: true, }).subscribe(/* msg=>console.log(msg) */);
  }

}