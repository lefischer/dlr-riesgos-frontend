import { Observable, timer, of, forkJoin, throwError } from 'rxjs';
import { tap, map, mergeMap, retryWhen, delay } from 'rxjs/operators';
import { Predicate } from '@angular/core';




export function pollEveryUntil<T>(
    task$: Observable<T>, predicate: Predicate<T>, doWhile?: (t: T | null) => any, minWaitTime: number = 1000): Observable<T> {

    if (doWhile) {
        doWhile(null);
    }

    const tappedTask$ = task$.pipe(
        tap(r => {
            if (doWhile) {
                doWhile(r);
            }
        })
    );

    const requestTakesAtLeast$ = forkJoin({req: tappedTask$, timer: timer(minWaitTime)}).pipe(
        map(r => r.req)
    );

    const polledRequest$ = requestTakesAtLeast$.pipe(
        mergeMap(response => {
            if (predicate(response)) {
                // console.log(`obtained correct answer ${response}`);
                return of(response);
            } else {
                // console.log(`obtained false answer ${response}. trying again...`);
                return polledRequest$;
            }
        })
    );

    return polledRequest$;
}


export function delayedRetry(delayMs: number, maxRetries = 3) {
    let attempts = 1;

    return (src$: Observable<any>) => {
        return src$.pipe(
            // If an error occurs ...
            retryWhen((error$: Observable<any>) => {
                return error$.pipe(
                    delay(delayMs), // <- in any case, first wait a little while ...
                    mergeMap(error => {
                        if (error.status && error.status === 400) {
                            // In case of a server error, repeating won't help.
                            throw error;
                        } else if (attempts <= maxRetries) {
                            console.log('http-error. Retrying ...');
                            attempts += 1;
                            return of(error); // <- an observable causes request to be retried
                        } else {
                            console.log(`Persistent http-errors after ${attempts} attempts. Giving up.`);
                            throw error; // an error causes request to be given up on.
                        }
                    })
                );
            })
        );
    };

}
