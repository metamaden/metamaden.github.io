
/* 
scripts for news.html
*/

let slideIndex = 0;
let slides = document.getElementsByClassName("slides");
let playing = true;
let timer;

function showSlides() {
    if(playing) {timer = setTimeout(showSlides, 4500);}
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    slides[slideIndex-1].style.display = "block";  
}

function playPauseSlides() {
    if (playing) {
        clearTimeout(timer);
        document.getElementById("playPause").innerHTML = "►"; // Play symbol
    } else {
        showSlides();
        timer = setTimeout(showSlides, 4500); // Change image every 2 seconds
        document.getElementById("playPause").innerHTML = "❚❚"; // Pause symbol
    }
    playing = !playing;
}

document.getElementById("playPause").addEventListener("click", playPauseSlides);

document.getElementById("prev").addEventListener("click", function() {
    slideIndex -= 2;
    if (slideIndex < 0) {slideIndex = slides.length - 2;}
    showSlides();
});

document.getElementById("next").addEventListener("click", function() {
    showSlides();
});

showSlides();
