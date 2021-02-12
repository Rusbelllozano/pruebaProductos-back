const express = require("express");
const router = express.Router();
const path = require('path');
const faker = require('faker');
const Product = require('../models/index.js')
router.get("/hola", function (req, res) {
  res.sendFile(path.join(__dirname + "/../views/index.html"));
});
router.get('/get_all_categories',(req, res, next) => {

  Product.find({},{"category":1,"_id":0}).then((response)=>{
    return res.send({
      response,
    })
  })

})
router.get('/products', (req, res, next) => {
  let options ={
    sort:{
      price:0
    }
  }
  let filter = {
    
  }
  var noMatch = null;
  let perPage = 9
  let page = req.query.page || 1
  options.skip = (perPage * page) - perPage
  options.limit = perPage

if(req.query.category && req.query.search){
  filter.$and=[
    {category:req.query.category?req.query.category:''},
    {name:req.query.search ? new RegExp(escapeRegex(req.query.search), 'gi'):""}
  ]
}else{
  filter.$or=[
    {category:req.query.category?req.query.category:''},
    {name:req.query.search ? new RegExp(escapeRegex(req.query.search), 'gi'):""}
  ]
}
if(req.query.sort){
  options.sort.price = req.query.sort
}

// if(req.query.search){
//   filter.name = new RegExp(escapeRegex(req.query.search), 'gi');
// }
// if(req.query.category){
//   filter.category = req.query.category
// }
console.log(filter)
console.log(options)
Product
      .find(filter,null,options).exec((err, products) => {
        Product.count((err, count) => {
          if (err) {
            return next(err);
          }else {
            if (products.length < 1) {
              noMatch = "No Products match that query, please try again.";
            }
            return res.send({
              products,
              noMatch: noMatch,
              currentPage: page,
              pages: Math.ceil(count / perPage)
            })
          }
        })
      })




  // if (req.query.search) {
  //   const regex = new RegExp(escapeRegex(req.query.search), 'gi');
  //   Product
  //     .find({ name: regex }).skip((perPage * page) - perPage).limit(perPage).exec((err, products) => {
  //       Product.count((err, count) => {
  //         if (err) {
  //           return next(err);
  //         }else {
  //           if (products.length < 1) {
  //             noMatch = "No Products match that query, please try again.";
  //           }
  //           return res.send({
  //             products,
  //             noMatch: noMatch,
  //             currentPage: page,
  //             pages: Math.ceil(count / perPage)
  //           })
  //         }
  //       })
  //     })
  // } else if(req.query.sort){
  //   let sort = req.query.sort
  //   Product
  //     .find({ }).sort({
  //       price:sort
  //     }).skip((perPage * page) - perPage).limit(perPage).exec((err, products) => {
  //       Product.count((err, count) => {
  //         if (err) {
  //           return next(err);
  //         }else {
  //           if (products.length < 1) {
  //             noMatch = "No Products match that query, please try again.";
  //           }
  //           return res.send({
  //             products,
  //             noMatch: noMatch,
  //             currentPage: page,
  //             pages: Math.ceil(count / perPage)
  //           })
  //         }
  //       })
  //     })
  // }else if(req.query.category){
  //   Product
  //     .find({ category:req.query.category}).then((products)=>{
  //       return res.send({
  //         products,
  //         currentPage: 1,
  //         pages: 1
  //       })
  //     })
  // }else {
  //   Product
  //     .find({}).skip((perPage * page) - perPage).limit(perPage).exec((err, products) => {
  //       Product.count((err, count) => {
  //         if (err) {
  //           return next(err);
  //         }
  //         return res.send({
  //           products,
  //           currentPage: page,
  //           pages: Math.ceil(count / perPage)
  //         })
  //       })
  //     })
  // }

})

// router.get('/generate-fake-data', (req, res) =>{
// for (let index = 0; index < 9; index++) {
//   const product = new Product();
//   product.category = faker.commerce.department()
//   product.name = faker.commerce.productName()
//   product.price = faker.commerce.price()
//   product.cover = faker.image.image()
//   product.save(err =>{
//     if(err){
//       return next(err)
//     }
//   })

// } 

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports = router;