import { Injectable } from '@angular/core';


import { Layer, VectorLayer, CustomLayer, RasterLayer, popup, WmtsLayer, WmsLayer, IWmsParams, IWmtsParams } from '@ukis/services-layers';

import olMap from 'ol/Map';
import olView from 'ol/View';
import { ViewOptions as olViewOptions } from 'ol/View';

import olLayer from 'ol/layer/Layer';
import olLayerGroup from 'ol/layer/Group';
import olOverlay from 'ol/Overlay';

import olTileLayer from 'ol/layer/Tile';
import olVectorLayer from 'ol/layer/Vector';
import olImageLayer from 'ol/layer/Image';
import olVectorTileLayer from 'ol/layer/VectorTile';

import olXYZ from 'ol/source/XYZ';
import { Options as olXYZOptions } from 'ol/source/XYZ';
import olTileWMS from 'ol/source/TileWMS';
import { Options as olTileWMSOptions } from 'ol/source/TileWMS';
import olWMTS from 'ol/source/WMTS';
import { Options as olWMTSOptions } from 'ol/source/WMTS';
import olWMTSTileGrid from 'ol/tilegrid/WMTS';
import olTileGrid from 'ol/tilegrid/TileGrid';
import olVectorSource from 'ol/source/Vector';
import olTileJSON from 'ol/source/TileJSON';
import olCluster from 'ol/source/Cluster';
import olFeature from 'ol/Feature';

import olCollection from 'ol/Collection';
import olGeoJSON from 'ol/format/GeoJSON';
import olProjection from 'ol/proj/Projection';
import { transformExtent, get as getProjection, transform } from 'ol/proj';
import { register as olRegister } from 'ol/proj/proj4';
import proj4 from 'proj4';
import { extend as olExtend, getWidth as olGetWidth, getHeight as olGetHeight, getTopLeft as olGetTopLeft } from 'ol/extent';
import { DEFAULT_MAX_ZOOM, DEFAULT_TILE_SIZE } from 'ol/tilegrid/common';
import { easeOut } from 'ol/easing.js';


import olStyle from 'ol/style/Style';
import olText from 'ol/style/Text';
import olFill from 'ol/style/Fill';
import olCircleStyle from 'ol/style/Circle';
import olStroke from 'ol/style/Stroke';

import { DragBox } from 'ol/interaction';


export declare type Tgroupfiltertype = 'baselayers' | 'layers' | 'overlays' | 'Baselayers' | 'Overlays' | 'Layers';

/**
* like olExtend: [minX, minY, maxX, maxY]
*/
export type TGeoExtent = [number, number, number, number] | [number, number, number, number, number, number];

@Injectable({
  providedIn: 'root'
})
export class MapOlService {
  public map: olMap; // ol.Map;
  public view: olView;
  private viewOptions: olViewOptions;
  public EPSG: string;
  private hitTolerance = 0;
  constructor() {
    this.map = new olMap({});
    this.view = new olView();
    this.EPSG = 'EPSG:4326'; // 'EPSG:4326'; EPSG:3857
    // this.createMap();
  }

  /** USED in map-ol.component */
  public createMap(target?: HTMLElement) {
    const zoom = 3;
    const center = {
      lat: 0,
      lon: 0
    };

    const _baselayerGroup = new olLayerGroup({
      title: 'Base maps',
      type: 'baselayers',
      layers: []
    } as any);


    const _layersGroup = new olLayerGroup({
      title: 'Layers',
      type: 'layers',
      layers: []
    } as any);

    // ---------------------------------------------------------------------------------------------------
    const _overlayGroup = new olLayerGroup({
      title: 'Overlays',
      type: 'overlays',
      layers: []
    } as any);

    /**
     * set default viewOptions
     */
    this.viewOptions = {
      center: transform([center.lon, center.lat], 'EPSG:4326', this.EPSG),
      zoom: zoom,
      projection: getProjection(this.EPSG)
    };

    if (this.view['constrainRotation']) {
      this.viewOptions.constrainRotation = this.view['constrainRotation'];
    }

    if (this.view['enableRotation']) {
      this.viewOptions.enableRotation = this.view['enableRotation'];
    }

    if (this.view['extent']) {
      this.viewOptions.extent = this.view['extent'];
    }

    if (this.view['constrainOnlyCenter']) {
      this.viewOptions.constrainOnlyCenter = this.view['constrainOnlyCenter'];
    }

    if (this.view['smoothExtentConstraint']) {
      this.viewOptions.smoothExtentConstraint = this.view['smoothExtentConstraint'];
    }

    if (this.view.getMaxResolution()) {
      this.viewOptions.maxResolution = this.view.getMaxResolution();
    }

    if (this.view.getMinResolution()) {
      this.viewOptions.minResolution = this.view.getMinResolution();
    }

    if (this.view.getMaxZoom()) {
      this.viewOptions.maxZoom = this.view.getMaxZoom();
    }

    if (this.view.getMinZoom()) {
      this.viewOptions.minZoom = this.view.getMinZoom();
    }

    if (this.view['multiWorld']) {
      this.viewOptions.multiWorld = this.view['multiWorld'];
    }

    if (this.view['constrainResolution']) {
      this.viewOptions.constrainResolution = this.view['constrainResolution'];
    }

    if (this.view['smoothResolutionConstraint']) {
      this.viewOptions.smoothResolutionConstraint = this.view['smoothResolutionConstraint'];
    }

    if (this.view.getResolution()) {
      this.viewOptions.resolution = this.view.getResolution();
    }

    if (this.view.getResolutions()) {
      this.viewOptions.resolutions = this.view.getResolutions();
    }

    if (this.view['rotation']) {
      this.viewOptions.rotation = this.view['rotation'];
    }

    if (this.view['zoomFactor']) {
      this.viewOptions.zoomFactor = this.view['zoomFactor'];
    }
    const _view = new olView(this.viewOptions);

    /** define map in constructor so it is created before to use it in projects onInit Method  */
    [_baselayerGroup, _layersGroup, _overlayGroup].map(layer => this.map.addLayer(layer));
    this.map.setView(_view);
    this.map.set('controls', []);
    this.view = this.map.getView();
    return {
      map: this.map,
      view: this.view
    };
  }

