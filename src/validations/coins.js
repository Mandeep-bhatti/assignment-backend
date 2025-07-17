import { BadRequestError } from "../helpers/exceptions.js";
import { isValidDate } from "../utils/common.js";

// --------------NOTE use class validator for more inhncement
export const getCoinHistoryValidaor = (req, _, next) => {
  try {
    const { params, query } = req;

    if (!params?.coinId) {
      return next(new BadRequestError('coin id is required'));
    }

    // will check it it will exist in req
    if (lastUpdatedDate && !isValidDate(query?.lastUpdatedDate)) {
      return next(new BadRequestError('latest updated date is invalid.'));
    }

    next(); // only called if no errors----- >>>>>>>>>>>> just passing the req
  } catch (err) {
    next(err); // for unexpected errors//  --->>>>>>> it will throw global errot
  }
};
