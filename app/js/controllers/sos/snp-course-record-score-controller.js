angular.module('ywsApp').controller('SNPCourseRecordScoreController', ['$scope', '$location', 'CoursePlanService', '$modal', '$rootScope', 'SweetAlert','UserPrizeService',
     'CustomerStudentGroupService', 'LeadsStudentService', 'CustomerStudentCourseService', 'CommonService', 'OrderService',
     '$routeParams', 'AuthenticationService', 'ClassStudentAttendenceService','$mtModal','CustomerStudentService','ClassManagementService',
     function ($scope, $location, CoursePlanService, $modal, $rootScope, SweetAlert,UserPrizeService, CustomerStudentGroupService, LeadsStudentService, CustomerStudentCourseService,
               CommonService, OrderService, $routeParams, AuthenticationService, ClassStudentAttendenceService,$mtModal,CustomerStudentService,ClassManagementService) {

        $scope.scoreSelected = scoreSelected;
        $scope.selectScore = selectScore;
        $scope.confirmScore = confirmScore;

        function scoreSelected(score) {
          var selectedScores = $scope.scoreType == 'add' ? $scope.scoreStudent.addScores : $scope.scoreStudent.subScores;
          if (!selectedScores) {
            return false;
          }
          for (var i = 0; i < selectedScores.length; i++) {
            if (selectedScores[i].id == score.id) {
              return true;
            }
          }
          return false;
        }

        function selectScore(score) {
          var selectedScores = $scope.scoreType == 'add' ? $scope.scoreStudent.addScores : $scope.scoreStudent.subScores;
          if (!selectedScores) {
            if (!$scope.scoreStudent.addScores && $scope.scoreType == 'add') {
              $scope.scoreStudent.addScores = [];
              selectedScores = $scope.scoreStudent.addScores;
            } else if (!$scope.scoreStudent.subScores && $scope.scoreType == 'add') {
              $scope.scoreStudent.subScores = [];
              selectedScores = $scope.scoreStudent.subScores;
            }
          }
          if ($scope.scoreSelected(score)) {
            var index = selectedScores.indexOf(score);
            var index = -1;
            for (var i = 0; i < selectedScores.length; i++) {
              if (selectedScores[i].id == score.id) {
                index = i;
                break;
              }
            }

            selectedScores.splice(index, 1);
          } else {
            selectedScores.push(score);
          }
        }

        function confirmScore() {
          $scope.$emit('snpStudentScoreConfirmed');
        }

        // 根据当前窗口是加分还是减分过滤选项
        $scope.localScoreGroups = angular.copy($scope.scoreGroups);
        for (var i = 0; i < $scope.localScoreGroups.length; i++) {
          var scores = [];
          for (var j = 0; j < $scope.localScoreGroups[i].scores.length; j++) {
            if ($scope.scoreType == 'add' && $scope.localScoreGroups[i].scores[j].score > 0) {
              scores.push($scope.localScoreGroups[i].scores[j]);
            } else if ($scope.scoreType == 'sub' && $scope.localScoreGroups[i].scores[j].score < 0) {
              scores.push($scope.localScoreGroups[i].scores[j]);
            }
          }
          $scope.localScoreGroups[i].scores = scores;
        }


     }
   ]
 );
