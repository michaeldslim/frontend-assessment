import moment from "moment";

export const formatDateTime = (dateTime: string): string => {
  return moment(dateTime).format("MMM D, YYYY h:mm A");
};
