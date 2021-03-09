import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "../http_client/http_client";
import { Call, ProcessData, RiesgosProcess, RiesgosProduct, RiesgosScenarioData, RiesgosScenarioMetaData } from "../model/datatypes/riesgos.datatypes";
import WebSocket from 'ws';


/**
 * A client that calls server/server's API.
 * May be used by any frontend to abstract away concrete calls to the server.
 * (Mostly so that user doesn't have to make REST- and WS-calls himself)
 */
export class RiesgosClient {
    constructor(
        private url: string,
        private http: HttpClient) {}

    getScenarios(): Observable<RiesgosScenarioMetaData[]> {
        return this.http.get('http://' + this.url + '/getScenarioMetaData').pipe(
            map((result: string) => JSON.parse(result))
        );
    }

    getScenario(id: string): Observable<RiesgosScenarioData> {
        return this.http.get('http://' + this.url + '/getScenarioData/' + id).pipe(
            map((result: string) => JSON.parse(result))
        );
    }

    executeProcess(process: RiesgosProcess, inputs: ProcessData[], outputs: ProcessData[]): Observable<ProcessData[]> {
        
        const data$ = new Observable<ProcessData[]>((listener) => {
            const client = new WebSocket('ws://' + this.url + '/executeProcess');
            client.on('open', () => {
                client.send(JSON.stringify({process, inputs, outputs}));
            });
            client.on('message', (data) => {
                const parsed = JSON.parse(data.toString());
                listener.next(parsed);
                listener.complete();
            });
        });

        return data$;
    }

    /**
     * A wrapper around `executeProcess` that handles the conversion of `RiesgosProduct` to `ProcessData` and back for us.
     * @param call 
     * @param scenario 
     */
    executeCall(call: Call, scenario: RiesgosScenarioData): Observable<RiesgosScenarioData> {

        const process = scenario.processes.find(p => p.uid === call.process) as RiesgosProcess;

        // Finding inputs.
        const inputs: ProcessData[] = call.inputs.map(i => {
            const existingEntry = scenario.products.find(prod => prod.uid === i.product);
            if (!existingEntry) throw new Error(`Could not find existing data for ${i.product}`);
            if (!existingEntry.value) throw new Error(`No value given for entry ${i.product}`);

            return {
                slotId: i.slot,
                value: existingEntry
            };
        })

        // Finding outputs.
        const outputs: ProcessData[] = call.outputs.map(o => {
            const existingEntry = scenario.products.find(prod => prod.uid === o.product);
            if (!existingEntry) throw new Error(`Could not find existing data for ${o.product}`);
            return {
                slotId: o.slot,
                value: existingEntry
            };
        });

        // Executing. Results are being stored in `scenarioProductData` to be used in future steps.
        return this.executeProcess(process, inputs, outputs).pipe(
            map((results: ProcessData[]) => results.map(r => r.value)),
            map((results: RiesgosProduct[]) => {
                for (const result of results) {
                    const original = scenario.products.find(p => p.uid === result.uid);
                    if (original) {
                        // @ts-ignore
                        original.value = result.value;
                    }
                }
                return scenario;
            })
        );

    }
}


