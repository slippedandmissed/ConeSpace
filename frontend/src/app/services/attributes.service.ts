import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AttributesService {

  private updatesPerSecond: number = 10;

  private timestamps: any = {};
  private rates: any = {};
  private timestampedAttributes: any = {
    hunger: 0,
    thirst: 0,
    boredom: 0
  };

  get hunger(): number {
    return this.timestampedAttributes.hunger;
  }

  get thirst(): number {
    return this.timestampedAttributes.thirst;
  }

  get boredom(): number {
    return this.timestampedAttributes.boredom;
  }

  public hat: string | null = null;

  private calculateFromTimestamps() {
    const now = new Date().getTime();
    for (const attribute of Object.keys(this.timestampedAttributes)) {
      this.timestampedAttributes[attribute] = Math.min(Math.max((now - (this.timestamps[attribute] ?? 0)) / 1000 * (this.rates[attribute] ?? 0), 0), 1);
    }
  }

  constructor(private api: ApiService) {
    for (const attribute of Object.keys(this.timestampedAttributes)) {
      api.socketOn(`attribute/${attribute}`, (value: number) => {
        this.timestamps[attribute] = value;
        this.calculateFromTimestamps();
      });

      api.socketOn(`attribute/${attribute}_per_second`, (value: number) => {
        this.rates[attribute] = value;
        this.calculateFromTimestamps();
      });
    }

    api.socketOn("attribute/hat", (value: string) => {
      this.hat = value;
    });

    const doCalculations = () => {
      this.calculateFromTimestamps();
      setTimeout(doCalculations, 1000 / this.updatesPerSecond);
    }

    doCalculations();
  }

  private clientSidePrediction(attribute: string, delta: number) {
    if (this.rates[attribute]) {
      const newValue = Math.max(Math.min(this.timestampedAttributes[attribute] - delta, 1), 0);
      this.timestamps[attribute] = new Date().getTime() - newValue * 1000 / this.rates[attribute];
    }
  }

  public feed(amount: number) {
    this.api.get("feed", { amount });
    this.clientSidePrediction("hunger", amount);
    const audio = new Audio();
    audio.src = `/assets/audio/crunch/${Math.floor(Math.random() * 2) + 1}.wav`;
    audio.load();
    audio.play();
  }

  public water(amount: number) {
    this.api.get("water", { amount });
    this.clientSidePrediction("thirst", amount);
  }

  public play(amount: number) {
    this.api.get("play", { amount });
    this.clientSidePrediction("boredom", amount);
  }

}
