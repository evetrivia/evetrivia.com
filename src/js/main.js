var categories;
function loadCategories () {
  var catTmpl = $("#categoryTemplate").innerHTML;
  ajax("http://erebus.evetrivia.com/", function (r) {
    categories = r.categories;
    for(var c in r.categories) {
      r.categories[c].index = c;
      console.log(r.categories[c].random_category_question);
      $("#categories").appendChild(createElement(catTmpl.format(r.categories[c])));
    }
    categoryURL = r.random_question;
  }, "json");
}

var categoryURL;
function setCategory (url) {
  categoryURL = url;
  ask();
}

var baseTemplate = $("#baseTemplate").innerHTML;
var imgTemplate = $("#imgTemplate").innerHTML;
var choiceTemplate = $("#choiceTemplate").innerHTML;

var highscore = 0;

function addHighscore (score) {
  highscore += score;
  if(highscore < 0)
    highscore = 0;
  $("#highscore").innerHTML = "Highscore : " + highscore;
}

function ask () {
  ajax(categoryURL + "?ts=" + (new Date().getTime()), function (r) {
    console.log(r);
    $("#container").innerHTML = "";
    $("#container").appendChild(createElement(baseTemplate.format({question: r.question})));
    if(r.images)
      $("#images").appendChild(createElement(imgTemplate.format(r.images)));
    for(var choice in r.choices) {
      var ch = createElement(choiceTemplate.format(r.choices[choice]));
      ch.addEventListener("click", function () {
        if(r.answer == this.getAttribute("value")) {
          addHighscore(1);
          this.style.backgroundColor = "green";
          setTimeout(function () { ask(); }, 400);
        } else {
          addHighscore(-1);
          this.style.backgroundColor = "red";
          this.style.opacity = "0";
        }
      });
      $("#choices").appendChild(ch);
    }
  }, "json");
}

loadCategories();
addHighscore(0);






