  public setHitTolerance(tolerance: number) {
    this.hitTolerance = tolerance;
  }

  public getHitTolerance() {
    return this.hitTolerance;
  }

  /**
   * See this example:
   * https://openlayers.org/en/latest/examples/box-selection.html
   * @param conditionForDrawing
   * @param onBoxStart
   * @param onBoxEnd
   */
  public addBboxSelection(conditionForDrawing: (evt: any) => boolean, onBoxStart: () => void, onBoxEnd: (any) => void) {

    const dragBox = new DragBox({
      condition: conditionForDrawing,
      className: 'ol-drag-select'
    });

    dragBox.on('boxstart', function () {
      onBoxStart();
    });

    dragBox.on('boxend', function () {
      const extent = dragBox.getGeometry().getExtent();
      onBoxEnd(extent);
    });

    this.map.addInteraction(dragBox);
  }

  /**
   * get an array of olLayers from a group type
   */
  public getLayers(type: Tgroupfiltertype): olLayer<any>[] {
    const _type = type.toLowerCase() as Tgroupfiltertype;
    let layers;
    this.map.getLayers().getArray().forEach((layerGroup: olLayerGroup) => {
      if (layerGroup.get('type') === _type) {
        layers = layerGroup.getLayers().getArray();
      }
    });
    return layers;
  }

  public getLayerByKey(key: { key: string, value: string }, type: Tgroupfiltertype) {
    const _type = type.toLowerCase() as Tgroupfiltertype;
    const layers = this.getLayers(_type);
    let _layer;
    layers.forEach((layer) => {
      if (layer.get(key.key) && layer.get(key.key) === key.value) {
        _layer = layer;
      }
    });
    return _layer;
  }

  /**
   * add a olLayer to a group if it is not there
   */
  public addLayer(layer: olLayer<any>, type: Tgroupfiltertype) {
    const _type = type.toLowerCase() as Tgroupfiltertype;
    let layers;
    this.map.getLayers().getArray().forEach((layerGroup: olLayerGroup) => {
      if (layerGroup.get('type') === _type) {
        if (!this.isLayerInGroup(layer, layerGroup)) {
          layers = layerGroup.getLayers().getArray();
          layers.push(layer);
          layerGroup.setLayers(new olCollection(layers));
        }
      }
    });
    return layers;
  }

  private isLayerInGroup(layer: olLayer<any>, layerGroup: olLayerGroup) {
    const layers = layerGroup.getLayers().getArray() as olLayer<any>[];
    const haseLayer = layers.filter(l => l.get('id') === layer.get('id'));
    if (haseLayer.length) {
      return true;
    } else {
      return false;
    }
  }


  /**
   * add a array of olLayers to a group if they are not there
   */
  public addLayers(layers: olLayer<any>[], type: Tgroupfiltertype) {
    const _type = type.toLocaleLowerCase() as Tgroupfiltertype;
    this.map.getLayers().forEach((layerGroup: olLayerGroup) => {
      if (layerGroup.get('type') === _type) {
        const groupLayers = layerGroup.getLayers();

        if (groupLayers.getLength() > 0) {
          const mergLayers = layerGroup.getLayers().getArray() as Array<olLayer<any>>;
          layers.map(layer => {
            if (!this.isLayerInGroup(layer, layerGroup)) {
              mergLayers.push(layer);
            }
          });
          layerGroup.setLayers(new olCollection(mergLayers));
        } else {
          layerGroup.setLayers(new olCollection(layers));
        }
      }
    });
    return layers;
  }

  /**
   * reset a group with an array of olLayers
   */
  public setLayers(layers: olLayer<any>[], type: Tgroupfiltertype) {
    const _type = type.toLocaleLowerCase() as Tgroupfiltertype;
    this.map.getLayers().forEach((layerGroup: olLayerGroup) => {
      if (layerGroup.get('type') === _type) {
        layerGroup.setLayers(new olCollection(layers));
      }
    });
    return layers;
  }


  public removeLayerByKey(key: { key: string, value: string }, type: Tgroupfiltertype) {
    const _type = type.toLocaleLowerCase() as Tgroupfiltertype;
    this.map.getLayers().forEach((layerGroup: olLayerGroup) => {
      if (layerGroup.get('type') === _type) {
        const groupLayers = layerGroup.getLayers();
        let removeLayer;
        groupLayers.forEach((layer) => {
          if (layer.get(key.key) && layer.get(key.key) === key.value) {
            removeLayer = layer;
          }
        });
        if (removeLayer) {
          groupLayers.remove(removeLayer);
          layerGroup.setLayers(groupLayers);
        }
      }
    });
  }

