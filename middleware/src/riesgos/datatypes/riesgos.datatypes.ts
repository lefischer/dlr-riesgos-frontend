import { Observable } from 'rxjs';



export interface Product {
    readonly uid: string;
    readonly value: any;
}

export type ProcessId = string;


export enum ProcessStateTypes {
    unavailable = 'unavailable',
    available = 'available',
    running = 'running',
    completed = 'completed',
    error = 'error',
}

export class ProcessStateUnavailable {
    type: string = ProcessStateTypes.unavailable;
}


export class ProcessStateAvailable {
    type: string = ProcessStateTypes.available;
}


export class ProcessStateRunning {
    type: string = ProcessStateTypes.running;
}


export class ProcessStateCompleted {
    type: string = ProcessStateTypes.completed;
}


export class ProcessStateError {
    type: string = ProcessStateTypes.error;
    constructor(public message: string) {}
}

export type ProcessState = ProcessStateUnavailable | ProcessStateAvailable |
ProcessStateRunning | ProcessStateCompleted | ProcessStateError;


export interface Process {
    readonly uid: ProcessId;
    readonly name: string;
    readonly requiredProducts: string[];
    readonly providedProducts: string[];
    readonly autoRunning: boolean;
    state: ProcessState;
    readonly description?: string;
    execute(
        inputs: Product[],
        outputs: Product[],
        doWhileExecuting?: (response: any, counter: number) => void):
        Observable<Product[]>;
}


export const isProcess = (o: any): o is Process => {
    return o.hasOwnProperty('uid') && o.hasOwnProperty('requiredProducts')
     && o.hasOwnProperty('providedProduct') && o.hasOwnProperty('execute')
     && o.hasOwnProperty('autorunning');
};
