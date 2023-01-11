"use strict";

const add_link_btn = document.getElementById("add-link");
const remove_link_btn = document.getElementById("removeLink");
const add_link_container = document.querySelector(".add-link-container");

const external_link_input = document.getElementById("externalLink");

if (add_link_btn) {
  add_link_btn.addEventListener("click", (e) => {
    add_link_btn.classList.add("hidden");
    add_link_container.classList.remove("hidden");
  });

  remove_link_btn.addEventListener("click", (e) => {
    external_link_input.value = "";
    add_link_btn.classList.remove("hidden");
    add_link_container.classList.add("hidden");
  });
}
