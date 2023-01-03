"use strict";

import "https://js.stripe.com/v3/";

const form = document.querySelector("#subscribe-form");
const sub_id = document.querySelector("#app-sub-id").value;
const sub_btn = document.querySelector("#sub-btn");
const cancel_btn = document.querySelector("#cancel-btn");
const loader = document.querySelector(".loader");

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

const elements = stripe.elements();
const cardElement = elements.create("card", {
  style: {
    base: {
      iconColor: "#02c7ff",
      color: "black",
      fontWeight: "500",
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": {
        color: "#fce883"
      },
      "::placeholder": {
        color: "#87BBFD"
      },
      invalid: {
        iconColor: "#FFC7EE",
        color: "#FFC7EE"
      }
    }
  }
});
cardElement.mount("#card-element");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("name");

  // Hide other options
  sub_btn.classList.add("hidden");
  cancel_btn.classList.add("hidden");
  loader.classList.remove("hidden");

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

        // Reshow options on failure
        sub_btn.classList.remove("hidden");
        cancel_btn.classList.remove("hidden");
        loader.classList.add("hidden");
      } else {
        // Redirect customer to their account page
        setMessage("Payment accepted. Redirecting to confirmation...");
        window.location.href = `/subscription/${sub_id}/success`;
      }
    });
});
