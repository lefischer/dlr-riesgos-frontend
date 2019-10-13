import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Layer, RasterLayer } from './types/Layers';
import { LayerGroup } from './types/LayerGroup';

@Injectable({
  providedIn: 'root'
})
export class LayersService {
  private store = new BehaviorSubject(Array<Layer | LayerGroup>());

  private baseLayers = new BehaviorSubject(Array<Layer>());

  private overlays = new BehaviorSubject(Array<Layer>());

  private layers = new BehaviorSubject(Array<Layer>());

  constructor() {

  }


  // ----------------------------------------------------------------------------------------------------------------
  /**
   * Adds a ukis Layer to the Layerservice Store
   * filtertype: 'Baselayers' | 'Overlays' | 'Layers'
   * if filtertype is not provided the filtertype of the Layer is used!
   *
   * if toGroup is true the layer is not added to the list of Layers and storeItems only used  internal
   */
  public addLayer(layer: Layer, filtertype?: 'Baselayers' | 'Overlays' | 'Layers', toGroup?: boolean) {
    if (!this.isInLayergroups(layer)) {

      if (!filtertype) {
        filtertype = layer.filtertype;
      } else {
        // set filtertype of Layer!!
        layer.filtertype = filtertype;
      }

      const storeItems = this.store.getValue();

      if (toGroup) {
        this.filterFiltertype(filtertype);
      } else {
        storeItems.push(layer);

        this.store.next(storeItems);
        this.filterFiltertype(filtertype);
      }
    } else {
      console.error(`layer or Group with id: ${layer.id} already exists!`);
    }
  }

  /**
  * Removes a ukis Layer from the Layerservice Store
  * filtertype: 'Baselayers' | 'Overlays' | 'Layers'
  * if filtertype is not provided the filtertype of the Layer is used!
  */
  public removeLayer(layer: Layer, filtertype?: 'Baselayers' | 'Overlays' | 'Layers') {
    if (this.isInLayergroups(layer)) {

      if (!filtertype) {
        filtertype = layer.filtertype;
      } else {
        if (filtertype !== layer.filtertype) {
          console.error(`the layer with id: ${layer.id} you want to remove from ${filtertype} is from filtertype: ${layer.filtertype}`);
        }
      }

      // console.log('remove single layer from storeItems!!!!!');
      const storeItems = this.store.getValue().filter((lg) => {
        if (lg instanceof Layer) {
          return lg.id !== layer.id;
        } else {
          return lg;
        }
      });
      this.store.next(storeItems);
      this.filterFiltertype(filtertype);
    } else {
      console.error(`layer or Group with id: ${layer.id} not in storeItems!`);
    }
  }

  /**
  * Updates a ukis Layer in the Layerservice Store
  * filtertype: 'Baselayers' | 'Overlays' | 'Layers'
  * if filtertype is not provided the filtertype of the Layer is used!
  */
  public updateLayer(layer: Layer, filtertype?: 'Baselayers' | 'Overlays' | 'Layers') {

    if (this.isInLayergroups(layer)) {

      if (!filtertype) {
        filtertype = layer.filtertype;
      } else {
        if (filtertype !== layer.filtertype) {
          console.error(`the layer with id: ${layer.id} you want to update is from filtertype: ${layer.filtertype} and not from ${filtertype} `);
        }
      }

      if (layer.filtertype === 'Overlays') {
        for (const l of this.filterOverlays()) {
          if ((l.id === layer.id)) {
            this.overlays.next(this.filterOverlays());
          }
        }
      }
      if (layer.filtertype === 'Layers') {
        for (const l of this.filterLayers()) {
          if ((l.id === layer.id)) {
            this.layers.next(this.filterLayers());
          }
        }
      }
      if (layer.filtertype === 'Baselayers') {
        for (const l of this.baseLayers.getValue()) {
          if ((l.id === layer.id)) {
            this.baseLayers.next(this.filterBaseLayers());
          }
        }
      }


    } else {
      console.error(`layer with id: ${layer.id} you want to update not in storeItems!`);
    }
  }

  /**
   * Removes a ukis Layer or a LayerGroup from the Layerservice Store by the Layer.id or LayerGroup.id
   * if removeNullGroup is set, then it removes the LayerGroup if no layer is in there
   */
  public removeLayerOrGroupById(id: string, removeNullGroup?: boolean) {
    this.store.getValue().filter((lg) => {
      if (lg instanceof Layer) {
        if (lg.id === id) {
          this.removeLayer(lg, lg.filtertype || 'Layers');
        }
      } else if (lg instanceof LayerGroup) {
        // console.log('LayerGroup: ', lg);
        // console.log('id', id);
        if (lg.id === id) {
          this.removeLayerGroup(lg);
        } else {
          // this.removeLayerFromGroup
          lg.layers.forEach((_layer, index) => {
            if (_layer.id === id) {
              this.removeLayerFromGroup(_layer, lg, removeNullGroup);
            }
          });
        }
      }
    });
  }

