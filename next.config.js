module.exports = {
    assetPrefix: process.env.NODE_ENV === 'production' ? 'https://wh2o.us': '',
    env: {
        apiBaseUrl: process.env.API_BASE_URL
    },
};
