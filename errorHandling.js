// Script 5
const request = require('request');
const natural = require('natural');

// Replace YOUR_API_KEY with your CoinMarketCap API key
const API_KEY = 'YOUR_API_KEY';

// Set the ID of the cryptocurrency you want to predict (e.g. 1 for Bitcoin)
const CRYPTO_ID = 1;

// Set the start and end dates for the data you want to collect (in Unix timestamp format)
const start = 1609459200;  // 2021-01-01
const end = 1640995200;  // 2021-10-01

// Set the interval for the data (in minutes)
const interval = 1440;  // Daily data

// Set the exchange to use for the prediction (e.g. Coinbase, Binance, etc.)
const exchange = 'Coinbase';

// Function to make a request to the CoinMarketCap API and process the response
function getPriceData() {
  const options = {
    url: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/ohlcv/historical`,
    qs: {
      id: CRYPTO_ID,
      interval: interval,
      start: start,
      end: end,
      convert: 'USD',
      exchange: exchange,
    },
    headers: {
      'X-CMC_PRO_API_KEY': API_KEY,
    },
    json: true,
    gzip: true,
  };

  request(options, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      console.log('Error making request to CoinMarketCap API:', error);
      return;
    }

    // Process the data
    try {
      const data = body.data.map((entry) => {
        return {
          date: entry.timestamp,
          open: entry.open,
          high: entry.high,
          low: entry.low,
          close: entry.close,
          volume: entry.volume,
          marketCap: entry.market_cap,
        };
      });
      console.log(data);
    } catch (error) {
      console.log('Error processing data from CoinMarketCap API:', error);
    }
  });
}

// Function to make a request to the NewsAPI and process the response
function getNewsData() {
  const options = {
    url: 'https://newsapi.org/v2/everything',
    qs: {
      q: 'bitcoin',  // Query for Bitcoin news
      from: '2022-01-01',  // Start date
      to: '2022-12-31',  // End date
      sortBy: 'relevancy',  // Sort by relevancy
      language: 'en',  // English language
      pageSize: 100,  // Number of articles to retrieve
      apiKey: 'YOUR_API_KEY',  // Your NewsAPI key
    },
    json: true,
  };

  request(options, function(error, response, body) {
      if (response.statusCode !== 200) {
        console.log(`Error: Invalid response code ${response.statusCode}`);
        return;
    }

    // Process the data
    const articles = body.articles;
    const tokenizer = new natural.WordTokenizer();
    const articleText = articles.map((article) => article.description).join(' ');
    const words = tokenizer.tokenize(articleText);
    const wordCounts = natural.NGrams.ngrams(words, 1);

    console.log(wordCounts);
  });
}

try {
  // Get the price data
  getPriceData();

  // Get the news data
  getNewsData();
} catch (error) {
  console.log('An error occurred:', error);
}

