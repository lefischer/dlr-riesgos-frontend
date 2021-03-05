import { Observable } from "rxjs";
import { RiesgosProcess, RiesgosProduct, RiesgosScenarioMetaData, RiesgosScenarioMetadata } from "../../model/datatypes/riesgos.datatypes";
import { RiesgosDatabase } from "../db";
import { MongoClient, Db } from 'mongodb';
import { map, tap } from "rxjs/operators";


export const createMongoDbInterface = (port: number, dbName: string): Observable<MongoDbRiesgosDatabase> => {
    
    const db$ = new Observable<Db>((s) => {
        const url = `mongodb://localhost:${port}`;
        MongoClient.connect(url, (err, client) => {
            if (err) {
                s.error(err);
            } else {
                const db = client.db(dbName);
                client.close();

                s.next(db);
                s.complete();
            }
        });
    });

    const dbIntf$ = db$.pipe(
        map((db: Db) => {
            return new MongoDbRiesgosDatabase(db);
        })
    );

    return dbIntf$;
};


export class MongoDbRiesgosDatabase implements RiesgosDatabase {

    constructor(private db: Db) {}

    getScenarioMetaData(id: string): Observable<RiesgosScenarioMetadata[]> {
        throw new Error("Method not implemented.");
    }

    getScenarioData(id: string): Observable<RiesgosScenarioMetaData> {
        const collection = this.db.collection('scenarios');

        const results$ = new Observable<RiesgosScenarioMetaData>((s) => {
            collection.find({});
        });

        return results$;
    }

    addScenario(data: RiesgosScenarioMetaData): Observable<boolean> {
        const collection = this.db.collection('scenarios');

        const results$ = new Observable<boolean>((s) => {
            collection.insertOne(data, (err, res) => {
                if (err) {
                    s.error(err);
                } else {
                    s.next(true);
                    s.complete();
                }
            });
        });

        return results$;
    }

    addProcess(data: RiesgosProcess): Observable<boolean> {
        const collection = this.db.collection('processes');

        const results$ = new Observable<boolean>((s) => {
            collection.insertOne(data, (err, res) => {
                if (err) {
                    s.error(err);
                } else {
                    s.next(true);
                    s.complete();
                }
            });
        });

        return results$;
    }

    addProduct(data: RiesgosProduct): Observable<boolean> {
        const collection = this.db.collection('products');

        const results$ = new Observable<boolean>((s) => {
            collection.insertOne(data, (err, res) => {
                if (err) {
                    s.error(err);
                } else {
                    s.next(true);
                    s.complete();
                }
            });
        });

        return results$;
    }

}