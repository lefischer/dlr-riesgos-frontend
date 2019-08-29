import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// imports only for typings...
import { LayerGroup, Layer } from '@ukis/services-layers';
import { MapStateService } from '@ukis/services-map-state';
import { LayersService } from '@ukis/services-layers';

@Component({
  selector: 'ukis-layerentry',
  templateUrl: './layerentry.component.html',
  styleUrls: ['./layerentry.component.scss']
})
export class LayerentryComponent implements OnInit {
  @Input('layersSvc') layersSvc: LayersService;
  @Input('mapState') mapState?: MapStateService;
  @Input('layer') layer: Layer;

  @Input('group') group?: LayerGroup;
  @Input('layerGroups') layerGroups?: LayerGroup[];
  @Input('expanded') openProperties = false;
  @Input('expandable') expandable = true;


  @Output() update = new EventEmitter<any>();

  public canZoomToLayer = false;

  public activeTabs = {
    'settings': false,
    'legend': true,
    'description': false
  };

  constructor() {

  }

  getLayerName(layer: Layer) {
    if (layer.displayName) {
      return layer.displayName;
    } else {
      return layer.name;
    }
  }

  ngOnInit() {
    if (!this.layersSvc) {
      console.error('you need to provide a layersService!');
    }
    // console.log(this.layer)
    if (!this.layer.legendImg) {
      this.activeTabs.description = true;
      this.activeTabs.legend = false;
      this.activeTabs.settings = false;
    }

    if (!this.layer.legendImg && !this.layer.description) {
      this.activeTabs.description = false;
      this.activeTabs.legend = false;
      this.activeTabs.settings = true;
    }

    if (this.layer.bbox && this.layer.bbox.length >= 4) {
      this.canZoomToLayer = true;
    }
  }

  /**
   * show or hide the layer
   */
  setLayerVisibility(selectedLayer: Layer, group?: LayerGroup) {
    if (!group) {
      if (selectedLayer.filtertype == 'Baselayers') {
        selectedLayer.visible = !selectedLayer.visible;
        const _layers = this.layerGroups.filter((l) => l.filtertype == 'Baselayers');
        console.log(_layers);
        for (const layer of _layers) {
          if (layer instanceof Layer && layer.id != selectedLayer.id) {
            layer.visible = !selectedLayer.visible;
            this.layersSvc.updateLayer(layer, layer.filtertype || 'Baselayers');
          }
        }
      } else {
        selectedLayer.visible = !selectedLayer.visible;
        this.layersSvc.updateLayer(selectedLayer, selectedLayer.filtertype || 'Layers'); // TODO check for baselayers!!!!!!
      }
    } else {
      /** "radio" for Baselayers */
      if (group.filtertype == 'Baselayers') {
        for (const layer of group.layers) {
          layer.visible = layer === selectedLayer;
        }
        /** "checkbox" for all other layers */
      } else {
        selectedLayer.visible = !selectedLayer.visible;
      }
      this.update.emit({
        layer: this.layer
      });
    }
  }
  /**
   * setLayerIndex
   */
  setLayerIndex(layer: Layer, dir, group?: LayerGroup) {
    console.log('is First', this.isFirst(layer));
    console.log('is Last', this.isLast(layer));
    console.log(layer, group);
    if (group) {
      this.layersSvc.setLayerIndexInGroup(layer, dir, group);
    } else {
      this.layersSvc.setGroupLayerIndex(layer, dir, group);
    }
  }

  /**
   * remove the Layer if possible
   */
  removeLayer(group: LayerGroup, selectedLayer: Layer) {
    // console.log("delete ", group, selectedLayer)
    if (group) {
      // console.log("delete layer from group")
      this.layersSvc.removeLayerFromGroup(selectedLayer, group);
    } else {
      console.log('delete single layer');
      this.layersSvc.removeLayer(selectedLayer, selectedLayer.filtertype);
    }
  }

  zoomTo(layer: Layer) {
    if (this.mapState && layer.bbox && layer.bbox.length >= 4) {
      this.mapState.setExtent(<[number, number, number, number]>layer.bbox);
    }
  }

  setLayerOpacity(layer) {
    if (!this.group) {
      this.layersSvc.updateLayer(layer, layer.filtertype || 'Layers'); // TODO check for baselayers!!!!!!
    } else {
      this.update.emit({
        layer: layer
      });
    }
  }

  checkBaselayer(layer: Layer, group?: LayerGroup) {
    if (layer.filtertype == 'Baselayers' || group && group.filtertype == 'Baselayers') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * is expandable if layer has legend, description or opacity can be changed
   */
  is_expandable() {
    if (this.group) {
      return !this.layer.legendImg && this.group.filtertype == 'Baselayers';
    } else {
      return false; // !this.layer.legendImg; //this.layer.description
    }
  }

  showProperties() {
    if (!this.is_expandable()) {
      this.openProperties = !this.openProperties;
    }
  }

  switchTab(tabName: string) {
    for (const key of Object.keys(this.activeTabs)) {
      this.activeTabs[key] = tabName === key;
    }
  }

  isFirst(layer) {
    if (this.group) {
      return this.layersSvc.isGroupFirst(layer, this.group.layers);
    } else {
      return this.layersSvc.isGroupFirst(layer, null, layer.filtertype);
    }
  }

  isLast(layer) {
    if (this.group) {
      return this.layersSvc.isGroupLast(layer, this.group.layers);
    } else {
      return this.layersSvc.isGroupLast(layer, null, layer.filtertype);
    }
  }

}
