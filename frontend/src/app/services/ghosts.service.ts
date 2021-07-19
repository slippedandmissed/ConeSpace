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

  private generateSelector(id: string): string {
    return `#ghost_${btoa(id).replace(/=/g, "_")}`;
  }

  public createGhost(id: string, img: string, type: ghostType, x: number, y: number, reemit: boolean = true) {
    this.ghosts[id] = { img, x, y, type, active: true };
    this.drawGhosts();
    if (reemit)
      this.api.socketEmit("createGhost", id, img, type, x / document.body.clientWidth, y / document.body.clientHeight);
  }


  public updateGhost(id: string, x: number, y: number, reemit: boolean = true) {
    this.ghosts[id] = { ...this.ghosts[id], x, y };
    this.drawGhosts();
    if (reemit)
      this.api.socketEmit("updateGhost", id, x / document.body.clientWidth, y / document.body.clientHeight);
  }

  public deleteGhost(id: string, reemit: boolean = true) {
    this.ghosts[id].active = false;
    this.drawGhosts();
    const audio: HTMLAudioElement | null = document.querySelector("audio");
    if (audio) {
      if (this.ghosts[id].type === "food") {
        audio.src = `/assets/audio/crunch/${Math.floor(Math.random() * 2) + 1}.wav`;
        audio.load();
        audio.play();
      }
      else if (this.ghosts[id].type === "drink") {
        audio.src = `/assets/audio/sip/${Math.floor(Math.random() * 4) + 1}.wav`;
        audio.load();
        audio.play();
      }
      else if (this.ghosts[id].type === "toy") {
        audio.src = `/assets/audio/bell/${Math.floor(Math.random() * 1) + 1}.wav`;
        audio.load();
        audio.play();
      }
    }
    if (reemit)
      this.api.socketEmit("deleteGhost", id);
    setTimeout(() => {
      if (this.ghosts[id] && !this.ghosts[id].active) {
        delete this.ghosts[id];
        document.querySelector(this.generateSelector(id))?.remove();
      }
    }, 1000);
  }

  public getGhosts(): Ghost[] {
    return Object.values(this.ghosts);
  }

  private drawGhosts() {
    const container = document.querySelector("#interactions");
    if (!container) {
      return;
    }
    for (const id in this.ghosts) {
      const ghost = this.ghosts[id];
      let obj: HTMLImageElement | null = document.querySelector(this.generateSelector(id));
      if (!obj) {
        obj = document.createElement("img");
        container.appendChild(obj);
        obj.classList.add("ghost");
        obj.src = ghost.img;
        obj.id = this.generateSelector(id).substring(1);
      }
      obj.style.top = `${ghost.y}px`;
      obj.style.left = `${ghost.x}px`;
      if (ghost.active) {
        obj.classList.remove("hidden");
      } else {
        obj.classList.add("hidden");
      }
    }
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
