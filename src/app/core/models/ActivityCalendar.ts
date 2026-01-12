import {JournalEntry} from "./JournalEntry";

export interface ActivityCalendar {
  date: Date;
  activities: JournalEntry[];
}
