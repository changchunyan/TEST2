'use strict';

/**
 * The biRetentionRecommendation controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiRetentionRecommendationController', [
	'$scope','$sce', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiRetentionRecommendationService', 'DepartmentService', 'AuthenticationService','localStorageService','CommonService',
	function($scope,$sce, $modal, $filter, $rootScope, SweetAlert, BiRetentionRecommendationService, DepartmentService, AuthenticationService,localStorageService,CommonService) {

    $scope.getChannelGradeSummary = getChannelGradeSummary;
    $scope.buttonStyle = buttonStyle;
    $scope.setDataType = setDataType;
    $scope.cellData = cellData;
    $scope.channelTotalCellData = channelTotalCellData;
    $scope.gradeTotalCellData = gradeTotalCellData;

    $scope.dataTypes = ['签单数', '实收金额', '平均单底'];
    $scope.dataType = $scope.dataTypes[0];
    $scope.totalOfSubjects = {};
    $scope.totalOfGrades = {};
    $scope.everythingTotal = {};

    $scope.viewTypes = ['年级', '学段'];
    $scope.viewType = $scope.viewTypes[0];
    $scope.setViewType = setViewType;
    $scope.viewButtonStyle = viewButtonStyle;

    $scope.orderTypes = ['全部', '续费', '推荐'];
    $scope.orderType = $scope.orderTypes[0];
    $scope.orderTypeButtonStyle = orderTypeButtonStyle;
    $scope.setOrderType = setOrderType;

    $scope.gradesOrSegments = gradesOrSegments;

    function gradesOrSegments() {
      if ($scope.viewType == $scope.viewTypes[0]) {
        return $scope.grades;
      } else {
        return $scope.segments;
      }
    }


    $scope.grades = ['幼小年级',
                     '小学一年级','小学二年级', '小学三年级', '小学四年级', '小学五年级', '小学六年级',
                     '初中一年级', '初中二年级', '初中三年级', '初中四年级',
                     '高中一年级', '高中二年级', '高中三年级',
                     '全年级','高中毕业'];

    $scope.segments = ['小学', '初中', '高中', '其他'];
    $scope.segmentGrades = {
      '小学' : ['小学一年级','小学二年级', '小学三年级', '小学四年级', '小学五年级', '小学六年级'],
      '初中' : ['初中一年级', '初中二年级', '初中三年级', '初中四年级'],
      '高中' : ['高中一年级', '高中二年级', '高中三年级'],
      '其他' : ['幼小年级', '其他', '全年级','高中毕业']
    }

    function gradeToSegment(grade) {
      var keys = Object.keys($scope.segmentGrades);
      for (var i = 0; i < keys.length; i++) {
        if ($scope.segmentGrades[keys[i]].indexOf(grade) != -1) {
          return keys[i];
        }
      }
      return null;
    }

    function gradeDataToSegmentData(data) {
      var segmentData = [];
      for (var i = 0; i < data.length; i++) {
        var segment = null;
        for (var j = 0; j < segmentData.length; j++) {
          if (segmentData[j].subject == data[i].subject && gradeToSegment(data[i].grade) == segmentData[j].grade) {
            segment = segmentData[j];
            break;
          }
        }
        if (!segment) {
          segment = {
            grade: gradeToSegment(data[i].grade),
            subject: data[i].subject,
            numberOfRetentionOrders: 0,
            numberOfRecommendationOrders: 0,
            totalRetentionAmount: 0,
            totalRecommendationAmount: 0
          };
          segmentData.push(segment);
        }
        segment.numberOfRetentionOrders += data[i].numberOfRetentionOrders;
        segment.numberOfRecommendationOrders += data[i].numberOfRecommendationOrders;
        segment.totalRetentionAmount += data[i].totalRetentionAmount;
        segment.totalRecommendationAmount += data[i].totalRecommendationAmount;
      }

      return segmentData;
    }

    function renderChart() {
      $scope.labelsSummary = [];
      $scope.seriesSummary = [];
      $scope.dataSummary = [];

      $scope.options = {
        scales: {
          yAxes: [{
            stacked: true
          }]
        }
      };

      var grades = $scope.viewType == $scope.viewTypes[0] ? $scope.grades : $scope.segments;
      $scope.seriesSummary = grades;

      for (var i = 0; i < $scope.subjects.length; i++) {
        $scope.labelsSummary.push($scope.subjects[i].name);
      }

      for (var i = 0; i < grades.length; i++) {
        var data = [];
        for (var j = 0; j < $scope.subjects.length; j++) {
          data.push([]);
        }
        $scope.dataSummary.push(data);
      }


      for (var i = 0; i < $scope.subjects.length; i++) {
        for (var j = 0; j < grades.length; j++) {
          var d = $scope.cellData($scope.subjects[i].grades[grades[j]]);
          $scope.dataSummary[j][i] = d;
        }
      }

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

      var grades = $scope.viewType == $scope.viewTypes[0] ? $scope.grades : $scope.segments;

      var totalOfSubjects = {}; // key 是渠道名，value 是该渠道所有年级的汇总
      for (var i = 0; i < $scope.subjects.length; i++) {
        var subject = $scope.subjects[i];
        var totalOfNumberOfRetentionOrders = 0;
        var totalOfRetentionAmounts = 0.0;
        var totalOfNumberOfRecommendationOrders = 0;
        var totalOfRecommendationAmounts = 0.0;
        for (var j = 0; j < grades.length && subject.grades[grades[j]]; j++) {
          totalOfNumberOfRetentionOrders += subject.grades[grades[j]].numberOfRetentionOrders;
          totalOfRetentionAmounts += subject.grades[grades[j]].totalRetentionAmount;
          totalOfNumberOfRecommendationOrders += subject.grades[grades[j]].numberOfRecommendationOrders;
          totalOfRecommendationAmounts += subject.grades[grades[j]].totalRecommendationAmount;
        }
        totalOfSubjects[subject.name] = {
          numberOfRetentionOrders: totalOfNumberOfRetentionOrders,
          totalRetentionAmount: totalOfRetentionAmounts,
          numberOfRecommendationOrders: totalOfNumberOfRecommendationOrders,
          totalRecommendationAmount: totalOfRecommendationAmounts
        }
      }
      $scope.totalOfSubjects = totalOfSubjects;

      var totalOfGrades = {};   // key 是年级名，value 是该年级所有渠道的汇总
      for (var i = 0; i < grades.length; i++) {
        var grade = grades[i];
        var totalOfNumberOfRetentionOrders = 0;
        var totalOfRetentionAmounts = 0.0;
        var totalOfNumberOfRecommendationOrders = 0;
        var totalOfRecommendationAmounts = 0.0;
        for (var j = 0; j < data.length; j++) {
          if (data[j].grade === grade) {
            totalOfNumberOfRetentionOrders += data[j].numberOfRetentionOrders;
            totalOfRetentionAmounts += data[j].totalRetentionAmount;
            totalOfNumberOfRecommendationOrders += data[j].numberOfRecommendationOrders;
            totalOfRecommendationAmounts += data[j].totalRecommendationAmount;
          }
        }
        totalOfGrades[grade] = {
          numberOfRetentionOrders: totalOfNumberOfRetentionOrders,
          totalRetentionAmount: totalOfRetentionAmounts,
          numberOfRecommendationOrders: totalOfNumberOfRecommendationOrders,
          totalRecommendationAmount: totalOfRecommendationAmounts
        };
      }
      $scope.totalOfGrades = totalOfGrades;

      var everythingTotal = {
        numberOfRetentionOrders: 0,
        totalRetentionAmount: 0,
        numberOfRecommendationOrders: 0,
        totalRecommendationAmount: 0
      };
      var keys = Object.keys(totalOfSubjects);
      for (var i = 0; i < keys.length; i++) {
        everythingTotal.numberOfRetentionOrders += totalOfSubjects[keys[i]].numberOfRetentionOrders;
        everythingTotal.totalRetentionAmount += totalOfSubjects[keys[i]].totalRetentionAmount;
        everythingTotal.numberOfRecommendationOrders += totalOfSubjects[keys[i]].numberOfRecommendationOrders;
        everythingTotal.totalRecommendationAmount += totalOfSubjects[keys[i]].totalRecommendationAmount;
      }
      $scope.everythingTotal = everythingTotal;

      renderChart();
    }

    function getChannelGradeSummary() {
      $scope.searchModel.startTime = $("#startTime").val() ? $("#startTime").val() : new Date().Format('yyyy-MM-dd');
      $scope.searchModel.endTime = $("#endTime").val() ? $("#endTime").val() : new Date().Format('yyyy-MM-dd');
      var departmentId = $scope.selectdDepartment ? $scope.selectdDepartment.id : $scope.department.id;
      BiRetentionRecommendationService.getSummary(departmentId, $scope.searchModel.startTime, $scope.searchModel.endTime).then(function(response) {
        $scope.originalData = response.data;
        var calculatedData = $scope.originalData;
        if ($scope.viewType == $scope.viewTypes[1]) {
          calculatedData = gradeDataToSegmentData(calculatedData);
        }
        calculateGradeSummary(calculatedData);
      });
    }

    function buttonStyle(dataType) {
      if ($scope.dataType === dataType) {
        return "btn btn-default btn-active";
      } else {
        return "btn btn-default";
      }
    }

    function setDataType(dataType) {
      $scope.dataType = dataType;
      renderChart();
    }

    function cellData(data) {
      if (!data) {
        return 0;
      }
      var numberOfOrders = 0;
      var totalAmount = 0;
      var averageAmount = 0;

      if ($scope.orderType ==$scope.orderTypes[0]) {
        numberOfOrders = data.numberOfRetentionOrders + data.numberOfRecommendationOrders;
        totalAmount = (data.totalRetentionAmount + data.totalRecommendationAmount).toFixed(2);
        averageAmount = ((data.totalRetentionAmount + data.totalRecommendationAmount) / (data.numberOfRetentionOrders + data.numberOfRecommendationOrders)).toFixed(2);
      } else if ($scope.orderType ==$scope.orderTypes[1]) {
        numberOfOrders = data.numberOfRetentionOrders;
        totalAmount = (data.totalRetentionAmount).toFixed(2);
        averageAmount = data.numberOfRetentionOrders == 0 ? 0 : ((data.totalRetentionAmount) / (data.numberOfRetentionOrders)).toFixed(2);
      } else if ($scope.orderType ==$scope.orderTypes[2]) {
        numberOfOrders = data.numberOfRecommendationOrders;
        totalAmount = (data.totalRecommendationAmount).toFixed(2);
        averageAmount = data.numberOfRecommendationOrders == 0 ? 0 : ((data.totalRecommendationAmount) / (data.numberOfRecommendationOrders)).toFixed(2);
      }

      if ($scope.dataType === $scope.dataTypes[0]) {
        return numberOfOrders;
      } else if ($scope.dataType === $scope.dataTypes[1]) {
        return totalAmount;
      } else if ($scope.dataType === $scope.dataTypes[2]) {
        if (numberOfOrders == 0) {
          return 0;
        }
        return averageAmount;
      } else {
        return 0;
      }
    }

    function channelTotalCellData(channel) {
      var data = $scope.totalOfSubjects[channel];
      return $scope.cellData(data);
    }


    function gradeTotalCellData(grade) {
      var data = $scope.totalOfGrades[grade];
      if (!data) {
        return 0;
      }
      return $scope.cellData(data);
    }

    function setViewType(viewType) {
      $scope.viewType = viewType;
      var calculatedData = $scope.originalData;
      if ($scope.viewType == $scope.viewTypes[1]) {
        calculatedData = gradeDataToSegmentData(calculatedData);
      }
      calculateGradeSummary(calculatedData);
    }

    function viewButtonStyle(viewType) {
      if ($scope.viewType === viewType) {
        return "btn btn-default btn-active";
      } else {
        return "btn btn-default";
      }
    }

    function orderTypeButtonStyle(orderType) {
      if ($scope.orderType === orderType) {
        return "btn btn-default btn-active";
      } else {
        return "btn btn-default";
      }
    }

    function setOrderType(orderType) {
      $scope.orderType = orderType;
      var calculatedData = $scope.originalData;
      if ($scope.viewType == $scope.viewTypes[1]) {
        calculatedData = gradeDataToSegmentData(calculatedData);
      }
      calculateGradeSummary(calculatedData);
    }


    $scope.summaryModel = {};
    $scope.searchModel.startTime = $scope.searchModel.startTime.Format("yyyy-MM-dd");
    $scope.searchModel.endTime = $scope.searchModel.endTime.Format("yyyy-MM-dd");

    var department = sessionStorage.getItem('com.youwin.yws.department');
    $scope.department = JSON.parse(department);

    $scope.getChannelGradeSummary();
	}
]);
