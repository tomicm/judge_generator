var INVALID_REQUEST = 0,
    CONNECTION_ERROR = 1,
    WAITING = 2,
    COMPILING = 3,
    RUNNING = 4,
    RUNNING_JUDGE = 5,
    FINISHED = 6;

var MSG = [
  'Nepostojeće rješenje.',
  'Greška pri spajanju na server za evaluaciju.',
  'rješenje čeka na evaluaciju',
  'rješenje se kompajlira',
  'rješenje se izvršava',
  'skoro pa gotovo',
  'gotovo'
];

var EVAL_RESULTS = ['ac', 'wa', 'tle', 'mem', 'rte'];
var EVAL_MSGS = [
  'Točno!', 
  'Krivo!', 
  'Prekoračeno vremensko ograničenje.',
  'Prekoračeno memorijsko ograničenje.',
  'Greška pri izvršavanju.'
]

window.onload = function getEvaluationStatus() {
  var url = window.location.href;
  var evalId = 'unknown';
  if(url.split('#')[1]) evalId = url.split('#')[1];

  var xmlhttp;
  if(window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else {
    xmlhtpp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.open("GET", "http://api.belowtle.com/evaluation/" + evalId, true);
  xmlhttp.onreadystatechange = function() {
    if(xmlhttp.readyState == 4) {
      if(xmlhttp.status == 200) {
        var response = undefined; 
        try {
          response = JSON.parse(xmlhttp.responseText);
        } catch(err) {
          updateInfo(INVALID_REQUEST, xmlhttp.responseText);
        }
        parseResponse(response);
      }

      if(xmlhttp.status == 404) {
        updateInfo(CONNECTION_ERROR);
      }
    }
  }
  xmlhttp.send();
}

function parseResponse(response) {
  if(response == undefined) return;

  document.getElementById('sendtime').innerHTML = response.createTime;

  var task = response.testSetId.split('@')[1];
  var info = get_task_info(task);

  if(info == undefined) {
    console.log('erol 404');
  } else {
    document.getElementById('contest').innerHTML = info['contest_name'];
    document.getElementById('round').innerHTML = info['round_name'];
    document.getElementById('task').innerHTML = info['task_name'];
  }

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

function showEvaluationError(error) {
  document.getElementById('status').innerHTML = MSG[FINISHED];
  var msg = 'Greška!';
  if(error.class == 'compile')
    msg = 'Greška pri kompilaciji!'
  document.getElementById('result').innerHTML = msg;
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
  document.getElementById('status').innerHTML = MSG[state];
}
