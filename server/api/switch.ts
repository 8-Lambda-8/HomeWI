import { client } from "../utils/mqtt";
import { switches } from "../utils/switches";
import type { SwitchT } from "~/shared/types/types";

export default defineEventHandler(async (event) => {
  const { name, state } = (await readBody(event)) as SwitchT;

  const sw = switches.find((s) => s.name == name);
  if (!sw) return;
  if (sw.topic.includes("/zigbee")) {
    client.publish(sw.topic + "/set", `{"state${sw.stateSufix}": "${state ? "on" : "off"}"}`);
  } else if (sw.topic.includes("/LightSwitch")) {
    client.publish(sw.topic, state ? "1" : "0");
  }

  return;
});
