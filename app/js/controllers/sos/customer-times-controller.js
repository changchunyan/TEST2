'use strict';
/**
 * The Teacher management controller.
 * @author sunqc
 * @version 1.0
 */
angular.module('ywsApp')
    .controller('CustomerTimesController', ['$scope', '$modal', '$rootScope', '$routeParams', '$location','SweetAlert','OrderService',
    function($scope, $modal, $rootScope, $routeParams, $location, SweetAlert,OrderService) {

        var oThis = this;

       /* oThis.getTeacherLists = getTeacherLists;*/
        oThis.isSelectedTeacher = isSelectedTeacher;

        $scope.initDate = _init_date;//子类重置调用此方法
        $scope.selectedPersons = selectedPersons;//此方法 子类调用该方法

        $scope.getLeadsStudentInfoByFilter = getLeadsStudentInfoByFilter;
        $scope.getLeadsStudentInfo = getLeadsStudentInfo;
        $scope.checkedCustomer = checkedCustomer;
        $scope.isChecked = isChecked;

        /**
         * 判断教师是否被选中
         * @param row
         */
        function isSelectedTeacher(row){
           return _isSelected(row);
        }




        /**
         * 此方法 子类调用该方法
         */
        function selectedPersons(){
            $scope.title = '查看学员时间表';
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/coursePlan/modal.selectedCustomer.html', show: true });
        }
        /**
         * 条件查询
         */
        function getLeadsStudentInfoByFilter(){
            $scope.isLoading = true;
            $scope.stuTableState.pagination.start = 0;
            $scope.stuTableState.pagination.number = 10;
            var pagination = $scope.stuTableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            $scope.resultList = {};
            // 条件查询leads 学生 一对多的列表

            //CustomerStudentService.list(start, number, $scope.stuTableState,$scope.myCrmCustomerStudentFilter).then(function (result) {
            $scope.myCrmCustomerStudentFilter.state = 1;
            OrderService.listStudent(start, number, $scope.stuTableState,$scope.myCrmCustomerStudentFilter).then(function (result) {
                $scope.resultList = result.data;
                $scope.stuTableState.pagination.numberOfPages = result.numberOfPages;
                $scope.isLoading = false;
            });

        }

        $scope.myCrmCustomerStudentFilter = {};
        function getLeadsStudentInfo(tableState){
            $scope.isLoading = true;
            $scope.stuTableState = tableState;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            $scope.resultList = {};
            // 展示学员列表
                $scope.myCrmCustomerStudentFilter = {};
                $scope.myCrmCustomerStudentFilter.state = 1;
                OrderService.listStudent(start, number, $scope.stuTableState,$scope.myCrmCustomerStudentFilter).then(function (result) {

                    $scope.resultList = result.data;
                    $scope.stuTableState.pagination.numberOfPages = result.numberOfPages;
                    $scope.isLoading = false;
                });
        }
        function checkedCustomer(row){
            //初始化
            $scope.selected.persons = [];
            $scope.selected.personsName = [];

            Array.prototype.push.call($scope.selected.persons,row);
            Array.prototype.push.call($scope.selected.personsName,row.name);
            $scope.selected.personsNameShow = $scope.selected.personsName.toString();
            if($scope.modal){
                $scope.modal.hide();
            }

        }
        function isChecked(row){
            for(var i=0;i<$scope.selected.persons.length;i++){
                if($scope.selected.persons[i].crm_student_id == row.crm_student_id){
                    return true;
                }
            }
            return false;
        }


        /**
         * 初始化参数
         * @private
         */
        function _init_date(){
            $scope.selected ={
                persons:[]//查询teacher列表
                ,personsName:[]//查询回显teacher列表
                ,personsNameShow:''
                ,timeLists:[]//显示时间
                ,isShowAm:true//是否显示上午
                ,isShowPm:true//是否显示下午
                ,isShowNight:true//是否显示晚上
                ,isShowPlanTimes:true//是否显示已排时间
                ,isShowNotPlanTimes:true//是否显示未排时间
                ,isWeekShow:true//是否按周显示  “isDayShow”与“isWeekShow”互斥
                ,isDayShow:false//是否按天显示  “isDayShow”与“isWeekShow”互斥
                ,dayShowOfWeek:1//按天显示 选择星期几，默认是星期一
                ,isSelectedData:false//是否有查询数据
                ,selectedType:2//1 表示教师查询   2 表示学生查询
            };
        }

        /**
         * 返回
         */
        $scope.back = function(){
            if($scope.backFlag){
            	if($scope.backFlag == "backToCustomer"){
            		//返回排课消课管理列表
            		$location.path("/sos-admin/customer_student");
            	}
            	else if($scope.backFlag == "backToPlan"){
            		//返回学员列表
            		$location.path("/sos-admin/course_plan");
            	}
            }
        }

        ;(function init(){
            _init_date();//初始化参数
            $scope.backFlag = $routeParams.flag;//backToPlan表示返回排课消课管理列表;backToCustomer表示返回学员列表
            var path = $location.absUrl();
            if( path.indexOf("sos-admin/customer_times_id") > 0 ){
                $scope.checkedCustomer({
                    userId: $routeParams.id,
                    name:$routeParams.name
                })
            }
        })();
    }
])
   ;
