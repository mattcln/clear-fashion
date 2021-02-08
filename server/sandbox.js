/* eslint-disable no-console, no-process-exit */
const fsLibrary  = require('fs') 
const dedicatedbrand = require('./sources/dedicatedbrand');
const toJsonFile = require('./sources/toJsonFile');
const eshops = ['https://www.dedicatedbrand.com'];



async function sandbox () {
  dedicated_scrapping(eshops[0]);

}

async function dedicated_scrapping(eshop, brand = 'DEDICATED'){
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);  

    //Scrapping home page
    console.log(eshop);
    let products = await dedicatedbrand.scrape_products(eshop);    
    toJsonFile.productToJsonFile(products, brand, 'start');
    

    //Scrapping all menu links on home page
    const links = await dedicatedbrand.scrape_links(eshop);
    

    //Scrapping on all the links
    let status = 'middle'
    for(let i = 0; i < links.length; i++){
      actual_link = eshop + links[i];
      console.log(actual_link);
      products = await dedicatedbrand.scrape_products(actual_link);
      if(i == links.length - 1){
        toJsonFile.productToJsonFile(products, brand, 'end');
      } else toJsonFile.productToJsonFile(products, brand, status);
    }
    console.log('Dedicated scrapping done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }  
}



const [,, eshop] = process.argv;

sandbox(eshop);