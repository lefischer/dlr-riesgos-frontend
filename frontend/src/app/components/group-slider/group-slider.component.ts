import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';


export interface SliderEntry {
  id: string,
  value: number,
  displayName: string
}


@Component({
  selector: 'app-group-slider',
  templateUrl: './group-slider.component.html',
  styleUrls: ['./group-slider.component.scss']
})
export class GroupSliderComponent implements OnInit {

  @Input() entries: SliderEntry[];
  public groupSliderForm: FormGroup;

  constructor() {
    this.groupSliderForm = new FormGroup({
      slider: new FormControl(1)
    });


  }

  ngOnInit(): void {
  }

}
