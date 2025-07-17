import { Router } from "express";
import * as coinController from "../controller/coins.js";
import * as validator from '../../validations/coins.js'
const coinRouter = Router();

coinRouter.get('/coins', coinController.getCoins);

coinRouter.post('/coins/history', coinController.takeSnapShot);

coinRouter.get('/coins/history/:coinId',validator.getCoinHistoryValidaor, coinController.getCoinHistory);

export default coinRouter