  /**
   * Adds a ukis Layer to a LayerGroup in the Layerservice Store by providing the Layer and LayerGroup
   */
  public addLayerToGroup(layer: Layer, layerGroup: LayerGroup) {
    if (!this.isInLayergroups(layer)) {
      // convert filtertyle of layer to the same as the group
      if (layer.filtertype !== layerGroup.filtertype) {
        layer.filtertype = layerGroup.filtertype;
      }
      if (!this.isInLayergroups(layer, [layerGroup])) {
        layerGroup.layers.push(layer);
        this.updateLayerGroup(layerGroup);
      } else {
        // throw new Error(`layer or Group with id: ${id} already exists!`);
        console.error(`layer with id: ${layer.id} already exists in ${layerGroup.id}!`, layerGroup);
      }
    } else {
      // throw new Error(`layer or Group with id: ${id} already exists!`);
      console.error(`layer with id: ${layer.id} already exists!`);
    }
  }

  /**
   * Adds a ukis Layer to a LayerGroup in the Layerservice Store by providing the Layer and LayerGroup.id
   */
  public addLayerToGroupById(layer: Layer, GroupId: string) {
    this.store.getValue().forEach((lg) => {
      if (lg instanceof LayerGroup && lg.id === GroupId) {
        this.addLayerToGroup(layer, lg);
      }
    });
  }

  /**
   * Removes a Layer from a LayerGroup in the Layerservice Store
   * By default if no layers on the group it will remove it - change this through set removeNullGroup to false
   */
  public removeLayerFromGroup(layer: Layer, layergroup: LayerGroup, removeNullGroup: boolean = true) {
    layergroup.layers = layergroup.layers.filter(l => l.id !== layer.id);
    this.updateLayerGroup(layergroup);
    this.filterFiltertype(layer.filtertype);

    // if no layers on the group remove it
    if (layergroup.layers.length === 0 && removeNullGroup) {
      this.removeLayerGroup(layergroup);
    }
  }

  /**
  * Set the Layer Index in the Array of Layers in a LayerGroup
  * down == + 1 and up == - 1
  */
  public setLayerIndexInGroup(layer: Layer, dir: 'up' | 'down', layerGroup: LayerGroup) {
    // console.log("move layer in group " + dir);
    // console.log(layerGroup);
    const groupIndex = layerGroup.layers.indexOf(layer);

    switch (dir) {
      case 'up': {
        if (groupIndex === 0) {
          break;
        } else {
          this.arrayMove(layerGroup.layers, groupIndex, groupIndex - 1);
        }
        break;
      }
      case 'down': {
        if (groupIndex === layerGroup.layers.length - 1) {
          break;
        } else {
          this.arrayMove(layerGroup.layers, groupIndex, groupIndex + 1);
        }
        break;
      }
    }
    this.updateLayer(layer, layerGroup.filtertype || 'Layers');
  }


  // ----------------------------------------------------------------------------------------------------------------
  /**
     * Adds a ukis LayerGroup to the Layerservice Store
     * filtertype: 'Baselayers' | 'Overlays' | 'Layers'
     * if filtertype is not provided the filtertype of the LayerGroup is used
     * All the Layers of the Group are set to filtertype of the Group
     */
  public addLayerGroup(layergroup: LayerGroup, filtertype?: 'Baselayers' | 'Overlays' | 'Layers') {
    if (!this.isInLayergroups(layergroup)) {

      if (!filtertype) {
        filtertype = layergroup.filtertype;
      } else {
        // set filtertype of Group!!
        layergroup.filtertype = filtertype;
      }

      const storeItems = this.store.getValue();
      // remove layers from group with the same id as the group!
      if (this.isInLayergroups(layergroup, layergroup.layers)) {
        layergroup.layers = layergroup.layers.filter(l => l.id !== layergroup.id);
      }
      // set filtertype of group to layers
      layergroup.layers = layergroup.layers.map(l => { l.filtertype = layergroup.filtertype; return l; });

      storeItems.push(layergroup);
      this.store.next(storeItems);

      // update to set visible
      this.updateLayerGroup(layergroup);
    }
  }

