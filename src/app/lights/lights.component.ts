import { Component, OnInit, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { IMqttMessage, MqttService } from "ngx-mqtt";
import { CookieService } from "ngx-cookie-service";


interface lightButton {
  name: string;
  topic: string;
  state: boolean;
}

interface lightButtonWiFi extends lightButton {
  offline: boolean;
  ip: String;
  version: String;
  type: "wifi";
}

interface lightButtonZigbee extends lightButton {
  stateSufix: string;
  type: "zigbee";
}

@Component({
  selector: 'app-lights',
  templateUrl: './lights.component.html',
  styleUrls: ['./lights.component.scss']
})
export class LightsComponent implements OnInit {

  subscriptionZigbee: Subscription = new Subscription;
  subscriptionWifi: Subscription = new Subscription;
  lightSwitchTopic: string = "/LightSwitch/"
  zigbeeTopic: string = "/zigbee2mqtt/"

  cols = 1;

  debug:boolean = false;

  constructor(
    private mqttService: MqttService,
    private cookieService: CookieService,
  ) {  }

  lightButtons: (lightButtonWiFi|lightButtonZigbee)[] = [
    { topic: "Licht WohnKüche", type:"zigbee", name: "WZ Wand", state: false, stateSufix: "l1" },
    { topic: "Licht WohnKüche", type:"zigbee", name: "WZ Decke", state: false, stateSufix: "l2" },
    { topic: "Licht WohnKüche", type:"zigbee", name: "Küche Theke", state: false, stateSufix: "l3" },
    { topic: "Licht WohnKüche", type:"zigbee", name: "Küche Tisch", state: false, stateSufix: "l4" },
    { topic: "Licht Büro", type:"zigbee", name: "Büro Dose", state: false, stateSufix: "l1" },
    { topic: "Licht Büro", type:"zigbee", name: "Büro Licht", state: false, stateSufix: "l2" },
    { topic: "2/0", type:"wifi", name: "Terrasse", state: false, offline: false, ip: "", version: "" },    
    { topic: "Steckdose1", type:"zigbee", name: "Lampe R", state: false, stateSufix:"" },
    { topic: "Steckdose2", type:"zigbee", name: "Kugellampe", state: false, stateSufix:"" },
    { topic: "Steckdose3", type:"zigbee", name: "Bad Lampe", state: false, stateSufix:"" },
    
  ]

  ngOnInit(): void {
    this.subscriptionZigbee = this.mqttService.observe(this.zigbeeTopic + "#").subscribe(msg => {
      for (const btn of this.lightButtons) {
        if(btn.type==="zigbee"&& msg.topic.endsWith(btn.topic)){
          //console.log(msg.topic, JSON.parse(msg.payload.toString()));
          const payload = JSON.parse(msg.payload.toString());
          btn.state = payload[`state${btn.stateSufix?"_":""}${btn.stateSufix}`]==="ON"
        }
      }

    });

    this.subscriptionWifi = this.mqttService.observe(this.lightSwitchTopic + "#").subscribe(msg => {

      let id = msg.topic.replace(this.lightSwitchTopic, "");
      let indexes: number[] = (this.lightButtons.map((elm, idx) => {
        return elm.type==="wifi" && elm.topic.startsWith(id.substring(0, 1)) ? idx : .5
      }).filter(Number.isInteger));

      indexes.forEach(btnIndex => {
        const btn = this.lightButtons[btnIndex] as lightButtonWiFi;        
        if (msg.topic.endsWith("IP"))
          btn.ip = msg.payload.toString();
        if (msg.topic.endsWith("Version"))
          btn.version = msg.payload.toString();
        if (msg.topic.endsWith("Status"))
          btn.offline = msg.payload.toString() == "OFFLINE";        
      });

      let btn = this.lightButtons.find(btn => btn.topic == id);
      if (!btn) return;
      if (isNaN(parseInt(msg.topic.slice(-1)))) return;

      btn.state = (msg.payload.toString() == "1")

    });
    this.onResize();
    this.debug = this.cookieService.get("debug")=="1";
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
    if (this.subscriptionZigbee) {
      this.subscriptionZigbee.unsubscribe();
    }
    if (this.subscriptionWifi) {
      this.subscriptionWifi.unsubscribe();
    }
  }

  sendMessage(button: lightButtonWiFi|lightButtonZigbee) {
    if(button.type==="wifi"){
      let msg: string = button.state ? "0" : "1"
      //console.log(id + " " + state + " " + msg);
      this.mqttService.publish(this.lightSwitchTopic + button.topic, msg, { retain: true, }).subscribe(/* msg=>console.log(msg) */);
    }else if(button.type==="zigbee"){
      this.mqttService.publish(this.zigbeeTopic + button.topic+"/set", `{"state${button.stateSufix?"_":""}${button.stateSufix}":"TOGGLE"}`).subscribe(msg=>console.log(msg));
    }
  }
}