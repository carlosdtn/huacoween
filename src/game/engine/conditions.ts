import type { Condition } from "../types";
import type { Progress } from "./state";

export const check = (
  condition: Condition | undefined,
  state: Progress,
): boolean => {
  if (!condition) return true;
  if ("flag" in condition) return state.flags.includes(condition.flag);
  if ("has" in condition) return state.inventory.includes(condition.has);
  if ("collected" in condition)
    return state.collected.includes(condition.collected);
  if ("visited" in condition) return state.visited.includes(condition.visited);
  if ("not" in condition) return !check(condition.not, state);
  if ("all" in condition) return condition.all.every((c) => check(c, state));
  return condition.any.some((c) => check(c, state));
};
