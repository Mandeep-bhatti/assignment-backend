import { BadRequestError } from "../helpers/exceptions.js";
import { isValidDate } from "../utils/common.js";

export const getCoinHistoryValidaor = (req, res, next) => {
  try {
    const { params, query } = req;

    if (!params?.coinId) {
      return next(new BadRequestError('coin id is required'));
    }

    if (!isValidDate(query?.lastUpdatedDate)) {
      return next(new BadRequestError('latest updated date is invalid.'));
    }

    next(); // only called if no errors
  } catch (err) {
    next(err); // for unexpected errors
  }
};
