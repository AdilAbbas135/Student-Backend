const express = require("express");
const CategoryModel = require("../Models/Categories");
const router = express.Router();

//adding of category at localhost:5000/api/categories/addcategory
router.post("/addcategory", async (req, res) => {
  try {
    const category = await CategoryModel.create({
      title: req.body.title,
    });
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(404).json(error);
  }
});
//adding of category at localhost:5000/api/categories/allcategories
// router.get("/allcategories", async (req, res) => {
//   try {
//     const categories = await CategoryModel.find();
//     res.status(200).json({ success: true, categories });
//   } catch (error) {
//     res
//       .status(404)
//       .json({ success: false, msg: "Error in fetchig the categories" });
//   }
// });

module.exports = router;
