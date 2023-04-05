//Used in DateSelector to convert local time from calendar selection to
//UTC time for the database.
export const localToUTC = (selectedDate: Date) => {
    const utcDate = new Date(selectedDate.toUTCString());
    return utcDate;
    };

//Used in PollCard to convert UTC time from database to local time for
//display.
export const UTCtoLocal = (UTCdate: Date) => {
    const localDate = new Date(UTCdate);
    return localDate;
};

export const ISOtoReadable = (ISOdate: string) => {
    const dateObj = new Date(ISOdate);
    const localDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000); // convert to local time
    const readableDate = localDate.toLocaleDateString();
    const readableTime = localDate.toLocaleTimeString().slice(0, -3);
    return [readableDate, readableTime];
  };