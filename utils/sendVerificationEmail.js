"use strict";

const sendEmail = require("./sendEmail");

async function sendVerificationEmail(user, req, res, next) {
  try {
    const token = user.generateVerificationToken();

    // Save the verification token
    await token.save();

    const subject = "Account Verification Token";
    const to = user.username;
    const from = process.env.FROM_EMAIL;
    const link =
      "http://" + req.headers.host + "/api/auth/verify/" + token.token;
    let html = `
      <p>Hi ${user.firstname}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p><br>
      <p>If you did not request this, please ignore this email.</p>`;

    await sendEmail({ to, from, subject, html });

    res.render("success-message", {
      message: "A verification email has been sent to " + user.username + "."
    });
  } catch (err) {
    if (err) return next(err);
  }
}

module.exports = sendVerificationEmail;
