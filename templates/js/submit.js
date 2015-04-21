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

function parseResponse(response) {
  if(response == undefined) return;

  document.getElementById('sendtime').innerHTML = response.createTime;

  if(response.status == 'waiting') {
    updateInfo(WAITING);
  }
  if(response.status == 'compiling') {
    updateInfo(COMPILING);
  }
  if(response.status == 'running') {
    updateInfo(RUNNING);
  }
  if(response.status == 'done') {
    updateInfo(RUNNING_JUDGE);
  }
  if(response.status == 'finalized') {
    if(response.error == null) {
      showEvaluationResults(response.results);
    } else {
      showEvaluationError(response.error);
    }
  }
}

function showEvaluationResults(results) {
  var result = 'ac';
  for(var i = 0; i < results.length; ++i)
    if(results[i] != 'ac') {
      result = results[i];
      break;
    }
  document.getElementById('status').innerHTML = MSG[FINISHED];
  document.getElementById('result').innerHTML = 
    EVAL_MSGS[EVAL_RESULTS.indexOf(result)];
}

function updateInfo(state) {
  if(state == INVALID_REQUEST) {
    document.getElementById('contest').innerHTML = 'Greška!';
    document.getElementById('subinfo').innerHTML = MSG[INVALID_REQUEST];
    document.getElementById('submission').innerHTML = '';
    document.getElementById('evaluation').innerHTML = ''
      document.getElementById('evalinfo').innerHTML = '';
    return;
  }
  if(state == CONNECTION_ERROR) {
    document.getElementById('contest').innerHTML = 'Greška!';
    document.getElementById('subinfo').innerHTML = MSG[CONNECTION_ERROR];
    document.getElementById('submission').innerHTML = '';
    document.getElementById('evaluation').innerHTML = ''
      document.getElementById('evalinfo').innerHTML = '';
    return;
  }
  if(state == WAITING)
    document.getElementById('status').innerHTML = MSG[state];
}
