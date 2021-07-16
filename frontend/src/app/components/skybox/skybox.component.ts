import { Component, OnInit } from '@angular/core';

interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface ColorStop {
  c: Color;
  t: number;
}

type gradient = ColorStop[];

@Component({
  selector: 'app-skybox',
  templateUrl: './skybox.component.html',
  styleUrls: ['./skybox.component.scss']
})
export class SkyboxComponent implements OnInit {

  public color: Color = { r: 255, g: 255, b: 255, a: 0 };
  public angle: number = 180;
  public proportion: number = 100;

  gradient: gradient = [
    { t: 0, c: { r: 0, g: 0, b: 48, a: 0.8 } },
    { t: 0.5, c: { r: 220, g: 0, b:194, a: 0.3 } },
    { t: 0.6, c: { r: 255, g: 230, b: 170, a: 0.3 } },
    { t: 1, c: { r: 255, g: 255, b: 0, a: 0 } }
  ]

  public getColorString() {
    return `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
  }

  private calculateColor() {
    const now = new Date();
    const msSinceMidnight = now.getTime() - now.setHours(0, 0, 0, 0);
    let t = msSinceMidnight / 1000 / 60 / 60 / 24;
    t = ((t % 1) + 1) % 1;
    const roundT = t > 0.5 ? 2 - 2 * t : 2 * t;
    this.color = this.lerpGradient(this.gradient, roundT);
    this.angle = t * 360;
    this.proportion = 100; // * (1 - roundT);
  }

  private lerp(a: number, b: number, t: number) {
    return a + t * (b - a);
  }

  private lerpColor(a: Color, b: Color, t: number) {
    return {
      r: this.lerp(a.r, b.r, t),
      g: this.lerp(a.g, b.g, t),
      b: this.lerp(a.b, b.b, t),
      a: this.lerp(a.a, b.a, t)
    }
  }

  private lerpGradient(gradient: gradient, t: number): Color {
    for (let i=0; i<gradient.length-1; i++) {
      const a = gradient[i];
      const b = gradient[i+1];
      const relativeT = b.t === a.t ? 0 : (t - a.t) / (b.t - a.t);
      if (0 <= relativeT && relativeT <= 1) {
        return this.lerpColor(a.c, b.c, relativeT);
      }
    }
    return {r: 255, g: 255, b: 255, a: 0};
  }

  constructor() { }

  ngOnInit(): void {

    let calculate = () => {
      this.calculateColor();
      setTimeout(calculate, 10000);
    }
    calculate();
  }

}
