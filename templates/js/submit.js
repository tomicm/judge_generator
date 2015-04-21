function submit() {

  var source = document.getElementById('source');

  var sourceFile = source.files[0];

  if(sourceFile != undefined) {
    if(sourceFile.type.match(/text.*/)) {
      var reader = new FileReader();
      reader.onload = function() {
        sendRequest(reader.result);
      }
      reader.readAsText(sourceFile);
      return;
    } else {
      document.getElementById('msg').innerHTML = 'Odaberite *.cpp datoteku.';
    }
  } else {
    document.getElementById('msg').innerHTML = 'Odaberite datoteku s rješenjem.';
    return;
  }
}

function sendRequest(src) {
  var url = window.location.href;
  var task = 'unknown';
  if(url.split('#')[1]) task = url.split('#')[1];

  var submission = {};

  submission.language = 'cpp';
  submission.source = src;

  submission.testSetId = '{{ settings.judge_username }}@' + task;

  var xmlhttp;
  if(window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else {
    xmlhtpp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.open("POST", "http://api.belowtle.com/evaluate", true);
  xmlhttp.onreadystatechange = function() {
    if(xmlhttp.readyState == 4) {
      if(xmlhttp.status == 200) {
        console.log(xmlhttp.responseText);
        var response = JSON.parse(xmlhttp.responseText);
        window.location = 'status.html#' + response.evaluationId;
      }
      if(xmlhttp.status == 404) {
        console.log('erol 404');
      }
    }
  }
  xmlhttp.send(JSON.stringify(submission));
}
