const express = require('express');
const rp = require('request-promise');
const cheerio = require('cheerio');
const Product = require('../models/product');
const User = require('../models/user');
const passport = require('passport');
const mongoose = require('mongoose').Types.ObjectId;
require('../passport/jwt');

const productRoutes = express.Router();

// api/products
productRoutes.get('/products/:category/:sort',
async (req, res, next) => {
    try {
        var sort;
        if (req.params.sort === 'price_asc') {
            sort = 'price'
        } else if (req.params.sort === 'price_desc')  {
            sort = '-price'
        } else {
            sort = 'name'
        }

        const products = await Product.
            find({ category: req.params.category  }).
            sort(sort);

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
            { $addToSet: { wishlist: product } },
            { new: true }
        ).populate('wishlist');

        res.json(user); 
    } catch (error) {
        res.json({error});
    }
});

// api/product
productRoutes.delete('/product/:id',
    // Middlewares
    passport.authenticate('jwt'),
async (req, res, next) => {
    try {
        if (!mongoose.isValid(req.params.id)) {
            var product = await Product.findOne({name:req.params.id});
            req.params.id = product._id;
        }
        
        var user = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { wishlist: req.params.id  } },
            { new: true },
        ).populate('wishlist');

        res.json(user);
    } catch (error) {
        res.json({error});
    }
});

async function syncProducts() {
    await getProducts('dishwashers');
    await getProducts('small-appliances');
}

/** FUNCTION FOR SCRAPPING */
const baseURL = 'https://www.appliancesdelivered.ie';
const dishwashers = '/dishwashers?'; // page=1&sort=price_asc
const appliances = '/small-appliances?' // page=1&sort=price_asc'

async function getProducts(category = 'dishwashers', page = '0', sort = 'price_asc') {

    var load = true;
    // generating the uri
    if (category === 'dishwashers') { var searchURL = dishwashers } else { var searchURL = appliances };

    while(load) {
        page++;
        var product = {};
    
        // Getting the html structure and the div with the result products
        var uri = baseURL + searchURL + `page=${page}&` + `sort=${sort}`;
        const html = await rp({ uri, timeout: 600000, }).catch(err => {
            console.log(`Scraping aborted. Err on ${uri}: ${err.message}.`);
            load = false;
        });
        const results_product = await cheerio('div.search-results-product.row', html);
        console.log(`Request to ${uri} got ${results_product.length} products`);
    
        if (results_product.length > 0) {
            // looping over the products
            results_product.map(async (i, scrap) => {
                // reset object
                product = {};
        
                // setting category
                product.category = category;
        
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
                var whole = parseInt(price.substr(1, price.indexOf('.')-1))
                var decimal = parseInt(price.substr(price.indexOf('.')+1, price.length))
                product.price = whole+(decimal/100);
            
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
            
                // Create or Update product
                var toUpdate = product;
                await Product.create(product)
                .catch(async () => {
                    await Product.updateOne({name}, toUpdate);
                })
            })
        } else {
            load = false;
        }
    }

}

module.exports = { productRoutes , syncProducts };

