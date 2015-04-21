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
