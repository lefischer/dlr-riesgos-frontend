import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerControlComponent } from '../layer-control/layer-control.component';

import { LayerentryGroupComponent } from '../layerentry-group/layerentry-group.component';
import { LayerentryComponent } from '../layerentry/layerentry.component';

import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
//import { Layer, LayerGroup } from '@ukis/services-layers';
import { ObjTypePipe } from '../obj-type.pipe'
import { LayersService } from '@ukis/services-layers';
import { MapStateService } from '@ukis/services-map-state';
import { ReversePipe } from '../array-reverse.pipe';

describe('LayerControlComponent', () => {
  let component: LayerControlComponent;
  let fixture: ComponentFixture<LayerControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ClarityModule, FormsModule],
      declarations: [LayerControlComponent, LayerentryGroupComponent, LayerentryComponent, ObjTypePipe, ReversePipe],
      providers: [LayersService, MapStateService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerControlComponent);
    component = fixture.componentInstance;
    component.layersSvc = new LayersService();
    //component.layers = new LayersService();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
