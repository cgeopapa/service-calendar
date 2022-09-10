import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FantaroiDAOService } from '../fantaroi-dao.service';
import { DayEvent } from '../model/DayEvent';
import { Fantarosv2 } from '../model/Fantrosv2';

@Component({
  selector: 'app-day-details',
  templateUrl: './day-details.component.html',
  styleUrls: ['./day-details.component.scss']
})
export class DayDetailsComponent implements OnInit {

  @Input() visible = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() read_only = true;
  @Input() date = new Date();
  @Input() fantaroi: Fantarosv2[] = [];

  details: {
      name: string,
      status: string
    }[] = []

  mnchange = false;

  loading = true;

  typeDictionary: any = {
    A: "Υπηρεσία (ΟΧΙ)",
    B: "Λάτζα (ΝΑΙ)",
    C: "Πρωί",
    D: "Απόγευμα",
    E: "ΕΥ",
    F: "ΑΔΕΙΑ",
  }

  editTypeOptions = [
    {name: 'Πρωί', value: "C"},
    {name: 'Απόγευμα', value: "D"},
    {name: 'off', value: "E"}
  ]

  constructor(
    private dao: FantaroiDAOService
  ) { }

  ngOnInit(): void {}

  hide() {
    if(this.mnchange) {
      for(let f of this.fantaroi) {
        const detail = this.details.find((d: any) => d.name === f.name);
        if(detail?.status === "D" || detail?.status === "E" || detail?.status === "C") {
          f.events.delete(new DayEvent(this.date, "D"));
          f.events.delete(new DayEvent(this.date, "E"));
          if(detail?.status !== "C") {
            f.events.push(new DayEvent(this.date, detail?.status));
          }
        }
      }
      this.dao.bulkpush(this.fantaroi);
      this.mnchange = false;
    }

    this.visibleChange.emit(false);
    this.loading = true;
  }

  update() {
    this.loading = true;
    this.details = [];
    for(let f of this.fantaroi) {
      const dayEvent = f.events.getEvent(this.date);
      let status = "C";
      if(dayEvent) {
        status = dayEvent.type[0];
      }
      this.details.push({name: f.name, status: status});
    }
    this.loading = false;
  }
}
