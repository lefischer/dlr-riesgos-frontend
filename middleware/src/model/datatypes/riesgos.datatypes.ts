import { Observable } from 'rxjs';



export interface RiesgosProduct {
    readonly uid: string;
    readonly value: any;
}

export type RiesgosProcessId = string;


export interface RiesgosProcess {
    readonly uid: RiesgosProcessId;
    readonly concreteClassName: string;
    readonly name: string;
    readonly requiredProducts: string[];
    readonly providedProducts: string[];
    readonly autoRunning: boolean;
    readonly description?: string;
}

export interface Executable {
    
    execute(
        inputs: RiesgosProduct[],
        outputs: RiesgosProduct[]):
        Observable<RiesgosProduct[]>;
}


export interface ExecutableProcess extends RiesgosProcess, Executable {};




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
    processes: RiesgosProcess[],
    products: RiesgosProduct[]
}