import { RasterLayer, IRasterLayerOptions, WmtsLayer, IWmtsOptions } from '@dlr-eoc/services-layers';

/**
 * make all IRasterLayer Options optional because constructor use default objects
 */
type IoptionalRasterLayerOptions = {
  [K in keyof IRasterLayerOptions]?: IRasterLayerOptions[K]
};

type IoptionalIWmtsOptions = {
  [K in keyof IWmtsOptions]?: IWmtsOptions[K]
};
export class google_earth extends RasterLayer {
  constructor(options?: IoptionalRasterLayerOptions) {
    const defaultOptions: IRasterLayerOptions = {
      name: 'Google Satellite',
      displayName: 'Google Satellite',
      id: 'google_satellite',
      visible: false,
      type: 'xyz',
      url: 'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      attribution: '&copy, <a href="https://www.google.de/maps">Google</a> contributors',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      continuousWorld: false,
      legendImg: 'https://mt3.google.com/vt/lyrs=s&x=4&y=3&z=3',
      description: '&copy google.com/vt/lyrs - satellite only',
      opacity: 1
    };
    if (options) { Object.assign(defaultOptions, options); }
    super(defaultOptions);
  }
}

export class google_maps extends RasterLayer {
  constructor(options?: IoptionalRasterLayerOptions) {
    const defaultOptions: IRasterLayerOptions = {
      name: 'Google Maps',
      displayName: 'Google Maps',
      id: 'google_maps',
      visible: false,
      type: 'xyz',
      url: 'https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
      attribution: '&copy, <a href="https://www.google.de/maps">Google</a> contributors',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      continuousWorld: true,
      legendImg: 'https://mt3.google.com/vt/lyrs=m&x=4&y=3&z=3',
      description: '&copy google.com/vt/lyrs - terrain',
      opacity: 1
    };
    if (options) { Object.assign(defaultOptions, options); }
    super(defaultOptions);
  }
}

export class google_hybrid extends RasterLayer {
  constructor(options?: IoptionalRasterLayerOptions) {
    const defaultOptions: IRasterLayerOptions = {
      name: 'Google Hybrid',
      displayName: 'Google Hybrid',
      id: 'google_maps',
      visible: false,
      type: 'xyz',
      url: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      attribution: '&copy, <a href="https://www.google.de/maps">Google</a> contributors',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      continuousWorld: false,
      legendImg: 'https://mt3.google.com/vt/lyrs=y&x=4&y=3&z=3',
      description: '&copy google.com/vt/lyrs - hybrid',
      opacity: 1
    };
    if (options) { Object.assign(defaultOptions, options); }
    super(defaultOptions);
  }
}

export class esri_grey_canvas extends RasterLayer {
  constructor(options?: IoptionalRasterLayerOptions) {
    const defaultOptions: IRasterLayerOptions = {
      name: 'ESRI Neutral Map',
      displayName: 'ESRI Neutral Map',
      id: 'esri_grey_canvas',
      visible: false,
      type: 'xyz',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}.png',
      attribution: '&copy; ESRI',
      continuousWorld: false,
      legendImg: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/3/3/4.png',
      description: '&copy arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base',
      opacity: 1
    };
    if (options) { Object.assign(defaultOptions, options); }
    super(defaultOptions);
  }
}


export class esri_world_imagery extends RasterLayer {
  constructor(options?: IoptionalRasterLayerOptions) {
    const defaultOptions: IRasterLayerOptions = {
      name: 'ESRI Imagery',
      displayName: 'ESRI Imagery',
      id: 'esri_imagery',
      visible: false,
      type: 'xyz',
      url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png',
      attribution: '&copy; ESRI',
      continuousWorld: false,
      legendImg: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/3/3/4.png',
      description: '&copy arcgisonline.com/arcgis/rest/services/World_Imagery',
      opacity: 1
    };
    if (options) { Object.assign(defaultOptions, options); }
    super(defaultOptions);
  }
}


export class esri_ocean_imagery extends RasterLayer {
  constructor(options?: IoptionalRasterLayerOptions) {
    const defaultOptions: IRasterLayerOptions = {
      name: 'ESRI Ocean',
      displayName: 'ESRI Ocean',
      id: 'esri_ocean',
      visible: false,
      type: 'xyz',
      url: 'https://server.arcgisonline.com/arcgis/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}.png',
      attribution: '&copy; ESRI',
      continuousWorld: false,
      legendImg: 'https://server.arcgisonline.com/arcgis/rest/services/Ocean_Basemap/MapServer/tile/3/3/4.png',
      description: '&copy arcgisonline.com/arcgis/rest/services/Ocean_Basemap',
      opacity: 1
    };
    if (options) { Object.assign(defaultOptions, options); }
    super(defaultOptions);
  }
}