  /**
  * Removes a ukis LayerGroup to the Layerservice Store
  */
  public removeLayerGroup(layergroup: LayerGroup) {
    if (this.isInLayergroups(layergroup)) {
      // remove all layers of this group from the map
      if (layergroup.removable) {
        for (const layer of layergroup.layers) {
          this.removeLayerFromGroup(layer, layergroup);
        }
        const storeItems = this.store.getValue();

        const filteredGroups = storeItems.filter(function (layer, index) {
          return layer.id !== layergroup.id;
        });

        this.store.next(filteredGroups);
      } else {
        // throw new Error(`layerGroup: ${layerGroup.id} is not removable!`);
        console.log(`layerGroup: ${layergroup.id} is not removable!`);
      }
    } else {
      console.error(`layer or Group with id: ${layergroup.id} not in storeItems!`);
    }
  }

  /**
  * Updates a ukis LayerGroup to the Layerservice Store
  * if sort is set to true the layers of the Group are sort so vectors are above the rasterlayers
  */
  public updateLayerGroup(layerGroup: LayerGroup, sort: boolean = false) {
    if (sort) {
      layerGroup = this.sortLayerGroup(layerGroup);
    }
    for (const layer of layerGroup.layers) {
      this.updateLayer(layer, layerGroup.filtertype || 'Layers');
    }
  }

  /**
  * Moves a Item in an Array to another Index
  */
  public arrayMove(array: Array<any>, fromIndex: number, toIndex: number) {
    array.splice((toIndex < 0 ? array.length + toIndex : toIndex), 0, array.splice(fromIndex, 1)[0]);
  }

  /**
   * Set Group Or Layer Index in the Layerservice Store
   * down == index + 1 and up == index - 1
   */
  public setGroupLayerIndex(group: Layer | LayerGroup, dir: number | 'up' | 'down') {
    let groupsCount;
    if (group instanceof Layer && group.filtertype) {
      groupsCount = this.getNumOfGroups(group.filtertype);
    } else if (group instanceof LayerGroup) {
      groupsCount = this.getNumOfGroups(group.filtertype);
    }

    if (groupsCount > 1) {
      const storeItems = this.store.getValue();

      const groupIndex = storeItems.indexOf(group);

      if (!this.isGroupFirst(group) || !this.isGroupLast(group)) {
        if (typeof dir === 'number') {
          this.arrayMove(storeItems, groupIndex, dir);
        } else if (dir === 'up') {
          this.arrayMove(storeItems, groupIndex, groupIndex - 1);
        } else if (dir === 'down') {
          this.arrayMove(storeItems, groupIndex, groupIndex + 1);
        }
      }
      // console.log('groupIndex after', group.name, lgroups.indexOf(group));
      this.store.next(storeItems);
      this.baseLayers.next(this.filterBaseLayers());
      this.layers.next(this.filterLayers());
      this.overlays.next(this.filterOverlays());
    }
  }

  /**
  * Get the Number of Items from Layerservice Store filtered by filtertype
  * filtertype: 'Baselayers' | 'Overlays' | 'Layers'
  */
  getNumOfGroups(filtertype: 'Baselayers' | 'Overlays' | 'Layers'): number {
    let num = 0;
    const storeItems = this.store.getValue();
    for (const lg of storeItems) {
      if (lg.filtertype === filtertype) {
        // console.log(lg.type, type)
        num++;
      }
    }
    return num;
  }

  /**
  * Check if a Layer or LayerGroup is on index 0 of the Layerservice Store or the provided Array
  * if filtertype is set it only uses the items with this type
  * filtertype?: 'Baselayers' | 'Overlays' | 'Layers'
  */
  isGroupFirst(group: Layer | LayerGroup, _lgroups?: Array<Layer | LayerGroup>, filtertype?: 'Baselayers' | 'Overlays' | 'Layers'): boolean {
    let value = false;

    let storeItems = this.store.getValue();
    if (_lgroups) {
      storeItems = _lgroups;
    }
    if (filtertype) {
      storeItems = storeItems.filter(l => l.filtertype === filtertype);
    }
    if (storeItems.indexOf(group) === 0) {
      // console.log(group.name, 'isFirst')
      value = true;
    }
    return value;
  }

