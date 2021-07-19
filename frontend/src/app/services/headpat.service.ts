import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class HeadpatService {

  private active: boolean = false;
  private patCount: number = 0;

  constructor(private api: ApiService) {
    api.socketOn("headpat", () => {
      this.pat(false);
    });
  }

  public pat(reemit: boolean = true): void {
    this.active = true;
    this.patCount++;
    setTimeout(() => {
      if (--this.patCount === 0) {
        this.active = false;
      };
    }, 2000);
    if (reemit)
      this.api.socketEmit("headpat");
  }

  public get isPatting(): boolean {
    return this.active;
  }

}
