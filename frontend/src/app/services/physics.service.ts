import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

interface PhysicsEntity {
  x: number;
  y: number;
  img: string;
  active: boolean;
  lastUpdated: number;
}


@Injectable({
  providedIn: 'root'
})
export class PhysicsService {

  private entities: { [key: string]: PhysicsEntity } = {};

  private generateSelector(id: string): string {
    return `#entity_${btoa(id).replace(/=/g, "_")}`;
  }

  public createEntity(id: string, img: string, x: number, y: number, lastUpdated: number = -1, reemit: boolean = true) {
    if (lastUpdated < 0) {
      lastUpdated = new Date().getTime();
    }
    this.entities[id] = { img, x: x / document.body.clientWidth, y: y / document.body.clientHeight, active: true, lastUpdated };
    this.drawEntities();
    if (reemit)
      this.api.socketEmit("createEntity", id, img, x / document.body.clientWidth, y / document.body.clientHeight, lastUpdated);
  }

  public updateEntity(id: string, x: number, y: number, reemit: boolean = true) {
    this.entities[id] = { ...this.entities[id], x: x/document.body.clientWidth, y: document.body.clientHeight, lastUpdated: new Date().getTime() };
    this.drawEntities();
    if (reemit)
      this.api.socketEmit("updateEntity", id, x / document.body.clientWidth, y / document.body.clientHeight);
  }

  public deleteEntity(id: string, reemit: boolean = true) {
    if (this.entities[id]) {
      this.entities[id].active = false;
    }
    this.drawEntities();
    if (reemit)
      this.api.socketEmit("deleteEntity", id);
    setTimeout(() => {
      if (this.entities[id] && !this.entities[id].active) {
        delete this.entities[id];
        document.querySelector(this.generateSelector(id))?.remove();
      }
      if (!this.entities[id]) {
        document.querySelector(this.generateSelector(id))?.remove();
      }
    }, 1000);
  }

  private calculateEntityPositions() {
    const now = new Date().getTime();
    const ids = Object.keys(this.entities);
    for (const id of ids) {
      const entity = this.entities[id];
      if (now - entity.lastUpdated > 10000) {
        this.deleteEntity(id);
      }
    }
  }

  private drawEntities() {
    const container = document.querySelector("#entities");
    if (!container) {
      return;
    }
    for (const id in this.entities) {
      const entity = this.entities[id];
      let obj: HTMLImageElement | null = document.querySelector(this.generateSelector(id));
      if (obj === null) {
        obj = document.createElement("img");
        container.appendChild(obj);
        obj.classList.add("physics-entity");
        obj.src = entity.img;
        obj.id = this.generateSelector(id).substring(1);
      }
      obj.style.top = `${entity.y * 100}vh`;
      obj.style.left = `${entity.x * 100}vw`;
      if (entity.active) {
        obj.classList.remove("hidden");
      } else {
        obj.classList.add("hidden");
      }
    }
  }


  constructor(private api: ApiService) {
    api.socketOn("createEntity", (id, img, x, y, lastUpdated) => {
      this.createEntity(id, img, x * document.body.clientWidth, y * document.body.clientHeight, lastUpdated, false);
    });

    api.socketOn("updateEntity", (id, x, y) => {
      this.updateEntity(id, x * document.body.clientWidth, y * document.body.clientHeight, false);
    });

    api.socketOn("deleteEntity", (id) => {
      this.deleteEntity(id, false);
    });

    api.socketOn("sendEntitiesPls", () => {
      const result = [];
      for (const id in this.entities) {
        const { img, x, y, lastUpdated, active } = this.entities[id];
        if (active) {
          result.push([id, img, x, y, lastUpdated]);
        }
      }
      api.socketEmit("hereAreEntities", result);
    });

    const doUpdate = () => {
      this.calculateEntityPositions();
      setTimeout(doUpdate, 1000 / 30);
    }
    doUpdate();
  }
}
