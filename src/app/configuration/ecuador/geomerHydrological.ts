import { ExecutableProcess, ProcessStateUnavailable, Product, AutorunningProcess, ProcessStateAvailable } from 'src/app/wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WmsLayerData } from 'src/app/components/map/mappable_wpsdata';
import { Observable, of } from 'rxjs';
import { WpsData } from 'projects/services-wps/src/public-api';
import { laharWms, direction, vei } from './lahar';



export const hydrologicalSimulation: WmsLayerData & WpsData = {
    uid: 'geomerHydrological_hydrologicalSimulation',
    description: {
        id: 'hydrologicalSimulation',
        icon: 'tsunami',
        name: 'Hydrological Simulation',
        format: 'application/WMS',
        reference: false,
        type: 'complex',
    },
    value: null
};


export const geomerFlood: WizardableProcess & ExecutableProcess = {
    uid: 'geomerHydrological',
    name: 'Flood',
    requiredProducts: [direction, laharWms, vei].map(p => p.uid),
    providedProducts: [hydrologicalSimulation.uid],
    state: new ProcessStateUnavailable(),
    wizardProperties: {
        providerName: 'geomer',
        providerUrl: 'https://www.geomer.de/en/index.html',
        shape: 'tsunami'
    },
    execute: (inputs: Product[]): Observable<Product[]> => {
        const directionProduct = inputs.find(prd => prd.uid === direction.uid);
        const veiVal = inputs.find(prd => prd.uid === vei.uid).value.toLowerCase();
        if (veiVal === 'vei1') {
            return of([]);
        }
        if (directionProduct.value === 'North') {
            return of([{
                ...hydrologicalSimulation,
                value: [
                        `https://www.sd-kama.de/geoserver/flood_vei/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=duration_${veiVal}_north&WIDTH=256&HEIGHT=256&BBOX=-2.8125,-80.15625,-1.40625,-78.75&SRS=AUTO:42001&STYLES=&CRS=EPSG:4326`,
                        `https://www.sd-kama.de/geoserver/flood_vei/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=v_atwdmax_${veiVal}_north&WIDTH=256&HEIGHT=256&BBOX=0,-81.5625,1.40625,-80.15625&SRS=AUTO:42001&STYLES=&CRS=EPSG:4326`,
                        `https://www.sd-kama.de/geoserver/flood_vei/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=wd_max_${veiVal}_north&WIDTH=256&HEIGHT=256&BBOX=0,-77.34375,1.40625,-75.9375&SRS=AUTO:42001&STYLES=&CRS=EPSG:4326`,
                        `https://www.sd-kama.de/geoserver/flood_vei/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=duration_${veiVal}_south&WIDTH=256&HEIGHT=256&BBOX=-2.8125,-80.15625,-1.40625,-78.75&SRS=AUTO:42001&STYLES=&CRS=EPSG:4326`,
                        `https://www.sd-kama.de/geoserver/flood_vei/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=v_atwdmax_${veiVal}_south&WIDTH=256&HEIGHT=256&BBOX=0,-81.5625,1.40625,-80.15625&SRS=AUTO:42001&STYLES=&CRS=EPSG:4326`,
                        `https://www.sd-kama.de/geoserver/flood_vei/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=wd_max_${veiVal}_south&WIDTH=256&HEIGHT=256&BBOX=0,-77.34375,1.40625,-75.9375&SRS=AUTO:42001&STYLES=&CRS=EPSG:432`
                ]
            }]);
        } else {
            return of([{
                ...hydrologicalSimulation,
                value: [
                    'https://www.sd-kama.de/geoserver/rain_cotopaxi/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=duration_latacunga_north&WIDTH=256&HEIGHT=256&BBOX=-2.8125,-80.15625,-1.40625,-78.75&SRS=AUTO:42001&STYLES=&CRS=EPSG:4326',
                    'https://www.sd-kama.de/geoserver/rain_cotopaxi/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=v_at_wdmax_latacunga_north&WIDTH=256&HEIGHT=256&BBOX=0,-81.5625,1.40625,-80.15625&SRS=AUTO:42001&STYLES=&CRS=EPSG:4326',
                    'https://www.sd-kama.de/geoserver/rain_cotopaxi/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=wd_max_latacunga_north&WIDTH=256&HEIGHT=256&BBOX=0,-77.34375,1.40625,-75.9375&SRS=AUTO:42001&STYLES=&CRS=EPSG:4326',
                    'https://www.sd-kama.de/geoserver/rain_cotopaxi/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=duration_latacunga_city&WIDTH=256&HEIGHT=256&BBOX=-2.8125,-80.15625,-1.40625,-78.75&SRS=AUTO:42001&STYLES=&CRS=EPSG:4326',
                    'https://www.sd-kama.de/geoserver/rain_cotopaxi/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=v_at_wdmax_latacunga_city&WIDTH=256&HEIGHT=256&BBOX=0,-81.5625,1.40625,-80.15625&SRS=AUTO:42001&STYLES=&CRS=EPSG:4326',
                    'https://www.sd-kama.de/geoserver/rain_cotopaxi/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=wd_max_latacunga_city&WIDTH=256&HEIGHT=256&BBOX=0,-77.34375,1.40625,-75.9375&SRS=AUTO:42001&STYLES=&CRS=EPSG:4326'
                ]
            }]);
        }
    }
};




export const durationTiff: WpsData & Product = {
    uid: 'FlooddamageProcess_duration',
    description: {
        id: 'duration-h',
        reference: true,
        type: 'complex',
        format: 'image/geotiff',
        description: 'Tiff file with the duration of the flood in hours'
    },
    value: null
};

export const velocityTiff: WpsData & Product = {
    uid: 'FlooddamageProcess_velocity',
    description: {
        id: 'vsmax-ms',
        reference: true,
        type: 'complex',
        format: 'image/geotiff',
        description: 'Tiff file with the maximum velocity of the flood in m/s'
    },
    value: null
};

export const depthTiff: WpsData & Product = {
    uid: 'FlooddamageProcess_depth',
    description: {
        id: 'wdmax-cm',
        reference: true,
        type: 'complex',
        format: 'image/geotiff',
        description: 'Tiff file with the maximum water depth of the flood in cm'
    },
    value: null
};


export const geomerFloodWcsProvider: AutorunningProcess = {
    uid: 'geomerFloodWcsProvider',
    name: 'geomerFloodWcsProvider',
    requiredProducts: [direction, hydrologicalSimulation].map(pr => pr.uid),
    providedProducts: [durationTiff, velocityTiff, depthTiff].map(pr => pr.uid),
    state: new ProcessStateAvailable(),
    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        switch (newProduct.uid) {
            case hydrologicalSimulation.uid:
                const directionProduct = allProducts.find(prd => prd.uid === direction.uid);
                return [{
                    ... durationTiff,
                    value: 'http://www.sd-kama.de/geoserver/rain_cotopaxi/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=rain_cotopaxi:duration_latacunga_city&format=image/geotiff'
                }, {
                    ... velocityTiff,
                    value: 'http://www.sd-kama.de/geoserver/rain_cotopaxi/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=rain_cotopaxi:v_at_wdmax_latacunga_city&format=image/geotiff'
                }, {
                    ... depthTiff,
                    value: 'http://www.sd-kama.de/geoserver/rain_cotopaxi/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=rain_cotopaxi:wd_max_latacunga_city&format=image/geotiff'
                }];
            default:
                return [];
        }
    }
}