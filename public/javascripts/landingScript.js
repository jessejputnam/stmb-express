"use strict";

const register_btn = document.querySelector("#register");
const browse_btn = document.querySelector("#browse");
const about_btn = document.querySelector("#about");

register_btn.addEventListener("click", () => {
  location.href = "/register";
});

browse_btn.addEventListener("click", () => {
  location.href = "/search/categories";
});

about_btn.addEventListener("click", () => {
  location.href = "/about";
});
