import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MqttService } from "ngx-mqtt";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  selector: 'app-edit-auto-temp-dialog',
  templateUrl: './edit-auto-temp-dialog.component.html',
  styleUrls: ['./edit-auto-temp-dialog.component.scss']
})
export class EditAutoTempDialogComponent implements OnInit {
  subscription: Subscription = new Subscription;

  AutoTempConfigArray:[{
    days: [Boolean];
    id: Number;
    name: String;
    targetTemps: targetTempsType;
    time: String;
    enabled: boolean;
  }] | undefined;

  dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  zones = ["Bad", "Schlafzimmer", "Küche", "Gang", "Wohnzimmer", "Büro", "WC"] as 
  ('Bad'
  | 'Schlafzimmer'
  | 'Küche'
  | 'Gang'
  | 'Wohnzimmer'
  | 'Büro'
  | 'WC')[];

  constructor(
    public dialogRef: MatDialogRef<EditAutoTempDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {mqttService: MqttService}
  ) { 
    this.subscription = data.mqttService.observe("/Automation/Temp").subscribe(msg => {
      this.AutoTempConfigArray = JSON.parse(msg.payload.toString());
    });

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  arrayItterator(array:any[]): number[]{
    let itter = [];
    for (let i = 0; i < array.length; i++) {
      itter.push(i);
    }
    return itter;
  }

  save(){
    this.data.mqttService.publish("/Automation/Temp",JSON.stringify(this.AutoTempConfigArray),{ retain: true, }).subscribe();
    this.dialogRef.close();
  }

}