  /**
  * Check if a Layer or LayerGroup is on index (length - 1) of the Layerservice Store or the provided Array
  * if filtertype is set it only uses the items with this type
  * filtertype?: 'Baselayers' | 'Overlays' | 'Layers'
  */
  isGroupLast(group: Layer | LayerGroup, _lgroups?: Array<Layer | LayerGroup>, filtertype?: 'Baselayers' | 'Overlays' | 'Layers'): boolean {
    let value = false;

    let storeItems = this.store.getValue();
    if (_lgroups) {
      storeItems = _lgroups;
    }
    if (filtertype) {
      storeItems = storeItems.filter(l => l.filtertype === filtertype);
    }
    if (storeItems.indexOf(group) === storeItems.length - 1) {
      value = true;
    }
    return value;
  }
  // ----------------------------------------------------------------------------------------------------------------


  /**
  * Check if a Layer or LayerGroup is in the Layerservice Store (or the provided Array) by their ID
  */
  public isInLayergroups(layergroup: Layer | LayerGroup | string, groups?: Array<Layer | LayerGroup>): boolean {
    let value = false;
    let id;
    if (layergroup instanceof Layer || layergroup instanceof LayerGroup) {
      id = layergroup.id;
    } else {
      id = layergroup;
    }
    const items = this.getLayerOrGroupById(id, groups);
    if (items.length > 0) {
      value = true;
    }
    return value;
  }

  /**
   * Get a Layer or LayerGroup by ID from the Layerservice Store (or the provided Array)
   * normal there should only be returned one or zero items in the array otherwise there is a duplicate ID in the Layer Groups!!
   */
  public getLayerOrGroupById(id: string, groups?: Array<Layer | LayerGroup>) {
    const items: Array<Layer | LayerGroup> = [];
    let storeItems = this.store.getValue();
    if (groups) {
      storeItems = groups;
    }
    storeItems.map(group => {
      if (group instanceof LayerGroup) {
        if (group.id === id) {
          items.push(group);
        } else {
          group.layers.map(layer => {
            if (layer.id === id) {
              items.push(layer);
            }
          });
        }
      } else {
        if (group.id === id) {
          items.push(group);
        }
      }
    });
    return items;
  }
  /**
   * Get a Layer by ID from the Layerservice Store (or the provided Array)
   */
  public getLayerById(id: string, layers?: Array<Layer>) {
    let value: Layer;
    let _layers = this.flattenDeepArray(this.store.getValue());
    if (layers) {
      _layers = layers;
    }
    _layers.map(layer => {
      if (layer.id === id) {
        value = layer;
      }
    });
    return value;
  }

  /**
   * Get all Layers with filterrype 'Baselayers' from the Layerservice Store
   */
  public getBaseLayers(): Observable<Layer[]> {
    return this.baseLayers.asObservable();
  }

  /**
   * Removes Layers with filtertype 'Baselayers' from the Layerservice Store
   * Filter is a function to exclude layers
   */
  public removeBaseLayers(filter?: (value: Layer, index: number, array: Layer[]) => any): Observable<Layer[]> {
    let baselayers = this.filterBaseLayers();
    if (filter) {
      baselayers = baselayers.filter(filter);
    }
    baselayers.forEach((ol) => {
      this.removeLayerOrGroupById(ol.id);
    });
    return this.baseLayers.asObservable();
  }

  public getBaseLayersCount(): number {
    return this.baseLayers.getValue().length;
  }


  /**
   * Get all Layers with filterrype 'Overlays' from the Layerservice Store
   */
  public getOverlays(): Observable<Layer[]> {
    return this.overlays.asObservable();
  }

  /**
   * Removes Layers with filtertype 'Overlays' from the Layerservice Store
   * Filter is a function to exclude layers
   */
  public removeOverlays(filter?: (value: Layer, index: number, array: Layer[]) => any): Observable<Layer[]> {
    let overlays = this.filterOverlays();
    if (filter) {
      overlays = overlays.filter(filter);
    }
    overlays.forEach((ol) => {
      this.removeLayerOrGroupById(ol.id);
    });
    return this.overlays.asObservable();
  }

  public getOverlaysCount(): number {
    return this.overlays.getValue().length;
  }

  /**
   * Get all Layers with filterrype 'Layers' from the Layerservice Store
   * 
   * #### to filter the Observable only on some layer property changes use rxjs filter e.g. see below:
   * this.layersSub = this.layerSvc.getLayers().pipe(filter(layers => {
   *   const newVisible = layers.map(l => l.visible).filter(v => v === true).length;
   *  // subscribe if visible of a layer has changed
   *  if (newVisible !== this.oldVisibleLayers) {
   *     return true;
   *  } else {
   *     // subscribe only to remove, add layers
   *     if (this.layers && this.layers.length !== layers.length) {
   *       return true;
   *    } else {
   *       return false;
   *    }
   *  }
   * })).subscribe(layers => {
   *   this.layers = layers;
   *   this.oldVisibleLayers = this.layers.map(l => l.visible).filter(v => v === true).length;
   * });
   */
  public getLayers(): Observable<Layer[]> {
    return this.layers.asObservable();
  }

