"use strict";

const getSearchRegEx = (searchTerm) => {
  if (!searchTerm) return null;

  // Split search term into words
  const tokens = searchTerm
    .toLowerCase()
    .split()
    .filter((token) => token.trim() !== "");

  const tokensRegexInput = tokens
    .map((token) => {
      return `(?=.*\\b${token}\\b)`;
    })
    .join("");

  return new RegExp(tokensRegexInput, "gim");
};

/*
// This is a faster solution, but not sure how to implement yet
const getSearchRegEx = (searchTerm) => {
  if (!searchTerm) return [];

  // Split search term into words
  const tokens = searchTerm
    .toLowerCase()
    .split(" ")
    .filter((token) => token.trim() !== "");

  // Create array of single word RegExps
  const regs = tokens.map((token) => {
    return new RegExp("\\b" + token + "\\b", "gim");
  });

  return regs;
};
*/

module.exports = getSearchRegEx;
