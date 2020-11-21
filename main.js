var width, height, width1, height1;
var lungime = document.querySelector("html");
var gridParinte = document.querySelector(".patrat-grid");
let gridCopil = document.querySelector(".patrat");
window.onresize = window.onload = function () {
  width = this.innerWidth;
  width1 = width;
  height = this.innerHeight;
  height1 = height;
  console.log("asta e widht " + width);
  console.log("asta e height " + height);
  console.log(" ");
  while (width != height) {
    if (width > height) width = width - height;
    else height = height - width;
  }
  lungime.style.fontSize = width + "px";

  for (var i = 0; i <= height1; i += width) {
    var clone = gridCopil.cloneNode(true);
    console.log(clone);
    gridParinte.appendChild(clone);
  }
};
