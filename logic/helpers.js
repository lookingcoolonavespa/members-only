exports.getDateStr = function (dateObj) {
  console.log(dateObj);
  return `${dateObj.getDate()} - ${dateObj.getMonth()} - ${
    dateObj.getFullYear
  }`;
};
