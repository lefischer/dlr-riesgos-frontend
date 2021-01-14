import { Observable, of } from "rxjs";
import { Process, Product } from "../../riesgos/datatypes/riesgos.datatypes";
import { RiesgosScenarioMetadata, RiesgosScenarioData } from "../../riesgos/scenario_service/riesgos.service";
import { RiesgosDatabase } from "../db";
const fs = require('fs');


export class TextFileRiesgosDatabase implements RiesgosDatabase {

    private baseDir = 'src/data/';

    getScenarioMetaData(id: string): Observable<RiesgosScenarioMetadata> {
        throw new Error("Method not implemented.");
    }

    getScenarioData(id: string): Observable<RiesgosScenarioData> {
        throw new Error("Method not implemented.");
    }

    addScenario(scenario: RiesgosScenarioData): Observable<boolean> {
        return of(false);
    }

    addProcess(process: Process): Observable<boolean> {
        const fileName = `${this.baseDir}/processes/${this.cleanString(process.uid)}.json`;
        const body = JSON.stringify(process, null, 4);
        this.writeToFile(fileName, body);
        return of(true);
    }

    addProduct(product: Product): Observable<boolean> {
        const fileName = `${this.baseDir}/products/${this.cleanString(product.uid)}.json`;
        const body = JSON.stringify(product, null, 4);
        this.writeToFile(fileName, body);
        return of(true);
    }

    private writeToFile(fileName: string, text: string) {
        fs.writeFile(fileName, text, (err: any) => {
            if (err) {
                throw err;
            } else {
                console.log(`Wrote out ${fileName}`);
            }
        });
    }

    private cleanString (str: string): string {
        return str.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
    }

    private readFile(fileName: string) {
        const data = fs.readFileSync(fileName, 'utf-8');
        return JSON.parse(data);
    }

}