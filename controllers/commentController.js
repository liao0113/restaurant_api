const Comment = require("../models/comment");

module.exports = {
  postComment: async (req, res) => {
    await Comment.create({
      text: req.body.text,
      userId: req.user.id,
      restaurantId: req.body.restaurantId,
    });
    res.redirect(`/restaurants/${req.body.restaurantId}`);
  },
  deleteComment: async (req, res) => {
    const deletedComment = await Comment.findbyPk(req.params.id);
    await deletedComment.destroy();
    return res.redirect("back");
  },
};
