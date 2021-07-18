import { Component } from '@angular/core';
import { AttributesService } from './services/attributes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'conespace';

  constructor(public attributes: AttributesService) {}
}
