import { DatePipe } from "@angular/common";
import { AbstractControl } from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export class Helper {
    static getDateFormatter(date: any) {
        let newDate = null;

        if(date) {
          const dateformatter = date.year + '-' + date.month + '-' + date.day;
          let datePipe = new DatePipe('en-US');
          newDate = datePipe.transform(dateformatter, 'yyyy-MM-dd');
        }

        return newDate;
    }

    static editDate(date: any): any {
      let datePipe = new DatePipe('en-US');
      return datePipe.transform(date, 'yyyy-MM-dd')
    }

    static downloadFile(response: any, fileName: string) {
        const downloadUrl = URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName; // Nom du fichier téléchargé
        link.click();
        URL.revokeObjectURL(downloadUrl);


    }
    static getTimeValue(timeControl: AbstractControl | null): string {
        if (timeControl && timeControl.value !== null) {
          return timeControl.value as string;
        }
        return '';
      }
      static parseTimeString(timeString: string): Date {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        return date;
    }

  //Formatter date customing by laty to search
  static formatDateToSearch(dateString: string): string {
    if (dateString) {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day).toString();
    }
    return "";
  }

}


