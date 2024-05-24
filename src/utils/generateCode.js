function generateCode() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var length = 6;
    var randomString = "";
    for (var i = 0; i < length; i++) {
      var randomIndex = Math.floor(Math.random() * chars.length);
      randomString += chars[randomIndex];
    }
    return randomString;
  }
  module.exports = generateCode