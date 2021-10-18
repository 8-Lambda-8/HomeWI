import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAutoTempDialogComponent } from './edit-auto-temp-dialog.component';

describe('EditAutoTempDialogComponent', () => {
  let component: EditAutoTempDialogComponent;
  let fixture: ComponentFixture<EditAutoTempDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAutoTempDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAutoTempDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
