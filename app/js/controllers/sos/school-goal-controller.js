'use strict';

/**
 * 校区目标录入controller
 * @author JeanZhang
 */
angular.module('ywsApp').controller('SchoolGoalController', ['$scope','$modal', 
      '$rootScope','SweetAlert','$routeParams','AuthenticationService','SchoolGoalService',
      function($scope,$modal,$rootScope,SweetAlert,$routeParams,AuthenticationService,SchoolGoalService){
		//方法声明
		$scope.init=init;
		$scope.submit=submit;
		$scope.getPageList=getPageList;
		$scope.preYear=preYear;
		$scope.currentYear=currentYear;
		
		//方法初始化执行
		init();
		
		$scope.months=[
		    {value:1,name:"一月"},
		    {value:2,name:"二月"},
		    {value:3,name:"三月"},
		    {value:4,name:"四月"},
		    {value:5,name:"五月"},
		    {value:6,name:"六月"},
		    {value:7,name:"七月"},
		    {value:8,name:"八月"},
		    {value:9,name:"九月"},
		    {value:10,name:"十月"},
		    {value:11,name:"十一月"},
		    {value:12,name:"十二月"}
		]
			
		//初始化
		function init(){
			$scope.prepareReady=false;
			$scope.searchModel=new Object();
			var now=new Date(); //当前时间
			var nowMonth=now.getMonth(); //当前月
			var nowYear=now.getYear(); //当前年
		    nowYear+=(nowYear<2000)?1900:0;
		    $scope.nowMonth=nowMonth+1;
		    $scope.nowYear=nowYear;
		    $scope.searchModel.goalMonth=nowMonth+1;
			$scope.searchModel.goalYear=nowYear*1;
			var schoolId=AuthenticationService.currentUser().school_id; //校区id
			$scope.searchModel.schoolId=schoolId;
			$scope.prepareReady=true;
		}
		
		/**
		 * 校区业绩提交
		 */
		function submit(){
			SchoolGoalService.addOrUpdate($scope.searchModel).then(function(result){
				if(result>0){
					SweetAlert.swal('插入或更新成功！');
				}else{
					SweetAlert.swal('插入或更新失败！', '请重试', 'error');
				}
				refresh();
			});
		}
		
		//查询校区业绩目标列表
		function getPageList(tableState){
			var goalMonth=$scope.nowMonth;
			if($scope.searchModel.goalMonth!=null){
				goalMonth=$scope.searchModel.goalMonth;
				$scope.searchModel.goalMonth=null;
			}
			$scope.schoolGoalTableState=tableState;
			$scope.pagination=tableState.pagination;
            $scope.searchModel.start=$scope.pagination.start || 0;
            $scope.searchModel.size=$scope.pagination.number || 12;
			SchoolGoalService.getPageList($scope.searchModel).then(function(result){
				$scope.schoolGoals=result.data.list;
				angular.forEach($scope.months, function(data1, index1, array1){
					var isExit=0;
					angular.forEach($scope.schoolGoals, function(data, index, array){
						if(data1.value===data.goalMonth){
							isExit=1;
						}
					});
					if(isExit===0){
						var nullData=new Object();
						nullData.goalMonth=data1.value;
						nullData.marketGoal=null;
						nullData.marketGoalRatio=null;
						nullData.managementGoal=null;
						nullData.managementGoalRatio=null;
						nullData.consumeGoal=null;
						nullData.consumeGoalRatio=null;
						$scope.schoolGoals.push(nullData);
					}
				});
				tableState.pagination.numberOfPages=result.numberOfPages;
				$scope.searchModel.goalMonth=goalMonth;
        	});
		}
		
		/**
		 * 刷新
		 */
		function refresh(){
			var goalMonth=$scope.nowMonth;
			if($scope.searchModel.goalMonth!=null){
				goalMonth=$scope.searchModel.goalMonth;
				$scope.searchModel.goalMonth=null;
			}
			if($scope.searchModel.marketGoal!=null){
				$scope.searchModel.marketGoal=null;
			}
			if($scope.searchModel.managementGoal!=null){
				$scope.searchModel.managementGoal=null;
			}
			if($scope.searchModel.consumeGoal!=null){
				$scope.searchModel.consumeGoal=null;
			}
			$scope.pagination=$scope.schoolGoalTableState.pagination;
            $scope.searchModel.start=$scope.pagination.start || 0;
            $scope.searchModel.size=$scope.pagination.number || 12;
			SchoolGoalService.getPageList($scope.searchModel).then(function(result){
				$scope.schoolGoals=result.data.list;
				angular.forEach($scope.months, function(data1, index1, array1){
					var isExit=0;
					angular.forEach($scope.schoolGoals, function(data, index, array){
						if(data1.value===data.goalMonth){
							isExit=1;
						}
					});
					if(isExit===0){
						var nullData=new Object();
						nullData.goalMonth=data1.value;
						nullData.marketGoal=null;
						nullData.marketGoalRatio=null;
						nullData.managementGoal=null;
						nullData.managementGoalRatio=null;
						nullData.consumeGoal=null;
						nullData.consumeGoalRatio=null;
						$scope.schoolGoals.push(nullData);
					}
				});
				$scope.schoolGoalTableState.pagination.numberOfPages=result.numberOfPages;
				$scope.searchModel.goalMonth=goalMonth;
        	});
		}
		
		/**
		 * 上一年操作
		 */
		function preYear(){
			var currentYear=$scope.searchModel.goalYear
			$scope.searchModel.goalYear=currentYear-1;
			refresh();
		}
		
		/**
		 * 今年操作
		 */
		function currentYear(){
			var nowYear=$scope.nowYear;
			$scope.searchModel.goalYear=nowYear;
			refresh();
		}
		
		//目标录入弹窗
		$scope.goalModal=$modal({
			scope:$scope, 
			templateUrl:'partials/sos/schoolGoal/modal.schoolGoalEntrance.html?'+new Date().getTime(),
			show:true,
			backdrop:"static"
		});
	  }
]);