export default interface ITrip {
  id: string;
  driver?: string;
  passenger?: string;
  origin: string;
  destination: string;
  start_time: string;
  status: string;
}
