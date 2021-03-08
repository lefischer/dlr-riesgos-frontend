import { Observable, of } from "rxjs";
import { ExecutableProcess, RiesgosProduct } from "../riesgos.datatypes";


export class CookingSvc implements ExecutableProcess {
    execute(inputs: RiesgosProduct[], outputs: RiesgosProduct[]): Observable<RiesgosProduct[]> {
        const cookedStuffOutput = outputs.find(o => o.uid === 'cookedStuff') as RiesgosProduct;
        const ingredients = inputs.map(i => i.value);
        const outputValue = 'cooked ' + ingredients.concat(', ');
        return of([{
            ...cookedStuffOutput,
            value: outputValue
        }]);
    }

}

export class ChoppingSvc implements ExecutableProcess {
    execute(inputs: RiesgosProduct[], outputs: RiesgosProduct[]): Observable<RiesgosProduct[]> {
        const choppedIngredientOutput = outputs.find(o => o.uid === 'choppedIngredient') as RiesgosProduct;
        const value = 'chopped ' + inputs[0].value;
        return of([{
            ...choppedIngredientOutput,
            value: value
        }]);
    }

}

export class BlendingSvc implements ExecutableProcess {
    execute(inputs: RiesgosProduct[], outputs: RiesgosProduct[]): Observable<RiesgosProduct[]> {
        const blendedIngredientsOutput = outputs.find(o => o.uid === 'blendedIngredient') as RiesgosProduct;
        const value = 'blended ' + inputs.map(i => i.value).concat(', ');
        return of([{
            ... blendedIngredientsOutput,
            value: value
        }]);
    }

}