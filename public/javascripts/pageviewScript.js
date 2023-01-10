"use strict";
const posts_container = document.querySelector(".posts-wrapper");

const load_more_btn = document.querySelector("#load-more");
const page_num_input = document.querySelector("#page");
const page_limit_input = document.querySelector("#limit");
const page_id = document.querySelector("#pageId").value;
const total_pages = Number(document.querySelector("#totalPages").value);
const loader = document.querySelector(".loader");

// Fetch more pages of posts
load_more_btn.addEventListener("click", async () => {
  // Get current page number and the query limit
  let page_num = Number(page_num_input.value);
  const page_limit = page_limit_input.value;

  // Iterate the page forward from current for query
  page_num++;

  // Hide button with loading indicator
  load_more_btn.classList.add("hidden");
  loader.classList.remove("hidden");

  // Fetch next page of results
  const response = await fetch(`/posts/${page_id}/${page_limit}/${page_num}`);
  const data = await response.json();

  // Unhide read more button
  load_more_btn.classList.remove("hidden");
  loader.classList.add("hidden");

  // Update HTML input with current page value
  page_num_input.value = page_num;

  // Build and attach posts to page
  data.forEach(async (post) => {
    const full_post = makePost(post);
    posts_container.append(full_post);

    // Add ogg fetch to Link post
    if (post.type === "link") {
      const linkUrl = full_post.children[1].children[0].children[0].href
        .split("://")[1]
        .split("/")[0];
      const linkDiv = full_post.children[1].children[0].children[1];

      try {
        const result = await fetch(
          `http://localhost:8080/open-graph/${linkUrl}`
        );

        if (!result.ok) return;

        const data = await result.json();

        linkDiv.children[0].textContent = data.name;
        linkDiv.children[1].src = data.img;
        linkDiv.children[2].textContent = data.description;
      } catch (err) {
        console.error(err);
      }
    }
  });

  // Disable load more if no more to load
  if (page_num >= total_pages) {
    load_more_btn.classList.add("hidden");
    load_more_btn.disabled = true;
  }
});

// ############## HELPER FUNCTONS ####################

/**
 *
 * @param {string} el // HTML element
 * @param {string[]} classes // Array of class names to add
 * @param {string} content // Text content
 */
function addElement(el, classes = null, content = null) {
  const newEl = document.createElement(el);

  if (classes) {
    classes.forEach((el_class) => newEl.classList.add(el_class));
  }

  if (content) newEl.textContent = content;

  return newEl;
}

// Make Abbr Post
function makeAbbrPost(post) {
  const anchor = addElement("a");
  anchor.href = `posts/${post._id}`;

  const date = new Date(Date.parse(post.timestamp));

  const post_wrapper = addElement("div", ["abbr-post-wrapper"]);
  const post_title = addElement("div", ["post-title"]);
  const readableDate =
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }) +
    " at " +
    date.toLocaleTimeString();
  const timestamp = addElement("p", ["timestamp"], readableDate);
  const title = addElement("h3", null, post.title);
  const post_content = addElement("div", ["abbr-post-content"]);
  const post_type = addElement(
    "em",
    null,
    post.type[0].toUpperCase() + post.type.slice(1) + " Post"
  );
  const post_text = addElement("p", null, post.text.slice(0, 50) + "...");

  post_title.append(timestamp);
  post_title.append(title);

  post_content.append(post_type);
  post_content.append(post_text);

  post_wrapper.append(post_title);
  post_wrapper.append(post_content);

  anchor.append(post_wrapper);

  return anchor;
}

function makePost(post) {
  // Make elements
  const post_container = addElement("div", ["post-container"]);
  post_container.style = "padding-top:40px";

  const anchor = addElement("a", ["edit-post-btn"]);
  anchor.style = "margin:0 auto";
  anchor.href = `posts/${post._id}`;
  const button = addElement("button", ["btn", "btn-secondary"], "Edit Post");

  const post_title_container = addElement("div", ["post-title"]);
  const date = new Date(Date.parse(post.timestamp));
  const readableDate =
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }) +
    " at " +
    date.toLocaleTimeString();
  const timestamp = addElement("p", ["timestamp"], readableDate);
  const post_title = addElement("h3", null, post.title);

  const read_post_container = addElement("div", ["read-post"]);
  const read_post_btn = addElement("p", ["read-post-btn"], "Read Post");
  read_post_btn.addEventListener("click", (e) => {
    const clicked = e.target;
    const post_container = clicked.parentElement.parentElement;
    const idx = post_container.children.length - 1;
    const post_text_container = post_container.children[idx];
    post_text_container.classList.remove("hidden");
    clicked.parentElement.classList.add("hidden");
  });

  const post_text_container = addElement("div", ["post-text", "hidden"]);
  const post_text = addElement("p", null, post.text);

  const post_media_container = addElement("div", ["post-media"]);

  let post_media;
  // Text Post
  if (post.type === "text") post_media_container.classList.add("hidden");
  // Link Post
  if (post.type === "link") {
    const link_div = addElement("div");
    const link_anchor = addElement("a", ["external-link"], post.typeContent);
    link_anchor.target = "_blank";
    link_anchor.rel = "noreferrer nofollow";
    link_anchor.href = post.typeContent;

    // Add warning for external link
    link_anchor.addEventListener("click", (e) => {
      const allow = confirm("This link takes you to an external site");

      if (!allow) e.preventDefault();
    });

    const ogg_container = addElement("div", ["link-ogg-container"]);
    const og_title = addElement("p", ["og-title"], "Loading...");
    const og_img = addElement("img", ["og-img"]);
    og_img.src = "/images/post-placeholder.png";
    og_img.alt = "External link image";
    const og_desc = addElement("p", ["og-desc"], "Loading...");

    ogg_container.append(og_title);
    ogg_container.append(og_img);
    ogg_container.append(og_desc);

    link_div.append(link_anchor);
    link_div.append(ogg_container);

    post_media = link_div;
  }
  if (post.type === "image") {
    const image = addElement("img");
    image.src = post.typeContent;
    image.alt = "Post image";
    post_media = image;
  }
  if (post.type === "video") {
    const video = addElement("iframe");
    video.src = post.typeContent;
    video.title = "Video player";
    video.frameborder = "0";
    video.allow =
      "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
    video.allowfullscreen = true;

    post_media = video;
  }

  // Append elements
  anchor.append(button);

  post_media_container.append(post_media);

  post_title_container.append(timestamp);
  post_title_container.append(post_title);

  read_post_container.append(read_post_btn);

  post_text_container.append(post_text);

  post_container.append(anchor);
  post_container.append(post_media_container);
  post_container.append(post_title_container);
  post_container.append(read_post_container);
  post_container.append(post_text_container);

  return post_container;
}
