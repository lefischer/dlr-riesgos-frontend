import { HttpClient } from "../http_client/http_client";
import { RiesgosProduct } from "../model/datatypes/riesgos.datatypes";
import { RiesgosClient } from "./riesgosClient";
import { setUpServer } from "../server/server";


beforeAll(() => {
    const app = setUpServer(3000);
});

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

                    for (const process of scenario.processes) {
                        const inputs = scenario.products.filter(p => process.requiredProducts.includes(p.uid)); // 
                        inputs.map(i => {
                            // if (i instanceof WpsProduct) {
                                if (i.value.value === undefined) {
                                    i.value.value = i.value.description.defaultValue;
                                }
                            // }
                        });
                        const outputs = scenario.products.filter(p => process.providedProducts.includes(p.uid));
                        
                        client.executeProcess(process, inputs, outputs).subscribe((results: RiesgosProduct[]) => {
                            
                            for (const result of results) {
                                expect(result.value).toBeTruthy();
                            }

                            done();
    
                        }, (error) => console.log('error: ', error));
                    }

                });
            }

        
        });

    }, 60000);
});

