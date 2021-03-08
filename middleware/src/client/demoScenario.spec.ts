import { unlinkSync } from 'fs';
import { Server } from 'http';
import { RiesgosDatabase } from "../database/db";
import { LowdbClient } from "../database/lowdb/lowdbClient";
import { HttpClient } from '../http_client/http_client';
import { RiesgosProcess, RiesgosProduct } from '../model/datatypes/riesgos.datatypes';
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

                    /**
                     * @TODO @TODO @TODO @TODO @TODO @TODO @TODO :
                     * Wait until one call is done before starting work on the next one.
                     */

                    const scenarioProductData = scenario.products;

                    // Executing all calls in scenario.
                    for (const call of scenario.metaData.calls) {

                        const process = scenario.processes.find(p => p.uid === call.process) as RiesgosProcess;

                        // Finding inputs. Input-values come from what has already been obtained in previous steps (in `scenarioProductData`),
                        // or, alternatively, from default values.
                        const inputs: RiesgosProduct[] = call.inputs.map(match => match.product).map(inputId => {
                            const existingValue = scenarioProductData.find(prod => prod.uid === inputId);

                            if (existingValue?.value) {
                                return existingValue;
                            }  else if (existingValue?.options) {
                                return {
                                    ...existingValue,
                                    value: existingValue.options[0]
                                }
                            } else {
                                throw Error(`Could not find a value for input ${existingValue?.uid}`);
                            }
                        });

                        // Finding outputs.
                        const outputs: RiesgosProduct[] = call.outputs
                            .map(match => match.product)
                            .map(productId => scenarioProductData.find(prod => prod.uid === productId) as RiesgosProduct);

                        // Executing. Results are being stored in `scenarioProductData` to be used in future steps.
                        client.executeProcess(process, inputs, outputs).subscribe((results: RiesgosProduct[]) => {
                            for (const result of results) {
                                const entry = scenarioProductData.find(prod => prod.uid === result.uid);
                                if (entry) {
                                    // @ts-ignore
                                    entry.value = result.value;
                                }
                            }
                        });

                    }


                    setTimeout(() => {
                        const unsetData = scenarioProductData.filter(p => p.value === null);
                        expect(unsetData.length).toEqual(0);
                    }, 10);
                });
            }

        });

        setTimeout(() => {
            done();
        }, 1000);

    }, 10000);

});

afterAll(() => {
    unlinkSync('data/test_db.json');
});