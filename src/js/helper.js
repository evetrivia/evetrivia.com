function $ (id, el) {
  var c = el ? el : document;
  if(document.querySelector && document.querySelectorAll) {
    if(id.substr(0,1) == "#" && id.split(" ").length == 1) {
      return document.querySelector(id);
    } else {
      return document.querySelectorAll(id);
    }
  } else {
    switch(id.substr(0,1)) {
      case "#":
        return c.getElementById(id.slice(1));
      case ".":
        return c.getElementsByClassName(id.slice(1));
      default:
        return c.getElementsByTagName(id);
    }
  }
}

function ajax (url, callback, format, options) {
  var timeout;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      clearTimeout(timeout);
      switch(format) {
        case "json":
          callback(JSON.parse(xmlhttp.responseText));
          break;
        default:
          callback(xmlhttp.responseText);
          break;
      }
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  timeout = setTimeout(function () {
    xmlhttp.abort();
    console.log("Request Timed out");
    if(options && options.retry === true)
    ajax(url, callback, format, options);
  }, options && options.timeout ? options.timeout : 30000);
  return xmlhttp;
}

String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{([a-zA-Z_\d]+)}/g, function(match, varname) {
    return typeof args[0] != 'undefined' && args[0][varname] != "undefined" ? args[0][varname] : "";
  });
};

function createElement (elStr) {
  var tmpEl = document.createElement("div");
  tmpEl.innerHTML = elStr;
  for(var i = 0; i < tmpEl.children.length; i++)
    if(tmpEl.children[0].nodeType == 1)
      return tmpEl.children[i];
}