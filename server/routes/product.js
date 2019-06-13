const express = require('express');
const rp = require('request-promise');
const cheerio = require('cheerio');
const Product = require('../models/product');
const User = require('../models/user');
const passport = require('passport');
require('../passport/jwt');

const productRoutes = express.Router();

// api/products
productRoutes.get('/products/:category',
async (req, res, next) => {
    try {
        const products = await getProducts(req.params.category);
        res.json(products);
    } catch (error) {
        res.json({error});
    }
});

// api/product
productRoutes.post('/product',
    // Middlewares
    passport.authenticate('jwt'),
async (req, res, next) => {
    try {
        var product = await Product.findOne({name:req.body.name});
        if (!product) {
            product = await Product.create(req.body);
            product.save();
        }

        var user = await User.findByIdAndUpdate(
            req.user._id,
            { $push: { wishlist: product } },
            { new: true })
        .populate('wishlist');

        res.json(user); 
    } catch (error) {
        res.json({error});
    }
});

// api/product
productRoutes.delete('/product',
    // Middlewares
    passport.authenticate('jwt'),
async (req, res, next) => {
    try {
        var user = await User.findById(req.user._id).populate('wishlist');
        var list = user.wishlist.filter((product) => {
            return product.name !== req.body.name;
        })
        user.wishlist = list;
        user.save();

        res.json(user);
    } catch (error) {
        res.json({error});
    }
});

/** FUNCTION FOR SCRAPPING */
const baseURL = 'https://www.appliancesdelivered.ie';
const dishwashers = '/dishwashers?'; // page=1&sort=price_asc
const appliances = '/small-appliances?' // page=1&sort=price_asc'

async function getProducts(category = 'dishwashers', page = '1', sort = 'price_asc') {

    // generating the uri
    if (category === 'dishwashers') { var searchURL = dishwashers } else { var searchURL = appliances };
    searchURL = searchURL + `page=${page}&` + `sort=${sort}`;

    // final array of products and Object product to push 
    var products = [];
    var product = {};

    // Getting the html structure and the div with the result products
    const html = await rp({ uri: baseURL + searchURL, timeout: 600000, });
    const results_product = await cheerio('div.search-results-product.row', html);

    // looping over the products
    results_product.map((i, scrap) => {
        // reset object
        product = {};

        // product img
        const img = cheerio('div.product-image.col-xs-4.col-sm-4', scrap);
        var picture = cheerio('picture', img);
        var source = cheerio('source', picture).prop('data-srcset');
        product.img = source;
    
        // product name
        const description = cheerio('div.product-description.col-xs-8.col-sm-8', scrap);
        const name = cheerio('h4 > a', description).text();
        product.name = name;
    
        // product price
        const price = cheerio('h3.section-title', scrap).text();
        product.price = price;
    
        // product more info
        const info = cheerio('.item-info-more', scrap).children();
        const more_info = info.map((i, e) => {
            return e.next.data;
        })
        product.more_info = more_info.map((i, e) => {return e});
        delete product.more_info.options;
        delete product.more_info.prevObject;
    
        // branding img
        var div = cheerio('div.col-xs-12.col-sm-7.col-lg-8', scrap);
        picture = cheerio('picture', div);
        const brand = cheerio('img', picture).prop('data-src');
        product.brand = brand;
    
        // product warranty
        div = cheerio('div.sale-default-icon.match-height-always', scrap)
        picture = cheerio('picture', div);
        const warranty = cheerio('source', picture).prop('data-srcset');
        product.warranty = warranty;
    
        // info list
        const ul = cheerio('ul.result-list-item-desc-list.hidden-xs', scrap).children();
        product.info_list = ul.map((i, e) => {return e.children[0].data})
        delete product.info_list.options;
        delete product.info_list.prevObject;
    
        // Product object push to products finall array
        // console.log('product: ', product)
        products.push(product);
    })
    // console.log('products FINAL: ', products)
    return products;
}

module.exports = productRoutes;

