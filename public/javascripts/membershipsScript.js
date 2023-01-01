const remove_preview_btns = document.querySelectorAll(".remove-preview");

remove_preview_btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const clicked = e.target;
    const tier = clicked.parentElement.parentElement.parentElement;
    const idx = tier.children.length - 1;
    tier.children[idx].classList.remove("preview");
    clicked.classList.add("hidden");
  });
});
