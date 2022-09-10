import { Component, Input, OnInit } from '@angular/core';
import { Fantarosv2 } from '../model/Fantrosv2';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  @Input()
  public fantaroi: Fantarosv2[] = [];

  @Input()
  public selectedMonth = 10;

  public months = [
    {name: "Ιανουάριος", v: 0},
    {name: "Φεβρουάριος", v: 1},
    {name: "Μάρτιος", v: 2},
    {name: "Απρίλιος", v: 3},
    {name: "Μάιος", v: 4},
    {name: "Ιούνιος", v: 5},
    {name: "Ιούλιος", v: 6},
    {name: "Αύγουστος", v: 7},
    {name: "Σεπτέμβριος", v: 8},
    {name: "Οκτώβριος", v: 9},
    {name: "Νοέμβριος", v: 10},
    {name: "Δεκέμβριος", v: 11},
  ]

  constructor() { }

  ngOnInit(): void {
  }

  public socSum(fantaros: Fantarosv2, month: number | null = null, weekday: number[] | null = null) {
    const soc = fantaros.soc.filter(s => (month ? s.getMonth() === month : true) && (weekday ? weekday.includes(s.getDay()) : true))
    return soc.length;
  }
}
