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

// Handle subscription delete on POST
exports.subscription_delete_post = async (req, res, next) => {
  const subId = req.params.id;

  try {
    await Subscription.findByIdAndRemove(subId);

    res.redirect("/home");
  } catch (err) {
    return next(err);
  }
};

// Handle display analytics on GET
exports.analytics_get = async (req, res, next) => {
  const page = req.user.creator.page;

  try {
    const subs = await Subscription.find({ page: page })
      .populate("user")
      .populate("membership")
      .exec();

    const subs_by_membership = {};
    subs.forEach((sub) => {
      const title = sub.membership
        ? sub.membership.title
        : "Deleted Membership";

      if (!(title in subs_by_membership)) {
        subs_by_membership[title] = [];
      }

      subs_by_membership[title].push(sub);
    });

    return res.render("analytics", {
      title: "Analytics",
      subs,
      subs_by_membership
    });
  } catch (err) {
    return next(err);
  }
};
