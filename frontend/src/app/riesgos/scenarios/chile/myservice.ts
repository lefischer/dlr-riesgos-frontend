import { HttpClient } from '@angular/common/http';
import { WizardableProcess, WizardProperties } from '../../../components/config_wizard/wizardable_processes';
import { VectorLayerProduct } from '../../riesgos.datatypes.mappable';
import { ProcessStateUnavailable, WpsProcess } from '../../riesgos.datatypes';
import { WpsData } from '@dlr-eoc/services-ogc';



export const ConvexHullInput: VectorLayerProduct & WpsData = {
    uid: 'ConvexHullInput',
    description: {
        id: 'data',
        format: 'application/vnd.geo+json',
        name: 'data',
        type: 'complex',
        icon: 'dot-circle',
        reference: false,
    },
    value: {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "Point",
              "coordinates": [
                -72.0703125,
                -3.864254615721396
              ]
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "Point",
              "coordinates": [
                -60.46875,
                -7.01366792756663
              ]
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "Point",
              "coordinates": [
                -68.5546875,
                -10.141931686131018
              ]
            }
          }
        ]
      }
};

export const ConvexHullOutput: VectorLayerProduct & WpsData = {
    uid: 'ConvexHullOutput',
    description: {
        id: 'result',
        format: 'application/vnd.geo+json',
        name: 'result',
        type: 'complex',
        icon: 'dot-circle',
        reference: false,
    },
    value: null
};


export class MySimpleService extends WpsProcess implements WizardableProcess {
    wizardProperties: WizardProperties = {
        providerName: 'MyCompany',
        providerUrl: 'my.url.org',
        shape: 'dot-circle',
    };

    constructor(http: HttpClient) {
        super(
            'org.n52.wps.server.algorithm.JTSConvexHullAlgorithm',
            'MyConvexHullSerivce',
            ['ConvexHullInput'],
            ['ConvexHullOutput'],
            'org.n52.wps.server.algorithm.JTSConvexHullAlgorithm',
            'Simple Echo Process',
            'http://riesgos.dlr.de/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable()
        );
    }
}
