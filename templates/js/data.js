task_info = {{ task_info }};

function get_task_info(taskPath) {
  path = taskPath.split('/');
  curr = task_info;
  for(var i = 0; i < path.length; ++i) {
    curr = curr[path[i]];
    if(curr == undefined) break;
  }
  return curr;
}

function get_task_pdf_path(taskPath) {
  return taskPath + '/' + taskPath.split('-').slice(-1)[0] + '.pdf';
}
