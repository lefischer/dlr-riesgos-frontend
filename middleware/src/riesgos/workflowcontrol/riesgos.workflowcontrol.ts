import { Graph, alg, Edge } from 'graphlib';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Process, Product, ProcessStateRunning, ProcessStateCompleted, ProcessStateError, 
    ProcessStateTypes, ProcessState, ProcessStateUnavailable, ProcessStateAvailable } from '../datatypes/riesgos.datatypes';


export function createGraph(processes: Process[]): Graph {
    const graph = new Graph({ directed: true });
    for (const process of processes) {
        for (const inProdId of process.requiredProducts) {
            graph.setEdge(inProdId, process.uid);
        }
        for (const outProdId of process.providedProducts) {
            graph.setEdge(process.uid, outProdId);
        }
    }
    return graph;
}


export class WorkflowControl {

    private processes: Process[];
    private products: Product[];
    private graph: Graph;

    constructor(processes: Process[], products: Product[]) {

        this.checkDataIntegrity(processes, products);

        this.graph = createGraph(processes);

        if (!alg.isAcyclic(this.graph)) {
            throw new Error('Process graphs with cycles are not supported');
        }

        this.products = this.getProductsInExecutionOrder(products);
        this.processes = this.getProcessesInExecutionOrder(processes);
        this.processes.map(p => p.state = this.calculateState(p.uid));
    }


    public execute(id: string, doWhileRequesting?: (response: any, counter: number) => void): Observable<boolean> {
        let process = this.getProcess(id);
        const inputs = this.getProcessInputs(id);
        const outputs = this.getProcessOutputs(id);

        process = this.setProcessState(process.uid, new ProcessStateRunning());
        if (doWhileRequesting) {
            doWhileRequesting(null, 0);
        }

        try {
            return process.execute(inputs, outputs, doWhileRequesting).pipe(

                tap((outputs: Product[]) => {
                    for (const product of outputs) {
                        this.provideProduct(product.uid, product.value);
                    }
                    this.setProcessState(process.uid, new ProcessStateCompleted());
                }),

                map((outputs: Product[]) => {
                    return true;
                }),

                catchError((error) => {
                    this.setProcessState(process.uid, new ProcessStateError(JSON.stringify(error)));
                    return of(false);
                })
            );

        } catch (error) {
            this.setProcessState(process.uid, new ProcessStateError(JSON.stringify(error)));
            return of(false);
        }

    }

    private getProcesses(ids?: string[]): Process[] {
        if (!ids) {
            return this.processes;
        } else {
            return this.processes.filter(p => ids.includes(p.uid));
        }
    }


    public getProducts(ids?: string[]): Product[] {
        if (!ids) {
            return this.products;
        } else {
            return this.products.filter(p => ids.includes(p.uid));
        }
    }

    public getGraph(): Graph {
        return this.graph;
    }


    public provideProduct(id: string, value: any): void {
        // @TODO: providing a new input-product to an already completed processes should set its state back to available.

        // set new value
        const newProduct = this.setProductValue(id, value);

        // update state of all downstream processes
        // if the process has a parent, also update the parent's state
        // we need to calculate the parent-state as well, because a product might not only be provided by wps.execute.
        // it could also be provided by loading a save-state.
        const parentId = this.getProductProvider(id);
        if (parentId) {
            this.setProcessState(parentId, this.calculateState(parentId));
        }
        this.updateProcessStatesDownstream(id);
    }


    public getActiveProcesses(): Process[] {
        return this.processes.filter(p => p.state.type === ProcessStateTypes.available);
    }

    private updateProcessStatesDownstream(id: string): void {

        if (this.isProcess(id)) {
            this.setProcessState(id, this.calculateState(id));

            const process = this.getProcess(id);
            if (process.autoRunning && process.state.type === ProcessStateTypes.available) {
                this.execute(id);
            }
        }

        for (const outEdge of this.graph.outEdges(id) as Edge[]) {
            const targetId = outEdge.w;
            this.updateProcessStatesDownstream(targetId);
        }
    }


    public invalidateProcess(id: string): void {

        const outputEdges = this.graph.outEdges(id);
        for (const outputEdge of outputEdges as Edge[]) {
            const productId = outputEdge.w;
            this.setProductValue(productId, null);

            const nextInputEdges = this.graph.outEdges(productId);
            for (const nextInputEdge of nextInputEdges as Edge[]) {
                const processId = nextInputEdge.w;
                this.invalidateProcess(processId);
            }
        }
        this.setProcessState(id, this.calculateState(id));

    }


    public getProcessInputs(id: string): Product[] {
        const process = this.getProcess(id);
        const productIds = process.requiredProducts;
        const products = productIds.map(prodId => this.getProduct(prodId));
        return products;
    }

    public getProcessOutputs(id: string): Product[] {
        const process: Process = this.getProcess(id);
        const productIds = process.providedProducts;
        const products = productIds.map(prodId => this.getProduct(prodId));
        return products;
    }

