import mqtt from "mqtt";
import { switches } from "./switches";
import type { SwitchT } from "~/shared/types/types";

export const client = mqtt.connect("mqtt://MQTT/", { username: "test1", password: "test1" });
export const callbacks: ((data: SwitchT[]) => void)[] = [];

client.on("connect", () => {
  client.subscribe(switches.map((s) => s.topic));
});

client.on("message", (topic, message) => {
  //console.log(topic);

  for (const sw of switches) {
    if (topic.includes(sw.topic)) {
      if (topic.startsWith("/zigbee")) {
        const data = JSON.parse(message.toString());
        sw.state = data["state" + sw.stateSufix] == "ON";
      } else if (topic.startsWith("/LightSwitch")) {
        sw.state = message.toString() == "1";
      }
    }
  }

  for (const cb of callbacks) cb(switches);
});
