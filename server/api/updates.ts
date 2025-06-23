import type { SwitchT } from "~/shared/types/types";
import { callbacks } from "../utils/mqtt";

export default defineEventHandler((event) => {
  event.node.res.setHeader("Content-Type", "text/event-stream");
  event.node.res.setHeader("Cache-Control", "no-cache");
  event.node.res.setHeader("Connection", "keep-alive");
  event.node.res.flushHeaders();

  const callback = (data: SwitchT[]) => {
    event.node.res.write(`data: ${JSON.stringify(data)}\n\n`);
  };
  callbacks.push(callback);

  event.node.req.on("close", () => {
    callbacks.splice(callbacks.indexOf(callback), 1);
    event.node.res.end();
  });
});
