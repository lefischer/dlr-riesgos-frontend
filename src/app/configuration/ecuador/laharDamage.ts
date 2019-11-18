import { ExecutableProcess, Product, ProcessState, ProcessStateUnavailable } from 'src/app/wps/wps.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { Observable } from 'rxjs';
import { Volcanus } from './volcanus';
import { VulnerabilityModelEcuador, assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador } from './vulnerability';
import { switchMap } from 'rxjs/operators';
import { laharVelocityShakemapRef } from './laharWrapper';
import { HttpClient } from '@angular/common/http';
import { ashfallUpdatedExposureRef } from './ashfallDamage';
import { VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { WpsData } from '@ukis/services-wps/src/public-api';
import { FeatureCollection } from '@turf/helpers';
import { schemaEcuador } from './exposure';
import { fragilityRef } from '../chile/modelProp';


export const laharDamage: WpsData & VectorLayerData = {
    uid: 'laharDamage',
    description: {
        id: 'damage',
        name: 'laharDamage',
        format: 'application/json',
        reference: false,
        type: 'complex',
        vectorLayerAttributes: {
            style: () => {},
            text: () => {},
            summary: (value: [FeatureCollection]) => {return 'style'}
        }
    },
    value: null
};

export const laharTransition: WpsData & VectorLayerData = {
    uid: 'laharTransition',
    description: {
        id: 'transition',
        name: 'laharTransition',
        format: 'application/json',
        reference: false,
        type: 'complex',
        vectorLayerAttributes: {
            style: () => {},
            text: () => {},
            summary: (value: [FeatureCollection]) => {return 'style'}
        }
    },
    value: null
};

export const laharUpdatedExposure: WpsData & VectorLayerData = {
    uid: 'laharExposure',
    description: {
        id: 'updated_exposure',
        name: 'laharExposure',
        format: 'application/json',
        reference: false,
        type: 'complex',
        vectorLayerAttributes: {
            style: () => {},
            text: () => {},
            summary: (value: [FeatureCollection]) => {return 'style'}
        }
    },
    value: null
};



export class DeusLahar implements ExecutableProcess, WizardableProcess {

    readonly uid: string = 'DeusLahar';
    readonly name: string = 'Lahar Damage';
    readonly state: ProcessState = new ProcessStateUnavailable();
    readonly requiredProducts: string[] = [ashfallUpdatedExposureRef, laharVelocityShakemapRef].map(p => p.uid);
    readonly providedProducts: string[] = [laharDamage, laharTransition, laharUpdatedExposure].map(p => p.uid);
    readonly description?: string = 'Deus Lahar description';
    readonly wizardProperties: WizardProperties = {
        shape: 'dot-circle',
        providerName: 'Helmholtz Centre Potsdam',
        providerUrl: 'https://www.gfz-potsdam.de/en/'
    };

    private volcanus: Volcanus;
    private vulnerability: VulnerabilityModelEcuador;

    constructor(http: HttpClient) {
        this.volcanus = new Volcanus(http);
        this.vulnerability = new VulnerabilityModelEcuador(http);
    }

    execute(
        inputs: Product[], outputs?: Product[],
        doWhileExecuting?: (response: any, counter: number) => void
    ): Observable<Product[]> {

        const vulnInputs = [{
            ... schemaEcuador,
            value: 'Mavrouli_et_al_2014'
        }, assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador];
        const vulnOutputs = [fragilityRef];

        return this.vulnerability.execute(vulnInputs, vulnOutputs, doWhileExecuting).pipe(
            switchMap((results: Product[]) => {
                const fragility = results.find(prd => prd.uid === fragilityRef.uid);
                const shakemap = inputs.find(prd => prd.uid === laharVelocityShakemapRef.uid);
                const exposure = inputs.find(prd => prd.uid === ashfallUpdatedExposureRef.uid);

                const vulcInputs: Product[] = [{
                    ... shakemap,
                    description: {
                        ... shakemap.description,
                        id: 'intensity'
                    }
                }, {
                    uid: 'intensitycolumn',
                    description: {
                        id: 'intensitycolumn',
                        type: 'literal',
                        reference: false
                    },
                    value: 'velocity'
                }, {
                    ... exposure,
                    description: {
                        ... exposure.description,
                        id: 'exposure'
                    },
                    value: exposure.value[0]
                }, {
                    ... schemaEcuador,
                    value: 'Torres_Corredor_et_al_2017'
                }, {
                    ... fragility,
                    description: {
                        ... fragilityRef.description,
                        id: 'fragility'
                    }
                }
                ];

                const vulcOutputs = [laharDamage, laharTransition, laharUpdatedExposure];

                return this.volcanus.execute(vulcInputs, vulcOutputs, doWhileExecuting);
            })
        );
    }
}
