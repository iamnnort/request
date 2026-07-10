export class RequestHelper {
  static sleep(seconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, seconds * 1000);
    });
  }

  static getBackoffSleep(attempt: number, maxSeconds = 30) {
    const base = Math.min(maxSeconds, 2 ** (Math.max(1, attempt) - 1));
    const seconds = base / 2 + (Math.random() * base) / 2;

    return {
      attemptDelay: parseFloat(seconds.toFixed(2)),
      attemptSleep: () => this.sleep(seconds),
    };
  }

  static startLoopSleep(minSeconds = 1) {
    const startMs = Date.now();

    return () => {
      const durationSec = (Date.now() - startMs) / 1000;
      const seconds = Math.max(0, minSeconds - durationSec);

      return {
        loopDuration: parseFloat(durationSec.toFixed(2)),
        loopDelay: parseFloat(seconds.toFixed(2)),
        loopSleep: () => this.sleep(seconds),
      };
    };
  }
}
