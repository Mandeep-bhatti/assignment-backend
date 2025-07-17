import moment from "moment";

export const isValidDate = (date,format="YYYY-MM-DD") => {
    if (!date) return false;
    return moment(date,format,true).isValid()
}