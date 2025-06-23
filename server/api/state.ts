import type { SwitchT } from "~/shared/types/types";
import { switches } from "../utils/switches";

export default defineEventHandler(() => {
  const resp: SwitchT[] = [];

  for (const sw of switches) {
    const { name, state } = sw;
    resp.push({ name, state });
  }

  return resp;
});
