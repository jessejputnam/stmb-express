"use strict";

const active_btn = document.querySelector("#active-view");
const inactive_btn = document.querySelector("#inactive-view");

const active_subs = document.querySelector("#active-subs");
const inactive_subs = document.querySelector("#inactive-subs");

// Toggle View Buttons

active_btn.addEventListener("click", () => {
  if (active_btn.classList.contains("toggle-view-selected")) return;

  active_btn.classList.add("toggle-view-selected");
  inactive_btn.classList.remove("toggle-view-selected");
  active_subs.classList.remove("hidden");
  inactive_subs.classList.add("hidden");
});

inactive_btn.addEventListener("click", () => {
  if (inactive_btn.classList.contains("toggle-view-selected")) return;

  inactive_btn.classList.add("toggle-view-selected");
  active_btn.classList.remove("toggle-view-selected");
  inactive_subs.classList.remove("hidden");
  active_subs.classList.add("hidden");
});

// Fetch more pages of subs
