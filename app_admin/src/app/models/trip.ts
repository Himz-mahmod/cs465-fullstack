// Shape of a trip record returned by the Express API (/api/trips)
export interface Trip {
  _id?: string;
  code: string;
  name: string;
  length: string;
  start: Date | string;
  resort: string;
  perPerson: string;
  image: string;
  description: string;
}
