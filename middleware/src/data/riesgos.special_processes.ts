import { Observable, of } from "rxjs";
import { HttpClient } from "../http_client/http_client";
import { Process, ProcessState, ProcessStateUnavailable, Product } from "../riesgos/datatypes/riesgos.datatypes";
import { CWpsProcess, WpsProcess, WpsProduct } from "../riesgos/datatypes/riesgos.wps.datatypes";
import { WpsHttpClient } from "../wps/wpsclient";
import { WpsData, WpsProcessDescription, WpsServerDescription, WpsVersion } from "../wps/wps_datatypes";


/**
 * Process that renames a products property, returning another product
 * that is identical in everything except that property-name.
 */
export class Renamer implements Process {

    requiredProducts: string[];
    providedProducts: string[];
    autoRunning: boolean;
    state: ProcessState;
    constructor(
        readonly uid: string,
        readonly name: string,
        requiredProduct: string,
        providedProduct: string,
        readonly oldPropertyName: string,
        readonly newPropertyName: string
    ) {
        this.requiredProducts = [requiredProduct];
        this.providedProducts = [providedProduct];
        this.autoRunning = true;
        this.state = new ProcessStateUnavailable();
    }

    execute(inputs: Product[], outputs: Product[], doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {
        const input = inputs.find(i => i.uid === this.requiredProducts[0]) as Product;
        let output = {... input};
        output.value[this.newPropertyName] = input.value[this.oldPropertyName];
        return of([output]);
    }
}


/**
 * Process that selects one element of a product containing a list.
 */
export class Selecter implements Process {

    readonly requiredProducts: string[];
    readonly providedProducts: string[];
    readonly autoRunning: boolean;
    state: ProcessState;

    constructor(
        readonly uid: string,
        readonly name: string,
        inputListId: string,
        selectedIndexId: string,
        selectedProductId: string
    ) {
        this.requiredProducts = [inputListId, selectedIndexId];
        this.providedProducts = [selectedProductId];
        this.autoRunning = true;
        this.state = new ProcessStateUnavailable();
    }


    execute(inputs: Product[], outputs: Product[], doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {
        const selectionList = inputs[0].value;
        const selectedIndex = inputs[1].value;
        const output = outputs[0];
        const newOutput: Product = {
            ... output,
            value: selectionList[selectedIndex]
        };
        return of([newOutput]);
    }
}


export const registerWpsProduct = (uid: string, wpsData: WpsData): WpsProduct => {
    return {
        uid, value: wpsData
    };
};

export const registerWpsProcess = (
    uid: string, 
    inputUids: string[], outputUids: string[], 
    autoRunning: boolean, httpClient: WpsHttpClient,
    wpsProcessD: any, serverD: any): WpsProcess => {

        return new CWpsProcess(
            uid, wpsProcessD.title || '', inputUids, outputUids, wpsProcessD.id, 
            wpsProcessD.description || '', serverD.serverUrl, serverD.serverVersion, wpsProcessD.processVersion, 
            autoRunning, httpClient, new ProcessStateUnavailable());
};
