angular.module('doubtfire.units.partials.unit-analytics', [])

.directive('unitAnalytics', ->
  replace: true
  restrict: 'E'
  templateUrl: 'units/partials/templates/unit-analytics.tpl.html'
  controller: ($scope, Unit) ->
    #
    # We need to avoid hitting the server with these requests unless this is actually viewed...
    # Store all analytics data in $scope.unit.analytics.
    #

    $scope.fetchTaskCompletionStats = () ->
      Unit.taskCompletionStats.get {id: $scope.unit.id},
        (response) ->
          $scope.unit.analytics.taskCompletionStats = response

    $scope.fetchLearningProgressClassDetails = () ->
      Unit.learningProgressClassDetails.get {id: $scope.unit.id},
        (response) ->
          $scope.unit.analytics.learningProgressClassDetails = response

    $scope.fetchTargetGradeStats = () ->
      Unit.targetGradeStats.query {id: $scope.unit.id},
        (response) ->
          $scope.unit.analytics.targetGradeStats = response

    #
    # Active task tab group
    #
    $scope.tabsData =
      taskStatusStats:
        title: "Task Status Stats"
        subtitle: "View distribution of tasks by their current status either unit-wide or broken down into a specific tutorial or task"
        icons: ["fa-tasks"]
        seq: 0
        active: false
      taskCompletionStats:
        title: "Task Completion Stats"
        subtitle: "View how tasks have been marked as completed as a box plot"
        icons: ["fa-check"]
        seq: 1
        active: false
      targetGradeStats:
        title: "Target Grade Stats"
        subtitle: "View distribution of student target grades either unit-wide or broken down into a specific tutorial"
        icons: ["fa-trophy"]
        seq: 2
        active: false
      achievementStats:
        title: "ILO Achievement Stats"
        subtitle: "View how ILOs have been achieved by students to their associated tasks as a box plot"
        icons: ["fa-graduation-cap"]
        seq: 3
        active: false
      taskSummaryStats:
        title: "Task Statistics"
        subtitle: "Click a lab code's circle in the legend to remove the lab from the graph. Double click the lab code's circle to make this lab the only visible lab in the graph"
        icons: ["fa-circle"]
        seq: 4
        active: false

    #
    # Sets the active tab
    #
    $scope.setActiveTab = (tab) ->
      # Do nothing if we're switching to the same tab
      return if tab is $scope.activeTab
      if $scope.activeTab?
        $scope.activeTab.active = false
      $scope.activeTab = tab
      $scope.activeTab.active = true

    $scope.setActiveTab($scope.tabsData.taskStatusStats)

    #
    # Checks if tab is the active tab
    #
    $scope.isActiveTab = (tab) ->
      tab is $scope.activeTab
)
