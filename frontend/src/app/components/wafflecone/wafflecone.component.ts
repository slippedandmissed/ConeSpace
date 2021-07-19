import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AttributesService } from 'src/app/services/attributes.service';
import { GhostsService } from 'src/app/services/ghosts.service';

type animationTypes = "idle" | "reach";

@Component({
  selector: 'app-wafflecone',
  templateUrl: './wafflecone.component.html',
  styleUrls: ['./wafflecone.component.scss']
})
export class WaffleconeComponent implements OnInit {

  constructor(private ghosts: GhostsService, public attributes: AttributesService) { }

  public angle: number = 0;
  public armAngle: number = 180;

  public animation: animationTypes = "idle";

  public hatX: number = 0;
  public hatY: number = 0;

  @Output() onheadpat: EventEmitter<void> = new EventEmitter();

  @Input() patting: boolean = false;

  calculateAnimation() {
    const body: HTMLElement | null = document.querySelector("#body");
    if (!body) {
      return;
    }
    const rect = body.getBoundingClientRect();
    
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    
    const originX = rect.left + width * 0.5;
    const originY = rect.top + height * 0.5;
    
    const wholeSVG = document.querySelector("app-wafflecone svg");
    const front = document.querySelector("#front");
    if (wholeSVG && front) {
      const svgRect = wholeSVG.getBoundingClientRect();
      const transform = window.getComputedStyle(front).transform.replace("matrix(", "").replace(")", "").split(", ").map(x => +x);
      const cos = transform[0];
      const sin = transform[1];
      const l = 0.8;
      this.hatX = originX + sin * width * 0.5 * l - svgRect.left;
      this.hatY = originY - cos * height* 0.5 * l - svgRect.top;
    }

    const ghosts = this.ghosts.getGhosts().filter(x => x.active);
    if (ghosts.length) {
      this.animation = "reach";

      const targetX = ghosts[0].x * document.body.clientWidth;
      const targetY = ghosts[0].y * document.body.clientHeight;

      const dx = targetX - originX;
      const dy = targetY - originY;

      this.armAngle = Math.atan2(dy, dx) / Math.PI * 180 + 90;
      if (this.armAngle > 180) {
        this.armAngle -= 360;
      }

      this.angle = Math.abs(this.armAngle) >= 10 ? Math.sign(this.armAngle) * 10 : this.armAngle;
    } else {
      this.angle = 0;
      this.armAngle = 180;
      this.animation = "idle";
    }
  }

  ngOnInit(): void {
    const doAnimation = () => {
      this.calculateAnimation();
      setTimeout(doAnimation, 1000/30);
    }
    doAnimation();
  }

  headpat() {
    this.onheadpat.emit();
  }

}
