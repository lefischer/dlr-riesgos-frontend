import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { BboxParameter } from '../parameter';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MapOlService } from '@ukis/map-ol';

@Component({
  selector: 'ukis-form-bbox-field',
  templateUrl: './form-bbox-field.component.html',
  styleUrls: ['./form-bbox-field.component.css'], 
  providers: [{ 
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => FormBboxFieldComponent),
  }]
})
export class FormBboxFieldComponent implements OnInit, ControlValueAccessor {

  @Input() parameter: BboxParameter;
  selectionActive: boolean = false;
  public bbox; 
  public bbox_lower: string;
  public bbox_upper: string;
  private changeFunction; 

  constructor(
    private olService: MapOlService
  ) { }

  ngOnInit() {
    // passing all callbacks as array functions to add to avoid scoping issues with 'this'
    this.olService.addBboxSelection((evt) => this.boxSelectionAllowed(evt), () => this.onStartBoxSelection(), (ext) => this.onEndBoxSelection(ext));
  }

  onEndBoxSelection(extent) { 
    // console.log("calling bbox changefunciton with ", extent);
    this.selectionActive = false;
    this.bbox = extent;
    this.updateBboxStringRepresentation(extent);
    this.changeFunction(extent);
  }


  updateBboxStringRepresentation(bbox: [number, number, number, number]) {
    this.bbox_lower = `[${Math.round(bbox[0] * 100) / 100}, ${Math.round(bbox[1] * 100) / 100}]`;
    this.bbox_upper = `[${Math.round(bbox[2] * 100) / 100}, ${Math.round(bbox[3] * 100) / 100}]`;
  }

  onStartBoxSelection() {
  }

  boxSelectionAllowed(evt): boolean {
    return this.selectionActive;
  }

  onSelectButtonClicked() {
    this.selectionActive = true;
  }

  writeValue(obj: any): void {
    // console.log(`${this.parameter.id} writeValue`, obj);
    this.bbox = obj;
    this.updateBboxStringRepresentation(obj);
    
  }

  registerOnChange(fn: any): void {
    this.changeFunction = fn;
  }

  registerOnTouched(fn: any): void {
    //console.log(`${this.parameter.id} registerOnTouched`, fn);
  }

  setDisabledState(isDisabled: boolean): void {
  }

}
