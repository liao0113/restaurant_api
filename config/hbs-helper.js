const moment = require("moment");

module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      //條件成立時，顯示內文字
      return options.fn(this);
    }
    //條件不成立時，不顯示內文字
    return options.inverse(this);
  },
  moment: function (a) {
    return moment(a).fromNow();
  },
  count: function (a) {
    return a.length;
  },
};
