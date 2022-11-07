"use strict";

import Stripe from "https://js.stripe.com/v3/";

const stripe_pk =
  "pk_test_51LTPNTGgdtm8Y5852d1LaKyqymUGq4Dqh1jzEJ8MqNqiKW2TjkTJ5lYNwki9Nj5Xz33UMzFVpRja8bEyRgYl3bi600XSmCJj8S";

const setMessage = (message) => {
  const messageDiv = document.querySelector("messages");
  messageDiv.innerHTML += "<br>" + message;
};

const stripe = await Stripe(stripe_pk);
const elements = stripe.elements();
const cardElement = elements.create("card");
cardElement.mount("#card-element");

// Fetch public key and initialize Stripe
