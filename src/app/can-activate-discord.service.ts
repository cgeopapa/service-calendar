import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable, switchMap, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DiscordAuthService } from './discord-auth.service';
import { FantaroiDAOService } from './fantaroi-dao.service';

@Injectable({
  providedIn: 'root',
})
export class CanActivateDiscordService implements CanActivate {
  constructor(
    private cookies: CookieService,
    private auth: DiscordAuthService,
    private router: Router,
    private dao: FantaroiDAOService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if(!environment.production){
      return true;
    }
    // Just logged in
    if (state.url.includes('access_token=')) {
      const url = new URLSearchParams(state.url.replace("#", ""));
      const token = url.get('access_token');
      const expiration = parseInt(url.get("expires_in")!)/ 86400;
      return this.afterLoginAuth(token!, expiration);
    }
    else {
      // We know this user
      if(this.cookies.check("discord-token")) {
        return this.afterLoginAuth(this.cookies.get("discord-token"));
      }
      // New user/machine
      else {
        window.location.href = `https://discord.com/api/oauth2/authorize?client_id=931559880555376762&redirect_uri=${environment.redirectUrl}&response_type=token&scope=guilds.members.read%20identify%20guilds`;
        return false;
      }
    }
  }
  
  private afterLoginAuth(token: string, exp: number = -1): Observable<boolean> {
    return this.auth.isInGuild(token).pipe(map((isInGuild) => {
      if(isInGuild && exp !== -1) {
        this.cookies.set("discord-token", token, exp);
        this.registerCheck(token);
      }
      return isInGuild;
    }));
  }

  private registerCheck(token: string) {
    let userID = "";
    this.auth.getUserId(token).pipe(switchMap((uid) => {
      userID = uid;
      return this.dao.get().pipe(take(1));
    })).subscribe((fantaroi) => {
      const found = fantaroi.findIndex((f) => f.discordUserId === userID) !== -1;
      if(!found) {
        this.router.navigate(["/register"], {
          queryParams: {userId: userID}
        });
      }
    })
  }
}
