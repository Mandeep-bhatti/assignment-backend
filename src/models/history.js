import mongoose from 'mongoose';

export const HistorySchema = new mongoose.Schema({
    coinId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
        uppercase: true,
    },
    price: {
        type: Number,
        required: true,
    },
    marketCap: {
        type: Number,
        required: true,
    },
    change24h: {
        type: Number,
        required: true,
    },
    lastUpdatedAt: {
        type: Date,
    },
    createdAt: {
        type: Date, default: Date.now,
    }
});

export const HistoryModel = mongoose.model('history', HistorySchema);

HistorySchema.index({ 'coinId': 1, createdAt: 1 })