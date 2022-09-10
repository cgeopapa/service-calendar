import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FantaroiDAOService } from '../fantaroi-dao.service';
import { DayEvent } from '../model/DayEvent';
import { Fantarosv2 } from '../model/Fantrosv2';

@Component({
  selector: 'app-offs',
  templateUrl: './offs.component.html',
  styleUrls: ['./offs.component.scss']
})
export class OffsComponent implements OnInit {

  @Input() visible = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() range!: Date[];
  @Input() fantaroi!: Fantarosv2[];

  fantaros!: Fantarosv2;
  desc!: string;

  constructor(
    private dao: FantaroiDAOService
  ) { }

  ngOnInit(): void {
  }

  save() {
    const start = this.range[0];
    const end = this.range[1];

    this.fantaros.events.push(new DayEvent(start, `F${this.desc ? this.desc : ""}`, end));
    this.dao.push(this.fantaros);
    this.visible = false;
  }
}
