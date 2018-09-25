'use strict';

/**
 * The class manange controller.
 *
 * @author czq
 * @version 1.0
 */
angular.module('ywsApp').controller('SNPClassManagementController', [
    '$scope', '$modal', '$rootScope', 'SweetAlert', 'ClassManagementService', 'ProductService', 'OrderService',
    'CommonService', 'AuthenticationService', 'localStorageService', 'CustomerStudentCourseService',
    'ClassStudentAttendenceService', 'ClassStudentRecordService', 'CustomerStudentService','$mtModal','PromotionMTServer','ColEdit',
    function ($scope, $modal, $rootScope, SweetAlert, ClassManagementService, ProductService, OrderService,
              CommonService, AuthenticationService, localStorageService, CustomerStudentCourseService,
              ClassStudentAttendenceService, ClassStudentRecordService, CustomerStudentService,$mtModal,PromotionMTServer,ColEdit) {

        $scope.getMyCrmCustomerStudentClassList = getMyCrmCustomerStudentClassList;
        $scope.showAddClassView = showAddClassView;
        $scope.showOrderCourseListView = showOrderCourseListView;
        $scope.getCourseList = getCourseList;
        $scope.showDetailModal = showDetailModal;
        $scope.editDetail = editDetail;
        $scope.getTabIndex = getTabIndex;
        $scope.update = update;
        $scope.closeDetailModal = closeDetailModal;
        $scope.getJoinClassStudents = getJoinClassStudents;
        $scope.getUnAssignedStudents = getUnAssignedStudents;
        $scope.complete = complete;
        $scope.cancleComplete = cancleComplete;
        $scope.showJoinOrExitModal = showJoinOrExitModal;
        $scope.joinOrExitClass = joinOrExitClass;
        $scope.showJoinOrExitRecordModal = showJoinOrExitRecordModal;
        $scope.getJoinOrExitRecords = getJoinOrExitRecords;
        $scope.deleteLastRecord = deleteLastRecord;
        $scope.getJoinClassStudentsByFilter = getJoinClassStudentsByFilter;
        $scope.resetSearchStudent = resetSearchStudent;
        $scope.getAllSelected = getAllSelected;

        //init
        getAllSelected();

        //variables definition
        $scope.filter = {};
        $scope.filter.status = 0; // 默认过滤已结业班级
        $scope.studentClass = {};
        $scope.studentClass.classType=1;
        $scope.classCoursePlanFilter = {};
        $scope.isAlreadyDone = true ; // 默认过滤已结业班级

        if (AuthenticationService.currentUser().position_id == Constants.PositionID.YSB_TEACHER
            || AuthenticationService.currentUser().position_id == Constants.PositionID.YSP_TEACHER
            || AuthenticationService.currentUser().position_id == Constants.PositionID.YSGJ_TEACHER
            || AuthenticationService.currentUser().position_id == Constants.PositionID.TEACHER
            || AuthenticationService.currentUser().position_id == Constants.PositionID.TEACHER_MASTER) {
            $scope.isBanKeTeacher = true;
        }
        else {
            $scope.isBanKeTeacher = false;
        }


        /**
         * 展示详情弹窗(only for teacher)
         */
        $scope.showDetailModalForTeacher = function (obj, selectTab) {
            reast()
            if (selectTab === '0') {
                $scope.selectTab = '0';
            } else if (selectTab === '1') {
                $scope.selectTab = '1';
            }
            var row = angular.copy(obj);
            $scope.studentClass = {};
            $scope.show.planLists = {};
            $scope.show.planIntervalLists = [];
            //获取科目列表
            $scope.getOmsSubject();
            $scope.detailModalTitle = "班级详情：" + row.name;
            $scope.studentClass = row;
            //日期格式化
            if ($scope.studentClass.startTime) {
                $scope.studentClass.startTime = getFormatDate(new Date($scope.studentClass.startTime));
            }
            if ($scope.studentClass.endTime) {
                $scope.studentClass.endTime = getFormatDate(new Date($scope.studentClass.endTime));
            }
            //初始化是否编辑（否）
            $scope.studentClass.isEdit = false;
            $scope.show.planLists = JSON.parse($scope.studentClass.classTimeJson);
            //初始化tab的url
            $scope.basicInfoUrl = 'partials/sos/class/tab.class.basicInfo-teacher.html?' + new Date().getTime();
            $scope.classStudentInfoUrl = 'partials/sos/class/tab.classStudentInfo.html?' + new Date().getTime();
            $scope.coursePlanInfo = 'partials/sos/class/tab.class.coursePlanInfo.html?' + new Date().getTime();
            //展示弹窗
            $scope.detailModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/class/modal.detailForTeacher.html?' + new Date().getTime(),
                show: true,
                backdrop: "static"
            });
            $rootScope.sdetailModal = $scope.detailModal
            $scope.detailModal.modalStatus = 'info';
            $scope.searchStudent = {};
        }

        /**
         * 加载班级排课记录列表
         */
        $scope.getClassCoursePlanList = function (tableState) {
            $scope.classCoursePlanFilter.classId = $scope.studentClass.id;
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
            $scope.classCoursePlanTableState = tableState;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            $scope.isLoading = true;
            ClassManagementService.getClassCoursePlanList(start, number, $scope.classCoursePlanTableState, $scope.classCoursePlanFilter).then(function (result) {
                $scope.classCoursePlanList = result.data;
                tableState.pagination = tableState.pagination || {};
                tableState.pagination.numberOfPages = result.numberOfPages;
                $scope.isLoading = false;
            });
        }

        /**
         * 编辑课前资料弹框
         */
        $scope.editPreviewHomework = function (row, type) {
            if (row.coursePlanIdList) {
                //班级的编辑资料框
                $scope.previewHomeworkInfo = {};
                $scope.previewHomeworkInfo.classId = row.classId;
                $scope.previewHomeworkInfo.gradeId = $scope.studentClass.gradeId;
                $scope.previewHomeworkInfo.subjectId = $scope.studentClass.subjectId;
                $scope.previewHomeworkInfo.type = 1;
                $scope.previewHomeworkInfo.startTime = row.startTime;
                $scope.previewHomeworkInfo.endTime = row.endTime;
                $scope.previewHomeworkInfo.coursePlanIdList = row.coursePlanIdList;
                $scope.previewHomeworkInfo.isClassEdit = true;
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
            $scope.editPreviewHomeworkModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/customer/modal.previewHomework.edit.html',
                show: true,
                backdrop: 'static'
            });
        }

        /**
         * 编辑备课笔记弹框
         */
        $scope.editTeacherHandouts = function (row, type) {
            if (row.coursePlanIdList) {
                //一对多的编辑资料框
                $scope.teacherHandoutsInfo = {};
                $scope.teacherHandoutsInfo.classId = row.classId;
                $scope.teacherHandoutsInfo.gradeId = $scope.studentClass.gradeId
                $scope.teacherHandoutsInfo.subjectId = $scope.studentClass.subjectId
                $scope.teacherHandoutsInfo.type = 3;
                $scope.teacherHandoutsInfo.startTime = row.startTime;
                $scope.teacherHandoutsInfo.endTime = row.endTime;
                $scope.teacherHandoutsInfo.coursePlanIdList = row.coursePlanIdList;
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
            $scope.editTeacherHandoutsModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/customer/modal.teacherHandouts.edit.html',
                show: true,
                backdrop: 'static'
            });
        }

        /**
         * 编辑课后作业弹框
         */
        $scope.editReviewHomework = function (row, type) {
            if (row.coursePlanIdList) {
                //一对多的编辑资料框
                $scope.reviewHomeworkInfo = {};
                $scope.reviewHomeworkInfo.classId = row.classId;
                $scope.reviewHomeworkInfo.gradeId = $scope.studentClass.gradeId
                $scope.reviewHomeworkInfo.subjectId = $scope.studentClass.subjectId
                $scope.reviewHomeworkInfo.type = 4;
                $scope.reviewHomeworkInfo.startTime = row.startTime;
                $scope.reviewHomeworkInfo.endTime = row.endTime;
                $scope.reviewHomeworkInfo.coursePlanIdList = row.coursePlanIdList;
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
            $scope.editReviewHomeworkModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/customer/modal.reviewHomework.edit.html',
                show: true,
                backdrop: 'static'
            });
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
            $scope.usePackExistModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/customer/modal.usePackExist.html',
                show: true,
                backdrop: 'static'
            });
        }

        /**
         * 加载资料包列表
         */
        $scope.getPackList = function (tableState) {
            $scope.p_TableState = tableState;
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            var promise = CustomerStudentService.getPackByFilter(start, number, tableState, $scope.p_condition);
            promise.then(function (result) {
                getAllSelected();
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
                $scope.packList = result.data;
                angular.forEach($scope.packList, function (p, index) {
                    getAllSelected();
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

        function getAllSelected() {
            CommonService.getSubjectIdSelect().then(function (result) {
                $scope.subjectIds = result.data;
            });
            CommonService.getGradeIdSelect().then(function (result) {
                $scope.gradeIds = result.data;
            });
        };

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
                var tempCoursePlanId = $scope.previewHomeworkInfo.coursePlanIdList[0].coursePlanId + "-" + $scope.previewHomeworkInfo.type;
                $scope.fileUpload(encodeURI($scope.previewHomeworkInfo.previewHomeworkFile.name), $scope.previewHomeworkInfo.previewHomeworkFile, "/preview-homework/" + tempCoursePlanId + "/")
                $scope.previewHomeworkInfo.url = "/preview-homework/" + tempCoursePlanId + "/" + encodeURI($scope.previewHomeworkInfo.previewHomeworkFile.name);
            }
            $scope.previewHomeworkInfo.state = state;
            CustomerStudentService.savePack($scope.previewHomeworkInfo).then(function (response) {
                if (response.status == "SUCCESS") {
                    $scope.editPreviewHomeworkModal.hide();
                    //更新班级排课记录
                    $scope.getClassCoursePlanList($scope.classCoursePlanTableState);
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
                var tempCoursePlanId = $scope.teacherHandoutsInfo.coursePlanIdList[0].coursePlanId + "-" + $scope.teacherHandoutsInfo.type;
                $scope.fileUpload(encodeURI($scope.teacherHandoutsInfo.teacherHandoutsFile.name), $scope.teacherHandoutsInfo.teacherHandoutsFile, "/teacher-handouts/" + tempCoursePlanId + "/")
                $scope.teacherHandoutsInfo.url = "/teacher-handouts/" + tempCoursePlanId + "/" + encodeURI($scope.teacherHandoutsInfo.teacherHandoutsFile.name);
            }
            $scope.teacherHandoutsInfo.state = state;
            CustomerStudentService.savePack($scope.teacherHandoutsInfo).then(function (response) {
                if (response.status == "SUCCESS") {
                    $scope.editTeacherHandoutsModal.hide();
                    //更新班级排课记录
                    $scope.getClassCoursePlanList($scope.classCoursePlanTableState);
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
                var tempCoursePlanId = $scope.reviewHomeworkInfo.coursePlanIdList[0].coursePlanId + "-" + $scope.reviewHomeworkInfo.type;
                var fname = encodeURI($scope.reviewHomeworkInfo.reviewHomeworkFile.name);
                $scope.fileUpload(fname, $scope.reviewHomeworkInfo.reviewHomeworkFile, "/teacher-handouts/" + tempCoursePlanId + "/")
                $scope.reviewHomeworkInfo.url = "/teacher-handouts/" + tempCoursePlanId + "/" + fname;
            }
            $scope.reviewHomeworkInfo.state = state;
            CustomerStudentService.savePack($scope.reviewHomeworkInfo).then(function (response) {
                if (response.status == "SUCCESS") {
                    $scope.editReviewHomeworkModal.hide();
                    //更新班级排课记录
                    $scope.getClassCoursePlanList($scope.classCoursePlanTableState);
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
         * @param f        文件
         * @param training    主要是为了获取trainingId
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
         * 加载班级列表
         */
        function getMyCrmCustomerStudentClassList(tableState) {
            tableState = tableState||{};
            tableState.pagination = tableState.pagination||{};
            $scope.gTableState = tableState;
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 1;
            $scope.number = $scope.pagination.number || 10;
            $scope.filter.start = $scope.start;
            $scope.filter.size = $scope.number;
            $scope.filter.schoolId = AuthenticationService.currentUser().school_id;
            $scope.filter.classCategory = 2;

            var promise = ClassManagementService.getClassesByFilter($scope.filter);
            promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        $scope.MyCrmCustomerStudentClassList = response.data.list;
                        for (var i = 0; i < $scope.MyCrmCustomerStudentClassList.length; i++) {
                            if (!$scope.MyCrmCustomerStudentClassList[i].planCount) {
                                $scope.MyCrmCustomerStudentClassList[i].planCount = 0;
                            }
                            if ($scope.MyCrmCustomerStudentClassList[i].classTimeJson) {
                                var classTimeList = [];
                                var list = eval($scope.MyCrmCustomerStudentClassList[i].classTimeJson);
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
                                $scope.MyCrmCustomerStudentClassList[i].classTimeList = classTimeList;
                            }
                        }
                        tableState.pagination.numberOfPages = response.data.pages;
                    }
                    $scope.isLoading = false;
                    setTimeout(function () {
                        ColEdit.initCol($scope)
                        angular.element('body').scroll()
                    })
                },
                function (error) {
                });
        }

        /**
         * @李世明：2016-10-21
         * 解决没有消课时不能结业问题
         */
        $scope.waringModalFun = function waringModalFun() {
            ClassManagementService.deleteStudentClassUnpastCoursePlan($scope.waringfilter).then(function (response) {
                $scope.waringModal.hide()
                if (response.status == "FAILURE") {
                    SweetAlert.swal("删除该班级未消课记录失败", "请重试", "error");
                }
                else {
                    var studentClass = {};
                    angular.forEach($scope.MyCrmCustomerStudentClassList, function (p, index) {
                        if (p.id == $scope.waringfilter.classId) {
                            studentClass = angular.copy(p);
                            return;
                        }
                    });
                    studentClass.status = 1;
                    ClassManagementService.update(studentClass).then(function (response) {
                        if (response.status == "FAILURE") {
                            SweetAlert.swal("该班级未消课记录删除成功，但是结业时失败", "请重试", "error");
                        }
                        else {
                            successAlert("结业成功", "success");
                            angular.forEach($scope.MyCrmCustomerStudentClassList, function (p, index) {
                                if (p.id == $scope.waringfilter.classId) {
                                    p.status = 1;
                                    p.allCoursePlanCount = 0;
                                    return;
                                }
                            });
                        }
                    });
                }
            });
        }
        /**
         * 结业
         */
        function complete(_class) {
            SweetAlert.swal({
                    title: "结业之后不能再修改班级信息，也不能做分班、排课等操作。确定将\"" + _class.name + "\"结业?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        //查询该班级是否还有“未消课”状态的排课记录，如果有，要提示
                        var filter = {};
                        filter.classId = _class.id;
                        filter.isPast = 0;
                        filter.isDeleted = 0;
                        filter.type = 7;
                        ClassManagementService.getStudentClassUnpastCoursePlan(filter).then(function (response) {
                            if (response.status == "FAILURE") {
                                SweetAlert.swal(response.data, "请重试", "error");
                            }
                            else {
                                if (response.data != 0) {
                                    $scope.waringtitle = "\"" + _class.name + "\"班级还有未上课的排课记录，确定要删除这些记录（不可撤销）并执行结业操作？"
                                    $scope.waringfilter = filter
                                    $scope.waringModal = $modal({
                                        scope: $scope,
                                        templateUrl: 'partials/dateTimeModal/waringModal.html',
                                        show: true,
                                        backdrop: 'static'
                                    });
                                }
                                else {
                                    var studentClass = {};
                                    angular.forEach($scope.MyCrmCustomerStudentClassList, function (p, index) {
                                        if (p.id == _class.id) {
                                            studentClass = angular.copy(p);
                                            return;
                                        }
                                    });
                                    studentClass.status = 1;
                                    ClassManagementService.update(studentClass).then(function (response) {
                                        if (response.status == "FAILURE") {
                                            SweetAlert.swal(response.data, "请重试", "error");
                                        }
                                        else {
                                            successAlert("结业成功", "success");
                                            angular.forEach($scope.MyCrmCustomerStudentClassList, function (p, index) {
                                                if (p.id == _class.id) {
                                                    p.status = 1;
                                                    return;
                                                }
                                            });

                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            );
        }

        /**
         * 撤销结业
         */
        function cancleComplete(classId) {
            SweetAlert.swal({
                    title: "确定要对该班级撤销结业吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    var studentClass = {};
                    if (confirm) {
                        angular.forEach($scope.MyCrmCustomerStudentClassList, function (p, index) {
                            if (p.id == classId) {
                                studentClass = angular.copy(p);
                                return;
                            }
                        });
                        studentClass.status = 0;
                        ClassManagementService.update(studentClass).then(function (response) {
                            if (response.status == "FAILURE") {
                                SweetAlert.swal(response.data, "请重试", "error");
                            }
                            else {
                                successAlert("撤销结业成功", "success");
                                angular.forEach($scope.MyCrmCustomerStudentClassList, function (p, index) {
                                    if (p.id == classId) {
                                        p.status = 0;
                                        return;
                                    }
                                });

                            }
                        });
                    }
                }
            );
        }

        /**
         * 显示添加班级弹窗
         */
        function showAddClassView() {
            $scope.studentClass = {};
            $scope.subjectID = null;
            $scope.isGenerateCoursePlan = false;
            $scope.show.planLists = [];
            $scope.show.planIntervalLists = [];
            $scope.isContinue = false;
            $scope.getOmsSubject();
            $scope.classAddModalTitle = "新增班级";
            $scope.classAddModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/class/modal.class.add.html',
                show: true,
                backdrop: 'static'
            });
        }

        /**
         * 选择课程弹窗
         */
        function showOrderCourseListView() {
            $scope.studentClass = {};
            $scope.CourseListFilter = {};
            $scope.getProductIdModal();
            $scope.getOmsSubject();
            $scope.selectedCourse = null;
            $scope.courseTitle = "选择课程";
            $scope.courseModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/class/modal.selectCourse.html',
                show: true,
                backdrop: "static"
            });
        }

        /**
         * 课程列表
         */
        $scope.CourseList = [];//课程列表数据
        $scope.CourseListFilter = {};//课程列表过滤条件
        $scope.CourseListTableState = {};//课程列表分页条件
        function getCourseList(tableState) {
            $scope.CourseListTableState = tableState;
            $scope.isCourseListLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            ProductService.getCourseList(start, number, tableState, $scope.CourseListFilter).then(function (result) {
                $scope.CourseList = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;
                $scope.CourseListTableState = tableState;
                $scope.isCourseListLoading = false;
            });
        };

        $scope.doSelectCourse = function () {
            var index = $("input[name='selectCourse']:checked").val();
            if (!index) {
                SweetAlert.swal("请选择课程");
                return false;
            }
            $scope.selectedCourse = angular.copy($scope.CourseList[index]);
            //判断是否是全科目课程
            if (!$scope.selectedCourse.is_fullsubject) {
                $scope.studentClass.subjectId = $scope.selectedCourse.subjectId;
                $scope.subjectID = $scope.selectedCourse.subjectId;
            } else {
                $scope.studentClass.subjectId = null;
                $scope.subjectID = null;
            }
            $scope.studentClass.courseId = $scope.selectedCourse.id;
            $scope.studentClass.courseName = $scope.selectedCourse.name;
            $scope.studentClass.gradeId = $scope.selectedCourse.gradeId;
            $scope.studentClass.gradeName = $scope.selectedCourse.gradeName;
            $scope.courseModal.hide();
        }

        /********************** 查询产品类型、课程类型、年级信息3级联动下拉选择框 start*************************************/
        $scope.getProductIdModal = function getProductIdModal() {
            CommonService.getOffLineProductIdSelect().then(function (result) {
                $scope.productIdsModal = result.data;
            });
            $scope.gradeIdsModal = [];
            $scope.courseTypeIdsModal = [];
        };

        $scope.onProductIdModal = function onProductIdModal() {
            $scope.gradeIdsModal = [];
            $scope.courseTypeIdsModal = [];
            var params = {};
            params.productId = $scope.CourseListFilter.productTypeId;
            OrderService.getCourseTypeIdSelect(params).then(function (result) {
                $scope.courseTypeIdsModal = result.data;
            });
        };

        $scope.onCourseTypeIdModal = function onCourseTypeIdModal() {
            $scope.gradeIdsModal = [];
            var params = {};
            params.courseTypeId = $scope.CourseListFilter.course_type_id;
            OrderService.getGradeIdSelect(params).then(function (result) {
                $scope.gradeIdsModal = result.data;
            });
        };
        /********************** 查询产品类型、课程类型、年级信息下拉选择框 end*************************************/

        /**
         * 查询科目下拉列表
         */
        $scope.getOmsSubject = function () {
            CommonService.getSubjectIdSelect().then(function (result) {
                $scope.omsSubject = result.data;
            });
        }

        /**
         * 检查同一校区班级名称是否重复
         */
        $scope.checkClassName = function () {
            if (!$scope.studentClass.name) {
                SweetAlert.swal("请输入班级名称", "请重试", "error");
                return false;
            }
            if ($scope.studentClass.name.length > 50) {
                SweetAlert.swal("班级名称不允许超过50个字符", "请重试", "error");
                return false;
            }
            var filter = {};
            filter.name = angular.copy($scope.studentClass.name);
            filter.schoolId = AuthenticationService.currentUser().school_id;
            filter.start = 0;
            filter.size = 10;
            var promise = ClassManagementService.getClassesByFilter(filter);
            promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal("验证班级名称唯一性失败", "请重试", "error");
                    }
                    else {
                        if (response.data.total != 0) {
                            SweetAlert.swal("班级名称已存在，请换个名称", "请重试", "error");
                            $scope.studentClass.name = null;
                            return false;
                        }
                    }
                },
                function (error) {
                });
        }

        /**
         * 弹出选择上课老师的对话框
         */
        $scope.showTeacherList = function () {
            $scope.teacherModelTitle = "查询老师";
            $scope.teacherFilter = {};
            if ($scope.studentClass.subjectId) {
                $scope.teacherFilter.subjectId = $scope.studentClass.subjectId;
            }
            $scope.select = {};
            $scope.teacherModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/customer/modal.teacherSelect.html',
                show: true,
                backdrop: "static"
            });
        }

        /**
         * 加载上课老师列表
         */
        $scope.teacherFilter = {};
        $scope.getTeachersList = function (tableState) {
            $scope.teacherTableState = tableState;
            $scope.isrendLoading = true;
            //$scope.teacherTableState.pagination.start = 0;
            $scope.pagination = $scope.teacherTableState.pagination;
            var start = $scope.pagination.start || 0;
            var number = $scope.pagination.number || 10;
            CustomerStudentCourseService.getCSShooleTeacherByFiltersNew(start, number, tableState, $scope.teacherFilter).then(function (result) {
                $scope.CStudentSchoolTeacherList = result.data.studentTeachers;
                $scope.teacherTableState.pagination.numberOfPages = result.numberOfPages;
                $scope.isLoading = false;
                $("#departmentName").val($scope.teacherFilter.departmentName);
            });
            try {

            } catch (e) {
            }
        }
        $scope.radioFun = function radioFun(index, list, flag) {
            $scope[list].list[index][flag] = !$scope[list].list[index][flag]
            for (var i = 0, len = $scope[list].list.length; i < len; i++) {
                if (i != index) {
                    $scope[list].list[i][flag] = false
                }
            }
        }
        /**
         * 按时间段查询教师的列表
         */
        $scope.getTeachersListByFilter = function () {
            // 判断选择时间段的按钮是否被选中，选择则对时间进行判断
            if ($("input[name='timeSearch']").is(':checked')) {
                $scope.judgePlanTime();
            }
            $scope.isLoading = true;
            var pagination = $scope.teacherTableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            CustomerStudentCourseService.getCSShooleTeacherByFiltersNew(start, number, $scope.teacherTableState, $scope.teacherFilter).then(function (result) {
                $scope.CStudentSchoolTeacherList = result.data.studentTeachers;
                $scope.teacherTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.isLoading = false;
                $("#departmentName").val($scope.teacherFilter.departmentName);
                hideSetTeacherTime()
            });
        }
        function hideSetTeacherTime() {
            if ($scope.timeSearchFlag) {
                $scope.setingSelectModal.hide()
            }
            $scope.mtPK = 0
        }

        $scope.resetFilterTime = resetFilterTime; //按时间段查询教师列表条件致空
        /**
         * 按时间段查询教师的列表条件致空
         */
        function resetFilterTime() {
            for (var key in $scope.select) {
                if (key != 'type') {
                    delete $scope.select[key]
                }
            }
            $scope.timeSearchFlag = 0
            $scope.mtPK = 0
            $scope.setingSelectModal.hide()
        }

        $scope.$watch('select.time2', function (newValue, oldValue) {
            newValue = parseInt(newValue, 10)
            if (newValue >= 0 && newValue < 10 && newValue != oldValue) {
                $scope.select.time2 = '0' + newValue
            }
        })
        $scope.$watch('selectTime.time2', function (newValue, oldValue) {
            newValue = parseInt(newValue, 10)
            if (newValue >= 0 && newValue < 10 && newValue != oldValue) {
                $scope.selectTime.time2 = '0' + newValue
            }
        })
        $scope.selectDateTime = selectDateTime;
        function selectDateTime(user) {
            $scope.dateTimeTitle = "学生/老师时间表";
            $scope.dateTimeFlag = 1;
            $scope.dateTimeModal = angular.copy(user);
            $scope.dateTimeModals = $modal({
                scope: $scope,
                templateUrl: 'partials/dateTimeModal/teacher.html',
                show: true,
                backdrop: "static"
            });
        }

        /**
         * 显示教师时间段查询的条件
         */
        $scope.select = {};
        /*$scope.showTimeSearch = function(){
         if($("input[type='checkbox']").is(':checked')){
         $("#timeShow").show();
         $scope.startEndTime = "";
         }else{
         $("#timeShow").hide();
         //将原有的select的时间查询的条件清空
         $scope.select= {};
         $scope.teacherFilter.startTime = null;
         $scope.teacherFilter.endTime = null;
         }
         }*/
        /**
         * 设置老师查询时间段,即设置查询时间
         */
        $scope.setingSelectTeacher = setingSelectTeacher
        function setingSelectTeacher() {
            $scope.timeSearchFlag = !$scope.timeSearchFlag
            if ($scope.timeSearchFlag) {
                $scope.setingSelectTitle = "设置查询时间";
                $scope.setingSelectModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/dateTimeModal/setingSelect.html',
                    show: true,
                    backdrop: "static"
                });
            } else {
                //  TODO:清空查询条件并刷新教师列表
            }
        }

        /**
         * 处理按时间段查询可用老师
         */
        $scope.getEndTimeNew = function () {
            if ($scope.select.time1) {
                var time1 = $scope.select.time1 = parseInt($scope.select.time1);
                if (time1 < 0 || time1 > 23 || time1 % 1 != 0) {
                    warningAlert("请填在0-23小时之间的整数")
                    $scope.select.time1 = null;
                    return;
                }
                if ($scope.select.time1 < 10) {
                    $scope.select.time1 = '0' + $scope.select.time1;
                }

            }
            if ($scope.select.time2) {
                var time2 = $scope.select.time2 = parseInt($scope.select.time2);
                if (time2 < 0 || time2 > 59 || time2 % 1 != 0) {
                    warningAlert("请选在0-59分钟之间的整数")
                    $scope.select.time2 = null;
                    return;
                }
                if ($scope.select.time2 < 10) {
                    $scope.select.time2 = '0' + $scope.select.time2;
                }
            }
            if ($scope.select.startDate && ($scope.select.time1 || $scope.select.time1 == 0) && $scope.select.timeSize) {
                if (!$scope.select.time1) {
                    $scope.select.time1 = 0;
                }
                if (!$scope.select.time2) {
                    $scope.select.time2 = 0;
                }
                $scope.select.time = $scope.select.time1 + ':' + $scope.select.time2;
                // 得到开始时间的毫秒数
                var startDate = $scope.select.startDate.Format("yyyy-MM-dd");
                var startTime = startDate + " " + $scope.select.time + ":00";
                var date = new Date(startTime);
                // 将startTime转变为毫秒数
                var timestampStart = date.getTime();
                $scope.select.timestampBaseStart = timestampStart;
                var timestampEnd = timestampStart + (($scope.select.timeSize) * 60 * 30 * 1000);
                $scope.select.timestampBaseEnd = timestampEnd;
                $scope.select.timeEnd = new Date(timestampEnd).Format("hh:mm");
                // 查询时间条件的开始时间、结束时间、页面上选择的时间段的显示
                $scope.startTime = startTime;
                $scope.endTime = startDate + " " + $scope.select.timeEnd + ":00";
                $scope.startEndTime = startDate + " " + $scope.select.time + "--" + $scope.select.timeEnd;
            }
        }

        /**
         * 选择教师列表中的老师
         */
        $scope.selectTeacher = function (row) {
            var index = $("input[name='teacherRadio']:checked").val();
            if (index == undefined) {
                warningAlert("请选择教师");
                return;
            }
            // 默认设置是精准还是定制排课
            if ($("input[name='timeSearch']").is(':checked')) {
                $scope.selected.isWeekShow = false;
                $scope.selected.isDayShow = true;
            }
            angular.forEach($scope.subjectTeacherGroup, function (p, Pindex) {
                angular.forEach(p.teachers, function (q, Qindex) {
                    if ($scope.CStudentSchoolTeacherList.list[index].userId == q.userId) {
                        if (q.selected) {
                            q.selected = false;
                        }
                        else {
                            q.selected = true;
                        }
                    }
                    else {
                        q.selected = false;
                    }
                });
            });
            $scope.studentClass.teacherId = $scope.CStudentSchoolTeacherList.list[index].userId;
            $scope.studentClass.teacherName = $scope.CStudentSchoolTeacherList.list[index].username;
            //如果是从班级详情中直接改上课老师，直接更改
            if ($scope.detailModal && $scope.detailModal.modalStatus === 'info') {
                var promise = ClassManagementService.update($scope.studentClass);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "上课老师更新失败，请重试", "error");
                    } else {
                        successAlert("上课老师更新成功", "success");
                    }
                });
            }
            $scope.teacherModal.hide();
        }

        /**
         * 判断时间是否合法，不能进行跨天
         */
        $scope.judgePlanTime = function () {
            //通过start 时间 得到结束时间和页面显示时间
            if ($scope.select.startDate == undefined) {
                warningAlert('请选择上课日期');
                return;
            }
            if ($scope.select.time == undefined) {
                warningAlert('请选择上课时间');
                return;
            }
            if ($scope.select.timeSize == undefined) {
                warningAlert('请选择上课时长');
                return;
            }
            if ($scope.select.time >= "21:00") {
                var timestampEnd = $scope.select.timestampBaseStart + (($scope.select.timeSize) * 60 * 30 * 1000);
                $scope.select.timestampBaseEnd = timestampEnd;
                $scope.select.timeEnd = new Date(timestampEnd).Format("hh:mm");
                if ($scope.select.timeEnd == "00:00") {
                    warningAlert('结束时间不能为零点,请重新选择上课时间');
                    return;
                }
            }
            var timestampEnd = $scope.select.timestampBaseStart + (($scope.select.timeSize) * 60 * 30 * 1000);
            $scope.select.timestampBaseEnd = timestampEnd;
            $scope.select.timeEnd = new Date(timestampEnd).Format("hh:mm");

            if (_ifNotOneDay($scope.select.timestampBaseStart, $scope.select.timestampBaseEnd)) {//判断时间是否跨天
                warningAlert('一节课不能隔天');
                return;
            }
            $scope.teacherFilter.startTime = $scope.startTime;
            $scope.teacherFilter.endTime = $scope.endTime;
        }

        /**
         * 选择班主任或上课老师
         */
        $scope.showSelectHeadTeacherView = function () {
            $scope.selectablePositions = [];
            if (localStorageService.get('school_id') == 0) {//非校区岗位用户
                CommonService.getAllDepartmentOfSchool().then(function (result) {
                    $scope.allAllotSchoolDL = result.data;
                });
            }
            else {
                /*
                CommonService.getAllPositionsByOrgId().then(function (result) {
                    var temp = result.data;
                    $scope.selectHeadTeacherModalTitle = '选择班主任';
                    //选择班主任（运营主管/学习顾问/运营管培生）
                    angular.forEach(temp, function (p, index) {
                        if (p.id == Constants.PositionID.STUDENT_CHIEF
                            || p.id == Constants.PositionID.STUDENT_CHIEF_OFFICER
                            || p.id == Constants.PositionID.YUNYING_MANAGEMENT_TRAINING
                            || p.id == Constants.PositionID.YSP_CHENGZHANGGUWEN_MASTER
                            || p.id == Constants.PositionID.YSP_CHENGZHANGGUWEN
                            || p.id == Constants.PositionID.YSB_GUIHUASHI
                            || p.id == Constants.PositionID.YSGJ_ZHUJIAO_MASTER
                            || p.id == Constants.PositionID.YSGJ_ZHUJIAO
                            || p.id == Constants.PositionID.KEP_TEACHER
                            || p.id == Constants.PositionID.YSP_TEACHER
                        ) {
                            $scope.selectablePositions.push(p);
                        }
                    });
                });
                */
                CommonService.getClassHeadPositions().then(function(result) {
                    $scope.selectHeadTeacherModalTitle = '选择班主任';
                    $scope.selectablePositions = result.data;
                });

                /*
                CommonService.getAllDepartmentOfSchoolByOrgId().then(function (result) {
                    $scope.allAllotSchoolDL = result.data;
                });
                */
            }
            $scope.selectedInfo = {};
            $scope.selectHeadTeacherModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/class/modal.selectHeadTeacher.html',
                show: true,
                backdrop: 'static'
            });
        }

        $scope.selectableUsers = [];
        $scope.positionChange = function () {
            if ($scope.selectedInfo.positionId) {
                CommonService.getAllUserByOrgIdAndPositionId($scope.selectedInfo.positionId).then(function (result) {
                    $scope.selectableUsers = result.data;
                });
            } else {
                $scope.selectableUsers = [];
            }
        }

        /**
         * 选中班主任
         */
        $scope.selectHeadTeacher = function () {
            angular.forEach($scope.selectableUsers, function (p, index) {
                if (p.id == $scope.selectedInfo.userId) {
                    //选中的是班主任
                    $scope.studentClass.userName = p.name;
                    $scope.studentClass.userId = p.id;
                    return;
                }
            });
            //如果是从班级详情中直接改上课老师，直接更改
            if ($scope.detailModal && $scope.detailModal.modalStatus === 'info') {
                var promise = ClassManagementService.update($scope.studentClass);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "班主任更新失败，请重试", "error");
                    } else {
                        successAlert("班主任更新成功", "success");
                    }
                });
            }
            $scope.selectHeadTeacherModal.hide();
        }

        /**
         * 生成排课记录
         */
        $scope.generateCoursePlan = function () {
            $scope.isGenerateCoursePlan = $scope.isGenerateCoursePlan == true ? false : true;
        }

        $scope.continueAdd = function () {
            $scope.isContinue = $scope.isContinue == true ? false : true;
        }

        /**
         * 新增班级
         */
        $scope.createStudentClass = function () {
        	if(!$scope.studentClass.classType){
        		$scope.studentClass.classType=1;
        	}
            $scope.studentClass.classCategory=2;
            //必填：课程、班级名称、计划开班日期、所属校区（自己补充）
            if (!$scope.studentClass.courseName) {
                SweetAlert.swal("课程不能为空", "请重试", "error");
                return false;
            }
            if (!$scope.studentClass.name || $scope.studentClass.name.length > 50) {
                SweetAlert.swal("班级名称不能为空，且不能超过50个字符", "请重试", "error");
                return false;
            }
            if (!$scope.studentClass.startTime) {
                SweetAlert.swal("计划开班日期不能为空", "请重试", "error");
                return false;
            }
            // 如果勾选了【生成排课记录】，那么科目、计划结业日期、上课老师、上课时间 必填
            if ($scope.isGenerateCoursePlan) {
                if (!$scope.studentClass.subjectId) {
                    SweetAlert.swal("科目不能为空", "请重试", "error");
                    return false;
                }
                if (!$scope.studentClass.endTime) {
                    SweetAlert.swal("计划结业日期不能为空", "请重试", "error");
                    return false;
                }
                if (!$scope.studentClass.teacherId) {
                    SweetAlert.swal("上课老师不能为空", "请重试", "error");
                    return false;
                }
                if (!$scope.studentClass.classTimeJson) {
                    SweetAlert.swal("上课时间不能为空", "请重试", "error");
                    return false;
                }
            }
            var classTimeList = $scope.studentClass.classTimeJson || '[]'
            classTimeList = JSON.parse(classTimeList)
            for (var i = 0, len = classTimeList.length; i < len; i++) {
                if (!et(classTimeList[i].endTime, classTimeList[i].startTime, classTimeList[i])) {
                    return false
                }
            }
            if ($scope.studentClass.endTime && new Date($scope.studentClass.endTime) < new Date($scope.studentClass.startTime)) {
                warningAlert('结业日期不能小于开班日期！')
                return false
            }
            $scope.studentClass.schoolId = AuthenticationService.currentUser().school_id;
            var promise = ClassManagementService.create($scope.studentClass);
            promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                        if (response.data == "创建班级时名称重复") {
                            $scope.studentClass.name = null;
                        }
                    }
                    else {
                        //新增完后，还需要去判断是否勾选排课记录，如果勾选了，还需要生成排课记录
                        if ($scope.isGenerateCoursePlan) {
                            $scope.show.submitPlan(response.data.id);
                            ClassManagementService.generateClassCoursePlan($scope.studentClass.classCoursePlanList).then(function (response) {
                                if (response.status == "FAILURE" && response.data == "排课失败") {
                                    SweetAlert.swal("班级创建成功，生成排课记录失败", "请重试", "error");
                                }
                                else if (response.status == "FAILURE") {
                                    var data = response.data;
                                    $scope.warningStudentList = data;
                                    if ($scope.warningStudentList.length > 0) {
                                        $scope.confilctModalTitle = "排课时间冲突列表";
                                        $scope.recordModal = $modal({
                                            scope: $scope,
                                            templateUrl: 'partials/sos/coursePlan/modal.conflict.class.html',
                                            show: true,
                                            backdrop: "static"
                                        });
                                    }
                                }
                                else {
                                    successAlert("班级创建成功，请继续添加", "", "success");
                                }
                                if ($scope.isContinue) {
                                    $scope.studentClass = {};
                                    $scope.isGenerateCoursePlan = false;
                                    $scope.isContinue = false;
                                }
                                else {
                                    $scope.classAddModal.hide();
                                    $scope.getMyCrmCustomerStudentClassList($scope.gTableState);
                                }
                            });
                        }
                        else {
                            if ($scope.isContinue) {
                                successAlert("班级创建成功，请继续添加", "", "success");
                                $scope.studentClass = {};
                                $scope.isGenerateCoursePlan = false;
                                $scope.isContinue = false;
                            }
                            else {
                                successAlert("班级创建成功", "", "success");
                                $scope.classAddModal.hide();
                                $scope.getMyCrmCustomerStudentClassList($scope.gTableState);
                            }
                        }
                    }
                },
                function (error) {
                });
        }

        //判断是否为优胜派的，因为他们没有班主任
        var currentUserPositionId = AuthenticationService.currentUser().position_id;
        if(currentUserPositionId == Constants.PositionID.YSP_CHENGZHANGGUWEN
                || currentUserPositionId == Constants.PositionID.YSP_HEADMASTER
                || currentUserPositionId == Constants.PositionID.YSP_CHENGZHANGGUWEN_MASTER
                || currentUserPositionId == Constants.PositionID.YSP_TEACHER){
            $scope.IsYSP = true;
        }

        /****************************************
         ****************************************  详情  ****************************************
         *************************************/
        /**
         * 展示详情弹窗
         */
        function showDetailModal(obj, selectTab) {
            reast()
            if (selectTab === '0') {
                $scope.selectTab = '0';
            } else if (selectTab === '1') {
                $scope.selectTab = '1';
            }
            var row = angular.copy(obj);
            $scope.studentClass = {};
            $scope.show.planLists = {};
            $scope.show.planIntervalLists = [];
            //获取科目列表
            $scope.getOmsSubject();
            $scope.detailModalTitle = "班级详情：" + row.name;
            $scope.studentClass = row;
            //日期格式化
            if ($scope.studentClass.startTime) {
                $scope.studentClass.startTime = getFormatDate(new Date($scope.studentClass.startTime));
            }
            if ($scope.studentClass.endTime) {
                $scope.studentClass.endTime = getFormatDate(new Date($scope.studentClass.endTime));
            }
            //初始化是否编辑（否）
            $scope.studentClass.isEdit = false;
            $scope.show.planLists = JSON.parse($scope.studentClass.classTimeJson);
            //初始化tab的url
            $scope.basicInfoUrl = 'partials/sos/class/tab.basicInfo.html?' + new Date().getTime();
            $scope.classStudentInfoUrl = 'partials/sos/class/tab.classStudentInfo.html?' + new Date().getTime();
            $scope.coursePlanInfo = 'partials/sos/class/tab.class.coursePlanInfo.html?'+new Date().getTime();
            //展示弹窗
            $scope.detailModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/class/modal.detail.html?' + new Date().getTime(),
                show: true,
                backdrop: "static"
            });
            $rootScope.sdetailModal = $scope.detailModal
            $scope.detailModal.modalStatus = 'info';
            $scope.searchStudent = {};
        }

        /**
         * 编辑详情
         */
        function editDetail(detail) {
            $scope.edite = arguments[1] ? 1 : 0
            $scope.detailModal.hide();
            //展示编辑弹窗
            $scope.editModalTitle = "修改班级：" + detail.name;
            $scope.detailModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/class/modal.edit.html?' + new Date().getTime(),
                show: true,
                backdrop: "static"
            });
            $scope.detailModal.modalStatus = 'edit';  //更改模态框状态
            detail.isEdit = true;
        }

        $scope.editCoursePlanSetting = function(detail){
            $scope.detailModal.hide();
            //展示编辑弹窗
            $scope.editModalTitle = "修改班级排课设置：" + detail.name;
            $scope.detailModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/class/modal.edit.html?' + new Date().getTime(),
                show: true,
                backdrop: "static"
            });
            $scope.detailModal.modalStatus = 'edit';  //更改模态框状态
            //不是编辑班级全部信息，只是编辑排课设置
            detail.isEdit = false;
            detail.isEditCoursePlanSetting = true;
        }

        /**
         * 关闭详情弹窗
         */
        function closeDetailModal() {
            $scope.detailModal.hide();
            $scope.getMyCrmCustomerStudentClassList($scope.gTableState);
        }

        //获取当前日期
        function getFormatDate(obj) {
            var date = obj;
            var seperator1 = "-";
            var seperator2 = ":";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var targetdate = year + seperator1 + month + seperator1 + strDate;
            return targetdate;
        }

        /**
         * 获取页面当前tab页
         */
        function getTabIndex(obj) {
            if (obj.title === '基本信息') {
                $scope.detailTab = '0';
            } else if (obj.title === '班级学员') {
                $scope.detailTab = '1';
            }
        }

        /**
         * 更新操作
         */
        function update(crmStudentClass) {
            crmStudentClass.classTimeJson = JSON.stringify($scope.show.planLists);
            crmStudentClass.classTimeList = $scope.show.planLists;
            if (!crmStudentClass.courseName) {
                SweetAlert.swal("课程不能为空", "请重试", "error");
                return false;
            }
            if (!crmStudentClass.name || crmStudentClass.name.length > 50) {
                SweetAlert.swal("班级名称不能为空，且不能超过50个字符", "请重试", "error");
                return false;
            }
            if (!crmStudentClass.startTime) {
                SweetAlert.swal("计划开班日期不能为空", "请重试", "error");
                return false;
            }
            console.log(crmStudentClass)
            var classTimeList = crmStudentClass.classTimeList || []
            for (var i = 0, len = classTimeList.length; i < len; i++) {
                if (!et(classTimeList[i].endTime, classTimeList[i].startTime, classTimeList[i])) {
                    return false
                }
            }
            if ($scope.studentClass.endTime && new Date($scope.studentClass.endTime) < new Date($scope.studentClass.startTime)) {
                warningAlert('结业日期不能小于开班日期！')
                return false
            }
            var promise = ClassManagementService.update(crmStudentClass);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "更新失败，请重试", "error");
                    return false;
                } else {
                    successAlert("班级更新成功", "success");
                    $scope.detailModal.hide();
                    $scope.getMyCrmCustomerStudentClassList($scope.gTableState);
                }
            });
        }

        /**
         * 获取入班学员
         */
        function getJoinClassStudents(tableState) {
            $scope.joinClassTableState = tableState;
            var searchModel = {};
            searchModel.crmStudentClassId = $scope.studentClass.id;
            searchModel.schoolId = $scope.studentClass.schoolId;
            if (searchModel.crmStudentClassId === null) {
                SweetAlert.swal("获取入班学员失败，请重试", "error");
                return false;
            }
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            searchModel.start = $scope.start;
            searchModel.size = $scope.number;
            searchModel.type = 1;
            var promise = ClassStudentAttendenceService.pageList(searchModel);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal("获取入班学员失败，请重试", "error");
                    return false;
                } else {
                    $scope.joinStudents = response.data.list;
                    tableState.pagination.numberOfPages = response.data.pages;
                    var objArg = [{
                        selectAll: 'out',//全部选中标志
                        thisList: 'outList',//已选列表
                        isFlag: 'selected',//选中标志
                        newData: 'joinStudents',//新数据
                        id: 'crmStudentId'//唯一标识
                    }]
                    maintainSelect(objArg)
                    // maintainSelect('outList','joinStudents','out')
                }
            });
        }

        /**
         * 根据查询条件获取入班学员
         */
        function getJoinClassStudentsByFilter() {
            var searchModel = {};
            searchModel.crmStudentClassId = $scope.studentClass.id;
            searchModel.schoolId = $scope.studentClass.schoolId;
            if (searchModel.crmStudentClassId === null) {
                SweetAlert.swal("获取入班学员失败，请重试", "error");
                return false;
            }
            $scope.pagination = $scope.joinClassTableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            searchModel.start = $scope.start;
            searchModel.size = $scope.number;
            searchModel.type = 1;
            searchModel.studentName = $scope.searchStudent.name;
            searchModel.phone = $scope.searchStudent.phone;
            var promise = ClassStudentAttendenceService.pageList(searchModel);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal("获取入班学员失败，请重试", "error");
                    return false;
                } else {
                    $scope.joinStudents = response.data.list;
                    $scope.joinClassTableState.pagination.numberOfPages = response.data.pages;
                }
            });
        }

        /**
         * 重置查询条件
         */
        function resetSearchStudent() {
            $scope.searchStudent = {};
        }

        $scope.unAssignedStudentsFilter = {};
        /**
         * 获取待分配学员
         */
        function getUnAssignedStudents(tableState) {
            $scope.unAssignedTableState = tableState;
            $scope.unAssignedStudentsFilter.courseId = $scope.studentClass.courseId;
            $scope.unAssignedStudentsFilter.crmStudentClassId = $scope.studentClass.id;
            $scope.unAssignedStudentsFilter.schoolId = $scope.studentClass.schoolId;
            if ($scope.unAssignedStudentsFilter.courseName === null || $scope.unAssignedStudentsFilter.crmStudentClassId === null) {
                SweetAlert.swal("获取待分配学员失败，请重试", "error");
                return false;
            }
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            $scope.unAssignedStudentsFilter.start = $scope.start;
            $scope.unAssignedStudentsFilter.size = $scope.number;
            var promise = ClassStudentRecordService.findUnAssignedStudents($scope.unAssignedStudentsFilter);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal("获取待分配学员失败，请重试", "error");
                    return false;
                } else {
                    $scope.unAssignedStudents = response.data.list;
                    tableState.pagination.numberOfPages = response.data.pages;
                    var objArg = [{
                        selectAll: 'join',//全部选中标志
                        thisList: 'joinList',//已选列表
                        isFlag: 'selected',//选中标志
                        newData: 'unAssignedStudents',//新数据
                        id: 'crmStudentId'//唯一标识
                    }]
                    maintainSelect(objArg)
                    // maintainSelect('joinList','unAssignedStudents','join')
                }
            });
        }

        //出班集合
        $scope.outList = []
        //入班集合
        $scope.joinList = []
        //出勤集合
        $scope.attendanceList = []
        //计费集合
        $scope.billingList = []
        //中间变量集合体
        $scope.middleList = []
        //出班全选
        $scope.out = false
        //入班全选
        $scope.jion = false
        $scope.middleFlag = false
        $scope.expansion = false
        $scope.traggerExpansion = function traggerExpansion(arg) {
            $scope.expansion = arg
        }
        /**
         * 对象键名转换适配器
         * @param str
         * @returns {string}
         */
        function camelCaseToDash(str) {
            // $1即为正则中第一个捕获，同上述的“\1”
            return str.replace(/([A-Z])/g, "_$1").toLowerCase();
        }

        /**
         * 适配数据
         * @param row
         * 传入一个对象
         * @returns {{newRow}}
         * 返回一个新对象
         */
        function getObject(row) {
            var newRow = {}
            for (var key in row) {
                if (row.hasOwnProperty(key)) {
                    newRow[camelCaseToDash(key)] = row[key]
                }
            }
            return newRow
        }

        /**
         * 显示排课对话框-弹框
         */
        $scope.addCoursePlanInfo = function addCoursePlanInfo(row, type) {
            if (type == 7) {
                $scope.coursePlanModalTitle = "班级排课";
                //使用适配器模式将ngClick类似的命名规则转为ng_click
                row = getObject(row)
                $scope.detail = angular.copy(row);
                // 将type封装到对象中

                $scope.detail.type = type;
                $scope.detail.hasData = true;
                // $rootScope.coursePlanFilter.teacherName = $scope.detail.teacher_name;
            }

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
        }
        /**
         * 恢复弹框组件
         */
        function reast() {
            //出班集合
            $scope.outList.length = 0
            //入班集合
            $scope.joinList.length = 0
            //出勤集合
            $scope.attendanceList.length = 0
            //计费集合
            $scope.billingList.length = 0
            //中间变量集合体
            $scope.middleList.length = 0
            //出班全选
            $scope.out = false
            //入班全选
            $scope.jion = false
            $scope.expansion = false
            $scope.edite = 0;
        }

        /**
         * 传入一个对象，循环检查出勤集合和计费集合中是否包含此对象，用crmStudentId作为是否存在的依据，如果出勤集合中存在则取出该集合里表示出勤的值给data.isAttendence;如果计费集合中存在则取出该集合里表示计费的值给data.isCharging;如果都不存在则获取缺席原因给data.reason,最后将data push到middleList
         * @param objArg
         * @param flag
         */
        var MiddleLists = function (objArg) {
            this.data = {}
            this.objArg = objArg
            this.mflag = -1
            this.forMi = function () {
                for (var mi = 0, miLen = $scope.middleList.length; mi < miLen; mi++) {
                    if (this.data.crmStudentId == $scope.middleList[mi].crmStudentId) {/*this.data.reason||*/
                        this.mflag = mi
                        break
                    }
                }
                return this.mflag
            }
            /**
             * 添加数据
             * @param objArg
             * @returns {boolean}
             */
            this.setData = function () {
                this.data.reason = this.objArg.reason
                this.data.isCharging = this.objArg.isCharging
                this.data.isAttendence = this.objArg.isAttendence
                this.data.crmStudentId = this.objArg.crmStudentId
                this.data.supplementType = this.objArg.supplementType
                this.data.supplementStatus = this.objArg.supplementStatus
                var index = this.forMi()
                if (index > -1) {
                    $scope.middleList[index].reason = this.objArg.reason
                    $scope.middleList[index].isCharging = this.objArg.isCharging
                    $scope.middleList[index].isAttendence = this.objArg.isAttendence
                    $scope.middleList[index].crmStudentId = this.objArg.crmStudentId
                    $scope.middleList[index].supplementType = this.objArg.supplementType
                    $scope.middleList[index].supplementStatus = this.objArg.supplementStatus
                } else {
                    $scope.middleList.push(this.data)
                }
            }
        }
        //选择集合
        /**
         * 选择单个
         * @param index
         * 所选择的索引
         * @param list
         * 从那个集合里选择的
         * @param oj
         * 出班或者入班
         * @param attr
         * 标志属性，也就是选中标志
         * @param id
         * 唯一属性用于删除已选数据
         */
        $scope.selectOne = function selectOne(index, list, oj, attr, id) {
            if ($scope[list][index].courseCount <= 0) {
                //	如果计费或课时为负数则不选中
                return false
            }
            $scope[list][index][attr] = $scope[list][index][attr] ? 0 : 1
            if ($scope[list][index][attr]) {
                $scope[oj].push($scope[list][index])
                if (oj == 'attendanceList') {
                    $scope._deleteSelect(index)
                    return false
                }
            } else {
                deleteSelect($scope[list][index][id], oj, id)
                // new MiddleLists($scope[list][index]).deleteData()
            }
            new MiddleLists($scope[list][index]).setData()
        }
        /**
         * 删除所选
         * @param crmStudentId
         * 用户id
         * @param oj
         * 对已选的出班或者入班进行删除操作
         * @param id
         * 唯一属性用于删除已选数据
         */
        function deleteSelect(uid, oj, id) {
            try {
                for (var i = 0, max = $scope[oj].length; i < max; i++) {
                    if ($scope[oj][i][id] == uid) {
                        $scope[oj].splice(i, 1)
                    }
                }
            } catch (e) {
            }

        }

        $scope._deleteSelect = function _deleteSelect(uid, id, index) {
            if (arguments.length == 1) {
                $scope.callNameStudents[arguments[0]].reason = ''
                $scope.callNameStudents[arguments[0]].isCharging = 1
                existBillingList($scope.callNameStudents[arguments[0]])
                index = arguments[0]
            }
            else if ($scope.callNameStudents[index].reason) {
                deleteSelect(uid, 'attendanceList', id, 'callNameStudents', 'isAttendence')
                $scope.callNameStudents[index].isAttendence = 0
                $scope.attendance = false
            }
            new MiddleLists($scope.callNameStudents[index]).setData()
        }
        /**
         * 全选操作
         * @param list
         * 从那个集合里选择的
         * @param flag
         * 操作标识
         * @param attr
         * 标志属性，也就是选中标志
         * @param id
         * 唯一属性用于删除已选数据
         */
        $scope.selectAll = function selectAll(list, flag, attr, id) {
            var outOrJoin = flag + 'List',
                i = 0, maxL = $scope[list].length,
                x = 0, maxF = $scope[outOrJoin].length
            try {
                if ($scope[flag]) {
                    //  当前标识已经是全选状态将对应的页面渲染集合的selected=0并且将flag+ALL里对应的值去掉
                    for (; x < maxF; x++, i = 0) {
                        for (; i < maxL; i++) {
                            if ($scope[list][i][id] == $scope[outOrJoin][x][id]) {
                                //  进行删除操作
                                $scope[list][i][attr] = 0
                                $scope[outOrJoin].splice(x, 1);
                                !(function (arg) {
                                    new MiddleLists(arg).setData()
                                })($scope[list][i])
                            }
                        }
                    }

                } else {
                    for (; i < maxL; i++) {
                        var exist = 0
                        for (var oi = 0, oLen = $scope[outOrJoin].length; oi < oLen; oi++) {
                            //先判断是否存在，不存在在添加，防止重复
                            if ($scope[list][i][id] == $scope[outOrJoin][oi][id]) {
                                exist = 1
                            }
                            if (oi == oLen - 1 && exist == 0) {
                                !(function (list, flag, attr, id, outOrJoin, i) {
                                    _selectAll(list, flag, attr, id, outOrJoin, i)
                                })(list, flag, attr, id, outOrJoin, i)
                            }
                        }
                        if (oLen == 0) {
                            !(function (list, flag, attr, id, outOrJoin, i) {
                                _selectAll(list, flag, attr, id, outOrJoin, i)
                            })(list, flag, attr, id, outOrJoin, i)
                        }
                    }
                }
            } catch (e) {
                console.log(e)
            }
            $scope[flag] = !$scope[flag]
        }
        function _selectAll(list, flag, attr, id, outOrJoin, i) {
            if ($scope[list][i].courseCount <= 0) {
                //	如果计费或课时为负数则不选中
                return false
            }
            $scope[list][i][attr] = 1
            if (flag == 'attendance') {
                $scope[list][i].reason = ''
                existBillingList($scope[list][i])
            }
            $scope[outOrJoin].push($scope[list][i]);
            !(function (arg) {
                new MiddleLists(arg).setData()
            })($scope[list][i])
        }

        /**
         * 勾选考勤时判断是否在计费中存在，不存在就插入，存在修改为1
         * @param row
         */
        function existBillingList(row) {
            var flag = 0
            for (var i = 0, len = $scope.billingList.length; i < len; i++) {
                if (row.crmStudentId == $scope.billingList[i].crmStudentId) {
                    flag = 1
                    $scope.billingList[i].isCharging == 1
                }
            }
            for (i = 0, len = $scope.callNameStudents.length; i < len; i++) {
                if (row.crmStudentId == $scope.callNameStudents[i].crmStudentId) {
                    $scope.callNameStudents[i].isCharging == 1
                }
            }
            if (!flag) {
                row.isCharging = 1
                $scope.billingList.push(row)

            }
        }

        /**
         * TODO:分页选中处理
         * 已经选择的数据
         * @param already
         * 分页获取的新数据
         * @param newData
         * 已选对象
         * @param objArg        already,newData,objArg
         */
        /**
         * TODO:分页选中处理
         * @param objArg
         * {
         *      selectAll:'attendance',//全部选中标志
         *      thisList:'joinList',//已选列表
         *      isFlag:'selected',//选中标志
         *      newData:'callNameStudents',//新数据
         *      id:'crmStudentId'//唯一标识
         *  },
         */
        function maintainSelect(objArg) {
            for (var i = 0, max = objArg.length; i < max; i++) {
                (function (arg) {
                    var already = arg.thisList,
                        newData = arg.newData,
                        isFlag = arg.isFlag,
                        selectAll = arg.selectAll,
                        id = arg.id,
                        aLen = $scope[already].length,
                        nLen = $scope[newData].length,
                        flag = 0
                    //已选数据套新数据在一定程度上提升性能减少循环次数，当已选数据大于10
                    for (var a = 0; a < aLen; a++) {
                        //  先判断是否还有课时
                        console.log('来了')
                        if($scope[already][a].courseCount<=0){
                            continue;
                        }
                        for (var n = 0; n < nLen; n++) {
                            if ($scope[already][a][id] == $scope[newData][n][id]) {
                                $scope[newData][n][isFlag] = true
                                flag++
                            }
                        }
                    }
                    if (flag != nLen || !flag) {
                        $scope[selectAll] = false
                    } else {
                        $scope[selectAll] = true
                    }
                })(objArg[i])
            }
        }

        /**
         * 获取点名上课学员列表
         * @param tableState
         * @returns {boolean}
         */
        $scope.getCallNameStudents = function getCallNameStudents(tableState) {
            $scope.middleFlag = true;
            $scope.callNameStudentsTableState = tableState;
            var searchModel = {};
            searchModel.crmStudentClassId = $scope.classCoursePlan.class_id;
            searchModel.coursePlanId = $scope.classCoursePlan.id;
            searchModel.schoolId = $scope.classCoursePlan.school_id;
            if (searchModel.crmStudentClassId === null || searchModel.coursePlanId === null) {
                SweetAlert.swal("获取入班学员失败，请重试", "error");
                return false;
            }
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            searchModel.start = $scope.start;
            searchModel.size = $scope.number;
            var promise = ClassStudentAttendenceService.pageAttendenceList(searchModel);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal("获取入班学员失败，请重试", "error");
                    return false;
                } else {
                    $scope.callNameStudents = response.data.list;
                    angular.forEach($scope.callNameStudents, function(data, index, array){
                    	if(data.supplementType===3&&data.supplementStatus===2){
                    		data.isAttendence=0;
                    		data.isCharging=0;
                    	}else if(data.supplementType===3&&data.supplementStatus===1){
                    		data.isAttendence=1;
                    		data.isCharging=1;
                    	}
                    });
                    tableState.pagination.numberOfPages = response.data.pages;
                    $scope.callNameTotal = response.data.total;
                    var objArg = [
                        {
                            selectAll: 'attendance',//全部选中标志
                            thisList: 'attendanceList',//已选列表
                            isFlag: 'isAttendence',//选中标志
                            newData: 'callNameStudents',//新数据
                            id: 'crmStudentId'//唯一标识
                        },
                        {
                            selectAll: 'billing',
                            thisList: 'billingList',
                            isFlag: 'isCharging',
                            newData: 'callNameStudents',
                            id: 'crmStudentId'
                        }]
                    maintainSelect(objArg)
                }
            });
        }
        /**
         * 确认点名showCallNameCourseModal(row)
         */
        $scope.saveNamed = function saveNamed() {
            var dataJson = {
                courseNum: $scope.classCoursePlan.course_num,
                coursePlanId: $scope.classCoursePlan.id,
                crmStudentClassId: $scope.classCoursePlan.class_id,
                studentsList: $scope.middleList
            }
            ClassStudentAttendenceService.callStudentNames(dataJson).then(function (data) {
                console.log(data)
                if (data.status == "FAILURE") {
                    SweetAlert.swal(response.data, "点名上课操作失败，请重试", "error");
                    return false;
                } else {
                    if ($scope.modalhCallNameCourseModel) {
                        $scope.modalhCallNameCourseModel.hide()
                    }
                    SweetAlert.swal({
                        title: "点名上课成功",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: '#fe9900',
                        confirmButtonText: '确定',
                        closeOnConfirm: true
                    }, function () {
                        try {
                            if (location.hash == '#/sos-admin/school_times') {
                                $scope.getSchoolTimes()
                            } else if ($scope.getTeacherTimes && typeof($scope.getTeacherTimes) == 'function') {
                                $scope.getTeacherTimes();
                            } else {
                                angular.element("#refe").click();
                            }
                        } catch (e) {

                        }
                        $rootScope.initIndex()
                    })
                }
            })
        }
        $scope.batchJoinOrExitClass = function batchJoinOrExitClass(type) {
            var flag = 0

            function getUserIds(outOrJoin) {
                var userIds = []
                for (var i = 0, max = $scope[outOrJoin].length; i < max; i++) {
                    userIds.push($scope[outOrJoin][i].crmStudentId)
                }
                flag = userIds.length
                return userIds.toString();
            }

            $scope.datas = {
                userIds: getUserIds(type),
                classId: $scope.studentClass.id,
                type: arguments[1]
            }
            if (!flag) {
                SweetAlert.swal({
                    title: "请选择学员在进行操作！",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: '#fe9900',
                    confirmButtonText: '确定',
                    closeOnConfirm: true
                });
            } else {
                $scope.joinOrExitType = arguments[1]
                $scope.joinOrExitTitle = '批量操作时间'
                $scope.joinOrExitModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/class/modal.joinOrExit.html?' + new Date().getTime(),
                    show: true,
                    backdrop: "static"
                });
            }

        }
        /**
         * 展示入班或出班弹窗
         * type 0:入班 1：出班
         */
        function showJoinOrExitModal(row, type) {
            $scope.datas = {}
            $scope.joinOrExitModel = row;
            $scope.joinOrExitModel.operationTime = null;
            $scope.joinOrExitType = type;
            //展示弹窗
            if (type === 0) {
                $scope.joinOrExitTitle = '学员入班日期';
            } else if (type === 1) {
                $scope.joinOrExitTitle = '学员出班日期';
            }
            $scope.joinOrExitModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/class/modal.joinOrExit.html?' + new Date().getTime(),
                show: true,
                backdrop: "static"
            });
        }

        /**
         * 入班或出班操作
         */
        function joinOrExitClass() {
            var recordModel = {};
            if ($scope.datas.classId) {
                recordModel = angular.copy($scope.datas)
                recordModel.operationTime = $('[ng-model="joinOrExitModel.operationTime"]').val();
            } else {
                recordModel.crmStudentClassId = $scope.studentClass.id;
                recordModel.crmStudentId = $scope.joinOrExitModel.crmStudentId;
                recordModel.studentName = $scope.joinOrExitModel.studentName;
                recordModel.type = $scope.joinOrExitType;
                recordModel.operationTime = $scope.joinOrExitModel.operationTime;
                recordModel.operationTime = new Date(recordModel.operationTime);
            }
            if (recordModel.operationTime) {
            	var promise = ClassStudentRecordService.joinOrExitClass(recordModel, $scope.datas.classId);
            	promise.then(function (response) {
            		if (response.status == "FAILURE") {
            			SweetAlert.swal(response.data, "入班或出班操作失败，请重试", "error");
            			return false;
            		} else {
            			$scope.joinOrExitModal.hide();
            			getUnAssignedStudents($scope.unAssignedTableState);
            			getJoinClassStudents($scope.joinClassTableState);
            		}
            		$scope.datas = {}
            		$scope.outList.length = 0
            		$scope.joinList.length = 0
            		if ($scope.joinOrExitModel) {
            			$scope.joinOrExitModel.operationTime = '';
            		}
            	});
            }
        }

        /**
         * 展示进出班明细弹窗
         */
        function showJoinOrExitRecordModal(row) {
            $scope.joinOrExitRecordModel = row;
            $scope.joinOrExitRecordModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/class/modal.record.html?' + new Date().getTime(),
                show: true,
                backdrop: "static"
            });
        }

        /**
         * 获取学员进出班记录
         */
        function getJoinOrExitRecords(tableState) {
            $scope.joinOrExitRecordsTableState = tableState;
            var searchModel = {};
            searchModel.crmStudentId = $scope.joinOrExitRecordModel.crmStudentId;
            searchModel.crmStudentClassId = $scope.joinOrExitRecordModel.crmStudentClassId;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            searchModel.start = $scope.start;
            searchModel.size = $scope.number;
            var promise = ClassStudentRecordService.pageList(searchModel);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal("获取学员入出班列表失败，请重试", "error");
                    return false;
                } else {
                    $scope.joinOrExitRecords = response.data.list;
                    tableState.pagination.numberOfPages = response.data.pages;
                }
            });
        }

        /**
         * 删除日期最晚的进出班记录
         */
        function deleteLastRecord(model) {
            var searchModel = {};
            searchModel.crmStudentId = model.crmStudentId;
            searchModel.crmStudentClassId = model.crmStudentClassId;
            var promise = ClassStudentRecordService.deleteLastRecord(searchModel);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal("删除日期最晚的进出班记录失败，请重试", "error");
                    return false;
                } else {
                    getJoinOrExitRecords($scope.joinOrExitRecordsTableState);
                    getUnAssignedStudents($scope.unAssignedTableState);
                    getJoinClassStudents($scope.joinClassTableState);
                }
            });
        }

        /************************************上课时间start*****************************************/
        $scope._getTimestampByWeekAndTimeNew = _getTimestampByWeekAndTimeNew;
        $scope._timestampByWeekNew = _timestampByWeekNew;
        $scope._timestampByTime = _timestampByTime;
        $scope.addPlans = addPlans;
        $scope._compareTimeHourAndMinute = _compareTimeHourAndMinute;
        $scope._checkedAddPlanTime = _checkedAddPlanTime;
        $scope.et = et;
        $scope._ifNotOneDay = _ifNotOneDay;
        $scope._getTimestampByWeekAndTimeNew2 = _getTimestampByWeekAndTimeNew2;
        $scope._timestampByWeekNew2 = _timestampByWeekNew2;
        $scope._setOnePlan = _setOnePlan;

        /**
         * 定义上课时长单位
         */
        $scope.TIME_SIZE = [
            {id: 1, name: '0.5小时'}, {id: 2, name: '1小时'}, {id: 3, name: '1.5小时'}, {id: 4, name: '2小时'}, {
                id: 5,
                name: '2.5小时'
            }, {id: 6, name: '3小时'},
        ];

        /**
         * 定义一些用到的配置信息
         */
        $scope.config = {
            id: ''
            , type: ''
            , ONE_DAY_TIMESTAMP: 1000 * 60 * 60 * 24//一天那时间戳
            , default_plan_time: 0
            , TIME_OFFSET: (new Date().getTimezoneOffset()) * 60 * 1000 //本时间与格林威治标准时间 (GMT) 的毫秒差
        };

        /**
         * 显示添加上课时间的对话框
         */
        $scope.showAddCoursePlanTime = function () {
            $scope.selectTime = {};
            $scope.addCoursePlanTitle = "添加上课时间";
            $scope.addCoursePlanModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/class/modal.addCoursePlanTime.html',
                show: true,
                backdrop: "static"
            });
        }

        $scope.show = {
            isWeekNumber: false
            , planLists: []  //本次排课列表
            , planListsPage: []  //排课列表--当前分页
            , submitPlan: submitPlan//提交排课
            , deletePlan: function (row) {
                var list = [];
                list.push(row);
                deletePlans(list, 0);
            }
        };

        /**
         * 添加排课时间
         */
        function addPlans() {
            var checkList = $("input[name='dayofWeek']:checked");
            $scope.checkList = checkList;
            var checkLength = $("input[name='dayofWeek']:checked").length;
            if (checkLength == 0) {
                SweetAlert.swal({
                    title: "请先选择日期！",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonText: '确定',
                    closeOnConfirm: true
                })
                return;
            }
            if ($scope.selectTime.time == undefined) {
                SweetAlert.swal('');
                SweetAlert.swal({
                    title: "请选择上课时间！",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonText: '确定',
                    closeOnConfirm: true
                })
                return;
            }
            if ($scope.selectTime.timeSize == undefined) {
                SweetAlert.swal({
                    title: "请选择上课时长！",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonText: '确定',
                    closeOnConfirm: true
                })
                return;
            }
            //存放上课计划的list
            if (!$scope.show.planLists) {
                $scope.show.planLists = [];
            }
            //存放上课计划间隔的list
            if (!$scope.show.planIntervalLists) {
                $scope.show.planIntervalLists = [];
            }
            var _index = $scope.show.planLists.length;
            for (var i = 0; i < checkLength; i++) {
                // 设置临时对象的值
                var objTemp = {};
                objTemp.start = i + _index;
                objTemp.day = checkList.eq(i).val();
                objTemp.startDate = checkList.eq(i).parent().text();
                objTemp.startTime = $scope.selectTime.time;
                objTemp.timelong = $scope.selectTime.timeSize * 0.5;
                objTemp.endTime = $scope.selectTime.timeEnd;
                if (_checkedAddPlanTime(objTemp.startTime, objTemp.endTime, objTemp.day)) {
                    $scope.show.planLists.push(objTemp);
                    if($scope.show.planIntervalLists.length===0){
                    	$scope.show.planIntervalLists.push(objTemp.day);
                    }else{
                    	$scope.show.planIntervalLists.push(',');
                    	$scope.show.planIntervalLists.push(objTemp.day);
                    }
                } else {
                    SweetAlert.swal('时间有冲突！');
                    return;
                }

            }
            //将上课时间转为json串
            $scope.studentClass.classTimeJson = JSON.stringify($scope.show.planLists);
            //将上课时间间隔赋值
            $scope.studentClass.classTimeInterval = $scope.show.planIntervalLists.join('');
            // 隐藏当前对话框
            $scope.addCoursePlanModal.hide();
        }

        /**
         * 删除排课记录
         */
        function deletePlans(list, type) {//0 表示删除一个  1全部删除
            SweetAlert.swal({
                    title: "确定要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        var planLists = angular.copy($scope.show.planLists);
                        var start = list[0].start;
                        // 删除当前排课列表
                        for (var j = 0; j < planLists.length; j++) {
                            if (planLists[j].start == start) {
                                $scope.show.planLists.splice(j, 1);
                            }
                        }
                        //重新存入时间间隔
                        $scope.show.planIntervalLists=[];
                        angular.forEach($scope.show.planLists, function(data, index, array){
                        	if($scope.show.planIntervalLists.length===0){
                        		$scope.show.planIntervalLists.push(data.day);
                        	}else{
                        		$scope.show.planIntervalLists.push(',');
                        		$scope.show.planIntervalLists.push(data.day);
                        	}
                        });
                    }
                }
            );
        }

        /**
         * 提交生成排课记录
         */
        function submitPlan(classId) {
            // 批量排课开始日期long值、结束日期long值
            var length = $scope.studentClass.planCourseCount || 1000;
            var pStartTimestamp = new Date($scope.studentClass.startTime).getTime();
            var pEndTimestamp = new Date($scope.studentClass.endTime).getTime();
            var plans = [];
            var start, end;
            var _start, _end, _planNumber = 1;
            var lengthCheck = $scope.show.planLists.length;
            var weekLength = Math.ceil(length / lengthCheck);
            for (var i = 0; i < weekLength; i++) {
                for (var j = 0; j < lengthCheck; j++) {
                    if ((length - 1) < 0) {
                        break;
                    }
                    pStartTimestamp = new Date($scope.studentClass.startTime).getTime();
                    pEndTimestamp = new Date($scope.studentClass.endTime).getTime();

                    var dayOfWeek = $scope.show.planLists[j].day; 		// 星期几day
                    var startTime = $scope.show.planLists[j].startTime; // 开始时间
                    var endTime = $scope.show.planLists[j].endTime;	// 结束时间
                    if (!et(endTime, startTime, $scope.show.planLists[j])) {
                        return false
                    }
                    // 获取开始时间、结束时间的long值
                    start = _getTimestampByWeekAndTimeNew2(dayOfWeek, startTime, pStartTimestamp);
                    end = _getTimestampByWeekAndTimeNew2(dayOfWeek, endTime, pStartTimestamp);
                    _start = start + $scope.config.ONE_DAY_TIMESTAMP * 7 * i;
                    _end = end + $scope.config.ONE_DAY_TIMESTAMP * 7 * i;
                    if ((_end <= pEndTimestamp + $scope.config.TIME_OFFSET + $scope.config.ONE_DAY_TIMESTAMP)) {
                        pStartTimestamp = pStartTimestamp + $scope.config.TIME_OFFSET;//修正时区
                        if (pStartTimestamp <= _start) {
                            plans.push(_setOnePlan(_start, _end));
                            _planNumber += 1;
                            length -= 1;
                        } else {
                            weekLength += 1;
                        }

                    } else {
                        continue;
                    }
                }
            }
            // 若plans有排课时间，则添加排课记录
            if (plans.length > 0) {
                $scope.studentClass.classCoursePlanList = {
                    "classId": classId,
                    "coursetime": plans,
                    "type": 7,
                    "gradeId": $scope.studentClass.gradeId,
                    "userId": $scope.studentClass.teacherId,//上课老师userId
                    "user": $scope.studentClass.userId,//班主任userId
                    "subjectId": $scope.studentClass.subjectId
                }
            }
        }

        /**
         * 设置一个排课
         * @param start
         * @param end
         * @private
         */
        function _setOnePlan(start, end) {
            var plan = {
                start: start,
                end: end
            };
            return plan;
        }

        /**
         * 获取具体时间所在周周的各天的时间戳
         */
        function _getTimestampByWeekAndTimeNew2(week, time, date) {
            var date0 = _timestampByWeekNew2(week, date);
            var t = _timestampByTime(time);
            return date0 + t;
        }

        /**
         * 获取当前周的时间
         */
        function _timestampByWeekNew2(week, date) {
            if (week == 7) {//因为前台设星期天为7
                week = 0;
            }
            var day = new Date(date).getDay();//获取当前星期X(0-6,0代表星期天)
            var cha = week - day;
            if (week == 0) {
                cha += 7
            }
            var today = new Date(date);
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);

            var oneday = 1000 * 60 * 60 * 24;
            var ret = today.getTime() + oneday * cha;
            return ret;
        }

        /**
         * 验证开始时间和结束时间的合法性
         */
        function et(endTime, startTime, data) {
            startTime = startTime.length === 4 ? (startTime + '0') : startTime
            if (endTime == '00:00') {
                warningAlert(data.startDate + '上课时间：' + startTime + '-' + endTime + '结束时间不能为零点,请重新选择上课时间');
                return false;
            }
            if (_ifNotOneDay(new Date($scope.studentClass.startTime).getTime(), new Date($scope.studentClass.endTime).getTime())) {//判断时间是否跨天
                warningAlert(data.startDate + '上课时间：' + startTime + '-' + endTime + '一节课不能隔天');
                return false;
            }
            if (endTime < startTime) {
                warningAlert(data.startDate + '上课时间：' + startTime + '-' + endTime + '一节课不能隔天');
                return false;
            }
            return true
        }

        /**
         * 判断时间是否跨天
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
            return false;
        }

        /**
         * 验证时间
         */
        function _checkedAddPlanTime(start, end, day) {
            //非数字校验
            if (!$scope.show.planLists || !$scope.show.planLists.length) {
                $scope.show.planLists = [];
                $scope.show.planIntervalLists = [];
            }
            var list = angular.copy($scope.show.planLists);
            for (var i = 0; i < list.length; i++) {
                if (day === list[i].day) {
                    if (_compareTimeHourAndMinute(list[i].startTime, start) >= 0
                        && _compareTimeHourAndMinute(start, list[i].endTime) > 0) {
                        return false;
                    }
                }
            }
            return true;
        }

        /**
         * 比较"10:00"的字符串
         * 将"10:00" 拆成小时 与分钟
         * @private
         * time1 < time2 return 1
         * time1 = time2 return 0
         * time1 > time2 return -1
         */
        function _compareTimeHourAndMinute(time1, time2) {
            var arrTime1 = time1.split(":");
            var arrTime2 = time2.split(":");
            if (parseInt(arrTime1[0]) < parseInt(arrTime2[0])) {//hour 比较
                return 1;
            }
            else if (parseInt(arrTime1[0]) == parseInt(arrTime2[0])) {//hour 比较 只有当hour相同时，才进行比较分钟
                if (parseInt(arrTime1[1]) < parseInt(arrTime2[1])) {
                    return 1;
                }
                else if (parseInt(arrTime1[1]) == parseInt(arrTime2[1])) {
                    return 0;
                }
                else {
                    return -1;
                }
            }
            else {//hour 比较
                return -1;
            }
        }

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

        /**
         * 添加排课时间
         */
        $scope.selectTime = {};
        $scope.getCourseEndTime = function () {
            var checkLength = $("input[name='dayofWeek']:checked").length;
            var dayOfWeek = $("input[name='dayofWeek']:checked").eq(0).val();
            if (checkLength == 0) {
                warningAlert("请先选择日期")
                return;
            }
            if ($scope.selectTime.time1) {
                var time1 = $scope.selectTime.time1 = parseInt($scope.selectTime.time1);
                if (time1 < 0 || time1 > 23 || time1 % 1 != 0) {
                    warningAlert("请填在0-23小时之间的整数")
                    $scope.selectTime.time1 = null;
                    return;
                }
                if ($scope.selectTime.time1 < 10) {
                    $scope.selectTime.time1 = '0' + $scope.selectTime.time1;
                }
            }
            if ($scope.selectTime.time2) {
                var time2 = $scope.selectTime.time2 = parseInt($scope.selectTime.time2);
                if (time2 < 0 || time2 > 59 || time2 % 1 != 0) {
                    warningAlert("请选在0-59分钟之间的整数")
                    $scope.selectTime.time2 = null;
                    return;
                }
                if ($scope.selectTime.time2 < 10) {
                    $scope.selectTime.time2 = '0' + $scope.selectTime.time2;
                }
            }
            if (checkLength > 0 && ($scope.selectTime.time1 || $scope.selectTime.time1 == 0) && $scope.selectTime.timeSize) {
                if (!$scope.selectTime.time1) {
                    $scope.selectTime.time1 = 0;
                }
                if (!$scope.selectTime.time2) {
                    $scope.selectTime.time2 = "00";
                }
                $scope.selectTime.time = $scope.selectTime.time1 + ':' + $scope.selectTime.time2;

                var timestampStart = _getTimestampByWeekAndTimeNew(dayOfWeek, $scope.selectTime.time);
                $scope.selectTime.timestampBaseStart = timestampStart;
                var timestampEnd = timestampStart + (($scope.selectTime.timeSize) * 60 * 30 * 1000);
                $scope.selectTime.timestampBaseEnd = timestampEnd;
                $scope.selectTime.timeEnd = new Date(timestampEnd).Format("hh:mm");
            }
        }

        /**
         * 获取当前周的各天的时间戳
         */
        function _getTimestampByWeekAndTimeNew(week, time) {
            var date0 = _timestampByWeekNew(week);
            var t = _timestampByTime(time);
            return date0 + t;
        }

        /**
         * 获取当前周的时间
         */
        function _timestampByWeekNew(week) {
            if (week == 7) {//因为前台设星期天为7
                week = 0;
            }
            var day = new Date().getDay();//获取当前星期X(0-6,0代表星期天)
            var cha = week - day;
            if (week == 0) {
                cha += 7
            }
            var today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);

            var oneday = 1000 * 60 * 60 * 24;
            return today.getTime() + oneday * cha;
        }

        /**
         * 通过时间得到毫秒数 eg:21:30
         * @param time
         * @returns {number}
         * @private
         */
        function _timestampByTime(time) {
            if (time) {
                var _arr = time.split(':');
                var hour = 1000 * 60 * 60 * _arr[0];
                var minute = 1000 * 60 * _arr[1];
                return hour + minute;
            }
        }

        /************************************上课时间start*****************************************/

        /**
         * 是否为体验班
         */
        $scope.isExperienceClass=function(){
        	if($scope.studentClass){
        		//设置班级体验类型
        		if($scope.studentClass.classType===1){
        			$scope.studentClass.classType=2;
        			//设置课程名称
        			$scope.studentClass.courseName='体验课程';
        		} else if($scope.studentClass.classType===2){
        			$scope.studentClass.classType=1;
        			$scope.studentClass.courseName=null;
        		} else if(!$scope.studentClass.classType){
        			$scope.studentClass.classType=2;
        			$scope.studentClass.courseName='体验课程';
        		}
        	}
        }

        /**************************/
          /*******升班关系********/
        /**************************/
        /**
         * 展示升班关系弹窗
         */
        $scope.relationshipModal=function(){
            $scope.promotionModal = $mtModal.modal('partials/promotion/modal/main.html',$scope)
        }
        /**
         * 升班
         * @param row
         * @param type
         */
        $scope.upgradeClass = function (row) {
            if(row.status == 1){
                $mtModal.moreModal({
                    scope:$scope,
                    text:'该班级已结业，是否进行升班操作？',
                    status:0,
                    hasNext:function () {
                        _go()
                        $scope.mtResultModal.hide()
                    }
                })
                return false
            }else{
                _go()
            }
            function _go() {
                $scope.upgradeClassDetail = angular.copy(row)
                var searchModel = {}
                searchModel.start = 0;
                searchModel.size = 1;
                searchModel.upgradeType = 1;
                searchModel.schoolId = localStorageService.get('department').id;
                searchModel.isDeleted = 0;
                searchModel.referenceId = row.id
                var promise = PromotionMTServer.getPageList(searchModel);
                promise.then(function (response) {
                    if(response.data&&response.data.data&&response.data.data.list&&response.data.data.list.length){
                        //按班级
                        $scope.byClassList = response.data.data.list;
                        console.log($scope.byClassList)
                        _modal()
                    }else {
                        //按课程
                        searchModel.upgradeType = 2
                        searchModel.referenceId = row.courseId
                        var promise = PromotionMTServer.getPageList(searchModel);
                        promise.then(function (response) {
                            if(response.data&&response.data.data&&response.data.data.list&&!response.data.data.list.length){
                                $mtModal.moreModal({
                                    scope:$scope,
                                    text:'该班级还未设置升班关系，是否现在设置？',
                                    status:0,
                                    hasNext:function () {
                                        $scope.relationshipModal()
                                        $scope.mtResultModal.hide()
                                    }
                                })
                            }else{
                                $scope.byClassList = response.data.data.list;
                                _modal()
                            }
                        })
                    }
                });
            }
            function _modal() {
                $scope.upgradeClassPreModal = $mtModal.modal('partials/promotion/modal/upgradeClassPre.html',$scope)
            }
        }
        /**
         * 筛选条件
         */
        /**
         * 改变查询更多按钮
         */
        $scope.selectMore = false;
        $scope.selectMoreText = '更多查询条件'
        $scope.changeSelectMore = function(flag) {
            if(arguments[1]){
                $scope.selectMore = !$scope.selectMore
                $scope.selectMoreText = $scope.selectMore?'收起查询条件':'更多查询条件'
            }else {
                $scope.selectMore = flag
                $scope.selectMoreText = flag?'收起查询条件':'更多查询条件'
            }
            // angular.element('#body').scroll()
            setTimeout(function () {
                resatList()
            },100)
        }
        $scope.callServerOneTabGo = function () {
            $scope.getMyCrmCustomerStudentClassList($scope.gTableState);
        }
        $scope.resetSelectOrder = function () {
            $scope.filter = {};
            $scope.isAlreadyDone = true;// 默认过滤已结业班级
            $scope.filter.status = 0; // 默认过滤已结业班级
            $scope.callServerOneTabGo();
        }
        $scope.alreadyDone = function (checked) {
            $scope.isAlreadyDone = !$scope.isAlreadyDone;
            if($scope.isAlreadyDone){
                $scope.filter.status = 0;
            }else{
                $scope.filter.status = '';
            }
            $scope.getMyCrmCustomerStudentClassList($scope.gTableState);
        }


        $scope.$editColList = [
            {
                id: 0,
                name: '班级名称',
                select: 1
            },
            {
                id: 1,
                name: '课程名称',
                select: 1
            },
            {
                id: 2,
                name: '科目',
                select: 1
            },
            {
                id: 3,
                name: '上课老师',
                select: 1
            },
            {
                id: 4,
                name: '班主任',
                select: 1
            },
            //5 体验班
            {
                id: 6,
                name: '年级',
                select: 1
            },

            {
                id: 7,
                name: '上课时间',
                select: 1
            },
            {
                id: 8,
                name: '招生人数',
                select: 1
            },
            {
                id: 9,
                name: '计划课时',
                select: 1
            },
            {
                id: 10,
                name: '已上/已排课时',
                select: 1
            },
            {
                id: 11,
                name: '开班日期',
                select: 1
            },
            {
                id: 12,
                name: '结业日期',
                select: 1
            },
            {
                id: 13,
                name: '结业状态',
                select: 0
            },
            {
                id: 14,
                name: '所属院校',
                select: 0
            },
        ]
        if($scope.isBanKeTeacher){
            $scope.$editColList = [
                {
                    id: 0,
                    name: '班级名称',
                    select: 1
                },
                {
                    id: 1,
                    name: '课程名称',
                    select: 1
                },

                {
                    id: 2,
                    name: '上课老师',
                    select: 1
                },
                {
                    id: 3,
                    name: '班主任',
                    select: 1
                },
                //4 体验班
                {
                    id: 5,
                    name: '年级',
                    select: 1
                },

                {
                    id: 6,
                    name: '上课时间',
                    select: 1
                },
                {
                    id: 7,
                    name: '招生人数',
                    select: 1
                },


                {
                    id: 8,
                    name: '开班日期',
                    select: 1
                },

                {
                    id: 9,
                    name: '结业状态',
                    select: 0
                },
                {
                    id: 10,
                    name: '所属院校',
                    select: 0
                },
            ]
        }
        if($scope.IsYSP){
            $scope.$editColList = [
                {
                    id: 0,
                    name: '班级名称',
                    select: 1
                },
                {
                    id: 1,
                    name: '课程名称',
                    select: 1
                },
                {
                    id: 2,
                    name: '科目',
                    select: 1
                },
                {
                    id: 3,
                    name: '上课老师',
                    select: 1
                },
                //4体验班
                {
                    id: 5,
                    name: '年级',
                    select: 1
                },

                {
                    id: 6,
                    name: '上课时间',
                    select: 1
                },
                {
                    id: 7,
                    name: '招生人数',
                    select: 1
                },
                {
                    id: 8,
                    name: '计划课时',
                    select: 1
                },
                {
                    id: 9,
                    name: '已上/已排课时',
                    select: 1
                },
                {
                    id: 10,
                    name: '开班日期',
                    select: 1
                },
                {
                    id: 11,
                    name: '结业日期',
                    select: 1
                },
                {
                    id: 12,
                    name: '结业状态',
                    select: 0
                },
                {
                    id: 13,
                    name: '所属院校',
                    select: 0
                },
            ]
        }
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
        ColEdit.isHasData($scope,'_classEditColList');
        $scope.QYDatas = [{"name": "今日", "id": 1}, {"name": "昨日", "id": 2}, {"name": "本周", "id": 10}, {"name": "上周", "id": 12}, {"name": "本月", "id": 13}, {"name": "上月", "id": 14}, {"name": "自定义", "id": 8}];


        function getScoreGroups() {
          ClassStudentAttendenceService.getSNPScoreGroups().then(function(response) {
            console.log(response);
          });
        }

        getScoreGroups();

    }
]);