  public updateLayerByKey(key: { key: string, value: string }, newLayer: olLayer, type: Tgroupfiltertype) {
    const _type = type.toLocaleLowerCase() as Tgroupfiltertype;
    this.map.getLayers().forEach((layerGroup: olLayerGroup) => {
      if (layerGroup.get('type') === _type) {
        const groupLayers = layerGroup.getLayers();
        groupLayers.forEach((oldLayer, index) => {
          if (oldLayer.get(key.key) && oldLayer.get(key.key) === key.value) {
            const newSource = newLayer.getSource();
            const newProperties = newLayer.getProperties();
            const newExtent = newLayer.getExtent();

            const newMaxZoom = newLayer.getMaxZoom();
            const newMinZoom = newLayer.getMinZoom();

            const newOpacity = newLayer.getOpacity();
            const newVisible = newLayer.getVisible();

            const newZIndex = newLayer.getZIndex();

            if (newSource) {
              oldLayer.setSource(newSource);
            }
            if (newProperties) {
              oldLayer.setProperties(newProperties);
            }
            if (newExtent) {
              oldLayer.setExtent(newExtent);
            }
            if (newMaxZoom) {
              oldLayer.setMaxZoom(newMaxZoom);
            }
            if (newMinZoom) {
              oldLayer.setMinZoom(newMinZoom);
            }
            if (newOpacity) {
              oldLayer.setOpacity(newOpacity);
            }
            if (newVisible) {
              oldLayer.setVisible(newVisible);
            }
            if (newZIndex) {
              oldLayer.setZIndex(newZIndex);
            }
            oldLayer.changed();
            groupLayers.setAt(index, oldLayer);
          }
        });
        layerGroup.setLayers(groupLayers);
      }
    });
  }

  public removeAllLayers(type: Tgroupfiltertype) {
    const _type = type.toLowerCase() as Tgroupfiltertype;
    let layers;
    this.map.getLayers().getArray().forEach((layerGroup: olLayerGroup) => {
      if (layerGroup.get('type') === _type) {
        layers = layerGroup.getLayers();
        layers.clear();
      }
    });

  }

  /**
   * This function resets/adds all olLayers of a type with the new UKIS-Layers
   *
   * if only one group of them map is used and setLayers is called then the map flickers!
   * this is because of all layers are new created and the have all new ol_uid's
   */
  public setUkisLayers(layers: Array<Layer>, type: Tgroupfiltertype) {
    const _type = type.toLowerCase() as Tgroupfiltertype;
    const _layers = [];
    // TODO try to deep check if a layer if exactly the same and dont create it new

    if (layers.length < 1 && _type !== 'baselayers') {
      // this.removeAllLayers('overlays');
      // this.removeAllLayers('layers');
      this.removeAllLayers(_type);
    } else {
      layers.forEach((newLayer) => {
        const _layer = this.create_layers(newLayer);
        // check if layer not undefined
        if (_layer) {
          _layers.push(_layer);
        }
      });
    }

    if (_layers.length > 0) {
      this.setLayers(_layers, _type);
    }
  }

  /** This function resets/adds a olLayer of a type with the new UKIS-Layer */
  public setUkisLayer(newLayer: Layer, type?: Tgroupfiltertype): void {
    if (!type) {
      type = newLayer.filtertype;
    }
    const _type = type.toLowerCase() as Tgroupfiltertype;
    const oldLayers: olLayer<any>[] = this.getLayers(_type);
    const oldLayer = oldLayers.find(l => l.get('id') === newLayer.id);
    const newOlLayer = this.create_layers(newLayer);
    if (newOlLayer) {
      this.removeLayerByKey({ key: 'id', value: oldLayer.get('id') }, type);
      this.addLayer(newOlLayer, type);
    }
  }

  public updateUkisLayer(newLayer: Layer, type?: Tgroupfiltertype): void {
    if (!type) {
      type = newLayer.filtertype;
    }
    const _type = type.toLowerCase() as Tgroupfiltertype;
    const oldLayers: olLayer<any>[] = this.getLayers(_type);
    const oldLayer = oldLayers.find(l => l.get('id') === newLayer.id);
    const newOlLayer = this.create_layers(newLayer);
    if (newOlLayer) {
      this.updateLayerByKey({ key: 'id', value: oldLayer.get('id') }, newOlLayer, type);
    }
  }


  private create_layers(newLayer: Layer): null | olLayer<any> {
    let newOlLayer = null;
    switch (newLayer.type) {
      case 'xyz':
        newOlLayer = this.create_xyz_layer(<RasterLayer>newLayer);
        break;
      case 'wms':
        newOlLayer = this.create_wms_layer(<WmsLayer>newLayer);
        break;
      case 'wmts':
        newOlLayer = this.create_wmts_layer(<WmtsLayer>newLayer);
        break;
      case 'geojson':
        newOlLayer = this.create_geojson_layer(<VectorLayer>newLayer);
        break;
      case 'custom':
        newOlLayer = this.create_custom_layer(<CustomLayer>newLayer);
        break;
    }
    return newOlLayer;
  }

