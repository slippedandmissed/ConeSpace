import { Component } from '@angular/core';
import { AttributesService } from './services/attributes.service';
import { GhostsService } from './services/ghosts.service';
import { HeadpatService } from './services/headpat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'conespace';

  constructor(public attributes: AttributesService, public ghosts: GhostsService, public headpatService: HeadpatService) {} 

  headpat() {
    this.headpatService.pat();
  }
}
