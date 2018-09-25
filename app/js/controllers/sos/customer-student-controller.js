'use strict';

/**
 * 学生客户
 * @author zhangyf@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp')
    .controller('CustomerStudentController', ['$scope', '$http', '$location', '$timeout', '$routeParams', 'CustomerStudentService',
        'CustomerStudentGroupService', 'CommonService', '$modal', '$filter', 'LeadsStudentService',
        '$rootScope', 'SweetAlert', 'InvitationRemindService', 'InvitationCommunicationService',
        'InvitationDetailService', 'OrderService', 'CoursePlanService', 'fileReader', 'BaseO2oService',
        'localStorageService', 'CustomerStudentCourseService', 'AuthenticationService', 'DepartmentService',
        '$interval', 'CrmChargingSchemeService', '$mtModal', 'StuDetail', 'ClassStudentAttendenceService',
        'ClassManagementService', 'ClassStudentRecordService',
        function ($scope, $http, $location, $timeout, $routeParams, CustomerStudentService, CustomerStudentGroupService, CommonService,
            $modal, $filter, LeadsStudentService, $rootScope, SweetAlert, InvitationRemindService, InvitationCommunicationService,
            InvitationDetailService, OrderService, CoursePlanService, fileReader, BaseO2oService, localStorageService,
            CustomerStudentCourseService, AuthenticationService, DepartmentService, $interval, CrmChargingSchemeService, $mtModal,
            StuDetail, ClassStudentAttendenceService, ClassManagementService, ClassStudentRecordService) {

            $scope.auditTransferOrderBackNew = auditTransferOrderBackNew;
            $scope.chargeOrder = chargeOrder;
            $scope.chargeOrderTopup = chargeOrderTopup;
            $scope.editOrder = editOrder;
            $scope.editOrderTopup = editOrderTopup;
            $scope.auditOrder = auditOrder;
            $scope.auditOrderTopup = auditOrderTopup;
            $scope.chargeBackOrder = chargeBackOrder;
            $scope.chargeBackOrderTopup = chargeBackOrderTopup;
            $scope.allPayOrder = allPayOrder;
            $scope.allPayOrderTopup = allPayOrderTopup;
            $scope.refund = refund;
            $scope.onclicktabtwo = onclicktabtwo;
            $scope.orderNo;
            $scope.order = {};
            $scope.orderSearch = {};
            $scope.orderDetailTopUp = {};
            $scope.orderDetailTopUp.achievementRatios = [];
            $scope.studentId = 0;
            $scope.studentName = '';
            $scope.addrecevicheck = addrecevicheck;
            $scope.okonclick = false;
            $scope.onceinyable = true;
            $scope.allsorcecon = true;
            $scope.allnoeffecttag = false;

            $http
                .get(hr_server + "departments/queryById?departmentId=" + localStorageService.get("school_id") + "&organizationId=1")
                .success(function (response) {
                    if (response.status == "SUCCESS") {
                        // console.log(response);
                        $scope.isUseEContract = response.data.isUseEContract;
                    }
                });

            //详情页面修改开始
            $scope.addtaoyue = function addtaoyue(detail) {
                $scope.CrmInvitationDetailVoForCreate = {};
                $scope.CrmInvitationDetailVoForCreate.personState = '2';
                $scope.CrmInvitationDetailVoForCreate.personType = '1';
                $scope.CrmInvitationDetailVoForCreate.personId = detail.crm_student_id;
                //默认内容为1，时间为今天
                $scope.CrmInvitationDetailVoForCreate.invitationContentType = 1;
                $scope.CrmInvitationDetailVoForCreate.viewTime = new Date();
                $scope.CrmInvitationDetailVoForCreate.visitContentType = 1;

                if (!$scope.laifangyaoyuecheck) {

                    // $scope.CrmInvitationDetailVoForCreate.id=crmInvitationDetail.referenceId;
                    // $scope.CrmInvitationDetailVoForCreate.personId=$scope.detailnew.crm_student_id
                    // $scope.CrmInvitationDetailVoForCreate.type=2;
                    // $scope.CrmInvitationDetailVoForCreate.invitateTime = crmInvitationDetail.invitate_time
                    // $scope.laifangeditcontent=crmInvitationDetail.visit_content_type;
                    // $scope.CrmInvitationDetailVoForCreate.invitationContentType = crmInvitationDetail.invitation_content_type;
                    // $scope.CrmInvitationDetailVoForCreate.viewTime =crmInvitationDetail.receive_time;
                    // $scope.CrmInvitationDetailVoForCreate.flaglink =crmInvitationDetail.receive_time;
                    // $scope.CrmInvitationDetailVoForCreate.receiveTime=crmInvitationDetail.receive_time;

                    if ($scope.arrrepeat.referenceId) {
                        $scope.aaaaa.id = $scope.arrrepeat.referenceId;
                    }
                    $scope.aaaaa.personId = $scope.arrrepeat.crm_student_id
                    $scope.aaaaa.type = 2;
                    $scope.aaaaa.invitateTime = $scope.arrrepeat.invitate_time
                    $scope.aaaaa.invitationContentType = $scope.arrrepeat.invitation_content_type
                    $scope.aaaaa.receiveTime = $scope.arrrepeat.receive_time
                    $scope.aaaaa.invitate_time = $scope.arrrepeat.invitate_time
                    $scope.aaaaa.viewTime = $scope.arrrepeat.receive_time
                    $scope.aaaaa.visitContentType = $scope.arrrepeat.invitation_content_type
                    $scope.nochangesort = {}
                    $scope.nochangesort.receiveTime = $scope.arrrepeat.receive_time
                    $scope.nochangesort.viewTime = $scope.arrrepeat.receive_time
                    $scope.nochangesort.invitationContentType = $scope.arrrepeat.invitation_content_type
                }
                //默认结束

                $scope.CrmInvitationDetailVoForCreate.isinside = '1';
                $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date();
                //$scope.CrmInvitationDetailVoForCreate.receiveTime =(new Date()).Format("yyyy-M-d h:m:s");
                $scope.modalTitle = '添加邀约/到访记录';
                $scope.detail = angular.copy(detail);
                $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date().Format("yyyy-MM-dd");

                $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/sos/invitationDetail/addyaoyue1.html', show: true });
            }

            $scope.updatezhifanig = function (crmInvitationDetail, type) {
                if (type == 3) {
                    if (new Date($scope.CrmInvitationDetailVoForCreate.invitateTime) > new Date($scope.CrmInvitationDetailVoForCreate.receiveTime)) {
                        warningAlert("邀约时间不能大于预计到访时间");
                        return false
                    }
                }

                if (type != 3) {
                    if ($scope.flaglaifang.lai) {
                        crmInvitationDetail.state = 1
                        if (new Date($scope.CrmInvitationDetailVoForCreate.viewTime) < new Date(new Date($scope.CrmInvitationDetailVoForCreate.invitateTime) / 1000 - 86400) * 1000) {
                            warningAlert("到访时间不能小于邀约时间");
                            return false
                        }
                    } else if ($scope.flaglaifang.wei) {

                        crmInvitationDetail.state = 2
                    }
                }
                crmInvitationDetail.personId = crmInvitationDetail.crm_student_id;
                var promise = InvitationDetailService.update(crmInvitationDetail);

                promise.then(function (CrmInvitationDetailVoForCreate) {

                    _detail($scope.detailnew)
                    $scope.modal.hide();
                })



            }

            $scope.one = true;
            $scope.two = false;
            $scope.oneflag = true;
            $scope.twoflag = false;
            $scope.onclicktabone = function onclicktabone() {
                $scope.one = true;
                $scope.two = false;
                $scope.oneflag = true;
                $scope.twoflag = false;
                $scope.twozhifang = false;
                $scope.CrmInvitationDetailVoForCreate.state = 0;
            }

            function onclicktabtwo() {
                $scope.one = false;
                $scope.two = true;
                $scope.oneflag = false;
                $scope.twoflag = true;
                $scope.yaoyuefang = false;
                $scope.twozhifang = true;
                $scope.CrmInvitationDetailVoForCreate.state = 1;
            }

            //邀约的编辑
            $scope.laifangedit = function laifangedit(crmInvitationDetail, type) {
                if (type == 1) {
                    $scope.tachlaifang = true;
                    $scope.modalTitle = '到访编辑';
                    $scope.zhifangbianjisubmit = true
                    $scope.CrmInvitationDetailVoForCreate = angular.copy(crmInvitationDetail);
                    $scope.CrmInvitationDetailVoForCreate.id = crmInvitationDetail.referenceId;
                    $scope.CrmInvitationDetailVoForCreate.personId = $scope.detailnew.crm_student_id
                    $scope.CrmInvitationDetailVoForCreate.type = 2;
                    $scope.CrmInvitationDetailVoForCreate.invitateTime = crmInvitationDetail.invitate_time;
                    $scope.CrmInvitationDetailVoForCreate.visitContentType = crmInvitationDetail.visit_content_type;
                    $scope.laifangeditcontent = crmInvitationDetail.invitation_content_type;
                    $scope.CrmInvitationDetailVoForCreate.viewTime = crmInvitationDetail.view_time;
                    $scope.CrmInvitationDetailVoForCreate.receiveTime = crmInvitationDetail.receive_time;
                    $scope.laifanginnertexxt = '到访内容'
                    $scope.tachlaifang = true;
                } else {
                    $scope.modalTitle = '邀约确认';
                    $scope.CrmInvitationDetailVoForCreate = angular.copy(crmInvitationDetail);
                    $scope.CrmInvitationDetailVoForCreate.id = crmInvitationDetail.referenceId;
                    $scope.CrmInvitationDetailVoForCreate.personId = $scope.detailnew.crm_student_id
                    $scope.CrmInvitationDetailVoForCreate.type = 2;
                    $scope.CrmInvitationDetailVoForCreate.invitateTime = crmInvitationDetail.invitate_time
                    $scope.laifangeditcontent = crmInvitationDetail.invitation_content_type;
                    // $scope.CrmInvitationDetailVoForCreate.invitationContentType = crmInvitationDetail.invitation_content_type;
                    $scope.CrmInvitationDetailVoForCreate.visitContentType = crmInvitationDetail.invitation_content_type;
                    $scope.CrmInvitationDetailVoForCreate.viewTime = crmInvitationDetail.receive_time;
                    $scope.CrmInvitationDetailVoForCreate.flaglink = crmInvitationDetail.receive_time;
                    $scope.CrmInvitationDetailVoForCreate.receiveTime = crmInvitationDetail.receive_time;
                    $scope.laifanginnertexxt = '到访内容'
                    $scope.tachlaifang = false;
                }

                $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/sos/invitationDetail/modal.laifangedit.html', show: true });
            }

            $scope.isCancel = function isCancel(row){
                var passDate = $filter('date')(row.passDate,'yyyy-MM');
                var nowDate = $filter('date')(new Date(),'yyyy-MM');
                //var nowDate  =.dateFormart('yyyy-MM');

                //var nowDate=angular.$filter('date')(now,'yyyy-MM');
                if(passDate == nowDate){
                    return true;
                }
                else
                {
                    return false;
                }

            }



            /**
             * 确认到访
             */
            function visit(crmInvitationDetail, type) {
                if (type == 2) {
                    if ($scope.flaglaifang.lai) {
                        crmInvitationDetail.state = 1
                        if (new Date($scope.aaaaa.viewTime) < new Date(new Date($scope.aaaaa.invitate_time) / 1000 - 86400) * 1000) {
                            warningAlert("到访时间不能小于邀约时间");
                            return false
                        }
                    } else {
                        crmInvitationDetail.state = 2
                    }
                } else {

                    if ($scope.flaglaifang.lai) {
                        crmInvitationDetail.state = 1
                        if (new Date($scope.CrmInvitationDetailVoForCreate.viewTime) < new Date(new Date($scope.CrmInvitationDetailVoForCreate.invitateTime) / 1000 - 86400) * 1000) {
                            warningAlert("到访时间不能小于邀约时间");
                            return false
                        }
                    } else {

                        crmInvitationDetail.state = 2
                    }
                }

                $scope.visitvlu = angular.copy(crmInvitationDetail);
                crmInvitationDetail.receiveTime = new Date(crmInvitationDetail.receiveTime)
                var promise = InvitationDetailService.visit(crmInvitationDetail);
                promise.then(function () {
                    // saveInvitationDetail($scope.visitvlu,2)
                    _detail($scope.detailnew)
                    // isLock()
                    $scope.flag = false;
                    $scope.twozhifang = false;
                    $scope.one = true;
                    $scope.two = false;
                    $scope.laifangyaoyuecheck = true;
                    $scope.modal.hide();
                    _detail($scope.detailnew)
                }, function (error) {
                });
            }


            $scope.edittablaifangflg = true;
            $scope.flaglaifang = {};
            $scope.flaglaifang.lai = true;
            $scope.edittablaifang = function edittablaifang() {
                $scope.flaglaifang.lai = true;

                $scope.edittablaifangflg = true;
                $scope.flaglaifang.wei = false;
            }

            $scope.edittablaifangwei = function edittablaifangwei() {
                $scope.flaglaifang.lai = false;

                $scope.edittablaifangflg = false;
                $scope.flaglaifang.wei = true;
            }

















            /**
             * 显示详细信息（目前教师和教务主管用这个view）
             */
            $scope.showGroupDetailView = function (row) {
                $scope.groupCoursePlanFilter = {};
                $scope.selectedGroup = angular.copy(row);
                $scope.groupDetailModalTitle = "一对多详情";
                $scope.groupDetailTabs = [
                    { id: 1, title: '基本信息', template: 'partials/sos/customer/modal.group-basic-info.html' },
                    { id: 2, title: '一对多成员', template: 'partials/sos/customer/modal.group-student-info.html' },
                    { id: 3, title: '排课记录', template: 'partials/sos/customer/modal.group-courseplan-info.html' }
                ];
                $scope.detailModal = $modal({ scope: $scope, templateUrl: 'partials/sos/customer/modal.group.detail.html', show: true, backdrop: 'static' });
            }

            /**
             * 查询一对多内学员
             */
            $scope.getGroupStudent = function (tableState) {
                CustomerStudentGroupService.detail($scope.selectedGroup).then(function (result) {
                    $scope.groupDetailStudentList = result.groupStudentList;
                })
            }

            /**
             * 查询
             */
            $scope.getGroupCoursePlanListByFilter = function () {
                var pagination = $scope.groupCoursePlantableState.pagination;
                var start = $scope.groupCoursePlantableState.start || 0;
                var number = $scope.groupCoursePlantableState.number || 10;
                $scope.isLoading = true;
                CustomerStudentGroupService.getGroupCoursePlanList(start, number, $scope.groupCoursePlantableState, $scope.groupCoursePlanFilter).then(function (result) {
                    $scope.groupCoursePlanList = result.data;
                    $scope.groupCoursePlantableState.pagination = $scope.groupCoursePlantableState.pagination || {};
                    $scope.groupCoursePlantableState.pagination.numberOfPages = result.numberOfPages;
                    $scope.isLoading = false;
                });
            }

            /**
             * 加载一对多列表
             */
            $scope.getGroupCoursePlanList = function (tableState) {
                $scope.groupCoursePlanFilter.groupId = $scope.selectedGroup.id;
                if (!tableState) {
                    tableState = {
                        pagination: {},
                        search: {
                            predicateObject: {}
                        }

                    }
                }
                if (!tableState.search) {
                    tableState.search = {};
                }
                $scope.groupCoursePlantableState = tableState;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;
                $scope.isLoading = true;
                CustomerStudentGroupService.getGroupCoursePlanList(start, number, $scope.groupCoursePlantableState, $scope.groupCoursePlanFilter).then(function (result) {
                    $scope.groupCoursePlanList = result.data;
                    tableState.pagination = tableState.pagination || {};
                    tableState.pagination.numberOfPages = result.numberOfPages;
                    $scope.isLoading = false;
                });
            }
            $scope.orderRuleSelect = [{ name: '1小时', id: 1 }, { name: '40分钟', id: 2 }];
            // 获取校区的计费方案
            $scope.getOrderChargingScheme = function getOrderChargingScheme() {
                var model = {};
                model.id = $scope.order.orderChargingId;
                CrmChargingSchemeService.detail(model).then(function (result) {
                    $scope.order.orderChargingScheme = result;
                    $scope.order.orderChargingName = result.schemeName;
                    $scope.orderTeacherLevelList = getPricesList(result);
                    $scope.order.orderChargingPrice = getPrice(result,
                        $scope.order.orderTeacherLevel, $scope.order.gradeId);
                    $scope.orderDetailTopUp.orderChargingName = $scope.order.orderChargingName;
                    $scope.orderDetailTopUp.orderChargingPrice = $scope.order.orderChargingPrice;
                });
            }
            // 展示学生年级
            $scope.getGradeIDs = function getGradeIDs() {
                CommonService.getGradeIdSelect().then(function (result) {
                    $scope.gradeIds = result.data;
                });
            }
            //10-10  订单收费
            function chargeOrder(obj) {
                obj.contractStartDate = new Date(obj.contractStartDate);
                obj.contractEndDate = new Date(obj.contractEndDate);
                $scope.order = angular.copy(obj);
                $scope.modalTitle = '收费';
                $scope.order.flag = true;
                if (obj.orderCategory == 3) {
                    $scope.chargeOrderModal = _modal('partials/sos/order/chargeTopup.html')
                } else {
                    $scope.chargeOrderModal = _modal('partials/sos/order/charge.html')
                    $scope.getOrderCourses();
                }
                $scope.getOrderPayments();
            }

            function chargeOrderTopup(obj) {
                obj.contractStartDate = new Date(obj.contractStartDate);
                obj.contractEndDate = new Date(obj.contractEndDate);
                $scope.order = angular.copy(obj);
                $scope.modalTitle = '收费';
                $scope.chargeOrderModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/chargeTopup.html',
                    show: true
                });
                $scope.getOrderPayments();
            }

            //修改订单
            function editOrder(obj) {
                obj.contractStartDate = new Date(obj.contractStartDate);
                obj.contractEndDate = new Date(obj.contractEndDate);
                $scope.order = angular.copy(obj);
                // 保留修改前初始的对象
                $scope.orderCopy = angular.copy(obj);
                $scope.customerEditFlag = true;
                $scope.modalTitle = '修改';
                //计算下折扣率
                $scope.order.privilegeRatio = 100 - Number(($scope.order.privilegeAmount * 100 / $scope.order.totalPrice).toFixed(1));
                $scope.order.privilegeRatio = Number($scope.order.privilegeRatio.toFixed(1));
                if (obj.orderCategory == 3) {
                    $scope.modal = _modal('partials/sos/order/updateTopup.html')
                    $scope.getOrderChargingScheme(); // 获取计费方案的信息
                    CommonService.getGradeIdSelect().then(function (result) {
                        $scope.gradeIdsNew = result.data;
                    });
                } else {
                    $scope.orderOperating = 5
                    $scope.modal = _modal('partials/sos/order/update.html')
                    $scope.getOrderCourses();
                }
                $scope.getOrderAchievementRatios();//获取订单的业绩比例
                $scope.getOrderRelationTeachers(); //获取订单的相关教师
                $scope.callServerOrderCourseSelect();
                $scope.getCustomerBelongersSelect();
                $scope.getOrderPayments();
            }

            function editOrderTopup(obj) {
                obj.contractStartDate = new Date(obj.contractStartDate);
                obj.contractEndDate = new Date(obj.contractEndDate);
                $scope.order = angular.copy(obj);
                $scope.orderCopy = angular.copy(obj);
                $scope.modalTitle = '修改';
                $scope.orderOperating = 10
                /*  $scope.order.contractEndDate = new Date($scope.order.contractEndDate).Format("yyyy-MM-dd");*/
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/updateTopup.html',
                    show: true
                });
                $scope.getOrderAchievementRatios();//获取订单的业绩比例
                $scope.getOrderRelationTeachers(); //获取订单的相关教师
                $scope.callServerOrderCourseSelect();
                $scope.getCustomerBelongersSelect();
                $scope.getOrderPayments();
                $scope.getOrderChargingScheme(); // 获取计费方案的信息
                CommonService.getGradeIdSelect().then(function (result) {
                    $scope.gradeIdsNew = result.data;
                });
            }
            //订单审核
            function auditOrder(obj) {
                obj.contractStartDate = new Date(obj.contractStartDate);
                obj.contractEndDate = new Date(obj.contractEndDate);
                $scope.order = angular.copy(obj);
                $scope.modalTitle = '审核';
                //计算下折扣率
                $scope.order.privilegeRatio = 100 - Number(($scope.order.privilegeAmount * 100 / $scope.order.totalPrice).toFixed(1));
                $scope.order.privilegeRatio = Number($scope.order.privilegeRatio.toFixed(1));
                if (obj.orderCategory == 3) {
                    $scope.modal = _modal('partials/sos/order/auditTopup.html')
                    $scope.getOrderChargingScheme(); // 获取计费方案的信息
                    CommonService.getGradeIdSelect().then(function (result) {
                        $scope.gradeIds = result.data;
                    });
                } else {
                    $scope.orderOperating = 7
                    $scope.modal = _modal(mtModal.detail)
                    $scope.getOrderCourses();
                }

                $scope.getOrderPayments();
                $scope.getCustomerBelongersSelect();
                $scope.getOrderAchievementRatios();//获取订单的业绩比例
                $scope.getOrderRelationTeachers(); //获取订单的相关教师
            }
            // 订单审核-topup
            function auditOrderTopup(obj) {
                obj.contractStartDate = new Date(obj.contractStartDate);
                obj.contractEndDate = new Date(obj.contractEndDate);
                $scope.order = angular.copy(obj);
                $scope.modalTitle = '审核';
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/auditTopup.html',
                    show: true
                });
                $scope.getOrderPayments();
                $scope.getOrderAchievementRatios();//获取订单的业绩比例
                $scope.getOrderRelationTeachers(); //获取订单的相关教师
                $scope.getCustomerBelongersSelect();
                $scope.getOrderChargingScheme(); // 获取计费方案的信息
                $scope.getGradeIDs();            // 获取年级
            }
            function _modal(url) {
                return $modal({
                    scope: $scope,
                    templateUrl: url,
                    show: true
                });
            }
            //退单
            function chargeBackOrder(obj) {
                obj.contractStartDate = new Date(obj.contractStartDate);
                obj.contractEndDate = new Date(obj.contractEndDate);
                $scope.order = angular.copy(obj);
                $scope.modalTitle = '退单';
                //计算下折扣率
                $scope.order.privilegeRatio = 100 - Number(($scope.order.privilegeAmount * 100 / $scope.order.totalPrice).toFixed(1));
                $scope.order.privilegeRatio = Number($scope.order.privilegeRatio.toFixed(1));
                if (obj.orderCategory == 3) {
                    $scope.modal = _modal('partials/sos/order/chargebackTopup.html')
                    $scope.getOrderChargingScheme(); // 获取计费方案的信息
                    CommonService.getGradeIdSelect().then(function (result) {
                        $scope.gradeIdsNew = result.data;
                    });
                } else {
                    $scope.orderOperating = 8
                    $scope.modal = _modal(mtModal.detail)
                    $scope.getOrderCourses();
                }
                $scope.getOrderPayments();
                $scope.getCustomerBelongersSelect();
                $scope.getOrderAchievementRatios();//获取订单的业绩比例
                $scope.getOrderRelationTeachers(); //获取订单的相关教师
            }

            function chargeBackOrderTopup(obj) {
                obj.contractStartDate = new Date(obj.contractStartDate);
                obj.contractEndDate = new Date(obj.contractEndDate);
                $scope.order = angular.copy(obj);
                $scope.modalTitle = '退单';
                $scope.modalChargeBack = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/chargebackTopup.html',
                    show: true
                });
                $scope.getOrderPayments();
                $scope.getOrderAchievementRatios();//获取订单的业绩比例
                $scope.getOrderRelationTeachers(); //获取订单的相关教师
                $scope.getCustomerBelongersSelect();
                $scope.getOrderChargingScheme(); // 获取计费方案的信息
                CommonService.getGradeIdSelect().then(function (result) {
                    $scope.gradeIdsNew = result.data;
                });
            }
            //转课退单
            $scope.auditOrderTransferBack = function auditOrderTransferBack() {
                SweetAlert.swal({
                    title: "确定要退单吗？",
                    type: null,
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        var promise = OrderTransferService.editTransferBack($scope.order);
                        promise.then(function (data) {
                            SweetAlert.swal('操作成功');
                            $scope.auditTransferOrderBack.hide();
                            //$scope.refreshTabs();
                            $scope.refreshCustomerOrderDetail();
                        }, function (error) {
                            SweetAlert.swal('操作失败');
                            $scope.auditTransferOrderBack.hide();
                        });
                    }
                }
                );
            }

            //根据合同号  查询订单信息
            $scope.getOrderTransferInfo = function getOrderTransferInfo(tableState) {
                $scope.filter = {};
                $scope.filter.orderNo = $scope.order.orderNo;
                $scope.filter.crmStudentId = $scope.order.crmStudentId;
                var promise = OrderService.getOrderTransferInfo($scope.filter);
                promise.then(function (data) {
                    $scope.order = data;
                    $scope.order.startDate = new Date(data.startDate).Format("yyyy-MM-dd");
                    $scope.order.endDate = new Date(data.endDate).Format("yyyy-MM-dd");
                }, function (error) {
                });
            }

            //转课退单
            function auditTransferOrderBackNew(obj) {
                $scope.orderold = angular.copy(obj);
                if (obj.orderCategory == 1) {
                    obj.contractStartDate = new Date(obj.contractStartDate);
                    obj.contractEndDate = new Date(obj.contractEndDate);
                    obj.startDate = new Date(obj.startDate).Format("yyyy-MM-dd");
                    obj.endDate = new Date(obj.endDate).Format("yyyy-MM-dd");
                    $scope.order = angular.copy(obj);
                    $scope.modalTitle = '转课退单';
                    $scope.auditTransferOrderBack = $modal({
                        scope: $scope,
                        templateUrl: 'partials/sos/order/auditTransferBack.html',
                        show: true
                    });
                    $scope.filter = {};
                    $scope.filter.orderNo = $scope.order.orderNo;
                    $scope.filter.crmStudentId = $scope.order.crmStudentId;
                    var promise = OrderService.getOrderTransferInfo($scope.filter);
                    promise.then(function (data) {
                        $scope.order = data;
                        $scope.order.ext = "orgin";
                        $scope.order.orderNo = $scope.orderold.orderNo;
                        $scope.order.startDate = new Date(data.startDate).Format("yyyy-MM-dd");
                        $scope.order.endDate = new Date(data.endDate).Format("yyyy-MM-dd");
                    }, function (error) {
                    });
                }

                if (obj.orderCategory == 2) {
                    obj.contractStartDate = new Date(obj.contractStartDate);
                    obj.contractEndDate = new Date(obj.contractEndDate);
                    obj.startDate = new Date(obj.startDate).Format("yyyy-MM-dd");
                    obj.endDate = new Date(obj.endDate).Format("yyyy-MM-dd");
                    $scope.order = angular.copy(obj);
                    $scope.modalTitle = '转课退单';
                    $scope.auditTransferOrderBack = $modal({
                        scope: $scope,
                        templateUrl: 'partials/sos/order/auditTransferBackTopup.html',
                        show: true
                    });
                    $scope.getCustomerOrderTransferOrders();
                }

                if (obj.orderCategory == 3) {
                    obj.contractStartDate = new Date(obj.contractStartDate);
                    obj.contractEndDate = new Date(obj.contractEndDate);
                    obj.startDate = new Date(obj.startDate).Format("yyyy-MM-dd");
                    obj.endDate = new Date(obj.endDate).Format("yyyy-MM-dd");
                    $scope.order = angular.copy(obj);
                    $scope.modalTitle = '转课退单';
                    $scope.auditTransferOrderBack = $modal({
                        scope: $scope,
                        templateUrl: 'partials/sos/order/auditRechargeTransferBack.html',
                        show: true
                    });
                    $scope.getOrderTransferInfo();
                }

            }

            //获取转课订单列表信息
            $scope.getCustomerOrderTransferOrders = function getCustomerOrderTransferOrders() {
                OrderService.getCustomerOrderTransferOrders($scope.order.agreementNo).then(function (result) {
                    $scope.orderTransferOrders = result.data;
                });
            };

            //审核通过 清款确认
            function allPayOrder() {
                SweetAlert.swal({
                    title: "是否确认审核通过?", text: "", type: "warning", showCancelButton: true,
                    confirmButtonColor: "#DD6B55", confirmButtonText: "是", cancelButtonText: "否",
                    closeOnConfirm: false, closeOnCancel: true
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            var orderStatus = 3;
                            OrderService.updateStatus($scope.order, orderStatus, null, null).then(function (result) {
                                if ('学员电子账户余额不足' == result) {
                                    SweetAlert.swal(result);
                                    return false;
                                } else {
                                    SweetAlert.swal('操作成功');
                                    $scope.getRemindsData($rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds, 1);
                                    if ($scope.getMsgCount) {
                                        if ($rootScope.isRemindsContentShow == 2 && $scope.isHxiaozhang || $rootScope.isRemindsContentShow == 1 && $scope.isHxiaozhang) {//校长
                                            $scope.getMsgCount(3);
                                        } else if ($rootScope.isRemindsContentShow == 2 && $scope.isHxiaoquzhuguan || $rootScope.isRemindsContentShow == 1 && $scope.isHxiaoquzhuguan) {
                                            $scope.getMsgCount(2);
                                        } else {
                                            $scope.getMsgCount(1);
                                        }
                                    }
                                    if (!($scope.modal === undefined)) {
                                        $scope.modal.hide();
                                    }
                                    $scope.refreshCustomerOrderDetail();
                                }
                            });
                        } else {
                            return false;
                        }
                    });
            }
            //审核通过 清款确认
            function allPayOrderTopup() {
                SweetAlert.swal({
                    title: "是否确认审核通过?", text: "", type: "warning", showCancelButton: true,
                    confirmButtonColor: "#DD6B55", confirmButtonText: "是", cancelButtonText: "否",
                    closeOnConfirm: true, closeOnCancel: true
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            var orderStatus = 3;
                            OrderService.updateStatusTopup($scope.order, orderStatus, null, null).then(function (result) {
                                SweetAlert.swal('操作成功');
                                $scope.getRemindsData($rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds, 1);
                                if ($scope.getMsgCount) {
                                    if ($rootScope.isRemindsContentShow == 2 && $scope.isHxiaozhang || $rootScope.isRemindsContentShow == 1 && $scope.isHxiaozhang) {//校长
                                        $scope.getMsgCount(3);
                                    } else if ($rootScope.isRemindsContentShow == 2 && $scope.isHxiaoquzhuguan || $rootScope.isRemindsContentShow == 1 && $scope.isHxiaoquzhuguan) {
                                        $scope.getMsgCount(2);
                                    } else {
                                        $scope.getMsgCount(1);
                                    }
                                }
                                if (!($scope.modal === undefined)) {
                                    $scope.modal.hide();
                                }
                                $scope.refreshCustomerOrderDetail();
                            });
                        } else {
                            return false;
                        }
                    });
            }
            //退单
            function refund() {
                if (undefined == $scope.order.refundAmount || $scope.order.refundAmount > $scope.order.realPayAmount) {
                    SweetAlert.swal('退单金额填写不正确');
                    return false;
                }
                SweetAlert.swal({
                    title: "是否退单?", text: "", type: "warning", showCancelButton: true,
                    confirmButtonColor: "#DD6B55", confirmButtonText: "是", cancelButtonText: "否",
                    closeOnConfirm: true, closeOnCancel: true
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            var orderStatus = 5;
                            OrderService.updateStatus($scope.order, orderStatus, $scope.refundAmount, null).then(function (result) {
                                SweetAlert.swal('操作成功');
                                $scope.getRemindsData($rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds, 1);
                                if ($scope.getMsgCount) {
                                    if ($rootScope.isRemindsContentShow == 2 && $scope.isHxiaozhang || $rootScope.isRemindsContentShow == 1 && $scope.isHxiaozhang) {//校长
                                        $scope.getMsgCount(3);
                                    } else if ($rootScope.isRemindsContentShow == 2 && $scope.isHxiaoquzhuguan || $rootScope.isRemindsContentShow == 1 && $scope.isHxiaoquzhuguan) {
                                        $scope.getMsgCount(2);
                                    } else {
                                        $scope.getMsgCount(1);
                                    }
                                }
                                /*$scope.chargeBackOrderModal.hide();*/
                                if (!($scope.modal === undefined)) {
                                    $scope.modal.hide();
                                }
                                //$scope.refreshTabs();
                                $scope.refreshCustomerOrderDetail();
                            });
                        } else {
                            return false;
                        }
                    });
            }

            //订单的缴费记录信息列表
            $scope.getOrderPayments = function getOrderPayments() {
                OrderService.getOrderPayments($scope.start, $scope.number, $scope.order.orderNo).then(function (result) {
                    $scope.orderPayments = result.data;
                    $scope.order.crmorderPayments = result.data;
                    angular.forEach($scope.order.crmorderPayments, function (data, index, array) {
                        data.paymentEdit = true;
                    });
                });
            };

            //刷新列表
            $scope.refreshTabs = function refreshTabs() {
                if (typeof ($scope.tableState) != 'undefined') {
                    $scope.callServerOneTab($scope.tableState);
                }
                if (typeof ($scope.tableState2) != 'undefined') {
                    $scope.callServerTwoTab($scope.tableState2);
                }
                if (typeof ($scope.tableState3) != 'undefined') {
                    $scope.callServerThreeTab($scope.tableState3);
                }

            }

            $scope.orderFilter = {};
            $scope.oneOrders = [];
            $scope.tableState = {};
            //普通订单
            $scope.callServerOneTab = function callServerOneTab(tableState) {
                if ($scope.isO2OOperationSpecialist()) {
                    $scope.orderFilter.mediaChannelId1 = Constants.MediaChannel.CHANNEL8;
                    $scope.orderMediaChannel1Change();
                }
                $scope.isLoading = true;
                $scope.orderFlag = 1;
                if (!tableState) {
                    tableState = {
                        pagination: {},
                        search: {
                            predicateObject: {}
                        }

                    }
                }
                if (!tableState.search) {
                    tableState.search = {};
                }
                $scope.tableState = tableState;
                $scope.pagination = tableState.pagination;
                $scope.predicateObject = tableState.search.predicateObject;
                if (!$scope.pagination) {
                    $scope.pagination = {};
                }
                $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
                OrderService.getPage($scope.start, $scope.number, $scope.orderFlag, $scope.orderFilter).then(function (result) {
                    $scope.oneOrders = result.data;
                    tableState.pagination = tableState.pagination || {}
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                });
            };

            //可否拨打电话
            function warningAlert(title) {
                SweetAlert.swal({
                    title: title,
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonText: '确定',
                    closeOnConfirm: true
                })
            }
            function successAlert(title) {
                SweetAlert.swal({
                    title: title,
                    type: "success",
                    showCancelButton: false,
                    cancelButtonText: '确定',
                    closeOnConfirm: true
                })
            }
            $scope.getLoginUserInfo = getLoginUserInfo;
            getLoginUserInfo();
            function getLoginUserInfo() {
                var loginUserDepartmentId = AuthenticationService.currentUser().department_id;
                var promise = DepartmentService.getDeparmentById(AuthenticationService.currentUser().organization.id, loginUserDepartmentId);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    } else {
                        var loginDepartment = response.data;
                        if (loginDepartment.schoolNature === 1 || loginDepartment.cityCode === 110200) {
                            $scope.canCallPhone = true;
                        } else {
                            $scope.canCallPhone = false;
                        }
                        if (loginDepartment.id === Constants.DepartmentID.ZONGBU) {
                            $scope.canCallPhone = true;
                        }
                    }
                });
            }

            /**
             * 判断是不是当天
             */
            $scope.isToday = function isToday(timestamp) {
                var today = new Date($scope.currentTimstamp);
                var targetDay = new Date(timestamp);
                if (targetDay.toLocaleDateString() === today.toLocaleDateString()) {
                    return true;
                } else {
                    return false;
                }
            }

            $scope.genders = [{ value: false, name: "女" }, { value: true, name: "男" }];
            $scope.playAudio = function (src) {
                $scope.modalTitle = '播放';
                $scope.recordingPath = src;
                $scope.addOrderModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/common/util/modal.play.html',
                    show: true
                });

            };
            /**
             * 显示列表页面
             */
            $scope.purposeLevel = [{ "name": "高", "value": 1 }, { "name": "一般", "value": 2 }, {
                "name": "暂无",
                "value": 3
            }, { "name": "未标记", "value": 4 }];
            $scope.sortType = [{ "name": "大于", "value": 1 }, { "name": "小于", "value": 2 }, { "name": "等于", "value": 3 }];
            $scope.sortTypeNew = [{ "name": "今日", "id": 1 }, { "name": "昨日", "id": 2 }, { "name": "三天内", "id": 3 }, { "name": "一周内", "id": 4 }, { "name": "一周前", "id": 5 }, { "name": "一个月前", "id": 6 }, { "name": "无沟通", "id": 7 }, { "name": "自定义", "id": 8 }];
            $scope.VisitDatas = [{ "name": "今日", "id": 1 }, { "name": "昨日", "id": 2 }, { "name": "明日", "id": 9 }, { "name": "本周", "id": 10 }, { "name": "下周", "id": 11 }, { "name": "自定义", "id": 8 }];
            $scope.lastCourseDatas = [{ "name": "今日", "id": 1 }, { "name": "昨日", "id": 2 }, { "name": "本周", "id": 10 }, { "name": "上周", "id": 12 }, { "name": "本月", "id": 13 }, { "name": "上月", "id": 14 }, { "name": "无", "id": 7 }, { "name": "自定义", "id": 8 }];
            $scope.nextCourseDatas = [{ "name": "今日", "id": 1 }, { "name": "明日", "id": 9 }, { "name": "本周", "id": 10 }, { "name": "下周", "id": 11 }, { "name": "本月", "id": 13 }, { "name": "下月", "id": 15 }, { "name": "无", "id": 7 }, { "name": "自定义", "id": 8 }];
            $scope.remainingLessonDatas = [{ "name": "0", "id": 16 }, { "name": "10以内", "id": 17 }, { "name": "11至30", "id": 18 }, { "name": "31至100", "id": 21 }, { "name": "自定义", "id": 8 }];
            $scope.toConsumeLessonDatas = [{ "name": "0", "id": 16 }, { "name": "10以内", "id": 17 }, { "name": "11至20", "id": 19 }, { "name": "21至30", "id": 20 }, { "name": "自定义", "id": 8 }];
            /**
             * 重置查询条件
             */
            $scope.resetInputAll = resetInputAll
            function resetInputAll() {
                for (var key in $scope.myCrmCustomerStudentFilter) {
                    if ($scope.myCrmCustomerStudentFilter.hasOwnProperty(key)) {
                        switch (key) {
                            case 'nextVisitAt': break;
                            case 'isSelectedGraduation': break;
                            case 'pageNum': break;
                            case 'isSelectedGraduation': break;
                            case 'removeAbnormal': break;
                            case 'pageSize': break;
                            default:
                                delete $scope.myCrmCustomerStudentFilter[key]
                                break;
                        }
                    }
                }
                console.log($scope.myCrmCustomerStudentFilter)
                $scope.getMyCrmCustomerStudentList($scope.myCrmCustomerStudentListTableState);
            }
            /**
             * 取消退费
             */
            $scope.cancleRefund = function (row) {
                SweetAlert.swal({
                    title: "确定要撤销退费吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#fe9900',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        row.crmStudentId = $scope.detail.crm_student_id;
                        OrderService.cancleRefund(row).then(function (response) {
                            if (response.status == "SUCCESS") {
                                successAlert("操作成功");
                            }
                            else {
                                SweetAlert.swal(response.data);
                            }
                            $scope.refreshCustomerOrderDetail();
                        });
                    }
                });
            }

            /**
             * 快速插入不满意原因
             */
            $scope.remark = false;
            $scope.isSelect = false;
            $scope.CoursePlanquick = function CoursePlanquick(i) {

                if ($scope.quick[i]) {

                } else {
                    $scope.quick = [false, false, false, false];
                    $scope.quick[i] = true;
                    if (i == 1) {
                        $scope.OmsCoursePlanVoForCreate.remark = '不满意';
                        $scope.OmsCoursePlanVoForCreate.remarkext = null;
                        $scope.remark = false;
                        $scope.isSelect = true;

                    }
                    if (i == 2) {
                        $scope.OmsCoursePlanVoForCreate.remark = '消课错误';
                        $scope.OmsCoursePlanVoForCreate.remarkext = null;
                        $scope.remark = false;
                        $scope.isSelect = true;
                    }
                    if (i == 3) {
                        $scope.OmsCoursePlanVoForCreate.remark = '其他原因';
                        $scope.OmsCoursePlanVoForCreate.remarkext = $scope.remarkext;
                        $scope.remark = true;
                        $scope.isSelect = true;
                    }
                }

            };
            //判断当前用户是否为校长
            $scope.isSchoolMaster = function () {
                //console.log(localStorageService.get('position_id'));
                if (localStorageService.get('position_id') != Constants.PositionID.HEADMASTER) {//不是校长
                    return false;
                } else {
                    return true;
                }
            }

            //判断当前用户是否为课程顾问或者课程顾问主管
            $scope.isKeChengGuWenOrMaster = function () {
                if (localStorageService.get('position_id') == Constants.PositionID.COURSE_OFFICER || localStorageService.get('position_id') == Constants.PositionID.COURSE_CHIEF_OFFICER) {//不是校长
                    return true;
                } else {
                    return false;
                }
            }

            //新签订单
            $scope.signContractOrder = function signContractOrder() {
                var customerStudent = { 'crm_student_id': $scope.detail.crm_student_id };
                CustomerStudentService.detail(customerStudent).then(function (result) {
                    $scope.detail.accountBalance = result.accountBalance;
                    var obj = {
                        'crmStudentId': $scope.detail.crm_student_id,
                        'name': $scope.detail.name,
                        'accountBalance': $scope.detail.accountBalance,
                        'consumeAccountBalance': 0
                    };
                    $scope.order = angular.copy(obj);
                    $scope.modalTitle = '添加';
                    $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/sos/order/addCus.html', show: true });
                    $scope.callServerOrderCourseSelect();
                })

            }

            //新签充值订单
            $scope.signTopupOrder = function signTopupOrder() {
                var customerStudent = { 'crm_student_id': $scope.detail.crm_student_id };
                CustomerStudentService.detail(customerStudent).then(function (result) {
                    $scope.detail.accountBalance = result.accountBalance;
                    var obj = {
                        'crmStudentId': $scope.detail.crm_student_id,
                        'name': $scope.detail.name,
                        'accountBalance': $scope.detail.accountBalance,
                        'gradeId': $scope.detail.grade_id
                    };
                    $scope.order = angular.copy(obj);
                    $scope.modalTitle = '添加';
                    $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/sos/order/addTopup.html', show: true });
                })


            }

            //新签充值订单
            $scope.renewalOrderTopup = function renewalOrderTopup() {
                var customerStudent = { 'crm_student_id': $scope.detail.crm_student_id };
                CustomerStudentService.detail(customerStudent).then(function (result) {
                    $scope.detail.accountBalance = result.accountBalance;
                    var obj = {
                        'crmStudentId': $scope.detail.crm_student_id,
                        'name': $scope.detail.name,
                        'accountBalance': $scope.detail.accountBalance,
                        'gradeId': $scope.detail.grade_id
                    };
                    $scope.order = angular.copy(obj);
                    $scope.modalTitle = '添加';
                    $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/sos/order/addTopup.html', show: true });
                })
            }
            function ifResponseSuccess(response) {
                if (response.data.status == 'FAILURE') {
                    SweetAlert.swal(response.data.data);
                    return false;
                } else {
                    return true;
                }
            }

            //获取课程类型 年级 科目 下拉菜单
            $scope.callServerOrderCourseSelect = function callServerOrderCourseSelect() {
                OrderService.getSubjectIdSelect().then(function (result) {
                    $scope.subjectIds = result.data;
                });
                OrderService.getGradeIdSelect().then(function (result) {
                    $scope.gradeIds = result.data;
                });
                OrderService.getCourseTypeIdSelect().then(function (result) {
                    $scope.courseTypeIds = result.data;
                });
            };

            $scope.iso2o = false;
            $scope.isList = true;
            $scope.isDetail = false;
            $scope.isUpdate = false;
            $scope.isAddGroup = false;
            $scope.isEditGroup = false;
            $scope.isGroupDetail = false;
            $scope.isGroupAllot = false;
            $scope.isAllot = false;
            $scope.isAddStudent = false;
            $scope.showDetailView = function (phone) {
                $scope.viewCrmCustomerStudent(phone);
            };

            var oThis = this;
            oThis.ifO2oType = ifO2oType;
            oThis.getOrderListController = getOrderListController;
            oThis.getO2oStudentCoursesController = getO2oStudentCoursesController;
            function _isPhone(phone, status, lastDate) {
                if ($scope.phone.phone == phone) {
                    $scope.phone.phone_status = status;
                    $scope.phone.phone_lastDate = lastDate;

                } else if ($scope.phone.mother_phone == phone) {
                    $scope.phone.mother_phone_status = status;
                    $scope.phone.mother_phone_lastDate = lastDate;
                } else if ($scope.phone.father_phone == phone) {
                    $scope.phone.father_phone_status = status;
                    $scope.phone.father_phone_lastDate = lastDate;
                }
            }

            $scope.isO2oType = false;
            $scope.callO2oOrderList = callO2oOrderList;
            $scope.callO2oStudentCoursesLists = callO2oStudentCoursesLists;

            $scope.searchSchoolAreaShow = searchSchoolAreaShow;
            $scope.getFile = function () {
                fileReader.readAsDataUrl($scope.detailForUpdate.courseImage, $scope)
                    .then(function (result) {
                        $scope.imageSrc = result;
                        $scope.detailForUpdate.courseImage = result;
                    });
            }

            /**
             * 显示添加页面
             */
            $scope.showAddView = function showAddView() {
                $scope.isList = false;
                $scope.isDetail = false;
                $scope.isUpdate = false;
                $scope.isAddGroup = true;
                $scope.isEditGroup = false;
                $scope.isGroupDetail = false;
                $scope.isGroupAllot = false;
                $scope.isAllot = false;
            }

            /**
             * 显示列表页面
             */
            $scope.StudentStatus = Constants.StudentStatus;
            $scope.StudentStatusForUpdate = Constants.StudentStatusForUpdate;
            $scope.showListView = function () {
                $scope.isList = true;
                $scope.isDetail = false;
                $scope.isUpdate = false;
                $scope.isAddGroup = false;
                $scope.isEditGroup = false;
                $scope.isGroupDetail = false;
                $scope.isGroupAllot = false;
                $scope.isAllot = false;
                //刷新列表
                //$scope.myCrmCustomerStudentListTableState.pagination.start = 0;
                if ($location.url().indexOf('/customer_group') == -1) {
                    $scope.getMyCrmCustomerStudentList($scope.myCrmCustomerStudentListTableState);
                }

                if ($location.url().indexOf('/customer_group') != -1) {
                    $scope.myCrmCustomerStudentGroupListTableState.pagination.start = 0;
                    $scope.getMyCrmCustomerStudentGroupList($scope.myCrmCustomerStudentGroupListTableState);
                }

                if ($scope.modalUserUpdate) {
                    $scope.modalUserUpdate.hide()
                }
            };

            $scope.CrmInvitationRemindVoForCreate = {};
            $scope.addInvitationRemind = addInvitationRemind;
            $scope.saveInvitationRemind = saveInvitationRemind;
            $scope.editInvitationRemind = editInvitationRemind;
            $scope.deleteInvitationRemind = deleteInvitationRemind;

            $scope.CrmInvitationCommunicationVoForCreate = {};
            $scope.addInvitationCommunication = addInvitationCommunication;
            $scope.saveInvitationCommunication = saveInvitationCommunication;
            $scope.editInvitationCommunication = editInvitationCommunication;
            $scope.deleteInvitationCommunication = deleteInvitationCommunication;

            $scope.CrmInvitationDetailVoForCreate = {};
            $scope.addInvitationDetail = addInvitationDetail;
            $scope.addInvitationDetailByList = addInvitationDetailByList;
            $scope.saveInvitationDetail = saveInvitationDetail;
            $scope.editInvitationDetail = editInvitationDetail;
            $scope.deleteInvitationDetail = deleteInvitationDetail;
            $scope.getLeadsList = getLeadsList;
            $scope.visit = visit;

            $scope.channleEdit = channleEdit;
            //兑换余额
            $scope.showExchangeBalanceModal = showExchangeBalanceModal;
            $scope.calculateTotalExchange = calculateTotalExchange;
            $scope.exchangeRow = exchangeRow;
            $scope.isRowExchanged = isRowExchanged;
            $scope.exchangeAllRows = exchangeAllRows;
            $scope.isExchangedAll = isExchangedAll;
            $scope.exchangeBalance = exchangeBalance;
            $scope.getExchangeBalanceList = getExchangeBalanceList;

            //app端显示剩余课时
            $scope.confirmShowLeftClassHour = confirmShowLeftClassHour;

            // add by fanl 2016-06-12 整合了学员的排课，一个页面********开始//
            $scope.addCoursePlanInfo = addCoursePlanInfo;
            $scope.canclePlanModal = canclePlanModal;
            /**
             * 显示排课对话框-弹框
             */
            function addCoursePlanInfo(row, type) {
                if (type == 1) {
                    $scope.coursePlanModalTitle = "学员排课";
                } else if (type == 2) {
                    $scope.coursePlanModalTitle = "一对多排课";
                } else if (type == 3) {
                    $scope.coursePlanModalTitle = "试听排课";
                }
                if (row.order_rule == 2) {
                    $scope.order_rule = 2;
                    $scope.order_rule_name = '40分钟';
                } else {
                    $scope.order_rule = 1;
                    $scope.order_rule_name = '1小时';
                }

                $scope.detail = angular.copy(row);
                // 将type封装到对象中
                $scope.detail.type = type;
                if (type == 2) {
                    // 一对多排课，要加载一对多的订单课程的信息
                    var start = 0, number = 10;
                    CustomerStudentCourseService.getCRMCustomerGroupInfoByGroupID(start, number, $scope.detail.id).then(function (result) {

                        $scope.CGoupStudentCourseList = result.data.groupStudentList;
                        $scope.detail.name = _getUserNameTOSting(angular.copy($scope.CGoupStudentCourseList))
                        $scope.CustomerStudentCourseList = result.data.groupOrderCourseList;
                        $scope.schoolName = result.data.schoolName;
                        CommonService.getSubjectIdSelect().then(function (result) {
                            $scope.omsSubject = result.data;
                            $scope.recordCoursePlanModal = $modal({
                                scope: $scope,
                                templateUrl: 'partials/sos/customer/modal.coursePlanInfo.html',
                                show: true,
                                backdrop: "static"
                            });
                        });
                    });
                } else {
                    // 获取科目信息
                    ;
                    CommonService.getSubjectIdSelect().then(function (result) {
                        $scope.omsSubject = result.data;
                        $scope.recordCoursePlanModal = $modal({
                            scope: $scope,
                            templateUrl: 'partials/sos/customer/modal.newcoursePlanInfo.html',
                            show: true,
                            backdrop: "static"
                        });
                    });
                }

            }

            /**
             * 获取一对多排课中的学生姓名集合
             * @param userList
             * @returns {string}
             * @private
             */
            var _getUserNameTOSting = function (userList) {
                var userSting = ''
                for (var i = 0, len = userList.length; i < len; i++) {
                    if (i == len - 1) {
                        userSting += userList[i].studentName
                    } else {
                        userSting += (userList[i].studentName + '、')
                    }
                }
                return userSting
            }
            /**
             * 关闭排课的弹框
             */
            function canclePlanModal() {
                $scope.recordCoursePlanModal.hide();
            }

            $scope.ifLastCommunicated = function (row) {
                var time = row.last_communicated_at;
                var thatDay = new Date();
                var rowDay = new Date(row.last_communicated_at);
                if (time) {
                    if (thatDay.getYear() == rowDay.getYear()) {
                        if (thatDay.getMonth() == rowDay.getMonth()) {
                            if (thatDay.getDay() == rowDay.getDay()) {
                                return true;
                            }
                        }
                    }

                }
                return false;

            };

            $scope.renewalOrder = function (row) {
                sessionStorage.setItem("orderJudgeEntrance", 'addOrder');
                var currentUserPositionId = AuthenticationService.currentUser().position_id;
                if (currentUserPositionId == Constants.PositionID.YSP_CHENGZHANGGUWEN
                    || currentUserPositionId == Constants.PositionID.YSP_HEADMASTER) {
                    $scope.IsYSP = true;
                }
                CustomerStudentService.detail(row).then(function (result) {
                    var obj = {
                        'gradeId': row.grade_id,
                        'crmStudentId': row.crm_student_id,
                        'membershipLevel': result.membershipLevel,
                        'stuState': 1,
                        'name': row.name,
                        'accountBalance': row.accountBalance,
                        'consumeAccountBalance': 0
                    };
                    $scope.order = angular.copy(obj);
                    $scope.modalTitle = '添加';
                    $scope.orderOperating = 1//订单标识:买课程
                    //$scope.order.contractStartDate = new Date().Format("yyyy-MM-dd");
                    //$scope.order.contractEndDate = new Date().Format("yyyy-MM-dd");
                    // $scope.modal = $modal({ scope: $scope, templateUrl: mtModal.add, show: true });
                    $scope.orderModalV2 = $modal({ scope: $scope, templateUrl: mtModal.addV2, show: true });
                })
            }

            $scope.renewalOrderTopupFromStudentList = function (row) {
                var obj = {
                    'crmStudentId': row.crm_student_id,
                    'name': row.name,
                    'accountBalance': row.accountBalance,
                    'consumeAccountBalance': 0,
                    'gradeId': row.grade_id
                };
                $scope.order = angular.copy(obj);
                $scope.modalTitle = '充值';
                $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/sos/order/addTopup.html', show: true });
            }
            /**
             * 获取当前tab页
             */
            $scope.getTabIndex = function getTabIndex(obj) {
                if (obj.title === '沟通记录') {
                    $scope.recordTab = '0';
                } else if (obj.title === '邀约记录') {
                    $scope.recordTab = '1';
                } else if (obj.title === '排课记录') {
                    $scope.recordTab = '2';
                }
            }

            /********************* 过滤列表高中毕业学生 ****************************/
            $scope.isSelectedGraduation = true;
            $scope.quickSelectGraduation = function () {
                if ($scope.isSelectedGraduation) {
                    $scope.isSelectedGraduation = false;
                } else {
                    $scope.isSelectedGraduation = true;
                }
                //学员列表
                if (!isEmptyObject($scope.myCrmCustomerStudentFilter)) {
                    $scope.myCrmCustomerStudentFilter.isSelectedGraduation = $scope.isSelectedGraduation;
                    $scope.getMyCrmCustomerStudentList($scope.myCrmCustomerStudentListTableState);
                }
            };

            /********************* 过滤列表异常学员 ****************************/
            $scope.removeAbnormal = true;
            $scope.quickRemoveAbnormal = function () {
                if ($scope.removeAbnormal) {
                    $scope.removeAbnormal = false;
                } else {
                    $scope.removeAbnormal = true;
                }
                //学员列表
                if (!isEmptyObject($scope.myCrmCustomerStudentFilter)) {
                    $scope.myCrmCustomerStudentFilter.removeAbnormal = $scope.removeAbnormal;
                    $scope.getMyCrmCustomerStudentList($scope.myCrmCustomerStudentListTableState);
                }
            };

            /************************* 全选 ******************************/
            $scope.selectAllFlagForAllot = false;
            $scope.isSelectedAll = function (obj) {
                if (obj === 1) { //学员分配
                    return $scope.selectAllFlagForAllot;
                }
            };
            $scope.selectAll = function (obj) {
                if (obj === 1) { //学员分配
                    $scope.selectAllFlagForAllot = !($scope.selectAllFlagForAllot);
                    if ($scope.selectAllFlagForAllot) {
                        angular.forEach($scope.allotCrmCustomerStudentList, function (data, index, aray) {
                            $scope.MyCrmCustomerStudentAllotListOk.push(data);
                        });
                    } else {
                        $scope.MyCrmCustomerStudentAllotListOk = [];
                    }
                }
            };

            /**
             * 展示记录弹窗
             */
            $scope.showRecordModal = function showRecordModal(row) {
                $scope.recordModalTitle = row.name + ' 的记录';
                $scope.detail = angular.copy(row);
                $scope.recordModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/leads/modal.record.html',
                    show: true,
                    backdrop: "static"
                });
            }

            /**
             * 展示排课记录弹窗
             */
            $scope.showCoursePlanRecordModal = function showCoursePlanRecordModal(row, type) {
                $scope.coursePlanRecordTitle = row.name + ' 的排课记录';
                $scope.coursePlanRecordType = type;
                $scope.detail = angular.copy(row);
                $scope.recordModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/customer/modal.coursePlanRecord.html',
                    show: true,
                    backdrop: "static"
                });
            }

            //订单的课程信息列表
            /*$scope.getOrderCourses = function getOrderCourses() {
             OrderService.getOrderCourses($scope.start, $scope.number,$scope.order.orderNo).then(function (result) {
             $scope.order.orderCourses = result.data;
             });
             };*/

            $scope.addTransferOrder = function addTransferOrder() {
                $scope.order = { 'orderCourses': [], 'crmStudentId': $scope.detail.crm_student_id };
                $scope.modalTitle = '新增转课';
                $scope.order.startDate = new Date().Format("yyyy-MM-dd");
                $scope.order.endDate = new Date().Format("yyyy-MM-dd");
                //默认设置转课方式为一对一转课
                $scope.order.transferWay = 1;
                $scope.addTransferOrderModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/addTransfer.html',
                    show: true
                });
                $scope.getCustomerOrderTransferAvailables();
            }


            $scope.addTransferOrderTopup = function addTransferOrderTopup() {
                $scope.order = {
                    'orderCourses': [],
                    'crmStudentId': $scope.detail.crm_student_id,
                    'studentName': $scope.detail.name,
                    'accountBalance': $scope.detail.accountBalance,
                    'transferAccountBalance': $scope.detail.accountBalance
                };
                $scope.modalTitle = '转让电子余额';
                $scope.order.startDate = new Date().Format("yyyy-MM-dd");
                $scope.order.endDate = new Date().Format("yyyy-MM-dd");
                $scope.addTransferOrderModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/addTransferTopup.html',
                    show: true
                });
            }
            $scope.addTransferOrderByList = function addTransferOrderByList(row) {
                $scope.order = { 'orderCourses': [], 'crmStudentId': row.crm_student_id };
                $scope.modalTitle = '新增转课';
                $scope.order.startDate = new Date().Format("yyyy-MM-dd");
                $scope.order.endDate = new Date().Format("yyyy-MM-dd");
                //默认设置转课方式为一对一转课
                $scope.order.transferWay = 1;
                $scope.detail = row;
                $scope.addTransferOrderModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/addTransfer.html',
                    show: true
                });
                $scope.getCustomerOrderTransferAvailablesByList(row);
            }

            /**
             * 退费弹窗
             */
            $scope.refundOrder = {};
            $scope.okread = false;
            $scope.showReturnView = function (row) {
                $scope.gradeName = row.grade_name;
                $scope.gradeId = row.grade_id;
                $scope.detail = row;
                $scope.returnModel = $modal({
                    title: '申请退费',
                    scope: $scope,
                    templateUrl: 'partials/sos/customer/modal.returnFei.html',
                    show: true
                });
            };
            $scope.applyRefund = function applyRefund(refundOrder) {
                $scope.remark = false;
                $scope.modalTitle = "申请退费";
                $scope.refundOrder = angular.copy(refundOrder);
                $scope.refundOrder.partialRefundFlag = 0;
                $scope.refundOrder.originOrderNo = refundOrder.orderNo;
                $scope.refundOrder.crmStudentId = $scope.detail.crm_student_id;
                $scope.refundOrder.privilegeRatio = Number(($scope.refundOrder.realTotalAmount * 100 / ($scope.refundOrder.privilegeAmount + $scope.refundOrder.realTotalAmount)).toFixed(1));
                if (refundOrder.orderCategory == 3) {
                    $scope.refundOrder.orderRefundCategory = 3;
                    $scope.okread = false;
                } else {
                    $scope.refundOrder.orderRefundCategory = 1;
                    // 需要根据订单信息查询出订单子表的信息在退费的页面进行展示
                    _getAllOrderCourses();
                    $scope.okread = true;
                }

                $scope.modal = _modal('partials/sos/customer/modal.returnFei.ReasonNew.html')
            };

            /**
             * 获取选择订单的课程子表的信息
             */
            function _getAllOrderCourses() {
                var filter = {};
                filter.crmCustomerStudentId = $scope.detail.crm_student_id;
                var orderNos = $scope.refundOrder.originOrderNo;
                if (orderNos.length > 0) {
                    filter.customCondition = " and s.order_no = '" + orderNos + "' ";
                    CustomerStudentCourseService.getOrderCourseList(filter).then(function (result) {
                        $scope.refundOrder.orderCourses = result.studentOrder;
                    });
                }
            }

            /**
             * 输入扣减课时，自动计算退费的金额
             */
            $scope.changeRefundCourseNum = function (row) {
                $scope.legalFlag = false;
                $scope.onceinyable = false;
                if (row.refundCourseNum == undefined || row.refundCourseNum == 0) {
                    row.refundCourseNum = "";
                    $scope.legalFlag = true;
                }
                if (row.refundCourseNum > row.plan_available_num) {
                    $scope.legalFlag = true;
                    SweetAlert.swal("扣减课时不能大于可排课时");
                    row.refundCourseNum = "";
                    row.refundCourseAmout = 0;
                    $scope.refundOrder.reduceCourseNum = 0;
                    $scope.refundOrder.refundAmount = 0;
                    return false;
                }
                // 证明是按期买课 ,单价 = 单价/ 一期的课时数或者次数
                if (row.courseBuyUnit == 3) {
                    row.refundCourseAmout = row.actual_price * row.refundCourseNum / row.currentRegularTimes;
                } else {
                    row.refundCourseAmout = row.actual_price * row.refundCourseNum;
                }
                var refundAmountTemp = 0;
                var refundCourseTemp = 0;
                var refundcompare = 0;
                for (var j = 0, len1 = $scope.refundOrder.orderCourses.length; j < len1; j++) {
                    if ($scope.refundOrder.orderCourses[j].refundCourseAmout == undefined) {
                        $scope.refundOrder.orderCourses[j].refundCourseAmout = 0;
                    }
                    if ($scope.refundOrder.orderCourses[j].refundCourseNum == undefined) {
                        $scope.refundOrder.orderCourses[j].refundCourseNum = 0;
                    }
                    refundcompare = refundcompare + $scope.refundOrder.orderCourses[j].course_num;
                    refundAmountTemp = refundAmountTemp + $scope.refundOrder.orderCourses[j].refundCourseAmout;
                    refundCourseTemp = refundCourseTemp + $scope.refundOrder.orderCourses[j].refundCourseNum;
                }
                // 扣减总课时
                $scope.refundOrder.reduceCourseNum = Number(refundCourseTemp);
                //自动增加课时输入的验证全部退费功能
                if (refundcompare == refundCourseTemp) {
                    SweetAlert.swal({
                        title: "确认全部退费?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确认",
                        cancelButtonText: "取消",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    },
                        function (isConfirm) {
                            if (isConfirm) {
                                $scope.refundOrder.allreturncheck = true;
                                $scope.allreturncheck();
                                swal("全部退费按钮被选中");
                            } else {
                                if ($scope.refundOrder.orderRefundCategory == 1) {
                                    $scope.refundOrder.refundCourseNum = 0;
                                    $scope.refundOrder.refundAmount = 0;
                                    $scope.refundOrder.reduceAccountAmount = 0;
                                    $scope.refundOrder.reduceCourseNum = 0;
                                    for (var i = 0; i < $scope.refundOrder.orderCourses.length; i++) {
                                        $scope.refundOrder.orderCourses[i].refundCourseNum = 0;
                                        $scope.refundOrder.orderCourses[i].refundCourseAmout = 0;
                                    }
                                    $scope.legalFlag = true;
                                } else {
                                    $scope.refundOrder.refundCourseNum = 0;
                                    $scope.refundOrder.refundAmount = 0;
                                    $scope.refundOrder.reduceAccountAmount = 0;
                                    $scope.refundOrder.reduceCourseNum = 0;
                                }
                                swal("没有选择全部退费");
                            }
                        })

                }
                $scope.refundOrder.refundAmount = Number((refundAmountTemp * $scope.refundOrder.privilegeRatio / 100).toFixed(2));
                // 若扣减课时=可排课时，则为全部退费，需要改变订单状态
                if ($scope.refundOrder.reduceCourseNum == $scope.refundOrder.totalPlanAvailableNum) {
                    $scope.refundOrder.partialRefundFlag = 1;
                } else {
                    $scope.refundOrder.partialRefundFlag = 0;
                }
            }

            /**
             * 选择-退费原因
             */
            $scope.changing = function changing() {
                $scope.remark = false;
                if ($scope.refundOrder.refundReasonType == 9) {
                    $scope.remark = true;
                }
            }
            /**
             * 充值订单需要根据退费金额，算下扣减的账户金额
             */
            $scope.islegalRefundAmount = function islegalRefundAmount() {
                if (!$scope.refundOrder.allreturncheck) {
                    if ($scope.refundOrder.orderRefundCategory == 3) {
                        $scope.legalFlag = false;
                        // 判断充值订单的退费金额    和  可排金额 * 折扣率
                        var tempAmount = Number(($scope.refundOrder.avaliableAmount * $scope.refundOrder.realTotalAmount / $scope.refundOrder.totalPrice).toFixed(2));
                        // 计算扣减金额
                        $scope.refundOrder.reduceAccountAmount = Number(($scope.refundOrder.refundAmount * $scope.refundOrder.totalPrice / $scope.refundOrder.realTotalAmount).toFixed(2));
                        // 退费金额不能大于 实际的钱
                        if ($scope.refundOrder.refundAmount > tempAmount) {
                            $scope.legalFlag = true;
                            SweetAlert.swal("退费金额不能大于实际交费可排金额");
                            $scope.refundOrder.refundAmount = 0;
                            $scope.refundOrder.reduceAccountAmount = 0;
                            return false;
                        }
                        if ($scope.refundOrder.refundAmount >= tempAmount) {
                            SweetAlert.swal({
                                title: "确认全部退费?",
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "确认",
                                cancelButtonText: "取消",
                                closeOnConfirm: false,
                                closeOnCancel: false
                            },
                                function (isConfirm) {
                                    if (isConfirm) {
                                        $scope.refundOrder.allreturncheck = true;
                                        $scope.allreturncheck();
                                        swal("全部退费按钮被选中");
                                    } else {
                                        if ($scope.refundOrder.orderRefundCategory == 1) {
                                            $scope.refundOrder.refundCourseNum = 0;
                                            $scope.refundOrder.refundAmount = 0;
                                            $scope.refundOrder.reduceAccountAmount = 0;
                                            $scope.refundOrder.reduceCourseNum = 0;
                                            for (var i = 0; i < $scope.refundOrder.orderCourses.length; i++) {
                                                $scope.refundOrder.orderCourses[i].refundCourseNum = 0;
                                                $scope.refundOrder.orderCourses[i].refundCourseAmout = 0;
                                            }
                                            $scope.legalFlag = true;
                                        } else {
                                            $scope.refundOrder.refundCourseNum = 0;
                                            $scope.refundOrder.refundAmount = 0;
                                            $scope.refundOrder.reduceAccountAmount = 0;
                                            $scope.refundOrder.reduceCourseNum = 0;
                                        }
                                        swal("没有选择全部退费");
                                    }
                                })

                        }
                        if ($scope.refundOrder.refundAmount <= 0) {
                            $scope.legalFlag = true;
                            SweetAlert.swal("退费金额要大于0");
                            $scope.refundOrder.refundAmount = 0;
                            $scope.refundOrder.reduceAccountAmount = 0;
                            return false;
                        }

                    } else {
                        var refundAmountTemp = 0;
                        var refundCourseTemp = 0;
                        for (var j = 0, len1 = $scope.refundOrder.orderCourses.length; j < len1; j++) {
                            if ($scope.refundOrder.orderCourses[j].refundCourseAmout == undefined) {
                                $scope.refundOrder.orderCourses[j].refundCourseAmout = 0;
                            }
                            if ($scope.refundOrder.orderCourses[j].refundCourseNum == undefined) {
                                $scope.refundOrder.orderCourses[j].refundCourseNum = 0;
                            }

                            if ($scope.refundOrder.orderCourses[j].courseBuyUnit == 3) {
                                $scope.refundOrder.orderCourses[j].refundCourseAmout = $scope.refundOrder.orderCourses[j].refundCourseNum * ($scope.refundOrder.orderCourses[j].actual_price / $scope.refundOrder.orderCourses[j].regularTimes);
                            } else {
                                $scope.refundOrder.orderCourses[j].refundCourseAmout = $scope.refundOrder.orderCourses[j].refundCourseNum * $scope.refundOrder.orderCourses[j].actual_price
                            }
                            refundAmountTemp = refundAmountTemp + $scope.refundOrder.orderCourses[j].refundCourseAmout;
                        }
                        // 扣减总课时
                        if ($scope.refundOrder.refundAmount > refundAmountTemp * $scope.refundOrder.privilegeRatio / 100) {
                            SweetAlert.swal("退费金额不能大于扣减金额");
                            $scope.refundOrder.refundAmount = 0;
                            $scope.legalFlag = true;
                        }


                    }


                }//这里是判断数否全部选中结束
                else {
                    if ($scope.refundOrder.orderRefundCategory == 3) {
                        if ($scope.refundOrder.refundAmount > $scope.refundOrder.reduceAccountAmount) {
                            SweetAlert.swal("退费金额不能大于实际交费可排金额");
                            $scope.refundOrder.refundAmount = 0;
                            $scope.legalFlag = true;
                        }
                        if ($scope.refundOrder.refundAmount > 0) {
                            $scope.legalFlag = false;
                        }
                    }

                    if ($scope.refundOrder.orderRefundCategory == 1) {
                        if ($scope.refundOrder.refundAmount == 0) {
                            $scope.legalFlag = true;
                        } else {
                            $scope.legalFlag = false;
                        }
                        if ($scope.refundOrder.refundAmount > $scope.refundOrder.maxkeshijine) {
                            SweetAlert.swal("不能超过最大剩余金额");
                            $scope.refundOrder.refundAmount = 0;
                            $scope.legalFlag = true
                        }


                    }


                }
                4
            }

            //全部退费
            $scope.allreturncheck = function allreturncheck() {
                //选中开始
                $scope.okonclick = true;

                console.log($scope.refundOrder.allreturncheck)
                console.log($scope.refundOrder.partialRefundFlag)
                if ($scope.refundOrder.allreturncheck) {
                    if ($scope.refundOrder.orderRefundCategory == 1) {
                        var refundAmountTemp = 0;
                        var refundCourseTemp = 0;
                        for (var j = 0, len1 = $scope.refundOrder.orderCourses.length; j < len1; j++) {
                            if ($scope.refundOrder.orderCourses[j].refundCourseAmout == undefined) {
                                $scope.refundOrder.orderCourses[j].refundCourseAmout = 0;
                            }
                            if ($scope.refundOrder.orderCourses[j].refundCourseNum == undefined) {
                                $scope.refundOrder.orderCourses[j].refundCourseNum = 0;
                            }
                            $scope.refundOrder.orderCourses[j].refundCourseNum = $scope.refundOrder.orderCourses[j].course_num;
                            if ($scope.refundOrder.orderCourses[j].courseBuyUnit == 3) {
                                $scope.refundOrder.orderCourses[j].refundCourseAmout = $scope.refundOrder.orderCourses[j].course_num * $scope.refundOrder.orderCourses[j].actual_price / $scope.refundOrder.orderCourses[j].original_num
                            } else {
                                $scope.refundOrder.orderCourses[j].refundCourseAmout = $scope.refundOrder.orderCourses[j].course_num * $scope.refundOrder.orderCourses[j].actual_price
                            }
                            refundAmountTemp = refundAmountTemp + $scope.refundOrder.orderCourses[j].refundCourseAmout;
                            refundCourseTemp = refundCourseTemp + $scope.refundOrder.orderCourses[j].refundCourseNum;
                        }
                        // 扣减总课时
                        $scope.refundOrder.partialRefundFlag = 1;
                        $scope.refundOrder.maxkeshijine = refundAmountTemp;
                        $scope.refundOrder.reduceCourseNum = Number(refundCourseTemp);
                        $scope.refundOrder.refundAmount = Number((refundAmountTemp * $scope.refundOrder.privilegeRatio / 100).toFixed(2));
                    } else if ($scope.refundOrder.orderRefundCategory == 3) {
                        // 计算扣减金额、退费金额 = 充值订单剩余金额
                        // $scope.refundOrder.refundAmount =$scope.refundOrder.additionalAmount;
                        // $scope.refundOrder.reduceAccountAmount= Number(( $scope.refundOrder.refundAmount / $scope.refundOrder.realTotalAmount *  $scope.refundOrder.totalPrice).toFixed(2)) ;


                        $scope.refundOrder.reduceAccountAmount = $scope.refundOrder.additionalAmount;
                        var tempAmount = Number(($scope.refundOrder.avaliableAmount * $scope.refundOrder.realTotalAmount / $scope.refundOrder.totalPrice).toFixed(2));
                        $scope.refundOrder.koujianzhongzhi = $scope.refundOrder.reduceAccountAmount;
                        // 计算扣减金额
                        $scope.refundOrder.refundAmount = Number(($scope.refundOrder.reduceAccountAmount / $scope.refundOrder.totalPrice * $scope.refundOrder.realTotalAmount).toFixed(2));
                        $scope.refundOrder.partialRefundFlag = 1;
                    }
                    $scope.legalFlag = false;
                } else {

                    $scope.refundOrder.partialRefundFlag = 0;
                    $scope.okonclick = false;
                    //点击不全部退费，恢复到原始版本
                    if ($scope.refundOrder.orderRefundCategory == 1) {
                        $scope.refundOrder.refundCourseNum = 0;
                        $scope.refundOrder.refundAmount = 0;
                        $scope.refundOrder.reduceAccountAmount = 0;
                        $scope.refundOrder.reduceCourseNum = 0;
                        for (var i = 0; i < $scope.refundOrder.orderCourses.length; i++) {
                            $scope.refundOrder.orderCourses[i].refundCourseNum = 0;
                            $scope.refundOrder.orderCourses[i].refundCourseAmout = 0;
                        }
                        $scope.legalFlag = true;
                    } else {
                        $scope.refundOrder.refundCourseNum = 0;
                        $scope.refundOrder.refundAmount = 0;
                        $scope.refundOrder.reduceAccountAmount = 0;
                        $scope.refundOrder.reduceCourseNum = 0;
                    }

                }


                console.log($scope.refundOrder.allreturncheck)
                console.log($scope.refundOrder.partialRefundFlag)

                //    选中结束

            }

            //全部退费扣减充值的判定
            $scope.koujianchong = function koujianchong() {
                if ($scope.refundOrder.reduceAccountAmount > $scope.refundOrder.additionalAmount) {
                    SweetAlert.swal("扣减充值不能超过最大值");
                    $scope.refundOrder.reduceAccountAmount = 0;
                }

                if ($scope.refundOrder.reduceAccountAmount >= $scope.refundOrder.additionalAmount) {
                    SweetAlert.swal({
                        title: "确认全部退费?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确认",
                        cancelButtonText: "取消",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    },
                        function (isConfirm) {
                            if (isConfirm) {
                                $scope.refundOrder.allreturncheck = true;
                                $scope.allreturncheck();
                                swal("全部退费按钮被选中");
                            } else {
                                if ($scope.refundOrder.orderRefundCategory == 1) {
                                    $scope.refundOrder.refundCourseNum = 0;
                                    $scope.refundOrder.refundAmount = 0;
                                    $scope.refundOrder.reduceAccountAmount = 0;
                                    $scope.refundOrder.reduceCourseNum = 0;
                                    for (var i = 0; i < $scope.refundOrder.orderCourses.length; i++) {
                                        $scope.refundOrder.orderCourses[i].refundCourseNum = 0;
                                        $scope.refundOrder.orderCourses[i].refundCourseAmout = 0;
                                    }
                                    $scope.legalFlag = true;
                                } else {
                                    $scope.refundOrder.refundCourseNum = 0;
                                    $scope.refundOrder.refundAmount = 0;
                                    $scope.refundOrder.reduceAccountAmount = 0;
                                    $scope.refundOrder.reduceCourseNum = 0;
                                }
                                swal("没有选择全部退费");

                            }
                        })


                }






            }
            //全选回复只读的
            $scope.huifu = function huifu() {
                $scope.okonclick = false;
            }


            /**
             * 确认退费
             * 没选择原因不让提交
             * 订单号  退费类型    退费原因--判断是类型9的话 得获得textarea里的值
             */
            $scope.refundConfirm = function refundConfirm() {
                if ($scope.refundOrder.refundReasonType == "" || $scope.refundOrder.refundReasonType == null) {
                    SweetAlert.swal("请选择退费原因");
                    return false;
                }
                if ($scope.refundOrder.allreturncheck) {
                    $scope.refundOrder.partialRefundFlag = 1;
                } else {
                    $scope.refundOrder.partialRefundFlag = 0;
                }

                console.log($scope.refundOrder.partialRefundFlag);
                OrderService.applyRefund($scope.refundOrder).then(function (result) {
                    SweetAlert.swal('操作成功');
                    $scope.modal.hide();
                    $scope.refundOrder = {};
                    $scope.refreshCustomerOrderDetail();
                });
            }

            /**
             * 订单详情
             * @param obj
             */
            $scope.showOrderDetails = function showOrderDetails(obj) {
                obj.contractStartDate = new Date(obj.contractStartDate);
                obj.contractEndDate = new Date(obj.contractEndDate);
                $scope.order = angular.copy(obj);
                //计算下折扣率
                $scope.order.privilegeRatio = 100 - Number(($scope.order.privilegeAmount * 100 / $scope.order.totalPrice).toFixed(1));
                $scope.order.privilegeRatio = Number($scope.order.privilegeRatio.toFixed(1));
                $scope.modalTitleDetail = '查看';
                if (3 == $scope.order.orderCategory) {//    充值订单
                    $scope.orderDetailTopUp = angular.copy(obj);
                    $scope.orderDetailTopUp.privilegeRatio = 100 - Number(($scope.orderDetailTopUp.privilegeAmount * 100 / $scope.orderDetailTopUp.totalPrice).toFixed(1));
                    $scope.orderDetailTopUp.privilegeRatio = Number($scope.orderDetailTopUp.privilegeRatio.toFixed(1));
                    $scope.modalDetail = _modal('partials/sos/order/detailTopupCus.html')
                    $scope.getOrderChargingScheme(); // 获取计费方案的信息
                    $scope.getGradeIDs();            // 获取年级
                }
                else if (2 == $scope.order.orderCategory) { //   O2O订单（手机订单）
                    $scope.modalDetail = _modal('partials/sos/order/detailOTO.html')
                    $scope.getOrderCourses();
                } else {
                    $scope.orderOperating = 6
                    $scope.modalDetail = _modal(mtModal.detail)//'partials/sos/order/detail.html'
                    $scope.getOrderCourses();
                }
                //$scope.getContractorPositionsSelect();
                //$scope.onContractorPositionSelect();
                $scope.getCustomerBelongersSelect();
                $scope.getOrderAchievementRatios();//获取订单的业绩比例
                $scope.getOrderRelationTeachers(); //获取订单的相关教师
                $scope.getOrderPayments();
            };

            $scope.getContractorPositionsSelect = function getContractorPositionsSelect() {
                OrderService.getContractorPositionsSelect().then(function (result) {
                    $scope.contractorPositions = result.data;
                });
            }

            $scope.onContractorPositionSelect = function onContractorPositionSelect() {
                OrderService.getContractorsSelect($scope.order.contractorPosition).then(function (result) {
                    $scope.contractors = result.data;
                });
            };

            $scope.getCustomerBelongersSelect = function getCustomerBelongersSelect() {
                OrderService.getCustomerBelongersSelect().then(function (result) {
                    $scope.customerBelongers = result.data;
                });
            };

            //订单的课程信息列表
            $scope.getOrderCourses = function getOrderCourses() {
                if (!check_null($scope.order.isAudition)) {//这个数据手台没有传过来
                    $scope.order.isAudition = 0;
                }
                OrderService.getOrderCourses($scope.start, $scope.number, $scope.order.orderNo, $scope.detail.crm_student_id).then(function (result) {
                    $scope.order.orderCourses = result.data;
                    //计算订单信息属性
                    $scope.totalPastCourse = 0;
                    $scope.currentMonthPastCourse = 0;
                    angular.forEach($scope.order.orderCourses, function (data, index, array) {
                        //获取订单累计已消课时（订单总课时-订单剩余课时 ）
                        $scope.totalPastCourse = $scope.totalPastCourse + data.originalNumActual * 1 - data.courseNum;
                        //获取订单本月已消课时
                        var searchModel = {};
                        searchModel.start = 0;
                        searchModel.size = 0;
                        searchModel.crmOrderStudentCourseId = data.id;
                        searchModel.isPast = 1;
                        var now = new Date();
                        var nowDayOfWeek = now.getDay();         //今天本周的第几天
                        var nowDay = now.getDate();              //当前日
                        var nowMonth = now.getMonth();           //当前月
                        var nowYear = now.getYear();             //当前年
                        nowYear += (nowYear < 2000) ? 1900 : 0;
                        //获得本月的开始日期
                        var getMonthStartDate = new Date(nowYear, nowMonth, 1);
                        //获得本月的结束日期
                        var getMonthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
                        //获得某月的天数
                        function getMonthDays(myMonth) {
                            var monthStartDate = new Date(nowYear, myMonth, 1);
                            var monthEndDate = new Date(nowYear, myMonth + 1, 1);
                            var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
                            return days;
                        }

                        searchModel.searchStartTime = getMonthStartDate;
                        searchModel.searchEndTime = getMonthEndDate;
                        CoursePlanService.getList(searchModel)
                            .then(function (result) {
                                angular.forEach(result.list, function (data, index, array) {
                                    var courseNum = 0;
                                    if ($scope.order.orderRule === 1) {
                                        courseNum = (data.endTime - data.startTime) / (1000 * 60 * 60);
                                    } else if ($scope.order.orderRule === 2) {
                                        courseNum = (data.endTime - data.startTime) / (1000 * 60 * 40);
                                    }
                                    $scope.currentMonthPastCourse = $scope.currentMonthPastCourse + courseNum;
                                });
                            });
                    });
                    //根据student 获取客户试听的教师列表
                    OrderService.getStudentAuditionTeachingList($scope.detail.crm_student_id).then(function (result) {
                        $scope.Teachers = result.data;

                        //$scope.initData();
                    });
                    $scope.initData();
                });
            };
            $scope.initData = function initData() {
                $scope.order.totalOriginalNum = 0;
                $scope.order.totalPrice = 0;
                $scope.order.supplementaryFee = 0;
                angular.forEach($scope.order.orderCourses, function (data, index, array) {
                    var originalNum = data.originalNum;
                    if (!originalNum || originalNum == '') {
                        originalNum = 0;
                    }
                    console.log(data.isRegularCharge);
                    // 判断是否是期 是期，则单位为 次或期 、小时或期，若是期，数量=每次的次数（或小时）* 期数
                    if (data.isRegularCharge) {
                        if (data.courseBuyUnit == 3) {
                            originalNum = originalNum * data.currentRegularTimes;
                            data.isRegularCharge = true;
                        }
                    }
                    console.log(data.courseUnit);
                    // 按课时计费
                    if (data.courseUnit == 1) {
                        $scope.order.totalOriginalNum = parseInt($scope.order.totalOriginalNum) + parseInt(originalNum);
                    } else if (data.courseUnit == 2) {
                        $scope.order.totalOriginalTimes = parseInt($scope.order.totalOriginalTimes) + parseInt(originalNum);
                    } else {

                        $scope.order.totalOriginalNum = parseInt($scope.order.totalOriginalNum) + parseInt(originalNum);
                    }
                    $scope.order.totalPrice = $scope.order.totalPrice + (data.originalNum * data.actualPrice);
                });
                //计算下折扣率
                $scope.order.privilegeRatio = 100 - Number(($scope.order.privilegeAmount * 100 / $scope.order.totalPrice).toFixed(1));
                $scope.order.privilegeRatio = Number($scope.order.privilegeRatio.toFixed(1));
                //计算平均课时单价
                $scope.averageCoursePrice = 0;
                if ($scope.order.totalOriginalNum > 0) {
                    $scope.averageCoursePrice = $scope.order.realTotalAmount / $scope.order.totalOriginalNum;
                    $scope.averageCoursePrice = $scope.averageCoursePrice.toFixed(2);
                }
                //设置总时长
                if ($scope.order.orderRule == 1) {
                    $scope.order.hours = $scope.order.totalOriginalNum;
                    $scope.order.minite = 0;
                } else {
                    $scope.order.hours = parseInt($scope.order.totalOriginalNum * 40 / 60);
                    $scope.order.minite = parseInt(($scope.order.totalOriginalNum * 40) % 60);
                }
            };

            $scope.getCustomerOrderTransferAvailables = function getCustomerOrderTransferAvailables() {
                if ($scope.detail.crm_student_id) {
                    OrderService.getCustomerOrderTransferAvailables($scope.detail.crm_student_id).then(function (result) {
                        //$scope.orderTransferAvailableOrders = result.data;
                        //充值订单列表 和 课时订单列表
                        $scope.orderTransferAvailableOrders = [];
                        $scope.orderRechargeTransferAvailableOrders = [];
                        angular.forEach(result.data, function (data, index, array) {
                            if (data.orderCategory == 1) {
                                $scope.orderTransferAvailableOrders.push(data);
                            } else if (data.orderCategory == 3) {
                                $scope.orderRechargeTransferAvailableOrders.push(data);
                            }
                        });
                        //console.dir($scope.orderTransferAvailables);
                    });
                }
            };

            $scope.getCustomerOrderRestitutionAvailables = function getCustomerOrderTransferAvailables() {
                if ($scope.detail.crm_student_id) {
                    OrderService.getCustomerOrderRestitutionAvailables($scope.detail.crm_student_id).then(function (result) {
                        $scope.orderRestitutionAvailableOrders = result.data;
                    });
                }
            };

            $scope.getCustomerOrderRestitutionAvailablesByList = function getCustomerOrderTransferAvailablesByList(row) {
                if (row.crm_student_id) {
                    OrderService.getCustomerOrderRestitutionAvailables(row.crm_student_id).then(function (result) {
                        $scope.orderRestitutionAvailableOrders = result.data;
                    });
                }
            };
            $scope.getCustomerOrderTransferAvailablesByList = function getCustomerOrderTransferAvailablesByList(row) {
                if (row.crm_student_id) {
                    OrderService.getCustomerOrderTransferAvailables(row.crm_student_id).then(function (result) {
                        //$scope.orderTransferAvailableOrders = result.data;
                        //充值订单列表 和 课时订单列表
                        $scope.orderTransferAvailableOrders = [];
                        $scope.orderRechargeTransferAvailableOrders = [];
                        angular.forEach(result.data, function (data, index, array) {
                            if (data.orderCategory == 1) {
                                $scope.orderTransferAvailableOrders.push(data);
                            } else if (data.orderCategory == 3) {
                                $scope.orderRechargeTransferAvailableOrders.push(data);
                            }
                        });
                        //console.dir($scope.orderTransferAvailables);
                    });
                }
            };
            $scope.customerExceptionStatusIds = [
                { id: 1, name: '无异常' },
                { id: 2, name: '早已结课' },
                { id: 3, name: '早已退费' },
                { id: 4, name: '早已转课' },
                { id: 5, name: '未知异常' }
            ];

            $scope.changeCustomerExceptionStatus = function (row, status) {
                if (status == row.customerExceptionStatus) {
                    return;
                } else {
                    CustomerStudentService.updateCustomerExceptionStatus(row.crm_student_id, status).then(function (response) {
                        if (response.status == 'SUCCESS') {
                            row.customerExceptionStatus = status;
                            $('popup').hide();
                        } else {
                            SweetAlert.swal(response.error);
                        }
                    });

                }
            };

            $scope.addRestitutionOrder = function addRestitutionOrder(row) {
                $scope.order = {};
                if (row) {
                    $scope.detail = row;
                }
                $scope.modalTitle = '新增返课';
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/addRestitution.html',
                    show: true
                });
                $scope.getCustomerOrderRestitutionAvailables();
            }

            /**
             * 刷新客户订单相关列表信息
             */
            $scope.refreshCustomerOrderDetail = function refreshCustomerOrderDetail() {
                var tableState = { 'pagination': {}, 'search': { 'predicateObject': {} } };
                //if( $scope.iso2o ){
                //  $scope.callServerO2OOrderTab(tableState);
                //}
                $scope.callServerO2OOrderTab(tableState);
                $scope.callServerNormalOrderTab(tableState);
                $scope.callServerRestitutionTab(tableState);
                $scope.callServerPaymentTab(tableState);
                $scope.callServerAllOrderReturnFei(tableState);
            }


            /**
             * 判断是否超过23点
             * @param start
             * @param end
             * @returns {boolean}
             * @private
             */
            function _ifNotOut23(end) {
                var en = new Date(end).getHours();
                var end_m = new Date(end).getMinutes();
                var end_s = new Date(end).getSeconds();
                if (en >= 23 || (en == 0 && end_m == 0 && end_s == 0)) {
                    return true;
                }
                /*  if(en>23 ||(en==0&&end_m==0&&end_s==0)){
                 return false;
                 }*/
                return false;
            }

            /**
             * 判断时间是否夸天
             * @param start  时间戳
             * @param end 时间戳
             * @returns {boolean}
             * @private
             */
            function _ifNotOneDay(start, end) {
                var st = new Date(start).getHours();
                var en = new Date(end).getHours();
                var end_m = new Date(end).getMinutes();
                var end_s = new Date(end).getSeconds();
                if (st > en) {//开始销售数大于结束时间小时数
                    if (end_m == 0 && end_s == 0 && en == 0) {
                        return false;
                    } else {
                        return true;
                    }

                }
                /*  if(en>23 ||(en==0&&end_m==0&&end_s==0)){
                 return false;
                 }*/
                return false;
            }

            function channleEdit() {
                $scope.select = {};
                $scope.dataLoading = false;
                $scope.modal.hide();
                if ($scope.myCoursePlanTableState) {
                    $scope.callServer($scope.myCoursePlanTableState);
                }
                if ($scope.coursePlanRecordTableState) {
                    $scope.callCoursePlanServer($scope.coursePlanRecordTableState);
                }
            }

            function showSelect(row) {
                /* $scope.myCoursePlanRecordTableState.pagination.start = 0;*/
                if (row.userId == $scope.OmsCoursePlanVoForEdit.user) {
                    return true;
                }
                else {
                    return false;
                }

            }

            /**
             * 设置学员显示剩余课时
             */
            function confirmShowLeftClassHour(detail) {
                SweetAlert.swal({
                    title: "",
                    text: "\n\n\n\n选择显示剩余课时/金额后，学员可在学生端看到剩余课时/金额，确认？\n\n\n\n",
                    type: "",
                    showCancelButton: true,
                    confirmButtonColor: '#fe9900',
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    closeOnConfirm: false
                },
                    function (confirm) {
                        if (confirm) {
                            CustomerStudentService.confirmShowLeftClassHour(detail.crm_student_id).then(function (response) {
                                if (response.status == "FAILURE") {
                                    SweetAlert.swal("确认显示剩余课时/金额出错，请重试");
                                }
                                else {
                                    $scope.isShowLeftClasshour = true;
                                    $scope.detail.isShowLeftClasshour = true;
                                    SweetAlert.swal("确认显示剩余课时/金额成功");
                                }
                            });
                        }
                    });
            }

            /*****************兑换余额操作****************/
            /**
             * 展示兑换弹窗
             */
            function showExchangeBalanceModal() {
                $scope.exchangeAll = false; //兑换全部标识
                $scope.exchangeList = new Array(); //兑换集合

                $scope.exchangeCourseNum = 0;
                $scope.exchangeCourseValue = 0.00;
                $scope.exchangeBalanceTitle = '兑换余额';
                $scope.exchangeBalanceModel = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/customer/modal.exchangeBalance.html',
                    show: true,
                    backdrop: "static"
                });

                var searchCoursesMap = new Map();
                searchCoursesMap.put('orderNo', 'null');
                searchCoursesMap.put('customContidion', 'AND cosc.course_num > 0 AND t_order.order_status = "3"');
                searchCoursesMap.put('crmStudentId', $scope.detail.crm_student_id);
                OrderService.getOrderCourseList(searchCoursesMap.data).then(function (result) {
                    $scope.exchangeBalanceCourses = result;
                    //计算原始课时数的和
                    var originalNumMap = new Map();
                    angular.forEach($scope.exchangeBalanceCourses, function (data, index, array) {
                        if (originalNumMap.get(data.orderNo) != null) {
                            var orderAttribute = originalNumMap.get(data.orderNo);
                            orderAttribute.totalOriginalNum = orderAttribute.totalOriginalNum + data.originalNum;
                            originalNumMap.put(data.orderNo, orderAttribute);
                        } else {
                            var orderAttribute = {};
                            orderAttribute.totalOriginalNum = data.originalNum;
                            orderAttribute.realTotalAmount = 0.00;
                            orderAttribute.averageCoursePrice = 0.00;
                            originalNumMap.put(data.orderNo, orderAttribute);
                        }
                    });
                    //取得订单实际总价
                    OrderService.getPage(0, 300, 7, { 'crmStudentId': $scope.detail.crm_student_id }).then(function (result) {
                        var orders = result.data;
                        angular.forEach(orders, function (data, index, array) {
                            originalNumMap.each(function (key, value, index) {
                                if (key === data.orderNo) {
                                    var orderAttribute = originalNumMap.get(data.orderNo);
                                    orderAttribute.realTotalAmount = orderAttribute.realTotalAmount + data.realTotalAmount;
                                    orderAttribute.realTotalAmount = orderAttribute.realTotalAmount.toFixed(2);
                                    originalNumMap.put(key, orderAttribute);
                                }
                            });
                        });
                        //计算课时平均单价
                        originalNumMap.each(function (key, value, index) {
                            var orderAttribute = value;
                            if (orderAttribute.totalOriginalNum > 0) {
                                orderAttribute.averageCoursePrice = orderAttribute.realTotalAmount / orderAttribute.totalOriginalNum;
                                orderAttribute.averageCoursePrice = orderAttribute.averageCoursePrice.toFixed(2);
                            }
                            originalNumMap.put(key, orderAttribute);
                        });
                        //给课程订单明细赋值
                        angular.forEach($scope.exchangeBalanceCourses, function (data, index, array) {
                            data.courseValue = 0;
                            if (originalNumMap.get(data.orderNo) != null) {
                                var orderAttribute = originalNumMap.get(data.orderNo);
                                data.courseValue = orderAttribute.averageCoursePrice;
                            }
                        });
                    });
                });
            }

            /**
             * 计算总兑换
             */
            function calculateTotalExchange(row) {
                //校验手动输入的情况
                if (row.exchangeCourseNum != null) {
                    row.exchangeCourseNum = row.exchangeCourseNum * 1
                    var calculateRemainderCourseNum = row.exchangeCourseNum % 0.5;
                    if (calculateRemainderCourseNum > 0) {
                        row.exchangeCourseNum = row.exchangeCourseNum - calculateRemainderCourseNum * 1;
                    }
                }
                $scope.exchangeCourseNum = 0;
                $scope.exchangeCourseValue = 0.00;
                angular.forEach($scope.exchangeBalanceCourses, function (data, index, array) {
                    if (data.exchangeCourseNum != null) {
                        $scope.exchangeCourseNum = $scope.exchangeCourseNum + data.exchangeCourseNum; //兑换总课时
                        $scope.exchangeCourseValue = $scope.exchangeCourseValue * 1 + (data.exchangeCourseNum * (data.courseValue * 1)); //兑换总金额
                        $scope.exchangeCourseValue = $scope.exchangeCourseValue.toFixed(2);
                    }
                });
                //比较兑换后的剩余课时和当前课程的已排课时
                var extraCourseNumAfterExchange = row.courseNum - row.exchangeCourseNum; //兑换后剩余课时
                var alreadyCourseNum = row.courseNum - row.planAvailableNum; //当前课程的已排课时
                if (extraCourseNumAfterExchange < alreadyCourseNum) {
                    SweetAlert.swal({
                        title: "确定要删除吗？",
                        text: "学管已在系统中对该学员排了多于当前课程兑换后剩余课时的数量，点击确定继续修改剩余课时，" +
                        "学员在该课程下的排课记录将会删除。学管可以按兑换后的课时重新排课。",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: '#fe9900',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: false
                    },
                        function (confirm) {
                            if (confirm) {
                                var coursePlan = new Object();
                                coursePlan.crmOrderStudentCourseId = row.id;
                                coursePlan.crmStudentId = $scope.detail.crm_student_id;
                                var promise = CoursePlanService.deleteByModel(coursePlan);
                                promise.then(function (result) {
                                    if (result >= 0) {
                                        SweetAlert.swal("已删除!", "学员在该课程下的排课记录已删除", "success");
                                        row.planAvailableNum = row.courseNum;
                                    } else {
                                        SweetAlert.swal("删除失败！", "error");
                                    }
                                }, function (error) {
                                    SweetAlert.swal("删除失败！", "error");
                                });
                            }
                        }
                    );
                }
            }

            /**
             * 兑换单行
             */
            function exchangeRow(row) {
                if (row.isExchanged === null) {
                    row.isExchanged = true;
                } else {
                    row.isExchanged = !(row.isExchanged);
                }
            }

            /**
             * 单行是否被选中
             */
            function isRowExchanged(row) {
                if (row.isExchanged === null) {
                    return false;
                } else {
                    return row.isExchanged;
                }
            }

            /**
             * 兑换全部
             */
            function exchangeAllRows() {
                $scope.exchangeList = new Array();
                angular.forEach($scope.exchangeBalanceCourses, function (data, index, array) {
                    if ($scope.exchangeAll === false && data.courseProperty === 1 && data.orderStatus === '3') {
                        data.isExchanged = true;
                    } else {
                        data.isExchanged = false;
                    }
                });
                $scope.exchangeAll = !($scope.exchangeAll);
            }

            /**
             * 是否选中全部
             */
            function isExchangedAll() {
                return $scope.exchangeAll;
            }

            /**
             * 兑换余额确定
             */
            function exchangeBalance() {
                angular.forEach($scope.exchangeBalanceCourses, function (data, index, array) {
                    if (data.isExchanged === true) {
                        var exchangeModel = {};
                        exchangeModel.crmOrderCourseId = data.id;  //兑换的订单课程关联id
                        exchangeModel.exchangeNum = 0; //兑换的课时
                        exchangeModel.orderNo = data.orderNo; //兑换的合同号
                        exchangeModel.extraNum = data.courseNum; //兑换后剩余的课时
                        if (data.exchangeCourseNum != null) {
                            exchangeModel.exchangeNum = data.exchangeCourseNum;
                            exchangeModel.extraNum = data.courseNum - data.exchangeCourseNum;
                        }
                        exchangeModel.exchangeAmount = exchangeModel.exchangeNum * data.courseValue; //兑换金额
                        exchangeModel.exchangeAmount = exchangeModel.exchangeAmount.toFixed(2);
                        exchangeModel.extraAmount = exchangeModel.extraNum * data.courseValue; //兑换后剩余金额
                        exchangeModel.extraAmount = exchangeModel.extraAmount.toFixed(2);
                        $scope.exchangeList.push(exchangeModel);
                    }
                });
                var postData = new Map();
                postData.put('crmStudentId', $scope.detail.crm_student_id);
                postData.put('detail', $scope.exchangeList);
                CustomerStudentService.exchangeBalance(postData.data).then(function (result) {
                    $scope.exchangeList = new Array();
                    $scope.accountBalanceAfterExchange = result;
                    $scope.exchangeBalanceModel.hide();
                    //弹出成功弹窗
                    SweetAlert.swal({
                        title: "操作成功",
                        test: "学员电子账户余额" + $scope.accountBalanceAfterExchange,
                        type: "success",
                        confirmButtonColor: '#fe9900',
                        confirmButtonText: '确定',
                        closeOnConfirm: true
                    },
                        function (confirm) {
                            if (confirm) {
                                $scope.callServerNormalOrderTab($scope.normalOrderTabTableState);
                                $scope.callServer($scope.myCoursePlanTableState);
                                $scope.getExchangeBalanceList($scope.exchangeBalanceTableState);
                                var student = new Object();
                                student.crm_student_id = $scope.detail.crm_student_id;
                                CustomerStudentService.detail(student).then(function (result) {
                                    $scope.detail = result;
                                });
                            }
                        });
                });
            }

            /* -------------------------------------------------------------------------------- */

            /* --------------------------------查询兑换余额列表------------------------------------ */
            function getExchangeBalanceList(tableState) {
                $scope.exchangeBalanceTableState = tableState;
                $scope.pagination = tableState.pagination;
                $scope.start = $scope.pagination.start || 0;
                $scope.number = $scope.pagination.number || 10;
                $scope.exchangeBalanceModel = {};
                $scope.exchangeBalanceModel.crmStudentId = ($scope.detail ? $scope.detail.crm_student_id : $scope.detailForUpdate.crm_student_id)
                $scope.exchangeBalanceModel.start = $scope.start;
                $scope.exchangeBalanceModel.size = $scope.number;
                CustomerStudentService.getExchangeBalancePage($scope.exchangeBalanceModel).then(function (result) {
                    $scope.exchangeBalances = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;
                });
            }

            /* --------------------------------------------------------------------------------- */
            // 学员-退费操作展示的订单列表  fanl
            $scope.callServerAllOrderReturnFei = function callServerAllOrderReturnFei(tableState) {
                $scope.allOrderTabTableState = tableState;
                if ($scope.detail) {
                    $scope.isNormalOrderLoading = true;
                    $scope.orderFlag = 11;
                    $scope.pagination = tableState.pagination;
                    $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
                    OrderService.getPage($scope.start, $scope.number, $scope.orderFlag, { 'crmStudentId': $scope.detail.crm_student_id }).then(function (result) {
                        $scope.allOrders = result.data;
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.isNormalOrderLoading = false;
                    });
                }
            }

            //普单
            $scope.callServerNormalOrderTab = function callServerNormalOrderTab(tableState) {
                $scope.normalOrderTabTableState = tableState;
                //console.log($scope.detail);
                if ($scope.detail) {
                    $scope.isNormalOrderLoading = true;
                    $scope.orderFlag = 7;
                    $scope.pagination = tableState.pagination;
                    $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
                    //console.log('call server'+tableState);
                    // $scope.orderFilter.level = 1
                    OrderService.getPage($scope.start, $scope.number, $scope.orderFlag, { 'crmStudentId': $scope.detail.crm_student_id,level:1 }).then(function (result) {
                        $scope.normalOrders = result.data;
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.isNormalOrderLoading = false;
                    });
                }
            };

            $scope.o2oOrders = [];
            $scope.callServerO2OOrderTab = function callServerO2OOrderTab(tableState) {
                //console.log($scope.detail);
                if ($scope.detail) {
                    $scope.iso2oOrderLoading = true;
                    $scope.orderFlag = 7;
                    $scope.o2opagination = tableState.pagination;
                    $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
                    //console.log('call server'+tableState);
                    OrderService.getPageO2O($scope.start, $scope.number, $scope.detail.crm_student_id).then(function (result) {
                        $scope.o2oOrders = result.data;
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.iso2oOrderLoading = false;
                    });
                }
            };

            //返课
            $scope.callServerRestitutionTab = function callServerRestitutionTab(tableState) {
                if ($scope.detail) {
                    $scope.orderFlag = 8;
                    $scope.isRestitutionLoading = true;
                    $scope.pagination = tableState.pagination;
                    $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
                    //console.log('call server' + tableState);
                    OrderService.getPage($scope.start, $scope.number, $scope.orderFlag, { 'crmStudentId': $scope.detail.crm_student_id }).then(function (result) {
                        $scope.restitutions = result.data;
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.isRestitutionLoading = false;
                    });
                }
            };

            //交费
            $scope.callServerPaymentTab = function callServerPaymentTab(tableState) {
                // ;alert('callServerPaymentTab'+tableState);
                if ($scope.detail) {
                    //if($scope.iso2o){
                    //  $scope.payments = [];
                    //  return;
                    //}
                    $scope.isPaymentLoading = true;
                    $scope.pagination = tableState.pagination;
                    $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
                    OrderService.getCustomerPaymentsPage($scope.start, $scope.number, $scope.detail.crm_student_id).then(function (result) {
                        $scope.payments = result.data;
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.isPaymentLoading = false;
                    });
                }
            };


            /**
             * 判断是否为线上运营人员岗位
             */
            $scope.isO2OOperationSpecialist = function () {
                var isO2OOperationSpecialist = false;
                if (AuthenticationService.currentUser().position_id == Constants.PositionID.O2O_OPERATION_SPECIALIST) {
                    isO2OOperationSpecialist = true;
                }
                return isO2OOperationSpecialist;
            }

            /**
             * 学生客户列表
             */
            $scope.myCrmCustomerStudentFilter = {}; //学生客户过滤器
            $scope.MyCrmCustomerStudentList = [];
            $scope.myCrmCustomerStudentFilter.isSelectedGraduation = true;
            $scope.myCrmCustomerStudentFilter.removeAbnormal = true;
            $scope.getStudentBySome = function getStudentBySome() {
                if (angular.element('.mt-select').find('input.ng-invalid').length) {
                    return false
                }
                $scope.myCrmCustomerStudentListTableState.pagination.start = 0
                $scope.myCrmCustomerStudentListTableState.search.predicateObject.pageNum = 1
                $scope.myCrmCustomerStudentFilter.pageNum = 1
                $scope.getMyCrmCustomerStudentList($scope.myCrmCustomerStudentListTableState);
            }
            /**
             * 删除对象里面的空属性
             * @param obj
             * 传入一个对象
             * @returns {*}
             * 返回一个新对象
             */
            var deleteIsNull = function (obj) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key) && obj[key] === '') {
                        delete obj[key]
                    }
                }
                return obj
            }
            if (AuthenticationService.currentUser().position_id == Constants.PositionID.TEACHER
                || AuthenticationService.currentUser().position_id == Constants.PositionID.TEACHER_MASTER) {
                $scope.isTeacherOrTeacherMaster = true;
            }
            else {
                $scope.isTeacherOrTeacherMaster = false;
            }

            $scope.getMyCrmCustomerStudentList = function callServer(tableState) {
                //获取 订单的主从关系下拉列表
                var promise = OrderService.masterSlaveRelation();
                promise.then(function (result) {
                    $scope.masterSlaveRelation = result;
                })

                //教师和教务主管
                if (!tableState.pagination) {
                    tableState.pagination = {};
                    tableState.search = {};
                    tableState.search = { predicateObject: {} };
                }
                console.log($rootScope.currentUser)
                console.log(AuthenticationService.currentUser().position_id)
                console.log(Constants.PositionID.TEACHER)
                console.log(Constants.PositionID.TEACHER_MASTER)
                if (AuthenticationService.currentUser().position_id == Constants.PositionID.TEACHER
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.TEACHER_MASTER) {
                    /*$scope.myCrmCustomerStudentFilter.positionId = AuthenticationService.currentUser().position_id;
                     $scope.myCrmCustomerStudentFilter.departmentId = AuthenticationService.currentUser().position_id;*/
                    $scope.isLoading = true;
                    $scope.myCrmCustomerStudentListTableState = tableState;
                    var pagination = tableState.pagination;
                    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    var number = pagination.number || 10;  // Number of entries showed per page.
                    $scope.currentTimstamp = new Date().getTime();
                    CustomerStudentService.getStudentListForTeacher(start, number, tableState, $scope.myCrmCustomerStudentFilter).then(function (result) {
                        $scope.getAllSelected();
                        $scope.MyCrmCustomerStudentList = result.data;
                        console.log($scope.MyCrmCustomerStudentList)
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.isLoading = false;
                    });
                }
                //其他能看学员管理的岗位
                else {
                    $rootScope.getMyCrmCustomerStudentList = $scope.getMyCrmCustomerStudentList
                    $rootScope.tableState = tableState
                    // 判断当前部门是不是466，是的话一级渠道只显示媒体
                    if (localStorageService.get('school_id') == Constants.DepartmentID.WANGLUOYINGXIAOBU) {

                        $scope.myCrmCustomerStudentFilter.media_channel_id_1 = Constants.MediaChannel.CHANNEL4;
                        $scope.myCrmCustomerStudentFilter.mediaChannelId1= Constants.MediaChannel.CHANNEL4;
                        //获取二级渠道
                        CommonService.getMediaChannel(Constants.MediaChannel.CHANNEL4).then(function (result) {
                            $scope.mediaChannel2ListForMyFilter = result.data;
                            $scope.mediaChannelDisabled = true;
                        });
                    }
                    else if ($scope.isO2OOperationSpecialist()) {
                        $scope.myCrmCustomerStudentFilter.media_channel_id_1 = Constants.MediaChannel.CHANNEL8;
                        $scope.myCrmCustomerStudentFilter.mediaChannelId1= Constants.MediaChannel.CHANNEL8;

                        //获取二级渠道
                        CommonService.getMediaChannel(Constants.MediaChannel.CHANNEL8).then(function (result) {
                            $scope.mediaChannel2ListForMyFilter = result.data;
                            $scope.mediaChannelDisabled = true;
                        });
                    }
                    else {
                        $scope.mediaChannelDisabled = false;
                    }
                    $scope.myCrmCustomerStudentListTableState = tableState;
                    if ($scope.myCrmCustomerStudentFilter.next_visit_at) {
                        $scope.myCrmCustomerStudentFilter.nextVisitAt = $filter('date')($scope.myCrmCustomerStudentFilter.next_visit_at, 'yyyy-MM-dd');
                        ;
                    } else {
                        $scope.myCrmCustomerStudentFilter.nextVisitAt = null;
                    }

                    if ($scope.isSelectedGraduation) {
                        $scope.myCrmCustomerStudentFilter.isSelectedGraduation = $scope.isSelectedGraduation;
                    }
                    if ($scope.removeAbnormal) {
                        $scope.myCrmCustomerStudentFilter.removeAbnormal = $scope.removeAbnormal;
                    }
                    //console.dir(tableState);
                    $scope.isLoading = true;
                    var pagination = tableState.pagination;
                    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    var number = pagination.number || 10;  // Number of entries showed per page.
                    $scope.currentTimstamp = new Date().getTime();
                    try {
                        $scope.myCrmCustomerStudentFilter = deleteIsNull($scope.myCrmCustomerStudentFilter)
                    } catch (e) { }
                    //如果是呼叫权限的人，则查询所属机构下校区的数据，呼叫客信的数据
                    if ($rootScope.showPermissions('PermissionForCallCenter')) {
                        $scope.myCrmCustomerStudentFilter.media_channel_id_1 = 1;
                        $scope.myCrmCustomerStudentFilter.media_channel_id_2 = 30;
                        $scope.myCrmCustomerStudentFilter.mediaChannelId1 = 1;
                        $scope.myCrmCustomerStudentFilter.mediaChannelId2 = 30;
                        CommonService.getMediaChannel($scope.myCrmCustomerStudentFilter.media_channel_id_1).then(function (result) {
                            $scope.mediaChannel2ListForMyFilter = result.data;
                        });
                        //传递部门id
                        $scope.myCrmCustomerStudentFilter.departmentId = localStorageService.get('department_id');
                        $scope.myCrmCustomerStudentFilter.PermissionForCallCenter = '1';
                    }
                    CustomerStudentService.simpleList(start, number, tableState, $scope.myCrmCustomerStudentFilter).then(function (result) {
                        //console.dir(result.data);
                        $scope.getAllSelected();
                        $scope.MyCrmCustomerStudentList = result.data;
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                       if($scope.MyCrmCustomerStudentList!=null&&$scope.MyCrmCustomerStudentList.length>0){
                           var crmStudentIds = [];
                           for(var i=0;i<$scope.MyCrmCustomerStudentList.length;i++){
                               $scope.MyCrmCustomerStudentList[i].crm_student_id=$scope.MyCrmCustomerStudentList[i].id;
                               $scope.MyCrmCustomerStudentList[i].id=null;
                               crmStudentIds.push($scope.MyCrmCustomerStudentList[i].crm_student_id);
                           }
                           $scope.isLoading = false;
                           CustomerStudentService.getCustomerAmountInfos(crmStudentIds).then(function (result) {
                               var data = result.data;
                               for(var i=0;i<$scope.MyCrmCustomerStudentList.length;i++){
                                  for(var j=0;j<data.length;j++){
                                      if(data[j].crmStudentId==$scope.MyCrmCustomerStudentList[i].crm_student_id){
                                          $scope.MyCrmCustomerStudentList[i].orderNum=data[j].orderNum;
                                          $scope.MyCrmCustomerStudentList[i].courseAmount=data[j].courseAmount;
                                          $scope.MyCrmCustomerStudentList[i].allPastCoursePlanCount=data[j].allPastCoursePlanCount;
                                          $scope.MyCrmCustomerStudentList[i].allCoursePlanCount=data[j].allCoursePlanCount;
                                          break;
                                      }
                                  }
                               }
                           })

                       }
                        $scope.isLoading = false;
                        setTimeout(function () {
                            // angular.element('#body').scroll()
                            initCol()
                            resatList()
                        }, 100)
                    });

                    //顾问信息
                    /*CommonService.getAllUsersBelongGuWen().then(function(result){
                     //console.dir(result);
                     $scope.guWenList = result.data;
                     })*/
                }
            };


            $scope.getWarningStudentList = function getWarningStudentList(tableState) {
                var promise = OrderService.masterSlaveRelation();
                promise.then(function (result) {
                    $scope.masterSlaveRelation = result;
                })

                $rootScope.getWarningStudentList = $scope.getWarningStudentList
                $rootScope.tableState = tableState
                // 判断当前部门是不是466，是的话一级渠道只显示媒体
                if (localStorageService.get('school_id') == Constants.DepartmentID.WANGLUOYINGXIAOBU) {

                    $scope.myCrmCustomerStudentFilter.media_channel_id_1 = Constants.MediaChannel.CHANNEL4;
                    //获取二级渠道
                    CommonService.getMediaChannel(Constants.MediaChannel.CHANNEL4).then(function (result) {
                        $scope.mediaChannel2ListForMyFilter = result.data;
                        $scope.mediaChannelDisabled = true;
                    });
                }
                else if ($scope.isO2OOperationSpecialist()) {
                    $scope.myCrmCustomerStudentFilter.media_channel_id_1 = Constants.MediaChannel.CHANNEL8;
                    //获取二级渠道
                    CommonService.getMediaChannel(Constants.MediaChannel.CHANNEL8).then(function (result) {
                        $scope.mediaChannel2ListForMyFilter = result.data;
                        $scope.mediaChannelDisabled = true;
                    });
                }
                else {
                    $scope.mediaChannelDisabled = false;
                }
                $scope.myCrmCustomerStudentListTableState = tableState;
                if ($scope.myCrmCustomerStudentFilter.next_visit_at) {
                    $scope.myCrmCustomerStudentFilter.nextVisitAt = $filter('date')($scope.myCrmCustomerStudentFilter.next_visit_at, 'yyyy-MM-dd');
                    ;
                } else {
                    $scope.myCrmCustomerStudentFilter.nextVisitAt = null;
                }

                if ($scope.isSelectedGraduation) {
                    $scope.myCrmCustomerStudentFilter.isSelectedGraduation = $scope.isSelectedGraduation;
                }
                if ($scope.removeAbnormal) {
                    $scope.myCrmCustomerStudentFilter.removeAbnormal = $scope.removeAbnormal;
                }
                //console.dir(tableState);
                $scope.isLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                $scope.currentTimstamp = new Date().getTime();
                try {
                    $scope.myCrmCustomerStudentFilter = deleteIsNull($scope.myCrmCustomerStudentFilter)
                } catch (e) { }
                //如果是呼叫权限的人，则查询所属机构下校区的数据，呼叫客信的数据
                if ($rootScope.showPermissions('PermissionForCallCenter')) {
                    $scope.myCrmCustomerStudentFilter.media_channel_id_1 = 1;
                    $scope.myCrmCustomerStudentFilter.media_channel_id_2 = 30;
                    CommonService.getMediaChannel($scope.myCrmCustomerStudentFilter.media_channel_id_1).then(function (result) {
                        $scope.mediaChannel2ListForMyFilter = result.data;
                    });
                    //传递部门id
                    $scope.myCrmCustomerStudentFilter.departmentId = localStorageService.get('department_id');
                    $scope.myCrmCustomerStudentFilter.PermissionForCallCenter = '1';
                }
                CustomerStudentService.warningList(start, number, tableState, $scope.myCrmCustomerStudentFilter).then(function (result) {
                    //console.dir(result.data);
                    $scope.getAllSelected();
                    $scope.MyWarningCrmCustomerStudentList = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                    setTimeout(function () {
                        // angular.element('#body').scroll()
                        initCol()
                        resatList()
                    }, 100)
                });

                //顾问信息
                /*CommonService.getAllUsersBelongGuWen().then(function(result){
                 //console.dir(result);
                 $scope.guWenList = result.data;
                 })*/

            };


            /**
             * 编辑课前资料弹框
             */
            $scope.editPreviewHomework = function (row, type) {
                if (row.coursePlanIdList) {
                    //一对多的编辑资料框
                    $scope.previewHomeworkInfo = {};
                    $scope.previewHomeworkInfo.groupId = row.groupId;
                    $scope.previewHomeworkInfo.gradeId = row.gradeId;
                    $scope.previewHomeworkInfo.type = 1;
                    $scope.previewHomeworkInfo.startTime = row.startTime;
                    $scope.previewHomeworkInfo.endTime = row.endTime;
                    $scope.previewHomeworkInfo.coursePlanIdList = row.coursePlanIdList;
                    $scope.previewHomeworkInfo.isGroupEdit = true;
                }
                else {
                    $scope.previewHomeworkInfo = {};
                    $scope.previewHomeworkInfo.omsCoursePlanId = row.id;
                    $scope.previewHomeworkInfo.gradeId = row.grade_id;
                    $scope.previewHomeworkInfo.subjectId = row.subject_id;
                    $scope.previewHomeworkInfo.type = 1;
                    $scope.previewHomeworkInfo.studentPhone = row.phone;
                    $scope.previewHomeworkInfo.studentName = row.student_name;
                    $scope.previewHomeworkInfo.crmStudentId = row.crmStudentId;
                    $scope.previewHomeworkInfo.startTime = row.start_time;
                    $scope.previewHomeworkInfo.endTime = row.end_time;
                    $scope.previewHomeworkInfo.coursePlanType = row.type;//用来判断是哪种类型的排课
                    $scope.previewHomeworkInfo.groupId = row.groupId;
                }
                if (row.teacherHandouts && row.teacherHandouts.title) {
                    $scope.previewHomeworkInfo.title = row.teacherHandouts.title;
                }
                if (row.reviewHomework && row.reviewHomework.title) {
                    $scope.previewHomeworkInfo.title = row.reviewHomework.title;
                }
                if (row.previewHomework) {
                    $scope.previewHomeworkInfo.packId = row.previewHomework.packId;
                    $scope.previewHomeworkInfo.viewPath = QINIU_TR_DOMIN + row.previewHomework.url;
                    if ($scope.previewHomeworkInfo.viewPath.endsWith("pdf") == false) {
                        $scope.previewHomeworkInfo.viewPath = $scope.previewHomeworkInfo.viewPath + "?odconv/pdf";
                    }
                    //修改
                    var str = decodeURI(angular.copy(row.previewHomework.url));
                    str = str.split('/');
                    $scope.previewHomeworkInfo.filename = str[str.length - 1];
                    $scope.previewHomeworkInfo.url = row.previewHomework.url;
                    $scope.previewHomeworkInfo.vedioUrl = row.previewHomework.vedioUrl;
                    $scope.previewHomeworkInfo.state = row.previewHomework.state;
                    if (!$scope.previewHomeworkInfo.title) {
                        $scope.previewHomeworkInfo.title = row.previewHomework.title;
                    }
                }
                if (type == 1) {
                    $scope.isEdit = true;
                    $scope.isView = false;
                }
                else if (type == 2) {
                    $scope.isEdit = false;
                    $scope.isView = true;
                }
                $scope.editPreviewHomeworkTitle = "编辑课前预习资料";
                $scope.editPreviewHomeworkModal = $modal({ scope: $scope, templateUrl: 'partials/sos/customer/modal.previewHomework.edit.html', show: true, backdrop: 'static' });
            }

            /**
             * 编辑备课笔记弹框
             */
            $scope.editTeacherHandouts = function (row, type) {
                if (row.coursePlanIdList) {
                    //一对多的编辑资料框
                    $scope.teacherHandoutsInfo = {};
                    $scope.teacherHandoutsInfo.groupId = row.groupId;
                    $scope.teacherHandoutsInfo.gradeId = row.gradeId;
                    $scope.teacherHandoutsInfo.type = 3;
                    $scope.teacherHandoutsInfo.startTime = row.startTime;
                    $scope.teacherHandoutsInfo.endTime = row.endTime;
                    $scope.teacherHandoutsInfo.coursePlanIdList = row.coursePlanIdList;
                    $scope.teacherHandoutsInfo.isGroupEdit = true;
                }
                else {
                    $scope.teacherHandoutsInfo = {};
                    $scope.teacherHandoutsInfo.omsCoursePlanId = row.id;
                    $scope.teacherHandoutsInfo.gradeId = row.grade_id;
                    $scope.teacherHandoutsInfo.subjectId = row.subject_id;
                    $scope.teacherHandoutsInfo.type = 3;
                    $scope.teacherHandoutsInfo.studentPhone = row.phone;
                    $scope.teacherHandoutsInfo.studentName = row.student_name;
                    $scope.teacherHandoutsInfo.crmStudentId = row.crmStudentId;
                    $scope.teacherHandoutsInfo.startTime = row.start_time;
                    $scope.teacherHandoutsInfo.endTime = row.end_time;
                    $scope.teacherHandoutsInfo.coursePlanType = row.type;//用来判断是哪种类型的排课
                    $scope.teacherHandoutsInfo.groupId = row.groupId;
                }
                if (row.previewHomework && row.previewHomework.title) {
                    $scope.teacherHandoutsInfo.title = row.previewHomework.title;
                }
                if (row.reviewHomework && row.reviewHomework.title) {
                    $scope.teacherHandoutsInfo.title = row.reviewHomework.title;
                }
                if (row.teacherHandouts) {
                    //修改
                    $scope.teacherHandoutsInfo.packId = row.teacherHandouts.packId;
                    $scope.teacherHandoutsInfo.viewPath = QINIU_TR_DOMIN + row.teacherHandouts.url;
                    if ($scope.teacherHandoutsInfo.viewPath.endsWith("pdf") == false) {
                        $scope.teacherHandoutsInfo.viewPath = $scope.teacherHandoutsInfo.viewPath + "?odconv/pdf";
                    }
                    var str = decodeURI(angular.copy(row.teacherHandouts.url));
                    str = str.split('/');
                    $scope.teacherHandoutsInfo.filename = str[str.length - 1];
                    $scope.teacherHandoutsInfo.url = row.teacherHandouts.url;
                    $scope.teacherHandoutsInfo.state = row.teacherHandouts.state;
                    if (!$scope.teacherHandoutsInfo.title) {
                        $scope.teacherHandoutsInfo.title = row.teacherHandouts.title;
                    }
                }
                if (type == 1) {
                    $scope.isEdit = true;
                    $scope.isView = false;
                }
                else if (type == 2) {
                    $scope.isEdit = false;
                    $scope.isView = true;
                }
                $scope.editTeacherHandoutsTitle = "编辑备课笔记";
                $scope.editTeacherHandoutsModal = $modal({ scope: $scope, templateUrl: 'partials/sos/customer/modal.teacherHandouts.edit.html', show: true, backdrop: 'static' });
            }

            /**
             * 编辑课后作业弹框
             */
            $scope.editReviewHomework = function (row, type) {
                if (row.coursePlanIdList) {
                    //一对多的编辑资料框
                    $scope.reviewHomeworkInfo = {};
                    $scope.reviewHomeworkInfo.groupId = row.groupId;
                    $scope.reviewHomeworkInfo.gradeId = row.gradeId;
                    $scope.reviewHomeworkInfo.type = 4;
                    $scope.reviewHomeworkInfo.startTime = row.startTime;
                    $scope.reviewHomeworkInfo.endTime = row.endTime;
                    $scope.reviewHomeworkInfo.coursePlanIdList = row.coursePlanIdList;
                    $scope.reviewHomeworkInfo.isGroupEdit = true;
                }
                else {
                    $scope.reviewHomeworkInfo = {};
                    $scope.reviewHomeworkInfo.omsCoursePlanId = row.id;
                    $scope.reviewHomeworkInfo.gradeId = row.grade_id;
                    $scope.reviewHomeworkInfo.subjectId = row.subject_id;
                    $scope.reviewHomeworkInfo.type = 4;
                    $scope.reviewHomeworkInfo.studentPhone = row.phone;
                    $scope.reviewHomeworkInfo.studentName = row.student_name;
                    $scope.reviewHomeworkInfo.crmStudentId = row.crmStudentId;
                    $scope.reviewHomeworkInfo.startTime = row.start_time;
                    $scope.reviewHomeworkInfo.endTime = row.end_time;
                    $scope.reviewHomeworkInfo.coursePlanType = row.type;//用来判断是哪种类型的排课
                    $scope.reviewHomeworkInfo.groupId = row.groupId;
                }
                if (row.previewHomework && row.previewHomework.title) {
                    $scope.reviewHomeworkInfo.title = row.previewHomework.title;
                }
                if (row.teacherHandouts && row.teacherHandouts.title) {
                    $scope.reviewHomeworkInfo.title = row.teacherHandouts.title;
                }
                if (row.reviewHomework) {
                    $scope.reviewHomeworkInfo.packId = row.reviewHomework.packId;
                    $scope.reviewHomeworkInfo.viewPath = QINIU_TR_DOMIN + row.reviewHomework.url;
                    if ($scope.reviewHomeworkInfo.viewPath.endsWith("pdf") == false) {
                        $scope.reviewHomeworkInfo.viewPath = $scope.reviewHomeworkInfo.viewPath + "?odconv/pdf";
                    }
                    //修改
                    var str = decodeURI(angular.copy(row.reviewHomework.url));
                    str = str.split('/');
                    $scope.reviewHomeworkInfo.filename = str[str.length - 1];
                    $scope.reviewHomeworkInfo.url = row.reviewHomework.url;
                    $scope.reviewHomeworkInfo.state = row.reviewHomework.state;
                    if (!$scope.reviewHomeworkInfo.title) {
                        $scope.reviewHomeworkInfo.title = row.reviewHomework.title;
                    }
                }
                if (type == 1) {
                    $scope.isEdit = true;
                    $scope.isView = false;
                }
                else if (type == 2) {
                    $scope.isEdit = false;
                    $scope.isView = true;
                }
                $scope.editReviewHomeworkTitle = "编辑课后作业";
                $scope.editReviewHomeworkModal = $modal({ scope: $scope, templateUrl: 'partials/sos/customer/modal.reviewHomework.edit.html', show: true, backdrop: 'static' });
            }

            /**
             * 应用已上传的附件
             */
            $scope.usePackExist = function (type) {
                //根据type查询已上传资料列表
                $scope.p_condition = {};
                $scope.p_condition.type = type;
                $scope.packList = null;
                var title = type == 1 ? "应用已上传预习资料" : (type == 3 ? "应用已上传备课笔记" : "应用已上传课后作业");
                $scope.usePackExistTitle = title;
                $scope.usePackExistModal = $modal({ scope: $scope, templateUrl: 'partials/sos/customer/modal.usePackExist.html', show: true, backdrop: 'static' });
            }

            /**
             * 加载资料包列表
             */
            $scope.getPackList = function (tableState) {
                $scope.p_TableState = tableState;
                $scope.isLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                var promise = CustomerStudentService.getPackByFilter(start, number, tableState, $scope.p_condition);
                promise.then(function (result) {
                    $scope.getAllSelected();
                    $scope.packList = result.data;
                    angular.forEach($scope.packList, function (p, index) {
                        p.viewPath = QINIU_TR_DOMIN + p.url;
                        if (p.viewPath.endsWith("pdf") == false) {
                            p.viewPath = p.viewPath + "?odconv/pdf";
                        }
                        var str = decodeURI(angular.copy(p.url));
                        str = str.split('/');
                        p.filename = str[str.length - 1];
                    });
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                });

            }

            $scope.getPackByFilter = function () {
                if ($scope.p_condition.startTime == "") {
                    $scope.p_condition.startTime = undefined;
                }
                $scope.isLoading = true;
                $scope.p_TableState.pagination.start = 0;
                var pagination = $scope.p_TableState.pagination;
                var start = $scope.p_TableState.start || 0;
                var number = $scope.p_TableState.number || 10;
                var promise = CustomerStudentService.getPackByFilter(start, number, $scope.p_TableState, $scope.p_condition);
                promise.then(function (result) {
                    $scope.getAllSelected();
                    $scope.packList = result.data;
                    angular.forEach($scope.packList, function (p, index) {
                        p.viewPath = QINIU_TR_DOMIN + p.url;
                        if (p.viewPath.endsWith("pdf") == false) {
                            p.viewPath = p.viewPath + "?odconv/pdf";
                        }
                        var str = decodeURI(angular.copy(p.url));
                        str = str.split('/');
                        p.filename = str[str.length - 1];
                    });
                    $scope.p_TableState.pagination.numberOfPages = result.numberOfPages;
                    $scope.isLoading = false;
                });
            }

            $scope.selectPack = function (row) {
                if ($scope.p_condition.type == 1) {
                    $scope.previewHomeworkInfo.filename = row.filename;
                    $scope.previewHomeworkInfo.url = row.url;
                    $scope.previewHomeworkInfo.packId = row.id
                }
                else if ($scope.p_condition.type == 3) {
                    $scope.teacherHandoutsInfo.filename = row.filename;
                    $scope.teacherHandoutsInfo.url = row.url;
                    $scope.teacherHandoutsInfo.packId = row.id
                }
                else if ($scope.p_condition.type == 4) {
                    $scope.reviewHomeworkInfo.filename = row.filename;
                    $scope.reviewHomeworkInfo.url = row.url;
                    $scope.reviewHomeworkInfo.packId = row.id
                }
                $scope.usePackExistModal.hide();
            }

            /**
             * 删除附件
             */
            $scope.removePack = function (type) {
                if (type == 1) {
                    $scope.previewHomeworkInfo.url = undefined;
                    $scope.previewHomeworkInfo.filename = undefined;
                }
                else if (type == 3) {
                    $scope.teacherHandoutsInfo.url = undefined;
                    $scope.teacherHandoutsInfo.filename = undefined;
                }
                else if (type == 4) {
                    $scope.reviewHomeworkInfo.url = undefined;
                    $scope.reviewHomeworkInfo.filename = undefined;
                }
            }


            /**
             * 保存课前资料
             */
            $scope.savePreviewHomework = function (state) {
                if ($scope.previewHomeworkInfo.url == null) {
                    $scope.previewHomeworkInfo.previewHomeworkFile = document.getElementById("previewHomeWorkFile").files[0];
                    if ($scope.previewHomeworkInfo.previewHomeworkFile != null && $scope.previewHomeworkInfo.previewHomeworkFile.size > 5 * 1024 * 1024) {
                        $scope.previewHomeworkInfo.url = undefined;
                        $scope.previewHomeworkInfo.filename = undefined;
                        SweetAlert.swal('附件大小不能超过 5M', '请重试', 'error');
                        return false;
                    }
                    $scope.previewHomeworkInfo.packId = undefined;
                }
                if ($scope.previewHomeworkInfo.url == null && ($scope.previewHomeworkInfo.previewHomeworkFile == null || !/\.(doc|docx|pdf)$/.test($scope.previewHomeworkInfo.previewHomeworkFile.name))) {
                    SweetAlert.swal('课前预习资料不能为空，且文件扩展名必须为.doc、.docx或.pdf', '请重试', 'error');
                    return false;
                }
                if ($scope.previewHomeworkInfo.title == null || $scope.previewHomeworkInfo.title == "" || $scope.previewHomeworkInfo.title.length > 10) {
                    SweetAlert.swal('课前预习资料标题必填', '请重试', 'error');
                    return false;
                }
                //先上传资料文件，上传成功后，把存储地址返回
                if ($scope.previewHomeworkInfo.url == null) {
                    var tempCoursePlanId = null;
                    if ($scope.previewHomeworkInfo.coursePlanIdList) {
                        //是一对多
                        tempCoursePlanId = $scope.previewHomeworkInfo.coursePlanIdList[0].coursePlanId + "-" + $scope.previewHomeworkInfo.type;
                    }
                    else {
                        //一对一
                        tempCoursePlanId = $scope.previewHomeworkInfo.omsCoursePlanId + "-" + $scope.previewHomeworkInfo.type;
                    }
                    $scope.fileUpload(encodeURI($scope.previewHomeworkInfo.previewHomeworkFile.name), $scope.previewHomeworkInfo.previewHomeworkFile, "/preview-homework/" + tempCoursePlanId + "/")
                    $scope.previewHomeworkInfo.url = "/preview-homework/" + tempCoursePlanId + "/" + encodeURI($scope.previewHomeworkInfo.previewHomeworkFile.name);
                }
                $scope.previewHomeworkInfo.state = state;
                CustomerStudentService.savePack($scope.previewHomeworkInfo).then(function (response) {
                    if (response.status == "SUCCESS") {
                        $scope.editPreviewHomeworkModal.hide();
                        var tableState = {};
                        tableState.search = {};
                        tableState.pagination = {};
                        if ($scope.previewHomeworkInfo.isGroupEdit) {
                            //更新一对多排课记录
                            $scope.getGroupCoursePlanList($scope.coursePlanRecordTableState);
                        }
                        else {//更新学员排课记录
                            $scope.callCoursePlanServer($scope.coursePlanRecordTableState);
                        }
                        //$scope.callCoursePlanServer(tableState);
                        SweetAlert.swal('保存成功', 'success');
                    }
                    else if (response.status == "FAILURE") {
                        SweetAlert.swal('保存失败', '请重试', 'error');
                        return false;
                    }
                });
            }

            /**
             * 保存备课笔记
             */
            $scope.saveTeacherHandouts = function (state) {
                var tempElement = document.getElementById("teacherHandoutsFile");
                if (tempElement != null) {
                    $scope.teacherHandoutsInfo.teacherHandoutsFile = document.getElementById("teacherHandoutsFile").files[0];
                    if ($scope.teacherHandoutsInfo.teacherHandoutsFile != null && $scope.teacherHandoutsInfo.teacherHandoutsFile.size > 5 * 1024 * 1024) {
                        $scope.teacherHandoutsInfo.url = undefined;
                        $scope.teacherHandoutsInfo.filename = undefined;
                        SweetAlert.swal('附件大小不能超过 5M', '请重试', 'error');
                        return false;
                    }
                    $scope.teacherHandoutsInfo.packId = undefined;
                }
                if ($scope.teacherHandoutsInfo.url == null && ($scope.teacherHandoutsInfo.teacherHandoutsFile == null || !/\.(doc|docx|pdf)$/.test($scope.teacherHandoutsInfo.teacherHandoutsFile.name))) {
                    SweetAlert.swal('备课笔记不能为空，且文件扩展名必须为.doc、.docx或.pdf', '请重试', 'error');
                    return false;
                }
                if ($scope.teacherHandoutsInfo.title == null || $scope.teacherHandoutsInfo.title == "" || $scope.teacherHandoutsInfo.title.length > 10) {
                    SweetAlert.swal('备课笔记标题必填', '请重试', 'error');
                    return false;
                }
                //先上传资料文件，上传成功后，把存储地址返回
                if ($scope.teacherHandoutsInfo.url == null) {
                    var tempCoursePlanId = null;
                    if ($scope.teacherHandoutsInfo.coursePlanIdList) {
                        //是一对多
                        tempCoursePlanId = $scope.teacherHandoutsInfo.coursePlanIdList[0].coursePlanId + "-" + $scope.teacherHandoutsInfo.type;
                    }
                    else {
                        //一对一
                        tempCoursePlanId = $scope.teacherHandoutsInfo.omsCoursePlanId + "-" + $scope.teacherHandoutsInfo.type;
                    }
                    $scope.fileUpload(encodeURI($scope.teacherHandoutsInfo.teacherHandoutsFile.name), $scope.teacherHandoutsInfo.teacherHandoutsFile, "/teacher-handouts/" + tempCoursePlanId + "/")
                    $scope.teacherHandoutsInfo.url = "/teacher-handouts/" + tempCoursePlanId + "/" + encodeURI($scope.teacherHandoutsInfo.teacherHandoutsFile.name);
                }
                $scope.teacherHandoutsInfo.state = state;
                CustomerStudentService.savePack($scope.teacherHandoutsInfo).then(function (response) {
                    if (response.status == "SUCCESS") {
                        $scope.editTeacherHandoutsModal.hide();
                        var tableState = {};
                        tableState.search = {};
                        tableState.pagination = {};
                        if ($scope.teacherHandoutsInfo.isGroupEdit) {
                            //更新一对多排课记录
                            $scope.getGroupCoursePlanList(tableState);
                        }
                        else {//更新学员排课记录
                            $scope.callCoursePlanServer($scope.coursePlanRecordTableState);
                        }
                        //$scope.callCoursePlanServer(tableState);
                        SweetAlert.swal('保存成功', 'success');
                    }
                    else if (response.status == "FAILURE") {
                        SweetAlert.swal('保存失败', '请重试', 'error');
                        return false;
                    }
                });
            }

            /**
             * 保存课后作业
             */
            $scope.saveReviewHomework = function (state) {
                var tempElement = document.getElementById("reviewHomeworkFile");
                if (tempElement != null) {
                    $scope.reviewHomeworkInfo.reviewHomeworkFile = document.getElementById("reviewHomeworkFile").files[0];
                    if ($scope.reviewHomeworkInfo.reviewHomeworkFile != null && $scope.reviewHomeworkInfo.reviewHomeworkFile.size > 5 * 1024 * 1024) {
                        $scope.reviewHomeworkInfo.url = undefined;
                        $scope.reviewHomeworkInfo.filename = undefined;
                        SweetAlert.swal('附件大小不能超过 5M', '请重试', 'error');
                        return false;
                    }
                    $scope.reviewHomeworkInfo.packId = undefined;
                }
                if ($scope.reviewHomeworkInfo.url == null && ($scope.reviewHomeworkInfo.reviewHomeworkFile == null || !/\.(doc|docx|pdf)$/.test($scope.reviewHomeworkInfo.reviewHomeworkFile.name))) {
                    SweetAlert.swal('课后作业不能为空，且文件扩展名必须为.doc、.docx或.pdf', '请重试', 'error');
                    return false;
                }
                if ($scope.reviewHomeworkInfo.title == null || $scope.reviewHomeworkInfo.title == "" || $scope.reviewHomeworkInfo.title.length > 10) {
                    SweetAlert.swal('课后作业标题必填', '请重试', 'error');
                    return false;
                }
                //先上传资料文件，上传成功后，把存储地址返回
                if ($scope.reviewHomeworkInfo.url == null) {
                    var tempCoursePlanId = null;
                    if ($scope.reviewHomeworkInfo.coursePlanIdList) {
                        //是一对多
                        tempCoursePlanId = $scope.reviewHomeworkInfo.coursePlanIdList[0].coursePlanId + "-" + $scope.reviewHomeworkInfo.type;
                    }
                    else {
                        //一对一
                        tempCoursePlanId = $scope.reviewHomeworkInfo.omsCoursePlanId + "-" + $scope.reviewHomeworkInfo.type;
                    }
                    var fname = encodeURI($scope.reviewHomeworkInfo.reviewHomeworkFile.name);
                    $scope.fileUpload(fname, $scope.reviewHomeworkInfo.reviewHomeworkFile, "/teacher-handouts/" + tempCoursePlanId + "/")
                    $scope.reviewHomeworkInfo.url = "/teacher-handouts/" + tempCoursePlanId + "/" + fname;
                }
                $scope.reviewHomeworkInfo.state = state;
                CustomerStudentService.savePack($scope.reviewHomeworkInfo).then(function (response) {
                    if (response.status == "SUCCESS") {
                        $scope.editReviewHomeworkModal.hide();
                        var tableState = {};
                        tableState.search = {};
                        tableState.pagination = {};
                        if ($scope.reviewHomeworkInfo.isGroupEdit) {
                            //更新一对多排课记录
                            $scope.getGroupCoursePlanList(tableState);
                        }
                        else {//更新学员排课记录
                            $scope.callCoursePlanServer($scope.coursePlanRecordTableState);
                        }
                        SweetAlert.swal('保存成功', 'success');
                    }
                    else if (response.status == "FAILURE") {
                        SweetAlert.swal('保存失败', '请重试', 'error');
                        return false;
                    }
                });
            }

            /**
             * 上传文件
             * @param fileName 文件名称
             * @param f     文件
             * @param training  主要是为了获取trainingId
             */
            $scope.fileUpload = function (fileName, f, uploadFileDir) {
                if (f == null)
                    return;
                var r = new FileReader();
                r.onloadend = function (e) {
                    var data = e.target.result;
                    CustomerStudentService.uploadFile(data, fileName, uploadFileDir);
                }
                r.readAsDataURL(f);
            }



            /**
             * 提醒记录列表
             */
            $scope.CrmCustomerStudentRemindList = [];
            $scope.getRemindList = function callServer(tableState) {
                if ($scope.detail) {
                    tableState.search.predicateObject = {};
                    tableState.search.predicateObject.dataStudentDetailId = $scope.detail.crm_student_id;
                    $scope.myCrmCustomerStudentRemindListTableState = tableState;
                    //console.dir(tableState);
                    $scope.isRemindLoading = true;
                    var pagination = tableState.pagination;
                    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    var number = pagination.number || 10;  // Number of entries showed per page.
                    InvitationRemindService.list(start, number, tableState).then(function (result) {
                        //console.dir(result.data);
                        //$scope.getAllSelected();
                        $scope.CrmCustomerStudentRemindList = result.data;
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.isRemindLoading = false;
                    });
                }

            };

            /**
             * 沟通记录列表
             */
            $scope.CrmCustomerStudentCommunicationList = [];
            $scope.getCommunicationList = function callServer(tableState) {
                if ($scope.detail) {
                    tableState.search.predicateObject = {};
                    tableState.search.predicateObject.dataStudentDetailId = $scope.detail.crm_student_id;
                    $scope.myCrmCustomerStudentCommunicationListTableState = tableState;
                    //console.dir(tableState);
                    $scope.isCommunicationLoading = true;
                    var pagination = tableState.pagination;
                    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    var number = pagination.number || 10;  // Number of entries showed per page.
                    InvitationCommunicationService.list(start, number, tableState).then(function (result) {
                        //console.dir(result.data);
                        //$scope.getAllSelected();
                        $scope.CrmCustomerStudentCommunicationList = result.data;
                        $scope.CrmLeadsStudentCommunicationList = result.data;
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.isCommunicationLoading = false;
                    });
                }
            };


            /* //呼叫中心
             $scope.callNumber = function(row){
             $scope.phone = angular.copy(row);
             var title ='dsa';
             if(AuthenticationService){//非空
             //alert(currentUser().landline);
             $scope.phoneModel=$modal({title:title,scope:$scope, templateUrl: 'partials/sos/leads/modal.callNumber.html', show: true });

             }
             else{
             alert("请输入坐席");
             }


             };
             $scope.callPhone = function(phone){

             CustomerStudentService.callNumber(phone).then(function (result) {
             $scope.courses1 = result.data;

             SweetAlert.swal('操作成功');
             $scope.isLoading = false;
             $scope.phoneModel.hide();
             //getOrderListController(oThis.tableState);
             },function(result){
             SweetAlert.swal('操作失败'+result);
             });
             };*/

            /**
             * 邀约记录列表
             */
            $scope.CrmCustomerStudentInvitationList = [];
            $scope.getInvitationList = function callServer(tableState) {
                if ($scope.detail) {
                    tableState.search.predicateObject = {};
                    tableState.search.predicateObject.dataStudentDetailId = $scope.detail.crm_student_id;
                    $scope.myCrmCustomerStudentInvitationListTableState = tableState;
                    //console.dir(tableState);
                    $scope.isInvitationLoading = true;
                    var pagination = tableState.pagination;
                    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    var number = pagination.number || 10;  // Number of entries showed per page.
                    InvitationDetailService.viewlist(start, number, tableState).then(function (result) {
                        //console.dir(result.data);
                        //$scope.getAllSelected();
                        $scope.CrmCustomerStudentInvitationList = result.data;
                        $scope.CrmLeadsStudentInvitationList = result.data;
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.isInvitationLoading = false;
                    });
                }
            };

            /**
             * 未消课列表
             */
            $scope.getPlanCourseList = function callServer(tableState) {
                if ($scope.detail) {
                    $scope.detail = $scope.detailForUpdate
                }
                if ($scope.detail) {
                    if (!tableState.search.predicateObject) {
                        tableState.search.predicateObject = {};
                    }
                    tableState.search.predicateObject.crm_student_id = $scope.detail.crm_student_id;
                    $scope.isLoading = true;

                    $scope.myCoursePlanTableState = tableState;

                    var pagination = tableState.pagination;
                    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    var number = pagination.number || 10;  // Number of entries showed per page.
                    CoursePlanService.Studentlist(start, number, tableState).then(function (result) {
                        $scope.planLists = result.data;
                        if (check_null(result.numberOfPages)) {
                            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        } else {
                            tableState.pagination.numberOfPages = 0;
                        }

                        $scope.isLoading = false;
                    }, function (err) {
                        tableState.pagination.numberOfPages = 0;
                    });
                }
            };


            function ifO2oType(one) {
                var s = one.student_type;
                if (check_null(s)) {
                    if (parseInt(s) == 2) {
                        return true;
                    }
                }
                return false;//test
            }

            function callO2oOrderList(tableState) {
                oThis.getOrderListController(tableState);
            }

            function getOrderListController(tableState) {
                $scope.isLoading = true;
                oThis.tableState = tableState;

                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                BaseO2oService.getOrderListServiceByStudentId($scope.detail.crm_student_id, start, number, tableState.search.predicateObject).then(function (result) {
                    $scope.O2oNormalOrders = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                });
            }

            function callO2oStudentCoursesLists(tableState) {

                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                oThis.getO2oStudentCoursesController(tableState);
            }

            function getO2oStudentCoursesController(tableState) {

                $scope.isLoading = true;

                /* BaseO2oService.getO2oStudentCoursesService(start, number,tableState).then(function (result) {
                 $scope.displayed = result.data;
                 tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                 $scope.isLoading = false;
                 });*/
                ;
                if ($scope.detail) {
                    tableState.search.predicateObject = {};
                    tableState.search.predicateObject.crm_student_id = $scope.detail.crm_student_id;
                    $scope.isLoading = true;

                    $scope.myCoursePlanTableState = tableState;

                    var pagination = tableState.pagination;
                    $scope.CoursePlanTableState = tableState;
                    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    var number = pagination.number || 10;  // Number of entries showed per page.
                    ;
                    BaseO2oService.getO2oStudentCoursesService(start, number, tableState).then(function (result) {
                        ;
                        $scope.o2oStudentCourses = result.data;
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.isLoading = false;
                    });
                }
            };

            /**
             * 转平台已审核通过订单
             * @param obj
             */
            $scope.showPlatformOrders = function showPlatformOrders(obj) {
                // 判断学生是否已经转平台
                var filter = {};
                filter.crmStudentId = obj.crm_student_id;
                var promise = OrderService.queryChangePlatform(filter);
                promise.then(function (response) {
                    if (response.data.count > 0) {
                        SweetAlert.swal("转平台中，不能重复操作");
                        return false;
                    } else {
                        $scope.platform = {};
                        $scope.order = angular.copy(obj);
                        $scope.modalPlatform = '申请转平台';
                        $scope.modalPlatform = $modal({
                            scope: $scope,
                            templateUrl: 'partials/sos/customer/modal.showPlatform.html',
                            show: true
                        });
                    }
                }, function (error) {

                });

            };

            // 获取大区的组织机构树
            $scope.showDristictDepartment = function showDristictDepartment() {
                var promise = DepartmentService.getDistrictDepartmentTree(true);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        $scope.modalDepartments = angular.copy(response.data);
                        $scope.modalTitle = '选择部门';
                        $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/hr/department/modal.department.html', show: true, backdrop: "static" });
                    }
                }, function (error) {

                });
            }
            /**
             * 选中部门
             */
            $scope.newDepartment = {};
            $scope.selectDepartment = function selectDepartment(node) {
                $scope.newDepartment = $scope.findSelectedDepartment($scope.modalDepartments, node.id);
                //console.log($scope.newDepartment)
            }

            $scope.findSelectedDepartment = function findSelectedDepartment(departments, id) {
                var found = false;
                angular.forEach(departments, function (department) {
                    if (found) {
                        return;
                    }
                    if (department.id == id) {
                        found = department;
                        return;
                    }
                    found = $scope.findSelectedDepartment(department.children, id);
                });
                return found;
            }

            /**
             * 确定选中的部门
             */
            $scope.departmentSelected = function departmentSelected() {
                if (!$scope.newDepartment.isSchool || $scope.newDepartment.isSchool == 0) {
                    SweetAlert.swal("只能选择校区");
                    return false;
                }
                $scope.platform.departName = $scope.newDepartment.name;
                $scope.platform.departmentId = $scope.newDepartment.id;
                //$scope.getPositions($scope.newDepartment.id);
                $scope.modal.hide();
            }

            $scope.savePlatformChange = function savePlatformChange() {
                //if($scope.platform.)
                $scope.platform.newPlatformId = $scope.platform.departmentId;
                $scope.platform.changeOrderNo = $scope.order.orderNos;
                $scope.platform.crmStudentId = $scope.order.crm_student_id;
                $scope.platform.totalActualAmount = $scope.order.totalAmount;
                $scope.platform.totalSurplusAmount = $scope.order.totalAdditionalAmount;
                if ($scope.order.orderNos.length == 0) {
                    SweetAlert.swal("请选择合同", "error");
                }
                OrderService.addPlatformRecord($scope.platform).then(function (result) {
                    if (result.status == "FAILURE") {
                        SweetAlert.swal("转平台操作失败，请重试", "error");
                        return false;
                    } else {
                        $scope.modalPlatform.hide();
                        SweetAlert.swal("转平台操作已成功");
                    }
                });
            }

            $scope.orderFilter = {};
            $scope.platform = {};
            $scope.getPlatformOrders = function getPlatformOrders(tableState) {
                $scope.order.achievementRatio = {};
                $scope.orderFlag = 7;
                $scope.orderFilter.platform = true;
                $scope.platform.oldPlatformId = $scope.order.school_id;
                $scope.platform.oldPlatformName = $scope.order.belong_school_name;
                $scope.orderFilter.crmStudentId = $scope.order.crm_student_id;
                $scope.tableState = tableState;
                $scope.pagination = tableState.pagination;
                $scope.predicateObject = tableState.search.predicateObject;
                if (!$scope.pagination) {
                    $scope.pagination = {};
                }
                $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
                OrderService.getPage($scope.start, $scope.number, $scope.orderFlag, $scope.orderFilter).then(function (result) {
                    $scope.passOrders = result.data;
                    $scope.order.orderList = [];
                    // getAllAmount(result.data);
                    tableState.pagination = tableState.pagination || {}
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                });
            }

            $scope.getContractorPositionsSelect = function getContractorPositionsSelect() {
                OrderService.getContractorPositionsSelect().then(function (result) {
                    $scope.contractorPositions = result.data;
                });
            }
            $scope.zhuanyeji = function () {

                console.log($scope.order.totalleaveActualCourseAmount)
                console.log($scope.platform.changePlatformAmount)
                if ($scope.order.totalleaveActualCourseAmount < $scope.platform.changePlatformAmount) {
                    SweetAlert.swal('转平台业绩金额不能超过总剩余实收金额');
                    $scope.platform.changePlatformAmount = ''
                }
            }
            // function getAllAmount(orders) {
            //     $scope.order.totalAdditionalAmount = 0;
            //     $scope.order.totalAmount = 0;
            //     $scope.order.orderNos = '';
            //     $scope.order.totalleaveActualCourseAmount=0;
            //     for (var i = 0; i < orders.length; i++) {
            //         if (orders[i].orderCategory == 3) {
            //             $scope.order.totalAdditionalAmount += orders[i].additionalAmount
            //         } else {
            //             $scope.order.totalAdditionalAmount += orders[i].leaveCourseAmount
            //         }
            //         $scope.order.totalleaveActualCourseAmount += orders[i].leaveActualCourseAmount
            //         $scope.order.totalAmount = $scope.order.totalAmount + orders[i].realPayAmount
            //         $scope.order.orderNos += orders[i].orderNo
            //         $scope.order.orderNos += ' '
            //     }
            // }

            $scope.getAllAmount = getAllAmount;
            function getAllAmount() {
                if ($scope.order.orderList) {
                    if ($scope.order.orderList.constructor == Array && $scope.order.orderList.length > 0) {
                        $scope.order.totalAdditionalAmount = 0;
                        $scope.order.totalAmount = 0;
                        $scope.order.orderNos = '';
                        $scope.order.totalleaveActualCourseAmount = 0;
                        for (var i = 0; i < $scope.order.orderList.length; i++) {
                            if ($scope.order.orderList[i] == true) {
                                if ($scope.passOrders[i].orderCategory == 3) {
                                    $scope.order.totalAdditionalAmount += $scope.passOrders[i].additionalAmount
                                } else {
                                    $scope.order.totalAdditionalAmount += $scope.passOrders[i].leaveCourseAmount
                                }
                                $scope.order.totalleaveActualCourseAmount += $scope.passOrders[i].leaveActualCourseAmount
                                $scope.order.totalAmount = $scope.order.totalAmount + $scope.passOrders[i].realPayAmount
                                $scope.order.orderNos += $scope.passOrders[i].orderNo
                                $scope.order.orderNos += ' '
                            }
                        }
                    }
                }
            }

            /**
             * CustomerStudent详情页面
             */
            $scope.viewCrmCustomerStudent = function (detail) {
                $scope.detail = detail;
                //获取到亲属关系赋值
                $scope.linkmiddle = {};
                if (detail.relatives_type) {
                    $scope.linkmiddle.type = detail.relatives_type
                } else {
                    $scope.linkmiddle.type = null
                }
                if (detail.address) {
                    $scope.linkmiddle.address = detail.address
                } else {
                    $scope.linkmiddle.address = null
                }
                if (detail.purpose_level) {
                    $scope.linkmiddle.purpose_level = detail.purpose_level
                } else {
                    $scope.linkmiddle.purpose_level = detail.null
                }
                $scope.isShowLeftClasshour = null;
                $scope.isShowLeftClasshour = detail.isShow;

                //优胜派的查看学员，不需要要看返课和兑换余额2个tab
                var currentUserPositionId = AuthenticationService.currentUser().position_id;
                if (currentUserPositionId == Constants.PositionID.YSP_CHENGZHANGGUWEN
                    || currentUserPositionId == Constants.PositionID.YSP_HEADMASTER
                    || currentUserPositionId == Constants.PositionID.YSP_CHENGZHANGGUWEN_MASTER) {
                    $scope.IsYSP = true;
                }
                //if( detail.channel1Name == '线上O2O' ){
                //  $scope.iso2o = true;
                //}else{
                //  $scope.iso2o = false;
                //}
                $scope.isDetail = true;
                $scope.isList = false;
                $scope.isUpdate = false;
                $scope.isAddGroup = false;
                $scope.isEditGroup = false;
                $scope.isGroupDetail = false;
                $scope.isGroupAllot = false;
                $rootScope.isCalling = false;
                $timeout(function () {
                    var node1 = $("#calling");
                    var content1 = '沟通记录在拨打电话30分钟后更新到系统中，因此沟通状态有延迟';
                    node1.webuiPopover({ content: content1, trigger: 'hover', placement: 'bottom' });
                }, 1000);

                //console.dir(detail);

                $scope.findPhoneException = function (list, callback) {
                    LeadsStudentService.findPhoneException(list).then(function (result) {
                        if (ifResponseSuccess(result)) {
                            $('popup').hide();
                            if (callback) {
                                callback();
                            }
                            _dealPhones(result.data);
                        }

                    });
                }
                function _dealPhones(data) {
                    var list = data.data;
                    if (list.length > 0) {
                        for (var i = 0; i < list.length; i++) {
                            _isPhone(list[i].phone, list[i].status);
                        }
                    }

                }

                function _isPhone(phone, status) {
                    if ($scope.detail.phone == phone) {
                        $scope.detail.phone_status = status;
                    } else if ($scope.detail.mother_phone == phone) {
                        $scope.detail.mother_phone_status = status;
                    } else if ($scope.detail.father_phone == phone) {
                        $scope.detail.father_phone_status = status;
                    }
                }

                CustomerStudentService.detail(detail).then(function (result) {
                    console.log(result)
                    //console.dir(result);
                    $scope.detail = result;
                    var list = [];
                    if ($scope.detail.phone) {
                        list.push($scope.detail.phone);
                    }
                    if ($scope.detail.mother_phone) {
                        list.push($scope.detail.mother_phone);
                    }
                    if ($scope.detail.father_phone) {
                        list.push($scope.detail.father_phone);
                    }
                    $scope.findPhoneException(list, function () {

                    });
                })
            }

            /***********************************************排课消课列表************************************************/
            /**
             * 未消课列表
             */
            $scope.callServer1 = function callServer1(tableState) {
                if ($scope.detail) {
                    if (!check_null(tableState.search.predicateObject)) {
                        tableState.search.predicateObject = {};
                    }
                    tableState.search.predicateObject.crm_student_id = $scope.detail.crm_student_id;
                    $scope.isLoading = true;

                    $scope.myCoursePlanTableState = tableState;

                    var pagination = tableState.pagination;
                    $scope.CoursePlanTableState = tableState;
                    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    var number = pagination.number || 10;  // Number of entries showed per page.
                    CoursePlanService.Studentlist(start, number, tableState).then(function (result) {
                        $scope.displayed1 = result.data;
                        $scope.displayed = result.data;
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.isLoading = false;
                    });
                }
            };

            /**
             * //查询已消课和未消课列表
             */
            $scope.callCoursePlanServer = function callCoursePlanServer(tableState) {
                if ($scope.detail) {
                    if (!check_null(tableState.search.predicateObject)) {
                        tableState.search.predicateObject = {};
                    }
                    tableState.search.predicateObject.crm_student_id = $scope.detail.crm_student_id;
                    if ($scope.isTeacherOrTeacherMaster) {
                        if (AuthenticationService.currentUser().position_id == Constants.PositionID.TEACHER) {
                            tableState.search.predicateObject.onlySeeMine = true;//教师只能看到自己的
                        }
                        else if (AuthenticationService.currentUser().department_id != $scope.detail.school_id) {
                            tableState.search.predicateObject.onlySeeMine = true;//教务主管看跨校区的学员，只能看到自己的排课
                        }
                    }
                    $scope.isLoading = true;

                    //查询已消课和未消课列表
                    if ($scope.coursePlanRecordType === 1 && tableState.search.predicateObject.is_past === undefined) {
                        tableState.search.predicateObject.is_past = '1';
                    } else if ($scope.coursePlanRecordType === 2 && tableState.search.predicateObject.is_past === undefined) {
                        tableState.search.predicateObject.is_past = '0';
                    }
                    if (tableState.search.predicateObject.onlySeeMine == false) {
                        tableState.search.predicateObject.customCondition = ' AND oms.type <> 3 ';
                    }
                    var pagination = tableState.pagination;
                    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    var number = pagination.number || 10;  // Number of entries showed per page.
                    CoursePlanService.Studentlist(start, number, tableState).then(function (result) {
                        $scope.displayed = result.data;
                        $scope.displayed1 = result.data;
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.coursePlanRecordTableState = tableState;
                        $scope.isLoading = false;
                    });
                }
            };

            /**
             * 已消课列表
             */
            $scope.callServerrecord = function callServerrecord(tableState) {
                if ($scope.detail) {
                    tableState.search.predicateObject = {};
                    tableState.search.predicateObject.crm_student_id = $scope.detail.crm_student_id;
                    $scope.isrendLoading = true;

                    $scope.myCoursePlanRecordTableState = tableState;

                    var pagination = tableState.pagination;
                    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    var number = pagination.number || 10;  // Number of entries showed per page.
                    CoursePlanService.StudentRecordList(start, number, $scope.myCoursePlanRecordTableState).then(function (result) {
                        $scope.displayedrecord = result.data;
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.isrendLoading = false;
                    });
                }
            };

            /***********************************************排课消课列表************************************************/
            /**
             * CustomerStudent添加
             */
            $scope.addCrmCustomerStudent = function () {
                $scope.detailForUpdate = {};
                $scope.isAddStudent = true;

                $scope.isDetail = false;
                $scope.isList = false;
                $scope.isAdding = false;
                $scope.isEditGroup = false;
                $scope.isUpdate = true;

                $scope.isEdit = false;

                angular.element('.js-show-add').html('线上添加学员');
            }

            //查询班主任

            function searchSchoolAreaShow() {
                $scope.modalTitle = '查询校区';
                $scope.modalSelectTeacher = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/customer/modal.searchSchoolAreas.html',
                    show: true
                });
                //$scope.detailForUpdate.school_name
            }

            $scope.schoolCrmLeadsStudentFilter = {};
            function getLeadsList(tableState) {
                $scope.schoolCrmLeadsStudentListTableState = tableState;
                $scope.isSchoolLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;
                BaseO2oService.getTeacherByFilters(start, number, tableState, $scope.schoolCrmLeadsStudentFilter).then(function (result) {
                    $scope.CrmLeadsStudentList = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;
                    $scope.schoolCrmLeadsStudentListTableState = tableState;
                    $scope.isSchoolLoading = false;
                });
            }

            $scope.selectTransferLeads = function (obj) {
                $scope.detailForUpdate.leadsTeacherName = obj.user.name;
                $scope.detailForUpdate.leadsTeacherId = obj.user.id;
                $scope.modalSelectTeacher.hide();
            }

            /**
             * CustomerStudent更新页面
             */
            $scope.studentStatus = Constants.StudentStatus;
            $scope.editCrmCustomerStudent = function (detail) {
                console.log(detail)
                clearInterval(setLetBegin)
                setLetBegin = null
                angular.element('.js-show-add').html('学员更新');
                $scope.isDetail = false;
                $scope.isList = false;
                $scope.isAdding = false;
                $scope.isEditGroup = false;
                $scope.isUpdate = true;
                $scope.isEdit = true;
                _detail(detail)
                /*
                 TODO:此注释为新ui不能删除
                 $scope.modalTitle = '编辑详情'
                 $scope.modalUserUpdate = $modal({scope: $scope, templateUrl: 'partials/sos/customer/modal.userUpdate.html', show: true});*/

            }
            $scope.submitCustomerStudent = submitCustomerStudent;
            function submitCustomerStudent(arg) {
                $scope.detailForUpdate.student_type = 2;//1 表示线下 2 表示线上
                //添加编辑的详情展示
                console.log($scope.detailForUpdate)
                if ($scope.isAddStudent) {
                    $scope.addCustomerStudent();
                } else {
                    $scope.updateCustomerStudent(arg);
                }
            }

            /**
             * 更新学生客户
             */
            $scope.addCustomerStudent = addCustomerStudent;
            function addCustomerStudent() {
                //console.dir($scope.detailForUpdate);
                var promise = CustomerStudentService.create($scope.detailForUpdate);
                promise.then(function (data) {
                    //console.log(data);
                    if (data.status == 'FAILURE') {
                        SweetAlert.swal(data.data);
                        return false;
                    }
                    $scope.showListView();
                    $scope.detailForUpdate = {};
                }, function (error) {
                    alert("创建学生客户失败");
                });
            }

            /**
             * 更新学生客户
             */
            $scope.updateCustomerStudent = updateCustomerStudent;
            function updateCustomerStudent(arg) {
                if ($scope.detailForUpdate.nextVisitAt) {
                    $scope.detailForUpdate.nextVisitAt = new Date($scope.detailForUpdate.nextVisitAt);
                }
                if (!arg) { _setReadonlyPropo() }
                delete $scope.detailForUpdate.birthDate;
                delete $scope.detailForUpdate.growthList;
                delete $scope.detailForUpdate.followUpAt;
                var promise = CustomerStudentService.update($scope.detailForUpdate);
                promise.then(function (data) {
                    if (data.status == 'FAILURE') {
                        SweetAlert.swal(data.data);
                        return false;
                    }
                    if (arg) {
                        $scope.detail = angular.copy($scope.detailForUpdate)
                        successAlert('更新成功')
                        $scope.detailForUpdate.birthDate = $scope._birthDate
                        $scope.getMyCrmCustomerStudentList($scope.myCrmCustomerStudentListTableState)
                    } else {
                        $scope.showListView();
                    }
                    //如果有更新学员年级id，进行排课订单课时更新
                    if ($scope.detailForUpdate.grade_id != $scope.preStudentGradeId) {
                        var studentId = $scope.detailForUpdate.crm_student_id;
                        var gradeId = $scope.preStudentGradeId;
                        var nowGradeId = $scope.detailForUpdate.grade_id;
                        var promise = CoursePlanService.getWxClassTimeList(studentId, gradeId, nowGradeId, null);
                        promise.then(function (result) {
                            CoursePlanService.saveGradeChange(result, studentId, nowGradeId);
                        }, function (error) {
                            alert("更新学生年级失败");
                        });
                    }
                }, function (error) {
                    alert("更新学生客户失败");
                });
            }

            /**
             * CustomerStudent删除
             */
            $scope.deleteCrmCustomerStudent = function (detail) {
                SweetAlert.swal({
                    title: "确定要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#fe9900',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        CustomerStudentService.remove(detail).then(function (result) {
                            //console.dir(result);
                            $scope.showListView();
                        })
                    }
                }
                );
            }


            /**
             * 获取年级、科目、省、一级客户状态、一级渠道来源下拉菜单
             */
            $scope.subjectIds = [];
            $scope.gradeIds = [];
            $scope.courseTypeIds = [];
            $scope.getAllSelected = function getAllSelected() {
                CommonService.getSubjectIdSelect().then(function (result) {
                    $scope.subjectIds = result.data;
                });
                CommonService.getGradeIdSelect().then(function (result) {
                    $scope.gradeIds = result.data;
                });
                CommonService.getProvinceSelect().then(function (result) {
                    $scope.provinceList = result.data;
                });
                CommonService.getState(0).then(function (result) {
                    //console.dir(result);
                    $scope.state1List = result.data;
                });
                CommonService.getMediaChannel(0).then(function (result) {
                    $scope.mediaChannel1List = result.data;
                });
            };


            /**
             * 地区三级级联
             * @type {Array}
             */
            $scope.provinceList = [];
            $scope.cityList = [];
            $scope.areaList = [];
            $scope.provinceChange = function () {
                //console.dir($scope.CrmCustomerStudentVoForCreate);
                if ($scope.CrmCustomerStudentVoForCreate.province_code) {
                    CommonService.getCitySelect($scope.CrmCustomerStudentVoForCreate.province_code).then(function (result) {
                        $scope.cityList = result.data;
                    });
                } else {
                    $scope.cityList = [];
                }
            }
            $scope.provinceChangeForUpdate = function () {
                //console.dir($scope.detailForUpdate);
                if ($scope.detailForUpdate.province_code) {
                    CommonService.getCitySelect($scope.detailForUpdate.province_code).then(function (result) {
                        $scope.cityList = result.data;
                    });
                } else {
                    $scope.cityList = [];
                }
            }
            $scope.cityChange = function () {
                //console.dir($scope.CrmCustomerStudentVoForCreate);
                if ($scope.CrmCustomerStudentVoForCreate.city_code) {
                    CommonService.getAreaSelect($scope.CrmCustomerStudentVoForCreate.city_code).then(function (result) {
                        $scope.areaList = result.data;
                    });
                } else {
                    $scope.areaList = [];
                }
            }
            $scope.cityChangeForUpdate = function () {
                //console.dir($scope.detailForUpdate);
                if ($scope.detailForUpdate.city_code) {
                    CommonService.getAreaSelect($scope.detailForUpdate.city_code).then(function (result) {
                        $scope.areaList = result.data;
                    });
                } else {
                    $scope.areaList = [];
                }
            }

            /**
             * 状态二级级联
             * @type {Array}
             */
            $scope.state1List = [];
            $scope.state2List = [];
            $scope.state1Change = function () {
                if ($scope.CrmCustomerStudentVoForCreate.state_id_1) {
                    CommonService.getState($scope.CrmCustomerStudentVoForCreate.state_id_1).then(function (result) {
                        $scope.state2List = result.data;
                    });
                } else {
                    $scope.state2List = [];
                }
            }
            $scope.state1ChangeForFilter = function () {
                //alert($scope.myCrmCustomerStudentFilter.state1_id);
                if ($scope.myCrmCustomerStudentFilter.state_id_1) {
                    CommonService.getState($scope.myCrmCustomerStudentFilter.state_id_1).then(function (result) {
                        $scope.state2List = result.data;
                    });
                } else {
                    $scope.state2List = [];
                }
            }
            $scope.state1ChangeForUpdate = function () {
                //alert($scope.detailForUpdate.state1_id);
                if ($scope.detailForUpdate.state_id_1) {
                    CommonService.getState($scope.detailForUpdate.state_id_1).then(function (result) {
                        $scope.state2List = result.data;
                    });
                } else {
                    $scope.state2List = [];
                }
            }

            /**
             * 媒体渠道二级及联
             * @type {Array}
             */
            $scope.mediaChannel1List = [];
            $scope.mediaChannel2List = [];
            $scope.mediaChannel1ListForMyFilter = [];
            $scope.mediaChannel2ListForMyFilter = [];
            $scope.mediaChannel1ListForMyAllot = [];
            $scope.mediaChannel2ListForMyAllot = [];
            $scope.mediaChannel1Change = function () {
                if ($scope.CrmCustomerStudentVoForCreate.media_channel_id_1) {
                    CommonService.getMediaChannel($scope.CrmCustomerStudentVoForCreate.media_channel_id_1).then(function (result) {
                        //console.dir(result.data);
                        $scope.mediaChannel2List = result.data;
                    });
                } else {
                    $scope.mediaChannel2List = [];
                }
                $scope.CrmCustomerStudentVoForCreate.media_channel_id_2 = null;
            }
            $scope.mediaChannel1ChangeForFilter = function () {
                if ($scope.myCrmCustomerStudentFilter.media_channel_id_1) {
                    CommonService.getMediaChannel($scope.myCrmCustomerStudentFilter.media_channel_id_1).then(function (result) {
                        $scope.mediaChannel2ListForMyFilter = result.data;
                    });
                } else {
                    $scope.mediaChannel2ListForMyFilter = [];
                }
            }
            $scope.mediaChannel1ChangeForUpdate = function () {
                if ($scope.detailForUpdate.media_channel_id_1) {
                    CommonService.getMediaChannel($scope.detailForUpdate.media_channel_id_1).then(function (result) {
                        $scope.mediaChannel2List = result.data;
                    });
                } else {
                    $scope.mediaChannel2List = [];
                }
                $scope.detailForUpdate.media_channel_id_2 = null;
            }
            $scope.mediaChannel1ChangeForAllot = function () {
                if ($scope.allotCrmCustomerStudentFilter.media_channel_id_1) {
                    CommonService.getMediaChannel($scope.allotCrmCustomerStudentFilter.media_channel_id_1).then(function (result) {
                        $scope.mediaChannel2ListForMyAllot = result.data;
                    });
                } else {
                    $scope.mediaChannel2ListForMyAllot = [];
                }
            }

            /**
             * 转班
             */
            $scope.showTransferClassView = function showTransferClassView(row) {
                $scope.rowCurrentStudent = row;
                var searchModel = {};
                searchModel.crmStudentId = row.crm_student_id;
                searchModel.isDeleted = 0;
                searchModel.start = 0;
                searchModel.size = 1;
                //查询学生是否有过分班
                var promise = ClassStudentAttendenceService.pageAttendenceList(searchModel);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal("获取学生是否有过分班失败，请重试", "error");
                        return false;
                    } else {
                        //没查到班级可能存在已入班但未到时间的记录，需要弹窗提示
                        if (response.data.total === 0) {
                            searchModel.type = 0;
                            searchModel.customCondition = ' AND operation_time > NOW() ';
                            var promise = ClassStudentRecordService.pageList(searchModel);
                            promise.then(function (response) {
                                if (response.status == "FAILURE") {
                                    SweetAlert.swal("获取学生是否有未到班失败，请重试", "error");
                                    return false;
                                } else {
                                    var classRecordData = response.data;
                                    if (classRecordData.total === 0) {
                                        //不存在分班弹窗提示未分班
                                        if (response.data.list.length === 0) {
                                            SweetAlert.swal(row.name + ' 学员还未分班，不能执行此操作！');
                                        }
                                    } else {
                                        //存在则提示需要撤销入出班记录
                                        var notBeginClass = classRecordData.list[0];
                                        var promise = $scope.getClass(notBeginClass);
                                        promise.then(function (response) {
                                            SweetAlert.swal(row.name + ' 学员已在' + response.data.name
                                                + ' 班，但未到入班时间 ，无法进行转班操作，请到班级管理进行操作');
                                        });
                                    }
                                }
                            });
                        }
                        //存在的话转班弹窗
                        else {
                            $scope.transferClassTitle = row.name;
                            $scope.transferClassModal = $mtModal.modal('partials/sos/customer/modal.transferClass.html?' + new Date().getTime(), $scope)
                        }
                    }
                });
            }
            /*
             * 过滤结业班级
             */
            $scope.searchModel = {};
            $scope.filterClassStatus = function () {
                if ($scope.searchModel.status != null) {
                    $scope.searchModel.status = null;
                } else {
                    $scope.searchModel.status = 0;
                }
                $scope.getClassAttendenceList($scope.classAttendenceListTableState);
            }
            /**
             * 获取学生所在班级列表
             */
            $scope.getClassAttendenceList = function getClassAttendenceList(tableState) {
                $scope.classAttendenceListTableState = tableState;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;
                var searchModel = {};
                searchModel.crmStudentId = $scope.rowCurrentStudent.crm_student_id;
                searchModel.isDeleted = 0;
                searchModel.start = start;
                searchModel.size = number;
                searchModel.status = $scope.searchModel.status;
                var promise = ClassStudentAttendenceService.pageAttendenceList(searchModel);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal("获取学生所在班级列表失败，请重试", "error");
                        return false;
                    } else {
                        $scope.studentCurrentClassAttendenceList = response.data.list;
                        tableState.pagination.numberOfPages = response.data.pages;
                        $scope.studentCurrentClassList = [];
                        //遍历查询班级信息
                        angular.forEach($scope.studentCurrentClassAttendenceList, function (data, index, array) {
                            var promise = $scope.getClass(data);
                            promise.then(function (response) {
                                if ($scope.studentCurrentClassList) {
                                    if (response.data.schoolId === localStorageService.get('department').id) {
                                        $scope.studentCurrentClassList.push(response.data);
                                    }
                                }
                            });
                        });
                    }
                });
            }
            /**
             * 获取班级
             */
            $scope.getClass = function getClass(studentClass) {
                var promise = ClassManagementService.queryById(studentClass.crmStudentClassId);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal("获取班级失败", "请重试", "error");
                    }
                    else {
                        studentClass = response.data;
                        if (studentClass.classTimeJson) {
                            studentClass = $scope.generateClassTime(studentClass);
                        }
                    }
                });
                return promise;
            }
            /**
             * 可转班级列表弹窗
             */
            $scope.showAvailableClassView = function showAvailableClassView(row) {
                $scope.rowCurrentClass = row;
                var searchModel = {};
                searchModel.crmStudentId = $scope.rowCurrentStudent.crm_student_id;
                searchModel.isDeleted = 0;
                searchModel.start = 0;
                searchModel.size = 0;
                //获取当前学生所在全部班级
                var promise = ClassStudentAttendenceService.pageList(searchModel);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal("获取可转班级列表失败，请重试", "error");
                        return false;
                    } else {
                        var studentCurrentClassAttendenceList = response.data.list;
                        $scope.existClasses = ' AND csc.id NOT IN (';
                        angular.forEach(studentCurrentClassAttendenceList, function (data, index, array) {
                            if (index === 0) {
                                $scope.existClasses = $scope.existClasses + data.crmStudentClassId;
                            } else {
                                $scope.existClasses = $scope.existClasses + ',' + data.crmStudentClassId;
                            }
                        });
                        $scope.existClasses = $scope.existClasses + ')';
                        $scope.existClassModal = $mtModal.modal('partials/sos/customer/modal.availableClass.html?' + new Date().getTime(), $scope);
                    }
                });
            }
            /**
             * 生成上课时间
             */
            $scope.generateClassTime = function generateClassTime(studentClass) {
                var classTimeList = [];
                var list = eval(studentClass.classTimeJson);
                for (var j = 0; list != null && j < list.length; j++) {
                    if (classTimeList.length == 0) {
                        classTimeList.push(list[j]);
                    }
                    else {
                        for (var k = 0; k < classTimeList.length; k++) {
                            if (classTimeList[k].startTime == list[j].startTime && classTimeList[k].endTime == list[j].endTime) {
                                //拼上星期几的描述
                                classTimeList[k].startDate = classTimeList[k].startDate + list[j].startDate.substr(2, 1);
                                break;
                            }
                            else if (k == classTimeList.length - 1) {
                                //遍历到最后一个还不相等，那么就加入
                                classTimeList.push(list[j]);
                                break;
                            }
                        }

                    }
                }
                for (var j = 0; j < classTimeList.length; j++) {
                    classTimeList[j].startDate = "周" + classTimeList[j].startDate.substr(2);
                }
                studentClass.classTimeList = classTimeList;
                return studentClass;
            }
            /**
             * 可转班级列表
             */
            $scope.getAvailableClassList = function getAvailableClassList(tableState) {
                //查询课程一致的未结课的班级
                var filter = {};
                filter.courseId = $scope.rowCurrentClass.courseId;
                filter.schoolId = localStorageService.get('department').id;
                filter.customCondition = $scope.existClasses;
                filter.status = 0;
                filter.classType = 1;
                filter.isDeleted = 0;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;
                filter.start = start;
                filter.size = number;
                var promise = ClassManagementService.getClassesByFilter(filter);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal("查询课程一致的未结课的班级失败，请重试", "error");
                        return false;
                    } else {
                        $scope.availableClassList = response.data.list;
                        angular.forEach($scope.availableClassList, function (data, index, array) {
                            if (data.classTimeJson) {
                                data = $scope.generateClassTime(data);
                            }
                        });
                        tableState.pagination.numberOfPages = response.data.pages;
                    }
                });
            }
            /**
             * 选中tr
             * @param index
             */
            $scope.thisTrActive = function thisTrActive(index) {
                $scope.availableClassList.forEach(function (item) {
                    item.active = false
                })
                $scope.availableClassList[index].active = true
            }
            /**
             * 确认转班
             */
            $scope.transferClass = function transferClass() {
                //转出班级
                $scope.exitClass = $scope.rowCurrentClass;
                //转入班级
                $scope.joinClass = $scope.availableClassList.find(function (item) {
                    return item.active === true
                });
                if ($scope.joinClass) {
                    //弹出选择操作时间
                    $scope.joinOrExitModel = {};
                    $scope.joinOrExitModel.crmStudentId = $scope.rowCurrentStudent.crm_student_id;
                    $scope.transferClassOperation = true;
                    $scope.joinOrExitTitle = '提示';
                    $scope.joinOrExitType = 0;
                    $scope.joinOrExitModal = $mtModal.modal('partials/sos/class/modal.joinOrExit.html?' + new Date().getTime(), $scope);
                } else {
                    SweetAlert.swal("请选择要转入的班级");
                    return false;
                }
            }
            /**
             * 出入班操作
             */
            $scope.joinOrExitClass = function joinOrExitClass() {
                //转出操作
                var recordModel = {};
                recordModel.crmStudentClassId = $scope.exitClass.id;
                recordModel.crmStudentId = $scope.joinOrExitModel.crmStudentId;
                recordModel.type = 1;
                recordModel.operationTime = $scope.joinOrExitModel.operationTime;
                var promise = ClassStudentRecordService.joinOrExitClass(recordModel);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal("转出操作失败，请重试", response.data);
                        return false;
                    } else {
                        //转入操作
                        var recordModel = {};
                        recordModel.crmStudentClassId = $scope.joinClass.id;
                        recordModel.crmStudentId = $scope.joinOrExitModel.crmStudentId;
                        recordModel.type = 0;
                        recordModel.operationTime = $scope.joinOrExitModel.operationTime;
                        recordModel.operationTime = new Date(recordModel.operationTime);
                        var nowDay = recordModel.operationTime.getDate();              //当前日
                        var nowMonth = recordModel.operationTime.getMonth();           //当前月
                        var nowYear = recordModel.operationTime.getYear();             //当前年
                        nowYear += (nowYear < 2000) ? 1900 : 0;
                        recordModel.operationTime = new Date(nowYear, nowMonth, nowDay);

                        var promise = ClassStudentRecordService.joinOrExitClass(recordModel);
                        promise.then(function (response) {
                            if (response.status == "FAILURE") {
                                SweetAlert.swal("转入操作失败，请重试", "error");
                                return false;
                            } else {
                                SweetAlert.swal("操作成功", "success");
                                $scope.transferClassModal.hide();
                                $scope.existClassModal.hide();
                                $scope.joinOrExitModal.hide();
                            }
                        });
                    }
                });
            }

            /***************************************************************************************************一对多相关***************************************************************************************************/
            /**
             * 一对多类型
             */
            $scope.groupTypeList = [
                { id: 2, name: '一对二' },
                { id: 3, name: '一对三' },
                { id: 5, name: '其他' }
            ];

            /**
             * 一对多类型转变
             */
            $scope.groupTypeChange = function () {
                if ($scope.myCrmCustomerStudentListForAddGroupFilter.group_type === 2) {
                    $scope.myCrmCustomerStudentListForAddGroupFilter.student_count = 2;
                }
                if ($scope.myCrmCustomerStudentListForAddGroupFilter.group_type === 3) {
                    $scope.myCrmCustomerStudentListForAddGroupFilter.student_count = 3;
                }
            }

            /**
             * 一对多列表
             */
            $scope.myCrmCustomerStudentGroupFilter = {}; //学生客户一对多过滤器
            $scope.MyCrmCustomerStudentGroupList = [];

            /**
             * 从首页跳转一对多详情
             */
            $scope.getMyCrmCustomerStudentGroupListAndShowDetailView = function callServer(tableState) {
                $scope.myCrmCustomerStudentGroupListTableState = tableState;
                $scope.isMyCrmCustomerStudentGroupListLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;
                CustomerStudentGroupService.list(start, number, tableState, $scope.myCrmCustomerStudentGroupFilter).then(function (result) {
                    $scope.MyCrmCustomerStudentGroupList = result.data;
                    if ($scope.MyCrmCustomerStudentGroupList) {
                        $scope.showGroupDetailView($scope.MyCrmCustomerStudentGroupList[0])
                    }
                    tableState.pagination.numberOfPages = result.numberOfPages;
                    $scope.isMyCrmCustomerStudentGroupListLoading = false;
                    CommonService.getGradeIdSelect().then(function (result) {
                        $scope.gradeIds = result.data;
                    });
                });
            };

            $scope.getMyCrmCustomerStudentGroupList = function callServer(tableState) {
                $scope.myCrmCustomerStudentGroupListTableState = tableState;
                //console.dir(tableState);
                $scope.isMyCrmCustomerStudentGroupListLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                CustomerStudentGroupService.list(start, number, tableState, $scope.myCrmCustomerStudentGroupFilter).then(function (result) {
                    //console.dir(result.data);
                    // $scope.getAllSelected();
                    $scope.MyCrmCustomerStudentGroupList = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isMyCrmCustomerStudentGroupListLoading = false;
                    CommonService.getGradeIdSelect().then(function (result) {
                        $scope.gradeIds = result.data;
                        /**
                         * 快捷方式进来
                         */
                        if ($routeParams.dateTime && (Date.now() - $routeParams.dateTime < 1000 * 60 * 5) && !$scope.isGo) {
                            if ($routeParams.v3 == 1) {
                                if (!$scope.groupModal) {
                                    $scope.isGo = true
                                    $scope.showGroupModal(null, 1)
                                }
                            }
                        }
                    });
                });
            };

            /**
             * 添加一对多页面学生列表
             */
            $scope.myCrmCustomerStudentListForAddGroupFilter = {}; //学生客户一对多过滤器
            $scope.MyCrmCustomerStudentListForAddGroup = [];
            $scope.getMyCrmCustomerStudentListForAddGroup = function callServer(tableState) {
                $scope.studentListForAddGroupTableState = tableState;
                CommonService.getCourseTypeIdSelect().then(function (result) {
                    $scope.courseTypeIds = result.data;
                });
                //放入校区id
                var school_id = localStorageService.get('school_id');
                if (!school_id) {
                    $scope.MyCrmCustomerStudentListForAddGroup = null;
                    tableState.pagination.numberOfPages = 0;
                    return false;
                }
                $scope.myCrmCustomerStudentListForAddGroupFilter.school_id = school_id;
                $scope.isMyCrmCustomerStudentListForAddGroupLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                CustomerStudentGroupService.getStudentListForAddGroup(start, number, tableState, $scope.myCrmCustomerStudentListForAddGroupFilter).then(function (result) {
                    $scope.MyCrmCustomerStudentListForAddGroup = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isMyCrmCustomerStudentListForAddGroupLoading = false;
                    _isSelectMt()
                });
            };

            /**
             * 重置查询条件
             */
            $scope.resetParam = function resetParam() {
                $scope.myCrmCustomerStudentListForAddGroupFilter.name = null;
                $scope.myCrmCustomerStudentListForAddGroupFilter.phone = null;
                $scope.myCrmCustomerStudentListForAddGroupFilter.grade_id = null;
                $scope.studentListForAddGroupTableState.search.predicateObject = null;
                $scope.getMyCrmCustomerStudentListForAddGroup($scope.studentListForAddGroupTableState);
            }

            $scope.orderRuleSelect = [{ name: '1小时', id: 1 }, { name: '40分钟', id: 2 }];

            /**
             * 查看一对多详细信息
             */
            $scope.groupNo = "";
            $scope.viewGroupDetail = function (detail) {
                $scope.modalTitle = "查看一对多学员";
                $scope.modalGroupDetail = $modal({
                    title: '修改',
                    scope: $scope,
                    templateUrl: 'partials/sos/customer/modal.groupDetail.html',
                    show: true
                });
                CustomerStudentGroupService.detail(detail).then(function (result) {
                    $scope.groupDetailStudentList = result.groupStudentList;
                })
            };
            $scope.showCrmCustomerStudent = function (row) {
                $scope.modalGroupDetail.hide();
                $scope.viewCrmCustomerStudent(row);
            };

            $scope.IsSchoolAuit = function () {
                var IsSchoolAuit = false;
                if (AuthenticationService.currentUser().position_id == Constants.PositionID.FINANCIAL_AFFAIRS) {
                    IsSchoolAuit = true;
                }
                return IsSchoolAuit;
            }

            /**
             * 删除一个一对多中的某个学生
             * @param student
             */
            $scope.removeOneStudentOfGroup = function (student) {
                //删除
                SweetAlert.swal({
                    title: "确定要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#fe9900',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        CustomerStudentGroupService.removeOneStudentOfGroup(student).then(function (result) {
                            $scope.groupDetailStudentList = deleteStuFroGroup($scope.groupDetailStudentList, student);
                            if ($scope.myCrmCustomerStudentGroupListTableState) {
                                $scope.getMyCrmCustomerStudentGroupList($scope.myCrmCustomerStudentGroupListTableState);
                            }
                        });
                    }
                }
                );
            }

            function deleteStuFroGroup(groupDetailStudentList, stu) {
                var newList = [];
                angular.forEach(groupDetailStudentList, function (data, index, array) {
                    if (data.crm_student_id != stu.crm_student_id) {
                        newList.push(data);
                    }
                })
                return newList;
            }

            /**
             * 跳转到一对多编辑页面
             */
            $scope.groupEdit = function (group) {
                $scope.groupId = group.id;
                //查询一对多中的学生
                CustomerStudentGroupService.detail(group).then(function (result) {
                    $scope.groupDetailStudentList = result.groupStudentList;
                })
            }

            /**
             * 编辑查看一对多专用
             * @private
             */
            function _isSelectMt() {
                for (var i = 0, len = $scope.MyCrmCustomerStudentListOk.length; i < len; i++) {
                    for (var j = 0, jLen = $scope.MyCrmCustomerStudentListForAddGroup.length; j < jLen; j++) {
                        if ($scope.MyCrmCustomerStudentListOk[i].crm_student_id == $scope.MyCrmCustomerStudentListForAddGroup[j].crm_student_id) {
                            $scope.MyCrmCustomerStudentListForAddGroup[j].select = 1
                        }
                    }
                }
            }

            /**
             * 删除一对多
             */
            $scope.deleteGroup = function (group) {
                SweetAlert.swal({
                    title: "确定要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#fe9900',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        var promise = CustomerStudentGroupService.remove(group);
                        promise.then(function (data) {
                            if (data <= 0) {
                                SweetAlert.swal("删除一对多失败，请重试", response.data);
                                return false;
                            }
                            $scope.isList = true;
                            $scope.isDetail = false;
                            $scope.isUpdate = false;
                            $scope.isAddGroup = false;
                            $scope.isGroupDetail = false;
                            //删除未消课排课记录
                            var omsCoursePlan = {};
                            omsCoursePlan.groupId = group.id;
                            omsCoursePlan.is_past = 0;
                            omsCoursePlan.courseType = 2;
                            var promise = CoursePlanService.remove(omsCoursePlan);
                            promise.then(function (response) {
                                if (response.status == "FAILURE") {
                                    SweetAlert.swal("删除一对多排课失败，请重试", response.data);
                                    return false;
                                }
                            });
                            //刷新列表
                            $scope.myCrmCustomerStudentGroupListTableState.pagination.start = 0;
                            $scope.getMyCrmCustomerStudentGroupList($scope.myCrmCustomerStudentGroupListTableState);
                        }, function (error) {
                            alert("删除学生一对多失败");
                        });
                    }
                }
                );
            }

            /**
             * 跳转到添加一对多页面
             */
            $scope.addGroup = function () {
                $scope.MyCrmCustomerStudentListOk = [];
                $scope.isAddGroup = true;
                $scope.isList = false;
                $scope.isDetail = false;
                $scope.isUpdate = false;
                $scope.isAllot = false;
            }

            /**
             * 展示一对多弹框
             * @param row 行数据
             * @param type 弹框类型（1：添加 2：编辑 3：查看）
             */
            $scope.showGroupModal = function showGroupModal(row, type) {
                if ($scope.myCrmCustomerStudentListForAddGroupFilter) {
                    $scope.myCrmCustomerStudentListForAddGroupFilter = {};
                }
                if (type === 1) {
                } else if (type === 2) {
                    CustomerStudentGroupService.detail(row).then(function (result) {
                        $scope.MyCrmCustomerStudentListOk = result.groupStudentList;
                        angular.forEach($scope.MyCrmCustomerStudentListOk, function (data, index, array) {
                            data.name = data.studentName;
                        });
                        $scope.myCrmCustomerStudentListForAddGroupFilter.group_no = row.group_no;
                        $scope.myCrmCustomerStudentListForAddGroupFilter.group_type = row.group_type;
                        $scope.myCrmCustomerStudentListForAddGroupFilter.student_count = row.student_count * 1 || 0;
                        $scope.myCrmCustomerStudentListForAddGroupFilter.order_rule = row.order_rule;
                    })
                }
                $scope.groupModalOperation = type
                $scope.modaltitle = _getTitle(row, type)
                $scope.groupModal = $mtModal.modal('partials/sos/customer/group/modal.html', $scope)
            }
            function _getTitle(row, type) {
                switch (type) {
                    case 1:
                        $scope.MyCrmCustomerStudentListOk.length = 0
                        $scope.btnTrue = $scope.saveGroup
                        $scope._look_mt = false
                        return '添加一对多'
                    case 2:
                        $scope.groupEdit(row);
                        $scope.btnTrue = $scope.updateGroup
                        $scope._look_mt = false
                        return '编辑一对多'
                    case 3:
                        $scope.groupEdit(row);
                        $scope._look_mt = true
                        $scope.btnTrue = $scope.groupModal.hide
                        return '查看一对多'
                }
            }

            /**
             * 删除全部已选
             */
            $scope.deleteAllMt = function deleteAllMt() {
                if ($scope._look_mt) {
                    return false
                }
                $scope.MyCrmCustomerStudentListOk.length = 0
                for (var i = 0, len = $scope.MyCrmCustomerStudentListForAddGroup.length; i < len; i++) {
                    $scope.MyCrmCustomerStudentListForAddGroup[i].select = 0
                }
            }
            /**
             * 判断是否选中学员
             * @returns {boolean}
             * @private
             */
            function _sutLength() {
                if (!$scope.MyCrmCustomerStudentListOk.length) {
                    $mtModal.moreModal({ status: 0, text: '请添加学员', scope: $scope })
                    return false
                }
                return true
            }
            /**
             * 保存添加一对多
             */
            $scope.MyCrmCustomerStudentListOk = [];
            $scope.saveGroup = function () {
                if (!_sutLength()) {
                    return false
                }
                if ($scope.MyCrmCustomerStudentListOk.length > $scope.myCrmCustomerStudentListForAddGroupFilter.student_count) {
                    $mtModal.moreModal({ status: 0, text: '当前学员超过一对多人数！', scope: $scope })
                    return false
                }
                $scope.myCrmCustomerStudentListForAddGroupFilter.crmCustomerStudentList = $scope.MyCrmCustomerStudentListOk;
                var promise = CustomerStudentGroupService.create($scope.myCrmCustomerStudentListForAddGroupFilter);
                promise.then(function (data) {
                    $scope.isList = true;
                    $scope.isDetail = false;
                    $scope.isUpdate = false;
                    $scope.isAddGroup = false;
                    $scope.isEditGroup = false;
                    $scope.MyCrmCustomerStudentListOk = [];
                    //刷新列表
                    if ($scope.groupModal) {
                        $scope.groupModal.hide()
                    }
                    if ($scope.myCrmCustomerStudentGroupListTableState) {
                        $scope.myCrmCustomerStudentGroupListTableState.pagination.start = 0;
                        $scope.getMyCrmCustomerStudentGroupList($scope.myCrmCustomerStudentGroupListTableState);
                    }
                    modalObj.text = '创建学生一对多成功'
                    $mtModal.moreModal(modalObj)
                }, function (error) {
                    modalObj.text = '创建学生一对多失败'
                    $mtModal.moreModal(modalObj)
                });
            }

            /**
             * 更新一对多信息
             * */
            $scope.updateGroup = function () {
                if (!_sutLength()) {
                    return false
                }
                if ($scope.MyCrmCustomerStudentListOk.length > $scope.myCrmCustomerStudentListForAddGroupFilter.student_count) {
                    $mtModal.moreModal({ status: 0, text: '当前学员超过一对多人数！', scope: $scope })
                    return false
                }
                var groupForUpdate = {};
                groupForUpdate.groupId = $scope.groupId;
                groupForUpdate.group_no = $scope.myCrmCustomerStudentListForAddGroupFilter.group_no;
                groupForUpdate.order_rule = $scope.myCrmCustomerStudentListForAddGroupFilter.order_rule;
                groupForUpdate.group_type = $scope.myCrmCustomerStudentListForAddGroupFilter.group_type;
                groupForUpdate.student_count = $scope.myCrmCustomerStudentListForAddGroupFilter.student_count;
                groupForUpdate.crmStudentList = $scope.MyCrmCustomerStudentListOk;
                var promise = CustomerStudentGroupService.update(groupForUpdate);
                promise.then(function (data) {
                    if (data <= 0) {
                        $mtModal.moreModal({ status: 0, text: '一对多更新失败！', scope: $scope })
                        return false
                    }
                    $scope.groupId = null;
                    $scope.isList = true;
                    $scope.isDetail = false;
                    $scope.isUpdate = false;
                    $scope.isAddGroup = false;
                    $scope.isEditGroup = false;
                    $scope.MyCrmCustomerStudentListOk = [];
                    //删除未消课排课记录
                    var omsCoursePlan = {};
                    omsCoursePlan.groupId = groupForUpdate.groupId;
                    omsCoursePlan.is_past = 0;
                    omsCoursePlan.courseType = 2;
                    var promise = CoursePlanService.remove(omsCoursePlan);
                    promise.then(function (response) {
                        if (response.status == "FAILURE") {
                            SweetAlert.swal("删除一对多排课失败，请重试", response.data);
                            return false;
                        }
                    });
                    //刷新列表
                    $scope.myCrmCustomerStudentGroupListTableState.pagination.start = 0;
                    $scope.getMyCrmCustomerStudentGroupList($scope.myCrmCustomerStudentGroupListTableState);
                    if ($scope.groupModal) {
                        $scope.groupModal.hide()
                    }
                }, function (error) {
                    alert("更新学生一对多失败");
                });
            }

            //选择
            $scope.MyCrmCustomerStudentListOk = [];
            $scope.selectOne = function ($event, student) {
                var checkbox = $event.target;
                if (checkbox.checked) {//如果是选中
                    for (var index in $scope.MyCrmCustomerStudentListOk) {//判断是否已选择此学生
                        if ($scope.MyCrmCustomerStudentListOk[index].crm_student_id == student.crm_student_id
                            || $scope.MyCrmCustomerStudentListOk[index].crm_order_student_course_id == student.crm_order_student_course_id) {//如果已选中则删除
                            SweetAlert.swal("同一一对多不能添加同一个学生");
                            checkbox.checked = false;
                            return false;
                        }
                    }
                    //判断课程类型、年级、客户、课时规格是否相同
                    if ($scope.MyCrmCustomerStudentListOk.length > 0) {
                        var oneStu = $scope.MyCrmCustomerStudentListOk[0];
                        if (oneStu.course_type_name != student.course_type_name) {
                            SweetAlert.swal("同一一对多课程类型必须相同");
                            checkbox.checked = false;
                            return false;
                        } else if (oneStu.grade_id != student.grade_id) {
                            SweetAlert.swal("同一一对多年级必须相同");
                            checkbox.checked = false;
                            return false;
                        } else if (oneStu.order_rule != student.order_rule) {
                            SweetAlert.swal("同一一对多课程课时规格必须相同");
                            checkbox.checked = false;
                            return false;
                        }
                    }
                    $scope.MyCrmCustomerStudentListOk.push(student);
                } else {//如果是取消选中
                    $scope.deleteOne(student);
                }
            };
            var modalObj = {
                status: 0,
                text: '',
                scope: $scope
            }
            /**
             * 选择重写
             * @param student
             */
            $scope.selectOneMt = function (student) {
                if ($scope._look_mt) {
                    return false
                }
                if (!student.select) {
                    for (var index in $scope.MyCrmCustomerStudentListOk) {//判断是否已选择此学生
                        if ($scope.MyCrmCustomerStudentListOk[index].crm_student_id == student.crm_student_id) {//如果已选中则删除
                            modalObj.text = '同一一对多不能添加同一个学生'
                            $mtModal.moreModal(modalObj)
                            // SweetAlert.swal("同一一对多不能添加同一个学生");
                            return false;
                        }
                    }
                    student.select = 1
                    $scope.MyCrmCustomerStudentListOk.push(angular.copy(student));
                    console.log($scope.MyCrmCustomerStudentListOk)
                }
                else {//如果是取消选中
                    $scope.deleteOneMt(student);
                }
            }
            /**
             * 删除一个
             * @param student
             */
            $scope.deleteOneMt = function deleteOneMt(student) {
                if ($scope._look_mt) {
                    return false
                }
                for (var i = 0, len = $scope.MyCrmCustomerStudentListOk.length; i < len; i++) {
                    if (student.crm_student_id == $scope.MyCrmCustomerStudentListOk[i].crm_student_id) {
                        try {
                            $scope.MyCrmCustomerStudentListOk.splice(i, 1)
                        } catch (e) { }
                        (function (id) {
                            for (var i = 0, len = $scope.MyCrmCustomerStudentListForAddGroup.length; i < len; i++) {
                                if (id == $scope.MyCrmCustomerStudentListForAddGroup[i].crm_student_id) {
                                    $scope.MyCrmCustomerStudentListForAddGroup[i].select = 0
                                }
                            }
                        })(student.crm_student_id)
                        break;
                    }
                }
            }
            //删除
            $scope.deleteOne = function (student) {
                for (var index in $scope.MyCrmCustomerStudentListOk) {
                    if (student.crm_order_student_course_id == $scope.MyCrmCustomerStudentListOk[index].crm_order_student_course_id) {
                        $scope.MyCrmCustomerStudentListOk = removeItemFromArray(student, $scope.MyCrmCustomerStudentListOk);
                        break;
                    }
                }
            };
            //是否选中
            $scope.isSelected = function (student) {
                //console.log(student);
                for (var index in $scope.MyCrmCustomerStudentListOk) {
                    if ($scope.MyCrmCustomerStudentListOk[index].crm_order_student_course_id == student.crm_order_student_course_id) {
                        return true;
                    }
                }
                return false;
            }

            //从已选定的学生中删除一个
            function removeItemFromArray(item, list) {
                //console.dir(111);
                var newList = [];
                for (var tmp in list) {
                    if (list[tmp].crm_order_student_course_id != item.crm_order_student_course_id) {
                        newList.push(list[tmp]);
                    }
                }
                return newList;
            }

            /**
             * 跳转到一对多分配页面
             */
            $scope.groupAllotNo = "";
            $scope.allotGroup = {};
            //$scope.guWenList = [];//学习顾问主管和学习顾问
            $scope.groupAllot = function (group) {
                $scope.allotCrmCustomerStudentFilter = {};
                $scope.allotCrmCustomerStudentGroupFilter = {};
                $scope.allotGroup = group;

                $scope.isList = false;
                $scope.isDetail = false;
                $scope.isUpdate = false;
                $scope.isAddGroup = false;
                $scope.isGroupDetail = false;
                $scope.isGroupAllot = true;

                //学生信息
                CustomerStudentGroupService.detail(group).then(function (result) {
                    $scope.groupDetailStudentList = result.groupStudentList;
                    if (result.groupStudentList.length > 0) {
                        $scope.groupAllotNo = group.group_no;
                    } else {
                        $scope.groupAllotNo = "一对多人数为空";
                    }
                })
            }

            /**
             * 保存一对多分配信息
             */
            $scope.allotCrmCustomerStudentGroupFilter = {};
            $scope.saveGroupAllot = function () {
                if ($scope.allotCrmCustomerStudentGroupFilter && $scope.allotCrmCustomerStudentGroupFilter.user_id) {
                    var groupAllotVo = {};
                    groupAllotVo.user_id = $scope.allotCrmCustomerStudentGroupFilter.user_id;
                    groupAllotVo.group = $scope.allotGroup;

                    CustomerStudentGroupService.saveGroupAllot(groupAllotVo).then(function (result) {
                        $scope.allotGroup = {};
                        $scope.showListView();
                    })
                } else {
                    SweetAlert.swal("请选择员工后重试");
                }
            }
            /***************************************************************************************************一对多相关***************************************************************************************************/

            /***************************************************************************************************客户分配***************************************************************************************************/
            /**
             * 跳转到分配学生页面
             */
            $scope.showAllotView = function () {
                //console.log($scope.allotCrmCustomerStudentFilter.school_master_id);
                $scope.allotCrmCustomerStudentFilter = {};
                $scope.allotCrmCustomerStudentGroupFilter = {};
                $scope.MyCrmCustomerStudentAllotListOk = [];
                $scope.allotCrmCustomerStudentList = [];//待分配学生列表
                $scope.MyCrmCustomerStudentAllotListOk = [];
                //$scope.allotCrmCustomerStudentFilter.school_master_id = null;
                $scope.allotCrmCustomerStudentFilter.user_id = null;
                $scope.schoolMasterFilter = {};
                $scope.SchoolMasterListOk = [];
                $scope.isAllot = true;
                $scope.selectAllFlagForAllot = false;
                $scope.isAddGroup = false;
                $scope.isList = false;
                $scope.isDetail = false;
                $scope.isUpdate = false;
                //刷新待分配学生列表
                $scope.MyCrmCustomerStudentAllotListOk = [];//已选中学生列表
                if (!$scope.myCrmLeadsStudentListAllotTableState) {
                    $scope.myCrmLeadsStudentListAllotTableState = {
                        pagination: {}
                    }
                }
                $scope.myCrmLeadsStudentListAllotTableState.pagination.start = 0;
                $scope.getAllotCrmCustomerStudentList($scope.myCrmLeadsStudentListAllotTableState);
                //获取区域信息
                $scope.getDepartmentsOfDistrict();
                //重新查询校长
                if ($scope.schoolMasterTableState) {
                    $scope.getAllSchoolMaster($scope.schoolMasterTableState);
                }
            }

            /********************* 过滤分配学员列表高中毕业学生 ****************************/
            $scope.isAllotSelectedGraduation = true;
            $scope.quickAllotSelectGraduation = function () {
                if ($scope.isAllotSelectedGraduation) {
                    $scope.isAllotSelectedGraduation = false;
                } else {
                    $scope.isAllotSelectedGraduation = true;
                }
                //分配学员列表
                if (!isEmptyObject($scope.allotCrmCustomerStudentFilter)) {
                    $scope.allotCrmCustomerStudentFilter.isSelectedGraduation = $scope.isAllotSelectedGraduation;
                    $scope.getAllotCrmCustomerStudentList($scope.myCrmLeadsStudentListAllotTableState);
                }
            };

            /********************* 过滤分配学员列表异常学员 ****************************/
            $scope.removeAllotAbnormal = true;
            $scope.quickAllotRemoveAbnormal = function () {
                if ($scope.removeAllotAbnormal) {
                    $scope.removeAllotAbnormal = false;
                } else {
                    $scope.removeAllotAbnormal = true;
                }
                //分配学员列表
                if (!isEmptyObject($scope.allotCrmCustomerStudentFilter)) {
                    $scope.allotCrmCustomerStudentFilter.removeAbnormal = $scope.removeAllotAbnormal;
                    $scope.getAllotCrmCustomerStudentList($scope.myCrmLeadsStudentListAllotTableState);
                }
            };

            /**
             * 待分配学生列表
             *
             */
            $scope.allotCrmCustomerStudentFilter = {}; //待分配CrmCustomerStudent过滤条件
            $scope.allotCrmCustomerStudentList = [];//待分配学生列表
            $scope.allAllotPosition = [];
            $scope.allAllotUser = [];
            $scope.allAllotSchool = [];
            $scope.getAllotCrmCustomerStudentList = function callServer(tableState) {
                $scope.myCrmLeadsStudentListAllotTableState = tableState;
                $scope.isAllotCrmCustomerStudentListLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.

                //过滤异常
                if (!isEmptyObject($scope.allotCrmCustomerStudentFilter)) {
                    $scope.allotCrmCustomerStudentFilter.removeAbnormal = $scope.removeAllotAbnormal;
                }
                //过滤高中毕业
                if (!isEmptyObject($scope.allotCrmCustomerStudentFilter)) {
                    $scope.allotCrmCustomerStudentFilter.isSelectedGraduation = $scope.isAllotSelectedGraduation;
                }

                CustomerStudentService.list(start, number, tableState, $scope.allotCrmCustomerStudentFilter).then(function (result) {

                    CommonService.getAllPositionsByOrgId().then(function (result) {
                        $scope.allAllotPosition = result.data;
                    });
                    CommonService.getAllDepartmentOfSchoolByOrgId().then(function (result) {
                        $scope.allAllotSchool = result.data;
                    });

                    $scope.allotCrmCustomerStudentList = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isAllotCrmCustomerStudentListLoading = false;
                });
            };

            /**
             * 岗位员工二级联动
             */
            $scope.positionChangeForAllot = function () {
                if ($scope.allotCrmCustomerStudentFilter.position_id) {
                    CommonService.getAllUserByOrgIdAndPositionId($scope.allotCrmCustomerStudentFilter.position_id).then(function (result) {
                        $scope.allAllotUser = result.data;
                    });
                } else {
                    $scope.allAllotUser = [];
                }
            }

            /**
             * 保存本校区分配信息
             */
            $scope.saveEmpAllot = function () {
                if (!$scope.allotCrmCustomerStudentFilter.user_id) {
                    SweetAlert.swal("请选择要分配的员工信息");
                    return;
                }
                var AllotCrmCustomerStudentVo = {};
                AllotCrmCustomerStudentVo.studentList = $scope.MyCrmCustomerStudentAllotListOk;
                AllotCrmCustomerStudentVo.user_id = $scope.allotCrmCustomerStudentFilter.user_id;

                var promise = CustomerStudentService.saveAllot(AllotCrmCustomerStudentVo);
                promise.then(function (data) {
                    $scope.isList = true;
                    $scope.isAdding = false;
                    $scope.isDetail = false;
                    $scope.isUpdate = false;
                    $scope.isAllot = false;
                    $scope.MyCrmCustomerStudentAllotListOk = [];
                    $scope.allotCrmCustomerStudentFilter = {};
                    //$scope.allotCrmCustomerStudentFilter.user_id = null;
                    $scope.showListView();
                }, function (error) {
                    SweetAlert.swal("分配学生失败");
                });
            }

            //选择一个校长
            $scope.selectSchoolMaster = function (schoolmMaster) {
                $scope.allotCrmCustomerStudentFilter.school_master_id = schoolmMaster.uid;
            }

            /**
             * 保存跨校区分配信息
             */
            $scope.saveSchoolAllot = function () {
                //console.log($scope.allotCrmCustomerStudentFilter.school_master_id);
                if (!$scope.allotCrmCustomerStudentFilter.school_master_id) {
                    SweetAlert.swal("请选择要分配的校长信息");
                    return;
                }
                var AllotCrmCustomerStudentVo = {};
                AllotCrmCustomerStudentVo.studentList = $scope.MyCrmCustomerStudentAllotListOk;
                AllotCrmCustomerStudentVo.school_master_id = $scope.allotCrmCustomerStudentFilter.school_master_id;
                var promise = CustomerStudentService.saveAllot(AllotCrmCustomerStudentVo);
                promise.then(function (data) {
                    $scope.isList = true;
                    $scope.isAdding = false;
                    $scope.isDetail = false;
                    $scope.isUpdate = false;
                    $scope.isAllot = false;
                    $scope.MyCrmCustomerStudentAllotListOk = [];
                    $scope.allotCrmCustomerStudentFilter = {};
                    $scope.schoolMasterFilter = {};
                    $scope.SchoolMasterListOk = [];
                    $scope.showListView();
                }, function (error) {
                    SweetAlert.swal("分配学生失败");
                });
            }

            //选择
            $scope.MyCrmCustomerStudentAllotListOk = [];//已选中学生列表
            $scope.selectAllotOne = function (student) {
                for (var i = 0; i < $scope.MyCrmCustomerStudentAllotListOk.length; i++) {
                    if ($scope.MyCrmCustomerStudentAllotListOk[i].crm_student_id == student.crm_student_id) {
                        $scope.deleteAllotOne(student);
                        return;
                    }
                }
                $scope.MyCrmCustomerStudentAllotListOk.push(student);
            };
            //删除
            $scope.deleteAllotOne = function (student) {
                //console.dir(student);
                if ($scope.MyCrmCustomerStudentAllotListOk.indexOf(student) > -1) {
                    $scope.MyCrmCustomerStudentAllotListOk = removeItemFromArrayForAllot(student, $scope.MyCrmCustomerStudentAllotListOk);
                    //console.log($scope.MyCrmCustomerStudentListOk);
                    //$scope.MyCrmCustomerStudentListOk.splice($scope.MyCrmCustomerStudentListOk.indexOf(student), 1);//dom中删除当前行
                }
            };

            //是否选中
            $scope.isAllotSelected = function (student) {
                //console.log(student);
                for (var i = 0; i < $scope.MyCrmCustomerStudentAllotListOk.length; i++) {
                    if ($scope.MyCrmCustomerStudentAllotListOk[i].crm_student_id == student.crm_student_id) {
                        return true;
                    }
                }
                return false;
            }

            //从已选定的学生中删除一个
            function removeItemFromArrayForAllot(item, list) {
                //console.dir(list);
                var newList = [];
                for (var i = 0; i < list.length; i++) {
                    if (list[i].crm_student_id != item.crm_student_id) {
                        newList.push(list[i]);
                    }
                }
                return newList;
            }

            //获取大区类型
            $scope.DepartmentsOfDistrictList = [];
            $scope.getDepartmentsOfDistrict = function () {
                var promise = CommonService.getDepartmentsOfDistrict();
                promise.then(function (data) {
                    //console.dir(data);
                    $scope.DepartmentsOfDistrictList = data.data;
                }, function (error) {
                    SweetAlert.swal("查询大区信息失败");
                });
            }

            //获取区域类型
            $scope.DepartmentsOfRegion = [];
            $scope.getDepartmentsOfRegion = function () {
                //console.log($scope.schoolMasterFilter);
                var promise = CommonService.getDepartmentsOfRegion($scope.schoolMasterFilter);
                promise.then(function (data) {
                    //console.dir(data);
                    $scope.DepartmentsOfRegion = data.data;
                }, function (error) {
                    SweetAlert.swal("查询区域信息失败");
                });
            }

            //获取所有的校区校长信息
            $scope.schoolMasterFilter = {};
            $scope.schoolMasterList = [];
            $scope.schoolMasterTableState = {};
            $scope.getAllSchoolMaster = function (tableState) {
                $scope.schoolMasterTableState = tableState;
                $scope.isSchoolMasterLoading = true;
                if (!tableState.pagination) {
                    tableState = {
                        pagination: {}
                    }
                }
                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                CommonService.getAllSchoolMaster(start, number, tableState, $scope.schoolMasterFilter).then(function (result) {
                    //console.dir(result.data);
                    //$scope.getAllSelected();
                    $scope.schoolMasterList = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.schoolMasterTableState = tableState;
                    $scope.isSchoolMasterLoading = false;
                });
            }

            //是否选中校长
            $scope.isSchoolMasterSelected = function (emp) {
                for (var index in $scope.SchoolMasterListOk) {
                    if ($scope.SchoolMasterListOk[index].uid == emp.uid) {
                        return true;
                    }
                }
                return false;
            }

            //选择校长
            $scope.SchoolMasterListOk = [];//已选择的校长
            $scope.selectOneSchoolMaster = function (emp) {
                for (var i = 0; i < $scope.SchoolMasterListOk.length; i++) {
                    if ($scope.SchoolMasterListOk[i].uid == emp.uid) {
                        $scope.deleteOneSchoolMaster(emp);
                        return;
                    }
                }
                $scope.SchoolMasterListOk.push(emp);
            };


            //删除校长
            $scope.deleteOneSchoolMaster = function (emp) {
                for (var i = 0; i < $scope.SchoolMasterListOk.length; i++) {
                    if ($scope.SchoolMasterListOk[i].uid == emp.uid) {
                        $scope.SchoolMasterListOk = removeSchoolMasterFromArray(emp, $scope.SchoolMasterListOk);
                        return;
                    }
                }
            };

            //从已选定的校长中删除一个
            function removeSchoolMasterFromArray(item, list) {
                var newList = [];
                for (var i = 0; i < list.length; i++) {
                    if (list[i].uid != item.uid) {
                        newList.push(list[i]);
                    }
                }
                return newList;
            }

            $scope.provinceChangeForBatchAllot = function () {
                //console.dir($scope.detailForUpdate);
                if ($scope.schoolMasterFilter.province_code) {
                    CommonService.getCitySelect($scope.schoolMasterFilter.province_code).then(function (result) {
                        $scope.cityList = result.data;
                    });
                } else {
                    $scope.cityList = [];
                }
            }

            $scope.cityChangeForBatchAllot = function () {
                //console.dir($scope.detailForUpdate);
                if ($scope.schoolMasterFilter.city_code) {
                    CommonService.getAreaSelect($scope.schoolMasterFilter.city_code).then(function (result) {
                        $scope.areaList = result.data;
                    });
                } else {
                    $scope.areaList = [];
                }
            }


            $scope.allAllotSchoolDL = [];
            $scope.allAllotPositionDL = [];

            $scope.distributeCustomerStudent = function (row) {

                if (localStorageService.get('school_id') == 0) {//非校区岗位用户
                    CommonService.getAllDepartmentOfSchool().then(function (result) {
                        $scope.allAllotSchoolDL = result.data;
                    });
                } else {
                    CommonService.getAllPositionsByOrgId().then(function (result) {
                        //console.dir(result.data);
                        $scope.allAllotPositionDL = result.data;
                    });
                    CommonService.getAllDepartmentOfSchoolByOrgId().then(function (result) {
                        $scope.allAllotSchoolDL = result.data;
                    });
                }
                $scope.allotCrmCustomerStudentFilter.singleId = row.crm_student_id;
                $scope.allotCrmCustomerStudentFilter.phone = row.phone;
                $scope.modalTitleDL = '本校区分配所属人';
                //$scope.CrmInvitationDetailVoForCreate.receiveTime = new Date().Format("yyyy-MM-dd h:mm");
                $scope.modalDL = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/customer/modal.distributeFromList.html',
                    show: true
                });
            };

            $scope.allAllotUserDL = [];
            $scope.positionChangeForAllotDL = function () {
                if ($scope.allotCrmCustomerStudentFilter.position_id) {
                    CommonService.getAllUserByOrgIdAndPositionId($scope.allotCrmCustomerStudentFilter.position_id).then(function (result) {
                        $scope.allAllotUserDL = result.data;
                    });
                } else {
                    $scope.allAllotUserDL = [];
                }
            };


            $scope.distributePerson = function () {
                if (!$scope.allotCrmCustomerStudentFilter.user_id) {
                    SweetAlert.swal("未选择员工");
                    return;
                }

                var AllotCrmCustomerStudentVo = {};
                AllotCrmCustomerStudentVo.studentList = [];
                var obj = {};
                obj.crm_student_id = $scope.allotCrmCustomerStudentFilter.singleId;
                obj.phone = $scope.allotCrmCustomerStudentFilter.phone;
                console.log($scope.allotCrmCustomerStudentFilter);
                AllotCrmCustomerStudentVo.studentList.push(obj);
                AllotCrmCustomerStudentVo.user_id = $scope.allotCrmCustomerStudentFilter.user_id;
                var promise = CustomerStudentService.saveAllot(AllotCrmCustomerStudentVo);
                promise.then(function (data) {
                    $scope.showListView();
                    $scope.allotCrmCustomerStudentFilter = {};
                    $scope.allAllotSchoolDL = [];
                    $scope.allAllotPositionDL = [];
                    $scope.allAllotUserDL = [];
                    $scope.modalDL.hide();
                    SweetAlert.swal("分配成功！在读学员的所属人可在学员管理菜单中查到此在读学员");
                }, function (error) {
                    SweetAlert.swal("分配学生失败");
                });


            }


            /***************************************************************************************************客户分配相关相关***************************************************************************************************/

            /**
             * 显示邀约、沟通、提醒列表页面
             */
            $scope.showInvitationListView = function () {
                if ($scope.myCrmCustomerStudentRemindListTableState) {

                    $scope.myCrmCustomerStudentRemindListTableState.pagination.start = 0;
                    $scope.getRemindList($scope.myCrmCustomerStudentRemindListTableState);
                }
                if ($scope.myCrmCustomerStudentCommunicationListTableState) {
                    $scope.myCrmCustomerStudentCommunicationListTableState.pagination.start = 0;
                    $scope.getCommunicationList($scope.myCrmCustomerStudentCommunicationListTableState);
                }
                if ($scope.myCrmCustomerStudentInvitationListTableState) {
                    $scope.myCrmCustomerStudentInvitationListTableState.pagination.start = 0;
                    $scope.getInvitationList($scope.myCrmCustomerStudentInvitationListTableState);
                }


            }


            /**
             * Shows the new invitationRemind dialog.
             */
            function addInvitationRemind() {
                //console.log('Starting creating new invitationRemind.');
                $scope.CrmInvitationRemindVoForCreate = {};
                $scope.CrmInvitationRemindVoForCreate.personState = '1';
                $scope.CrmInvitationRemindVoForCreate.personType = '1';
                $scope.CrmInvitationRemindVoForCreate.personId = $scope.detail.crm_student_id;
                $scope.CrmInvitationRemindVoForCreate.remindTime = new Date().Format("yyyy-MM-dd h:mm");
                $scope.modalTitle = '添加邀约提醒';
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/invitationRemind/modal.invitationRemind.html',
                    show: true
                });
            }

            /**
             * Saves the current invitationRemind.
             */
            function saveInvitationRemind() {
                //console.log('Saving the invitationRemind.');
                if (new Date($scope.CrmInvitationRemindVoForCreate.remindTime) < new Date()) {
                    SweetAlert.swal("提醒时间不能小于当天时间");
                }
                else {
                    $scope.CrmInvitationRemindVoForCreate.remindTime = new Date($scope.CrmInvitationRemindVoForCreate.remindTime);
                    if (typeof $scope.CrmInvitationRemindVoForCreate.id === 'undefined') {
                        var promise = InvitationRemindService.create($scope.CrmInvitationRemindVoForCreate);
                        promise.then(function (CrmInvitationRemindVoForCreate) {
                            $scope.showInvitationListView();
                            $scope.dataLoading = false;
                            $scope.modal.hide();
                        }, function (error) {
                            $scope.dataLoading = false;
                        });
                    } else {
                        var promise = InvitationRemindService.update($scope.CrmInvitationRemindVoForCreate);
                        promise.then(function (CrmInvitationRemindVoForCreate) {
                            $scope.showInvitationListView();
                            $scope.dataLoading = false;
                            $scope.modal.hide();
                        }, function (error) {
                            $scope.dataLoading = false;
                        });
                    }
                }


            }

            /**
             * Edit InvitationRemind.
             * @param InvitationRemind the InvitationRemind to edit
             */
            function editInvitationRemind(crmInvitationRemind) {
                //console.log('Editing invitationRemind : ' + JSON.stringify(crmInvitationRemind));
                $scope.CrmInvitationRemindVoForCreate = angular.copy(crmInvitationRemind);

                $scope.CrmInvitationRemindVoForCreate.remindTime = new Date($scope.CrmInvitationRemindVoForCreate.remindTime).Format("yyyy-MM-dd h:mm");
                $scope.modalTitle = '更新邀约提醒';
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/invitationRemind/modal.invitationRemind.html',
                    show: true
                });

            }

            /**
             * Delete InvitationRemind.
             * @param InvitationRemind the InvitationRemind to delete
             */
            function deleteInvitationRemind(crmInvitationRemind) {
                //console.log('Deleting InvitationRemind : ' + JSON.stringify(crmInvitationRemind));
                SweetAlert.swal({
                    title: "确定要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#fe9900',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        var promise = InvitationRemindService.remove(crmInvitationRemind);
                        //$rootScope.showLoading();
                        promise.then(function () {
                            $scope.showInvitationListView();
                            //$rootScope.hideLoading();
                        }, function (error) {
                            //$rootScope.hideLoading();
                        });
                    }
                }
                );
            }


            /**
             * Shows the new invitationCommunication dialog.
             */
            function addInvitationCommunication(row) {
                //console.log('Starting creating new invitationCommunication.');
                $scope.CrmInvitationCommunicationVoForCreate = {};
                $scope.CrmInvitationCommunicationVoForCreate.personState = '2';
                $scope.CrmInvitationCommunicationVoForCreate.personType = '1';
                $scope.CrmInvitationCommunicationVoForCreate.personId = row.crm_student_id;

                $scope.CrmInvitationCommunicationVoForCreate.communicateTime = new Date().Format("yyyy-MM-dd");
                $scope.CrmInvitationCommunicationVoForCreate.nextTime = new Date().Format("yyyy-MM-dd");
                $scope.modalTitle = '添加沟通记录';
                $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/sos/invitationCommunication/modal.invitationCommunication.html', show: true });

            }

            $scope.addInvitationCommunication2 = addInvitationCommunication2;
            function addInvitationCommunication2(row) {
                //console.log('Starting creating new invitationCommunication.');
                $scope.CrmInvitationCommunicationVoForCreate = {};
                $scope.CrmInvitationCommunicationVoForCreate.personState = '2';
                $scope.CrmInvitationCommunicationVoForCreate.personType = '1';
                $scope.CrmInvitationCommunicationVoForCreate.personId = row.crm_student_id;

                $scope.CrmInvitationCommunicationVoForCreate.communicateTime = new Date().Format("yyyy-MM-dd");

                $scope.modalTitle = '添加沟通记录';
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/invitationCommunication/modal.invitationCommunication.html',
                    show: true
                });

            }

            /**
             * Saves the current invitationCommunication.
             */
            function saveInvitationCommunication() {
                if (new Date($scope.CrmInvitationCommunicationVoForCreate.communicateTime) > new Date($scope.CrmInvitationCommunicationVoForCreate.nextTime)) {
                    warningAlert("下次跟进时间不可小于沟通时间");

                } else {
                    if (typeof $scope.CrmInvitationCommunicationVoForCreate.id === 'undefined') {
                        var promise = InvitationCommunicationService.create($scope.CrmInvitationCommunicationVoForCreate);
                        promise.then(function (CrmInvitationCommunicationVoForCreate) {
                            successAlert("添加沟通成功");
                            // $scope.getList($scope.myCrmLeadsStudentListTableState);
                            $scope.showListView();
                            $scope.dataLoading = false;
                            $scope.getStudentBySome()
                            $scope.modal.hide();
                        }, function (error) {
                            $scope.dataLoading = false;
                        });

                    } else {
                        var promise = InvitationCommunicationService.update($scope.CrmInvitationCommunicationVoForCreate);
                        promise.then(function (CrmInvitationCommunicationVoForCreate) {
                            $scope.showInvitationListView();
                            $scope.dataLoading = false;
                            $scope.modal.hide();
                            $scope.getStudentBySome()
                        }, function (error) {
                            $scope.dataLoading = false;
                        });
                    }
                    _detail($scope.detailnew)
                    isLock()
                }
            }

            /**
             * Edit InvitationCommunication.
             * @param InvitationCommunication the InvitationCommunication to edit
             */
            // function editInvitationCommunication(crmInvitationCommunication) {
            //     //console.log('Editing invitationCommunication : ' + JSON.stringify(crmInvitationCommunication));
            //     $scope.CrmInvitationCommunicationVoForCreate = angular.copy(crmInvitationCommunication);
            //     if ($scope.CrmInvitationCommunicationVoForCreate.communicateTime) {
            //         $scope.CrmInvitationCommunicationVoForCreate.communicateTime = new Date($scope.CrmInvitationCommunicationVoForCreate.communicateTime).Format("yyyy-MM-dd");
            //     }
            //
            //     $scope.modalTitle = '更新邀约沟通';
            //     $scope.modal = $modal({
            //         scope: $scope,
            //         templateUrl: 'partials/sos/invitationCommunication/modal.invitationCommunication.html',
            //         show: true
            //     });
            //
            // }
            function editInvitationCommunication(crmInvitationCommunication) {
                crmInvitationCommunication.id = crmInvitationCommunication.referenceId
                crmInvitationCommunication.personId = crmInvitationCommunication.crm_student_id;
                $scope.CrmInvitationCommunicationVoForCreate = angular.copy(crmInvitationCommunication);
                $scope.CrmInvitationCommunicationVoForCreate.communicateTime = crmInvitationCommunication.communicate_time
                $scope.CrmInvitationCommunicationVoForCreate.nextTime = new Date(crmInvitationCommunication.nextTime).Format("yyyy-MM-dd");
                $scope.CrmInvitationCommunicationVoForCreate.communicateContent = crmInvitationCommunication.communicate_content
                $scope.modalTitle = '更新沟通记录';
                $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/sos/invitationCommunication/modal.invitationCommunication.html', show: true });

            }

            /**
             * Delete InvitationCommunication.
             * @param InvitationCommunication the InvitationCommunication to delete
             */
            // function deleteInvitationCommunication(crmInvitationCommunication) {
            //     //console.log('Deleting InvitationCommunication : ' + JSON.stringify(crmInvitationCommunication));
            //     SweetAlert.swal({
            //             title: "确定要删除吗？",
            //             type: "warning",
            //             showCancelButton: true,
            //             confirmButtonColor: '#fe9900',
            //             confirmButtonText: '确定',
            //             cancelButtonText: '取消',
            //             closeOnConfirm: true
            //         }, function (confirm) {
            //             if (confirm) {
            //                 var promise = InvitationCommunicationService.remove(crmInvitationCommunication);
            //                 //$rootScope.showLoading();
            //                 promise.then(function () {
            //                     $scope.showInvitationListView();
            //                     //$rootScope.hideLoading();
            //                 }, function (error) {
            //                     //$rootScope.hideLoading();
            //                 });
            //             }
            //         }
            //     );
            // }
            function deleteInvitationCommunication(crmInvitationCommunication) {
                //console.log('Deleting InvitationCommunication : ' + JSON.stringify(crmInvitationCommunication));
                crmInvitationCommunication.id = crmInvitationCommunication.referenceId
                SweetAlert.swal({
                    title: "确定要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        var promise = InvitationCommunicationService.remove(crmInvitationCommunication);
                        //$rootScope.showLoading();
                        promise.then(function () {
                            $scope.showInvitationListView();
                            $scope.getStudentBySome()
                            _detail($scope.detailnew)
                            isLock()
                            //$rootScope.hideLoading();
                        }, function (error) {
                            //$rootScope.hideLoading();
                        });
                    }
                }
                );
            }

            /**
             * Shows the new invitationDetail dialog.
             */
            function addInvitationDetail() {
                //console.log('Starting creating new invitationDetail.');
                $scope.CrmInvitationDetailVoForCreate = {};
                $scope.CrmInvitationDetailVoForCreate.personState = '1';
                $scope.CrmInvitationDetailVoForCreate.personType = '1';
                $scope.CrmInvitationDetailVoForCreate.personId = $scope.detail.crm_student_id;

                $scope.CrmInvitationDetailVoForCreate.isinside = '1';
                $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date();

                $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date().Format("yyyy-MM-dd h:mm");

                $scope.modalTitle = '添加邀约';
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/invitationDetail/modal.invitationDetail.html',
                    show: true
                });

            }
            $scope.mtStutas = 1
            function addInvitationDetailByList(row) {
                //console.log('Starting creating new invitationDetail.');
                $scope.CrmInvitationDetailVoForCreate = {};
                $scope.CrmInvitationDetailVoForCreate.personState = '1';
                $scope.CrmInvitationDetailVoForCreate.personType = '1';
                $scope.CrmInvitationDetailVoForCreate.personId = row.crm_student_id;

                $scope.CrmInvitationDetailVoForCreate.isinside = '1';
                $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date();

                $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date().Format("yyyy-MM-dd h:mm");

                $scope.modalTitle = '添加邀约';
                $scope.detail = row
                $scope.detail.type = 3
                /*已有学生不再试听排课新加字段 @李世明 2016-09-24 $scope.mtStutas = 1*/
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/invitationDetail/modal.invitationDetail.html',
                    show: true
                });

            }

            /**
             * 邀约成功试听排课
             */
            $scope.trialTimetable = trialTimetable
            function trialTimetable() {
                // 获取leads的可排课时信息
                CustomerStudentCourseService.getLeadsCoursePlan($scope.detail.phone).then(function (result) {

                    if (result.plan_available_num) {
                        $scope.plan_available_num = result.plan_available_num;
                        // 获取科目信息
                        CommonService.getSubjectIdSelect().then(function (result) {
                            $scope.omsSubject = result.data;
                            $scope.recordCoursePlanModal = $modal({
                                scope: $scope,
                                templateUrl: 'partials/sos/customer/modal.coursePlanInfo.html',
                                show: true,
                                backdrop: "static"
                            });
                        });
                    } else {
                    $scope.plan_available_num = 0;
                        $scope.alreadyPkList = result.list;
                        $scope.alreadyPkList.forEach(function (i, index) {
                            $scope.alreadyPkList[index].startDate = new Date(i.start_time).Format("yyyy/MM/dd hh/mm/ss");
                            $scope.alreadyPkList[index].endtDate = new Date(i.end_time).Format("yyyy/MM/dd hh/mm/ss");
                        })
                        $scope.alreadyPkListTitle = "试听课时已用完";
                        $scope.alreadyPkListModal = $modal({ scope: $scope, templateUrl: 'partials/sos/customer/modal.alreadyPkList.html', show: true, backdrop: "static" });
                    }


                })

                // CustomerStudentCourseService.getLeadsCoursePlan($scope.detail.phone).then(function (result) {
                //     $scope.CLeadsCourseTimeList = result.leadsCourseTime.list;
                //     if ($scope.CLeadsCourseTimeList[0] != undefined) {
                //         $scope.plan_available_num = $scope.CLeadsCourseTimeList[0].plan_available_num;
                //     } else {
                //         $scope.plan_available_num = 4;
                //     }
                //     // 获取科目信息
                //     CommonService.getSubjectIdSelect().then(function (result) {
                //         $scope.omsSubject = result.data;
                //         $scope.recordCoursePlanModal = $modal({
                //             scope: $scope,
                //             templateUrl: 'partials/sos/customer/modal.coursePlanInfo.html',
                //             show: true,
                //             backdrop: "static"
                //         });
                //     });
                // })
            }

            /**
             * Saves the current invitationDetail.
             */
            // function saveInvitationDetail() {
            //     //console.log('Saving the invitationDetail.');
            //     //$scope.dataLoading = true;
            //     if(new Date($scope.CrmInvitationDetailVoForCreate.receiveTime)<new Date())
            //     {
            //         warningAlert("预到访时间不能小于当天时间");
            //     }
            //     else{
            //         $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date($scope.CrmInvitationDetailVoForCreate.invitateTime);
            //         $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date($scope.CrmInvitationDetailVoForCreate.receiveTime);
            //         if (typeof $scope.CrmInvitationDetailVoForCreate.id === 'undefined') {
            //             $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date($scope.CrmInvitationDetailVoForCreate.receiveTime);
            //             var promise = InvitationDetailService.create($scope.CrmInvitationDetailVoForCreate);
            //             promise.then(function(CrmInvitationDetailVoForCreate) {
            //                 $scope.showInvitationListView();
            //                 $scope.dataLoading = false;
            //                 $scope.modal.hide();
            //                 var shiting = $rootScope.showPermissions("FreeListening");
            //                 if(shiting){
            //                     $scope.successTitle = '温馨提示'
            //                     $mtModal.moreModal({status:1,text:'添加邀约记录成功',scope:$scope})
            //                     /*$scope.modalTitle = '温馨提示';
            //                      $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/leads/modal.chooseleason.html', show: true});*/
            //                 }
            //                 if($scope.detail){
            //                     $scope.detail.state1Name = "已邀约";
            //                 }else{
            //                     $scope.showListView();
            //                 }
            //             }, function(error) {
            //                 $scope.dataLoading = false;
            //             });
            //         } else {
            //             var promise = InvitationDetailService.update($scope.CrmInvitationDetailVoForCreate);
            //             promise.then(function(CrmInvitationDetailVoForCreate) {
            //                 $scope.showInvitationListView();
            //                 $scope.dataLoading = false;
            //                 $scope.modal.hide();
            //             }, function(error) {
            //                 $scope.dataLoading = false;
            //             });
            //         }
            //     }
            // }
            $scope.zhifangbianjisubmitfalse = function zhifangbianjisubmitfalse() {
                $scope.zhifangbianjisubmit = false
            }
            $scope.laifangbianji5 = true;
            $scope.zhifangbianjisubmit = false
            function saveInvitationDetail(detail, type) {
                $scope.zhifangbianjisubmit = false;
                if (new Date($scope.CrmInvitationDetailVoForCreate.receiveTime) < new Date((new Date($scope.CrmInvitationDetailVoForCreate.invitateTime) / 1000 - 86400) * 1000)) {
                    warningAlert("预计到访时间不可小于邀约时间");
                    return false
                }
                if ($scope.one) {
                    if ($scope.CrmInvitationDetailVoForCreate.receiveTime && new Date($scope.CrmInvitationDetailVoForCreate.receiveTime) < new Date((new Date($scope.CrmInvitationDetailVoForCreate.invitateTime) / 1000 - 86400) * 1000)) {
                        // warningAlert("预到访时间不能小于当天时间");
                    }
                    else {
                        console.log($scope.CrmInvitationDetailVoForCreate.receiveTime)
                        $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date($scope.CrmInvitationDetailVoForCreate.invitateTime);
                        $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date($scope.CrmInvitationDetailVoForCreate.receiveTime);
                        console.log($scope.CrmInvitationDetailVoForCreate.receiveTime)
                        console.log($scope.CrmInvitationDetailVoForCreate)
                        if (typeof $scope.CrmInvitationDetailVoForCreate.id === 'undefined') {
                            $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date($scope.CrmInvitationDetailVoForCreate.receiveTime)
                            console.log($scope.CrmInvitationDetailVoForCreate.receiveTime)
                            console.log($scope.CrmInvitationDetailVoForCreate)
                            var promise = InvitationDetailService.create($scope.CrmInvitationDetailVoForCreate);
                            promise.then(function (CrmInvitationDetailVoForCreate) {
                                console.log(CrmInvitationDetailVoForCreate)
                                $scope.showInvitationListView();
                                $scope.dataLoading = false;
                                $scope.modal.hide();
                                var shiting = $rootScope.showPermissions("FreeListening");
                                // if(shiting){
                                //     $scope.modalTitle = '温馨提示';
                                //     $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/leads/modal.chooseleason.html', show: true});
                                // }
                                $scope.showListView();
                                if ($scope.__detail) {
                                    $scope._detail_($scope.__detail)
                                }
                            }, function (error) {
                                $scope.dataLoading = false;
                            });
                        } else {
                            var promise = InvitationDetailService.update($scope.CrmInvitationDetailVoForCreate);
                            promise.then(function (CrmInvitationDetailVoForCreate) {
                                $scope.showInvitationListView();
                                $scope.dataLoading = false;
                                $scope.modal.hide();
                            }, function (error) {
                                $scope.dataLoading = false;
                            });
                        }
                    }
                    _detail($scope.detailnew)
                    isLock()
                } else {
                    $scope.CrmInvitationDetailVoForCreate.type = 5;
                    //直访添加状态直接为1
                    $scope.CrmInvitationDetailVoForCreate.state = 1;
                    //后台参数不同，修改直访内容为要约内容
                    $scope.CrmInvitationDetailVoForCreate.viewTime = new Date($scope.CrmInvitationDetailVoForCreate.viewTime);
                    // $scope.CrmInvitationDetailVoForCreate.receiveTime =null;
                    if (typeof $scope.CrmInvitationDetailVoForCreate.id === 'undefined') {
                        $scope.CrmInvitationDetailVoForCreate.invitationContentType = $scope.CrmInvitationDetailVoForCreate.visitContentType
                        $scope.CrmInvitationDetailVoForCreate.receiveTime = null;
                        var promise = InvitationDetailService.create($scope.CrmInvitationDetailVoForCreate);
                        promise.then(function (CrmInvitationDetailVoForCreate) {
                            console.log($scope.CrmInvitationDetailVoForCreate)
                            $scope.showInvitationListView();

                            $scope.dataLoading = false;
                            $scope.modal.hide();
                            var shiting = $rootScope.showPermissions("FreeListening");
                            // if(shiting){
                            //     $scope.modalTitle = '温馨提示';
                            //     $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/leads/modal.chooseleason.html', show: true});
                            // }
                            $scope.showListView();
                            if ($scope.__detail) {
                                $scope._detail_($scope.__detail)
                            }
                        }, function (error) {
                            $scope.dataLoading = false;
                        });
                    } else {
                        var promise = InvitationDetailService.update($scope.CrmInvitationDetailVoForCreate);
                        promise.then(function (CrmInvitationDetailVoForCreate) {
                            console.log($scope.CrmInvitationDetailVoForCreate)
                            $scope.showInvitationListView();

                            $scope.dataLoading = false;
                            $scope.modal.hide();
                        }, function (error) {
                            $scope.dataLoading = false;
                        });
                    }

                }
                _detail($scope.detailnew)
                isLock()
            }
            var isLock = function () {
                $timeout(function () {
                    angular.element('.is-select').find('input,select,textarea').attr({ 'readonly': 'readonly', 'disabled': 'disabled' })
                    if ($scope._flag_ && (!$rootScope.showPermissions('LeadsEdit') || !$scope.canEditAndDelete($scope.detailForUpdate.belong_user_id))) {
                        angular.element('.btn-success').attr('disabled', 'disabled')
                    }
                }, 600)
            }
            /**
             * 确认到访
             */
            // function visit(row, state) {
            //     row.state = state;
            //     var promise = InvitationDetailService.visit(row);
            //     promise.then(function() {
            //     }, function(error) {
            //     });
            // }


            $scope.laifangyaoyuecheck = true;
            //默认的更新
            //默认的更新
            function zhifangyaoyueedit(detail) {
                detail.invitationContentType = detail.visitContentType
                var promise = InvitationDetailService.update(detail);
                promise.then(function (detail) {
                    $scope.showInvitationListView();
                    $scope.dataLoading = false;
                    $scope.modal.hide();
                }, function (error) {
                    $scope.dataLoading = false;
                });
            }
            //修改的保存2 是更新的功能
            function addrecevicheck(crmInvitationDetail) {
                console.log(new Date($scope.aaaaa.viewTime))
                console.log(new Date($scope.arrrepeat.receive_time))
                if (new Date($scope.aaaaa.viewTime) < new Date($scope.arrrepeat.receive_time)) {
                    warningAlert("到访时间不能小于邀约时间");
                    return false;
                }
                $scope.aaaaa = angular.copy(crmInvitationDetail);
                $scope.aaaaa.id = crmInvitationDetail.referenceId;
                $scope.aaaaa.personId = $scope.detailnew.crm_student_id
                $scope.aaaaa.type = 2;
                $scope.aaaaa.invitateTime = crmInvitationDetail.invitate_time
                $scope.aaaaa.invitationContentType = crmInvitationDetail.invitation_content_type;
                $scope.aaaaa.viewTime = new Date(crmInvitationDetail.viewTime)
                $scope.aaaaa.receiveTime = new Date(crmInvitationDetail.viewTime)
                if ($scope.flaglaifang.lai) {
                    $scope.aaaaa.state = 1
                } else {

                    $scope.aaaaa.state = 2
                }
                $scope.aaaaa.invitationContentType = Number(crmInvitationDetail.invitationContentType)
                console.log($scope.aaaaa)
                var promise = InvitationDetailService.visit($scope.aaaaa);
                promise.then(function () {

                    // zhifangyaoyueedit($scope.aaaaa);
                    $scope.flag = false;
                    _detail($scope.detailnew)
                    isLock()
                    $scope.laifangyaoyuecheck = true;
                    $scope.twozhifang = false;
                    $scope.modal.hide();
                }, function (error) {
                });

            }

            /**
             * Edit InvitationDetail.
             * @param InvitationDetail the InvitationDetail to edit
             */
            // function editInvitationDetail(crmInvitationDetail) {
            //     //console.log('Editing invitationDetail : ' + JSON.stringify(crmInvitationDetail));
            //     $scope.CrmInvitationDetailVoForCreate = angular.copy(crmInvitationDetail);
            //
            //     $scope.CrmInvitationDetailVoForCreate.isinside = '1';
            //     /*
            //      $scope.CrmInvitationRemindVoForCreate.remindTime = new Date($scope.CrmInvitationDetailVoForCreate.remindTime).Format("yyyy-MM-dd");*/
            //
            //     $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date($scope.CrmInvitationDetailVoForCreate.invitateTime).Format("yyyy-MM-dd hh:mm");
            //     $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date($scope.CrmInvitationDetailVoForCreate.receiveTime).Format("yyyy-MM-dd hh:mm");
            //
            //     $scope.modalTitle = '更新邀约';
            //     $scope.modal = $modal({
            //         scope: $scope,
            //         templateUrl: 'partials/sos/invitationDetail/modal.invitationDetailEdit.html',
            //         show: true
            //     });
            //
            // }
            function editInvitationDetail(crmInvitationDetail) {

                crmInvitationDetail.id = crmInvitationDetail.referenceId
                $scope.CrmInvitationDetailVoForCreate = angular.copy(crmInvitationDetail);
                $scope.CrmInvitationDetailVoForCreate.isinside = '1';

                $scope.modalTitle = '更新邀约';
                $scope.CrmInvitationDetailVoForCreate.invitationContentType = crmInvitationDetail.invitation_content_type;
                $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date(crmInvitationDetail.invitate_time).Format("yyyy-MM-dd");
                $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date(crmInvitationDetail.receive_time).Format("yyyy-MM-dd");
                $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/sos/invitationDetail/modal.invitationDetailEdit.html', show: true });

            }
            /**
             * Delete InvitationDetail.
             * @param InvitationDetail the InvitationDetail to delete
             */
            // function deleteInvitationDetail(crmInvitationDetail) {
            //     //console.log('Deleting InvitationDetail : ' + JSON.stringify(crmInvitationDetail));
            //     SweetAlert.swal({
            //             title: "确定要删除吗？",
            //             type: "warning",
            //             showCancelButton: true,
            //             confirmButtonColor: '#fe9900',
            //             confirmButtonText: '确定',
            //             cancelButtonText: '取消',
            //             closeOnConfirm: true
            //         }, function (confirm) {
            //             if (confirm) {
            //                 var promise = InvitationDetailService.remove(crmInvitationDetail);
            //                 //$rootScope.showLoading();
            //                 promise.then(function () {
            //                     $scope.showInvitationListView();
            //                     //$rootScope.hideLoading();
            //                 }, function (error) {
            //                     //$rootScope.hideLoading();
            //                 });
            //             }
            //         }
            //     );
            // }
            function deleteInvitationDetail(crmInvitationDetail) {
                crmInvitationDetail.id = crmInvitationDetail.referenceId
                SweetAlert.swal({
                    title: "确定要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {

                        InvitationDetailService.remove(crmInvitationDetail).then(function (result) {
                            if (crmInvitationDetail.type == 2) {

                                if (crmInvitationDetail.visit_state != 1) {

                                    $scope.twozhifang = false;
                                    $scope.twoflag = false;
                                    $scope.yaoyuefang = true;
                                    $scope.one = true;
                                    $scope.flag = false;
                                    $scope.laifangyaoyuecheck = true;
                                    $scope.zhifangbianjisubmit = false;
                                }
                            }
                            // if(){
                            //     $scope.twozhifang=false;
                            // }

                            _detail($scope.detailnew)
                            isLock()
                        });


                        // var promise = InvitationDetailService.remove(crmInvitationDetail);
                        // //$rootScope.showLoading();
                        // promise.then(function() {
                        //     $scope.showInvitationListView();
                        //     //$rootScope.hideLoading();
                        // }, function(error) {
                        //     //$rootScope.hideLoading();
                        // });
                    }
                }
                );
            }


            //是否展开查询更多
            $scope.selectMore = 0;
            $scope.changeSelectMore = changeSelectMore;
            $scope.studentType = [
                {
                    id: 1,
                    name: '线下'
                }, {
                    id: 2,
                    name: '线上'
                }
            ]
            /**
             * 改变查询更多按钮
             */
            $scope.selectMoreText = '更多查询条件'
            function changeSelectMore(flag) {
                if (arguments[1]) {
                    $scope.selectMore = !$scope.selectMore
                    $scope.selectMoreText = $scope.selectMore ? '收起查询条件' : '更多查询条件'
                } else {
                    $scope.selectMore = flag
                    $scope.selectMoreText = flag ? '收起查询条件' : '更多查询条件'
                }
                // angular.element('#body').scroll()
                setTimeout(function () {
                    resatList()
                }, 100)
            }

            $scope._showCol = false
            $scope.showCol = showCol
            $scope.selectCol = selectCol
            $scope.$editColCss = ''
            $scope.$editColList = [
                {
                    id: 0,
                    name: '卡号',
                    select: 1
                },
                //姓名要显示，所以跳过1
                {
                    id: 2,
                    name: '性别',
                    select: 0
                },
                //电话要显示，所以跳过3
                {
                    id: 4,
                    name: '学员异常',
                    select: 1
                },
                {
                    id: 5,
                    name: '年级',
                    select: 1
                },
                {
                    id: 6,
                    name: '公立学校',
                    select: 1
                },
                {
                    id: 7,
                    name: '学员类型',
                    select: 0
                },
                {
                    id: 8,
                    name: '渠道来源',
                    select: 0
                },
                {
                    id: 9,
                    name: '来源详情',
                    select: 0
                },
                //在读状态要显示，所以跳过10
                {
                    id: 10,
                    name: '上次沟通',
                    select: 1
                },
                {
                    id: 11,
                    name: '下次回访时间',
                    select: 0
                },
                {
                    id: 12,
                    name: '上次消课',
                    select: 1
                },
                {
                    id: 13,
                    name: '下次排课',
                    select: 1
                },
                {
                    id: 14,
                    name: '可排课订单',
                    select: 1
                },
                {
                    id: 15,
                    name: '剩余学费',
                    select: 1
                },
                {
                    id: 16,
                    name: '可排学费',
                    select: 1
                },
                {
                    id: 17,
                    name: '已上/已排课时',
                    select: 1
                },
                {
                    id: 18,
                    name: '所属校区',
                    select: 0
                },
                {
                    id: 19,
                    name: '所属人',
                    select: 1
                },
                {
                    id: 20,
                    name: '创建人',
                    select: 0
                },
                {
                    id: 21,
                    name: '推荐人',
                    select: 0
                }/*,
                 {
                 id: 24,
                 name: '电子账户余额',
                 select: 1
                 },
                 {
                 id: 25,
                 name: '已消金额',
                 select: 1
                 }*/
            ]
            $scope.colListLength = $scope.$editColList.length;
            //  当前状态是否全选
            $scope.isAll = false
            //  将配置项保存到h5本地存储
            if (localStorage['$editColList'] == 'undefined' || !localStorage['$editColList']) {
                localSave($scope.$editColList)
            }

            // function _isNewDateCol() {
            //     var newData = JSON.parse(localStorage['$editColList'])//剩余学费
            //     var obj = newData.find(function (obj) {
            //         return obj.name==='剩余学费'
            //     })
            //     if(obj){
            //         localSave($scope.$editColList)
            //     }
            // }
            // try{
            //     _isNewDateCol()
            // }catch(e){
            //
            // }
            /**
             * 保存到本地
             * @param datas
             */
            function localSave(datas) {
                localStorage.setItem('$editColList', JSON.stringify(datas))
            }

            function initCol() {
                $scope.lEditColList = JSON.parse(localStorage['$editColList'])
                var selectMax = 0
                for (var li = 0; li < $scope.colListLength; li++) {
                    var id = $scope.lEditColList[li].id,
                        isShow = $scope.lEditColList[li].select
                    if (isShow) {
                        selectMax = selectMax + 1
                    }
                    if (li === $scope.colListLength - 1) {
                        $scope.isAll = selectMax === $scope.colListLength ? true : false
                    }
                    (function (index, isShow) {
                        editCol(index, isShow)
                    })(id, isShow)
                }
            }

            /**
             * 打开或关闭编辑列
             * @param arg
             */
            function showCol(arg) {
                if (arg) {
                    reastPosition()
                }
                $scope._showCol = arg
            }

            $scope.reastPosition = reastPosition
            window.reastPosition = reastPosition
            function reastPosition() {
                //  获取列表的位置
                var $mtList = angular.element('.mt-list').eq(0),
                    //  获取选中框
                    $editCol = angular.element('.edit-col').eq(0),
                    // _top = $mtList.offset().top - 20 + 'px'
                    _top = $mtList.offset().top - 20 + 'px'
                window._top_ = _top
                //  重置选择框位置
                $scope.$editColCss = {
                    'top': _top
                }
            }

            /**
             * 选择显示
             * @param index
             * 对应的下标
             */
            function selectCol(index) {
                var selectMax = 0
                $scope.lEditColList[index].select = $scope.lEditColList[index].select ? 0 : 1
                localSave($scope.lEditColList)
                editCol($scope.lEditColList[index].id, $scope.lEditColList[index].select)
                for (var li = 0; li < $scope.colListLength; li++) {
                    var isShow = $scope.lEditColList[li].select
                    if (isShow) {
                        selectMax = selectMax + 1
                    }
                    if (li === $scope.colListLength - 1) {
                        $scope.isAll = selectMax === $scope.colListLength ? true : false
                        // localSave($scope.lEditColList)
                    }
                }
            }

            /**
             * 全选
             */
            $scope.selectColAll = selectColAll
            function selectColAll() {
                for (var i = 0; i < $scope.colListLength; i++) {
                    (function (i) {
                        if ($scope.isAll) {
                            $scope.lEditColList[i].select = 0
                            editCol($scope.lEditColList[i].id, 0)
                            if (i === $scope.colListLength - 1) {
                                $scope.isAll = false
                                localSave($scope.lEditColList)
                            }
                        } else {
                            $scope.lEditColList[i].select = 1
                            editCol($scope.lEditColList[i].id, 1)
                            if (i === $scope.colListLength - 1) {
                                $scope.isAll = true
                                localSave($scope.lEditColList)
                            }
                        }
                        // }
                        // editCol($scope.lEditColList[i].id,$scope.lEditColList[i].select)
                    })(i)
                }
            }

            function editCol(index, isShow) {
                var $isShowCol = angular.element('.isShowCol').eq(0),
                    $tr = $isShowCol.find('tbody tr'),
                    max = $tr.length - 1
                if (isShow) {
                    $isShowCol.find('tr th').eq(index).removeClass('hide')
                    hideOrShow()
                } else {
                    $isShowCol.find('tr th').eq(index).addClass('hide')
                    hideOrShow()
                }
                function hideOrShow() {
                    for (var i = 0; i < max; i++) {
                        if (isShow) {
                            $tr[i].cells[index].hidden = false//.removeClass('hide')//.find('td').eq(index)
                        } else {
                            $tr[i].cells[index].hidden = true//.addClass('hide')
                        }
                    }
                }
            }

            /**
             * 恢复编辑列
             */
            $scope.reastCol = reastCol
            function reastCol() {
                $scope.lEditColList = $scope.$editColList
                localSave($scope.lEditColList)
                initCol()
            }
            /*
             angular.element(window).on('scroll',function () {
             console.log(1)
             reastPosition()
             });*/
            (function init() {
                if ($rootScope.currentUser.position_id == 79 || $rootScope.currentUser.position_id == 86 || $rootScope.currentUser.position_id == 86) {
                    $rootScope._dataCount = true
                }
                else {
                    $rootScope._dataCount = false
                }
                if ($location.url().indexOf('/customer_group') != -1) {
                    if (check_null($routeParams.group_id)) {
                        //查询一对多
                        var tableState = {};
                        tableState.pagination = {};
                        tableState.search = {};
                        $scope.myCrmCustomerStudentGroupFilter.id = $routeParams.group_id;
                        $scope.getMyCrmCustomerStudentGroupListAndShowDetailView(tableState);
                    }
                }
                if (check_null($routeParams.type)) {

                }
                if (check_null($routeParams.student_id)) {
                    if ($routeParams.student_id == 'add') {//分配学员
                        $scope.showAllotView();
                    } else {
                        if ($routeParams.type == 'call_phone') {
                            //得到详情
                            //弹出通话空控制台
                        } else {
                            $scope.viewCrmCustomerStudent({//控制台跳转到详情页
                                crm_student_id: $routeParams.student_id
                            })
                        }
                    }
                    // initCol()
                }
                $timeout(function () {
                    $("[data-toggle='tooltip']").tooltip();
                }, 1000);
            })();

            /**
             * 选择交费情况 全部缴费、部分交费、未缴费 fanl
             */
            $scope.seletPayCondition = function (type) {
                if (type == 1) {
                    $scope.PayDisabled = true;
                    var realTotalAmount = $("#realTotalAmount").val();
                    var consumeAccountBalance = $("#consumeAccountBalance").val();
                    $scope.order.realPayAmount = realTotalAmount - consumeAccountBalance;
                } else if (type == 2) {
                    $scope.PayDisabled = false;
                    $scope.order.realPayAmount = "";
                } else if (type == 3) {
                    $scope.PayDisabled = true;
                    $scope.order.realPayAmount = 0;
                }
                $("#payType" + type).addClass("active").siblings().removeClass("active");
            };
            /**
             * 获取订单的业绩分配比例
             */
            $scope.getOrderAchievementRatios = function getOrderAchievementRatios() {
                OrderService.getOrderAchievementRatios($scope.order.id, 0).then(function (result) {
                    $scope.order.achievementRatios = result.data;
                    $scope.orderDetailTopUp.achievementRatios = result.data;
                    if ($scope.order.achievementRatios.length > 0) {
                        for (var i = 0; i < $scope.order.achievementRatios.length; i++) {
                            $scope.order.achievementRatios[i].position = {};
                            $scope.order.achievementRatios[i].position.id = $scope.order.achievementRatios[i].positionId;
                            $scope.order.achievementRatios[i].position.postionName = $scope.order.achievementRatios[i].positionName;

                            $scope.orderDetailTopUp.achievementRatios[i].position = {};
                            $scope.orderDetailTopUp.achievementRatios[i].position.id = $scope.order.achievementRatios[i].positionId;
                            $scope.orderDetailTopUp.achievementRatios[i].position.postionName = $scope.order.achievementRatios[i].positionName;
                        }
                    }
                })
            }
            /**
             * 获取试听教师、授课教师列表
             */
            $scope.getOrderRelationTeachers = function getOrderRelationTeachers() {
                OrderService.getOrderAchievementRatios($scope.order.id, 3).then(function (result) {
                    $scope.order.orderRelationTeachers = result.data;
                    if ($scope.order.orderRelationTeachers.length > 0) {
                        for (var i = 0; i < $scope.order.orderRelationTeachers.length; i++) {
                            $scope.order.orderRelationTeachers[i].position = {};
                            $scope.order.orderRelationTeachers[i].position.id = $scope.order.orderRelationTeachers[i].positionId;
                            $scope.order.orderRelationTeachers[i].position.postionName = $scope.order.orderRelationTeachers[i].positionName;
                        }
                    }
                })
            }

            /**
             * 订单详情弹窗
             */
            $scope.showCustomerOrdersView = function (row) {
                var _row = angular.copy(row);
                $scope.detail = _row;
                $scope.existClassModal = $mtModal.modal('partials/sos/customer/modal.customerOrder.html?' + new Date().getTime(), $scope);
            }
            $scope.getCustomerOrders = function (tableState) {
                $scope.customerOrderTabTableState = tableState;
                if ($scope.detail) {
                    $scope.isNormalOrderLoading = true;
                    $scope.orderFlag = 7;
                    $scope.pagination = tableState.pagination;
                    $scope.start = $scope.pagination.start || 0;
                    $scope.number = $scope.pagination.number || 10;
                    OrderService.getPage($scope.start, $scope.number, $scope.orderFlag, { 'crmStudentId': $scope.detail.crm_student_id, 'canCoursePlan': true }).then(function (result) {
                        $scope.customerOrders = result.data;
                        tableState.pagination.numberOfPages = result.numberOfPages;
                    });
                }
            }
            $scope.changegengduo = function changegengduo() {
                $scope.chakangengduotag = !$scope.chakangengduotag
                if ($scope.chakangengduotag) {
                    $scope.chakangengduo = '收起更多信息'
                    $scope.apprealaifang = true;
                } else {
                    $scope.chakangengduo = '展开更多信息'
                    $scope.apprealaifang = false;
                }
            }
            $scope.getDetail = function (detail) {
                $scope.detailnew = detail;
                $scope.apprealaifang = false;
                $scope.chakangengduotag = false;
                $scope.chakangengduo = '展开更多信息'
                var __detail = angular.copy(detail)
                $rootScope.sustormerstustail = true;
                var v = '?v=' + Date.now()
                /*学员详情开始========================================================*/
                $scope.stuTabs = StuDetail.init($scope, [
                    // {
                    //     title: '基本信息',   //  tabel切换拦标题
                    //     clickFun: function () {
                    //         _detail(__detail)
                    //     },
                    //     url:'partials/stu.detail/main/tpl/user/info.html'+v
                    // },
                    // {
                    //     title: '家庭信息',
                    //     clickFun: function () {
                    //         _detail(__detail)
                    //         CommonService.getProvinceSelect().then(function (result) {
                    //             StuDetail.scope.provinceList = result.data;
                    //         });
                    //     },
                    //     url:'partials/stu.detail/main/tpl/family.info.html'+v
                    // },
                    {
                        title: '订单信息',
                        clickFun: '',
                        url: 'partials/stu.detail/main/tpl/user/order.info.html' + v
                    },
                    {
                        title: '排课记录',
                        clickFun: '',
                        url: 'partials/stu.detail/main/tpl/recording.html' + v
                    }
                ])
                $scope.mtSrc = 'partials/stu.detail/main/index.html' + v
                $mtModal.moreModalHtml({
                    scope: $scope, width: '1150px', hasNext: function () {
                        var _obj = $scope.stuTabs.find(function (stu) {
                            return (stu.title == '记录管理' || stu.title == '订单信息') && stu.select
                        })
                        if (_obj) {
                            $scope.mtResultModal.hide()
                            return false
                        }
                        _setReadonlyPropo()
                        SweetAlert.swal({
                            title: '确定更新吗？',
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            closeOnConfirm: true
                        }, function (config) {
                            if (config)
                                $scope.submitCustomerStudent(1)
                        })
                    }
                })
                /*学员详情结束========================================================*/
                _detail(detail)
            }
            function _detail(detail) {

                $scope.laifangtabhide = true;
                $scope.perfectTime = detail.receiveTime
                $scope.detail = angular.copy(detail)
                LeadsStudentService.detail(detail).then(function (result) {
                    $scope.detailForUpdate = result;
                    for (var i = 0; i < $scope.detailForUpdate.growthList.length; i++) {
                        if ($scope.detailForUpdate.growthList[i].type == 2) {
                            if ($scope.detailForUpdate.growthList[i].visit_state == 0) {
                                $scope.arrrepeat = $scope.detailForUpdate.growthList[i]

                                console.log($scope.arrrepeat)

                                $scope.laifangtabhide = false
                                $scope.oneflg = false;
                                $scope.flag = true;
                                $scope.laifangyaoyuecheck = false;
                                $scope.aaaaa = angular.copy($scope.detailForUpdate.growthList[i])
                                $scope.twoflag = true;
                                $scope.twozhifang = true;
                                break
                            } else {
                                $scope.arrrepeat = null
                            }

                        }
                    }
                    //无数据的时候初始化
                    if ($scope.detailForUpdate.growthList.length < 1) {

                        $scope.onclicktabone();
                        $scope.arrrepeat = {}
                    }
                    if ($scope.detailForUpdate.birthDate) {

                        $scope.detailForUpdate.birthDate = new Date($scope.detailForUpdate.birthDate)
                        $scope.detailForUpdate.birthDate = [$scope.detailForUpdate.birthDate.getFullYear(), ($scope.detailForUpdate.birthDate.getMonth() + 1), $scope.detailForUpdate.birthDate.getDate()].join('-')
                    }

                    var preGradeId = $scope.detailForUpdate.grade_id;
                    $scope.preStudentGradeId = preGradeId;
                    if ($scope.detailForUpdate.nextVisitAt) {
                        $scope.detailForUpdate.nextVisitAt = new Date($scope.detailForUpdate.nextVisitAt).Format("yyyy-MM-dd hh:mm:ss");
                    }
                    if ($scope.detailForUpdate.followUpAt) {
                        $scope.detailForUpdate.followUpAt = new Date($scope.detailForUpdate.followUpAt).Format("yyyy-MM-dd");
                    }
                    if ($scope.detailForUpdate.receiveTime) {
                        $scope.detailForUpdate.receiveTime = new Date($scope.detailForUpdate.receiveTime).Format("yyyy-MM-dd");

                    }
                    //刷新列表
                    /*$scope.myCrmLeadsStudentListTableState.pagination.start = 0;
                     $scope.getList($scope.myCrmLeadsStudentListTableState);*/
                    if (result.province_code) {

                        CommonService.getCitySelect(result.province_code).then(function (result) {
                            $scope.cityList = result.data;
                        });
                    }
                    if (result.city_code) {

                        CommonService.getAreaSelect(result.city_code).then(function (result) {
                            $scope.areaList = result.data;
                        });
                    }

                    CommonService.getState(result.state_id_1).then(function (result) {

                        $scope.state2List = result.data;
                    });
                    CommonService.getMediaChannel(result.media_channel_id_1).then(function (result) {

                        $scope.mediaChannel2List = result.data;
                    });

                    CommonService.getMediaChannel(result.media_channel_id_2).then(function (result) {

                        $scope.mediaChannel3List = result.data;
                    });

                })
                //    以上2结束

            }

            // function _detail(detail) {
            //     CustomerStudentService.detail(detail).then(function (result) {
            //         //console.dir(result);
            //         $scope.detailForUpdate = result;
            //         if($scope.detailForUpdate.birthDate){
            //             $scope.detailForUpdate.birthDate = new Date($scope.detailForUpdate.birthDate)
            //             $scope.detailForUpdate.birthDate = [$scope.detailForUpdate.birthDate.getFullYear(),($scope.detailForUpdate.birthDate.getMonth()+1),$scope.detailForUpdate.birthDate.getDate()].join('-')
            //         }
            //         $scope.detail = angular.copy(result)
            //         //存储之前的年级id
            //         var preGradeId = $scope.detailForUpdate.grade_id;
            //         $scope.preStudentGradeId = preGradeId;
            //         if ($scope.detailForUpdate.nextVisitAt) {
            //             $scope.detailForUpdate.nextVisitAt = new Date($scope.detailForUpdate.nextVisitAt).Format("yyyy-MM-dd hh:mm:ss");
            //         }
            //
            //
            //         if (result.province_code) {
            //             CommonService.getCitySelect(result.province_code).then(function (result) {
            //                 $scope.cityList = result.data;
            //             });
            //         }
            //         if (result.city_code) {
            //             CommonService.getAreaSelect(result.city_code).then(function (result) {
            //                 $scope.areaList = result.data;
            //             });
            //         }
            //
            //         CommonService.getState(result.state_id_1).then(function (result) {
            //             $scope.state2List = result.data;
            //         });
            //         CommonService.getMediaChannel(result.media_channel_id_1).then(function (result) {
            //             $scope.mediaChannel2List = result.data;
            //         });
            //     })
            // }
            var _setReadonlyPropo = function () {
                var birthList = angular.element('.modal-body').find('[name="birthDate"]'),
                    birthDate = angular.element('.modal-body').find('[name="birthDate"]').val()
                /*if(birthList.length>1){
                 for(var i = 0 , len = birthList.length ; i< len ; i++){
                 if(birthList[i].value){
                 birthDate = birthList[i].value
                 break;
                 }
                 }
                 }*/
                $scope._birthDate = birthDate
                $scope.detailForUpdate.birthDate = new Date(birthDate)
            }
            //     TODO:活动消课                     ========================================================
            $scope.activeConsumers = function (detail, type) {
                $scope.detail = angular.copy(detail)
                $scope.submit = type
                $scope.activeModal = $mtModal.modal('partials/active/modal/main.html', $scope)
            }
            /**
             * 学生结转调用的js方法
             */
            $scope.showCarryForwardOrders = function (row) {
                $scope.order = { 'orderCourses': [], 'crmStudentId': row.crm_student_id };
                $scope.modalTitle = '结转';
                $scope.detail = row;
                $scope.addCarryforwardOrderModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/addCarryforward.html',
                    show: true
                });
                $scope.getCustomerOrderTransferAvailablesByList(row);
            }
        }
    ])
    .controller('SearchSchoolAreasCtrl', ['$scope', '$modal', '$rootScope', 'SweetAlert', 'CommonService',
        function ($scope, $modal, $rootScope, SweetAlert, CommonService) {
            var oThis = this;
            $scope.selectedSchoolArea = function (row) {
                $scope.detailForUpdate.school_name = row.dName;
                $scope.detailForUpdate.schoolId = row.uid;
                $scope.modalSelectTeacher.hide();
            };
            $scope.callSchoolAreas = function (tableState) {
                $scope.schoolMasterTableState = tableState;
                $scope.isSchoolMasterLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                CommonService.getAllSchoolMaster(start, number, tableState, $scope.schoolAreasFilter).then(function (result) {
                    //console.dir(result.data);
                    //$scope.getAllSelected();
                    $scope.schoolAreas = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.schoolMasterTableState = tableState;

                    $scope.isSchoolMasterLoading = false;
                });
            }


        }])

    ;
angular.element('#body').bind('scroll', function () {
    var $this = angular.element('.edit-col'),
        $select = angular.element('.select-option'),
        $table = angular.element('.mt-list .mt-scroll')
    if ($this.length) {
        reastPosition()
        $this.css({ 'top': _top_ })
    } if ($select.length) {
        var __width = $select.width() + 2 + 'px',
            //  获取input元素的高度用于构造下拉框
            __height = $select.parent('.option').height() + 'px',
            //  获取input距离top的距离
            __top = $select.parent('.option').offset().top + parseInt(__height, 10) - 7 + 'px',
            //  获取input距离left的距离
            __left = $select.parent('.option').offset().left + 'px'
        $select.css({ 'top': __top, 'left': __left })
    } if ($table.length) {
        $table.find('th:last').css({ 'top': $table.find('th:first').offset().top })
        var _table = $table.find('tr'),
            _tlength = _table.length
        for (var i = 1; i < _tlength; i++) {
            _table.eq(i).find('td:last').css({ 'top': _table.eq(i).offset().top })
        }
    }
})
function resatList() {
    var ele = angular.element('#body').scroll()
}
