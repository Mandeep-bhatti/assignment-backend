import { BadRequestError,CustomError } from "../../helpers/exceptions.js";
import { getCoinsData } from "../../services/coin.service.js";
import { HistoryModel } from "../../models/history.js";
import { isValidDate } from "../../utils/common.js";
import moment from "moment";


export const getCoins = async (res) => {
    const [err, data] = await getCoinsData({ vs_currency: "usd", order: "market_cap_desc", per_page: 10, page: 1 });
    if (err) {
        const { status, data } = err?.response;
        throw new CustomError(data,status)
    }

    return data

}

export const saveCronSnapshot = async () => {
    const [err, data] = await getCoinsData(
        {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 10,
            page: 1
        });

    if (err) {
        console.log(err?.response?.data);
        return;
    }
    await saveHistory(data)
    return;
}

export const getCoinsHistory = async (res, params, query) => {
    const { lastUpdatedDate } = query;
    let { pageSize, pageNumber } = query;
    const coinId = params?.coinId;

    pageSize = Number(pageSize) || 10;
    pageNumber = Number(pageNumber) || 1;

    const skip = (pageNumber - 1) * pageSize

    const pipeline = [];


    if (isValidDate(lastUpdatedDate)) {
        const startDate = moment(lastUpdatedDate).startOf('days').toDate();
        const endDate = moment(lastUpdatedDate).endOf('days').toDate();
        pipeline.push({
            $match: {
                lastUpdatedDate: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        })
    }

    const [response] = await HistoryModel.aggregate([
        {
            $match: {
                coinId: coinId
            }
        },
        ...pipeline,
        {
            $facet: {
                total: [{ $count: "count" }],
                data: [{ $skip: skip }, { $limit: pageSize }],
            }
        },
        {
            $unwind: "$total"
        }
    ]);

    const { total, data } = response ?? {};
    return { items: data ?? [], total: total?.count ?? 0 } 
}

export const takeSnapShot = async (res) => {
    const [err, data] = await getCoinsData({ vs_currency: "usd", order: "market_cap_desc", per_page: 10, page: 1 });

    if (err) {
        throw new BadRequestError( 'unable to take snapshot, try again later.')
    }

    await saveHistory(data);

    return true;

}

async function saveHistory(data = []) {
    const mapped = data?.map((item) => {
        return {
            coinId: item?.id,
            name: item?.name,
            symbol: item?.symbol,
            lastUpdatedAt: item?.last_updated,
            price: item?.current_price,
            marketCap: item?.market_cap,
            change24h: item?.price_change_percentage_24h
        }
    })

    return await HistoryModel.insertMany(mapped);
}