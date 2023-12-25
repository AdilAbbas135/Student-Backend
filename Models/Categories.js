const mongoose = require("mongoose");
const CategoriesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    Products: {
      type: Array,
    },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Categories", CategoriesSchema);
module.exports = CategoryModel;