  /**
   * define layer types
   */
  private create_xyz_layer(l: RasterLayer): olTileLayer {
    const xyz_options: olXYZOptions = {
      wrapX: false
    };

    if (l.crossOrigin) {
      xyz_options.crossOrigin = l.crossOrigin;
    }

    const _source = new olXYZ(xyz_options);

    if (l.attribution) {
      _source.setAttributions([l.attribution]);
    }

    if (l.continuousWorld) {
      _source.set('wrapX', l.continuousWorld);
    }

    if (l.subdomains) {
      const _urls = l.subdomains.map((item) => l.url.replace('{s}', `${item}`));
      _source.setUrls(_urls);

    } else {
      _source.setUrl(l.url);
    }

    const _layeroptions: any = {
      type: 'xyz',
      name: l.name,
      id: l.id,
      visible: l.visible,
      legendImg: l.legendImg,
      opacity: l.opacity || 1,
      zIndex: 1,
      source: _source
    };

    if (l.popup) {
      _layeroptions.popup = l.popup;
    }

    if (l.bbox) {
      _layeroptions.extent = transformExtent(l.bbox, 'EPSG:4326', this.map.getView().getProjection().getCode());
    }

    return new olTileLayer(_layeroptions);
  }

  private create_wms_layer(l: WmsLayer): olTileLayer {

    const tile_options: olTileWMSOptions = {
      /** use assign here otherwise params is passed by object reference to the openlayers layer! */
      params: Object.assign({}, l.params), // params: {} = { ...l.params } ~ same as assign destructuring
      wrapX: false
    };

    if (l.tileSize) {
      // console.log(l.tileSize)
      tile_options['tileGrid'] = this.getTileGrid<olTileGrid>('default', null, l.tileSize);
      delete tile_options.params['tileSize'];
    }

    // console.log(tile_options);

    if (l.crossOrigin) {
      tile_options.crossOrigin = l.crossOrigin;
    }

    tile_options.params = this.keysToUppercase(tile_options.params);
    const _source = new olTileWMS(tile_options);

    if (l.attribution) {
      _source.setAttributions([l.attribution]);
    }

    if (l.continuousWorld) {
      _source.set('wrapX', l.continuousWorld);
    }

    if (l.subdomains) {
      const _urls = l.subdomains.map((item) => l.url.replace('{s}', `${item}`));
      _source.setUrls(_urls);

    } else {
      _source.setUrl(l.url);
    }

    const _layeroptions: any = {
      type: 'wms',
      name: l.name,
      id: l.id,
      visible: l.visible,
      legendImg: l.legendImg,
      opacity: l.opacity || 1,
      zIndex: 1,
      source: _source
    };

    if (l.popup) {
      _layeroptions.popup = l.popup;
      /**
         * ol 6.x problem if popup (map.forEachLayerAtPixel) use className
         * https://github.com/openlayers/openlayers/releases/tag/v6.0.0
         */
      _layeroptions.className = l.id;
    }

    if (l.bbox) {
      _layeroptions.extent = transformExtent(l.bbox, 'EPSG:4326', this.map.getView().getProjection().getCode());
    }
    const newlayer = new olTileLayer(_layeroptions);
    return newlayer;
  }

  private create_wmts_layer(l: WmtsLayer): olTileLayer {
    if (l instanceof WmtsLayer) {

      let tileGrid = this.getTileGrid<olWMTSTileGrid>('wmts');
      let _matrixSet = this.EPSG;
      if (l.params.matrixSetOptions) {
        _matrixSet = l.params.matrixSetOptions.matrixSet;
        if ('resolutions' in l.params.matrixSetOptions) {
          const _resolutions: Array<string | number> = l.params.matrixSetOptions.resolutions;
          tileGrid = this.getTileGrid<olWMTSTileGrid>('wmts', null, l.tileSize, null, _resolutions);
        } else if ('resolutionLevels' in l.params.matrixSetOptions || 'tileMatrixPrefix' in l.params.matrixSetOptions) { /** ISimpleMatrixSet */
          const _resolutionLevels = l.params.matrixSetOptions.resolutionLevels;
          const _tileMatrixPrefix = l.params.matrixSetOptions.tileMatrixPrefix;
          tileGrid = this.getTileGrid<olWMTSTileGrid>('wmts', _resolutionLevels, l.tileSize, _tileMatrixPrefix, null);
        }
        if ('matrixIds' in l.params.matrixSetOptions) {
          const _matrixIds = l.params.matrixSetOptions.matrixIds;
          tileGrid = this.getTileGrid<olWMTSTileGrid>('wmts', null, l.tileSize, null, null, _matrixIds);
        }
      }

      let wmts_options: olWMTSOptions = {
        url: l.url,
        tileGrid: tileGrid,
        matrixSet: _matrixSet,
        'wrapX': false,
        layer: l.params.layer,
        style: l.params.style
      };
      wmts_options = Object.assign(wmts_options, l.params);


      if (l.crossOrigin) {
        wmts_options.crossOrigin = l.crossOrigin;
      }

      const _source = new olWMTS(wmts_options);

      if (l.attribution) {
        _source.setAttributions([l.attribution]);
      }

      if (l.continuousWorld) {
        _source.set('wrapX', l.continuousWorld);
      }


      if (l.subdomains) {
        const _urls = l.subdomains.map((item) => l.url.replace('{s}', `${item}`));
        _source.setUrls(_urls);

      } else {
        _source.setUrl(l.url);
      }

      const _layeroptions: any = {
        type: 'wmts',
        name: l.name,
        id: l.id,
        visible: l.visible,
        legendImg: l.legendImg,
        opacity: l.opacity || 1,
        zIndex: 1,
        source: _source
      };

      if (l.popup) {
        _layeroptions.popup = l.popup;
        /**
         * ol 6.x problem if popup (map.forEachLayerAtPixel) use className
         * https://github.com/openlayers/openlayers/releases/tag/v6.0.0
         */
        _layeroptions.className = l.id;
      }

      if (l.bbox) {
        _layeroptions.extent = transformExtent(l.bbox, 'EPSG:4326', this.map.getView().getProjection().getCode());
      }

      return new olTileLayer(_layeroptions);
    } else {
      const _l = <Layer>l;
      console.error(`layer with id: ${_l.id} and type ${_l.type} is no instanceof WmtsLayer!`);
    }
  }


