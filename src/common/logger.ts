
class Logger {
    constructor() {
        console.log = null;
    }

    info(...args: any[]) {
        this.log(1, ...args);
    }

    error(...args: any[]) {
        this.log(0, ...args);
    }

    log(level: number, ...args: any[]) {
        console.log(args[0], ...(args.slice(1)));
    }

}

export let logger = {
    info: console.log,
    error: console.log,
    ui: console.log,
    // ui: (...params) => {}
};