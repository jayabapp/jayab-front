import moment from "moment-jalaali";

export default function startOfDate(date: Date): Date {
  return new Date(moment(date).format("YYYY-MM-DD")); // 2023-11-12T00:00:00.000Z
}
