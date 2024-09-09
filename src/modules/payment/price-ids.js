import dotenv from '../../dotenv.js'

export default {
    'development': {
        'bulk': 'price_1PlFWMLxGNM2wk1PZajxK29d',
        'flex': 'price_1PsBB9LxGNM2wk1Ph6WdZCrC',
        'single': 'price_1PsBBKLxGNM2wk1PQcuwnwpy'
    },
    'production': {
        'bulk': 'price_1Pv5PHLxGNM2wk1PQwaRQf1d',
        'flex': 'price_1Pv5P7LxGNM2wk1PvO2BfVkf',
        'single': 'price_1Pv5OYLxGNM2wk1PJ6iAghiY'
    }
}[(process.env.PRODUCTION && !process.env.STRIPE_TEST_KEY) ? 'production' : 'development']