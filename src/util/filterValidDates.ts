export const filterValidDates =
  (todayOnly = false, day?: number) =>
  (fileName: string) => {
    const date = Number(fileName);
    const now = new Date();

    if (typeof day === 'number') {
      return day === date;
    }

    if (isNaN(date)) {
      // filter out template etc
      return false;
    }

    if (now.getMonth() !== 11) {
      // display all if not December
      return true;
    }

    if (todayOnly) {
      return date === now.getDate();
    }

    // filter out future
    return date <= now.getDate();
  };
