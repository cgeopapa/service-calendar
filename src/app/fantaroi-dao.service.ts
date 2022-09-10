import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators'
import { firstValueFrom, Observable } from 'rxjs';
import { Fantarosv2 } from './model/Fantrosv2';
import { DayEvent } from './model/DayEvent';
import { SortedList } from './model/SortedList';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FantaroiDAOService {
  private root = environment.db;
  private list = this.db.list<any>(this.root)
  public static fantaroi: Fantarosv2[] = [];

  constructor(private db: AngularFireDatabase, private datePipe: DatePipe){}

  public get(): Observable<Fantarosv2[]> {
    return this.list.valueChanges().pipe(map((fantaroi: Fantarosv2[]) => {
      console.log(fantaroi);
        FantaroiDAOService.fantaroi = [];
        return fantaroi.map((f: any) => {
          let events = [];
          if(f.events) {
          f.events.forEach((x:any)=> {
            x.date = this.datePipe.transform(x?.date,"yyyy-MM-dd")
            x.endDate = this.datePipe.transform(x?.endDate,"yyyy-MM-dd")
         });
            events = f.events.map((e: DayEvent) => new DayEvent(new Date(e.date), e.type, e.endDate ? new Date(e.endDate) : null));
          }
          const final = new Fantarosv2(f.name, f.seat, new SortedList(events), f.discordUserId);
          FantaroiDAOService.fantaroi.push(final);
          return final;
        })}
      )
    )
  }
  

  public getOnce() {
    const o = this.list.valueChanges().pipe(map((fantaroi: Fantarosv2[]) => {
        FantaroiDAOService.fantaroi = [];
        return fantaroi.map((f: any) => {
          let events = [];
          if(f.events) {
            f.events.forEach((x:any)=> {
              x.date = this.datePipe.transform(x?.date,"yyyy-MM-dd")
              x.endDate = this.datePipe.transform(x?.endDate,"yyyy-MM-dd")
           });
            events = f.events.map((e: DayEvent) => new DayEvent(new Date(e.date), e.type, e.endDate ? new Date(e.endDate) : null));
          }
          const final = new Fantarosv2(f.name, f.seat, new SortedList(events), f.discordUserId);
          FantaroiDAOService.fantaroi.push(final);
          return final;
        })}
      )
    )
    return firstValueFrom(o);
  }

  public push(fantaros: Fantarosv2) {
    const f = this.fantaros2firebaseObject(fantaros);
    const i = FantaroiDAOService.fantaroi.findIndex(f => f.name === fantaros.name);
    if(i !== -1) {
      this.list.set(`${i}`, f);
    } else {
      this.list.set(`${FantaroiDAOService.fantaroi.length}`, f);
    }
  }

  public bulkpush(fantaroi: Fantarosv2[]) {
    let f2f: any[] = [];
    fantaroi.forEach((f) => {
      f2f.push(this.fantaros2firebaseObject(f));
    })
    this.list.remove();
    this.db.object(this.root).set(f2f);
  }
  
  public remove(fantaros: Fantarosv2) {
    const i = FantaroiDAOService.fantaroi.findIndex((f) => f.name === fantaros.name);
    if(i !== -1) {
      FantaroiDAOService.fantaroi.splice(i, 1);
      this.bulkpush(FantaroiDAOService.fantaroi)
    }
  }

  private fantaros2firebaseObject(fantaros: Fantarosv2) {
    return {
      name: fantaros.name,
      seat: fantaros.seat,
      events: fantaros.events.get().map((d) => {return {
        date: `${d.date.getFullYear()}-${d.date.getMonth()+1}-${d.date.getDate()}`, 
        type: d.type,
        endDate: d.endDate ? `${d.endDate.getFullYear()}-${d.endDate.getMonth()+1}-${d.endDate.getDate()}` : null
      }}),
      discordUserId: fantaros.discordUserId
    };
  }
}
