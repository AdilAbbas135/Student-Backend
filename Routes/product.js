const fs = require("fs");
const express = require("express");
const router = express.Router();
const ProductModel = require("../Models/Product");
const { verify_token_and_admin } = require("./verify_user");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    const name = new Date().getTime() + "-" + file.originalname;
    cb(null, name);
  },
});
const upload = multer({ storage: storage });

// GET all Products at localhost:5000/api/products/
router.get("/", async (req, res) => {
  const qnew = req.query.new;
  const qcategory = req.query.category;
  try {
    if (qnew) {
      const products = await ProductModel.find().sort({ createdAt: -1 });
      res.status(200).json(products);
    } else if (qcategory) {
      const products = await ProductModel.find({
        category: {
          $in: [qcategory],
        },
      });
      res.status(200).json(products);
    } else {
      const products = await ProductModel.find().sort({ createdAt: -1 });
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

// GET a single Product at localhost:5000/api/products/id
router.get("/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Product Not Found!" });
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

// Create Product at localhost:5000/api/products/addproduct
router.post("/addproduct", upload.single("file"), async (req, res) => {
  //console.log(req.file);
  var filename = "";
  if (req.file) {
    filename = filename.concat("http://localhost:5000/" + req.file.path);
  }
  const newProduct = await ProductModel.create({
    title: req.body.title,
    desc: req.body?.desc,
    category: req.body?.category,
    size: req.body?.size,
    color: req.body?.color,
    price: req.body.price,
    img: filename,
  });
  res.status(200).json({ status: "sucess", newProduct });
});

// Updating Product at localhost:5000/api/products/updateproduct/id
router.put("/updateproduct/:id", verify_token_and_admin, async (req, res) => {
  try {
    const updatedproduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({ success: true, updatedproduct });
  } catch (error) {
    res.status(404).json({ error });
  }
});

// Delete Product at localhost:5000/api/products/deleteproduct/id and middle wear i will have to put verify_token_and_admin,
//verify_token_and_admin,
//bad mn yeh lagaani hai
router.delete("/deleteproduct/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (product.img.includes("http://localhost:5000/")) {
      const path = product.img.split("http://localhost:5000/");
      fs.unlinkSync(path[1]);
    }
    await ProductModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      msg: "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(404).json({ error });
  }
});

module.exports = router;
