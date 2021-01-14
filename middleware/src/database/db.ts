import { Observable } from "rxjs";
import { Process, Product } from "../riesgos/datatypes/riesgos.datatypes";
import { RiesgosScenarioData, RiesgosScenarioMetadata } from "../riesgos/scenario_service/riesgos.service";


export interface RiesgosDatabase {
    getScenarioMetaData(id: string): Observable<RiesgosScenarioMetadata>;
    getScenarioData(id: string): Observable<RiesgosScenarioData>;
    addScenario(data: RiesgosScenarioData): Observable<boolean>;
    addProcess(data: Process): Observable<boolean>;
    addProduct(data: Product): Observable<boolean>;
};