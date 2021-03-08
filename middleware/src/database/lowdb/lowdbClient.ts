import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { Observable, of } from 'rxjs';
import { BlendingSvc, ChoppingSvc, CookingSvc } from '../../model/datatypes/processors/cooking.datatypes';
import { ExecutableProcess, RiesgosProcess, RiesgosProduct, RiesgosScenarioData, RiesgosScenarioMetaData } from '../../model/datatypes/riesgos.datatypes';
import { RiesgosDatabase } from '../db';




export class LowdbClient implements RiesgosDatabase {
    
    private db: lowdb.LowdbSync<any>;

    constructor(dbPath = 'data/db.json') {
        const adapter = new FileSync(dbPath);
        this.db = lowdb(adapter);
        this.db.defaults({
            scenarios: [],
            processes: [],
            products: [],
        }).write();
    }

    getExecutableProcess(id: string): Observable<ExecutableProcess> {
        switch(id) {
            case 'Chopping':
                return of(new ChoppingSvc());
            case 'Blending':
                return of(new BlendingSvc());
            case 'Cooking':
                return of(new CookingSvc());
            default:
                throw Error(`Couldn't find a concrete class for ${id}`);
        }
    }

    getScenarios(): Observable<RiesgosScenarioMetaData[]> {
        return of(this.db.get('scenarios').value());
    }

    getScenarioData(id: string): Observable<RiesgosScenarioData> {
        // @ts-ignore
        const scenarioMetaData: RiesgosScenarioMetaData = this.db.get('scenarios').find({ id }).value();
        
        const processes = this.getProcessesForScenario(scenarioMetaData);

        const products = this.getProductsForScenario(scenarioMetaData);

        return of({
            metaData: scenarioMetaData,
            processes: processes,
            products: products,
        });
    }
    
    private getProductsForScenario(scenarioMetaData: RiesgosScenarioMetaData): RiesgosProduct[] {
        const productIds: string[] = [];
        for (const call of scenarioMetaData.calls) {
            for (const iId of call.inputs.map(m => m.product)) {
                if (!productIds.includes(iId)) {
                    productIds.push(iId);
                }
            }

            for (const oId of call.outputs.map(m => m.product)) {
                if (!productIds.includes(oId)) {
                    productIds.push(oId);
                }
            }
        }

        // @ts-ignore
        const products = productIds.map(pId => this.db.get('products').find({ uid: pId }).value());

        return products;
    }

    private getProcessesForScenario(scenarioMetaData: RiesgosScenarioMetaData): RiesgosProcess[] {
        const processIds: string[] = [];
        for (const call of scenarioMetaData.calls) {
            if (!processIds.includes(call.process)) {
                processIds.push(call.process);
            }
        }

        // @ts-ignore
        const processes = processIds.map(pId => this.db.get('processes').find({ uid: pId }).value());
        return processes;
    }

    addScenario(data: RiesgosScenarioMetaData): Observable<boolean> {
        // @ts-ignore
        this.db.get('scenarios').push(data).write();
        return of(true);
    }

    addProcess(data: RiesgosProcess): Observable<boolean> {
        // @ts-ignore
        this.db.get('processes').push(data).write();
        return of(true);
    }

    addProduct(data: RiesgosProduct): Observable<boolean> {
        // @ts-ignore
        this.db.get('products').push(data).write();
        return of(true);
    }

}