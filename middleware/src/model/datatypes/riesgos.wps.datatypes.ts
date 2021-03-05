import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '../../http_client/http_client';
import { Cache, FakeCache } from '../../wps/lib/cache';
import { WpsClient } from '../../wps/lib/wpsclient';
import { WpsData, WpsVersion } from '../../wps/lib/wps_datatypes';
import { RiesgosProduct, RiesgosProcess, Executable } from './riesgos.datatypes';


export interface RiesgosWpsProduct extends RiesgosProduct {
    readonly value: WpsData;
}


export interface RiesgosWpsProcess extends RiesgosProcess {
    readonly id: string;
    readonly description: string;
    readonly url: string;
    readonly wpsVersion: WpsVersion;
    readonly processVersion: string;
};


export class RiesgosExecutableWpsProcess implements RiesgosWpsProcess, Executable {

    concreteClassName = 'ExecutableWpsProcess';
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
        cache: Cache = new FakeCache(),
        ) {
            this.wpsClient = new WpsClient(this.wpsVersion, httpClient, cache);
        }


    public execute(
        inputProducts: RiesgosWpsProduct[],
        outputProducts: RiesgosWpsProduct[]): Observable<RiesgosProduct[]> {

            const wpsInputs = inputProducts.map(prod => prod.value);
            const wpsOutputDescriptions = outputProducts.map(prod => prod.value.description);

            return this.wpsClient.executeAsync(this.url, this.id, wpsInputs, wpsOutputDescriptions, 2000).pipe(
                map((outputs: WpsData[]) => {
                    const outputProductsWithValues: RiesgosWpsProduct[] = [];
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
                })
            );

    }
}

export const isWpsProcess = (p: RiesgosProcess): p is RiesgosWpsProcess => {
    return p.hasOwnProperty('url') && p.hasOwnProperty('state') && p.hasOwnProperty('wpsVersion');
};
