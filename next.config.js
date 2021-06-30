const { i18n } = require('./next-i18next.config');

module.exports = {
    i18n,
    env: {
        apiBaseUrl: process.env.API_BASE_URL
    },
    target: 'serverless'
};
