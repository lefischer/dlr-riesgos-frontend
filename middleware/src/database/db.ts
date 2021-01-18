import { Observable } from "rxjs";
import { Process, Product, RiesgosScenarioData, RiesgosScenarioMetaData } from "../model/datatypes/riesgos.datatypes";


export interface RiesgosDatabase {
    getScenarios(): Observable<RiesgosScenarioMetaData[]>;
    getScenarioData(id: string): Observable<RiesgosScenarioData>;
    addScenario(data: RiesgosScenarioMetaData): Observable<boolean>;
    addProcess(data: Process): Observable<boolean>;
    addProduct(data: Product): Observable<boolean>;
};