  private create_geojson_layer(l: VectorLayer) {
    let _source;
    if (l.data) {
      _source = new olVectorSource({
        features: this.geoJsonToFeatures(l.data),
        format: new olGeoJSON(),
        wrapX: false
      });
    } else if (l.url) {
      _source = new olTileJSON({
        url: l.url,
        crossOrigin: 'anonymous',
        wrapX: false
      });
    }

    if (l.continuousWorld) {
      _source.set('wrapX', l.continuousWorld);
    }

    const _layeroptions = <any>{
      type: 'geojson',
      name: l.name,
      id: l.id,
      visible: l.visible,
      legendImg: l.legendImg,
      opacity: l.opacity || 1,
      zIndex: 1,
      source: _source
    };

    if (l.popup) {
      _layeroptions.popup = l.popup;
      /**
         * ol 6.x problem if popup (map.forEachLayerAtPixel) use className
         * https://github.com/openlayers/openlayers/releases/tag/v6.0.0
         */
      _layeroptions.className = l.id;
    }

    if (l.bbox) {
      _layeroptions.extent = transformExtent(l.bbox, 'EPSG:4326', this.map.getView().getProjection().getCode());
    }

    if (l.cluster) {
      const clusteroptions: any = {};
      if (typeof l.cluster === 'object') {
        Object.assign(clusteroptions, l.cluster);
      }
      clusteroptions.source = _source;
      const clusterSource = new olCluster(clusteroptions);
      _layeroptions.source = clusterSource;
      const styleCache = {};
      _layeroptions.style = (feature) => {
        const size = feature.get('features').length;
        let style = styleCache[size];
        if (!style) {
          style = new olStyle({
            image: new olCircleStyle({
              radius: 10,
              stroke: new olStroke({
                color: '#fff'
              }),
              fill: new olFill({
                color: '#3399CC'
              })
            }),
            text: new olText({
              text: size.toString(),
              fill: new olFill({
                color: '#fff'
              })
            })
          });
          styleCache[size] = style;
        }
        return style;
      };
    }

    if (l.options) {
      Object.assign(_layeroptions, l.options);
    }

    return new olVectorLayer(_layeroptions);
  }

  private create_custom_layer(l: CustomLayer) {
    if (l.custom_layer) {
      const layer = (l.custom_layer as olLayer<any>);

      const _source = layer.getSource();
      _source.set('wrapX', false);

      if (l.attribution) {
        _source.setAttributions([l.attribution]);
      }

      if (l.continuousWorld) {
        _source.set('wrapX', l.continuousWorld);
      }

      const _layeroptions = <any>{
        type: 'custom',
        name: l.name,
        id: l.id,
        visible: l.visible,
        legendImg: l.legendImg,
        opacity: l.opacity || 1,
        zIndex: 1,
      };

      if (l.maxResolution) {
        _layeroptions.maxResolution = l.maxResolution;
      }
      if (l.minResolution) {
        _layeroptions.minResolution = l.minResolution;
      }

      if (l.popup) {
        _layeroptions.popup = l.popup;
        /**
         * ol 6.x problem if popup (map.forEachLayerAtPixel) use className
         * https://github.com/openlayers/openlayers/releases/tag/v6.0.0
         */
        _layeroptions.className = l.id;
      }

      if (l.bbox) {
        _layeroptions.extent = transformExtent(l.bbox, 'EPSG:4326', this.map.getView().getProjection().getCode());
      }

      layer.setProperties(_layeroptions);
      // don't delete the custom Layer, it is used to newly create all layer from layerservice after map all layers removed!
      // delete l.custom_layer;
      return layer;

    } else {
      console.log('attribute custom_layer not set on layer type custom!');
    }
  }

  private resolutionsFromExtent(extent, opt_maxZoom: number, tileSize: number) {
    const maxZoom = opt_maxZoom;

    const height = olGetHeight(extent);
    const width = olGetWidth(extent);

    const maxResolution = Math.max(width / tileSize, height / tileSize);

    const length = maxZoom + 1;
    const resolutions = new Array(length);
    for (let z = 0; z < length; ++z) {
      resolutions[z] = maxResolution / Math.pow(2, z);
    }
    return resolutions;
  }

  private matrixIdsFromResolutions(resolutionLevels: number, matrixIdPrefix?: string) {
    return Array.from(Array(resolutionLevels).keys()).map(l => {
      if (matrixIdPrefix) {
        return `${matrixIdPrefix}:${l}`;
      } else {
        return l;
      }
    });
  }

