"use strict";

// Examples Section
const examples_btns = document.querySelectorAll(".example-nav-btn");
const example_a = document.querySelector("#ex-a");
const example_b = document.querySelector("#ex-b");
const example_c = document.querySelector("#ex-c");
const example_d = document.querySelector("#ex-d");

// ---------------- Example Creators Section -------------
examples_btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    examples_btns.forEach((button) =>
      button.classList.remove("example-nav-selected")
    );

    e.target.classList.add("example-nav-selected");

    if (e.target.id === "video") {
      example_a.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/Mega-64.png";
      example_b.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/01_video_02.png";
      example_c.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/01_video_03.png";
      example_d.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/Channel-5.png";
    }

    if (e.target.id === "podcast") {
      example_a.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/02_pod_01.png";
      example_b.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/02_pod_02.png";
      example_c.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/02_pod_05.png";
      example_d.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/02_pod_04.png";
    }

    if (e.target.id === "art") {
      example_a.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/03_vis_01.png";
      example_b.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/03_vis_02.png";
      example_c.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/03_vis_03.png";
      example_d.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/03_vis_05.jpg";
    }

    if (e.target.id === "music") {
      example_a.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/04_music_01.png";
      example_b.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/04_music_02.png";
      example_c.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/04_music_03.png";
      example_d.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/04_music_04.png";
    }

    if (e.target.id === "other") {
      example_a.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/05_other_01.png";
      example_b.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/05_other_02.png";
      example_c.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/05_other_03.png";
      example_d.childNodes[0].src =
        "https://live-patreon-marketing.pantheonsite.io/wp-content/uploads/2022/08/05_other_04.png";
    }
  });
});
