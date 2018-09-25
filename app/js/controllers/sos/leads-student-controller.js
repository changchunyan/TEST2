'use strict';

/**
 * The LeadsStudent management controller.
 *
 * @author zhangyf@youwinedu.com
 * @version 1.0
 */
var ywsApp = angular.module('ywsApp');
ywsApp.controller('LeadsStudentController', ['$scope', '$http', '$location', '$routeParams', 'LeadsStudentService', 'CommonService', '$modal',
    '$rootScope', '$timeout', 'SweetAlert', 'FileUploader', '$base64',
    'InvitationRemindService', 'InvitationCommunicationService', 'InvitationDetailService', 'OrderService',
    'localStorageService', 'CoursePlanService', 'AuthenticationService', '$interval', '$filter', 'CustomerStudentCourseService',
    'DepartmentService','EmployeeService', '$mtModal', 'StuDetail', 'ColEdit',
    function ($scope, $http, $location, $routeParams, LeadsStudentService, CommonService, $modal, $rootScope, $timeout,
        SweetAlert, FileUploader, $base64, InvitationRemindService, InvitationCommunicationService, InvitationDetailService, OrderService,
        localStorageService, CoursePlanService, AuthenticationService, $interval, $filter, CustomerStudentCourseService, DepartmentService,
              EmployeeService,$mtModal, StuDetail, ColEdit) {
        var oThis = this;
        $scope.allsorcecon = true;
        $scope.allnoeffecttag = false;
        $scope.myCrmLeadsStudentFilter = {};
        $scope.myCrmLeadsStudentFilter.exception_id = '';
        $scope.timecompre = timecompre;
        //绑定外呼电话
        $scope.bindPhone = bindPhone;
        $scope.delPhone = delPhone;
        $scope.callStuWaihuPhone = callStuWaihuPhone;

        function initYouHua(){
            if ($location.url().endsWith('/leads_student')) {
                $scope.isYouHua=true;
            } else {
                $scope.isYouHua=false;
            }
        }

        $scope.outboundphone = $rootScope.currentUser.outboundphone;
        $scope.isOutbound = $rootScope.currentUser.isOutbound;
        $scope.userId = $rootScope.currentUser.id;
        $scope.employeeId = $rootScope.currentUser.employeeId;


        function bindPhone() {

            $scope.modalTitleForBindPhone = '新增坐席号码';
            $scope.modalForBindPhone = $modal({ scope: $scope, templateUrl: 'partials/sos/leads/modal.bindOutboundPhone.html', show: true });
        }

        function delPhone() {
            SweetAlert.swal({
                    title: "确定要删除坐席号码吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#fe9900',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
						$scope.employee = {id:$scope.employeeId};
                        //$scope.employee.userId = {}$scope.userId;
                        var promise = EmployeeService.delOutboundphone($scope.employee,$scope.employeeId);
                        //$rootScope.showLoading();

                        promise.then(function (response) {
                            if (response.status == "FAILURE") {
                                SweetAlert.swal(response.data, "请重试", "error");
                            }
                            else {
                                SweetAlert.swal(response.data);
								localStorageService.set('outboundphone', '');
								window.location.reload();
                            }
                        });
                    }
                }
            );
        }

        function callStuWaihuPhone(phone) {

                var param = {
                    title: "<div class='ut-name'><p style=''><span>提醒</span></p></div>",
                    text: '<h2 class="c3 f24" id="Qh2">未绑定坐席号码，请绑定再拨</h2>',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#fe9900',
                    confirmButtonText: '去绑定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true,
                    html: true
                }
                SweetAlert.swal(param,
                    function (confirm) {
                        if (confirm) {
                            $scope.modalTitleForBindPhone = '新增坐席号码';
                            $scope.modalForBindPhone = $modal({ scope: $scope, templateUrl: 'partials/sos/leads/modal.bindOutboundPhone.html', show: true });
                        }
                    }
                );

        }

        function warningAlert(title, fun, c) {
            SweetAlert.swal({
                title: title,
                type: "warning",
                showCancelButton: false,
                confirmButtonText: '确定',
                closeOnConfirm: true
            }, fun)
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
        //zhang  start
        //查看详情 查看更多
        $scope.chakangengduo = '更多信息'
        $scope.chakangengduo = function chakangengduo() {
            $scope.chakangengduo = '收起更多信息';
        }
        //全部选择
        $scope.allcheck = function allcheck() {
            $scope.allselected = $("#allCheckBox").is(":checked");
            if ($scope.allselected) {
                for (var i = 0; i < $scope.CrmLeadsStudentList.length; i++) {
                    $scope.CrmLeadsStudentList[i].selected = true;
                }
                $scope.noxiaotag = true;
                $scope.endarr = $scope.CrmLeadsStudentList;
            } else {
                $scope.noxiaotag = false;
                for (var i = 0; i < $scope.CrmLeadsStudentList.length; i++) {
                    $scope.CrmLeadsStudentList[i].selected = false;
                }
                $scope.endarr = [];
            }
        }
        //校区每个列表选择
        $scope.schoolendarr = []
        $scope.schoolnoxiaotag = false;
        $scope.schoolnoxiao = function (row) {
            if (row.selected) {
                $scope.schoolendarr.push(row);
                $scope.schoolnoxiaotag = true;
            } else {
                $scope.schoolendarr = $scope.schoolendarr.filter(function (x) { return x.crm_student_id != row.crm_student_id });
            }
            if ($scope.schoolendarr.length == 0) {
                $scope.schoolnoxiaotag = false;
            }
        }


        //全部选择
        $scope.schoolallcheck = function () {
            $scope.allschoolselected=$("#allschoolcheckbox").is(":checked");
            if ($scope.allschoolselected) {
                for (var i = 0; i < $scope.schoolCrmLeadsStudentList.length; i++) {
                    $scope.schoolCrmLeadsStudentList[i].selected = true;
                }
                $scope.schoolnoxiaotag = true;
                $scope.schoolendarr = $scope.schoolCrmLeadsStudentList;
            } else {
                $scope.schoolnoxiaotag = false;
                for (var i = 0; i < $scope.schoolCrmLeadsStudentList.length; i++) {
                    $scope.schoolCrmLeadsStudentList[i].selected = false;
                }
                $scope.schoolendarr = [];
            }
        }
        //校区标记全部无效
        $scope.schoolallnoface = function () {
            if ($scope.schoolnoxiaotag) {
                SweetAlert.swal({
                    title: '确定批量标记无效吗？',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (config) {
                    if (config) {

                        LeadsStudentService.updateExceptionStatus($scope.schoolendarr).then(function () {
                            $scope.getSchoolCrmLeadsStudentList($scope.schoolCrmLeadsStudentListTableState)
                            $scope.allschoolselected = false;
                            $("#allschoolcheckbox").attr("checked",false);
                        })
                    }
                })
            } else {
                SweetAlert.swal('您没有选择任何数据！')
            }


        }
        //无效校区选择按钮
        $scope.schoolallnoeffecttag = false;
        $scope.schoolallnoeffect = function () {
            $scope.schoolallnoeffecttag = !$scope.schoolallnoeffecttag;
            if ($scope.schoolallnoeffecttag) {
                $scope.schoolCrmLeadsStudentFilter.exception_id = 2;
            } else {
                $scope.schoolCrmLeadsStudentFilter.exception_id = '';
            }
            $scope.schoolsearch();
        }

        //无效选择按钮

        $scope.allnoeffect = function allnoeffect() {
            $scope.allnoeffecttag = !$scope.allnoeffecttag;
            if ($scope.allnoeffecttag) {
                $scope.myCrmLeadsStudentFilter.exception_id = 2;
            } else {
                $scope.myCrmLeadsStudentFilter.exception_id = '';
            }
            $scope.search();
        }


        //改变的搜索

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

        //zhang  end

        //可否拨打电话
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

        function ifResponseSuccess(response) {
            if (response.data.status == 'FAILURE') {
                SweetAlert.swal(response.data.data);
                return false;
            } else {
                return true;
            }
        }
        function _getNumber() {
            InvitationDetailService.getNumber().then(function (result) {
                $scope.num = {
                    invitates: result[0].invitates || 0,
                    calls: result[0].calls || 0,
                };
                console.log(result);
            });
        }
        $scope.mobile = {
            listsStart: 0,
            detail: {},//详情
            getLists: function () {
                if ($scope.CrmLeadsStudentList && $scope.CrmLeadsStudentList.length > 0) {
                    var start = $scope.mobile.listsStart || 1;
                } else {
                    var start = 1;
                }

                var number = 20;
                LeadsStudentService.listByMobile(start, number, $scope.myCrmLeadsStudentFilter).then(function (result) {
                    //console.dir(result.data);
                    if ($scope.CrmLeadsStudentList && $scope.CrmLeadsStudentList.length > 0) {
                        $scope.CrmLeadsStudentList = $scope.CrmLeadsStudentList.concat(result.data);
                    } else {
                        $scope.CrmLeadsStudentList = result.data;
                    }

                    $scope.mobile.listsStart = $scope.mobile.listsStart + 1;
                });
            },
            callNumber: function (row) {
                $scope.mobile.detail = row;
            }
        };

        $scope.showPhoneComplaint = function () {
            $scope.head = {};
            $scope.title = '标记投诉';
            $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/sos/leads/modal.changPhoneComplaint.html', show: true });
        };
        /**
         * 更改电话异常状态
         */
        $scope.updatePhoneException = function (obj) {
            LeadsStudentService.updatePhoneException(obj).then(function (result) {
                SweetAlert.swal('操作成功！该电话号码' + $scope.head.changePhoneNumber + '现在为“被投诉”状态，系统限制不可拨打');
                $scope.modal.hide();

            });
        };
        $scope.head = {};
        $scope.changePhoneStatus = function () {
            var obj = {
                phone: $scope.head.changePhoneNumber,
                status: 5
            };
            $scope.updatePhoneException(obj);
        }


        /**
         * 改变leads 状态
         * @param rew
         * @param status 要改变的新状态
         */
        $scope.changeExceptionStatus = function (row, status) {
            console.log(3);
            if(typeof row.exceptionStatus !='undefined' &&row.exceptionStatus!=null){
                row.exception_status=row.exceptionStatus;
            }

            if (status == row.exception_status) {
                return;
            } else {
                var obj = {
                    id: row.crm_student_id,
                    exceptionStatus: status
                };
                LeadsStudentService.updateLeadsStudent(obj).then(function (result) {
                    if (ifResponseSuccess(result)) {
                        //if($scope.isMobile){
                        //    $scope.CrmLeadsStudentList = [];
                        //    $scope.mobile.getLists();
                        //}else{
                        //    $scope.showListView();
                        //}
                        if ($scope.detailForUpdate) {
                            $scope.detailForUpdate.exception_status = status;
                            $scope.detailForUpdate.exceptionStatus = status;
                        }
                        row.exception_status = status;
                        row.exceptionStatus=status;
                        $('popup').hide();
                    }
                });

            }
        };
        $scope.changeLeadsProterty = function (row, status) {
            if (status == row.leadsProperty) {
                return;
            } else {
                var obj = {
                    id: row.crm_student_id,
                    leadsProperty: status
                };
                LeadsStudentService.updateLeadsStudent(obj).then(function (result) {
                    if (ifResponseSuccess(result)) {
                        $scope.showListView();
                        if ($scope.detailForUpdate) {
                            $scope.detailForUpdate.leadsProperty = status;
                        }
                        $('popup').hide();
                    }
                });

            }
        };


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

        $scope.StudentStatus = [{ "name": "结课", "value": 2 }, { "name": "转课", "value": 5 }, { "name": "退费", "value": 4 }];

        $scope.quick = [];
        $scope.quickSelected = function (i) {
            if ($scope.quick[i]) {
                $scope.quick[i] = false;
            } else {
                $scope.quick[i] = true;
                if (i == 0) {
                    $scope.quick[1] = false;
                } else if (i == 1) {
                    $scope.quick[0] = false;
                }
            }
            if ($scope.isMobile) {
                _quickSelectedAttr($scope.quick, $scope.myCrmLeadsStudentFilter);
                $scope.CrmLeadsStudentList = [];
                $scope.mobile.getLists();
            } else {
                if (!isEmptyObject($scope.schoolCrmLeadsStudentFilter)) {
                    _quickSelectedAttr($scope.quick, $scope.schoolCrmLeadsStudentFilter);
                    $scope.getSchoolCrmLeadsStudentList($scope.schoolCrmLeadsStudentListTableState);
                }
                if (!isEmptyObject($scope.myCrmLeadsStudentFilter)) {
                    _quickSelectedAttr($scope.quick, $scope.myCrmLeadsStudentFilter);
                    $scope.getList($scope.myCrmLeadsStudentListTableState);
                }
            }


        };
        /********************* 过滤高中毕业学生 ****************************/
        $scope.isSelectedGraduation = true;
        $scope.quickSelectGraduation = function () {
            if ($scope.isSelectedGraduation) {
                $scope.isSelectedGraduation = false;
            } else {
                $scope.isSelectedGraduation = true;
            }
            //我的意向客户
            if (!isEmptyObject($scope.myCrmLeadsStudentFilter)) {
                $scope.myCrmLeadsStudentFilter.isSelectedGraduation = $scope.isSelectedGraduation;
                $scope.getList($scope.myCrmLeadsStudentListTableState);
            }
            //校区意向客户
            if (!isEmptyObject($scope.schoolCrmLeadsStudentFilter)) {
                $scope.schoolCrmLeadsStudentFilter.isSelectedGraduation = $scope.isSelectedGraduation;
                $scope.getSchoolCrmLeadsStudentList($scope.schoolCrmLeadsStudentListTableState);
            }
        };
        /********************* 过滤异常客户 ****************************/
        $scope.isSelectedException = false;
        $scope.quickSelectedException = function () {
            if ($scope.isSelectedException) {
                $scope.isSelectedException = false;
            } else {
                $scope.isSelectedException = true;
            }
            if (!isEmptyObject($scope.schoolCrmLeadsStudentFilter)) {
                _quickSelectedException($scope.schoolCrmLeadsStudentFilter);
                $scope.getSchoolCrmLeadsStudentList($scope.schoolCrmLeadsStudentListTableState);
            }
            if (!isEmptyObject($scope.myCrmLeadsStudentFilter)) {
                _quickSelectedException($scope.myCrmLeadsStudentFilter);
                $scope.getList($scope.myCrmLeadsStudentListTableState);
            }
        };
        function _quickSelectedException(filter) {
            if ($scope.isSelectedException) {
                filter.exception_id = 1;//表示无异常
            } else {
                filter.exception_id = null;
            }
        }
        function _quickSelectedAttr(list, filter) {
            if (list[0]) {//陌拜客户
                filter.leadsProperty = 1;
            } else if (!list[1]) {
                filter.leadsProperty = null;
            }

            if (list[1]) {//重点跟进客户
                filter.leadsProperty = 2;
            } else if (!list[0]) {
                filter.leadsProperty = null;
            }

            if (list[2]) {//已体验客户
                filter.state_id_1 = 5;
            } else {
                filter.state_id_1 = null;
            }

            if (list[3]) {//高意向客户
                filter.purposeLevel = 1;
            } else {
                filter.purposeLevel = null;
            }

            if (list[4]) {//今日跟进客户
                filter.follow_up_at = new Date();
                filter.followUpAt = (new Date()).Format("yyyy-MM-dd");
            } else {
                filter.follow_up_at = null;
                filter.followUpAt = null;
            }

            if (list[5]) {//7天未联系客户
                filter.sortType = 1;
                filter.sortDate = 7;
            } else {
                filter.sortType = null;
                filter.sortDate = null;
            }

        }
        /*******************************************************Leads导入start*******************************************************/
        //导入  LiuHr
        $scope.checkSuccess = false;    //是否校验成功，控制‘校验’和‘确认导入’按钮的显示
        $scope.step = 1;    //初始化步骤
        $scope.percentage = 17; //初始化进度
        $scope.importComplete = false;
        $scope.importSuccess = false;
        //弹出导入框
        $scope.showUploadModal = function () {
            $scope.modalLeadingInTitle = '导入';
            $scope.modalForImport = $modal({ scope: $scope, templateUrl: 'partials/sos/leads/modal.leadingIn.html', show: true });
            //监听模态框hide时，重置状态
            $scope.$watch("modalForImport.$isShown", function (old, newval) {
                if (old != newval) {
                    $scope.hideUploadModal();
                }
            })
        }
        //重置input type=file的样式，弹出选择文件
        $scope.chooseFile = function () {
            $("input[type=file]").trigger("click");
        };

        //上传导入信息,验证接口
        var uploader1 = $scope.uploader1 = new FileUploader({
            url: config.endpoints.sos.LeadsStudent + '/checkExcel',
            headers: {
                'Authorization': 'bearer ' + $base64.encode(localStorageService.get('user').account + ':' + localStorageService.get('token')),
            }
            // ,
            // queueLimit: 1
        });

        // FILTERS 只允许单个文件上传
        uploader1.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                if (this.queue.length >= 1) {
                    SweetAlert.swal("一次只能上传一个文件");
                }
                return this.queue.length < 1;

            }
        });

        // CALLBACKS
        uploader1.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        };

        //添加一个文件
        uploader1.onAfterAddingFile = function (fileItem) {
            //判断后缀
            //取到后缀
            var fileExtend = fileItem.file.name.substring(fileItem.file.name.lastIndexOf('.')).toLowerCase();
            //if(fileExtend != '.xls' && fileExtend != '.xlsx'){
            if (fileExtend != '.xlsx') {
                warningAlert('上传文档模板错误，请上传正确的《意向客户导入模板》');
                fileItem.remove();
                //输入框文件名置空
                $scope.fileName = '';
                return false;
            } else if (fileItem.file.size / 1024 / 1024 > 2) {
                warningAlert('请选择文件大小小于2M的文件');
                return false;
            } else {
                //输入框显示文件名
                $scope.fileName = fileItem.file.name;
            }
        };

        //添加多个文件
        uploader1.onAfterAddingAll = function (addedFileItems) {
        };

        uploader1.onProgressItem = function (fileItem, progress) {
            $rootScope.ywsLoading = true;
        };

        uploader1.onCompleteItem = function (fileItem, response, status, headers) {
            //数据校验成功
            // console.log(response)
            //校验的状态值
            console.log(response)
            if (response.data != null) {
                $scope.checkStatus = response.data.checkStatus;
                switch ($scope.checkStatus) {
                    case 1: //文档格式错误
                        //校验后状态的描述
                        $scope.checkStatusDescription = '上传文档模板错误，请上传正确的《意向客户导入模板》';
                        break;
                    case 2://文档内容为空
                        $scope.checkStatusDescription = '文档内容为空';
                        break;
                    case 3://文档超过5000条
                        $scope.checkStatusDescription = '文档过大，单次导入不能超过5000条';
                        break;
                    case 4: //总数和错误相等
                        //校验错误数
                        $scope.checkFormatErrorCount = response.data.formatErrorCount;
                        //校验总数
                        $scope.checkTotalCount = response.data.totalCount;
                        //变量绑定，用于导出错误信息
                        $scope.statisticsModelsAll = response.data.failList;
                        $scope.checkStatusDescription = null;
                        break;
                    case 5://校验excel发生错误
                        $scope.checkError = true;
                        $scope.checkStatusDescription = '校验excel中发生错误';
                        break;
                    case 6://校验成功，允许导入
                        //校验成功的列表
                        $scope.listStu = response.data.listStu;
                        //校验错误数
                        $scope.checkFormatErrorCount = response.data.formatErrorCount;
                        //校验总数
                        $scope.checkTotalCount = response.data.totalCount;
                        //变量绑定，用于导出错误信息
                        $scope.statisticsModelsAll = response.data.failList;
                        $scope.checkStatusDescription = '确定导入，错误信息不会导入系统';
                        break;
                    case 7:
                        $scope.checkError = true;
                        $scope.checkStatusDescription = '校验excel发生错误，未找到需要导入的信息';
                        break;
                    default:
                        $scope.checkError = true;
                        $scope.checkStatusDescription = '校验excel中发生错误,未收到响应码';
                        break;
                }
            } else {
                $scope.checkError = true;
                $scope.checkStatusDescription = '校验excel中发生错误，未收到响应结果';
            }

            $scope.checkSuccess = true;
            //设置步骤
            $scope.step = 2;
            //设置进度
            $scope.percentage = 50;
            $rootScope.ywsLoading = false;
        };



        //取消后清空文件列表
        $scope.hideUploadModal = function () {
            //清空文件列表
            uploader1.clearQueue();
            $scope.fileName = '';
            //设置步骤
            $scope.step = 1;
            //设置进度
            $scope.percentage = 17;
            //显示"校验"按钮
            $scope.checkSuccess = false;
            $scope.importComplete = false;
            //校验excel发生错误
            $scope.checkError = false;
            $scope.importSuccess = false;
        }
        //确认导入
        $scope.confirmImportFile = function () {
            LeadsStudentService.uploadExcelDoc($scope.listStu).then(function (data) {
                //导入后清空文件列表
                uploader1.clearQueue();
                //导入完成，导入按钮禁用
                console.log(data)
                $scope.importComplete = true;
                $scope.importSuccess = true;
                if (data.status = "SUCCESS") {
                    //拼接成功导入后的提示文字
                    $scope.importStatusDescription = '共' + $scope.checkTotalCount + '条意向客户，成功导入' + data.data.successCount + "条，错误信息" + ($scope.checkTotalCount - data.data.successCount) + '条'
                    //刷新我的学生Leads列表
                    if ($scope.myCrmLeadsStudentListTableState && $scope.myCrmLeadsStudentListTableState.pagination) {
                        $scope.myCrmLeadsStudentListTableState.pagination.start = 0;
                        $scope.getList($scope.myCrmLeadsStudentListTableState);
                    }
                    //刷新学校学生Leads列表
                    if ($scope.isSchoolMaster() && $scope.schoolCrmLeadsStudentListTableState && $scope.schoolCrmLeadsStudentListTableState.pagination) {
                        $scope.schoolCrmLeadsStudentListTableState.pagination.start = 0;
                        $scope.getSchoolCrmLeadsStudentList($scope.schoolCrmLeadsStudentListTableState);
                    }
                } else {
                    $scope.importStatusDescription = data.data.msg;
                }
                //设置步骤
                $scope.step = 4;
                //设置进度
                $scope.percentage = 100;

                $rootScope.ywsLoading = false;
            })
        }
        $scope.exportmain = function (data, type) {
            $scope.exportCustomerModal = $modal({ scope: $scope, templateUrl: 'partials/sos/leads/modal.exportLabel.html', show: true });
            $scope.$watch("exportCustomerModal.$isShown", function (old, newval) {
                if (old != newval) {
                    $scope.e = {};
                }
            })
            $scope.exportCustomerData = data;
            $scope.exportCustomerType = type;
        }

        $scope.e = {}
        $scope.canSubmit = true;
        $scope.exportPageNumberChange = function (startPage, endPage) {
            $scope.canSubmit = true;
            if (startPage) {
                $scope.e.exportStartPageNumber = parseInt(startPage.toString().replace(/[^\d]+/g, ''));
            }
            if (endPage) {
                $scope.e.exportEndPageNumber = parseInt(endPage.toString().replace(/[^\d]+/g, ''));
            }
            if ($scope.e.exportEndPageNumber && $scope.e.exportStartPageNumber) {

                if ($scope.e.exportStartPageNumber <= $scope.e.exportEndPageNumber && parseInt($scope.e.exportEndPageNumber) - parseInt($scope.e.exportStartPageNumber) <= 300) {

                    $scope.canSubmit = false;
                }
            }
        }
        $scope.exportCustomer = function exportCustomer() {
            if ($scope.exportCustomerType == 1) {
                $scope.exportCustomerData.exportType = 1
            } else {
                $scope.exportCustomerData.exportType = 2
            }
            $scope.exportCustomerData.startPage = $scope.e.exportStartPageNumber;
            $scope.exportCustomerData.endPage = $scope.e.exportEndPageNumber;


            LeadsStudentService.exportLeadsInfo($scope.exportCustomerData).then(function (result) {

                console.log(result)
                $scope.customall = result.data
                angular.forEach($scope.customall, function (p, index) {
                    p.index = index + 1;//序号
                    p.name = p.name;
                    if (p.gender == 0) {
                        p.gender = '女'
                    } else if (p.gender == 1) {
                        p.gender = '男'
                    } else {
                        p.gender = '未标记'
                    }

                    p.exception_status = p.exception_status == 2 ? '异常' : '无异常';
                    if (p.channel2Name) {
                        p.channel1Name = p.channel1Name + '-' + p.channel2Name;
                    } else {
                        p.channel1Name = p.channel1Name;
                    }
                    if (p.purpose_level == 1) {
                        p.purpose_level = '高'
                    } else if (p.purpose_level == 2) {
                        p.purpose_level = '中'
                    } else if (p.purpose_level == 3) {
                        p.purpose_level = '低'
                    } else {
                        p.purpose_level = '未标记'
                    }

                    if (p.goutong && p.goutong != 1 && p.goutong != 2) {
                        p.goutong = p.goutong + '天前'
                    } else if (p.goutong == 1) {
                        p.goutong = '昨天'
                    } else if (p.goutong == 2) {
                        p.goutong = '前天'
                    } else if (!p.goutong && p.goutong != 0) {
                        p.goutong = '无沟通'
                    } else {
                        p.goutong = '今天'
                    }
                    p.follow_up_at = p.follow_up_at ? new Date(p.follow_up_at).Format("yyyy-MM-dd") : '未标记'
                    p.receiveTime = p.receiveTime ? new Date(p.receiveTime).Format("yyyy-MM-dd") : '未标记'
                    if (p.relatives_type) {
                        if (p.relatives_type == 1) {
                            p.relatives_type = '爸爸'
                        } else if (p.relatives_type == 2) {
                            p.relatives_type = '妈妈'
                        } else if (p.relatives_type == 3) {
                            p.relatives_type = '爷爷'
                        } else {
                            p.relatives_type = '奶奶'
                        }
                    } else {
                        p.relatives_type = '未标记'
                    }
                    p.create_at = p.create_at ? new Date(p.create_at).Format("yyyy-MM-dd") : '未标记'
                });
                $scope.exportmycustomer();
            })
        }

        $scope.exportmainschool = function (data, type) {
            data.exportType = 2;

            LeadsStudentService.exportLeadsInfo(data).then(function (result) {

                console.log(result)
                $scope.customall = result;

                console.log($scope.customall)
            })
        }
        //导出错误信息
        $scope.exportErrorInfo = function () {
            $scope.exportStatisticsToExcel();
        }
        //主页面导出整个数据 意向客户

        //主页面导出整个数据 意向客户
        $scope.exportmycustomer = function () {
            var statisticsExportTableStyle = {
                sheetid: '意向客户管理信息导出',
                headers: true,
                caption: {
                    title: '意向客户管理信息导出',
                },
                column: { style: 'font-size:14px; text-align:center;' },
                //每一列表的变量和 后台所传来的变量对应
                columns: [{ columnid: 'name', title: '姓名', width: '150px' },
                { columnid: 'gender', title: '性别' },
                { columnid: 'age', title: ' 年龄' },
                { columnid: 'exception_status', title: '异常' },
                { columnid: 'phone', title: '手机号' },
                { columnid: 'grade_name', title: '年级' },
                { columnid: 'state1Name', title: '状态' },
                { columnid: 'channel1Name', title: '来源' },
                { columnid: 'purpose_level', title: '意向程度' },
                { columnid: 'goutong', title: '上次沟通（天前）' },
                { columnid: 'follow_up_at', title: '下次跟进时间' },
                { columnid: 'receiveTime', title: '预计到访时间' },
                { columnid: 'school_name', title: '在读学校' },
                { columnid: 'relatives_type', title: ' 亲属关系' },
                { columnid: 'mother_name', title: '家长姓名' },
                { columnid: 'mother_phone', title: '家长手机号' },
                { columnid: 'customer_requirement', title: '客户需求' },
                { columnid: 'create_at', title: '创建时间' },
                { columnid: 'belong_school_name', title: '所属校区' },
                { columnid: 'belong_user_name', title: '所属人' },
                { columnid: 'create_by', title: '创建人' }
                ],
                row: {
                    style: function (sheet, row, rowidx) {
                        return 'background:' + (rowidx % 2 ? '#E1FFFF' : '#F0E68C') + ';' + 'text-align:center;'
                    }
                },
                cells: {
                    style: 'font-size:13px; text-align:left;'
                }
            };
            //alasql 两个参数，一个是配置项，一个是所导出的数据集合,
            alasql('SELECT * INTO XLS("意向客户管理信息导出.xls", ?) FROM ?', [statisticsExportTableStyle, $scope.customall]);



        }



        /**
         * 导出excel，
         */
        $scope.exportStatisticsToExcel = exportStatisticsToExcel;
        function exportStatisticsToExcel() {
            console.log($scope.statisticsModelsAll)
            var statisticsExportTableStyle = {
                sheetid: '意向客户错误信息导出',
                headers: true,
                caption: {
                    title: '意向客户错误信息导出',
                },
                column: { style: 'font-size:14px; text-align:center;' },
                //每一列表的变量和 后台所传来的变量对应
                columns: [{ columnid: 'errorReason', title: '错误原因', width: '150px' },
                { columnid: 'stuNameOrgin', title: '姓名(必填)' },
                { columnid: 'stuPhoneOrgin', title: ' 手机号(必填)' },
                { columnid: 'gradeOrgin', title: '年级(必填)' },
                { columnid: 'channelOrgin', title: '渠道来源(必填)' },
                { columnid: 'genderOrgin', title: '性别' },
                { columnid: 'ageOrgin', title: '年龄' },
                { columnid: 'intentionOrgin', title: '意向程度' },
                { columnid: 'schoolOrgin', title: '在读学校' },
                { columnid: 'relativeTypeOrgin', title: '亲属关系' },
                { columnid: 'moNameOrgin', title: '家长姓名' },
                { columnid: 'moPhoneOrgin', title: '家长手机号' }
                ],
                row: {
                    style: function (sheet, row, rowidx) {
                        return 'background:' + (rowidx % 2 ? '#E1FFFF' : '#F0E68C') + ';' + 'text-align:center;'
                    }
                },
                cells: {
                    style: 'font-size:13px; text-align:left;'
                }
            };
            //alasql 两个参数，一个是配置项，一个是所导出的数据集合,
            alasql('SELECT * INTO XLS("意向客户错误信息导出.xls", ?) FROM ?', [statisticsExportTableStyle, $scope.statisticsModelsAll]);
        }


        /* upload earlier*/

        $scope.showMoreLeadsInfo = function () {
            if ($scope.isAddLeadsInfo) {
                $scope.isAddLeadsInfo = false;
                /*$scope.isAddLeadsInfoBtn = true;*/
                $scope.leadsInfoBtnTitle = '填写更多信息';
            } else {
                $scope.isAddLeadsInfo = true;
                $scope.leadsInfoBtnTitle = '收起';
                /* $scope.isAddLeadsInfoBtn = false;*/
            }
        };
        $scope.hidetextchang = function () {
            $scope.leadsInfoBtnTitle = '填写更多信息';
        }
        $scope.includePath = "sos/leads/modal.smartImportLeads.html";
        $scope.checkedAddType = function (i) {
            if (i == 1) {
                $scope.isOneChecked = false;
                $scope.isBeachChecked = true;
                $scope.isSmartChecked = false;
            } else if (i == 0) {
                $scope.isBeachChecked = false;
                $scope.isOneChecked = true;
                $scope.isSmartChecked = false;
            } else if (i == 2) {
                $scope.isSmartChecked = true;
                $scope.isOneChecked = false;
                $scope.isBeachChecked = false;
            }
        };


        $scope.domain = "";
        if ($location.host().indexOf("localhost") != -1) {//返回大于等于0的整数值，若不包含"localhost"则返回"-1。);
            $scope.domain = "http://" + $location.host() + ":" + $location.port() + "/app";
        } else {
            $scope.domain = "http://" + $location.host();
        }


        //导入意向客户弹框
        $scope.showImportModal = function () {
            $scope.CrmLeadsStudentVoForCreate = {};
            $scope.CrmLeadsStudentVoForCreate.state_id_1 = 1;
            $scope.isAddLeadsInfo = false;
            $scope.isAddLeadsInfoBtn = true;
            //二级状态默认为未联系的下级showMoreLeadsInfo
            $scope.checkedAddType(0);
            $scope.isOneChecked = true;
            //解决录订单后 年级没有初始化的bug
            $scope.gradeIds = [];
            CommonService.getGradeIdSelect().then(function (result) {
                $scope.gradeIds = result.data;
            });
            $scope.mediaChannel2List = []
            $scope.mediaChannel3List = []
            $scope.modalTitleForImport = '新增意向客户';
            $scope.modalForImport = $modal({ scope: $scope, templateUrl: 'partials/sos/leads/modal.importLeads.html', show: true });
        }

        //上传导入信息
        var uploader = $scope.uploader = new FileUploader({
            url: config.endpoints.sos.LeadsStudent + '/importLeadsNew',
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
        };

        //添加一个文件
        uploader.onAfterAddingFile = function (fileItem) {
            //判断后缀
            var fileExtend = fileItem.file.name.substring(fileItem.file.name.lastIndexOf('.')).toLowerCase();
            if (fileExtend != '.xlsx') {
                // warningAlert('请选择后缀名为xlsx格式的excel模版文件');
                warningAlert('上传文档模板错误，请上传正确的《意向客户导入模板》');
                fileItem.remove();
                return false;
            }
        };

        //添加多个文件
        uploader.onAfterAddingAll = function (addedFileItems) {
        };

        uploader.onProgressItem = function (fileItem, progress) {
            $rootScope.ywsLoading = true;
        };


        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            if (response.status == 'SUCCESS') {
                SweetAlert.swal("数据总数:" + response.data.totalCount + ";成功条数:" + response.data.successCount + ";失败条数:" + response.data.failCount + ";电话重复:" + response.data.repeatPhone + ";格式错误:" + response.data.formatErrorCount);
                fileItem.remove();
                //刷新我的学生Leads列表
                if ($scope.myCrmLeadsStudentListTableState && $scope.myCrmLeadsStudentListTableState.pagination) {
                    $scope.myCrmLeadsStudentListTableState.pagination.start = 0;
                    $scope.getList($scope.myCrmLeadsStudentListTableState);
                }
                //刷新学校学生Leads列表
                if ($scope.isSchoolMaster() && $scope.schoolCrmLeadsStudentListTableState && $scope.schoolCrmLeadsStudentListTableState.pagination) {
                    $scope.schoolCrmLeadsStudentListTableState.pagination.start = 0;
                    $scope.getSchoolCrmLeadsStudentList($scope.schoolCrmLeadsStudentListTableState);
                }
            } else {
                SweetAlert.swal(response.data.msg);
                fileItem.remove();
            }
            $rootScope.ywsLoading = false;
        };




        /*******************************************************Leads导入end*******************************************************/
        $scope.genders = [{ value: false, name: "女" }, { value: true, name: "男" }];
        $scope.playAudio = function (src) {
            $scope.modalTitle = '播放';
            $scope.recordingPath = src;
            $scope.addOrderModal = $modal({ scope: $scope, templateUrl: 'partials/common/util/modal.play.html', show: true });

        };
        $scope.isList = true;
        $scope.isAdding = false;
        $scope.isDetail = false;
        $scope.isUpdate = false;
        $scope.isAllot = false;
        $scope.isBatchAllot = false;

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

        //判断当前用户是否为校区用户
        $scope.isSchoolUser = function () {
            if ($rootScope.showPermissions('PermissionForCallCenter')) {
                return true;
            }
            if (localStorageService.get('school_id') != null) {
                if (localStorageService.get('school_id') == 0) {//非校区岗位用户
                    if ($scope.isSelectedProduct == 1) {
                        $scope.isSelectedProduct = 2
                    }
                    return false;
                } else {
                    return true;
                }
            }

        }
        //判断当前用户是否为校长
        $scope.isSchoolMaster = function () {
            //console.log(localStorageService.get('position_id'));
            if (localStorageService.get('position_id') != Constants.PositionID.HEADMASTER
                && localStorageService.get('position_id') != Constants.PositionID.YSP_HEADMASTER
                && localStorageService.get('position_id') != Constants.PositionID.YSB_HEADMASTER
                && localStorageService.get('position_id') != Constants.PositionID.YSGJ_HEADMASTER
            ) {//不是校长
                return false;
            } else {
                return true;
            }
        }
        //判断当前用户是否为营销主管
        $scope.isMarketManager = function () {
            if (localStorageService.get('position_id') != Constants.PositionID.COURSE_CHIEF_OFFICER
                && localStorageService.get('position_id') != Constants.PositionID.YSGJ_STUDENT_CHIEF_OFFICER
            ) {//不是营销主管
                return false;
            } else {
                return true;
            }
        }
        //能否编辑和删除leads，只有所属人和总部呼叫主管可以
        $scope.canEditAndDelete = function (belong_user_id) {
            //console.log(belong_user_id);
            if (localStorageService.get('user') && localStorageService.get('user').id &&
                (localStorageService.get('user').id == belong_user_id
                    || (localStorageService.get('department_id') == Constants.DepartmentID.ZONGBU
                        && localStorageService.get('position_id') == Constants.PositionID.CALLCENTER_MASTER))) {
                return true;
            } else {
                return false;
            }
        }

        //是否总部呼叫主管，若果是则不能手动拨号和对Leads拨打电话
        $scope.isCallCenterMaster = function () {
            //console.log(localStorageService.get('department_id'));
            if (localStorageService.get('user') && localStorageService.get('user').id && localStorageService.get('department_id') == Constants.DepartmentID.ZONGBU
                && localStorageService.get('position_id') == Constants.PositionID.CALLCENTER_MASTER) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * 显示添加页面
         */
        $scope.showAddView = function () {
            //通话中不显示
            $rootScope.isCalling = false;
            $scope.isList = false;
            $scope.isAdding = true;
            $scope.isDetail = false;
            $scope.isUpdate = false;
            $scope.isAllot = false;
            $scope.isBatchAllot = false;

            //客户状态默认为未联系
            $scope.CrmLeadsStudentVoForCreate.state_id_1 = 1;
            //二级状态默认为未联系的下级
            $scope.state1Change();
        }

        /**
         * 显示详情页面
         */
        $scope.showDetailView = function (detail) {
            $scope.isList = true;
            $scope.isAdding = false;
            $scope.isDetail = false;
            $scope.isUpdate = false;
            $scope.isAllot = false;
            $scope.isBatchAllot = false;

            console.log(detail)
            $scope.viewCrmLeadsStudent(detail);
            $scope.detailForUpdate = {};

            $timeout(function () {
                var node1 = $("#calling");
                var content1 = '拨打操作后，您所绑定的座机会先响起；在您接起6-10秒后，会拨打客户的电话，请等待客户接听';
                node1.webuiPopover({ content: content1, trigger: 'hover', placement: 'bottom' });
            }, 1000);

        }

        /**
         * 显示列表页面
         */
        $scope.purposeLevel = [{ "name": "高", "value": 1 }, { "name": "中", "value": 2 }, { "name": "低", "value": 3 }, { "name": "未标记", "value": 4 }];
        $scope.sortType = [{ "name": "大于", "value": 1 }, { "name": "小于", "value": 2 }, { "name": "等于", "value": 3 }];
        $scope.showListView = function () {
            $scope.isList = true;
            //通话中不显示
            $rootScope.isCalling = false;
            $scope.isAdding = false;
            $scope.isDetail = false;
            $scope.isUpdate = false;
            $scope.isAllot = false;
            $scope.isBatchAllot = false;
            $scope.CrmLeadsStudentVoForCreate = {}; //创建学生线索对象
            //刷新我的学生Leads列表
            //$scope.myCrmLeadsStudentListTableState.pagination.start = 0;
            if ($location.url().indexOf('/leads_student_myself') != -1) {
                $scope.getList($scope.myCrmLeadsStudentListTableState);
            } if ($location.url().indexOf('/leads_student_receive') != -1) {
                $scope.getReceiveCrmLeadsStudentList($scope.receiveCrmLeadsStudentListTableState);
            } else {//刷新学校学生Leads列表
                //$scope.schoolCrmLeadsStudentListTableState.pagination.start = 0;
                $scope.getSchoolCrmLeadsStudentList($scope.schoolCrmLeadsStudentListTableState);
            }
            /*//刷新学校学生Leads列表
             if($scope.isSchoolMaster() && $location.url().indexOf('/leads_student_myself') == -1){
             //$scope.schoolCrmLeadsStudentListTableState.pagination.start = 0;
             $scope.getSchoolCrmLeadsStudentList($scope.schoolCrmLeadsStudentListTableState);
             }*/
        }




        $scope.CrmInvitationRemindVoForCreate = {};
        $scope.addInvitationRemind = addInvitationRemind;
        $scope.saveInvitationRemind = saveInvitationRemind;
        $scope.editInvitationRemind = editInvitationRemind;
        $scope.deleteInvitationRemind = deleteInvitationRemind;
        $scope.showSelect = showSelect;
        $scope.CrmInvitationCommunicationVoForCreate = {};
        $scope.addInvitationCommunication = addInvitationCommunication;
        $scope.saveInvitationCommunication = saveInvitationCommunication;
        $scope.editInvitationCommunication = editInvitationCommunication;
        $scope.deleteInvitationCommunication = deleteInvitationCommunication;

        $scope.CrmInvitationDetailVoForCreate = {};
        $scope.addInvitationDetail = addInvitationDetail;
        $scope.addInvitationDetailByList = addInvitationDetailByList;
        $scope.saveInvitationDetail = saveInvitationDetail;
        $scope.addrecevicheck = addrecevicheck;
        $scope.editInvitationDetail = editInvitationDetail;
        $scope.deleteInvitationDetail = deleteInvitationDetail;

        $scope.showRecordModal = showRecordModal;
        $scope.getTabIndex = getTabIndex;
        $scope.visit = visit;
        /* $scope.yesconsume = yesconsume;*/
        $scope.closeRecordModal = closeRecordModal;
        /* $scope.showEditCoursePlan = showEditCoursePlan;
         $scope.EditCoursePlanNow = EditCoursePlanNow;*/
        /* $scope.channleEdit = channleEdit;*/

        /**
         * 我的LeadsStudent列表
         */
        $scope.myCrmLeadsStudentFilter = {}; //本人CrmLeadsStudent过滤条件
        $scope.CrmLeadsStudentList = [];
        $scope.myCrmLeadsStudentListTableState = {};

        $scope.search = function search() {
            delete $scope.myCrmLeadsStudentFilter.orderType;
            delete $scope.myCrmLeadsStudentFilter.sortOrder;
            console.log($scope.myCrmLeadsStudentListTableState)
            if ($scope.myCrmLeadsStudentListTableState.pagination) {
                $scope.myCrmLeadsStudentListTableState.pagination.start = 0
                $scope.myCrmLeadsStudentListTableState.search.predicateObject.pageNum = 1
                $scope.myCrmLeadsStudentFilter.pageNum = 1
                $scope.getList($scope.myCrmLeadsStudentListTableState);
            } else {
                $scope.getList($scope.myCrmLeadsStudentListTableState)
            }
        }

        $scope.searchReset = searchReset
        function searchReset() {
            for (var key in $scope.myCrmLeadsStudentFilter) {
                if ($scope.myCrmLeadsStudentFilter.hasOwnProperty(key)) {
                    switch (key) {
                        default:
                            delete $scope.myCrmLeadsStudentFilter[key]
                            break;
                    }
                }
            }
            delete $scope.myCrmLeadsStudentFilter.orderType;
            delete $scope.myCrmLeadsStudentFilter.sortOrder;
            $scope.search();
            // $scope.getList($scope.myCrmLeadsStudentListTableState)
        }

        $scope.schoolSearchReset = function () {
            for (var key in $scope.schoolCrmLeadsStudentFilter) {
                if ($scope.schoolCrmLeadsStudentFilter.hasOwnProperty(key)) {
                    switch (key) {
                        default:
                            delete $scope.schoolCrmLeadsStudentFilter[key]
                            break;
                    }
                }
            }
            delete $scope.schoolCrmLeadsStudentFilter.orderType;
            delete $scope.schoolCrmLeadsStudentFilter.sortOrder;
            $scope.schoolsearch();
            // $scope.getSchoolCrmLeadsStudentList($scope.schoolCrmLeadsStudentListTableState)
        }


        $scope.search2 = function () {


            $scope.myCrmLeadsStudentFilter.pageNum = 1


            $scope.getList($scope.myCrmLeadsStudentListTableState)

        }
        //checkbox的函数添加数组
        $scope.endarr = []
        $scope.noxiaotag = false;
        $scope.noxiao = function noxiao(row) {
            if (row.selected) {
                $scope.endarr.push(row);
                $scope.noxiaotag = true;
            } else {
                $scope.endarr = $scope.endarr.filter(function (x) { return x.crm_student_id != row.crm_student_id });
            }
            if ($scope.endarr.length == 0) {
                $scope.noxiaotag = false;
            }
        }

        //全部无效
        $scope.allnoface = function allnoface() {
            if ($scope.noxiaotag) {
                SweetAlert.swal({
                    title: '确定批量标记无效吗？',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (config) {
                    if (config) {

                        LeadsStudentService.updateExceptionStatus($scope.endarr).then(function () {
                            $scope.getList($scope.myCrmLeadsStudentListTableState);
                            $scope.allselected = false;
                            $("#allCheckBox").attr("checked",false);
                        })
                    }
                })
            } else {
                SweetAlert.swal('您没有选择任何数据！')
            }


        }




        //获取数据列表
        $scope.getList = function callServer(tableState) {
            if (!tableState.pagination) {
                tableState.pagination = {};
                tableState.search = {};
                tableState.search = { predicateObject: {} };
            }
            $scope.myCrmLeadsStudentListTableState = tableState;

            if ($scope.myCrmLeadsStudentFilter.follow_up_at) {
                $scope.myCrmLeadsStudentFilter.followUpAt = $filter('date')($scope.myCrmLeadsStudentFilter.follow_up_at, 'yyyy-MM-dd');
            } else {
                $scope.myCrmLeadsStudentFilter.followUpAt = null;
            }
            if(typeof $scope.myCrmLeadsStudentFilter.createTime !='undefined' && $scope.myCrmLeadsStudentFilter.createTime){
                $scope.myCrmLeadsStudentFilter.create_at=$scope.myCrmLeadsStudentFilter.createTime;
            }
            if ($scope.myCrmLeadsStudentFilter.create_at) {
                $scope.myCrmLeadsStudentFilter.createAt = $filter('date')($scope.myCrmLeadsStudentFilter.create_at, 'yyyy-MM-dd');
            } else {
                $scope.myCrmLeadsStudentFilter.createAt = null;
            }

            if ($scope.isSelectedGraduation) {
                $scope.myCrmLeadsStudentFilter.isSelectedGraduation = $scope.isSelectedGraduation;
            }

            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            delete $scope.myCrmLeadsStudentFilter.isSelectedGraduation;
            LeadsStudentService.getMyStudentList(start, number, tableState, $scope.myCrmLeadsStudentFilter).then(function (result) {
                //console.dir(result.data);
                $scope.getAllSelected();
                $scope.CrmLeadsStudentList = result.data;

                $scope.myCrmLeadsStudentListTableState = tableState;

                console.log($scope.CrmLeadsStudentList)
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.myCrmLeadsStudentListTableState = tableState;
                if($scope.CrmLeadsStudentList!=null && $scope.CrmLeadsStudentList.length>0 ){
                    for(var i=0;i<$scope.CrmLeadsStudentList.length;i++){
                        $scope.CrmLeadsStudentList[i].crm_student_id=$scope.CrmLeadsStudentList[i].id;
                        $scope.CrmLeadsStudentList[i].id=null;
                    }
                }
                $scope.isLoading = false;

                setTimeout(function () {
                    // angular.element('#body').scroll()
                    initCol()
                    resatList()
                }, 100)

                if ($routeParams.dateTime && (Date.now() - $routeParams.dateTime < 1000 * 60)) {
                    if ($routeParams.v3 == 1) {
                        if (!$scope.modalForImport) {
                            $scope.showImportModal()
                        }
                    }
                }

            });
            //增加订单的 主从关系下拉列表
            var promise = OrderService.masterSlaveRelation();
            promise.then(function (result) {
                $scope.masterSlaveRelation = result;
            })

        };

        //选择列的功能

        //  TODO:选则列功能
        $scope._showCol = false
        $scope.showCol = showCol
        $scope.selectCol = selectCol
        $scope.$editColCss = ''
        $scope.$editColList1 = [
            {
                id: 1,
                name: '姓名',
                select: 1
            },
            {
                id: 2,
                name: '手机号',
                select: 1
            },
            {
                id: 3,
                name: '性别',
                select: 0
            },
            {
                id: 4,
                name: '年龄',
                select: 0
            },
            {
                id: 5,
                name: '异常',
                select: 0
            },
            {
                id: 6,
                name: '年级',
                select: 1
            },
            {
                id: 7,
                name: '状态',
                select: 1
            },
            {
                id: 8,
                name: '来源',
                select: 1
            },
            {
                id: 9,
                name: '意向程度',
                select: 1
            },
            {
                id: 10,
                name: '上次沟通',
                select: 0
            },
            {
                id: 11,
                name: '下次跟进',
                select: 0
            },
            {
                id: 12,
                name: '预计到访',
                select: 0
            },
            {
                id: 13,
                name: '在读学校',
                select: 0
            },
            {
                id: 14,
                name: '亲属关系',
                select: 0
            },
            {
                id: 15,
                name: '家长姓名',
                select: 0
            },
            {
                id: 16,
                name: '家长手机号',
                select: 0
            },
            {
                id: 17,
                name: '客户需求',
                select: 0
            },
            {
                id: 18,
                name: '创建时间',
                select: 0
            },
            {
                id: 19,
                name: '所属校区',
                select: 0
            },
            {
                id: 20,
                name: '所属人',
                select: 0
            }, {
                id: 21,
                name: '创建人',
                select: 0
            },
            {
                id: 22,
                name: '操作',
                select: 1
            },

        ]
        $scope.colListLength = $scope.$editColList1.length
        //  当前状态是否全选
        $scope.isAll = false
        //  将配置项保存到h5本地存储
        // localStorage.removeItem('$editColList1')
        if (localStorage['$editColList1'] == 'undefined' || !localStorage['$editColList1']) {
            localSave($scope.$editColList1)
        }
        // if (localStorage['$editColList1']=='undefined'||!localStorage['$editColList1']||JSON.stringify($scope.$editColList1)!=localStorage['$editColList1']) {
        //     localSave($scope.$editColList1)
        // }

        /**
         * 保存到本地
         * @param datas
         */
        function localSave(datas) {

            localStorage.setItem('$editColList1', JSON.stringify(datas))
        }

        function initCol() {
            $scope.lEditColList = JSON.parse(localStorage['$editColList1'])

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
                reastPosition();
            }
            $scope._showCol = arg;
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
            //
            function hideOrShow() {
                for (var i = 0; i < max; i++) {
                    if (isShow) {
                        //
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
            $scope.lEditColList = $scope.$editColList1

            console.log($scope.lEditColList)
            localSave($scope.lEditColList)
            initCol()
        }



        //为了选择列功能实现
        function resatList() {
            var ele = angular.element('#body').scroll()
        }

        /**
         * 学校LeadsStudent列表
         */

        $scope.schoolsearch = function () {
            delete $scope.schoolCrmLeadsStudentFilter.orderType;
            delete $scope.schoolCrmLeadsStudentFilter.sortOrder;
            if ($scope.schoolCrmLeadsStudentListTableState.pagination) {
                $scope.schoolCrmLeadsStudentListTableState.pagination.start = 0
                $scope.schoolCrmLeadsStudentListTableState.search.predicateObject.pageNum = 1
                $scope.schoolCrmLeadsStudentFilter.pageNum = 1
                $scope.getSchoolCrmLeadsStudentList($scope.schoolCrmLeadsStudentListTableState)
            } else {
                $scope.getSchoolCrmLeadsStudentList($scope.schoolCrmLeadsStudentListTableState)
            }

        }
        $scope.schoolsearch2 = function () {

            $scope.schoolCrmLeadsStudentFilter.pageNum = 1


            $scope.getSchoolCrmLeadsStudentList($scope.schoolCrmLeadsStudentListTableState)

        }

        $scope.schoolCrmLeadsStudentFilter = {}; //学校CrmLeadsStudent过滤条件
        $scope.schoolCrmLeadsStudentList = [];
        $scope.schoolCrmLeadsStudentListTableState = {};
        $scope.getSchoolCrmLeadsStudentList = function callServer(tableState) {
            initYouHua();
            //增加订单的 主从关系下拉列表
            var promise = OrderService.masterSlaveRelation();
            promise.then(function (result) {
                $scope.masterSlaveRelation = result;
            })

            if ($location.absUrl().indexOf("leads_student_allot") != -1) {//返回大于等于0的整数值，若不包含"leads_student_allot"则返回"-1。);
                if ($scope.isO2OOperationSpecialist()) {
                    //o2o运营专员查看已分配leads，以及渠道为o2o线上
                    $scope.schoolCrmLeadsStudentFilter.allot = 2;
                }
                else {
                    //网络营销部查看已分配leads，一级渠道为媒体
                    $scope.schoolCrmLeadsStudentFilter.allot = 1;
                }
            }
            //如果是呼叫权限的人，则查询所属机构下校区的数据，呼叫客信的数据
            if ($rootScope.showPermissions('PermissionForCallCenter')) {
                $scope.schoolCrmLeadsStudentFilter.media_channel_id_1 = 1;
                $scope.schoolCrmLeadsStudentFilter.mediaChannelId1=$scope.schoolCrmLeadsStudentFilter.media_channel_id_1;
                $scope.schoolCrmLeadsStudentFilter.media_channel_id_2 = 30;
                $scope.schoolCrmLeadsStudentFilter.mediaChannelId2=$scope.schoolCrmLeadsStudentFilter.media_channel_id_2;
                CommonService.getMediaChannel($scope.schoolCrmLeadsStudentFilter.media_channel_id_1).then(function (result) {
                    $scope.mediaChannel2ListForMyFilter = result.data;
                });
                //传递部门id
                $scope.schoolCrmLeadsStudentFilter.departmentId = localStorageService.get('department_id');
                $scope.schoolCrmLeadsStudentFilter.PermissionForCallCenter = '1';
                $scope.schoolCrmLeadsStudentFilter.allot = null;
            }
            //如果是营销主管
            if ($scope.isMarketManager()) {
                $scope.schoolCrmLeadsStudentFilter.isMarketManager = true;
            } else {
                $scope.schoolCrmLeadsStudentFilter.isMarketManager = false;
            }
            //查看【总部意向客户】，不是o2o就是网络营销部
            if (AuthenticationService.currentUser().department_id == Constants.DepartmentID.WANGLUOYINGXIAOBU) {
                $scope.schoolCrmLeadsStudentFilter.media_channel_id_1 = 4;
                $scope.schoolCrmLeadsStudentFilter.mediaChannelId1 = 4;

            }
            if ($scope.isO2OOperationSpecialist()) {
                $scope.schoolCrmLeadsStudentFilter.media_channel_id_1 = 8;
                $scope.schoolCrmLeadsStudentFilter.mediaChannelId1 = 8;

            }
            //console.dir($scope.schoolCrmLeadsStudentFilter);
            $scope.schoolCrmLeadsStudentListTableState = tableState;
            if ($scope.schoolCrmLeadsStudentFilter.follow_up_at) {
                $scope.schoolCrmLeadsStudentFilter.followUpAt = $filter('date')($scope.schoolCrmLeadsStudentFilter.follow_up_at, 'yyyy-MM-dd');;
            } else {
                $scope.schoolCrmLeadsStudentFilter.followUpAt = null;
            }
            if(typeof $scope.schoolCrmLeadsStudentFilter.createTime !='undefined' && $scope.schoolCrmLeadsStudentFilter.createTime){
                $scope.schoolCrmLeadsStudentFilter.create_at=$scope.schoolCrmLeadsStudentFilter.createTime;
            }
            if ($scope.schoolCrmLeadsStudentFilter.create_at) {
                $scope.schoolCrmLeadsStudentFilter.createAt = $filter('date')($scope.schoolCrmLeadsStudentFilter.create_at, 'yyyy-MM-dd');
            } else {
                $scope.schoolCrmLeadsStudentFilter.createAt = null;
            }
            if ($scope.isSelectedGraduation) {
                $scope.schoolCrmLeadsStudentFilter.isSelectedGraduation = $scope.isSelectedGraduation;
            }
            $scope.isSchoolLoading = true;
            tableState.pagination = tableState.pagination || {}
            var pagination = tableState.pagination || {};
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            delete $scope.schoolCrmLeadsStudentFilter.isSelectedGraduation;
            if($scope.isYouHua){
                LeadsStudentService.getSchoolLeadStudents(start, number, tableState, $scope.schoolCrmLeadsStudentFilter).then(function (result) {
                    //console.dir(result.data);
                    $scope.getAllSelected();

                    $scope.schoolCrmLeadsStudentList = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.schoolCrmLeadsStudentListTableState = tableState;
                    $scope.myCrmLeadsStudentListTableState = tableState;
                    if($scope.schoolCrmLeadsStudentList!=null && $scope.schoolCrmLeadsStudentList.length>0 ){
                        for(var i=0;i<$scope.schoolCrmLeadsStudentList.length;i++){
                            $scope.schoolCrmLeadsStudentList[i].crm_student_id=$scope.schoolCrmLeadsStudentList[i].id;
                            $scope.schoolCrmLeadsStudentList[i].id=null;
                        }
                    }
                    $scope.isSchoolLoading = false;

                    setTimeout(function () {
                        // angular.element('#body').scroll()
                        initCol()
                        resatList()
                    }, 100)
                });
            }else{
                LeadsStudentService.schoolList(start, number, tableState, $scope.schoolCrmLeadsStudentFilter).then(function (result) {
                    //console.dir(result.data);
                    $scope.getAllSelected();

                    $scope.schoolCrmLeadsStudentList = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.schoolCrmLeadsStudentListTableState = tableState;
                    $scope.isSchoolLoading = false;
                    setTimeout(function () {
                        // angular.element('#body').scroll()
                        initCol()
                        resatList()
                    }, 100)
                });
            }

        };

        /**
         * 领取LeadsStudent列表
         */
        $scope.receiveCrmLeadsStudentFilter = {}; //领取CrmLeadsStudent过滤条件
        $scope.reveiveCrmLeadsStudentList = [];
        $scope.receiveCrmLeadsStudentListTableState = {};
        $scope.getReceiveCrmLeadsStudentList = function callServer(tableState) {
            $scope.receiveCrmLeadsStudentListTableState = tableState;
            if ($scope.receiveCrmLeadsStudentFilter.create_at) {
                $scope.receiveCrmLeadsStudentFilter.createAt = $filter('date')($scope.receiveCrmLeadsStudentFilter.create_at, 'yyyy-MM-dd');
            } else {
                $scope.receiveCrmLeadsStudentFilter.createAt = null;
            }
            $scope.isSchoolLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            CommonService.getMediaChannel(0).then(function (result) {
                $scope.mediaChannel1List = result.data;
            });
            OrderService.getSubjectIdSelect().then(function (result) {
                $scope.subjectIds = result.data;
            });
            $scope.receiveCrmLeadsStudentFilter.pageNum = start;
            if ($scope.receiveCrmLeadsStudentFilter.pageNum === 0) {
                $scope.receiveCrmLeadsStudentFilter.pageNum = 1;
            }
            if ($scope.isO2OOperationSpecialist()) {
                $scope.receiveCrmLeadsStudentFilter.isO2O = true;
            }
            $scope.receiveCrmLeadsStudentFilter.pageSize = number;
            LeadsStudentService.receiveList($scope.receiveCrmLeadsStudentFilter).then(function (result) {
                $scope.receiveCrmLeadsStudentList = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.receiveCrmLeadsStudentListTableState = tableState;
                $scope.isSchoolLoading = false;
            });
        };

        /**
         * 提醒列表
         */
        $scope.CrmLeadsStudentRemindList = [];
        $scope.getRemindList = function callServer(tableState) {
            if ($scope.detail) {
                tableState.search.predicateObject = {};
                tableState.search.predicateObject.dataStudentDetailId = $scope.detail.crm_student_id;
                $scope.myCrmLeadsStudentRemindListTableState = tableState;
                //console.dir(tableState);
                $scope.isRemindLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                InvitationRemindService.list(start, number, tableState, $scope.myCrmLeadsStudentFilter).then(function (result) {
                    //console.dir(result.data);
                    //$scope.getAllSelected();
                    $scope.CrmLeadsStudentRemindList = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isRemindLoading = false;
                });
            }
        };

        /**
         * 沟通列表
         */
        $scope.CrmLeadsStudentCommunicationList = [];
        $scope.getCommunicationList = function callServer(tableState) {
            if ($scope.detail) {
                tableState.search.predicateObject = {};
                tableState.search.predicateObject.dataStudentDetailId = $scope.detail.crm_student_id;
                $scope.myCrmLeadsStudentCommunicationListTableState = tableState;
                //console.dir(tableState);
                $scope.isCommunicationLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                InvitationCommunicationService.list(start, number, tableState, $scope.myCrmLeadsStudentFilter).then(function (result) {
                    //console.dir(result.data);
                    //$scope.getAllSelected();
                    $scope.CrmLeadsStudentCommunicationList = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isCommunicationLoading = false;
                });
            }
        };

        /**
         * 邀约列表
         */
        $scope.CrmLeadsStudentInvitationList = [];
        $scope.getInvitationList = function callServer(tableState) {
            if ($scope.detail) {
                tableState.search.predicateObject = {};
                tableState.search.predicateObject.dataStudentDetailId = $scope.detail.crm_student_id;
                $scope.myCrmLeadsStudentInvitationListTableState = tableState;
                //console.dir(tableState);
                $scope.isInvitationLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                InvitationDetailService.viewlist(start, number, tableState, $scope.myCrmLeadsStudentFilter).then(function (result) {
                    //console.dir(result.data);
                    //$scope.getAllSelected();
                    $scope.CrmLeadsStudentInvitationList = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isInvitationLoading = false;
                });
            }
        };

        /**
         * LeadsStudent详情
         */
        $scope.viewCrmLeadsStudent = function (detail) {
            $scope.isDetail = false;
            $scope.isList = true;
            $scope.isAdding = false;
            $scope.isUpdate = false;
            $scope.isBatchAllot = false;

            console.log(detail)
            /* $rootScope.isCalling=false;*/
            //console.dir(detail);
            LeadsStudentService.detail(detail).then(function (result) {
                $scope.detail = result;

                console.log($scope.detail)
                //console.dir($scope.detail);
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
                $scope.detail.purposeLevel = $scope.detail.purposeLevel.toString()
                // $scope.detail.gender = $scope.detail.gender?'1':'0'
                if ($routeParams.v3) {
                    angular.element('#isDetail').removeClass('ng-hide')
                    angular.element('#isList').addClass('ng-hide')
                }

            })

            $scope.detail = angular.copy(detail);

            console.log($scope.detail)
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
        $scope.curDate = new Date();
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

        $scope.one = true;
        $scope.two = false;
        $scope.oneflag = true;
        $scope.twoflag = false;
        $scope.onclicktabone = function onclicktabone() {
            $scope.one = true;
            $scope.two = false;
            $scope.oneflag = true;
            $scope.twoflag = false;
            $scope.yaoyuefang = true;
            $scope.twozhifang = false;
            $scope.CrmInvitationDetailVoForCreate.state = 0;
        }

        $scope.onclicktabtwo = function onclicktabtwo() {
            $scope.one = false;
            $scope.two = true;
            $scope.oneflag = false;
            $scope.twoflag = true;
            $scope.yaoyuefang = false;
            $scope.twozhifang = true;
            $scope.CrmInvitationDetailVoForCreate.state = 1;
        }

        $scope.getDetail = function (detail, flag) {
            //查看详情 查看更多
            $scope.detailnew = detail;
            console.log(detail.gender)
            $scope.apprealaifang = false;
            $scope.chakangengduotag = false;
            $scope.chakangengduo = '展开更多信息'
            $scope._flag_ = flag
            $scope.__detail = angular.copy(detail)
            /*学员详情开始========================================================*/
            $scope.stuTabs = StuDetail.init($scope)
            $scope.mtSrc = 'partials/stu.detail/main/index.html?v=1.0'
            $mtModal.moreModalHtml({
                scope: $scope, width: '1100px', hasNext: function () {
                    var _obj = $scope.stuTabs.find(function (stu) {
                        return stu.title == '记录管理' && stu.select
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
                            $scope.updateLeadsStudent(1)
                    })
                }
            })
            /*学员详情结束========================================================*/
            _detail(detail)
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
        $scope.nowday = new Date().Format("yyyy-MM-dd hh:mm:ss")
        $scope.flag = false;
        $scope.zhifanghide = true;
        $scope.isLock = isLock
        $scope._detail_ = _detail
        $scope.twozhifang = false;
        $scope._detail = _detail;
        function _detail(detail, type) {
            $scope.laifangtabhide = true;
            $scope.perfectTime = detail.receiveTime

            $scope.detail = angular.copy(detail)
            LeadsStudentService.detail(detail).then(function (result) {
                $scope.detailForUpdate = result;
                for (var i = 0; i < $scope.detailForUpdate.growthList.length; i++) {
                    if ($scope.detailForUpdate.growthList[i].type == 2) {
                        if ($scope.detailForUpdate.growthList[i].visit_state == 0) {
                            $scope.arrrepeat = $scope.detailForUpdate.growthList[i]

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

                if (type == 12) {
                    $scope.detailForUpdate.purposeLevel = detail.purpose_level;
                    $scope.updateLeadsStudent()
                }

            })
            //    以上2结束

        }




        var _setReadonlyPropo = function () {
            var birthList = angular.element('.modal-body').find('[name="birthDate"]'),
                birthDate = angular.element('.modal-body').find('[name="birthDate"]').val(),
                followList = angular.element('.modal-body').find('[name="followUpAt"]'),
                followUpAt = angular.element('.modal-body').find('[name="followUpAt"]').val()
            /*if(birthList.length>1){
             for(var i = 0 , len = birthList.length ; i< len ; i++){
             if(birthList[i].value){
             birthDate = birthList[i].value
             }
             if(followList[i]&&followList[i].value){
             followUpAt = followList[i].value
             }
             }
             }*/
            $scope._birthDate = birthDate
            $scope._followUpAt = followUpAt
            $scope.detailForUpdate.birthDate = new Date(birthDate)
        }
        /***********************************************排课消课列表************************************************/
        /**
         * 未消课列表
         */
        $scope.callServer1 = function callServer1(tableState) {

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
                    $scope.displayed = result.data;

                    $scope.displayed1 = result.data;
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

        /* *//**
         * 已消课列表
         *//*
$scope.callServerrecord = function callServerrecord(tableState) {
if($scope.detail) {
tableState.search.predicateObject = {};
tableState.search.predicateObject.crm_student_id = $scope.detail.crm_student_id;
$scope.isrendLoading = true;

$scope.myCoursePlanRecordTableState = tableState;

var pagination = tableState.pagination;
var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
var number = pagination.number || 10;  // Number of entries showed per page.
CoursePlanService.StudentRecordList(start, number, tableState).then(function (result) {
$scope.displayedrecord = result.data;
tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
$scope.isrendLoading = false;
});
}
};*/




        /**
         * 显示不满意弹窗
         */
        $scope.addUnsatisfied = function (omsCoursePlan, isPast) {
            //console.log('Starting creating new unsatisfied.');
            $scope.OmsCoursePlanVoForCreate = {};
            $scope.OmsCoursePlanVoForCreate.id = omsCoursePlan.id;
            $scope.OmsCoursePlanVoForCreate.isPast = isPast;
            $scope.OmsCoursePlanVoForCreate.crmStudentId = omsCoursePlan.crmStudentId;
            showModal();
        }

        /**
         * 不满意弹窗
         */
        /* function showModal() {
         $scope.modalTitle = '不满意取消消课';
         $scope.modalCoursePlan = $modal({scope: $scope, templateUrl: 'partials/o2o/coursePlan/modal.record.html', show: true});
         }


         $scope.saveUnsatisfied = function () {
         // console.log('Saving the unsatisfied.');

         var promise = CoursePlanService.consume($scope.OmsCoursePlanVoForCreate);
         promise.then(function(OmsCoursePlanVoForCreate) {
         $scope.dataLoading = false;
         $scope.modalCoursePlan.hide();
         var tableState ={'pagination':{},'search':{'predicateObject':{}}};
         $scope.callServer(tableState);//未消课列表
         //$scope.callServerrecord(tableState);//已消课列表
         }, function(error) {
         $scope.dataLoading = false;
         });
         }*/

        /**
         * Delete InvitationCommunication.
         * @param InvitationCommunication the InvitationCommunication to delete
         */
        /*$scope.removeCoursePlan = function(omsCoursePlan) {
         //console.log('Deleting InvitationCommunication : ' + JSON.stringify(OmsCoursePlan));
         SweetAlert.swal({
         title: "确定要删除吗？",
         type: "warning",
         showCancelButton: true,
         confirmButtonColor: ' #fe9900 ',
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         closeOnConfirm: true
         }, function(confirm) {
         if (confirm) {
         var promise = CoursePlanService.remove(omsCoursePlan);
         //$rootScope.showLoading();
         promise.then(function() {
         var tableState ={'pagination':{},'search':{'predicateObject':{}}};
         $scope.callServer(tableState);//未消课列表
         //$scope.callServerrecord(tableState);//已消课列表
         }, function(error) {
         //$rootScope.hideLoading();
         });



         }
         }
         );
         }*/

        /***********************************************排课消课列表************************************************/



        /**
         * LeadsStudent编辑页面
         */
        $scope.trueOrFalse = [{ "value": true, "name": "是" }, { "value": false, "name": "否" }];
        $scope.editCrmLeadsStudent = function (detail) {
            $scope.isDetail = false;
            $scope.isList = false;
            $scope.isAdding = false;
            $scope.isUpdate = true;
            _detail(detail)
            /*LeadsStudentService.detail(detail).then(function(result){
             //console.dir(result);
             $scope.detailForUpdate = result;
             if($scope.detailForUpdate.followUpAt){
             $scope.detailForUpdate.followUpAt = new Date($scope.detailForUpdate.followUpAt).Format("yyyy-MM-dd hh:mm:ss");
             }
             //刷新列表
             /!*$scope.myCrmLeadsStudentListTableState.pagination.start = 0;
             $scope.getList($scope.myCrmLeadsStudentListTableState);*!/
             if(result.province_code){
             CommonService.getCitySelect(result.province_code).then(function (result) {
             $scope.cityList = result.data;
             });
             }
             if(result.city_code){
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

             })*/
        }

        $scope.editlevel = function (detail) {
            detail.purpose_level=detail.purposeLevel
            _detail(detail, 12);
        }
        /**
         * 更新学生线索
         */
        $scope.updateschool = function () {
            $scope.schoolsearch();
        }

        $scope.updatestudent = function () {
            $scope.search2()
        }
        $scope.updateLeadsStudent = updateLeadsStudent;
        //$scope.CrmLeadsStudentVoForUpdate = {}; //创建学生线索对象
        function updateLeadsStudent(arg) {

            if ($scope.detailForUpdate.followUpAt) {
                $scope.detailForUpdate.followUpAt = new Date($scope.detailForUpdate.followUpAt);
            }
            if (!arg) {
                _setReadonlyPropo()
            }
            var promise = LeadsStudentService.update($scope.detailForUpdate);
            promise.then(function (data) {
                if (data.status == 'FAILURE') {
                    if (typeof data.data == 'string') {
                        SweetAlert.swal(data.data);
                    } else {
                        //console.log(data);
                        //SweetAlert.swal(data.data.repeateMsg);
                        $scope.repeateData = data.data;
                        $scope.modalForRepeatTitle = '电话号码重复';
                        $scope.modalForRepeat = $modal({ scope: $scope, templateUrl: 'partials/sos/leads/modal.repeate.html', show: true });
                    }
                    return false;
                }
                //$scope.detailForUpdate = {};
                //显示列表页
                //$scope.showListView();
                //显示详情页
                if (arg) {
                    $scope.detail = angular.copy($scope.detailForUpdate)
                    successAlert('更新成功')
                    $scope.detailForUpdate.birthDate = $scope._birthDate
                    $scope.detailForUpdate.followUpAt = $scope._followUpAt
                    $scope.getList($scope.myCrmLeadsStudentListTableState)
                }
                else {

                    $scope.showDetailView($scope.detailForUpdate);

                }
            }, function (error) {
                warningAlert("更新Leads失败");
            });
        }

        $http
            .get(hr_server + "departments/queryById?departmentId=" + localStorageService.get("school_id") + "&organizationId=1")
            .success(function (response) {
                if (response.status == "SUCCESS") {
                    // console.log(response);
                    $scope.isUseEContract = response.data.isUseEContract;
                }
            });

        $scope.addCrmLeadsStudentOrderTopup = function (row) {

            var obj = { 'crmStudentId': row.crm_student_id, 'name': row.name, 'accountBalance': row.accountBalance, 'consumeAccountBalance': 0, 'gradeId': row.grade_id };
            $scope.order = angular.copy(obj);
            $scope.modalTitle = '添加';
            $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/sos/order/addTopup.html', show: true });
            $scope.callServerOrderCourseSelect();
        }

        /**
         * LeadsStudent添加订单
         */
        $scope.addCrmLeadsStudentOrder = function (row) {
            console.log(row);
            sessionStorage.setItem("orderJudgeEntrance", 'addOrder');
            var obj = { 'crmStudentId': row.crm_student_id, 'name': row.name, 'accountBalance': row.accountBalance,'membershipLevel': row.membershipLevel,'stuState': 2, 'consumeAccountBalance': 0, 'gradeId': row.grade_id };
            $scope.order = angular.copy(obj);
            $scope.modalTitle = '添加';
            $scope.orderOperating = 4;
            // $scope.modal = $modal({ scope: $scope, templateUrl: mtModal.add, show: true });
            $scope.orderModalV2 = $modal({ scope: $scope, templateUrl: mtModal.addV2, show: true });
            $scope.callServerOrderCourseSelect();
        }


        $scope.addCrmLeadsStudentOrderTopup = function (row) {
            var obj = { 'crmStudentId': row.crm_student_id, 'name': row.name, 'accountBalance': row.accountBalance, 'gradeId': row.grade_id };
            $scope.order = angular.copy(obj);
            $scope.modalTitle = '添加';
            $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/sos/order/addTopup.html', show: true });
            $scope.callServerOrderCourseSelect();
        }

        var modalObj = {
            status: 1,
            text: '',
            scope: $scope,
            /*refresh:function(){

             $scope.showListView();
             }*///提示学员有关联订单时扔调用
        }

        /**
         * LeadsStudent删除
         */
        $scope.deleteCrmLeadsStudent = function (detail) {
            //console.dir(detail);
            $mtModal.moreModal({
                scope: $scope,
                status: 0, //状态参数1:成功，0：失败;
                text: '确定要删除吗?',    //提示内容,默认为'操作成功';
                hasNext: function () {
                    LeadsStudentService.getOrderInfoByLeadsId(detail.crm_student_id).then(function (result) {
                        var flag = result;
                        // 有订单不能删除leads
                        if (flag) {
                            modalObj.text = '客户已经存在订单信息，无法删除。系统不执行删除操作。';
                            $mtModal.moreModal(modalObj);
                        } else {
                            LeadsStudentService.remove(detail).then(function (result) {
                                modalObj.text = '操作成功';
                                $mtModal.moreModal(modalObj)
                                $scope.showListView();
                            });
                        }
                    });
                },

            })
        }

        /**
         * 创建学生线索
         */
        $scope.CrmLeadsStudentVoForCreate = {}; //创建学生线索对象
        $scope.createLeadsStudent = function createLeadsStudent() {

            var promise = LeadsStudentService.create($scope.CrmLeadsStudentVoForCreate);
            promise.then(function (data) {
                // $scope.getList($scope.myCrmLeadsStudentListTableState)
                $scope.search2();
                $scope.schoolsearch2()
                if (data.status == 'FAILURE') {
                    if (typeof data.data == 'string') {
                        SweetAlert.swal(data.data);
                    } else {
                        //console.log(data);
                        //SweetAlert.swal(data.data.repeateMsg);
                        $scope.repeateData = data.data;
                        $scope.modalForRepeatTitle = '电话号码重复';

                        $scope.modalForRepeat = $modal({ scope: $scope, templateUrl: 'partials/sos/leads/modal.repeate.html', show: true });
                    }

                    return false;
                }
                $scope.mediaChannel2List = [];
                $scope.CrmLeadsStudentVoForCreate = {};
                //刷新列表页
                $scope.showListView();

                //跳到详情页
                if (data.data.id) {

                    $scope.search()

                    // $scope.hide();
                } else {
                    warningAlert("创建Leads失败");
                }
            }, function (error) {
                warningAlert("创建Leads失败");
            });

        };

        /**
         * 保存外呼号码
         */
        $scope.saveOutboundPhone = function saveOutboundPhone() {
            //$scope.employee.userId = $rootScope.currentUser.userId;
            //$scope.employee.id = $scope.employeeId;
            //$employee.p = $employee.outboundphone;
            var promise = EmployeeService.saveOutboundphone($scope.employee,$scope.employeeId);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
					localStorageService.set('outboundphone', $scope.employee.outboundphone);
                    SweetAlert.swal(response.data);
					window.location.reload();
                }
            });

        };

        /**
         * 删除外呼号码
         */
        $scope.delOutboundPhone = function delOutboundPhone() {
            //$scope.employee.id = $scope.employeeId;
            var promise = EmployeeService.delOutboundphone($scope.employee,$scope.employeeId);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    SweetAlert.swal(response.data);
                }
            });

        };

        /**
         * 保存通话记录
         */
        $scope.saveCallRecord = function saveCallRecord(crmStudentCallRecord) {
            var promise = LeadsStudentService.saveCallRecord(crmStudentCallRecord);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    SweetAlert.swal(response.data);
                }
            });

        };

        /**
         * 保存通话记录
         */
        $scope.callWaihuPhone = function callWaihuPhone(phone,crmStudentId) {
            //var phone = $scope.callWaihuStuPhone;
            //打电话
            var promise = LeadsStudentService.callLeadStu(phone,crmStudentId);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    SweetAlert.swal(response.data);
                }
            });

        };


        /**
         * 检查电话是否重复
         */
        $scope.repeatFroCreate = function (phone) {

            if (!phone) {
                return;
            }
            if (phone.toString().length < 7) {
                return;
            }
            var phoneVo = { "phone": phone };
            // if($scope.detailForUpdate && $scope.detailForUpdate.crm_student_id){
            //     phoneVo.id = $scope.detailForUpdate.crm_student_id;
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
                        $scope.modalForRepeatHide();
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

        $scope.modalForRepeatHide = function () {
            // $scope.modalForRepeat.hide();
            if ($scope.CrmLeadsStudentVoForCreate != undefined) {
                $scope.CrmLeadsStudentVoForCreate.phone = null;
                $scope.CrmLeadsStudentVoForCreate.mother_phone = null;
                $scope.CrmLeadsStudentVoForCreate.father_phone = null;
            }
            if ($scope.detailForUpdate != undefined) {
                $scope.detailForUpdate.phone = null;
                $scope.detailForUpdate.mother_phone = null;
                $scope.detailForUpdate.father_phone = null;
            }
        }

        /**
         * 获取年级、科目、省、一级客户状态、一级渠道来源下拉菜单
         */
        $scope.subjectIds = [];
        $scope.gradeIds = [];
        $scope.courseTypeIds = [];
        /*<!--<td ng-if="row.exception_status ==1 || !row.exception_status">无异常</td>
         <td ng-if="row.exception_status ==2" >已经报名</td>
         <td ng-if="row.exception_status ==3" >别再骚扰</td>
         <td ng-if="row.exception_status ==4" >出国</td>
         <td ng-if="row.exception_status ==5" >不念了</td>-->*/
        $scope.exceptionIds = [
            { id: 1, name: '无异常' },
            { id: 2, name: '已经报名' },
            { id: 3, name: '要求别打' },
            { id: 4, name: '出国' },
            { id: 5, name: '不念了' },
            { id: 6, name: '不在本地' }
        ]
        $scope.LEADS_PROPERTYS = [
            { id: 1, name: '陌拜' }
            , { id: 2, name: '重点跟踪' }
        ]

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
                $scope.mediaChannel1ListCopy = angular.copy(result.data);
                if ($scope.isO2OOperationSpecialist()) {
                    //如果是o2o运营专员，则限定一级渠道
                    angular.forEach($scope.mediaChannel1ListCopy, function (p, index) {
                        if (p.name == "线上O2O") {
                            var temp = [];
                            temp.push(p);
                            $scope.mediaChannel1List = temp;
                            $scope.schoolCrmLeadsStudentFilter.media_channel_id_1 = p.id;
                            $scope.allotCrmLeadsStudentFilter.media_channel_id_1 = p.id;
                            $scope.allotCrmLeadsStudentFilter4.media_channel_id_1 = p.id;
                            $scope.mediaChannel1ChangeForAllot();
                            $scope.mediaChannel1ChangeForAllot4();
                            $scope.mediaChannel1ChangeForFilter();
                            return;
                        }
                    });
                }
            });
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
         * 地区三级级联
         * @type {Array}
         */
        $scope.provinceList = [];
        $scope.cityList = [];
        $scope.areaList = [];
        $scope.provinceChange = function () {
            //console.dir($scope.CrmLeadsStudentVoForCreate);
            if ($scope.CrmLeadsStudentVoForCreate.province_code) {
                CommonService.getCitySelect($scope.CrmLeadsStudentVoForCreate.province_code).then(function (result) {
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
        $scope.provinceChangeForBatchAllot = function () {
            //console.dir($scope.detailForUpdate);
            if ($scope.schoolMasterFilter.province_code) {
                CommonService.getCitySelect($scope.schoolMasterFilter.province_code).then(function (result) {
                    $scope.cityList = result.data;
                });
            } else {
                $scope.cityList = [];
            }
            $scope.SchoolMasterListOk = [];
            $scope.selectAllSchoolFlag = false;
        }
        $scope.cityChange = function () {
            //console.dir($scope.CrmLeadsStudentVoForCreate);
            if ($scope.CrmLeadsStudentVoForCreate.city_code) {
                CommonService.getAreaSelect($scope.CrmLeadsStudentVoForCreate.city_code).then(function (result) {
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
        $scope.cityChangeForBatchAllot = function () {
            //console.dir($scope.detailForUpdate);
            if ($scope.schoolMasterFilter.city_code) {
                CommonService.getAreaSelect($scope.schoolMasterFilter.city_code).then(function (result) {
                    $scope.areaList = result.data;
                });
            } else {
                $scope.areaList = [];
            }
            $scope.SchoolMasterListOk = [];
            $scope.selectAllSchoolFlag = false;
        }

        $scope.areaChangeClear = function () {

            $scope.SchoolMasterListOk = [];
            $scope.selectAllSchoolFlag = false;
        };
        $scope.posisionChangeClear = function () {

            /* $scope.EmpListOk = [];*/
            $scope.selectAllFlag = false;
        };

        /**
         * 状态二级级联
         * @type {Array}
         */
        $scope.state1List = [];
        $scope.state2List = [];
        $scope.state1Change = function () {
            if ($scope.CrmLeadsStudentVoForCreate.state_id_1) {
                CommonService.getState($scope.CrmLeadsStudentVoForCreate.state_id_1).then(function (result) {
                    $scope.state2List = result.data;
                });
            } else {
                $scope.state2List = [];
            }
        }
        $scope.state1ChangeForFilter = function () {
            //alert($scope.myCrmLeadsStudentFilter.state1_id);
            if ($scope.myCrmLeadsStudentFilter.state_id_1) {
                CommonService.getState($scope.myCrmLeadsStudentFilter.state_id_1).then(function (result) {
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
            $scope.CrmLeadsStudentVoForCreate.media_channel_id_2 = ''
            $scope.CrmLeadsStudentVoForCreate.media_channel_id_3 = ''
            $scope.mediaChannel3List = []
            if ($scope.CrmLeadsStudentVoForCreate.media_channel_id_1) {
                CommonService.getMediaChannel($scope.CrmLeadsStudentVoForCreate.media_channel_id_1).then(function (result) {
                    //console.dir(result.data);
                    $scope.mediaChannel2List = result.data;
                    // $scope.CrmLeadsStudentVoForCreate.media_channel_id_2 = null;
                });
            } else {
                $scope.mediaChannel2List = [];
                // $scope.CrmLeadsStudentVoForCreate.media_channel_id_2 = null;
            }
        }
        $scope.mediaChannel1ChangeForFilter = function () {
            //我的意向客户
            if(typeof $scope.myCrmLeadsStudentFilter.mediaChannelId1!='undefined' && $scope.myCrmLeadsStudentFilter.mediaChannelId1){
                $scope.myCrmLeadsStudentFilter.media_channel_id_1=$scope.myCrmLeadsStudentFilter.mediaChannelId1;
            }
            if ($scope.myCrmLeadsStudentFilter.media_channel_id_1) {
                CommonService.getMediaChannel($scope.myCrmLeadsStudentFilter.media_channel_id_1).then(function (result) {
                    $scope.mediaChannel2ListForMyFilter = result.data;
                });
            } else {
                $scope.mediaChannel2ListForMyFilter = [];
            }
            //校区意向客户/总部意向客户/已分配意向客户
            if(typeof $scope.schoolCrmLeadsStudentFilter.mediaChannelId1!='undefined' && $scope.schoolCrmLeadsStudentFilter.mediaChannelId1){
                $scope.schoolCrmLeadsStudentFilter.media_channel_id_1=$scope.schoolCrmLeadsStudentFilter.mediaChannelId1;
            }
            if ($scope.schoolCrmLeadsStudentFilter.media_channel_id_1) {
                CommonService.getMediaChannel($scope.schoolCrmLeadsStudentFilter.media_channel_id_1).then(function (result) {
                    $scope.mediaChannel2ListForMyFilter = result.data;
                });
            } else {
                $scope.mediaChannel2ListForMyFilter = [];
            }
            //领取意向客户
            if ($scope.receiveCrmLeadsStudentFilter.media_channel_id_1) {
                CommonService.getMediaChannel($scope.receiveCrmLeadsStudentFilter.media_channel_id_1).then(function (result) {
                    $scope.mediaChannel2ListForMyFilter = result.data;
                });
            } else {
                $scope.mediaChannel2ListForMyFilter = [];
            }
        }
        // 渠道详情
        $scope.mediaChannel2ChangeForFilter = function () {
            //我的意向客户
            if(typeof $scope.myCrmLeadsStudentFilter.mediaChannelId2!='undefined' && $scope.myCrmLeadsStudentFilter.mediaChannelId2){
                $scope.myCrmLeadsStudentFilter.media_channel_id_2=$scope.myCrmLeadsStudentFilter.mediaChannelId2;
            }
            if ($scope.myCrmLeadsStudentFilter.media_channel_id_2) {
                CommonService.getMediaChannel($scope.myCrmLeadsStudentFilter.media_channel_id_2).then(function (result) {
                    $scope.mediaChannel3ListForMyFilter = result.data;
                });
            } else {
                $scope.mediaChannel3ListForMyFilter = [];
            }
            //校区意向客户/总部意向客户/已分配意向客户
            if(typeof $scope.schoolCrmLeadsStudentFilter.mediaChannelId2!='undefined' && $scope.schoolCrmLeadsStudentFilter.mediaChannelId2){
                $scope.schoolCrmLeadsStudentFilter.media_channel_id_2=$scope.schoolCrmLeadsStudentFilter.mediaChannelId2;
            }
            if ($scope.schoolCrmLeadsStudentFilter.media_channel_id_2) {
                CommonService.getMediaChannel($scope.schoolCrmLeadsStudentFilter.media_channel_id_2).then(function (result) {
                    $scope.mediaChannel3ListForMyFilter = result.data;
                });
            } else {
                $scope.mediaChannel3ListForMyFilter = [];
            }
            //领取意向客户
            if ($scope.receiveCrmLeadsStudentFilter.media_channel_id_2) {
                CommonService.getMediaChannel($scope.receiveCrmLeadsStudentFilter.media_channel_id_2).then(function (result) {
                    $scope.mediaChannel3ListForMyFilter = result.data;
                });
            } else {
                $scope.mediaChannel3ListForMyFilter = [];
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
            if ($scope.allotCrmLeadsStudentFilter.media_channel_id_1) {
                CommonService.getMediaChannel($scope.allotCrmLeadsStudentFilter.media_channel_id_1).then(function (result) {
                    $scope.mediaChannel2ListForMyAllot = result.data;
                });
            } else {
                $scope.mediaChannel2ListForMyAllot = [];
            }
        }
        $scope.mediaChannel2ChangeForAllot = function () {
            if ($scope.allotCrmLeadsStudentFilter.media_channel_id_2) {
                CommonService.getMediaChannel($scope.allotCrmLeadsStudentFilter.media_channel_id_2).then(function (result) {
                    $scope.mediaChannel3ListForMyAllot = result.data;
                });
            } else {
                $scope.mediaChannel3ListForMyAllot = [];
            }
        }
        ;
        $scope.mediaChannel2Change = function () {
            $scope.CrmLeadsStudentVoForCreate.media_channel_id_3 = ''
            if ($scope.CrmLeadsStudentVoForCreate.media_channel_id_2) {
                CommonService.getMediaChannel($scope.CrmLeadsStudentVoForCreate.media_channel_id_2).then(function (result) {
                    $scope.mediaChannel3List = result.data;
                });
            } else {
                $scope.mediaChannel3List = [];
            }
            // $scope.CrmLeadsStudentVoForCreate.media_channel_id_3 = '';
        }

        /* */
        $scope.signContractOrder = function signContractOrder() {
            sessionStorage.setItem("orderJudgeEntrance", 'addOrder');
            $scope.addCrmLeadsStudentOrder($scope.detail)
        }


        //新签充值订单
        $scope.signTopupOrder = function signTopupOrder() {
            var customerStudent = { 'crm_student_id': $scope.detail.crm_student_id };
            LeadsStudentService.detail(customerStudent).then(function (result) {
                $scope.detail.accountBalance = result.accountBalance;
                var obj = {
                    'crmStudentId': $scope.detail.crm_student_id,
                    'name': $scope.detail.name,
                    'accountBalance': $scope.detail.accountBalance,
                    'consumeAccountBalance': 0,
                    'gradeId': $scope.detail.grade_id
                };
                $scope.order = angular.copy(obj);
                $scope.modalTitle = '添加';
                $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/sos/order/addTopup.html', show: true });
            })
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


        /**
         * 待分配学生列表
         * @type {{}}
         */
        $scope.allotCrmLeadsStudentFilter = {}; //待分配CrmLeadsStudent过滤条件
        $scope.allotCrmLeadsStudentList = [];
        $scope.allAllotPosition = [];
        $scope.allAllotUser = [];
        $scope.allAllotSchool = [];
        $scope.totalLeads = 0;
        $scope.getAllotCrmLeadsStudentList = function callServer(tableState) {
            $scope.allotCrmLeadsStudentListTableState = tableState;
            //console.dir(tableState);
            $scope.isAllotCrmLeadsStudentListLoading = true;
            //查看【总部意向客户】，不是o2o就是网络营销部
            if (AuthenticationService.currentUser().department_id == Constants.DepartmentID.WANGLUOYINGXIAOBU) {
                $scope.schoolCrmLeadsStudentFilter.media_channel_id_1 = 4;
            }
            if ($scope.isO2OOperationSpecialist()) {
                $scope.schoolCrmLeadsStudentFilter.media_channel_id_1 = 8;
                $scope.allotCrmLeadsStudentFilter.media_channel_id_1 = 8;
                $scope.allotCrmLeadsStudentFilter4.media_channel_id_1 = 8;
                $scope.iso2o = true;
            }
            //如果是呼叫权限的人，则查询所属机构下校区的数据，呼叫客信的数据
            if ($rootScope.showPermissions('PermissionForCallCenter')) {
                $scope.schoolCrmLeadsStudentFilter.media_channel_id_1 = 8;
                $scope.allotCrmLeadsStudentFilter.media_channel_id_1 = 1;
                $scope.allotCrmLeadsStudentFilter.media_channel_id_2 = 30;
                CommonService.getMediaChannel($scope.allotCrmLeadsStudentFilter.media_channel_id_1).then(function (result) {
                    $scope.mediaChannel2ListForMyAllot = result.data;
                });
                //传递部门id
                $scope.isSpecial = true;
                $scope.allotCrmLeadsStudentFilter.departmentId = localStorageService.get('department_id');
                $scope.allotCrmLeadsStudentFilter.PermissionForCallCenter = '1';
                $scope.allotCrmLeadsStudentFilter.allot = null;
            }
            if ($scope.isMine) {
                $scope.allotCrmLeadsStudentFilter.currentUserId = localStorageService.get('user').id;
            }
            $scope.allotCrmLeadsStudentFilter.fromLead = 1;
            //如果是营销主管
            if ($scope.isMarketManager()) {
                $scope.allotCrmLeadsStudentFilter.isMarketManager = true;
            } else {
                $scope.allotCrmLeadsStudentFilter.isMarketManager = false;
            }
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            //alert(localStorageService.get('position_id'));
            if (localStorageService.get('position_id') == Constants.PositionID.HEADMASTER //校长
                || $scope.isSpecial
                || localStorageService.get('position_id') == Constants.PositionID.COURSE_CHIEF_OFFICER //营销主管
                || localStorageService.get('position_id') == Constants.PositionID.YSP_HEADMASTER
                || localStorageService.get('position_id') == Constants.PositionID.YSB_HEADMASTER
                || localStorageService.get('position_id') == Constants.PositionID.YSGJ_HEADMASTER
                || localStorageService.get('position_id') == Constants.PositionID.YSGJ_STUDENT_CHIEF_OFFICER
            ) {
                LeadsStudentService.schoolList(start, number, tableState, $scope.allotCrmLeadsStudentFilter).then(function (result) {
                    $scope.totalLeads = result.total;
                    if (localStorageService.get('school_id') == 0 && !$rootScope.showPermissions('PermissionForCallCenter')) {//非校区岗位用户
                        CommonService.getAllDepartmentOfSchool().then(function (result) {
                            $scope.allAllotSchool = result.data;
                        });
                    } else {
                        CommonService.getAllPositionsByOrgId().then(function (result) {
                            //console.dir(result.data);
                            $scope.allAllotPosition = result.data;
                        });
                        CommonService.getAllDepartmentOfSchoolByOrgId().then(function (result) {
                            $scope.allAllotSchool = result.data;
                        });
                    }
                    $scope.allotCrmLeadsStudentList = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isAllotCrmLeadsStudentListLoading = false;
                });
            } else {
                LeadsStudentService.list(start, number, tableState, $scope.allotCrmLeadsStudentFilter).then(function (result) {
                    $scope.totalLeads = result.total;
                    if (localStorageService.get('school_id') == 0 && !$rootScope.showPermissions('PermissionForCallCenter')) {//非校区岗位用户
                        CommonService.getAllDepartmentOfSchool().then(function (result) {
                            $scope.allAllotSchool = result.data;
                        });
                    } else {
                        CommonService.getAllPositionsByOrgId().then(function (result) {
                            //console.dir(result.data);
                            $scope.allAllotPosition = result.data;
                        });
                        CommonService.getAllDepartmentOfSchoolByOrgId().then(function (result) {
                            $scope.allAllotSchool = result.data;
                        });
                    }

                    $scope.allotCrmLeadsStudentList = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isAllotCrmLeadsStudentListLoading = false;
                });
            }
        };
        //==============================================================已分配意向客户列表
        $scope.allotCrmLeadsStudentFilter2 = {}; //待分配CrmLeadsStudent过滤条件
        $scope.allotCrmLeadsStudentList2 = [];
        $scope.allAllotPosition2 = [];
        $scope.allAllotUser2 = [];
        $scope.allAllotSchool2 = [];
        $scope.totalLeads2 = 0;
        $scope.getAllotCrmLeadsStudentList2 = function callServer(tableState) {
            if ($scope.isO2OOperationSpecialist()) {
                $scope.allotCrmLeadsStudentFilter2.isO2O = true;
            }
            else {
                $scope.allotCrmLeadsStudentFilter2.isCurrentOrg = false;
            }
            if ($scope.isMine) {
                $scope.allotCrmLeadsStudentFilter2.currentUserId = localStorageService.get('user').id;
            }
            //如果是呼叫权限的人，则查询所属机构下校区的数据，呼叫客信的数据
            if ($rootScope.showPermissions('PermissionForCallCenter')) {
                $scope.allotCrmLeadsStudentFilter2.media_channel_id_1 = 1;
                $scope.allotCrmLeadsStudentFilter2.media_channel_id_2 = 30;
                //传递部门id
                $scope.allotCrmLeadsStudentFilter2.departmentId = localStorageService.get('department_id');
                $scope.allotCrmLeadsStudentFilter2.PermissionForCallCenter = '1';
                $scope.allotCrmLeadsStudentFilter2.allot = null;
                $scope.allotCrmLeadsStudentFilter2.isCurrentOrg = null;
            }
            $scope.allotCrmLeadsStudentFilter2.fromLead = 1;
            $scope.allotCrmLeadsStudentListTableState2 = tableState;
            //console.dir(tableState);
            $scope.isAllotCrmLeadsStudentListLoading2 = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.

            LeadsStudentService.schoolList(start, number, tableState, $scope.allotCrmLeadsStudentFilter2).then(function (result) {
                $scope.totalLeads2 = result.total;
                if (localStorageService.get('school_id') == 0 && !$rootScope.showPermissions('PermissionForCallCenter')) {//非校区岗位用户
                    CommonService.getAllDepartmentOfSchool().then(function (result) {
                        $scope.allAllotSchool = result.data;
                    });
                } else {
                    CommonService.getAllPositionsByOrgId().then(function (result) {
                        //console.dir(result.data);
                        $scope.allAllotPosition = result.data;
                    });
                    CommonService.getAllDepartmentOfSchoolByOrgId().then(function (result) {
                        $scope.allAllotSchool = result.data;
                    });
                }
                $scope.allotCrmLeadsStudentList2 = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.isAllotCrmLeadsStudentListLoading2 = false;
            });
        };
        //==============================================================

        /**
         * 岗位员工二级联动
         */
        $scope.positionChangeForAllot = function () {
            if ($scope.allotCrmLeadsStudentFilter.position_id) {
                CommonService.getAllUserByOrgIdAndPositionId($scope.allotCrmLeadsStudentFilter.position_id).then(function (result) {
                    $scope.allAllotUser = result.data;
                });
            } else {
                $scope.allAllotUser = [];
            }
        }

        /**
         * 跳转到分配学生线索页面
         */
        $scope.showAllotView = function () {
            $scope.isList = false;
            $scope.isAdding = false;
            $scope.isDetail = false;
            $scope.isUpdate = false;
            $scope.isAllot = true;
            $scope.selectAllSchoolFlagForAllot = false;
            $scope.isBatchAllot = false;

            $scope.allotCrmLeadsStudentFilter = {}; //待分配CrmLeadsStudent过滤条件
            if ($scope.isMine) {
                $scope.allotCrmLeadsStudentFilter.currentUserId = localStorageService.get('user').id;
            }

            //刷新待分配学员
            if ($scope.allotCrmLeadsStudentListTableState) {
                $scope.MyCrmLeadsStudentListOk = [];
                $scope.allotCrmLeadsStudentListTableState.pagination.start = 0;
                $scope.allotCrmLeadsStudentList = [];
                $scope.getAllotCrmLeadsStudentList($scope.allotCrmLeadsStudentListTableState);
            } else {
                /*     $scope.MyCrmLeadsStudentListOk = [];
                 $scope.allotCrmLeadsStudentListTableState={
                 pagination:{}
                 };
                 $scope.allotCrmLeadsStudentListTableState.pagination.start = 0;
                 $scope.allotCrmLeadsStudentList = [];
                 $scope.getAllotCrmLeadsStudentList($scope.allotCrmLeadsStudentListTableState);*/
            }


            //获取大区信息
            $scope.getDepartmentsOfDistrict();

            //重新查询校长
            if (check_null($scope.schoolMasterTableState.pagination)) {
                $scope.getAllSchoolMaster($scope.schoolMasterTableState);
            }
        }


        $scope.saveAllotNetwork = function (obj) {
            var AllotCrmLeadsStudentVo = {};
            if ($scope.checkDistributeFirstTabClassActive() || obj === 1) {
                AllotCrmLeadsStudentVo.studentList = $scope.MyCrmLeadsStudentListOk;
            } else {
                AllotCrmLeadsStudentVo.studentList = $scope.MyCrmLeadsStudentListOk2;
            }
            if (!$scope.allotCrmLeadsStudentFilter.user_id) {
                warningAlert("请选择要分配的员工信息");
                return;
            }
            AllotCrmLeadsStudentVo.user_id = $scope.allotCrmLeadsStudentFilter.user_id;
            //AllotCrmLeadsStudentVo.school_master_id = $scope.allotCrmLeadsStudentFilter.school_master_id;
            var promise = LeadsStudentService.saveAllotNetwork(AllotCrmLeadsStudentVo);
            promise.then(function (response) {

                if (response.status == "SUCCESS") {
                    successAlert("分配成功");
                } else {
                    // console.log(response.data);
                    // console.log(response.error);
                    if (response.data == null) {
                        warningAlert(response.error);
                    } else {
                        $scope.alertErr = [];
                        $scope.alertErr[0] = {};
                        $scope.alertErr[0].err = response.error;

                        for (var i = 0; i < response.data.length; i++) {
                            $scope.alertErr[i + 1] = {};
                            var msg = "";
                            msg += response.data[i].name + " ";
                            msg += response.data[i].phone + " ";
                            msg += response.data[i].toSchoolName + " ";
                            msg += response.data[i].reason + " ";
                            $scope.alertErr[i + 1].err = msg;
                        }
                        $scope.errType = 1;
                        $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/bd/leads/lead_err_model.html?' + new Date().getTime(), show: true });
                    }
                    return;
                }
                $scope.MyCrmLeadsStudentListOk = [];
                $scope.allotCrmLeadsStudentFilter = {};
                //$location.path('/sos-admin/fenfenfen?time='+new Date());
                history.go(0);
            }, function (error) {
                warningAlert("分配学生失败");
            });
        };

        $scope.saveSchoolMasterAllotNetwork = function (obj) {
            var AllotCrmLeadsStudentVo = {};
            if ($scope.checkDistributeFirstTabClassActive() || obj === 1) {
                AllotCrmLeadsStudentVo.studentList = $scope.MyCrmLeadsStudentListOk;
            } else {
                AllotCrmLeadsStudentVo.studentList = $scope.MyCrmLeadsStudentListOk2;
            }
            //AllotCrmLeadsStudentVo.studentList = $scope.MyCrmLeadsStudentListOk;
            //AllotCrmLeadsStudentVo.user_id = $scope.allotCrmLeadsStudentFilter.user_id;
            if (!$scope.allotCrmLeadsStudentFilter.school_master_id) {
                warningAlert("请选择要分配的校长信息");
                return;
            }

            if ($scope.isO2OOperationSpecialist()) {
                AllotCrmLeadsStudentVo.isO2O = true;
            }

            AllotCrmLeadsStudentVo.school_master_id = $scope.allotCrmLeadsStudentFilter.school_master_id;
            var promise = LeadsStudentService.saveAllotNetwork(AllotCrmLeadsStudentVo);
            promise.then(function (response) {
                if (response.status == "SUCCESS") {
                    successAlert("分配成功");
                } else {
                    // console.log(response.data);
                    // console.log(response.error);
                    if (response.data == null) {
                        warningAlert(response.error);
                    } else {
                        $scope.alertErr = [];
                        $scope.alertErr[0] = {};
                        $scope.alertErr[0].err = response.error;

                        for (var i = 0; i < response.data.length; i++) {
                            $scope.alertErr[i + 1] = {};
                            var msg = "";
                            msg += response.data[i].name + " ";
                            msg += response.data[i].phone + " ";
                            msg += response.data[i].toSchoolName + " ";
                            msg += response.data[i].reason + " ";
                            $scope.alertErr[i + 1].err = msg;
                        }
                        $scope.errType = 1;
                        $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/bd/leads/lead_err_model.html?' + new Date().getTime(), show: true });
                    }
                    return;
                }
                $scope.MyCrmLeadsStudentListOk2 = [];
                $scope.allotCrmLeadsStudentFilter2 = {};
                $scope.schoolMasterFilter = {};//清空校长查询条件
                //$location.path('/sos-admin/fenfenfen?time='+new Date());
                history.go(0);
            }, function (error) {
                warningAlert("跨校区分配学生失败");

            });
        };


        /**
         * 保存分配信息
         */
        $scope.saveAllot = function () {
            var AllotCrmLeadsStudentVo = {};
            AllotCrmLeadsStudentVo.studentList = $scope.MyCrmLeadsStudentListOk;
            if (!$scope.allotCrmLeadsStudentFilter.user_id) {
                warningAlert("请选择要分配的员工信息");
                return;
            }
            AllotCrmLeadsStudentVo.user_id = $scope.allotCrmLeadsStudentFilter.user_id;
            //AllotCrmLeadsStudentVo.school_master_id = $scope.allotCrmLeadsStudentFilter.school_master_id;
            var promise = LeadsStudentService.saveAllot(AllotCrmLeadsStudentVo);
            promise.then(function (data) {
                $scope.showListView();
                $scope.MyCrmLeadsStudentListOk = [];
                $scope.allotCrmLeadsStudentFilter = {};
            }, function (error) {
                warningAlert("分配学生失败");
            });
        };

        //选择一个校长
        $scope.selectSchoolMaster = function (schoolmMaster) {
            //console.log(schoolmMaster);
            $scope.allotCrmLeadsStudentFilter.school_master_id = schoolmMaster.uid;
        }

        /**
         * 保存跨校区分配信息
         */
        $scope.saveSchoolMasterAllot = function () {
            var AllotCrmLeadsStudentVo = {};
            AllotCrmLeadsStudentVo.studentList = $scope.MyCrmLeadsStudentListOk;
            //AllotCrmLeadsStudentVo.user_id = $scope.allotCrmLeadsStudentFilter.user_id;
            if (!$scope.allotCrmLeadsStudentFilter.school_master_id) {
                warningAlert("请选择要分配的校长信息");
                return;
            }
            AllotCrmLeadsStudentVo.school_master_id = $scope.allotCrmLeadsStudentFilter.school_master_id;
            var promise = LeadsStudentService.saveAllot(AllotCrmLeadsStudentVo);
            promise.then(function (data) {
                $scope.showListView();
                $scope.MyCrmLeadsStudentListOk = [];
                $scope.allotCrmLeadsStudentFilter = {};
                $scope.schoolMasterFilter = {};//清空校长查询条件
            }, function (error) {
                warningAlert("跨校区分配学生失败");

            });
        }




        //选择
        $scope.MyCrmLeadsStudentListOk = [];//已选择的学生leads
        $scope.selectOne = function (student) {
            //console.dir(student);
            for (var index in $scope.MyCrmLeadsStudentListOk) {
                if ($scope.MyCrmLeadsStudentListOk[index].crm_student_id == student.crm_student_id) {
                    $scope.deleteOne(student);
                    return;
                }
            }
            $scope.MyCrmLeadsStudentListOk.push(student);
        };

        $scope.MyCrmLeadsStudentListOk2 = [];//已选择的学生leads
        $scope.selectOne2 = function (student) {
            //console.dir(student);
            for (var index in $scope.MyCrmLeadsStudentListOk2) {
                if ($scope.MyCrmLeadsStudentListOk2[index].crm_student_id == student.crm_student_id) {
                    $scope.deleteOne2(student);
                    return;
                }
            }
            $scope.MyCrmLeadsStudentListOk2.push(student);
        };

        //删除
        $scope.deleteOne = function (student) {
            if ($scope.MyCrmLeadsStudentListOk.indexOf(student) > -1) {
                $scope.MyCrmLeadsStudentListOk = removeItemFromArray(student, $scope.MyCrmLeadsStudentListOk);
                //$scope.MyCrmLeadsStudentListOk.splice($scope.MyCrmLeadsStudentListOk.indexOf(student), 1);//dom中删除当前行
            }
        };

        $scope.deleteOne2 = function (student) {
            if ($scope.MyCrmLeadsStudentListOk2.indexOf(student) > -1) {
                $scope.MyCrmLeadsStudentListOk2 = removeItemFromArray(student, $scope.MyCrmLeadsStudentListOk2);
                //$scope.MyCrmLeadsStudentListOk.splice($scope.MyCrmLeadsStudentListOk.indexOf(student), 1);//dom中删除当前行
            }
        };

        //是否选中
        $scope.isSelected = function (student) {
            for (var index in $scope.MyCrmLeadsStudentListOk) {
                if ($scope.MyCrmLeadsStudentListOk[index].crm_student_id == student.crm_student_id) {
                    return true;
                }
            }
            return false;
        }

        $scope.isSelected2 = function (student) {
            for (var index in $scope.MyCrmLeadsStudentListOk2) {
                if ($scope.MyCrmLeadsStudentListOk2[index].crm_student_id == student.crm_student_id) {
                    return true;
                }
            }
            return false;
        }

        //从已选定的学生中删除一个
        function removeItemFromArray(item, list) {
            var newList = [];
            for (var tmp in list) {
                if (list[tmp].crm_student_id && list[tmp].crm_student_id != item.crm_student_id) {
                    newList.push(list[tmp]);
                }
            }
            return newList;
        }

        //批量分配数量
        /*  $scope.batchNum = 0;*/
        /**
         *批量分配 本校区  每人分配客户数改变时触发
         */
        $scope.batchNumChange = function () {
            if ($scope.batchSelecte.batchNum > 500) {
                warningAlert("分配数量不能大于500条");
                $scope.batchSelecte.batchNum = 0;
                $scope.batchOperateCountNum = 0;
                return;
            } else {

                $scope.batchOperateCountNum = $scope.batchSelecte.batchNum * $scope.EmpListOk.length;
                if ($scope.batchOperateCountNum > $scope.totalLeads) {
                    warningAlert("分配数量不能大于可分配数量");
                    $scope.batchSelecte.batchNum = 0;
                    $scope.batchOperateCountNum = 0;
                    return;
                }
                if ($scope.batchOperateCountNum > 2000) {
                    warningAlert("一次最多分配2000条");
                    $scope.batchSelecte.batchNum = 0;
                    $scope.batchOperateCountNum = 0;
                    return;
                }
            }
        }
        /**
         *批量分配  每人分配客户数改变时触发
         */
        $scope.batchNumSchoolChange = function () {
            if ($scope.batchSelecte.batchNum > 500) {
                warningAlert("分配数量不能大于500条");
                $scope.batchSelecte.batchNum = 0;
                $scope.batchOperateCountNum = 0;
                return;
            } else {
                $scope.batchOperateCountNum = $scope.batchSelecte.batchNum * $scope.SchoolMasterListOk.length;
                if ($scope.batchOperateCountNum > $scope.totalLeads) {
                    warningAlert("分配数量不能大于可分配数量");
                    $scope.batchSelecte.batchNum = 0;
                    $scope.batchOperateCountNum = 0;
                    return;
                }
                if ($scope.batchOperateCountNum > 2000) {
                    warningAlert("一次最多分配2000条");
                    $scope.batchSelecte.batchNum = 0;
                    $scope.batchOperateCountNum = 0;
                    return;
                }
            }
        }

        //$scope.batchNumChangeTotal = function(){
        //    $scope.batchOperateCountNum = $scope.batchNum*$scope.EmpListOk.length;
        //    if($scope.batchOperateCountNum > $scope.totalLeads){
        //        SweetAlert.swal("分配数量不能大于可分配数量");
        //        $scope.batchNum = 0;
        //        $scope.batchOperateCountNum = $scope.batchNum*$scope.EmpListOk.length;
        //        return;
        //    }
        //};

        //保存批量本校区分配
        $scope.batchAllotFilter = $scope.allotCrmLeadsStudentFilter;
        $scope.batchAllotSave = function () {
            if ($scope.batchSelecte.batchNum <= 0) { warningAlert("分配数量必须大于0"); $scope.batchSelecte.batchNum = 0; return; }
            if ($scope.batchOperateCountNum > $scope.totalLeads) {
                warningAlert("分配数量不能大于可分配数量");
                $scope.batchSelecte.batchNum = 0;
                $scope.batchOperateCountNum = 0;
                return;
            }
            if ($scope.batchOperateCountNum > 2000) {
                warningAlert("一次最多分配2000条");
                $scope.batchSelecte.batchNum = 0;
                $scope.batchOperateCountNum = 0;
                return;
            }

            var param = {};
            param.leadsFilter = $scope.allotCrmLeadsStudentFilter;
            param.leadsFilter.total = $scope.batchSelecte.batchNum;
            param.empidList = [];
            if ($scope.EmpListOk.length <= 0) { warningAlert("请选择要分配的员工"); return; }
            //if($scope.Ok.length > $scope.batchNum){SweetAlert.swal("分配的员工数不能大于分配的Leads数量");return;}
            for (var i = 0, len = $scope.EmpListOk.length; i < len; i++) {
                param.empidList.push($scope.EmpListOk[i].uid);
            }

            var promise = LeadsStudentService.saveBatchAllot(param);
            promise.then(function (data) {
                if (data.status == "SUCCESS") {
                    successAlert("批量分配成功");
                    cancelSelect('employeesList')
                } else {
                    warningAlert(data.error);
                    return;
                }
                $scope.EmpListOk = [];//已选择的员工
                $scope.batchSelecte.batchNum = 0;
                $scope.selectAllFlag = false;
                //刷新待分配学员
                $scope.allotCrmLeadsStudentListTableState.pagination.start = 0;
                $scope.allotCrmLeadsStudentList = [];
                $scope.getAllotCrmLeadsStudentList($scope.allotCrmLeadsStudentListTableState);
            }, function (error) {
                warningAlert("批量分配失败");
            });
        };
        //=======================================================
        $scope.batchAllotSaveNetwork = function (isMine) {
            if (isMine && isMine === 1) {
                $scope.allotCrmLeadsStudentFilter.isMineAllot = true;
            }
            if ($scope.batchSelecte.batchNum <= 0) { warningAlert("分配数量必须大于0"); $scope.batchSelecte.batchNum = 0; return; }
            if ($scope.batchOperateCountNum > $scope.totalLeads) {
                warningAlert("分配数量不能大于可分配数量");
                $scope.batchSelecte.batchNum = 0;
                $scope.batchOperateCountNum = 0;
                return;
            }
            if ($scope.batchOperateCountNum > 2000) {
                warningAlert("一次最多分配2000条");
                $scope.batchSelecte.batchNum = 0;
                $scope.batchOperateCountNum = 0;
                return;
            }
            $scope.allotCrmLeadsStudentFilter.isCurrentOrg = true;
            if ($scope.isMine) {
                $scope.allotCrmLeadsStudentFilter.currentUserId = localStorageService.get('user').id;
            }
            var param = {};
            param.leadsFilter = $scope.allotCrmLeadsStudentFilter;
            param.leadsFilter.total = $scope.batchSelecte.batchNum;
            param.empidList = [];
            if ($scope.EmpListOk.length <= 0) { warningAlert("请选择要分配的员工"); return; }
            //if($scope.EmpListOk.length > $scope.batchNum){SweetAlert.swal("分配的员工数不能大于分配的Leads数量");return;}
            for (var i = 0, len = $scope.EmpListOk.length; i < len; i++) {
                param.empidList.push($scope.EmpListOk[i].uid);
            }

            var promise = LeadsStudentService.saveBatchAllot(param);
            promise.then(function (response) {
                if (response.status == "SUCCESS") {
                    if (response.data != null) {
                        var normalCount = response.data.normalCount;
                        var errorMsgs = response.data.errorMsgs;
                        $scope.alertErr = [];
                        $scope.alertErr[0] = {};
                        $scope.alertErr[0].err = response.error + ":分配数据" + normalCount + "条";

                        for (var i = 0; i < errorMsgs.length; i++) {
                            $scope.alertErr[i + 1] = {};
                            var msg = "";
                            msg += errorMsgs[i].name + " ";
                            msg += errorMsgs[i].phone + " ";
                            msg += errorMsgs[i].toSchoolName + " ";
                            msg += errorMsgs[i].reason + " ";
                            $scope.alertErr[i + 1].err = msg;
                        }
                        $scope.errType = 1;
                        $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/bd/leads/lead_err_model.html?' + new Date().getTime(), show: true });
                    } else {
                        warningAlert("批量分配成功");
                        //  取消当页已选勾的状态
                        cancelSelect('employeesList')
                    }

                } else {
                    warningAlert(response.error);
                    return;
                }
                $scope.EmpListOk = [];//已选择的员工
                $scope.batchSelecte.batchNum = 0;
                $scope.selectAllFlag = false;
                //刷新待分配学员
                $scope.allotCrmLeadsStudentListTableState.pagination.start = 0;
                $scope.allotCrmLeadsStudentList = [];
                $scope.getAllotCrmLeadsStudentList($scope.allotCrmLeadsStudentListTableState);
            }, function (error) {
                warningAlert("批量分配失败");
            });
        };

        //根据条件查询当前用户所在学校的岗位人员信息
        $scope.employeesList = [];
        $scope.employeesFilter = {};
        //$scope.employeesListTableState = {};
        //$scope.oldPosition_id = null;
        $scope.findAllEmployeesOfCurrentUserSchool = function (tableState) {
            //$scope.EmpListOk = [];
            $scope.employeesListTableState = tableState;
            $scope.isEmpLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            var promise = LeadsStudentService.findAllEmployeesOfCurrentUserSchool(start, number, tableState, $scope.employeesFilter);
            promise.then(function (result) {
                //console.log(result.data);
                $scope.employeesList = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.employeesListTableState = tableState;
                $scope.isEmpLoading = false;
                maintainSelect('EmpListOk', 'employeesList', 'selectAllFlag')
                //if( $scope.oldPosition_id != $scope.employeesFilter.position_id ){
                //    $scope.oldPosition_id = $scope.employeesFilter.position_id;
                //    $scope.EmpListOk = [];
                //    $scope.selectAllFlag = false;
                //}
            }, function (error) {
                warningAlert("查询当前用户所在学校的岗位人员信息失败");
            });
        }
        $scope.selectAllOrNot = selectAllOrNot
        /**
         * TODO：全选或者取消全选处理
         * 已选中数据
         * @param already
         * 新数据或当前页面数据
         * @param newData
         * 当前类型
         * @param isFlag
         */
        function selectAllOrNot(already, newData, isFlag) {
            var aLen = $scope[already].length,
                nLen = $scope[newData].length,
                item = []
            //已选数据套新数据在一定程度上提升性能减少循环次数，当已选数据大于10
            try {
                for (var a = 0; a < aLen; a++) {
                    for (var n = 0; n < nLen; n++) {
                        if ($scope[already][a].uid == $scope[newData][n].uid) {
                            //  修改选中状态
                            $scope[newData][n].selected = !$scope[newData][n].selected
                            //  从已选数据中删除，需要加入临时数组保存然后再删除，不能直接删除，否则已选数组的长度一直变化
                            $scope[already].splice(a, 1)
                            // item.push(a)
                        }
                    }
                }
            } catch (e) {
                console.log(e)
            }

            /**
             * 需要进行全选
             */
            function isZero() {
                for (var n = 0; n < nLen; n++) {
                    //  修改选中状态
                    $scope[newData][n].selected = true
                    //  如果已经是选中状态则跳过
                    if ($scope[already].indexOf($scope[newData][n].selected) == -1) {
                        $scope[already].push($scope[newData][n])
                    }
                }
            }
            // 当已选列表为空或者当前状态为没有全选时可以全选
            if (a == 0 || !$scope[isFlag]) {
                isZero()
            }
            //  删除时需要在此删除数据
            /*if(item.length){
             for(var i = 0,iLen = item.length;i<iLen;i++){
             $scope[already].splice(item[iLen-item.length-i],1)
             }
             }*/
            $scope[isFlag] = !$scope[isFlag]
            pageListOk(getPageState())
        }
        /**
         * TODO：取消选择单个
         * @param uid
         * 当前选中的uid
         * @param newDate
         * 当前页数据
         * @param already
         * 已选中数据
         * @returns {number}
         * 返回0表示失败，不存在，1执行成功
         */
        function deleteOne(uid, newDate, already) {
            var nLen = $scope[newDate].length,
                aLen = $scope[already].length,
                flag = 0
            try {
                for (var n = 0; n < nLen; n++) {
                    if (uid == $scope[newDate][n].uid) {
                        $scope[newDate][n].selected = false
                    }
                }
                for (var a = 0; a < aLen; a++) {
                    if (uid == $scope[already][a].uid) {
                        $scope[already].splice(a, 1)
                        flag++
                    }
                }
            } catch (e) { }
            pageListOk(getPageState())
            return flag
        }

        /**
         * TODO:取消当页已选勾的状态
         * @param newDate
         * 当前页数据
         */
        function cancelSelect(newDate) {
            var nLen = $scope[newDate].length
            for (var i = 0; i < nLen; i++) {
                $scope[newDate][i].selected = false
            }
            pageListOk(getPageState(1))
        }
        /**
         * TODO:分页选中处理
         * 已经选择的数据
         * @param already
         * 分页获取的新数据
         * @param newData
         * 全选是否勾选
         * @param isFlag
         */
        function maintainSelect(already, newData, isFlag) {//EmpListOk  employeesList
            var aLen = $scope[already].length,
                nLen = $scope[newData].length,
                flag = 0
            //已选数据套新数据在一定程度上提升性能减少循环次数，当已选数据大于10
            for (var a = 0; a < aLen; a++) {
                for (var n = 0; n < nLen; n++) {
                    if ($scope[already][a].uid == $scope[newData][n].uid) {
                        $scope[newData][n].selected = true
                        flag++
                    }
                }
            }
            if (flag != nLen) {
                $scope[isFlag] = false
            } else {
                $scope[isFlag] = true
            }
            pageListOk(getPageState())
        }

        /**
         * TODO：获取已选列表中显示分页数据的TableState
         * @returns {*}
         * 返回当前分页tablestate
         */
        function getPageState() {
            if ($scope.isSchoolUser() && $scope.isSelectedProduct == 1) {
                if (arguments[0] == 1) {
                    $scope.EmpListOk.length = 0
                }
                return $scope.empListOkTableState
            } else if ($scope.showPermissions('SchoolLeadsAllot') && $scope.isSelectedProduct == 2) {
                if (arguments[0] == 1) {
                    $scope.SchoolMasterListOk.length = 0
                }
                return $scope.SchoolMasterListOkTableState
            }
        }
        $scope.__empListOk = []
        $scope.pageListOk = pageListOk
        /**
         * TODO：本地分页：从已选列表中分页
         * @param tableState
         * 默认传入的分页信息
         */
        function pageListOk(tableState) {
            /**
             * TODO：本地分页：从已选列表中分页
             * @param tableState
             * 默认传入的分页信息
             * @param whatState
             * 区分分页列表，具体看页面的st-state属性对应的值
             * @param okList
             * 已选择列表：即原来所定义的XXXOK数组
             * 使用时后两者传入数组名，如：pageListOk(tableState,'empListOkTableState','EmpListOk')
             */
            function thisUnitary(tableState, whatState, okList) {
                $scope[whatState] = tableState;
                if (!tableState) {
                    return false
                }
                var pagination = tableState.pagination;
                //  第几页
                var start = pagination.start || 0;
                //  每页显示的条数
                var number = pagination.number || 10;
                var i = start,
                    len = $scope[okList].length,
                    size = len > (start + number) ? (start + number) : len
                //  总页数
                tableState.pagination.numberOfPages = len % number > 0 ? (parseInt(len / number, 10) + 1) : (len / number)
                //  先清空数据
                $scope.__empListOk.length = 0
                /**
                 * TODO：计算当前需要显示的已选择列表数据
                 * 数组index值从 start*number 到 start*number+number
                 */
                for (; i < size; i++) {
                    $scope.__empListOk.push($scope[okList][i])
                }
            }
            if ($scope.isSchoolUser() && $scope.isSelectedProduct == 1) {
                thisUnitary(tableState, 'empListOkTableState', 'EmpListOk')
            } else if ($scope.showPermissions('SchoolLeadsAllot') && $scope.isSelectedProduct == 2) {
                thisUnitary(tableState, 'SchoolMasterListOkTableState', 'SchoolMasterListOk')
            }
        }
        //是否选中员工
        $scope.isEmpSelected = function (emp) {
            //console.log(student);
            for (var i = 0, len = $scope.EmpListOk.length; i < len; i++) {
                if ($scope.EmpListOk[i].uid == emp.uid) {
                    return true;
                }
            }
            return false;
        }

        $scope.selectAllFlag = false;
        $scope.selectAllFlagForMine = false;
        $scope.selectAllFlagForAlreadyAllot = false;
        $scope.isSelectedAll = function (obj) {
            if (obj === 1) { //我的意向客户批量分配
                return $scope.selectAllFlag;
            } else if (obj === 2) { //我的意向客户分配
                return $scope.selectAllFlagForMine;
            } else if (obj === 3) { //已分配意向客户
                return $scope.selectAllFlagForAlreadyAllot;
            }
        };
        $scope.selectAll = function (obj) {
            if (obj === 1) { //我的意向客户批量分配
                $scope.selectAllFlag = !($scope.selectAllFlag);
                if ($scope.selectAllFlag) {
                    //  添加到选择结果列表
                    for (var index in $scope.employeesList) {
                        var flag = true;
                        for (var ind in $scope.EmpListOk) {
                            if ($scope.employeesList[index].uid == $scope.EmpListOk[ind].uid) {
                                flag = false;
                            }
                        }
                        if (flag) {
                            $scope.employeesList[index].selected = true
                            $scope.EmpListOk.push($scope.employeesList[index]);
                        }
                    }
                    $scope.batchOperateCountNum = $scope.batchSelecte.batchNum * $scope.EmpListOk.length;
                    if ($scope.batchOperateCountNum > $scope.totalLeads) {
                        warningAlert("分配数量超过总数");
                        $scope.batchSelecte.batchNum = 0;
                        $scope.batchOperateCountNum = 0;
                    }
                    if ($scope.batchOperateCountNum > 2000) {
                        warningAlert("一次最多分配2000条");
                        $scope.batchSelecte.batchNum = 0;
                        $scope.batchOperateCountNum = 0;
                        return;
                    }
                } else {
                    //  清空选择结果列表
                    for (var i = 0, max = $scope.employeesList.length; i < max; i++) {
                        $scope.employeesList[i].selected = false
                    }
                    $scope.EmpListOk.length = 0;
                    $scope.batchOperateCountNum = 0;
                }
            } else if (obj === 2) { //我的意向客户分配
                $scope.selectAllFlagForMine = !($scope.selectAllFlagForMine);
                if ($scope.selectAllFlagForMine) {
                    angular.forEach($scope.allotCrmLeadsStudentList, function (data, index, aray) {
                        $scope.MyCrmLeadsStudentListOk.push(data);
                    });
                } else {
                    $scope.MyCrmLeadsStudentListOk = [];
                }
            } else if (obj === 3) { //已分配意向客户
                $scope.selectAllFlagForAlreadyAllot = !($scope.selectAllFlagForAlreadyAllot);
                if ($scope.selectAllFlagForAlreadyAllot) {
                    angular.forEach($scope.allotCrmLeadsStudentList2, function (data, index, aray) {
                        $scope.MyCrmLeadsStudentListOk2.push(data);
                    });
                } else {
                    $scope.MyCrmLeadsStudentListOk2 = [];
                }
            }
        };


        $scope.selectAllSchoolFlag = false;
        $scope.isSelectedAllSchool = function (obj) {
            if (obj === 1) { //校区意向客户批量分配
                return $scope.selectAllSchoolFlag;
            } else if (obj === 2) { //校区意向客户分配
                return $scope.selectAllSchoolFlagForAllot;
            }
        };
        $scope.selectAllSchool = function (obj) {
            if (obj === 1) { //校区意向客户批量分配
                $scope.selectAllSchoolFlag = !($scope.selectAllSchoolFlag);
                if ($scope.selectAllSchoolFlag) {
                    for (var index in $scope.schoolMasterList) {
                        var flag = true;
                        for (var ind in $scope.SchoolMasterListOk) {
                            if ($scope.schoolMasterList[index].uid == $scope.SchoolMasterListOk[ind].uid) {
                                flag = false;
                            }
                        }
                        if (flag) {
                            $scope.schoolMasterList[index].selected = true
                            $scope.SchoolMasterListOk.push($scope.schoolMasterList[index]);
                        }

                    }
                    $scope.batchOperateCountNum = $scope.batchSelecte.batchNumSchool * $scope.SchoolMasterListOk.length;
                    if ($scope.batchOperateCountNum > $scope.totalLeads) {
                        warningAlert("分配数量超过总数");
                        $scope.batchNum = 0;
                        $scope.batchOperateCountNum = 0;
                    }
                    if ($scope.batchOperateCountNum > 2000) {
                        warningAlert("一次最多分配2000条");
                        $scope.batchNum = 0;
                        $scope.batchOperateCountNum = 0;
                        return;
                    }
                } else {
                    //  清空选择结果列表
                    for (var i = 0, max = $scope.schoolMasterList.length; i < max; i++) {
                        $scope.schoolMasterList[i].selected = false
                    }
                    $scope.SchoolMasterListOk.length = 0;
                    $scope.batchOperateCountNum = 0;
                }
            } else if (obj === 2) { //校区意向客户分配
                $scope.selectAllSchoolFlagForAllot = !($scope.selectAllSchoolFlagForAllot);
                if ($scope.selectAllSchoolFlagForAllot) {
                    angular.forEach($scope.allotCrmLeadsStudentList, function (data, index, aray) {
                        $scope.MyCrmLeadsStudentListOk.push(data);
                    });
                } else {
                    $scope.MyCrmLeadsStudentListOk = [];
                }
            }
        };


        //选择员工
        $scope.EmpListOk = [];//已选择的员工
        $scope.batchSelecte = {};
        $scope.batchOperateCountNum = 0;
        $scope.selectOneEmp = function (emp) {
            //console.dir(student);
            for (var index in $scope.EmpListOk) {
                if ($scope.EmpListOk[index].uid == emp.uid) {
                    $scope.deleteOneEmp(emp, arguments[1]);
                    // $scope.employeesList[arguments[1]].selected = false
                    return;
                }
            }
            $scope.EmpListOk.push(emp);
            $scope.batchOperateCountNum = $scope.batchSelecte.batchNum * $scope.EmpListOk.length;
            /*   $scope.batchOperateCountNum = $scope.batchNum*$scope.EmpListOk.length;*/
            if ($scope.batchOperateCountNum > $scope.totalLeads) {
                warningAlert("分配数量超过总数");
                $scope.batchSelecte.batchNum = 0;
                $scope.batchOperateCountNum = 0;
            }
            if ($scope.batchOperateCountNum > 2000) {
                warningAlert("一次最多分配2000条");
                $scope.batchSelecte.batchNum = 0;
                $scope.batchOperateCountNum = 0;
                return;
            }
            /**
             * 根据是否有第二个参数来做处理，第二个参数为循环数组的index索引
             * @type {boolean}
             */
            $scope.employeesList[arguments[1]].selected = true
            pageListOk(getPageState())
            //$scope.batchOperateCountNum = $scope.batchSelecte.batchNum*$scope.EmpListOk.length;
        };


        /* var timer = $interval(function(){
         if( $scope.checkFirstTabClassActive() ){
         $scope.batchOperateCountNum = $scope.batchNum*$scope.EmpListOk.length;
         }else{
         $scope.batchOperateCountNum = $scope.batchNum*$scope.SchoolMasterListOk.length;
         }
         },5000);*/

        $scope.getShowSelectedLists = function (tableState) {
            /*$scope.selectedListsTableState = tableState;
             var pagination = tableState.pagination;
             var number = pagination.number || 5;  // Number of entries showed per page.

             if($scope.show.planListsPage && $scope.show.planListsPage.length ==0){
             pagination.start = pagination.start-number;
             if(pagination.start <0){
             pagination.start = 0;
             }
             }
             var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.


             var list = angular.copy($scope.show.planLists);
             $scope.show.planListsPage = list.slice(start,start+5);
             tableState.pagination.numberOfPages = Math.ceil(list.length/number)||1;//set the number of pages so the pagination can update*/
        };
        /**
         * 添加本校区 选中列表
         * @param row
         * @private
         */
        function _addSelectedLists(row) {
            if ($scope.selectedLists) {
                $scope.selectedLists = [];
            }
            $scope.selectedLists.push(row);
        }


        //删除员工
        $scope.deleteOneEmp = function (emp) {
            //console.dir(student);
            // $scope.EmpListOk.indexOf(emp) > -1
            if (deleteOne(emp.uid, 'employeesList', 'EmpListOk')) {
                // $scope.EmpListOk =  removeEmpFromArray(emp,$scope.EmpListOk);
                //把选择列种对应selected改为false
                // var arrIndex = getArrIndex(emp,$scope.employeesList)
                // $scope.employeesList[arguments[1]].selected = false
            }
            $scope.batchOperateCountNum = $scope.batchSelecte.batchNum * $scope.EmpListOk.length;
            if ($scope.batchOperateCountNum > $scope.totalLeads) {
                warningAlert("分配数量超过总数");
                $scope.batchNum = 0;
                $scope.batchOperateCountNum = 0;
            }
            if ($scope.batchOperateCountNum > 2000) {
                warningAlert("一次最多分配2000条");
                $scope.batchNum = 0;
                $scope.batchOperateCountNum = 0;
                return;
            }
        };
        /**
         * 获取数组的下标
         * @param emp
         * @param list
         */
        function getArrIndex(emp, list) {
            var arrIndex = null
            for (var i = 0, max = list.length; i < max; i++) {
                if (list[i].uid == emp.uid) {
                    arrIndex = i
                    break;
                }
            }
            return arrIndex
        }
        //从已选定的员工中删除一个
        function removeEmpFromArray(item, list) {
            var newList = [];
            for (var tmp in list) {
                if (list[tmp].uid != item.uid) {
                    newList.push(list[tmp]);
                }
            }
            return newList;
        }

        //获取字典类型
        $scope.DDictionaryList = [];
        $scope.getDDictionary = function () {
            var promise = CommonService.getDDictionary("District");
            promise.then(function (data) {
                //console.dir(data);
                $scope.DDictionaryList = data.data;
            }, function (error) {
                warningAlert("查询数据字典信息失败");
            });
        }

        //获取大区类型
        $scope.DepartmentsOfDistrictList = [];
        $scope.getDepartmentsOfDistrict = function () {
            var promise = CommonService.getDepartmentsOfDistrict();
            promise.then(function (data) {
                //console.dir(data);
                //console.log(data);
                $scope.DepartmentsOfDistrictList = data.data;
            }, function (error) {
                warningAlert("查询大区信息失败");
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
                $scope.SchoolMasterListOk = [];
                $scope.selectAllSchoolFlag = false;
            }, function (error) {
                warningAlert("查询区域信息失败");
            });
        }

        //获取所有的校区校长信息
        $scope.schoolMasterFilter = {};
        $scope.schoolMasterList = [];
        $scope.schoolMasterTableState = {};
        $scope.thisTableState = {}
        $scope.getAllSchoolMaster = function (tableState) {
            $scope.schoolMasterTableState = tableState;
            $scope.isSchoolMasterLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            CommonService.getAllSchoolMaster(start, number, tableState, $scope.schoolMasterFilter).then(function (result) {
                //console.dir(result.data);
                //$scope.getAllSelected();
                $scope.schoolMasterList = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.schoolMasterTableState = tableState;
                /*存放临时列表查询参数，确保拨打电话以及分配能够正常使用@李世明 2016-09-23*/
                $scope.thisTableState = tableState
                $scope.isSchoolMasterLoading = false;
                maintainSelect('SchoolMasterListOk', 'schoolMasterList', 'selectAllSchoolFlag')
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
                    $scope.schoolMasterList[arguments[1]].selected = false
                    return;
                }
            }
            $scope.SchoolMasterListOk.push(emp);

            if ($scope.batchOperateCountNum > $scope.totalLeads) {
                warningAlert("分配数量超过总数");
                $scope.batchSelecte.batchNumSchool = 0;
                $scope.batchOperateCountNum = 0;
                return;
            }
            if ($scope.batchOperateCountNum > 2000) {
                warningAlert("一次最多分配2000条");
                $scope.batchSelecte.batchNumSchool = 0;
                $scope.batchOperateCountNum = 0;
                return;
            }
            $scope.batchOperateCountNumSchool = $scope.batchSelecte.batchNumSchool * $scope.SchoolMasterListOk.length;
            /**
             * 根据是否有第二个参数来做处理，第二个参数为循环数组的index索引
             * @type {boolean}
             */
            $scope.schoolMasterList[arguments[1]].selected = true
        };

        $scope.checkFirstTabClassActive = function () {
            return angular.element("#kkk").children().eq(1).children().eq(0).children().eq(0).hasClass("active");
        };

        $scope.checkDistributeFirstTabClassActive = function () {
            return angular.element("#ppp").children().eq(0).children().eq(0).children().eq(0).hasClass("active");
        };

        //$scope.checkBatchDistributeFirstTabClassActive =function(){
        //  return angular.element("#mmm").children().eq(0).children().eq(0).children().eq(0).hasClass("active");
        //};


        //删除校长
        $scope.deleteOneSchoolMaster = function (emp) {
            //for(var index in $scope.SchoolMasterListOk){
            //    if($scope.SchoolMasterListOk[index].uid == emp.uid){
            //        $scope.SchoolMasterListOk =  removeSchoolMasterFromArray(emp,$scope.SchoolMasterListOk);return;
            //    }
            //}
            if (deleteOne(emp.uid, 'schoolMasterList', 'SchoolMasterListOk')) {
                // $scope.SchoolMasterListOk =  removeEmpFromArray(emp,$scope.SchoolMasterListOk);
                $scope.batchOperateCountNumSchool = $scope.batchSelecte.batchNumSchool * $scope.SchoolMasterListOk.length;
            }

            $scope.batchOperateCountNum = $scope.batchNum * $scope.SchoolMasterListOk.length;
            if ($scope.batchOperateCountNum > $scope.totalLeads) {
                warningAlert("分配数量超过总数");
                $scope.batchNum = 0;
                $scope.batchOperateCountNum = 0;
            }
            if ($scope.batchOperateCountNum > 2000) {
                warningAlert("一次最多分配2000条");
                $scope.batchNum = 0;
                $scope.batchOperateCountNum = 0;
                return;
            }
        };
        //从已选定的校长中删除一个
        function removeSchoolMasterFromArray(item, list) {
            var newList = [];
            for (var tmp in list) {
                if (list[tmp].uid != item.uid) {
                    newList.push(list[tmp]);
                }
            }
            return newList;
        }

        //$scope.schoolDistribute = false;
        //$scope.showPersonDistribute = function(){
        //    $scope.schoolDistribute = false;
        //};
        //$scope.showSchoolDistribute = function(){
        //    $scope.schoolDistribute = true;
        //};


        $scope.batchOperateCountNumSchool = 0;

        $scope.batchNumChangeSchool = function () {
            if ($scope.batchSelecte.batchNumSchool > 500) {
                warningAlert("分配数量不能大于500条");
                $scope.batchSelecte.batchNumSchool = 0;
                $scope.batchOperateCountNumSchool = $scope.batchSelecte.batchNumSchool * $scope.SchoolMasterListOk.length;
                return;
            } else {
                $scope.batchOperateCountNumSchool = $scope.batchSelecte.batchNumSchool * $scope.SchoolMasterListOk.length;
                if ($scope.batchOperateCountNum > $scope.totalLeads) {
                    warningAlert("分配数量不能大于可分配数量");
                    $scope.batchSelecte.batchNumSchool = 0;
                    $scope.batchOperateCountNum = 0;
                    return;
                }
                if ($scope.batchOperateCountNum > 2000) {
                    warningAlert("一次最多分配2000条");
                    $scope.batchSelecte.batchNumSchool = 0;
                    $scope.batchOperateCountNum = 0;
                    return;
                }
            }
            //console.log($scope.batchSelecte.batchNumSchool);
            //console.log($scope.SchoolMasterListOk.length);
            //console.log($scope.batchOperateCountNum);
        };

        //$scope.batchNumChangeTotalSchool = function(){
        //    $scope.batchOperateCountNumSchool = $scope.batchNumSchoolw*$scope.SchoolMasterListOk.length;
        //    if($scope.batchOperateCountNumSchool > $scope.totalLeads){
        //        SweetAlert.swal("分配数量不能大于可分配数量");
        //        $scope.batchNumSchoolw = 0;
        //        $scope.batchOperateCountNumSchool = $scope.batchNum*$scope.SchoolMasterListOk.length;
        //        return;
        //    }
        //};

        //保存批量跨校区分配
        //$scope.batchAllotFilter = $scope.allotCrmLeadsStudentFilter;
        $scope.schoolBatchAllotSave = function () {
            if ($scope.batchSelecte.batchNumSchool <= 0) { warningAlert("分配数量必须大于0"); $scope.batchNum = 0; return; }
            if ($scope.batchOperateCountNumSchool > $scope.totalLeads) {
                warningAlert("分配数量不能大于可分配数量");
                $scope.batchSelecte.batchNumSchool = 0;
                $scope.batchOperateCountNumSchool = 0;
                return;
            }
            if ($scope.batchOperateCountNum > 2000) {
                warningAlert("一次最多分配2000条");
                $scope.batchNum = 0;
                $scope.batchOperateCountNum = 0;
                return;
            }

            var param = {};
            param.leadsFilter = $scope.allotCrmLeadsStudentFilter;
            param.leadsFilter.total = $scope.batchSelecte.batchNumSchool;
            param.empidList = [];
            if ($scope.SchoolMasterListOk.length <= 0) { warningAlert("请选择要分配的员工"); return; }
            //if($scope.SchoolMasterListOk.length > $scope.batchNumSchool){SweetAlert.swal("分配的员工数不能大于分配的Leads数量");return;}
            for (var i = 0; i < $scope.SchoolMasterListOk.length; i++) {
                param.empidList.push($scope.SchoolMasterListOk[i].uid);
            }

            var promise = LeadsStudentService.saveBatchAllot(param);
            promise.then(function (data) {
                if (data.status == "SUCCESS") {
                    warningAlert("跨校区批量分配成功");
                    cancelSelect('schoolMasterList')
                } else {
                    warningAlert(data.error);
                    return;
                }
                $scope.SchoolMasterListOk = [];//已选择的员工
                $scope.schoolMasterFilter = {};//清空查询条件
                $scope.batchSelecte.batchNumSchool = 0;
                $scope.batchOperateCountNumSchool = 0;
                $scope.selectAllSchoolFlag = false;
                //刷新待分配学员
                $scope.allotCrmLeadsStudentListTableState.pagination.start = 0;
                $scope.allotCrmLeadsStudentList = [];
                $scope.getAllotCrmLeadsStudentList($scope.allotCrmLeadsStudentListTableState);
            }, function (error) {
                warningAlert("跨校区批量分配失败");
            });
        };
        //=================================
        $scope.schoolBatchAllotSaveNetwork = function () {
            if ($scope.batchSelecte.batchNumSchool <= 0) { warningAlert("分配数量必须大于0"); $scope.batchNum = 0; return; }
            if ($scope.batchOperateCountNumSchool > $scope.totalLeads) {
                warningAlert("分配数量不能大于可分配数量");
                $scope.batchSelecte.batchNumSchool = 0;
                $scope.batchOperateCountNumSchool = 0;
                return;
            }
            if ($scope.batchOperateCountNum > 2000) {
                warningAlert("一次最多分配2000条");
                $scope.batchNum = 0;
                $scope.batchOperateCountNum = 0;
                return;
            }

            var param = {};
            $scope.allotCrmLeadsStudentFilter.isCurrentOrg = true;
            if ($scope.isMine) {
                $scope.allotCrmLeadsStudentFilter.currentUserId = localStorageService.get('user').id;
            }
            param.leadsFilter = $scope.allotCrmLeadsStudentFilter;
            param.leadsFilter.total = $scope.batchSelecte.batchNumSchool;
            param.empidList = [];
            if ($scope.SchoolMasterListOk.length <= 0) { warningAlert("请选择要分配的员工"); return; }
            //if($scope.SchoolMasterListOk.length > $scope.batchNumSchool){SweetAlert.swal("分配的员工数不能大于分配的Leads数量");return;}
            for (var i = 0, len = $scope.SchoolMasterListOk.length; i < len; i++) {
                param.empidList.push($scope.SchoolMasterListOk[i].uid);
            }
            if ($scope.isO2OOperationSpecialist()) {
                param.isO2O = true;
            }
            var promise = LeadsStudentService.saveBatchAllot(param);
            promise.then(function (response) {
                if (response.status == "SUCCESS") {
                    if (response.data != null) {
                        var normalCount = response.data.normalCount;
                        var errorMsgs = response.data.errorMsgs;
                        $scope.alertErr = [];
                        $scope.alertErr[0] = {};
                        $scope.alertErr[0].err = response.error + ":分配数据" + normalCount + "条";

                        for (var i = 0; i < errorMsgs.length; i++) {
                            $scope.alertErr[i + 1] = {};
                            var msg = "";
                            msg += errorMsgs[i].name + " ";
                            msg += errorMsgs[i].phone + " ";
                            msg += errorMsgs[i].toSchoolName + " ";
                            msg += errorMsgs[i].reason + " ";
                            $scope.alertErr[i + 1].err = msg;
                        }
                        $scope.errType = 1;
                        $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/bd/leads/lead_err_model.html?' + new Date().getTime(), show: true });
                    } else {
                        successAlert("批量分配成功");
                        //  取消当页已选勾的状态
                        cancelSelect('schoolMasterList')
                    }

                } else {
                    warningAlert(response.error);
                    return;
                }
                $scope.SchoolMasterListOk = [];//已选择的员工
                $scope.schoolMasterFilter = {};//清空查询条件
                $scope.batchSelecte.batchNumSchool = 0;
                $scope.batchOperateCountNumSchool = 0;
                $scope.selectAllSchoolFlag = false;
                //刷新待分配学员
                $scope.allotCrmLeadsStudentListTableState.pagination.start = 0;
                $scope.allotCrmLeadsStudentList = [];
                $scope.getAllotCrmLeadsStudentList($scope.allotCrmLeadsStudentListTableState);
            }, function (error) {
                warningAlert("跨校区批量分配失败");
            });
        }
        //==================================

        /**
         *跳转到批量分配学生线索页面
         **/
        $scope.isSpecialDistribute = false;
        $scope.showBatchAllotView = function () {
            $scope.isList = false;
            $scope.isAdding = false;
            $scope.isDetail = false;
            $scope.isUpdate = false;
            $scope.isAllot = false;
            $scope.isBatchAllot = true;

            $scope.allotCrmLeadsStudentFilter = {
                removeProtected: true,
                removeAbnormal: true
            }; //待分配CrmLeadsStudent过滤条件

            if ($scope.isSpecialDistribute) {
                $scope.allotCrmLeadsStudentFilter.isCurrentOrg = true;
            }

            //刷新待分配学员
            if ($scope.allotCrmLeadsStudentListTableState) {
                $scope.allotCrmLeadsStudentListTableState.pagination.start = 0;
                $scope.allotCrmLeadsStudentList = [];
                $scope.getAllotCrmLeadsStudentList($scope.allotCrmLeadsStudentListTableState);
            }

            //刷新分配员工
            if ($scope.employeesListTableState) {
                $scope.employeesListTableState.pagination.start = 0;
                $scope.employeesList = [];
                $scope.findAllEmployeesOfCurrentUserSchool($scope.employeesListTableState);
            }

            //获取大区信息
            $scope.getDepartmentsOfDistrict();

            $timeout(function () {
                var node = $("#yjqds");
                var content = '此类客户包括10天内顾问新增、分配、邀约、到访、试听或签单的客户';
                node.webuiPopover({ content: content, trigger: 'hover' });
                var node = $("#yjqds2");
                var content = '在意向客户列表中被标记客户状态为异常的客户';
                node.webuiPopover({ content: content, trigger: 'hover' });

                var node = $("#yjqds3");
                var content = '此类客户包括10天内顾问新增、分配、邀约、到访、试听或签单的客户';
                node.webuiPopover({ content: content, trigger: 'hover' });
                var node = $("#yjqds4");
                var content = '在意向客户列表中被标记客户状态为异常的客户';
                node.webuiPopover({ content: content, trigger: 'hover' });
                /*  var node1 = $("#yjqdje");
                 var content = '指定周期内新签且无退单记录的订单金额总和(订单金额是已优惠后的金额)';
                 node1.webuiPopover({content:content,trigger:'hover'});
                 var node2 = $("#yjssje");
                 var content = '指定周期内新签且无退单记录的实际订单金额总和(订单金额是已优惠后的金额)';
                 node2.webuiPopover({content:content,trigger:'hover'});*/
            }, 1000);
        };

        $scope.showBatchAllotListByFilter = function () {
            if (arguments[0] && arguments[0] == 1) {
                $scope.allotCrmLeadsStudentFilter.removeProtected = !$scope.allotCrmLeadsStudentFilter.removeProtected
            } else if (arguments[0] && arguments[0] == 2) {
                $scope.allotCrmLeadsStudentFilter.removeAbnormal = !$scope.allotCrmLeadsStudentFilter.removeAbnormal
            }
            if ($scope.allotCrmLeadsStudentListTableState) {
                $scope.allotCrmLeadsStudentListTableState.pagination.start = 0;
                $scope.allotCrmLeadsStudentList = [];
                $scope.getAllotCrmLeadsStudentList($scope.allotCrmLeadsStudentListTableState);
            }
        }



        /**
         * 显示列表页面
         */
        $scope.showInvitationListView = function () {
            if ($scope.myCrmLeadsStudentRemindListTableState) {
                $scope.myCrmLeadsStudentRemindListTableState.pagination.start = 0;
                $scope.getRemindList($scope.myCrmLeadsStudentRemindListTableState);
            }
            if ($scope.myCrmLeadsStudentCommunicationListTableState) {
                $scope.myCrmLeadsStudentCommunicationListTableState.pagination.start = 0;
                $scope.getCommunicationList($scope.myCrmLeadsStudentCommunicationListTableState);
            }
            if ($scope.myCrmLeadsStudentInvitationListTableState) {
                $scope.myCrmLeadsStudentInvitationListTableState.pagination.start = 0;
                $scope.getInvitationList($scope.myCrmLeadsStudentInvitationListTableState);
            }



        }

        /**
         * Shows the new invitationRemind dialog.
         */
        function addInvitationRemind() {

            //console.log('Starting creating new invitationRemind.');
            $scope.CrmInvitationRemindVoForCreate = {};
            $scope.CrmInvitationRemindVoForCreate.personState = '2';
            $scope.CrmInvitationRemindVoForCreate.personType = '1';
            $scope.CrmInvitationRemindVoForCreate.personId = $scope.detail.crm_student_id;

            $scope.CrmInvitationCommunicationVoForCreate.communicateTime = new Date();

            $scope.modalTitle = '添加邀约提醒';
            $scope.CrmInvitationRemindVoForCreate.remindTime = new Date().Format("yyyy-MM-dd h:mm");
            $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/sos/invitationRemind/modal.invitationRemind.html', show: true });

        }
        /**
         * Saves the current invitationRemind.
         */
        function saveInvitationRemind() {
            if (new Date($scope.CrmInvitationRemindVoForCreate.remindTime) < new Date()) {
                warningAlert("提醒时间不能小于当天时间");
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

                $scope.showInvitationListView();
            }
        }
        /**
         * Edit InvitationRemind.
         * @param InvitationRemind the InvitationRemind to edit
         */
        function editInvitationRemind(crmInvitationRemind) {
            //console.log('Editing invitationRemind : ' + JSON.stringify(crmInvitationRemind));
            $scope.CrmInvitationRemindVoForCreate = angular.copy(crmInvitationRemind);

            $scope.CrmInvitationRemindVoForCreate.remindTime = new Date($scope.CrmInvitationRemindVoForCreate.remindTime).Format("yyyy-MM-dd hh:mm");
            $scope.modalTitle = '更新邀约提醒';
            $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/sos/invitationRemind/modal.invitationRemind.html', show: true });

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

            $scope.showInvitationListView();
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
        //添加日期的校验
        function timecompre() {
            if ($scope.CrmInvitationCommunicationVoForCreate.communicateTime > $scope.CrmInvitationCommunicationVoForCreate.nextTime) {
                warningAlert("沟通时间不能大于下次沟通时间");
                $scope.CrmInvitationCommunicationVoForCreate.communicateTime = new Date().Format("yyyy-MM-dd");
                $scope.CrmInvitationCommunicationVoForCreate.nextTime = new Date((new Date() / 1000 + 86400) * 1000).Format("yyyy-MM-dd");
            }


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
                        $scope.search2();
                        $scope.schoolsearch2()
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
                        $scope.search2();
                        $scope.schoolsearch2()
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
        function deleteInvitationCommunication(crmInvitationCommunication) {
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
                        $scope.search2();
                        $scope.schoolsearch2()
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
            $scope.CrmInvitationDetailVoForCreate = {};
            $scope.CrmInvitationDetailVoForCreate.personState = '2';
            $scope.CrmInvitationDetailVoForCreate.personType = '1';
            $scope.CrmInvitationDetailVoForCreate.personId = $scope.detail.crm_student_id;

            $scope.CrmInvitationDetailVoForCreate.isinside = '1';
            $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date();
            //$scope.CrmInvitationDetailVoForCreate.receiveTime =(new Date()).Format("yyyy-M-d h:m:s");
            $scope.modalTitle = '添加邀约';
            $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date().Format("yyyy-MM-dd h:mm");
            $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/sos/invitationDetail/modal.invitationDetail.html', show: true });

        }
        function addInvitationDetailByList(row) {
            $scope.CrmInvitationDetailVoForCreate = {};
            $scope.CrmInvitationDetailVoForCreate.personState = '2';
            $scope.CrmInvitationDetailVoForCreate.personType = '1';
            $scope.CrmInvitationDetailVoForCreate.personId = row.crm_student_id;

            $scope.CrmInvitationDetailVoForCreate.isinside = '1';
            $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date();
            //$scope.CrmInvitationDetailVoForCreate.receiveTime =(new Date()).Format("yyyy-M-d h:m:s");
            $scope.modalTitle = '添加邀约/到访记录';
            // $scope.detail = angular.copy(row);
            // $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date().Format("yyyy-MM-dd h:mm");
            // $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationDetail/modal.invitationDetail.html', show: true});


        }



        $scope.deletelaifang = function deletelaifang(crmInvitationDetail) {
            SweetAlert.swal({
                title: "确定要删除吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: ' #fe9900',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: true
            }, function (confirm) {
                if (confirm) {
                    InvitationDetailService.remove(crmInvitationDetail).then(function (result) {
                        //    这里可以刷新列表页面
                    })
                }
            }
            );
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

        $scope.allAllotSchoolDL = [];
        $scope.allAllotPositionDL = [];

        $scope.distributeLeadsStudent = function (row) {
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
            $scope.allotCrmLeadsStudentFilter.singleId = row.crm_student_id;
            $scope.modalTitleDL = '本校区分配所属人';
            //$scope.CrmInvitationDetailVoForCreate.receiveTime = new Date().Format("yyyy-MM-dd h:mm");
            $scope.modalDL = $modal({ scope: $scope, templateUrl: 'partials/sos/leads/modal.distributeFromList.html', show: true });
        };

        $scope.allAllotUserDL = [];
        $scope.positionChangeForAllotDL = function () {
            if ($scope.allotCrmLeadsStudentFilter.position_id) {
                CommonService.getAllUserByOrgIdAndPositionId($scope.allotCrmLeadsStudentFilter.position_id).then(function (result) {
                    $scope.allAllotUserDL = result.data;
                });
            } else {
                $scope.allAllotUserDL = [];
            }
        };


        $scope.distributePerson = function () {

            if (!$scope.allotCrmLeadsStudentFilter.user_id) {
                warningAlert("未选择员工");
                return;
            }
            var AllotCrmLeadsStudentVo = {};
            AllotCrmLeadsStudentVo.studentList = [];
            var obj = {};
            obj.crm_student_id = $scope.allotCrmLeadsStudentFilter.singleId;
            AllotCrmLeadsStudentVo.studentList.push(obj);
            AllotCrmLeadsStudentVo.user_id = $scope.allotCrmLeadsStudentFilter.user_id;
            //AllotCrmLeadsStudentVo.school_master_id = $scope.allotCrmLeadsStudentFilter.school_master_id;
            var promise = LeadsStudentService.saveAllot(AllotCrmLeadsStudentVo);
            promise.then(function (data) {
                $scope.showListView();
                $scope.allotCrmLeadsStudentFilter = {};
                $scope.allAllotSchoolDL = [];
                $scope.allAllotPositionDL = [];
                $scope.allAllotUserDL = [];
                $scope.modalDL.hide();
                successAlert("分配成功！意向客户的所属人可在我的意向客户菜单中查到此意向客户");
            }, function (error) {
                warningAlert("分配学生失败");
            });


        }

        /**
         * 电话重复时添加邀约
         */
        $scope.addInvitationDetailForRepeat = function () {
            $scope.CrmInvitationDetailVoForCreate = {};
            $scope.CrmInvitationDetailVoForCreate.personState = '2';
            $scope.CrmInvitationDetailVoForCreate.personType = '1';
            $scope.CrmInvitationDetailVoForCreate.personId = $scope.repeateData.crm_student_id;

            $scope.CrmInvitationDetailVoForCreate.isinside = '1';
            $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date();
            //$scope.CrmInvitationDetailVoForCreate.receiveTime =(new Date()).Format("yyyy-M-d h:m:s");
            $scope.modalTitle = '添加邀约';
            $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date().Format("yyyy-MM-dd h:mm");
            $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/sos/leads/modal.invitationDetail.html', show: true });

        }
        /**
         * Saves the current invitationDetail.
         */

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
                    $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date($scope.CrmInvitationDetailVoForCreate.invitateTime);
                    $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date($scope.CrmInvitationDetailVoForCreate.receiveTime);
                    if (typeof $scope.CrmInvitationDetailVoForCreate.id === 'undefined') {
                        $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date($scope.CrmInvitationDetailVoForCreate.receiveTime);
                        var promise = InvitationDetailService.create($scope.CrmInvitationDetailVoForCreate);
                        promise.then(function (CrmInvitationDetailVoForCreate) {
                            $scope.showInvitationListView();
                            $scope.dataLoading = false;

                            $scope.search2();
                            $scope.schoolsearch2()
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
                            $scope.search2();
                            $scope.schoolsearch2()
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
                        $scope.showInvitationListView();
                        $scope.search2();
                        $scope.schoolsearch2()
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
                        $scope.search2();
                        $scope.schoolsearch2()
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
        $scope.laifangyaoyuecheck = true;
        //默认的更新
        function zhifangyaoyueedit(detail) {
            if ($scope.flaglaifang.lai) {

                detail.state = 1
                if (new Date($scope.CrmInvitationDetailVoForCreate.receiveTime) < new Date((new Date() / 1000 - 86400) * 1000)) {
                    warningAlert("到访时间不能小于邀约时间");
                    return false
                }
            } else {

                detail.state = 2
            }
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
            var promise = InvitationDetailService.visit($scope.aaaaa);
            promise.then(function () {
                $scope.search2();
                $scope.schoolsearch2()
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
                        $scope.search2();
                        $scope.schoolsearch2()
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

        //===========================================================批量特殊分配========********
        /**
         * table选择
         * @param arg
         */
        $scope.isSelectedProduct = 1
        $scope.isSelectedF = 3
        $scope.setSelectedProduct = function (arg) {
            if (arg > 2) {
                $scope.isSelectedF = arg
            } else {
                $scope.isSelectedProduct = arg
            }
            $scope.__empListOk.length = 0
        }
        $scope.goToShowMineSpecialListView = function () {
            history.go(-1);
            //$location.path("/sos-admin/mine_special_distribute");
        };
        $scope.goToShowSpecialListView = function () {
            history.go(-1);
            //$location.path("/sos-admin/leads_student_zongbu");
        };
        $scope.showSpecialAllotView = function () {
            $location.path("/fb-admin/special_distribute");
        };
        $scope.showSpecialBatchAllotView = function () {
            $location.path("/fb-admin/batch_special_distribute");
        };

        $scope.showSpecialAllotViewMine = function () {
            $location.path("/fb-admin/mine_special_distribute");
        };
        $scope.showSpecialBatchAllotViewMine = function () {
            $location.path("/fb-admin/mine_batch_special_distribute");
        };

        $scope.showBatchAllotListByFilter4 = function () {
            if ($scope.allotCrmLeadsStudentListTableState4) {
                $scope.allotCrmLeadsStudentListTableState4.pagination.start = 0;
                $scope.allotCrmLeadsStudentList4 = [];
                $scope.getAllotCrmLeadsStudentList4($scope.allotCrmLeadsStudentListTableState4);
            }
        };

        $scope.allotCrmLeadsStudentFilter4 = {}; //待分配CrmLeadsStudent过滤条件
        $scope.allotCrmLeadsStudentList4 = [];
        $scope.allAllotPosition4 = [];
        $scope.allAllotUser4 = [];
        $scope.allAllotSchool4 = [];
        $scope.totalLeads4 = 0;
        $scope.getAllotCrmLeadsStudentList4 = function callServer(tableState) {
            if ($scope.isO2OOperationSpecialist()) {
                $scope.allotCrmLeadsStudentFilter4.isO2O = true;
            }
            else {
                $scope.allotCrmLeadsStudentFilter4.isCurrentOrg = false;
            }
            if ($scope.isMine) {
                $scope.allotCrmLeadsStudentFilter4.currentUserId = localStorageService.get('user').id;
            }
            $scope.allotCrmLeadsStudentFilter4.fromLead = 1;
            $scope.allotCrmLeadsStudentListTableState4 = tableState;
            //console.dir(tableState);
            $scope.isAllotCrmLeadsStudentListLoading4 = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.


            LeadsStudentService.schoolList(start, number, tableState, $scope.allotCrmLeadsStudentFilter4).then(function (result) {
                $scope.totalLeads4 = result.total;
                if (localStorageService.get('school_id') == 0) {//非校区岗位用户
                    CommonService.getAllDepartmentOfSchool().then(function (result) {
                        $scope.allAllotSchool4 = result.data;
                    });
                } else {
                    CommonService.getAllPositionsByOrgId().then(function (result) {
                        //console.dir(result.data);
                        $scope.allAllotPosition4 = result.data;
                    });
                    CommonService.getAllDepartmentOfSchoolByOrgId().then(function (result) {
                        $scope.allAllotSchool4 = result.data;
                    });
                }
                $scope.allotCrmLeadsStudentList4 = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.isAllotCrmLeadsStudentListLoading4 = false;
            });
        };
        $scope.mediaChannel2ListForMyAllot4 = [];
        $scope.mediaChannel1ChangeForAllot4 = function () {
            if ($scope.allotCrmLeadsStudentFilter4.media_channel_id_1) {
                CommonService.getMediaChannel($scope.allotCrmLeadsStudentFilter4.media_channel_id_1).then(function (result) {
                    $scope.mediaChannel2ListForMyAllot4 = result.data;
                });
            } else {
                $scope.mediaChannel2ListForMyAllot4 = [];
            }
        };

        //选择员工
        $scope.EmpListOk4 = [];//已选择的员工
        $scope.batchSelecte4 = {};
        $scope.batchOperateCountNum4 = 0;
        $scope.selectOneEmp4 = function (emp) {
            for (var index in $scope.EmpListOk4) {
                if ($scope.EmpListOk4[index].uid == emp.uid) {
                    $scope.deleteOneEmp4(emp); return;
                }
            }
            $scope.EmpListOk4.push(emp);

            /*   $scope.batchOperateCountNum = $scope.batchNum*$scope.EmpListOk.length;*/
            if ($scope.batchOperateCountNum4 > $scope.totalLeads4) {
                warningAlert("分配数量超过总数");
                $scope.batchSelecte4.batchNum = 0;
                $scope.batchOperateCountNum4 = 0;
            }
            if ($scope.batchOperateCountNum4 > 2000) {
                warningAlert("一次最多分配2000条");
                $scope.batchSelecte.batchNum4 = 0;
                $scope.batchOperateCountNum4 = 0;
                return;
            }
            $scope.employeesList[arguments[1]].selected = true
            $scope.batchOperateCountNum4 = $scope.batchSelecte4.batchNum * $scope.EmpListOk4.length;
        };

        //删除员工
        $scope.deleteOneEmp4 = function (emp) {
            //console.dir(student);
            if ($scope.EmpListOk4.indexOf(emp) > -1) {
                $scope.EmpListOk4 = removeEmpFromArray(emp, $scope.EmpListOk4);
            }
            $scope.batchOperateCountNum4 = $scope.batchSelecte4.batchNum * $scope.EmpListOk4.length;
            if ($scope.batchOperateCountNum4 > $scope.totalLeads4) {
                warningAlert("分配数量超过总数");
                $scope.batchNum4 = 0;
                $scope.batchOperateCountNum4 = 0;
            }
            if ($scope.batchOperateCountNum4 > 2000) {
                warningAlert("一次最多分配2000条");
                $scope.batchNum4 = 0;
                $scope.batchOperateCountNum4 = 0;
                return;
            }
        };

        $scope.batchNumChange4 = function () {
            if ($scope.batchSelecte4.batchNum > 500) {
                warningAlert("分配数量不能大于500条");
                $scope.batchSelecte4.batchNum = 0;
                $scope.batchOperateCountNum4 = 0;
                return;
            } else {

                $scope.batchOperateCountNum4 = $scope.batchSelecte4.batchNum * $scope.EmpListOk4.length;
                if ($scope.batchOperateCountNum4 > $scope.totalLeads4) {
                    warningAlert("分配数量不能大于可分配数量");
                    $scope.batchSelecte4.batchNum = 0;
                    $scope.batchOperateCountNum4 = 0;
                    return;
                }
                if ($scope.batchOperateCountNum4 > 2000) {
                    warningAlert("一次最多分配2000条");
                    $scope.batchSelecte4.batchNum = 0;
                    $scope.batchOperateCountNum4 = 0;
                    return;
                }
            }
        };

        $scope.employeesList4 = [];
        $scope.employeesFilter4 = {};
        //$scope.employeesListTableState = {};
        //$scope.oldPosition_id = null;
        $scope.findAllEmployeesOfCurrentUserSchool4 = function (tableState) {
            //$scope.EmpListOk = [];
            $scope.employeesListTableState4 = tableState;
            $scope.isEmpLoading4 = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            var promise = LeadsStudentService.findAllEmployeesOfCurrentUserSchool(start, number, tableState, $scope.employeesFilter4);
            promise.then(function (result) {
                //console.log(result.data);
                $scope.employeesList4 = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.employeesListTableState4 = tableState;
                $scope.isEmpLoading4 = false;
            }, function (error) {
                warningAlert("查询当前用户所在学校的岗位人员信息失败");
            });
        };

        $scope.selectAllFlag4 = false;
        $scope.isSelectedAll4 = function () {
            return $scope.selectAllFlag4;
        };
        $scope.selectAll4 = function () {
            //console.log(student);
            $scope.selectAllFlag4 = !($scope.selectAllFlag4);
            if ($scope.selectAllFlag4) {
                //$scope.EmpListOk = [];
                //$scope.EmpListOk.push(emp);
                for (var index in $scope.employeesList4) {
                    var flag = true;
                    for (var ind in $scope.EmpListOk4) {
                        if ($scope.employeesList4[index].uid == $scope.EmpListOk4[ind].uid) {
                            flag = false;
                        }
                    }
                    if (flag) {
                        $scope.EmpListOk4.push($scope.employeesList4[index]);
                    }
                }
                //console.log($scope.EmpListOk);
                $scope.batchOperateCountNum4 = $scope.batchSelecte4.batchNum * $scope.EmpListOk4.length;
                if ($scope.batchOperateCountNum4 > $scope.totalLeads4) {
                    warningAlert("分配数量超过总数");
                    $scope.batchSelecte4.batchNum = 0;
                    $scope.batchOperateCountNum4 = 0;
                }
                if ($scope.batchOperateCountNum4 > 2000) {
                    warningAlert("一次最多分配2000条");
                    $scope.batchSelecte4.batchNum = 0;
                    $scope.batchOperateCountNum4 = 0;
                    return;
                }
            } else {
                $scope.EmpListOk4 = [];
                $scope.batchOperateCountNum4 = 0;
            }

            //return false;
        };

        $scope.posisionChangeClear4 = function () {
            /* $scope.EmpListOk = [];*/
            $scope.selectAllFlag4 = false;
        };

        $scope.isEmpSelected4 = function (emp) {
            //console.log(student);
            for (var index in $scope.EmpListOk4) {
                if ($scope.EmpListOk4[index].uid == emp.uid) {
                    return true;
                }
            }
            return false;
        };

        $scope.batchAllotSaveNetwork4 = function () {
            if ($scope.batchSelecte4.batchNum <= 0) { warningAlert("分配数量必须大于0"); $scope.batchSelecte4.batchNum = 0; return; }
            if ($scope.batchOperateCountNum4 > $scope.totalLeads4) {
                warningAlert("分配数量不能大于可分配数量");
                $scope.batchSelecte4.batchNum = 0;
                $scope.batchOperateCountNum4 = 0;
                return;
            }
            if ($scope.batchOperateCountNum4 > 2000) {
                warningAlert("一次最多分配2000条");
                $scope.batchSelecte4.batchNum = 0;
                $scope.batchOperateCountNum4 = 0;
                return;
            }
            if ($scope.isO2OOperationSpecialist()) {
                $scope.allotCrmLeadsStudentFilter4.isO2O = true;
            }
            else {
                $scope.allotCrmLeadsStudentFilter4.isCurrentOrg = false;
            }
            if ($scope.isMine) {
                $scope.allotCrmLeadsStudentFilter4.currentUserId = localStorageService.get('user').id;
            }
            var param = {};
            param.leadsFilter = $scope.allotCrmLeadsStudentFilter4;
            param.leadsFilter.total = $scope.batchSelecte4.batchNum;
            param.empidList = [];
            if ($scope.EmpListOk4.length <= 0) { warningAlert("请选择要分配的员工"); return; }
            //if($scope.EmpListOk.length > $scope.batchNum){SweetAlert.swal("分配的员工数不能大于分配的Leads数量");return;}
            for (var i = 0, len = $scope.EmpListOk4.length; i < len; i++) {
                param.empidList.push($scope.EmpListOk4[i].uid);
            }

            var promise = LeadsStudentService.saveBatchAllot(param);
            promise.then(function (response) {
                if (response.status == "SUCCESS") {
                    if (response.data != null) {
                        var normalCount = response.data.normalCount;
                        var errorMsgs = response.data.errorMsgs;
                        $scope.alertErr = [];
                        $scope.alertErr[0] = {};
                        $scope.alertErr[0].err = response.error + ":分配数据" + normalCount + "条";

                        for (var i = 0; i < errorMsgs.length; i++) {
                            $scope.alertErr[i + 1] = {};
                            var msg = "";
                            msg += errorMsgs[i].name + " ";
                            msg += errorMsgs[i].phone + " ";
                            msg += errorMsgs[i].toSchoolName + " ";
                            msg += errorMsgs[i].reason + " ";
                            $scope.alertErr[i + 1].err = msg;
                        }
                        $scope.errType = 1;
                        $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/bd/leads/lead_err_model.html?' + new Date().getTime(), show: true });
                    } else {
                        successAlert("批量分配成功");
                    }

                } else {
                    warningAlert(response.error);
                    return;
                }
                $scope.EmpListOk4 = [];//已选择的员工
                $scope.batchSelecte4.batchNum = 0;
                $scope.selectAllFlag4 = false;
                //刷新待分配学员
                $scope.allotCrmLeadsStudentListTableState4.pagination.start = 0;
                $scope.allotCrmLeadsStudentList4 = [];
                $scope.getAllotCrmLeadsStudentList4($scope.allotCrmLeadsStudentListTableState4);
            }, function (error) {
                warningAlert("批量分配失败");
            });
        };

        $scope.batchOperateCountNumSchool4 = 0;

        $scope.batchNumChangeSchool4 = function () {
            if ($scope.batchSelecte4.batchNumSchool > 500) {
                warningAlert("分配数量不能大于500条");
                $scope.batchSelecte4.batchNumSchool = 0;
                $scope.batchOperateCountNumSchool4 = $scope.batchSelecte4.batchNumSchool * $scope.SchoolMasterListOk4.length;
                return;
            } else {
                $scope.batchOperateCountNumSchool4 = $scope.batchSelecte4.batchNumSchool * $scope.SchoolMasterListOk4.length;
                if ($scope.batchOperateCountNum4 > $scope.totalLeads4) {
                    warningAlert("分配数量不能大于可分配数量");
                    $scope.batchSelecte4.batchNumSchool = 0;
                    $scope.batchOperateCountNum4 = 0;
                    return;
                }
                if ($scope.batchOperateCountNum4 > 2000) {
                    SweetAlert.swal("一次最多分配2000条");
                    $scope.batchSelecte4.batchNumSchool = 0;
                    $scope.batchOperateCountNum4 = 0;
                    return;
                }
            }
        };

        //删除校长
        $scope.deleteOneSchoolMaster4 = function (emp) {
            //for(var index in $scope.SchoolMasterListOk){
            //    if($scope.SchoolMasterListOk[index].uid == emp.uid){
            //        $scope.SchoolMasterListOk =  removeSchoolMasterFromArray(emp,$scope.SchoolMasterListOk);return;
            //    }
            //}
            if ($scope.SchoolMasterListOk4.indexOf(emp) > -1) {
                $scope.SchoolMasterListOk4 = removeEmpFromArray(emp, $scope.SchoolMasterListOk4);
                $scope.batchOperateCountNumSchool4 = $scope.batchSelecte4.batchNumSchool * $scope.SchoolMasterListOk4.length;
            }
            $scope.batchOperateCountNum4 = $scope.batchNum4 * $scope.SchoolMasterListOk4.length;
            if ($scope.batchOperateCountNum4 > $scope.totalLeads4) {
                SweetAlert.swal("分配数量超过总数");
                $scope.batchNum4 = 0;
                $scope.batchOperateCountNum4 = 0;
            }
            if ($scope.batchOperateCountNum4 > 2000) {
                SweetAlert.swal("一次最多分配2000条");
                $scope.batchNum4 = 0;
                $scope.batchOperateCountNum4 = 0;
                return;
            }
        };

        $scope.schoolMasterFilter4 = {};
        $scope.schoolMasterList4 = [];
        $scope.schoolMasterTableState4 = {};
        $scope.getAllSchoolMaster4 = function (tableState) {
            $scope.schoolMasterTableState4 = tableState;
            $scope.isSchoolMasterLoading4 = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            CommonService.getAllSchoolMaster(start, number, tableState, $scope.schoolMasterFilter4).then(function (result) {
                //console.dir(result.data);
                //$scope.getAllSelected();
                $scope.schoolMasterList4 = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.schoolMasterTableState4 = tableState;
                $scope.isSchoolMasterLoading4 = false;
            });
        };

        $scope.selectAllSchoolFlag4 = false;
        $scope.isSelectedAllSchool4 = function () {
            return $scope.selectAllSchoolFlag4;
        };
        $scope.selectAllSchool4 = function () {
            //console.log(student);
            $scope.selectAllSchoolFlag4 = !($scope.selectAllSchoolFlag4);
            if ($scope.selectAllSchoolFlag4) {
                //$scope.SchoolMasterListOk = [];
                for (var index in $scope.schoolMasterList4) {
                    var flag = true;
                    for (var ind in $scope.SchoolMasterListOk4) {
                        if ($scope.schoolMasterList4[index].uid == $scope.SchoolMasterListOk4[ind].uid) {
                            flag = false;
                        }
                    }
                    if (flag) {
                        $scope.SchoolMasterListOk4.push($scope.schoolMasterList4[index]);
                    }

                }
                //console.log($scope.SchoolMasterListOk);
                $scope.batchOperateCountNum4 = $scope.batchSelecte4.batchNumSchool * $scope.SchoolMasterListOk4.length;
                if ($scope.batchOperateCountNum4 > $scope.totalLeads4) {
                    SweetAlert.swal("分配数量超过总数");
                    $scope.batchNum4 = 0;
                    $scope.batchOperateCountNum4 = 0;
                }
                if ($scope.batchOperateCountNum4 > 2000) {
                    SweetAlert.swal("一次最多分配2000条");
                    $scope.batchNum4 = 0;
                    $scope.batchOperateCountNum4 = 0;
                    return;
                }
            } else {
                $scope.SchoolMasterListOk4 = [];
                $scope.batchOperateCountNum4 = 0;
            }

            //return false;
        };

        $scope.DepartmentsOfDistrictList4 = [];
        $scope.getDepartmentsOfDistrict4 = function () {
            var promise = CommonService.getDepartmentsOfDistrict();
            promise.then(function (data) {
                //console.dir(data);
                //console.log(data);
                $scope.DepartmentsOfDistrictList4 = data.data;
            }, function (error) {
                SweetAlert.swal("查询大区信息失败");
            });
        };

        $scope.DepartmentsOfRegion4 = [];
        $scope.getDepartmentsOfRegion4 = function () {
            //console.log($scope.schoolMasterFilter);
            var promise = CommonService.getDepartmentsOfRegion($scope.schoolMasterFilter);
            promise.then(function (data) {
                //console.dir(data);
                $scope.DepartmentsOfRegion4 = data.data;
                $scope.SchoolMasterListOk4 = [];
                $scope.selectAllSchoolFlag4 = false;
            }, function (error) {
                SweetAlert.swal("查询区域信息失败");
            });
        };

        $scope.getAllSelected4 = function getAllSelected() {
            CommonService.getSubjectIdSelect().then(function (result) {
                $scope.subjectIds4 = result.data;
            });
            CommonService.getGradeIdSelect().then(function (result) {
                $scope.gradeIds4 = result.data;
            });
            CommonService.getProvinceSelect().then(function (result) {
                $scope.provinceList4 = result.data;
            });
            CommonService.getState(0).then(function (result) {
                //console.dir(result);
                $scope.state1List4 = result.data;
            });
            CommonService.getMediaChannel(0).then(function (result) {
                $scope.mediaChannel1List4 = result.data;
            });
        };

        $scope.provinceChangeForBatchAllot4 = function () {
            //console.dir($scope.detailForUpdate);
            if ($scope.schoolMasterFilter4.province_code) {
                CommonService.getCitySelect($scope.schoolMasterFilter4.province_code).then(function (result) {
                    $scope.cityList4 = result.data;
                });
            } else {
                $scope.cityList4 = [];
            }
            $scope.SchoolMasterListOk4 = [];
            $scope.selectAllSchoolFlag4 = false;
        };

        $scope.cityChangeForBatchAllot4 = function () {
            //console.dir($scope.detailForUpdate);
            if ($scope.schoolMasterFilter4.city_code) {
                CommonService.getAreaSelect($scope.schoolMasterFilter4.city_code).then(function (result) {
                    $scope.areaList4 = result.data;
                });
            } else {
                $scope.areaList4 = [];
            }
            $scope.SchoolMasterListOk4 = [];
            $scope.selectAllSchoolFlag4 = false;
        };

        $scope.areaChangeClear4 = function () {

            $scope.SchoolMasterListOk4 = [];
            $scope.selectAllSchoolFlag4 = false;
        };

        $scope.isSchoolMasterSelected4 = function (emp) {
            for (var index in $scope.SchoolMasterListOk4) {
                if ($scope.SchoolMasterListOk4[index].uid == emp.uid) {
                    return true;
                }
            }
            return false;
        };

        //选择校长
        $scope.SchoolMasterListOk4 = [];//已选择的校长
        $scope.selectOneSchoolMaster4 = function (emp) {
            for (var index in $scope.SchoolMasterListOk4) {
                if ($scope.SchoolMasterListOk4[index].uid == emp.uid) {
                    $scope.deleteOneSchoolMaster4(emp); return;
                }
            }
            $scope.SchoolMasterListOk4.push(emp);

            if ($scope.batchOperateCountNum4 > $scope.totalLeads4) {
                SweetAlert.swal("分配数量超过总数");
                $scope.batchSelecte4.batchNumSchool = 0;
                $scope.batchOperateCountNum4 = 0;
                return;
            }
            if ($scope.batchOperateCountNum4 > 2000) {
                SweetAlert.swal("一次最多分配2000条");
                $scope.batchSelecte4.batchNumSchool = 0;
                $scope.batchOperateCountNum4 = 0;
                return;
            }
            $scope.schoolMasterList[arguments[1]].selected = true
            $scope.batchOperateCountNumSchool4 = $scope.batchSelecte4.batchNumSchool * $scope.SchoolMasterListOk4.length;
        };

        $scope.schoolBatchAllotSaveNetwork4 = function () {
            if ($scope.batchSelecte4.batchNumSchool <= 0) { SweetAlert.swal("分配数量必须大于0"); $scope.batchNum4 = 0; return; }
            if ($scope.batchOperateCountNumSchool4 > $scope.totalLeads4) {
                warningAlert("分配数量不能大于可分配数量");
                $scope.batchSelecte4.batchNumSchool = 0;
                $scope.batchOperateCountNumSchool4 = 0;
                return;
            }
            if ($scope.batchOperateCountNum4 > 2000) {
                SweetAlert.swal("一次最多分配2000条");
                $scope.batchNum4 = 0;
                $scope.batchOperateCountNum4 = 0;
                return;
            }

            var param = {};
            if ($scope.isO2OOperationSpecialist()) {
                $scope.allotCrmLeadsStudentFilter4.isO2O = true;
                param.isO2O = true;
            }
            else {
                $scope.allotCrmLeadsStudentFilter4.isCurrentOrg = false;
            }
            if ($scope.isMine) {
                $scope.allotCrmLeadsStudentFilter4.currentUserId = localStorageService.get('user').id;
            }
            param.leadsFilter = $scope.allotCrmLeadsStudentFilter4;
            param.leadsFilter.total = $scope.batchSelecte4.batchNumSchool;
            param.empidList = [];
            //console.log($scope.SchoolMasterListOk);
            if ($scope.SchoolMasterListOk4.length <= 0) { SweetAlert.swal("请选择要分配的员工"); return; }
            //if($scope.SchoolMasterListOk.length > $scope.batchNumSchool){SweetAlert.swal("分配的员工数不能大于分配的Leads数量");return;}
            for (var i = 0; i < $scope.SchoolMasterListOk4.length; i++) {
                param.empidList.push($scope.SchoolMasterListOk4[i].uid);
            }

            var promise = LeadsStudentService.saveBatchAllot(param);
            promise.then(function (response) {
                if (response.status == "SUCCESS") {
                    if (response.data != null) {
                        var normalCount = response.data.normalCount;
                        var errorMsgs = response.data.errorMsgs;
                        $scope.alertErr = [];
                        $scope.alertErr[0] = {};
                        $scope.alertErr[0].err = response.error + ":分配数据" + normalCount + "条";

                        for (var i = 0; i < errorMsgs.length; i++) {
                            $scope.alertErr[i + 1] = {};
                            var msg = "";
                            msg += errorMsgs[i].name + " ";
                            msg += errorMsgs[i].phone + " ";
                            msg += errorMsgs[i].toSchoolName + " ";
                            msg += errorMsgs[i].reason + " ";
                            $scope.alertErr[i + 1].err = msg;
                        }
                        $scope.errType = 1;
                        $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/bd/leads/lead_err_model.html?' + new Date().getTime(), show: true });
                    } else {
                        SweetAlert.swal("批量分配成功");
                    }

                } else {
                    SweetAlert.swal(response.error);
                    return;
                }
                $scope.SchoolMasterListOk4 = [];//已选择的员工
                $scope.schoolMasterFilter4 = {};//清空查询条件
                $scope.batchSelecte4.batchNumSchool = 0;
                $scope.batchOperateCountNumSchool4 = 0;
                $scope.selectAllSchoolFlag4 = false;
                //刷新待分配学员
                $scope.allotCrmLeadsStudentListTableState4.pagination.start = 0;
                $scope.allotCrmLeadsStudentList4 = [];
                $scope.getAllotCrmLeadsStudentList4($scope.allotCrmLeadsStudentListTableState4);
            }, function (error) {
                SweetAlert.swal("跨校区批量分配失败");
            });
        };

        //===========================================================
        $scope.isMine = false;
        $scope.isSpecial = false;
        (function init() {

            //$scope.leadsRepeatAlert = false;
            if ($scope.isMobile) {
                $scope.mobile.getLists();
                $rootScope.authenticated = false;
                _getNumber();
            } else {
                if (check_null($routeParams.leads_id)) {
                    if (!isNaN($routeParams.leads_id)) {
                        $scope.viewCrmLeadsStudent({//控制台跳转到详情页
                            crm_student_id: $routeParams.leads_id
                        })
                    } else if ($routeParams.leads_id == 'batch') {
                        $scope.showBatchAllotView();//跳转到批量分配客户（leads）页面
                    } else if ($routeParams.leads_id == 'one') {
                        $scope.showAllotView();//跳转到分配客户（leads）页面
                    } else if ($routeParams.leads_id == 'add') {
                        $scope.showAddView();
                    }
                }

                var path = $location.absUrl();

                if (path.indexOf("/fb-admin/mine_batch_special_distribute") > 0 || path.indexOf("/fb-admin/mine_special_distribute") > 0) {
                    $scope.isMine = true;
                    $scope.isSpecial = true;
                }
                if (path.indexOf("/fb-admin/special_distribute") > 0 || path.indexOf("/fb-admin/mine_special_distribute") > 0) {
                    $scope.allotCrmLeadsStudentFilter.isCurrentOrg = true;
                    $scope.isSpecial = true;
                    $scope.showAllotView();
                }

                if (path.indexOf("/fb-admin/batch_special_distribute") > 0 || path.indexOf("/fb-admin/mine_batch_special_distribute") > 0) {
                    $scope.isSpecial = true;
                    $scope.isSpecialDistribute = true;
                    $scope.allotCrmLeadsStudentFilter4 = {
                        removeProtected: true,
                        removeAbnormal: true
                    };
                    if ($scope.isO2OOperationSpecialist()) {
                        $scope.allotCrmLeadsStudentFilter4.isO2O = true;
                    }
                    else {
                        $scope.allotCrmLeadsStudentFilter4.isCurrentOrg = false;
                    }

                    if ($scope.allotCrmLeadsStudentListTableState4) {
                        $scope.allotCrmLeadsStudentListTableState4.pagination.start = 0;
                        $scope.allotCrmLeadsStudentList4 = [];
                        $scope.getAllotCrmLeadsStudentList4($scope.allotCrmLeadsStudentListTableState4);
                    }

                    if ($scope.employeesListTableState4) {
                        $scope.employeesListTableState4.pagination.start = 0;
                        $scope.employeesList4 = [];
                        $scope.findAllEmployeesOfCurrentUserSchool4($scope.employeesListTableState4);
                    }

                    //获取大区信息
                    $scope.getDepartmentsOfDistrict4();


                    $scope.showBatchAllotView();
                }

                $scope.getAllSelected();
                $scope.getAllSelected4();
            }


            $timeout(function () {
                $("[data-toggle='tooltip']").tooltip();
            }, 1000);

        })();
        /*$scope.alertHide = function(){
         $scope.leadsRepeatAlert = false;
         }*/
        // add by fanl 2016-6-14 排试听更改为了弹窗
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
                $scope.order_rule_name = '1小时';

            }
            $scope.detail = angular.copy(row);
            // 将选中的本条信息同步显示到排课弹出框上
            $scope.detail.group_no = $scope.detail.name;
            $scope.banzuBelongs = $scope.detail.belong_user_name;
            $scope.onlyread = true;

            // 将type封装到对象中
            $scope.detail.type = type;
            // 获取leads的可排课时信息
            //  16-07-19-------------------s-------------
            /**
             * 通过是否传递参数来辨认是新增用户还是已存在用户
             */
            if (!$scope.detail.crm_student_id) {
                $scope.detail.crm_student_id = row.id
            }
            //  16-07-19-------------------n-------------
            //将学生可排课时从数据中定性查出，不采用下面通过时间计算得来的sql
            //例如：在crm_order_student_course中新增可排试听课数，
            //然后从此数据库中查出然后静态的呈现在页面上,模拟方法为getPlanAvaiableNum(非试听课也采用此方式)
            CustomerStudentCourseService.getLeadsCoursePlan($scope.detail.phone).then(function (result) {
                if (result.plan_available_num) {
                    $scope.plan_available_num = result.plan_available_num;
                    // 获取科目信息
                    CommonService.getSubjectIdSelect().then(function (result) {
                        $scope.omsSubject = result.data;
                        $scope.recordCoursePlanModal = $modal({ scope: $scope, templateUrl: 'partials/sos/customer/modal.coursePlanInfo.html', show: true, backdrop: "static" });
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
            //         $scope.recordCoursePlanModal = $modal({ scope: $scope, templateUrl: 'partials/sos/customer/modal.coursePlanInfo.html', show: true, backdrop: "static" });
            //     });
            // })
        }
        /**
         * 关闭排课的弹框
         */
        function canclePlanModal() {
            $scope.recordCoursePlanModal.hide();
        }
        //判断是否有到访记录
        $scope.findHaveDaoFang = function (detail, index) {
            $('popup').hide();
            var crm_student_id = detail.crm_student_id;
            $location.path('/sos_admin/customer_student_course/' + crm_student_id + "/3");
        }

        $scope.gotoshiting = function (user) {
            //  16-07-19-------------------s-------------
            /**
             * 通过是否传递参数来辨认是新增用户还是已存在用户
             */
            if (user) {
                // user.crm_student_id = user.id    @李世明 2016-09-23 没有id
                user.crm_student_id = user.id || user.crm_student_id
                LeadsStudentService.detail(user).then(function (result) {
                    $scope.detail = result;
                    if ($rootScope.modalIsPlan) {
                        $rootScope.modalIsPlan.hide();
                    }
                    addCoursePlanInfo($scope.detail, 3);

                })
            }
            //  16-07-19-------------------n-------------
            else {
                $scope.modal.hide();
                addCoursePlanInfo($scope.detail, 3);
            }
            _detail($scope.detailnew)
            isLock()
        }

        /**
         * 展示记录弹窗
         */
        function showRecordModal(row) {
            $scope.recordModalTitle = row.name + ' 的记录';
            $scope.detail = angular.copy(row);
            $scope.recordModal = $modal({ scope: $scope, templateUrl: 'partials/sos/leads/modal.record.html', show: true, backdrop: "static" });
        }
        /**
         * 获取当前tab页
         */
        function getTabIndex(obj) {
            if (obj.title === '沟通记录') {
                $scope.recordTab = '0';
            } else if (obj.title === '邀约记录') {
                $scope.recordTab = '1';
            } else if (obj.title === '排课记录') {
                $scope.recordTab = '2';
            }
        }

        //邀约的编辑
        $scope.zhifangbianjisubmitfalse = function zhifangbianjisubmitfalse() {
            $scope.zhifangbianjisubmit = false
        }
        $scope.laifangbianji5 = true;
        $scope.zhifangbianjisubmit = false
        $scope.tachlaifang = false;

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
                $scope.search2();
                $scope.schoolsearch2()
                // saveInvitationDetail($scope.visitvlu,2)
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
                $scope.search2()
                $scope.schoolsearch2();
                $scope.modal.hide();
            })



        }


        /**
         * yes页面消课
         */
        /*function yesconsume(omsCoursePlan) {
         SweetAlert.swal({
         title: "系统内消课无法打印课票,是否确认消课？",
         type: "warning",
         showCancelButton: true,
         confirmButtonColor: '#fe9900',
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         closeOnConfirm: true
         }, function(confirm) {
         if (confirm) {
         var promise = CoursePlanService.yesconsume(omsCoursePlan);
         promise.then(function() {
         $scope.callServer($scope.myCoursePlanTableState);
         //$scope.callServerrecord($scope.myCoursePlanRecordTableState);
         }, function(error) {
         });
         }
         }
         );
         }*/
        /**
         * 关闭记录弹窗
         */
        function closeRecordModal() {
            $scope.showListView();
            $scope.recordModal.hide();
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
         * 编辑排课
         */
        /* function showEditCoursePlan(row){
         var title = "";
         var url="";
         if(1==row.type){
         title="学员排课编辑"
         }else if(2==row.type){
         title="一对多排课编辑"
         }else if(3==row.type){
         title="试听排课编辑";
         }
         $scope.select = {};
         $scope.show = {
         getEndTime: getEndTime//自动生成结束时间
         };
         $scope.TIME_SIZE = [
         {id:1,name:'0.5小时'},{id:2,name:'1小时'},{id:3,name:'1.5小时'},{id:4,name:'2小时'},{id:5,name:'2.5小时'},{id:6,name:'3小时'},
         ];
         $scope.OmsCoursePlanVoForEdit = {};
         $scope.teachername = {};
         $scope.teachername.mobile=row.mobile;
         $scope.teachername.user_id=row.user_id;
         $scope.teachername.type=row.type;
         $scope.teachername.crm_order_student_course_id=row.crm_order_student_course_id;
         $scope.OmsCoursePlanVoForEdit.crm_order_student_course_id = row.crm_order_student_course_id;
         $scope.OmsCoursePlanVoForEdit.id = row.id;
         $scope.OmsCoursePlanVoForEdit.groupid = row.groupid;
         $scope.OmsCoursePlanVoForEdit.user=row.user_id;
         $scope.OmsCoursePlanVoForEdit.start_time=row.start_time;
         $scope.OmsCoursePlanVoForEdit.end_time=row.end_time;
         $scope.select.time= new Date($scope.OmsCoursePlanVoForEdit.start_time).Format("hh:mm");
         $scope.select.timeEnd= new Date($scope.OmsCoursePlanVoForEdit.end_time).Format("hh:mm");
         $scope.select.startDate= new Date($scope.OmsCoursePlanVoForEdit.start_time).Format("yyyy-MM-dd");
         $scope.select.startDate=new Date( $scope.select.startDate);
         $scope.select.timeSize=row.course_num/0.5;
         $scope.OmsCoursePlanVoForEdit.subject_name = row.subject_name;
         $scope.OmsCoursePlanVoForEdit.subject_id = row.subject_id;
         $scope.OmsCoursePlanVoForEdit.crmCustomerStudentId = row.crmStudentId;
         $scope.OmsCoursePlanVoForEdit.type=row.type;
         $scope.OmsCoursePlanVoForEdit.order_no=row.order_no;
         $scope.OmsCoursePlanVoForEdit.orderId=row.orderId;
         $scope.modalTitle = title;
         $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/coursePlan/modal.editcourseplan.html', show: true });
         }*/
        /*$scope.SubjectList = function SubjectList() {
         $scope.CStudentSchoolTeacherList = true;
         $scope.OmsCoursePlanVoForEdit;
         //console.log('call server'+tableState);
         CoursePlanService.SubjectList($scope.OmsCoursePlanVoForEdit).then(function (result) {
         $scope.Subjectdisplayed = result.data.data.studentOrder;
         $scope.OmsCoursePlanVoForEdit.plan_available_num=result.data.data.plan_available_num;
         $scope.CStudentSchoolTeacherList = false;
         });
         };*/
        /**
         * 教师列表
         */
        /*  $scope.teachernow = function teachernow() {
         var start = 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
         var  number = 10;  // Number of entries showed per page.
         CoursePlanService.teachernow(start, number,$scope.teachername).then(function (result) {
         $scope.teacherdisplayed = result.data.data.list;
         });
         };
         $scope.selectSubject = function(){
         $scope.getCSShooleTeacherByFilters($scope.myCoursePlanTableState);
         }*/
        /**
         * 教师列表
         */
        /*$scope.getCSShooleTeacherByFilters = function getCSShooleTeacherByFilters(tableState) {
         $scope.CStudentSchoolTeacherList = true;
         $scope.myCoursePlanTableState = tableState;
         var pagination = tableState.pagination;
         $scope.OmsCoursePlanVoForEdit;
         $scope.CoursePlanTableState=tableState;
         $scope.CoursePlanTableState.crmCustomerStudentId=$scope.OmsCoursePlanVoForEdit.crmStudentId;
         $scope.CoursePlanTableState.omscourseplanid=$scope.OmsCoursePlanVoForEdit.id;
         var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
         var  number = pagination.number || 10;  // Number of entries showed per page.
         //console.log('call server'+tableState);
         CoursePlanService.EditCoursePlan(start, number,$scope.CoursePlanTableState,$scope.OmsCoursePlanVoForEdit).then(function (result) {
         $scope.displayed = result.data.data.list;
         tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
         $scope.CStudentSchoolTeacherList = false;
         });
         };*/
        /*$scope.select = {};
         $scope.show = {
         getEndTime: getEndTime//自动生成结束时间
         };
         $scope.TIME_SIZE = [
         {id:1,name:'0.5小时'},{id:2,name:'1小时'},{id:3,name:'1.5小时'},{id:4,name:'2小时'},{id:5,name:'2.5小时'},{id:6,name:'3小时'},
         ];
         */
        /**
         * 得到结束时间
         * 并得到selected 开始和结束时间戳
         */
        /*function getEndTime(){
         if($scope.select.startDate &&$scope.select.time && $scope.select.timeSize){
         // 得到开始时间的毫秒数
         try{
         var startDate = $scope.select.startDate.Format("yyyy-MM-dd");
         }
         catch(e){
         var startDate = $scope.select.startDate;
         }
         var startTime = startDate + " " + $scope.select.time+":00";
         var date = new Date(startTime);

         // 将startTime转变为毫秒数
         $scope.plan_available_num_old=$scope.OmsCoursePlanVoForEdit.plan_available_num-$scope.select.timeSize*0.5
         if( $scope.plan_available_num_old<0){

         $scope.select = {};
         SweetAlert.swal("课时数不够");
         }
         else{

         var timestampStart = date.getTime();
         $scope.select.timestampBaseStart = timestampStart;
         var timestampEnd =  timestampStart +(($scope.select.timeSize)*60*30*1000);
         $scope.select.timestampBaseEnd = timestampEnd;
         $scope.select.timeEnd = new Date(timestampEnd).Format("hh:mm");
         /*if($scope.select.timestampBaseStart<new Date().getTime()){//判断是否小于当前时间
         $scope.select = {};
         SweetAlert.swal('时间已经过去了，不容许排课');
         return false;
         }
         // 查询时间条件的开始时间、结束时间、页面上选择的时间段的显示
         $scope.startTime = startTime;
         $scope.endTime = startDate + " " + $scope.select.timeEnd +":00";
         $scope.startEndTime = startDate + " " + $scope.select.time + "--"+$scope.select.timeEnd;
         }
         }
         }*/

        /**
         * 保存排课
         */
        /*function EditCoursePlanNow() {
         var index = $("input[name='cscourse']:checked").val();
         if(index == undefined){
         var name=null;
         for(var i=0;i<$scope.Subjectdisplayed.length;i++){
         var subject=$scope.Subjectdisplayed[i];
         if(subject.id==$scope.OmsCoursePlanVoForEdit.subjectId){
         name=subject.name;
         break;
         }


         }
         console.log(name);
         console.log($scope.teacherdisplayed[0].subject_name);
         console.log($scope.teacherdisplayed[0].subject_name.indexOf(name));
         if(name!=null && $scope.teacherdisplayed[0].subject_name.indexOf(name)<0){
         SweetAlert.swal("请选择符合当前科目的老师");
         return;
         }
         }

         $scope.OmsCoursePlanVoForEdit;
         $scope.OmsCoursePlanVoForEdit.start=new Date($scope.startTime).getTime();
         $scope.OmsCoursePlanVoForEdit.end=new Date($scope.endTime).getTime();
         if(index == undefined){

         }
         else{
         $scope.OmsCoursePlanVoForEdit.user_id=$scope.displayed[index].userId;
         }
         if(_ifNotOut23($scope.select.timestampBaseEnd)){
         SweetAlert.swal('排课时间不能超过23点');
         return false;
         }
         if(_ifNotOneDay($scope.select.timestampBaseStart,$scope.select.timestampBaseEnd)){
         SweetAlert.swal('排课时间不能跨天');
         return false;
         }
         $scope.OmsCoursePlanVoForEdit.plan_available_num=$scope.plan_available_num_old;
         var promise = CoursePlanService.EditCoursePlanNow($scope.OmsCoursePlanVoForEdit);
         promise.then(function(result) {
         var response = result;
         if(response.status == 'SUCCESS'){
         SweetAlert.swal(result.data);
         $scope.dataLoading = false;
         $scope.modal.hide();
         $scope.callServer($scope.myCoursePlanTableState);
         }else if(response.status == 'FAILURE'){
         var data = response.data;
         $scope.warningStudentList = data;
         // 如果是字符串，直接alert
         if(typeof warningStudentList == "string"){
         SweetAlert.swal(data);
         }else{
         if($scope.warningStudentList.length > 0){
         $scope.confilctModalTitle = "排课时间冲突列表";
         $scope.recordModal = $modal({scope: $scope, templateUrl: 'partials/sos/customer/modal.conflict.coursePlan.html', show: true, backdrop:"static"});
         }
         }
         }
         }, function(error) {
         warningAlert("编辑排课失败");
         $scope.dataLoading = false;
         });
         }*/
        /**
         * 判断是否超过23点
         * @param start
         * @param end
         * @returns {boolean}
         * @private
         */
        /*   function _ifNotOut23(end){
         var en = new Date(end).getHours();
         var end_m = new Date(end).getMinutes();
         var end_s = new Date(end).getSeconds();
         if(en>=23 ||(en==0&&end_m==0&&end_s==0)){
         return true;
         }
         /*  if(en>23 ||(en==0&&end_m==0&&end_s==0)){
         return false;
         }
         return false;
         }*/
        /**
         * 判断时间是否夸天
         * @param start  时间戳
         * @param end 时间戳
         * @returns {boolean}
         * @private
         */
        /*  function _ifNotOneDay(start,end){
         var st = new Date(start).getHours();
         var en = new Date(end).getHours();
         var end_m = new Date(end).getMinutes();
         var end_s = new Date(end).getSeconds();
         if(st > en){//开始销售数大于结束时间小时数
         if(end_m==0 &&  end_s==0 && en==0){
         return false;
         }else{
         return true;
         }

         }
         /*  if(en>23 ||(en==0&&end_m==0&&end_s==0)){
         return false;
         }
         return false;
         }*/
        /**
         * 关闭编辑弹窗
         */
        /*function channleEdit(){
         $scope.select = {};
         $scope.modal.hide();
         $scope.callServer($scope.myCoursePlanTableState);
         // $scope.callServerrecord($scope.myCoursePlanRecordTableState);
         }*/

        //    校区排序
        var orderBy1 = 0;
        var orderBy2 = 0;
        var orderBy3 = 0;
        $scope.orderBy = function (flag) {
            //邀约时间
            if (flag == 1) {
                if ((orderBy1 % 2) == 0) {
                    $scope.myCrmLeadsStudentFilter.sortOrder = 1
                } else {
                    $scope.myCrmLeadsStudentFilter.sortOrder = 2
                }
                $scope.myCrmLeadsStudentFilter.orderType = 1
                orderBy1++; orderBy2 = 0; orderBy3 = 0;
            }
            //到访时间
            if (flag == 2) {
                if ((orderBy2 % 2) == 0) {
                    $scope.myCrmLeadsStudentFilter.sortOrder = 2
                } else {
                    $scope.myCrmLeadsStudentFilter.sortOrder = 1
                }
                $scope.myCrmLeadsStudentFilter.orderType = 2
                orderBy1 = 0; orderBy2++; orderBy3 = 0;
            }
            //意向程度
            if (flag == 3) {
                if ((orderBy3 % 2) == 0) {
                    $scope.myCrmLeadsStudentFilter.sortOrder = 2
                } else {
                    $scope.myCrmLeadsStudentFilter.sortOrder = 1
                }
                $scope.myCrmLeadsStudentFilter.orderType = 3
                orderBy1 = 0; orderBy2 = 0; orderBy3++;
            }
            $scope.getList($scope.myCrmLeadsStudentListTableState)
        }
        //    校区意向客户排序
        var myorderBy1 = 0;
        var myorderBy2 = 0;
        var myorderBy3 = 0;
        $scope.myorderBy = function (flag) {

            if (flag == 1) {
                if ((myorderBy1 % 2) == 0) {
                    $scope.schoolCrmLeadsStudentFilter.sortOrder = 1
                } else {
                    $scope.schoolCrmLeadsStudentFilter.sortOrder = 2
                }
                $scope.schoolCrmLeadsStudentFilter.orderType = 1
                myorderBy1++; myorderBy2 = 0; myorderBy3 = 0;
            }

            if (flag == 2) {
                if ((myorderBy2 % 2) == 0) {
                    $scope.schoolCrmLeadsStudentFilter.sortOrder = 2
                } else {
                    $scope.schoolCrmLeadsStudentFilter.sortOrder = 1
                }
                $scope.schoolCrmLeadsStudentFilter.orderType = 2
                myorderBy1 = 0; myorderBy2++; myorderBy3 = 0;
            }

            if (flag == 3) {
                if ((myorderBy3 % 2) == 0) {
                    $scope.schoolCrmLeadsStudentFilter.sortOrder = 2
                } else {
                    $scope.schoolCrmLeadsStudentFilter.sortOrder = 1
                }
                $scope.schoolCrmLeadsStudentFilter.orderType = 3
                myorderBy1 = 0; myorderBy2 = 0; myorderBy3++;
            }
            $scope.getSchoolCrmLeadsStudentList($scope.schoolCrmLeadsStudentListTableState)
        }




    }






]);



ywsApp.controller('mobileUserCtrl', ['$scope', '$rootScope', 'EmployeeService', 'AuthenticationService',
    function ($scope, $rootScope, EmployeeService, AuthenticationService) {
        (function init() {

            var obj = {
                user: {
                    id: AuthenticationService.currentUser().id
                }
            };

            EmployeeService.getEmployeesByFilters(obj, 0, 10).then(function (result) {
                if (result.data && result.data.list.length > 0) {
                    $rootScope.landline = result.data.list[0].landline;
                }
            });
        })()
    }
]);

function onGetReadyState() {
    if (document.readyState == "complete") {
        clearInterval(start);
        T_InitCPhoneC(phone);
    }
}

function T_GetEvent(uID, utype, lhandle, result, param, szdata, szdataex) {
    switch (utype) {
        case CPCEvent_PhoneHook:
            {
                if (result > 0) {
                    AppendStatusEx(uID + 1, '电话摘机 [来电], 响铃次数:' + result);
                    //屏幕右小角文字提示,不受浏览器最小化影响，3000 表示3秒后自动隐藏或点击提示文字的窗口会立即隐藏，如果是0 表示一直显示，直到用户点击提示文字
                    CPC_Tool(CPC_TOOL_SHOWTOOLTIP, 3000, "电话摘机[来电]", "", "", 0);
                } else {
                    AppendStatusEx(uID + 1, '电话摘机 [去电]');
                    CPC_Tool(CPC_TOOL_SHOWTOOLTIP, 3000, "电话摘机[去电]", "", "", 0);
                }
                //var v=CPC_RecordFile(0,CPC_RECORD_FILE_START,CPC_WAV_FORMAT_MP38K8B,0,"d:\\a.wav");

            } break;

        case CPCEvent_PhoneHang:
            {
                AppendStatusEx(uID + 1, '电话挂机,同时主动软挂机');
                CPC_SetDevCtrl(uID, CPC_CTRL_DOHOOK, 0);
                CPC_Tool(CPC_TOOL_SHOWTOOLTIP, 3000, "电话挂机,同时主动软挂机", "", "", 0);


            } break;

        case CPCEvent_StopCallIn:
            {
                AppendStatusEx(uID + 1, '产生来电未接电话:' + szdata);
            } break;

        case CPCEvent_UploadSuccess:
            {
                AppendStatusEx(uID, '上传录音成功:' + ' szdata:' + szdata);
            } break;

        case CPCEvent_UploadFailed:
            {
                AppendStatusEx(uID, '上传录音失败: result:' + result + ' param:' + param + ' szdata:' + szdata);
            } break;

        case CPCEvent_PSTNFree:
            {
                AppendStatusEx(uID + 1, '线路已经空闲');
                //空文字串，表示如果还没有关闭，就立即关闭右下角的提示文字窗口
                CPC_Tool(CPC_TOOL_SHOWTOOLTIP, 0, "", "", "", 0);
            } break;

        case CPCEvent_CallLog:
            {
                AppendStatusEx(uID + 1, '一个新的呼叫日志');

                if (T_UploadCalllog(uID, config.endpoints.sos.InvitationCommunication + '/callcenter') > 0) {
                    alert("开始上传通话记录...");
                    AppendStatusEx(uID + 1, '开始上传通话记录...');
                }
            } break;

        case CPCEvent_PhoneDial:
            {
                AppendStatusEx(uID + 1, '话机拨号：' + szdata);
                CPC_Tool(CPC_TOOL_SHOWTOOLTIP, 5000, "话机拨号 " + szdata, "", "", 0);
            } break;

        case CPCEvent_Busy: case CPCEvent_RemoteHang:
            {
                AppendStatusEx(uID + 1, '检测到忙音或对方挂机');
                T_StopDial();


            } break;

        case CPCEvent_DialTone:
            {
                AppendStatusEx(uID + 1, '检测到拨号音');
            } break;

        case CPCEvent_DialEnd:
            {
                if (result == DTT_SEND) {
                    AppendStatusEx(uID + 1, '发送号码完毕: ' + szdata);
                } else {
                    AppendStatusEx(uID + 1, '软拨号完毕: ' + szdata);
                }
            } break;

        case CPCEvent_CallIn:
            {
                if (param == RING_HIGH) {
                    AppendStatusEx(uID + 1, '来电响铃,  次数：' + result);
                } else {   //如果要在响铃时自动软摘机，建议不要在RING_HIGH正在响铃时软摘机，在RING_LOW里进行
                    //CPC_SetDevCtrl(uID+1,CPC_CTRL_DOHOOK,1);
                    AppendStatusEx(uID + 1, '来电静音,  次数：' + result);
                }
            } break;

        case CPCEvent_RingBack:
            {
                T_StartRecordFile();
                AppendStatusEx(uID + 1, '号码已经拨完：' + szdata + " result:" + result + " param:" + param);
            } break;

        case CPCEvent_GetCallID:
            {
                var v = CPC_Tool(CPC_TOOL_LOCATION, 0, szdata, "", "", 0);
                if (v == 0) v = "无信息";
                else if (v == -1) v = "错误号码";
                AppendStatusEx(uID + 1, '接收到来电号码：' + szdata + " 归属地:" + v);
                CPC_Tool(CPC_TOOL_SHOWTOOLTIP, 5000, szdata + " 来电", "", "", 0);
            } break;

        case CPCEvent_DevCtrl:
            {
                if (result == CPC_CTRL_DOHOOK) {
                    if (param == 1) {
                        //document.getElementById('dohook').checked = true;
                        AppendStatusEx(uID + 1, '软摘机控制');
                    }
                    else {
                        //document.getElementById('dohook').checked = false;
                        AppendStatusEx(uID + 1, '软挂机控制');
                    }
                } else {
                    AppendStatusEx(uID + 1, '设备控制改变, ctrl:' + result + ' value:' + param);
                }
            } break;

        case CPCEvent_DoStartDial:
            {
                if (result == CHECKDIALTONE_FAILED) {
                    AppendStatusEx(uID + 1, '自动拨号失败，未检测到拨号音,请检查线路:' + szdata);
                } else if (result == CHECKDIALTONE_BEGIN) {
                    AppendStatusEx(uID + 1, '开始检测拨号音:' + szdata);
                } else if (result == CHECKDIALTONE_ENDDIAL) {
                    AppendStatusEx(uID + 1, '检测拨号音成功，开始拨号:' + szdata);
                } else if (result == CHECKDIALTONE_TIMEOUTDIAL) {
                    AppendStatusEx(uID + 1, '检测拨号音超时,强制开始拨号:' + szdata);
                } else if (result == CHECKDIALTONE_DIALOUT) {
                    AppendStatusEx(uID + 1, '直接拨号:' + szdata);
                } else if (result == CHECKDIALTONE_SENDNUMBER) {
                    AppendStatusEx(uID + 1, '发送dtmf:' + szdata);
                } else if (result == CHECKDIALTONE_FULLCODE) {
                    AppendStatusEx(uID + 1, '线路拨得完整号码:' + szdata);
                } else {
                    AppendStatusEx(uID + 1, '开始拨号:' + szdata + ' result:' + result);
                }
            } break;

        case CPCEvent_WordHook:
            {
                var v = CPC_Tool(CPC_TOOL_LOCATION, 0, szdata, "", "", 0);
                if (v > 0) v = '[' + v + ']';
                else v = "";
                AppendStatus('划取的电话号码：' + szdata + ' ' + v + ' [可以直接呼叫或显示提示框]');
                IC_StartDial(0, szdata, 0);
            } break;

        case CPCEvent_PlayFileEnd:
            {
                AppendStatus('播放文件结束');
            } break;

        case CPCEvent_PlugIn:
            {
                AppendStatus('设备已经插入,开始尝试打开设备...');
                T_OpenDevice();
            } break;

        case CPCEvent_PlugOut:
            {
                CPC_CloseDevice(0, 0);//关闭设备
                AppendStatusEx(uID + 1, '设备已经被拔掉,启动了自动插入检测,请插入设备...');
                CPC_OpenDevice(ODT_PLUGIN, 0, "");//打开设备插入检测模块
            } break;

        default:
            {
                AppendStatusEx(uID < 255 ? (uID + 1) : uID, "type=" + utype + " handle=" + lhandle + " result=" + result + " param=" + param + " szdata=" + szdata);
            } break;
    }
}

function getnowtime() {
    var vd = new Date();
    return '[' + T_Format2d(vd.getHours()) + ':' + T_Format2d(vd.getMinutes()) + ':' + T_Format2d(vd.getSeconds()) + ' ' + T_Format3d(vd.getMilliseconds()) + ']';
}

function T_UploadCalllog(uID, url) {
    if (1 > 0) {
        // alert("calllog");
        var lBeginTime = CPC_CallLog(uID, CPC_CALLLOG_BEGINTIME, 0, 0);
        var lEndTime = CPC_CallLog(uID, CPC_CALLLOG_ENDTIME, 0, 0);
        if (lEndTime - lBeginTime < 3) {
            AppendStatusEx(uID + 1, "时间太短，丢弃");
            return;
        }
        var vd = new Date(lBeginTime * 1000);
        var szBeginTime = vd.getFullYear() + T_Format2d((vd.getMonth() + 1)) + T_Format2d(vd.getDate()) + T_Format2d(vd.getHours()) + T_Format2d(vd.getMinutes()) + T_Format2d(vd.getSeconds());
        vd = new Date(lEndTime * 1000);
        var szEndTime = vd.getFullYear() + T_Format2d((vd.getMonth() + 1)) + T_Format2d(vd.getDate()) + T_Format2d(vd.getHours()) + T_Format2d(vd.getMinutes()) + T_Format2d(vd.getSeconds());

        var lSerial = CPC_DevInfo(uID, CPC_DEVINFO_GETSERIAL);
        var lRingBackTime = CPC_CallLog(uID, CPC_CALLLOG_RINGBACKTIME, 0, 0);
        var lConnectedTime = CPC_CallLog(uID, CPC_CALLLOG_CONNECTEDTIME, 0, 0);
        var lCallType = CPC_CallLog(uID, CPC_CALLLOG_CALLTYPE, 0, 0);
        var lCallResult = CPC_CallLog(uID, CPC_CALLLOG_CALLRESULT, 0, 0);
        var vcallid = CPC_CallLog(uID, CPC_CALLLOG_CALLID, 0, 0);
        var vfilepath = CPC_CallLog(uID, CPC_CALLLOG_CALLRECFILE, 0, 0);
        var vd = new Date();
        var vsubpath = 'subpath=' + 'remoterec/' + vd.getFullYear() + T_Format2d((vd.getMonth() + 1)) + '/' + T_Format2d(vd.getDate());
        var vlog = vsubpath;
        vlog += '&uubegintime=' + szBeginTime + '&uuendtime=' + szEndTime;
        vlog += '&uucalltype=' + lCallType + '&uucallresult=' + lCallResult + '&uudevserial=' + lSerial + '&uucallid=' + vcallid + '&vfilepath=' + vfilepath;
        var fullurl = url + '?' + encodeURI(vlog);
        // console.log(fullurl);
        // console.log(vfilepath);
        //alert(fullurl);
        AppendStatusEx(uID + 1, "上传记录:" + fullurl);


        var vret = CPC_Remote(CPC_REMOTE_UPLOAD_START, OPTYPE_REMOVE, fullurl, vfilepath, 0, 0);//
        //alert(vret);
        CPC_CallLog(uID, CPC_CALLLOG_RESET, 0, 0);
        return 1;
    } else {
        return 0;
    }
}

function AppendStatus(szStatus) {
    //alert(szStatus);
    //CPC_Tool(CPC_TOOL_WRITELOG,1,szStatus,0,0,0);
    //var vsrc=document.getElementById("StatusArea").value;
    //  document.getElementById("StatusArea").value = getnowtime()+' '+szStatus+"\r\n"+vsrc;
}
function AppendStatusEx(ch, szStatus) {
    //AppendStatus("通道"+ch.toString()+": "+szStatus);
}

function T_CheckPSTNEnd(code) {
    if (CPC_Tool(CPC_TOOL_PSTNEND, 0, code, "", "", 0) > 0)
        alert('号码长度结束');
    else
        alert('号码长度未结束');
}

function T_CheckLocation(code) {
    var v = CPC_Tool(CPC_TOOL_LOCATION, 0, code, "", "", 0);
    if (v == 0) alert('未找到归属地');
    else if (v < 0) alert('信息错误');
    else alert(code + ' 归属地为:  ' + v);//失败就返回<=0的值
}

function T_InitCPhoneC(phone) {
    //CPC_addobject - 在页面里添加插件
    //true:显示控件图标
    //T_GetEvent: 回调函数名
    //true:关闭页面时自动关闭设备
    //  AppendStatus("技术支持QQ: 1437382466");

    var vret = CPC_AddObject(false, T_GetEvent, false);


    if (vret == 1) {

        T_OpenDevice(phone);
    } else if (vret == -997) {

    } else if (vret == -998) {
        AppendStatus("插件还没有安装，请确认已安装驱动并使用32位浏览器:" + navigator.platform);
    } else {
        AppendStatus("初始化错误！！！！");
    }
}

function T_OpenDevice(phone) {

    var vret = CPC_OpenDevice(0, 0, '');

    if (vret > 0) {
        var vDllVer = CPC_DevInfo(0, CPC_DEVINFO_FILEVERSIONL);
        AppendStatus("打开设备成功：" + vret + "   DLL版本:" + vDllVer);
        var i;
        CPC_SetParam(0, CPC_PARAM_TOOLTIPFONTSIZE, 20);
        for (i = 0; i < CPC_DevInfo(0, CPC_DEVINFO_GETCHANNELS); i++) {
            console.log("for");
            //CPC_SetDevCtrl(0,CPC_CTRL_WATCHDOG,1);
            //外地手机号码自动加0，本地自动去0; 必须设置本地城市区号才会起作用
            CPC_SetParam(i, CPC_PARAM_MOBILEZERO, 1);
            //CPC_SetParam(i, CPC_PARAM_AM_LINEIN, 4);//修改linein增益
            //CPC_SetParam(i, CPC_PARAM_AM_MIC, 1);//修改mic增益
            //CPC_SetParam(i,CPC_PARAM_DTMFCALLIDVOL,10);
            //CPC_SetDevCtrl(i,CPC_CTRL_RECVFSK,0);
            //CPC_SetDevCtrl(i,CPC_CTRL_RECVDTMF,0);
            //CPC_SetDevCtrl(i,CPC_CTRL_RECVSIGN,0);
            //CPC_SetDevCtrl(i,CPC_PARAM_RINGTHRESHOLD,15);
            //CPC_SetDevCtrl(i,CPC_PARAM_RINGHIGHELAPSE,4000);



            var vSerial = CPC_DevInfo(i, CPC_DEVINFO_GETSERIAL);
            var vDevtype = CPC_DevInfo(i, CPC_DEVINFO_GETTYPE);

            var vSign = CPC_General(i, CPC_GENERAL_GETDEVICESIGN, 0, "");
            if (CPC_DevInfo(i, CPC_DEVINFO_CHECKDEVICESIGN) == 1) {
                //bohao
                console.log(phone);

                T_StartDial(phone, 0);
                //AppendStatusEx(i+1,"设备码:"+vSign+"[已授权] 序列号:"+vSerial+" 设备类型:0x"+vDevtype.toString(16)+"["+IC_GetDeviceName(vDevtype)+"]");
            } else {
                alert("设备试用到期，请联系客服");
                //AppendStatusEx(i+1,"设备码:"+vSign+"[**未授权的设备**到期后自动失效,仅做开发测试,开发后联系qq:969571843 购买授权好的设备] 序列号:"+vSerial+" 设备类型:0x"+vDevtype.toString(16)+"["+IC_GetDeviceName(vDevtype)+"]");
            }
        }
        //CPC_Tool(CPC_TOOL_WORDHOOK, 1, "", "", "", 0);
        //AppendStatus("已经启动划词取号,您可以划取电话号码[3-32位数字]，可以包含括号,逗号和和分隔号");
        //CPC_General(DEV_ALL_CHANNELID, CPC_GENERAL_STARTSHARE, 4015, "");
        //AppendStatus("已经启动设备共享,您可以在其它终端输入 http://本机IP:4015/testcphonec.cpc 来测试访问本设备");

    } else {

        CPC_Tool(CPC_TOOL_SHOWTOOLTIP, 3000, "打开设备失败", "", "", 0);
        if (vret == BCERR_DEVEXCLUSIVE) {
            //AppendStatus("打开设备失败: *****设备可能被占用*****");
        } else {
            //AppendStatus("打开设备失败: "+vret);
        }
        CPC_OpenDevice(ODT_PLUGIN, 0, "");//打开设备插入检测模块
        //AppendStatus("启动设备插入检测，请插入设备...");
    }
}

function T_CloseDevice() {
    AppendStatus("关闭设备");
    CPC_CloseDevice();
}

function T_StartPlayFile() {
    var vFilePath = CPC_Tool(CPC_TOOL_SELECTFILE, 0, "wav files,mp3 files|*.wav;*.mp3|all files|*.*||", 0, 0, 0);
    if (vFilePath.length > 0) {
        var vret = CPC_PlayFile(0, CPC_PLAY_FILE_START, 0, 0, vFilePath);
        if (vret <= 0) {
            AppendStatusEx(1, "放音失败: id=" + vret + " " + vFilePath);
        } else {
            AppendStatusEx(1, "开始放音: " + vFilePath);
        }
    }
}

function T_StopPlayFile() {
    CPC_PlayFile(0, CPC_PLAY_FILE_STOPALL, 0, 0, "");
    AppendStatusEx(1, "停止播放");
}

function T_StartRecordFile() {
    var vFilePath = "C:/RadioRecord/record.mp3";


    //  AppendStatus("选择文件: "+vFilePath);
    //T_StopRecordFile();
    var vFormatID = CPC_WAV_FORMAT_MP38K8B;//选择使用1K/S的mp3压缩格式录音
    var vmask = 0;//RECORD_MASK_ECHO|RECORD_MASK_AGC;//使用回音抵消后并且自动增益的数据
    var v = CPC_RecordFile(0, CPC_RECORD_FILE_START, vFormatID, vmask, vFilePath);
    alert(v);
    if (v <= 0) {
        alert("录音失败: id=" + v + " " + vFilePath);
        AppendStatus("录音失败: id=" + v + " " + vFilePath);
    } else {
        AppendStatus("开始录音文件: id=" + v + "  " + (0, CPC_RECORD_FILE_PATH, v, 0, ''));
    }



}

function T_StopRecordFile() {
    CPC_RecordFile(0, CPC_RECORD_FILE_STOPALL, 0, 0, 0);
    AppendStatusEx(1, "停止录音");
}

function T_StartDial(code, vsub) {

    //如果电话机拿着，不软摘机直接发送号码
    if (IC_StartDial(0, code, vsub) == BCERR_UNSUPPORTFUNC) {
        alert('设备不支持直接电脑软拨号，请先拿起电话机！');
    }

}

function T_StopDial() {
    CPC_General(0, CPC_GENERAL_STOPDIAL, 0, '');
    CPC_SetDevCtrl(0, CPC_CTRL_DOHOOK, 0);

}

function T_RefuseCallIn() {
    var vRet = CPC_General(0, CPC_GENERAL_STARTREFUSE, 0, NULL);
    if (vRet == BCERR_UNSUPPORTFUNC) {
        alert("设备不支持该功能");
    } else if (vRet == BCERR_REFUSENOTCALLIN) {
        alert("没有来电, 无效的拒接");
    } else {
        AppendStatusEx(1, "拒接来电...");
    }
}

function T_SelectDoPlayMux() {
    CPC_SetDevCtrl(0, CPC_CTRL_PLAYMUX, document.getElementById('doplaymux').value);
}

function T_DoHook() {

    if (CPC_SetDevCtrl(0, CPC_CTRL_DOHOOK, document.getElementById('dohook').checked) == BCERR_UNSUPPORTFUNC) {
        document.getElementById('dohook').checked = false;
        AppendStatusEx(1, "设备不支持");
    }
}
function T_DoPhone() {
    if (CPC_SetDevCtrl(0, CPC_CTRL_DOPHONE, document.getElementById('dophone').checked ? 0 : 1) == BCERR_UNSUPPORTFUNC) {
        document.getElementById('dophone').checked = false;
        AppendStatusEx(1, "设备不支持");
    }
}
