const remove_preview_btns = document.querySelectorAll(".remove-preview");

remove_preview_btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const clicked = e.target;
    const tier = clicked.closest(".tier-wrapper");

    tier.classList.remove("preview");
    clicked.classList.add("hidden");
  });
});
