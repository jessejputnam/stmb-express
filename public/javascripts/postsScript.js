"use strict";

const externalLinks = document.querySelectorAll(".external-link");

// Warning about external link for user's caution
externalLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const allow = confirm("This link takes you to an external site");

    if (!allow) e.preventDefault();
  });
});

// Fetch open graph data
externalLinks.forEach(async (link) => {
  try {
    const linkUrl = link.href.split("://")[1].split("/")[0];
    const linkDiv = link.parentElement.children[1];

    const result = await fetch(`http://localhost:8080/open-graph/${linkUrl}`);

    const data = await result.json();

    linkDiv.children[0].textContent = data.name;
    linkDiv.children[1].src = data.img;
    linkDiv.children[2].textContent = data.description;
  } catch (err) {}
});
