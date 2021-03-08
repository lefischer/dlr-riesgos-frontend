import { HttpClient } from "../http_client/http_client";
import { RiesgosProcess, RiesgosProduct } from "../model/datatypes/riesgos.datatypes";
import { RiesgosClient } from "./riesgosClient";
import { setUpServer } from "../server/server";
import { WpsBboxData, WpsBboxValue } from "../wps/public-api";
import { LowdbClient } from "../database/lowdb/lowdbClient";


beforeAll(() => {
    const db = new LowdbClient();
    const app = setUpServer(3000, db);
});


function getParameterValue(uid: string) {
    switch(uid) {
        case 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_input-boundingbox':
            const val: WpsBboxValue = {
                crs: 'EPSG:4326',
                lllat: -34,
                lllon: -73,
                urlat: -32,
                urlon: -69
            };
            return val;
        default:
            return null;
    }
}


describe('riesgos-client test-suite', () => {


    it('creating a test-scenario', () => {
        
    });

    it('Integration-test: running all scenarios and processes with default values', (done) => {

        const client = new RiesgosClient('localhost:3000', new HttpClient());
        client.getScenarios().subscribe(scenarios => {
            expect(scenarios).toBeTruthy();

            for(const scenario of scenarios) {
                client.getScenario(scenario.id).subscribe(scenario => {
                    expect(scenario).toBeTruthy();

                    const scenarioProductData = scenario.products;

                    for (const call of scenario.metaData.calls) {
                        const process = scenario.processes.find(p => p.uid === call.process) as RiesgosProcess;

                        // Finding inputs. Input-values come from what has already been obtained in previous steps (in `scenarioProductData`),
                        // or, alternatively, from default values.
                        const inputs: RiesgosProduct[] = call.inputs.map(match => match.product).map(inputId => {
                            const existingValue = scenarioProductData.find(prod => prod.uid === inputId);

                            if (existingValue?.value) {
                                return existingValue;
                            } else if (existingValue?.options) {
                                return {
                                    ...existingValue,
                                    value: existingValue.options[0]
                                }
                            } else {
                                throw Error(`Could not find a value for input ${existingValue?.uid}`);
                            }
                        });

                        // Finding outputs.
                        const outputs: RiesgosProduct[] = call.outputs.map(match => match.product).map(productId => ({
                            uid: productId,
                            value: null
                        }));

                        // Executing. Results are being stored in `scenarioProductData` to be used in future steps.
                        client.executeProcess(process, inputs, outputs).subscribe((results: RiesgosProduct[]) => {
                            for (const result of results) {
                                const entry = scenarioProductData.find(prod => prod.uid === result.uid);
                                if (entry) {
                                    // @ts-ignore
                                    entry.value = result.value;
                                }

                                expect(result.value).toBeTruthy();
                            }
                        });   
                    }

                });
            }

        
        });

    }, 60000);
});

