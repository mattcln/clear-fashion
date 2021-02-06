/* eslint-disable no-console, no-process-exit */
const fsLibrary  = require('fs') 
const dedicatedbrand = require('./sources/dedicatedbrand');
const toJsonFile = require('./sources/toJsonFile');

async function sandbox (eshop = 'https://www.dedicatedbrand.com') {
  try {

    let brand = 'DEDICATED';
    console.log(`🕵️‍♀️  browsing ${eshop} source`);
    
    //Scrapping home page
    let products = await dedicatedbrand.scrape_products(eshop);
    toJsonFile.productToJsonFile(products, brand, false);
    console.log(products);

    //Scrapping all menu links on home page
    const links = await dedicatedbrand.scrape_links(eshop);

    //Scrapping on all the links
    for(let i = 0; i < links.length; i++){
      actual_link = eshop + links[i];
      console.log(actual_link);
      products = await dedicatedbrand.scrape_products(actual_link);
      if(i == links.length){
        toJsonFile.productToJsonFile(products, brand, true);
      } else toJsonFile.productToJsonFile(products, brand, false);
      
    }

    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}




const [,, eshop] = process.argv;

sandbox(eshop);