import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

interface Ghost {
  x: number;
  y: number;
  img: string;
  active: boolean
}

@Injectable({
  providedIn: 'root'
})
export class GhostsService {

  private ghosts: { [key: string]: Ghost } = {};

  public createGhost(id: string, img: string, x: number, y: number, reemit: boolean = true) {
    this.ghosts[id] = { img, x, y, active: true };
    if (reemit)
      this.api.socketEmit("createGhost", id, img, x / document.body.clientWidth, y / document.body.clientHeight);
  }


  public updateGhost(id: string, x: number, y: number, reemit: boolean = true) {
    this.ghosts[id] = { ...this.ghosts[id], x, y };
    if (reemit)
      this.api.socketEmit("updateGhost", id, x / document.body.clientWidth, y / document.body.clientHeight);
  }

  public deleteGhost(id: string, reemit: boolean = true) {
    this.ghosts[id].active = false;
    if (reemit)
      this.api.socketEmit("deleteGhost", id);
    setTimeout(() => {
      if (this.ghosts[id] && !this.ghosts[id].active) {
        delete this.ghosts[id];
      }
    }, 1000);
  }

  public getGhosts(): Ghost[] {
    return Object.values(this.ghosts);
  }

  constructor(private api: ApiService) {
    api.socketOn("createGhost", (id, img, x, y) => {
      this.createGhost(id, img, x * document.body.clientWidth, y * document.body.clientHeight, false);
    });

    api.socketOn("updateGhost", (id, x, y) => {
      this.updateGhost(id, x * document.body.clientWidth, y * document.body.clientHeight, false);
    });

    api.socketOn("deleteGhost", (id) => {
      this.deleteGhost(id, false);
    });

  }
}
