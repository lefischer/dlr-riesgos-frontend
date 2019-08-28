import { ProductId } from 'projects/services-wps/src/public-api';
import { Product } from '../wps/wps.datatypes';

export type InteractionMode = 'normal' | 'featureselection' | 'bbox';


export interface InteractionState {
    mode: InteractionMode,
    product: Product
}


export const initialInteractionState: InteractionState = {
    mode: 'normal',
    product: {
        uid: 'auto_default parameter',
        description: {
            id: 'default parameter',
            reference: false,
            type: 'literal',
            wizardProperties: {
                fieldtype: 'string',
                name: ''
            }
        },
        value: null
    }
}