clearLog();
var console = {
  counts: Object.create(null) as Record<string, number>,
  times: Object.create(null) as Record<string, number>,
  stringify(data: any) {
    return ["object", "array"].includes(typeof data)
      ? JSON.stringify(data)
      : String(data);
  },
  print(label: string, data: ReadonlyArray<any>) {
    log([label, ...data].map(this.stringify).join(" "));
  },
  log(...data: ReadonlyArray<any>) {
    this.print("[info]", data);
  },
  info(...data: ReadonlyArray<any>) {
    this.print("[info]", data);
  },
  error(...data: ReadonlyArray<any>) {
    this.print("[error]", data);
  },
  warn(...data: ReadonlyArray<any>) {
    this.print("[warn]", data);
  },
  debug(...data: ReadonlyArray<any>) {
    this.print("[debug]", data);
  },
  assert(condition?: boolean, ...data: ReadonlyArray<any>) {
    if (condition)
      this.error(data.length ? data : [new Error("Assertion failed")]);
  },
  clear: clearLog,
  count(label: string = "default") {
    this.counts[label] ??= 0;
    this.print("[count]", [label + ":", this.counts[label]++]);
  },
  countReset(label: string = "default") {
    this.counts[label] &&= 0;
  },
  time(label: string = "default") {
    this.times[label] = performance.now();
  },
  timeEnd(label: string = "default") {
    this.print("[time]", [
      label + ":",
      performance.now() - this.times[label],
      "ms",
    ]);
    delete this.times[label];
  },
};
declare const performance: { now(): number };
declare interface Array<T> {
  includes(searchElement?: T, fromIndex?: number): boolean;
}
Array.prototype.includes = function (searchElement, fromIndex = 0) {
  return this.indexOf(searchElement, fromIndex) >= 0;
};