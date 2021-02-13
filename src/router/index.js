const express = require("express");
const router = express.Router();
const path = require('path');
const faker = require('faker');
const Product = require('../models/index.js');
const { query } = require("express");

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
class APIfeatures{
  constructor(query,queryString){
    this.query = query;
    this.queryString = queryString
  }
  filtering(){
    const queryobj = {...this.queryString};
    const excludedfields =['page','sort','limit']
    excludedfields.forEach(el=>delete queryobj[el]);
    let querystr = JSON.stringify(queryobj)
    querystr = querystr.replace(
      /\b(gte|gt|lt|lte)\b/g,
      match => `$${match}`)
    this.query.find(JSON.parse(querystr))
    return this
  }
  sorting(){
    if(this.queryString.sort){
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy)
    }else{
      this.query = this.query.sort('-name');
    }
    return this
  }
  paginating(){
    const page = this.queryString.page *1 || 1;
    const limit = this.queryString.limit * 1||5;
    const skip = (page-1) * limit;
    this.query = this.query.skip(skip).limit(limit)
    return this
    
  }
}

router.get('/products',async(req,res)=>{
  try {
    const features =new APIfeatures(Product.find(),req.query).filtering().sorting().paginating()
    const products = await features.query;
    res.status(200).json({
      'status':"200",
      'results':products.length,
      products
    })
  } catch (error) {
    
  }
})
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


module.exports = router;