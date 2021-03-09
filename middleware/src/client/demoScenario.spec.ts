import { unlinkSync } from 'fs';
import { Server } from 'http';
import { of } from 'rxjs';
import { pipeFromArray } from 'rxjs/internal/util/pipe';
import { map, mergeMap, tap } from 'rxjs/operators';
import { RiesgosDatabase } from "../database/db";
import { LowdbClient } from "../database/lowdb/lowdbClient";
import { HttpClient } from '../http_client/http_client';
import { Call, ProcessData, RiesgosProcess, RiesgosProduct, RiesgosScenarioData } from '../model/datatypes/riesgos.datatypes';
import { setUpServer } from '../server/server';
import { RiesgosClient } from './riesgosClient';



let db: RiesgosDatabase;
let app: Server;


beforeAll(() => {
    db = new LowdbClient('data/test_db.json');
    app = setUpServer(3000, db);

    db.addProduct({
        uid: 'Tomato',
        scenario: 'Soup',
        value: 'tomato'
    });

    db.addProduct({
        uid: 'Zucchini',
        scenario: 'Soup',
        value: 'zucchini'
    });

    db.addProduct({
        uid: 'ChoppedZucchini',
        scenario: 'Soup',
        value: null
    });

    db.addProduct({
        uid: 'ChoppedTomato',
        scenario: 'Soup',
        value: null
    });

    db.addProduct({
        uid: 'Broth',
        scenario: 'Soup',
        options: ['vegetable broth', 'chicken broth'],
        value: null
    });

    db.addProduct({
        uid: 'Sauce',
        scenario: 'Soup',
        value: null
    });

    db.addProduct({
        uid: 'Soup',
        scenario: 'Soup',
        value: null
    });

    db.addProcess({
        uid: 'Cooking',
        inputSlots: ['ingredient1', 'ingredient2'],
        outputSlots: ['cookedStuff'],
    });

    db.addProcess({
        uid: 'Chopping',
        inputSlots: ['ingredient'],
        outputSlots: ['choppedIngredient']
    });

    db.addProcess({
        uid: 'Blending',
        inputSlots: ['ingredient1', 'ingredient2'],
        outputSlots: ['blendedIngredients']
    });

    db.addScenario({
        id: 'Soup',
        calls: [
            {
                process: 'Chopping',
                inputs: [{
                    product: 'Zucchini',
                    slot: 'ingredient',
                }],
                outputs: [{
                    slot: 'choppedIngredient',
                    product: 'ChoppedZucchini'
                }]
            },
            {
                process: 'Chopping',
                inputs: [{
                    product: 'Tomato',
                    slot: 'ingredient'
                }],
                outputs: [{
                    slot: 'choppedIngredient',
                    product: 'ChoppedTomato'
                }]
            },
            {
                process: 'Blending',
                inputs: [{
                    product: 'ChoppedTomato',
                    slot: 'ingredient1'
                }, {
                    product: 'Broth',
                    slot: 'ingredient2'
                }],
                outputs: [{
                    slot: 'blendedIngredients',
                    product: 'Sauce'
                }]
            },
            {
                process: 'Cooking',
                inputs: [{
                    product: 'ChoppedZucchini',
                    slot: 'ingredient1'
                }, {
                    product: 'Sauce',
                    slot: 'ingredient2'
                }],
                outputs: [{
                    slot: 'cookedStuff',
                    product: 'Soup'
                }]
            },
        ]


    });

});

describe('Demo-Scenario Test-Suite', () => {

    it('Running all demo-scenarios and processes with default values', (done) => {

        const client = new RiesgosClient('localhost:3000', new HttpClient());
        client.getScenarios().subscribe(scenarios => {
            expect(scenarios).toBeTruthy();

            for (const scenario of scenarios) {
                client.getScenario(scenario.id).subscribe(scenario => {
                    expect(scenario).toBeTruthy();

                    function callProcess(call: Call, scenario: RiesgosScenarioData) {
                        console.log(`Calling ${call.process}(${call.inputs.map(i => i.product).join(', ')}) = [${call.outputs.map(o => o.product).join(', ')}]`);

                        const process = scenario.processes.find(p => p.uid === call.process) as RiesgosProcess;

                        // Finding inputs. Input-values come from what has already been obtained in previous steps (in `scenarioProductData`),
                        // or, alternatively, from default values.
                        const inputs: ProcessData[] = call.inputs.map(i => {
                            const existingEntry = scenario.products.find(prod => prod.uid === i.product);
                            if (!existingEntry) throw new Error(`Could not find existing data for ${i.product}`);

                            if (!existingEntry.value) {
                                if (existingEntry.options?.length) {
                                    //@ts-ignore
                                    existingEntry.value = existingEntry.options[0];
                                }
                            }

                            return {
                                slotId: i.slot,
                                value: existingEntry
                            };
                        })

                        // Finding outputs.
                        const outputs: ProcessData[] = call.outputs.map(o => {
                            const existingEntry = scenario.products.find(prod => prod.uid === o.product);
                            if (!existingEntry) throw new Error(`Could not find existing data for ${o.product}`);
                            return {
                                slotId: o.slot,
                                value: existingEntry
                            };
                        });

                        // Executing. Results are being stored in `scenarioProductData` to be used in future steps.
                        return client.executeProcess(process, inputs, outputs).pipe(
                            map((results: ProcessData[]) => {
                                for (const result of results) {
                                    for (const product of scenario.products) {
                                        if (product.uid === result.value.uid) {
                                            // @ts-ignore
                                            product.value = result.value.value;
                                        }
                                    }
                                }
                                return scenario;
                            })
                        );
                    }

                    const ops = scenario.metaData.calls.map(call =>
                        mergeMap((scenario: RiesgosScenarioData) => callProcess(call, scenario))
                    );

                    pipeFromArray(ops)(of(scenario)).subscribe((val: RiesgosScenarioData) => {
                       const unsetData = val.products.filter(p => p.value === null);
                       expect(unsetData.length).toEqual(0);
                       const soupData = val.products.find(p => p.uid === 'Soup') as RiesgosProduct;
                       expect(soupData.value).toEqual('cooked chopped zucchini, blended chopped tomato, vegetable broth');
                       console.log(`Completed scenario ${scenario.metaData.id}`);
                   });

                });
            }

            setTimeout(() => {
                done();
            }, 9500);

        });

    }, 10000);

});

afterAll(() => {
    unlinkSync('data/test_db.json');
});