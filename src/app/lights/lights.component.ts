import { Component, OnInit, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { IMqttMessage, MqttService } from "ngx-mqtt";


interface lightButton {
  id: string;
  name: string;
  state: boolean;
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
    { id: "0/0", name: "WZ Wand", state: false },
    { id: "0/1", name: "WZ Decke", state: false },
    { id: "3/0", name: "Küche Theke", state: false },
    { id: "3/1", name: "Küche Tisch", state: false },
    { id: "1/0", name: "Büro Dose", state: false },
    { id: "1/1", name: "Büro Licht", state: false },
    { id: "2/0", name: "Terrasse", state: false }
  ]

  ngOnInit(): void {
    this.subscription = this.mqttService.observe(this.lightSwitchTopic + "#").subscribe(msg => {
      //console.log(msg);

      if (isNaN(parseInt(msg.topic.slice(-1)))) return;

      let id = msg.topic.replace(this.lightSwitchTopic, "");
      //console.log(id);
      //console.log(msg.payload.toString());
      let btn = this.lightButtons.find(btn=>btn.id==id);
      //console.log(btn)
      if (btn)
        btn.state = (msg.payload.toString()=="1")

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