import * as CoinService from '../services/coins.js'
import { SuccessResponse } from '../../helpers/responses.js';

export const getCoins = async (_, res, next) => {
    try {
        const data = await CoinService.getCoins(res);
        return SuccessResponse(res, { data });
    } catch (err) {
        next(err)
    }
}

export const getCoinHistory = async (req, res) => {
    try {
        const { query, params } = req
        const data = await CoinService.getCoinsHistory(res, params, query);
        return SuccessResponse(res, { data });
    } catch (err) {
        next(err)
    }
}


export const takeSnapShot = async (_, res) => {
    try {
        await CoinService.takeSnapShot(res);
        return SuccessResponse(res);
    } catch (err) {
        next(err)
    }
}