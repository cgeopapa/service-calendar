import { DayEvent } from "./DayEvent";

export class SortedList {

  constructor(
    private events: DayEvent[] = []
  ) {
    events.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  public get() {
    return this.events;
  }

  public getEvent(d: Date) {
    return this.binarySearch(d);
  }

  public getEventIndex(d: Date) {
    return this.binarySearchIndex(d);
  }

  public push(e: DayEvent) {
    e.date.setHours(0, 0, 0, 0);
    if (this.events.length > 0) {
      const i = this.binarySearchIndex(e.date).index;
      this.events.splice(i, 0, e);
    }
    else {
      this.events.push(e);
    }
    if (e.type === "A") {
      let d = new Date(e.date)
      if (e.date.getDay() === 0) {
        d.setDate(e.date.getDate() + 1);
        this.push(new DayEvent(d, "E"));
        d.setDate(e.date.getDate() - 2);
        this.push(new DayEvent(d, "E"));
      } 
      else if (e.date.getDay() === 6) {
        d.setDate(e.date.getDate() + 2);
        this.push(new DayEvent(d, "E"));
      } 
      else if (e.date.getDay() === 5) {
        d.setDate(e.date.getDate() + 3);
        this.push(new DayEvent(d, "E"));
      }
      else {
        d.setDate(e.date.getDate() + 1);
        this.push(new DayEvent(d, "E"));
      }
    }
  }

  public delete(e: DayEvent) {
    e.date.setHours(0, 0, 0, 0);
    const index = this.binarySearchIndex(e.date);
    if (index.found && this.events[index.index].type === e.type) {
      this.events.splice(index.index, 1);
      if (e.type === "A") {
        let d = new Date(e.date)
        if (e.date.getDay() === 0) {
          d.setDate(e.date.getDate() + 1);
          this.delete(new DayEvent(d, "E"));
          d.setDate(e.date.getDate() - 2);
          this.delete(new DayEvent(d, "E"));
        } 
        else if (e.date.getDay() === 6) {
          d.setDate(e.date.getDate() + 2);
          this.delete(new DayEvent(d, "E"));
        } 
        else if (e.date.getDay() === 5) {
          d.setDate(e.date.getDate() + 3);
          this.delete(new DayEvent(d, "E"));
        }
        else {
          d.setDate(e.date.getDate() + 1);
          this.delete(new DayEvent(d, "E"));
        }  
      }
    }
  }

  private binarySearchIndex(d: Date) {
    let start = 0;
    let end = this.events.length - 1;

    while (start <= end) {
      let middle = Math.floor((start + end) / 2);

      const mEvent = this.events[middle];
      if (mEvent.date.getTime() === d.getTime()) {
        return { found: true, index: middle };
      } else if (mEvent.date.getTime() < d.getTime()) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
    }
    return { found: false, index: start };
  }

  private binarySearch(d: Date) {
    let start = 0;
    let end = this.events.length - 1;

    while (start <= end) {
      let middle = Math.floor((start + end) / 2);

      const mEvent = this.events[middle]
      if ((mEvent.date.getTime() === d.getTime()) || (mEvent.type === 'F' && mEvent.date.getTime() <= d.getTime() && mEvent.endDate!.getTime() >= d.getTime())) {
        return mEvent;
      } else if (mEvent.date.getTime() < d.getTime()) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
    }

    return null;
  }
}
