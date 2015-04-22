window.onload = function() {
  var url = window.location.href;
  var task = 'unknown';
  if(url.split('#')[1]) task = url.split('#')[1];
  var info = get_task_info(task);
  if(info == undefined) 
    console.log('erol 404');
  else {
    document.getElementById('contest').innerHTML = info['contest_name'];
    document.getElementById('round').innerHTML = info['round_name'];
    document.getElementById('task').innerHTML = info['task_name'];
  }
}

function submit() {

  var source = document.getElementById('source');

  var sourceFile = source.files[0];

  if(sourceFile != undefined) {
    if(sourceFile.size <= {{ settings.source_limit }}) {
      var reader = new FileReader();
      reader.onload = function() {
        sendRequest(reader.result);
      }
      reader.readAsText(sourceFile);
      return;
    } else {
      document.getElementById('msg').innerHTML = 'Datoteka ne smije biti veća od {{ settings.source_limit // 1000 }} kB.';
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
