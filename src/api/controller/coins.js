import * as CoinService from '../services/coins.js'
import { SuccessResponse } from '../../helpers/responses.js';

export const getCoins = async (req, res, next) => {
    try {
        const {query}= req
        const data = await CoinService.getCoins(query);
        return SuccessResponse(res, { data });
    } catch (err) {
        next(err)
    }
}

export const getCoinHistory = async (req, res) => {
    try {
        const { query, params } = req
        const data = await CoinService.getCoinsHistory(params, query);
        return SuccessResponse(res, { data });
    } catch (err) {
        next(err)
    }
}


export const takeSnapShot = async (_, res) => {
    try {
        await CoinService.takeSnapShot();
        return SuccessResponse(res);
    } catch (err) {
        next(err)
    }
}