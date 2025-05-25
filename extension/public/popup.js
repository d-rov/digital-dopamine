addEventListener("DOMContentLoaded", () => {
  console.log("This is an extension popup!");
  let button = document.getElementById("myButton");

  button.onclick = () => {
    console.log("Clicked!");
  };
});
