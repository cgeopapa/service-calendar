import {AfterViewInit, ApplicationRef, ChangeDetectorRef, Component,ComponentFactoryResolver,Injector,OnInit,ViewChild,} from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import {CalendarOptions, FullCalendarComponent,} from '@fullcalendar/angular';
import { FantaroiDAOService } from '../fantaroi-dao.service';
import { Calendar } from '../model/Calendar';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Fantarosv2 } from '../model/Fantrosv2';
import { DayEvent } from '../model/DayEvent';
import { debounceTime } from 'rxjs/operators';
import { ExportExcelService } from '../export-excel.service';
import { DiscordAuthService } from '../discord-auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent extends Calendar implements OnInit, AfterViewInit {
  @ViewChild('cal', { static: true }) calComp!: FullCalendarComponent;
  @ViewChild('op', { static: true }) op!: OverlayPanel;

  loading = true;
  isRoot = false;
  mobile = false;

  public contextMenu: MenuItem[] = [
    {
      label: 'Λεπτομέριες μέρας',
      icon: 'pi pi-list',
      command: () => {
        this.detailsVisible = true;
      },
    },
  ];

  private oldFantaros: Fantarosv2 | null = null;
  private oldEvent: DayEvent | null = null;
  public editingFantaros: Fantarosv2 | null = null;
  public editingDate: Date = new Date();

  public calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    eventOrder: 'type,start,duration,allDay',
    firstDay: 1,
    editable: this.isRoot,
    eventDurationEditable: this.isRoot,
    selectable: true,
    locale: 'el',
    rerenderDelay: 30,
    progressiveEventRendering: true,
    dayMaxEventRows: true,
    defaultAllDay: true,
    fixedMirrorParent: document.body,
    listDaySideFormat: false,
    listDayFormat: {
      weekday: 'long',
      day: '2-digit',
    },
    views: {
      listMonth: {
        titleFormat: { month: "short" },
        eventDidMount: (info) => {
          info.el.setAttribute("title", info.event.extendedProps.description);
          if(this.calComp.getApi().view.type === "listMonth") {
            let type = "Υπηρεσία";
            switch (info.event.extendedProps.type[0]) {
              case "B":
                type = "Λάτζα";
                break;
              case "E":
                type = "ΕΥ";
                break;
              case "F":
                type = "Άδεια";
                break;
            }
            info.el.getElementsByClassName("fc-list-event-time")[0].innerHTML = type;
          }
        },    
      },
    },
    titleFormat: { month: 'long', year: "numeric" },
    headerToolbar: {
      start: 'details excel',
      center: 'prev title next',
      end: '',
    },
    customButtons: {
      details: {
        text: "Λεπτομέρειες",
        click: () => {
          this.details();
        }
      },
      excel: {
        text: "Export",
        click: () => {
          this.excelExport.exportExcel(this.calComp.getApi().view.currentStart);
        }
      }
    },
    moreLinkClick: (info) => {
      info.jsEvent.preventDefault();
      const date = info.date;
      date.setHours(0, 0, 0, 0);
      this.selectedDate = info.date;
      this.detailsVisible = true;
      return "month";
    },
    eventMouseEnter: (info) => {
      this.fadeEvents(
        new RegExp(info.event.extendedProps.fantaros.name), 
        new RegExp(info.event.extendedProps.type));
    },
    eventMouseLeave: () => {
      this.fadeSelected();
    },
    select: (info) => {
      this.selectedDate = info.start;
      this.selectedDateEnd = info.end;
    },
    eventDrop: (info) => {
      this.editEvent(info);
    },
    eventResize: (info) => {
      this.editEvent(info);
    },
    eventDidMount: (info) => {
      this.updateVisibleEvents(info);
      info.el.setAttribute("title", info.event.extendedProps.description);
      // if(this.calComp.getApi().view.type === "listMonth") {
      //   let type = "Υπηρεσία";
      //   switch (info.event.extendedProps.type[0]) {
      //     case "B":
      //       type = "Λάτζα";
      //       break;
      //     case "E":
      //       type = "ΕΥ";
      //       break;
      //     case "F":
      //       type = "Άδεια";
      //       break;
      //   }
      //   info.el.getElementsByClassName("fc-list-event-time")[0].innerHTML = type;
      // }
    },
  };

  constructor(
    private primengConfig: PrimeNGConfig,
    private excelExport: ExportExcelService,
    private auth: DiscordAuthService,
    private cookies: CookieService,
    private cdr: ChangeDetectorRef,

    dao: FantaroiDAOService,
  ) {
    super(dao);
   }

  ngAfterViewInit(): void {
    if(window.innerWidth < 640) {
      this.mobile = true;
      this.calComp.getApi().changeView("listMonth");
      this.calComp.getApi().setOption("headerToolbar", {
        start: "title",
        center: "",
        end: "details prev,next",
      });
    }
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.loading = true;
    this.primengConfig.ripple = true;
    this.dao.get().pipe(debounceTime(500)).subscribe((f) => {
      this.fantaroi = f;
      console.log(this.fantaroi);
      this.calComp.getApi().removeAllEvents();
      const events = this.getCalendarEvents(this.fantaroi);
      this.calendarOptions.events = events;
      this.loading = false;
    });

    this.calendarOptions.eventClick = (info) => {
      if(this.isRoot) {
        this.editingFantaros = info.event.extendedProps.fantaros;
        this.editingDate = info.event.start!;
        this.oldFantaros = info.event.extendedProps.fantaros;
        this.oldEvent = this.oldFantaros!.events.getEvent(this.editingDate);
        this.op.show(null, info.el);
      }
    }

    this.auth.isAdmin(this.cookies.get("discord-token")).subscribe((isAdmin: boolean) => {
      this.isRoot = isAdmin;
      this.calendarOptions.editable = this.isRoot;
      this.calendarOptions.eventDurationEditable = this.isRoot;
  
      if(this.isRoot) {
        this.contextMenu = [
          {
            label: "Υπηρεσία",
            icon: "pi pi-plus",
            command: () => {
              this.fantaroi[0].events.push(new DayEvent(this.selectedDate, "A", this.selectedDate));
              this.dao.push(this.fantaroi[0]);
            }
          },
          {
            label: "Λάτζα",
            icon: "pi pi-plus",
            command: () => {
              this.fantaroi[0].events.push(new DayEvent(this.selectedDate, "B", this.selectedDate));
              this.dao.push(this.fantaroi[0]);
            }
          },
          {
            label: "Άδεια",
            icon: "pi pi-plus",
            command: () => {
              this.offsVisible = true;
            }
          },
          { separator: true },
          {
            label: 'Λεπτομέριες μέρας',
            icon: 'pi pi-list',
            command: () => {
              this.detailsVisible = true;
            },
          },
        ];  
      }
    });

  }

  change() {
    this.op.hide();

    this.editingFantaros!.events.push(new DayEvent(this.oldEvent?.date, this.oldEvent?.type, this.oldEvent?.endDate));
    this.dao.push(this.editingFantaros!);

    this.oldFantaros!.events.delete(this.oldEvent!);
    this.dao.push(this.oldFantaros!);
  }

  delEvent() {
    this.op.hide();

    this.oldFantaros!.events.delete(this.oldEvent!);
    this.dao.push(this.oldFantaros!);
  }

  private details() {
    this.selectedMonth = this.calComp.getApi().getDate().getMonth();
    this.overallDetailsVisible = true;
  }
}
