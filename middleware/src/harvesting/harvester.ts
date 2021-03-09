import { HttpClient } from "../http_client/http_client";
import { RiesgosWpsProcess, WpsProcessData } from "../model/datatypes/processors/riesgos.wps.datatypes";
import { WpsProcessDescription, WpsServerDescription, WpsClient, WpsData, WpsCapability } from "../wps/public-api";
import { RiesgosDatabase } from "../database/db";

/**
 * Parses a remote WpsService 
 *  using @ukis-eoc/utils-ogc/wps/WpsClient
 *  and translates those data-structures into model/datatypes/riesgos.wps.datatypes/RiesgosWpsProcess
 */
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

            const inputs: WpsProcessData[] = [];
            for (const input of result.inputs) {
                const uid = this.createProductUID(server, result, input);
                const product = this.getWpsProduct(uid, input);
                this.db.addProduct(product);
                inputs.push(product);
            }
            
            const outputs: WpsProcessData[] = [];
            for (const output of result.outputs) {
                const uid = this.createProductUID(server, result, output);
                const product = this.getWpsProduct(uid, output);
                this.db.addProduct(product);
                outputs.push(product);
            }
            
            const process = this.getWpsProcess(server, result, inputs, outputs);
            this.db.addProcess(process);
        });
    }

    private getWpsProduct(uid: string, wpsData: WpsData): WpsProcessData {
        return {
            uid, value: wpsData
        };
    }
    
    private getWpsProcess (server: WpsServerDescription, description: WpsProcessDescription, inputs: WpsProcessData[], outputs: WpsProcessData[]): RiesgosWpsProcess {

        return {
            uid: this.createProcessUID(server, description),
            concreteClassName: 'ExecutableWpsProcess',
            id: description.id,
            autoRunning: false,
            description: description.description || '',
            name: description.id,
            processVersion: description.processVersion,
            inputSlots: inputs.map(i => i.uid),
            outputSlots: outputs.map(o => o.uid),
            url: server.serverUrl,
            wpsVersion: server.serverVersion,
        };
    }

    private createProductUID(server: WpsServerDescription, process: WpsProcessDescription, product: WpsData) {
        return `${server.serverUrl}_${process.id}_${product.description.id}`;
    }

    private createProcessUID(server: WpsServerDescription, process: WpsProcessDescription) {
        return `${server.serverUrl}_${process.id}`;
    }
}
