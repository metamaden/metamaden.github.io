// script.js

document.querySelector('.scrollbox').addEventListener('scroll', function() { console.log('Scrolling...'); });

function openPage(pageName) {
    closeNav();
    const tabContents = document.getElementsByClassName('tab-content');
    for (const content of tabContents) {
        content.style.display = 'none';
    }

    document.getElementById(pageName).style.display = 'block';
}

// Set the default tab (e.g., 'home')
openPage('home');

function openNav() {
            document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0px";
}


