import { BadRequestError } from "../helpers/exceptions.js";
import { isValidDate } from "../utils/common.js";

// --------------NOTE use class validator for more inhncement
export const getCoinHistoryValidaor = (req, _, next) => {
  const { params, query } = req;
  const { lastUpdatedDate, orderBy, orderType } = query
  if (!params?.coinId) {
    return next(new BadRequestError('coin id is required'));
  }

  // will check it it will exist in req
  if (lastUpdatedDate && !isValidDate(lastUpdatedDate)) {
    return next(new BadRequestError('last updated date is invalid.'));
  }

  if (orderBy && orderType && !['asc', 'desc'].includes(orderType)) {
    return next(new BadRequestError('order value is invalid.'));
  }

  next(); // only called if no errors----- >>>>>>>>>>>> just passing the req

};