  public getTileGrid<T>(type: 'wmts' | 'default' = 'default', resolutionLevels?: number, tileSize?: number, matrixIdPrefix?: string, resolutions?: Array<string | number>, matrixIds?: Array<string | number>): T {
    const _resolutionLevels = resolutionLevels || DEFAULT_MAX_ZOOM;
    const _tileSize = tileSize || DEFAULT_TILE_SIZE;
    const _matrixIdPrefix = matrixIdPrefix || '';

    const projectionExtent = this.getProjection().getExtent();
    const defaultResolutions = this.resolutionsFromExtent(projectionExtent, _resolutionLevels, _tileSize);
    const defaultMatrixIds = this.matrixIdsFromResolutions(defaultResolutions.length, _matrixIdPrefix);
    /** how to generate matrix ids is not in the wms GetCapabilities ?? */

    const tileGridOptions: any = {
      extent: projectionExtent,
      origin: olGetTopLeft(projectionExtent),
      resolutions: resolutions || defaultResolutions,
      tileSize: [_tileSize, _tileSize]
    };

    if (type === 'wmts') {
      tileGridOptions.matrixIds = matrixIds || defaultMatrixIds;
      const grid = new olWMTSTileGrid(tileGridOptions);
      return grid as unknown as T;
    } else if (type === 'default') {
      const grid = new olTileGrid(tileGridOptions);
      return grid as unknown as T;
    }
  }

  public vector_on_click(evt) {
    const FeaturesAtPixel = [];
    this.map.forEachFeatureAtPixel(evt.pixel, (_layer, layer) => {
      // console.log(layer);
      // console.log(evt, _layer, layer, layer.get('type'))
      FeaturesAtPixel.push({ _layer: _layer, layer: layer });
    }, {
      layerFilter: (layer: olVectorLayer) => {
        if (layer instanceof olVectorLayer) {
          const _source: olCluster | olVectorSource<any> = layer.getSource();
          if (_source instanceof olCluster) {
            return (_source as any).getSource() instanceof olVectorSource;
          } else {
            return _source instanceof olVectorSource;
          }
        }
      },
      hitTolerance: this.hitTolerance
    });

    FeaturesAtPixel.forEach((item, index) => {
      const topFeature = 0;
      if (index == topFeature) {
        const layer = item.layer, _layer = item._layer;
        const layerpopup: popup = layer.get('popup');
        let _properties: any = {};

        if (layer instanceof olVectorLayer && layerpopup) {
          const features = _layer.getProperties().features;
          if (features && features.length === 1) {
            const feature = features[0];
            _properties = feature.getProperties();
          } else if (features && features.length > 1) {
            // zoom in TODO
            // _layer.getProperties()
            // _layer.getGeometry().getExtent()
            const extent = this.getFeaturesExtent(_layer.getProperties().features);
            // console.log(_layer, extent)
            this.setExtent(extent);
            return false;
          } else {
            // type no cluster
            _properties = _layer.getProperties();
          }

          const args = {
            modelName: _properties.id,
            properties: _properties,
            layer: _layer,
            event: evt
          };

          if (layerpopup.pupupFunktion) {
            args['popupFn'] = layerpopup.pupupFunktion;
          }

          let popupproperties = Object.assign({}, _properties);

          // console.log(popupproperties);
          if (layerpopup['properties']) {
            if (Array.isArray(Object.keys(layerpopup['properties']))) {
              popupproperties = Object.keys(popupproperties)
                .filter(key => Object.keys(layerpopup['properties']).includes(key))
                .reduce((obj, key) => {
                  // obj[key] = popupproperties[key];
                  const newKey = layerpopup['properties'][key];
                  obj[newKey] = popupproperties[key];
                  return obj;
                }, {});
            }
          }
          if (popupproperties.geometry) {
            delete popupproperties.geometry;
          }
          if (layerpopup.asyncPupup) {
            layerpopup.asyncPupup(popupproperties, (html) => {
              this.addPopup(args, popupproperties, html);
            });
          } else {
            this.addPopup(args, popupproperties);
          }
        }
      }
    });
  }

  public raster_on_click(evt, layer, color?) {
    const layerpopup: popup = layer.get('popup');
    let _properties: any = {};

    if (layerpopup) {
      _properties = layer.getProperties();
      _properties.evt = evt;
      if (color) {
        _properties.color = color;
      }

      const args = {
        modelName: _properties.id,
        properties: _properties,
        layer: layer,
        event: evt
      };

      if (layerpopup.pupupFunktion) {
        args['popupFn'] = layerpopup.pupupFunktion;
      }

      let popupproperties = Object.assign({}, _properties);

      // console.log(popupproperties);
      if (layerpopup['properties']) {
        if (Array.isArray(Object.keys(layerpopup['properties']))) {
          popupproperties = Object.keys(popupproperties)
            .filter(key => Object.keys(layerpopup['properties']).includes(key))
            .reduce((obj, key) => {
              // obj[key] = popupproperties[key];
              const newKey = layerpopup['properties'][key];
              obj[newKey] = popupproperties[key];
              return obj;
            }, {});
        }
      }
      if (popupproperties.geometry) {
        delete popupproperties.geometry;
      }
      // console.log(popupproperties);

      if (layerpopup.asyncPupup) {
        layerpopup.asyncPupup(popupproperties, (html) => {
          if (html) {
            this.addPopup(args, null, html);
          }
        });
      } else {
        this.addPopup(args, popupproperties);
      }
    }
  }

  /** USED in map-ol.component */
  public layers_on_click(evt) {
    // pixel, callback, opt_options
    const LayersAtPixel = [];
    this.map.forEachLayerAtPixel(evt.pixel, (layer, color) => {
      LayersAtPixel.push({ layer: layer, color: color });
    }, {
      layerFilter: (layer) => {
        // try to catch CORS error in getImageData!!!
        // layer.sourceChangeKey_ && layer.sourceChangeKey_.target && layer.sourceChangeKey_.target.crossOrigin != "anonymous"
        // console.log(layer)
        if (layer.get('popup')) {
          return true;
        }
      }
    });
    LayersAtPixel.forEach((item, index) => {
      console.log(item, index)
      const topLayer = 0;
      if (index == topLayer) {
        this.layer_on_click(evt, item.layer, item.color);
      }
    });
  }


