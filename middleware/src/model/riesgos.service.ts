import { Observable, throwError } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { RiesgosDatabase } from "../database/db";
import { ExecutableProcess, ProcessData, RiesgosProcess, RiesgosProduct, RiesgosScenarioData, RiesgosScenarioMetaData } from "./datatypes/riesgos.datatypes";


/**
 * Backend-side controller for all Riesgos-business-logic.
 * The express-app calls this classes' methods to retrieve scenario-information
 * or execute services.
 */
export class RiesgosService {

    constructor(
        private db: RiesgosDatabase,

    ) {}
    
    public getScenarios(): Observable<RiesgosScenarioMetaData[]> {
        return this.db.getScenarios();
    }

    public getScenarioData(id: string): Observable<RiesgosScenarioData> {
        return this.db.getScenarioData(id).pipe(
            tap((data: RiesgosScenarioData) => {
                // @ts-ignore
                if (data.products.includes(undefined)) {
                    throw Error(`At least one of the requested products could not be found in the database`);
                }
            })
        );
    }

    public executeService(process: RiesgosProcess, inputs: ProcessData[], outputs: ProcessData[]): Observable<ProcessData[]> {
        for (const input of inputs) {
            if (input.value.value === null) {
                throw new Error(`No value given for input ${input.value.uid} on slot ${input.slotId}`);
            }
        }

        return this.db.getExecutableProcess(process.uid).pipe(
            switchMap((executableProcess: ExecutableProcess) => {
                return executableProcess.execute(inputs, outputs);
            })
        );
    }
}