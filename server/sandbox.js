/* eslint-disable no-console, no-process-exit */
const fsLibrary  = require('fs') 
const dedicatedbrand = require('./sources/dedicatedbrand');


async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await dedicatedbrand.scrape(eshop);
    brand = 'DEDICATED';

    let jsonProduct = toJson(products, brand);
    fsLibrary.writeFile('ScrappedProducts.json', jsonProduct, (error) => { 
      
      // In case of a error throw err exception. 
      if (error) throw err; 
    }) 
    console.log(products);
    console.log('done');
  } catch (e) {
    console.error(e);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);

function toJson(products, brand){
  let jsonproducts = "[\n";
  for(let i = 0; i < products.length; i++){
    jsonproducts += '\t{\n\t\t"brand" : "' + brand + '",\n\t\t"name": "' + products[i].name + '",\n\t\t"price": ' + products[i].price + '\n\t},\n';
  }
  jsonproducts = jsonproducts.substring(0, jsonproducts.length - 2);
  jsonproducts += '\n]'
  return jsonproducts;
}