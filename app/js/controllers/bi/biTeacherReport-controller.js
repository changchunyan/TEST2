'use strict';

/**
 * The biTeacherReport controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiTeacherReportController', [
	'$scope', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiTeacherReportService', 'DepartmentService',
	'AuthenticationService', 'localStorageService',
	function($scope, $modal, $filter, $rootScope, SweetAlert, BiTeacherReportService, DepartmentService,
			AuthenticationService, localStorageService) {

        $scope.generateTeacherConsumeReport = generateTeacherConsumeReport;
        $scope.exportTeacherConsumeReport = exportTeacherConsumeReport;
        $scope.generateSubjectSummaryReport = generateSubjectSummaryReport;
        $scope.exportSubjectSummaryReport = exportSubjectSummaryReport;

        $scope.judgement = judgement;
        $scope.judgementBackgroundColor = judgementBackgroundColor;
        $scope.judgementColor = judgementColor;
        $scope.group = group;
        $scope.lowerAndUpper = lowerAndUpper;
        $scope.isHolidayOrWeekends = isHolidayOrWeekends;

        $scope.searchModel.startTime = $scope.searchModel.startTime.Format("yyyy-MM-dd");
        $scope.searchModel.endTime = $scope.searchModel.endTime.Format("yyyy-MM-dd");

        BiTeacherReportService.getCustomizedDates().then(function(response) {
            $scope.customizedHolidays = response.data.customizedHolidays;
            $scope.customizedWorkdays = response.data.customizedWorkdays;
        });

        $scope.generateTeacherConsumeReport();

        function generateTeacherConsumeReport() {
            if ($scope.searchModel.schoolId != undefined) {
                $scope.searchModel.departmentId = $scope.searchModel.schoolId;
            }
            var startTime = $("#startTime").val() || $scope.searchModel.startTime;
            var endTime = $("#endTime").val() || $scope.searchModel.endTime;
            $scope.searchModel.startTime = startTime;
            $scope.searchModel.endTime = endTime;
            BiTeacherReportService.generateTeacherConsumeReport($scope.searchModel.departmentId, startTime, endTime)
                .then(function(response) {
                    $scope.lowerAndUpperBounds = $scope.lowerAndUpper(startTime, endTime);
                    var data = response.data;
                    data = $scope.group(data);
                    $scope.teacherConsumeReportData = data;
                    $scope.generateSubjectSummaryReport(data);
                });
        }

        function exportTeacherConsumeReport() {
            if ($scope.searchModel.schoolId != undefined) {
                $scope.searchModel.departmentId = $scope.searchModel.schoolId;
            }
            var startTime = $("#startTime").val() || $scope.searchModel.startTime;
            var endTime = $("#endTime").val() || $scope.searchModel.endTime;
            BiTeacherReportService.generateTeacherConsumeReport($scope.searchModel.departmentId, startTime, endTime)
                .then(function(response) {
                    $scope.lowerAndUpperBounds = $scope.lowerAndUpper($("#startTime").val() || $scope.searchModel.startTime, $("#endTime").val() || $scope.searchModel.endTime);
                    var data = response.data;
                    data = $scope.group(data);
                    var statisticsExportTableStyle = {
						sheetid : '教务日常报表',
						headers : true,
						caption : {
							title : startTime + '到' + endTime + '教务消课数据统计',
						},
						column : {
							style : 'font-size:14px; text-align:left;'
						},
						columns : [ {
							columnid : 'groupId',
							title : '组号',
						}, {
							columnid : 'role',
							title : '主管或负责人'
						}, {
							columnid : 'teacherName',
							title : '教师'
						}, {
							columnid : 'subjectGroup',
							title : '科目'
						}, {
							columnid : 'selfStudentNumber',
							title : '本平台学生数'
						}, {
							columnid : 'selfCourseHour',
							title : '本平台优质课时'
						}, {
							columnid : 'otherStudentNumber',
							title : '外平台学生数'
						}, {
							columnid : 'otherCourseHour',
							title : '外平台优质课时'
						}, {
							columnid : 'totalStudentNumber',
							title : '学生总数'
						}, {
							columnid : 'weekdayCourseHour',
							title : '周中正常课时'
						}, {
							columnid : 'weekdayTrialCourseHour',
							title : '周中体验课时'
						}, {
							columnid : 'weekendCourseHour',
							title : '周末正常课时'
						}, {
							columnid : 'weekendTrialCourseHour',
							title : '周末体验课时'
						}, {
							columnid : 'totalTrialCourseHour',
							title : '周体验课时'
						}, {
							columnid : 'weekdayTotalCourseHour',
							title : '周中课时总数'
						}, {
							columnid : 'totalCourseHour',
							title : '课时总数'
						}, {
							columnid : 'judgement',
							title : '数据结论'
						}, {
							columnid : 'trialOrderNumber',
							title : '新签体验单数'
						}, {
							columnid : 'successTrialOrderNumber',
							title : '新签体验成功单数'
						}, {
							columnid : 'employmentType',
							title : '试用期/实习'
						} ],
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
                    }
                    statisticsExportTableStyle.cells = cellsFormat;
                    alasql('SELECT * INTO XLS("教务报表.xls", ?) FROM ?', [ statisticsExportTableStyle, data ]);
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
                }
            }

            groupId += 1;

            var keys = Object.keys(groups);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key != '主管' && key != '其他') {
                    var report = groups[key];
                    var leaderReport = null;
                    for (var j = 0; j < report.length; j++) {
                        report[j].groupId = groupId;
                        result.push(report[j]);
                    }
                    if (leaderReport) {
                        result.splice(0, 0, leaderReport);
                    }
                    groupId += 1;
                }
            }

            groupReport = groups['其他'];
            if (groupReport && groupReport.length > 0) {
                for (var i = 0; i < groupReport.length; i++) {
                    groupReport[i].groupId = groupId;
                    result.push(groupReport[i]);
                }
            }

            return result;
        }

        /**
         * 生成学科组报表。方法执行后将设置 $scope.subjectSummaryReport。
         */
        function generateSubjectSummaryReport(reports) {
            console.log(reports);
            var subjectSummaryReport = {};

            // 首先将所有的条目按学科（初数、高数、初物、高物、化学、英语、语文、其他）分组
            var groups = {};
            for (var i = 0; i < reports.length; i++) {
                var report = reports[i];
                var key = '其他';
                if (report.subject == '数学') {
                  if (report.grade == '小学' || report.grade == '初中') {
                    key = '初数';
                  } else {
                    key = '高数';
                  }
                } else if (report.subject == '物理') {
                  if (report.grade == '初中') {
                    key = '初物';
                  } else {
                    key = '高物';
                  }
                } else if (report.subject == '英语' || report.subject == '语文' || report.subject == '化学') {
                  key = report.subject;
                }

                var group = groups[key];
                if (!group) {
                    group = [];
                    groups[key] = group;
                }
                group.push(report);
            }

            var keys = Object.keys(groups);
            var subjectGroupReports = [];
            for (var i = 0; i < keys.length; i++) {
                var group = groups[keys[i]];
                var groupReport = {
                    name: keys[i],
                    count: group.length,
                    weekdayAverage: 0,
                    average: 0
                };
                for (var j = 0; j < group.length; j++) {
                    groupReport.weekdayAverage += group[j].weekdayTotalCourseHour / group.length;
                    groupReport.average += group[j].totalCourseHour / group.length;
                }
                subjectGroupReports.push(groupReport);
            }

            subjectSummaryReport.subjectGroupReports = subjectGroupReports;

            // ugly : 弄出科目组表头和具体数据
            var subjectThirdLevelHeader = [];
            var subjectData = [];
            var totalTeacherCount = 0;
            var totalCourseHour = 0;
            var totalWeekdayCourseHour = 0;
            var totalTrialCourseHour = 0;
            var totalTrialOrderNumber = 0;
            var totalSuccessTrialOrderNumber = 0;
            var totalTrialTeacherNumber = 0;
            for (var i = 0; i < subjectGroupReports.length; i++) {
                subjectThirdLevelHeader.push('人数');
                subjectThirdLevelHeader.push('周中人均课时数');
                subjectThirdLevelHeader.push('人均课时数');
                subjectData.push(subjectGroupReports[i].count);
                subjectData.push(subjectGroupReports[i].weekdayAverage);
                subjectData.push(subjectGroupReports[i].average);
                totalTeacherCount += subjectGroupReports[i].count;
            }
            for (var i = 0; i < reports.length; i++) {
                totalCourseHour += reports[i].totalCourseHour;
                totalWeekdayCourseHour += reports[i].weekdayTotalCourseHour;
                totalTrialCourseHour += reports[i].totalTrialCourseHour;
                totalTrialOrderNumber += reports[i].trialOrderNumber;
                totalSuccessTrialOrderNumber += reports[i].successTrialOrderNumber;
                if (reports[i].employmentType == '试用') {
                    totalTrialTeacherNumber += 1;
                }
            }
            $scope.subjectThirdLevelHeader = subjectThirdLevelHeader;
            $scope.subjectData = subjectData;
            $scope.totalTeacherCount = totalTeacherCount;
            $scope.totalCourseHour = totalCourseHour;
            $scope.totalWeekdayCourseHour = totalWeekdayCourseHour;
            $scope.totalTrialCourseHour = totalTrialCourseHour;
            $scope.totalTrialOrderNumber = totalTrialOrderNumber;
            $scope.totalSuccessTrialOrderNumber = totalSuccessTrialOrderNumber;
            $scope.totalTrialTeacherNumber = totalTrialTeacherNumber;
            $scope.subjectSummaryReport = subjectSummaryReport;
        }

        function exportSubjectSummaryReport() {
            alasql('SELECT * INTO XLS("学科组汇总表.xls",{headers:true}) FROM HTML("#subjectSummaryReportTable",{headers:true})');
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

    }
]);
