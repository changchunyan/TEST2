'use strict';

/**
 * The biChannelGrade controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiGradeSubjectConsumeController', [
	'$scope','$sce', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiGradeSubjectConsumeService', 'DepartmentService', 'AuthenticationService','localStorageService','CommonService',
	function($scope,$sce, $modal, $filter, $rootScope, SweetAlert, BiGradeSubjectConsumeService, DepartmentService, AuthenticationService,localStorageService,CommonService) {

    $scope.getSummary = getSummary;
    $scope.calculateGradeSummary = calculateGradeSummary;
    $scope.cellData = cellData;
    $scope.subjectTotalCellData = subjectTotalCellData;
    $scope.gradeTotalCellData = gradeTotalCellData;
    $scope.setDataType = setDataType;
    $scope.buttonStyle = buttonStyle;

    $scope.totalOfSubjects = {};
    $scope.totalOfGrades = {};
    $scope.everythingTotal = {};

    function setDataType(dataType) {
      $scope.dataType = dataType;
    }

    function buttonStyle(dataType) {
      if ($scope.dataType === dataType) {
        return "btn btn-default btn-active";
      } else {
        return "btn btn-default";
      }
    }

    function getSummary() {
      $scope.searchModel.startTime = $("#startTime").val() ? $("#startTime").val() : new Date().Format('yyyy-MM-dd');
      $scope.searchModel.endTime = $("#endTime").val() ? $("#endTime").val() : new Date().Format('yyyy-MM-dd');
      var departmentId = $scope.selectdDepartment ? $scope.selectdDepartment.id : $scope.department.id;
      BiGradeSubjectConsumeService.getSummary(departmentId, $scope.searchModel.startTime, $scope.searchModel.endTime).then(function(response) {
        $scope.originalData = response.data;
        $scope.calculateGradeSummary(response.data);
      });
    }

    function calculateGradeSummary(data) {
      var subjects = [];
      for (var i = 0; i < data.length; i++) {

        // 计算每个内部空格的数据
        var subject = null;
        for (var j = 0; j < subjects.length; j++) {
          if (subjects[j].name === data[i].subject) {
            subject = subjects[j];
            break;
          }
        }
        if (!subject) {
          subject = {
            name: data[i].subject,
            grades: {}
          };
          subjects.push(subject);
        }
        subject.grades[data[i].grade] = data[i];

      }

      $scope.subjects = subjects;

      var grades = $scope.grades;

      var totalOfSubjects = {};
      for (var i = 0; i < $scope.subjects.length; i++) {
        var subject = $scope.subjects[i];
        var totalOfNumberOfStudents = 0;
        var totalOfNumberOfHours = 0.0;
        for (var j = 0; j < grades.length; j++) {
          if (subject.grades[grades[j]]) {
            totalOfNumberOfStudents += subject.grades[grades[j]].numberOfStudents;
            totalOfNumberOfHours += subject.grades[grades[j]].numberOfHours;
          }
        }
        totalOfSubjects[subject.name] = {
          numberOfStudents: totalOfNumberOfStudents,
          numberOfHours: totalOfNumberOfHours
        }
      }
      $scope.totalOfSubjects = totalOfSubjects;


      var totalOfGrades = {};
      for (var i = 0; i < grades.length; i++) {
        var grade = grades[i];
        var numberOfStudents = 0;
        var numberOfHours = 0.0;
        for (var j = 0; j < data.length; j++) {
          if (data[j].grade === grade) {
            numberOfStudents += data[j].numberOfStudents;
            numberOfHours += data[j].numberOfHours;
          }
        }
        totalOfGrades[grade] = {
          numberOfStudents: numberOfStudents,
          numberOfHours: numberOfHours
        };
      }
      $scope.totalOfGrades = totalOfGrades;

      var everythingTotal = {
        numberOfStudents: 0,
        numberOfHours: 0.0
      };
      var keys = Object.keys(totalOfSubjects);
      for (var i = 0; i < keys.length; i++) {
        everythingTotal.numberOfStudents += totalOfSubjects[keys[i]].numberOfStudents;
        everythingTotal.numberOfHours += totalOfSubjects[keys[i]].numberOfHours;
      }
      $scope.everythingTotal = everythingTotal;

      console.log( $scope.totalOfSubjects);
    }

    function cellData(data) {
      if (!data) {
        return 0;
      }
      if ($scope.dataType === $scope.dataTypes[0]) {
        return data.numberOfStudents;
      } else if ($scope.dataType === $scope.dataTypes[1]) {
        return data.numberOfHours.toFixed(2);
      } else {
        return 0;
      }
    }

    function subjectTotalCellData(channel) {
      var data = $scope.totalOfSubjects[channel];
      if (!data) {
        return 0;
      }
      return $scope.cellData(data);
    }


    function gradeTotalCellData(grade) {
      var data = $scope.totalOfGrades[grade];
      if (!data) {
        return 0;
      }
      return $scope.cellData(data);
    }



    $scope.dataTypes = ['学生数', '小时数'];
    $scope.dataType = $scope.dataTypes[0];

    $scope.grades = ['幼小年级',
                     '小学一年级','小学二年级', '小学三年级', '小学四年级', '小学五年级', '小学六年级',
                     '初中一年级', '初中二年级', '初中三年级', '初中四年级',
                     '高中一年级', '高中二年级', '高中三年级',
                     '全年级','高中毕业'];


    $scope.summaryModel = {};
    $scope.searchModel.startTime = $scope.searchModel.startTime.Format("yyyy-MM-dd");
    $scope.searchModel.endTime = $scope.searchModel.endTime.Format("yyyy-MM-dd");

    var department = sessionStorage.getItem('com.youwin.yws.department');
    $scope.department = JSON.parse(department);

    $scope.getSummary();
	}
]);
