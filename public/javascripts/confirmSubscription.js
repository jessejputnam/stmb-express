"use strict";

import "https://js.stripe.com/v3/";

const form = document.querySelector("#subscribe-form");
const clientSecret = document.querySelector("#client-secret").value;
const stripePublishableKey = document.querySelector(
  "#stripe-publishable-key"
).value;
const creatorAcct = document.querySelector("#creator-acct").value;

const setMessage = (message) => {
  const messageDiv = document.querySelector("#messages");
  messageDiv.innerHTML += "<br>" + message;
};

const stripe = await Stripe(stripePublishableKey, {
  stripeAccount: creatorAcct
});

//? Customize

const elements = stripe.elements();
const cardElement = elements.create("card");
cardElement.mount("#card-element");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("name");

  // Create payment method and confirm payment intent
  stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: nameInput.value
        }
      }
    })
    .then((result) => {
      if (result.error) {
        setMessage(`Payment failed: ${result.error.message}`);
      } else {
        // Redirect customer to their account page
        setMessage("Success! Redirecting to your account.");
        window.location.href = "/home";
      }
    });
});
