import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '../../../http_client/http_client';
import { Cache, FakeCache } from '../../../wps/lib/cache';
import { WpsClient } from '../../../wps/lib/wpsclient';
import { WpsData, WpsVersion } from '../../../wps/lib/wps_datatypes';
import { RiesgosProduct, ExecutableProcess } from '../riesgos.datatypes';


export interface RiesgosWpsProduct extends RiesgosProduct {
    readonly value: WpsData;
}


export class ExecutableWpsProcess implements ExecutableProcess {

    private wpsClient: WpsClient;

    constructor(
        private serverUrl: string,
        private wpsProcessId: string,
        wpsVersion: WpsVersion,
        httpClient: HttpClient,
        cache: Cache = new FakeCache(),
        ) {
            this.wpsClient = new WpsClient(wpsVersion, httpClient, cache);
        }


    public execute(
        inputProducts: RiesgosWpsProduct[],
        outputProducts: RiesgosWpsProduct[]): Observable<RiesgosProduct[]> {

            const wpsInputs = inputProducts.map(prod => prod.value);
            const wpsOutputDescriptions = outputProducts.map(prod => prod.value.description);

            return this.wpsClient.executeAsync(this.serverUrl, this.wpsProcessId, wpsInputs, wpsOutputDescriptions, 2000).pipe(
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

