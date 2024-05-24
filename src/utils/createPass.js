const crypto = require("crypto");

function generateRandomPassword() {
  // Tạo ra một mật khẩu ngẫu nhiên bằng cách sử dụng randomBytes và chuyển đổi sang định dạng base64
  return crypto.randomBytes(8).toString("base64").slice(0, 8);
}
module.exports = generateRandomPassword;
