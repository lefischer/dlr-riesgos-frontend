import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable } from 'src/app/wps/wps.datatypes';
import { WmsLayerData } from 'src/app/components/map/mappable_wpsdata';
import {  StringSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { WpsData } from 'projects/services-wps/src/public-api';


export const direction: StringSelectUconfProduct & WpsData = {
    uid: 'user_direction',
    description: {
        id: 'direction',
        reference: false,
        type: 'literal',
        options: ['South', 'North'],
        defaultValue: 'South',
        wizardProperties: {
            fieldtype: 'stringselect',
            name: 'direction',
        }
    },
    value: null
};

export const intensity: StringSelectUconfProduct & WpsData = {
    uid: 'user_intensity',
    description: {
        id: 'intensity',
        reference: false,
        type: 'literal',
        options: ['VEI1', 'VEI2', 'VEI3', 'VEI4'],
        defaultValue: 'VEI1',
        wizardProperties: {
            fieldtype: 'stringselect',
            name: 'intensity',
        }
    },
    value: null
};

export const parameter: StringSelectUconfProduct & WpsData = {
    uid: 'user_parameter',
    description: {
        id: 'parameter',
        reference: false,
        type: 'literal',
        options: ['MaxHeight', 'MaxVelocity', 'MaxPressure', 'MaxErosion', 'Deposition'],
        defaultValue: 'MaxHeight',
        wizardProperties: {
            fieldtype: 'stringselect',
            name: 'parameter',
            description: `
            <ol>
                <li>MaxHeight [m]: Maximum flow height, that the lahar can reach during the event</li>
                <li>MaxVelocity [m/s]: Maximum flow velocity, that the lahar can reach during the event</li>
                <li>MaxPressure [kPa]: Maximum flow pressure, that the lahar can reach during the event</li>
                <li>MaxErosion [m]: Maximum depth of erosion, that the lahar can entrain during the event</li>
                <li>Deposition [m]: Height of deposited material after the lahar event</li>
            </ol>
            `
        }
    },
    value: null
};


export const laharWms: WmsLayerData & WpsData = {
    uid: 'gs:LaharModel_result',
    description: {
        id: 'result',
        name: 'laharWms',
        type: 'literal',  // this is deliberate. layer-wps returns this value as a litteral, not as a complex.
        reference: false,
        format: 'application/WMS',
    },
    value: null
};



export const LaharWps: WizardableProcess & WpsProcess = {
    uid: 'LaharModel',
    id: 'gs:LaharModel',
    url: 'http://91.250.85.221/geoserver/riesgos/wps',
    name: 'Lahar',
    description: 'The lahar service anticipates the area inundated by lahars of Cotopaxi volcano and relies on pre-calculated simulation results for flow height, flow velocity, flow pressure, erosion and deposition. The simulation software used for lahar modelling is the physically based numerical model RAMMS::DEBRIS FLOW.',
    requiredProducts: [direction, intensity, parameter].map(p => p.uid),
    providedProducts: [laharWms.uid],
    state: new ProcessStateUnavailable(),
    wpsVersion: '1.0.0',
    wizardProperties: {
        providerName: 'TUM',
        providerUrl: 'https://www.tum.de/nc/en/',
        shape: 'avalance'
    }
};
