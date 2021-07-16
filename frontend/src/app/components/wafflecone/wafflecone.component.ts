import { Component, OnInit } from '@angular/core';

type animationTypes = "idle";

@Component({
  selector: 'app-wafflecone',
  templateUrl: './wafflecone.component.html',
  styleUrls: ['./wafflecone.component.scss']
})
export class WaffleconeComponent implements OnInit {

  constructor() { }

  animation: animationTypes = "idle";

  ngOnInit(): void {
  }

}
