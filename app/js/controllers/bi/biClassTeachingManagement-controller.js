'use strict';

/**
 * The biTeacherReport controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiClassTeachingManagementController', [
	'$scope', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiClassTeachingManagementService', 'DepartmentService',
	'AuthenticationService', 'localStorageService',
	function($scope, $modal, $filter, $rootScope, SweetAlert, BiClassTeachingManagementService, DepartmentService,
			AuthenticationService, localStorageService) {

      $scope.getChildren = getChildren;

      $scope.searchModel.startTime = $scope.searchModel.startTime.Format("yyyy-MM-dd");
      $scope.searchModel.endTime = $scope.searchModel.endTime.Format("yyyy-MM-dd");

      var department = sessionStorage.getItem('com.youwin.yws.department');
      $scope.department = JSON.parse(department);

      $scope.classTypes = ['春季班', '暑假班', '秋季班', '寒假班', '随时插班', '其他'];
      $scope.flattenClassTypeValues = [];
      for (var i = 0; i < $scope.classTypes.length; i++) {
        $scope.flattenClassTypeValues.push('开班数');
        $scope.flattenClassTypeValues.push('学生数');
      }

      function format(data) {
        var keys = Object.keys(data);
        var statisticsModels = [];
        for (var i = 0; i < keys.length; i++) {
          for (var j = 0; j < data[keys[i]].length; j++) {
            data[keys[i]][j].departmentName = keys[i];
            data[keys[i]][j].rows = data[keys[i]].length;
            if (j == 0) {
              data[keys[i]][j].isStart = true
            }
            statisticsModels.push(data[keys[i]][j]);
          }
        }
        return statisticsModels;
      }

      function total(data) {
        var total = {
          numberOfTeachers: 0,
          numberOfClasses: 0,
          numberOfStudents: 0,
          classTypeStats: {}
        };

        var keys = Object.keys(data);
        var statisticsModels = [];
        for (var i = 0; i < keys.length; i++) {
          for (var j = 0; j < data[keys[i]].length; j++) {
            var d = data[keys[i]][j];
            total.numberOfTeachers += d.numberOfTeachers;
            total.numberOfStudents += d.numberOfStudents;
            total.numberOfClasses += d.numberOfClasses;
            for (var k = 0; k < $scope.classTypes.length; k++) {
              var classTypeStat = total.classTypeStats[$scope.classTypes[k]];
              if (!classTypeStat) {
                classTypeStat = {
                  numberOfClasses: 0,
                  numberOfStudent: 0
                }
                total.classTypeStats[$scope.classTypes[k]] = classTypeStat;
              }
              var dClassTypeStat = d.classTypeStats[$scope.classTypes[k]];
              classTypeStat.numberOfClasses += dClassTypeStat ? dClassTypeStat.numberOfClasses : 0;
              classTypeStat.numberOfStudent += dClassTypeStat ? dClassTypeStat.numberOfStudent : 0;
            }
          }
        }
        return total;
      }

      function getChildren() {
        $scope.searchModel.startTime = $("#startTime").val();
        $scope.searchModel.endTime = $("#endTime").val();
        if ($scope.searchModel.schoolId != undefined) {
          $scope.searchModel.departmentId = $scope.searchModel.schoolId;
        }
        BiClassTeachingManagementService.getChildren($scope.searchModel.departmentId, $scope.searchModel.startTime, $scope.searchModel.endTime).then(function(res) {
          $scope.statisticsModels = format(res.data);
          $scope.total = total(res.data)
          $scope.rawData = res.data
        });
      }

    }
]);
