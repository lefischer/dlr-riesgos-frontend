import { WpsProcess, ProcessStateUnavailable, Product, ExecutableProcess, ProcessState } from 'src/app/riesgos/riesgos.datatypes';
import { schemaPeru, initialExposurePeru } from './exposure';
import { WpsData, Cache } from '@dlr-eoc/utils-ogc';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { VectorLayerProduct, VectorLayerProperties, MultiVectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { createBarchart, BarData, createGroupedBarchart } from 'src/app/helpers/d3charts';
import { redGreenRange, ninetyPercentLowerThan, toDecimalPlaces, weightedDamage, greenRedRange } from 'src/app/helpers/colorhelpers';
import { HttpClient } from '@angular/common/http';
import { fragilityRefPeru, VulnerabilityModelPeru, assetcategoryPeru, losscategoryPeru, taxonomiesPeru } from './modelProp';
import { eqShakemapRefPeru } from './shakyground';
import { Observable } from 'rxjs';
import { Deus } from '../chile/deus';
import { switchMap } from 'rxjs/operators';
import { FeatureCollection } from '@turf/helpers';
import { createKeyValueTableHtml, createHeaderTableHtml, createTableHtml, zeros, filledMatrix } from 'src/app/helpers/others';
import { InfoTableComponentComponent } from 'src/app/components/dynamic/info-table-component/info-table-component.component';
import { IDynamicComponent } from 'src/app/components/dynamic-component/dynamic-component.component';
import { TranslatableStringComponent } from 'src/app/components/dynamic/translatable-string/translatable-string.component';




export const lossPeru: WpsData & Product = {
    uid: 'lossPeru',
    description: {
        id: 'loss',
        title: '',
        reference: false,
        type: 'literal'
    },
    value: 'testinputs/loss_sara.json'
};

const eqDamagePeruProps: VectorLayerProperties = {
        name: 'eq-damage',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {
                const props = feature.getProperties();
                const [r, g, b] = greenRedRange(0, 3, props.loss_value / 1000000);
                return new olStyle({
                  fill: new olFill({
                    color: [r, g, b, 0.5],
                  }),
                  stroke: new olStroke({
                    color: [r, g, b, 1],
                    witdh: 2
                  })
                });
            },
            legendEntries: [{
                feature: {
                    "type": "Feature",
                    "properties": {'loss_value': 100000},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Loss 100000 USD'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {'loss_value': 500000},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Loss 500000 USD'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {'loss_value': 1000000},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Loss 1000000 USD'
            }],
            text: (props: object) => {
                return `<h4>{{ Loss }}</h4><p>${toDecimalPlaces(props['loss_value'] / 1000000, 2)} M${props['loss_unit']}</p>`;
            },
            summary: (value: [FeatureCollection]) => {
                const features = value[0].features;
                const damages = features.map(f => f.properties['loss_value']);
                const totalDamage = damages.reduce((carry, current) => carry + current, 0);
                const totalDamageFormatted = toDecimalPlaces(totalDamage / 1000000, 0) + ' MUSD';

                return {
                    component: InfoTableComponentComponent,
                    inputs: {
                        title: 'Total damage',
                        data: [[{value: 'Total damage'}, {value: totalDamageFormatted}]]
                    }
                };
            }
        },
        description: 'Loss in USD',
        icon: 'dot-circle',
};

const eqTransitionPeruProps: VectorLayerProperties = {
        name: 'eq-transition',
        icon: 'dot-circle',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {
                const props = feature.getProperties();

                const counts = Array(5).fill(0);
                let total = 0;
                const nrBuildings = props['transitions']['n_buildings'];
                const states = props['transitions']['to_damage_state'];
                for (let i = 0; i < states.length; i++) {
                    const nr = nrBuildings[i];
                    const state = states[i];
                    counts[state] += nr;
                    total += nr;
                }

                let r; let g; let b;
                if (total > 0) {
                    [r, g, b] = greenRedRange(0, 5, ninetyPercentLowerThan(Object.values(counts)));
                } else {
                    r = g = b = 0;
                }

                return new olStyle({
                  fill: new olFill({
                    color: [r, g, b, 0.5],
                  }),
                  stroke: new olStroke({
                    color: [r, g, b, 1],
                    witdh: 2
                  })
                });
            },
            legendEntries: [{
                feature: {
                    "type": "Feature",
                    "properties": {'transitions': {'n_buildings': 100, 'to_damage_state': [10, 80, 10]}},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Transitions'
            }],
            text: (props: object) => {

                const matrix = zeros(1, 5);
                const fromDamageState = props['transitions']['from_damage_state'];
                const nrBuildings = props['transitions']['n_buildings'];
                const toDamageState = props['transitions']['to_damage_state'];
                for (let i = 0; i < fromDamageState.length; i++) {
                    const r = fromDamageState[i];
                    const c = toDamageState[i];
                    const nr = nrBuildings[i];
                    matrix[r][c] += nr;
                }

                const labeledMatrix = filledMatrix(matrix.length + 1, matrix[0].length + 1,  '');
                for (let r = 0; r < labeledMatrix.length; r++) {
                    for (let c = 0; c < labeledMatrix[0].length; c++) {
                        if (r === 0 && c === 0) {
                            labeledMatrix[r][c] = '<b>{{ from_to }}</b>';
                        } else if (r === 0) {
                            labeledMatrix[r][c] = `<b>${c - 1}</b>`;
                        } else if (c === 0) {
                            labeledMatrix[r][c] = `<b>${r - 1}</b>`;
                        } else if (r > 0 && c > 0) {
                            labeledMatrix[r][c] = toDecimalPlaces(matrix[r-1][c-1], 0);
                        }
                    }
                }

                return `<h4>{{ Transitions }}</h4>${createTableHtml(labeledMatrix, 'medium')}`;
            },
            summary: (value: [FeatureCollection]) => {
                const matrix = zeros(1, 5);
                for (const feature of value[0].features) {
                    const fromDamageState = feature.properties['transitions']['from_damage_state'];
                    const nrBuildings = feature.properties['transitions']['n_buildings'];
                    const toDamageState = feature.properties['transitions']['to_damage_state'];
                    for (let i = 0; i < fromDamageState.length; i++) {
                        const r = fromDamageState[i];
                        const c = toDamageState[i];
                        const nr = nrBuildings[i];
                        matrix[r][c] += nr;
                    }
                }

                const labeledMatrix = filledMatrix(matrix.length + 1, matrix[0].length + 1,  '');
                for (let r = 0; r < labeledMatrix.length; r++) {
                    for (let c = 0; c < labeledMatrix[0].length; c++) {
                        if (r === 0 && c === 0) {
                            labeledMatrix[r][c] = {value: 'from_to', style: {'font-weight': 'bold'} };
                        } else if (r === 0) {
                            labeledMatrix[r][c] = {value: `${c - 1}`, style: {'font-weight': 'bold'} };
                        } else if (c === 0) {
                            labeledMatrix[r][c] = {value: `${r - 1}`, style: {'font-weight': 'bold'} };
                        } else if (r > 0 && c > 0) {
                            labeledMatrix[r][c] = {value: toDecimalPlaces(matrix[r-1][c-1], 0) };
                        }
                    }
                }

                return {
                    component: InfoTableComponentComponent,
                    inputs: {
                        title: 'Transitions',
                        data: labeledMatrix
                    }
                }
            }
        },
        description: 'Change from previous state'
};

const eqUpdatedExposurePeruProps: VectorLayerProperties = {
        icon: 'dot-circle',
        name: 'eq-exposure',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {
                const props = feature.getProperties();

                const expo = props.expo;
                const counts = {
                    'D0': 0,
                    'D1': 0,
                    'D2': 0,
                    'D3': 0,
                    'D4': 0
                };
                let total = 0;
                for (let i = 0; i < expo.Damage.length; i++) {
                    const damageClass = expo.Damage[i];
                    const nrBuildings = expo.Buildings[i];
                    counts[damageClass] += nrBuildings;
                    total += nrBuildings;
                }

                const dr = weightedDamage(Object.values(counts)) / 4;

                let r: number;
                let g: number;
                let b: number;
                if (total === 0) {
                    r = b = g = 0;
                } else {
                    [r, g, b] = greenRedRange(0, 0.6, dr);
                }

                return new olStyle({
                  fill: new olFill({
                    color: [r, g, b, 0.5],
                  }),
                  stroke: new olStroke({
                    color: [r, g, b, 1],
                    witdh: 2
                  })
                });
            },
            legendEntries: [{
                feature: {
                    "type": "Feature",
                    "properties": {'expo': {'Damage': ['D0', 'D1', 'D2', 'D3'], 'Buildings': [90, 10, 0, 0]}},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Damage states: 90/10/0/0'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {'expo': {'Damage': ['D0', 'D1', 'D2', 'D3'], 'Buildings': [0, 50, 50, 0]}},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Damage states: 0/50/50/0'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {'expo': {'Damage': ['D0', 'D1', 'D2', 'D3'], 'Buildings': [0, 0, 20, 80]}},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Damage states: 0/0/20/80'
            }],
            text: (props: object) => {
                const anchor = document.createElement('div');
                const expo = props['expo'];

                const data: {[groupName: string]: BarData[]} = {};
                for (let i = 0; i < expo['Taxonomy'].length; i++) {
                    const dmg = expo['Damage'][i];
                    const tax = expo['Taxonomy'][i].match(/^[a-zA-Z]*/)[0];
                    const bld = expo['Buildings'][i];
                    if (!data[tax]) {
                        data[tax] = [];
                    }
                    data[tax].push({
                        label: dmg,
                        value: bld
                    });
                }

                for (const label in data) {
                    if (data[label]) {
                        data[label].sort((dp1, dp2) => dp1.label > dp2.label ? 1 : -1);
                    }
                }

                const anchorUpdated = createGroupedBarchart(anchor, data, 400, 400, '{{ taxonomy_DX }}', '{{ nr_buildings }}');

                const legend = `
                    <ul>
                        <li> <b> D0: </b> {{ No_damage }} </li>
                        <li> <b> D1: </b> {{ Light_damage }} </li>
                        <li> <b> D2: </b> {{ Moderate_damage }} </li>
                        <li> <b> D3: </b> {{ Extensive_damage }} </li>
                        <li> <b> D4: </b> {{ Collapsed }} </li>
                    </ul>
                `;

                return `<h4 style="color: var(--clr-p1-color, #666666);">{{ Earthquake }}: {{ damage_classification }}</h4>${anchor.innerHTML}<br/>${legend}<br/>{{GroupsSimplified}}`;
            },
            summary: (value: [FeatureCollection]) => {
                const counts = {
                    'D0': 0,
                    'D1': 0,
                    'D2': 0,
                    'D3': 0,
                    'D4': 0
                };
                for (const feature of value[0].features) {
                    for (let i = 0; i < feature.properties.expo.Damage.length; i++) {
                        const damageClass = feature.properties.expo.Damage[i];
                        const nrBuildings = feature.properties.expo.Buildings[i];
                        counts[damageClass] += nrBuildings;
                    }
                }
                const html = createHeaderTableHtml(Object.keys(counts), [Object.values(counts).map(c => toDecimalPlaces(c, 0))]);
                const comp: IDynamicComponent = {
                    component: TranslatableStringComponent,
                    inputs: {
                      text: html
                    }
                  };
                  return comp;
            }
        },
        description: 'Number of goods exposed to a threat'
};

export const eqDamagePeruM: WpsData & MultiVectorLayerProduct = {
    uid: 'eq_deus_peru_output_values',
    description: {
        id: 'merged_output',
        title: '',
        reference: false,
        defaultValue: null,
        format: 'application/json',
        type: 'complex',
        description: '',
        vectorLayers: [eqUpdatedExposurePeruProps, eqTransitionPeruProps, eqDamagePeruProps]
    },
    value: null
};

export const eqUpdatedExposureRefPeru: WpsData & Product = {
    uid: 'updated_exposure_ref_peru',
    description: {
        id: 'updated_exposure',
        title: 'Updated exposure',
        reference: true,
        type: 'complex',
        format: 'application/json',
        description: 'Amount of goods that are exposed to a hazard.'
    },
    value: null
};


export class EqDeusPeru implements ExecutableProcess, WizardableProcess {

    readonly state: ProcessState;
    readonly uid: string;
    readonly name: string;
    readonly requiredProducts: string[];
    readonly providedProducts: string[];
    readonly description?: string;
    readonly wizardProperties: WizardProperties;

    private vulnerabilityProcess: VulnerabilityModelPeru;
    private deusProcess: Deus;

    constructor(http: HttpClient, cache: Cache) {
        this.state = new ProcessStateUnavailable();
        this.uid = 'EQ-Deus';
        this.name = 'Multihazard damage estimation / EQ';
        this.requiredProducts = [eqShakemapRefPeru, initialExposurePeru].map(p => p.uid);
        this.providedProducts = [eqDamagePeruM, eqUpdatedExposureRefPeru].map(p => p.uid);
        this.description = 'This service returns damage caused by the selected earthquake.';
        this.wizardProperties = {
            providerName: 'GFZ',
            providerUrl: 'https://www.gfz-potsdam.de/en/',
            shape: 'dot-circle' as 'dot-circle',
            wikiLink: 'Vulnerability'
        };

        this.vulnerabilityProcess = new VulnerabilityModelPeru(http, cache);
        this.deusProcess = new Deus(http, cache);
    }

    execute(
        inputProducts: Product[],
        outputProducts?: Product[],
        doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {

        const vulnerabilityInputs = [
            assetcategoryPeru,
            losscategoryPeru,
            taxonomiesPeru,
            {
                ... schemaPeru,
                value: 'SARA_v1.0'
            }
        ];
        const vulnerabilityOutputs = [fragilityRefPeru];

        return this.vulnerabilityProcess.execute(vulnerabilityInputs, vulnerabilityOutputs, doWhileExecuting)
            .pipe(
                switchMap((resultProducts: Product[]) => {
                    const fragility = resultProducts.find(prd => prd.uid === fragilityRefPeru.uid);
                    const shakemap = inputProducts.find(prd => prd.uid === eqShakemapRefPeru.uid);
                    const exposure = inputProducts.find(prd => prd.uid === initialExposurePeru.uid);

                    const deusInputs = [{
                            ... schemaPeru,
                            value: 'SARA_v1.0'
                        }, {
                            ... fragility,
                            description: {
                                ... fragility.description,
                                id: 'fragility'
                            }
                        }, {
                            ... shakemap,
                            description: {
                                ...shakemap.description,
                                id: 'intensity'
                            }
                        }, {
                            ... exposure,
                            description: {
                                ... exposure.description,
                                id: 'exposure'
                            },
                            value: exposure.value[0]
                        }];
                    const deusOutputs = outputProducts;
                    return this.deusProcess.execute(deusInputs, deusOutputs, doWhileExecuting);
                })
            );
    }
}
