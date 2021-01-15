import { HttpClient } from "../../http_client/http_client";
import { ProcessStateUnavailable } from "../../riesgos/datatypes/riesgos.datatypes";
import { ExecutableWpsProcess, WpsProcess, WpsProduct } from "../../riesgos/datatypes/riesgos.wps.datatypes";
import { WpsProcessDescription, WpsServerDescription, WpsClient, WpsData, WpsHttpClient, WpsCapability } from "../../wps/public-api";
import { RiesgosDatabase } from "../db";


export class WpsHarvester {

    constructor(
        private httpClient: HttpClient,
        private db: RiesgosDatabase
    ) {}

    public harvestAllData(server: WpsServerDescription) {
        const wpsClient = new WpsClient(server.serverVersion, this.httpClient);

        wpsClient.getCapabilities(server.serverUrl).subscribe((caps: WpsCapability[]) => {
            for (const cap of caps) {
                this.downloadWpsProcessData(server, cap.id);
            }
        });
    }
    
    private downloadWpsProcessData(server: WpsServerDescription, processId: string) {
        const wpsClient = new WpsClient(server.serverVersion, this.httpClient);
        wpsClient.describeProcess(server.serverUrl, processId).subscribe((result: WpsProcessDescription) => {

            const process = this.getWpsProcess(server, result);

            this.db.addProcess(process);

            for (const input of result.inputs) {
                const product = this.getWpsProduct(process.uid + '_' + input.description.id, input);
                this.db.addProduct(product);
            }

            for (const output of result.outputs) {
                const product = this.getWpsProduct(process.uid + '_' + output.description.id, output);
                this.db.addProduct(product);
            }

        });
    }

    private getWpsProduct(uid: string, wpsData: WpsData): WpsProduct {
        return {
            uid, value: wpsData
        };
    }
    
    private getWpsProcess (server: WpsServerDescription, description: WpsProcessDescription): WpsProcess {

        return {
            uid: server.serverUrl + '_' + description.id,
            id: description.id,
            autoRunning: false,
            description: description.description || '',
            name: description.id,
            processVersion: description.processVersion,
            requiredProducts: description.inputs.map(i => i.description.id),
            providedProducts: description.outputs.map(o => o.description.id),
            url: server.serverUrl,
            wpsVersion: server.serverVersion,
        };
    }

}
