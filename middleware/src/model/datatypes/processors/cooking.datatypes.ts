import { Observable, of } from "rxjs";
import { ExecutableProcess, ProcessData } from "../riesgos.datatypes";


export class CookingSvc implements ExecutableProcess {
    execute(inputs: ProcessData[], outputs: ProcessData[]): Observable<ProcessData[]> {
        const cookedStuffOutput = outputs.find(o => o.slotId === 'cookedStuff') as ProcessData;
        const ingredients = inputs.map(i => i.value.value);
        const outputValue = 'cooked ' + ingredients.join(', ');
        // @ts-ignore
        cookedStuffOutput.value.value = outputValue;
        return of([cookedStuffOutput]);
    }

}

export class ChoppingSvc implements ExecutableProcess {
    execute(inputs: ProcessData[], outputs: ProcessData[]): Observable<ProcessData[]> {
        const choppedIngredientOutput = outputs.find(o => o.slotId === 'choppedIngredient') as ProcessData;
        const value = 'chopped ' + inputs[0].value.value;
        // @ts-ignore
        choppedIngredientOutput.value.value = value;
        return of([choppedIngredientOutput]);
    }

}

export class BlendingSvc implements ExecutableProcess {
    execute(inputs: ProcessData[], outputs: ProcessData[]): Observable<ProcessData[]> {
        const blendedIngredientsOutput = outputs.find(o => o.slotId === 'blendedIngredients') as ProcessData;
        const value = 'blended ' + inputs.map(i => i.value.value).join(', ');
        // @ts-ignore
        blendedIngredientsOutput.value.value = value;
        return of([blendedIngredientsOutput]);
    }

}