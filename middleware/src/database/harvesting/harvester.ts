import { HttpClient } from "../../http_client/http_client";
import { ProcessStateUnavailable } from "../../riesgos/datatypes/riesgos.datatypes";
import { CWpsProcess, WpsProcess, WpsProduct } from "../../riesgos/datatypes/riesgos.wps.datatypes";
import { WpsProcessDescription, WpsServerDescription, WpsClient, WpsData, WpsHttpClient } from "../../wps/public-api";
import { RiesgosDatabase } from "../db";


export class WpsHarvester {

    constructor(
        private httpClient: HttpClient,
        private db: RiesgosDatabase
    ) {
    }
    
    public downloadWpsProcessData(server: WpsServerDescription, processId: string) {
        const wpsClient = new WpsClient(server.serverVersion, this.httpClient);
        wpsClient.describeProcess(server.serverUrl, processId).subscribe((result: WpsProcessDescription) => {

            const process = this.getWpsProcess(
                result.id,
                result.inputs.map(i => i.description.id),
                result.outputs.map(o => o.description.id),
                false, this.httpClient, result, server);

            this.db.addProcess(process);

            for (const input of result.inputs) {
                const product = this.getWpsProduct(input.description.id, input);
                this.db.addProduct(product);
            }

            for (const output of result.outputs) {
                const product = this.getWpsProduct(output.description.id, output);
                this.db.addProduct(product);
            }

        });
    }

    private getWpsProduct(uid: string, wpsData: WpsData): WpsProduct {
        return {
            uid, value: wpsData
        };
    }
    
    private getWpsProcess (
        uid: string, 
        inputUids: string[], outputUids: string[], 
        autoRunning: boolean, httpClient: WpsHttpClient,
        wpsProcessD: any, serverD: any): WpsProcess {
    
            return new CWpsProcess(
                uid, wpsProcessD.title || '', inputUids, outputUids, wpsProcessD.id, 
                wpsProcessD.description || '', serverD.serverUrl, serverD.serverVersion, wpsProcessD.processVersion, 
                autoRunning, httpClient, new ProcessStateUnavailable());
    }

}
