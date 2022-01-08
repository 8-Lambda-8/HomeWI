import { Component, ElementRef, EventEmitter, forwardRef, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import iro from "@jaames/iro";
import { IroColorPicker } from '@jaames/iro/dist/ColorPicker';

@Component({
  selector: 'app-color-picker-dialog',
  template: '<button mat-icon-button class="colorPickerButton" [style.background-color]="value" (click)="openDialog()" >',
  styleUrls: ['./color-picker-dialog.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerDialogComponent),
      multi: true
    }]
})
export class ColorPickerDialogComponent implements OnInit, ControlValueAccessor {

  @Output('change')
  change: EventEmitter<string> = new EventEmitter<string>();

  private _value: string = '';
  get value() {
    return this._value;
  }
  set value(v: string) {
    if (v !== undefined && v !== this._value) {
      this._value = v;
      this.onChange(v);
      this.onTouch(v);
    }
  }

  constructor(
    public dialog: MatDialog,
  ) { }

  onChange: any = () => { }
  onTouch: any = () => { }


  writeValue(obj: any): void {
    this._value = obj
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogRef = this.dialog.open(ColorPickerDialog, {
      data: { parent: this }
    });
  }
}

@Component({
  selector: 'color-picker-dialog',
  template: '<div #picker></div>',
  styleUrls: ['./color-picker-dialog.component.scss']
})
export class ColorPickerDialog {
  @ViewChild('picker') picker!: ElementRef;

  ColorPicker: IroColorPicker | undefined;

  constructor(
    public dialogRef: MatDialogRef<ColorPickerDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { parent: ColorPickerDialogComponent }
  ) { }

  ngAfterViewInit() {
    this.ColorPicker = iro.ColorPicker(this.picker.nativeElement as HTMLElement, { width: 320, color: this.data.parent.value });

    this.ColorPicker.on('color:change', (color: iro.Color) => {
      this.data.parent.value = color.hexString.toUpperCase();
      this.data.parent.change.emit(color.hexString.toUpperCase());
    });
  }

}
