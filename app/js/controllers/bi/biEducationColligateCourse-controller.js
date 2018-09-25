'use strict';

/**
 * The biEducationColligateCourse controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiEducationColligateCourseController', [
	'$scope', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiEducationColligateCourseService','BiBaseService',
	function($scope, $modal, $filter, $rootScope, SweetAlert, BiEducationColligateCourseService,BiBaseService) {

		// 初始化统计方法
		$scope.getStatistics = getStatistics;					// 默认查询
		$scope.getDataByFilter = getDataByFilter;	            // 统计报表
		$scope.getSummaryByFilter = getSummaryByFilter; 		// 汇总报表
    $scope.exportToExcel = exportToExcel;                   // 导出excel
    $scope.getTabIndex = getTabIndex;

    // 参数定义
		$scope.resultList = {};
		$scope.resultAllList = {};
		$scope.resultAllListNoPage = {};

    $scope.showStudentNumberByGradeModal = showStudentNumberByGradeModal;
    $scope.showTeacherNumberBySubjectModal = showTeacherNumberBySubjectModal;
    $scope.showCourseNumberBySubjectModal = showCourseNumberBySubjectModal;

		//默认展示第一个的tab
		$scope.channelTab = '0';

    if ($scope.searchModel) {
      $scope.searchModel.startTime = $scope.searchModel.startTime.Format('yyyy-MM-dd');
      $scope.searchModel.endTime = $scope.searchModel.endTime.Format('yyyy-MM-dd');
    }

		/**
		 * 切换汇总和明细
		 */
		function getTabIndex(obj){
			if(obj.title==='数据明细表'){
				$scope.channelTab='0';
			}else if(obj.title==='数据汇总表'){
				$scope.channelTab='1';
			}
		}

    if ($scope.searchModel) {
      $scope.searchModel.start = 0;
      $scope.searchModel.size = 10;
      $scope.searchModel.statYear = moment().year();
      $scope.searchModel.statMonth = moment().month();
      BiEducationColligateCourseService.getTeachingManagementPage($scope.searchModel).then(function(result) {
        $scope.resultAllList = result.data.list;
        $scope.isLoading = false;
      });
    }

		//*********************************************统计方法************************************/
		/**
		 * 根据列表状态获取统计数据
		 */
		function getStatistics(tableState){
			//设置表格状态和分页信息
			$scope.statisticsTableState = tableState;
      var time = moment($("#startTime").val());
      $scope.searchModel.statYear = time.year();
      $scope.searchModel.statMonth = time.month() + 1;
			$scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            $scope.searchModel.start = $scope.start;
            $scope.searchModel.size = $scope.number;
            BiEducationColligateCourseService.getTeachingManagementPage($scope.searchModel)
            	.then(function (result) {
                    $scope.resultAllList = result.data.list;
                    tableState.pagination.numberOfPages = result.numberOfPages;
                    $scope.isLoading = false;
                }
            );
		}

		/**
		 * 根据筛选条件获取统计数据
		 */
		function getDataByFilter(){
			$("body").click();
			$scope.searchModel.startTime = $("#startTime").val();
      var time = moment($("#startTime").val());
      $scope.searchModel.statYear = time.year();
      $scope.searchModel.statMonth = time.month() + 1;
			if(!$scope.channelTab || $scope.channelTab==='0'){
				//设置表格状态和分页信息
				$scope.isLoading = true;
				if($scope.statisticsTableState == undefined){
					$scope.start=0;
					$scope.number=10;
				}else{
					$scope.statisticsTableState.pagination.start=0;
					$scope.pagination=$scope.statisticsTableState.pagination;
					$scope.start=$scope.pagination.start || 0;
					$scope.number=$scope.pagination.number || 10;
				}
				$scope.searchModel.start = $scope.start;
				$scope.searchModel.size = $scope.number;
				BiEducationColligateCourseService.getTeachingManagementPage($scope.searchModel)
				.then(function (result) {
					$scope.resultAllList = result.data.list;
					$scope.statisticsTableState.pagination.numberOfPages = result.numberOfPages;
					$scope.isLoading = false;
				});
			}else{
				getSummaryByFilter();
			}
//			BiBaseService.setTimeRange($scope.$parent);
		}

		/**
		 * 查询汇总的数据，根据条件
		 */
		function getSummaryByFilter(){
			$scope.isLoading = true;
			BiEducationColligateCourseService.getSummaryAllList($scope.searchModel)
				.then(function (result) {
					$scope.entity = result.data;
					$scope.isLoading = false;
			});
		}

		/**
		 * 导出excel文件 type 1:统计 2：汇总
		 */
		function exportToExcel(type){
			var exportTableStyle = {
		        sheetid: '教务综合',
		        headers: true,
		        caption: {
		        	title:'教务综合报表',
		        },
		        column: {
		        	style:'font-size:16px; text-align:left;'
		        },
		        columns: [
		          {
		        	  columnid:'schoolName',
		        	  title: '校区',
		        	  width: '100px'
		          },
		          {
		        	  columnid:'schoolTypeName',
		        	  title: '校区类型'
		          },
		          {
		        	  columnid:'schoolAreaName',
		        	  title: '校区归属区域'
		          },
		      	  {
		        	  columnid:'studentCount',
		        	  title:'学生人数'
		      	  },
		      	  {
		      		 columnid:'fullTimeTeacherCount',
		      		 title:'专职教师人数'
		      	  },
		      	  {
		      		 columnid:'partTimeTeacherCount',
		      		 title:'兼职教师人数'
		      	  },
		      	  {
		      		 columnid:'fiveStarTeacherCount',
		      		 title:'五星级教师人数'
		      	  },
		      	  {
		      		  columnid:'probationTeacherCount',
		      		  title:'未转正教师人数'
		      	  },
		      	  {
		      		  columnid:'fullTimeCourseCount',
		      		  title:'专职消耗课时量'},
		          {
		        	  columnid:'partTimeCourseCount',
			      	  title:'兼职消耗课时量'},
			      {
			      	  columnid:'otherSchoolCourseCount',
			      	  title:'其他消课总课时'
			      },
			      {
			      	  columnid:'fullTimeAvgCountNum',
			      	  title:'专职人均课时'
			      },
			      {
			      	  columnid:'partTimeAvgCountNum',
			      	  title:'兼职人均课时'
			      },
			      {
				      columnid:'audtionFullTimeCourseCount',
				      title:'试听专职课时量'},
				  {
					  columnid:'audtionPartTimeCourseCount',
					  title:'试听兼职课时量'},
				  {
					  columnid:'audtionTotalCourseCount',
					  title:'试听总课时量'},
				  {
					  columnid:'audtionSuccessCourseCount',
					  title:'试听成功课时量'},
				  {
					 columnid:'audtionFullTimeSuccessCount',
					 title:'试听专职成功单数'},
				  {
					  columnid:'audtionFullTimeSuccessRatio',
					  title:'试听专职成功率'},
				  {
					  columnid:'audtionPartTimeSuccessCount',
					  title:'试听兼职成功单数'},
				  {
					  columnid:'audtionPartTimeSuccessRatio',
				      title:'试听兼职成功率'},
				 {
					  columnid:'workFullTimeCourse',
					  title:'周中专职'},
				 {
					  columnid:'workFullTimeAudCourse',
					  title:'周中专职试听'},
				 {
					  columnid:'workPartTimeCourse',
					  title:'周中兼职'},
				 {
					  columnid:'workPartTimeAudCourse',
					  title:'周中兼职试听'},
				 {
					  columnid:'weekFullTimeCourse',
					  title:'周末专职'},
				 {
					  columnid:'weekFullTimeAudCourse',
					  title:'周末专职试听'},
				 {
					  columnid:'weekPartTimeCourse',
					  title:'周末兼职'},
				 {
					  columnid:'weekPartTimeAudCourse',
					  title:'周末兼职试听'},
				 {
					  columnid:'continueHourCount',
					  title:'续费小时数'},
				 {
					  columnid:'recommendHourCount',
					  title:'推荐小时数'}

		        ],
		        row: {
		        	style: function(sheet, row, rowidx){
		        		return 'background:'+(rowidx%2?'#E1FFFF':'#F0E68C');
		        	}
		        },
		        cells: {
	                style: 'font-size:13px; text-align:left;'
		       }
		    };
			// 1 代表统计报表 2 代表汇总报表s
			if(type == 1){
				BiEducationColligateCourseService.getAllList($scope.searchModel)
					.then(function (result) {
						$scope.resultAllListNoPage = result.data;
						alasql('SELECT * INTO XLS("教务综合明细表.xls", ?) FROM ?', [exportTableStyle, $scope.resultAllListNoPage]);
				});
			}else if(type == 2){
				var summaryArray = $scope.resultAllList;
				summaryArray.length = 0;
				summaryArray.push($scope.entity);
				alasql('SELECT * INTO XLS("教务综合汇总表.xls", ?) FROM ?', [exportTableStyle, summaryArray]);
			}
		}

    function showStudentNumberByGradeModal(jsonString, title) {
      var sortedGrades = ['小学', '初中', '高中'];
      var studentNumbersMap = JSON.parse(jsonString);
      var numbers = [];
      var total = 0;
      var pieData = [];
      var pieLabels = [];
      for (var i = 0; i < sortedGrades.length; i++) {
        var grade = sortedGrades[i];
        var number = studentNumbersMap[grade];
        if (number) {
          numbers.push({grade: grade, number: number});
          total += number;
          pieData.push(number);
          pieLabels.push(grade);
        } else {
          numbers.push({grade: grade, number: 0});
          pieData.push(0);
          pieLabels.push(grade);
        }
      }


      $scope.numbers = numbers;
      $scope.total = total;
      $scope.modalTitle = title;
      $scope.pieData = pieData;
      $scope.pieLabels = pieLabels;
      $scope.detailModal = $modal({
          scope: $scope,
          templateUrl: 'partials/bi/biEducationColligateCourse/studentNumberByGrade.modal.html?' + new Date().getTime(),
          show: true,
          backdrop: "static"
      });
    }

    function showTeacherNumberBySubjectModal(jsonString, title) {
      var sortedSubjects = ['英语', '语文', '数学', '物理', '化学', '历史', '政治', '地理', '生物', '文综', '理综'];
      var teacherNumbersMap = JSON.parse(jsonString);
      var numbers = [];
      var total = 0;
      var pieData = [];
      var pieLabels = [];
      for (var i = 0; i < sortedSubjects.length; i++) {
        var subject = sortedSubjects[i];
        var number = teacherNumbersMap[subject];
        if (number) {
          numbers.push({subject: subject, number: number});
          total += number;
          pieData.push(number);
          pieLabels.push(subject);
        } else {
          numbers.push({subject: subject, number: 0});
          pieData.push(0);
          pieLabels.push(subject);
        }
      }


      $scope.numbers = numbers;
      $scope.total = total;
      $scope.modalTitle = title;
      $scope.pieData = pieData;
      $scope.pieLabels = pieLabels;
      $scope.detailModal = $modal({
          scope: $scope,
          templateUrl: 'partials/bi/biEducationColligateCourse/teacherNumberBySubject.modal.html?' + new Date().getTime(),
          show: true,
          backdrop: "static"
      });
    }

    function showCourseNumberBySubjectModal(jsonString, title) {
      var sortedSubjects = ['英语', '语文', '数学', '物理', '化学', '历史', '政治', '地理', '生物', '文综', '理综'];
      var teacherNumbersMap = JSON.parse(jsonString);
      var numbers = [];
      var total = 0;
      var barData = [];
      var barLabels = [];
      var barSeries = ['各科平均消课课时'];
      for (var i = 0; i < sortedSubjects.length; i++) {
        var subject = sortedSubjects[i];
        var number = teacherNumbersMap[subject];
        if (number) {
          numbers.push({subject: subject, number: number});
          total += number;
          barData.push(number);
          barLabels.push(subject);
        } else {
          numbers.push({subject: subject, number: 0});
          barData.push(0);
          barLabels.push(subject);
        }
      }


      $scope.numbers = numbers;
      $scope.total = total;
      $scope.modalTitle = title;
      $scope.barData = [];
      $scope.barData.push(barData);
      $scope.barLabels = barLabels;
      $scope.barSeries = barSeries;
      $scope.detailModal = $modal({
          scope: $scope,
          templateUrl: 'partials/bi/biEducationColligateCourse/courseNumberBySubject.modal.html?' + new Date().getTime(),
          show: true,
          backdrop: "static"
      });
    }
	}
]);
