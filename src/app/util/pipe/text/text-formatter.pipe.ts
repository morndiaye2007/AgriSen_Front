import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textFormatter'
})
export class TextFormatterPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    const valueString = JSON.stringify(value);

    let message: string | null = null;

    let valueAgrs: any = args[0];
    
    const length = valueAgrs.split(':')[1];

    message = valueString.substring(1, length).concat('...');

    return message;
  }

}
