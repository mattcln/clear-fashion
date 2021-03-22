/* eslint-disable no-console, no-process-exit */
const fsLibrary  = require('fs') 
const dedicatedbrand = require('./sources/dedicatedbrand');
const mudjeans = require('./sources/mudjeans');
const adresseparis = require('./sources/adresseparis');
const toJsonFile = require('./sources/toJsonFile');
const eshops = ['https://www.dedicatedbrand.com'];
const {MongoClient} = require('mongodb');
eshops.push('https://mudjeans.eu/');
eshops.push('https://adresse.paris/');

const MONGODB_URI = "mongodb+srv://mattcln:7JjE7PQgyR95yBFz@cluster0.n19bz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const MONGODB_DB_NAME = "clearfashion"

async function sandbox() {
  try {
    //dedicated_products = await dedicated_scrapping(eshops[0]);
    mudjeans_products = await mudjeans_scrapping(eshops[1]);
    
    let allproducts = []
    //allproducts = dedicated_products.concat(mudjeans_products);
    
    //console.log(allproducts);
  
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db = client.db(MONGODB_DB_NAME)
    const collection = db.collection('products');
    const result = await collection.insertMany(mudjeans_products);
    console.log(result);
  
    //await adresseparis_scrapping(eshops[2]); 
  
    console.log('All scrapping done');
    process.exit(0);
  }
  catch(error){
    console.error(error)
  }
  
}

async function dedicated_scrapping(eshop, brand = 'DEDICATED'){
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);  

    //Scrapping home page
    console.log(eshop);
    let dedicated_products = await dedicatedbrand.scrape_products(eshop);
    let products = [];
    

    //Scrapping all menu links on home page
    const links = await dedicatedbrand.scrape_links(eshop);
    
    //Scrapping on all the links
    for(let i = 0; i < links.length; i++){
      actual_link = eshop + links[i];
      console.log(actual_link);
      products = await dedicatedbrand.scrape_products(actual_link);
      dedicated_products = dedicated_products.concat(products)
    }

    console.log('Dedicated scrapping done');
    return dedicated_products;
  } catch (e) {
    console.error(e);
    process.exit(1);
  }  
}

async function mudjeans_scrapping(eshop, brand = 'MUDJEANS'){
  try  {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    //Scrapping home page
    console.log(eshop);
    let mudjeans_products = await mudjeans.scrape_products(eshop);
    let products = [];  
    toJsonFile.productToJsonFile(products, brand);

    //Scrapping all menu links on home page
    let links_duplicated = await mudjeans.scrape_links(eshop);
    let links = [];

    //Removing duplicates links
    links_duplicated.forEach((link) => {
      if(!links.includes(link)){
        links.push(link);
      }
    })

    //Scrapping on all the links
    for(let i = 0; i < links.length; i++){
      actual_link = eshop + links[i];
      console.log(actual_link);
      products = await mudjeans.scrape_products(actual_link);
      mudjeans_products = mudjeans_products.concat(products);
      //toJsonFile.productToJsonFile(products, brand);
    }

    console.log('Mudjeans scrapping done');
    return mudjeans_products;
  } catch (e) {
    console.error(e);
    process.exit(1);
  }  
}

/* 
async function adresseparis_scrapping(eshop, brand = 'Adresse Paris'){
  console.log(`🕵️‍♀️  browsing ${eshop} source`);
    
    //Scrapping all menu links on home page
    const link = "https://adresse.paris/630-toute-la-collection";
    products = await adresseparis.scrape_products(link);
    console.log(products);
    
} */

sandbox(eshops);

const [,, eshop] = process.argv;
