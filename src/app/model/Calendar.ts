import { ApplicationRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { Fantarosv2 } from '.././model/Fantrosv2';
import { FantaroiDAOService } from '../fantaroi-dao.service';
import { DayEvent } from './DayEvent';

export class Calendar {
    private visibleEvents: any = {};

    public offsVisible = false;
    
    public selectedMonth = 10;
    public fantaroi: Fantarosv2[] = [];
    public selectedFantaroi: string[] = [];
    public overallDetailsVisible = false;
    public detailsVisible = false;
    public selectedDate = new Date();
    public selectedDateEnd = new Date();  

    constructor(
      protected dao: FantaroiDAOService,
    ) { }
  
    public getCalendarEvents(fantaroi: Fantarosv2[]) {
      let events: any[] = [];
      for (let f of fantaroi) {
        f.events.get().forEach((dayEvent) => {
          let e: any = {};
          if (dayEvent.type === 'A') {
            const last = f.getLast(dayEvent);
            const lastSat = f.getLast(dayEvent, 6);
            const lastSun = f.getLast(dayEvent, 0);
            e = this.addSOC(dayEvent.date, f);
            e.description = `Τελευταία υπηρεσία: ${last} \n Τελευταίο Σάββατο: ${lastSat} \n Τελευταία Κυριακή: ${lastSun}`;
          } else if (dayEvent.type === 'B') {
            const last = f.getLast(dayEvent);
            e = this.addDishes(dayEvent.date, f);
            e.description = `Τελευταία λάτζα: ${last}`;
          } else if (dayEvent.type.startsWith('F')) {
            e = this.addOff(dayEvent.date, dayEvent.endDate!, f, dayEvent.type);
          }
          e.title = f.name;
          e.textColor = "black";
          events.push(e);
        });
      }
      return events;
    }
  
    public updateVisibleEvents(info: any) {
      this.visibleEvents[`${info.event.start!.getTime()}-${info.event.extendedProps.fantaros.name}`] = info;
    }
  
    public fadeEvents(name: RegExp = new RegExp("^.*$"), type: RegExp = new RegExp("^.*$")) {
      for (let date in this.visibleEvents) {
        const props = this.visibleEvents[date].event.extendedProps;
        const element = this.visibleEvents[date].el;
        if (!name.test(props.fantaros.name) || !type.test(props.type)) {
          element.style.opacity = '0.2';
        }
        else {
          element.style.opacity = '1';
        }
      }
    }

    public fadeSelected() {
      if(this.selectedFantaroi.length > 0) {
        let reg = new RegExp(`^${this.selectedFantaroi.join("$|^")}$`);
        this.fadeEvents(reg);
      }
      else {
        this.fadeEvents();
      }
    }  
  
    public fadeAllIn() {
      for (let date in this.visibleEvents) {
        this.visibleEvents[date].el.style.opacity = '1';
      }
    }
  
    public addSOC(d: Date, f: Fantarosv2 = new Fantarosv2()) {
      return {
        title: f.name,
        date: d,
        color: "orange",
        textColor: "black",
        durationEditable: false,
        type: "A",
        fantaros: f,
        description: "",
      }
    }
  
    public addDishes(d: Date, f: Fantarosv2 = new Fantarosv2()) {
      return {
        date: d,
        color: "lightblue",
        durationEditable: false,
        type: "B",
        fantaros: f,
        description: "",
      }
    }

    private addOff(s: Date, e: Date, f: Fantarosv2 = new Fantarosv2(), desc: string = ""): any {
      const d = desc.length > 1 ? `${desc.substring(1)} - Το κωλόβυσμα` : "Το κωλόβυσμα";
      return {
        start: s,
        end: e,
        name: f.name,
        color: "lightsalmon",
        type: "F",
        fantaros: f,
        description: d,
      }
    }

    protected editEvent(info: any) {
      const f: Fantarosv2 = info.event.extendedProps.fantaros;
      const oldDayEvent: DayEvent = f.events.getEvent(info.oldEvent.start!)!;
      const newDayEvent: DayEvent = new DayEvent(info.event.start!, oldDayEvent.type, info.event.end);
      f.events.delete(oldDayEvent);
      f.events.push(newDayEvent);
      this.dao.push(f);
    }
  }