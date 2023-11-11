console.log('And this is where the Javascript goes')

let slideIndex = 0;
showSlides();

var modal = document.getElementById("sign-in-modal");

var btn = document.getElementById("portal-button");

var closeBtn = document.getElementsByClassName("close")[0];

btn.onclick = function () {
  modal.style.display = "block";
}

closeBtn.onclick = function () {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function showSlides() {
  let slides = document.getElementsByClassName("slide-image");

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }

  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 5000);
}