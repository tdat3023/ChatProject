import moment from "moment";
import {
  differenceInHours,
  differenceInCalendarDays,
  differenceInCalendarYears,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";
export const convertDateTimeToString = (dateTime, format) => {
  return moment(dateTime).format(format);
};
export const handleDate = (currentDate, passDate) => {
  // How many minutes are between 10:01:59 and 10:00:00
  const minus = differenceInMinutes(currentDate, passDate);
  //check duoi 1p -> tinh giay

  if (minus <= 1) return " vừa truy cập";
  if (minus < 61) return minus + " phút ";
  const resultTime = differenceInHours(currentDate, passDate);
  if (resultTime < 25) return resultTime + " giờ";
  const resultDate = differenceInCalendarDays(currentDate, passDate);
  if (resultDate < 8) return resultDate + " ngày";
  return passDate.slice(0, 10);
};
