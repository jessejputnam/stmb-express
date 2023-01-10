"use strict";

const action_btn = document.querySelector("#action-btn");
const action_btn_container = document.querySelector(".form-control-btns");
const loader = document.querySelector(".loader");
const forms = document.querySelectorAll("form");

forms.forEach((form) => {
  form.addEventListener("submit", () => {
    action_btn_container.classList.add("hidden");
    loader.classList.remove("hidden");
  });
});
