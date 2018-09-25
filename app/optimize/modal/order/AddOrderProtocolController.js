/**
 * Created by 李世明 on 2016/11/2 0002.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:买课程，修改订单，审核，退费OrderOperatingController
 */
'use strict';
angular.module('ywsApp').controller('AddOrderProtocolController', ['$scope', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'CommonService', 'AuthenticationService', 'ClassManagementService', 'CustomerStudentCourseService', 'LeadsStudentService', 'CrmChargingSchemeService', 'CustomerStudentService', 'localStorageService',
    function ($scope, $modal, $rootScope, SweetAlert, OrderService, CommonService, AuthenticationService, ClassManagementService, CustomerStudentCourseService, LeadsStudentService, CrmChargingSchemeService, CustomerStudentService, localStorageService) {

        $scope.batchTotalPrice = batchTotalPrice;
        $scope.batchRealAmount = batchRealAmount;

        function batchTotalPrice() {
            var totalPrice = 0;
            for (var i = 0; i < $scope.orders.length; i++) {
                if ($scope.orders[i].orderCategory == 1) {
                    totalPrice += $scope.orders[i].totalPrice;
                } else {
                    totalPrice += $scope.orders[i].recharge.totalPrice;
                }
            }
            for (var i = 0; i < $scope.orderChildList.length; i++) {
                totalPrice += $scope.orderChildList[i].totalPrice;
            }
            for (var i = 0; i < $scope.orderRechargeChildList.length; i++) {
                totalPrice += $scope.orderRechargeChildList[i].recharge.totalPrice;
            }
            return totalPrice;
        }

        function batchRealAmount() {
            var totalPrice = 0;
            for (var i = 0; i < $scope.orders.length; i++) {
                if ($scope.orders[i].orderCategory == 1) {
                    totalPrice += $scope.orders[i].realTotalAmount;
                } else {
                    totalPrice += $scope.orders[i].recharge.totalPrice - $scope.orders[i].recharge.privilegeAmount;
                }
            }
            for (var i = 0; i < $scope.orderChildList.length; i++) {
                totalPrice += $scope.orderChildList[i].realTotalAmount;
            }
            for (var i = 0; i < $scope.orderRechargeChildList.length; i++) {
                totalPrice += $scope.orderRechargeChildList[i].recharge.totalPrice - $scope.orderRechargeChildList[i].recharge.privilegeAmount
            }
            return totalPrice;
        }

        $scope.orderChildList = [];
        $scope.orderRechargeChildList = [];
        function initOrder() {
            //课时订单
            $scope.order = {};
            $scope.order.orderCourses = [];
            $scope.order.crmorderPayments = [];
            //储值订单

            $scope.orderRecharge = {};
            $scope.orderRecharge.recharge = {};
            $scope.allChildOrder = [];


            $scope.orderTypeSelect = [{ name: '新签', id: 1 }, { name: '续费', id: 2 }, { name: '返课', id: 3 }, { name: '推荐', id: 5 }, { name: '赠课', id: 8 }];
            $scope.isCourseAuditionSelect = [{ name: '是', id: 1 }, { name: '否', id: 0 }];
            if ($scope.orderRecharge.recharge == undefined) {
                $scope.orderRecharge.recharge = {};
            }
            $scope.orderRecharge.recharge.orderCourses = [];
            // 定义业绩的对象
            $scope.orderRecharge.recharge.achievementRatios = [];
            $scope.orderRecharge.recharge.achievementRatio = {};
            // 定义交费记录数组
            $scope.orderRecharge.recharge.crmorderPayments = [];
            $scope.orderRecharge.ratioInvalid = false;
            $scope.orderRecharge.recharge.totalOriginalNum = 0;
            $scope.orderRecharge.recharge.totalPrice = 0;
            $scope.orderRecharge.recharge.originalNum = 0;
            $scope.orderRecharge.rechargeNoExist = false;


            // $scope.orderRecharge.recharge.name = $scope.orderRecharge.name;
            // $scope.orderRecharge.recharge.accountBalance = $scope.orderRecharge.accountBalance;
            $scope.orderRecharge.recharge.totalPrice = $scope.orderRecharge.totalPrice;
            $scope.orderRecharge.recharge.gradeId = $scope.orderRecharge.gradeId;
            // $scope.orderRecharge.recharge.crmStudentId = $scope.orderRecharge.crmStudentId;
            $scope.orderRecharge.crmorderPayments = [];

            if ($scope.orders[0].orderCategory == 1) {
                $scope.orderRecharge.recharge.gradeId = $scope.orders[0].gradeId;
            }
            if ($scope.orders[0].recharge.orderCategory == 3) {
                $scope.orderRecharge.recharge.gradeId = $scope.orders[0].recharge.gradeId;
            }
        }
        initOrder()


        $scope.$on("arrangeCourse", function (event, rows) {
            if (rows.length > 50) {
                SweetAlert.swal("课程最多50条");
                return;
            }
            if ($scope.order.orderCourses && $scope.order.orderCourses.length > 0) {
                if (rows.length + $scope.order.orderCourses.length > 50) {
                    SweetAlert.swal("课程最多50条");
                    return;
                }
            }

            if ($scope.order.orderCourses && $scope.order.orderCourses.length > 0) {
                var temGradeId = $scope.order.orderCourses[0].gradeId;
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].gradeId != temGradeId) {
                        SweetAlert.swal("课程年级不一致");
                        return;
                    }
                }
            }

            if ($scope.order.orderCourses && $scope.order.orderCourses.length > 0) {
                for (var i = 0; i < $scope.order.orderCourses.length; i++) {
                    for (var j = 0; j < rows.length; j++) {
                        if ($scope.order.orderCourses[i].courseId == rows[j].courseId && $scope.order.orderCourses[i].subjectId == rows[j].subjectId) {
                            SweetAlert.swal($scope.order.orderCourses[i].courseTypeName + "已存在列表中");
                            return;
                        }
                    }
                }
            }

            for (var i = 0; i < rows.length; i++) {
                $scope.order.orderCourses.push(rows[i]);
            }
        });

        function resetOrderProtocol() {
            $scope.order.orderCourses = [];
            $scope.order.hours = '';
            $scope.order.minite = '';
            $scope.order.totalOriginalTimes = '';
            $scope.order.totalPrice = '';
            $scope.order.realTotalAmount = '';
            $scope.order.privilegeAmount = '';
            $scope.order.privilegeRatio = '';
            $scope.order.crmorderPayments = [];
        }



        $scope.beforeAddProtocol = function beforeSaveOrder() {
            if ($scope.order.constructor === Object && $scope.order.orderCourses && $scope.order.orderCourses.length > 0) {
                $scope.order.realTotalAmount = (($scope.order.totalPrice * 100) - ($scope.order.privilegeAmount * 100)) / 100;
                $scope.order.payDueAmount = (($scope.order.totalPrice * 100) - ($scope.order.privilegeAmount * 100) - ($scope.order.realPayAmount * 100)) / 100;
                if ($scope.order.orderStatus != 14 && $scope.order.payDueAmount < 0) {
                    SweetAlert.swal('订单尾款不能为负数');
                    return;
                }
                $scope.order.orderCategory = 1;
                $scope.orderChildList.push(angular.copy($scope.order));
                $scope.order = {};
            }

            if ($scope.orderRecharge.recharge.constructor === Object && $scope.orderRecharge.recharge.orderChargingName && $scope.orderRecharge.recharge.name != 0) {
                $scope.orderRecharge.recharge.realTotalAmount = $scope.orderRecharge.recharge.totalPrice - $scope.orderRecharge.recharge.privilegeAmount;
                $scope.orderRecharge.recharge.payDueAmount = $scope.orderRecharge.recharge.totalPrice - $scope.orderRecharge.recharge.privilegeAmount - $scope.orderRecharge.recharge.realPayAmount;
                if ($scope.orderRecharge.orderStatus != 14 && $scope.orderRecharge.payDueAmount < 0) {
                    SweetAlert.swal('订单尾款不能为负数');
                    return;
                }
                var orderCourse = {
                    'additionalAmount': $scope.orderRecharge.recharge.totalPrice,
                    'avaliableAmount': $scope.orderRecharge.recharge.totalPrice
                };
                $scope.orderRecharge.recharge.orderCourses.push(orderCourse);
                $scope.orderRecharge.recharge.orderCategory = 3;
                $scope.orderRecharge.orderCategory = 3;
                $scope.orderRechargeChildList.push(angular.copy($scope.orderRecharge));
                $scope.orderRecharge.recharge = {}
            }
            SweetAlert.swal({
                title: "是否有附加的优惠或赠课协议？",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: '有, 继续添加',
                cancelButtonText: '没有，确认提交',
                closeOnConfirm: true
            }, function (confirm) {
                if (confirm) {
                    $scope.modal.hide();
                    resetOrderProtocol();
                    initOrder();
                } else {

                    $scope.allChildOrder = $scope.orderChildList.concat($scope.orderRechargeChildList);
                    $scope.allChildOrder.forEach(function (i, index) {
                        var obj = angular.copy($scope.orders[0]);
                        if (obj.orderCategory == 1) {
                            if (i.orderCategory == 3) {
                                var obj1 = angular.copy(obj);
                                obj1.specialOrderType = i.specialOrderType;
                                obj1.specialOrderClassType = i.specialOrderClassType;
                                obj1.specialOrderRequirements = i.specialOrderRequirements;
                                i.recharge.achievementRatios = obj1.achievementRatios;
                                i.recharge.achievementRatio = obj1.achievementRatio;
                                i.recharge.crmorderPayments = i.crmorderPayments;
                                for (var j in i.recharge) {
                                    obj1[j] = i.recharge[j];
                                }
                                i.recharge = obj1;
                                $scope.allChildOrder[index] = i;
                            } else {
                                var obj2 = angular.copy(obj);
                                for (var j in i) {
                                    obj2[j] = i[j];
                                }
                                $scope.allChildOrder[index] = obj2;
                            }
                        } else if (obj.orderCategory == 3) {
                            if (i.orderCategory == 3) {
                                debugger;
                                var obj3 = angular.copy(obj);
                                obj3.specialOrderType = i.specialOrderType;
                                obj3.specialOrderClassType = i.specialOrderClassType;
                                obj3.specialOrderRequirements = i.specialOrderRequirements;
                                // i.achievementRatio = obj3.recharge.achievementRatio;
                                // i.achievementRatios = obj3.recharge.achievementRatios;
                                // i.recharge.achievementRatio = obj3.recharge.achievementRatio;
                                // i.recharge.achievementRatios = obj3.recharge.achievementRatios;
                                i.achievementRatio = obj3.achievementRatio;
                                i.achievementRatios = obj3.achievementRatios;
                                i.recharge.achievementRatio = obj3.achievementRatio;
                                i.recharge.achievementRatios = obj3.achievementRatios;
                                for (var j in i.recharge) {
                                    obj3.recharge[j] = i.recharge[j];
                                }
                                obj3.recharge.orderRelationTeachers = obj3.orderRelationTeachers;
                                // i.orderRelationTeachers = obj3.orderRelationTeachers;
                                for (var k in obj3.recharge) {
                                    if (k != "recharge") {
                                        obj3[k] = obj3.recharge[k];
                                    }
                                }
                                $scope.allChildOrder[index] = obj3;
                            } else {
                                var obj4 = angular.copy(obj);
                                for (var j in i) {
                                    obj4.recharge[j] = i[j];
                                    if (j != 'recharge') {
                                        obj4[j] = i[j];
                                    }
                                    obj4.orderType = obj4.recharge.orderType;
                                }
                                obj4.orderRule = obj4.recharge.orderRule;
                                obj4.orderCategory = i.orderCategory;
                                $scope.allChildOrder[index] = obj4;
                            }
                        }

                    })
                    $scope.orders = $scope.orders.concat($scope.allChildOrder);
                    console.log($scope.orders)
                    $scope.saveOrder($scope.orders);
                }
            });
        }

        /**
         * 弹窗计费方案
         */
        $scope.selectChargingScheme = function selectChargingScheme() {
            $scope.modalChargingTitle = '选择方案';
            $scope.chargingModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/order/modal.ChargingSchemesList.html',
                show: true
            });
        }

        /**
         * 计费方案列表
         */
        $scope.getChargingSchemeList = function getChargingSchemeList(tableState) {
            $scope.chargingSchemeTableState = tableState;
            //分页信息
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            //查询参数
            var searchModel = {};
            searchModel.start = $scope.start;
            searchModel.size = $scope.number;
            searchModel.schemeStatus = 1; // 启用状态
            searchModel.isDeleted = 0;
            searchModel.authorizationDepartmentId = AuthenticationService.currentUser().school_id;
            var promise = CrmChargingSchemeService.getPageList(searchModel);
            promise.then(
                function (response) {
                    if (response.status === "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    } else {
                        $scope.chargingSchemeList = response.data.list;
                        //传分页参数
                        $scope.chargingSchemeTableState.pagination.numberOfPages = response.numberOfPages;
                    }
                }
            );
        }

        /**
         * 对应的处理尾款
         */
        function _conductPayments() {
            $scope.orderRecharge.paymentsWrite = false;
            $scope.orderRecharge.recharge.realPayAmount = 0;
            if (isNaN($scope.orderRecharge.totalPrice)) {
                $scope.orderRecharge.totalPrice = 0;
            }

            // 尾款金额需要计算出来
            for (var i = $scope.orderRecharge.crmorderPayments.length - 1; i >= 0; i--) {

                var data = $scope.orderRecharge.crmorderPayments[i];
                if (Number(data.payAmount) <= 0) {
                    $scope.orderRecharge.paymentsWrite = true;
                }
                $scope.orderRecharge.recharge.realPayAmount = Number($scope.orderRecharge.recharge.realPayAmount) + Number(data.payAmount);
                data.payDueAmount = $scope.orderRecharge.recharge.totalPrice - Number($scope.orderRecharge.recharge.privilegeAmount) - $scope.orderRecharge.recharge.realPayAmount;
                if (Number(data.payDueAmount) < 0) {
                    $scope.orderRecharge.paymentsWrite = true;
                }

            }
        }

        /**
         * 选择某一计费方案、查询出对应的师资等级列表、清空价格
         */
        $scope.selectOneCharging = function selectOneCharging(row) {
            debugger
            $scope.orderRecharge.recharge.orderChargingId = row.id;
            $scope.orderRecharge.recharge.orderChargingScheme = angular.copy(row);
            $scope.orderRecharge.recharge.orderChargingName = row.schemeName;

            console.log(row)
            $scope.orderRechargeTeacherLevelList = getPricesList(row);

            $scope.orderRecharge.recharge.orderChargingPrice = "";
        }

        $scope.selectOneChargingConfirm = function selectOneChargingConfirm() {
            $scope.chargingModal.hide();
        }


        var init = function () {
            // 默认加一条业绩提醒的记录，默认的业绩人为当前登录用户
            var authenticationUser = AuthenticationService.currentUser();
            // 部门信息
            $scope.orderRecharge.recharge.achievementRatio.departmentId = authenticationUser.school_id;
            $scope.orderRecharge.recharge.achievementRatio.departName = authenticationUser.department.name;
            // 业绩人信息
            $scope.orderRecharge.recharge.achievementRatio.userId = authenticationUser.id;
            $scope.orderRecharge.recharge.achievementRatio.userName = authenticationUser.name;
            // 业绩人岗位信息
            $scope.orderRecharge.recharge.achievementRatio.positionId = authenticationUser.position_id;
            $scope.orderRecharge.recharge.achievementRatio.position = {};
            $scope.orderRecharge.recharge.achievementRatio.position.id = authenticationUser.position_id;
            $scope.orderRecharge.recharge.achievementRatio.position.name = authenticationUser.position_name;
            // 业绩比例默认100%
            $scope.orderRecharge.recharge.achievementRatio.achievementRatio = 1;
            $scope.orderRecharge.recharge.achievementRatios.push($scope.orderRecharge.recharge.achievementRatio);
            // 展示学生年级
            CommonService.getGradeIdSelect().then(function (result) {
                $scope.gradeIds = result.data;
            });
        }
        init();

        /**
        * 更改计费方案 type1更改年级 2更改师资等级
        */
        $scope.changeCharging = function changeCharging(type) {
            debugger
            // 顺带更改学生的年级
            if ($scope.orderOperating == 2) {
                $scope.orderRecharge.recharge.orderChargingPrice = getPrice($scope.orderRecharge.recharge.orderChargingScheme, $scope.orderRecharge.recharge.orderTeacherLevel, $scope.orderRecharge.recharge.gradeId);
            }
            if (type == 1) {
                var customerStudentVo = {}
                customerStudentVo.crm_student_id = $scope.orderRecharge.recharge.crmStudentId;
                var promise = CustomerStudentService.detail(customerStudentVo);
                promise.then(function (result) {
                    $scope.customerStudentDetail = result;
                    if ($scope.orderRecharge.recharge.orderChargingId == undefined || $scope.orderRecharge.recharge.orderChargingId == "") {
                        SweetAlert.swal("请选择计费方案");
                        $scope.orderRecharge.recharge.gradeId = $scope.customerStudentDetail.grade_id;
                        return;
                    }
                    if ($scope.orderRecharge.recharge.orderTeacherLevel == undefined || $scope.orderRecharge.recharge.orderTeacherLevel == "") {
                        SweetAlert.swal("请选择师资等级");
                        $scope.orderRecharge.recharge.gradeId = $scope.customerStudentDetail.grade_id;
                        return;
                    }
                    var title = "该操作将要修改该学生的年级,是否确定?";
                    var unlawfulnessGrade = [14, 15, 16, 18, 19, 20]; // 非法年级
                    var flag_grade = unlawfulnessGrade.contains($scope.orderRecharge.recharge.gradeId); //返回true
                    if (!flag_grade) {
                        $mtModal.moreModal({
                            scope: $scope,
                            status: 0,
                            text: title,
                            hasNext: function () {

                                CoursePlanService.getWxClassTimeList($scope.orderRecharge.recharge.crmStudentId, $scope.customerStudentDetail.grade_id, $scope.orderRecharge.recharge.gradeId).then(function (result) {
                                    if (result.wxExist) {
                                        if (result.jk) {
                                            var t = "发现该学员有未消排课记录,系统将把这些排课记录的计费金额按本次修改调整,余额不足,系统将删除最后的" + result.jkCount + "条排课记录";
                                            $mtModal.moreModal({
                                                scope: $scope,
                                                status: 0,
                                                text: t,
                                                hasNext: function () {
                                                    CoursePlanService.saveGradeChange(result, $scope.orderRecharge.recharge.crmStudentId, $scope.orderRecharge.recharge.gradeId);
                                                    $scope.customerStudentDetail.grade_id = $scope.orderRecharge.recharge.gradeId;
                                                    updateCustomerStudent();//更新学员年级
                                                    $scope.orderRecharge.recharge.orderChargingPrice = getPrice($scope.orderRecharge.recharge.orderChargingScheme, $scope.orderRecharge.recharge.orderTeacherLevel, $scope.orderRecharge.recharge.gradeId);
                                                    if ($scope.getMyCrmCustomerStudentList) {
                                                        $scope.getMyCrmCustomerStudentList($rootScope.tableState);
                                                    }
                                                    $scope.mtResultModal.hide();
                                                },
                                                cancel: function () {
                                                    $scope.orderRecharge.recharge.gradeId = $scope.customerStudentDetail.grade_id;
                                                    $scope.mtResultModal.hide();
                                                }
                                            });
                                        } else {
                                            var t = "发现该学员有未消排课记录,系统将把这些排课记录的计费金额按本次修改调整";
                                            $mtModal.moreModal({
                                                scope: $scope,
                                                status: 0,
                                                text: t,
                                                hasNext: function () {
                                                    CoursePlanService.saveGradeChange(result, $scope.orderRecharge.recharge.crmStudentId, $scope.orderRecharge.recharge.gradeId);
                                                    $scope.customerStudentDetail.grade_id = $scope.orderRecharge.recharge.gradeId;
                                                    updateCustomerStudent();//更新学员年级
                                                    $scope.orderRecharge.recharge.orderChargingPrice = getPrice($scope.orderRecharge.recharge.orderChargingScheme, $scope.orderRecharge.recharge.orderTeacherLevel, $scope.orderRecharge.recharge.gradeId);
                                                    if ($scope.getMyCrmCustomerStudentList) {
                                                        $scope.getMyCrmCustomerStudentList($rootScope.tableState);
                                                    }
                                                    $scope.mtResultModal.hide();
                                                },
                                                cancel: function () {
                                                    $scope.orderRecharge.recharge.gradeId = $scope.customerStudentDetail.grade_id;
                                                    $scope.mtResultModal.hide();
                                                }
                                            });
                                        }
                                    } else {
                                        CoursePlanService.saveGradeChange(result, $scope.orderRecharge.recharge.crmStudentId, $scope.orderRecharge.recharge.gradeId);
                                        $scope.customerStudentDetail.grade_id = $scope.orderRecharge.recharge.gradeId;
                                        updateCustomerStudent();//更新学员年级
                                        $scope.orderRecharge.recharge.orderChargingPrice = getPrice($scope.orderRecharge.recharge.orderChargingScheme, $scope.orderRecharge.recharge.orderTeacherLevel, $scope.orderRecharge.recharge.gradeId);
                                        if ($scope.getMyCrmCustomerStudentList) {
                                            $scope.getMyCrmCustomerStudentList($rootScope.tableState);
                                        }
                                        $scope.mtResultModal.hide();
                                    }
                                });
                            },
                            cancel: function () {
                                $scope.orderRecharge.recharge.gradeId = $scope.customerStudentDetail.grade_id;
                                $scope.mtResultModal.hide();
                            }
                        });
                    } else {
                        var untitle = "该学员年级为非法年级，请为学员重新选择年级";
                        $scope.orderRecharge.recharge.gradeId = $scope.customerStudentDetail.grade_id;
                        SweetAlert.swal(untitle);
                        return;
                    }
                }, function (error) {
                    SweetAlert.swal("获取学生信息失败");
                });
            } else {
                var unlawfulnessGrade = [14, 15, 16, 18, 19, 20]; // 非法年级
                var flag_grade = unlawfulnessGrade.contains($scope.orderRecharge.recharge.gradeId); //返回true
                if (flag_grade) {
                    var untitle = "该学员年级为非法年级，请为学员重新选择年级";
                    SweetAlert.swal(untitle);
                    return;
                }
                $scope.orderRecharge.recharge.orderChargingPrice = getPrice($scope.orderRecharge.recharge.orderChargingScheme, $scope.orderRecharge.recharge.orderTeacherLevel, $scope.orderRecharge.recharge.gradeId);
            }
        }


        /**
        * 改变交费金额时，重新计算尾款金额
        */
        $scope.conductPayments = function (type) {
            if (type == 1) {
                _conductPaymentsDX();
            } else {
                _conductPayments();
            }
            //计算下折扣率
            $scope.orderRecharge.recharge.privilegeRatio =
                100 - Number(($scope.orderRecharge.recharge.privilegeAmount * 100 / $scope.orderRecharge.recharge.totalPrice).toFixed(1));
            $scope.orderRecharge.recharge.privilegeRatio = Number($scope.orderRecharge.recharge.privilegeRatio.toFixed(1));
        }

        /**
        * 对应的处理尾款
        */
        function _conductPayments() {
            $scope.orderRecharge.paymentsWrite = false;
            $scope.orderRecharge.recharge.realPayAmount = 0;
            if (isNaN($scope.orderRecharge.totalPrice)) {
                $scope.orderRecharge.totalPrice = 0;
            }
            // 尾款金额需要计算出来
            for (var i = $scope.orderRecharge.crmorderPayments.length - 1; i >= 0; i--) {
                var data = $scope.orderRecharge.crmorderPayments[i];
                if (Number(data.payAmount) <= 0) {
                    $scope.orderRecharge.paymentsWrite = true;
                }
                $scope.orderRecharge.recharge.realPayAmount = Number($scope.orderRecharge.recharge.realPayAmount) + Number(data.payAmount);
                data.payDueAmount = $scope.orderRecharge.recharge.totalPrice - Number($scope.orderRecharge.recharge.privilegeAmount) - $scope.orderRecharge.recharge.realPayAmount;
                if (Number(data.payDueAmount) < 0) {
                    $scope.orderRecharge.paymentsWrite = true;
                }

            }
        }

        function _conductPaymentsDX() {
            $scope.orderRecharge.realPayAmount = 0;
            $scope.orderRecharge.paymentsWrite = false;
            if (isNaN($scope.orderRecharge.totalPrice)) {
                $scope.orderRecharge.totalPrice = 0;
            }
            for (var i = $scope.orderRecharge.crmorderPayments.length - 1; i >= 0; i--) {
                var data = $scope.orderRecharge.crmorderPayments[i];
                if (Number(data.payAmount) <= 0) {
                    $scope.orderRecharge.paymentsWrite = true;
                }
                $scope.orderRecharge.realPayAmount = Number($scope.orderRecharge.realPayAmount) + Number(data.payAmount);
                data.payDueAmount = $scope.orderRecharge.totalPrice - Number($scope.orderRecharge.privilegeAmount) - $scope.orderRecharge.realPayAmount;
                if (Number(data.payDueAmount) < 0) {
                    $scope.orderRecharge.paymentsWrite = true;
                }
            }
        }

        $scope.getDiscount = function () {
            $scope.orderRecharge.recharge.privilegeAmountTemp =
                Number(($scope.orderRecharge.recharge.totalPrice * $scope.orderRecharge.recharge.privilegeRatio / 100).toFixed(2));
            $scope.orderRecharge.recharge.privilegeAmount = Number(($scope.orderRecharge.recharge.totalPrice - $scope.orderRecharge.recharge.privilegeAmountTemp).toFixed(2));
            _conductPayments();
        }

        //课时订单  添加收费
        $scope.order.paymentTempFlag = false;
        $scope.addShouFei = function (type) {
            $scope.order.totalPrice = isNaN($scope.order.totalPrice) || $scope.order.totalPrice == undefined || $scope.order.totalPrice == "" ? 0.00 : $scope.order.totalPrice;
            $scope.order.privilegeAmount = isNaN($scope.order.privilegeAmount) || $scope.order.privilegeAmount == undefined || $scope.order.privilegeAmount == "" ? 0.00 : $scope.order.privilegeAmount;
            var realTotalAmount = Number($scope.order.totalPrice.toFixed(2)) - Number(Number($scope.order.privilegeAmount).toFixed(2));
            //若是订单的金额为0,不允许进行收费操作，给除提示
            if (type == 1) {
                $scope.order.paymentTempFlag = true;
            }
            if (realTotalAmount > 0) {
                //将上次添加的记录置空
                $scope.order.supplementaryFee = "";
                $scope.order.payDate = "";
                $scope.modalTitle = "添加收费";
                $scope.addShouFeiModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/charge.html',
                    show: true
                });
            } else {
                SweetAlert.swal("应交金额应该大于0");
                return;
            }
        }

        //充值订单  添加收费
        $scope.orderRecharge.recharge.paymentTempFlag = false;
        $scope.addShouFeiTopUp = function (type) {
            $scope.orderRecharge.recharge.supplementaryFee = "";
            $scope.orderRecharge.recharge.payDate = "";
            $scope.orderRecharge.recharge.totalPrice = isNaN($scope.orderRecharge.recharge.totalPrice) || $scope.orderRecharge.recharge.totalPrice == undefined || $scope.orderRecharge.recharge.totalPrice == "" ? 0.00 : $scope.orderRecharge.recharge.totalPrice;
            $scope.orderRecharge.recharge.privilegeAmount = isNaN($scope.orderRecharge.recharge.privilegeAmount) || $scope.orderRecharge.recharge.privilegeAmount == undefined || $scope.orderRecharge.recharge.privilegeAmount == "" ? 0.00 : $scope.orderRecharge.recharge.privilegeAmount;
            var realTotalAmount = Number($scope.orderRecharge.recharge.totalPrice.toFixed(2)) - Number(Number($scope.orderRecharge.recharge.privilegeAmount).toFixed(2));
            //若是订单的金额为0,不允许进行收费操作，给除提示
            if (realTotalAmount > 0) {
                //将上次添加的记录置空
                if ($scope.orderRecharge.orderStatus != 15) {
                    $scope.orderRecharge.orderStatus = undefined;
                }
                $scope.orderRecharge.supplementaryFee = "";
                $scope.orderRecharge.payDate = "";
                $scope.modalTitle = "添加收费";
                $scope.addShouFeiModal = $modal({
                    scope: $scope,
                    templateUrl: 'optimize/modal/order/chargeTopUpProtocol.html',
                    show: true
                });
            } else {
                SweetAlert.swal("应交金额应该大于0");
                return;
            }
        }
        $scope.saveTempChargeRecord = function saveTempChargeRecord() {
            debugger;
            $scope.orderPaymentTemp = {};
            // 页面上输入的合同号、交费日期、交费金额

            $scope.orderPaymentTemp.orderNo = $scope.orderRecharge.recharge.orderNo;
            $scope.orderPaymentTemp.payAmount = Number($scope.orderRecharge.recharge.supplementaryFee);
            // $scope.orderPaymentTemp.payDate = new Date($scope.order.recharge.payDate+' 00:00:00');
            if (typeof $scope.orderRecharge.recharge.payDate == "object") {
                $scope.orderPaymentTemp.payDate = new Date($scope.orderRecharge.recharge.payDate.getFullYear() + '/' + ($scope.orderRecharge.recharge.payDate.getMonth() + 1) + "/" + $scope.orderRecharge.recharge.payDate.getDate() + ' 00:00:00');
            } else {
                $scope.orderPaymentTemp.payDate = new Date($scope.orderRecharge.recharge.payDate + ' 00:00:00');
            }

            $scope.orderPaymentTemp.paymentEdit = true;
            // 尾款金额需要计算出来
            if ($scope.orderRecharge.recharge.realPayAmount == undefined || isNaN($scope.orderRecharge.recharge.realPayAmount)) {
                $scope.orderRecharge.recharge.realPayAmount = 0;
            }
            $scope.orderRecharge.recharge.realPayAmount = Number($scope.orderRecharge.recharge.realPayAmount) + Number($scope.orderPaymentTemp.payAmount);
            $scope.orderPaymentTemp.payDueAmount = $scope.orderRecharge.recharge.totalPrice - Number($scope.orderRecharge.recharge.privilegeAmount) - $scope.orderRecharge.recharge.realPayAmount;
            $scope.orderRecharge.crmorderPayments.push($scope.orderPaymentTemp);
            // 将现有的收费值清空
            $scope.addShouFeiModal.hide();
        }
        $scope.showEditPayment = function (row) {
            row.paymentEdit = false;
        }


        /**
         * 输入折扣率时自动计算
         */
        $scope.getDiscount1 = function getDiscount1() {
            //根据折扣率计算优惠金额，
            $scope.order.privilegeAmountTemp = Number(($scope.order.totalPrice * $scope.order.privilegeRatio / 100).toFixed(2));
            $scope.order.privilegeAmount = Number(($scope.order.totalPrice - $scope.order.privilegeAmountTemp).toFixed(2));
            _orderOperating1()
            _conductPayments1();
            $scope.PayDisabled = true;
        }

        /**
         * 对应的处理尾款
         */
        function _conductPayments1() {
            $scope.order.realPayAmount = 0;
            $scope.order.paymentsWrite = false;
            if (isNaN($scope.order.totalPrice)) {
                $scope.order.totalPrice = 0;
            }
            // 尾款金额需要计算出来
            angular.forEach($scope.order.crmorderPayments, function (data, index, array) {
                if (Number(data.payAmount) <= 0) {
                    $scope.order.paymentsWrite = true;
                }
                $scope.order.realPayAmount = Number($scope.order.realPayAmount) + Number(data.payAmount);
                data.payDueAmount = $scope.order.totalPrice - Number($scope.order.privilegeAmount) - $scope.order.realPayAmount;
                if (Number(data.payDueAmount) < 0) {
                    $scope.order.paymentsWrite = true;
                }
                if (isNaN(data.payDueAmount)) {
                    data.payDueAmount = 0;
                }
            });
        }

        function _orderOperating1() {
            if ($scope.orderOperating < 5) {
                $("#payType1").removeClass("active").siblings().removeClass("active");
                $scope.order.realPayAmount = "";
            }
        }


        $scope.changeStandardPrice = function changeStandardPrice() {
            $scope.order.totalOriginalNum = 0;
            $scope.order.totalOriginalTimes = 0;
            $scope.order.totalPrice = 0;
            _price()
            // 判断时长
            if ($scope.order.orderRule == 1) {
                $scope.order.hours = $scope.order.totalOriginalNum;
                $scope.order.minite = 0;
            } else {
                $scope.order.hours = parseInt($scope.order.totalOriginalNum * 40 / 60);
                $scope.order.minite = parseInt(($scope.order.totalOriginalNum * 40) % 60);
            }

            //若折扣率有值重新计算优惠的金额
            if ($scope.order.privilegeRatio != undefined && $scope.order.privilegeRatio != '') {
                $scope.order.privilegeAmountTemp = Number(($scope.order.totalPrice * $scope.order.privilegeRatio / 100).toFixed(2));
                $scope.order.privilegeAmount = Number(($scope.order.totalPrice - $scope.order.privilegeAmountTemp).toFixed(2));
            }
            // 去掉样式，将本次支付金额置空   fanl
            _orderOperating1();
            _conductPayments1();

        };


        /**
         * 充值订单修改价格
         * @private
         */
        function _price() {
            if ($scope.orderOperating == 10) {//充值修改
                angular.forEach($scope.order.orderCourses, function (data, index, array) {
                    //data等价于array[index]
                    //console.log(data.a+'='+array[index].a);
                    var originalNum = data.originalNum;
                    if (!originalNum || originalNum == '') {
                        originalNum = 0;
                    }
                    $scope.order.totalOriginalNum = $scope.order.totalOriginalNum + data.originalNum;
                    $scope.order.totalPrice = $scope.order.totalPrice + (originalNum * data.actualPrice);
                });
            } else {
                angular.forEach($scope.order.orderCourses, function (data, index, array) {
                    var originalNum = data.originalNum;
                    if (!originalNum || originalNum == '') {
                        originalNum = 0;
                    }
                    // 判断是否是期 是期，则单位为 次或期 、小时或期，若是期，数量=每次的次数（或小时）* 期数
                    if (data.isRegularCharge) {
                        if (data.courseBuyUnit == 3) {
                            originalNum = originalNum * data.regularTimes;
                            data.isRegularCharge = true;
                        }
                    }
                    // 按课时计费
                    if (data.courseUnit == 1) {
                        $scope.order.totalOriginalNum = parseInt($scope.order.totalOriginalNum) + parseInt(originalNum);
                    } else if (data.courseUnit == 2) {
                        $scope.order.totalOriginalTimes = parseInt($scope.order.totalOriginalTimes) + parseInt(originalNum);
                    } else {
                        $scope.order.totalOriginalNum = parseInt($scope.order.totalOriginalNum) + parseInt(originalNum);
                    }
                    $scope.order.totalPrice = $scope.order.totalPrice + (data.originalNum * data.actualPrice);
                    //$scope.order.totalPrice = $scope.order.totalPrice.toFixed(2);
                    $scope.isShowClassAdd(index)
                });
            }
        }


        $scope.isShowClassAdd = function isShowClassAdd(index) {
            $scope.filter = {};
            // 点击选班时，展示班级的列表
            $scope.filter.start = 0;
            $scope.filter.size = 10;
            $scope.filter.courseId = $scope.order.orderCourses[index].courseId;
            $scope.filter.schoolId = AuthenticationService.currentUser().school_id;
            var promise = ClassManagementService.getClassesByFilter($scope.filter);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                    $scope.order.orderCourses[index].isShow = false
                } else {
                    $scope.MyCrmCustomerStudentClassList = response.data.list;
                    if ($scope.MyCrmCustomerStudentClassList.length > 0) {
                        $scope.order.orderCourses[index].isShow = true;
                    }
                }
            },
                function (error) {

                });
        }

        //聚焦失焦0的展示
        $scope.isFocus = function (index, key) {
            $scope.order.orderCourses[index][key] = $scope.order.orderCourses[index][key] ? $scope.order.orderCourses[index][key] : '';
        };
        $scope.isBlur = function (index, key) {
            $scope.order.orderCourses[index][key] = $scope.order.orderCourses[index][key] ? $scope.order.orderCourses[index][key] : 0
        };


        $scope.$on("addOrderSuccess", function (event, obj) {
            if ($scope.addProtocolModal) {
                $scope.addProtocolModal.hide();
            }
            if ($scope.modal) {
                $scope.modal.hide();
            }
        })

        /**
         * 改变使用金额清空交费情况
         */
        $scope.resetPayCondition = function resetPayCondition() {
            _orderOperating()
            _conductPayments();
            $scope.PayDisabled = true;
            //计算下折扣率
            $scope.order.privilegeRatio = 100 - Number(($scope.order.privilegeAmount * 100 / $scope.order.totalPrice).toFixed(1));
            $scope.order.privilegeRatio = Number($scope.order.privilegeRatio.toFixed(1));
        }
        function _orderOperating() {
            if ($scope.orderOperating < 5) {
                $("#payType1").removeClass("active").siblings().removeClass("active");
                $scope.order.realPayAmount = "";
            }
        }
        /**
         * 对应的处理尾款
         */
        function _conductPayments1() {
            $scope.order.realPayAmount = 0;
            $scope.order.paymentsWrite = false;
            if (isNaN($scope.order.totalPrice)) {
                $scope.order.totalPrice = 0;
            }
            // 尾款金额需要计算出来
            angular.forEach($scope.order.crmorderPayments, function (data, index, array) {
                if (Number(data.payAmount) <= 0) {
                    $scope.order.paymentsWrite = true;
                }
                $scope.order.realPayAmount = Number($scope.order.realPayAmount) + Number(data.payAmount);
                data.payDueAmount = $scope.order.totalPrice - Number($scope.order.privilegeAmount) - $scope.order.realPayAmount;
                if (Number(data.payDueAmount) < 0) {
                    $scope.order.paymentsWrite = true;
                }
                if (isNaN(data.payDueAmount)) {
                    data.payDueAmount = 0;
                }
            });
        }

        /**
         * 订单删除课程信息
         */
        $scope.delOrderCourse = function delOrderCourse(obj) {
            console.log(obj);
            if (!obj.originalNum || obj.originalNum == '') {
                obj.originalNum = 0;
            }
            $scope.order.totalOriginalNum = $scope.order.totalOriginalNum - obj.originalNum;
            $scope.order.totalPrice = $scope.order.totalPrice - (obj.originalNum * obj.actualPrice);
            $scope.order.orderCoursesNew = [];
            angular.forEach($scope.order.orderCourses, function (data, index, array) {
                if (data.$$hashKey != obj.$$hashKey) {
                    $scope.order.orderCoursesNew.push(data);
                }
            });
            // 判断时长
            if ($scope.order.orderRule == 1) {
                $scope.order.hours = $scope.order.totalOriginalNum;
                $scope.order.minite = 0;
            } else {
                $scope.order.hours = parseInt($scope.order.totalOriginalNum * 40 / 60);
                $scope.order.minite = parseInt(($scope.order.totalOriginalNum * 40) % 60);
            }
            $scope.order.orderCourses = $scope.order.orderCoursesNew;
            // 去掉样式，将本次支付金额置空   fanl
            _orderOperating()
        };
    }]);