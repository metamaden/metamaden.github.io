// script.js

function openPage(pageName) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (const content of tabContents) {
        content.style.display = 'none';
    }

    document.getElementById(pageName).style.display = 'block';
}

// Set the default tab (e.g., 'home')
openPage('home');
