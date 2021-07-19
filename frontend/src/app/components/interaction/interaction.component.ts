import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GhostsService, ghostType } from 'src/app/services/ghosts.service';

@Component({
  selector: 'app-interaction',
  templateUrl: './interaction.component.html',
  styleUrls: ['./interaction.component.scss']
})
export class InteractionComponent implements OnInit {


  private idChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
  private idLength = 16;
  
  private generateID(): string {
    let text = "";
    for (let i = 0; i < this.idLength; i++) {
      text += this.idChars.charAt(Math.floor(Math.random() * this.idChars.length));
    }
    return text;
  }

  @Output() drop: EventEmitter<void> = new EventEmitter();
  
  private myGhostId: string = this.generateID();

  constructor(public ghosts: GhostsService) { }

  @Input() img: string = "";
  @Input() ghostImg: string = "";
  @Input() type: ghostType;

  onDragStart(event: any) {
    this.ghosts.createGhost(this.myGhostId, this.ghostImg || this.img, this.type, event.center.x, event.center.y);
  }

  onDragMove(event: any) {
    this.ghosts.updateGhost(this.myGhostId, event.center.x, event.center.y);
  }

  onDragEnd(event: any) {
    this.ghosts.deleteGhost(this.myGhostId);
    this.drop.emit();
  }

  ngOnInit(): void {
  }

}
