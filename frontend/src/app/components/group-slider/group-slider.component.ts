import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import LayerGroup from 'ol/layer/Group';


@Component({
  selector: 'app-group-slider',
  templateUrl: './group-slider.component.html',
  styleUrls: ['./group-slider.component.scss']
})
export class GroupSliderComponent implements OnInit {

  @Input() group: LayerGroup;
  public groupSliderForm: FormGroup;

  constructor() {
    this.groupSliderForm = new FormGroup({
      layerSlider: new FormControl(1)
    });


  }

  ngOnInit(): void {
  }

}
