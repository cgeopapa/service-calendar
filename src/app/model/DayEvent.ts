export class DayEvent {
    constructor(
        public date = new Date(),
        public type = "A",
        public endDate: Date | null = null,
    ){
        date.setHours(0, 0, 0, 0);
        endDate?.setHours(0, 0, 0, 0);
    }
}