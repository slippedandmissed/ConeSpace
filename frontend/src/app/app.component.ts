import { Component } from '@angular/core';
import { AttributesService } from './services/attributes.service';
import { GhostsService } from './services/ghosts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'conespace';

  constructor(public attributes: AttributesService, public ghosts: GhostsService) {}
}
