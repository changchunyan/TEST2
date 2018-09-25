'use strict';

/**
 * The biChannelGrade controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiChannelGradeController', [
    '$scope', '$sce', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiGradeOrderService', 'DepartmentService', 'AuthenticationService', 'localStorageService', 'CommonService',
    function ($scope, $sce, $modal, $filter, $rootScope, SweetAlert, BiGradeOrderService, DepartmentService, AuthenticationService, localStorageService, CommonService) {

        $scope.getChannelGradeSummary = getChannelGradeSummary;
        $scope.buttonStyle = buttonStyle;
        $scope.setDataType = setDataType;
        $scope.cellData = cellData;
        $scope.channelTotalCellData = channelTotalCellData;
        $scope.gradeTotalCellData = gradeTotalCellData;

        $scope.dataTypes = ['签单数', '实收金额', '平均单底'];
        $scope.dataType = $scope.dataTypes[0];
        $scope.totalOfChannels = {};
        $scope.totalOfGrades = {};
        $scope.everythingTotal = {};

        $scope.viewTypes = ['年级', '学段'];
        $scope.viewType = $scope.viewTypes[0];
        $scope.setViewType = setViewType;
        $scope.viewButtonStyle = viewButtonStyle;

        $scope.gradesOrSegments = gradesOrSegments;

        function gradesOrSegments() {
            if ($scope.viewType == $scope.viewTypes[0]) {
                return $scope.grades;
            } else {
                return $scope.segments;
            }
        }


        $scope.grades = ['幼小年级',
            '小学一年级', '小学二年级', '小学三年级', '小学四年级', '小学五年级', '小学六年级',
            '初中一年级', '初中二年级', '初中三年级', '初中四年级',
            '高中一年级', '高中二年级', '高中三年级',
            '全年级', '高中毕业'];

        $scope.segments = ['小学', '初中', '高中', '其他'];
        $scope.segmentGrades = {
            '小学': ['小学一年级', '小学二年级', '小学三年级', '小学四年级', '小学五年级', '小学六年级'],
            '初中': ['初中一年级', '初中二年级', '初中三年级', '初中四年级'],
            '高中': ['高中一年级', '高中二年级', '高中三年级'],
            '其他': ['幼小年级', '其他', '全年级', '高中毕业']
        }

        $scope.tabs = [{
            id: 1,
            name: '营销部门'
        }, {
            id: 2,
            name: '运营部门'
        }]
        $scope.tabsName = {
            '1': '营销部门',
            '2': '运营部门'
        }
        /**
         * 获取页面当前tab页
         */
        $scope.getTabIndex = function getTabIndex(obj) {
            var title = obj.title.replace('统计', '');
//			if(obj.title==='渠道统计'){
//				$scope.channelTab='0';
//			}else if(obj.title==='市场统计'){
//				$scope.channelTab='1';
//			}else if(obj.title==='媒体统计'){
//				$scope.channelTab='2';
//			}
            for (var i = 0; i < $scope.tabs.length; i++) {
                if (title == $scope.tabs[i].name) {
                    $scope.searchModel.depType = $scope.tabs[i].id;
                    break;
                }
            }
            if ($scope.searchModel.depType == 1) {

            }
            // getMarketSummary();
//			$scope.searchModel.channelType = $scope.channelTab;
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

            for (var i = 0; i < $scope.channels.length; i++) {
                $scope.labelsSummary.push($scope.channels[i].name);
            }

            for (var i = 0; i < grades.length; i++) {
                var data = [];
                for (var j = 0; j < $scope.channels.length; j++) {
                    data.push([]);
                }
                $scope.dataSummary.push(data);
            }


            for (var i = 0; i < $scope.channels.length; i++) {
                for (var j = 0; j < grades.length; j++) {
                    var d = $scope.cellData($scope.channels[i].grades[grades[j]]);
                    $scope.dataSummary[j][i] = d;
                }
            }

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
                    if (segmentData[j].channel == data[i].channel && gradeToSegment(data[i].grade) == segmentData[j].grade) {
                        segment = segmentData[j];
                        break;
                    }
                }
                if (!segment) {
                    segment = {
                        grade: gradeToSegment(data[i].grade),
                        channel: data[i].channel,
                        numberOfOrders: 0,
                        totalAmount: 0.0,
                        averageAmount: 0.0
                    };
                    segmentData.push(segment);
                }
                segment.numberOfOrders += data[i].numberOfOrders;
                segment.totalAmount += data[i].totalAmount;
            }

            for (var i = 0; i < segmentData.length; i++) {
                segmentData[i].averageAmount = segmentData[i].numberOfOrders == 0 ? 0 : (segmentData[i].totalAmount / segmentData[i].numberOfOrders);
            }
            return segmentData;
        }

        function calculateGradeSummary(data) {
            var channels = [];
            for (var i = 0; i < data.length; i++) {

                // 计算每个内部空格的数据
                var channel = null;
                for (var j = 0; j < channels.length; j++) {
                    if (channels[j].name === data[i].channel) {
                        channel = channels[j];
                        break;
                    }
                }
                if (!channel) {
                    channel = {
                        name: data[i].channel,
                        grades: {}
                    };
                    channels.push(channel);
                }
                channel.grades[data[i].grade] = data[i];

            }

            $scope.channels = channels;

            var grades = $scope.viewType == $scope.viewTypes[0] ? $scope.grades : $scope.segments;

            var totalOfChannels = {}; // key 是渠道名，value 是该渠道所有年级的汇总
            for (var i = 0; i < $scope.channels.length; i++) {
                var channel = $scope.channels[i];
                var totalOfNumberOfOrders = 0;
                var totalOfAmounts = 0.0;
                for (var j = 0; j < grades.length && channel.grades[grades[j]]; j++) {
                    totalOfNumberOfOrders += channel.grades[grades[j]].numberOfOrders;
                    totalOfAmounts += channel.grades[grades[j]].totalAmount;
                }
                var averageAmount = totalOfNumberOfOrders == 0 ? 0 : totalOfAmounts / totalOfNumberOfOrders;
                totalOfChannels[channel.name] = {
                    numberOfOrders: totalOfNumberOfOrders,
                    totalAmount: totalOfAmounts,
                    averageAmount: averageAmount
                }
            }
            $scope.totalOfChannels = totalOfChannels;


            var totalOfGrades = {};   // key 是年级名，value 是该年级所有渠道的汇总
            for (var i = 0; i < grades.length; i++) {
                var grade = grades[i];
                var numberOfOrders = 0;
                var totalAmount = 0.0;
                for (var j = 0; j < data.length; j++) {
                    if (data[j].grade === grade) {
                        numberOfOrders += data[j].numberOfOrders;
                        totalAmount += data[j].totalAmount;
                    }
                }
                var averageAmount = numberOfOrders == 0 ? 0 : totalAmount / numberOfOrders;
                totalOfGrades[grade] = {
                    numberOfOrders: numberOfOrders,
                    totalAmount: totalAmount,
                    averageAmount: averageAmount
                };
            }
            $scope.totalOfGrades = totalOfGrades;

            var everythingTotal = {
                numberOfOrders: 0,
                totalAmount: 0.0
            };
            var keys = Object.keys(totalOfChannels);
            for (var i = 0; i < keys.length; i++) {
                everythingTotal.numberOfOrders += totalOfChannels[keys[i]].numberOfOrders;
                everythingTotal.totalAmount += totalOfChannels[keys[i]].totalAmount;
            }
            everythingTotal.averageAmount = everythingTotal.numberOfOrders == 0 ? 0 : everythingTotal.totalAmount / everythingTotal.numberOfOrders;
            $scope.everythingTotal = everythingTotal;

            renderChart();
        }

        $scope.gradeStatisticsSummary = []
        $scope.gradeStatisticsSummaryDetail = []

        function getChannelGradeSummary(name, id) {
            debugger
            $scope.searchModel.startTime = $("#startTime").val() ? $("#startTime").val() : new Date().Format('yyyy-MM-dd');
            $scope.searchModel.endTime = $("#endTime").val() ? $("#endTime").val() : new Date().Format('yyyy-MM-dd');
            var departmentId = $scope.selectdDepartment ? $scope.selectdDepartment.id : $scope.department.id;
            var params = angular.copy($scope.searchModel)
            params.departmentId = departmentId
            if (name) {
                params.isExport = 1
            }
            if ($scope.searchModel.depType) {
                BiGradeOrderService.getChannelGradeSummaryV2(params).then(function (response) {
                    if (name) {
                        // $scope.gradeStatisticsSummaryDetail = response.data.list || []
                        setTimeout(function () {
                            $scope.$parent.exportableV1(name, id,response.data.list || [])
                        }, 1000)
                    } else {
                        $scope.gradeStatisticsSummary = []
                        // $scope.gradeStatisticsSummary = response.data.list || [];
                        for (var i = 0, len = response.data.list.length; i < len && i < 10; i++) {
                            $scope.gradeStatisticsSummary.push(response.data.list[i])
                        }
                        // 导出模板用
                        window.sessionStorage.setItem('__exp__', JSON.stringify(response.data.list || []))
                    }
                });
            } else {
                BiGradeOrderService.getChannelGradeSummary(departmentId, $scope.searchModel.startTime, $scope.searchModel.endTime, $scope.searchModel.depType).then(function (response) {
                    //重置时默认今天的时间
                    $scope.searchModel.startTime=new Date($scope.searchModel.startTime).Format("yyyy-MM-dd");
                    $scope.searchModel.endTime=new Date($scope.searchModel.endTime).Format("yyyy-MM-dd");
                    $scope.originalData = response.data;
                    var calculatedData = $scope.originalData;
                    if ($scope.viewType == $scope.viewTypes[1]) {
                        calculatedData = gradeDataToSegmentData(calculatedData);
                    }
                    calculateGradeSummary(calculatedData);
                });
            }

        }

        $scope.$watch('searchModel.depType', function (newVal) {
            if (newVal) {
                getChannelGradeSummary()
            }
        })

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
            if ($scope.dataType === $scope.dataTypes[0]) {
                return data.numberOfOrders;
            } else if ($scope.dataType === $scope.dataTypes[1]) {
                return data.totalAmount.toFixed(2);
            } else if ($scope.dataType === $scope.dataTypes[2]) {
                return data.averageAmount.toFixed(2);
            } else {
                return 0;
            }
        }

        function channelTotalCellData(channel) {
            var data = $scope.totalOfChannels[channel];
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

        $scope.summaryModel = {};
        try {
            $scope.searchModel.startTime = $scope.searchModel.startTime.Format("yyyy-MM-dd");
            $scope.searchModel.endTime = $scope.searchModel.endTime.Format("yyyy-MM-dd");
        } catch (e) {

        }

        var department = sessionStorage.getItem('com.youwin.yws.department');
        $scope.department = JSON.parse(department);

        $scope.getChannelGradeSummary();
    }
]);