    private getProcess(id: string): Process {
        const process = this.processes.find(p => p.uid === id);
        if (!process) {
            throw new Error(`no such process: ${id}`);
        }
        return process;
    }


    private isProcess(id: string): boolean {
        return this.processes.map(p => p.uid).includes(id);
    }


    private getProduct(id: string): Product {
        const product = this.products.find(p => p.uid === id);
        if (!product) {
            throw new Error(`no such product: ${id}`);
        }
        return product;
    }


    private setProcessState(id: string, state: ProcessState): Process {
        this.processes.map(process => {
            if (process.uid === id) {
                process.state = state;
            }
            return process;
        });
        return this.getProcess(id);
    }


    private setProductValue(id: string, value: any): Product {
        this.products = this.products.map(product => {
            if (product.uid === id) {
                return {
                    ...product,
                    value
                };
            }
            return product;
        });
        return this.getProduct(id);
    }


    // sometimes we need to update the whole product;
    // for example when we want to change the select-options under description.wizardProps.options
    private updateProduct(newProduct: Product): void {
        this.products = this.products.map(product => {
            if (product.uid === newProduct.uid) {
                return {...newProduct};
            }
            return product;
        });
    }


    private getProcessesInExecutionOrder(processes: Process[]): Process[] {
        const allIds = alg.topsort(this.graph);
        const processIds = processes.map(proc => proc.uid);
        const sortedProcessIds = allIds.filter(id => processIds.includes(id));
        const sortedProcesses = sortedProcessIds.map(id => processes.find(proc => proc.uid === id) ).filter(p => p !== null) as Process[];
        return sortedProcesses;
    }

    private getProductsInExecutionOrder(products: Product[]): Product[] {
        const allIds = alg.topsort(this.graph);
        const productIds = products.map(prod => prod.uid);
        const sortedProductIds = allIds.filter(id => productIds.includes(id));
        const sortedProducts = sortedProductIds.map(id => products.find(prod => prod.uid === id)).filter(p => p !== null) as Product[];
        return sortedProducts;
    }


    private calculateState(id: string): ProcessState {

        const process = this.getProcess(id);
        const internalUpstreamProducts = process.requiredProducts.filter(prdId => this.hasProvidingProcess(prdId));
        const userprovidedProducts = process.requiredProducts.filter(prdId => !this.hasProvidingProcess(prdId));

        // currently running?
        if (process.state.type === ProcessStateTypes.running) {
            return new ProcessStateRunning();
        }

        // is the output there? -> complete
        const outputs = this.getProducts(process.providedProducts);
        const unfinishedOutputs = outputs.filter(prd => prd.value === null);
        if (unfinishedOutputs.length === 0) {
            return new ProcessStateCompleted();
        }

        // is any internal input missing? -> unavailable
        for (const prodId of internalUpstreamProducts) {
            const product = this.getProduct(prodId);
            if (product.value === null) {
                return new ProcessStateUnavailable();
            }
        }

        return new ProcessStateAvailable();
    }


    private hasProvidingProcess(id: string): boolean {
        const inEdges = this.graph.inEdges(id);
        if (!inEdges || inEdges.length < 1) {
            return false;
        }
        return true;
    }

    private getProductProvider(productId: string): string | undefined {
        for (const process of this.processes) {
            if (process.providedProducts.includes(productId)) {
                return process.uid;
            }
        }
    }


    private checkDataIntegrity(processes: Process[], products: Product[]): void {

        const processIds = processes.map(p => p.uid);
        const productIds = products.map(p => p.uid);

        const requiredProducts: string[] = [];
        for (const process of processes) {
            for (const productId of process.requiredProducts) {
                requiredProducts.push(productId);
            }
            for (const productId of process.providedProducts) {
                requiredProducts.push(productId);
            }
        }

        for (const reqiredProd of requiredProducts) {
            if (!productIds.includes(reqiredProd)) {
                throw new Error(`${reqiredProd} is required but not provided to context`);
            }
        }

        const processDuplicates = this.getDuplicates(processIds);
        if (processDuplicates.length > 0) {
            throw new Error(`Duplicate processes: ${processDuplicates}`);
        }

        const productDuplicates = this.getDuplicates(productIds);
        if (productDuplicates.length > 0) {
            throw new Error(`Duplicate products: ${productDuplicates}`);
        }

        // for (const product of products) {
        //     if (product.value) {
        //         console.log("product already has a value", product);
        //     }
        // }
    }

    private getDuplicates(arr: string[]): string[] {
        const sortedArr = arr.slice().sort();

        const duplicates: string[] = [];
        for (let i = 0; i < sortedArr.length - 1; i++) {
            if (sortedArr[i + 1] === sortedArr[i]) {
                duplicates.push(sortedArr[i]);
            }
        }

        return duplicates;
    }

}
