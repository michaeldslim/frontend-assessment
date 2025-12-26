import { IOperatorCheckState } from "@/types";

const CHECK_STATE_KEY = "operator-check-state";

export function loadCheckState(): IOperatorCheckState {
  if (typeof window === "undefined") return {};

  try {
    const state = window?.localStorage.getItem(CHECK_STATE_KEY);
    if (!state) return {};
    return JSON.parse(state) as IOperatorCheckState;
  } catch{
    return {};
  }
}

export function saveCheckState(checkState: IOperatorCheckState) {
  if (typeof window === "undefined") return;

  try {
    window?.localStorage.setItem(CHECK_STATE_KEY, JSON.stringify(checkState));
  } catch{
    // ignore
  }
}
