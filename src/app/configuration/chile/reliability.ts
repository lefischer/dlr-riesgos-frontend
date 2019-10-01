import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { intensity } from '../equador/lahar';
import { WpsData } from 'projects/services-wps/src/public-api';
import { StringSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { p } from './quakeledger';
import { VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { shakemapRefDeusInput } from './deusTranslator';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';



export const country: WpsData & StringSelectUconfProduct = {
    uid: 'systemreliability_country',
    description: {
        id: 'country',
        defaultValue: 'chile',
        description: 'What country are we working in?',
        reference: false,
        type: 'literal',
        format: 'application/text',
        options: [
            'chile',
            'ecuador'
        ],
        wizardProperties: {
            fieldtype: 'stringselect',
            name: 'Country'
        }
    },
    value: null
};


export const hazard: WpsData & StringSelectUconfProduct = {
    uid: 'systemreliability_hazard',
    description: {
        id: 'hazard',
        defaultValue: 'earthquake',
        description: 'What hazard are we dealing with?',
        reference: false,
        type: 'literal',
        format: 'application/text',
        options: [
            'earthquake',
            'lahar'
        ],
        wizardProperties: {
            fieldtype: 'stringselect',
            name: 'Hazard'
        }
    },
    value: null
};

export const damage_consumer_areas: WpsData & Product & VectorLayerData = {
    uid: 'systemreliability_damage_consumerareas',
    description: {
        id: 'damage_consumer_areas',
        format: 'application/vnd.geo+json',
        name: 'Damage to consumer areas',
        reference: false,
        type: 'complex',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {
                return new olStyle({
                  fill: new olFill({
                    color: [100, 10, 50, 0.3],
                  }),
                  stroke: new olStroke({
                    color: [100, 10, 50, 1],
                    witdh: 2
                  })
                });
              },
              text: (feature: olFeature) => {
                return JSON.stringify(feature.properties);
              }
        }
    },
    value: null
}


export const Reliability: WpsProcess & WizardableProcess = {
    url: 'http://91.250.85.221/wps/WebProcessingService',
    id: 'org.n52.gfz.riesgos.algorithm.impl.SystemReliabilityProcess',
    name: 'System reliability after EQ',
    description: 'Process for evaluating the reliability of infrastructure networks',
    wpsVersion: '1.0.0',
    state: new ProcessStateUnavailable(),
    requiredProducts: [shakemapRefDeusInput, country, hazard].map(p => p.uid),
    providedProducts: [damage_consumer_areas].map(p => p.uid),
    wizardProperties: {
        providerName: 'TUM',
        providerUrl: 'https://www.tum.de/nc/en/',
        shape: 'dot-circle'
    }
}