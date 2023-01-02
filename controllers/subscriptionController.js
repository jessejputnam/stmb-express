const Subscription = require("../models/subscription");

// Handle subscription succes on GET
exports.subscription_success_get = async (req, res, next) => {
  const subId = req.params.id;
  try {
    const subscription = await Subscription.findById(subId)
      .populate("page")
      .exec();
    const creator = subscription.page.title;

    res.render("success-message", {
      title: "Successfully subscribed!",
      message: `You have successfully subscribed to ${creator}. It may take a few minutes for your subscription to appear active.`
    });
  } catch (err) {
    return next(err);
  }
};
