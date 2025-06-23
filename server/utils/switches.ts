//import type { SwitchT } from "~/shared/types/types";

export const switches = [
  { topic: "/zigbee2mqtt/Licht WohnKüche", stateSufix: "_l1", name: "WZ Wand", state: false },
  { topic: "/zigbee2mqtt/Licht WohnKüche", stateSufix: "_l2", name: "WZ Decke", state: false },
  { topic: "/zigbee2mqtt/Licht WohnKüche", stateSufix: "_l3", name: "Küche Theke", state: false },
  { topic: "/zigbee2mqtt/Licht WohnKüche", stateSufix: "_l4", name: "Küche Tisch", state: false },
  { topic: "/zigbee2mqtt/Licht Büro", stateSufix: "_l1", name: "Büro Licht", state: false },
  { topic: "/zigbee2mqtt/Licht Büro", stateSufix: "_l2", name: "Büro Dose", state: false },
  { topic: "/LightSwitch/2/0", stateSufix: "", name: "Terasse", state: false },
  { topic: "/zigbee2mqtt/Steckdose1", stateSufix: "", name: "Lampe R", state: false },
  { topic: "/zigbee2mqtt/Steckdose2", stateSufix: "", name: "Kugellampe", state: false },
  { topic: "/zigbee2mqtt/Steckdose7", stateSufix: "", name: "Ecklampe", state: false },
  { topic: "/zigbee2mqtt/Steckdose4", stateSufix: "", name: "Bad Lampe", state: false },
  { topic: "/zigbee2mqtt/Steckdose5", stateSufix: "", name: "3D Drucker", state: false },
  { topic: "/zigbee2mqtt/Steckdose6", stateSufix: "", name: "PiDrive", state: false },
];
