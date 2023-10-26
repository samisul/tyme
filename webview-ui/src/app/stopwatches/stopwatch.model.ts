import { Duration } from "luxon";

export interface Stopwatch {
  id: string;
  name: string;
  desc?: string;
  createdAt: string;
  start: string;
  stop?: string;
  isPaused: boolean;
  isStopped: boolean;
  elapsed?: string;
  pauses: number;
}

export interface AddStopwatch extends Partial<Stopwatch> {
  name: string;
  desc: string;
  elapsedInMin?: Duration;
}

export interface StopwatchStats {
  runningCount: number;
  pausedCount: number;
  stoppedCount: number;
  totalCount: number;
  elapsedToday: string;
  totalElapsed: string;
}

export interface StopwatchesFilter {
  running: boolean;
  paused: boolean;
  stopped: boolean;
}

export const defaultFilter: StopwatchesFilter = {
  running: true,
  paused: true,
  stopped: true,
};

export interface Elapsed {
  unit: TimeUnit;
  duration: number;
}

//todo: find a better way to repeat the same goddamn letters in 10 places :) peace and love <3
export const timeUnits = {
  ["s"]: "seconds",
  ["m"]: "minutes",
  ["h"]: "hours",
  ["d"]: "days",
  ["w"]: "weeks",
} as const;

export type TimeUnit = "s" | "m" | "h" | "d" | "w";
