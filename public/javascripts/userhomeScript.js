"use strict";

const active_btn = document.querySelector("#active-view");
const inactive_btn = document.querySelector("#inactive-view");

const active_subs = document.querySelector("#active-subs");
const inactive_subs = document.querySelector("#inactive-subs");
const active_subs_container = document.querySelector("#active-subs-container");
const inactive_subs_container = document.querySelector(
  "#inactive-subs-container"
);

// Active Subs
const load_more_active_btn = document.querySelector("#load-more-active");
const page_num_active_input = document.querySelector("#page-active");
const total_pages_active = Number(
  document.querySelector("#total-pages-active").value
);

// Inactive Subs
const load_more_inactive_btn = document.querySelector("#load-more-inactive");
const page_num_inactive_input = document.querySelector("#page-inactive");
const total_pages_inactive = Number(
  document.querySelector("#total-pages-inactive").value
);

// All subs
const page_limit_input = document.querySelector("#limit");
const user_id = document.querySelector("#userId").value;
const loaders = document.querySelectorAll(".loader");

// Toggle View Buttons
active_btn.addEventListener("click", () => {
  if (active_btn.classList.contains("toggle-view-selected")) return;

  active_btn.classList.add("toggle-view-selected");
  inactive_btn.classList.remove("toggle-view-selected");
  active_subs.classList.remove("hidden");
  inactive_subs.classList.add("hidden");
});

inactive_btn.addEventListener("click", () => {
  if (inactive_btn.classList.contains("toggle-view-selected")) return;

  inactive_btn.classList.add("toggle-view-selected");
  active_btn.classList.remove("toggle-view-selected");
  inactive_subs.classList.remove("hidden");
  active_subs.classList.add("hidden");
});

// Fetch more pages of active subs
load_more_active_btn.addEventListener("click", async () => {
  // Get current page number and the query limit
  let page_num_active = Number(page_num_active_input.value);
  const page_limit = page_limit_input.value;

  // Iterate the page forward from current for query
  page_num_active++;

  // Hide button with loading indicator
  load_more_active_btn.classList.add("hidden");
  loaders[0].classList.remove("hidden");

  try {
    // Fetch next page of results
    const response = await fetch(
      `/subscription/${user_id}/active/${page_limit}/${page_num_active}`
    );
    const data = await response.json();

    // Unhide read more button
    load_more_active_btn.classList.remove("hidden");
    loaders[0].classList.add("hidden");

    // Update HTML input with current page value
    page_num_active_input.value = page_num_active;

    // Build and attach subs to container
    data.forEach((sub) => {
      const subEl = makeActiveSubEl(sub);
      active_subs_container.append(subEl);
    });

    // Disable load more if no more to load
    if (page_num_active >= total_pages_active) {
      load_more_active_btn.classList.add("hidden");
      load_more_active_btn.disabled = true;
    }
    return;
  } catch (err) {
    const err_msg = addElement("p", ["warning"], "Error loading data");
    err_msg.style = "margin:0 auto";

    active_subs.append(err_msg);
    loaders[0].classList.add("hidden");

    console.error(err);
    return;
  }
});

// Fetch more pages of active subs
load_more_inactive_btn.addEventListener("click", async () => {
  // Get current page number and the query limit
  let page_num_inactive = Number(page_num_inactive_input.value);
  const page_limit = page_limit_input.value;

  // Iterate the page forward from current for query
  page_num_inactive++;

  // Hide button with loading indicator
  load_more_inactive_btn.classList.add("hidden");
  loaders[1].classList.remove("hidden");

  try {
    // Fetch next page of results
    const response = await fetch(
      `/subscription/${user_id}/inactive/${page_limit}/${page_num_inactive}`
    );
    const data = await response.json();
    console.log(data);

    // Unhide read more button
    load_more_inactive_btn.classList.remove("hidden");
    loaders[1].classList.add("hidden");

    // Update HTML input with current page value
    page_num_inactive_input.value = page_num_inactive;

    // Build and attach subs to container
    data.forEach((sub) => {
      const subEl = makeInactiveSubEl(sub);
      inactive_subs_container.append(subEl);
    });

    // Disable load more if no more to load
    if (page_num_inactive >= total_pages_inactive) {
      load_more_inactive_btn.classList.add("hidden");
      load_more_inactive_btn.disabled = true;
    }

    return;
  } catch (err) {
    const err_msg = addElement("p", ["warning"], "Error loading data");
    err_msg.style = "margin:0 auto";

    active_subs.append(err_msg);
    loaders[1].classList.add("hidden");

    console.error(err);
    return;
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

// Make Subscription element
function makeActiveSubEl(sub) {
  const sub_wrapper = addElement("div", ["subscription-wrapper"]);
  const p = addElement("p");
  const page_anchor = addElement("a", null, sub.page.title);
  page_anchor.href = `/${sub.page._id}`;
  page_anchor.style = "color:#1059ff";
  const sub_status = addElement(
    "span",
    sub.status === "active" ? ["active"] : ["warning"],
    ` (${sub.status})`
  );
  const sub_info_container = addElement("div", ["subscription-info"]);
  const membership_title = addElement(
    "em",
    null,
    sub.membership
      ? `Membership: ${sub.membership.title}`
      : "Membership Tier Deleted"
  );
  membership_title.style = "font-size:.9rem";
  const btn_container = addElement("div");
  const cancel_anchor = addElement("a");
  cancel_anchor.href = `/subscription/${sub._id}/cancel`;
  const cancel_btn = addElement(
    "button",
    ["btn", "btn-secondary", "btn-sub"],
    "Cancel"
  );

  page_anchor.append(sub_status);
  p.append(page_anchor);

  cancel_anchor.append(cancel_btn);
  btn_container.append(cancel_anchor);

  sub_info_container.append(membership_title);
  sub_info_container.append(btn_container);

  sub_wrapper.append(p);
  sub_wrapper.append(sub_info_container);

  return sub_wrapper;
}

// Make Subscription element
function makeInactiveSubEl(sub) {
  const sub_wrapper = addElement("div", ["subscription-wrapper"]);
  const p = addElement("p");
  const page_anchor = addElement("a", null, sub.page.title);
  page_anchor.href = `/${sub.page._id}`;
  page_anchor.style = "color:#1059ff";
  const sub_status = addElement(
    "span",
    sub.status === "active" ? ["active"] : ["warning"],
    `(${sub.status})`
  );
  const sub_info_container = addElement("div", ["subscription-info"]);
  const membership_title = addElement(
    "em",
    null,
    sub.membership
      ? `Membership: ${sub.membership.title}`
      : "Membership Tier Deleted"
  );
  membership_title.style = "font-size:.9rem";
  const btn_container = addElement("div");
  const form = addElement("form");
  form.method = "POST";
  form.action = `/subscription/${sub._id}/delete`;
  const del_btn = addElement("button", ["btn", "btn-secondary", "btn-sub"]);
  del_btn.type = "submit";
  const btn_text = document.createTextNode("Delete Inactive");
  del_btn.append(btn_text);

  page_anchor.append(sub_status);
  p.append(page_anchor);

  sub_info_container.append(membership_title);

  form.append(del_btn);
  btn_container.append(form);

  sub_wrapper.append(p);
  sub_wrapper.append(btn_container);

  if (!sub.membership) {
    const warning = addElement(
      "p",
      null,
      "Attn: Creator deleted membership tier"
    );
    warning.style = "color:red;font-size:.7rem;margin-top:-10px";

    sub_wrapper.append(warning);
  }

  return sub_wrapper;
}
