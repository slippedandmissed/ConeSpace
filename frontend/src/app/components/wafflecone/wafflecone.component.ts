import { Component, OnInit } from '@angular/core';
import { GhostsService } from 'src/app/services/ghosts.service';

type animationTypes = "idle" | "reach";

@Component({
  selector: 'app-wafflecone',
  templateUrl: './wafflecone.component.html',
  styleUrls: ['./wafflecone.component.scss']
})
export class WaffleconeComponent implements OnInit {

  constructor(private ghosts: GhostsService) { }

  public angle: number = 0;
  public armAngle: number = 180;

  public animation: animationTypes = "idle";

  calculateAnimation() {
    const body = document.querySelector("#body");
    if (!body) {
      return;
    }
    const rect = body.getBoundingClientRect();

    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;

    const originX = rect.left + width * 0.5;
    const originY = rect.top + height * 0.5;

    const ghosts = this.ghosts.getGhosts().filter(x => x.active);
    if (ghosts.length) {
      this.animation = "reach";

      const targetX = ghosts[0].x;
      const targetY = ghosts[0].y;

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

}
