"use strict";

const nav_home = document.querySelector("#home");
const nav_browse = document.querySelector("#browse");
const nav_search = document.querySelector("#search");
const nav_settings = document.querySelector("#settings");

if (location.pathname === "/home")
  nav_home.classList.add("selected-sidebar-nav");

if (location.pathname === "/search/categories")
  nav_browse.classList.add("selected-sidebar-nav");

if (location.pathname === "/search")
  nav_search.classList.add("selected-sidebar-nav");

if (location.pathname === "/home/settings")
  nav_settings.classList.add("selected-sidebar-nav");
