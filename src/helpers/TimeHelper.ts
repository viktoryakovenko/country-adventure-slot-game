export enum ETimeUnit {
    mls,
    sec,
    min,
}

export class TimeUnit {
    static mls = new TimeUnit(ETimeUnit.mls);
    static sec = new TimeUnit(ETimeUnit.sec);
    static min = new TimeUnit(ETimeUnit.min);

    private constructor(private timeUnit: ETimeUnit) {

    }

    toMillis(duration: number): number {
        switch (this.timeUnit) {
            case ETimeUnit.mls:
                return duration;
            case ETimeUnit.sec:
                return duration * 1000;
            case ETimeUnit.min:
                return duration * 60 * 1000;
        }
    }

    toSeconds(duration: number): number {
        return this.toMillis(duration) / 1000;
    }

    toMinutes(duration: number): number {
        return this.toSeconds(duration) / 60;
    }

    async await(duration: number) {
        await promiseDelay(duration, this);
    }
}

export function promiseDelay(delay: number, timeUnit: TimeUnit = TimeUnit.mls) {
    return new Promise<void>(resolve => {
        setTimeout(resolve, timeUnit.toMillis(delay));
    });
}

type Duration = {duration: number, timeUnit: TimeUnit};
type PromiseOptions = {duration: Duration, interval: Duration};

export const promise = Object.assign((awaitChecker: () => boolean, options: PromiseOptions) => {
    const interval = options.interval;
    const duration = options.duration;
    const time = Date.now();
    const promiseAwaitDuration = duration.timeUnit.toMillis(duration.duration);
    const timeout = interval.timeUnit.toMillis(interval.duration);
    return new Promise<void>((resolve, reject) => {
        const intervalId = setInterval(() => {
            if (awaitChecker()) {
                clearInterval(intervalId);
                resolve();
                return;
            }
            if (Date.now() - time > promiseAwaitDuration) {
                clearInterval(intervalId);
                reject(new Error("Wait time expired"));
            }
        }, timeout);
    });
}, {
    in: (timeUnit: TimeUnit) => {
        return {
            tobe: (awaitChecker: () => boolean, duration: number, interval: number) => {
                return promise(awaitChecker, {
                    duration: {timeUnit, duration},
                    interval: {timeUnit, duration: interval},
                });
            },
        };
    },
});
