import { DayEvent } from "./DayEvent";
import { SortedList } from "./SortedList";

export class Fantarosv2 {
    constructor(
        public name = "",
        public seat = "Πάνω",
        public events: SortedList = new SortedList(),
        public discordUserId = "",
        
        public soc: Date[] = [],
    ){
        events.get().forEach(e => {
            if (e.type === "A") {
                soc.push(e.date);
            }
        })
    }

    public getLast(dayEvent: DayEvent, day: number = -1) {
        const index = this.events.getEventIndex(dayEvent.date).index;
        const events = this.events.get();
        let prev = events[index].date;
        for(let i = index-1; i >= 0; i--) {
            if(events[i].type === dayEvent.type) {
                if(day === -1 || events[i].date.getDay() === day) {
                    prev = events[i].date;
                    break;
                }
            }
        }

        return Math.ceil((dayEvent.date.getTime() - prev.getTime()) / (1000 * 3600 * 24))
    }
}