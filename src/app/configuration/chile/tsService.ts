import { Process, ProcessState, WpsProcess, ProcessStateTypes, ProcessStateUnavailable, WatchingProcess, Product } from '../../wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { UserconfigurableWpsData } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { WpsData } from 'projects/services-wps/src/public-api';



export const lat: WpsData = {
    description: {
        id: 'lat',
        reference: false,
        type: 'literal',
    },
    value: null
};

export const lon: WpsData = {
    description: {
        id: 'lon',
        reference: false,
        type: 'literal',
    },
    value: null
};

export const mag: WpsData = {
    description: {
        id: 'mag',
        reference: false,
        type: 'literal',
    },
    value: null
};


export const epicenter: WpsData = {
    description: {
        id: 'epiCenter',
        reference: false,
        format: 'application/WMS',
        type: 'literal',
    },
    value: null
};



export const TsService: WizardableProcess & WpsProcess & WatchingProcess = {
    state: new ProcessStateUnavailable(),
    id: 'get_scenario',
    url: 'http://tsunami-wps.awi.de/wps',
    name: 'Earthquake/tsunami interaction',
    description: 'Relates a tsunami to a given earthquake',
    requiredProducts: ['quakeMLFile', 'lat',  'lon', 'mag'],
    providedProduct: 'epiCenter',
    wpsVersion: '1.0.0',
    wizardProperties: {
        shape: 'tsunami',
        providerName: 'Alfred Wegener Institute, Helmholtz Centre for Polar and Marine Research',
        providerUrl: 'https://www.awi.de/en/'
    },
    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        const outprods: Product[] = [];
        if (newProduct.description.id === 'quakeMLFile') {
            outprods.push({
                ... lon,
                value: newProduct.value[0].features[0].geometry.coordinates[0]
            });
            outprods.push({
                ...lat,
                value: newProduct.value[0].features[0].geometry.coordinates[1]
            });
            outprods.push({
                ...mag,
                value: newProduct.value[0].features[0].properties['magnitude.mag.value']
            });
        }
        return outprods;
    }
};
