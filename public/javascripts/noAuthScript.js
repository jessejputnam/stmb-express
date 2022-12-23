"use strict";

const header = document.querySelector("header");
const modal = document.querySelector(".mobile-modal");
const hamburger = document.querySelector(".hamburger");
const top_bar = document.querySelector(".barTop");
const mid_bar = document.querySelector(".barMid");
const low_bar = document.querySelector(".barLow");

hamburger.addEventListener("click", () => {
  if (modal.classList.contains("modal-open")) {
    window.scrollTo(0, 0);
    header.classList.remove("sticky");
    modal.classList.remove("modal-open");

    top_bar.classList.remove("barTop-open");
    mid_bar.classList.remove("barMid-open");
    low_bar.classList.remove("barLow-open");
  } else {
    header.classList.add("sticky");
    modal.classList.add("modal-open");

    top_bar.classList.add("barTop-open");
    mid_bar.classList.add("barMid-open");
    low_bar.classList.add("barLow-open");
  }
});
