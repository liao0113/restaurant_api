const Category = require("../models/category");

module.exports = {
  getCategories: async (req, res) => {
    const categories = await Category.findAll({ raw: true, nest: true });
    if (req.params.id) {
      const category = await Category.findbyPk(req.params.id);
      return res.redirect("/admin/categories", { categories, category });
    }
    return res.redirect("/admin/categories", { categories });
  },
  postCategory: async (req, res) => {
    if (!req.body.name) {
      req.flash("error_msg", "name did't exist!");
      return res.redirect("back");
    }
    await Category.create({
      name: req.body.name,
    });
    req.flash("success_msg", "category was successfully created!");
    res.redirect("/admin/categories");
  },
  updateCategory: async (req, res) => {
    if (!req.body.name) {
      req.flash("error_msg", "name did't exist!");
      return res.redirect("back");
    }
    const updateCategory = await Category.findbyPk(req.params.id);
    await updateCategory.update(req.body);
    req.flash("success_msg", "category was successfully updated!");
    res.redirect("/admin/categories");
  },
  deleteCategory: async (req, res) => {
    const deleteCategory = await Category.findbyPk(req.params.id);
    await deleteCategory.destory();
    req.flash("success_msg", "category was successfully deleted!");
    res.redirect("/admin/categories");
  },
};
