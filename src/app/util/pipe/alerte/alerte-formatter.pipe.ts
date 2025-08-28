import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alerteFormatter'
})
export class AlerteFormatterPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(value == null) {
      return null;
    }

    const valueString = JSON.stringify(value);
    

    let messageWithoutTag = valueString.substring(4, valueString.length-4);

    return messageWithoutTag;
  }

}
