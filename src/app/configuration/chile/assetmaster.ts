import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/wps/wps.datatypes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { WmsLayerData, VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import {
  UserconfigurableProduct, StringUconfProduct,
  StringSelectUconfProduct
} from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';


export const lonmin: StringUconfProduct & WpsData = {
  uid: 'user_lonmin',
  description: {
    id: 'lonmin',
    type: 'literal',
    wizardProperties: {
      fieldtype: 'string',
      name: 'lonmin'
    },
    reference: false,
    defaultValue: '-71.8'
  },
  value: null
};


export const lonmax: StringUconfProduct & WpsData = {
  uid: 'user_lonmax',
  description: {
    id: 'lonmax',
    type: 'literal',
    wizardProperties: {
      fieldtype: 'string',
      name: 'lonmax'
    },
    reference: false,
    defaultValue: '-71.4'
  },
  value: null
};


export const latmin: StringUconfProduct & WpsData = {
  uid: 'user_latmin',
  description: {
    id: 'latmin',
    type: 'literal',
    wizardProperties: {
      fieldtype: 'string',
      name: 'latmin'
    },
    reference: false,
    defaultValue: '-33.2'
  },
  value: null
};


export const latmax: StringUconfProduct & WpsData = {
  uid: 'user_latmax',
  description: {
    id: 'latmax',
    type: 'literal',
    wizardProperties: {
      fieldtype: 'string',
      name: 'latmax'
    },
    reference: false,
    defaultValue: '-33.0'
  },
  value: null
};


export const schema: StringSelectUconfProduct & WpsData = {
  uid: 'user_schema',
  description: {
    id: 'schema',
    options: ['SARA_v1.0'],
    defaultValue: 'SARA_v1.0',
    reference: false,
    type: 'literal',
    wizardProperties: {
      fieldtype: 'stringselect',
      name: 'Schema'
    }
  },
  value: null
};



export const assettype: StringSelectUconfProduct & WpsData = {
  uid: 'user_assettype',
  description: {
    id: 'assettype',
    options: ['res'],
    defaultValue: 'res',
    reference: false,
    type: 'literal',
    wizardProperties: {
      fieldtype: 'stringselect',
      name: 'Schema'
    }
  },
  value: null
};


export const querymode: StringSelectUconfProduct & WpsData = {
  uid: 'user_querymode',
  description: {
    id: 'querymode',
    options: ['intersects', 'within'],
    defaultValue: 'intersects',
    reference: false,
    type: 'literal',
    wizardProperties: {
      fieldtype: 'stringselect',
      name: 'Querymode'
    }
  },
  value: null
};


export const exposureRef: VectorLayerData & WpsData & Product = {
  uid: 'org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess_selecteRowsXml',
  description: {
    id: 'selectedRowsGeoJson',
    type: 'complex',
    reference: false,
    format: 'application/json',
    name: 'Exposure',
    vectorLayerAttributes: {
      style: (feature: olFeature, resolution: number) => {

        let pop = 10000;
        const props = feature.getProperties();
        if (props.expo && props.expo.Population) {
          const popObj = feature.getProperties().expo.Population;
          pop = Object.values(popObj).reduce((carry: number, current: number) => carry + current, 0) as number;
        }
        const pop0 = 50000;
        const pop1 = 400000;
        const r = 255 * (pop - pop0) / (pop1 - pop0);
        const g = 255 * (1 - (pop - pop0) / (pop1 - pop0));
        const b = 200;

        return new olStyle({
          fill: new olFill({
            color: [r, g, b, 0.3],

          }),
          stroke: new olStroke({
            color: [r, g, b, 1],
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
};


export const ExposureModel: WizardableProcess & WpsProcess = {
  id: 'org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess',
  url: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
  wpsVersion: '1.0.0',
  name: 'EQ Exposure Model',
  description: '',
  requiredProducts: [lonmin, lonmax, latmin, latmax, querymode, schema, assettype].map(p => p.uid),
  providedProducts: [exposureRef.uid],
  wizardProperties: {
    shape: 'earthquake',
    providerName: 'Helmholtz Centre Potsdam German Research Centre for Geosciences',
    providerUrl: 'https://www.gfz-potsdam.de/en/'
  },
  state: new ProcessStateUnavailable()
};



