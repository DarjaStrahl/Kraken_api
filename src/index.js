const key          = process.env.KRAKEN_API_KEY; // API Key
const secret       = process.env.KRAKEN_SECRET_KEY; // API Private Key
const KrakenClient = require('kraken-api');
const kraken       = new KrakenClient(key, secret);

async function wait() {
    return new Promise((resolve) => setTimeout(resolve, 2000))
}

//const INVEST_AMOUNT = 100

const configs = [{
    ticker: "XXBTZEUR",
    amount: 100,
    },
]

;(async () => {
    // Display user's balance
    let eurBalance = (await kraken.api('Balance')).result.ZEUR
    console.log( 'eurBalance', eurBalance );

    // Get Ticker Info
    const tickerInfo = await kraken.api('Ticker', { pair : "XXBTZEUR" })
    //const tickerInfo = await kraken.api('Ticker', { pair : 'XXBTZEUR' });

    configs.forEach(pair => {
        pair.currentPrice =parseFloat(tickerInfo.result[pair.ticker].p[0])
    })


    for(const pair of configs){
        await wait()

        const volume = (pair.amount/ pair.currentPrice).toFixed(6)
        const price = (pair.currentPrice-500).toFixed(1)
        console.log( "price: ", price )
        console.log( "volume: ", volume )
        console.log("Trying to place an order for " + pair.ticker)
        if ( eurBalance  < 99){
            console.log("Insufficient funds, abort.")
            return
        }
        console.log( 'volume', volume )
        console.log( "price", price )
        try {
            const result = await kraken.api('AddOrder', {
                pair: pair.ticker,
                type: 'buy',
                ordertype: 'limit',
                price,
                volume,
                expiretm: '+604800',
            })
            eurBalance -= pair.amount
            console.log( "result", result )
        } catch (err) {
            console.error(err)
        }

    }

})();
