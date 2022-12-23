"use strict";

// Nav Button Selection

const nav_home = document.querySelector("#home");
const nav_browse = document.querySelector("#browse");
const nav_search = document.querySelector("#search");
const nav_settings = document.querySelector("#settings");

if (location.pathname === "/home")
  nav_home.classList.add("selected-sidebar-nav");

if (location.pathname === "/search/categories")
  nav_browse.classList.add("selected-sidebar-nav");

if (location.pathname === "/search")
  nav_search.classList.add("selected-sidebar-nav");

if (location.pathname === "/home/settings")
  nav_settings.classList.add("selected-sidebar-nav");

// HAMBURGER MENU
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
