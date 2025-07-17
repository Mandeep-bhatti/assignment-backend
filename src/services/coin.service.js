import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://api.coingecko.com',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});


export const getCoinsData = async (params) => {
    try {
        const { data } = await apiClient.get('/api/v3/coins/markets', {
            params: params
        });
        return [null, data]
    } catch (Err) {
        return [Err, null]
    }
}