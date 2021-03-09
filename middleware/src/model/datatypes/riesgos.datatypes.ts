import { Observable } from 'rxjs';


/**
 * RiesgosProcesses can be harvested from remote-wps-services,
 * but RiesgosProducts cannot. Reason:
 * 
 * RiesgosProduct: 
 *  - Defined by user in scenario creation
 *      - Because in one scenario there can be multiple product-instances attached to one processes' input-slot.
 * RiesgosProcess:
 *  - 
 */
export interface RiesgosProduct {
    readonly uid: string;
    readonly scenario: string;
    readonly options?: any[];
    readonly value: any;
}


/**
 * The part of a riesgos-process that is 
 *  - sent over the network from the backend to the frontend
 *  - stored in the database
 * Does not contain an `execute` method
 *  - because that is only required on the backend-side
 *  - because it cannot be saved in a database.
 */
 export interface RiesgosProcess {
    readonly uid: string;
    readonly inputSlots: string[];
    readonly outputSlots: string[];
}




/**
 * Whereas a `RiesgosProduct` contains all information required for the frontend,
 * this `ProcessData` contains all the information required for the backend-service.
 * Note that `RiesgosProduct.uid` and `ProcessData.slotId` are distinct:
 * Multiple `RiesgosProduct`s may be inserted into a `slotId`.
 */
export interface ProcessData {
    readonly slotId: string;
    value: RiesgosProduct;
}



/**
 * A concrete, executable Process.
 * Cannot be serialized, thus cannot be sent to client nor can it be stored in database.
 * Instead instantiated on the fly based on the information stored in `RiesgosProcess`.
 * Does *not* extend `RiesgosProcess`: this class is there only for one-off execution, and does
 * not care about graph-structure, dependencies etc.
 */
export interface ExecutableProcess {
    execute( inputs: ProcessData[], outputs: ProcessData[]): Observable<ProcessData[]>;
};



export interface Match {
    product: string;
    slot: string;
}

/**
 * Why do we use 'Call' and not the more common 'nodes'/'edges' representation of graphs?
 * Imagine we want to call 'ServiceA' twice, once with 'Input1', and once with 'Input2'.
 * The result of the first call shall be called 'Output1', the result of the second 'Output2'.
 * The 'nodes'/'edges' representation of a graph cannot distinguish between 'Output1' and 'Output2',
 * while the 'Call' representation can.
 */
export interface Call {
    process: string,
    inputs: Match[],
    outputs: Match[]
}

export interface RiesgosScenarioMetaData {
    id: string;
    calls: Call[]
}


export interface RiesgosScenarioData {
    metaData: RiesgosScenarioMetaData,
    processes: RiesgosProcess[],
    products: RiesgosProduct[]
}