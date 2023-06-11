import { Component, OnInit, forwardRef, Input, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, } from '@angular/forms';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from './dateformat'
import * as moment from 'moment'

export const DATEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatepickerPopupComponent),
  multi: true
};

@Component({
  selector: 'app-date-picker',
  templateUrl: './datepicker-popup.component.html',
  styleUrls: ['./datepicker-popup.component.css'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }, DATEPICKER_VALUE_ACCESSOR]
})
export class DatepickerPopupComponent implements ControlValueAccessor {

  public formControl: FormControl = new FormControl(null);
  @Input() minimumDate: boolean = false;
  @Input() minDate: any;
  @Input() maxDate: any;
  @Input() disable: boolean = false;
  @Output() callback = new EventEmitter();
  @Output() clearDateValidation = new EventEmitter();
  @Input() cssClass: boolean;
  selectedDate: any;
  disabled = false;
  tDate: Date;

  constructor(private config: NgbDatepickerConfig) {
    config.minDate = { year: 1900, month: 1, day: 1 };
  }

  dateChangeCallback() {
    this.callback.emit();
  }

  clearCoverfromValidation() {
    this.clearDateValidation.emit();
  }
  // Function to call when the date changes.
  onChange = (date?: Date) => {
  };

  // Function to call when the date picker is touched
  onTouched = () => {
  };

  writeValue(value: Date) {
    if (!value) {
      this.selectedDate = null;
      return;
    }


    if (typeof (value) != "object") {
      value = new Date(value);
      this.selectedDate = {
        year: value.getFullYear(),
        month: value.getMonth() + 1,
        day: value.getDate()
      }
    }
    else {
      this.selectedDate = {
        year: value.getFullYear(),
        month: value.getMonth() + 1,
        day: value.getDate()
      }
    }
  }

  registerOnChange(fn: (date: Date) => void): void {
    this.onChange = fn;
  }

  // Allows Angular to register a function to call when the input has been touched.
  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Write change back to parent
  onDateChange(value: Date) {
    if (typeof value == "string") {
      if (this.checkValidDate(value)) {
        const date = moment(value, 'DD/MM/YYYY');
        this.tDate = new Date();
        this.onChange(new Date(parseInt(date.format('YYYY'), 10), parseInt(date.format('M'), 10) - 1, parseInt(date.format('D'), 10), this.tDate.getHours(), this.tDate.getMinutes(), this.tDate.getSeconds(), this.tDate.getMilliseconds()));
      }
      else {
        value = null;
        this.onChange(value);
      }
    }
  }

  // Write change back to parent
  onDateSelect(value: any) {
    this.tDate = new Date();
    this.onChange(new Date(value.year, value.month - 1, value.day, this.tDate.getHours(), this.tDate.getMinutes(), this.tDate.getSeconds(), this.tDate.getMilliseconds()));

    // if (this.minimumDate) {
    //   this.setMinimunDate(value);
    // }
    // if (this.maxDate) {
    //   this.setMaximumDate(value);
    // }
  }

  setMinimunDate(date: any) {
    const current = new Date(date.year, date.month - 1, date.day, this.tDate.getHours());
    this.config.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
    this.config.outsideDays = 'hidden';
  }
  setMaximumDate(date: any) {
    const current = new Date(date.year, date.month - 1, date.day, this.tDate.getHours());
    this.config.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
    this.config.outsideDays = 'hidden';
  }

  celenderPopup() {
    if (this.minimumDate) {
      this.config.minDate = undefined;
      this.config.outsideDays = "visible";
    }
    if (this.maxDate) {
      this.config.maxDate = undefined;
      this.config.outsideDays = "visible";
    }
  }

  checkValidDate(str) {
    var t = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (t === null)
      return false;
    var d = +t[1], m = +t[2], y = +t[3];

    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return true;
    }

    return false;
  }

  dateMasking(event) {
    var ASCIICode = (event.which) ? event.which : event.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
      return false;
    else {
      let inputValue = event.target.value;
      let newValue = inputValue.replace(/\//g, '');

      if (newValue.length >= 8)
        return false;
      else {
        if (newValue.length == 1 && inputValue.length == 3) {
          event.target.value = newValue.substring(0, 2);
        }
        if (newValue.length == 2 && (inputValue.length == 2 || inputValue.length == 4)) {
          event.target.value = newValue.substring(0, 2) + '/';
        }
        else if (newValue.length == 4 && (inputValue.length == 4 || inputValue.length == 5 || inputValue.length == 6)) {
          event.target.value = newValue.substring(0, 2) + '/' + newValue.substring(2, 4) + '/';
        }
        else if (newValue.length == 6 && inputValue.length == 7) {
          event.target.value = newValue.substring(0, 2) + '/' + newValue.substring(2, 4) + '/' + newValue.substring(4, 8);
        }
        else if (newValue.length == 8 && inputValue.length == 8) {
          event.target.value = newValue.substring(0, 2) + '/' + newValue.substring(2, 4) + '/' + newValue.substring(4, 8);
        }
      }
    }
  }


}
