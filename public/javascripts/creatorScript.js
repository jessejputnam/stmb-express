"use strict";

const nav_view = document.querySelector(".view-page");
const nav_edit = document.querySelector("#edit-page");
const nav_posts = document.querySelector("#posts");
const nav_memberships = document.querySelector("#memberships");
const nav_analytics = document.querySelector("#analytics");

if (location.pathname === "/" + nav_view.id)
  nav_view.classList.add("selected-sidebar-nav");

if (location.pathname === "/account/edit")
  nav_edit.classList.add("selected-sidebar-nav");

if (location.pathname === "/account/posts")
  nav_posts.classList.add("selected-sidebar-nav");

if (location.pathname === "/account/memberships")
  nav_memberships.classList.add("selected-sidebar-nav");

if (location.pathname === "/account/analytics")
  nav_analytics.classList.add("selected-sidebar-nav");
