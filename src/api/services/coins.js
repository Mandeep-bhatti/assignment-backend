import { BadRequestError, CustomError } from "../../helpers/exceptions.js";
import { getCoinsData } from "../../services/coin.service.js";
import { HistoryModel } from "../../models/history.js";
import { isValidDate } from "../../utils/common.js";
import moment from "moment";


export const getCoins = async (query) => {
    const { currency } = query;
    const paylaod = {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 10,
        page: 1
    };

    // validate in validator if more params
    if (currency && typeof currency == 'string' && currency !== '') {
        paylaod.vs_currency = currency?.toLowerCase()
    }

    const [err, data] = await getCoinsData(paylaod);
    if (err) {
        const { status, data } = err?.response;
        throw new CustomError(data, status)
    }

    return mapRawCoinData(data)

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

export const getCoinsHistory = async (params, query) => {
    const { lastUpdatedDate, orderBy, orderType } = query;
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

    if (orderBy && orderType) {
        const orderValue = -1;

        if (orderType === 'asc') {
            orderValue = 1;
        }

        pipeline.push({
            $sort: {
                [orderBy?.trim()]: orderValue
            }
        });
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

export const takeSnapShot = async () => {
    const [err, data] = await getCoinsData({ vs_currency: "usd", order: "market_cap_desc", per_page: 10, page: 1 });

    if (err) {
        throw new BadRequestError('unable to take snapshot, try again later.')
    }

    await saveHistory(data);

    return true;

}

async function saveHistory(data = []) {
    const mapped = mapRawCoinData(data)
    return await HistoryModel.insertMany(mapped);
}

function mapRawCoinData(data=[]){
    return data?.map((item) => {
        return {
            coinId: item?.id,
            name: item?.name,
            symbol: item?.symbol,
            lastUpdatedAt: item?.last_updated,
            price: item?.current_price,
            marketCap: item?.market_cap,
            change24h: item?.price_change_percentage_24h,
            image:item?.image
        }
    })

}