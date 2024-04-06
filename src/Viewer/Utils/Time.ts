import { TypedEvent } from "./TypedEvent.ts";

export class Time extends TypedEvent<void> {
  start: number = Date.now();
  current: number = this.start;
  elapsed: number = 0;
  delta: number = 16;

  constructor() {
    super();
    this.tick();
  }

  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;
    this.emit();
    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