  public layer_on_click(evt, layer, color?) {
    if (layer instanceof olImageLayer) {
      this.raster_on_click(evt, layer, color);
    } else if (layer instanceof olTileLayer) {
      this.raster_on_click(evt, layer, color);
    } else if (layer instanceof olVectorLayer) {
      this.vector_on_click(evt);
    } else if (layer instanceof olVectorTileLayer) {
      this.vector_on_click(evt);
    }
  }

  public addPopup(args: any, popupObj: any, html?: string) {
    const content = document.createElement('div');
    content.className = 'ol-popup-content';

    let popup_html = '';
    if (args.popupFn) {
      popup_html = args.popupFn(popupObj);
    } else if (html && !popupObj) {
      popup_html = html;
    } else {
      popup_html = this.createPopupHtml(popupObj);
    }
    content.innerHTML = popup_html;

    const closer = document.createElement('a');
    closer.className = 'ol-popup-closer';

    const container = document.createElement('div');
    container.className = 'ol-popup';
    container.id = `popup_${new Date().getTime()}`;
    container.style.display = 'block';

    container.appendChild(closer);
    container.appendChild(content);

    const overlayoptions = {
      element: container,
      autoPan: true,
      id: (args.layer && args.layer.ol_uid) ? args.layer.ol_uid : `popup_${new Date().getTime()}`,
      autoPanAnimation: {
        duration: 250
      },
      positioning: 'bottom-center',
      stopEvent: true,
      insertFirst: false
    };

    const overlay = new olOverlay(<any>overlayoptions);
    overlay.set('type', 'popup');

    let coordinate;
    if (args.properties && args.properties.geometry && args.properties.geometry.getType() == 'Point') {
      coordinate = args.properties.geometry.getCoordinates();
    } else {
      coordinate = args.event.coordinate;
    }

    overlay.setPosition(coordinate);
    const closeFunction = () => {
      closer.removeEventListener('click', closeFunction, false);
      this.map.removeOverlay(overlay);
    };
    closer.addEventListener('click', closeFunction, false);

    this.map.addOverlay(overlay);
  }

  /** USED in map-ol.component */
  public removeAllPopups() {
    const popups = this.getPopups();
    popups.forEach((overlay) => {
      if (overlay.get('type') === 'popup') {
        this.map.removeOverlay(overlay);
      }
    });
  }

  public createPopupHtml(obj: any) {
    let htmlStr = '<table>';
    for (const o in obj) {
      if (obj.hasOwnProperty(o)) {
        htmlStr += '<tr><td style="vertical-align: top; padding-right: 7px;"><b>' + o + ': </b></td><td>' + obj[o] +
          '</td></tr>';
      }
    }
    htmlStr = htmlStr + '</table>';
    return htmlStr;
  }

  public getPopups(): olOverlay[] {
    const popups = [];
    this.map.getOverlays().getArray().slice(0).forEach((overlay) => {
      if (overlay.get('type') === 'popup') {
        popups.push(overlay);
      }
    });
    return popups;
  }
  /**
   *
   * @param extent: [minX, minY, maxX, maxY]
   * @param geographic: boolean
   * @param fitOptions
   * @returns olExtend: [minX, minY, maxX, maxY]
   */
  public setExtent(extent: TGeoExtent, geographic?: boolean, fitOptions?: any): TGeoExtent {
    const projection = (geographic) ? getProjection('EPSG:4326') : getProjection(this.EPSG);
    const transfomExtent = transformExtent(extent, projection, this.map.getView().getProjection().getCode());
    const _fitOptions = {
      size: this.map.getSize(),
      // padding: [100, 200, 100, 100] // Padding (in pixels) to be cleared inside the view. Values in the array are top, right, bottom and left padding. Default is [0, 0, 0, 0].
    };
    if (fitOptions) {
      Object.assign(_fitOptions, fitOptions);
    }
    this.map.getView().fit(transfomExtent, fitOptions);
    return (transfomExtent as TGeoExtent);
  }

  /** USED in map-ol.component */
  /** ol.Coordinate xy */
  public setCenter(center: number[], geographic?: boolean): number[] {
    const projection = (geographic) ? getProjection('EPSG:4326') : getProjection(this.EPSG);
    const transfomCenter = transform(center, projection, this.map.getView().getProjection().getCode());
    // console.log('set center in svc', transfomCenter)
    // console.log(this.map.getView().getCenter())
    this.map.getView().setCenter(transfomCenter);
    return transfomCenter;
  }

  /** USED in map-ol.component */
  public getCenter(geographic?: boolean): any {
    const dstProjection = (geographic) ? getProjection('EPSG:4326') : getProjection(this.EPSG);
    const srcProjection = getProjection(this.map.getView().getProjection().getCode());
    const transfomCenter = transform(this.map.getView().getCenter(), srcProjection, dstProjection);
    return transfomCenter;
  }
  /**
   *
   * @param features: olFeature[]
   * @param geographic: boolean
   * @returns olExtend: [minX, minY, maxX, maxY]
   */
  public getFeaturesExtent(features: olFeature<any>[], geographic?: boolean): TGeoExtent {
    const extent: any = features[0].getGeometry().getExtent().slice(0);
    features.forEach((feature) => {
      olExtend(extent, feature.getGeometry().getExtent());
    });
    if (geographic) {
      const projection = getProjection('EPSG:4326')
      const transfomExtent = transformExtent(extent, this.map.getView().getProjection().getCode(), projection);
      return (transfomExtent as TGeoExtent);
    } else {
      return extent;
    }
  }

