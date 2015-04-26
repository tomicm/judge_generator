function SearchCtrl($scope) {
  
  $scope.tasks = [];

  $scope.updateFound = function() {
    $scope.tasks = Search.search($scope.keywords, 60).map(function(result) { 
      var task_id = 'tasks/' + result.split(' ')[0];
      var task_info = get_task_info(task_id);
      var pdf_path = get_task_pdf_path(task_id);
      return [
        task_id,
        task_info.task_name,
        task_info.contest_name 
         + (task_info.round_name?', '+task_info.round_name.toLowerCase() : ''),
        get_task_pdf_path(task_id),
        get_contest_link(task_id),
      ];
    });
  }
}
