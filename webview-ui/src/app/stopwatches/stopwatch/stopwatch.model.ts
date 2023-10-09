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
  elapsedInMin?: number;
}
