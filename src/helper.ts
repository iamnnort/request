export class RequestHelper {
  static sleep(seconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, seconds * 1000);
    });
  }

  static backoffSleep(attempt: number, maxSeconds = 30) {
    const base = Math.min(maxSeconds, 2 ** (Math.max(1, attempt) - 1));
    const seconds = base / 2 + (Math.random() * base) / 2;

    return this.sleep(seconds);
  }
}
