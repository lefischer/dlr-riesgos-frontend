import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "./http_client/http_client";
import { Process, Product, RiesgosScenarioData, RiesgosScenarioMetaData } from "./model/datatypes/riesgos.datatypes";
import WebSocket from 'ws';


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


const client = new RiesgosClient('localhost:3000', new HttpClient());

client.getScenarios().subscribe(scenarios => {
    const s0 = scenarios[0];
    client.getScenario(s0.id).subscribe(scenario => {
        
        const p0 = scenario.processes[0];
        const inputs = scenario.products.filter(p => p0.requiredProducts.includes(p.uid));
        const outputs = scenario.products.filter(p => p0.providedProducts.includes(p.uid));
        
        client.executeProcess(p0, inputs, outputs).subscribe((results: Product[]) => {
            console.log('frontend execution results: ', results);
        }, (error) => console.log('error: ', error));
    })

});