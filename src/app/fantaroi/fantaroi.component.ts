import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { FantaroiDAOService } from '../fantaroi-dao.service';
import { Fantarosv2 } from '../model/Fantrosv2';

@Component({
  selector: 'app-fantaroi',
  templateUrl: './fantaroi.component.html',
  styleUrls: ['./fantaroi.component.scss']
})
export class FantaroiComponent implements OnInit {

  @Input() fantaroi: Fantarosv2[] = [];

  editedFantaros = new Fantarosv2();
  
  details = false;
  detailsFantaros: Fantarosv2 = new Fantarosv2();

  seats = [
    {name: "Πάνω"},
    {name: "-1"},
    {name: "ΣΚΑΚ"}
  ]

  constructor(
    private dao: FantaroiDAOService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {}

  save() {
    this.dao.push(this.editedFantaros);
  }

  remove(f: Fantarosv2, event: any) {
    this.confirmationService.confirm({
      target: event.target,
      message: "Σίγουρα διαγραφή αυτού του φαντάρου?",
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Απολελε και Τρελελε",
      rejectLabel: "Οχι, που τετοια τυχη",
      accept: () => {
        this.dao.remove(f);
      }
    })
  }

  showDetails(f: Fantarosv2) {
    this.detailsFantaros = f;
    this.details = true;
  }

  add() {
    this.dao.push(new Fantarosv2);
  }
}
