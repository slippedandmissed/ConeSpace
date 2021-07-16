import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaffleconeComponent } from './wafflecone.component';

describe('WaffleconeComponent', () => {
  let component: WaffleconeComponent;
  let fixture: ComponentFixture<WaffleconeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaffleconeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaffleconeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
