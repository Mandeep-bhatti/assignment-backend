import cron from 'node-cron'
import { saveCronSnapshot } from '../api/services/coins.js'

export const runSaveSnapShotCron = async () => {

    cron.schedule('0 * * * *', () => {
        // use logging tool for cron job tracking
        saveCronSnapshot().then().catch(console.error)
    });

}