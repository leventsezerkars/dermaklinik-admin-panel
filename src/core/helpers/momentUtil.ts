import moment from "moment";
import store from "../../store";

export const getFormattedValue = (
  value: Date,
  type: "date" | "time" | "datetime"
): string => {
  if (value == null || value == undefined) return "-";
  const momentdate = moment(value);
  switch (type) {
    case "date":
      return momentdate.format(moment.HTML5_FMT.DATE);
    case "time":
      return momentdate.format(moment.HTML5_FMT.TIME);
    case "datetime":
      return momentdate.format(moment.HTML5_FMT.DATETIME_LOCAL);
  }
};

export const dateShortcut = (
  type: "thismonth" | "lastmonth" | "thisyear" | "lastyear"
): any => {
  const date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();

  if (type == "thismonth") {
    const firstDate = new Date(y, m, 1);
    const lastDate = new Date(y, m + 1, 0);
    return { firstDate, lastDate };
  } else if (type == "lastmonth") {
    const firstDate = new Date(y, m - 1, 1);
    const lastDate = new Date(y, m, 0);
    return { firstDate, lastDate };
  } else if (type == "thisyear") {
    const firstDate = new Date(y, 0, 1);
    const lastDate = new Date(y, 11, 31);
    return { firstDate, lastDate };
  } else if (type == "lastyear") {
    const firstDate = new Date(y - 1, 0, 1);
    const lastDate = new Date(y - 1, 11, 31);
    return { firstDate, lastDate };
  }
};

export const currencyFormat = (
  val: number | undefined,
  symbol = false
): string | null => {
  if (val == undefined || val == null) {
    return "0";
  }

  const defaultoptions: Intl.NumberFormatOptions = {
    minimumIntegerDigits: 1,
    minimumFractionDigits: 2,
  };
  const storeValues = store.getters.currentCountryInfo;
  const countryInfo = {
    code:
      storeValues.currencySymbol == undefined
        ? "ch"
        : storeValues.currencySymbol,
    currencySymbol:
      storeValues.currencySymbol == undefined
        ? "CHF"
        : storeValues.currencySymbol,
  };

  const currencyOptions = {
    style: "currency",
    currency: countryInfo.currencySymbol,
  };
  let options = { ...defaultoptions };

  if (symbol) {
    options = { ...defaultoptions, ...currencyOptions };
  }
  return val.toLocaleString(countryInfo.code, options);
};