export class esri_nav_charts extends RasterLayer {
  constructor(options?: IoptionalRasterLayerOptions) {
    const defaultOptions: IRasterLayerOptions = {
      name: 'ESRI Charts',
      displayName: 'ESRI Charts',
      id: 'esri_charts',
      visible: false,
      type: 'xyz',
      url: 'https://server.arcgisonline.com/arcgis/rest/services/Specialty/World_Navigation_Charts/MapServer/tile/{z}/{y}/{x}.png',
      attribution: '&copy; ESRI',
      continuousWorld: false,
      legendImg: 'https://server.arcgisonline.com/arcgis/rest/services/Specialty/World_Navigation_Charts/MapServer/tile/3/3/4.png',
      description: '&copy arcgisonline.com/arcgis/rest/services/Specialty/World_Navigation_Charts',
      opacity: 1
    };
    if (options) { Object.assign(defaultOptions, options); }
    super(defaultOptions);
  }
}


export class osm extends RasterLayer {
  constructor(options?: IoptionalRasterLayerOptions) {
    const defaultOptions: IRasterLayerOptions = {
      name: 'OpenStreetMap',
      displayName: 'OpenStreetMap',
      id: 'osm',
      visible: false,
      type: 'xyz',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy, <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors',
      continuousWorld: false,
      legendImg: 'https://a.tile.openstreetmap.org/3/4/3.png',
      description: '&copy OpenStreetMap and contributors',
      opacity: 1,
      zIndex: 1
    };
    if (options) { Object.assign(defaultOptions, options); }
    super(defaultOptions);
  }
}


export class eoc_litemap extends RasterLayer {
  constructor(options?: IoptionalRasterLayerOptions) {
    const defaultOptions: IRasterLayerOptions = {
      name: 'EOC Litemap',
      displayName: 'EOC Litemap',
      id: 'eoc_litemap',
      visible: false,
      type: 'wms',
      removable: false,
      params: {
        layers: 'litemap',
        format: 'image/png',
        transparent: true,
        attribution: '',
      },
      url: 'https://geoservice.dlr.de/eoc/basemap/wms',
      attribution: '&copy, <a href="//geoservice.dlr.de/eoc/basemap/">DLR</a>',
      continuousWorld: false,
      legendImg: 'https://geoservice.dlr.de/eoc/basemap/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=litemap&ATTRIBUTION=&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&STYLES=&BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
      description: 'http://www.naturalearthdata.com/about/',
      opacity: 1
    };
    if (options) { Object.assign(defaultOptions, options); }
    super(defaultOptions);
  }
}

export class eoc_litemap_tile extends WmtsLayer {
  constructor(options?: IoptionalIWmtsOptions) {
    const defaultOptions: IWmtsOptions = {
      name: 'EOC Litemap Tile',
      displayName: 'EOC Litemap Tile',
      id: 'eoc_litemap_tile',
      visible: false,
      type: 'wmts',
      removable: false,
      params: {
        layer: 'eoc:litemap',
        format: 'image/png',
        style: '_empty',
        matrixSetOptions: {
          matrixSet: 'EPSG:3857',
          tileMatrixPrefix: 'EPSG:3857'
        }
      },
      url: 'https://tiles.geoservice.dlr.de/service/wmts',
      attribution: '&copy, <a href="//geoservice.dlr.de/eoc/basemap/">DLR</a>',
      continuousWorld: false,
      legendImg: 'https://tiles.geoservice.dlr.de/service/wmts?layer=eoc%3Alitemap&style=_empty&tilematrixset=EPSG%3A3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A3857%3A5&TileCol=18&TileRow=11',
      description: 'EOC Litemap as web map tile service',
      opacity: 1
    };
    if (options) { Object.assign(defaultOptions, options); }
    super(defaultOptions);
  }
}



export class open_sea_map extends RasterLayer {
  constructor(options?: IoptionalRasterLayerOptions) {
    const defaultOptions: IRasterLayerOptions = {
      name: 'OpenSeaMap',
      displayName: 'OpenSeaMap',
      id: 'OpenSeaMap',
      visible: false,
      type: 'xyz',
      removable: false,
      url: 'https://{s}.openseamap.org/seamark/{z}/{x}/{y}.png',
      subdomains: ['t1'],
      attribution: '',
      continuousWorld: false,
      zIndex: 99999,
      legendImg: 'https://t1.openseamap.org/seamark/10/554/321.png',
      description: 'http://map.openseamap.org/',
      opacity: 1
    };
    if (options) { Object.assign(defaultOptions, options); }
    super(defaultOptions);
  }
}
