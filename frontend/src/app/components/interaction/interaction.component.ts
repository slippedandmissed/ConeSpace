import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GhostsService, ghostType } from 'src/app/services/ghosts.service';

const idChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
const idLength = 16;

export function generateID(): string {
  let text = "";
  for (let i = 0; i < idLength; i++) {
    text += idChars.charAt(Math.floor(Math.random() * idChars.length));
  }
  return text;
}


@Component({
  selector: 'app-interaction',
  templateUrl: './interaction.component.html',
  styleUrls: ['./interaction.component.scss']
})
export class InteractionComponent implements OnInit {



  @Output() drop: EventEmitter<void> = new EventEmitter();
  
  private myGhostId: string = generateID();

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
