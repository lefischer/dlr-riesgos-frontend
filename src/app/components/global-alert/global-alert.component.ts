import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IAlert } from './alert.service';

@Component({
  selector: 'ukis-global-alert',
  templateUrl: './global-alert.component.html',
  styleUrls: ['./global-alert.component.scss']
})
export class GlobalAlertComponent implements OnInit {
  @Input() alert: null | IAlert;
  @Output() alertChange = new EventEmitter<null | IAlert>();
  constructor() { }

  close() {
    this.alert = null;
    this.alertChange.emit(this.alert);
  }

  ngOnInit() {
  }

}