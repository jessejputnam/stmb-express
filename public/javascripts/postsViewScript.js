"use strict";

const list_btn = document.querySelector("#list-view");
const post_btn = document.querySelector("#post-view");
const posts_abbr = document.querySelector(".abbr-posts-container");
const posts_full = document.querySelector(".posts-container");

list_btn.addEventListener("click", () => {
  if (list_btn.classList.contains("toggle-view-selected")) return;

  list_btn.classList.add("toggle-view-selected");
  post_btn.classList.remove("toggle-view-selected");
  posts_abbr.classList.remove("hidden");
  posts_full.classList.add("hidden");
});

post_btn.addEventListener("click", () => {
  if (post_btn.classList.contains("toggle-view-selected")) return;

  post_btn.classList.add("toggle-view-selected");
  list_btn.classList.remove("toggle-view-selected");
  posts_full.classList.remove("hidden");
  posts_abbr.classList.add("hidden");
});
