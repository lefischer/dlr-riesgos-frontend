import { Observable, of } from "rxjs";
import { ExecutableProcess, RiesgosProcess, ProcessState, ProcessStateUnavailable, RiesgosProduct } from "../model/datatypes/riesgos.datatypes";


/**
 * Process that renames a products property, returning another product
 * that is identical in everything except that property-name.
 */
export class Renamer implements ExecutableProcess {

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

    execute(inputs: RiesgosProduct[], outputs: RiesgosProduct[], doWhileExecuting?: (response: any, counter: number) => void): Observable<RiesgosProduct[]> {
        const input = inputs.find(i => i.uid === this.requiredProducts[0]) as RiesgosProduct;
        let output = {... input};
        output.value[this.newPropertyName] = input.value[this.oldPropertyName];
        return of([output]);
    }
}


/**
 * Process that selects one element of a product containing a list.
 */
export class Selector implements ExecutableProcess {

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


    execute(inputs: RiesgosProduct[], outputs: RiesgosProduct[], doWhileExecuting?: (response: any, counter: number) => void): Observable<RiesgosProduct[]> {
        const selectionList = inputs[0].value;
        const selectedIndex = inputs[1].value;
        const output = outputs[0];
        const newOutput: RiesgosProduct = {
            ... output,
            value: selectionList[selectedIndex]
        };
        return of([newOutput]);
    }
}



