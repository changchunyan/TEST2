'use strict';

/**
 * The BiSchoolPerformenceController.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiSchoolPerformenceController', [
  '$scope', '$sce', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiSchoolPerformenceService',
  'DepartmentService', 'AuthenticationService', 'localStorageService', 'CommonService', 'BiBaseService',
  function ($scope, $sce, $modal, $filter, $rootScope, SweetAlert, BiSchoolPerformenceService,
    DepartmentService, AuthenticationService, localStorageService, CommonService, BiBaseService) {
    // 方法声明
    /**
     * 共同方法
     */
    $scope.getTabIndex = getTabIndex;

    /*
     * 统计方法
     */
    $scope.getStatisticsForST = getStatisticsForST;
    $scope.getSchoolPerfermence = getSchoolPerfermence;
    $scope.exportSchoolPerfermence = exportSchoolPerfermence;
    $scope.exportStatisticsToExcel = exportStatisticsToExcel;

    /*
     * 汇总方法
     */
    $scope.getSchoolPerfermenceSummary = getSchoolPerfermenceSummary;
    $scope.exportSummaryToExcel = exportSummaryToExcel;
    $scope.getSChoolPerformanceByBU = getSChoolPerformanceByBU;
    $scope.getTimeline = getTimeline;
    $scope.calculateTimeline = calculateTimeline;

    /**
     * 统计参数
     */
    $scope.statisticsModels = {};
    $scope.statisticsModelsAll = {};

    /**
     * 汇总参数
     */
    $scope.summaryModel = {};
    $scope.searchModel.startTime = $scope.searchModel.startTime.Format("yyyy-MM-dd");
    $scope.searchModel.endTime = $scope.searchModel.endTime.Format("yyyy-MM-dd");

    var department = sessionStorage.getItem('com.youwin.yws.department');
    $scope.department = JSON.parse(department);

    $scope.dataTypes = ['营销实收业绩', '续推实收业绩', '消课小时数', '总实收业绩'];
    $scope.dataType = $scope.dataTypes[3];
    $scope.dataIndexes = ['marketRealAmount', 'managementRealAmount', 'courseHours', 'totalRealAmount'];
    $scope.dataScale = [10000, 10000, 1, 10000];

    $scope.buttonStyle = buttonStyle;
    $scope.setDataType = setDataType;

    $scope.viewTypes = ['日', '周', '月'];
    $scope.statTypes = ['D', 'W', 'M'];
    $scope.viewType = $scope.viewTypes[2];
    $scope.viewButtonStyle = viewButtonStyle;
    $scope.setViewType = setViewType;

    function buttonStyle(dataType) {
      if ($scope.dataType === dataType) {
        return "btn btn-default btn-active";
      } else {
        return "btn btn-default";
      }
    }

    function setDataType(dataType) {
      $scope.dataType = dataType;
      $scope.calculateTimeline();
    }

    function setViewType(viewType) {
      if ($scope.viewType != viewType) {
        $scope.viewType = viewType;
        getTimeline();
      }
    }

    function viewButtonStyle(viewType) {
      if ($scope.viewType === viewType) {
        return "btn btn-default btn-active";
      } else {
        return "btn btn-default";
      }
    }

    /***                                                                                        ***/
    /**********************************************公共部分*****************************************/
    /***                                                                                        ***/

    /**
     * tab切换
     */
    function getTabIndex(obj) {
      if (obj.title === '校区业绩明细') {
        $scope.channelTab = '0';
      } else if (obj.title === '全部数据汇总') {
        $scope.channelTab = '1';
      } else if (obj.title === '业绩汇总') {
        $scope.channelTab = '2';
      }
    }

    /**
     * 封装model，加入合计
     */
    function packageModel(obj) {
      obj.totalVisitCount = obj.renewVisitCount + obj.recommendVisitCount;
      obj.totalVisitTimes = obj.renewVisitTimes + obj.recommendVisitTimes;
      obj.totalOrderCount = obj.renewOrderCount + obj.recommendOrderCount;
      obj.totalOrderAmount = obj.renewOrderAmount + obj.recommendOrderAmount;
      return obj;
    }

    /***                                                                                        ***/
    /**********************************************统计部分*****************************************/
    /***                                                                                       ***/
    /**
     * 根据列表状态获取统计数据
     */
    function getStatisticsForST(tableState) {
      //设置表格状态和分页信息
      $scope.statisticsTableState = tableState;
      $scope.isLoading = true;
      $scope.pagination = tableState.pagination;
      $scope.start = $scope.pagination.start || 0;
      $scope.number = $scope.pagination.number || 10;
      $scope.searchModel.start = $scope.start;
      $scope.searchModel.size = $scope.number;
      if ($scope.searchModel.schoolId != undefined) {
        $scope.searchModel.departmentId = $scope.searchModel.schoolId;
      }
      BiSchoolPerformenceService.getSchoolPerfermenceInfos($scope.searchModel).then(function (result) {
        $scope.statisticsModels = result.data.list;
        tableState.pagination.numberOfPages = result.numberOfPages;
        $scope.isLoading = false;
      });
      BiSchoolPerformenceService.getSchoolPerfermenceTotal($scope.searchModel).then(function (result) {
        $scope.listTotal = result.data;
      });
    }

    $scope.position_idFun = function () {
      return sessionStorage.getItem('com.youwin.yws.position_id') == 79 ? 1 : 0;
    }
    function _getDate() {
      $scope.since = getDateFormat($scope.modelStartTime)
      $scope.until = getDateFormat($scope.modelEndTime || $scope.modelStartTime)
    }


    /**
     * 获取校区确认收入统计分页数据。这个函数与 getStatisticsForST 区别是它由查询按钮触发，会重置翻页状态。
     */
    function getSchoolPerfermence() {
      $scope.searchModel.startTime = $("#startTime").val();
      $scope.searchModel.endTime = $("#endTime").val();
      $scope.statisticsTableState.pagination.start = 0;
      $scope.searchModel.start = $scope.statisticsTableState.pagination.start || 0;
      $scope.searchModel.size = $scope.statisticsTableState.pagination.number || 10;
      if (!$scope.channelTab || $scope.channelTab === '0') {
        //设置表格状态和分页信息
        $scope.isLoading = true;
        $scope.statisticsTableState.pagination.start = 0;
        $scope.pagination = $scope.statisticsTableState.pagination;
        $scope.start = $scope.pagination.start || 0;
        $scope.number = $scope.pagination.number || 10;
        $scope.searchModel.start = $scope.start;
        $scope.searchModel.size = $scope.number;
        BiSchoolPerformenceService.getSchoolPerfermenceInfos($scope.searchModel)
          .then(function (result) {
            $scope.statisticsModels = result.data.list;
            $scope.statisticsTableState.pagination.numberOfPages = result.numberOfPages;
            $scope.isLoading = false
          });
        BiSchoolPerformenceService.getSchoolPerfermenceTotal($scope.searchModel).then(function (result) {
          $scope.listTotal = result.data;
        });
      } else if ($scope.channelTab === '1') {
        getSchoolPerfermenceSummary();
      } else if ($scope.channelTab === '2') {
        getSChoolPerformanceByBU();
      }
    }

    /**
     * 导出校区业绩数据到excel。
     */
    function exportSchoolPerfermence() {
      BiSchoolPerformenceService.getAllList($scope.searchModel)
        .then(function (result) {
          $scope.statisticsModelsAll = result.data;
          exportStatisticsToExcel();
        });
    }

    /**
     * 导出excel
     */
    function exportStatisticsToExcel() {
      var statisticsExportTableStyle = {
        sheetid: '校区业绩统计',
        headers: true,
        caption: {
          title: '校区业绩-统计数据',
        },
        column: { style: 'font-size:14px; text-align:left;' },
        columns: [{ columnid: 'schoolName', title: '校区', width: '100px' },
        { columnid: 'marketOrderCount', title: '营销签约单数' },
        { columnid: 'marketOrderAmount', title: '营销签约金额' },
        { columnid: 'marketRealAmount', title: '营销实收金额' },
        { columnid: 'managementOrderCount', title: '学管签约单数' },
        { columnid: 'managementOrderAmount', title: '学管签约金额' },
        { columnid: 'managementRealAmount', title: '学管实收金额' },
        { columnid: 'courseNum', title: '消课课时量' },
        { columnid: 'courseHours', title: '消课课时小时数' },
        { columnid: 'changePlatformAmount', title: '转平台金额' },
        { columnid: 'totalRealAmount', title: '总实收金额' }
        ],
        row: {
          style: function (sheet, row, rowidx) {
            return 'background:' + (rowidx % 2 ? '#E1FFFF' : '#F0E68C');
          }
        },
        cells: {
          style: 'font-size:13px; text-align:left;'
        }
      };
      alasql('SELECT * INTO XLS("校区业绩-统计数据.xls", ?) FROM ?', [statisticsExportTableStyle, $scope.statisticsModelsAll]);
    }

    /***                                                                                        ***/
    /**********************************************汇总部分*****************************************/
    /***                                                                                        ***/
    /**
     * 数据汇总数据表
     */
    $scope.options = {
      layout: {
        padding: 20
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 20,
          fontSize: 9,
          padding: 10
        }
      },
      tooltips: {
        mode: 'point',
        position: 'nearest'
      },
    };

    function getSchoolPerfermenceSummary() {
      BiSchoolPerformenceService.getAllList($scope.searchModel)
        .then(function (result) {
          $scope.statisticsModelsAll = result.data;
          if ($scope.statisticsModelsAll.length === 0) {
            $scope.summaryModel = {};
            return;
          }
          var obj = new Object();
          obj.marketOrderCount = 0;
          obj.marketOrderAmount = 0.00;
          obj.marketRefundAmount = 0.00;
          obj.marketRealAmount = 0.00;
          obj.managementOrderCount = 0;
          obj.managementOrderAmount = 0.0;
          obj.managementRefundAmount = 0.00;
          obj.managementRealAmount = 0.00;
          obj.courseNum = 0.00;
          obj.courseHours = 0.00;
          obj.changePlatformAmount = 0.00;
          obj.totalRealAmount = 0.00;
          angular.forEach($scope.statisticsModelsAll, function (data, index, array) {
            if ($scope.searchModel.schoolId != null) {
              obj.schoolType = data.schoolType;
            }
            obj.marketOrderCount = obj.marketOrderCount + data.marketOrderCount;
            obj.marketOrderAmount = obj.marketOrderAmount + data.marketOrderAmount;
            obj.marketRefundAmount = obj.marketRefundAmount + data.marketRefundAmount;
            obj.marketRealAmount = obj.marketRealAmount + data.marketRealAmount;
            obj.managementOrderCount = obj.managementOrderCount + data.managementOrderCount;
            obj.managementOrderAmount = obj.managementOrderAmount + data.managementOrderAmount;
            obj.managementRefundAmount = obj.managementRefundAmount + data.managementRefundAmount;
            obj.managementRealAmount = obj.managementRealAmount + data.managementRealAmount;
            obj.courseNum = obj.courseNum + data.courseNum;
            obj.courseHours = obj.courseHours + data.courseHours;
            obj.changePlatformAmount = obj.changePlatformAmount + data.changePlatformAmount;
            obj.totalRealAmount = obj.totalRealAmount + data.totalRealAmount;
          });
          obj.marketOrderAmount = obj.marketOrderAmount.toFixed(2);
          obj.marketRefundAmount = obj.marketRefundAmount.toFixed(2);
          obj.marketRealAmount = obj.marketRealAmount.toFixed(2);
          obj.managementOrderAmount = obj.managementOrderAmount.toFixed(2);
          obj.managementRefundAmount = obj.managementRefundAmount.toFixed(2);
          obj.managementRealAmount = obj.managementRealAmount.toFixed(2);
          obj.changePlatformAmount = obj.changePlatformAmount.toFixed(2);
          obj.totalRealAmount = obj.totalRealAmount.toFixed(2);
          obj.courseNum = obj.courseNum.toFixed(2);
          obj.courseHours = obj.courseHours.toFixed(2);
          if ($scope.searchModel.schoolType == 1) {
            obj.schoolType = '直营校区';
          }
          if ($scope.searchModel.schoolType == 2) {
            obj.schoolType = '合作校区';
          }
          if ($scope.searchModel.schoolType == 3) {
            obj.schoolType = '直盟校区';
          }
          $scope.summaryModel = obj;
          $scope.summaryModel.name = $scope.selectdDepartment.name;
        });
    }

    function getSChoolPerformanceByBU() {
      $scope.searchModel.startTime = $("#startTime").val();
      $scope.searchModel.endTime = $("#endTime").val();
      BiSchoolPerformenceService.getBUList($scope.searchModel).then(function (result) {
        $scope.buSummary = result.data;
        var buSummaryTotal = {};
        buSummaryTotal.marketOrderCount = 0;
        buSummaryTotal.marketOrderAmount = 0.00;
        buSummaryTotal.marketRefundAmount = 0.00;
        buSummaryTotal.marketRealAmount = 0.00;
        buSummaryTotal.managementOrderCount = 0;
        buSummaryTotal.managementOrderAmount = 0.0;
        buSummaryTotal.managementRefundAmount = 0.00;
        buSummaryTotal.managementRealAmount = 0.00;
        buSummaryTotal.courseNum = 0.00;
        buSummaryTotal.courseHours = 0.00;
        buSummaryTotal.changePlatformAmount = 0.00;
        buSummaryTotal.totalRealAmount = 0.00;
        buSummaryTotal.numberOfSchools = 0;
        for (var i = 0; i < $scope.buSummary.length; i++) {
          var data = $scope.buSummary[i];
          buSummaryTotal.marketOrderCount = buSummaryTotal.marketOrderCount + data.marketOrderCount;
          buSummaryTotal.marketOrderAmount = buSummaryTotal.marketOrderAmount + data.marketOrderAmount;
          buSummaryTotal.marketRefundAmount = buSummaryTotal.marketRefundAmount + data.marketRefundAmount;
          buSummaryTotal.marketRealAmount = buSummaryTotal.marketRealAmount + data.marketRealAmount;
          buSummaryTotal.managementOrderCount = buSummaryTotal.managementOrderCount + data.managementOrderCount;
          buSummaryTotal.managementOrderAmount = buSummaryTotal.managementOrderAmount + data.managementOrderAmount;
          buSummaryTotal.managementRefundAmount = buSummaryTotal.managementRefundAmount + data.managementRefundAmount;
          buSummaryTotal.managementRealAmount = buSummaryTotal.managementRealAmount + data.managementRealAmount;
          buSummaryTotal.courseNum = buSummaryTotal.courseNum + data.courseNum;
          buSummaryTotal.courseHours = buSummaryTotal.courseHours + data.courseHours;
          buSummaryTotal.changePlatformAmount = buSummaryTotal.changePlatformAmount + data.changePlatformAmount;
          buSummaryTotal.totalRealAmount = buSummaryTotal.totalRealAmount + data.totalRealAmount;
          buSummaryTotal.numberOfSchools = buSummaryTotal.numberOfSchools + data.numberOfSchools;
        }
        buSummaryTotal.marketOrderAmount = buSummaryTotal.marketOrderAmount.toFixed(2);
        buSummaryTotal.marketRefundAmount = buSummaryTotal.marketRefundAmount.toFixed(2);
        buSummaryTotal.marketRealAmount = buSummaryTotal.marketRealAmount.toFixed(2);
        buSummaryTotal.managementOrderAmount = buSummaryTotal.managementOrderAmount.toFixed(2);
        buSummaryTotal.managementRefundAmount = buSummaryTotal.managementRefundAmount.toFixed(2);
        buSummaryTotal.managementRealAmount = buSummaryTotal.managementRealAmount.toFixed(2);
        buSummaryTotal.changePlatformAmount = buSummaryTotal.changePlatformAmount.toFixed(2);
        buSummaryTotal.totalRealAmount = buSummaryTotal.totalRealAmount.toFixed(2);
        buSummaryTotal.courseNum = buSummaryTotal.courseNum.toFixed(2);
        buSummaryTotal.courseHours = buSummaryTotal.courseHours.toFixed(2);

        $scope.buSummaryTotal = buSummaryTotal;

        $scope.getTimeline();
      });
    }

    function formatStatTime(entry) {
      if ($scope.viewType == '月') {
        return entry.statYear + '-' + entry.statMonth;
      } else if ($scope.viewType == '周') {
        return entry.statYear + '第' + entry.statWeek + '周';
      } else {
        return entry.statYear + '-' + entry.statMonth + '-' + entry.statDay;
      }
    }

    function values(obj) {
      var vals = [];
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          vals.push(obj[key]);
        }
      }
      return vals;
    }

    function calculateTimeline() {
      if ($scope.timeline) {
        var data = $scope.timeline;
        var newData = {};
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
          var list = data[keys[i]];
          var filtered = {};
          for (var j = 0; j < list.length; j++) {
            filtered[formatStatTime(list[j])] = list[j];
          }
          newData[keys[i]] = values(filtered).sort(function (a, b) {
            return a.statTime - b.statTime;
          });
        }

        $scope.labelsSummary = [];
        $scope.seriesSummary = [];
        $scope.dataSummary = [];

        for (var i = 0; i < keys.length; i++) {
          var department = keys[i];
          $scope.seriesSummary.push(department);
          var list = newData[department];
          var chartData = [];
          for (var j = 0; j < list.length; j++) {
            if ($scope.labelsSummary.indexOf(formatStatTime(list[j])) == -1) {
              $scope.labelsSummary.push(formatStatTime(list[j]));
            }
            var dataIndex = $scope.dataTypes.indexOf($scope.dataType);
            chartData.push((list[j][$scope.dataIndexes[dataIndex]] / $scope.dataScale[dataIndex]).toFixed(2));
          }
          $scope.dataSummary.push(chartData);
        }
      }
    }

    function getTimeline() {
      $scope.searchModel.startTime = $("#startTime").val();
      $scope.searchModel.endTime = $("#endTime").val();

      var statType = $scope.statTypes[$scope.viewTypes.indexOf($scope.viewType)];
      var startMoment = moment($("#startTime").val());
      var endMoment = moment($("#endTime").val());
      if (statType == 'M') {
        startMoment.subtract(2, 'months');

      } else if (statType == 'W') {
        startMoment.subtract(14, 'days');
      } else {
        startMoment.subtract(7, 'days');
      }
      BiSchoolPerformenceService.getTimeline($scope.selectdDepartment.id, statType, startMoment.format('YYYY-MM-DD'), endMoment.format('YYYY-MM-DD')).then(function (response) {
        var data = response.data;
        $scope.timeline = angular.copy(data);
        $scope.calculateTimeline();
      });
    }

    /**
     * 导出excel
     */
    function exportSummaryToExcel() {
      var summaryExportTableStyle = {
        sheetid: '校区业绩统计',
        headers: true,
        caption: {
          title: '校区业绩-汇总数据',
        },
        column: { style: 'font-size:14px; text-align:left;' },
        columns: [{ columnid: 'name', title: '区域/校区', width: '100px' },
        { columnid: 'marketOrderCount', title: '营销签约单数' },
        { columnid: 'marketOrderAmount', title: '营销签约金额' },
        { columnid: 'marketRealAmount', title: '营销实收金额' },
        { columnid: 'managementOrderCount', title: '学管签约单数' },
        { columnid: 'managementOrderAmount', title: '学管签约金额' },
        { columnid: 'managementRealAmount', title: '学管实收金额' },
        { columnid: 'courseNum', title: '消课课时量' },
        { columnid: 'courseHours', title: '消课课时小时数' },
        { columnid: 'changePlatformAmount', title: '转平台金额' },
        { columnid: 'totalRealAmount', title: '总实收金额' }
        ],
        row: {
          style: function (sheet, row, rowidx) {
            return 'background:' + (rowidx % 2 ? '#E1FFFF' : '#F0E68C');
          }
        },
        cells: {
          style: 'font-size:13px; text-align:left;'
        }
      };
      $scope.exportData = angular.copy($scope.statisticsModels);
      $scope.exportData = [];
      $scope.exportData.push($scope.summaryModel);
      alasql('SELECT * INTO XLS("校区业绩-汇总数据.xls", ?) FROM ?', [summaryExportTableStyle, $scope.exportData]);
    }
  }
]);
