declare module 'moment-hijri' {
  import { Moment } from 'moment';

  interface MomentHijri extends Moment {
    iYear(year?: number): number & MomentHijri;
    iMonth(month?: number): number & MomentHijri;
    iDate(date?: number): number & MomentHijri;
    iDay(): number;
    format(format?: string): string;
    add(amount: number, unit: string): MomentHijri;
    clone(): MomentHijri;
    toDate(): Date;
  }

  /**
   * Create a moment-hijri instance.
   * - `moment()` — current date
   * - `moment('1446/8/17', 'iYYYY/iM/iD')` — parse a Hijri date string
   * - `moment(date)` — from a JS Date, string, or timestamp
   */
  function momentHijri(date?: Date | string | number, format?: string): MomentHijri;

  namespace momentHijri {
    function locale(locale: string): string;
  }

  export default momentHijri;
}