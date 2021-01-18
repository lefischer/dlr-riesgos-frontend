import { RiesgosScenarioData, RiesgosService } from "../model/riesgos.service";
import { WorkflowControl } from "../model/workflowcontrol/riesgos.workflowcontrol";

export class IntegrationTester {
    metaData: any;

    constructor(
        private scenarioService: ScenarioService) { }
        
    public testScenario(scenarioId: string) {

        this.scenarioService.getScenarioData(scenarioId).subscribe((data: RiesgosScenarioData) => {

            const wfc = new WorkflowControl(data.processes, data.products);

            for (const process of wfc.getImmutableProcesses()) {
                const inputs = wfc.getProcessInputs(process.uid);
                for (const input of inputs) {
                    if (!input.value) {
                        throw new Error(`Could not get a value for product ${input.uid}!`);
                    }
                    wfc.execute(process.uid).subscribe(results => {
                        console.log(`Executed ${process.uid}. Results: `, results);
                    });
                }
            }
        });
    }
}
