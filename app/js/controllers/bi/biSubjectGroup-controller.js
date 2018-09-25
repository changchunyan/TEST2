'use strict';

/**
 * The biTeacherReport controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiSubjectGroupController', [
	'$scope', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiTeacherReportService', 'DepartmentService',
	'AuthenticationService', 'localStorageService',
	function ($scope, $modal, $filter, $rootScope, SweetAlert, BiTeacherReportService, DepartmentService,
		AuthenticationService, localStorageService) {
		$scope.generateSubjectGroup = generateSubjectGroup;
		$scope.searchModel.startTime = $scope.searchModel.startTime.Format("yyyy-MM-dd");
		$scope.searchModel.endTime = $scope.searchModel.endTime.Format("yyyy-MM-dd");

		$scope.generateSubjectGroup();
		/**
		 * 生成学科组汇总表
		 */
		function generateSubjectGroup() {
			$scope.start = 0;
			$scope.number = 0;
			$scope.searchModel.start = $scope.start;
			$scope.searchModel.size = $scope.number;
			var startTime = $("#startTime").val() || $scope.searchModel.startTime;
			var endTime = $("#endTime").val() || $scope.searchModel.endTime;
			$scope.searchModel.startTime = startTime;
			$scope.searchModel.endTime = endTime;
			if ($scope.searchModel.schoolId != undefined) {
				$scope.searchModel.departmentId = $scope.searchModel.schoolId;
			}
			BiTeacherReportService.generateSubjectGroupReport($scope.searchModel).then(function (result) {
				if (result != null && result.data != null) {
					var groups = {};
					var subjectThirdLevelHeader = [];
					//生成表头
					for (var i = 0; i < result.data.length; i++) {
						var departmentInfos = result.data[i];
						var biSubjectGroupReports = departmentInfos.biSubjectGroupReports;
						if (biSubjectGroupReports != null && biSubjectGroupReports.length > 0) {
							for (var j = 0; j < biSubjectGroupReports.length; j++) {
								var key = biSubjectGroupReports[j].name;
								var group = groups[key];
								if (!group) {
									groups[key] = {};
									subjectThirdLevelHeader.push('人数');
									subjectThirdLevelHeader.push('周中人均课时数');
									subjectThirdLevelHeader.push('人均课时数');
								}
							}
						}
					}
					var subjectGroupReports = [];
					for (var key in groups) {
						subjectGroupReports.push(key);
					}

					//数据处理
					for (var i = 0; i < result.data.length; i++) {
						var departmentInfos = result.data[i];
						var subjectGroupDetail = [];
						var biSubjectGroupReports = departmentInfos.biSubjectGroupReports;
						//计算各个学科组的数据
						for (var key in groups) {
							var weekdayAverage = 0;
							var teacherCount = 0;
							var average = 0;
							if (biSubjectGroupReports != null && biSubjectGroupReports.length > 0) {
								for (var j = 0; j < biSubjectGroupReports.length; j++) {
									if (biSubjectGroupReports[j].name == key) {
										teacherCount = biSubjectGroupReports[j].teacherCount;
										if (teacherCount != 0) {
											weekdayAverage = ((parseFloat(biSubjectGroupReports[j].weekdayCourseHour) + parseFloat(biSubjectGroupReports[j].weekdayTrialCourseHour)) / biSubjectGroupReports[j].teacherCount).toFixed(2);
											average = ((parseFloat(biSubjectGroupReports[j].weekdayCourseHour) + parseFloat(biSubjectGroupReports[j].weekendCourseHour) + parseFloat(biSubjectGroupReports[j].weekdayTrialCourseHour) + parseFloat(biSubjectGroupReports[j].weekendTrialCourseHour)) / biSubjectGroupReports[j].teacherCount).toFixed(2);
										}
									}
								}
							}
							subjectGroupDetail.push(teacherCount);
							subjectGroupDetail.push(weekdayAverage);
							subjectGroupDetail.push(average);
						}
						departmentInfos.subjectGroupDetail = subjectGroupDetail;

						//计算总数据
						var totalCourseHour = 0;
						var weekdayTotalCourseHour = 0;
						var averageTotalCourseHour = 0;
						var averageWeekdayTotalCourseHour = 0;
						var trialCourseHour = 0;
						if (biSubjectGroupReports != null && biSubjectGroupReports.length > 0) {
							for (var j = 0; j < biSubjectGroupReports.length; j++) {
								totalCourseHour = totalCourseHour + parseFloat(biSubjectGroupReports[j].weekdayCourseHour)
									+ parseFloat(biSubjectGroupReports[j].weekendCourseHour)
									+ parseFloat(biSubjectGroupReports[j].weekdayTrialCourseHour)
									+ parseFloat(biSubjectGroupReports[j].weekendTrialCourseHour);
								weekdayTotalCourseHour = weekdayTotalCourseHour + parseInt(biSubjectGroupReports[j].weekdayCourseHour)
									+ parseFloat(biSubjectGroupReports[j].weekdayTrialCourseHour);
								trialCourseHour = trialCourseHour + parseFloat(biSubjectGroupReports[j].weekdayTrialCourseHour)
									+ parseFloat(biSubjectGroupReports[j].weekendTrialCourseHour);
							}
						}
						if (departmentInfos.teacherCount != 0) {
							averageTotalCourseHour = (totalCourseHour / departmentInfos.teacherCount).toFixed(2);
							averageWeekdayTotalCourseHour = (weekdayTotalCourseHour / departmentInfos.teacherCount).toFixed(2);
						}
						departmentInfos.averageTotalCourseHour = averageTotalCourseHour;
						departmentInfos.averageWeekdayTotalCourseHour = averageWeekdayTotalCourseHour;
						if (totalCourseHour != 0) {
							totalCourseHour = totalCourseHour.toFixed(2);
						} else {
							totalCourseHour = 0;
						}
						departmentInfos.totalCourseHour = totalCourseHour;
						if (weekdayTotalCourseHour != 0) {
							weekdayTotalCourseHour = weekdayTotalCourseHour.toFixed(2);
						} else {
							weekdayTotalCourseHour = 0;
						}
						departmentInfos.weekdayTotalCourseHour = weekdayTotalCourseHour;

						if (trialCourseHour != 0) {
							trialCourseHour = trialCourseHour.toFixed(2);
						} else {
							trialCourseHour = 0;
						}
						departmentInfos.trialCourseHour = trialCourseHour;

						var successOrderRatio = 0;
						if (departmentInfos.trialOrderNumber != 0) {
							successOrderRatio = (departmentInfos.successTrialOrderNumber / departmentInfos.trialOrderNumber).toFixed(4);
						}
						departmentInfos.successOrderRatio = successOrderRatio;
					}
					$scope.subjectGroupReports = subjectGroupReports;
					$scope.subjectThirdLevelHeader = subjectThirdLevelHeader;
					$scope.subjectGroupInfos = result.data;
				} else {
					$scope.subjectGroupReports = {};
					$scope.subjectThirdLevelHeader = {};
					$scope.subjectGroupInfos = {};
				}
			});
		}
	}
]);
