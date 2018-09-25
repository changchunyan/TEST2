'use strict';
/**
 * The order management controller.OrderAddController
 * @author sunqc@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp')
    .controller('OrderManagementController', ['$scope', '$timeout', '$location', '$routeParams', '$modal', '$rootScope',
        'FileUploader', '$base64', 'SweetAlert', 'localStorageService', 'OrderService', 'CommonService',
        'LeadsStudentService', 'CoursePlanService', 'UserService', 'AuthenticationService', 'CrmChargingSchemeService', 'ColEdit', 'CustomerStudentCourseService', '$http',
        function ($scope, $timeout, $location, $routeParams, $modal, $rootScope, FileUploader, $base64, SweetAlert,
                  localStorageService, OrderService, CommonService, LeadsStudentService, CoursePlanService, UserService, AuthenticationService, CrmChargingSchemeService, ColEdit, CustomerStudentCourseService, $http) {


            initOrderStatusList();

            function initOrderStatusList() {
                $scope.orderStatusList = new Array();
                var obj = new Object();
                obj.id = 1;
                obj.name = "录入订单";
                $scope.orderStatusList.push(obj);
                obj = new Object();
                obj.id = 2;
                obj.name = "支付定金";
                $scope.orderStatusList.push(obj);
                obj = new Object();
                obj.id = 14;
                obj.name = "未签约";
                $scope.orderStatusList.push(obj);

            }

            $scope.orderStatusTypeChange = orderStatusTypeChange;

            function orderStatusTypeChange() {
                if ($scope.orderFilter.orderStatusType == "") {
                    initOrderStatusList();
                } else if ($scope.orderFilter.orderStatusType == 2) {
                    $scope.orderStatusList = new Array();
                    var obj = new Object();
                    obj.id = "3";
                    obj.name = "审核通过";
                    $scope.orderStatusList.push(obj);
                } else if ($scope.orderFilter.orderStatusType == 3) {
                    $scope.orderStatusList = new Array();
                    var obj = new Object();
                    obj.id = "8";
                    obj.name = "已结课";
                    $scope.orderStatusList.push(obj);
                    obj = new Object();
                    obj.id = "5";
                    obj.name = "已退单";
                    $scope.orderStatusList.push(obj);
                    obj = new Object();
                    obj.id = "9";
                    obj.name = "已退费";
                    $scope.orderStatusList.push(obj);
                    obj = new Object();
                    obj.id = "6";
                    obj.name = "已转课";
                    $scope.orderStatusList.push(obj);
                } else if ($scope.orderFilter.orderStatusType == 4) {
                    $scope.orderStatusList = new Array();
                    var obj = new Object();
                    obj.id = "11";
                    obj.name = "转课中";
                    $scope.orderStatusList.push(obj);
                    obj = new Object();
                    obj.id = "10";
                    obj.name = "退费中";
                    $scope.orderStatusList.push(obj);
                    obj = new Object();
                    obj.id = "15";
                    obj.name = "结转中";
                    $scope.orderStatusList.push(obj);
                    obj = new Object();
                    obj.id = "13";
                    obj.name = "拆订单转课中";
                    $scope.orderStatusList.push(obj);

                } else if ($scope.orderFilter.orderStatusType == 5) {
                    $scope.orderStatusList = new Array();
                    var obj = new Object();
                    obj.id = "16";
                    obj.name = "转出";
                    $scope.orderStatusList.push(obj);
                    obj = new Object();
                    obj.id = "17";
                    obj.name = "转入";
                    $scope.orderStatusList.push(obj);
                }
            }

            $scope.handleDownload = handleDownload;

            var angularElementFileResolveDocx = function (response) {
                var file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
                var url = window.URL.createObjectURL(file);
                var anchor = angular.element('<a/>');
                var fileName = '合同-' + $scope.tempContractOrderNo + '.docx';
                anchor.attr({
                    href: url,
                    target: '_blank',
                    download: fileName
                })[0].click();
            };

            var angularElementFileResolvePDF = function (response) {
                var file = new Blob([response.data], {type: 'application/pdf'});
                var url = window.URL.createObjectURL(file);
                var anchor = angular.element('<a/>');
                var fileName = '合同-' + $scope.tempContractOrderNo + '.pdf';
                anchor.attr({
                    href: url,
                    target: '_blank',
                    download: fileName
                })[0].click();
            };

            var buildConfig = function (headers) {
                var config = {};
                config.responseType = 'arraybuffer';
                if (headers) {
                    config.headers = headers;
                }

                return config;
            };

            function handleDownload(order) {
                $scope.tempContractOrderNo = order.orderNo;
                var promise = OrderService.checkAllOrderStatus(order.orderNo);
                promise.then(
                    function (data) {
                        if (data.status == 'FAILURE') {
                            if (data.data) {
                                SweetAlert.swal("存在未审核通过的附加协议,合同号:" + data.data);
                            } else {
                                SweetAlert.swal(data.error);
                            }
                        } else {
                            $http.get(OrderService.docxUrl(order.orderNo), buildConfig(null)).then(angularElementFileResolveDocx);
                        }
                    });
            }

            function pdfUrl(orderNo) {
                return OrderService.pdfUrl(orderNo);
            }

            function docxUrl(orderNo) {
                return OrderService.docxUrl(orderNo);
            }

            $http
                .get(hr_server + "departments/queryById?departmentId=" + localStorageService.get("school_id") + "&organizationId=1")
                .success(function (response) {
                    if (response.status == "SUCCESS" && response.data != null) {
                        // console.log(response);
                        $scope.isUseEContract = response.data.isUseEContract;
                    }
                });

            $scope.editOrder = editOrder;
            $scope.auditOrder = auditOrder;
            $scope.detailOrder = detailOrder;
            $scope.chargeOrder = chargeOrder;
            $scope.chargeBackOrder = chargeBackOrder;
            $scope.editOrderTopup = editOrderTopup;
            $scope.auditOrderTopup = auditOrderTopup;
            $scope.detailOrderTopup = detailOrderTopup;
            $scope.detailOrderOTO = detailOrderOTO;
            $scope.chargeOrderTopup = chargeOrderTopup;
            $scope.chargeBackOrderTopup = chargeBackOrderTopup;
            $scope.showOrderAddView = showOrderAddView;
            $scope.hideOrderAddView = hideOrderAddView;
            $scope.refund = refund;
            $scope.refundTopup = refundTopup;
            $scope.prePayOrder = prePayOrder;
            $scope.allPayOrder = allPayOrder;
            $scope.allPayOrderTopup = allPayOrderTopup;
            $scope.saveContract = saveContract;
            $scope.auditRestitutionOrder = auditRestitutionOrder;
            $scope.auditRestitutionOrderBack = auditRestitutionOrderBack;
            $scope.editTransferOrder = editTransferOrder;
            $scope.auditTransferOrderBackNew = auditTransferOrderBackNew;
            $scope.detailTransferOrder = detailTransferOrder;
            $scope.editRestitutionOrder = editRestitutionOrder;
            $scope.detailRestitutionOrder = detailRestitutionOrder;
            $scope.guoLvWuWeiKuan = guoLvWuWeiKuan; //过滤无尾款订单
            $scope.isguoLvWuWeiKuan = false;
            $scope.getDetail = getDetail;
            $scope.getOrderCoursesByOrder = getOrderCoursesByOrder;
            $scope.detailOrderFirstCharge = detailOrderFirstCharge; //先收费查看、修改、签约
            $scope.editOrderFirstCharge = editOrderFirstCharge;
            $scope.signOrder = signOrder;
            $scope.chargeBackOrderFirst = chargeBackOrderFirst;
            $scope.allPayOrderCarry = allPayOrderCarry; // 结转审核
            $scope.hasresult = false; // 模糊搜索的接口函数

            $scope.subjectIds = [{name: '语文', id: 1}, {name: '英语', id: 2}];
            $scope.gradeIds = [{name: '小学一年级', id: 1}, {name: '小学二年级', id: 2}];
            $scope.leadGradeIds = [{name: '小学一年级', id: 1}, {name: '小学二年级', id: 2}];
            $scope.courseTypeIds = [{name: '全优课程', id: 1}, {name: '金牌课程', id: 2}];
            $scope.orderTypeSelect = [{name: '新签', id: 1}, {name: '续费', id: 2}, {name: '返课', id: 3}, {
                name: '推荐',
                id: 5
            }, {name: '赠课', id: 8}];
            $scope.orderStatusSelect = [{name: '录入订单', id: 1}, {name: '支付定金', id: 2}, {
                name: '审核通过',
                id: 3
            }, {name: '审核未通过', id: 4}, {name: '已退单', id: 5}];
            $scope.orderRuleSelect = [{name: '1小时', id: 1}, {name: '40分钟', id: 2}];
            $scope.orderNo;

            $scope.order = {}; // 定义默认值
            $scope.order.carryTime = new Date().getTime();
            $scope.order.recharge = {};
            $scope.order.achievementRatios = [];
            $scope.order.orderRelationTeachers = []; // 定义订单相关的老师列表
            $scope.order.achievementRatio = {};
            $scope.order.achievementRatio.position = {};

            $scope.orderSearch = {};
            $scope.studentId = 0;
            $scope.studentName = '';
            $scope.order.repeatClick = false;
            $scope.order.totalOriginalTimes = 0;
            $scope.$on("refreshList", function (event, msg) {
                $scope.callServerOneTab($scope.tableState);
            });

            $scope.$on("refreshOrder", function (event, msg) {
                $scope.callServerOneTab($scope.tableState);
                $scope.order = {};
                $scope.studentId = 0;
            });

            $scope.showStudentListModal = function () {
                $scope.modalTitleForStudentList = '学生查询';
                $scope.modalForStudentList = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/modal.studentList.html',
                    show: true
                });
            };

            $scope.checkPhone = function () {
                if ($scope.order.leadPhone && $scope.order.leadPhone != '') {
                    var phoneVo = {"phone": $scope.order.leadPhone};
                    //console.log(phoneVo);
                    var promise = CommonService.repeat(phoneVo);
                    promise.then(
                        function (data) {
                            //console.log(data);
                            if (data.status == 'FAILURE') {
                                SweetAlert.swal("电话号码重复，重新输入");
                                $scope.modalForRepeatHide();
                            }
                        },
                        function (data) {
                            console.log(data);
                        }
                    );
                }
            }


            $scope.modalForRepeatHide = function () {
                // $scope.modalForRepeat.hide();
                if ($scope.order != undefined) {
                    $scope.order.leadPhone = null;
                }
            }


            $scope.selectIt = function (row) {
                $scope.studentId = row.crm_student_id;
                $scope.studentName = row.name;
                $scope.accountBalance = row.accountBalance;
                $scope.gradeId = row.grade_id;
            }

            $scope.isSelected = function (row) {
                return $scope.studentId == row.crm_student_id;
            };

            $scope.studentFilter = {};
            $scope.studentList = [];
            $scope.studentListTableState = {};
            $scope.studentListFirst = false;
            $scope.currentPagination = {};
            $scope.getCrmStudentList = function callServer(tableState) {
                if ($scope.studentListFirst) {
                    tableState.pagination.start = 0;
                    tableState.pagination.number = 10;
                }
                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                $scope.studentListTableState = tableState;
                /*  if(!($scope.studentListFirst) && ($scope.currentPagination.start != start || $scope.currentPagination.number != number) ){
                 return false;
                 }*/

                //console.dir(tableState);
                $scope.isSchoolLoading = true;
                $scope.currentPagination = tableState.pagination;
                OrderService.listStudent(start, number, tableState, $scope.studentFilter).then(function (result) {
                    //console.dir(result.data);
                    //$scope.getAllSelected();
                    $scope.studentId = 0;
                    $scope.studentList = result.data;
                    $scope.gusseresult = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.studentListTableState = tableState;
                    $scope.isSchoolLoading = false;
                    $scope.studentListFirst = false;
                });
            };

            $scope.queryStudent = function () {
                $scope.studentListFirst = true;
                $scope.getCrmStudentList($scope.studentListTableState);

            };
            var __timerGo__ = ''
            // 模糊搜索的函数、
            $scope.gusseyourresult = function () {
                __timerGo__ = setTimeout(function () {
                    if ($scope.studentFilter.name) {
                        $scope.hasresult = true;
                        $scope.queryStudent();
                    } else {
                        $scope.hasresult = false;
                    }
                    clearTimeout(__timerGo__)
                }, 400)

            }
            $scope.reset = function () {
                $scope.studentFilter = {};
            }

            $scope.newCustomerAndOrder = function () {
                $scope.modalNewCustomerAndOrderTitle = '买课程';
                $scope.createLead = true;
                $scope.order = {};
                if ($scope.order.recharge.name) {
                    $scope.order.name = null;
                }
                var obj = {'accountBalance': 0, 'consumeAccountBalance': 0};
                $scope.order = angular.copy(obj);
                $scope.modalTitle = '添加';
                $scope.orderOperating = 2//订单标识:创建新意向客户并签约
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: mtModal.add,
                    show: true
                });
                $scope.callServerOrderCourseSelect();
                $scope.getCustomerBelongersSelect();
            };
            $scope.paneChangedV2 = function () {
                $scope.order.carryAmount = ''
                var radios = $('#mt-xxxxxx01').find("input[type='radio']");
                for (var i = 0; i < radios.length; i++) {
                    if (radios[i].checked) {
                        radios[i].checked = false;
                    }
                }
                setTimeout(function () {
                    $scope.order.carryAmount = ''
                    $scope.order.orderNo = ''
                    $scope.order.additionalAmount = ''
                    $scope.order.additionalAmountAct = ''
                    $('input[name="name"]').val('')
                    $('input[name="name"]').trigger('change')
                }, 50)
            }
            !(function () {
                $(document).on('click', '#mt-xxxxxx01 .nav-tabs a', function () {
                    $scope.paneChangedV2()
                })
            })()
            $scope.selectedOrder = function () {
                if ($scope.studentId == 0) {
                    SweetAlert.swal('请先选中学生');
                    return false;
                }
                var obj = {
                    'gradeId': $scope.gradeId,
                    'crmStudentId': $scope.studentId,
                    'name': $scope.studentName,
                    'createLead': 1,
                    'accountBalance': $scope.accountBalance,
                    'consumeAccountBalance': 0
                };
                $scope.order = angular.copy(obj);
                $scope.modalTitle = '添加';
                $scope.orderOperating = 3//订单标识:创建新意向客户并签约
                $scope.modal = $modal({scope: $scope, templateUrl: mtModal.add, show: true});//partials/sos/order/addFromList.html
                $scope.callServerOrderCourseSelect();
            };
            // 添加学员方法
            $scope.addstudentOrder = function (num) {

                var obj = {
                    'gradeId': $scope.gradeId,
                    'crmStudentId': $scope.studentId,
                    'name': $scope.studentName,
                    'createLead': 1,
                    'accountBalance': $scope.accountBalance,
                    'consumeAccountBalance': 0
                };
                $scope.order = angular.copy(obj);
                sessionStorage.setItem('orderJudgeEntrance', 'addOrder');
                $scope.modalTitle = '添加';
                $scope.showCreat = num;
                $scope.orderOperating = 3//订单标识:创建新意向客户并签约
                $scope.modal = $modal({scope: $scope, templateUrl: mtModal.add, show: true}); // 变量mtModal在config.js中定义，optimize/modal/order/add.html
                $scope.callServerOrderCourseSelect();
            };
            $scope.updateJiezhuan = function (flag) {
                $scope.jiezhuan = true
            }
            // 添加学员方法V2.order
            $scope.addstudentOrderV2 = function (num) {
                var obj = {
                    'gradeId': $scope.gradeId,
                    'crmStudentId': $scope.studentId,
                    'name': $scope.studentName,
                    'createLead': 1,
                    'accountBalance': $scope.accountBalance,
                    'consumeAccountBalance': 0
                };
                $scope.order = angular.copy(obj);
                sessionStorage.setItem('orderJudgeEntrance', 'addOrder');
                $scope.modalTitle = '添加';
                $scope.showCreat = num;
                $scope.orderOperating = 3 // 订单标识:创建新意向客户并签约
                $scope.modal = $modal({scope: $scope, templateUrl: mtModal.addV2, show: true}); // 变量mtModal在config.js中定义，optimize/modal/order/add.html
                $rootScope.orderModalV2 = $scope.modal
                $scope.callServerOrderCourseSelect();
            };
            //聚焦失焦0的展示
            $scope.isFocus = function (index, key) {
                $scope.order.orderCourses[index][key] = $scope.order.orderCourses[index][key] ? $scope.order.orderCourses[index][key] : '';
            };
            $scope.isBlur = function (index, key) {
                $scope.order.orderCourses[index][key] = $scope.order.orderCourses[index][key] ? $scope.order.orderCourses[index][key] : 0
            };


            /*******************************************************订单导入start*******************************************************/
            $scope.domain = "";
            if ($location.host().indexOf("localhost") != -1) {//返回大于等于0的整数值，若不包含"localhost"则返回"-1。);
                $scope.domain = "http://" + $location.host() + ":8000/app";
            } else {
                $scope.domain = "http://" + $location.host();
            }


            //导入意向客户弹框
            $scope.showImportModal = function () {
                $scope.modalTitleForImport = '导入订单';
                $scope.modalForImport = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/modal.importOrders.html',
                    show: true
                });
            }

            //上传导入信息
            var uploader = $scope.uploader = new FileUploader({
                url: config.endpoints.sos.order + '/importOrders',
                headers: {
                    'Authorization': 'bearer ' + $base64.encode(localStorageService.get('user').account + ':' + localStorageService.get('token')),
                }
            });

            // FILTERS
            uploader.filters.push({
                name: 'customFilter',
                fn: function (item /*{File|FileLikeObject}*/, options) {
                    return this.queue.length < 10;
                }
            });

            // CALLBACKS
            uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                //console.info('onWhenAddingFileFailed', item, filter, options);
            };

            //添加一个文件
            uploader.onAfterAddingFile = function (fileItem) {
                //判断后缀
                var fileExtend = fileItem.file.name.substring(fileItem.file.name.lastIndexOf('.')).toLowerCase();
                //console.info(fileExtend);
                if (fileExtend != '.xls') {
                    SweetAlert.swal('请选择后缀名为xls格式的excel模版文件');
                    fileItem.remove();
                    return false;
                }
            };

            //添加多个文件
            uploader.onAfterAddingAll = function (addedFileItems) {
                //console.info('onAfterAddingAll', addedFileItems);
            };

            uploader.onProgressItem = function (fileItem, progress) {
                //console.info('onProgressItem', fileItem, progress);
                $rootScope.ywsLoading = true;
            };

            uploader.onCompleteItem = function (fileItem, response, status, headers) {
                //console.info(response);
                if (response.status == 'SUCCESS') {
                    if (undefined != response.data.formatErrorCount) {
                        SweetAlert.swal("第" + response.data.formatErrorCount + "条记录数据格式错误," + response.data.msg);
                        fileItem.remove();
                    } else {
                        SweetAlert.swal("数据总数:" + response.data.totalCount + ";成功条数:" + response.data.successCount + ";订单重复:" + response.data.repeatOrder);
                        fileItem.remove();
                        $scope.refreshTabs();
                    }
                } else {
                    SweetAlert.swal(response.data.msg);
                    fileItem.remove();
                }
                $rootScope.ywsLoading = false;
                //SweetAlert.swal(response.data.msg);
            };
            //全部上传成功
            uploader.onCompleteAll = function () {
                //console.info('onCompleteAll');
            };

            //console.info('uploader', uploader);
            /*******************************************************订单导入end*******************************************************/

            //获取返课原因列表
            $scope.callServerRestitutionCourseReasonSelect = function callServerRestitutionCourseReasonSelect() {
                CommonService.getRestitutionCourseReasonSelect().then(function (result) {
                    $scope.restitutionCourseReasons = result.data;
                });
            }();

            //返课审核通过
            function auditRestitutionOrder(row) {
                SweetAlert.swal({
                        title: "确定要审核通过吗？",
                        type: null,
                        showCancelButton: true,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true
                    }, function (confirm) {
                        if (confirm) {
                            var orderStatus = 3;
                            OrderService.editRestitution(row.orderNo, orderStatus, null).then(function (result) {
                                SweetAlert.swal('操作成功');
                                $scope.refreshTabs();
                            });
                        }
                    }
                );
            }

            //退单
            $scope.crmOrderStudentCourse = [];

            function refund() {
                if (undefined == $scope.order.refundAmount || $scope.order.refundAmount > $scope.order.realPayAmount) {
                    SweetAlert.swal('退单金额填写不正确');
                    return false;
                }
                //审核通过的订单退单
                var promise = OrderService.hasOmsCoursePlanByOrderNo($scope.order.orderNo);
                promise.then(function (result) {
                    $scope.hasPastCourseFlag = result.hasPastCourseFlag;
                    $scope.hasUnPastCourseFlag = result.hasUnPastCourseFlag;
                    if ($scope.hasPastCourseFlag) {
                        SweetAlert.swal('该学生已上课，请退费！');
                        return;
                    }
                    if ($scope.hasUnPastCourseFlag) {
                        SweetAlert.swal({
                                title: "该学生已排课，是否删除排课记录并退单?", text: "", type: "warning", showCancelButton: true,
                                confirmButtonColor: "#DD6B55", confirmButtonText: "是", cancelButtonText: "否",
                                closeOnConfirm: true, closeOnCancel: true
                            },
                            function (isConfirm) {
                                if (isConfirm) {
                                    var orderStatus = 5;
                                    var ext = 'hasAuditOrderRefund';
                                    //删除未消排课记录
                                    OrderService.updateStatus($scope.order, orderStatus, $scope.refundAmount, ext).then(function (result) {
                                        SweetAlert.swal('操作成功');
                                        $scope.getRemindsData($rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds, 1);
                                        _existNews()
                                        $scope.modal.hide();
                                        if (!($scope.modal === undefined)) {
                                            $scope.modal.hide();
                                        }
                                        if ($scope.CustomerRefundFlag) {
                                            $scope.refreshCustomerOrderDetail();
                                        }
                                        if ($rootScope._getIndexData_) {
                                            $rootScope._getIndexData_(3)
                                        }
                                        $scope.refreshTabs();
                                    });

                                } else {
                                    return false;
                                }
                            });
                    }
                    if (!$scope.hasPastCourseFlag && !$scope.hasUnPastCourseFlag) {
                        SweetAlert.swal({
                                title: "是否退单?", text: "", type: "warning", showCancelButton: true,
                                confirmButtonColor: "#DD6B55", confirmButtonText: "是", cancelButtonText: "否",
                                closeOnConfirm: true, closeOnCancel: true
                            },

                            function (isConfirm) {
                                if (isConfirm) {
                                    var orderStatus = 5;
                                    if ($scope.order.orderStatus == 3) {
                                        var ext = 'hasAuditOrderRefund';
                                    } else {
                                        var ext = null;
                                    }
                                    OrderService.updateStatus($scope.order, orderStatus, $scope.refundAmount, ext).then(function (result) {
                                        SweetAlert.swal('操作成功');
                                        $scope.getRemindsData($rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds, 1);
                                        _existNews()
                                        $scope.modal.hide();
                                        if (!($scope.modal === undefined)) {
                                            $scope.modal.hide();
                                        }
                                        if ($scope.CustomerRefundFlag) {
                                            $scope.refreshCustomerOrderDetail();
                                        }
                                        if ($rootScope._getIndexData_) {
                                            $rootScope._getIndexData_(3)
                                        }
                                        $scope.refreshTabs();
                                    });
                                } else {
                                    return false;
                                }
                            })
                    }
                })

            }

            $scope.refundV2 = function (orders) {
                /*var flag = 0
                for (var i = 0, len = orders.length; i < len; i++) {

                    if (undefined == orders[i].refundAmount || orders[i].refundAmount > orders[i].realPayAmount) {
                        flag += 1
                    }
                }
                if (flag) {
                    SweetAlert.swal('退单金额填写不正确');
                    return false;
                }*/

                /* if (orders[0].orderCategory == 3) {
                     var orderStatus = 5;
                     if (orders[0].orderStatus == 3) {
                         var ext = 'hasAuditOrderRefund';
                     } else {
                         var ext = null;
                     }
                     OrderService.updateStatusTopup(orders[0], orderStatus, $scope.refundAmount, ext).then(function (result) {
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
                         $scope.modal.hide();
                         if (!($scope.modal === undefined)) {
                             $scope.modal.hide();
                         }
                         if ($scope.refreshCustomerOrderDetail) {
                             $scope.refreshCustomerOrderDetail();
                         }
                         $scope.refreshTabs();
                     });
                     return false
                 }*/
                //审核通过的订单退单
                var promise = OrderService.hasOmsCoursePlanByOrderNo(orders[0].orderNo);
                promise.then(function (result) {
                    $scope.hasPastCourseFlag = result.hasPastCourseFlag;
                    $scope.hasUnPastCourseFlag = result.hasUnPastCourseFlag;
                    if ($scope.hasPastCourseFlag) {
                        SweetAlert.swal('该学生已上课，请退费！');
                        return;
                    }
                    if ($scope.hasUnPastCourseFlag) {
                        SweetAlert.swal({
                                /*已进行消课，请撤销消课记录?*/
                                title: "该学生已排课，是否删除排课记录并退单", text: "", type: "warning", showCancelButton: true,
                                confirmButtonColor: "#DD6B55", confirmButtonText: "是", cancelButtonText: "否",
                                closeOnConfirm: true, closeOnCancel: true
                            },
                            function (isConfirm) {
                                if (isConfirm) {
                                    var orderStatus = 5;
                                    var ext = 'hasAuditOrderRefund';
                                    //删除未消排课记录
                                    if (orders[0].orderCategory == 3) {
                                        OrderService.updateStatusTopup(orders[0], orderStatus, $scope.refundAmount, ext).then(function (result) {
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
                                            $scope.modal.hide();
                                            if (!($scope.modal === undefined)) {
                                                $scope.modal.hide();
                                            }
                                            if ($scope.refreshCustomerOrderDetail) {
                                                $scope.refreshCustomerOrderDetail();
                                            }
                                            $scope.refreshTabs();
                                        });

                                    } else {
                                        OrderService.updateStatus(orders[0], orderStatus, $scope.refundAmount, ext).then(function (result) {
                                            SweetAlert.swal('操作成功');
                                            $scope.getRemindsData($rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds, 1);
                                            _existNews()
                                            $scope.modal.hide();
                                            if (!($scope.modal === undefined)) {
                                                $scope.modal.hide();
                                            }
                                            if ($scope.CustomerRefundFlag) {
                                                $scope.refreshCustomerOrderDetail();
                                            }
                                            if ($rootScope._getIndexData_) {
                                                $rootScope._getIndexData_(3)
                                            }
                                            $scope.refreshTabs();
                                        });
                                    }

                                } else {
                                    return false;
                                }
                            });
                    }
                    if (!$scope.hasPastCourseFlag && !$scope.hasUnPastCourseFlag) {
                        SweetAlert.swal({
                                title: "是否退单?", text: "注意：退单后，系统将不在统计此订单业绩", type: "warning", showCancelButton: true,
                                confirmButtonColor: "#DD6B55", confirmButtonText: "是", cancelButtonText: "否",
                                closeOnConfirm: true, closeOnCancel: true
                            },

                            function (isConfirm) {
                                if (isConfirm) {
                                    var orderStatus = 5;
                                    if (orders[0].orderStatus == 3) {
                                        var ext = 'hasAuditOrderRefund';
                                    } else {
                                        var ext = null;
                                    }
                                    if (orders[0].orderCategory == 3) {
                                        OrderService.updateStatusTopup(orders[0], orderStatus, $scope.refundAmount, ext).then(function (result) {
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
                                            $scope.modal.hide();
                                            if (!($scope.modal === undefined)) {
                                                $scope.modal.hide();
                                            }
                                            if ($scope.refreshCustomerOrderDetail) {
                                                $scope.refreshCustomerOrderDetail();
                                            }
                                            $scope.refreshTabs();
                                        });

                                    } else {
                                        OrderService.updateStatus(orders[0], orderStatus, $scope.refundAmount, ext).then(function (result) {
                                            SweetAlert.swal('操作成功');
                                            $scope.getRemindsData($rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds, 1);
                                            _existNews()
                                            $scope.modal.hide();
                                            if (!($scope.modal === undefined)) {
                                                $scope.modal.hide();
                                            }
                                            if ($scope.CustomerRefundFlag) {
                                                $scope.refreshCustomerOrderDetail();
                                            }
                                            if ($rootScope._getIndexData_) {
                                                $rootScope._getIndexData_(3)
                                            }
                                            $scope.refreshTabs();
                                        });
                                    }
                                } else {
                                    return false;
                                }
                            })
                    }
                })

            }

            //根据订单号判断是否有已消记录和已排记录
            $scope.hasOmsCoursePlanByOrderNo = function (orderNo) {
                OrderService.hasOmsCoursePlanByOrderNo(orderNo).then(function (result) {
                    $scope.hasPastCourseFlag = result.hasPastCourseFlag;
                    $scope.hasUnPastCourseFlag = result.hasUnPastCourseFlag;
                })
            }

            //退单
            function refundTopup() {
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
                            OrderService.updateStatusTopup($scope.order, orderStatus, $scope.refundAmount, null).then(function (result) {
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
                                $scope.modal.hide();
                                if (!($scope.modal === undefined)) {
                                    $scope.modal.hide();
                                }
                                if ($scope.refreshCustomerOrderDetail) {
                                    $scope.refreshCustomerOrderDetail();
                                }
                                $scope.refreshTabs();
                            });
                        } else {
                            return false;
                        }
                    });
            }

            //定金确定
            function prePayOrder() {
                var orderStatus = 2;
                OrderService.updateStatus($scope.order, orderStatus, null, null).then(function (result) {
                    SweetAlert.swal('操作成功');
                    $scope.modal.hide();
                    $scope.refreshTabs();
                });
            }

            /**
             * 判断是否可以刷新消息
             * @private
             */
            function _existNews() {
                if ($scope.getMsgCount) {
                    if ($rootScope.isRemindsContentShow == 2 && $scope.isHxiaozhang || $rootScope.isRemindsContentShow == 1 && $scope.isHxiaozhang) {//校长
                        $scope.getMsgCount(3);
                    } else if ($rootScope.isRemindsContentShow == 2 && $scope.isHxiaoquzhuguan || $rootScope.isRemindsContentShow == 1 && $scope.isHxiaoquzhuguan) {
                        $scope.getMsgCount(2);
                    } else {
                        $scope.getMsgCount(1);
                    }
                }
            }

            $scope.existNews = _existNews

            //审核通过 清款确认
            function allPayOrder() {
                SweetAlert.swal({
                        title: "是否确认审核通过?", text: "", type: "warning", showCancelButton: true,
                        confirmButtonColor: "#DD6B55", confirmButtonText: "是", cancelButtonText: "否",
                        closeOnConfirm: false, closeOnCancel: true
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            $scope.order.repeatClick = true;
                            var orderStatus = 3;
                            OrderService.updateStatus($scope.order, orderStatus, null, null).then(function (resp) {
                                var result = resp.data

                                if (resp.status == 'FAILURE') {
                                    SweetAlert.swal(resp.error || resp.data);
                                    return false
                                }
                                if ('学员电子账户余额不足' == result) {
                                    SweetAlert.swal(result);
                                    return false;
                                } else {
                                    SweetAlert.swal('操作成功');
                                    $scope.modal.hide();
                                    $scope.getRemindsData($rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds, 1);
                                    _existNews()
                                    if (!($scope.modal === undefined)) {
                                        $scope.modal.hide();
                                    }
                                    if ($rootScope._getIndexData_) {
                                        $rootScope._getIndexData_(3)
                                        $rootScope._getIndexData_(5)
                                    }
                                    $scope.refreshTabs();
                                }
                            });
                        } else {
                            $scope.order.repeatClick = false;
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
                            $scope.order.repeatClick = true;
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
                                $('.orderModal').remove()
                                if ($rootScope._getIndexData_) {
                                    $rootScope._getIndexData_(5)
                                }
                                $scope.refreshTabs();
                                /*try{
                                    setTimeout(function () {
                                        $scope.getIndexData(5)
                                        $scope.getIndexData(3)
                                    },2000)
                                }catch (e){}*/
                            });
                        } else {
                            $scope.order.repeatClick = false;
                            return false;
                        }
                    });
            }


            function saveContract() {
                SweetAlert.swal('操作成功');
                $scope.modal.hide();
            }

            function editOrder(obj) {
                var promise = OrderService.masterSlaveRelation();
                promise.then(function (result) {
                    $scope.masterSlaveRelation = result;
                })
                if (obj.contractStartDate) {
                    obj.contractStartDate = new Date(obj.contractStartDate);
                }
                if (obj.contractEndDate) {
                    obj.contractEndDate = new Date(obj.contractEndDate);
                }
                $scope.order = angular.copy(obj);
                //设置总时长
                if ($scope.order.orderRule == 1) {
                    $scope.order.hours = $scope.order.totalOriginalNum;
                    $scope.order.minite = 0;
                } else {
                    $scope.order.hours = parseInt($scope.order.totalOriginalNum * 40 / 60);
                    $scope.order.minite = parseInt(($scope.order.totalOriginalNum * 40) % 60);
                }
                // 保留修改前初始的对象
                $scope.orderCopy = angular.copy(obj);
                $scope.modalTitle = '修改';
                $scope.orderOperating = 5
                /*  $scope.order.contractEndDate = new Date($scope.order.contractEndDate).Format("yyyy-MM-dd");*/
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/v2.order/update.html',//'partials/sos/order/update.html'
                    // templateUrl: 'partials/sos/order/update.html',//'partials/sos/order/update.html'
                    show: true
                });
                $scope.getOrderCourses();
                $scope.getOrderAchievementRatios();//获取订单的业绩比例
                $scope.getOrderRelationTeachers(); //获取订单相关教师
                $scope.callServerOrderCourseSelect();
                $scope.getCustomerBelongersSelect();
                $scope.getOrderPayments();
                // $scope.order.contractStartDate = new Date()
            }

            function editOrderTopup(obj) {
                // obj.contractStartDate = new Date(obj.contractStartDate);
                // obj.contractEndDate = new Date(obj.contractEndDate);
                if (obj.contractStartDate) {
                    obj.contractStartDate = new Date(obj.contractStartDate);
                }
                if (obj.contractEndDate) {
                    obj.contractEndDate = new Date(obj.contractEndDate);
                }
                $scope.order = angular.copy(obj);
                $scope.orderCopy = angular.copy(obj);
                $scope.modalTitle = '修改';
                $scope.orderOperating = 10

                //计算下折扣率
                $scope.order.privilegeRatio = 100 - Number(($scope.order.privilegeAmount * 100 / $scope.order.totalPrice).toFixed(1));
                $scope.order.privilegeRatio = Number($scope.order.privilegeRatio.toFixed(1));
                $scope.modal = $modal({
                    scope: $scope,
                    // templateUrl: 'partials/sos/order/updateTopup.html',
                    templateUrl: 'partials/v2.order/update.html',
                    show: true
                });
                $scope.getOrderAchievementRatios();//获取订单的业绩比例
                $scope.getOrderRelationTeachers(); //获取订单相关教师
                $scope.callServerOrderCourseSelect();
                $scope.getCustomerBelongersSelect();
                // $scope.getOrderChargingScheme(); // 获取计费方案的信息
                $scope.getOrderChargingSchemeV2($scope.order)
                $scope.getOrderPayments();
                CommonService.getGradeIdSelect().then(function (result) {
                    $scope.gradeIdsNew = result.data;
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

            //初始化订单中包含的课程相关总计信息(总课时 总金额)
            $scope.initData = function initData(order) {
                order = order || $scope.order
                order.totalOriginalNum = 0;
                order.totalPrice = 0;
                order.totalOriginalTimes = 0;
                order.supplementaryFee = 0;
                angular.forEach(order.orderCourses, function (data, index, array) {
                    var originalNum = data.originalNum;
                    if (!originalNum || originalNum == '') {
                        originalNum = 0;
                    }
                    // 判断是否是期 是期，则单位为 次或期 、小时或期，若是期，数量=每次的次数（或小时）* 期数
                    if (data.isRegularCharge) {
                        if (data.courseBuyUnit == 3) {
                            originalNum = originalNum * data.currentRegularTimes;
                            data.isRegularCharge = true;
                        }
                    }
                    // 按课时计费
                    if (data.courseUnit == 1) {
                        order.totalOriginalNum = parseInt(order.totalOriginalNum) + parseInt(originalNum);
                    } else if (data.courseUnit == 2) {
                        order.totalOriginalTimes = parseInt(order.totalOriginalTimes) + parseInt(originalNum);
                    } else {
                        order.totalOriginalNum = parseInt(order.totalOriginalNum) + parseInt(originalNum);
                    }
                    order.totalPrice = order.totalPrice + (data.originalNum * data.actualPrice);

                });
                //计算下折扣率
                order.privilegeRatio = 100 - Number((order.privilegeAmount * 100 / order.totalPrice).toFixed(1));
                order.privilegeRatio = Number(order.privilegeRatio.toFixed(1));
                //计算平均课时单价
                $scope.averageCoursePrice = 0;
                if (order.totalOriginalNum > 0) {
                    $scope.averageCoursePrice = order.realTotalAmount / order.totalOriginalNum;
                    $scope.averageCoursePrice = $scope.averageCoursePrice.toFixed(2);
                }
            };

            //获取转课订单列表信息
            $scope.getCustomerOrderTransferOrders = function getCustomerOrderTransferOrders() {
                OrderService.getCustomerOrderTransferOrders($scope.order.agreementNo).then(function (result) {
                    $scope.orderTransferOrders = result.data;
                });
            };
            //获取转课订单列表信息
            $scope.getCustomerOrderRestitutionOrders = function getCustomerOrderRestitutionOrders() {
                OrderService.getCustomerOrderRestitutionOrders($scope.order.agreementNo).then(function (result) {
                    $scope.orderRestitutionOrders = result.data;
                });
            };


            function editTransferOrder(obj) {
                if (obj.orderTransferCategory == 1) {
                    obj.contractStartDate = new Date(obj.contractStartDate);
                    obj.contractEndDate = new Date(obj.contractEndDate);
                    obj.startDate = new Date(obj.startDate).Format("yyyy-MM-dd");
                    obj.endDate = new Date(obj.endDate).Format("yyyy-MM-dd");
                    $scope.order = angular.copy(obj);
                    $scope.modalTitle = '转课审核';
                    $scope.editTransferOrderModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/sos/order/auditTransfer.html',
                        show: true
                    });
                    $scope.getCustomerOrderTransferOrders();
                }

                if (obj.orderTransferCategory == 2) {
                    obj.contractStartDate = new Date(obj.contractStartDate);
                    obj.contractEndDate = new Date(obj.contractEndDate);
                    obj.startDate = new Date(obj.startDate).Format("yyyy-MM-dd");
                    obj.endDate = new Date(obj.endDate).Format("yyyy-MM-dd");
                    $scope.order = angular.copy(obj);
                    $scope.modalTitle = '转余额审核';
                    $scope.editTransferOrderModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/sos/order/auditTransferTopup.html',
                        show: true
                    });
                    $scope.getCustomerOrderTransferOrders();
                }
                if (obj.orderTransferCategory == 3) {
                    obj.contractStartDate = new Date(obj.contractStartDate);
                    obj.contractEndDate = new Date(obj.contractEndDate);
                    obj.startDate = new Date(obj.startDate).Format("yyyy-MM-dd");
                    obj.endDate = new Date(obj.endDate).Format("yyyy-MM-dd");
                    $scope.order = angular.copy(obj);
                    $scope.modalTitle = '转余额审核';
                    $scope.editTransferOrderModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/sos/order/auditRechargeTransfer.html',
                        show: true
                    });
                    $scope.getCustomerOrderTransferOrders();
                }

            }

            //普通订单撤销转课
            $scope.auditTransferCommonOrderBack = function auditTransferCommonOrderBack(obj) {
                obj.contractStartDate = new Date(obj.contractStartDate);
                obj.contractEndDate = new Date(obj.contractEndDate);
                obj.startDate = new Date(obj.startDate).Format("yyyy-MM-dd");
                obj.endDate = new Date(obj.endDate).Format("yyyy-MM-dd");
                $scope.order = angular.copy(obj);
                $scope.orderold = angular.copy(obj);
                $scope.modalTitle = '转课退单';
                $scope.auditTransferOrderBack = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/auditTransferBackNew.html',
                    show: true
                });
                $scope.filter = {};
                $scope.filter.orderNo = $scope.order.orderNo;
                $scope.filter.crmStudentId = $scope.order.crmStudentId;
                var promise = OrderService.getOrderTransferInfo($scope.filter);
                promise.then(function (data) {
                    $scope.order = data;
                    $scope.order.orderNo = $scope.orderold.orderNo;
                    $scope.order.startDate = new Date(data.startDate).Format("yyyy-MM-dd");
                    $scope.order.endDate = new Date(data.endDate).Format("yyyy-MM-dd");
                    $scope.order.ext = "orgin";
                }, function (error) {
                });

            }

            //根据合同号  查询订单信息
            $scope.getOrderTransferInfo = function getOrderTransferInfo(tableState) {
                $scope.filter = {};
                $scope.filter.orderNo = $scope.order.orderNo;
                $scope.filter.crmStudentId = $scope.order.crmStudentId;
                var promise = OrderService.getOrderTransferInfo($scope.filter);
                promise.then(function (data) {
                    $scope.order = data;
                    $scope.order.orderNo = $scope.orderold.orderNo;
                    $scope.order.startDate = new Date(data.startDate).Format("yyyy-MM-dd");
                    $scope.order.endDate = new Date(data.endDate).Format("yyyy-MM-dd");
                }, function (error) {
                });
            }

            function auditTransferOrderBackNew(obj) {
                if (obj.orderTransferCategory == 1) {
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
                    $scope.getCustomerOrderTransferOrders();
                }

                if (obj.orderTransferCategory == 2) {
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

                if (obj.orderTransferCategory == 3) {
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
                    $scope.getCustomerOrderTransferOrders();
                }

            }

            function detailTransferOrder(obj) {
                if (obj.orderTransferCategory == 1) {
                    obj.contractStartDate = new Date(obj.contractStartDate);
                    obj.contractEndDate = new Date(obj.contractEndDate);
                    obj.startDate = new Date(obj.startDate);
                    obj.endDate = new Date(obj.endDate);
                    $scope.order = angular.copy(obj);
                    $scope.modalTitle = '转课详情';
                    $scope.modal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/sos/order/detailTransfer.html',
                        show: true
                    });
                    $scope.getCustomerOrderTransferOrders();
                }

                if (obj.orderTransferCategory == 2) {
                    obj.contractStartDate = new Date(obj.contractStartDate);
                    obj.contractEndDate = new Date(obj.contractEndDate);
                    obj.startDate = new Date(obj.startDate);
                    obj.endDate = new Date(obj.endDate);
                    $scope.order = angular.copy(obj);
                    $scope.modalTitle = '转课详情';
                    $scope.modal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/sos/order/detailTransferTopup.html',
                        show: true
                    });
                    $scope.getCustomerOrderTransferOrders();
                }

            }

            function editRestitutionOrder(obj) {
                $scope.order = angular.copy(obj);
                $scope.modalTitle = '返课审核';
                $scope.order.orderCourses = [];
                var orderCourse = {
                    'courseId': obj.courseId,
                    'courseTypeName': obj.courseTypeName,
                    'gradeName': obj.gradeName,
                    'subjectName': obj.subjectName,
                    'originalNum': obj.originalNum
                };
                $scope.order.orderCourses.push(orderCourse);
                $scope.editTransferOrderModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/auditRestitution.html',
                    show: true
                });
                $scope.getCustomerOrderRestitutionOrders();
            }

            function auditRestitutionOrderBack(obj) {
                $scope.order = angular.copy(obj);
                $scope.modalTitle = '返课退单';
                $scope.order.orderCourses = [];
                var orderCourse = {
                    'courseId': obj.courseId,
                    'courseTypeName': obj.courseTypeName,
                    'gradeName': obj.gradeName,
                    'subjectName': obj.subjectName,
                    'originalNum': obj.originalNum
                };
                $scope.order.orderCourses.push(orderCourse);
                $scope.auditTransferOrderBack = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/auditRestitutionBack.html',
                    show: true
                });
                $scope.getCustomerOrderRestitutionOrders();
            }

            function detailRestitutionOrder(obj) {
                $scope.order = angular.copy(obj);
                $scope.modalTitle = '返课详情';
                $scope.order.orderCourses = [];
                var orderCourse = {
                    'courseId': obj.courseId,
                    'courseTypeName': obj.courseTypeName,
                    'gradeName': obj.gradeName,
                    'subjectName': obj.subjectName,
                    'originalNum': obj.originalNum
                };
                $scope.order.orderCourses.push(orderCourse);
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/detailRestitution.html',
                    show: true
                });
                $scope.getCustomerOrderRestitutionOrders();
            }


            function chargeOrder(obj) {
                obj.contractStartDate = new Date(obj.contractStartDate);
                obj.contractEndDate = new Date(obj.contractEndDate);
                $scope.order = angular.copy(obj);
                $scope.modalTitle = '收费';
                $scope.chargeOrderModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/charge.html',
                    show: true
                });
                $scope.getOrderCourses();
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

            function chargeBackOrder(obj) {

                obj.contractStartDate = new Date(obj.contractStartDate);
                obj.contractEndDate = new Date(obj.contractEndDate);
                $scope.order = angular.copy(obj);
                //设置总时长
                if ($scope.order.orderRule == 1) {
                    $scope.order.hours = $scope.order.totalOriginalNum;
                    $scope.order.minite = 0;
                } else {
                    $scope.order.hours = parseInt($scope.order.totalOriginalNum * 40 / 60);
                    $scope.order.minite = parseInt(($scope.order.totalOriginalNum * 40) % 60);
                }
                $scope.modalTitle = '退单';
                $scope.orderOperating = 8
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: mtModal.detail, /*'partials/sos/order/chargeback.html'*/
                    show: true
                });
                $scope.getOrderCourses();
                $scope.getOrderAchievementRatios();//获取订单的业绩比例
                $scope.getOrderRelationTeachers(); //获取订单相关教师
                $scope.getOrderPayments();
                $scope.getCustomerBelongersSelect();
            }

            function chargeBackOrderTopup(obj) {
                obj.contractStartDate = new Date(obj.contractStartDate);
                obj.contractEndDate = new Date(obj.contractEndDate);
                $scope.order = angular.copy(obj);
                $scope.modalTitle = '退单';
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/chargebackTopup.html',
                    show: true
                });
                //计算下折扣率
                $scope.order.privilegeRatio = 100 - Number(($scope.order.privilegeAmount * 100 / $scope.order.totalPrice).toFixed(1));
                $scope.order.privilegeRatio = Number($scope.order.privilegeRatio.toFixed(1));
                $scope.getOrderPayments();
                $scope.getOrderAchievementRatios();//获取订单的业绩比例
                $scope.getOrderRelationTeachers(); //获取订单相关教师
                $scope.getCustomerBelongersSelect();
                $scope.getOrderChargingScheme(); // 获取计费方案的信息
                CommonService.getGradeIdSelect().then(function (result) {
                    $scope.gradeIdsNew = result.data;
                });
            }

            function auditOrder(obj) {
                obj.contractStartDate = new Date(obj.contractStartDate);
                obj.contractEndDate = new Date(obj.contractEndDate);
                $scope.order = angular.copy(obj);
                //设置总时长
                if ($scope.order.orderRule == 1) {
                    $scope.order.hours = $scope.order.totalOriginalNum;
                    $scope.order.minite = 0;
                } else {
                    $scope.order.hours = parseInt($scope.order.totalOriginalNum * 40 / 60);
                    $scope.order.minite = parseInt(($scope.order.totalOriginalNum * 40) % 60);
                }
                $scope.modalTitle = '审核';
                $scope.orderOperating = 7
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: mtModal.detail, /*'partials/sos/order/audit.html'*/
                    show: true
                });
                $scope.getOrderCourses();
                $scope.getOrderAchievementRatios();//获取订单的业绩比例
                $scope.getOrderRelationTeachers(); //获取订单相关教师
                $scope.getOrderPayments();
                $scope.getCustomerBelongersSelect();
            }

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
                //计算下折扣率
                $scope.order.privilegeRatio = 100 - Number(($scope.order.privilegeAmount * 100 / $scope.order.totalPrice).toFixed(1));
                $scope.order.privilegeRatio = Number($scope.order.privilegeRatio.toFixed(1));
                $scope.getOrderPayments();
                $scope.getOrderAchievementRatios();//获取订单的业绩比例
                $scope.getOrderRelationTeachers(); //获取订单相关教师
                $scope.getCustomerBelongersSelect();
                $scope.getOrderChargingScheme(); // 获取计费方案的信息
                $scope.getGradeIDs();            // 获取年级
            }

            var recharges = ['orderType', 'tryListenFlag', 'orderNo', 'recharge', 'parentName', 'parentID', 'parentPhone', 'signingForm', 'orderRule', 'orderRelationTeachers', 'achievementRatios', 'orderChargingName', 'orderTeacherLevel', 'orderChargingPrice']

            function detailOrder(obj, arg) {
                debugger
                if (obj.contractStartDate) {
                    obj.contractStartDate = new Date(obj.contractStartDate);
                }
                if (obj.contractEndDate) {
                    obj.contractEndDate = new Date(obj.contractEndDate);
                }
                $scope.order = angular.copy(obj);
                //设置总时长
                if ($scope.order.orderRule == 1) {
                    $scope.order.hours = $scope.order.totalOriginalNum;
                    $scope.order.minite = 0;
                } else {
                    $scope.order.hours = parseInt($scope.order.totalOriginalNum * 40 / 60);
                    $scope.order.minite = parseInt(($scope.order.totalOriginalNum * 40) % 60);
                }
                $scope.modalTitleDetail = '查看';
                $scope.orderOperating = arg || 6
                if (arg == 7) {
                    $scope.modalTitleDetail = '审核'
                }
                if (arg == 8) {
                    $scope.modalTitleDetail = '退单'
                }
                if ($scope.order.orderCategory == 3) {
                    var promise = OrderService.masterSlaveRelation();
                    promise.then(function (result) {
                        $scope.masterSlaveRelation = result;
                    })
                    /*-----------20180815s-----------*/
                    // obj.contractStartDate = new Date(obj.contractStartDate);
                    // obj.contractEndDate = new Date(obj.contractEndDate);
                    // $scope.order = angular.copy(obj);
                    // console.log(obj)
                    /*-----------20180815n-----------*/

                    // $scope.modalTitleDetail = '查看';
                    // $scope.orderOperating = 9//充值订单详情
                    //计算下折扣率
                    $scope.order.privilegeRatio = 100 - Number(($scope.order.privilegeAmount * 100 / $scope.order.totalPrice).toFixed(1));
                    $scope.order.privilegeRatio = Number($scope.order.privilegeRatio.toFixed(1));
                    // $scope.getOrderChargingScheme(); // 获取计费方案的信息
                    $scope.getGradeIDs();            // 获取年级
                    $scope.getOrderChargingSchemeV2($scope.order)
                } else {
                    $scope.getOrderCourses();
                }
                $scope.getOrderAchievementRatios();//获取订单的业绩比例
                $scope.getOrderRelationTeachers(); //获取订单相关教师
                $scope.getOrderPayments();
                $scope.getCustomerBelongersSelect();
                /*
                    TODO:将1087行的代码放到AJAX回调函数中，获取最新的订单信息防止操作修改和收费时数据出现错误，可将AJAX请求放到1105行后面
                */
                // $scope.modal = $modal({scope: $scope, templateUrl: mtModal.detail, show: true});//'partials/sos/order/detail.html'
                // TODO:获取子详情s
                $scope.modal = $modal({scope: $scope, templateUrl: 'partials/v2.order/detail.html', show: true});
                // n

            }

            function detailOrderTopup(obj) {
                var promise = OrderService.masterSlaveRelation();
                promise.then(function (result) {
                    $scope.masterSlaveRelation = result;
                })
                obj.contractStartDate = new Date(obj.contractStartDate);
                obj.contractEndDate = new Date(obj.contractEndDate);
                $scope.order = angular.copy(obj);
                console.log(obj)
                $scope.modalTitleDetail = '查看';
                $scope.orderOperating = 9//充值订单详情
                //计算下折扣率
                $scope.order.privilegeRatio = 100 - Number(($scope.order.privilegeAmount * 100 / $scope.order.totalPrice).toFixed(1));
                $scope.order.privilegeRatio = Number($scope.order.privilegeRatio.toFixed(1));
                $scope.getOrderAchievementRatios();//获取订单的业绩比例
                $scope.getOrderRelationTeachers(); //获取订单相关教师
                $scope.getOrderPayments();
                $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/order/detailTopup.html', show: true});
                $scope.getCustomerBelongersSelect();
                $scope.getOrderChargingScheme(); // 获取计费方案的信息
                $scope.getGradeIDs();            // 获取年级
            }

            function detailOrderOTO(obj) {
                if (obj.tradeAt) {
                    obj.tradeAt = new Date(obj.tradeAt)

                }
                if (obj.contractEndDate) {
                    obj.contractEndDate = new Date(obj.contractEndDate)

                }
                if (obj.contractStartDate) {
                    obj.contractStartDate = new Date(obj.contractStartDate)

                }
                $scope.order = angular.copy(obj);
                $scope.modalTitleDetail = '查看';
                $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/order/detailOTO.html', show: true});
                $scope.getOrderPayments();
                $scope.getOrderCoursesOTO();
                $scope.getCustomerBelongersSelect();
            }

            function showOrderAddView() {
                $scope.isOrderAdding = true;
                $scope.order = {};
                $scope.crmOrderStudent = {};
                $scope.getOrderCourses();
                $scope.callServerOrderCourseSelect();
            }

            function hideOrderAddView() {
                $scope.isOrderAdding = false;
            }

            //获取订单下的全部课程列表信息
            $scope.callServerOrderCourse = function callServerOrderCourse(tableState) {
                $scope.isLoading = true;
                $scope.pagination = tableState.pagination;
                $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
                OrderService.getPageOfOrderCourse($scope.start, $scope.number, $scope.orderNo, tableState).then(function (result) {
                    $scope.orderCourses = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                });
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

            $scope.getOrderChargingScheme = function getOrderChargingScheme() {
                var model = {};
                model.id = $scope.order.orderChargingId;
                CrmChargingSchemeService.detail(model).then(function (result) {
                    $scope.order.orderChargingScheme = result;
                    $scope.order.orderChargingName = result.schemeName;
                    $scope.orderTeacherLevelList = getPricesList(result);
                    $scope.order.orderChargingPrice = getPrice(result,
                        $scope.order.orderTeacherLevel, $scope.order.gradeId);
                    if ($scope.orderCarry == undefined) return;
                    if ($scope.orderCarry.orderChargingScheme == undefined) $scope.orderCarry.orderChargingScheme = {};
                    $scope.orderCarry.orderChargingScheme = result;
                    $scope.orderCarry.orderChargingName = result.schemeName;
                    $scope.orderCarry.orderChargingPrice = getPrice(result,
                        $scope.order.orderTeacherLevel, $scope.order.gradeId);

                });
            }
            // TODO:20180101
            $scope.getOrderChargingSchemeV2 = function getOrderChargingSchemeV2(order) {

                var model = {};
                model.id = order.orderChargingId;
                CrmChargingSchemeService.detail(model).then(function (result) {
                    order.orderChargingScheme = result;
                    order.orderChargingName = result.schemeName;
                    order.orderChargingPrice = getPrice(result, order.orderTeacherLevel, order.gradeId);
                    order._orderTeacherLevelList = getPricesList(result);

                });
            }
            // 展示学生年级
            $scope.getGradeIDs = function getGradeIDs() {
                CommonService.getGradeIdSelect().then(function (result) {
                    $scope.gradeIds = result.data;
                });
            }

            //订单的课程信息列表
            $scope.getOrderCoursesOTO = function getOrderCoursesOTO() {
                OrderService.getOrderCourses($scope.start, $scope.number, $scope.order.orderNo, $scope.order.crmStudentId).then(function (result) {
                    $scope.order.orderCourses = result.data;
                    //计算订单信息属性
                    $scope.totalPastCourse = 0;
                    $scope.currentMonthPastCourse = 0;
                    angular.forEach($scope.order.orderCourses, function (data, index, array) {
                        //获取试听老师
                        if (data.teacherId != null) {
                            UserService.get(data.teacherId).then(function (result) {
                                data.teacherName = result.name;
                            });
                        }
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
                        //获取订单累计已消课时（订单总课时-订单剩余课时 ）
                        searchModel.searchStartTime = null;
                        searchModel.searchEndTime = null;
                        CoursePlanService.getList(searchModel)
                            .then(function (result) {
                                angular.forEach(result.list, function (data, index, array) {
                                    var courseNum = 0;
                                    if ($scope.order.orderRule === 1) {
                                        courseNum = (data.endTime - data.startTime) / (1000 * 60 * 60);
                                    } else if ($scope.order.orderRule === 2) {
                                        courseNum = (data.endTime - data.startTime) / (1000 * 60 * 40);
                                    }
                                    $scope.totalPastCourse = $scope.totalPastCourse + courseNum;
                                });
                            });
                    });
                    //根据student 获取客户试听的教师列表
                    OrderService.getStudentAuditionTeachingList($scope.order.crmStudentId).then(function (result) {
                        $scope.Teachers = result.data;

                        //$scope.initData();
                    });
                    $scope.initData();
                });
            };

            $scope.orderCourseSubjectName = function (course) {
                if (course.subjectType == 1 || course.subjectType == 2) {
                    return course.subjectName;
                } else if (course.subjectType == 3) {
                    var name = '';
                    for (var i = 0; i < course.subjects.length; i++) {
                        name += course.subjects[i].name;
                        if (i < course.subjects.length - 1) {
                            name += ','
                        }
                    }
                    return name;
                }
                return '';
            }

            //订单的课程信息列表
            $scope.getOrderCourses = function getOrderCourses(order) {
                var flag = 0
                if (order) {
                    flag = 1
                } else {
                    order = $scope.order
                }

                OrderService.getOrderCourses($scope.start, $scope.number, order.orderNo, order.crmStudentId).then(function (result) {
                    order.orderCourses = result.data;
                    //计算订单信息属性
                    $scope.totalPastCourse = 0;
                    $scope.currentMonthPastCourse = 0;
                    angular.forEach(order.orderCourses, function (data, index, array) {
                        //获取试听老师
                        if (data.teacherId != null) {
                            UserService.get(data.teacherId).then(function (result) {
                                data.teacherName = result.name;
                            });
                        }
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
                                    if (order.orderRule === 1) {
                                        courseNum = (data.endTime - data.startTime) / (1000 * 60 * 60);
                                    } else if (order.orderRule === 2) {
                                        courseNum = (data.endTime - data.startTime) / (1000 * 60 * 40);
                                    }
                                    $scope.currentMonthPastCourse = $scope.currentMonthPastCourse + courseNum;
                                });
                            });
                        //获取订单累计已消课时（订单总课时-订单剩余课时 ）
                        searchModel.searchStartTime = null;
                        searchModel.searchEndTime = null;
                        CoursePlanService.getList(searchModel)
                            .then(function (result) {
                                angular.forEach(result.list, function (data, index, array) {
                                    var courseNum = 0;
                                    if (order.orderRule === 1) {
                                        courseNum = (data.endTime - data.startTime) / (1000 * 60 * 60);
                                    } else if (order.orderRule === 2) {
                                        courseNum = (data.endTime - data.startTime) / (1000 * 60 * 40);
                                    }
                                    $scope.totalPastCourse = $scope.totalPastCourse + courseNum;
                                });
                            });
                    });
                    //根据student 获取客户试听的教师列表
                    OrderService.getStudentAuditionTeachingList(order.crmStudentId).then(function (result) {
                        $scope.Teachers = result.data;
                    });
                    $scope.initData(flag ? order : '');
                });
            };

            /**
             * 获取订单的业绩分配比例
             */
            $scope.getOrderAchievementRatios = function getOrderAchievementRatios() {
                OrderService.getOrderAchievementRatios($scope.order.id, 0).then(function (result) {
                    $scope.order.achievementRatios = result.data;
                    if ($scope.order.achievementRatios.length > 0) {
                        for (var i = 0; i < $scope.order.achievementRatios.length; i++) {
                            $scope.order.achievementRatios[i].position = {};
                            $scope.order.achievementRatios[i].position.id = $scope.order.achievementRatios[i].positionId;
                            $scope.order.achievementRatios[i].position.postionName = $scope.order.achievementRatios[i].positionName;
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
             * 获取订单的业绩分配比例
             */
            $scope.getOrderAchievementRatiosC = function getOrderAchievementRatiosC() {
                OrderService.getOrderAchievementRatios($scope.orderCarry.id, 0).then(function (result) {
                    $scope.orderCarry.achievementRatios = result.data;
                    if ($scope.orderCarry.achievementRatios.length > 0) {
                        for (var i = 0; i < $scope.orderCarry.achievementRatios.length; i++) {
                            $scope.orderCarry.achievementRatios[i].position = {};
                            $scope.orderCarry.achievementRatios[i].position.id = $scope.orderCarry.achievementRatios[i].positionId;
                            $scope.orderCarry.achievementRatios[i].position.postionName = $scope.orderCarry.achievementRatios[i].positionName;
                        }
                    }
                })
            }
            /**
             * 获取试听教师、授课教师列表
             */
            $scope.getOrderRelationTeachersC = function getOrderRelationTeachersC() {
                OrderService.getOrderAchievementRatios($scope.orderCarry.id, 3).then(function (result) {
                    $scope.orderCarry.orderRelationTeachers = result.data;
                    if ($scope.orderCarry.orderRelationTeachers.length > 0) {
                        for (var i = 0; i < $scope.order.orderRelationTeachers.length; i++) {
                            $scope.orderCarry.orderRelationTeachers[i].position = {};
                            $scope.orderCarry.orderRelationTeachers[i].position.id = $scope.orderCarry.orderRelationTeachers[i].positionId;
                            $scope.orderCarry.orderRelationTeachers[i].position.postionName = $scope.orderCarry.orderRelationTeachers[i].positionName;
                        }
                    }
                })
            }

            $scope.getOrderCoursesUpdate = function getOrderCoursesUpdate() {
                OrderService.getOrderCourses($scope.start, $scope.number, $scope.order.orderNo, $scope.order.crmStudentId).then(function (result) {
                    $scope.order.orderCourses = result.data;
                    $scope.initData();
                });
            };

            /**
             * 订单的缴费记录信息列表
             */
            $scope.getOrderPayments = function getOrderPayments() {
                OrderService.getOrderPayments($scope.start, $scope.number, $scope.order.orderNo).then(function (result) {
                    $scope.orderPayments = result.data;
                    $scope.order.crmorderPayments = result.data;
                    angular.forEach($scope.order.crmorderPayments, function (data, index, array) {
                        data.paymentEdit = true;
                    });
                });
            };

            //获取课程类型 年级 科目 下拉菜单
            $scope.callServerOrderCourseSelect = function callServerOrderCourseSelect() {
                OrderService.getSubjectIdSelect().then(function (result) {
                    $scope.subjectIds = result.data;
                });
                CommonService.getGradeIdSelect().then(function (result) {
                    $scope.gradeIds = result.data;
                    $scope.leadGradeIds = result.data;
                });
                OrderService.getCourseTypeIdSelect().then(function (result) {
                    $scope.courseTypeIds = result.data;
                });
            };

            //订单删除课程信息
            $scope.delOrderCourse = function delOrderCourse(obj) {
                $scope.order.orderCourses.pop(obj);
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

            /**
             * 判断是否为线上运营人员岗位
             */
            $scope.isO2OOperationSpecialist = function () {
                var isO2OOperationSpecialist = false;
                try {
                    if (AuthenticationService.currentUser().position_id == Constants.PositionID.O2O_OPERATION_SPECIALIST) {
                        isO2OOperationSpecialist = true;
                    }
                } catch (e) {
                    return isO2OOperationSpecialist
                }
                return isO2OOperationSpecialist;
            }

            $scope.orderFilter = {};
            $scope.oneOrders = [];
            $scope.tableState = {};
            //普通订单
            $scope.hasChargeBackOrderPermission = false;
            /**
             *  * 普通订单列表接口
              地址：yws-api-crm/orders
              请求协议：GET
              请求参数：参照原普通订单列表的参数，在此基础上，在orderJson中添加level属性，属性值为1
              返回参数：在原对象的基础上添加tryListenFlag：是否试听签单，0：否；1：是

             * @type {{level: number}}
             */
            $scope.callServerOneTabGo = function () {
                $scope.callServerOneTabGotableState.pagination.start = 0
                $scope.callServerOneTabGotableState.pagination.pageNum = 1
                $scope.callServerOneTab($scope.callServerOneTabGotableState);
            }
            $scope.callServerOneTab = function callServerOneTab(tableState) {
                if ($scope.___isGo) {
                    location.replace(location.href.split('?')[0])
                }

                $scope.oneOrders.length = 0
                if ($scope.modalForStudentList) {
                    $scope.modalForStudentList.hide()
                }
                if (localStorageService.get('position_id') == Constants.PositionID.HEADMASTER
                    || localStorageService.get('position_id') == Constants.PositionID.FINANCIAL_AFFAIRS
                    || localStorageService.get('position_id') == Constants.PositionID.KXP_HEADMASTER
                    || localStorageService.get('position_id') == Constants.PositionID.KXP_FINANCIAL
                    || localStorageService.get('position_id') == Constants.PositionID.YSB_HEADMASTER
                    || localStorageService.get('position_id') == Constants.PositionID.YSB_FINANCIAL
                    || localStorageService.get('position_id') == Constants.PositionID.YSP_HEADMASTER
                    || localStorageService.get('position_id') == Constants.PositionID.YSP_FINANCIAL
                ) {
                    $scope.hasChargeBackOrderPermission = true;
                }
                if ($scope.isO2OOperationSpecialist()) {
                    $scope.orderFilter.mediaChannelId1 = Constants.MediaChannel.CHANNEL8;
                    $scope.orderMediaChannel1Change();
                }
                $scope.isLoading = true;
                $scope.orderFlag = 13;
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

                //如果是呼叫权限的人，则查询所属机构下校区的数据，呼叫客信的数据
                if ($rootScope.showPermissions('PermissionForCallCenter')) {
                    $scope.orderFilter.mediaChannelId1 = 1;
                    $scope.orderFilter.mediaChannelId2 = 30;
                    //传递部门id
                    $scope.orderFilter.departmentId = localStorageService.get('department_id');
                    $scope.orderFilter.PermissionForCallCenter = '1';
                }
                $scope.callServerOneTabGotableState = tableState
                // 2017-12-29 添加level
                $scope.orderFilter.level = 1
                OrderService.getPage($scope.start, $scope.number, $scope.orderFlag, $scope.orderFilter).then(function (result) {
                    if (result.data != null) {
                        // console.log(result.data);
                        $scope.oneOrders = result.data;
                    } else {
                        $scope.oneOrders = [];
                    }

                    tableState.pagination = tableState.pagination || {}
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                    try {
                        $rootScope._getIndexData_(5)
                        $rootScope._getIndexData_(3)
                    } catch (e) {
                    }
                    setTimeout(function () {
                        if ($routeParams.v3 == 1 && !$scope.___isGo) {
                            $scope.___isGo = true
                            if (!$scope.modal) {
                                $scope.addstudentOrderV2(0)
                            }
                        } else if ($scope.modal) {
                            $scope.modal.hide()
                        }
                        ColEdit.initCol($scope)
                        angular.element('body').scroll()
                    })
                });

                var promise = OrderService.masterSlaveRelation();
                promise.then(function (result) {
                    $scope.masterSlaveRelation = result;
                })
            };
            // TODO：20171230 李世明   s
            $scope.suborders = []
            /**
             * 获取子订单
             * @param masterOrderId
             * 主订单id
             */
            $scope.getSuborders = function (id, flag) {
                var masterOrderId = ''
                if (typeof id == 'object') {
                    masterOrderId = id.id
                } else {
                    masterOrderId = id
                }
                // 是否包含子订单：hasSlaveInfos
                $scope.suborders = []
                if (masterOrderId) {
                    var promise = OrderService.getSuborders(masterOrderId)
                    if (!flag) {
                        $scope.subOrderModal = $modal({
                            scope: $scope,
                            templateUrl: 'partials/v2.order/sub.html',
                            show: true
                        });
                        promise.then(function (result) {
                            var _orders = [angular.copy(id)]
                            $scope.suborders = _orders.concat(result.data)
                            console.log($scope.suborders)
                        })
                    } else {
                        return promise
                    }

                }
            }
            // TODO：20171230 李世明   n
            /*
             * 判断是学习顾问主管 主页面不给edit标签  但查看中能有TT~
             */
            $scope.canOperateMore = true;
            $scope.loginUser = AuthenticationService.currentUser();
            if ($scope.loginUser.position_id === Constants.PositionID.STUDENT_CHIEF_OFFICER) {
                $scope.canOperateMore = false;
            }

            $scope.payDueAmount = -1;
            $scope.quick = [];
            $scope.quickSelected = function (i) {
                if (i == 0) {
                    if ($scope.quick[0]) {
                        $scope.quick[0] = false;
                        delete $scope.orderFilter['orderStatus'];
                        delete $scope.orderFilter['payDueAmount'];
                        //$scope.orderFilter.payDueAmount = -1;
                    } else {
                        $scope.quick[0] = true;
                        $scope.orderFilter.orderStatus = '2';
                        $scope.orderFilter.payDueAmount = 0;
                    }
                }
                $scope.tableState.pagination.start = 0;
                $scope.tableState.pagination.number = 10;
                $scope.callServerOneTab($scope.tableState);
            };

            //转课
            $scope.callServerTwoTab = function callServerTwoTab(tableState) {
                $scope.orderFlag = 2;
                $scope.isLoading = true;
                $scope.tableState2 = tableState;
                $scope.pagination = tableState.pagination;
                $scope.predicateObject = tableState.search.predicateObject;
                $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.

                //如果是呼叫权限的人，则查询所属机构下校区的数据，呼叫客信的数据
                if ($rootScope.showPermissions('PermissionForCallCenter')) {
                    if (!$scope.predicateObject) {
                        $scope.predicateObject = {};
                    }
                    $scope.predicateObject.mediaChannelId1 = 1;
                    $scope.predicateObject.mediaChannelId2 = 30;
                    //传递部门id
                    $scope.predicateObject.departmentId = localStorageService.get('department_id');
                    $scope.predicateObject.PermissionForCallCenter = '1';
                }

                OrderService.getPage($scope.start, $scope.number, $scope.orderFlag, $scope.predicateObject).then(function (result) {
                    $scope.twoOrders = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                    try {
                        $rootScope._getIndexData_(5)
                        $rootScope._getIndexData_(3)
                    } catch (e) {
                    }
                });
            };

            //返课
            $scope.callServerThreeTab = function callServerThreeTab(tableState) {
                $scope.orderFlag = 3;
                $scope.isLoading = true;
                $scope.tableState3 = tableState;
                $scope.pagination = tableState.pagination;
                $scope.predicateObject = tableState.search.predicateObject;
                $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.

                //如果是呼叫权限的人，则查询所属机构下校区的数据，呼叫客信的数据
                if ($rootScope.showPermissions('PermissionForCallCenter')) {
                    if (!$scope.predicateObject) {
                        $scope.predicateObject = {};
                    }
                    $scope.predicateObject.mediaChannelId1 = 1;
                    $scope.predicateObject.mediaChannelId2 = 30;
                    //传递部门id
                    $scope.predicateObject.departmentId = localStorageService.get('department_id');
                    $scope.predicateObject.PermissionForCallCenter = '1';
                }

                OrderService.getPage($scope.start, $scope.number, $scope.orderFlag, $scope.predicateObject).then(function (result) {
                    $scope.threeOrders = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                    try {
                        $rootScope._getIndexData_(5)
                        $rootScope._getIndexData_(3)
                    } catch (e) {
                    }
                });
            };

            CommonService.getMediaChannel(0).then(function (result) {
                //alert("getMediaChannel");
                $scope.mediaChannel1List = result.data;
            });

            $scope.orderMediaChannel1Change = function orderMediaChannel1Change() {

                $scope.order.mediaChannelId1 = $scope.orderFilter.mediaChannelId1 || $scope.order.mediaChannelId1;
                if ($scope.predicateObject && $scope.predicateObject.mediaChannelId2) {
                    $scope.predicateObject.mediaChannelId2 = null;
                }

                if ($scope.predicateObject && $scope.predicateObject.mediaChannelId1) {
                    $scope.predicateObject.mediaChannelId1 = "number:" + $scope.order.mediaChannelId1;
                }
                //console.log($scope.mediaChannel1List);
                if ($scope.order.mediaChannelId1) {
                    CommonService.getMediaChannel($scope.order.mediaChannelId1).then(function (result) {
                        $scope.mediaChannel2List = result.data;
                        //alert("$scope.mediaChannel2List"+$scope.mediaChannel2List);
                    });
                } else {
                    $scope.mediaChannel2List = [];
                }
            }
            $scope.orderMediaChannel2Change = function orderMediaChannel2Change() {

                $scope.order.mediaChannelId2 = $scope.orderFilter.mediaChannelId2 || $scope.order.mediaChannelId2;
                if ($scope.predicateObject && $scope.predicateObject.mediaChannelId3) {
                    $scope.predicateObject.mediaChannelId3 = null;
                }

                if ($scope.predicateObject && $scope.predicateObject.mediaChannelId2) {
                    $scope.predicateObject.mediaChannelId2 = "number:" + $scope.order.mediaChannelId2;
                }
                //console.log($scope.mediaChannel1List);
                if ($scope.order.mediaChannelId2) {
                    CommonService.getMediaChannel($scope.order.mediaChannelId2).then(function (result) {
                        $scope.mediaChannel3List = result.data;
                        //alert("$scope.mediaChannel2List"+$scope.mediaChannel2List);
                    });
                } else {
                    $scope.mediaChannel3List = [];
                }
            }
            /** order management end **/
            ;
            (function init() {
                //$scope.leadsRepeatAlert = false;
                if (check_null($routeParams.type) && !$scope.modalForStudentList) {
                    $scope.showStudentListModal();//打开 添加订单 medal
                }
            })();


            /***************************    订单导出功能start    ***************************/
            /**
             * 导出已审核的订单【审核通过】、【已退费】
             */
            $scope.exportReviewedOrders = function () {
                //导出时候，去查询所有符合条件的list
                $scope.orderFlag = 1;
                //先去分页查询一次，得到总的导出的订单数，再去分组导出
                if (!$scope.predicateObject) {
                    $scope.predicateObject = {};
                }
                $scope.predicateObject.status = "-2";
                // 默认清空合同时间
                $scope.predicateObject.contract_start_time_begin = "";
                $scope.predicateObject.contract_end_time_end = "";
                // 封装订单签约开始时间、结束时间
                if ($scope.orderFilter.contract_start_time_begin != "") {
                    var contractStartDate = $scope.orderFilter.contract_start_time_begin;
                    $scope.predicateObject.contract_start_time_begin = contractStartDate;
                }
                if ($scope.orderFilter.contract_end_time_end != "") {
                    var contractEndDate = $scope.orderFilter.contract_end_time_end;
                    $scope.predicateObject.contract_end_time_end = contractEndDate;
                }
                OrderService.getPage(0, 10, $scope.orderFlag, $scope.predicateObject).then(function (result) {
                    var total = result.total;//当前要导出的数据总数
                    if (total == 0) {
                        SweetAlert.swal("无记录可导出，请确认", "", 'info');
                        return false;
                    }
                    $scope.predicateObject.total = total;
                    $scope.orderFlag = 2;
                    OrderService.getList(0, 0, $scope.orderFlag, $scope.predicateObject).then(function (response) {
                        $scope.listModels = response.data;
                        angular.forEach($scope.listModels, function (p, index) {
                            p.index = index + 1;
                            if (p.orderStatus == undefined) {
                                p.orderStatus = "";
                            } else if (p.orderStatus == 3) {
                                p.orderStatus = "已审核"
                            } else if (p.orderStatus == 9) {
                                p.orderStatus = "已退费"
                            }
                            p.orderBackDate = p.orderBackDate == undefined || p.orderBackDate == null ? "" : (new Date(p.orderBackDate).Format("yyyy-MM-dd"));
                            p.contractStartDate = p.contractStartDate == undefined ? "" : (new Date(p.contractStartDate).Format("yyyy-MM-dd"));
                            //订单类型
                            p.orderType = p.orderType == undefined ? "" :
                                (p.orderType == 1 ? "新签" :
                                    (p.orderType == 2 ? "续费" :
                                        (p.orderType == 4 ? "转课" :
                                            (p.orderType == 8 ? "赠课" :
                                                (p.orderType == 7 ? "o2o线上" :
                                                    (p.orderType == 5 ? "推荐" : ""))))));
                            // 方式
                            p.orderCategory = p.orderCategory == undefined ? "" :
                                (p.orderCategory == 1 ? "买课" :
                                    (p.orderCategory == 2 ? "app" :
                                        (p.orderCategory == 3 ? "充值" : "")));
                        });
                        $scope.doExportOrderCheck();
                    });
                });
            }
            /**
             *  导出已审核的订单【审核通过】、【已退费】
             */
            $scope.doExportOrderCheck = function () {
                var titleName = "查询条件：";
                var searchCondition = "";
                var exportTableStyle = {
                    sheetid: titleName,
                    headers: true,
                    column: {style: 'font-size:16px; text-align:left;'},
                    columns: [
                        {columnid: 'index', title: '序号'},
                        {columnid: 'orderBelongSchool', title: '订单所属校区'},
                        {columnid: 'month', title: '当前月份'},
                        {columnid: 'orderNo', title: '合同编号'},
                        {columnid: 'orderCategory', title: '方式'},
                        {columnid: 'orderStatus', title: '订单状态'},
                        {columnid: 'studentName', title: '学生姓名'},
                        {columnid: 'studentGrage', title: '学生年级'},
                        {columnid: 'normalCourseHour', title: '正课课时'},
                        {columnid: 'freeCourseHour', title: '赠课课时'},
                        {columnid: 'backCourseHour', title: '返课课时'},
                        {columnid: 'totalCourseHour', title: '总课时'},
                        {columnid: 'realTotalAmountAll', title: '订单总价'},
                        {columnid: 'privilegeAmount', title: '直减优惠'},
                        {columnid: 'realPayAmount', title: '实际收款金额'},
                        {columnid: 'avgCoursePrice', title: '平均课时单价'},
                        {columnid: 'contractStartDate', title: '签约日期'},
                        {columnid: 'currentPastCourse', title: '本月消课小时数'},
                        {columnid: 'currentPastCoursePrice', title: '本月消课收入'},
                        {columnid: 'orderAllPastCourse', title: '累计消课小时数'},
                        {columnid: 'orderAllPastCoursePrice', title: '累计消课收入'},
                        {columnid: 'orderSurplusPrice', title: '合同剩余金额'},
                        {columnid: 'orderType', title: '订单类型'},
                        {columnid: 'channelResource', title: '来源'},
                        {columnid: 'achievementPerson', title: '业绩所属人'},
                        {columnid: 'belongStudentOfficer', title: '所属学习顾问'},
                        {columnid: 'trailListeningTeacher', title: '试听教师'},
                        {columnid: 'orderBackPrice', title: '退款金额'},
                        {columnid: 'orderBackDate', title: '退款日期'},
                    ],
                    row: {
                        style: function (sheet, row, rowidx) {
                            return 'background:' + (rowidx % 2 ? '#FFFFFF' : '#A1C1FB');
                        }
                    },
                    cells: {
                        style: 'font-size:13px; text-align:left;'
                    }
                };
                alasql('SELECT * INTO XLS("已审核订单详细列表.xls", ?) FROM ?', [exportTableStyle, $scope.listModels]);
            }
            /**
             * 导出未审核订单（订单状态为【录入订单】和【支付定金】的订单）
             */
            $scope.exportUnreviewedOrders = function () {
                //导出时候，去查询所有符合条件的list
                $scope.orderFlag = 1;
                //$scope.isLoading = true;
                //除了现有的条件，还要筛选【录入订单】和【支付定金】状态的订单
                //先去分页查询一次，得到总的导出的订单数，再去分组导出
                if (!$scope.predicateObject) {
                    $scope.predicateObject = {};
                }
                $scope.predicateObject.orderStatus = -1;//未审核订单，到后台会分两次查，分别是1、2
                // 封装订单签约开始时间、结束时间
                // 默认清空合同时间
                $scope.predicateObject.contract_start_time_begin = "";
                $scope.predicateObject.contract_end_time_end = "";
                if ($scope.orderFilter.contract_start_time_begin != "") {
                    var contractStartDate = $scope.orderFilter.contract_start_time_begin;
                    $scope.predicateObject.contract_start_time_begin = contractStartDate;
                }
                if ($scope.orderFilter.contract_end_time_end != "") {
                    var contractEndDate = $scope.orderFilter.contract_end_time_end;
                    $scope.predicateObject.contract_end_time_end = contractEndDate;
                }
                OrderService.getPage(0, 10, $scope.orderFlag, $scope.predicateObject).then(function (result) {
                    var total = result.total;//当前要导出的数据总数
                    if (total == 0) {
                        SweetAlert.swal("无记录可导出，请确认", "", 'info');
                        return false;
                    }
                    $scope.predicateObject.total = total;
                    OrderService.getList(0, 0, $scope.orderFlag, $scope.predicateObject).then(function (response) {
                        $scope.listModels = response.data;
                        angular.forEach($scope.listModels, function (p, index) {
                            p.index = index + 1;
                            p.orderStatus = p.orderStatus == undefined ? "" : (p.orderStatus == 1 ? "录入订单" : "支付定金");
                            p.signingDate = p.signingDate == undefined ? "" : (new Date(p.signingDate).Format("yyyy-MM-dd"));
                            p.latestPayDate = p.latestPayDate == undefined ? "" : (new Date(p.latestPayDate).Format("yyyy-MM-dd"));
                            p.orderTotalPrice = p.orderTotalPrice == undefined ? 0 : p.orderTotalPrice;
                            p.orderDiscountPrice = p.orderDiscountPrice == undefined ? 0 : p.orderDiscountPrice;
                            p.orderPayPrice = p.orderPayPrice == undefined ? 0 : p.orderPayPrice;
                            p.orderLeftPrice = p.orderLeftPrice == undefined ? 0 : p.orderLeftPrice;
                            //订单类型
                            p.orderType = p.orderType == undefined ? "" :
                                (p.orderType == 1 ? "新签" :
                                    (p.orderType == 2 ? "续费" :
                                        (p.orderType == 4 ? "转课" :
                                            (p.orderType == 8 ? "赠课" :
                                                (p.orderType == 7 ? "o2o线上" :
                                                    (p.orderType == 5 ? "推荐" : ""))))));
                            p.orderCategory = p.orderCategory == undefined ? "" :
                                (p.orderCategory == 1 ? "买课" :
                                    (p.orderCategory == 2 ? "app" :
                                        (p.orderCategory == 3 ? "充值" : "")));
                        });
                        $scope.doExport();
                    });
                });
            }

            /**
             * 开始导出
             */
            $scope.doExport = function () {
                var titleName = "查询条件：";
                var searchCondition = "";
                var exportTableStyle = {
                    sheetid: titleName,
                    headers: true,
                    column: {style: 'font-size:16px; text-align:left;'},
                    columns: [
                        {columnid: 'index', title: '序号'},
                        {columnid: 'orderBelongSchool', title: '订单所属校区'},
                        {columnid: 'month', title: '当前月份'},
                        {columnid: 'contractNo', title: '合同编号'},
                        {columnid: 'orderCategory', title: '方式'},
                        {columnid: 'orderStatus', title: '订单状态'},
                        {columnid: 'studentName', title: '学生姓名'},
                        {columnid: 'studentGrage', title: '学生年级'},
                        {columnid: 'normalCourseHour', title: '正课课时'},
                        {columnid: 'freeCourseHour', title: '赠课课时'},
                        {columnid: 'backCourseHour', title: '返课课时'},
                        {columnid: 'totalCourseHour', title: '总课时'},
                        {columnid: 'orderTotalPrice', title: '订单总价'},
                        {columnid: 'orderDiscountPrice', title: '直减优惠'},
                        {columnid: 'orderPayPrice', title: '实际收款金额'},
                        {columnid: 'orderLeftPrice', title: '尾款金额'},
                        {columnid: 'signingDate', title: '签约日期'},
                        {columnid: 'latestPayDate', title: '最近缴款日期'},
                        {columnid: 'orderType', title: '订单类型'},
                        {columnid: 'channelResource', title: '来源'},
                        {columnid: 'achievementPerson', title: '业绩所属人'},
                        {columnid: 'belongStudentOfficer', title: '所属学习顾问'},
                        {columnid: 'trailListeningTeacher', title: '试听教师'},
                    ],
                    row: {
                        style: function (sheet, row, rowidx) {
                            return 'background:' + (rowidx % 2 ? '#FFFFFF' : '#A1C1FB');
                        }
                    },
                    cells: {
                        style: 'font-size:13px; text-align:left;'
                    }
                };
                alasql('SELECT * INTO XLS("未审核订单详细列表.xls", ?) FROM ?', [exportTableStyle, $scope.listModels]);
            }

            /***************************    订单导出功能end    ***************************/
            $timeout(function () {
                $("[data-toggle='tooltip']").tooltip();
            }, 1000);
            $scope.$editColList = [
                //0
                {
                    id: 1,
                    name: '学员姓名',
                    select: 1
                },
                {
                    id: 2,
                    name: '手机号',
                    select: 1
                },
                {
                    id: 3,
                    name: '校区',
                    select: 0
                },
                //4订单类型
                //5方式
                {
                    id: 6,
                    name: '订单状态',
                    select: 1
                },
                {
                    id: 7,
                    name: '签约时间',
                    select: 1
                },
                {
                    id: 8,
                    name: '主从关系',
                    select: 1
                },
                {
                    id: 9,
                    name: '来源',
                    select: 0
                },
                //10总课时数
                //11剩余课时数
                //12总课次
                //13剩余课次
                {
                    id: 12,
                    name: '充值金额',
                    select: 1
                },
                {
                    id: 13,
                    name: '剩余金额',
                    select: 1
                },
                {
                    id: 16,
                    name: '业绩所属人',
                    select: 1
                },
                {
                    id: 17,
                    name: '转平台',
                    select: 1
                },
                {
                    id: 18,
                    name: '师资档位',
                    select: 0
                },
                {
                    id: 19,
                    name: '操作',
                    select: 1
                }
            ]
            //  TODO:选则列功能
            /**
             * 控制显示
             * @param arg
             */
            $scope.showCol = function (arg) {
                ColEdit.showCol(arg)
            }

            /**
             * 选择显示
             * @param index
             * 对应的下标
             */
            $scope.selectCol = function (index) {
                ColEdit.selectCol(index)
            }

            /**
             * 全选
             */
            $scope.selectColAll = function () {
                ColEdit.selectColAll()
            }
            /**
             * 恢复编辑列
             */
            $scope.reastCol = function () {
                ColEdit.reastCol()
            }
            ColEdit.isHasData($scope, '_orderEditColList');
            $scope.QYDatas = [{"name": "今日", "id": 1}, {"name": "昨日", "id": 2}, {"name": "本周", "id": 10}, {
                "name": "上周",
                "id": 12
            }, {"name": "本月", "id": 13}, {"name": "上月", "id": 14}, {"name": "自定义", "id": 8}];

            $scope.KSDatas = [{"name": "小于20", "id": 26}, {"name": "20至49", "id": 27}, {
                "name": "50至99",
                "id": 28
            }, {"name": "100至199", "id": 29}, {"name": "200及已上", "id": 30}, {"name": "自定义", "id": 8}];

            $scope.JEDatas = [{"name": "小于1万", "id": 31}, {"name": "1-3万", "id": 32}, {
                "name": "3-5万",
                "id": 33
            }, {"name": "5-10万", "id": 34}, {"name": "10万以上", "id": 35}, {"name": "自定义", "id": 8}];
            /**
             * 改变查询更多按钮
             */
            $scope.selectMoreText = '更多查询条件'
            $scope.changeSelectMore = function (flag) {
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
            $scope.resetSelectOrder = function () {
                $scope.orderFilter = {}
                $scope.callServerOneTabGo()
            }

            //过滤无尾款订单
            function guoLvWuWeiKuan() {
                $scope.isguoLvWuWeiKuan = !$scope.isguoLvWuWeiKuan;
                if ($scope.isguoLvWuWeiKuan) {
                    $scope.orderFilter.payDueAmountFilter = 0;
                } else {
                    $scope.orderFilter.payDueAmountFilter = undefined;
                }
                $scope.callServerOneTab($scope.callServerOneTabGotableState);
                console.log($scope.orderFilter);
                console.log($scope.oneOrders);
            }

            // 根据订单的总课时数字链接，点击查询课程子表信息
            function getDetail(obj) {
                obj.contractStartDate = new Date(obj.contractStartDate);
                obj.contractEndDate = new Date(obj.contractEndDate);
                $scope.order = angular.copy(obj);
                $scope.modalTitleDetail = '查看';
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: "partials/sos/order/orderCourseDetail.html",
                    show: true
                });
                $scope.getOrderCoursesByOrder();
            }

            //订单的课程信息列表
            function getOrderCoursesByOrder() {
                OrderService.getOrderCourses($scope.start, $scope.number, $scope.order.orderNo, $scope.order.crmStudentId).then(function (result) {
                    $scope.order.orderCourses = result.data;
                    angular.forEach($scope.order.orderCourses, function (data, index, array) {
                        //获取试听老师
                        if (data.teacherId != null) {
                            UserService.get(data.teacherId).then(function (result) {
                                data.teacherName = result.name;
                            });
                        }
                    });
                    $scope.initData();
                });
            };

            /*
             * 先收费功能
             */
            $scope.showChargeModal = function showChargeModal() {
                $scope.order = {};
                sessionStorage.setItem("orderJudgeEntrance", "firstCharge")
                CommonService.getGradeIdSelect().then(function (result) {
                    $scope.leadGradeIds = result.data;
                    $scope.modalTitleCharge = '先收费';
                    $scope.modal = $modal({
                        scope: $scope,
                        templateUrl: "optimize/modal/order/modal.firstCharge.html",
                        show: true
                    });
                });
            }
            //先收费的额手机 重复验证
            $scope.repeatFroCreate = function (phone) {
                if (!phone) {
                    return;
                }
                if (phone.toString().length < 7) {
                    return;
                }
                var phoneVo = {"phone": phone};
                // if($scope.order && $scope.order.crm_student_id){
                //     phoneVo.id = $scope.order.crm_student_id;
                // }
                //console.log(phoneVo);
                var promise = CommonService.repeat(phoneVo);
                promise.then(
                    function (data) {
                        if (data.status == 'FAILURE') {
                            //alert(data.data.repeateMsg);
                            /*SweetAlert.swal(data.data.repeateMsg,"学生姓名:"+data.data.name+"    所属人:"+data.data.userName
                             +"    学生状态:"+(data.data.state == 1 ? "在读学员" : "意向客户"));*/
                            SweetAlert.swal("电话号码重复，重新输入");
                            $scope.order.leadPhone = null
                            // $scope.repeateData = data.data;
                            // $scope.modalForRepeatTitle = '电话号码已存在';
                            // $scope.modalForRepeat = $modal({scope: $scope, templateUrl: 'partials/sos/leads/modal.repeate.html', show: true });
                        }
                    },
                    function (data) {
                        // console.log(data);
                    }
                );
            }

            /**
             * 先收费-未签约时的查看
             */
            function detailOrderFirstCharge(obj) {

                $scope.order = angular.copy(obj);
                $scope.modalTitleDetail = '查看';
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: "optimize/modal/order/detail.firstCharge.html",
                    show: true
                });
                $scope.getOrderAchievementRatios();//获取订单的业绩比例
                $scope.getOrderPayments();
            }

            function editOrderFirstCharge(obj) {
                $scope.order = angular.copy(obj);
                $scope.modalTitleEdit = '修改';
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: "optimize/modal/order/update.firstCharge.html",
                    show: true
                });
                $scope.getOrderAchievementRatios();//获取订单的业绩比例
                $scope.getOrderPayments();
            }

            /**
             * 签约
             */
            function signOrder(obj) {
                sessionStorage.setItem("orderJudgeEntrance", 'addOrder');
                $scope.order = angular.copy(obj);
                $scope.orderCopy = angular.copy(obj);
                $scope.order.recharge = angular.copy(obj);
                $scope.modalTitle = '签约';
                $scope.showCreat = 1;
                if (Number($scope.order.privilegeAmount) == 0) {
                    $scope.order.privilegeRatio = 100;
                }
                if (Number($scope.order.recharge.privilegeAmount) == 0) {
                    $scope.order.recharge.privilegeRatio = 100;
                }
                $scope.editOrderModal = $modal({scope: $scope, templateUrl: mtModal.addV2, show: true}); // 变量mtModal在config.js中定义，optimize/modal/order/add.html
                $rootScope.orderModalV2 = $scope.editOrderModal
                // $scope.modal = $modal({scope: $scope, templateUrl: "optimize/modal/order/add.html", show: true});
                $scope.getOrderAchievementRatios();//获取订单的业绩比例
                $scope.getOrderPayments();
                $scope.order.orderNo = "";
            }


            function chargeBackOrderFirst(obj) {
                $scope.order = angular.copy(obj);
                $scope.modalTitleDetail = '退单';
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: 'optimize/modal/order/chargebackFirst.html',
                    show: true
                });
                $scope.getOrderAchievementRatios();//获取订单的业绩比例
                $scope.getOrderPayments();
            }

            // 选择结转的订单
            $scope.selectOne = function (obj, type) {
                var carryTime = $scope.order.carryTime;
                $scope.order = angular.copy(obj);
                $scope.selectOrderCarry = angular.copy(obj);
                $scope.selectRatio = 100 * $scope.selectOrderCarry.realTotalAmount / ($scope.selectOrderCarry.realTotalAmount + $scope.selectOrderCarry.privilegeAmount);
                $scope.selectRatio = Number($scope.selectRatio.toFixed(1));
                $scope.order.carryTime = carryTime;
                if (type == 1) {
                    // 重新封装课程信息
                    $scope._getAllOrderCourses();
                } else {
                    // 默认将结转金额赋值为剩余实际交费的金额
                    $scope.order.carryAmount = Number(($scope.selectOrderCarry.avaliableAmount * $scope.selectRatio / 100).toFixed(2));
                    $scope.order.additionalAmountAct = Number((obj.additionalAmount * obj.realTotalAmount / obj.totalPrice).toFixed(2));
                }

            };
            /**
             * 获取选择订单的课程子表的信息
             */
            $scope._getAllOrderCourses = function () {
                var filter = {};
                filter.crmCustomerStudentId = $scope.detail.crm_student_id;
                var orderNos = $scope.order.orderNo;
                if (orderNos.length > 0) {
                    filter.customCondition = " and s.order_no = '" + orderNos + "' ";
                    CustomerStudentCourseService.getOrderCourseList(filter).then(function (result) {
                        $scope.order.orderCourses = result.studentOrder;
                    });
                }
            }
            /**
             * 修改结转课时时调用的js方法
             */
            $scope.orderFilterC = {};
            $scope.changeCarryCourseNum = function (row) {
                // 计算结转课时对应的结转金额
                //默认当里面没有值 仍未空
                if (row.carryForwardCourseNum == undefined) {
                    row.carryForwardCourseNum = "";
                }
                // if(row.carryForwardCourseNum>1){
                //     if(row.carryForwardCourseNum.toString().indexOf('.') != -1){
                //         row.carryForwardCourseNum=row.carryForwardCourseNum.toString().substr(row.carryForwardCourseNum.toString().indexOf('.')-1)
                //
                //         console.log( row.carryForwardCourseNum)
                //
                //     }
                // }
                if (row.carryForwardCourseNum > row.plan_available_num) {
                    SweetAlert.swal('结转课时大于可排课时，请重新输入');
                    row.carryForwardCourseNum = "";
                    row.carryForwardAmount = "";
                    $scope.order.carryAmount = "";
                    return;
                }
                row.carryForwardAmount = row.carryForwardCourseNum * row.actual_price * $scope.selectRatio / 100; // 结转课时*单价row.actualPrice * 折扣率
                row.carryForwardAmount = Number(row.carryForwardAmount.toFixed(2));
                if ($scope.order.carryAmount == undefined) {
                    $scope.order.carryAmount = 0;
                }
                // 计算所有的结转金额
                var carryAmountTemp = 0;
                for (var j = 0, len1 = $scope.order.orderCourses.length; j < len1; j++) {
                    carryAmountTemp = carryAmountTemp + $scope.order.orderCourses[j].carryForwardAmount;
                }
                $scope.order.carryAmount = Number(carryAmountTemp.toFixed(2));
                $scope.carryAmountLegal = false;
            }

            /**
             * 结转金额手动更改后、判断结转的金额是否合法
             */
            $scope.islegalCarryAmount = function (type) {
                $scope.carryAmountLegal = false;
                var carryAmountTemp = 0;
                // 1代表是课时结转  2 代表是充值订单结转
                if (type == 1) {
                    if (!$scope.order.orderCourses) {
                        return false
                    }
                    for (var j = 0, len1 = $scope.order.orderCourses.length; j < len1; j++) {
                        carryAmountTemp = carryAmountTemp + $scope.order.orderCourses[j].carryForwardAmount;
                    }
                } else if (type == 2) {
                    // 能结转的最大的金额
                    carryAmountTemp = Number(($scope.selectOrderCarry.avaliableAmount * $scope.selectRatio / 100).toFixed(2));
                }
                if ($scope.order.carryAmount > carryAmountTemp) {
                    $scope.carryAmountLegal = true;
                    SweetAlert.swal('结转金额超过可结转金额，请重新输入');
                    return;
                }
            }

            /**
             * 保存结转订单
             */
            $scope.saveCarryOrder = function (type) {
                if (!$scope.order.orderNo) {
                    SweetAlert.swal('请选择订单');
                    return false
                }
                // type 1：代表课时订单结转  2:代表充值订单结转
                if (type == 2) {
                    // 判断结转金额是否大于可排金额，若大于，请重新输入结转金额
                    if ($scope.order.carryAmount > $scope.order.avaliableAmount) {
                        SweetAlert.swal('结转金额大于订单可排金额');
                        return;
                    }
                }
                if (Number($scope.order.carryAmount) <= 0) {
                    SweetAlert.swal('结转金额必须大于0');
                    return;
                }
                // if (type == 1) {
                //     $scope.order.masterSlaveRelation = 1;
                // } else if (type == 2) {
                //     $scope.order.masterSlaveRelation = 3;
                // }

                var promise = OrderService.createCarryForwardOrder($scope.order);
                promise.then(function (data) {
                    SweetAlert.swal('操作成功');
                    $scope.addCarryforwardOrderModal.hide();
                }, function (error) {
                    SweetAlert.swal('操作失败');
                    $scope.addCarryforwardOrderModal.hide();
                });
            }

            /**
             * 点击查询按钮，调用的方法
             */
            $scope.getCarryForwardListGo = function () {
                $scope.tableState.pagination.start = 0;
                $scope.tableState.pagination.pageNum = 1;
                $scope.getCarryForwardList($scope.tableState);
            }
            /**
             * 获取结转记录列表
             */
            $scope.getCarryForwardList = function (tableState) {
                // 学院教务 结转管理的转入 主从关系的添加
                var promise = OrderService.masterSlaveRelation();
                promise.then(function (result) {
                    $scope.masterSlaveRelation = result;
                })

                $scope.isLoading = true;
                $scope.orderFlag = 12;
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
                console.log($scope.orderFilter);
                OrderService.getPage($scope.start, $scope.number, $scope.orderFlag, $scope.orderFilter).then(function (result) {
                    console.log(result.data)
                    $scope.oneOrders = result.data;
                    tableState.pagination = tableState.pagination || {}
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                });
            }
            /**
             * 重置结转的查询条件
             */
            $scope.resetSelectOrderCarry = function () {
                $scope.orderFilter = {};
            }
            /**
             * 结转撤销
             */
            $scope.carryforwardRevoke = function (row) {
                SweetAlert.swal({
                    title: "是否确认撤销?", text: "", type: "warning", showCancelButton: true,
                    confirmButtonColor: "#DD6B55", confirmButtonText: "是", cancelButtonText: "否",
                    closeOnConfirm: false, closeOnCancel: true
                }, function (isConfirm) {
                    if (isConfirm) {
                        var promise = OrderService.carryForwardOrderRevoke(row);
                        promise.then(function (data) {
                            SweetAlert.swal('操作成功');
                            $scope.getCarryForwardList($scope.tableState);
                        }, function (error) {
                            SweetAlert.swal('操作失败');
                        });
                    }
                });
            }
            /**
             * 结转退单
             */
            $scope.carryforwardBack = function (row) {
                SweetAlert.swal({
                    title: "是否确认退单?", text: "", type: "warning", showCancelButton: true,
                    confirmButtonColor: "#DD6B55", confirmButtonText: "是", cancelButtonText: "否",
                    closeOnConfirm: false, closeOnCancel: true
                }, function (isConfirm) {
                    if (isConfirm) {
                        var promise = OrderService.carryForwardOrderBack(row);
                        promise.then(function (data) {
                            SweetAlert.swal('操作成功');
                            $scope.getCarryForwardList($scope.tableState);
                        }, function (error) {
                            SweetAlert.swal('操作失败');
                        });
                    }
                });
            }

            /**
             * 结转列表-转入
             */
            $scope.carryChangeInto = function (row) {
                sessionStorage.setItem("orderJudgeEntrance", 'addOrder');
                // 根据row定位到订单的对象
                var filter = {};
                filter.orderNo = row.carryOrderNo;
                var promise = OrderService.detail(filter);
                promise.then(function (data) {

                    $scope.order = data.data;
                    if ($scope.order.masterSlaveRelation) {
                        $scope.order.masterSlaveRelation += ''
                    } else {
                        $scope.order.masterSlaveRelation = ''
                    }
                    if ($scope.order.orderRule) {
                        $scope.order.orderRule += ''
                    } else {
                        $scope.order.orderRule = ''
                    }
                    $scope.orderCopy = data.data;
                    $scope.order.recharge = data.data;
                    $scope.order.parentPhone = data.data.parentPhone;
                    $scope.modalTitle = '转入';
                    $scope.order.carryId = row.carryId;
                    $scope.order.recharge.gradeId = row.gradeId;
                    $scope.showCreat = 1;
                    if (Number($scope.order.privilegeAmount) == 0) {
                        $scope.order.privilegeRatio = 100;
                    }
                    if (Number($scope.order.recharge.privilegeAmount) == 0) {
                        $scope.order.recharge.privilegeRatio = 100;
                    }
                    // $scope.modal = $modal({scope: $scope, templateUrl: "optimize/modal/order/add.html", show: true});
                    $scope.modal = $modal({scope: $scope, templateUrl: "partials/v2.order/zhuangjie.html", show: true});
                    //$scope.getOrderAchievementRatios();//获取订单的业绩比例
                    $scope.getOrderPayments();
                }, function (error) {
                    SweetAlert.swal('操作失败');
                });
            }

            /**
             * 结转记录收费-跳转
             */
            $scope.carryCharge = function (row) {
                sessionStorage.setItem("orderJudgeEntrance", 'addOrder');
                var filter = {};
                filter.orderNo = row.carryOrderNo;
                var promise = OrderService.detail(filter);
                promise.then(function (data) {
                    $scope.order = angular.copy(data.data);
                    $scope.orderCarry = angular.copy(data.data);
                    $scope.modalTitle = '收费';
                    if ($scope.order.orderCategory == 1) {
                        $scope.chargeOrderModal = $modal({
                            scope: $scope,
                            templateUrl: 'partials/sos/order/charge.html',
                            show: true
                        });
                    } else if ($scope.order.orderCategory == 3) {
                        $scope.chargeOrderModal = $modal({
                            scope: $scope,
                            templateUrl: 'partials/sos/order/chargeTopupCarry.html',
                            show: true
                        });
                    }
                    $scope.getOrderCourses();
                    $scope.getOrderPayments();
                }, function (error) {
                    SweetAlert.swal('操作失败');
                });

            }

            /**
             * 结转记录收费-保存
             */
            var _payDate = "";
            $scope.chargeOrderCarry = function () {
                _payDate = $scope.orderCarry.payDate;
                $scope.orderCarry.payDate = new Date($scope.orderCarry.payDate);
                OrderService.getOrderPayments(0, 1000, $scope.orderCarry.orderNo).then(function (result) {
                    if (result.data.length > 0) {
                        var maxPayDate = result.data[0].payDate;
                        if (maxPayDate > $scope.orderCarry.payDate.getTime()) {
                            SweetAlert.swal('本次支付时间不能小于上次支付时间！');
                            $scope.orderCarry.payDate = _payDate;
                            return;
                        }
                    }
                    var promise = OrderService.chargeTopup($scope.orderCarry);
                    promise.then(function (data) {
                        SweetAlert.swal('操作成功');
                        $scope.chargeOrderModal.hide();
                    }, function (error) {
                        SweetAlert.swal('操作失败');
                        $scope.chargeOrderModal.hide();
                    });
                })
            }

            /**
             * 结转审核 1：课时订单审核 3：充值订单审核
             */
            $scope.carryAudit = function (row) {

                var filter = {};
                filter.orderNo = row.carryOrderNo || row.orderNo;
                var promise = OrderService.detail(filter);
                promise.then(function (data) {
                    $scope.order = row.tryListenFlag;
                    $scope.order = angular.copy(data.data);
                    $scope.orderCarry = angular.copy(data.data);
                    $scope.order.gradeId = row.gradeId;
                    $scope.order.carryId = row.carryId;
                    $scope.modalTitle = '审核';
                    $scope.orderOperating = 9;
                    if ($scope.order.orderCategory == 1) {
                        // 结转id
                        $scope.order.carryId = row.carryId;
                        $scope.order.gradeId = row.gradeId;
                        $scope.order.contractStartDate = new Date($scope.order.contractStartDate);
                        $scope.order.contractEndDate = new Date($scope.order.contractEndDate);
                        //设置总课时、
                        $scope.order.totalOriginalNum = row.totalOriginalNum;
                        //设置总时长
                        if ($scope.order.orderRule == 1) {
                            $scope.order.hours = $scope.order.totalOriginalNum;
                            $scope.order.minite = 0;
                        } else {
                            $scope.order.hours = parseInt($scope.order.totalOriginalNum * 40 / 60);
                            $scope.order.minite = parseInt(($scope.order.totalOriginalNum * 40) % 60);
                        }
                        $scope.modal = $modal({
                            scope: $scope,
                            templateUrl: 'partials/v2.order/detail.html',
                            // templateUrl: 'optimize/modal/order/detail.html',
                            show: true
                        });
                        $scope.getOrderCourses();
                        $scope.getOrderAchievementRatios();//获取订单的业绩比例
                        $scope.getOrderRelationTeachers(); //获取订单相关教师
                        $scope.getOrderPayments();
                    } else if ($scope.order.orderCategory == 3) {
                        _carryAuditTemp(row);
                    }
                }, function (error) {
                    SweetAlert.swal('操作失败');
                });
            }

            /**
             * 结转-充值-审核
             */
            function _carryAuditTemp(row) {

                $scope.orderCarry.carryId = row.carryId;
                $scope.orderCarry.gradeId = row.gradeId;
                $scope.orderCarry.contractStartDate = new Date($scope.orderCarry.contractStartDate);
                $scope.orderCarry.contractEndDate = new Date($scope.orderCarry.contractEndDate);
                /*$scope.modal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/auditTopupCarry.html',
                    show: true
                });*/
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/v2.order/detail.html',
                    // templateUrl: 'optimize/modal/order/detail.html',
                    show: true
                });
                // 计算下折扣率
                $scope.orderCarry.privilegeRatio = 100 - Number(($scope.orderCarry.privilegeAmount * 100 / $scope.orderCarry.totalPrice).toFixed(1));
                $scope.orderCarry.privilegeRatio = Number($scope.orderCarry.privilegeRatio.toFixed(1));
                $scope.order.privilegeRatio = Number($scope.orderCarry.privilegeRatio.toFixed(1));
                $scope.getOrderChargingSchemeV2($scope.order)
                // $scope.getOrderChargingScheme(); // 获取计费方案的信息
                $scope.getOrderAchievementRatiosC();//获取订单的业绩比例
                $scope.getOrderRelationTeachersC(); //获取订单相关教师
                $scope.getOrderPayments();
                $scope.getGradeIDs();
            }

            //结转记录审核操作
            function allPayOrderCarry() {
                SweetAlert.swal({
                    title: "是否确认审核通过?", text: "", type: "warning", showCancelButton: true,
                    confirmButtonColor: "#DD6B55", confirmButtonText: "是", cancelButtonText: "否",
                    closeOnConfirm: false, closeOnCancel: true
                }, function (isConfirm) {
                    if (isConfirm) {
                        $scope.order.repeatClick = true;
                        var promise = OrderService.carryOrderAudit($scope.order);
                        promise.then(function (data) {
                            SweetAlert.swal('操作成功');
                            $scope.modal.hide();
                            $scope.getCarryForwardList($scope.tableState);
                        }, function (error) {
                            SweetAlert.swal('操作失败');
                            $scope.modal.hide();
                        });
                    } else {
                        $scope.order.repeatClick = false;
                        return false;
                    }
                });

            }

            // TODO：20180105 多订单收费
            $scope.ordersMoreCharge = []
            $scope.ordersMoreChargeInit = function (row) {
                $scope.ordersMoreCharge = []
                var order = angular.copy(row)
                $scope.ordersMoreCharge.push(order)
                OrderService.getSuborders(order.id).then(function (result) {
                    $scope.ordersMoreCharge = $scope.ordersMoreCharge.concat(result.data)
                    console.clear()
                    console.log($scope.ordersMoreCharge)
                    order.contractStartDate = new Date(order.contractStartDate);
                    order.contractEndDate = new Date(order.contractEndDate);
                    $scope.modalTitle = '收费';
                    $scope.chargeOrderModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/v2.order/charge-2.html',
                        show: true
                    });
                    $scope.getOrderCourses();
                    for (var i = 0, len = $scope.ordersMoreCharge.length; i < len; i++) {
                        (function (i) {
                            OrderService.getOrderPayments($scope.start, $scope.number, $scope.ordersMoreCharge[i].orderNo).then(function (result) {
                                $scope.ordersMoreCharge[i].crmorderPayments = result.data;
                                angular.forEach($scope.ordersMoreCharge[i].crmorderPayments, function (data, index, array) {
                                    data.paymentEdit = true;
                                });
                            });
                        })(i)
                    }
                })
            }
            $scope.ordersMoreChargeHide = function () {
                $scope.chargeOrderModal.hide()
                $scope.chargeModel = 0
            }
            // TODO:20180426
            // 多订单在订单列表中展示订单的总数据
            $scope.getMoreDataByOrderId = function (row) {
                OrderService.getMoreDataByOrderId(row.id).then(function (data) {
                    row.more = data.data || {}
                })
            }
        }
    ])
    .controller('OrderAddAuditBakRestitutionController', ['$scope', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'CommonService',
        function ($scope, $modal, $rootScope, SweetAlert, OrderService, CommonService) {

            //审核通过
            $scope.auditOrderRestitutionPass = function auditOrderRestitutionPass() {

                SweetAlert.swal({
                    title: "确定要审核通过吗？",
                    type: null,
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        var promise = OrderService.editRestitution($scope.order);
                        promise.then(function (data) {
                            SweetAlert.swal('操作成功');
                            $scope.editTransferOrderModal.hide();
                            $scope.refreshTabs();
                        }, function (error) {
                            SweetAlert.swal('操作失败');
                            $scope.editTransferOrderModal.hide();
                        });
                    }
                });

            }

            //退单
            $scope.auditOrderRestitutionBack = function auditOrderRestitutionBack() {
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
                            var promise = OrderService.editRestitutionBack($scope.order);
                            promise.then(function (data) {
                                SweetAlert.swal('操作成功');
                                $scope.auditTransferOrderBack.hide();
                                $scope.refreshTabs();
                            }, function (error) {
                                SweetAlert.swal('操作失败');
                                $scope.auditTransferOrderBack.hide();
                            });
                        }
                    }
                );
            }


            //$scope.order.orderNo = orderRestitutionAvailableOrders[0].orderNo;
            //获取返课原因列表
            $scope.callServerRestitutionCourseReasonSelect = function callServerRestitutionCourseReasonSelect() {
                CommonService.getRestitutionCourseReasonSelect().then(function (result) {
                    $scope.restitutionCourseReasons = result.data;
                });
            }();

            //选择或者取消赠课的订单
            $scope.selectOrderRestitution = function (obj) {
                $scope.order.orderNo = obj.orderNo;
            };

            $scope.saveRestitution = function saveRestitution() {
                if ($scope.order.orderNo == undefined) {
                    SweetAlert.swal('请选择订单!');
                    return false;
                }
                var order = {
                    'crmStudentId': $scope.detail.crm_student_id,
                    'courseId': $scope.courseId,
                    'originalNum': $scope.order.originalNum,
                    'reason': $scope.order.reason,
                    'transferId': $scope.courseId,
                    'lectureType': $scope.subjectId,
                    'contractStartDate': $scope.order.contractStartDate,
                    'originalOrderNo': $scope.order.orderNo,
                    'orderCourses': $scope.order.orderCourses
                };

                var promise = OrderService.addRestitution(order);
                promise.then(function (data) {
                    //$scope.dataLoading = false;
                    SweetAlert.swal('操作成功');
                    $scope.modal.hide();
                    $scope.refreshCustomerOrderDetail();
                }, function (error) {
                    // $scope.dataLoading = false;
                    SweetAlert.swal('操作失败');
                    $scope.modal.hide();
                });
            }

            $scope.getProductIdSelect = function getProductIdSelect() {
                CommonService.getOffLineProductIdSelect().then(function (result) {
                    $scope.productIds = result.data;
                });
                $scope.subjectIds = [];
                $scope.gradeIds = [];
                $scope.courseTypeIds = [];
            }();

            $scope.getSubjectIdSelect = function getProductIdSelect() {
                CommonService.getSubjectIdSelect().then(function (result) {
                    $scope.subjectIds = result.data;
                });
            }();

            $scope.onProductIdSelect = function onProductIdSelect() {
                $scope.gradeIds = [];
                $scope.courseTypeIds = [];
                var params = {};
                params.productId = $scope.productId;
                //CommonService.getCourseTypeIdSelect(params).then(function (result) {
                //    $scope.courseTypeIds = result.data;
                //});
                OrderService.getCourseTypeIdSelect(params).then(function (result) {
                    $scope.courseTypeIds = result.data;
                });
            };

            $scope.onCourseTypeIdSelect = function onCourseTypeIdSelect() {
                $scope.gradeIds = [];
                var params = {};
                params.courseTypeId = $scope.courseTypeId;
                OrderService.getGradeIdSelect(params).then(function (result) {
                    $scope.gradeIds = result.data;
                });
            };

            //$scope.courseProperty = 3;
            //$scope.courseProperty = $scope.order.reason;
            $scope.addRestitutionCourse = function addRestitutionCourse() {
                if ($scope.productId == null || $scope.gradeId == null || $scope.subjectId == null
                    || $scope.courseTypeId == null || $scope.order.originalNum == null || $scope.order.reason == null) {
                    SweetAlert.swal('添加失败', '请选择全部条件重试');
                    return false;
                }

                OrderService.getOrderCourse($scope.productId, $scope.courseTypeId, $scope.gradeId, $scope.subjectId).then(function (result) {
                    $scope.courseId = result.data.id;
                    var subjectName = "";
                    angular.forEach($scope.subjectIds, function (data, index, array) {
                        if ($scope.subjectId == data.id) {
                            subjectName = data.name;
                        }
                    });

                    if ($scope.order.reason == 2 || $scope.order.reason == 3) {
                        $scope.courseProperty = 3;
                    } else {
                        $scope.courseProperty = 2;
                    }

                    var orderCourse = {
                        'originalNum': Number($scope.order.originalNum),
                        'courseId': result.data.id,
                        'gradeId': result.data.gradeId,
                        'courseTypeId': result.data.courseTypeId,
                        'subjectId': $scope.subjectId,
                        'gradeName': result.data.gradeName,
                        'courseTypeName': result.data.courseTypeName,
                        'subjectName': subjectName,
                        'courseProperty': $scope.courseProperty

                    };
                    $scope.order.orderCourses = [];
                    $scope.order.orderCourses.push(orderCourse);
                });
            };
        }
    ])
    .controller('OrderAddTransferController', ['$scope', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'OrderTransferService', 'CommonService', 'LeadsStudentService', 'CustomerStudentService', '$mtModal', 'CustomerStudentCourseService',
        function ($scope, $modal, $rootScope, SweetAlert, OrderService, OrderTransferService, CommonService, LeadsStudentService, CustomerStudentService, $mtModal, CustomerStudentCourseService) {
            $scope.order.orderNos = [];
            // 显示课时数的统计
            $scope.numStatic = [];
            $scope.order.courseNum = 0;
            $scope.order.isContain = false;

            // 选择的多个学生的数组
            $scope.MyCrmCustomerStudentListOk = [];

            //聚焦失焦0的展示
            $scope.isFocus = function (row, index) {
                for (var j = 0, len1 = $scope.order.orderCourses.length; j < len1; j++) {
                    // 将页面0清空
                    if ($scope.order.orderCourses[j].ordcourse_id == row.ordcourse_id) {
                        if ($scope.order.orderCourses[j].nums[index] == 0) {
                            $scope.order.orderCourses[j].nums[index] = '';
                            break;
                        }
                    }
                }
            };
            //清空
            $scope.isBlur = function isBlur(row, index) {
                for (var j = 0, len1 = $scope.order.orderCourses.length; j < len1; j++) {
                    // 将页面0清空
                    if ($scope.order.orderCourses[j].ordcourse_id == row.ordcourse_id) {
                        if ($scope.order.orderCourses[j].nums[index] == 0) {
                            $scope.order.orderCourses[j].nums[index] = 0;
                            break;
                        }
                    }
                }
            }

            $scope.getProductIdSelect = function getProductIdSelect() {
                CommonService.getOffLineProductIdSelect().then(function (result) {
                    $scope.productIds = result.data;
                });
                $scope.subjectIds = [];
                $scope.gradeIds = [];
                $scope.courseTypeIds = [];
            }();

            $scope.getSubjectIdSelect = function getProductIdSelect() {
                CommonService.getSubjectIdSelect().then(function (result) {
                    $scope.subjectIds = result.data;
                });
            }();

            $scope.onProductIdSelect = function onProductIdSelect() {
                $scope.gradeIds = [];
                $scope.courseTypeIds = [];
                var params = {};
                params.productId = $scope.productId;
                //CommonService.getCourseTypeIdSelect(params).then(function (result) {
                //    $scope.courseTypeIds = result.data;
                //});
                OrderService.getCourseTypeIdSelect(params).then(function (result) {
                    $scope.courseTypeIds = result.data;
                });
            };

            $scope.onCourseTypeIdSelect = function onCourseTypeIdSelect() {
                $scope.gradeIds = [];
                var params = {};
                params.courseTypeId = $scope.courseTypeId;
                OrderService.getGradeIdSelect(params).then(function (result) {
                    $scope.gradeIds = result.data;
                });
            };


            $scope.addTransferCourse = function addTransferCourse() {
                if ($scope.productId == null || $scope.gradeId == null || $scope.subjectId == null || $scope.courseTypeId == null || $scope.order.originalNum == null) {
                    SweetAlert.swal('添加失败', '请选择全部条件重试');
                    return false;
                }

                OrderService.getOrderCourse($scope.productId, $scope.courseTypeId, $scope.gradeId, $scope.subjectId).then(function (result) {
                    $scope.courseId = result.data.id;
                    var subjectName = "";
                    angular.forEach($scope.subjectIds, function (data, index, array) {
                        if ($scope.subjectId == data.id) {
                            subjectName = data.name;
                        }
                    });

                    var orderCourse = {
                        'originalNum': Number($scope.order.originalNum),
                        'courseId': result.data.id,
                        'gradeId': result.data.gradeId,
                        'courseTypeId': result.data.courseTypeId,
                        'subjectId': $scope.subjectId,
                        'gradeName': result.data.gradeName,
                        'courseTypeName': result.data.courseTypeName,
                        'subjectName': subjectName
                    };
                    $scope.order.orderCourses = [];
                    $scope.order.orderCourses.push(orderCourse);
                });
            };

            //加载课程类型
            $scope.callServerCourseTeachingTypeSelect = function callServerCourseTeachingTypeSelect() {
                CommonService.getCourseTeachingTypeSelect().then(function (result) {
                    $scope.courseTeachingType = result.data;
                });
            }();

            //选择或者取消转课的订单
            $scope.selectOne = function (obj) {
                if ($.inArray(obj.orderNo, $scope.order.orderNos) >= 0) {
                    //$scope.order.orderNos.pop(obj.orderNo);
                    $scope.order.orderNosNew = [];
                    angular.forEach($scope.order.orderNos, function (data, index, array) {
                        if (data != obj.orderNo) {
                            $scope.order.orderNosNew.push(data);
                        }
                    });

                    $scope.order.orderNos = $scope.order.orderNosNew;
                    $scope.order.courseNum = $scope.order.courseNum - obj.consumeCourseNum;
                } else {
                    $scope.order.orderNos.push(obj.orderNo);
                    $scope.order.orderRule = obj.orderRule;
                    $scope.order.courseNum = $scope.order.courseNum + obj.consumeCourseNum;
                    $scope.order.orderChargingId = obj.orderChargingId;
                    $scope.order.orderTeacherLevel = obj.orderTeacherLevel;
                }
                $scope.order.originalNum = $scope.order.courseNum;
                // 重新封装课程信息
                $scope._getAllOrderCourses();
            };
            /**
             * 获取选择订单的课程子表的信息
             */
            $scope._getAllOrderCourses = function () {
                var filter = {};
                var orderNos = "";
                $scope.order.transferCourseNum = 0;
                filter.crmCustomerStudentId = $scope.detail.crm_student_id;
                if ($scope.order.orderNos.length > 0) {
                    for (var j = 0, len1 = $scope.order.orderNos.length; j < len1; j++) {
                        orderNos += "'" + $scope.order.orderNos[j] + "',";
                    }
                    if (orderNos.length > 0) {
                        orderNos = orderNos.substring(0, orderNos.length - 1);
                    }
                }
                console.log(orderNos);
                if (orderNos.length > 0) {
                    filter.customCondition = " and s.order_no in (" + orderNos + ") ";
                    CustomerStudentCourseService.getOrderCourseList(filter).then(function (result) {
                        $scope.order.orderCourses = result.studentOrder;
                        for (var j = 0, len1 = $scope.order.orderCourses.length; j < len1; j++) {
                            // 封装要转课的总课时，可排课时的累加
                            $scope.order.transferCourseNum += $scope.order.orderCourses[j].plan_available_num;
                            // 封装要转课的课时数量
                            $scope.order.orderCourses[j].nums = [];
                            for (var i = 0, len = $scope.MyCrmCustomerStudentListOk.length; i < len; i++) {
                                $scope.order.orderCourses[j].nums.push(0);
                            }
                        }
                    });
                }

            }

            //选择或者取消转课的订单(充值类型)
            $scope.checkOne = function (obj) {
                $scope.order.rechargeOrderNos = [];
                $scope.order.rechargeOrderNos.push(obj.orderNo);
                $scope.order.rechargeOrderRule = obj.orderRule;
                $scope.order.totalAmount = obj.additionalAmount;
                $scope.order.orderChargingId = obj.orderChargingId;
                $scope.order.orderTeacherLevel = obj.orderTeacherLevel;
                //$scope.order.totalAmount = obj.additionalAmount;
            };

            $scope.saveTransferOrder = function saveTransferOrder() {
                if ($scope.order.endDate < $scope.order.startDate) {
                    SweetAlert.swal('终止日期不能小于生效日期!');
                    return false;
                }
                if ($scope.order.orderNos.toString() == '') {
                    SweetAlert.swal('请选择订单！');
                    return false;
                }
                // 是一对一转课时判断不能是本人
                if ($scope.order.transferWay == 1) {
                    if ($scope.order.transferId == $scope.detail.crm_student_id) {
                        SweetAlert.swal('请选择其他转课人！');
                        return false;
                    }
                }

                $scope.order.crmStudentId = $scope.order.transferId;
                $scope.order.courseId = $scope.courseId;
                $scope.order.subjectId = $scope.subjectId;

                // 封装订单的数组对象
                $scope.order.TransferOrders = [];
                for (var i = 0, len = $scope.MyCrmCustomerStudentListOk.length; i < len; i++) {
                    $scope.orderObj = {};
                    $scope.orderObj.orderCourses = [];
                    //封装对象的学生id
                    $scope.orderObj.crmStudentId = $scope.MyCrmCustomerStudentListOk[i].crm_student_id;
                    //封装对象的课程的信息
                    for (var j = 0, len1 = $scope.order.orderCourses.length; j < len1; j++) {
                        var orderCourse = {};
                        //订单子表的id
                        orderCourse.orderCourseId = $scope.order.orderCourses[j].ordcourse_id;
                        console.log(orderCourse.orderCourseId);
                        //要购买的课时
                        if ($scope.order.transferWay == 1) {
                            orderCourse.courseNum = $scope.order.orderCourses[j].plan_available_num;
                        } else if ($scope.order.transferWay == 2) {
                            orderCourse.courseNum = $scope.order.orderCourses[j].nums[i];
                        }
                        //原来订单的合同号
                        orderCourse.orderNo = $scope.order.orderCourses[j].order_no;
                        $scope.orderObj.orderCourses.push(orderCourse);
                    }
                    $scope.order.TransferOrders.push($scope.orderObj);
                }
                var promise = OrderTransferService.saveTransfer($scope.order);
                promise.then(function (data) {
                    //$scope.dataLoading = false;
                    SweetAlert.swal('操作成功');
                    $scope.addTransferOrderModal.hide();
                    $scope.refreshCustomerOrderDetail();
                }, function (error) {
                    // $scope.dataLoading = false;
                    SweetAlert.swal('操作失败');
                    $scope.addTransferOrderModal.hide();
                });

            }

            /**
             * 改变分配的课时
             */
            $scope.changeCourseNum = function changeCourseNum() {
                // 已输入的值累计求和 、清空原有的
                $scope.numStatic = [];
                // 校验横向的值得数组
                $scope.numStaticCours = [];
                for (var i = 0, len = $scope.MyCrmCustomerStudentListOk.length; i < len; i++) {
                    var numStaticTemp = 0;
                    for (var j = 0, len1 = $scope.order.orderCourses.length; j < len1; j++) {
                        numStaticTemp = parseFloat(numStaticTemp) + parseFloat($scope.order.orderCourses[j].nums[i]);
                    }
                    if (isNaN(numStaticTemp)) {
                        numStaticTemp = 0;
                    }
                    $scope.numStatic.push(numStaticTemp);
                }
                // 前端课程横向输入的课时累加和=该订单课程的的可排课时
                for (var j = 0, len1 = $scope.order.orderCourses.length; j < len1; j++) {
                    var numStaticTemp1 = 0;
                    for (var i = 0, len = $scope.MyCrmCustomerStudentListOk.length; i < len; i++) {
                        numStaticTemp1 = parseFloat(numStaticTemp1) + parseFloat($scope.order.orderCourses[j].nums[i]);
                    }
                    if (isNaN(numStaticTemp1)) {
                        numStaticTemp1 = 0;
                    }
                    $scope.numStaticCours.push(numStaticTemp1);
                }
                for (var j = 0, len1 = $scope.order.orderCourses.length; j < len1; j++) {
                    // 若计算之和不相等则
                    if ($scope.order.orderCourses[j].plan_available_num != $scope.numStaticCours[j]) {
                        // 若不相等不能进行保存
                        $scope.order.TransferInvalid = true;
                        break;
                    } else {
                        $scope.order.TransferInvalid = false;
                    }
                    ;
                }
            }

            $scope.saveRechargeTransferOrder = function saveRechargeTransferOrder() {
                if ($scope.order.endDate < $scope.order.startDate) {
                    SweetAlert.swal('终止日期不能小于生效日期!');
                    return false;
                }
                if ($scope.order.rechargeOrderNos.toString() == '') {
                    SweetAlert.swal('请选择订单！');
                    return false;
                }
                if ($scope.order.transferId == $scope.detail.crm_student_id) {
                    SweetAlert.swal('请选择其他转课人！');
                    return false;
                }
                $scope.order.crmStudentId = $scope.order.transferId;
                $scope.order.courseId = $scope.courseId;
                $scope.order.subjectId = $scope.subjectId;
                //$scope.order.orderNos = $scope.order.rechargeOrderNos;
                $scope.order.rechargeTransferFlag = "rechargeFlag";

                $scope.order.transferWay = undefined;
                var promise = OrderTransferService.saveTransfer($scope.order);
                promise.then(function (data) {
                    //$scope.dataLoading = false;
                    SweetAlert.swal('操作成功');
                    $scope.addTransferOrderModal.hide();
                    $scope.refreshCustomerOrderDetail();
                }, function (error) {
                    // $scope.dataLoading = false;
                    SweetAlert.swal('操作失败');
                    $scope.addTransferOrderModal.hide();
                });

            }

            //弹出搜索leads窗口
            $scope.searchCustomers = function vieCustomers() {
                $scope.modalTitle = '客户搜索';
                if ($scope.order.orderCourses == undefined || $scope.order.orderCourses.length == 0) {
                    SweetAlert.swal('请选择要转让的订单');
                    return false;
                }
                // 获取年级
                CommonService.getGradeIdSelect().then(function (result) {
                    $scope.gradeIds = result.data;
                });
                $scope.searchCustomersModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/searchCustomers.html',
                    show: true
                });
            }

            //弹出搜索leads窗口
            $scope.searchRechargeCustomers = function searchRechargeCustomers() {
                $scope.modalTitle = '客户搜索';
                $scope.searchRechargeCustomersModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/searchRechargeCustomers.html',
                    show: true
                });
            }

            //选中同一校区转课对象
            $scope.order.transferIds = [];
            $scope.transferStudents = [];
            $scope.changTransferWay = function changTransferWay() {
                if ($scope.order.transferWay == 2) {
                    $scope.order.TransferInvalid = true;
                } else {
                    $scope.order.TransferInvalid = false;
                }
                $scope.order.name = "";
                $scope.order.transferIds = [];
                $scope.MyCrmCustomerStudentListOk = [];
                //清空转课学生，清空统计值
                $scope.transferStudents = [];
                $scope.numStatic = [];
                //清空课程中分配的课时值
                for (var j = 0, len1 = $scope.order.orderCourses.length; j < len1; j++) {
                    $scope.order.orderCourses[j].nums = [];
                }
            }
            $scope.selectTransferLeads = function () {
                $scope.order.isContain = false;
                $scope.transferStudents = [];
                if ($scope.MyCrmCustomerStudentListOk.length == 0) {
                    SweetAlert.swal('请选择要转让的学生');
                    return false;
                }
                var names = "";
                // 清空numStatic值信息
                $scope.numStatic = [];
                for (var i = 0, len = $scope.MyCrmCustomerStudentListOk.length; i < len; i++) {
                    names = names + $scope.MyCrmCustomerStudentListOk[i].name + " ";
                    // 一个的时候里面封装转让人id，其他的没影响
                    $scope.order.transferId = $scope.MyCrmCustomerStudentListOk[i].crm_student_id;
                    $scope.order.transferIds.push($scope.MyCrmCustomerStudentListOk[i].crm_student_id);
                    $scope.transferStudents.push($scope.MyCrmCustomerStudentListOk[i]);
                    if ($scope.MyCrmCustomerStudentListOk[i].crm_student_id == $scope.order.crmStudentId) {
                        $scope.order.isContain = true;
                    }
                    //初始默认给清0
                    $scope.numStatic.push(0);
                }
                for (var j = 0, len1 = $scope.order.orderCourses.length; j < len1; j++) {
                    $scope.order.orderCourses[j].nums = [];
                    for (var i = 0, len = $scope.MyCrmCustomerStudentListOk.length; i < len; i++) {
                        $scope.order.orderCourses[j].nums.push(0);
                    }
                }

                $scope.order.name = names;
                // 关闭对话框
                $scope.searchCustomersModal.hide();
            };
            var modalObj = {
                status: 0,
                text: '',
                scope: $scope
            }

            /**
             * 是否包含本人
             */
            $scope.selectContain = function selectContain() {
                if ($scope.order.orderCourses == undefined || $scope.order.orderCourses.length == 0) {
                    SweetAlert.swal('请选择要转让的订单');
                    return false;
                }

                var student = {};
                student.crm_student_id = $scope.order.crmStudentId;
                student.name = $scope.detail.name;

                if ($scope.order.isContain) {
                    if ($scope.MyCrmCustomerStudentListOk.length == 5) {
                        SweetAlert.swal("最多只能选择5个学生");
                        $scope.order.isContain = false;
                        return false;
                    }
                    $scope.selectOneMt(student);
                } else {
                    $scope.deleteOneMt(student);
                }
                // 重新处理要显示的值
                $scope.selectTransferLeads();
            }

            /**
             * 选择重写
             * @param student
             */

            $scope.selectOneMt = function (student) {
                if ($scope.order.transferWay == 1) {
                    if ($scope.MyCrmCustomerStudentListOk.length == 1) {
                        SweetAlert.swal("整订单转给单一学员只能选择一个学生");
                        return false;
                    }
                }

                if (!student.select) {
                    if ($scope.MyCrmCustomerStudentListOk.length == 5) {
                        SweetAlert.swal("最多只能选择5个学生");
                        return false;
                    }
                    for (var index in $scope.MyCrmCustomerStudentListOk) {//判断是否已选择此学生
                        if ($scope.MyCrmCustomerStudentListOk[index].crm_student_id == student.crm_student_id) {//如果已选中则删除
                            SweetAlert.swal("不能添加同一个学生");
                            return false;
                        }
                    }
                    student.select = 1
                    $scope.MyCrmCustomerStudentListOk.push(angular.copy(student));
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
                for (var i = 0, len = $scope.MyCrmCustomerStudentListOk.length; i < len; i++) {
                    if (student.crm_student_id == $scope.MyCrmCustomerStudentListOk[i].crm_student_id) {
                        try {
                            $scope.MyCrmCustomerStudentListOk.splice(i, 1)
                        } catch (e) {
                        }
                        (function (id) {
                            for (var i = 0, len = $scope.CrmLeadsStudentList.length; i < len; i++) {
                                if (id == $scope.CrmLeadsStudentList[i].crm_student_id) {
                                    $scope.CrmLeadsStudentList[i].select = 0
                                }
                            }
                        })(student.crm_student_id)
                        break;
                    }
                }
            }
            /**
             * 删除全部已选
             */
            $scope.deleteAllMt = function deleteAllMt() {
                $scope.MyCrmCustomerStudentListOk.length = 0
                for (var i = 0, len = $scope.CrmLeadsStudentList.length; i < len; i++) {
                    $scope.CrmLeadsStudentList[i].select = 0
                }
            }
            //充值类---选中同一校区转课对象
            $scope.detailForUpdate = {};
            $scope.selectRechargeTransferLeads = function (obj) {
                //$scope.grade = obj.gradeId;
                $scope.order.transferId = obj.crm_student_id;
                if (obj.gradeId > 12) {
                    $scope.crm_student_id = obj.crm_student_id;
                    $scope.grade_name = obj.grade_name;
                    $scope.student_name = obj.name;
                    $scope.phone = obj.phone;
                    $scope.modalTitle = '客户搜索';
                    $scope.changeCustomersGrade = $modal({
                        scope: $scope,
                        templateUrl: 'partials/sos/customer/modal.changeGrade.html',
                        show: true
                    });
                } else {
                    $scope.order.rechargeName = obj.name;
                }
                $scope.searchRechargeCustomersModal.hide();
            };

            //改变受让学生年级
            $scope.changeGradeConfirm = function changeGradeConfirm() {
                $scope.detailForUpdate.crm_student_id = $scope.crm_student_id;
                $scope.detailForUpdate.grade_id = $scope.grade;
                $scope.detailForUpdate.name = $scope.student_name;
                $scope.detailForUpdate.phone = $scope.phone;
                var promise = CustomerStudentService.update($scope.detailForUpdate);
                promise.then(function (data) {
                    $scope.order.rechargeName = $scope.student_name;
                }, function (error) {
                    SweetAlert.swal("更新学生年级失败");
                });
                $scope.changeCustomersGrade.hide();

            }

            //搜索同一校区内的转课对象leads
            $scope.schoolCrmLeadsStudentFilter = {};
            $scope.schoolCrmLeadsStudentListTableState = {};
            $scope.getLeadsList = function getLeadsList(tableState) {
                $scope.schoolCrmLeadsStudentListTableState = tableState;
                $scope.isSchoolLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;
                LeadsStudentService.schoolListAll(start, number, tableState, $scope.schoolCrmLeadsStudentFilter).then(function (result) {
                    $scope.CrmLeadsStudentList = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;
                    $scope.schoolCrmLeadsStudentListTableState = tableState;
                    $scope.isSchoolLoading = false;
                    _isSelectMt();
                });
            };

            // 条件查询
            $scope.getLeadsListFiter = function getLeadsListFiter() {
                $scope.isSchoolLoading = true;
                var pagination = $scope.schoolCrmLeadsStudentListTableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;
                LeadsStudentService.schoolListAll(start, number, $scope.schoolCrmLeadsStudentListTableState,
                    $scope.schoolCrmLeadsStudentFilter).then(function (result) {
                    $scope.CrmLeadsStudentList = result.data;
                    $scope.schoolCrmLeadsStudentListTableState.pagination.numberOfPages = result.numberOfPages;
                    $scope.isSchoolLoading = false;
                    _isSelectMt();
                });
            }

            /**
             * 编辑查看一对多专用
             * @private
             */
            function _isSelectMt() {
                for (var i = 0, len = $scope.MyCrmCustomerStudentListOk.length; i < len; i++) {
                    for (var j = 0, jLen = $scope.CrmLeadsStudentList.length; j < jLen; j++) {
                        if ($scope.MyCrmCustomerStudentListOk[i].crm_student_id == $scope.CrmLeadsStudentList[j].crm_student_id) {
                            $scope.CrmLeadsStudentList[j].select = 1
                        }
                    }
                }
            }

            // 将查询条件置空
            $scope.resetParam = function resetParam() {
                $scope.schoolCrmLeadsStudentFilter = {};
            }
        }
    ])
    .controller('OrderAuditTransferController', ['$scope', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'OrderTransferService', 'CommonService', 'localStorageService',
        function ($scope, $modal, $rootScope, SweetAlert, OrderService, OrderTransferService, CommonService, localStorageService) {
            $rootScope.isModyfied = localStorageService.get("isModyfied");//修改时间权限
            //加载课程类型
            $scope.callServerCourseTeachingTypeSelect = function callServerCourseTeachingTypeSelect() {
                CommonService.getCourseTeachingTypeSelect().then(function (result) {
                    $scope.courseTeachingType = result.data;
                });
            }();

            //转课审核通过
            $scope.auditOrderTransferPass = function auditOrderTransferPass() {
                SweetAlert.swal({
                        title: "确定要审核通过吗？",
                        type: null,
                        showCancelButton: true,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true
                    }, function (confirm) {
                        if (confirm) {
                            var promise = OrderTransferService.editTransfer($scope.order);
                            promise.then(function (data) {
                                SweetAlert.swal('操作成功');
                                $scope.editTransferOrderModal.hide();
                                $scope.refreshTabs();
                            }, function (error) {
                                SweetAlert.swal('操作失败');
                                $scope.editTransferOrderModal.hide();
                            });
                        }
                    }
                );

            }

            //转课退单
            $scope.auditOrderTransferBack = function auditOrderTransferBack() {
                OrderTransferService.isMtMTransfer($scope.order.orderNo).then(function (data) {
                    console.log(data);
                    var title = "确定要退单吗？"
                    if (data) {
                        title = "由于是拆订单转课，此操作会将所有相关订单退单，您可以重新发起转课。"
                    }

                    SweetAlert.swal({
                            title: title,
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
                                    $scope.refreshTabs();
                                    $scope.refreshCustomerOrderDetail();
                                }, function (error) {
                                    SweetAlert.swal('操作失败');
                                    $scope.auditTransferOrderBack.hide();
                                });
                            }
                        }
                    );
                })

            }
        }
    ])
    .controller('OrderDetailTransferController', ['$scope', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'OrderTransferService', 'CommonService', 'localStorageService',
        function ($scope, $modal, $rootScope, SweetAlert, OrderService, OrderTransferService, CommonService, localStorageService) {
            $rootScope.isModyfied = localStorageService.get("isModyfied");//修改时间权限
            //加载课程类型
            $scope.callServerCourseTeachingTypeSelect = function callServerCourseTeachingTypeSelect() {
                CommonService.getCourseTeachingTypeSelect().then(function (result) {
                    $scope.courseTeachingType = result.data;
                });
            }();

        }
    ])
    .controller('OrderAddTransferTopupController', ['$scope', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'OrderTransferService', 'CommonService', 'LeadsStudentService', 'localStorageService',
        function ($scope, $modal, $rootScope, SweetAlert, OrderService, OrderTransferService, CommonService, LeadsStudentService, localStorageService) {

            $rootScope.isModyfied = localStorageService.get("isModyfied");//修改时间权限
            $scope.order.orderNos = [];
            $scope.order.orderRule = '';
            $scope.order.courseNum = 0;

            $scope.getProductIdSelect = function getProductIdSelect() {
                CommonService.getOffLineProductIdSelect().then(function (result) {
                    $scope.productIds = result.data;
                });
                $scope.subjectIds = [];
                $scope.gradeIds = [];
                $scope.courseTypeIds = [];
            }();

            $scope.getSubjectIdSelect = function getProductIdSelect() {
                CommonService.getSubjectIdSelect().then(function (result) {
                    $scope.subjectIds = result.data;
                });
            }();

            $scope.onProductIdSelect = function onProductIdSelect() {
                $scope.gradeIds = [];
                $scope.courseTypeIds = [];
                var params = {};
                params.productId = $scope.productId;
                //CommonService.getCourseTypeIdSelect(params).then(function (result) {
                //    $scope.courseTypeIds = result.data;
                //});
                OrderService.getCourseTypeIdSelect(params).then(function (result) {
                    $scope.courseTypeIds = result.data;
                });
            };

            $scope.onCourseTypeIdSelect = function onCourseTypeIdSelect() {
                $scope.gradeIds = [];
                var params = {};
                params.courseTypeId = $scope.courseTypeId;
                OrderService.getGradeIdSelect(params).then(function (result) {
                    $scope.gradeIds = result.data;
                });
            };


            $scope.addTransferCourse = function addTransferCourse() {
                if ($scope.productId == null || $scope.gradeId == null || $scope.subjectId == null || $scope.courseTypeId == null || $scope.order.originalNum == null) {
                    SweetAlert.swal('添加失败', '请选择全部条件重试');
                    return false;
                }

                OrderService.getOrderCourse($scope.productId, $scope.courseTypeId, $scope.gradeId, $scope.subjectId).then(function (result) {
                    $scope.courseId = result.data.id;
                    var subjectName = "";
                    angular.forEach($scope.subjectIds, function (data, index, array) {
                        if ($scope.subjectId == data.id) {
                            subjectName = data.name;
                        }
                    });

                    var orderCourse = {
                        'originalNum': Number($scope.order.originalNum),
                        'courseId': result.data.id,
                        'gradeId': result.data.gradeId,
                        'courseTypeId': result.data.courseTypeId,
                        'subjectId': $scope.subjectId,
                        'gradeName': result.data.gradeName,
                        'courseTypeName': result.data.courseTypeName,
                        'subjectName': subjectName
                    };
                    $scope.order.orderCourses = [];
                    $scope.order.orderCourses.push(orderCourse);
                });
            };

            //加载课程类型
            $scope.callServerCourseTeachingTypeSelect = function callServerCourseTeachingTypeSelect() {
                CommonService.getCourseTeachingTypeSelect().then(function (result) {
                    $scope.courseTeachingType = result.data;
                });
            }();

            //选择或者取消转课的订单（课时类型）
            $scope.selectOne = function (obj) {
                //; console.dir('select one'+obj);
                if ($.inArray(obj.orderNo, $scope.order.orderNos) >= 0) {
                    //$scope.order.orderNos.pop(obj.orderNo);
                    $scope.order.orderNosNew = [];
                    angular.forEach($scope.order.orderNos, function (data, index, array) {
                        if (data != obj.orderNo) {
                            $scope.order.orderNosNew.push(data);
                        }
                    });

                    $scope.order.orderNos = $scope.order.orderNosNew;
                    $scope.order.courseNum = $scope.order.courseNum - obj.consumeCourseNum;
                } else {
                    $scope.order.orderNos.push(obj.orderNo);
                    $scope.order.courseNum = $scope.order.courseNum + obj.consumeCourseNum;
                }

                $scope.order.originalNum = $scope.order.courseNum;
            };

            $scope.saveTransferOrderTopup = function saveTransferOrderTopup() {
                if ($scope.order.endDate < $scope.order.startDate) {
                    SweetAlert.swal('终止日期不能小于生效日期!');
                    return false;
                }

                if ($scope.order.transferId == $scope.detail.crm_student_id) {
                    SweetAlert.swal('请选择其他转课人！');
                    return false;
                }
                $scope.order.crmStudentId = $scope.order.crmStudentId;
                $scope.order.transferId = $scope.order.transferId;
                $scope.order.courseId = $scope.courseId;
                $scope.order.subjectId = $scope.subjectId;
                var promise = OrderTransferService.saveTransferTopup($scope.order);
                promise.then(function (data) {
                    //$scope.dataLoading = false;
                    SweetAlert.swal('操作成功');
                    $scope.addTransferOrderModal.hide();
                    $scope.refreshCustomerOrderDetail();
                }, function (error) {
                    // $scope.dataLoading = false;
                    SweetAlert.swal('操作失败');
                    $scope.addTransferOrderModal.hide();
                });

            }


            //弹出搜索leads窗口
            $scope.searchCustomers = function vieCustomers() {
                $scope.modalTitle = '客户搜索';
                $scope.searchCustomersModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/searchCustomers.html',
                    show: true
                });
            }

            //选中同一校区转课对象
            $scope.selectTransferLeads = function (obj) {
                $scope.order.name = obj.name;
                $scope.order.transferId = obj.crm_student_id;
                $scope.searchCustomersModal.hide();
            };

            //搜索同一校区内的转课对象leads
            $scope.schoolCrmLeadsStudentFilter = {};
            $scope.schoolCrmLeadsStudentListTableState = {};
            $scope.getLeadsList = function getLeadsList(tableState) {
                $scope.schoolCrmLeadsStudentListTableState = tableState;
                $scope.isSchoolLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;
                LeadsStudentService.schoolListAll(start, number, tableState, $scope.schoolCrmLeadsStudentFilter).then(function (result) {
                    $scope.CrmLeadsStudentList = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;
                    $scope.schoolCrmLeadsStudentListTableState = tableState;
                    $scope.isSchoolLoading = false;
                });
            };

        }
    ])
    .controller('OrderAuditTransferTopupController', ['$scope', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'OrderTransferService', 'CommonService', 'localStorageService',
        function ($scope, $modal, $rootScope, SweetAlert, OrderService, OrderTransferService, CommonService, localStorageService) {
            $rootScope.isModyfied = localStorageService.get("isModyfied");//修改时间权限
            //加载课程类型
            $scope.callServerCourseTeachingTypeSelect = function callServerCourseTeachingTypeSelect() {
                CommonService.getCourseTeachingTypeSelect().then(function (result) {
                    $scope.courseTeachingType = result.data;
                });
            }();

            //转课审核通过
            $scope.auditOrderTransferPass = function auditOrderTransferPass() {
                SweetAlert.swal({
                        title: "确定要审核通过吗？",
                        type: null,
                        showCancelButton: true,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true
                    }, function (confirm) {
                        if (confirm) {
                            var promise = OrderTransferService.editTransferBackTopup($scope.order);
                            promise.then(function (data) {
                                SweetAlert.swal('操作成功');
                                $scope.auditTransferOrderBack.hide();
                                $scope.refreshTabs();
                            }, function (error) {
                                SweetAlert.swal('操作失败');
                                $scope.auditTransferOrderBack.hide();
                            });
                        }
                    }
                );
            }
        }
    ])
    .controller('OrderDetailTransferTopupController', ['$scope', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'OrderTransferService', 'CommonService', 'localStorageService',
        function ($scope, $modal, $rootScope, SweetAlert, OrderService, OrderTransferService, CommonService, localStorageService) {
            $rootScope.isModyfied = localStorageService.get("isModyfied");//修改时间权限
            //加载课程类型
            $scope.callServerCourseTeachingTypeSelect = function callServerCourseTeachingTypeSelect() {
                CommonService.getCourseTeachingTypeSelect().then(function (result) {
                    $scope.courseTeachingType = result.data;
                });
            }();
        }
    ])
    .controller('OrderChargeController', ['$scope', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'CommonService', 'localStorageService',
        function ($scope, $modal, $rootScope, SweetAlert, OrderService, CommonService, localStorageService) {
            $rootScope.isModyfied = localStorageService.get("isModyfied");//修改时间权限
            $scope.chargeModel = 0
            $(document).on('click', '[name="chargeModel"]', function () {
                $scope.chargeModel = $(this).val()
            })
            /**
             * 判断保存按钮是否显示
             */
            $scope.isSaveShowFlag = false;
            $scope.isSaveShow = function isSaveShow() {
                if ($scope.order.supplementaryFee > 0) {
                    if ($scope.order.orderStatus != 14 && $scope.order.orderStatus != undefined) {
                        var temp = Number(($scope.order.totalPrice - $scope.order.privilegeAmount - $scope.order.realPayAmount).toFixed(2));
                        if ($scope.order.supplementaryFee <= temp) {
                            $scope.isSaveShowFlag = true;
                        } else {
                            $scope.isSaveShowFlag = false;
                        }
                    } else {
                        $scope.isSaveShowFlag = true;
                    }

                } else {
                    $scope.isSaveShowFlag = false;
                }
            }
            $scope.isSaveShowV3 = function isSaveShowV3() {
                var arg = $scope.chargeModel
                if ($scope.ordersMoreCharge[arg].supplementaryFee > 0) {
                    if ($scope.ordersMoreCharge[arg].orderStatus != 14 && $scope.ordersMoreCharge[arg].orderStatus != undefined) {
                        var temp = Number(($scope.ordersMoreCharge[arg].totalPrice - $scope.ordersMoreCharge[arg].privilegeAmount - $scope.ordersMoreCharge[arg].realPayAmount).toFixed(2));
                        if ($scope.ordersMoreCharge[arg].supplementaryFee <= temp) {
                            $scope.isSaveShowFlag = true;
                        } else {
                            $scope.isSaveShowFlag = false;
                        }
                    } else {
                        $scope.isSaveShowFlag = true;
                    }

                } else {
                    $scope.isSaveShowFlag = false;
                }
            }
            $scope.isSaveShowV2 = function isSaveShow(arg) {
                if (arg >= 0) {
                    if ($scope.orders[arg].supplementaryFee > 0) {
                        if ($scope.orders[arg].orderStatus != 14 && $scope.orders[arg].orderStatus != undefined) {
                            var temp = Number(($scope.orders[arg].totalPrice - $scope.orders[arg].privilegeAmount - $scope.orders[arg].realPayAmount).toFixed(2));
                            if ($scope.orders[arg].supplementaryFee <= temp) {
                                $scope.isSaveShowFlag = true;
                            } else {
                                $scope.isSaveShowFlag = false;
                            }
                        } else {
                            $scope.isSaveShowFlag = true;
                        }

                    } else {
                        $scope.isSaveShowFlag = false;
                    }
                } else if ($scope.moreOrder.supplementaryFee > 0) {
                    if ($scope.moreOrder.orderStatus != 14 && $scope.moreOrder.orderStatus != undefined) {
                        var temp = Number(($scope.moreOrder.totalPrice - $scope.moreOrder.privilegeAmount - $scope.moreOrder.realPayAmount).toFixed(2));
                        if ($scope.moreOrder.supplementaryFee <= temp) {
                            $scope.isSaveShowFlag = true;
                        } else {
                            $scope.isSaveShowFlag = false;
                        }
                    } else {
                        $scope.isSaveShowFlag = true;
                    }

                } else {
                    $scope.isSaveShowFlag = false;
                }
            }
            /**
             * 添加交费记录
             */
            $scope.saveTempChargeRecord = function saveTempChargeRecord() {
                if (!$scope.order.payDate) {
                    SweetAlert.swal('请选择收缴费日期！');
                    return false
                }
                $scope.orderPaymentTemp = {};
                // 页面上输入的合同号、交费日期、交费金额
                $scope.orderPaymentTemp.orderNo = $scope.order.orderNo;
                $scope.orderPaymentTemp.payAmount = Number($scope.order.supplementaryFee);

                if ($scope.order.payDate.constructor == Date) {
                    // $scope.orderPaymentTemp.payDate = new Date($scope.order.payDate.getFullYear() + '/' + ($scope.order.payDate.getMonth() + 1) + "/" + $scope.order.payDate.getDate() + ' 00:00:00');
                    $scope.orderPaymentTemp.payDate = $scope.order.payDate
                } else {
                    // $scope.orderPaymentTemp.payDate = new Date($scope.order.payDate + ' 00:00:00');
                    $scope.orderPaymentTemp.payDate = new Date($scope.order.payDate);
                }

                ;
                $scope.orderPaymentTemp.paymentEdit = true;
                // 尾款金额需要计算出来
                $scope.order.realPayAmount = Number($scope.order.realPayAmount) + Number($scope.orderPaymentTemp.payAmount);
                $scope.orderPaymentTemp.payDueAmount = $scope.order.totalPrice - Number($scope.order.privilegeAmount) - $scope.order.realPayAmount;
                $scope.order.crmorderPayments.unshift($scope.orderPaymentTemp);
                // $scope.order.crmorderPayments.push($scope.orderPaymentTemp);
                // 将现有的收费值清空
                $scope.addShouFeiModal.hide();
            }
            /**
             * 添加交费记录
             */
            $scope.saveTempChargeRecordV2 = function saveTempChargeRecordV2(index) {
                var Obj = {}
                if (index >= 0) {
                    Obj = $scope.orders[index]
                } else {
                    Obj = $scope.moreOrder
                }
                if (!Obj.payDate) {
                    SweetAlert.swal('请选择收缴费日期！');
                    return false
                }
                $scope.orderPaymentTemp = {};
                // 页面上输入的合同号、交费日期、交费金额
                $scope.orderPaymentTemp.orderNo = Obj.orderNo;
                $scope.orderPaymentTemp.payAmount = Number(Obj.supplementaryFee);
                if (Obj.payDate.constructor == Date) {
                    // $scope.orderPaymentTemp.payDate = new Date(Obj.payDate.getFullYear() + '/' + (Obj.payDate.getMonth() + 1) + "/" + Obj.payDate.getDate() + ' 00:00:00');
                    $scope.orderPaymentTemp.payDate = Obj.payDate
                } else {
                    // $scope.orderPaymentTemp.payDate = new Date($scope.moreOrder.payDate + ' 00:00:00');
                    $scope.orderPaymentTemp.payDate = $scope.moreOrder.payDate
                }

                $scope.orderPaymentTemp.paymentEdit = true;
                // 尾款金额需要计算出来
                Obj.realPayAmount = Number(Obj.realPayAmount) + Number($scope.orderPaymentTemp.payAmount);
                $scope.orderPaymentTemp.payDueAmount = Obj.totalPrice - Number(Obj.privilegeAmount) - Obj.realPayAmount;

                if (!Obj.crmorderPayments) {
                    Obj.crmorderPayments = []
                }
                Obj.crmorderPayments.unshift($scope.orderPaymentTemp);
                // 将现有的收费值清空
                $scope.addShouFeiModal.hide();
            }

            var _payDate = '';

            function _getOrderCopy() {
                var data = angular.copy($scope.order)
                $scope.order.payDate = _payDate
                return data
            }

            $scope.chargeOrder = function chargeOrder() {
                if ($scope.order.orderStatus != 14 && $scope.order.orderStatus != 15) {
                    $scope.order.orderStatus = 2;
                }
                _payDate = $scope.order.payDate;
                if (!$scope.order.payDate) {
                    SweetAlert.swal('请选择缴费日期！');
                    return false
                }
                $scope.order.payDate = new Date($scope.order.payDate);
                OrderService.getOrderPayments(0, 1000, $scope.order.orderNo).then(function (result) {
                    if (result.data.length > 0) {
                        var maxPayDate = result.data[0].payDate;
                        if (maxPayDate > $scope.order.payDate.getTime()) {
                            SweetAlert.swal('本次支付时间不能小于上次支付时间！');
                            $scope.order.payDate = _payDate;
                            _getOrderCopy();
                            return;
                        }
                    }
                    /*if($scope.order.payDate.getTime() < $scope.order.contractStartDate.getTime()){
                     SweetAlert.swal("请确认交费日期是否正确，当前交费日期早于合同签约日期");
                     return;
                     }*/
                    var promise = OrderService.charge($scope.order);
                    promise.then(function (data) {
                        //$scope.dataLoading = false;
                        SweetAlert.swal('操作成功');
                        // 证明是结转收费、不刷新
                        if ($scope.order.orderStatus == 15) {
                            if (!($scope.chargeOrderModal === undefined)) {
                                $scope.chargeOrderModal.hide();
                            }
                        } else {
                            if (!($scope.chargeOrderModal === undefined)) {
                                $scope.chargeOrderModal.hide();
                            }

                            if (!($scope.modal === undefined)) {
                                $scope.modal.hide();
                            }
                            //表示从学员那过来订单
                            if ($scope.order.flag) {
                                $scope.refreshCustomerOrderDetail();
                            }
                            $scope.order.payDate = null;
                            $scope.refreshTabs();
                            $('.modal').remove()
                            try {
                                $rootScope._getIndexData_(3)
                                $rootScope._getIndexData_(5)
                            } catch (e) {

                            }
                        }
                    }, function (error) {
                        // $scope.dataLoading = false;
                        SweetAlert.swal('操作失败');
                        $scope.chargeOrderModal.hide();
                    });
                });
            }
            $scope.chargeOrderV3 = function chargeOrderV3(order) {
                if (order.orderStatus != 14 && order.orderStatus != 15) {
                    order.orderStatus = 2;
                }
                if (!order.payDate) {
                    SweetAlert.swal('请选择收缴费日期！');
                    return false
                }
                _payDate = order.payDate;
                order.payDate = new Date(order.payDate);
                OrderService.getOrderPayments(0, 1000, order.orderNo).then(function (result) {
                    if (result.data.length > 0) {
                        var maxPayDate = result.data[0].payDate;
                        if (maxPayDate > order.payDate.getTime()) {
                            SweetAlert.swal('本次支付时间不能小于上次支付时间！');
                            order.payDate = _payDate;
                            return;
                        }
                    }
                    /*if($scope.order.payDate.getTime() < $scope.order.contractStartDate.getTime()){
                     SweetAlert.swal("请确认交费日期是否正确，当前交费日期早于合同签约日期");
                     return;
                     }*/
                    var promise = OrderService.charge(order);
                    promise.then(function (data) {
                        //$scope.dataLoading = false;
                        SweetAlert.swal('操作成功');
                        // 证明是结转收费、不刷新
                        if (order.orderStatus == 15) {
                            if (!($scope.chargeOrderModal === undefined)) {
                                $scope.chargeOrderModal.hide();
                            }
                        } else {
                            if (!($scope.chargeOrderModal === undefined)) {
                                $scope.chargeOrderModal.hide();
                            }

                            if (!($scope.modal === undefined)) {
                                $scope.modal.hide();
                            }
                            //表示从学员那过来订单
                            if (order.flag) {
                                $scope.refreshCustomerOrderDetail();
                            }
                            order.payDate = null;
                            $scope.refreshTabs();
                            $('.modal').remove()
                            try {
                                $rootScope._getIndexData_(3)
                                $rootScope._getIndexData_(5)
                            } catch (e) {

                            }
                        }
                    }, function (error) {
                        // $scope.dataLoading = false;
                        SweetAlert.swal('操作失败');
                    });
                });
            }
            //服务器时间
            OrderService.getServeDate().then(function (result) {
                $rootScope.isModyfied = localStorageService.get("isModyfied");
                if (result.status = "SUCCESS") {
                    // $scope.order.payDate = new Date(result.data);
                    for (var i = 0, len = $scope.ordersMoreCharge.length; i < len; i++) {

                        var date = result.data && result.data.indexOf(':') > -1 ? result.data : Date.now()
                        $scope.ordersMoreCharge[i].payDate = new Date(date);
                    }
                }
            })
        }
    ])
    .controller('OrderChargebackController', ['$scope', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'CommonService', 'localStorageService',
        function ($scope, $modal, $rootScope, SweetAlert, OrderService, CommonService, localStorageService) {
            $rootScope.isModyfied = localStorageService.get("isModyfied");//修改时间权限
            $scope.orderTypeSelect = [{name: '新签', id: 1}, {name: '续费', id: 2}, {name: '返课', id: 3}, {
                name: '推荐',
                id: 5
            }, {name: '赠课', id: 8}];
            $scope.onIsAuditionSelect = function onIsAuditionSelect() {
                $scope.order.orderCoursesNew = [];
                angular.forEach($scope.order.orderCourses, function (data, index, array) {
                    if ($scope.order.isAudition == 1) {
                        data.isAudition = 1;
                    } else {
                        data.isAudition = 0;
                    }
                    $scope.order.orderCoursesNew.push(data);
                });
                $scope.order.orderCourses = $scope.order.orderCoursesNew;
            };
            //修改标准单价
            $scope.changeStandardPrice = function changeStandardPrice() {
                $scope.order.totalOriginalNum = 0;
                $scope.order.totalPrice = 0;
                angular.forEach($scope.order.orderCourses, function (data, index, array) {
                    //data等价于array[index]
                    //console.log(data.a+'='+array[index].a);
                    $scope.order.totalOriginalNum = $scope.order.totalOriginalNum + data.originalNum;
                    $scope.order.totalPrice = $scope.order.totalPrice + (data.originalNum * data.actualPrice);
                });
                // 判断时长
                if ($scope.order.orderRule == 1) {
                    $scope.order.hours = $scope.order.totalOriginalNum;
                    $scope.order.minite = 0;
                } else {
                    $scope.order.hours = parseInt($scope.order.totalOriginalNum * 40 / 60);
                    $scope.order.minite = parseInt(($scope.order.totalOriginalNum * 40) % 60);
                }
            };

            $scope.getProductIdSelect = function getProductIdSelect() {
                CommonService.getOffLineProductIdSelect().then(function (result) {
                    $scope.productIds = result.data;
                });
                $scope.subjectIds = [];
                $scope.gradeIds = [];
                $scope.courseTypeIds = [];
            }();

            $scope.getSubjectIdSelect = function getProductIdSelect() {
                CommonService.getSubjectIdSelect().then(function (result) {
                    $scope.subjectIds = result.data;
                });
            }();

            $scope.onProductIdSelect = function onProductIdSelect() {
                $scope.gradeIds = [];
                $scope.courseTypeIds = [];
                var params = {};
                params.productId = $scope.productId;
                //CommonService.getCourseTypeIdSelect(params).then(function (result) {
                //    $scope.courseTypeIds = result.data;
                //});
                OrderService.getCourseTypeIdSelect(params).then(function (result) {
                    $scope.courseTypeIds = result.data;
                });
            };

            $scope.onCourseTypeIdSelect = function onCourseTypeIdSelect() {
                $scope.gradeIds = [];
                var params = {};
                params.courseTypeId = $scope.courseTypeId;
                OrderService.getGradeIdSelect(params).then(function (result) {
                    $scope.gradeIds = result.data;
                });
            };

            //订单新增课程信息
            $scope.addOrderCourse = function addOrderCourse() {
                if ($scope.productId == null || $scope.gradeId == null || $scope.subjectId == null || $scope.courseTypeId == null || $scope.originalNum == null) {
                    SweetAlert.swal('添加失败', '请选择全部条件重试');
                    return false;
                }

                if ($scope.order && $scope.order.orderCourses && $scope.order.orderCourses.length > 0 && $scope.order.orderCourses[0].gradeId && $scope.order.orderCourses[0].gradeId != $scope.gradeId) {
                    SweetAlert.swal('添加失败', '订单中课程年级必须一致');
                    return false;
                }

                var originalNumNew = $scope.originalNum;
                OrderService.getOrderCourse($scope.productId, $scope.courseTypeId, $scope.gradeId, $scope.subjectId).then(function (result) {
                    var subjectName = "";
                    angular.forEach($scope.subjectIds, function (data, index, array) {
                        if ($scope.subjectId == data.id) {
                            subjectName = data.name;
                        }
                    });

                    var orderCourse = {
                        'originalNum': Number(originalNumNew), 'courseId': result.data.id,
                        'gradeId': result.data.gradeId,
                        'courseTypeId': result.data.courseTypeId,
                        'subjectId': $scope.subjectId,
                        'gradeName': result.data.gradeName,
                        'courseTypeName': result.data.courseTypeName,
                        'subjectName': subjectName,
                        'standardPrice': result.data.standardPrice,
                        'actualPrice': result.data.standardPrice,
                        'teacherId': result.data.teacherId,
                        'isAudition': $scope.order.isAudition
                    };
                    $scope.order.orderCourses.push(orderCourse);
                    $scope.order.totalOriginalNum = (parseInt(originalNumNew) + parseInt($scope.order.totalOriginalNum));
                    $scope.order.totalPrice = $scope.order.totalPrice + (originalNumNew * result.data.standardPrice);
                    orderCourse = null;
                    $scope.subjectId = null;
                });
                $scope.gradeId = null;
                $scope.courseTypeId = null;
                $scope.gradeName = null;
                $scope.subjectName = null;
                $scope.courseTypeName = null;
                $scope.productId = null;
                $scope.originalNum = null;
            };

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

            //订单删除课程信息
            $scope.delOrderCourse = function delOrderCourse(obj) {
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
            };

            $scope.updateOrder = function updateOrder() {
                $scope.order.totalPrice = Number($scope.order.totalPrice.toFixed(2));
                $scope.order.contractEndDate = new Date($scope.order.contractEndDate);
                // if ($scope.order.contractEndDate < $scope.order.contractStartDate) {
                //     SweetAlert.swal('到期时间不能小于签约时间!');
                //     return false;
                // }

                if ($scope.order.orderCourses.length == 0) {
                    SweetAlert.swal('请选择课程!');
                    return false;
                }
                var sfjeTemp = Number((Number(($scope.order.totalPrice - $scope.order.privilegeAmount).toFixed(2)) - $scope.order.realPayAmount).toFixed(2));
                var sfje = Number((sfjeTemp - $scope.order.supplementaryFee).toFixed(2));
                if (sfje < 0) {
                    SweetAlert.swal('实付金额填写错误', '请重试');
                    return false;
                }

                $scope.order.realTotalAmount = $scope.order.totalPrice - $scope.order.privilegeAmount;
                $scope.order.payDueAmount = $scope.order.totalPrice - $scope.order.privilegeAmount - $scope.order.realPayAmount - $scope.order.supplementaryFee;
                var promise = OrderService.edit($scope.order);
                promise.then(function (data) {
                    //$scope.dataLoading = false;
                    SweetAlert.swal('操作成功');
                    $scope.modal.hide();
                    if (!($scope.modal === undefined)) {
                        $scope.modal.hide();
                    }
                    $scope.refreshTabs();
                }, function (error) {
                    // $scope.dataLoading = false;
                    SweetAlert.swal('操作失败');
                    $scope.modal.hide();
                });

            }
        }
    ])
    .controller('OrderChargeBackTopupController', ['$scope', '$timeout', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'CommonService', 'localStorageService',
        function ($scope, $timeout, $modal, $rootScope, SweetAlert, OrderService, CommonService, localStorageService) {
            $rootScope.isModyfied = localStorageService.get("isModyfied");//修改时间权限
            $scope.refundTopup = refundTopup;
            $scope.orderTypeSelect = [{name: '新签', id: 1}, {name: '续费', id: 2}, {name: '返课', id: 3}, {
                name: '推荐',
                id: 5
            }, {name: '赠课', id: 8}];
            $scope.onIsAuditionSelect = function onIsAuditionSelect() {
                $scope.order.orderCoursesNew = [];
                angular.forEach($scope.order.orderCourses, function (data, index, array) {
                    if ($scope.order.isAudition == 1) {
                        data.isAudition = 1;
                    } else {
                        data.isAudition = 0;
                    }
                    $scope.order.orderCoursesNew.push(data);
                });
                $scope.order.orderCourses = $scope.order.orderCoursesNew;
            };
            //修改标准单价
            $scope.changeStandardPrice = function changeStandardPrice() {
                $scope.order.totalOriginalNum = 0;
                $scope.order.totalPrice = 0;
                angular.forEach($scope.order.orderCourses, function (data, index, array) {
                    //data等价于array[index]
                    //console.log(data.a+'='+array[index].a);
                    $scope.order.totalOriginalNum = $scope.order.totalOriginalNum + data.originalNum;
                    $scope.order.totalPrice = $scope.order.totalPrice + (data.originalNum * data.actualPrice);
                });
                // 判断时长
                if ($scope.order.orderRule == 1) {
                    $scope.order.hours = $scope.order.totalOriginalNum;
                    $scope.order.minite = 0;
                } else {
                    $scope.order.hours = parseInt($scope.order.totalOriginalNum * 40 / 60);
                    $scope.order.minite = parseInt(($scope.order.totalOriginalNum * 40) % 60);
                }
            };

            $scope.getProductIdSelect = function getProductIdSelect() {
                CommonService.getOffLineProductIdSelect().then(function (result) {
                    $scope.productIds = result.data;
                });
                $scope.subjectIds = [];
                $scope.gradeIds = [];
                $scope.courseTypeIds = [];
            }();

            $scope.getSubjectIdSelect = function getProductIdSelect() {
                CommonService.getSubjectIdSelect().then(function (result) {
                    $scope.subjectIds = result.data;
                });
            }();

            $scope.onProductIdSelect = function onProductIdSelect() {
                $scope.gradeIds = [];
                $scope.courseTypeIds = [];
                var params = {};
                params.productId = $scope.productId;
                //CommonService.getCourseTypeIdSelect(params).then(function (result) {
                //    $scope.courseTypeIds = result.data;
                //});
                OrderService.getCourseTypeIdSelect(params).then(function (result) {
                    $scope.courseTypeIds = result.data;
                });
            };

            $scope.onCourseTypeIdSelect = function onCourseTypeIdSelect() {
                $scope.gradeIds = [];
                var params = {};
                params.courseTypeId = $scope.courseTypeId;
                OrderService.getGradeIdSelect(params).then(function (result) {
                    $scope.gradeIds = result.data;
                });
            };

            //订单新增课程信息
            $scope.addOrderCourse = function addOrderCourse() {
                if ($scope.productId == null || $scope.gradeId == null || $scope.subjectId == null || $scope.courseTypeId == null || $scope.originalNum == null) {
                    SweetAlert.swal('添加失败', '请选择全部条件重试');
                    return false;
                }

                if ($scope.order && $scope.order.orderCourses && $scope.order.orderCourses.length > 0 && $scope.order.orderCourses[0].gradeId && $scope.order.orderCourses[0].gradeId != $scope.gradeId) {
                    SweetAlert.swal('添加失败', '订单中课程年级必须一致');
                    return false;
                }

                var originalNumNew = $scope.originalNum;
                OrderService.getOrderCourse($scope.productId, $scope.courseTypeId, $scope.gradeId, $scope.subjectId).then(function (result) {
                    var subjectName = "";
                    angular.forEach($scope.subjectIds, function (data, index, array) {
                        if ($scope.subjectId == data.id) {
                            subjectName = data.name;
                        }
                    });

                    var orderCourse = {
                        'originalNum': Number(originalNumNew), 'courseId': result.data.id,
                        'gradeId': result.data.gradeId,
                        'courseTypeId': result.data.courseTypeId,
                        'subjectId': $scope.subjectId,
                        'gradeName': result.data.gradeName,
                        'courseTypeName': result.data.courseTypeName,
                        'subjectName': subjectName,
                        'standardPrice': result.data.standardPrice,
                        'actualPrice': result.data.standardPrice,
                        'teacherId': result.data.teacherId,
                        'isAudition': $scope.order.isAudition
                    };
                    $scope.order.orderCourses.push(orderCourse);
                    $scope.order.totalOriginalNum = (parseInt(originalNumNew) + parseInt($scope.order.totalOriginalNum));
                    $scope.order.totalPrice = $scope.order.totalPrice + (originalNumNew * result.data.standardPrice);
                    orderCourse = null;
                    $scope.subjectId = null;
                });
                $scope.gradeId = null;
                $scope.courseTypeId = null;
                $scope.gradeName = null;
                $scope.subjectName = null;
                $scope.courseTypeName = null;
                $scope.productId = null;
                $scope.originalNum = null;
            };

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

            //订单删除课程信息
            $scope.delOrderCourse = function delOrderCourse(obj) {
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
            };

            $scope.updateOrder = function updateOrder() {
                $scope.order.totalPrice = Number($scope.order.totalPrice.toFixed(2));
                $scope.order.contractEndDate = new Date($scope.order.contractEndDate);
                // if ($scope.order.contractEndDate < $scope.order.contractStartDate) {
                //     SweetAlert.swal('到期时间不能小于签约时间!');
                //     return false;
                // }
                $scope.order.orderCoursesNew.push(data);
                // });
                $scope.order.orderCourses = $scope.order.orderCoursesNew;
                // };
                $scope.order.orderCoursesNew.push(data);
                // });
                $scope.order.orderCourses = $scope.order.orderCoursesNew;
                // };

                if ($scope.order.orderCourses.length == 0) {
                    SweetAlert.swal('请选择课程!');
                    return false;
                }
                var sfjeTemp = Number((Number(($scope.order.totalPrice - $scope.order.privilegeAmount).toFixed(2)) - $scope.order.realPayAmount).toFixed(2));
                var sfje = Number((sfjeTemp - $scope.order.supplementaryFee).toFixed(2));
                if (sfje < 0) {
                    SweetAlert.swal('实付金额填写错误', '请重试');
                    return false;
                }

                $scope.order.realTotalAmount = $scope.order.totalPrice - $scope.order.privilegeAmount;
                $scope.order.payDueAmount = $scope.order.totalPrice - $scope.order.privilegeAmount - $scope.order.realPayAmount - $scope.order.supplementaryFee;
                var promise = OrderService.edit($scope.order);
                promise.then(function (data) {
                    //$scope.dataLoading = false;
                    SweetAlert.swal('操作成功');
                    $scope.modal.hide();
                    if (!($scope.modal === undefined)) {
                        $scope.modal.hide();
                    }
                    $scope.refreshTabs();
                }, function (error) {
                    // $scope.dataLoading = false;
                    SweetAlert.swal('操作失败');
                    $scope.modal.hide();
                });

            }

            //退单
            function refundTopup() {
                if (undefined == $scope.order.refundAmount || $scope.order.refundAmount > $scope.order.realPayAmount) {
                    SweetAlert.swal('退单金额填写不正确');
                    return false;
                }

                //审核通过的订单退单
                var promise = OrderService.hasOmsCoursePlanByOrderNo($scope.order.orderNo);
                promise.then(function (result) {
                    $scope.hasPastCourseFlag = result.hasPastCourseFlag;
                    $scope.hasUnPastCourseFlag = result.hasUnPastCourseFlag;
                    if ($scope.hasPastCourseFlag) {
                        SweetAlert.swal('该学生已上课，请退费！');
                        return;
                    }
                    if ($scope.hasUnPastCourseFlag) {
                        SweetAlert.swal({
                                title: "该学生已排课，是否删除排课记录并退单?", text: "", type: "warning", showCancelButton: true,
                                confirmButtonColor: "#DD6B55", confirmButtonText: "是", cancelButtonText: "否",
                                closeOnConfirm: true, closeOnCancel: true
                            },
                            function (isConfirm) {
                                if (isConfirm) {
                                    var orderStatus = 5;
                                    if ($scope.order.orderStatus == 3) {
                                        var ext = 'hasAuditOrderRefund';
                                    } else {
                                        var ext = null;
                                    }
                                    OrderService.updateStatusTopup($scope.order, orderStatus, $scope.refundAmount, ext).then(function (result) {
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
                                        $scope.modal.hide();
                                        if (!($scope.modal === undefined)) {
                                            $scope.modal.hide();
                                        }
                                        $scope.refreshTabs();
                                    });
                                } else {
                                    return false;
                                }
                            });
                    }
                    if (!$scope.hasPastCourseFlag && !$scope.hasUnPastCourseFlag) {
                        SweetAlert.swal({
                                title: "是否退单?", text: "", type: "warning", showCancelButton: true,
                                confirmButtonColor: "#DD6B55", confirmButtonText: "是", cancelButtonText: "否",
                                closeOnConfirm: true, closeOnCancel: true
                            },

                            function (isConfirm) {
                                if (isConfirm) {
                                    var orderStatus = 5;
                                    if ($scope.order.orderStatus == 3) {
                                        var ext = 'hasAuditOrderRefund';
                                    } else {
                                        var ext = null;
                                    }
                                    OrderService.updateStatusTopup($scope.order, orderStatus, $scope.refundAmount, ext).then(function (result) {
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
                                        $scope.modal.hide();
                                        if (!($scope.modal === undefined)) {
                                            $scope.modal.hide();
                                        }
                                        $scope.refreshTabs();
                                    });
                                } else {
                                    return false;
                                }
                            })
                    }
                })
            }

            $timeout(function () {
                $("[data-toggle='tooltip']").tooltip();
            }, 1000);
        }
        // bbbbbbbb
    ])
    .controller('OrderAddTopupController', ['$scope', '$mtModal', '$timeout', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'CommonService', 'AuthenticationService',
        'CrmChargingSchemeService', 'CustomerStudentService', 'CoursePlanService', 'LeadsStudentService', 'CustomerStudentCourseService', 'localStorageService',
        function ($scope, $mtModal, $timeout, $modal, $rootScope, SweetAlert, OrderService, CommonService, AuthenticationService, CrmChargingSchemeService, CustomerStudentService
            , CoursePlanService, LeadsStudentService, CustomerStudentCourseService, localStorageService) {
            $rootScope.isModyfied = localStorageService.get("isModyfied");//修改时间权限
            $scope.orderTypeSelect = [{name: '新签', id: 1}, {name: '续费', id: 2}, {name: '返课', id: 3}, {
                name: '推荐',
                id: 5
            }, {name: '赠课', id: 8}];
            $scope.isCourseAuditionSelect = [{name: '是', id: 1}, {name: '否', id: 0}];
            if ($scope.order.recharge == undefined) {
                $scope.order.recharge = {};
            }
            $scope.order.recharge.orderCourses = [];
            // 定义业绩的对象
            $scope.order.recharge.achievementRatios = [];
            $scope.order.recharge.achievementRatio = {};
            // 定义交费记录数组
            $scope.order.recharge.crmorderPayments = [];
            $scope.order.ratioInvalid = false;
            $scope.order.recharge.totalOriginalNum = 0;
            $scope.order.recharge.totalPrice = 0;
            $scope.order.recharge.originalNum = 0;
            $scope.order.rechargeNoExist = false;
            $scope.order.recharge.name = $scope.order.name;
            $scope.order.recharge.accountBalance = $scope.order.accountBalance;
            $scope.order.recharge.totalPrice = $scope.order.totalPrice;
            $scope.order.recharge.gradeId = $scope.order.gradeId;
            $scope.order.recharge.crmStudentId = $scope.order.crmStudentId;

            //获取课程类型 年级 科目 下拉菜单
            $scope.callServerOrderCourseSelect2 = function callServerOrderCourseSelect2() {
                CommonService.getGradeIdSelect().then(function (result) {
                    $scope.leadGradeIds = result.data;
                });
            }();


            $scope.clearOrderNo = function clearOrderNo() {
                if ($scope.order.nakedContract) {
                    $scope.order.orderNo = null;
                    $scope.order.recharge.orderNo = null;
                }
            }

            $scope.mediaChannel2List = [];
            $scope.mediaChannel1Change = function () {
                if ($scope.order.recharge.leadMediaChannelId1) {
                    CommonService.getMediaChannel($scope.order.recharge.leadMediaChannelId1).then(function (result) {
                        $scope.mediaChannel2List = result.data;
                    });
                } else {
                    $scope.mediaChannel2List = [];
                }
                $scope.order.recharge.leadMediaChannelId2 = null;
            }

            $scope.mediaChannel3List = [];
            $scope.mediaChannel2Change = function () {

                if ($scope.order.recharge.leadMediaChannelId2) {
                    CommonService.getMediaChannel($scope.order.recharge.leadMediaChannelId2).then(function (result) {
                        $scope.mediaChannel3List = result.data;
                    });
                } else {
                    $scope.mediaChannel3List = [];
                }
                $scope.order.recharge.leadMediaChannelId3 = null;
            }


            $scope.rechargeNoExistCheck = function orderNoExistCheck() {
                if ($scope.order.recharge.orderStatus == 14 || $scope.order.recharge.orderStatus == 15) {
                    if ($scope.order.recharge.orderNo == $scope.order.recharge.originalOrderNo) {
                        $scope.order.recharge.orderNo = $scope.order.recharge.orderNoNew;
                    }
                }
                if ($scope.order.recharge.orderNo == '') {
                    return false;
                }
                var promiseExist = OrderService.orderNoExist($scope.order.recharge.orderNo);
                promiseExist.then(function (data) {
                    if (data.data) {
                        $scope.order.rechargeNoExist = data;
                        SweetAlert.swal('该合同编号已存在');
                        return false;
                    } else {
                        $scope.order.rechargeNoExist = null;
                        return true;
                    }
                });
            };
            //获取当前校区的归属人
            $scope.getCustomerBelongersSelect = function getCustomerBelongersSelect() {
                OrderService.getCustomerBelongersSelect().then(function (result) {
                    $scope.customerBelongers = result.data;
                });
            }();

            //获取当前校区的签约人岗位
            $scope.getContractorPositionsSelect = function getContractorPositionsSelect() {
                OrderService.getContractorPositionsSelect().then(function (result) {
                    $scope.contractorPositions = result.data;
                });
            }();

            $scope.onContractorPositionSelect = function onContractorPositionSelect() {
                //alert('onContractorPositionSelect'+$scope.order.recharge.contractorPosition);
                OrderService.getContractorsSelect($scope.order.recharge.contractorPosition).then(function (result) {
                    $scope.contractors = result.data;
                });
            };


            $scope.onIsAuditionSelect = function onIsAuditionSelect() {
                $scope.order.recharge.orderCoursesNew = [];
                angular.forEach($scope.order.recharge.orderCourses, function (data, index, array) {
                    if ($scope.order.recharge.isAudition == 1) {
                        data.isAudition = 1;
                    } else {
                        data.isAudition = 0;
                    }
                    $scope.order.recharge.orderCoursesNew.push(data);
                });
                $scope.order.recharge.orderCourses = $scope.order.recharge.orderCoursesNew;
            };

            $scope.onIsCourseAuditionSelect = function onIsCourseAuditionSelect() {
                OrderService.getStudentAuditionTeachingList($scope.order.recharge.crmStudentId).then(function (result) {
                    $scope.Teachers = result.data;
                });
            };

            $scope.getProductIdSelect = function getProductIdSelect() {
                CommonService.getOffLineProductIdSelect().then(function (result) {
                    $scope.productIds = result.data;
                });
                $scope.subjectIds = [];
                $scope.gradeIds = [];
                $scope.courseTypeIds = [];
            }();

            $scope.getSubjectIdSelect = function getProductIdSelect() {
                CommonService.getSubjectIdSelect().then(function (result) {
                    $scope.subjectIds = result.data;
                });
            }();

            $scope.onProductIdSelect = function onProductIdSelect() {
                $scope.gradeIds = [];
                $scope.courseTypeIds = [];
                var params = {};
                params.productId = $scope.productId;
                //CommonService.getCourseTypeIdSelect(params).then(function (result) {
                //    $scope.courseTypeIds = result.data;
                //});
                OrderService.getCourseTypeIdSelect(params).then(function (result) {
                    $scope.courseTypeIds = result.data;
                });
            };

            $scope.onCourseTypeIdSelect = function onCourseTypeIdSelect() {
                $scope.gradeIds = [];
                var params = {};
                params.courseTypeId = $scope.courseTypeId;
                OrderService.getGradeIdSelect(params).then(function (result) {
                    $scope.gradeIds = result.data;
                });
            };
            var _contractEndDate = '',
                _contractStartDate = ''

            /**
             * 返回并重置签约时间和到期时间
             * @returns {*}
             * @private
             */
            function _getOrderCopy() {
                var data = angular.copy($scope.order)
                $scope.order.recharge.contractEndDate = _contractEndDate
                $scope.order.recharge.contractStartDate = _contractStartDate
                $('[ng-model="order.recharge.contractEndDate"]').val(_contractEndDate)
                $('[ng-model="order.recharge.contractStartDate"]').val(_contractStartDate)
                return data
            }

            $scope.orders = [];
            $scope.beforeSaveOrder = function beforeSaveOrder() {
                $scope.addProtocolEntrence = 'chuzhi';
                console.log($scope.order);
                var orderElement = angular.copy($scope.order);
                orderElement.recharge.orderCategory = 3;
                orderElement.orderCategory = 3;

                if (orderElement.recharge.orderType == 1 || orderElement.recharge.orderType == 2 || orderElement.recharge.orderType == 5) {
                    orderElement.recharge.masterSlaveRelation = 1;
                    $scope.orders.push(orderElement);
                    console.log($scope.orders);
                    SweetAlert.swal({
                        title: "是否有的优惠或赠课协议？",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: '有, 继续添加',
                        cancelButtonText: '没有，确认提交',
                        closeOnConfirm: true
                    }, function (confirm) {
                        if (confirm) {
                            $scope.modal.hide();
                            if ($scope.addProtocolModal) {
                                $scope.addProtocolModal.hide();
                            }
                            $scope.addProtocolModal = $modal({
                                scope: $scope,
                                templateUrl: mtModal.addProtocol,
                                show: true
                            });//partials/sos/order/addFromList.html
                        } else {
                            var promise = OrderService.orderNoExist($scope.orders[0].recharge.orderNo);
                            promise.then(function (data) {
                                console.log(data);
                                if (data.data == true) {
                                    SweetAlert.swal('合同编号已存在');
                                    $scope.modal.hide();
                                    return;
                                } else if (data.data == false) {
                                    $scope.saveOrder($scope.orders);
                                }
                            }, function (error) {
                                SweetAlert.swal('error');
                                $scope.modal.hide();
                            });
                            // $scope.saveOrder($scope.orders);
                        }
                    });
                } else if (orderElement.recharge.orderType == 8) {
                    $scope.order.orderCategory = 3;
                    $scope.order.recharge.orderCategory = 3;
                    $scope.order.masterSlaveRelation = 1;
                    $scope.orders.push($scope.order);
                    $scope.saveOrder($scope.orders);
                }
            }

            $scope.saveOrder = function saveOrder(obj) {
                var ordersArray = angular.copy(obj);

                _contractEndDate = obj[0].recharge.contractEndDate
                _contractStartDate = obj[0].recharge.contractStartDate

                ordersArray.forEach(function (i, index) {
                    for (var j = 0; j < $scope.leadGradeIds.length; j++) {
                        if ($scope.leadGradeIds[j].id == i.recharge.gradeId) {
                            i.currentGrade = $scope.leadGradeIds[j].name;
                            break;
                        }
                    }
                    if (i.recharge) {
                        ordersArray[index].recharge.achievementRatios = i.achievementRatios;
                        ordersArray[index].recharge.orderRelationTeachers = i.orderRelationTeachers;
                        ordersArray[index].recharge.crmorderPayments = i.crmorderPayments;
                        ordersArray[index].recharge.payDate = i.payDate;
                        if ($scope.createLead) {
                            ordersArray[index].createLead = true;
                        }
                        ordersArray[index].recharge.orderCourses = [];
                        ordersArray[index].recharge.totalPrice = Number(i.recharge.totalPrice.toFixed(2));
                        ordersArray[index].recharge.privilegeAmount = Number(Number(i.recharge.privilegeAmount).toFixed(2));
                        ordersArray[index].recharge.realPayAmount = Number(Number(i.recharge.realPayAmount).toFixed(2));
                        var orderCourse = {
                            'additionalAmount': i.recharge.totalPrice,
                            'avaliableAmount': i.recharge.totalPrice
                        };
                        ordersArray[index].recharge.orderCourses.push(orderCourse);
                        ordersArray[index].recharge.nakedContract = i.nakedContract;
                    }
                })


                for (var i = 0; i < ordersArray.length; i++) {
                    if (ordersArray[i].recharge) {
                        if (ordersArray[i].recharge.privilegeAmount - ordersArray[i].recharge.totalPrice > 0) {
                            SweetAlert.swal('优惠金额过大!');
                            ordersArray[i] = _getOrderCopy()
                            return false;
                        }
                        var sfje = Number((Number((ordersArray[i].recharge.totalPrice - ordersArray[i].recharge.privilegeAmount).toFixed(2)) - ordersArray[i].recharge.realPayAmount).toFixed(2));
                        if (sfje < 0) {
                            SweetAlert.swal('实付金额填写错误', '请重试');
                            ordersArray[i] = _getOrderCopy()
                            return false;
                        }
                        ordersArray[i].recharge.realTotalAmount = ordersArray[i].recharge.totalPrice - ordersArray[i].recharge.privilegeAmount;
                        ordersArray[i].recharge.payDueAmount = ordersArray[i].recharge.totalPrice - ordersArray[i].recharge.privilegeAmount - ordersArray[i].recharge.realPayAmount;
                    }
                }

                $scope.orders = [];
                if ($scope.orderOperating == 2) {//充值订单 --新增意向客户
                    var crmLeadsStudentVo = {};
                    crmLeadsStudentVo.phone = ordersArray[0].recharge.leadPhone;
                    crmLeadsStudentVo.name = ordersArray[0].recharge.name;
                    crmLeadsStudentVo.grade_id = ordersArray[0].recharge.gradeId;
                    crmLeadsStudentVo.media_channel_id_1 = ordersArray[0].recharge.leadMediaChannelId1;
                    crmLeadsStudentVo.media_channel_id_2 = ordersArray[0].recharge.leadMediaChannelId2;
                    LeadsStudentService.create(crmLeadsStudentVo).then(function (data) {
                        $scope.order.recharge.crmStudentId = data.data.id;

                        ordersArray.forEach(function (i, index) {
                            if (i.recharge) {
                                i.recharge.crmStudentId = data.data.id;
                                i.recharge.currentGrade = i.currentGrade;
                                i.recharge.currentSchool = i.currentSchool;
                                i.recharge.parentID = i.parentID;
                                i.recharge.parentName = i.parentName;
                                i.recharge.parentPhone = i.parentPhone;
                                i.recharge.specialOrderClassType = i.specialOrderClassType;
                                i.recharge.specialOrderType = i.specialOrderType;
                                i.recharge.specialOrderRequirements = i.specialOrderRequirements;

                                $scope.orders.push(i.recharge);
                            } else {
                                $scope.orders.push(i);
                            }
                        })

                        OrderService.addBatch($scope.orders).then(function (data) {
                            $scope.$broadcast("addOrderSuccess", "添加订单成功");
                            SweetAlert.swal('操作成功');
                            $scope.modal.hide();
                            $scope.schoolCrmLeadsStudentListTableState = {};
                            if ($scope.getList) {//刷新lead列表
                                $scope.getList($scope.schoolCrmLeadsStudentListTableState);
                            }
                            if ($scope.refreshCustomerOrderDetail) {
                                $scope.refreshCustomerOrderDetail()
                            }
                            if ($scope.order.createLead) {
                                //OrderManagementController.callServerOneTab(OrderManagementController.tableState);
                                $scope.$emit("refreshList", "刷新list");
                                $scope.$emit("refreshOrder", "刷新order");
                            }
                            $scope.studentId = 0;
                        }, function (error) {
                            // $scope.dataLoading = false;
                            SweetAlert.swal('操作失败');
                            $scope.modal.hide();
                        });
                    });
                } else {
                    ordersArray.forEach(function (i, index) {
                        if (i.orderCategory == 3) {
                            i.recharge.currentGrade = i.currentGrade;
                            i.recharge.currentSchool = i.currentSchool;
                            i.recharge.parentID = i.parentID;
                            i.recharge.parentName = i.parentName;
                            i.recharge.parentPhone = i.parentPhone;
                            i.recharge.specialOrderClassType = i.specialOrderClassType;
                            i.recharge.specialOrderType = i.specialOrderType;
                            i.recharge.specialOrderRequirements = i.specialOrderRequirements;

                            $scope.orders.push(i.recharge);
                        } else if (i.orderCategory == 1) {
                            // $scope.orders.push(i);
                            $scope.orders.push(i);
                        }
                    })
                    var promise = OrderService.addBatch($scope.orders);
                    promise.then(function (data) {
                        $scope.$broadcast("addOrderSuccess", "添加订单成功");
                        SweetAlert.swal('操作成功');
                        $scope.modal.hide();
                        $scope.schoolCrmLeadsStudentListTableState = {};
                        if ($scope.getList) {//刷新lead列表
                            $scope.getList($scope.schoolCrmLeadsStudentListTableState);
                        }
                        if ($scope.refreshCustomerOrderDetail) {
                            $scope.refreshCustomerOrderDetail()
                        }
                        if ($scope.order.createLead) {
                            $scope.$emit("refreshList", "刷新list");
                            $scope.$emit("refreshOrder", "刷新order");
                        }
                        $scope.studentId = 0;
                    }, function (error) {
                        if ($scope.addProtocolModal) {
                            $scope.addProtocolModal.hide()
                        }
                        if ($scope.modal) {
                            $scope.modal.hide();
                        }
                        SweetAlert.swal(error);
                    });
                }
            }

            $scope.saveNewOrderClear = function saveNewOrderClear() {
                $scope.order = {};
                $scope.order.recharge = {};
                $scope.gradeId = null;
                $scope.courseTypeId = null;
                $scope.gradeName = null;
                $scope.subjectName = null;
                $scope.courseTypeName = null;
                $scope.productId = null;
                $scope.originalNum = null;
            };

            $scope.saveNewOrder = function saveNewOrder() {
                $scope.order.recharge.totalPrice = Number($scope.order.recharge.totalPrice.toFixed(2));
                $scope.order.recharge.privilegeAmount = Number(Number($scope.order.recharge.privilegeAmount).toFixed(2));
                $scope.order.recharge.realPayAmount = Number(Number($scope.order.recharge.realPayAmount).toFixed(2));
                $scope.order.recharge.nakedContract = $scope.order.nakedContract;
                if ($scope.order.recharge.orderNo == undefined && ($scope.order.recharge.nakedContract == undefined || !$scope.order.recharge.nakedContract)) {
                    SweetAlert.swal({
                            title: "有合同的订单需要填写合同编号才可以进行审核，您可以在修改订单时填写",
                            text: "", type: false, showCancelButton: false,
                            confirmButtonColor: "#DD6B55", confirmButtonText: "OK", cancelButtonText: false,
                            closeOnConfirm: true, closeOnCancel: false
                        },
                        function (isConfirm) {
                            if (isConfirm) {
                                if ($scope.order.recharge.orderCourses.length == 0) {
                                    SweetAlert.swal('请选择课程!');
                                    return false;
                                }
                                if ($scope.order.recharge.privilegeAmount - $scope.order.recharge.totalPrice > 0) {
                                    SweetAlert.swal('优惠金额过大!');
                                    return false;
                                }

                                var sfje = Number((Number(($scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmount).toFixed(2)) - $scope.order.recharge.realPayAmount).toFixed(2));
                                if (sfje < 0) {
                                    SweetAlert.swal('实付金额填写错误', '请重试');
                                    return false;
                                }

                                $scope.order.recharge.contractStartDate = new Date($scope.order.recharge.contractStartDate);
                                $scope.order.recharge.contractEndDate = new Date($scope.order.recharge.contractEndDate);

                                var promiseExist = OrderService.orderNoExist($scope.order.recharge.orderNo);
                                promiseExist.then(function (data) {
                                    if (data.data) {
                                        $scope.order.rechargeNoExist = data;
                                        SweetAlert.swal('订单号已存在');
                                        订单号已存在
                                        return false;
                                    } else {
                                        $scope.order.recharge.realTotalAmount = $scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmount;
                                        $scope.order.recharge.payDueAmount = $scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmount - $scope.order.recharge.realPayAmount;
                                        if (!$scope.order.recharge.orderNo) {
                                            $scope.order.recharge.orderNo = "";
                                        }
                                        if ($scope.order.recharge.nakedContract) {
                                            $scope.order.recharge.nakedContract = 1;
                                        } else {
                                            $scope.order.recharge.nakedContract = 0;
                                        }
                                        var promise = OrderService.add($scope.order.recharge);
                                        var promise = OrderService.addAndNewLead($scope.order.recharge);
                                        promise.then(function (data) {
                                            SweetAlert.swal('操作成功');
                                            $scope.modalNewCustomerAndOrder.hide();
                                            $scope.order.recharge = {};
                                            $scope.queryStudent();
                                            $scope.callServerOneTab($scope.tableState);
                                        }, function (error) {
                                            SweetAlert.swal('操作失败');
                                            $scope.modalNewCustomerAndOrder.hide();
                                        });
                                    }
                                }, function (error) {
                                    SweetAlert.swal('网络异常');
                                    return false;
                                });
                            } else {
                                return false;
                            }
                        });
                } else {
                    if ($scope.order.recharge.orderNo == '') {
                        $scope.order.recharge.orderNo = null;
                    }
                    if ($scope.order.recharge.orderCourses.length == 0) {
                        SweetAlert.swal('请选择课程!');
                        return false;
                    }
                    if ($scope.order.recharge.privilegeAmount - $scope.order.recharge.totalPrice > 0) {
                        SweetAlert.swal('优惠金额过大!');
                        return false;
                    }

                    var sfje = Number((Number(($scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmount).toFixed(2)) - $scope.order.recharge.realPayAmount).toFixed(2));
                    if (sfje < 0) {
                        SweetAlert.swal('实付金额填写错误', '请重试');
                        return false;
                    }

                    $scope.order.recharge.contractStartDate = new Date($scope.order.recharge.contractStartDate);
                    $scope.order.recharge.contractEndDate = new Date($scope.order.recharge.contractEndDate);

                    var promiseExist = OrderService.orderNoExist($scope.order.recharge.orderNo);
                    promiseExist.then(function (data) {
                        if (data.data) {
                            $scope.order.rechargeNoExist = data;
                            SweetAlert.swal('订单号已存在');
                            return false;
                        } else {
                            $scope.order.recharge.realTotalAmount = $scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmount;
                            $scope.order.recharge.payDueAmount = $scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmount - $scope.order.recharge.realPayAmount;
                            if (!$scope.order.recharge.orderNo) {
                                $scope.order.recharge.orderNo = "";
                            }
                            if ($scope.order.recharge.nakedContract) {
                                $scope.order.recharge.nakedContract = 1;
                            } else {
                                $scope.order.recharge.nakedContract = 0;
                            }
                            var promise = OrderService.addAndNewLead($scope.order.recharge);
                            promise.then(function (data) {
                                SweetAlert.swal('操作成功');
                                $scope.modalNewCustomerAndOrder.hide();
                                $scope.order.recharge = {};
                                $scope.queryStudent();
                                $scope.callServerOneTab($scope.tableState);
                            }, function (error) {
                                // $scope.dataLoading = false;
                                SweetAlert.swal('操作失败');
                                $scope.modalNewCustomerAndOrder.hide();
                            });
                        }
                    }, function (error) {
                        SweetAlert.swal('网络异常');
                        return false;
                    });
                }
            };

            $scope.changeStandardPrice = function changeStandardPrice() {
                $scope.order.recharge.totalOriginalNum = 0;
                $scope.order.recharge.totalPrice = 0;
                angular.forEach($scope.order.recharge.orderCourses, function (data, index, array) {
                    //data等价于array[index]
                    //console.log(data.a+'='+array[index].a);
                    $scope.order.recharge.totalOriginalNum = $scope.order.recharge.totalOriginalNum + data.originalNum;
                    $scope.order.recharge.totalPrice = $scope.order.recharge.totalPrice + (data.originalNum * data.actualPrice);
                });
                // 判断时长
                if ($scope.order.recharge.orderRule == 1) {
                    $scope.order.recharge.hours = $scope.order.recharge.totalOriginalNum;
                    $scope.order.recharge.minite = 0;
                } else {
                    $scope.order.recharge.hours = parseInt($scope.order.recharge.totalOriginalNum * 40 / 60);
                    $scope.order.recharge.minite = parseInt(($scope.order.recharge.totalOriginalNum * 40) % 60);
                }
            };

            //订单删除课程信息
            $scope.delOrderCourse = function delOrderCourse(obj) {
                $scope.order.recharge.totalOriginalNum = $scope.order.recharge.totalOriginalNum - obj.originalNum;
                $scope.order.recharge.totalPrice = $scope.order.recharge.totalPrice - (obj.originalNum * obj.actualPrice);
                $scope.order.recharge.orderCoursesNew = [];
                angular.forEach($scope.order.recharge.orderCourses, function (data, index, array) {
                    if (data.$$hashKey != obj.$$hashKey) {
                        $scope.order.recharge.orderCoursesNew.push(data);
                    }
                });
                // 判断时长
                if ($scope.order.recharge.orderRule == 1) {
                    $scope.order.recharge.hours = $scope.order.recharge.totalOriginalNum;
                    $scope.order.recharge.minite = 0;
                } else {
                    $scope.order.recharge.hours = parseInt($scope.order.recharge.totalOriginalNum * 40 / 60);
                    $scope.order.recharge.minite = parseInt(($scope.order.recharge.totalOriginalNum * 40) % 60);
                }
                $scope.order.recharge.orderCourses = $scope.order.recharge.orderCoursesNew;
            };

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
                _conductPayments();
            }
            /**
             * 选择某一计费方案、查询出对应的师资等级列表、清空价格
             */
            $scope.selectOneCharging = function selectOneCharging(row) {
                $scope.order.recharge.orderChargingId = row.id;
                $scope.order.recharge.orderChargingScheme = angular.copy(row);
                $scope.order.recharge.orderChargingName = row.schemeName;
                $scope.orderTeacherLevelList = getPricesList(row);
                $scope.order.recharge.orderChargingPrice = "";
            }
            $scope.selectOneChargingConfirm = function selectOneChargingConfirm() {
                $scope.chargingModal.hide();
            }

            /**
             * 更新学生年级
             */
            function updateCustomerStudent() {
                var promiseNew = CustomerStudentService.update($scope.customerStudentDetail);
                promiseNew.then(function (data) {
                    //console.log(data);
                    if (data.status == 'FAILURE') {
                        SweetAlert.swal(data.data);
                        return false;
                    }
                }, function (error) {
                    SweetAlert.swal("更新学生年级失败");
                });
            }

            /**
             * 更改计费方案 type1更改年级 2更改师资等级
             */
            $scope.changeCharging = function changeCharging(type) {
                // 顺带更改学生的年级
                if ($scope.orderOperating == 2) {
                    $scope.order.recharge.orderChargingPrice = getPrice($scope.order.recharge.orderChargingScheme, $scope.order.recharge.orderTeacherLevel, $scope.order.recharge.gradeId);
                }
                if (type == 1) {
                    var customerStudentVo = {}
                    customerStudentVo.crm_student_id = $scope.order.recharge.crmStudentId;
                    var promise = CustomerStudentService.detail(customerStudentVo);
                    promise.then(function (result) {
                        $scope.customerStudentDetail = result;
                        if ($scope.order.recharge.orderChargingId == undefined || $scope.order.recharge.orderChargingId == "") {
                            SweetAlert.swal("请选择计费方案");
                            $scope.order.recharge.gradeId = $scope.customerStudentDetail.grade_id;
                            return;
                        }
                        if ($scope.order.recharge.orderTeacherLevel == undefined || $scope.order.recharge.orderTeacherLevel == "") {
                            SweetAlert.swal("请选择师资等级");
                            $scope.order.recharge.gradeId = $scope.customerStudentDetail.grade_id;
                            return;
                        }
                        var title = "该操作将要修改该学生的年级,是否确定?";
                        var unlawfulnessGrade = [14, 15, 16, 18, 19, 20]; // 非法年级
                        var flag_grade = unlawfulnessGrade.contains($scope.order.recharge.gradeId); //返回true
                        if (!flag_grade) {
                            $mtModal.moreModal({
                                scope: $scope,
                                status: 0,
                                text: title,
                                hasNext: function () {

                                    CoursePlanService.getWxClassTimeList($scope.order.recharge.crmStudentId, $scope.customerStudentDetail.grade_id, $scope.order.recharge.gradeId).then(function (result) {
                                        if (result.wxExist) {
                                            if (result.jk) {
                                                var t = "发现该学员有未消排课记录,系统将把这些排课记录的计费金额按本次修改调整,余额不足,系统将删除最后的" + result.jkCount + "条排课记录";
                                                $mtModal.moreModal({
                                                    scope: $scope,
                                                    status: 0,
                                                    text: t,
                                                    hasNext: function () {
                                                        CoursePlanService.saveGradeChange(result, $scope.order.recharge.crmStudentId, $scope.order.recharge.gradeId);
                                                        $scope.customerStudentDetail.grade_id = $scope.order.recharge.gradeId;
                                                        updateCustomerStudent();//更新学员年级
                                                        $scope.order.recharge.orderChargingPrice = getPrice($scope.order.recharge.orderChargingScheme, $scope.order.recharge.orderTeacherLevel, $scope.order.recharge.gradeId);
                                                        if ($scope.getMyCrmCustomerStudentList) {
                                                            $scope.getMyCrmCustomerStudentList($rootScope.tableState);
                                                        }
                                                        $scope.mtResultModal.hide();
                                                    },
                                                    cancel: function () {
                                                        $scope.order.recharge.gradeId = $scope.customerStudentDetail.grade_id;
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
                                                        CoursePlanService.saveGradeChange(result, $scope.order.recharge.crmStudentId, $scope.order.recharge.gradeId);
                                                        $scope.customerStudentDetail.grade_id = $scope.order.recharge.gradeId;
                                                        updateCustomerStudent();//更新学员年级
                                                        $scope.order.recharge.orderChargingPrice = getPrice($scope.order.recharge.orderChargingScheme, $scope.order.recharge.orderTeacherLevel, $scope.order.recharge.gradeId);
                                                        if ($scope.getMyCrmCustomerStudentList) {
                                                            $scope.getMyCrmCustomerStudentList($rootScope.tableState);
                                                        }
                                                        $scope.mtResultModal.hide();
                                                    },
                                                    cancel: function () {
                                                        $scope.order.recharge.gradeId = $scope.customerStudentDetail.grade_id;
                                                        $scope.mtResultModal.hide();
                                                    }
                                                });
                                            }
                                        } else {
                                            CoursePlanService.saveGradeChange(result, $scope.order.recharge.crmStudentId, $scope.order.recharge.gradeId);
                                            $scope.customerStudentDetail.grade_id = $scope.order.recharge.gradeId;
                                            updateCustomerStudent();//更新学员年级
                                            $scope.order.recharge.orderChargingPrice = getPrice($scope.order.recharge.orderChargingScheme, $scope.order.recharge.orderTeacherLevel, $scope.order.recharge.gradeId);
                                            if ($scope.getMyCrmCustomerStudentList) {
                                                $scope.getMyCrmCustomerStudentList($rootScope.tableState);
                                            }
                                            $scope.mtResultModal.hide();
                                        }
                                    });
                                },
                                cancel: function () {
                                    $scope.order.recharge.gradeId = $scope.customerStudentDetail.grade_id;
                                    $scope.mtResultModal.hide();
                                }
                            });
                        } else {
                            var untitle = "该学员年级为非法年级，请为学员重新选择年级";
                            $scope.order.recharge.gradeId = $scope.customerStudentDetail.grade_id;
                            SweetAlert.swal(untitle);
                            return;
                        }
                    }, function (error) {
                        SweetAlert.swal("获取学生信息失败");
                    });
                } else {
                    var unlawfulnessGrade = [14, 15, 16, 18, 19, 20]; // 非法年级
                    var flag_grade = unlawfulnessGrade.contains($scope.order.recharge.gradeId); //返回true
                    if (flag_grade) {
                        var untitle = "该学员年级为非法年级，请为学员重新选择年级";
                        SweetAlert.swal(untitle);
                        return;
                    }
                    if ($scope.updateIndex == -1) {
                        $scope.moreOrder.orderChargingPrice = getPrice($scope.moreOrder.orderChargingScheme, $scope.moreOrder.orderTeacherLevel, $scope.order.gradeId);
                        return false
                    }
                    $scope.order.recharge.orderChargingPrice = getPrice($scope.order.recharge.orderChargingScheme, $scope.order.recharge.orderTeacherLevel, $scope.order.recharge.gradeId);
                }
            }

            function updateCustomerStudent() {
                var promiseNew = CustomerStudentService.update($scope.customerStudentDetail);
                promiseNew.then(function (data) {
                    //console.log(data);
                    if (data.status == 'FAILURE') {
                        SweetAlert.swal(data.data);
                        return false;
                    }
                }, function (error) {
                    SweetAlert.swal("更新学生年级失败");
                });
            }

            /**
             * 进行添加业绩计算比例的操作
             */
            $scope.showAddAchievementRatio = function showAddAchievementRatio(type) {
                $scope.relationType = type;
                $scope.modalAchieveTitle = '选择员工和角色';
                if (type == 2) {
                    $scope.modalAchieveTitle = '选择试听课教师/授课教师';
                }
                // 展示科目信息
                CommonService.getSubjectIdSelect().then(function (result) {
                    $scope.omsSubject = result.data;
                });
                $scope.order.achievementRatio = {};
                $scope.order.achievementRatio.departmentId = AuthenticationService.currentUser().school_id;
                $scope.order.achievementRatio.departName = AuthenticationService.currentUser().department.name;
                $scope.operateRatio = "add";
                $scope.relationTypeFlag = false;
                if (type == 2) {
                    if ($scope.order.recharge.orderType == 1 || $scope.order.recharge.orderType == 5) {
                        $scope.order.achievementRatio.relationType = 1;
                        $scope.relationTypeFlag = true;
                    } else if ($scope.order.recharge.orderType == 2) {
                        $scope.order.achievementRatio.relationType = 2;
                        $scope.relationTypeFlag = true;
                    }
                }
                $scope.achieveRatioModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/modal.addAchievementRatio.html',
                    show: true
                });
            }

            // 改变列表中的比例
            $scope.changeRatio = function changeRatio(row) {
                var totalRatio = 0;
                var achievementRatios = angular.copy($scope.order.achievementRatios);
                for (var i = 0; i < $scope.order.achievementRatios.length; i++) {
                    if (row.userId != achievementRatios[i].userId) {
                        totalRatio = Number(achievementRatios[i].achievementRatio) + Number(totalRatio);
                    }
                }
                var totalRatioNew = Number(row.achievementRatio) + Number(totalRatio);
                if (totalRatioNew != 1) {
                    SweetAlert.swal("所有员工业绩计算比例之和必须为100%");
                    $scope.order.ratioInvalid = true;
                } else {
                    $scope.order.ratioInvalid = false;
                }
            }

            /**
             * 删除某条业绩比例表
             */
            $scope.removeRatio = function removeRatio(row, type) {
                if (type != undefined && type != null) {
                    $scope.relationType = type;
                }
                SweetAlert.swal({
                        title: "确定要删除吗？",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true
                    }, function (confirm) {
                        if (confirm) {
                            _deleteRatio(row);
                        }
                    }
                );
            }

            /**
             * 删除业绩比例信息
             * @param list
             * @private
             */
            function _deleteRatio(row) {
                var userId = row.userId;
                if ($scope.relationType == 1) {
                    var totalRatio = 0;
                    var achievementRatios = angular.copy($scope.order.achievementRatios);

                    // 删除当前排课列表
                    for (var j = 0; j < achievementRatios.length; j++) {
                        if (achievementRatios[j].userId == userId) {
                            $scope.order.achievementRatios.splice(j, 1);
                        }
                    }
                    // 删除后判断现有的 比例之和是否是1，不是1 不合法
                    for (var i = 0; i < $scope.order.achievementRatios.length; i++) {
                        totalRatio = Number($scope.order.achievementRatios[i].achievementRatio) + Number(totalRatio);
                    }
                    if (totalRatio != 1) {
                        $scope.order.ratioInvalid = true;
                    } else {
                        $scope.order.ratioInvalid = false;
                    }
                } else if ($scope.relationType == 2) {
                    var relationTeachers = angular.copy($scope.order.orderRelationTeachers);
                    for (var j = 0; j < relationTeachers.length; j++) {
                        if (relationTeachers[j].userId == userId) {
                            $scope.order.orderRelationTeachers.splice(j, 1);
                        }
                    }
                }
            }

            //充值订单  添加收费
            $scope.order.recharge.paymentTempFlag = false;
            $scope.addShouFei = function (type) {
                ;
                $scope.order.recharge.supplementaryFee = "";
                $scope.order.recharge.payDate = new Date();
                $scope.order.recharge.totalPrice = isNaN($scope.order.recharge.totalPrice) || $scope.order.recharge.totalPrice == undefined || $scope.order.recharge.totalPrice == "" ? 0.00 : $scope.order.recharge.totalPrice;
                $scope.order.recharge.privilegeAmount = isNaN($scope.order.recharge.privilegeAmount) || $scope.order.recharge.privilegeAmount == undefined || $scope.order.recharge.privilegeAmount == "" ? 0.00 : $scope.order.recharge.privilegeAmount;
                var realTotalAmount = Number($scope.order.recharge.totalPrice.toFixed(2)) - Number(Number($scope.order.recharge.privilegeAmount).toFixed(2));
                //若是订单的金额为0,不允许进行收费操作，给除提示
                if (realTotalAmount > 0) {
                    //将上次添加的记录置空
                    if ($scope.order.orderStatus != 15) {
                        $scope.order.orderStatus = undefined;
                    }
                    $scope.order.supplementaryFee = "";
                    $scope.order.payDate = new Date();
                    $scope.modalTitle = "添加收费";
                    $scope.addShouFeiModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/sos/order/chargeTopup.html',
                        show: true
                    });
                } else {
                    SweetAlert.swal("应交金额应该大于0");
                    return;
                }
            }

            /**
             * 添加交费记录
             */
            $scope.order.crmorderPayments = [];
            $scope.saveTempChargeRecord = function saveTempChargeRecord() {
                $scope.orderPaymentTemp = {};
                // 页面上输入的合同号、交费日期、交费金额
                $scope.orderPaymentTemp.orderNo = $scope.order.recharge.orderNo;
                $scope.orderPaymentTemp.payAmount = Number($scope.order.recharge.supplementaryFee);

                if (typeof $scope.order.recharge.payDate == "object") {
                    // $scope.orderPaymentTemp.payDate = new Date($scope.order.recharge.payDate.getFullYear() + '/' + ($scope.order.recharge.payDate.getMonth() + 1) + "/" + $scope.order.recharge.payDate.getDate() + ' 00:00:00');
                    $scope.orderPaymentTemp.payDate = $scope.order.recharge.payDate
                } else {
                    // $scope.orderPaymentTemp.payDate = new Date($scope.order.recharge.payDate + ' 00:00:00');
                    $scope.orderPaymentTemp.payDate = $scope.order.recharge.payDate
                }
                $scope.orderPaymentTemp.paymentEdit = true;
                // 尾款金额需要计算出来
                if ($scope.order.recharge.realPayAmount == undefined || isNaN($scope.order.recharge.realPayAmount)) {
                    $scope.order.recharge.realPayAmount = 0;
                }
                $scope.order.recharge.realPayAmount = Number($scope.order.recharge.realPayAmount) + Number($scope.orderPaymentTemp.payAmount);
                $scope.orderPaymentTemp.payDueAmount = $scope.order.recharge.totalPrice - Number($scope.order.recharge.privilegeAmount) - $scope.order.recharge.realPayAmount;
                // $scope.order.crmorderPayments.push($scope.orderPaymentTemp);
                $scope.order.crmorderPayments.unshift($scope.orderPaymentTemp);
                // 将现有的收费值清空
                $scope.addShouFeiModal.hide();
            }

            function _updateTemp(_this, _accountBlance, _payments) {
                $scope.order = {}
                $scope.order.recharge = _this;
                $scope.order.crmorderPayments = _payments;
                $scope.order.accountBalance = _accountBlance;
            }

            /**
             * 调用OrderService的editTopup方法更新先收费-签约-充值订单，并刷新表单
             */
            function _updateOrderTopup(_this, _accountBlance, _payments) {
                //每次清空订单子表
                $scope.order.orderCourses = [];
                $scope.order.crmorderPayments = _payments;
                $scope.order.totalPrice = Number($scope.order.totalPrice.toFixed(2));
                _conductPayments();
                if ($scope.order.paymentsWrite == true) {
                    SweetAlert.swal("尾款或交费金额不能为负");
                }
                // 充值类订单封装orderCourse信息
                var orderCourse = {
                    'additionalAmount': $scope.order.totalPrice,
                    'avaliableAmount': $scope.order.totalPrice
                };
                $scope.order.orderCourses.push(orderCourse);
                $scope.order.supplementaryFee = 0;

                // 无合同订单，修改时合同号不变，有合同订单有两种情况（1）
                if ($scope.order.nakedContract == 0) {
                    if ($scope.order.orderNo == $scope.order.originalOrderNo) {
                        $scope.order.orderNo = $scope.order.orderNoNew;
                    }
                } else {
                    $scope.order.nakedContract = $scope.order.nakedContract ? 1 : 0;
                }

                $scope.order.contractEndDate = new Date($scope.order.contractEndDate);
                $scope.order.contractStartDate = new Date($scope.order.contractStartDate);

                if ($scope.order.privilegeAmount - $scope.order.totalPrice > 0) {
                    SweetAlert.swal('优惠金额过大!');
                    _updateTemp(_this, _accountBlance, _payments);
                    return false;
                }

                $scope.order.totalPrice = $scope.order.recharge.totalPrice;
                $scope.order.privilegeAmount = $scope.order.recharge.privilegeAmount;
                $scope.order.realTotalAmount = $scope.order.totalPrice - $scope.order.privilegeAmount;
                $scope.order.orderNo = $scope.order.recharge.orderNo;
                $scope.order.orderRule = $scope.order.recharge.orderRule;
                $scope.order.orderChargingName = $scope.order.recharge.orderChargingName;
                $scope.order.orderTeacherLevel = $scope.order.recharge.orderTeacherLevel;
                $scope.order.orderChargingId = $scope.order.recharge.orderChargingId;
                $scope.order.orderChargingPrice = $scope.order.recharge.orderChargingPrice;


                var promise = OrderService.editTopup($scope.order);
                promise.then(
                    function (data) {
                        SweetAlert.swal('操作成功');
                        $scope.modal.hide();
                        if (!($scope.modal === undefined)) {
                            $scope.modal.hide();
                        }
                        if ($scope.refreshCustomerOrderDetail) {
                            $scope.refreshCustomerOrderDetail();
                        }
                        $scope.refreshTabs();
                    },
                    function (error) {
                        SweetAlert.swal('操作失败');
                        $scope.modal.hide();
                    }
                );
            }

            /**
             * 结转-转入（选择充值订单）
             */
            function _updateOrderTopupCarry(_this, _accountBlance, _payments) {
                //每次清空订单子表
                $scope.order.orderCourses = [];
                $scope.order.crmorderPayments = _payments;
                $scope.order.totalPrice = Number($scope.order.totalPrice.toFixed(2));
                _conductPayments();
                if ($scope.order.paymentsWrite == true) {
                    SweetAlert.swal("尾款或交费金额不能为负");
                }
                // 充值类订单封装orderCourse信息
                var orderCourse = {
                    'additionalAmount': $scope.order.totalPrice,
                    'avaliableAmount': $scope.order.totalPrice
                };
                $scope.order.orderCourses.push(orderCourse);
                $scope.order.supplementaryFee = 0;
                $scope.order.orderCategory = 3;
                if ($scope.order.orderNo == undefined && ($scope.order.nakedContract == undefined || !$scope.order.nakedContract)) {
                    SweetAlert.swal({
                            title: "有合同的订单需要填写合同编号才可以进行审核，您可以在修改订单时填写",
                            text: "", type: false, showCancelButton: false,
                            confirmButtonColor: "#DD6B55", confirmButtonText: "OK", cancelButtonText: false,
                            closeOnConfirm: false, closeOnCancel: false
                        },
                        function (isConfirm) {
                            if (isConfirm) {
                                $scope.order.contractEndDate = new Date($scope.order.contractEndDate);
                                $scope.order.contractStartDate = new Date($scope.order.contractStartDate);
                                // if ($scope.order.contractEndDate < $scope.order.contractStartDate) {
                                //     SweetAlert.swal('到期时间不能小于签约时间!');
                                //     _updateTemp(_this,_accountBlance,_payments);
                                //     return false;
                                // }
                                if ($scope.order.privilegeAmount - $scope.order.totalPrice > 0) {
                                    SweetAlert.swal('优惠金额过大!');
                                    _updateTemp(_this, _accountBlance, _payments);
                                    return false;
                                }
                                $scope.order.realTotalAmount = $scope.order.totalPrice - $scope.order.privilegeAmount;
                                //$scope.order.payDueAmount = $scope.order.totalPrice - $scope.order.privilegeAmount - $scope.order.realPayAmount - $scope.order.supplementaryFee;
                                console.log($scope.order);
                                $scope.order.recharge = null;
                                var promise = OrderService.editCarryOrder($scope.order);
                                promise.then(function (data) {
                                    SweetAlert.swal('操作成功');
                                    $scope.modal.hide();
                                    $scope.getCarryForwardList($scope.tableState);
                                }, function (error) {
                                    // $scope.dataLoading = false;
                                    SweetAlert.swal('操作失败');
                                    $scope.modal.hide();
                                });
                            } else {
                                return false;
                            }
                        });
                } else {
                    // 无合同订单，修改时合同号不变，有合同订单有两种情况（1）
                    if ($scope.order.nakedContract == 0) {
                        if ($scope.order.orderNo == $scope.order.originalOrderNo) {
                            $scope.order.orderNo = $scope.order.orderNoNew;
                        }
                    } else {
                        $scope.order.nakedContract = $scope.order.nakedContract ? 1 : 0;
                    }
                    $scope.order.contractEndDate = new Date($scope.order.contractEndDate);
                    $scope.order.contractStartDate = new Date($scope.order.contractStartDate);
                    if ($scope.order.privilegeAmount - $scope.order.totalPrice > 0) {
                        SweetAlert.swal('优惠金额过大!');
                        _updateTemp(_this, _accountBlance, _payments);
                        return false;
                    }
                    $scope.order.realTotalAmount = $scope.order.totalPrice - $scope.order.privilegeAmount;
                    $scope.order.recharge = null;
                    var promise = OrderService.editCarryOrder($scope.order);
                    promise.then(function (data) {
                        SweetAlert.swal('操作成功');
                        $scope.getCarryForwardList($scope.tableState);
                        $scope.modal.hide();
                    }, function (error) {
                        SweetAlert.swal('操作失败');
                        $scope.modal.hide();
                    });
                }
            }

            /**
             * 先收费订单签约-充值订单
             */
            $scope.saveOrderNoSign = function () {
                var nakedContract = $scope.order.nakedContract;
                var _this = angular.copy($scope.order.recharge);
                var _accountBlance = $scope.order.accountBalance;
                var _payments = $scope.order.crmorderPayments;
                // $scope.order = angular.copy($scope.order.recharge);
                // $scope.order.recharge = {};
                // $scope.order.recharge = _this;
                // $scope.order.nakedContract = nakedContract;
                // 重新封装合同号
                // if ($scope.order.orderNo == $scope.order.originalOrderNo && ($scope.order.orderStatus == 14 || $scope.order.orderStatus == 15)) {
                //     $scope.order.orderNo = $scope.order.orderNoNew;
                // }
                // 若是无合同订单,重新封装该字段值
                $scope.order.nakedContract = $scope.order.nakedContract ? 1 : 0;
                $scope.order.orderCategory = 3;

                if ($scope.order.orderCourses == undefined || $scope.order.orderCourses == null) {
                    SweetAlert.swal('请选择课程');
                    $scope.modal.hide();
                }

                if ($scope.order.orderStatus == 14) {
                    $scope.order.orderNoFlag = 1;
                    _updateOrderTopup(_this, _accountBlance, _payments);
                } else if ($scope.order.orderStatus == 15) {
                    _updateOrderTopupCarry(_this, _accountBlance, _payments);
                }
            }
            /**
             * 根据折扣率计算优惠金额
             */
            $scope.getDiscount = function () {
                $scope.order.recharge.privilegeAmountTemp =
                    Number(($scope.order.recharge.totalPrice * $scope.order.recharge.privilegeRatio / 100).toFixed(2));
                $scope.order.recharge.privilegeAmount = Number(($scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmountTemp).toFixed(2));
                _conductPayments();
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
                $scope.order.recharge.privilegeRatio =
                    100 - Number(($scope.order.recharge.privilegeAmount * 100 / $scope.order.recharge.totalPrice).toFixed(1));
                $scope.order.recharge.privilegeRatio = Number($scope.order.recharge.privilegeRatio.toFixed(1));
            }
            /**
             * 编辑收费记录
             */
            $scope.showEditPayment = function (row) {
                row.paymentEdit = false;
            }

            /**
             * 对应的处理尾款
             */
            function _conductPayments() {
                $scope.order.paymentsWrite = false;
                $scope.order.recharge.realPayAmount = 0;
                if (isNaN($scope.order.totalPrice)) {
                    $scope.order.totalPrice = 0;
                }
                // 尾款金额需要计算出来
                var crmorderPayments = $scope.order.crmorderPayments.reverse()
                for (var i = crmorderPayments.length - 1; i >= 0; i--) {
                    var data = $scope.order.crmorderPayments[i];
                    if (Number(data.payAmount) <= 0) {
                        $scope.order.paymentsWrite = true;
                    }
                    $scope.order.recharge.realPayAmount = Number($scope.order.recharge.realPayAmount) + Number(data.payAmount);
                    // data.payDueAmount = $scope.order.recharge.totalPrice - Number($scope.order.recharge.privilegeAmount) - $scope.order.recharge.realPayAmount;
                    data.payDueAmount = $scope.order.recharge.totalPrice - Number($scope.order.recharge.privilegeAmount) - data.payAmount
                    var ii = i
                    while (ii > 0) {
                        data.payDueAmount -= crmorderPayments[ii - 1].payAmount
                        ii--
                    }
                    if (Number(data.payDueAmount) < 0) {
                        $scope.order.paymentsWrite = true;
                    }
                }
                $scope.order.crmorderPayments = angular.copy(crmorderPayments.reverse())
            }

            // 加载提示信息
            $timeout(function () {
                $("[data-toggle='tooltip']").tooltip();
            }, 1000);
            (function () {
                // 默认加一条业绩提醒的记录，默认的业绩人为当前登录用户
                var authenticationUser = AuthenticationService.currentUser();
                // 部门信息
                $scope.order.recharge.achievementRatio.departmentId = authenticationUser.school_id;
                $scope.order.recharge.achievementRatio.departName = authenticationUser.department.name;
                // 业绩人信息
                $scope.order.recharge.achievementRatio.userId = authenticationUser.id;
                $scope.order.recharge.achievementRatio.userName = authenticationUser.name;
                // 业绩人岗位信息
                $scope.order.recharge.achievementRatio.positionId = authenticationUser.position_id;
                $scope.order.recharge.achievementRatio.position = {};
                $scope.order.recharge.achievementRatio.position.id = authenticationUser.position_id;
                $scope.order.recharge.achievementRatio.position.name = authenticationUser.position_name;
                // 业绩比例默认100%
                $scope.order.recharge.achievementRatio.achievementRatio = 1;
                $scope.order.recharge.achievementRatios.push($scope.order.recharge.achievementRatio);
                // 展示学生年级
                CommonService.getGradeIdSelect().then(function (result) {
                    $scope.gradeIds = result.data;
                });

            })()
            // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            // 在此试验一下模糊搜索逻辑迁移过来
            // 模糊搜索的函数、
            function _clealFirstOrder() {
                $scope.order.leadPhone = "";
                $scope.order.leadGradeId = "";
                $scope.order.leadMediaChannelId1 = "";
                $scope.order.leadMediaChannelId2 = "";
                $scope.order.crmStudentId = "";
            }

            var ___timerGo = ''
            $scope.gusseyourresult = function (row) {
                ___timerGo = setTimeout(function () {
                    if ($scope.order.recharge.name) {
                        _clealFirstOrder();
                        $scope.hasresult = true;
                        var param = {
                            search: {
                                predicateObject: {
                                    pageNum: 0,
                                    pageSize: 0
                                }
                            }
                        }
                        var filter = {
                            name: $scope.order.recharge.name
                        }
                        OrderService.vagueSearch(filter).then(function (result) {
                            $scope.gusseresult = result.data;
                            $scope.xue = "学";
                            $scope.ke = "客";
                            if ($scope.gusseresult.length === 0) {
                                // $scope.gusseresult=[{'name':'查询不到此条信息，请创建'}];
                                $scope.hasresult = false;
                                // $scope.addThisinput=function () {
                                //     // $scope.order.recharge.name='';
                                //
                                // }
                                $scope.hasresult = 0;
                            } else {
                                $scope.hasresult = 1;
                            }
                        });
                    } else {

                        $scope.hasresult = false;
                    }
                    clearTimeout(___timerGo)
                }, 400)
            }
            // 点击其他地方模糊搜索的结果框消失
            $scope.hideThisul = function () {
                if ($scope.hasresult === 0) {
                    $scope.order.recharge.name = '';
                    $scope.hasresult = false;
                    // $scope.gusseresult.length = 0
                } else {

                }

            }
            $scope.addThisinput = function (curdata, flag) {
                flag = flag || 0;
                // 封装order
                $scope.order.recharge.crmStudentId = curdata.crm_student_id;
                $scope.order.recharge.name = curdata.name;
                $scope.order.accountBalance = curdata.accountBalance;
                $scope.order.recharge.consumeAccountBalance = 0;
                $scope.order.recharge.gradeId = curdata.grade_id;
                if (flag === 1) {
                    $scope.order.recharge.name = curdata.name;
                } else {
                    // $scope.order.recharge.name=curdata.name+'   '+curdata.phone;
                    $scope.order.recharge.name = curdata.name;
                }

                $scope.hasresult = false;
                $scope.showCreat = 1;
                // 先收费，选中后将页面的值自动关联
                $scope.currentStudent = angular.copy(curdata);
                $scope.order.leadPhone = $scope.currentStudent.phone;
                $scope.order.leadGradeId = $scope.currentStudent.grade_id;
                $scope.order.leadMediaChannelId1 = $scope.currentStudent.media_channel_id_1;
                $scope.order.leadMediaChannelId2 = $scope.currentStudent.media_channel_id_2
                $scope.order.crmStudentId = $scope.currentStudent.crm_student_id;
                $scope.gusseresult.length = 0
            }

            // 创建意向客户并排课的渠道联动
            $scope.detail = {};
            // $scope.mediaChannel1List = [];
            $scope.mediaChannel2List = [];
            $scope.mediaChannel1ChangeForUpdate = function () {
                if ($scope.detail.media_channel_id_1) {
                    CommonService.getMediaChannel($scope.detail.media_channel_id_1).then(function (result) {
                        $scope.mediaChannel2List = result.data;
                    });
                } else {
                    $scope.mediaChannel2List = [];
                }
                $scope.detail.media_channel_id_2 = null;
            }
            $scope.mediaChannel3List = [];
            $scope.mediaChannel2ChangeForUpdate = function () {
                if ($scope.detail.media_channel_id_2) {
                    CommonService.getMediaChannel($scope.detail.media_channel_id_2).then(function (result) {
                        $scope.mediaChannel3List = result.data;
                    });
                } else {
                    $scope.mediaChannel3List = [];
                }
                $scope.detail.media_channel_id_3 = null;
            }
            // 电话查重函数
            $scope.checkPhone = function () {
                if ($scope.detail.phone && $scope.detail.phone != '') {
                    /*OrderService.checkPhone($scope.CrmInvitationDetailVoForCreate.leadPhone).then(function (result) {
                     if( result.status == 'SUCCESS' ){

                     }else{
                     $scope.CrmInvitationDetailVoForCreate.leadPhone = '';
                     SweetAlert.swal('手机号重复');
                     }
                     });*/
                    var phoneVo = {"phone": $scope.detail.phone};
                    //console.log(phoneVo);
                    var promise = CommonService.repeat(phoneVo);
                    promise.then(
                        function (data) {
                            //console.log(data);
                            if (data.status == 'FAILURE') {
                                //alert(data.data.repeateMsg);
                                /*SweetAlert.swal(data.data.repeateMsg,"学生姓名:"+data.data.name+"    所属人:"+data.data.userName
                                 +"    学生状态:"+(data.data.state == 1 ? "在读学员" : "意向客户"));*/

                                // $scope.repeateData = data.data;
                                // $scope.modalForRepeatTitle = '电话号码重复';
                                // $scope.modalForRepeat = $modal({
                                //     scope: $scope,
                                //     templateUrl: 'partials/sos/leads/modal.repeate.html',
                                //     show: true
                                // });
                                SweetAlert.swal("电话号码重复，重新输入");
                                $scope.modalForRepeatHide();
                            }
                        },
                        function (data) {
                            console.log(data);
                        }
                    );

                }
            }

            $scope.modalForRepeatHide = function () {
                // $scope.modalForRepeat.hide();
                if ($scope.order != undefined) {
                    // $scope.order.leadPhone = null;
                    $scope.detail.phone = null;
                }
            }


            // 添加意向客户
            //     * 创建意向客户并签约
            //     */
            $scope.createLeadsmessege = function () {
                var title = "添加意向客户信息";
                $scope.detail = {};
                $scope.modalTitle1 = title;
                $scope.addModal1 = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/coursePlan/createPlancustom.html',
                    show: true,
                    backdrop: 'static'
                });
                $scope.getLeadsBasicInfo();
            }
            $scope.getLeadsBasicInfo = function (tableState) {
                //获取所有的年级
                CustomerStudentCourseService.getAllGrade().then(function (result) {
                    $scope.omsGrade = result;
                });
                //获取一级渠道信息
                CommonService.getMediaChannel(0).then(function (result) {
                    $scope.mediaChannel1List = result.data;
                });
            }
            // 创建好以后添加到后台
            $scope.creatAddThismessege = function () {
                var promise = LeadsStudentService.create($scope.detail);
                promise.then(function (data) {
                    if (data.status == 'FAILURE') {
                        if (typeof data.data == 'string') {
                            SweetAlert.swal(data.data);
                        } else {
                            SweetAlert.swal(data.data.repeateMsg);
                            return false;
                        }
                    }
                    $scope.CrmLeadsStudentVoForCreate = {};
                    $scope.addModal1.hide();
                    // console.log($scope.detail);
                    // 讲新的客户信息连动到添加订单页面
                    //  $scope.order.recharge.name=$scope.detail.name;
                    // var obj = {'crmStudentId':data.id,'name':$scope.detail.name,'accountBalance':0,'consumeAccountBalance':0,'gradeId':data.gradeId};
                    $scope.order.recharge.crmStudentId = data.data.id;
                    $scope.order.recharge.name = $scope.detail.name;
                    $scope.order.accountBalance = 0;
                    $scope.order.recharge.consumeAccountBalance = 0;
                    $scope.order.recharge.gradeId = data.data.gradeId;

                    $scope.showCreat = 1;

                }, function (error) {
                    SweetAlert.swal("创建Leads失败");
                });
            }

            if (sessionStorage.getItem("orderJudgeEntrance") == 'addOrder') {
                OrderService.getServeDate().then(function (result) {
                    $rootScope.isModyfied = localStorageService.get("isModyfied");
                    if (result.status = "SUCCESS") {
                        sessionStorage.setItem("orderJudgeEntrance", null)
                        $scope.order.recharge.contractStartDate = new Date(result.data);
                    }
                })
            }
        }
    ])
    .controller('OrderChargeTopupController', ['$scope', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'CommonService', 'localStorageService',
        function ($scope, $modal, $rootScope, SweetAlert, OrderService, CommonService, localStorageService) {
            $rootScope.isModyfied = localStorageService.get("isModyfied");//修改时间权限
            var _payDate = '';

            function _getOrderCopy() {
                var data = angular.copy($scope.order)
                $scope.order.payDate = _payDate
                return data
            }

            $scope.chargeOrderT = function chargeOrderT() {
                $scope.order.orderStatus = 2;
                _payDate = $scope.order.payDate;
                $scope.order.payDate = new Date($scope.order.payDate);
                OrderService.getOrderPayments(0, 1000, $scope.order.orderNo).then(function (result) {
                    if (result.data.length > 0) {
                        var maxPayDate = result.data[0].payDate;
                        if (maxPayDate > $scope.order.payDate.getTime()) {
                            SweetAlert.swal('本次支付时间不能小于上次支付时间！');
                            $scope.order.payDate = _payDate;
                            _getOrderCopy();
                            return;
                        }
                    }
                    /*if($scope.order.payDate.getTime() < $scope.order.contractStartDate.getTime()){
                        SweetAlert.swal("请确认交费日期是否正确，当前交费日期早于合同签约日期");
                        return;
                    }*/
                    var promise = OrderService.chargeTopup($scope.order);
                    promise.then(function (data) {
                        //$scope.dataLoading = false;
                        SweetAlert.swal('操作成功');
                        $scope.chargeOrderModal.hide();
                        if (!($scope.modal === undefined)) {
                            $scope.modal.hide();
                        }
                        if ($scope.refreshCustomerOrderDetail) {
                            $scope.refreshCustomerOrderDetail();
                        }
                        $scope.order.payDate = null;
                        $scope.refreshTabs();
                        if ($rootScope._getIndexData_) {
                            $rootScope._getIndexData_(3)
                        }
                    }, function (error) {
                        // $scope.dataLoading = false;
                        SweetAlert.swal('操作失败');
                        $scope.chargeOrderModal.hide();
                    });
                })
            }
            //服务器时间
            OrderService.getServeDate().then(function (result) {
                $rootScope.isModyfied = localStorageService.get("isModyfied");
                if (result.status = "SUCCESS") {
                    var date = result.data && result.data.indexOf(':') > -1 ? result.data : Date.now()
                    if ($scope.order.recharge) {
                        $scope.order.recharge.payDate = new Date(date);
                    }
                    if ($scope.orderCarry) {
                        $scope.orderCarry.payDate = new Date(date);
                    }
                    $scope.order.payDate = new Date(date);
                }
            })

            $scope.balance = ($scope.order.totalPrice - $scope.order.privilegeAmount - $scope.order.realPayAmount).toFixed(1);

        }
    ])
    .controller('OrderUpdateTopupController', ['$scope', '$mtModal', '$timeout', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'CommonService', 'AuthenticationService',
        'CrmChargingSchemeService', 'CustomerStudentService', 'CoursePlanService', 'localStorageService',
        function ($scope, $mtModal, $timeout, $modal, $rootScope, SweetAlert, OrderService, CommonService, AuthenticationService, CrmChargingSchemeService, CustomerStudentService, CoursePlanService, localStorageService) {

            $rootScope.isModyfied = localStorageService.get("isModyfied");//修改时间权限
            console.log($rootScope.isModyfied)
            $scope.orderTypeSelect = [{name: '新签', id: 1}, {name: '续费', id: 2}, {name: '推荐', id: 5}, {
                name: '赠课',
                id: 8
            }];
            $scope.isCourseAuditionSelect = [{name: '是', id: 1}, {name: '否', id: 0}];
            $scope.order.supplementaryFee = 0;
            $scope.order.orderCourses = [];
            // 定义业绩的对象
            $scope.order.achievementRatios = [];
            $scope.order.achievementRatio = {};
            $scope.order.ratioInvalid = false;

            /**
             * 根据折扣率计算优惠
             */
            $scope.getDiscount = function () {
                //根据折扣率计算优惠金额，
                $scope.order.privilegeAmountTemp = Number(($scope.order.totalPrice * $scope.order.privilegeRatio / 100).toFixed(2));
                $scope.order.privilegeAmount = Number(($scope.order.totalPrice - $scope.order.privilegeAmountTemp).toFixed(2));
                _conductPayments();
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
                $scope.order.privilegeRatio =
                    100 - Number(($scope.order.privilegeAmount * 100 / $scope.order.totalPrice).toFixed(1));
                $scope.order.privilegeRatio = Number($scope.order.privilegeRatio.toFixed(1));
            }
            /**
             * 编辑收费记录
             */
            $scope.showEditPayment = function (row) {
                row.paymentEdit = false;
            }

            /**
             * 对应的处理尾款
             */
            function _conductPayments() {
                $scope.order.realPayAmount = 0;
                $scope.order.paymentsWrite = false;
                if (isNaN($scope.order.totalPrice)) {
                    $scope.order.totalPrice = 0;
                }
                // 尾款金额需要计算出来
                var crmorderPayments = angular.copy($scope.order.crmorderPayments.reverse())
                for (var i = crmorderPayments.length - 1; i >= 0; i--) {
                    var data = $scope.order.crmorderPayments[i];
                    if (data.payAmount <= 0) {
                        $scope.order.paymentsWrite = true;
                    }
                    if (isNaN(data.payDueAmount)) {
                        data.payDueAmount = 0;
                    }
                    $scope.order.realPayAmount = Number($scope.order.realPayAmount) + Number(data.payAmount);
                    // data.payDueAmount = $scope.order.totalPrice - Number($scope.order.privilegeAmount) - $scope.order.realPayAmount;
                    data.payDueAmount = $scope.order.totalPrice - Number($scope.order.privilegeAmount) - data.payAmount
                    var ii = index
                    while (ii > 0) {
                        data.payDueAmount -= crmorderPayments[ii - 1].payAmount
                        ii--
                    }
                }
                $scope.order.crmorderPayments = angular.copy(crmorderPayments.reverse())
            }

            function _conductPaymentsDX() {
                $scope.order.realPayAmount = 0;
                $scope.order.paymentsWrite = false;
                if (isNaN($scope.order.totalPrice)) {
                    $scope.order.totalPrice = 0;
                }
                for (var i = $scope.order.crmorderPayments.length - 1; i >= 0; i--) {
                    var data = $scope.order.crmorderPayments[i];
                    if (Number(data.payAmount) <= 0) {
                        $scope.order.paymentsWrite = true;
                    }
                    $scope.order.realPayAmount = Number($scope.order.realPayAmount) + Number(data.payAmount);
                    data.payDueAmount = $scope.order.totalPrice - Number($scope.order.privilegeAmount) - $scope.order.realPayAmount;
                    if (Number(data.payDueAmount) < 0) {
                        $scope.order.paymentsWrite = true;
                    }

                }
            }

            // 修改订单时，有合同的可以改成无合同号订单，无合同的不允许在进行修改
            $scope.clearOrderNoUpdate = function clearOrderNoUpdate() {
                //选中的时候给出提示，是否确认改为无合同
                SweetAlert.swal({
                    title: "请在确定此订单不签合同的情况下选中，比如出国游产品、促销产品等。如果将签合同但暂时未定合同号，请取消选中,在合同编号留空即可",
                    text: "",
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (isConfirm) {
                    if (isConfirm) {
                        // $scope.order.nakedContract = $scope.order.nakedContract&&1;
                        // 设置选中，将页面的order置空	;
                        $scope.order.orderNo = "";
                        return false;
                    } else {
                        $scope.order.nakedContract = 0;
                        return false;
                    }
                });
            }
            $scope.orderNoExist = null;
            $scope.orderNoExistCheck = function orderNoExistCheck(type) {
                var promiseExist;
                if (type == 1) {
                    // 不验证
                    if ($scope.order.orderNo == $scope.orderCopy.orderNo) {
                        $scope.orderNoExist = null;
                        return false;
                    } else {
                        promiseExist = OrderService.orderNoExist($scope.order.orderNo);
                        promiseExist.then(function (data) {
                            if (data.data) {
                                $scope.orderNoExist = data;
                                SweetAlert.swal('该合同编号已存在');
                                return false;
                            } else {
                                $scope.orderNoExist = null;
                                return true;
                            }
                        });
                    }
                } else if (type == 2) {
                    promiseExist = OrderService.orderNoExist($scope.order.orderNoNew);
                    promiseExist.then(function (data) {
                        if (data.data) {
                            $scope.orderNoExist = data;
                            SweetAlert.swal('该合同编号已存在');
                            return false;
                        } else {
                            $scope.orderNoExist = null;
                            return true;
                        }
                    });
                }
            };

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
             * 选择某一计费方案、查询出对应的师资等级列表、清空价格
             */
            $scope.selectOneCharging = function selectOneCharging(row) {

                $scope.order.orderChargingId = row.id;
                $scope.order.orderChargingScheme = angular.copy(row);
                $scope.order.orderChargingName = row.schemeName;
                $scope.orderTeacherLevelList = getPricesList(row);
                $scope.order.orderChargingPrice = "";
            }
            $scope.selectOneChargingConfirm = function selectOneChargingConfirm() {

                $scope.chargingModal.hide();
            }

            /**
             * 更新学生年级
             */
            function updateCustomerStudent() {
                var promiseNew = CustomerStudentService.update($scope.customerStudentDetail);
                promiseNew.then(function (data) {
                    //console.log(data);
                    if (data.status == 'FAILURE') {
                        SweetAlert.swal(data.data);
                        return false;
                    }
                }, function (error) {
                    SweetAlert.swal("更新学生年级失败");
                });
            }

            /**
             * 更改计费方案 type1更改年级 2更改师资等级
             */
            $scope.changeCharging = function changeCharging(type) {

                // 顺带更改学生的年级
                if (type == 1) {
                    var customerStudentVo = {}
                    customerStudentVo.crm_student_id = $scope.order.crmStudentId;
                    var promise = CustomerStudentService.detail(customerStudentVo);
                    promise.then(function (result) {
                        $scope.customerStudentDetail = result;
                        if ($scope.order.orderChargingId == undefined || $scope.order.orderChargingId == "") {
                            SweetAlert.swal("请选择计费方案");
                            $scope.order.gradeId = $scope.customerStudentDetail.grade_id;
                            return;
                        }
                        if ($scope.order.orderTeacherLevel == undefined || $scope.order.orderTeacherLevel == "") {
                            SweetAlert.swal("请选择师资等级");
                            $scope.order.gradeId = $scope.customerStudentDetail.grade_id;
                            return;
                        }
                        var title = "该操作将要修改该学生的年级,是否确定?";
                        var unlawfulnessGrade = [14, 15, 16, 18, 19, 20]; // 非法年级
                        var flag_grade = unlawfulnessGrade.contains($scope.order.gradeId); //返回true
                        if (!flag_grade) {
                            $mtModal.moreModal({
                                scope: $scope,
                                status: 0,
                                text: title,
                                hasNext: function () {
                                    CoursePlanService.getWxClassTimeList($scope.order.crmStudentId, $scope.customerStudentDetail.grade_id, $scope.order.gradeId).then(function (result) {
                                        if (result.wxExist) {
                                            if (result.jk) {
                                                var t = "发现该学员有未消排课记录,系统将把这些排课记录的计费金额按本次修改调整,余额不足,系统将删除最后的" + result.jkCount + "条排课记录";
                                                $mtModal.moreModal({
                                                    scope: $scope,
                                                    status: 0,
                                                    text: t,
                                                    hasNext: function () {
                                                        CoursePlanService.saveGradeChange(result, $scope.order.crmStudentId, $scope.order.gradeId);
                                                        $scope.customerStudentDetail.grade_id = $scope.order.gradeId;
                                                        updateCustomerStudent();//更新学员年级
                                                        $scope.order.orderChargingPrice = getPrice($scope.order.orderChargingScheme, $scope.order.orderTeacherLevel, $scope.order.gradeId);
                                                        if ($scope.getMyCrmCustomerStudentList) {
                                                            $scope.getMyCrmCustomerStudentList($rootScope.tableState);
                                                        }
                                                        $scope.mtResultModal.hide();
                                                    },
                                                    cancel: function () {
                                                        $scope.order.gradeId = $scope.customerStudentDetail.grade_id;
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
                                                        CoursePlanService.saveGradeChange(result, $scope.order.crmStudentId, $scope.order.gradeId);
                                                        $scope.customerStudentDetail.grade_id = $scope.order.gradeId;
                                                        updateCustomerStudent();//更新学员年级
                                                        $scope.order.orderChargingPrice = getPrice($scope.order.orderChargingScheme, $scope.order.orderTeacherLevel, $scope.order.gradeId);
                                                        if ($scope.getMyCrmCustomerStudentList) {
                                                            $scope.getMyCrmCustomerStudentList($rootScope.tableState);
                                                        }
                                                        $scope.mtResultModal.hide();
                                                    },
                                                    cancel: function () {
                                                        $scope.order.gradeId = $scope.customerStudentDetail.grade_id;
                                                        $scope.mtResultModal.hide();
                                                    }
                                                });
                                            }
                                        } else {
                                            CoursePlanService.saveGradeChange(result, $scope.order.crmStudentId, $scope.order.gradeId);
                                            $scope.customerStudentDetail.grade_id = $scope.order.gradeId;
                                            updateCustomerStudent();//更新学员年级
                                            $scope.order.orderChargingPrice = getPrice($scope.order.orderChargingScheme, $scope.order.orderTeacherLevel, $scope.order.gradeId);
                                            if ($scope.getMyCrmCustomerStudentList) {
                                                $scope.getMyCrmCustomerStudentList($rootScope.tableState);
                                            }
                                            $scope.mtResultModal.hide();
                                        }
                                    });
                                    /* $scope.customerStudentDetail.grade_id = $scope.order.gradeId;
                                     updateCustomerStudent();//更新学员年级
                                     $scope.order.orderChargingPrice = getPrice($scope.order.orderChargingScheme,$scope.order.orderTeacherLevel,$scope.order.gradeId);*/
                                },
                                cancel: function () {
                                    $scope.order.gradeId = $scope.customerStudentDetail.grade_id;
                                    $scope.mtResultModal.hide();
                                }
                            });
                        } else {
                            var untitle = "该学员年级为非法年级，请为学员重新选择年级";
                            $scope.order.gradeId = $scope.customerStudentDetail.grade_id;
                            SweetAlert.swal(untitle);
                            return;
                        }
                    }, function (error) {
                        SweetAlert.swal("获取学生信息失败");
                    });
                } else {
                    var unlawfulnessGrade = [14, 15, 16, 18, 19, 20]; // 非法年级
                    var flag_grade = unlawfulnessGrade.contains($scope.order.gradeId); //返回true
                    if (flag_grade) {
                        var untitle = "该学员年级为非法年级，请为学员重新选择年级";
                        SweetAlert.swal(untitle);
                        return;
                    }
                    $scope.order.orderChargingPrice = getPrice($scope.order.orderChargingScheme, $scope.order.orderTeacherLevel, $scope.order.gradeId);
                }

            }

            /**
             * 进行添加业绩计算比例的操作
             */
            $scope.showAddAchievementRatio = function showAddAchievementRatio(type) {
                $scope.relationType = type;
                $scope.relationTypeFlag = false;
                $scope.modalAchieveTitle = '选择员工和角色';
                if (type == 2) {
                    $scope.modalAchieveTitle = '选择试听课教师/授课教师';
                }
                // 展示科目信息
                CommonService.getSubjectIdSelect().then(function (result) {
                    $scope.omsSubject = result.data;
                });
                $scope.order.achievementRatio = {};
                $scope.order.achievementRatio.departmentId = AuthenticationService.currentUser().school_id;
                $scope.order.achievementRatio.departName = AuthenticationService.currentUser().department.name;
                $scope.operateRatio = "add";
                // 若订单是新签、推荐设置选择教师的类型  只能选试听教师、续费只能选授课教师
                if (type == 2) {
                    if ($scope.order.orderType == 1 || $scope.order.orderType == 5) {
                        $scope.order.achievementRatio.relationType = 1;
                        $scope.relationTypeFlag = true;
                    } else if ($scope.order.orderType == 2) {
                        $scope.order.achievementRatio.relationType = 2;
                        $scope.relationTypeFlag = true;
                    }
                }

                $scope.achieveRatioModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/modal.addAchievementRatio.html',
                    show: true
                });

            }

            // 改变列表中的比例
            $scope.changeRatio = function changeRatio(row) {
                var totalRatio = 0;
                var achievementRatios = angular.copy($scope.order.achievementRatios);
                for (var i = 0; i < $scope.order.achievementRatios.length; i++) {
                    if (row.userId != achievementRatios[i].userId) {
                        totalRatio = Number(achievementRatios[i].achievementRatio) + Number(totalRatio);
                    }
                }
                var totalRatioNew = Number(row.achievementRatio) + Number(totalRatio);
                if (totalRatioNew != 1) {
                    SweetAlert.swal("所有员工业绩计算比例之和必须为100%");
                    $scope.order.ratioInvalid = true;
                } else {
                    $scope.order.ratioInvalid = false;
                }
            }

            /**
             * 删除某条业绩比例表
             */
            $scope.removeRatio = function removeRatio(row, type) {
                if (type != undefined && type != null) {
                    $scope.relationType = type;
                }
                SweetAlert.swal({
                        title: "确定要删除吗？",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true
                    }, function (confirm) {
                        if (confirm) {
                            _deleteRatio(row);
                        }
                    }
                );
            }

            /**
             * 删除业绩比例信息
             * @param list
             * @private
             */
            function _deleteRatio(row) {
                var userId = row.userId;
                if ($scope.relationType == 1) {
                    var totalRatio = 0;
                    var achievementRatios = angular.copy($scope.order.achievementRatios);

                    // 删除当前排课列表
                    for (var j = 0; j < achievementRatios.length; j++) {
                        if (achievementRatios[j].userId == userId) {
                            $scope.order.achievementRatios.splice(j, 1);
                        }
                    }
                    // 删除后判断现有的 比例之和是否是1，不是1 不合法
                    for (var i = 0; i < $scope.order.achievementRatios.length; i++) {
                        totalRatio = Number($scope.order.achievementRatios[i].achievementRatio) + Number(totalRatio);
                    }
                    if (totalRatio != 1) {
                        $scope.order.ratioInvalid = true;
                    } else {
                        $scope.order.ratioInvalid = false;
                    }
                } else if ($scope.relationType == 2) {
                    var relationTeachers = angular.copy($scope.order.orderRelationTeachers);
                    for (var j = 0; j < relationTeachers.length; j++) {
                        if (relationTeachers[j].userId == userId) {
                            $scope.order.orderRelationTeachers.splice(j, 1);
                        }
                    }
                }
            }

            $scope.updateOrderTopup = function updateOrderTopup() {
                //每次清空订单子表
                $scope.order.orderCourses = [];
                $scope.order.totalPrice = Number($scope.order.totalPrice.toFixed(2));
                // 充值类订单封装orderCourse信息
                var orderCourse = {
                    'additionalAmount': $scope.order.totalPrice,
                    'avaliableAmount': $scope.order.totalPrice
                };
                $scope.order.orderCourses.push(orderCourse);
                if ($scope.order.orderNo == undefined && ($scope.order.nakedContract == undefined || !$scope.order.nakedContract)) {
                    SweetAlert.swal({
                            title: "有合同的订单需要填写合同编号才可以进行审核，您可以在修改订单时填写",
                            text: "", type: false, showCancelButton: false,
                            confirmButtonColor: "#DD6B55", confirmButtonText: "OK", cancelButtonText: false,
                            closeOnConfirm: false, closeOnCancel: false
                        },
                        function (isConfirm) {
                            if (isConfirm) {
                                $scope.order.contractEndDate = new Date($scope.order.contractEndDate);
                                // if ($scope.order.contractEndDate < $scope.order.contractStartDate) {
                                //     SweetAlert.swal('到期时间不能小于签约时间!');
                                //     return false;
                                // }

                                if ($scope.order.privilegeAmount - $scope.order.totalPrice > 0) {
                                    SweetAlert.swal('优惠金额过大!');
                                    return false;
                                }

                                var sfjeTemp = Number((Number(($scope.order.totalPrice - $scope.order.privilegeAmount).toFixed(2)) - $scope.order.realPayAmount).toFixed(2));
                                var sfje = Number((sfjeTemp - $scope.order.supplementaryFee).toFixed(2));
                                if (sfje < 0) {
                                    SweetAlert.swal('实付金额填写错误', '请重试');
                                    return false;
                                }

                                $scope.order.realTotalAmount = $scope.order.totalPrice - $scope.order.privilegeAmount;
                                $scope.order.payDueAmount = $scope.order.totalPrice - $scope.order.privilegeAmount - $scope.order.realPayAmount - $scope.order.supplementaryFee;
                                var promise = OrderService.editTopup($scope.order);
                                promise.then(function (data) {
                                    //$scope.dataLoading = false;
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
                                        if ($scope.refreshCustomerOrderDetail) {
                                            $scope.refreshCustomerOrderDetail();
                                        }
                                    }
                                    if (!($scope.modal === undefined)) {
                                        $scope.modal.hide();
                                    }
                                    $scope.refreshTabs();
                                }, function (error) {
                                    // $scope.dataLoading = false;
                                    SweetAlert.swal('操作失败');
                                    $scope.modal.hide();
                                });
                            } else {
                                return false;
                            }
                        });
                } else {
                    /*if($scope.order.orderNo == ''){
                     $scope.order.orderNo=null;
                     }*/
                    // 无合同订单，修改时合同号不变，有合同订单有两种情况（1）
                    if ($scope.order.nakedContract == 0) {
                        if ($scope.order.orderNo == $scope.order.originalOrderNo) {
                            $scope.order.orderNo = $scope.order.orderNoNew;
                        }
                    } else {
                        if ($scope.orderCopy.orderNo == $scope.orderCopy.originalOrderNo) {
                            $scope.order.orderNo = $scope.orderCopy.originalOrderNo
                        } else {
                            $scope.order.orderNo = $scope.orderCopy.orderNo;
                        }
                        $scope.order.nakedContract = $scope.order.nakedContract ? 1 : 0;
                    }

                    $scope.order.contractEndDate = new Date($scope.order.contractEndDate);
                    // if ($scope.order.contractEndDate < $scope.order.contractStartDate) {
                    //     SweetAlert.swal('到期时间不能小于签约时间!');
                    //     return false;
                    // }

                    if ($scope.order.privilegeAmount - $scope.order.totalPrice > 0) {
                        SweetAlert.swal('优惠金额过大!');
                        return false;
                    }
                    var sfjeTemp = Number((Number(($scope.order.totalPrice - $scope.order.privilegeAmount).toFixed(2)) - $scope.order.realPayAmount).toFixed(2));
                    var sfje = Number((sfjeTemp - $scope.order.supplementaryFee).toFixed(2));
                    if (sfje < 0) {
                        SweetAlert.swal('实付金额填写错误', '请重试');
                        return false;
                    }

                    $scope.order.realTotalAmount = $scope.order.totalPrice - $scope.order.privilegeAmount;
                    $scope.order.payDueAmount = $scope.order.totalPrice - $scope.order.privilegeAmount - $scope.order.realPayAmount - $scope.order.supplementaryFee;
                    for (var i = 0; i < $scope.gradeIdsNew.length; i++) {
                        if ($scope.gradeIdsNew[i].id == $scope.order.gradeId) {
                            $scope.order.currentGrade = $scope.gradeIdsNew[i].name;
                            break;
                        }
                    }

                    var promise = OrderService.editTopup($scope.order);
                    promise.then(function (data) {
                        //$scope.dataLoading = false;
                        SweetAlert.swal('操作成功');
                        $scope.modal.hide();
                        if (!($scope.modal === undefined)) {
                            $scope.modal.hide();
                        }
                        if ($scope.refreshCustomerOrderDetail) {
                            $scope.refreshCustomerOrderDetail();
                        }
                        $scope.refreshTabs();
                    }, function (error) {
                        // $scope.dataLoading = false;
                        SweetAlert.swal('操作失败');
                        $scope.modal.hide();
                    });
                }
            }
            $timeout(function () {
                $("[data-toggle='tooltip']").tooltip();
            }, 1000);
        }
    ])
    .controller('OrderAuditTopupController', ['$scope', '$timeout', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'localStorageService',
        function ($scope, $timeout, $modal, $rootScope, SweetAlert, OrderService, localStorageService) {
            $rootScope.isModyfied = localStorageService.get("isModyfied");//修改时间权限
            $scope.orderTypeSelect = [{name: '新签', id: 1}, {name: '续费', id: 2}, {name: '返课', id: 3}, {
                name: '推荐',
                id: 5
            }, {name: '赠课', id: 8}];
            $scope.isCourseAuditionSelect = [{name: '是', id: 1}, {name: '否', id: 0}];
            $timeout(function () {
                $("[data-toggle='tooltip']").tooltip();
            }, 1000);
        }
    ])
    .controller('OrderDetailTopupController', ['$scope', '$timeout', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'localStorageService',
        function ($scope, $timeout, $modal, $rootScope, SweetAlert, OrderService, localStorageService) {
            $rootScope.isModyfied = localStorageService.get("isModyfied");//修改时间权限
            $scope.orderTypeSelect = [{name: '新签', id: 1}, {name: '续费', id: 2}, {name: '返课', id: 3}, {
                name: '推荐',
                id: 5
            }, {name: '赠课', id: 8}];
            $scope.isCourseAuditionSelect = [{name: '是', id: 1}, {name: '否', id: 0}];
            $scope.orderRuleSelect = [{name: '1小时', id: 1}, {name: '40分钟', id: 2}];
            $timeout(function () {
                $("[data-toggle='tooltip']").tooltip();
            }, 1000);
        }
    ])
    .controller('OrderDetailOTOController', ['$scope', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'localStorageService',
        function ($scope, $modal, $rootScope, SweetAlert, OrderService, localStorageService) {
            $rootScope.isModyfied = localStorageService.get("isModyfied");//修改时间权限
            $scope.orderTypeSelect = [{name: '新签', id: 1}, {name: '续费', id: 2}, {name: '返课', id: 3}, {
                name: '推荐',
                id: 5
            }, {
                name: '线上O2O',
                id: 7
            }, {name: '赠课', id: 8}];
            $scope.isCourseAuditionSelect = [{name: '是', id: 1}, {name: '否', id: 0}];
        }
    ])
    .controller('orderSelectClassController', ['$scope', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'AuthenticationService', 'ClassManagementService', 'localStorageService',
        function ($scope, $modal, $rootScope, SweetAlert, OrderService, AuthenticationService, ClassManagementService, localStorageService) {

            $rootScope.isModyfied = localStorageService.get("isModyfied");//修改时间权限
            $scope.filter = {};
            // 点击选班时，展示班级的列表
            $scope.getCrmClassList = function getCrmClassList(tableState) {
                $scope.gTableState = tableState;
                $scope.isLoading = true;
                $scope.pagination = tableState.pagination;
                $scope.start = $scope.pagination.start || 1;
                $scope.number = $scope.pagination.number || 10;
                $scope.filter.start = $scope.start;
                $scope.filter.size = $scope.number;
                $scope.filter.classType = 1;
                $scope.filter.courseId = $scope.selectCourseId;
                $scope.filter.schoolId = AuthenticationService.currentUser().school_id;
                $scope.filter.status = 0;  // 班级只查询未结业的
                var promise = ClassManagementService.getClassesByFilter($scope.filter);
                promise.then(function (response) {
                        if (response.status == "FAILURE") {
                            SweetAlert.swal(response.data, "请重试", "error");
                        } else {
                            $scope.MyCrmCustomerStudentClassList = response.data.list;
                            for (var i = 0; i < $scope.MyCrmCustomerStudentClassList.length; i++) {
                                if (!$scope.MyCrmCustomerStudentClassList[i].planCount) {
                                    $scope.MyCrmCustomerStudentClassList[i].planCount = 0;
                                }
                            }
                            tableState.pagination.numberOfPages = response.data.pages;
                            setTimeout(function () {
                                positionF()
                            }, 10)
                        }
                        $scope.isLoading = false;
                    },
                    function (error) {
                    });
            }
            $scope.radioFun = function radioFun(index, list, flag) {
                $scope[list][index][flag] = !$scope[list][index][flag]
                for (var i = 0, len = $scope[list].length; i < len; i++) {
                    if (i != index) {
                        $scope[list][i][flag] = false
                    }
                }
            }
            // 选择该课程、该学校下的班级
            $scope.doSelectClass = function doSelectClass() {
                if ($scope.MyCrmCustomerStudentClassList.length < 1) {
                    SweetAlert.swal('该课程没有管理班级');
                    return;
                }
                var radioIndex = $("input[name='crmClassRadio']:checked").val();
                if (radioIndex == undefined) {
                    SweetAlert.swal('请选择班级信息');
                }
                $("#crmClassName_" + $scope.selectIndex).text($scope.MyCrmCustomerStudentClassList[radioIndex].name);
                // $scope.order.orderCourses[$scope.selectIndex].studentClassName = $scope.MyCrmCustomerStudentClassList[radioIndex].name;
                // $scope.order.orderCourses[$scope.selectIndex].studentClassId = $scope.MyCrmCustomerStudentClassList[radioIndex].id;
                $scope.classModal.orderCourses[$scope.selectIndex].studentClassName = $scope.MyCrmCustomerStudentClassList[radioIndex].name;
                $scope.classModal.orderCourses[$scope.selectIndex].studentClassId = $scope.MyCrmCustomerStudentClassList[radioIndex].id;
                $scope.hideSelectClass()
            }
            //  隐藏选班浮动框
            $scope.hideSelectClass = function hideSelectClass() {
                // $scope.order.orderCourses[$scope.selectIndex].clickNow = false
                $scope.classModal.orderCourses[$scope.selectIndex].clickNow = false
            }

            $scope.updateSelectCourse = function (classies,index) {
                if (classies.id == $scope.classModal.orderCourses[$scope.selectIndex].studentClassId) {
                    $scope.radioFun(index,'MyCrmCustomerStudentClassList','isDown')
                }
            }

            function positionF() {
                var $btn = $('#crmClassName_' + $scope.selectIndex),
                    $btnT = $btn.offset().top,
                    $wH = $(window).height(),
                    $this = $('#getListModal'),
                    $thisH = $this.outerHeight()
                //  小箭头位置
                $('#jiatou').css({'top': $btnT})
                $this.css({'top': ($wH - $thisH) / 2})
                if ($btnT > $thisH + $this.offset().top) {
                    $this.css({'top': $this.offset().top + ($btnT - $thisH - $this.offset().top)})
                } else if ($btnT < $this.offset().top) {
                    $this.css({'top': $btnT - $btn.outerHeight() - 50})
                }
            }
        }
    ])
    .controller('achievementRatioController', ['$scope', '$modal', '$rootScope', 'SweetAlert', 'DepartmentService', 'PositionService', 'OrderService', 'localStorageService',
        function ($scope, $modal, $rootScope, SweetAlert, DepartmentService, PositionService, OrderService, localStorageService) {

            $rootScope.isModyfied = localStorageService.get("isModyfied");//修改时间权限
            // 点击机构树节点
            $scope.selectDepartment = selectDepartment;
            $scope.getPositions = getPositions;
            $scope.departmentSelected = departmentSelected;
            $scope.changePosition = changePosition;
            $scope.saveAchievementRatio = saveAchievementRatio;
            $scope.selectEmployee = selectEmployee;
            // 获取大区的组织机构树
            $scope.showDristictDepartment = function showDristictDepartment() {
                var promise = DepartmentService.getDistrictDepartmentTree();
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        $scope.modalDepartments = angular.copy(response.data);
                        $scope.modalTitle = '选择部门';
                        $scope.modal = $modal({
                            scope: $scope,
                            templateUrl: 'partials/hr/department/modal.department.html',
                            show: true,
                            backdrop: "static"
                        });
                    }
                }, function (error) {

                });
            }

            /**
             * 选中部门
             */
            function selectDepartment(node) {
                $scope.newDepartment = findSelectedDepartment($scope.modalDepartments, node.id);
            }

            /**
             * 确定选中的部门
             */
            function departmentSelected() {
                $scope.order.achievementRatio.departName = $scope.newDepartment.name;
                $scope.order.achievementRatio.departmentId = $scope.newDepartment.id;
                $scope.getPositions($scope.newDepartment.id);
                $scope.modal.hide();
            }

            /**
             * 根据选择的部门查询职位
             */
            function getPositions(departmentId) {
                var promise = PositionService.list(departmentId);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        $scope.positions = response.data;
                    }
                }, function (error) {
                });
            }

            /**
             * 变更岗位时获取该部门岗位下的员工的信息
             */
            function changePosition() {
                var obj = {};
                obj.positionId = $scope.order.achievementRatio.position.id;
                obj.departmentId = $scope.order.achievementRatio.departmentId;
                $scope.order.achievementRatio.positionId = obj.positionId;
                obj.employmentStatus = 0;
                OrderService.getEmployeesByDepartPosition(obj).then(function (result) {
                    $scope.contractors = result.data;
                });
            }

            /**
             * 选择员工
             */
            function selectEmployee() {
                var userName = $("#userId option:selected").text();
                $scope.order.achievementRatio.userName = userName;
            }

            /**
             * 在组织架构树上点击某一部门时，查找部门其他必要信息
             * @param departments    all departments
             * @param id    the selected department id
             * @returns {boolean}    true if found, false if not found
             */
            function findSelectedDepartment(departments, id) {
                var found = false;
                angular.forEach(departments, function (department) {
                    if (found) {
                        return;
                    }
                    if (department.id == id) {
                        found = department;
                        return;
                    }
                    found = findSelectedDepartment(department.children, id);
                });
                return found;
            }

            /**
             * 保存业绩信息
             */
            function saveAchievementRatio() {
                // 判断此时的总比例是否是小于1，小于1正常添加，=1,给出提示
                var totalRatio = 0;
                var flag = true;
                $scope.order.achievementRatios = $scope.order.achievementRatios || []
                if ($scope.operateRatio == "add") {
                    if (!$scope.order.orderRelationTeachers) {
                        $scope.order.orderRelationTeachers = []
                    }
                    if ($scope.relationType == 1) {
                        if ($scope.order.achievementRatios.length > 0) {
                            for (var k = 0; k < $scope.order.achievementRatios.length; k++) {
                                totalRatio = Number($scope.order.achievementRatios[k].achievementRatio) + Number(totalRatio);
                                if ($scope.order.achievementRatios[k].userId == $scope.order.achievementRatio.userId) {
                                    // 包含了同一人
                                    flag = false;
                                }
                            }
                        }
                        var totalRatioNew = Number(totalRatio) + Number($scope.order.achievementRatio.achievementRatio);
                        // 判断是否是同一员工
                        if (!flag) {
                            SweetAlert.swal("同一员工只能添加一次 ");
                            return;
                        }
                        // 判断业绩分配比例
                        if (totalRatioNew <= 1) {
                            if (totalRatioNew == 1) {
                                $scope.order.ratioInvalid = false;
                            }
                        } else {
                            $scope.order.ratioInvalid = true;
                            SweetAlert.swal("所有员工业绩计算比例之和必须为100%");
                        }
                        $scope.order.achievementRatios.push($scope.order.achievementRatio);
                    } else if ($scope.relationType == 2) {
                        if ($scope.order.orderRelationTeachers.length < 3) {
                            if ($scope.order.orderRelationTeachers.length > 0) {
                                for (var k = 0; k < $scope.order.orderRelationTeachers.length; k++) {
                                    if ($scope.order.orderRelationTeachers[k].userId == $scope.order.achievementRatio.userId) {
                                        // 包含了同一人
                                        flag = false;
                                        break;
                                    }
                                }
                            }

                            // 判断是否是同一员工
                            if (!flag) {
                                SweetAlert.swal("同一员工只能添加一次 ");
                                return;
                            }
                            // 封装科目名称显示
                            for (var i = 0; i < $scope.omsSubject.length; i++) {
                                if ($scope.order.achievementRatio.subjectId == $scope.omsSubject[i].id) {
                                    $scope.order.achievementRatio.subjectName = $scope.omsSubject[i].name;
                                    break;
                                }
                            }
                            $scope.order.orderRelationTeachers.push($scope.order.achievementRatio);
                        } else {
                            SweetAlert.swal("教师数不能多于3个");
                        }
                    }
                    $scope.achieveRatioModal.hide();
                    try {
                        $scope.$parent.saveAchievementRatioV2($scope.order.achievementRatios, $scope.order.orderRelationTeachers, $scope.order.ratioInvalid)
                    } catch (e) {
                    }
                }
            }

            (function () {
                // 若achievementRatio对象不为空，查询岗位和员工信息
                if ($scope.order.achievementRatio.departmentId) {
                    getPositions($scope.order.achievementRatio.departmentId);
                }
                if ($scope.order.achievementRatio.positionId) {
                    changePosition();
                }

            })()
        }
    ])
    .controller('PaymentListController', ['$scope', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'localStorageService',
        function ($scope, $modal, $rootScope, SweetAlert, OrderService, localStorageService) {

            $rootScope.isModyfied = localStorageService.get("isModyfied");//修改时间权限
            $scope.resetSelect = function resetSelect() {
                $scope.paymentFilter = {};
                $scope.paymentFilter.orderTypes = [1, 2, 5];
                $scope.mtSeach = {
                    new: 1,
                    recomend: 1,
                    renewals: 1
                }
                $scope.callServerrecordFilterChange()

            }

            $scope.mtSeach = {
                new: 1,
                recomend: 1,
                renewals: 1
            }

            $scope.paymentListTableState = {};
            $scope.paymentFilter = {};
            $scope.getPaymentList = function getPaymentList(tableState) {
                if ($scope.studentListFirst) {
                    tableState.pagination.start = 0;
                    tableState.pagination.number = 10;
                }
                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                $scope.paymentListTableState = tableState;
                if (!$scope.paymentFilter.pay_end_time && !$scope.paymentFilter.pay_start_time) {
                    $scope.paymentFilter.pay_end_time = new Date().Format("yyyy-MM-dd");
                    $scope.paymentFilter.pay_start_time = new Date(new Date().setDate(1)).Format("yyyy-MM-dd");
                }
                OrderService.getPaymentList(start, number, tableState, $scope.paymentFilter).then(function (result) {
                    if (result.data) {
                        var num = result.data.length - 1;
                        $scope.tongji = result.data[num];
                        $scope.displayedrecord = result.data;
                        $scope.displayedrecord.length = $scope.displayedrecord.length - 1;
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.paymentListTableState = tableState;
                    }
                })
            }

            Array.prototype.contains = function (obj) {
                var i = this.length;
                while (i--) {
                    if (this[i] === obj) {
                        return true;
                    }
                }
                return false;
            }

            Array.prototype.indexOf = function (val) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == val) return i;
                }
                return -1;
            };
            Array.prototype.remove = function (val) {
                var index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };

            $scope.paymentFilter.orderTypes = [1, 2, 5];
            $scope.changeSelct = function changeSelct(key) {

                $scope.mtSeach[key] = !$scope.mtSeach[key]
                switch (key) {
                    case 'new':
                        if ($scope.paymentFilter.orderTypes.contains(1)) {
                            $scope.paymentFilter.orderTypes.remove(1)
                        } else {
                            $scope.paymentFilter.orderTypes.push(1)
                        }
                        break;

                    case 'recomend':
                        if ($scope.paymentFilter.orderTypes.contains(5)) {
                            $scope.paymentFilter.orderTypes.remove(5)
                        } else {
                            $scope.paymentFilter.orderTypes.push(5)
                        }
                        break;

                    case 'renewals':
                        if ($scope.paymentFilter.orderTypes.contains(2)) {
                            $scope.paymentFilter.orderTypes.remove(2)
                        } else {
                            $scope.paymentFilter.orderTypes.push(2)
                        }
                }
                //alert($scope.paymentFilter.orderTypes.toString())
            }

            $scope.callServerrecordFilterChange = function callServerrecordFilterChange() {
                if ($scope.modalAlready) {
                    $scope.modalAlready.hide()
                }

                $scope.paymentListTableState.pagination.start = 0
                setParam()
                $scope.paymentListTableState.search.predicateObject.pageNum = 1
                $scope.paymentListTableState.pageNum = 1
                $scope.getPaymentList($scope.paymentListTableState);
            }

            function setParam() {
                $scope.paymentListTableState.search.predicateObject = $scope.paymentListTableState.search.predicateObject ? $scope.paymentListTableState.search.predicateObject : {}
                $scope.paymentListTableState.search.predicateObject = angular.copy($scope.mtSeach)
            }

            $scope.payDatas = [{"name": "今日", "id": 1}, {"name": "明日", "id": 9}, {
                "name": "本周",
                "id": 10
            }, {"name": "下周", "id": 11}, {"name": "本月", "id": 13}, {"name": "下月", "id": 15}, {"name": "自定义", "id": 8}];
            $scope.contractDatas = [{"name": "今日", "id": 1}, {"name": "明日", "id": 9}, {
                "name": "本周",
                "id": 10
            }, {"name": "下周", "id": 11}, {"name": "本月", "id": 13}, {"name": "下月", "id": 15}, {"name": "自定义", "id": 8}];

            $scope.exportSummary = function exportSummary() {

                if ($scope.paymentListTableState.pagination.numberOfPages > 300) {
                    SweetAlert.swal('导出数据不能大于3000条');
                    return;
                }
                var promise = OrderService.excelPaymentList($scope.paymentFilter);
                promise.then(function (result) {

                    for (var i = 0; i < result.data.length; i++) {

                        switch (result.data[i].order_type) {
                            case 1:
                                result.data[i].order_type = '新签';
                                break;

                            case 2:
                                result.data[i].order_type = '续费';
                                break;

                            case 3:
                                result.data[i].order_type = '返课';
                                break;

                            case 4:
                                result.data[i].order_type = '转课';
                                break;

                            case 5:
                                result.data[i].order_type = '推荐';
                                break;

                            case 6:
                                result.data[i].order_type = '试听';
                                break;

                            case 7:
                                result.data[i].order_type = 'o2o线上订单';
                                break;

                            case 8:
                                result.data[i].order_type = '赠课';

                        }
                        switch (result.data[i].payType) {
                            case 1:
                                result.data[i].payType = '正常';
                                break;

                            case 2:
                                result.data[i].payType = '结转';
                                break;
                        }
                        result.data[i].contract_start_date = new Date(result.data[i].contract_start_date).Format("yyyy-MM-dd");
                        result.data[i].payDate = new Date(result.data[i].payDate).Format("yyyy-MM-dd");
                    }

                    $scope.exportSummaryModels = result.data;
                    //导出
                    var titleName = '交费记录数据';
                    var exportTableStyle = {
                        sheetid: titleName,
                        headers: true,
                        caption: {
                            title: titleName,
                        },
                        column: {style: 'font-size:16px; text-align:left;'},
                        columns: [
                            {columnid: 'stu_name', title: '学生姓名', width: '100px'},
                            {columnid: 'orderNo', title: '合同编号'},
                            {columnid: 'order_type', title: '签约类型'},
                            {columnid: 'payType', title: '交费类型'},
                            {columnid: 'contract_start_date', title: '签约日期'},
                            {columnid: 'real_total_amount', title: '签约金额'},
                            {columnid: 'payAmount', title: '交费金额'},
                            {columnid: 'payDate', title: '交费日期'},
                            {columnid: 'payDueAmount', title: '当前尾款'},
                            {columnid: 'belong_name', title: '业绩所属人'},
                            {columnid: 'create_name', title: '经办人'}
                        ],
                        row: {
                            style: function (sheet, row, rowidx) {
                                return 'background:' + (rowidx % 2 ? '#E1FFFF' : '#F0E68C');
                            }
                        },
                        cells: {
                            style: 'font-size:13px; text-align:left;'
                        }
                    };
                    alasql('SELECT * INTO XLS("交费记录数据.xls", ?) FROM ?', [exportTableStyle, $scope.exportSummaryModels]);
                });
            }
        }

    ])
    .controller('OrderChargeTopupProtocolController', ['$scope', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'CommonService', 'localStorageService',
        function ($scope, $modal, $rootScope, SweetAlert, OrderService, CommonService, localStorageService) {
            //储值添加交费记录
            var _payDate = '';

            function _getOrderCopy() {
                var data = angular.copy($scope.orderRecharge)
                $scope.orderRecharge.payDate = _payDate
                return data
            }

            $scope.chargeOrderT = function chargeOrderT() {
                $scope.orderRecharge.orderStatus = 2;
                _payDate = $scope.orderRecharge.payDate;
                $scope.orderRecharge.payDate = new Date($scope.orderRecharge.payDate);
                OrderService.getOrderPayments(0, 1000, $scope.orderRecharge.orderNo).then(function (result) {
                    if (result.data.length > 0) {
                        var maxPayDate = result.data[0].payDate;
                        if (maxPayDate > $scope.orderRecharge.payDate.getTime()) {
                            SweetAlert.swal('本次支付时间不能小于上次支付时间！');
                            $scope.orderRecharge.payDate = _payDate;
                            _getOrderCopy();
                            return;
                        }
                    }
                    /*if($scope.order.payDate.getTime() < $scope.order.contractStartDate.getTime()){
                        SweetAlert.swal("请确认交费日期是否正确，当前交费日期早于合同签约日期");
                        return;
                    }*/
                    var promise = OrderService.chargeTopup($scope.orderRecharge);
                    promise.then(function (data) {
                        //$scope.dataLoading = false;
                        SweetAlert.swal('操作成功');
                        $scope.chargeOrderModal.hide();
                        if (!($scope.modal === undefined)) {
                            $scope.modal.hide();
                        }
                        if ($scope.refreshCustomerOrderDetail) {
                            $scope.refreshCustomerOrderDetail();
                        }
                        $scope.orderRecharge.payDate = null;
                        $scope.refreshTabs();
                        if ($rootScope._getIndexData_) {
                            $rootScope._getIndexData_(3)
                        }
                    }, function (error) {
                        // $scope.dataLoading = false;
                        SweetAlert.swal('操作失败');
                        $scope.chargeOrderModal.hide();
                    });
                })
            }
            //服务器时间
            OrderService.getServeDate().then(function (result) {
                $rootScope.isModyfied = localStorageService.get("isModyfied");
                if (result.status = "SUCCESS") {
                    if ($scope.orderRecharge.recharge) {
                        $scope.orderRecharge.recharge.payDate = new Date(result.data);
                    }
                    if ($scope.orderCarry) {
                        $scope.orderCarry.payDate = new Date(result.data);
                    }
                    $scope.orderRecharge.payDate = new Date(result.data);
                }
            })

        }
    ]);
