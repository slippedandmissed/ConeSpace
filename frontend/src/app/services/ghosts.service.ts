import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export type ghostType = "food" | "drink" | "toy" | undefined;

interface Ghost {
  x: number;
  y: number;
  img: string;
  active: boolean;
  type: ghostType;
}

@Injectable({
  providedIn: 'root'
})
export class GhostsService {

  private ghosts: { [key: string]: Ghost } = {};

  public createGhost(id: string, img: string, type: ghostType, x: number, y: number, reemit: boolean = true) {
    this.ghosts[id] = { img, x, y, type, active: true };
    if (reemit)
      this.api.socketEmit("createGhost", id, img, type, x / document.body.clientWidth, y / document.body.clientHeight);
  }


  public updateGhost(id: string, x: number, y: number, reemit: boolean = true) {
    this.ghosts[id] = { ...this.ghosts[id], x, y };
    if (reemit)
      this.api.socketEmit("updateGhost", id, x / document.body.clientWidth, y / document.body.clientHeight);
  }

  public deleteGhost(id: string, reemit: boolean = true) {
    this.ghosts[id].active = false;
    if (this.ghosts[id].type === "food") {
      const audio = new Audio();
      audio.src = `/assets/audio/crunch/${Math.floor(Math.random() * 2) + 1}.wav`;
      audio.load();
      audio.play();
    }
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
    api.socketOn("createGhost", (id, img, type, x, y) => {
      this.createGhost(id, img, type, x * document.body.clientWidth, y * document.body.clientHeight, false);
    });

    api.socketOn("updateGhost", (id, x, y) => {
      this.updateGhost(id, x * document.body.clientWidth, y * document.body.clientHeight, false);
    });

    api.socketOn("deleteGhost", (id) => {
      this.deleteGhost(id, false);
    });

  }
}
