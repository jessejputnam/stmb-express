"use strict";

const remove_preview_btns = document.querySelectorAll(".remove-preview");
const read_post_btns = document.querySelectorAll(".read-post-btn");

remove_preview_btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const clicked = e.target;
    const tier = clicked.parentElement.parentElement.parentElement;
    const idx = tier.children.length - 1;
    tier.children[idx].classList.remove("preview");
    clicked.classList.add("hidden");
  });
});

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
