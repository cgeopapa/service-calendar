import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { firstValueFrom, map } from 'rxjs';
import { FantaroiDAOService } from './fantaroi-dao.service';

@Injectable({
  providedIn: 'root',
})
export class DiscordAuthService {

  public static isRoot = false;

  constructor(
    private http: HttpClient,
  ) {}

  public isAdmin(token: string) {
    return this.http.get('https://discord.com/api/users/@me/guilds/930718961916600381/member', {
      headers: { Authorization: `Bearer ${token}` },
      observe: 'body',
    }).pipe(map((roles: any) => roles.roles.includes('930720309747777557')));
  }

  public getUserId(token: string) {
    return this.http.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token}` },
      observe: 'body',
    }).pipe(map((u: any) => u.id));
  }

  public isInGuild(token: string) {
    return this.http.get('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${token}` },
      observe: 'body',
    }).pipe(map((g: any) => g.filter((g: any) => g.id === "930718961916600381").length > 0));
  }
}