  /** USED in map-ol.component */
  /**
   * @param geographic
   * @returns olExtend: [minX, minY, maxX, maxY]
   */
  public getCurrentExtent(geographic?: boolean): TGeoExtent {
    const projection = (geographic) ? getProjection('EPSG:4326') : getProjection(this.EPSG);
    const extent = this.map.getView().calculateExtent();
    const transfomExtent = transformExtent(extent, this.map.getView().getProjection().getCode(), projection);
    return (transfomExtent as TGeoExtent);
  }

  /** USED in map-ol.component */
  public setZoom(zoom: number, notifier?: 'map' | 'user') {
    const view = this.map.getView();
    view.setZoom(zoom);
  }

  /** USED in map-ol.component */
  public getZoom(): number {
    return this.map.getView().getZoom()
  }

  public zoomInOut(value: '-' | '+') {
    const view = this.map.getView();
    if (!view) {
      // the map does not have a view, so we can't act
      // upon it
      return;
    }
    const delta = 1, duration = 250;
    const currentZoom = view.getZoom();
    if (currentZoom !== undefined) {
      const newZoom = view.getConstrainedZoom(currentZoom + delta);
      if (duration > 0) {
        if (view.getAnimating()) {
          view.cancelAnimations();
        }
        view.animate({
          zoom: newZoom,
          duration: duration,
          easing: easeOut
        });
      } else {
        view.setZoom(newZoom);
      }
    }
  }

  public geoJsonToFeature(geojson: any): olFeature<any> {
    const GEOJSON = new olGeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: this.EPSG
    });
    return GEOJSON.readFeature(geojson);
  }

  public geoJsonToFeatures(geojson: any): Array<olFeature<any>> {
    const GEOJSON = new olGeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: this.EPSG
    });
    return GEOJSON.readFeatures(geojson);
  }

  /**
   * @returns 'olProjection'
   */
  public getProjection() {
    return this.map.getView().getProjection();
  }

  /**
   * function to reproject vector features
   * @param source:  olVectorSource
   * @param srcProj: string (e.g. 'EPSG:4326')
   * @param dstProj: string (e.g. 'EPSG:3857')
   */
  public reprojectFeatures(source: olVectorSource, srcProj: string, dstProj: string) {
    source.getFeatures().forEach(feature => {
      feature.getGeometry().transform(srcProj, dstProj)
    });
  }

  /**
   * vector layers will be reprojected automatically
   * wms layers will be updated with corresponding proj def in the requests.
   * for other raster layers and for those wms layers which backend does not support target projection, please
   * define initial(default) layer projection, so openlayers will reproject on the client side
   * projection is proj~ProjectionLike
   */
  public setProjection(projection: olProjection | string) {
    if (projection) {
      let _viewOptions: olViewOptions = {};
      if (this.viewOptions) {
        _viewOptions = this.viewOptions;
        _viewOptions.minResolution = undefined;
        _viewOptions.maxResolution = undefined;
        _viewOptions.resolution = undefined;
        _viewOptions.resolutions = undefined;
      }
      if (projection instanceof olProjection) {
        _viewOptions.projection = projection;
        let newCenter = transform(this.map.getView().getCenter(), this.map.getView().getProjection(), projection); //get center coordinates in the new projection
        _viewOptions.center = newCenter; //this.map.getView().getCenter();
        // _viewOptions.extent = projection.getExtent();// || undefined;
        _viewOptions.zoom = this.map.getView().getZoom();
      } else if (typeof projection === 'string') {
        _viewOptions.projection = projection;
        _viewOptions.center = this.map.getView().getCenter();
        _viewOptions.zoom = this.map.getView().getZoom();
      }
      let _view = new olView(_viewOptions);
      let oldProjection = this.EPSG;
      this.EPSG = _view.getProjection().getCode();
      this.map.setView(_view);
      this.view = this.map.getView();

      //reprojecting vector layers
      this.map.getLayers().getArray().forEach((layerGroup: olLayerGroup) => {
        layerGroup.getLayers().getArray().forEach(layer => {
          let source = layer.getSource();
          //check for nested sources, e.g. cluster or cluster of clusters etc
          while (source['source']) {
            source = source['source'];
          }
          if (source instanceof olVectorSource) {
            this.reprojectFeatures(source, oldProjection, this.EPSG);
          }
        });
      });

    } else {
      // console.log('projection code is undefined');
    }
  }

  public registerProjection(projDef: any) {
    proj4.defs(projDef.code, projDef.proj4js);
    olRegister(proj4);
  }

  public getOlProjection(projDef: any): olProjection {
    return new olProjection({
      code: projDef.code,
      extent: projDef.extent ? projDef.extent : undefined,
      worldExtent: projDef.worldExtent ? projDef.worldExtent : undefined,
      global: projDef.global ? projDef.global : false,
      units: projDef.units ? projDef.units : undefined
    });
  }

  private keysToUppercase<T>(obj: Object) {
    Object.keys(obj).forEach((key) => {
      const k = key.toUpperCase();
      if (k !== key) {
        obj[k] = obj[key];
        delete obj[key];
      }
    });
    return <T>obj;
  }
}
