import { Observable, of } from "rxjs";
import { Process, Product } from "../datatypes/riesgos.datatypes";
import { HttpClient } from "../../http_client/http_client";
import { FakeCache } from "@dlr-eoc/services-ogc";



export interface RiesgosScenarioMetadata {
    id: string;
    title: string;
    description: string;
    preview: string;
}

export interface RiesgosScenarioData {
    processes: Process[];
    products: Product[];
}


export class ScenarioService {
    httpClient: HttpClient;
    cache: FakeCache;

    constructor() {
        this.httpClient = new HttpClient();
        this.cache = new FakeCache();
    }
    
    public getScenarioMetadata(id: string): Observable<RiesgosScenarioMetadata> {
        switch (id) {
            default:
                throw new Error(`No such scenario ${id}`);
        }
    }

    public getScenarioData(id: string): Observable<RiesgosScenarioData> {

        let processes: Process[] = [];
        let products: Product[] = [];
        switch (id) {
            case 'c1':
                processes
            default:
                throw new Error(`Unknown scenario ${id}`);
        }

        return of({
            processes, products
        });
    }
}