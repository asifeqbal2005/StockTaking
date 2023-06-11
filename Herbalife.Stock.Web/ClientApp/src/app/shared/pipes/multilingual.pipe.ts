import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'multilingualPipe',
})
export class MultilingualPipe implements PipeTransform {
  transform(value: any, items: any): any {
    if (!items || items.length < 1) return "";
    if (!value) return "";
    const filterredData = items.find(k => k.labelId == value);
    return !filterredData ? '' : filterredData.translatedText;
  }
}
