"use strict";

const list_btn = document.querySelector("#list-view");
const post_btn = document.querySelector("#post-view");

const posts_abbr = document.querySelector(".abbr-posts-container");
const posts_full = document.querySelector(".posts-container");

const read_post_btns = document.querySelectorAll(".read-post-btn");

// Toggle View Buttons

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

// Read Post Buttons

read_post_btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const clicked = e.target;
    const post_container = clicked.parentElement.parentElement;
    const idx = post_container.children.length - 1;
    const post_text_container = post_container.children[idx];
    post_text_container.classList.remove("hidden");
    clicked.parentElement.classList.add("hidden");
    console.log(clicked.parentElement);
  });
});
