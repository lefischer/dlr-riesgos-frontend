import { Observable, of } from "rxjs";
import { Process, Product, RiesgosScenarioMetaData, RiesgosScenarioMetadata } from "../../model/datatypes/riesgos.datatypes";
import { RiesgosDatabase } from "../db";
const fs = require('fs');


export class TextFileRiesgosDatabase implements RiesgosDatabase {

    constructor(private baseDir: string) {}

    getScenarioMetaData(id: string): Observable<RiesgosScenarioMetadata[]> {
        throw new Error("Method not implemented.");
    }

    getScenarioData(id: string): Observable<RiesgosScenarioMetaData> {
        throw new Error("Method not implemented.");
    }

    addScenario(scenario: RiesgosScenarioMetaData): Observable<boolean> {
        return of(false);
    }

    addProcess(process: Process): Observable<boolean> {
        const path = `${this.baseDir}/processes/`
        const fileName = `${this.cleanString(process.uid)}.json`;
        const body = JSON.stringify(process, null, 4);
        this.writeToFile(path, fileName, body);
        return of(true);
    }

    addProduct(product: Product): Observable<boolean> {
        const path = `${this.baseDir}/products/`;
        const fileName = `${this.cleanString(product.uid)}.json`;
        const body = JSON.stringify(product, null, 4);
        this.writeToFile(path, fileName, body);
        return of(true);
    }

    private writeToFile(path: string, fileName: string, text: string) {
        path = path.replace(/\/$/, "");
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
        fs.writeFile(`${path}/${fileName}`, text, (err: any) => {
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