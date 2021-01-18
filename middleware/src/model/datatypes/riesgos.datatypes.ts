import { Observable } from 'rxjs';



export interface Product {
    readonly uid: string;
    readonly value: any;
}

export type ProcessId = string;


export interface Process {
    readonly uid: ProcessId;
    readonly concreteClassName: string;
    readonly name: string;
    readonly requiredProducts: string[];
    readonly providedProducts: string[];
    readonly autoRunning: boolean;
    readonly description?: string;
}

export interface Executable {
    
    execute(
        inputs: Product[],
        outputs: Product[]):
        Observable<Product[]>;
}


export interface ExecutableProcess extends Process, Executable {};




export interface RiesgosScenarioMetaData {
    id: string;
    title: string;
    description: string;
    preview: string;
    processes: string[];
    products: string[];
}


export interface RiesgosScenarioData {
    metaData: RiesgosScenarioMetaData,
    processes: Process[],
    products: Product[]
}