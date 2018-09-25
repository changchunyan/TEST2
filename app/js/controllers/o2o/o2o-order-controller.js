/**
 * Created by 毅 on 2015/11/5.
 */
'use strict';
/**
 * The order management controller.
 * @author sunqc
 * @version 1.0
 */
var ywsApp = angular.module('ywsApp');
    ywsApp.controller('O2oOrderManagementController',
        ['$scope', '$modal', '$rootScope', 'SweetAlert','OrderService','O2oOrderManagementService','LeadsStudentService','BaseO2oService',
    function($scope, $modal, $rootScope, SweetAlert,OrderService,O2oOrderManagementService,LeadsStudentService,BaseO2oService) {
        //$scope.saveOrder = saveOrder;
        var oThis = this;
        $scope.view = {
            isEdit:false
        };
        $scope.isLoading = false;
        $scope.isEditOrDetail = false;

        $scope.orderListFilter = {};//课程订单列表过滤条件
        $scope.getOrderListController = getOrderListController;

        $scope.couponListFilter = {};//订单列表过滤条件
        $scope.getCouponsListController = getCouponsListController;

        $scope.updateCoursePlanStateController = updateCoursePlanStateController;
        $scope.addOrderModalShow = addOrderModalShow;
        $scope.editOrderModalShow = editOrderModalShow;
        $scope.detailOrderModal = detailOrderModal;
        $scope.deleteOrderModalShow = deleteOrderModalShow;
        $scope.planCoursesShow = planCoursesShow;
        $scope.listeningCoursesShow = listeningCoursesShow;
        $scope.getCoursesByTeacherId = getCoursesByTeacherId;
        $scope.getCoursesTypeByTeacherId = getCoursesTypeByTeacherId;
        $scope.searchTeachers = searchTeachers;
        $scope.submitUpdateOrder = submitUpdateOrder;
        $scope.submitAddOrder = submitAddOrder;
        $scope.getEmployeesByFilters = getEmployeesByFilters;
        $scope.modalSubmit = modalSubmit;
        $scope.callOrderCourses = callOrderCourses;
        $scope.changOrderCourseStatus = changOrderCourseStatus;





        $scope.isEditModalInput = isEditModalInput;

        $scope.coursesType = [];
        $scope.courses = [];
        $scope.order = {};//存放被选中的order
        $scope.showType = 0;//1 表示修改  2 表示添加  0 表示显示

        $scope.orderStatusSELECT = [{name:'待支付',id:1},{name:'进行中',id:3},{name:'已关闭',id:12},{name:'已完成',id:8},{name:'退款中',id:10},{name:'已退款',id:9}];
        //$scope.orderStatusSELECT = [{name:'待支付',id:1},{name:'进行中',id:2},{name:'已关闭',id:3},{name:'已完成',id:4},{name:'退款中',id:5},{name:'已退款',id:6}];
        $scope.genderSELECT = [{name:'男',id:true},{name:'女',id:false},{name:'男',id:1},{name:'女',id:0}];
        $scope.classTypeSELECT =  [{name:'老师上门',id:1},{name:'学生到店',id:2},{name:'选择校区',id:3},{name:'协商地点'}];
        $scope.orderStatusSelect = [{name:'待支付',id:1},{name:'已付款',id:2},{name:'已取消',id:3}];
        $scope.orderCardTypeSelect = [{name:'状元卡',id:1},{name:'榜眼卡',id:2}];
        $scope.orderCourseStatusSelect = [{name:'老师待反馈',id:0},{name:'学生待确认课时',id:1},{name:'学生待评价',id:2},{name:'学管待审核',id:3},{name:'学管审核结束',id:4},{name:'（YWS专用）系统定时消除排课',id:5}];

        oThis.copyAttrToModalShow = copyAttrToModalShow;
        oThis.getOrderCoursesController = getOrderCoursesController;

        oThis.tableState = {};

       /* (function init(){
            ;
            $scope.isEditModalInput();
        })();*/

        $scope.view.ifPlanCourse = function(order){//订单状态为“进行中”时才能进行排课
            if(order.orderStatus == 3){
                return true;
            }
            return false;
        };


        function getOrderListController(tableState){
            $scope.isLoading = true;
            oThis.tableState = tableState;

            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            O2oOrderManagementService.getOrderListService(start, number,del_null_attr($scope.orderListFilter) ).then(function (result) {
                $scope.oneOrders = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.isLoading = false;
            });
        }
        function getCoursesTypeByTeacherId(id){
            O2oOrderManagementService.getCoursesTypeByTeacherId(id).then(function (result) {
                $scope.coursesType1 = result.data;

            });
        }
        function getCoursesByTeacherId(id){
            O2oOrderManagementService.getCoursesByTeacherId(id).then(function (result) {
                $scope.courses1 = result.data;
            });
        }
        function modalSubmit(){
            $scope.isLoading = true;
            if($scope.showType == 1){//1 表示修改  2 表示添加  0 表示显示)
                $scope.submitUpdateOrder();
            }else if($scope.showType == 2) {//1 表示修改  2 表示添加  0 表示显示)
                $scope.submitAddOrder();
            }
        }
        function submitUpdateOrder(){
            O2oOrderManagementService.updateOrderService($scope.order).then(function (result) {
                SweetAlert.swal('操作成功');
                $scope.isLoading = false;
                $scope.editOrderModal.hide();
                getOrderListController(oThis.tableState);

            });
        }
        function submitAddOrder(){
            O2oOrderManagementService.addOrderService($scope.order).then(function (result) {
                $scope.courses1 = result.data;

                SweetAlert.swal('操作成功');
                $scope.isLoading = false;
                $scope.addOrderModal.hide();
                getOrderListController(oThis.tableState);
            });
        }
        function addOrderModalShow(){
            $scope.modalTitle = '添加';
            $scope.order = {};
            $scope.showType = 2;//1 表示修改  2 表示添加  0 表示显示
            $scope.addOrderModal = $modal({scope: $scope, templateUrl: 'partials/o2o/order/modal.detailOrder.html', show: true });
            $scope.isEditOrDetail = true;
        }
        function changOrderCourseStatus(obj){
            var data ={
                state:obj.state,
                coursePlanId:obj.coursePlanId
            };
            $scope.updateCoursePlanStateController(data);
        }



        function deleteOrderModalShow(order){
            SweetAlert.swal({ title: "你确定删除?",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: '取消',
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定!",
                    closeOnConfirm: true
                },
                function(isConfirm){
                    if(isConfirm){
                        O2oOrderManagementService.deleteOrderService(order).then(function (result) {
                              //result.data;
                            getOrderListController(oThis.tableState);
                        });
                    }
                }
            );
        }
        function getCouponsListController(tableState){
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            O2oOrderManagementService.getCouponsListService(start, number, $scope.couponListFilter).then(function (result) {
                $scope.oneCoupons = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.isLoading = false;
            });
        }
        function editOrderModalShow(obj){
            obj.contractStartDate = new Date(obj.contractStartDate);
            obj.contractEndDate = new Date(obj.contractEndDate);
            $scope.order = angular.copy(obj);
            $scope.showType = 1;//1 表示修改  2 表示添加  0 表示显示
            oThis.copyAttrToModalShow(obj);
            $scope.isShowSubmit = {display:''};
            $scope.modalTitle = '编辑';

            $scope.editOrderModal = $modal({scope: $scope, templateUrl: 'partials/o2o/order/modal.detailOrder.html', show: true });

            $scope.isEditOrDetail = true;
        }
        function planCoursesShow(order){
            planCoursesBase(order,6,'排课',false);
        }
        function listeningCoursesShow(order){
            planCoursesBase(order,5,'试听',true);
            //coursePlanParams.isListening = true;
        }
        function planCoursesBase(order,type,title,isListening){
            $scope.order = angular.copy(order);
			$scope.order.type=type;
            //;alert("剩余课时数量"+$scope.order.courseNum);alert("总课时数量"+$scope.order.originalNum);alert("可排课课时"+$scope.order.planAvailableNum);alert($scope.order.type);
            // 排课所需的参数对象
            coursePlanParams = {
                "teacherID": $scope.order.teacherId,
                "type":$scope.order.type,
                "teacherName":$scope.order.teacherName,
                "schoolID":$scope.order.schoolId,
                "subjectID":$scope.order.courseId,
                "gradeID":'',
                "studentID":$scope.order.crmStudentId,
                "studentName":$scope.order.name,
                "groupID":'',
                "classTime":$scope.order.originalNum,
                "donateCourseNum":$scope.order.donateCourseNum,
                "destroyTime":$scope.order.courseNum,
                "ordcourseID":$scope.order.orderCourseId,//当前为传来
                "course_num":$scope.order.originalNum,
                "plan_available_num":$scope.order.planAvailableNum,
                "isListening":isListening
            };
            $scope.modalTitle = title;
            $scope.editOrderModal = $modal({scope: $scope, templateUrl: 'partials/o2o/order/modal.planCourses.html', show: true });
            //console.log($scope.editOrderModal);
        }
        /*function isEditModalInput(){
            if(typeof($scope.showType)!="undefined"&&$scope.showType!=null){
                if($scope.showType == 0){
                    return false;
                }else{
                    return true;
                }
            }else{
                return false;
            }

        }*/
        function updateCoursePlanStateController(obj){
            O2oOrderManagementService.updateCoursePlanStateService(obj).then(function (result) {
                SweetAlert.swal('操作成功');
               /* $scope.editOrderModal.hide();
                getOrderListController(oThis.tableState);*/
            });
        }

        function detailOrderModal(obj) {
            obj.contractStartDate = new Date(obj.contractStartDate);
            obj.contractEndDate = new Date(obj.contractEndDate);
            $scope.showType = 0;//1 表示修改  2 表示添加  0 表示显示
            $scope.isShowSubmit = {display:'none'};

            $scope.order = angular.copy(obj);
            oThis.copyAttrToModalShow(obj);
            $scope.modalTitle = '查看';
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/o2o/order/modal.detailOrder.html', show: true });
        }
        function copyAttrToModalShow(obj){
            $scope.coursesType1 = [{typeName:obj.courseTypeName,id:obj.courseTypeId}];
            $scope.courses1 = [{name:obj.courseName,id:obj.courseId}];
           /* if(!$scope.gender){
                $scope.order.gender = 3;
            }*/
          /*  if($scope.gender){
                $scope.order.gender = 0;
            }else{
                $scope.order.gender = 1;
            }*/
        }
        function searchTeachers(){
            $scope.modalTitle = '查询';
            $scope.modalSelectTeacher = $modal({scope: $scope, templateUrl: 'partials/o2o/order/modal.searchTeachers.html', show: true });
        }
        $scope.schoolCrmLeadsStudentFilter = {};
        $scope.schoolCrmLeadsStudentListTableState = {};
        $scope.getLeadsList = function getLeadsList(tableState) {
            $scope.schoolCrmLeadsStudentListTableState = tableState;
            $scope.isSchoolLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            BaseO2oService.getTeacherByFilters(start, number, tableState,$scope.schoolCrmLeadsStudentFilter).then(function (result) {
                $scope.CrmLeadsStudentList  = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;
                $scope.schoolCrmLeadsStudentListTableState = tableState;
                $scope.isSchoolLoading = false;
            });
        };
        $scope.selectTransferLeads =function(obj){
            $scope.order.teacherName = obj.user.name;
            $scope.order.teacherId = obj.user.id;
            $scope.modalSelectTeacher.hide();
            $scope.getCoursesTypeByTeacherId($scope.order.teacherId);
            $scope.getCoursesByTeacherId($scope.order.teacherId);
        };
        function isEditModalInput(){
            if(typeof($scope.showType)!="undefined"&&$scope.showType!=null){
                if($scope.showType == 0){
                    $scope.view.isEditView = false;
                    return false;
                }else{
                    $scope.view.isEditView = true;
                    return true;
                }
            }else{
                $scope.view.isEditView = true;
                return true;
            }

        }
        /**
         * Get employee list by filter.
         * @param flag refer to
         */
        function getEmployeesByFilters(){
            $scope.isLoading = true;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            //console.log('Get employee role by filter: ' + JSON.stringify($scope.employee));
            var promise = EmployeeService.getEmployeesByFilters($scope.temp,$scope.start, $scope.number);
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    var result = {};
                    result.data = response.data.list;
                    result.numberOfPages = response.data.pages
                    if(flag == 0){
                        $scope.employees = result.data;
                        $scope.gsTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.isLoading = false;
                    }
                    else{
                        $scope.dimissionEmployees = result.data;
                        $scope.gdTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.isLoading = false;
                    }
                }
            }, function(error) {
            });
        }


        /* 会员卡订单管理 */
        $scope.addMembershipCardOrderModalShow = function addMembershipCardOrderModalShow(){
            $scope.modalTitle = '添加';
            $scope.order = {};
            $scope.showType = 2;//1 表示修改  2 表示添加  0 表示显示
            $scope.membershipCardOrderModal = $modal({scope: $scope, templateUrl: 'partials/o2o/order/modal.membershipCard.html', show: true });
            $scope.isEditOrDetail = true;
        };
        $scope.editMembershipCardOrderModalShow = function editMembershipCardOrderModalShow(obj){
            obj.contractStartDate = new Date(obj.contractStartDate);
            obj.contractEndDate = new Date(obj.contractEndDate);
            $scope.order = angular.copy(obj);
            $scope.showType = 1;//1 表示修改  2 表示添加  0 表示显示
            $scope.isShowSubmit = {display:''};
            $scope.modalTitle = '编辑';
            $scope.membershipCardOrderModal = $modal({scope: $scope, templateUrl: 'partials/o2o/order/modal.membershipCard.html', show: true });
            $scope.isEditOrDetail = true;
        };
        $scope.deleteMembershipCardOrderModalShow = function deleteMembershipCardOrderModalShow(order){
            SweetAlert.swal({   title: "你确定删除?",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: '取消',
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定!",
                    closeOnConfirm: false
                },
                function(isConfirm){
                    if(isConfirm){
                        O2oOrderManagementService.deleteOrderService($scope.order).then(function (result) {
                            //result.data;
                        });
                    }
                }
            );
        };

        $scope.modalMembershipCardSubmit = function modalMembershipCardSubmit(){
            if($scope.showType == 1){//1 表示修改  2 表示添加  0 表示显示)
                O2oOrderManagementService.updateMembershipCardOrderService($scope.order).then(function (result) {
                    SweetAlert.swal('操作成功');
                    $scope.membershipCardOrderModal.hide();
                });
            }else if($scope.showType == 2) {//1 表示修改  2 表示添加  0 表示显示)
                O2oOrderManagementService.addMembershipCardOrderService($scope.order).then(function (result) {
                    SweetAlert.swal('操作成功');
                    $scope.membershipCardOrderModal.hide();
                });
            }
        };


        function callOrderCourses(){
            oThis.getOrderCoursesController();
        }

        function getOrderCoursesController(){
            O2oOrderManagementService.getOrderCoursesService($scope.order).then(function (result) {
                $scope.orderCourses = result.data;

            });
        }

    }
]);
    ywsApp.controller('O2OOrderDetailController2',
        ['$scope', '$modal', '$rootScope', 'SweetAlert','OrderService','O2oOrderManagementService',
            function($scope, $modal, $rootScope, SweetAlert,OrderService,O2oOrderManagementService) {//注：LeadsStudentService为伪造老师查询
                $scope.orderTypeSelect = [{name:'新签',id:1},{name:'续费',id:2},{name:'返课',id:3}];

                var oThis = this;

                 (function init(){
                  ;
                 $scope.isEditModalInput();
                 })();

                var isEditOrDetail = $scope.isEditOrDetail;


            }
        ]
    );
