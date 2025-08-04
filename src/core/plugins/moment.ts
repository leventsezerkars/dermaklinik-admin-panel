import moment from "moment";
import "moment/locale/tr";
export default function initMoment() {
  moment.locale("tr");
  moment.HTML5_FMT.DATE = "DD.MM.YYYY";
  moment.HTML5_FMT.TIME = "HH:mm";
  moment.HTML5_FMT.DATETIME_LOCAL = "DD.MM.YYYY HH:mm";
}
