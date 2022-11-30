"use strict";

const externalLinks = document.querySelectorAll(".external-link");

externalLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const allow = confirm("This link takes you to an external site");

    if (!allow) e.preventDefault();
  });
});

externalLinks.forEach(async (link) => {
  const linkUrl = link.href.split("://")[1];
  const linkDiv = link.parentElement.children[1];

  console.log(linkUrl);
  // return;

  const result = await fetch(`http://localhost:8080/open-graph/${linkUrl}`);

  const data = await result.json();

  linkDiv.children[0].textContent = data.name;
  linkDiv.children[1].src = data.img;
  linkDiv.children[2].textContent = data.description;
});
