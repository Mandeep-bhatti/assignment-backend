import app from './server.js';
import { connect_mongodb } from './connection/db.js';
import { runSaveSnapShotCron } from './cron-jobs/snapshots.js';

function runCronJosb() {
    runSaveSnapShotCron();
}

async function init() {
    const PORT = process.env.PORT || 3000;

    await connect_mongodb();

    runCronJosb();

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });

}

init()

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

