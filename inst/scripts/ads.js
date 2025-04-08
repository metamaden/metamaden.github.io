var textArray = [
  'Ad: <a href = "https://www.ohsu.edu">Oregon Health & Science University | Healing Begins With Discovery</a>',
  'Ad: <a href = "https://www.jhu.edu/">Johns Hopkins University | Research Saves Lives</a>',
  'Ad: <a href = "https://www.fredhutch.org/en.html?gad_source=1">Fred Hutch Cancer Center | Science Meets Care</a>',
  'Ad: <a href = "https://www.libd.org/">Lieber Institute for Brain Development | Unlocking Mysteries of the Brain</a>',
  'Ad: <a href = "https://www.washington.edu/">University of Washington | Be Boundless</a>',
  'Ad: <a href = "https://www.ohsu.edu/knight-cancer-institute">Knight Cancer Research Institute | Driven to Cure Cancer. Devoted to caring for you.</a>',
  'Ad: <a href = "https://xkcd.com/">XKCD | A Webcomic of romance, sarcasm, math, and language</a>',
  'Ad: <a href = "https://theoatmeal.com/">The Oatmeal | Comics by Matthew Inman</a>'
];
var randomNumber = Math.floor(Math.random() * textArray.length);
document.getElementById("randomAd").innerHTML = textArray[randomNumber];

