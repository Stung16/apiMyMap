"use strict";
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendMail = async (to, subject, message) => {
  const info = await transporter.sendMail({
    from: '"Duy Tung" <kieuduytung3@gmail.com>', // sender address
    to,
    subject, // Subject line
    html: `<div>Mật khẩu mới của bạn: ${message}</div>
      <i>Lưu ý không chia sẻ mật khẩu để tránh các rủi ro!!!!</i>
    `, // html body
  });
  return info;
};
module.exports = sendMail;
