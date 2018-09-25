'use strict';

/**
 * The biTeacherReport controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiTeacherMonthlyReportController', [
	'$scope', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiTeacherReportService', 'DepartmentService',
	'AuthenticationService', 'localStorageService',
	function($scope, $modal, $filter, $rootScope, SweetAlert, BiTeacherReportService, DepartmentService,
			AuthenticationService, localStorageService) {

        $scope.generateTeacherMonthlyConsumeReport = generateTeacherMonthlyConsumeReport;
        $scope.exportTeacherMonthlyConsumeReport = exportTeacherMonthlyConsumeReport;

        $scope.judgement = judgement;
        $scope.judgementBackgroundColor = judgementBackgroundColor;
        $scope.judgementColor = judgementColor;
        $scope.group = group;
        $scope.lowerAndUpper = lowerAndUpper;
        $scope.isHolidayOrWeekends = isHolidayOrWeekends;
        $scope.startOfMonth = startOfMonth;
        $scope.endOfMonth = endOfMonth;
        $scope.nameBackgroundColor = nameBackgroundColor;

        $scope.searchModel.startTime = $scope.searchModel.startTime.Format("yyyy-MM-dd");

        BiTeacherReportService.getCustomizedDates().then(function(response) {
            $scope.customizedHolidays = response.data.customizedHolidays;
            $scope.customizedWorkdays = response.data.customizedWorkdays;
        });

        $scope.generateTeacherMonthlyConsumeReport();

        function generateTeacherMonthlyConsumeReport() {
            if ($scope.searchModel.schoolId != undefined) {
                $scope.searchModel.departmentId = $scope.searchModel.schoolId;
            }
            var startTime = $("#startTime").val() || $scope.searchModel.startTime;
            $scope.searchModel.startTime = $scope.startOfMonth(startTime);
            $scope.searchModel.endTime = $scope.endOfMonth(startTime);
            BiTeacherReportService.generateTeacherConsumeMonthlyReport($scope.searchModel.departmentId, $scope.searchModel.startTime)
                .then(function(response) {
                    $scope.lowerAndUpperBounds = $scope.lowerAndUpper($scope.searchModel.startTime, $scope.searchModel.endTime);
                    var data = response.data;
                    data = $scope.group(data);
                    $scope.teacherConsumeReportData = data;
                });
        }

        function startOfMonth(date) {
            var d = new Date(date);
            return new Date(d.getFullYear(), d.getMonth(), 1).Format('yyyy-MM-dd');
        }

        function endOfMonth(date) {
            var d = new Date(date);
            return new Date(d.getFullYear(), d.getMonth() + 1, 0).Format('yyyy-MM-dd');
        }

        function exportTeacherMonthlyConsumeReport() {
            if ($scope.searchModel.schoolId != undefined) {
                $scope.searchModel.departmentId = $scope.searchModel.schoolId;
            }
            var startTime = $("#startTime").val() || $scope.searchModel.startTime;
            $scope.searchModel.startTime = $scope.startOfMonth(startTime);
            $scope.searchModel.endTime = $scope.endOfMonth(startTime);
            BiTeacherReportService.generateTeacherConsumeMonthlyReport($scope.searchModel.departmentId, $scope.searchModel.startTime)
                .then(function(response) {
                    $scope.lowerAndUpperBounds = $scope.lowerAndUpper($scope.searchModel.startTime, $scope.searchModel.endTime);
                    var data = response.data;
                    data = $scope.group(data);
                    var statisticsExportTableStyle = {
						sheetid : '教务月报',
						headers : true,
						caption : {
							title : startTime.substring(0, 7) + '教务月报',
						},
						column : {
							style : 'font-size:14px; text-align:left;'
						},
						columns : [ {
							columnid : 'groupId',
							title : '序号',
						}, {
							columnid : 'teacherName',
							title : '教师'
						}, {
							columnid : 'subjectGroup',
							title : '科目'
						}, {
							columnid : 'greaterThan4StudentNumber',
							title : '月优质课时大于等于4小时学生数'
						}, {
							columnid : 'studentNumber',
							title : '月上正常课学生数'
						}, {
							columnid : 'weekdayCourseHour',
							title : '月周中正常课时'
						}, {
							columnid : 'weekdayTrialCourseHour',
							title : '月周中体验课时'
						}, {
							columnid : 'weekendCourseHour',
							title : '月周末正常课时'
						}, {
							columnid : 'weekendTrialCourseHour',
							title : '月周末体验课时'
						}, {
							columnid : 'weekdayTotalCourseHour',
							title : '月周中课时总数'
						}, {
							columnid : 'totalCourseHour',
							title : '月课时总数'
						}, {
							columnid : 'judgement',
							title : '数据结论'
						}, {
							columnid : 'trialOrderNumber',
							title : '月新签体验单数'
						}, {
							columnid : 'successTrialOrderNumber',
							title : '月新签体验成功单数'
						}, {
							columnid : 'teacherLevel',
							title : '教师星级'
						}, {
							columnid : 'employmentType',
							title : '是否转正'
						}],
						row : {
							style : function(sheet, row, rowidx) {
                                return '';
							}
						},
					};
                    var cellsFormat = {};
                    for (var i = 0; i < data.length; i++) {
                        var backgroundColor = $scope.judgementBackgroundColor(data[i]);
                        var color = $scope.judgementColor(data[i]);
                        var judgement = $scope.judgement(data[i]);
                        cellsFormat[i] = {};
                        cellsFormat[i][16] = {style: 'background-color:' + backgroundColor + '; color: ' + color + ';'};
                        data[i].judgement = judgement;

                        var nameBackgroundColor = $scope.nameBackgroundColor(data[i]);
                        cellsFormat[i][1] = {style: 'background-color:' + nameBackgroundColor + ';'};
                        cellsFormat[i][2] = {style: 'background-color:' + nameBackgroundColor + ';'};

                        if (!data[i].teacherLevel) {
                            data[i].teacherLevel = '';
                        }
                    }
                    statisticsExportTableStyle.cells = cellsFormat;
                    alasql('SELECT * INTO XLS("教务月报.xls", ?) FROM ?', [ statisticsExportTableStyle, data ]);
                });
        }

        /**
         * 将报表中的教师按照学科组分组。
         * 分组后的结构为：
         * {
               组号 : [
                   { 学科负责人 report },
                   ... // 其他该组成员 report
               ],
                ...
         *  }
         *
         * 1. 按照分组后的数据的顺序返回所有的 report。
         * 2. 返回的数据是分组排序好的数组。
         * 3. 如果 report 中包含非教师岗员工的消课数据，则单独作为一组，排在最前面。
         * 4. 如果 report 中包含不隶属于任何教研组的教师，则单独作为一组，排在最后面。
         */
        function group(reports) {
            var groups = {};
            for (var i = 0; i < reports.length; i++) {
                var report = reports[i];
                var key = report.belongSubjectLeaderId;
                if (!key) {
                    if (report.role === '教师') {
                        key = '其他';
                    } else {
                        key = '主管';
                    }
                }
                var group = groups[key];
                if (!group) {
                    group = [];
                    groups[key] = group;
                }
                if (report.subjectLeader) {
                    report.role = '负责人';
                    group.splice(0, 0, report);
                } else {
                    if (report.role == '教师') {
                        report.role = '';
                    }
                    group.push(report);
                }
            }

            var result = [];
            var groupId = 1;
            var groupReport = groups['主管'];
            if (groupReport && groupReport.length > 0) {
                for (var i = 0; i < groupReport.length; i++) {
                    groupReport[i].groupId = groupId;
                    result.push(groupReport[i]);
                    groupId += 1;
                }
            }


            var keys = Object.keys(groups);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key != '主管' && key != '其他') {
                    var report = groups[key];
                    var leaderReport = null;
                    for (var j = 0; j < report.length; j++) {
                        report[j].groupId = groupId;
                        result.push(report[j]);
                        groupId += 1;
                    }
                    if (leaderReport) {
                        result.splice(0, 0, leaderReport);
                    }
                }
            }

            groupReport = groups['其他'];
            if (groupReport && groupReport.length > 0) {
                for (var i = 0; i < groupReport.length; i++) {
                    groupReport[i].groupId = groupId;
                    result.push(groupReport[i]);
                    groupId += 1;
                }
            }

            for (var i = 0; i < result.length; i++) {
                if (result[i].employmentType == '正式') {
                    result[i].employmentType = '是';
                } else {
                    result[i].employmentType = '否';
                }

            }

            return result;
        }

        /**
         * 根据开始和结束日期计算及格线和饱和线。
         * 及格线的定义：非学生节假日日消课及格线 = 2, 学生节假日日消课及格线 = 10
         * 饱和线的定义：非学生节假日日消课及格线 = 2, 学生节假日日消课及格线 = 10
         *
         * 返回的是一个数组，第一个元素为及格线，第二个元素为饱和线。
         */
        function lowerAndUpper(startDate, endDate) {
            var lower = 0;
            var upper = 0;
            for (var d = Date.parse(startDate); d <= Date.parse(endDate); d += 24 * 3600 * 1000) {
                var dateStr = new Date(d).Format('yyyy-MM-dd');
                if ($scope.isHolidayOrWeekends(dateStr)) {
                    lower += 10;
                    upper += 10;
                } else {
                    lower += 0.8;
                    upper += 2;
                }
            }
            return [lower, upper];
        }

        function judgement(report) {
            var lower = $scope.lowerAndUpperBounds[0];
            var upper = $scope.lowerAndUpperBounds[1];
            if (report.totalCourseHour < lower) {
                return '不及格';
            } else if (report.totalCourseHour == lower) {
                return '及格';
            } else if (report.totalCourseHour > lower && report.totalCourseHour <= upper) {
                return '合理';
            } else {
                return '饱和';
            }
        }

        function judgementBackgroundColor(report) {
            var lower = $scope.lowerAndUpperBounds[0];
            var upper = $scope.lowerAndUpperBounds[1];
            if (report.totalCourseHour < lower) {
                return 'blue';
            } else if (report.totalCourseHour == lower) {
                return 'white';
            } else if (report.totalCourseHour > lower && report.totalCourseHour <= upper) {
                return 'white';
            } else {
                return 'orange';
            }
        }

        function judgementColor(report) {
            var lower = $scope.lowerAndUpperBounds[0];
            var upper = $scope.lowerAndUpperBounds[1];
            if (report.totalCourseHour < lower) {
                return 'white';
            } else if (report.totalCourseHour == lower) {
                return 'black';
            } else if (report.totalCourseHour > lower && report.totalCourseHour <= upper) {
                return 'black';
            } else {
                return 'black';
            }
        }


        function isHolidayOrWeekends(date) {
            if ($scope.customizedHolidays && $scope.customizedHolidays.indexOf(date) >= 0) {
                return true;
            }
            if ($scope.customizedWorkdays && $scope.customizedWorkdays.indexOf(date) >= 0) {
                return false;
            }
            var dateObj = new Date(date);
            if (dateObj.getDay() == 0 || dateObj.getDay() == 6) {
                return true;
            }
            return false;
        }

        function nameBackgroundColor(report) {
            if (report.role == '负责人') {
                return 'lightgreen';
            } else if (report.role != '') {
                return 'lightyellow';
            } else {
                return 'white'
            }
        }
    }
]);
