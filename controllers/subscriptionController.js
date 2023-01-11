const Subscription = require("../models/subscription");

// Handle load more subscriptions on GET
exports.fetch_subs_get = async (req, res, next) => {
  const user_id = req.params.id;
  const status = req.params.status;
  const limit = Number(req.params.limit);
  const page_num = Number(req.params.num);

  try {
    let subs;

    if (status === "active") {
      subs = await Subscription.find({
        user: user_id,
        status: { $ne: "canceled" }
      })
        .limit(limit)
        .skip((page_num - 1) * limit)
        .populate("membership")
        .populate("page")
        .exec();
    } else {
      subs = await Subscription.find({
        user: user_id,
        status: "canceled"
      })
        .limit(limit)
        .skip((page_num - 1) * limit)
        .populate("membership")
        .populate("page")
        .exec();
    }

    return res.send(subs);
  } catch (err) {
    return next(err);
  }
};

// Handle subscription success on GET
exports.subscription_success_get = async (req, res, next) => {
  const subId = req.params.id;

  try {
    const subscription = await Subscription.findById(subId)
      .populate("page")
      .exec();
    const creator = subscription.page.title;

    res.render("messages/success", {
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

    return res.render("pages/analytics", {
      title: "Analytics",
      subs,
      subs_by_membership
    });
  } catch (err) {
    return next(err);
  }
};
