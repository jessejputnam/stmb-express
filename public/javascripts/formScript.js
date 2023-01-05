"use strict";

const action_btn = document.querySelector("#action-btn");
const action_btn_container = document.querySelector(".form-control-btns");
const loader = document.querySelector(".loader");

action_btn.addEventListener("click", () => {
  action_btn_container.classList.add("hidden");
  loader.classList.remove("hidden");
});
