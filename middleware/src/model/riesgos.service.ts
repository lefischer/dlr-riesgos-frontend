import { Observable, throwError } from "rxjs";
import { RiesgosDatabase } from "../database/db";
import { HttpClient } from "../http_client/http_client";
import { Cache as WpsCache } from "../wps/lib/cache";
import { ExecutableProcess, RiesgosProcess, RiesgosProduct, RiesgosScenarioData, RiesgosScenarioMetaData } from "./datatypes/riesgos.datatypes";
import { RiesgosExecutableWpsProcess, RiesgosWpsProcess } from "./datatypes/riesgos.wps.datatypes";





export class RiesgosService {

    constructor(
        private db: RiesgosDatabase,
        private httpClient: HttpClient,
        private wpsCache: WpsCache
    ) {}
    
    public getScenarios(): Observable<RiesgosScenarioMetaData[]> {
        return this.db.getScenarios();
    }

    public getScenarioData(id: string): Observable<RiesgosScenarioData> {
        return this.db.getScenarioData(id);
    }

    public executeService(process: RiesgosProcess, inputs: RiesgosProduct[], outputs: RiesgosProduct[]): Observable<RiesgosProduct[]> {
        for (const input of inputs) {
            if (input.value === 'undefined') {
                throw new Error(`No value given for input ${input.uid}`);
            }
        }

        let output$;

        switch (process.concreteClassName) {
            case 'ExecutableWpsProcess':
                const service = new RiesgosExecutableWpsProcess(
                    process.uid,
                    process.name,
                    process.requiredProducts,
                    process.providedProducts,
                    process.uid,
                    process.description || '',
                    (process as RiesgosWpsProcess).url,
                    (process as RiesgosWpsProcess).wpsVersion,
                    (process as RiesgosWpsProcess).processVersion,
                    false,
                    this.httpClient,
                    this.wpsCache
                );
                output$ = service.execute(inputs, outputs);
                break;
            default:
                output$ = throwError('This process is not of any known concrete class. Aborting.');
        }

        return output$;
    }
}