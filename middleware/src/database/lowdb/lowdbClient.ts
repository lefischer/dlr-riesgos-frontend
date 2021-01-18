import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { Observable, of } from 'rxjs';
import { Process, Product, RiesgosScenarioData, RiesgosScenarioMetaData } from '../../model/datatypes/riesgos.datatypes';
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

    getScenarios(): Observable<RiesgosScenarioMetaData[]> {
        return of(this.db.get('scenarios').value());
    }

    getScenarioData(id: string): Observable<RiesgosScenarioData> {
        // @ts-ignore
        const scenarioMetaData: RiesgosScenarioMetaData = this.db.get('scenarios').find({ id }).value();
        // @ts-ignore
        const processes = scenarioMetaData.processes.map(pId => this.db.get('processes').find({ uid: pId }).value());
        // @ts-ignore
        const products = scenarioMetaData.products.map(pId => this.db.get('products').find({ uid: pId }).value());

        return of({
            metaData: scenarioMetaData,
            processes, products
        });
    }

    addScenario(data: RiesgosScenarioMetaData): Observable<boolean> {
        // @ts-ignore
        this.db.get('scenarios').push(data).write();
        return of(true);
    }

    addProcess(data: Process): Observable<boolean> {
        // @ts-ignore
        this.db.get('processes').push(data).write();
        return of(true);
    }

    addProduct(data: Product): Observable<boolean> {
        // @ts-ignore
        this.db.get('products').push(data).write();
        return of(true);
    }


}