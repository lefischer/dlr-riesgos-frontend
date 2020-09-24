import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '../../http_client/http_client';
import { Cache, FakeCache } from '../../wps/cache';
import { WpsClient } from '../../wps/wpsclient';
import { WpsData, WpsVersion } from '../../wps/wps_datatypes';
import { Product, ProcessStateUnavailable, Process, ProcessState } from './riesgos.datatypes';


export interface WpsProduct extends Product {
    readonly value: WpsData;
}


export interface WpsProcess extends Process {
    readonly id: string;
    readonly description: string;
    readonly url: string;
    readonly wpsVersion: WpsVersion;
    readonly processVersion: string;
};


export class CWpsProcess implements WpsProcess {

    private wpsClient: WpsClient;

    constructor(
        readonly uid: string,
        readonly name: string,
        readonly requiredProducts: string[],
        readonly providedProducts: string[],
        readonly id: string,
        readonly description: string,
        readonly url: string,
        readonly wpsVersion: WpsVersion,
        readonly processVersion: string,
        readonly autoRunning: boolean,
        httpClient: HttpClient,
        public state = new ProcessStateUnavailable(),
        cache: Cache = new FakeCache()
        ) {
            this.wpsClient = new WpsClient(this.wpsVersion, httpClient, cache);
    }

    public execute(
        inputProducts: WpsProduct[],
        outputProducts: WpsProduct[],
        doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {

            const wpsInputs = inputProducts.map(prod => prod.value);
            const wpsOutputDescriptions = outputProducts.map(prod => prod.value.description);

            let requestCounter = 0;
            return this.wpsClient.executeAsync(this.url, this.id, wpsInputs, wpsOutputDescriptions, 2000,
                (response: any) => {
                    if (doWhileExecuting) {
                        doWhileExecuting(response, requestCounter);
                    }
                    requestCounter += 1;
                }
            ).pipe(

                map((outputs: WpsData[]) => {
                    const outputProductsWithValues: WpsProduct[] = [];
                    for (const output of outputs) {
                        const associatedProduct = outputProducts.find(p => p.value.description.id === output.description.id);
                        if (associatedProduct) {
                            outputProductsWithValues.push({
                                uid: associatedProduct.uid,
                                value: output
                            });
                        }
                    }
                    return outputProductsWithValues;
                }),

                catchError((error) => {
                    console.error(error);
                    return throwError(error);
                })
            );

    }

    public setCache(cache: Cache) {
        this.wpsClient.setCache(cache);
    }
}

export const isWpsProcess = (p: Process): p is WpsProcess => {
    return p.hasOwnProperty('url') && p.hasOwnProperty('state') && p.hasOwnProperty('wpsVersion');
};
