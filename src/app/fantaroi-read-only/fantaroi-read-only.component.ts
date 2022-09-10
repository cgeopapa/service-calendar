import { Component, Input, OnInit } from '@angular/core';
import { FantaroiDAOService } from '../fantaroi-dao.service';
import { Fantarosv2 } from '../model/Fantrosv2';

@Component({
  selector: 'app-fantaroi-read-only',
  templateUrl: './fantaroi-read-only.component.html',
  styleUrls: ['./fantaroi-read-only.component.scss'],
})
export class FantaroiReadOnlyComponent implements OnInit {
  @Input() fantaroi: Fantarosv2[] = [];

  editedFantaros = new Fantarosv2();

  details = false;
  detailsFantaros: Fantarosv2 = new Fantarosv2();

  seats = [{ name: 'Πάνω' }, { name: '-1' }, { name: 'ΣΚΑΚ' }];

  constructor(private dao: FantaroiDAOService) {}

  ngOnInit(): void {}

  save() {
    this.dao.push(this.editedFantaros);
  }

  showDetails(f: Fantarosv2) {
    this.detailsFantaros = f;
    this.details = true;
  }
}
