/* eslint-disable no-console, no-process-exit */
const fsLibrary  = require('fs') 
const dedicatedbrand = require('./sources/dedicatedbrand');
const toJsonFile = require('./sources/toJsonFile');

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await dedicatedbrand.scrape(eshop);
    brand = 'DEDICATED';

    toJsonFile.productToJsonFile(products, brand);
    
    console.log(products);
    console.log('done');
  } catch (e) {
    console.error(e);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);