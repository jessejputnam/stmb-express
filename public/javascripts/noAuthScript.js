"use strict";

const header = document.querySelector("header");
const modal = document.querySelector(".mobile-modal");
const hamburger = document.querySelector(".hamburger");
const top_bar = document.querySelector(".barTop");
const mid_bar = document.querySelector(".barMid");
const low_bar = document.querySelector(".barLow");

hamburger.addEventListener("click", () => {
  if (hamburger.classList.contains("modal-open")) {
    header.classList.remove("sticky");
    modal.classList.add("hidden");

    top_bar.classList.remove("barTop-open");
    mid_bar.classList.remove("barMid-open");
    low_bar.classList.remove("barLow-open");

    hamburger.classList.remove("modal-open");
  } else {
    header.classList.add("sticky");
    modal.classList.remove("hidden");

    top_bar.classList.add("barTop-open");
    mid_bar.classList.add("barMid-open");
    low_bar.classList.add("barLow-open");

    hamburger.classList.add("modal-open");
  }
});
