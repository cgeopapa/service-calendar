import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FantaroiDAOService } from '../fantaroi-dao.service';
import { Fantarosv2 } from '../model/Fantrosv2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  name = '';
  filteredFantaroiNames: string[] = [];
  
  private fantaroi: Fantarosv2[] = [];
  private id = "";

  constructor(
    private dao: FantaroiDAOService,
    private activeRouter: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dao.get().subscribe((f) => {
      this.fantaroi = f;
    });

    this.activeRouter.queryParams.subscribe(params => {
      this.id = params["userId"]
    })
  }

  search(event: any) {
    let filtered: any[] = [];
    let query = event.query;

    for (let f of this.fantaroi) {
      if (f.name.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(f.name);
      }
    }

    this.filteredFantaroiNames = filtered;
  }

  ok() {
    if(this.name) {
      let fantaros = this.fantaroi.find((f) => f.name === this.name);
      if(!fantaros) {
        fantaros = new Fantarosv2(this.name)
      }
      fantaros!.discordUserId = this.id;
      this.dao.push(fantaros!);
      this.router.navigateByUrl("/");
    }
  }
}
