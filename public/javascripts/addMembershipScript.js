"use strict";

const btn_add_reward = document.querySelector("#add-reward");
const rewards_container = document.querySelector("#add-rewards-container");
const num_rewards = document.querySelector("#numRewards");

function getNewInput() {
  // Create new div element
  const div = document.createElement("div");
  div.classList.add("form-control");
  div.style = "margin-top:5px";

  // Create new input element
  const input = document.createElement("input");
  input.id = `reward-${num_rewards.value}`;
  input.name = `reward-${num_rewards.value}`;
  input.type = "text";

  div.appendChild(input);
  return div;
}

btn_add_reward.addEventListener("click", () => {
  // Create element
  const input = getNewInput();
  // Iterate number of rewards forward
  num_rewards.value++;
  // Append to rewards container
  rewards_container.appendChild(input);
});
