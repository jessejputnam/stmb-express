"use strict";

const externalLinks = document.querySelectorAll(".external-link");
const read_post_btns = document.querySelectorAll(".read-post-btn");

// Unhide post text
read_post_btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const clicked = e.target;
    const post_container = clicked.parentElement.parentElement;
    const idx = post_container.children.length - 1;
    const post_text_container = post_container.children[idx];
    post_text_container.classList.remove("hidden");
    clicked.parentElement.classList.add("hidden");
  });
});

// Warning about external link for user's caution
externalLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const allow = confirm("This link takes you to an external site");

    if (!allow) e.preventDefault();
  });
});

// Fetch open graph data
externalLinks.forEach(async (link) => {
  const linkUrl = link.href.split("://")[1].split("/")[0];
  const linkDiv = link.parentElement.children[1];

  try {
    const result = await fetch(`http://localhost:8080/open-graph/${linkUrl}`);

    if (!result.ok) return;

    const data = await result.json();

    linkDiv.children[0].textContent = data.name;
    linkDiv.children[1].src = data.img;
    linkDiv.children[2].textContent = data.description;
  } catch (err) {
    console.error(err);
  }
});
