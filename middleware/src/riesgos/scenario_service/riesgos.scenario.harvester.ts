import { HttpClient } from "../../http_client/http_client";
import { WpsVersion, WpsProcessDescription, WpsServerDescription, WpsClient } from "@dlr-eoc/utils-ogc";
const fs = require('fs');

export class Harvester {

    constructor(
        private httpClient: HttpClient
    ) {
    }
    
    public downloadProcessData(serverUrl: string, serverVersion: WpsVersion, processId: string, targetDir: string, mode: 'json' | 'ts' | 'db') {
        const wpsClient = new WpsClient(serverVersion, this.httpClient);
        wpsClient.describeProcess(serverUrl, processId).subscribe((result: WpsProcessDescription) => {
            if (mode === 'json') {
                this.writeToJson({serverUrl, serverVersion}, result, targetDir, processId);
            } else {
                this.writeToTs({serverUrl, serverVersion}, result, targetDir, processId);
            }
        });
    }

    private writeToJson(server: WpsServerDescription, result: WpsProcessDescription, targetDir: string, processId: string) {
        this.writeToFile(`${targetDir}/${this.cleanString(processId)}.json`, JSON.stringify({server, process: result}, null, 4));
    }

    private writeToTs(server: WpsServerDescription, result: WpsProcessDescription, targetDir: string, processId: string) {
        let code = '';

        code += `export const server = ${JSON.stringify(server, null, 4)};
`;

        for (const input of result.inputs) {
            code += `export const ${this.cleanString(input.description.id)} = ${JSON.stringify(input, null, 4)};

`;
        }

        for (const output of result.outputs) {
            code += `export const ${this.cleanString(output.description.id)} = ${JSON.stringify(output, null, 4)};

`;
        }

        const process = {
            ... result,
            inputs: result.inputs.map(i => i.description.id),
            outputs: result.outputs.map(o => o.description.id),
        };
        code += `export const ${this.cleanString(process.id)}Process = ${JSON.stringify(process, null, 4)};

`;

        this.writeToFile(`${targetDir}/${this.cleanString(process.id)}.ts`, code);
    }

    private writeToDb(server: WpsServerDescription, result: WpsProcessDescription, dbTable: string) {

    }

    
    private writeToFile(fileName: string, text: string) {
        fs.writeFile(fileName, text, (err: any) => {
            if (err) {
                throw err;
            } else {
                console.log(`Wrote out ${fileName}`);
            }
        });
    }

    private cleanString (str: string): string {
        return str.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
    }
}
