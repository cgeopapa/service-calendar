import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Fantarosv2 } from '../model/Fantrosv2';

@Component({
  selector: 'app-fantaros-details',
  templateUrl: './fantaros-details.component.html',
  styleUrls: ['./fantaros-details.component.scss']
})
export class FantarosDetailsComponent implements OnInit {

  @Input() visible = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() fantaros: Fantarosv2 = new Fantarosv2();

  datePipe: DatePipe = new DatePipe('de-DE');
  
  constructor() { }

  ngOnInit(): void {
  }

  type(t: string) {
    switch (t) {
      case "A":
        return "Υπηρεσία";
      case "B":
        return "Λάτζα";
      case "C":
        return "ΕΥ";
      default:
        return "Άδεια";
    }
  }

  hide() {
    this.visibleChange.emit(false);
  }
}
