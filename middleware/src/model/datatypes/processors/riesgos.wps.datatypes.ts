import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '../../../http_client/http_client';
import { Cache, FakeCache } from '../../../wps/lib/cache';
import { WpsClient } from '../../../wps/lib/wpsclient';
import { WpsData, WpsVersion } from '../../../wps/lib/wps_datatypes';
import { RiesgosProduct, ExecutableProcess, ProcessData } from '../riesgos.datatypes';

interface WpsRiesgosProduct extends RiesgosProduct {
    value: WpsData;
}

export interface WpsProcessData extends ProcessData {
    readonly value: WpsRiesgosProduct; 
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
        inputProducts: WpsProcessData[],
        outputProducts: WpsProcessData[]): Observable<WpsProcessData[]> {

            const wpsInputs = inputProducts.map(prod => prod.value.value);
            const wpsOutputDescriptions = outputProducts.map(prod => prod.value.value.description);

            return this.wpsClient.executeAsync(this.serverUrl, this.wpsProcessId, wpsInputs, wpsOutputDescriptions, 2000).pipe(
                map((outputs: WpsData[]) => {
                    const outputProductsWithValues: WpsProcessData[] = [];
                    for (const output of outputs) {
                        const associatedProduct = outputProducts.find(p => p.value.value.description.id === output.description.id);
                        if (associatedProduct) {
                            outputProductsWithValues.push({
                                slotId: associatedProduct.slotId,
                                value: {
                                    ... associatedProduct.value,
                                    value: output
                                }
                            });
                        }
                    }
                    return outputProductsWithValues;
                })
            );

    }
}

