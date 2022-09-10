import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Fantarosv2 } from '../model/Fantrosv2';

@Component({
  selector: 'app-overall-details',
  templateUrl: './overall-details.component.html',
  styleUrls: ['./overall-details.component.scss']
})
export class OverallDetailsComponent implements OnInit {
  @Input() read_only = true;
  @Input() visible = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() fantaroi: Fantarosv2[] = [];
  @Input() month = 10;

  constructor() { }

  ngOnInit(): void {
  }
}