  /**
   * Removes Layers with filtertype 'Layers' from the Layerservice Store
   * Filter is a function to exclude layers
   */
  public removeLayers(filter?: (value: Layer, index: number, array: Layer[]) => any): Observable<Layer[]> {
    let layers = this.filterLayers();
    if (filter) {
      layers = layers.filter(filter);
    }
    layers.forEach((ol) => {
      this.removeLayerOrGroupById(ol.id);
    });
    return this.layers.asObservable();
  }

  public getLayersCount(): number {
    return this.layers.getValue().length;
  }

  /**
   * Get all storeItems from the Layerservice
   */
  public getLayerGroups(): Observable<Array<Layer | LayerGroup>> {
    return this.store.asObservable();
  }

  /**
   * Set (Reset) all storeItems from the Layerservice
   */
  public setLayerGroups(storeItems: Array<Layer | LayerGroup>): Observable<Array<Layer | LayerGroup>> {
    // set filtertype of group to layers
    if (storeItems.length > 0) {
      storeItems.map(_group => {
        if (_group instanceof LayerGroup && _group.layers.length > 0) {
          _group.layers = _group.layers.map(l => { l.filtertype = _group.filtertype; return l; });
        }
      });
    }
    this.store.next(storeItems);
    this.baseLayers.next(this.filterBaseLayers());
    this.layers.next(this.filterLayers());
    this.overlays.next(this.filterOverlays());
    return this.store.asObservable();
  }

  /**
   * Get the Count of all storeItems
   */
  public getLayerGroupsCount(): number {
    return this.store.getValue().length;
  }
  // ----------------------------------------------------------------------------------------------------------------


  /**
   * flatten array with Layers and LayerGroups.layers (so you can get the zIndex)
   */
  public flattenDeepArray(arr: Array<Layer | LayerGroup>): Layer[] {
    return arr.reduce((acc, val) => (val instanceof LayerGroup && Array.isArray(val.layers)) ? acc.concat(this.flattenDeepArray(val.layers)) : acc.concat(val), []);
  }

  /*
  getZIndexForLayer(layer: Layer): number {
    let zIndex = null;
    const baselayers = this.baseLayers.getValue();
    const layers = this.layers.getValue();
    const overlays = this.overlays.getValue();
    let arr = [];

    if (layer.filtertype === 'Overlays') {
      arr = arr.concat(baselayers).concat(layers).concat(overlays);
      zIndex = arr.indexOf(layer);
    } else if (layer.filtertype === 'Layers') {
      arr = arr.concat(baselayers).concat(layers);
      zIndex = arr.indexOf(layer);
    } else if (layer.filtertype === 'Baselayers') {
      arr = arr.concat(baselayers);
      zIndex = arr.indexOf(layer);
    }
    return zIndex;
  }
  */

  private filterOverlays() {
    const storeItems = this.store.getValue();
    const _overlays = this.flattenDeepArray(storeItems.filter((layer) => layer.filtertype === 'Overlays'));
    return _overlays;
  }

  private filterBaseLayers() {
    const storeItems = this.store.getValue();
    const _baselayers = this.flattenDeepArray(storeItems.filter((layer) => layer.filtertype === 'Baselayers'));
    return _baselayers;
  }

  private filterLayers() {
    const storeItems = this.store.getValue();
    const _baselayers = this.flattenDeepArray(storeItems.filter((layer) => layer.filtertype === 'Layers'));
    return _baselayers;
  }


  private filterFiltertype(filtertype: 'Baselayers' | 'Overlays' | 'Layers') {
    if (filtertype === 'Baselayers') {
      this.baseLayers.next(this.filterBaseLayers());
    } else if (filtertype === 'Overlays') {
      this.overlays.next(this.filterOverlays());
    } else if (filtertype === 'Layers') {
      this.layers.next(this.filterLayers());
    }
  }


  // ----------------------------------------------------------------------

  private sortLayerGroup(layerGroup: LayerGroup): LayerGroup {

    // fisrt sort in order to put vectors first and then rasterlayers
    layerGroup.layers.sort((a, b) => {
      let comparison = 0;
      if (a instanceof RasterLayer) {
        comparison = 1;
      } else if (b instanceof RasterLayer) {
        comparison = -1;
      }
      return comparison;
    });
    return layerGroup;
  }
}
