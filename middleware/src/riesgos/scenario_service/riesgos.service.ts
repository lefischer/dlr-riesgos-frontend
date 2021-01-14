import { Observable } from "rxjs";



export interface RiesgosScenarioMetadata {
    id: string;
    title: string;
    description: string;
    preview: string;
}

export interface RiesgosScenarioData {
    metaData: RiesgosScenarioMetadata;
    processes: string[];
    products: string[];
}


export class RiesgosService {

    constructor() {}
    
    public getScenarioMetadata(id?: string): Observable<RiesgosScenarioMetadata[]> {
    }

    public getScenarioData(id: string): Observable<RiesgosScenarioData> {
    }

    public executeService(id: string) {

    }
}