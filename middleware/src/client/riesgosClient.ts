import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "../http_client/http_client";
import { Process, Product, RiesgosScenarioData, RiesgosScenarioMetaData } from "../model/datatypes/riesgos.datatypes";
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

    executeProcess(process: Process, inputs: Product[], outputs: Product[]): Observable<Product[]> {
        
        const data$ = new Observable<Product[]>((listener) => {
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
}


