'use strict';

/**
 * The CoursePlan management controller.
 *
 * @author wangzhihang@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp')
    .controller('CoursePlanController', ['$scope', '$location', 'CoursePlanService', '$modal', '$rootScope', 'SweetAlert', 'UserPrizeService',
        'CustomerStudentGroupService', 'LeadsStudentService', 'CustomerStudentCourseService', 'CommonService', 'OrderService',
        '$routeParams', 'AuthenticationService', 'ClassStudentAttendenceService', '$filter', '$mtModal', 'CustomerStudentService', 'ClassManagementService', 'localStorageService',
        function ($scope, $location, CoursePlanService, $modal, $rootScope, SweetAlert, UserPrizeService, CustomerStudentGroupService, LeadsStudentService, CustomerStudentCourseService,
                  CommonService, OrderService, $routeParams, AuthenticationService, ClassStudentAttendenceService, $filter, $mtModal, CustomerStudentService, ClassManagementService, localStorageService) {
            $scope.OmsCoursePlanVoForCreate = {};
            $scope.OmsCoursePlanVoForEdit = {};
            $scope.teachername = {};
            $scope.remove = remove;
            $scope.removeForOne2One = removeForOne2One;
            $scope.view = view;
            $scope.showSelect = showSelect;
            $scope.consume = consume;
            $scope.yesconsume = yesconsume;
            $scope.yesconsume2 = yesconsume2;
            $scope.Activityconsume = Activityconsume;
            $scope.Activityremove = Activityremove;
            $scope.showListView = showListView;
            $scope.showListonPaikeView = showListonPaikeView;
            $scope.showListenListView = showListenListView;
            $scope.exportStatisticsToExcel = exportStatisticsToExcel;
            $scope.exportGroupCoursePlanToExcel = exportGroupCoursePlanToExcel;
            $scope.channleEdit = channleEdit;
            $scope.addUnsatisfied = addUnsatisfied;
            $scope.addUnsatisfiedForOne2One = addUnsatisfiedForOne2One;
            $scope.showModal = showModal;
            $scope.saveUnsatisfied = saveUnsatisfied;
            $scope.EditCoursePlanNow = EditCoursePlanNow;
            $scope.showEditCoursePlan = showEditCoursePlan;
            $scope.yesconsumeForOne2One = yesconsumeForOne2One;
            $scope.showEditCoursePlanForOne2One = showEditCoursePlanForOne2One;
            $scope.chromePrintForOne2One = chromePrintForOne2One;
            // $scope.addModel=addModel;
            $scope.oneTomorepaike = oneTomorepaike;
            $scope.classespaike = classespaike;
            //消课 质量主管只能操作 撤销不满意
            $scope.qualityManagerId = AuthenticationService.currentUser().position_id
            /******************************************        上课资料开始    *************************************************/
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
                    $scope.state1List = result.data;
                });
                CommonService.getMediaChannel(0).then(function (result) {
                    $scope.mediaChannel1List = result.data;
                });
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
                    //var str = angular.copy(row.previewHomework.url);
                    var offset = -1;
                    var count = 0;
                    while ((offset = str.indexOf("/")) != -1) {
                        count++;
                        str = str.substring(offset + 1);
                        if (count == 3) {
                            $scope.previewHomeworkInfo.filename = str;
                            break;
                        }
                    }
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
                    //var str = angular.copy(row.teacherHandouts.url);
                    var offset = -1;
                    var count = 0;
                    while ((offset = str.indexOf("/")) != -1) {
                        count++;
                        str = str.substring(offset + 1);
                        if (count == 3) {
                            $scope.teacherHandoutsInfo.filename = str;
                            break;
                        }
                    }
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
                    //var str = angular.copy(row.reviewHomework.url);
                    var offset = -1;
                    var count = 0;
                    while ((offset = str.indexOf("/")) != -1) {
                        count++;
                        str = str.substring(offset + 1);
                        if (count == 3) {
                            $scope.reviewHomeworkInfo.filename = str;
                            break;
                        }
                    }
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
                        var offset = -1;
                        var count = 0;
                        while ((offset = str.indexOf("/")) != -1) {
                            count++;
                            str = str.substring(offset + 1);
                            if (count == 3) {
                                p.filename = str;
                                break;
                            }
                        }
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
                        var offset = -1;
                        var count = 0;
                        while ((offset = str.indexOf("/")) != -1) {
                            count++;
                            str = str.substring(offset + 1);
                            if (count == 3) {
                                p.filename = str;
                                break;
                            }
                        }
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
                    if ($scope.previewHomeworkInfo.previewHomeworkFile.size > 5 * 1024 * 1024) {
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
                    tempCoursePlanId = $scope.previewHomeworkInfo.omsCoursePlanId + "-" + $scope.previewHomeworkInfo.type;
                    $scope.fileUpload(encodeURI($scope.previewHomeworkInfo.previewHomeworkFile.name), $scope.previewHomeworkInfo.previewHomeworkFile, "/preview-homework/" + tempCoursePlanId + "/")
                    $scope.previewHomeworkInfo.url = "/preview-homework/" + tempCoursePlanId + "/" + encodeURI($scope.previewHomeworkInfo.previewHomeworkFile.name);
                }
                $scope.previewHomeworkInfo.state = state;
                if ($scope.previewHomeworkInfo.coursePlanIdList != null && $scope.previewHomeworkInfo.coursePlanIdList.length == 0) {
                    SweetAlert.swal('班级该排课记录没有上课学生');
                    return false;
                }
                else {
                    CustomerStudentService.savePack($scope.previewHomeworkInfo).then(function (response) {
                        if (response.status == "SUCCESS") {
                            $scope.editPreviewHomeworkModal.hide();
                            var tableState = {};
                            tableState.search = {};
                            tableState.pagination = {};
                            if ($scope.myCoursePlanRecordTableState) {
                                if ($location.url().indexOf('/fb-admin/CoursePlan_Listen') != -1) {
                                    $scope.ListencallServerrecord($scope.myCoursePlanRecordTableState);
                                }
                                else if ($location.url().indexOf('/sos-admin/course_plan') != -1) {
                                    $scope.callServerrecord($scope.myCoursePlanRecordTableState);
                                }
                            }
                            SweetAlert.swal('保存成功', 'success');
                        }
                        else if (response.status == "FAILURE") {
                            SweetAlert.swal('保存失败', '请重试', 'error');
                            return false;
                        }
                    });
                }
            }

            /**
             * 保存备课笔记
             */
            $scope.saveTeacherHandouts = function (state) {
                var tempElement = document.getElementById("teacherHandoutsFile");
                if (tempElement != null) {
                    $scope.teacherHandoutsInfo.teacherHandoutsFile = document.getElementById("teacherHandoutsFile").files[0];
                    if ($scope.teacherHandoutsInfo.teacherHandoutsFile && $scope.teacherHandoutsInfo.teacherHandoutsFile.size > 5 * 1024 * 1024) {
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
                    tempCoursePlanId = $scope.teacherHandoutsInfo.omsCoursePlanId + "-" + $scope.teacherHandoutsInfo.type;
                    $scope.fileUpload(encodeURI($scope.teacherHandoutsInfo.teacherHandoutsFile.name), $scope.teacherHandoutsInfo.teacherHandoutsFile, "/teacher-handouts/" + tempCoursePlanId + "/")
                    $scope.teacherHandoutsInfo.url = "/teacher-handouts/" + tempCoursePlanId + "/" + encodeURI($scope.teacherHandoutsInfo.teacherHandoutsFile.name);
                }
                $scope.teacherHandoutsInfo.state = state;
                if ($scope.teacherHandoutsInfo.coursePlanIdList != null && $scope.teacherHandoutsInfo.coursePlanIdList.length == 0) {
                    SweetAlert.swal('班级该排课记录没有上课学生');
                    return false;
                }
                else {
                    CustomerStudentService.savePack($scope.teacherHandoutsInfo).then(function (response) {
                        if (response.status == "SUCCESS") {
                            $scope.editTeacherHandoutsModal.hide();
                            var tableState = {};
                            tableState.search = {};
                            tableState.pagination = {};
                            if ($scope.myCoursePlanRecordTableState) {
                                if ($location.url().indexOf('/fb-admin/CoursePlan_Listen') != -1) {
                                    $scope.ListencallServerrecord($scope.myCoursePlanRecordTableState);
                                }
                                else if ($location.url().indexOf('/sos-admin/course_plan') != -1) {
                                    $scope.callServerrecord($scope.myCoursePlanRecordTableState);
                                }
                                else if ($location.url().indexOf('/sos-admin/class') != -1) {
                                    $scope.ClasscallServerrecord($scope.myCoursePlanRecordTableState);
                                }
                            }
                            SweetAlert.swal('保存成功', 'success');
                        }
                        else if (response.status == "FAILURE") {
                            SweetAlert.swal('保存失败', '请重试', 'error');
                            return false;
                        }
                    });
                }
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
                    tempCoursePlanId = $scope.reviewHomeworkInfo.omsCoursePlanId + "-" + $scope.reviewHomeworkInfo.type;
                    var fname = encodeURI($scope.reviewHomeworkInfo.reviewHomeworkFile.name);
                    $scope.fileUpload(fname, $scope.reviewHomeworkInfo.reviewHomeworkFile, "/teacher-handouts/" + tempCoursePlanId + "/")
                    $scope.reviewHomeworkInfo.url = "/teacher-handouts/" + tempCoursePlanId + "/" + fname;
                }
                $scope.reviewHomeworkInfo.state = state;
                if ($scope.reviewHomeworkInfo.coursePlanIdList != null && $scope.reviewHomeworkInfo.coursePlanIdList.length == 0) {
                    SweetAlert.swal('班级该排课记录没有上课学生');
                    return false;
                }
                else {
                    CustomerStudentService.savePack($scope.reviewHomeworkInfo).then(function (response) {
                        if (response.status == "SUCCESS") {
                            $scope.editReviewHomeworkModal.hide();
                            var tableState = {};
                            tableState.search = {};
                            tableState.pagination = {};
                            if ($scope.myCoursePlanRecordTableState) {
                                if ($location.url().indexOf('/fb-admin/CoursePlan_Listen') != -1) {
                                    $scope.ListencallServerrecord($scope.myCoursePlanRecordTableState);
                                }
                                else if ($location.url().indexOf('/sos-admin/course_plan') != -1) {
                                    $scope.callServerrecord($scope.myCoursePlanRecordTableState);
                                }
                                else if ($location.url().indexOf('/sos-admin/class') != -1) {
                                    $scope.ClasscallServerrecord($scope.myCoursePlanRecordTableState);
                                }
                            }
                            SweetAlert.swal('保存成功', 'success');
                        }
                        else if (response.status == "FAILURE") {
                            SweetAlert.swal('保存失败', '请重试', 'error');
                            return false;
                        }
                    });
                }
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
            /******************************************        上课资料结束    *************************************************/


            //点名上课
            $scope.showCallNameCourseModal = showCallNameCourseModal;

            // 增加了lead 学员 一对多 排课用到的js 方法
            $scope.resetFilter = resetFilter;
            $scope.showPaikeView = showPaikeView;
            $scope.getLeadsStudentInfo = getLeadsStudentInfo;
            $scope.getLeadsStudentInfoByFilter = getLeadsStudentInfoByFilter;
            // $scope.forwardPlanPage = forwardPlanPage;
            $scope.createLeads = createLeads;
            $scope.forwardCreateLeadAndPlanPage = forwardCreateLeadAndPlanPage;
            $scope.getLeadsBasicInfo = getLeadsBasicInfo;
            $scope.mediaChannel1ChangeForUpdate = mediaChannel1ChangeForUpdate;
            //   显示弹出层是否显示弹出层
            $scope.mtLayer = false;
            //    记录上课
            $scope.recording = ''
            /**
             * 参数为1显示弹出层，0隐藏
             * @param arg
             */
            $scope.recordClass = function (arg) {
                $scope.mtLayer = arg ? true : false
            }
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
            }

            //是否展开查询更多
            $scope.selectMore = 0;
            $scope.changeSelectMore = changeSelectMore;
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
            }

            /**
             * 未消课列表
             */
            /* $scope.callServer = function callServer(tableState) {

             $scope.isLoading = true;

             $scope.myCoursePlanTableState = tableState;
             var pagination = tableState.pagination;
             $scope.CoursePlanTableState = tableState;
             var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
             var number = pagination.number || 10;  // Number of entries showed per page.
             //console.log('call server'+tableState);
             CoursePlanService.list(start, number, tableState).then(function (result) {
             $scope.displayed = result.data;
             tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
             $scope.isLoading = false;
             });
             };*/

            /**
             * 教师列表
             */
            $scope.getCSShooleTeacherByFilters = function getCSShooleTeacherByFilters(tableState) {
                $scope.CStudentSchoolTeacherList = true;
                $scope.myCoursePlanTableState = tableState;
                var pagination = tableState.pagination;
                $scope.OmsCoursePlanVoForEdit;
                $scope.CoursePlanTableState = tableState;
                $scope.CoursePlanTableState.crmCustomerStudentId = $scope.OmsCoursePlanVoForEdit.crmStudentId;
                $scope.CoursePlanTableState.subject_id = $scope.OmsCoursePlanVoForEdit.subject_id;

                $scope.CoursePlanTableState.omscourseplanid = $scope.OmsCoursePlanVoForEdit.id;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                //console.log('call server'+tableState);

                console.log($scope.CoursePlanTableState.search.predicateObject)
                CoursePlanService.EditCoursePlan(start, number, $scope.CoursePlanTableState, $scope.OmsCoursePlanVoForEdit).then(function (result) {
                    $scope.displayed = result.data.data.list;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.CStudentSchoolTeacherList = false;
                });
            };

            /**
             * 教师列表
             */
            $scope.teachernow = function teachernow() {
                var start = 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = 10;  // Number of entries showed per page.
                //console.log('call server'+tableState);
                CoursePlanService.teachernow(start, number, $scope.teachername).then(function (result) {
                    $scope.teacherdisplayed = result.data.data.list;
                });
            };

            $scope.SubjectList = function SubjectList() {
                $scope.CStudentSchoolTeacherList = true;
                $scope.OmsCoursePlanVoForEdit;

                //console.log('call server'+tableState);
                CoursePlanService.SubjectList($scope.OmsCoursePlanVoForEdit).then(function (result) {
                    // $scope.Subjectdisplayed = result.data.data.studentOrder;
                    $scope.OmsCoursePlanVoForEdit.plan_available_num = result.data.data.plan_available_num;
                    $scope.CStudentSchoolTeacherList = false;
                });
                // 获取科目信息
                CommonService.getSubjectIdSelect().then(function (result) {
                    $scope.Subjectdisplayed = result.data;
                });
            };

            $scope.selectSubject = function () {
                //var subjectID = $("#orderInfo").find("tr:eq(0)").find("select:eq(1)").find("option:selected").val();
                $scope.getCSShooleTeacherByFilters($scope.myCoursePlanTableState);
            }
            $scope.select = {};
            $scope.show = {
                getEndTime: getEndTime//自动生成结束时间
            };
            $scope.show.getEndTime = new Date($scope.OmsCoursePlanVoForEdit.end_time).Format("yyyy-MM-dd HH:dd");

            /* $scope.TIME_SIZE = [
             {id: 1, name: '0.5小时'}, {id: 2, name: '1小时'}, {id: 3, name: '1.5小时'}, {id: 4, name: '2小时'}, {
             id: 5,
             name: '2.5小时'
             }, {id: 6, name: '3小时'},
             ];*/

            /**
             * 得到结束时间
             * 并得到selected 开始和结束时间戳
             */
            function getEndTime() {
                if ($scope.select.startDate && $scope.select.time && $scope.select.timeSize) {
                    // 得到开始时间的毫秒数

                    try {
                        var startDate = $scope.select.startDate.Format("yyyy-MM-dd");
                    }
                    catch (e) {
                        var startDate = $scope.select.startDate;
                    }
                    var startTime = startDate + " " + $scope.select.time + ":00";
                    var date = new Date(startTime);

                    // 将startTime转变为毫秒数
                    /* $scope.OmsCoursePlanVoForEdit.plan_available_num = $scope.OmsCoursePlanVoForEdit.plan_available_num - $scope.select.timeSize * 0.5*/
                    $scope.OmsCoursePlanVoForEdit.price
                    if ($scope.OmsCoursePlanVoForEdit.type != 8 && $scope.OmsCoursePlanVoForEdit.type != 9) {
                        if ($scope.OmsCoursePlanVoForEdit.order_rule == 2) {
                            $scope.plan_available_num_old = $scope.OmsCoursePlanVoForEdit.plan_available_num - ($scope.select.timeSize + 1) * 0.5 * $scope.OmsCoursePlanVoForEdit.coefficient;
                            // 20180609 40分钟0.5课时
                            if ($scope.is30Or20Min) {
                                $scope.plan_available_num_old = 0.5
                            }
                        } else if ($scope.OmsCoursePlanVoForEdit.type == 3) {
                            $scope.plan_available_num_old = $scope.OmsCoursePlanVoForEdit.plan_available_num - $scope.select.timeSize * 0.5
                        } else {
                            $scope.plan_available_num_old = $scope.OmsCoursePlanVoForEdit.plan_available_num - $scope.select.timeSize * 0.5 * $scope.OmsCoursePlanVoForEdit.coefficient;
                        }
                    } else {
                        if ($scope.OmsCoursePlanVoForEdit.order_rule == 2) {
                            $scope.plan_available_num_old = $scope.OmsCoursePlanVoForEdit.plan_available_num - ($scope.select.timeSize + 1) * 0.5 * ($scope.OmsCoursePlanVoForEdit.new_price / $scope.OmsCoursePlanVoForEdit.course_num_2);
                        } else {
                            $scope.plan_available_num_old = $scope.OmsCoursePlanVoForEdit.plan_available_num - ($scope.select.timeSize + 1) * 0.5 * ($scope.OmsCoursePlanVoForEdit.price / $scope.OmsCoursePlanVoForEdit.course_num);
                        }
                    }
                    if ($scope.plan_available_num_old < 0 && $scope.OmsCoursePlanVoForEdit.type != 7 && $scope.OmsCoursePlanVoForEdit.type != 2 && $scope.OmsCoursePlanVoForEdit.type != 9 && $scope.OmsCoursePlanVoForEdit.type != 8 && $scope.OmsCoursePlanVoForEdit.type != 15 && $scope.OmsCoursePlanVoForEdit.type != 16) {
                        $scope.select = {};
                        SweetAlert.swal("课时数不够");
                        return;
                    } else {

                        if ($scope.OmsCoursePlanVoForEdit.type != 8 && $scope.OmsCoursePlanVoForEdit.type != 9) {
                            if ($scope.OmsCoursePlanVoForEdit.order_rule == 2) {
                                $scope.plan_available_num_old = $scope.OmsCoursePlanVoForEdit.plan_available_num;
                            } else {
                                $scope.plan_available_num_old = $scope.OmsCoursePlanVoForEdit.plan_available_num;
                            }
                        } else {
                            if ($scope.OmsCoursePlanVoForEdit.order_rule == 2) {
                                $scope.plan_available_num_old = $scope.OmsCoursePlanVoForEdit.plan_available_num - ($scope.select.timeSize + 1) * 0.5 * ($scope.OmsCoursePlanVoForEdit.new_price / $scope.OmsCoursePlanVoForEdit.course_num_2)
                            } else {
                                $scope.plan_available_num_old = $scope.OmsCoursePlanVoForEdit.plan_available_num - $scope.select.timeSize * 0.5 * ($scope.OmsCoursePlanVoForEdit.new_price / $scope.OmsCoursePlanVoForEdit.course_num)
                            }
                        }
                        var timestampStart = date.getTime();
                        $scope.select.timestampBaseStart = timestampStart;
                        var timestampEnd = timestampStart + (($scope.select.timeSize) * 60 * 30 * 1000);
                        if ($scope.OmsCoursePlanVoForEdit.order_rule == 2) {
                            timestampEnd = timestampStart + (($scope.select.timeSize + 1) * 40 * 30 * 1000);
                            // 20180609 40分钟0.5课时
                            if ($scope.is30Or20Min) {
                                timestampEnd = timestampStart + $scope.select.timeSize * 40 * 60 * 1000;
                            }
                        }
                        $scope.select.timestampBaseEnd = timestampEnd;
                        $scope.select.timeEnd = new Date(timestampEnd).Format("hh:mm");
                        /*   if($scope.select.timestampBaseStart<new Date().getTime()){//判断是否小于当前时间
                         $scope.select = {};
                         SweetAlert.swal('时间已经过去了，不容许排课');
                         return false;
                         }*/
                        // 查询时间条件的开始时间、结束时间、页面上选择的时间段的显示
                        $scope.startTime = startTime;
                        $scope.endTime = startDate + " " + $scope.select.timeEnd + ":00";
                        $scope.startEndTime = startDate + " " + $scope.select.time + "--" + $scope.select.timeEnd;
                    }
                }
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

            $scope.quick = [];
            $scope.quickSelected = function (i) {


            };

            // 20180609新加判断是否0.5课时，
            // 初始化文本展示和40分钟0.5课时处理select.timeSize
            function initHoursText(flag) {
                // 需要特殊处理0.5
                if (flag) {
                    // 40分钟
                    if ($scope.OmsCoursePlanVoForEdit.order_rule == 2) {
                        $scope.select.timeSize = 0.5
                        $scope.hoursText = '20分钟（0.5课时）'
                    } else {
                        // 1小时
                        $scope.hoursText = '30分钟（0.5课时）'
                    }
                }
            }

            $scope.initIs30Or20Min = function (size, list) {
                for (var i = 0, len = list.length; i < len; i++) {
                    if (size == list[i].id) {
                        $scope.is30Or20Min = false
                        initHoursText(false)
                        return false
                    }
                }
                initHoursText(true)
                $scope.is30Or20Min = true
            }

            function EditCoursePlanNow() {
                $scope.dataLoading = true;
                var index = $("input[name='cscourse']:checked").val();
                if (index == undefined) {
                    var name = null;
                    for (var i = 0; i < $scope.Subjectdisplayed.length; i++) {
                        var subject = $scope.Subjectdisplayed[i];
                        if (subject.id == $scope.OmsCoursePlanVoForEdit.subjectId) {
                            name = subject.name;
                            break;
                        }


                    }
                    console.log(name);
                    console.log($scope.teacherdisplayed[0].subject_name);
                    console.log($scope.teacherdisplayed[0].subject_name.indexOf(name));
                    if (name != null && $scope.teacherdisplayed[0].subject_name.indexOf(name) < 0) {
                        SweetAlert.swal("请选择符合当前科目的老师");
                        return;
                    }
                }
                $scope.OmsCoursePlanVoForEdit;
                if ($scope.startTime) {
                    $scope.OmsCoursePlanVoForEdit.start = new Date($scope.startTime).getTime();
                    $scope.OmsCoursePlanVoForEdit.end = new Date($scope.endTime).getTime();
                }


                if (index == undefined) {

                }
                else {
                    $scope.OmsCoursePlanVoForEdit.user_id = $scope.displayed[index].userId;
                }
                if (_ifNotOut23($scope.select.timestampBaseEnd)) {
                    SweetAlert.swal('排课时间不能超过23点');
                    return false;
                }
                if (_ifNotOneDay($scope.select.timestampBaseStart, $scope.select.timestampBaseEnd)) {
                    SweetAlert.swal('排课时间不能跨天');
                    return false;
                }
                $scope.OmsCoursePlanVoForEdit.plan_available_num = $scope.plan_available_num_old;

                var promise = CoursePlanService.EditCoursePlanNow($scope.OmsCoursePlanVoForEdit);

                promise.then(function (result) {
                    var response = result;
                    if (response.status == 'SUCCESS') {
                        $scope.startTime = null;
                        $scope.endTime = null;
                        SweetAlert.swal(result.data);
                        $scope.dataLoading = false;
                        $scope.modal.hide();
                        if ($scope.EditType == 2) {//刷新我的意向客户详情排课列表
                            $scope.callServer1($scope.myCoursePlanTableState);
                        } else if ($scope.EditType == 1) {//刷新一对一排课列表
                            $scope.showListView();
                        } else if ($scope.EditType == 3) {//刷新学员详情排课列表
                            if ($scope.myCoursePlanTableState) {
                                $scope.callServer1($scope.myCoursePlanTableState);
                            }
                            if ($scope.coursePlanRecordTableState) {
                                $scope.callCoursePlanServer($scope.coursePlanRecordTableState);
                            }
                        } else if ($scope.EditType == 4) {
                            if ($scope.myCoursePlanRecordTableState) {
                                $scope.ListencallServerrecord($scope.myCoursePlanRecordTableState);
                            }
                        }
                        else if ($scope.EditType == 5) {
                            $scope.ClasscallServerrecord($scope.myCoursePlanRecordTableState);
                        }
                        else if ($scope.EditType == 6) {
                            $scope.GroupcallServerrecord($scope.GroupCoursePlanRecordTableState);
                        }
                        else {


                        }
                        try {
                            $rootScope.getRemindsData(4, 2, 1);//刷新提醒列表
                            $scope.getTeacherTimes();
                            $scope.getSchoolsTimes();
                        } catch (e) {

                        }
                    } else if (response.status == 'FAILURE') {
                        var data = response.data;
                        $scope.warningStudentList = data;
                        $scope.startTime = null;
                        $scope.endTime = null;
                        // 如果是字符串，直接alert
                        var confilct = 'partials/sos/customer/modal.conflict.coursePlan.html';
                        if ($scope.OmsCoursePlanVoForEdit.type == 7) {
                            confilct = 'partials/sos/coursePlan/modal.conflict.class.html';
                        }
                        if (typeof $scope.warningStudentList == "string") {
                            SweetAlert.swal(data);
                            return;
                        } else {
                            if ($scope.warningStudentList.length > 0) {
                                if ($scope.OmsCoursePlanVoForEdit.order_rule == 2) {
                                    $scope.OmsCoursePlanVoForEdit.plan_available_num = $scope.OmsCoursePlanVoForEdit.plan_available_num + ($scope.select.timeSize + 1) * 0.5
                                } else {
                                    $scope.OmsCoursePlanVoForEdit.plan_available_num = $scope.OmsCoursePlanVoForEdit.plan_available_num + $scope.select.timeSize * 0.5
                                }

                                $scope.confilctModalTitle = "排课时间冲突列表";
                                $scope.recordModal = $modal({
                                    scope: $scope,
                                    templateUrl: confilct,
                                    show: true,
                                    backdrop: "static"
                                });
                            }
                        }
                    }
                }, function (error) {
                    SweetAlert.swal("编辑排课失败");
                    $scope.dataLoading = false;
                });

            }

            function yesconsume2(omsCoursePlan, type) {
                $scope.EditType = type;
                SweetAlert.swal({
                        title: "是否确认消课？", /*系统内消课无法打印课票,*/
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: '#fe9900',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true
                    }, function (confirm) {
                        if (confirm) {
                            var promise = CoursePlanService.yesconsume(omsCoursePlan);
                            promise.then(function (results) {

                                if (results.status == 'FAILURE') {
                                    $mtModal.moreModal({

                                        text: '消课失败！！',
                                        status: 1,
                                        scope: $scope
                                    })
                                    return;
                                } else if (results.status == 'HASCANCELED') {
                                    $mtModal.moreModal({
                                        text: '已经消课，不能再次消课！！',
                                        status: 1,
                                        scope: $scope
                                    })
                                    return;
                                } else if (results.status == 'UNREACHDATE') {
                                    var errMsg;
                                    if (results.data) {
                                        errMsg = results.error;
                                    } else {
                                        errMsg = "消课失败，未到消课日期！！"
                                    }
                                    $mtModal.moreModal({
                                        text: errMsg,
                                        status: 1,
                                        scope: $scope
                                    })
                                    return;
                                }

                                // omsCoursePlan.isPast = 1
                                try {
                                    $scope.getIndexData(4)
                                    $scope.getIndexData(5)
                                    // row.is_past = 1
                                } catch (e) {
                                }
                                if (JSON.parse(sessionStorage.getItem("com.youwin.yws.department")).district == 451 && JSON.parse(sessionStorage.getItem("com.youwin.yws.department")).schoolNature == 1) {
                                    var win = Math.floor(Math.random() * 100) + 1;
                                    if (win == 100) {
                                        $scope.userModel = {};
                                        $scope.userModel.userId = JSON.parse(sessionStorage.getItem("com.youwin.yws.user")).id;
                                        $scope.userModel.courseNum = omsCoursePlan.course_num_end;
                                        $scope.userModel.createdAt = omsCoursePlan.start_time;
                                        var Prizepromise = UserPrizeService.addOrUpdate($scope.userModel);
                                        Prizepromise.then(function (result) {
                                                var winner = result.data;
                                                if (winner == true) {
                                                    prizeOpen();
                                                }
                                            }
                                        )
                                    }
                                }
                                if ($scope.EditType == 2) {//刷新我的意向客户详情排课列表
                                    $scope.callServer1($scope.myCoursePlanTableState);
                                } else if ($scope.EditType == 1) {//刷新一对一排课列表
                                    $scope.showListView();
                                } else if ($scope.EditType == 3) {//刷新学员详情排课列表
                                    if ($scope.myCoursePlanTableState) {
                                        $scope.callServer1($scope.myCoursePlanTableState);
                                    }
                                    if ($scope.coursePlanRecordTableState) {
                                        $scope.callCoursePlanServer($scope.coursePlanRecordTableState);
                                    }
                                } else if ($scope.EditType == 4) {
                                    if ($scope.myCoursePlanRecordTableState) {
                                        $scope.ListencallServerrecord($scope.myCoursePlanRecordTableState);
                                    }
                                } else if ($scope.EditType == 6) {//刷新一对多排课列表
                                    $mtModal.moreModal({
                                        text: '消课成功，是否打印上课凭单？',
                                        status: 1,
                                        hasNext: function () {
                                            $scope.getClassPorintList(omsCoursePlan)
                                        },
                                        refresh: $scope.showListView,
                                        scope: $scope
                                    })
                                    $scope.GroupcallServerrecord($scope.GroupCoursePlanRecordTableState)
                                } else if ($scope.EditType == 7) {//教师消课后操作
                                    // TODO：20180511 修改
                                    $mtModal.moreModal({
                                        text: '消课成功，是否打印上课凭单？',
                                        status: 1,
                                        hasNext: function () {
                                            $scope.getClassPorintList(omsCoursePlan)
                                        },
                                        cancel: function () {
                                            debugger
                                            $scope.mtResultModal.hide()
                                            $scope.showListView()
                                            // $scope.$parent.getGroupCoursePlanList($scope.$parent.groupCoursePlantableState)
                                        },
                                        refresh: $scope.showListView,
                                        scope: $scope
                                    })
                                }
                                else {

                                }
                                try {
                                    $rootScope.getRemindsData(4, 2, 1);//刷新提醒列表
                                } catch (e) {

                                }
                            }, function (error) {
                            });
                        }
                        angular.element('.sweet-alert').remove()
                        angular.element('.sweet-overlay').remove()
                    }
                );
            }

            function Activityconsume(omsCoursePlan) {

                var now = new Date();
                var nowYear = now.getYear();
                var nowMonth = now.getMonth();
                var nowDate = now.getDate();
                var pastTime = new Date(omsCoursePlan.start_time);
                var pastYear = pastTime.getYear();
                var pastMonth = pastTime.getMonth();
                var pastDate = pastTime.getDate();

                var now1 = new Date();
                var now2 = new Date();

                now1.setFullYear(nowYear, nowMonth, nowDate);
                now2.setFullYear(pastYear, pastMonth, pastDate);

                var flag = true;

                if (now2 > now1)
                    flag = false;

                if (!flag) {
                    SweetAlert.swal({
                        title: "时间未到！！！！", /*系统内消课无法打印课票,*/
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: '#fe9900',
                        cancelButtonText: '确定',
                        closeOnConfirm: true
                    });
                    return;
                }


                SweetAlert.swal({
                        title: "审核确认？", /*系统内消课无法打印课票,*/
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: '#fe9900',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true
                    }, function (confirm) {
                        if (confirm) {
                            var promise = CoursePlanService.yesconsume(omsCoursePlan);
                            promise.then(function () {
                                if (JSON.parse(sessionStorage.getItem("com.youwin.yws.department")).district == 451 && JSON.parse(sessionStorage.getItem("com.youwin.yws.department")).schoolNature == 1) {
                                    var win = Math.floor(Math.random() * 100) + 1;
                                    if (win == 100) {
                                        $scope.userModel = {};
                                        $scope.userModel.userId = JSON.parse(sessionStorage.getItem("com.youwin.yws.user")).id;
                                        $scope.userModel.courseNum = omsCoursePlan.course_num_end;
                                        $scope.userModel.createdAt = omsCoursePlan.start_time;
                                        var Prizepromise = UserPrizeService.addOrUpdate($scope.userModel);
                                        Prizepromise.then(function (result) {
                                                var winner = result.data;
                                                if (winner == true) {
                                                    prizeOpen();
                                                }
                                            }
                                        )
                                    }
                                }


                                $scope.ActivityServerrecord($scope.ActivityCoursePlanRecordTableState);

                            }, function (error) {
                            });
                        }
                    }
                );
            }

            $scope.getClassPorintList = function (omsCoursePlan) {
                debugger
                CoursePlanService.classPorintList(angular.copy(omsCoursePlan)).then(function (data) {
                    $scope.chromePrint(data.data)
                })
            }
            $scope.PASTS = [
                {id: 0, name: '未消课'}
                , {id: 1, name: '已消课'}
            ]
            $scope.nextCourseDatas = [{"name": "今日", "id": 1}, {"name": "明日", "id": 9}, {
                "name": "本周",
                "id": 10
            }, {"name": "下周", "id": 11}, {"name": "本月", "id": 13}, {"name": "下月", "id": 15}, {"name": "自定义", "id": 8}];
            $scope.callServerrecordFilterChange = function callServerrecordFilterChange() {
                if ($scope.modalAlready) {
                    $scope.modalAlready.hide()
                }
                if ($scope.myCoursePlanRecordTableState) {
                    $scope.myCoursePlanRecordTableState.pagination.start = 0

                }
                setParam()
                if ($scope.myCoursePlanRecordTableState) {
                    $scope.callServerrecord($scope.myCoursePlanRecordTableState);
                }
                if ($scope.GroupCoursePlanRecordTableState) {
                    $scope.GroupCoursePlanRecordTableState.pagination.start = 0
                    $scope.GroupcallServerrecord($scope.GroupCoursePlanRecordTableState);
                }
                if ($scope.ActivityCoursePlanRecordTableState) {
                    $scope.ActivityServerrecord($scope.ActivityCoursePlanRecordTableState);
                }

            }
            $scope.mtSeach = {
                forenoon: 1,
                afternoon: 1,
                night: 1,
                removeAbnormal: true,
                isSelectedGraduation: 0,
                type: undefined,
                start_time: new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-1').Format('yyyy-MM-dd'),
                end_time: new Date().Format('yyyy-MM-dd'),
                remark: null
            }
            $scope.resetSelect = function resetSelect() {
                for (var key in $scope.mtSeach) {
                    $scope.mtSeach[key] = ''
                }
                $scope.mtSeach = {
                    forenoon: 1,
                    afternoon: 1,
                    night: 1,
                    removeAbnormal: false,
                    isSelectedGraduation: 1,
                    type: undefined,
                    start_time: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-1',
                    end_time: new Date().toLocaleDateString(),
                    remark: null
                }
                $scope.callServerrecordFilterChange()

            }

            function setParam() {
                if ($scope.myCoursePlanRecordTableState) {
                    $scope.myCoursePlanRecordTableState.search.predicateObject = $scope.myCoursePlanRecordTableState.search.predicateObject ? $scope.myCoursePlanRecordTableState.search.predicateObject : {}
                    $scope.myCoursePlanRecordTableState.search.predicateObject = angular.copy($scope.mtSeach);
                }

                try {
                    $scope.GroupCoursePlanRecordTableState.search.predicateObject = angular.copy($scope.mtSeach)
                } catch (e) {

                }
                try {
                    $scope.ActivityCoursePlanRecordTableState.search.predicateObject = angular.copy($scope.mtSeach)
                } catch (e) {

                }
                /*for(var key in $scope.mtSeach){
                 if($scope.mtSeach[key]){
                 $scope.myCoursePlanRecordTableState.search.predicateObject[key] = $scope.mtSeach[key]
                 }else{
                 delete $scope.myCoursePlanRecordTableState.search.predicateObject[key]
                 }
                 }*/
            }

            /**
             * 展示一对多记录弹窗
             */
            $scope.showCoursePlanModal = function showCoursePlanModal(row) {
                $scope.recordModalTitle = '课程详情';
                $scope.Groupdetail = angular.copy(row);
                $scope.recordModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/coursePlan/modal.record.html',
                    show: true,
                    backdrop: "static"
                });
            }

            /**
             * 展示课程记录弹窗
             */
            $scope.showSubjectDetailModal = function showSubjectDetailModal(row) {
                $scope.recordModalTitle = '课程详情';
                $scope.Coursedetail = angular.copy(row);
                $scope.recordModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/coursePlan/modal.courseDetail.html',
                    show: true,
                    backdrop: "static"
                });
            }


            /**
             * //一对多排课详情
             */
            $scope.GroupInfoCoursePlanServer = function GroupInfoCoursePlanServer(tableState) {
                CoursePlanService.GroupInfoCoursePlanrecord($scope.Groupdetail).then(function (result) {
                    $scope.GroupInfoCoursePlandisplayed = result.data;

                    $scope.Groupnum = result.numberOfPages;
                    //tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isrendLoading = false;
                });
            };

            /**
             * //课程详情
             */
            $scope.CourseDetailInfoServer = function CourseDetailInfoServer(tableState) {
                CoursePlanService.CourseDetailInfoServerRecord($scope.Coursedetail).then(function (result) {
                    $scope.CourseDetailInfodisplayed = result.data.list;

                    $scope.CourseDetailInfonum = result.numberOfPages;
                    //tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isrendLoading = false;
                });
            };
            /**
             * 已消课列表
             */
            var isInitCallServerrecord = true;
            $scope.callServerrecord = function callServerrecord(tableState) {
                if (isInitCallServerrecord) {
                    tableState.search.predicateObject = angular.copy($scope.mtSeach);
                    isInitCallServerrecord = !isInitCallServerrecord;
                }
                if ($scope.modalAlready && $scope.modalAlready.$isShown) {
                    //  查询要消课的排课记录
                    if (!tableState.search.predicateObject) {
                        $scope.PlanAlreadyFlag = 1
                    }
                    tableState.search.predicateObject = tableState.search.predicateObject || {}
                    tableState.search.predicateObject.is_past = 0

                } else if ($scope.PlanAlreadyFlag) {
                    //  防止干扰原来的逻辑
                    delete tableState.search.predicateObject
                }
                $scope.isrendLoading = true;
                $scope.myCoursePlanRecordTableState = tableState;

                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                //console.log('call server'+tableState);
                var ta = angular.copy(tableState);
                if (ta.search.predicateObject && ta.search.predicateObject.is_past) {
                    ta.search.predicateObject.is_past -= 1;
                }
                CoursePlanService.recordlist(start, number, ta).then(function (result) {
                    $scope.displayedrecord = result.data;
                    if ($scope.displayedrecord != null) {
                        $scope.lastObj = result.data[result.data.length - 1];
                    }
                    $scope.myCoursePlanRecordTableState = tableState;
                    $scope.num = result.numberOfPages;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isrendLoading = false;


                    setTimeout(function () {
                        initChooseList('record');
                    })


                    if ($routeParams.dateTime && (Date.now() - $routeParams.dateTime < 1000 * 60 * 5) && !$scope.isGo) {
                        if ($routeParams.v3 == 3) {
                            $scope.isGo = true
                            if (!$scope.addModal) {
                                if (!$scope.isTeacherOrTeacherMaster && isShowPaikeViewAll()) {
                                    $scope.showPaikeView(3, 0)
                                } else if (!$scope.isTeacherOrTeacherMaster && !isShowPaikeViewAll()) {
                                    $scope.showPaikeView(3)
                                }
                            }
                        }
                    }
                });
            };

            /**
             * 活动消课列表
             */
            $scope.ActivityServerrecord = function ActivityServerrecord(tableState) {
                if ($scope.modalAlready && $scope.modalAlready.$isShown) {
                    //  查询要消课的排课记录
                    if (!tableState.search.predicateObject) {
                        $scope.PlanAlreadyFlag = 1
                    }
                    tableState.search.predicateObject = tableState.search.predicateObject || {}
                    tableState.search.predicateObject.is_past = 0
                } else if ($scope.PlanAlreadyFlag) {
                    //  防止干扰原来的逻辑
                    delete tableState.search.predicateObject
                }
                $scope.isrendLoading = true;
                $scope.ActivityCoursePlanRecordTableState = tableState;

                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                //console.log('call server'+tableState);
                var ta = angular.copy(tableState);
                if (ta.search.predicateObject && ta.search.predicateObject.is_past) {
                    ta.search.predicateObject.is_past -= 1;
                }
                CoursePlanService.Activityrecordlist(start, number, ta).then(function (result) {
                    $scope.Activitydisplayedrecord = result.data;
                    $scope.ActivityCoursePlanRecordTableState = tableState;
                    $scope.num = result.numberOfPages;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isrendLoading = false;
                });
            };

            /**
             * 已消课列表
             */
            var isInitGroupcallServerrecord = true;
            $scope.GroupcallServerrecord = function GroupcallServerrecord(tableState) {

                if (isInitGroupcallServerrecord) {
                    tableState.search.predicateObject = angular.copy($scope.mtSeach);
                    isInitGroupcallServerrecord = !isInitGroupcallServerrecord;
                }

                if ($scope.modalAlready && $scope.modalAlready.$isShown) {
                    //  查询要消课的排课记录
                    if (!tableState.search.predicateObject) {
                        $scope.PlanAlreadyFlag = 1
                    }
                    tableState.search.predicateObject = tableState.search.predicateObject || {}
                    tableState.search.predicateObject.is_past = 0
                } else if ($scope.PlanAlreadyFlag) {
                    //  防止干扰原来的逻辑
                    delete tableState.search.predicateObject
                }
                $scope.isrendLoading = true;


                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                //console.log('call server'+tableState);
                var ta = angular.copy(tableState);
                if (ta.search.predicateObject && ta.search.predicateObject.is_past) {
                    ta.search.predicateObject.is_past -= 1;
                }
                CoursePlanService.Grouprecordlist(start, number, ta).then(function (result) {
                    $scope.Groupdisplayedrecord = result.data;
                    if ($scope.Groupdisplayedrecord != null) {
                        $scope.lastObj = result.data[result.data.length - 1];
                    }
                    $scope.GroupCoursePlanRecordTableState = tableState;
                    $scope.Groupnum = result.numberOfPages;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isrendLoading = false;
                    setTimeout(function () {
                        initChooseList('coursePlanrecord');
                    })
                });
            };

            $scope.getClassCoursePlanListByFilter = function () {
                var pagination = $scope.myCoursePlanRecordTableState.pagination;
                var start = $scope.myCoursePlanRecordTableState.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = $scope.myCoursePlanRecordTableState.number || 10;  // Number of entries showed per page.
                var ta = $scope.myCoursePlanRecordTableState;
                //如果有传入班级id
                if ($scope.studentClass && $scope.studentClass.id) {
                    if (!ta.search.predicateObject) {
                        ta.search.predicateObject = {};
                    }
                    ta.search.predicateObject.class_id = $scope.studentClass.id;
                    ta.search.predicateObject.start_time = $scope.classCoursePlanFilter.startTime;
                    ta.search.predicateObject.teacher_name = $scope.classCoursePlanFilter.teacherName;
                }
                CoursePlanService.Classrecordlist(start, number, ta).then(function (result) {
                    $scope.displayedrecord = result.data;
                    $scope.num = result.numberOfPages;
                    $scope.myCoursePlanRecordTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isrendLoading = false;
                    $rootScope.fn = $scope.ClasscallServerrecord
                    $rootScope.argument = ta
                });
            }

            /**
             * 已消课列表
             */

            $scope.ClasscallServerrecord = function ClasscallServerrecord(tableState) {
                if ($scope.modalAlready && $scope.modalAlready.$isShown) {
                    if (!tableState.search.predicateObject) {
                        $scope.PlanAlreadyFlag = 1;
                    }
                    tableState.search.predicateObject = tableState.search.predicateObject || {};
                    tableState.search.predicateObject.is_past = 1;
                } else if ($scope.PlanAlreadyFlag) {
                    delete tableState.search.predicateObject
                }
                $scope.isrendLoading = true;
                $scope.myCoursePlanRecordTableState = tableState;

                var pagination = tableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;
                var ta = tableState;
                // if (ta.search.predicateObject && ta.search.predicateObject.is_past) {
                //     ta.search.predicateObject.is_past -= 1;
                // }
                if ($scope.studentClass && $scope.studentClass.id) {
                    if (!ta.search.predicateObject) {
                        ta.search.predicateObject = {};
                    }
                    ta.search.predicateObject.class_id = $scope.studentClass.id;
                }
                if (!ta.search.predicateObject) {
                    ta.search.predicateObject = {};
                }
                ta.search.predicateObject.classCategory = 1;

                CoursePlanService.Classrecordlist(start, number, ta).then(function (result) {
                    $scope.displayedrecord = result.data;
                    if ($scope.displayedrecord != null) {
                        $scope.lastObj = result.data[result.data.length - 1];
                    }
                    $scope.myCoursePlanRecordTableState = tableState;
                    $scope.num = result.numberOfPages;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isrendLoading = false;
                    $rootScope.fn = $scope.ClasscallServerrecord
                    $rootScope.argument = ta
                });
            };

            if (AuthenticationService.currentUser().position_id == Constants.PositionID.TEACHER
                || AuthenticationService.currentUser().position_id == Constants.PositionID.TEACHER_MASTER) {
                $scope.isTeacherOrTeacherMaster = true;
            }
            else {
                $scope.isTeacherOrTeacherMaster = false;
            }

            if (AuthenticationService.currentUser().position_id == Constants.PositionID.STUDENT_CHIEF
                || AuthenticationService.currentUser().position_id == Constants.PositionID.TEACHER_MASTER) {
                $scope.is_STUDENT_CHIEF = true;
            }
            else {
                $scope.is_STUDENT_CHIEF = false;
            }

            //判断是否为优胜派的，因为他们没有班主任
            var currentUserPositionId = AuthenticationService.currentUser().position_id;
            if (currentUserPositionId == Constants.PositionID.YSP_CHENGZHANGGUWEN
                || currentUserPositionId == Constants.PositionID.YSP_HEADMASTER
                || currentUserPositionId == Constants.PositionID.YSP_FINANCIAL
                || currentUserPositionId == Constants.PositionID.YSP_CHENGZHANGGUWEN_MASTER
                || currentUserPositionId == Constants.PositionID.YSP_TEACHER) {
                $scope.IsYSP = true;
            }


            /**
             * 已消课列表
             */
            $scope.ListencallServerrecord = function ListencallServerrecord(tableState) {
                if ($scope.modalAlready && $scope.modalAlready.$isShown) {
                    //  查询要消课的排课记录
                    if (!tableState.search.predicateObject) {
                        $scope.PlanAlreadyFlag = 1
                    }
                    tableState.search.predicateObject = tableState.search.predicateObject || {}
                    tableState.search.predicateObject.is_past = 0
                } else if ($scope.PlanAlreadyFlag) {
                    //  防止干扰原来的逻辑
                    delete tableState.search.predicateObject
                }
                $scope.isrendLoading = true;
                $scope.myCoursePlanRecordTableState = tableState;

                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                //console.log('call server'+tableState);
                var ta = angular.copy(tableState);
                if (!ta.search.predicateObject) {
                    ta.search.predicateObject = {};
                }
                ta.search.predicateObject.omsCoursePlanId = $scope.quickOmsCoursePlanId;
                if (ta.search.predicateObject && ta.search.predicateObject.is_past) {
                    ta.search.predicateObject.is_past -= 1;
                }
                CoursePlanService.Listenrecordlist(start, number, ta).then(function (result) {
                    $scope.displayedrecord = result.data;
                    $scope.myCoursePlanRecordTableState = tableState;
                    $scope.num = result.numberOfPages;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isrendLoading = false;
                });
            };
            /**
             * 快速查询
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
                    if (i == 4) {
                        $scope.OmsCoursePlanVoForCreate.remark = '撤销不满意';
                        $scope.OmsCoursePlanVoForCreate.remarkext = null;
                        $scope.remark = false;
                        $scope.isSelect = true;
                    }
                    saveUnsatisfied();
                }

            };
            $scope.chexiaobumanyi = function (row, isPast, type) {
                CoursePlanService.getCoursePlanInfo(row.id).then(function (result) {
                    if (result.status != "SUCCESS") {
                        $scope.callServerrecord($scope.myCoursePlanRecordTableState);
                        return;
                    }
                    var omsCoursePlan = angular.copy(result.data);
                    $scope.addUnsatisfied2(omsCoursePlan, isPast, type);
                });
            }
            $scope.CoursePlanUnsatisfied = function CoursePlanUnsatisfied(i) {
                if ($scope.quick[i]) {
                    $scope.quick[i] = false;
                    $scope.myCoursePlanRecordTableState.search.predicateObject.is_past = null;
                    $scope.myCoursePlanRecordTableState.search.predicateObject.start_time = null;
                    $scope.myCoursePlanRecordTableState.search.predicateObject.end_time = null;
                    $scope.showListView();
                } else {
                    $scope.quick = [false, false, false];
                    $scope.quick[i] = true;

                    _setFilter(i);
                    $scope.showListView();
                    $scope.filter.start_time = null;
                    $scope.filter.end_time = null;
                }

            };

            $scope.filter = {};
            $scope.ListenCoursePlanquick = function ListenCoursePlanquick(i) {
                if ($scope.quick[i]) {
                    $scope.quick[i] = false;
                    $scope.myCoursePlanRecordTableState.search.predicateObject.is_past = null;
                    $scope.myCoursePlanRecordTableState.search.predicateObject.start_time = null;
                    $scope.myCoursePlanRecordTableState.search.predicateObject.end_time = null;
                    $scope.myCoursePlanRecordTableState.search.predicateObject.type = 3;
                    $scope.showListenListView();
                } else {
                    $scope.quick = [false, false, false, false];
                    $scope.quick[i] = true;

                    _setFilter(i);
                    $scope.showListenListView();
                    $scope.filter.start_time = null;
                    $scope.filter.end_time = null;
                }

            };
            $scope.filter = {};

            function _setFilter(i) {

                if (!$scope.myCoursePlanRecordTableState.search.predicateObject) {
                    $scope.myCoursePlanRecordTableState.search.predicateObject = {};
                }
                if (i == 1) {//今日未上课
                    $scope.myCoursePlanRecordTableState.search.predicateObject.is_past = 1;//消课状态 0未消课 1已消课

                    $scope.myCoursePlanRecordTableState.search.predicateObject.start_time = new Date().Format('yyyy-MM-dd');
                    $scope.myCoursePlanRecordTableState.search.predicateObject.end_time = new Date().Format('yyyy-MM-dd');
                } else if (i == 2) {//今日已上课
                    $scope.myCoursePlanRecordTableState.search.predicateObject.is_past = 2;//消课状态 0未消课 1已消课
                    $scope.myCoursePlanRecordTableState.search.predicateObject.start_time = new Date().Format('yyyy-MM-dd');
                    $scope.myCoursePlanRecordTableState.search.predicateObject.end_time = new Date().Format('yyyy-MM-dd');
                } else if (i == 3) {//本周未上课
                    $scope.myCoursePlanRecordTableState.search.predicateObject.is_past = 1;//消课状态 0未消课 1已消课
                    $scope.myCoursePlanRecordTableState.search.predicateObject.start_time = new Date(_timestampByWeekNew().start).Format('yyyy-MM-dd');
                    $scope.myCoursePlanRecordTableState.search.predicateObject.end_time = new Date(_timestampByWeekNew().end).Format('yyyy-MM-dd');
                } else if (i == 4) {//本周已上课
                    $scope.myCoursePlanRecordTableState.search.predicateObject.is_past = 2;//消课状态 0未消课 1已消课
                    $scope.myCoursePlanRecordTableState.search.predicateObject.start_time = new Date(_timestampByWeekNew().start).Format('yyyy-MM-dd');
                    $scope.myCoursePlanRecordTableState.search.predicateObject.end_time = new Date(_timestampByWeekNew().end).Format('yyyy-MM-dd');
                } else {
                    $scope.myCoursePlanRecordTableState.search.predicateObject.is_past = null;
                    $scope.filter.start_time = null;
                    $scope.filter.end_time = null;
                }

            }

            $scope.filter = {};

            function _setListenFilter(i) {

                if (!$scope.myCoursePlanRecordTableState.search.predicateObject) {
                    $scope.myCoursePlanRecordTableState.search.predicateObject = {};
                }
                $scope.myCoursePlanRecordTableState.search.predicateObject.type = 3;
                if (i == 1) {//今日未上课
                    $scope.myCoursePlanRecordTableState.search.predicateObject.is_past = 1;//消课状态 0未消课 1已消课

                    $scope.myCoursePlanRecordTableState.search.predicateObject.start_time = new Date().Format('yyyy-MM-dd');
                    $scope.myCoursePlanRecordTableState.search.predicateObject.end_time = new Date().Format('yyyy-MM-dd');
                } else if (i == 2) {//今日已上课
                    $scope.myCoursePlanRecordTableState.search.predicateObject.is_past = 2;//消课状态 0未消课 1已消课
                    $scope.myCoursePlanRecordTableState.search.predicateObject.start_time = new Date().Format('yyyy-MM-dd');
                    $scope.myCoursePlanRecordTableState.search.predicateObject.end_time = new Date().Format('yyyy-MM-dd');
                } else if (i == 3) {//本周未上课
                    $scope.myCoursePlanRecordTableState.search.predicateObject.is_past = 1;//消课状态 0未消课 1已消课
                    $scope.myCoursePlanRecordTableState.search.predicateObject.start_time = new Date(_timestampByWeekNew().start).Format('yyyy-MM-dd');
                    $scope.myCoursePlanRecordTableState.search.predicateObject.end_time = new Date(_timestampByWeekNew().end).Format('yyyy-MM-dd');
                } else if (i == 4) {//本周已上课
                    $scope.myCoursePlanRecordTableState.search.predicateObject.is_past = 2;//消课状态 0未消课 1已消课
                    $scope.myCoursePlanRecordTableState.search.predicateObject.start_time = new Date(_timestampByWeekNew().start).Format('yyyy-MM-dd');
                    $scope.myCoursePlanRecordTableState.search.predicateObject.end_time = new Date(_timestampByWeekNew().end).Format('yyyy-MM-dd');
                } else {
                    $scope.myCoursePlanRecordTableState.search.predicateObject.is_past = null;
                    $scope.filter.start_time = null;
                    $scope.filter.end_time = null;
                }

            }

            /**
             * 获取当前周的时间
             */
            function _timestampByWeekNew() {

                var day = new Date().getDay();//获取当前星期X(0-6,0代表星期天)
                if (day == 0) {
                    day = 7;
                }
                ;

                var today = new Date();
                today.setHours(0);
                today.setMinutes(0);
                today.setSeconds(0);
                today.setMilliseconds(0);

                var oneday = 1000 * 60 * 60 * 24;
                return {
                    start: today.getTime() + oneday * (1 - day),
                    end: today.getTime() + oneday * (7 - day)
                }
            }


            /**
             * 显示不满意弹窗 撤销消课弹框
             */
            function addUnsatisfied(omsCoursePlan, isPast, type) {
                console.log('Starting creating new unsatisfied.');
                $scope.EditType = type;
                $scope.remarkext = '';
                $scope.OmsCoursePlanVoForCreate = angular.copy(omsCoursePlan);
                /* $scope.OmsCoursePlanVoForCreate.id = omsCoursePlan.id;
                 $scope.OmsCoursePlanVoForCreate.isPast = isPast;
                 $scope.OmsCoursePlanVoForCreate.order_rule=omsCoursePlan.order_rule;
                 $scope.OmsCoursePlanVoForCreate.crmStudentId = omsCoursePlan.crmStudentId;
                 $scope.OmsCoursePlanVoForCreate.price=omsCoursePlan.price;
                 $scope.OmsCoursePlanVoForCreate.type=omsCoursePlan.type;
                 $scope.OmsCoursePlanInfo = {};
                 $scope.OmsCoursePlanInfo.teachername=omsCoursePlan.teacher_name;
                 $scope.OmsCoursePlanInfo.studentname=omsCoursePlan.student_name;*/
                // showModal();
                $scope.quick = [false, false, false];
                $scope.remark = false;
                $scope.CoursePlanquick(1);
            }

            $scope.addUnsatisfied2 = function (omsCoursePlan, isPast, type) {
                console.log('Starting creating new unsatisfied.');
                $scope.EditType = type;
                $scope.remarkext = '';
                $scope.OmsCoursePlanVoForCreate = angular.copy(omsCoursePlan);
                /* $scope.OmsCoursePlanVoForCreate.id = omsCoursePlan.id;
                 $scope.OmsCoursePlanVoForCreate.isPast = isPast;
                 $scope.OmsCoursePlanVoForCreate.order_rule=omsCoursePlan.order_rule;
                 $scope.OmsCoursePlanVoForCreate.crmStudentId = omsCoursePlan.crmStudentId;
                 $scope.OmsCoursePlanVoForCreate.price=omsCoursePlan.price;
                 $scope.OmsCoursePlanVoForCreate.type=omsCoursePlan.type;
                 $scope.OmsCoursePlanInfo = {};
                 $scope.OmsCoursePlanInfo.teachername=omsCoursePlan.teacher_name;
                 $scope.OmsCoursePlanInfo.studentname=omsCoursePlan.student_name;*/
                // showModal();
                $scope.quick = [false, false, false];
                $scope.remark = false;
                $scope.CoursePlanquick(4);
            }
            // 消课错误
            $scope.addUnsatisfiedwrong = function addUnsatisfiedwrong(omsCoursePlan, isPast, type) {
                console.log('Starting creating new unsatisfied.');
                $scope.EditType = type;
                $scope.remarkext = '';
                $scope.OmsCoursePlanVoForCreate = angular.copy(omsCoursePlan);
                /* $scope.OmsCoursePlanVoForCreate.id = omsCoursePlan.id;
                 $scope.OmsCoursePlanVoForCreate.isPast = isPast;
                 $scope.OmsCoursePlanVoForCreate.order_rule=omsCoursePlan.order_rule;
                 $scope.OmsCoursePlanVoForCreate.crmStudentId = omsCoursePlan.crmStudentId;
                 $scope.OmsCoursePlanVoForCreate.price=omsCoursePlan.price;
                 $scope.OmsCoursePlanVoForCreate.type=omsCoursePlan.type;
                 $scope.OmsCoursePlanInfo = {};
                 $scope.OmsCoursePlanInfo.teachername=omsCoursePlan.teacher_name;
                 $scope.OmsCoursePlanInfo.studentname=omsCoursePlan.student_name;*/
                // showModal();
                $scope.quick = [false, false, false];
                $scope.remark = false;
                $scope.CoursePlanquick(2);
            }

            $scope.isCancel = function isCancel(row) {
                debugger
                var passDate = $filter('date')(row.passDate, 'yyyy-MM');
                var nowDate = $filter('date')(new Date(), 'yyyy-MM');
                //var nowDate  =.dateFormart('yyyy-MM');

                //var nowDate=angular.$filter('date')(now,'yyyy-MM');
                if (passDate == nowDate) {
                    return true;
                }
                else {
                    return false;
                }

            }

            function addUnsatisfiedForOne2One(row, isPast, type) {
                CoursePlanService.getCoursePlanInfo(row.id).then(function (result) {
                    if (result.status != "SUCCESS") {
                        $scope.callServerrecord($scope.myCoursePlanRecordTableState);
                        return;
                    }
                    var omsCoursePlan = angular.copy(result.data);
                    addUnsatisfied(omsCoursePlan, isPast, type);
                });
            }

            // 取消消课不满意操作
            $scope.addUnsatisfiedForOne2Onenohp = function (row, isPast, type) {
                CoursePlanService.getCoursePlanInfo(row.id).then(function (result) {
                    if (result.status != "SUCCESS") {
                        $scope.callServerrecord($scope.myCoursePlanRecordTableState);
                        return;
                    }
                    var omsCoursePlan = angular.copy(result.data);
                    addUnsatisfied(omsCoursePlan, isPast, type);
                });
            }
            // 取消消课消课错误操作
            $scope.addUnsatisfiedForOne2OneCpwrong = function (row, isPast, type) {
                if (!row.is_satisfied) {
                    SweetAlert.swal('不满意状态下请先撤销不满意')
                    return false;
                }
                CoursePlanService.getCoursePlanInfo(row.id).then(function (result) {
                    if (result.status != "SUCCESS") {
                        $scope.callServerrecord($scope.myCoursePlanRecordTableState);
                        return;
                    }
                    var omsCoursePlan = angular.copy(result.data);
                    $scope.addUnsatisfiedwrong(omsCoursePlan, isPast, type);
                });
            }


            // 取消消课消课错误操作
            $scope.isHideButton = function (row) {
                if (!row.passDate) {
                    SweetAlert.swal('不满意状态下请先撤销不满意')
                    return true;
                }
                CoursePlanService.getCoursePlanInfo(row.id).then(function (result) {
                    if (result.status != "SUCCESS") {
                        $scope.callServerrecord($scope.myCoursePlanRecordTableState);
                        return;
                    }
                    var omsCoursePlan = angular.copy(result.data);
                    $scope.addUnsatisfiedwrong(omsCoursePlan, isPast, type);
                });
            }


            function chromePrintForOne2One(row) {
                if (angular.isNumber(row)) {
                    var id = row
                    row = {
                        id: id
                    }
                }
                CoursePlanService.getCoursePlanInfo(row.id).then(function (result) {
                    if (result.status != "SUCCESS") {
                        $scope.callServerrecord($scope.myCoursePlanRecordTableState);
                        return;
                    }
                    var omsCoursePlan = angular.copy(result.data);
                    $scope.chromePrint(omsCoursePlan);
                });
            }

            /**
             * 打印课票弹框
             * @update    2017-01-06用对象改为数组
             * @param row
             */
            $scope.chromePrint = function (row) {


                $scope.modalTitle = '上课凭单预览'
                $scope.printDetailList = []
                $scope.printTime = new Date().getTime()
                var printDetail = angular.copy(row)
                if (!angular.isArray(row)) {
                    $scope.printDetailList.push(printDetail)
                } else {
                    $scope.printDetailList = angular.copy(printDetail)
                }
                if ($scope.mtResultModal) {
                    $scope.mtResultModal.hide()
                }
                $scope.printModal = $mtModal.modal('optimize/modal/print/index.html', $scope)

            }
            $scope.hidePrint = function () {
                $scope.printModal.hide()
                if ($scope.$parent.getGroupCoursePlanList) {
                    $scope.$parent.getGroupCoursePlanList($scope.$parent.groupCoursePlantableState)
                }
            }

            function channleEdit() {
                //$scope.select = {};
                //$scope.dataLoading = false;
                $scope.modal.hide();
            }

            /**
             * 不满意弹窗
             */
            function showModal() {
                $scope.quick = [false, false, false];
                $scope.remark = false;
                $scope.modalTitle = '取消消课原因';
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/o2o/coursePlan/modal.record.html',
                    show: true
                });
            }

            $scope.planAlready = function () {
                $scope.mtLayer = false
                $scope.modalTitle = '选择要消课的排课记录';
                $scope.modalAlready = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/coursePlan/modal.plan.already.html',
                    show: true
                })
            }

            function saveUnsatisfied() {
                var consumers_type = "确定取消消课?"
                if ($scope.OmsCoursePlanVoForCreate.remark == "不满意") {
                    consumers_type = '是否确认消课，并且标记不满意？'
                } else if ($scope.OmsCoursePlanVoForCreate.remark == "消课错误") {
                    consumers_type = '是否撤销消课？'
                } else if ($scope.OmsCoursePlanVoForCreate.remark == "撤销不满意") {
                    consumers_type = '撤销不满意？'
                }
                if ($scope.isSelect) {
                    SweetAlert.swal({
                            title: "",
                            text: "<h2 class='c3 f24' id='mt_cancel_consumers'>" + consumers_type + "</h2>",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: '#fe9900',
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            html: true,
                            closeOnConfirm: true
                        }, function (confirm) {
                            $('#mt_cancel_consumers').remove()
                            if (confirm) {
                                var promise = CoursePlanService.consume($scope.OmsCoursePlanVoForCreate);
                                promise.then(function (OmsCoursePlanVoForCreate) {
                                    $scope.dataLoading = false;
                                    // $scope.modal.hide();
                                    if ($scope.EditType == 2) {//刷新我的意向客户详情排课列表
                                        $scope.callServer1($scope.myCoursePlanTableState);
                                    } else if ($scope.EditType == 1) {//刷新一对一排课列表
                                        $scope.showListView();
                                    } else if ($scope.EditType == 6) {//刷新一对多排课列表
                                        $scope.GroupcallServerrecord($scope.GroupCoursePlanRecordTableState)
                                    } else if ($scope.EditType == 3) {//刷新学员详情排课列表
                                        if ($scope.myCoursePlanTableState) {
                                            $scope.callServer1($scope.myCoursePlanTableState);
                                        } else if ($scope.EditType == 1) {//刷新一对一排课列表
                                            $scope.showListView();
                                        } else if ($scope.EditType == 6) {//刷新一对多排课列表
                                            $scope.GroupcallServerrecord($scope.GroupCoursePlanRecordTableState)
                                        } else if ($scope.EditType == 3) {//刷新学员详情排课列表
                                            if ($scope.myCoursePlanTableState) {
                                                $scope.callServer1($scope.myCoursePlanTableState);
                                            }
                                            if ($scope.coursePlanRecordTableState) {
                                                $scope.callCoursePlanServer($scope.coursePlanRecordTableState);
                                            }
                                        } else {

                                        }
                                        if ($scope.coursePlanRecordTableState) {
                                            $scope.callCoursePlanServer($scope.coursePlanRecordTableState);
                                        }
                                    } else if ($scope.EditType == 4) {
                                        $scope.callServerrecord($scope.myCoursePlanRecordTableState);
                                    } else {

                                    }
                                    try {
                                        $rootScope.getRemindsData(4, 2, 1);//刷新提醒列表
                                    } catch (e) {

                                    }

                                }, function (error) {
                                    $scope.dataLoading = false;
                                });
                                $scope.isSelect = false;
                                $scope.quick = [false, false, false];
                                $scope.remark = false;
                            }
                        }
                    );
                } else {
                    SweetAlert.swal("请选择原因", "请重试", "error");
                }

            }


            /**
             * Saves the current invitationCommunication.
             */
            function save() {
                // console.log('Saving the unsatisfied.');

                var promise = CoursePlanService.update($scope.OmsCoursePlanVoForCreate);
                $scope.dataLoading = false;
                $scope.modal.hide();
                promise.then(function (OmsCoursePlanVoForCreate) {

                }, function (error) {
                    //$scope.dataLoading = false;
                });

            }

            /**
             * 导出Excel
             */
            function exportGroupCoursePlanToExcel(ispast) {

                var statisticsExportTableStyle;
                //$scope.myCoursePlanRecordTableState = tableState;
                if ($scope.Groupnum > 300) {
                    SweetAlert.swal('导出数据不能大于3000条');
                }
                else {
                    // var pagination = $scope.myCoursePlanRecordTableState.pagination;
                    var start = 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    var number = 300;  // Number of entries showed per page.
                    //console.log('call server'+tableState);
                    if ($scope.GroupCoursePlanRecordTableState.search.predicateObject) {
                        $scope.GroupCoursePlanRecordTableState.search.predicateObject.excel = 1;
                    } else {
                        $scope.GroupCoursePlanRecordTableState.search.predicateObject = {};
                        $scope.GroupCoursePlanRecordTableState.search.predicateObject.excel = 1;
                    }
                    CoursePlanService.Grouprecordlist(start, number, $scope.GroupCoursePlanRecordTableState).then(function (result) {
                        $scope.Groupdisplayedrecord1 = result.data;
                        for (var i = 0; i < $scope.Groupdisplayedrecord1.length; i++) {
                            var l = $scope.Groupdisplayedrecord1[i].coursePlanIdList;
                            var co = 0;
                            if (l != null) {
                                for (var m = 0; m < l.length; m++) {
                                    co += l[m].coefficient;
                                }
                            }
                            $scope.Groupdisplayedrecord1[i].course_num_past = Math.floor($scope.Groupdisplayedrecord1[i].courseNum * co * 10) / 10.0;
                        }

                        if ($scope.GroupCoursePlanRecordTableState.search.predicateObject) {
                            $scope.GroupCoursePlanRecordTableState.search.predicateObject.excel = 1;
                            delete $scope.GroupCoursePlanRecordTableState.search.predicateObject.excel;
                        } else {

                        }


                        //$scope.myCoursePlanRecordTableState.pagination.numberOfPages = result1.numberOfPages;//set the number of pages so the pagination can update
                        statisticsExportTableStyle = {
                            sheetid: '已消课数据',
                            headers: true,
                            caption: {
                                title: '已消课数据',
                            },
                            column: {style: 'font-size:14px; text-align:left;'},
                            columns: [
                                {columnid: 'groupName', title: '一对多名称'},
                                {columnid: 'namesext', title: '学生姓名'},
                                {columnid: 'xueguanname', title: '学习顾问'},
                                {columnid: 'student_count', title: '一对多人数'},
                                {columnid: 'courseType', title: '订单类型'},
                                {columnid: 'subject_name', title: '科目'},
                                {columnid: 'start_time', title: '上课时间'},
                                {columnid: 'end_time', title: '下课时间'},
                                {columnid: 'courseNum', title: '课时'},

                                {columnid: 'course_num_past', title: '消课课时'},

                                {columnid: 'teacherName', title: '任课老师'},
                                {columnid: 'part_full', title: '兼职/全职'},
                                {columnid: 'mobile', title: '老师电话'},
                                {columnid: 'passOperatorName', title: '消课人'},
                                {columnid: 'remark', title: '不满意原因'},
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
                        alasql('SELECT * INTO XLS("已消课列表.xls", ?) FROM ?', [statisticsExportTableStyle, $scope.Groupdisplayedrecord1]);

                    });
                }
            }


            /**
             * 日期格式化
             * @param format
             * 格式化参数，支持各种日期格式
             * @returns {string}
             * 返回格式化后日期
             */
            /* eslint-disable no-extend-native */
            /* eslint-disable indent */
            /*Date.prototype.dateFormart = Date.prototype.dateFormart || function (format) {
              /* eslint-disable no-useless-escape */

            /*if (isNaN(this.getTime())) {
              return ''
            }
            let formatString = format.match(/[A-Za-z]{1,4}|[\--\/-年-月-日-时-分-秒-\s-:]/g)
            let date = []
            for (let i = 0, len = formatString.length; i < len; i++) {
              switch (formatString[i]) {
                case 'yyyy':
                  date.push(this.getFullYear())
                  break
                case 'yy':
                  date.push(this.getYear())
                  break
                case 'MM':
                  let month = this.getMonth() + 1
                  date.push(dNumber(month))
                  break
                case 'M':
                  date.push(this.getMonth() + 1)
                  break
                case 'dd':
                  date.push(dNumber(this.getDate()))
                  break
                case 'd':
                  date.push(this.getDate())
                  break
                case 'HH':
                  date.push(dNumber(this.getHours()))
                  break
                case 'H':
                  date.push(this.getHours())
                  break
                case 'mm':
                  date.push(dNumber(this.getMinutes()))
                  break
                case 'm':
                  date.push(this.getMinutes())
                  break
                case 'ss':
                  date.push(dNumber(this.getSeconds()))
                  break
                case 's':
                  date.push(this.getSeconds())
                  break
                default:
                  date.push(formatString[i])
                  break
              }
            }
            return date.join('')
          }*/


            /**
             * 导出Excel
             */
            function exportStatisticsToExcel(ispast) {
                var statisticsExportTableStyle;
                //$scope.myCoursePlanRecordTableState = tableState;
                if ($scope.num > 300) {
                    SweetAlert.swal('导出数据不能大于3000条');
                }
                else {
                    var pagination = $scope.myCoursePlanRecordTableState.pagination;
                    var start = 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    var number = 10;  // Number of entries showed per page.
                    //console.log('call server'+tableState);
                    CoursePlanService.Excelrecordlist(start, number, $scope.myCoursePlanRecordTableState).then(function (result1) {

                        $scope.displayedrecord1 = result1.data.data;

                        $scope.showListView();
                        $scope.myCoursePlanRecordTableState.pagination.numberOfPages = result1.numberOfPages;//set the number of pages so the pagination can update
                        statisticsExportTableStyle = {
                            sheetid: '已消课数据',
                            headers: true,
                            caption: {
                                title: '已消课数据',
                            },
                            column: {style: 'font-size:14px; text-align:left;'},
                            //columns: [{ columnid: 'name', title: '学生所属校区' },
                            columns: [

                                {columnid: 'student_name', title: '学生姓名'},
									 {columnid: 'student_id', title: '学生id'},
                                {columnid: 'phone', title: '电话'},
                                {columnid: 'xueguanname', title: '学习顾问'},
                                {columnid: 'order_no', title: '订单号', width: '100px'},
                                {columnid: 'order_type', title: '订单类型'},
                                //{ columnid: 'order_no', title: '合同编号', width: '100px' },
                                {columnid: 'coursename', title: '课程类型', width: '100px'},

                                {columnid: 'course_property', title: '课时性质'},
                                {columnid: 'price', title: '计费金额'},
                                // 确认收入
								{columnid: 'confirmIncome', title: '确认收入'},
                                {columnid: 'isPast', title: '消课状态'},
                                {columnid: 'grade_name', title: '年级'},
                                {columnid: 'course_type', title: '排课类型'},
                                {columnid: 'subject_name', title: '科目'},
                                {columnid: 'start_time', title: '上课时间'},

                                {columnid: 'end_time', title: '下课时间'},
                                {columnid: 'courseNum', title: '排课课时数'},
                                { columnid: 'coefficient', title: '消课系数' },
                                { columnid: 'course_num_end', title: '消课课时' },

                                {columnid: 'teacher_name', title: '任课老师'},
                                {columnid: 'part_full', title: '兼职/全职'},
                                {columnid: 'name1', title: '教师所属校区'},
                                {columnid: 'passOperatorName', title: '消课人'},
                                {columnid: 'passDate', title: '消课时间'},


                                //{ columnid: 'mobile', title: '老师电话' },
                                {columnid: 'remark', title: '取消原因'},


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
                        alasql('SELECT * INTO XLS("已消课列表.xls", ?) FROM ?', [statisticsExportTableStyle, $scope.displayedrecord1]);

                    });
                }
            }


            /**
             * Delete InvitationCommunication.
             * @param InvitationCommunication the InvitationCommunication to delete
             */
            function remove(omsCoursePlan, type) {
                //console.log('Deleting InvitationCommunication : ' + JSON.stringify(OmsCoursePlan));
                $scope.EditType = type;
                // $('#Qh2').parent().addClass('Qh2_p').end().remove()
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
                            if (type == 14) {
                                omsCoursePlan.type = 14
                            }
                            var promise = CoursePlanService.remove(omsCoursePlan);
                            //$rootScope.showLoading();

                            promise.then(function () {
                                if (omsCoursePlan.type == 7 || omsCoursePlan.type == 12 || omsCoursePlan.type == 14) {
                                    try {

                                        if ($scope.myCoursePlanRecordTableState) {
                                            $scope.ClasscallServerrecord($scope.myCoursePlanRecordTableState);
                                        } else {
                                            $scope.getTeacherTimes();
                                            $scope.getSchoolsTimes();
                                        }

                                    } catch (e) {
                                        angular.element("#refe").click();
                                    }
                                } else if (location.href.indexOf('fb-admin/CoursePlan_Listen') > -1) {
                                    $scope.ListencallServerrecord($scope.myCoursePlanRecordTableState)
                                } else {

                                    $scope.dataLoading = false;

                                    if ($scope.EditType == 2) {//刷新我的意向客户详情排课列表
                                        $scope.callServer1($scope.myCoursePlanTableState);
                                    } else if ($scope.EditType == 1) {//刷新一对一排课列表
                                        $scope.showListView();
                                    } else if ($scope.EditType == 3) {//刷新学员详情排课列表
                                        if ($scope.myCoursePlanTableState) {
                                            $scope.callServer1($scope.myCoursePlanTableState);
                                        }
                                        if ($scope.coursePlanRecordTableState) {
                                            $scope.callCoursePlanServer($scope.coursePlanRecordTableState);
                                        }
                                    } else if ($scope.EditType == 4) {
                                        if ($scope.myCoursePlanRecordTableState) {
                                            $scope.ListencallServerrecord($scope.myCoursePlanRecordTableState);
                                        }
                                    } else if ($scope.EditType == 5) {
                                        $scope.ClasscallServerrecord($scope.myCoursePlanRecordTableState);
                                    } else if ($scope.EditType == 6) {//刷新一对多排课列表
                                        $scope.GroupcallServerrecord($scope.GroupCoursePlanRecordTableState)
                                    }
                                    else {
                                        angular.element("#refe").click();
                                    }
                                    try {
                                        $rootScope.getRemindsData(4, 2, 1);//刷新提醒列表
                                        $scope.getSchoolsTimes();
                                    } catch (e) {

                                    }
                                }


                            }, function (error) {
                                //$rootScope.hideLoading();

                            });
                        }
                        angular.element('.sweet-alert').remove()
                        angular.element('.sweet-overlay').remove()
                    }
                );
            }

            function removeForOne2One(row, type) {
                CoursePlanService.getCoursePlanInfo(row.id).then(function (result) {
                    if (result.status != "SUCCESS") {
                        $scope.callServerrecord($scope.myCoursePlanRecordTableState);
                        return;
                    }
                    var omsCoursePlan = angular.copy(result.data);
                    remove(omsCoursePlan, type);
                });
            }

            function Activityremove(omsCoursePlan) {
                //console.log('Deleting InvitationCommunication : ' + JSON.stringify(OmsCoursePlan));


                SweetAlert.swal({
                        title: "确定要撤销吗？",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: '#fe9900',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true
                    }, function (confirm) {
                        if (confirm) {
                            var promise = CoursePlanService.remove(omsCoursePlan);
                            //$rootScope.showLoading();

                            promise.then(function () {
                                $scope.ActivityServerrecord($scope.ActivityCoursePlanRecordTableState);


                            }, function (error) {
                                //$rootScope.hideLoading();

                            });
                        }
                    }
                );
            }

            /**
             * view InvitationCommunication.
             * @param InvitationCommunication the InvitationCommunication to view
             */
            function view(OmsCoursePlan) {
                // console.log('Viewing InvitationCommunication : ' + JSON.stringify(crmInvitationCommunication));
                $scope.CrmInvitationCommunicationVoForCreate = angular.copy(crmInvitationCommunication);

                if ($scope.CrmInvitationCommunicationVoForCreate.personState == '2') {
                    $scope.modalTitle = '查看leads信息';
                }
                if ($scope.CrmInvitationCommunicationVoForCreate.personState == '1') {
                    $scope.modalTitle = '查看客户信息';
                }
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/invitationCommunication/modal.viewtest.html',
                    show: true
                });
            }

            /**
             * 消课和取消
             */
            function consume(omsCoursePlan, isPast) {
                omsCoursePlan.isPast = isPast;
                omsCoursePlan.remark = '无';
                var promise = CoursePlanService.consume(omsCoursePlan);
                promise.then(function () {
                    //$rootScope.hideLoading();
                }, function (error) {
                    //$rootScope.hideLoading();
                });
                $scope.showListView();
            }

            /**
             * yes页面消课
             */
            function yesconsume(omsCoursePlan, row) {
                /*var param = {
                 title: "是否确认消课？",/!*系统内消课无法打印课票,*!/
                 type: "warning",
                 showCancelButton: true,
                 confirmButtonColor: '#fe9900',
                 confirmButtonText: '确定',
                 cancelButtonText: '取消',
                 closeOnConfirm: true
                 },
                 ok = ''*/


                var param = {
                    title: "<div class='ut-name'><p style=''><span>学生姓名：" + omsCoursePlan.student_name + "</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>老师姓名：" + omsCoursePlan.teacher_name + "</span></p></div>",
                    text: '<h2 class="c3 f24" id="Qh2">是否确认消课？</h2>', /*系统内消课无法打印课票,*/
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#fe9900',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true,
                    html: true
                }
                SweetAlert.swal(param,
                    function (confirm) {
                        if (confirm) {
                            var promise = CoursePlanService.yesconsume(omsCoursePlan);
                            promise.then(function (results) {
                                if (results.status == 'FAILURE') {
                                    $mtModal.moreModal({
                                        text: '消课失败！！',
                                        status: 1,
                                        scope: $scope
                                    })
                                    return;
                                } else if (results.status == 'HASCANCELED') {
                                    $mtModal.moreModal({
                                        text: '已经消课，不能再次消课！！',
                                        status: 1,
                                        scope: $scope
                                    })
                                    return;
                                } else if (results.status == 'UNREACHDATE') {
                                    var errMsg;
                                    if (results.data) {
                                        errMsg = results.error;
                                    } else {
                                        errMsg = "消课失败，未到消课日期！！"
                                    }
                                    $mtModal.moreModal({
                                        text: errMsg,
                                        status: 1,
                                        scope: $scope
                                    })

                                    return;
                                } else if (results.status == 'HASCANCELED') {
                                    $mtModal.moreModal({
                                        text: '已经消课，不能再次消课！！',
                                        status: 1,
                                        scope: $scope
                                    })
                                    return;
                                } else if (results.status == 'UNREACHDATE') {
                                    var errMsg;
                                    if (results.data) {
                                        errMsg = results.error;
                                    } else {
                                        errMsg = "消课失败，未到消课日期！！"
                                    }
                                    $mtModal.moreModal({
                                        text: errMsg,
                                        status: 1,
                                        scope: $scope
                                    })
                                    return;
                                }

                                if (JSON.parse(sessionStorage.getItem("com.youwin.yws.department")).district == 451 && JSON.parse(sessionStorage.getItem("com.youwin.yws.department")).schoolNature == 1) {
                                    var win = Math.floor(Math.random() * 100) + 1;
                                    if (win == 100) {
                                        $scope.userModel = {};
                                        $scope.userModel.userId = JSON.parse(sessionStorage.getItem("com.youwin.yws.user")).id;
                                        $scope.userModel.courseNum = omsCoursePlan.course_num_end;
                                        $scope.userModel.createdAt = new Date(omsCoursePlan.start_time);
                                        var Prizepromise = UserPrizeService.addOrUpdate($scope.userModel);
                                        Prizepromise.then(function (result) {
                                                var winner = result.data;
                                                if (winner == true) {
                                                    prizeOpen();
                                                }
                                            }
                                        )
                                    }
                                }

                                try {
                                    $scope.getIndexData(4)
                                    $scope.getIndexData(5)
                                    // row.is_past = 1
                                } catch (e) {
                                }
                                if (omsCoursePlan.type != 3) {
                                    $mtModal.moreModal({
                                        text: '消课成功，是否打印上课凭单？',
                                        status: 1,
                                        hasNext: function () {
                                            _getOneCourseDetail(omsCoursePlan.omsCoursePlanId, $scope.chromePrint)
                                            /*console.log(omsCoursePlan)
                                             $scope.chromePrint(omsCoursePlan)*/
                                        },
                                        refresh: $scope.showListView,
                                        scope: $scope
                                    })
                                } else {
                                    $mtModal.moreModal({
                                        text: '消课成功',
                                        status: 1,
                                        scope: $scope
                                    })
                                }
                                $scope.showListView()
                                if ($scope.remindFilter && $scope.remindFilter.remind_type == 4) {
                                    $rootScope.getRemindsData(4, 2, 1);
                                }
                                if ($rootScope._getIndexData_) {
                                    $rootScope._getIndexData_(5)
                                }
                            }, function (error) {
                            });
                        }
                        angular.element('.sweet-alert').remove()
                        angular.element('.sweet-overlay').remove()
                    }
                );


            }


            function yesconsumeForOne2One(row) {
                CoursePlanService.getCoursePlanInfo(row.id).then(function (result) {
                    if (result.status != "SUCCESS") {
                        $scope.callServerrecord($scope.myCoursePlanRecordTableState);
                        return;
                    }
                    var omsCoursePlan = angular.copy(result.data);
                    yesconsume(omsCoursePlan, row);
                });
            }

            /**
             * 获取一条排课信息
             * @param id
             * id：查询条件
             * @param callBack
             * 查询完后要执行的条件：可选
             * @private
             */
            function _getOneCourseDetail(id, callBack) {
                chromePrintForOne2One(id)
                /*CoursePlanService.recordlist(0,1,{search:{predicateObject:{omsCoursePlanId:id}}}).then(function (data) {
                 callBack(data.data[0])
                 })*/
            }

            function addEditCoursePlan(row) {
                $scope.OmsCoursePlanVoForEdit = {};
                $scope.OmsCoursePlanVoForEdit.id = row.id;
                $scope.OmsCoursePlanVoForEdit.crmStudentId = row.crmStudentId;
                $scope.OmsCoursePlanVoForEdit.type = row.type;
                showEditCoursePlan(row);
            }

            function showEditCoursePlan(row, type) {
                debugger
                $scope.EditType = type;
                var title = "";
                var url = "";
                if (1 == row.type) {
                    title = "学员排课编辑"
                } else if (2 == row.type) {
                    title = "一对多排课编辑"
                } else if (3 == row.type) {
                    title = "试听排课编辑";
                } else if (7 == row.type) {
                    title = "班级排课编辑";
                }
                $scope.select = {};
                $scope.show = {
                    getEndTime: getEndTime//自动生成结束时间
                };
                if (row.order_rule == 1 || !row.order_rule) {
                    $scope.TIME_SIZE = [
                        {id: 1, name: '0.5小时'}, {id: 2, name: '1小时'}, {id: 3, name: '1.5小时'}, {id: 4, name: '2小时'}, {
                            id: 5,
                            name: '2.5小时'
                        }, {id: 6, name: '3小时'},
                    ];
                }
                //正课 取消0.5课时的 体系
                if (!(row.type == 15 || row.type == 16 || row.type == 3)) {
                    $scope.TIME_SIZE = [
                        {id: 2, name: '1小时'}, {id: 3, name: '1.5小时'}, {id: 4, name: '2小时'}, {
                            id: 5,
                            name: '2.5小时'
                        }, {id: 6, name: '3小时'},
                    ];
                }
                if (row.order_rule == 2) {
                    $scope.TIME_SIZE = [
                        {id: 1, name: '40分钟(1课时)'}, {id: 2, name: '1小时(1.5课时)'}, {id: 3, name: '1小时20分钟(2课时)'}, {
                            id: 4,
                            name: '1小时40分钟(2.5课时)'
                        }, {
                            id: 5,
                            name: '2小时(3课时)'
                        }, {id: 6, name: '2小时20分钟(3.5课时)'}, {id: 7, name: '2小时40分钟(4课时)'}, {id: 8, name: '3小时(4.5课时)'},
                    ];
                }
                $scope.OmsCoursePlanVoForEdit = {};
                $scope.teachername = {};
                $scope.teachername.mobile = row.mobile;
                $scope.teachername.user_id = row.user_id;
                $scope.teachername.type = row.type;
                $scope.teachername.crm_order_student_course_id = row.crm_order_student_course_id;
                $scope.OmsCoursePlanVoForEdit.crm_order_student_course_id = row.crm_order_student_course_id;
                $scope.OmsCoursePlanVoForEdit.id = row.id;
                $scope.OmsCoursePlanVoForEdit.groupid = row.groupId;
                $scope.OmsCoursePlanVoForEdit.user = row.user_id;
                $scope.OmsCoursePlanVoForEdit.order_rule = row.order_rule;
                $scope.OmsCoursePlanVoForEdit.price_before = row.price_before;
                $scope.OmsCoursePlanVoForEdit.start_time = row.start_time;
                $scope.OmsCoursePlanVoForEdit.end_time = row.end_time;
                $scope.OmsCoursePlanVoForEdit.price = row.new_price;
                $scope.OmsCoursePlanVoForEdit.course_num = row.course_num;
                $scope.OmsCoursePlanVoForEdit.coefficient = row.coefficient;
                $scope.OmsCoursePlanVoForEdit.course_num_2 = row.course_num_2;
                $scope.OmsCoursePlanVoForEdit.course_num_end = row.course_num_end;
                $scope.select.time = new Date($scope.OmsCoursePlanVoForEdit.start_time).Format("hh:mm");
                $scope.select.timeEnd = new Date($scope.OmsCoursePlanVoForEdit.end_time).Format("hh:mm");
                $scope.select.startDate = new Date($scope.OmsCoursePlanVoForEdit.start_time).Format("yyyy-MM-dd");
                $scope.select.startDate = new Date($scope.select.startDate);
                if (row.order_rule == 1 || !row.order_rule) {
                    $scope.select.timeSize = row.course_num / 0.5;
                }
                if (row.order_rule == 2) {
                    $scope.select.timeSize = ((row.course_num_2 - 1) / 0.5) + 1;
                }
                $scope.OmsCoursePlanVoForEdit.subject_name = row.subject_name;
                $scope.OmsCoursePlanVoForEdit.subject_id = row.subject_id;
                if (row.class_id != null) {
                    $scope.OmsCoursePlanVoForEdit.crmClassId = row.class_id;
                } else {
                    $scope.OmsCoursePlanVoForEdit.crmCustomerStudentId = row.crmStudentId || row.crm_student_id;
                }
                $scope.OmsCoursePlanVoForEdit.type = row.type;
                $scope.OmsCoursePlanVoForEdit.order_no = row.order_no;
                $scope.OmsCoursePlanVoForEdit.orderId = row.orderId;
                $scope.OmsCoursePlanVoForEdit.new_price = row.new_price;
                $scope.OmsCoursePlanVoForEdit.coursePlanIdList = row.coursePlanIdList;
                $scope.OmsCoursePlanVoForEdit.typeO2o = row.typeO2o;
                $scope.modalTitle = title;
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/coursePlan/modal.editcourseplan.html',
                    show: true
                });

            }

            function showEditCoursePlanForOne2One(row, type) {

                CoursePlanService.getCoursePlanInfo(row.id).then(function (result) {
                    if (result.status != "SUCCESS") {
                        $scope.callServerrecord($scope.myCoursePlanRecordTableState);
                        return;
                    }
                    var omsCoursePlan = angular.copy(result.data);
                    showEditCoursePlan(omsCoursePlan, type);
                });
            }

            /**
             * 显示列表页面
             */
            function showListView() {
                /* $scope.myCoursePlanRecordTableState.pagination.start = 0;*/

                if ($scope.OmsCoursePlanVoForEdit.type == 7) {
                    if ($scope.myCoursePlanRecordTableState) {
                        $scope.ClasscallServerrecord($scope.myCoursePlanRecordTableState);
                    }
                } else {
                    if ($scope.myCoursePlanRecordTableState) {
                        $scope.callServerrecord($scope.myCoursePlanRecordTableState);
                    }
                    if (location.hash == '#/sos-admin/school_times') {
                        $scope.getSchoolsTimes();
                    } else if ($scope.getTeacherTimes && typeof ($scope.getTeacherTimes) == 'function') {
                        $scope.getTeacherTimes();
                    } else {
                        try {
                            $scope.getSchoolsTimes();
                        } catch (e) {

                        }

                    }
                }
                // // TODO：20180511 修改
                if ($scope.$parent.getGroupCoursePlanList) {
                    $scope.$parent.getGroupCoursePlanList($scope.$parent.groupCoursePlantableState)
                }

            }

            function showListenListView() {
                /* $scope.myCoursePlanRecordTableState.pagination.start = 0;*/
                if ($scope.myCoursePlanRecordTableState) {
                    $scope.ListencallServerrecord($scope.myCoursePlanRecordTableState);
                }
                if ($scope.getTeacherTimes && typeof ($scope.getTeacherTimes) == 'function') {
                    $scope.getTeacherTimes();
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

            function camelCaseToDash(str) {
                // $1即为正则中第一个捕获，同上述的“\1”
                return str.replace(/([A-Z])/g, "_$1").toLowerCase();
            }


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
             * 显示试听、学员、一对多的
             * @param type排课页面 1：学员2：一对多3：试听
             * @param recording记录：1：记录上课
             */
            function showPaikeView(type, recording) {
                $scope._lsm_ = 0
                $scope.detail = {}
                $scope.hasresult = 0
                try {
                    $scope.gusseresult.length = 0
                } catch (e) {
                }
                var title = "";
                var url = "";
                //每次打开排课界面时，都清除rootScope中存放的教师信息
                $rootScope.coursePlanFilter = undefined;
                $scope.date = undefined;
                $scope.now = type
                if (recording == 0) {
                    $scope.recording = ''
                }
                if ($scope.modalAlready && $scope.modalAlready.$isShown) {
                    $scope.modalAlready.hide()
                }
                if (recording == 1 || $scope.recording == 1) {
                    title = "选择要记录上课的学生";
                    $scope.mtLayer = false
                    $scope.recording = recording || $scope.recording
                } else {
                    $scope.recording = ''
                    if (1 == type) {
                        //  07-21------------------s
                        //title="在读学员查询";
                        title = "选择要排课的学生";
                        //  07-21------------------n
                    } else if (2 == type) {
                        title = "在读学员一对多查询";
                    } else if (3 == type) {
                        title = "意向客户查询";
                    } else if (4 == type) {
                        title = "选择要排课的班级";
                        //$scope.addModal.hide()
                    }
                }
                $scope.type = type;
                $scope.modalTitle = title;
                if ($scope.addModal && $scope.addModal.$isShown && 4 != type) {
                    // $scope.addModal.hide()
                    $scope.autoGetLeadsStudentInfoByFilter()
                }
                /*//一堆多编辑排课专用
                 else if(arguments.length==3) {
                 $scope.addModal = $modal({
                 scope: $scope,
                 templateUrl: 'partials/sos/customer/modal.coursePlanInfo.html?V='+Date.now(),
                 show: true,
                 backdrop: 'static'
                 });

				 }*/
                else if (arguments.length > 1) {

                    $scope.addModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/sos/coursePlan/leadsStudent.plan.html?V=' + Date.now(),
                        show: true,
                        backdrop: 'static'
                    });

                } else if (type == 4 && $('[data-lsm="n"]').length) {
                    if ($scope.addModal) {
                        $scope.addModal.hide()
                    }
                    $scope._lsm_ = 1
                    $scope.addModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/sos/coursePlan/leadsStudent.plan.html?V=' + Date.now(),
                        show: true,
                        backdrop: 'static'
                    });
                }

            }

            // 拆分出来的试听排课功能
            $scope.New_showPaikeView = function (type) {
                debugger
                // $scope.recording = ''
                if (type == 3) {
                    $scope.coursePlanModalTitle = '试听排课'
                } else if (type == 1) {
                    $scope.coursePlanModalTitle = '学员排课'
                }
                // $scope.showCreat=0;
                $scope.hasresult = false;
                $scope.detail.name = "";
                $scope.detail.belong_user_name = "";
                $scope.type = type;
                var title = "";
                var url = "";
                //每次打开排课界面时，都清除rootScope中存放的教师信息
                $rootScope.coursePlanFilter = undefined;
                $scope.date = undefined;
                $scope.now = type
                if ($scope.modalAlready && $scope.modalAlready.$isShown) {
                    $scope.modalAlready.hide()
                }
                if (1 == type) {
                    //  07-21------------------s
                    //title="在读学员查询";
                    title = "选择要排课的学生";
                    $scope.detail.type = 1;
                    $scope.myCrmCustomerStudentFilter.state = 1;
                } else if (2 == type) {
                    title = "在读学员一对多查询";
                } else if (3 == type) {
                    title = "意向客户查询";
                    $scope.detail.type = 3;
                    $scope.now = 3;
                    $scope.myCrmCustomerStudentFilter.state = 2;
                } else if (4 == type) {
                    title = "选择要排课的班级";
                    $scope.addModal.hide()
                }

                $scope.type = type;
                $scope.modalTitle = title;
                if ($scope.addModal && $scope.addModal.$isShown && 4 != type) {
                    // $scope.addModal.hide()
                    // $scope.autoGetLeadsStudentInfoByFilter()
                } else {

                    $scope.addModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/sos/customer/modal.newcoursePlanInfo.html?V=' + Date.now(),
                        show: true,
                        backdrop: 'static'
                    });
                }
                CommonService.getSubjectIdSelect().then(function (result) {
                    $scope.omsSubject = result.data;
                });
                $scope.teachername = {
                    type: type
                }
                $scope.teachernow();

            }
            $scope.showTeacherList = function () {
                $scope.teacherModelTitle = "查询老师";
                $scope.teacherFilter = {};

                if ($scope.coursePlanFilter.subjectId) {
                    $scope.teacherFilter.subjectId = $scope.coursePlanFilter.subjectId;
                }
                $scope.select = {};
                $scope.teacherModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/customer/modal.teacherSelect.html',
                    show: true,
                    backdrop: "static"
                });
            }

            // 模糊搜索逻辑
            var timerGo = '';
            $scope.gusseyourresult = function () {
                timerGo = setTimeout(function () {
                    if ($scope.detail.name) {
                        var filter = {
                            name: $scope.detail.name,

                        }
                        if ($scope.type == 3) {
                            filter.state = 2;
                        } else if ($scope.type == 1) {
                            filter.state = 1;
                        }
                        OrderService.vagueSearch(filter).then(function (result) {
                            $scope.gusseresult = result.data;
                            $scope.xue = "学";
                            $scope.ke = "客";
                            if ($scope.gusseresult.length === 0) {
                                $scope.hasresult = false;
                                $scope.hasresult = 0;
                            } else {
                                $scope.hasresult = 1;
                            }
                        });
                    } else {

                        $scope.hasresult = false;
                    }
                }, 400)

            };

            // 点击其他地方模糊搜索的结果框消失
            $scope.hideThisul = function () {
                if ($scope.hasresult == false) {
                    $scope.detail.name = '';
                    $scope.hasresult = false;
                } else {

                }

            }
            // 选择课程逻辑
            $scope.showOrderCourseList = function (row) {
                $scope.courseOrderTitle = "选择课程";
                $scope.detail = angular.copy(row);
                $scope.recordModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/customer/modal.orderCourseSelect.html',
                    show: true,
                    backdrop: "static"
                });
            }
            // 创建新客户框
            $scope.createLeadsmessege = function () {
                var title = "添加意向客户信息";
                $scope.modalTitle1 = title;
                $scope.detail.name = "";
                $scope.detail.grade_id = "";
                $scope.detail.phone = "";
                $scope.detail.media_channel_id_1 = "";
                $scope.addModal1 = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/coursePlan/createPlancustom.html',
                    show: true,
                    backdrop: 'static'
                });
                //获取所有的年级
                CustomerStudentCourseService.getAllGrade().then(function (result) {
                    $scope.omsGrade = result;
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
                $scope.detail.type = $scope.detail.type || 3
                $scope.detail.belong_user_name = $scope.detail.belong_user_name || ''
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
                    console.log(data);
                    $scope.CrmLeadsStudentVoForCreate = {};
                    $scope.addModal1.hide();
                    $scope.detail.name = "";
                    $scope.showCreat = 0;
                    // console.log($scope.detail);
                    // 讲新的客户信息连动到添加订单页面
                    //  $scope.order.name=$scope.detail.name;
                    // var obj = {'crmStudentId':data.id,'name':$scope.detail.name,'accountBalance':0,'consumeAccountBalance':0,'gradeId':data.gradeId};
                    // $scope.order.crm_Student_Id=data.data.id;
                    // // aaaaaaaaaaa
                    // $scope.order.name=$scope.detail.name ;
                    // $scope.order.accountBalance=0 ;
                    // $scope.order.consumeAccountBalance=0;
                    // $scope.order.gradeId=data.data.gradeId;

                    $scope.order_rule_name = "4小时";
                }, function (error) {
                    SweetAlert.swal("创建Leads失败");
                });
            }
            $scope.mediaChannel2List = [];
            $scope.mediaChannel1ChangeForUpdate = function (arg) {
                debugger
                if ($scope.detail['media_channel_id_' + arg]) {
                    CommonService.getMediaChannel($scope.detail['media_channel_id_' + arg]).then(function (result) {
                        $scope['mediaChannel' + (arg + 1) + 'List'] = result.data;
                    });
                } else {
                    $scope['mediaChannel' + (arg + 1) + 'List'] = [];
                }
                $scope.detail['media_channel_id_' + (arg + 1)] = null;
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
                                // 	scope: $scope,
                                // 	templateUrl: 'partials/sos/leads/modal.repeate.html',
                                // 	show: true
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

            function showListonPaikeView(type, recording) {
                var title = "";
                var url = "";
                //每次打开排课界面时，都清除rootScope中存放的教师信息
                $rootScope.coursePlanFilter = undefined;
                $scope.date = undefined;
                $scope.now = type
                if (recording == 0) {
                    $scope.recording = ''
                }
                if ($scope.modalAlready && $scope.modalAlready.$isShown) {
                    $scope.modalAlready.hide()
                }
                if (recording == 1 || $scope.recording == 1) {
                    title = "选择要记录上课的学生";
                    $scope.mtLayer = false
                    $scope.recording = recording || $scope.recording
                } else {
                    $scope.recording = ''
                    if (1 == type) {
                        //  07-21------------------s
                        //title="在读学员查询";
                        title = "选择要排课的学生";
                        //  07-21------------------n
                    } else if (2 == type) {
                        title = "在读学员一对多查询";
                    } else if (3 == type) {
                        title = "意向客户查询";
                    }
                }
                $scope.type = type;
                $scope.modalTitle = title;
                if ($scope.addModal && $scope.addModal.$isShown) {
                    // $scope.addModal.hide()
                    $scope.autoGetLeadsStudentInfoByFilter()
                } else {

                    $scope.addModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/sos/invitationDetail/modal.leadslisten.html',
                        show: true,
                        backdrop: 'static'
                    });
                }
            }


            /**
             * 通过学生时间表排课，不需要再选学员,默认对该学生排课
             */
            $scope.showSelectedStudentPaikeView = function (studentId, date) {
                //每次打开排课界面时，都清除rootScope中存放的教师信息
                $rootScope.coursePlanFilter = undefined;
                $scope.date = undefined;
                //构建查询条件
                $scope.stuTableState = {};
                $scope.stuTableState.pagination = {};
                $scope.stuTableState.search = {};
                $scope.myCrmCustomerStudentFilter.studentId = studentId;
                //查询学生详细信息
                $scope.myCrmCustomerStudentFilter.state = 1;
                OrderService.listStudent(0, 10, $scope.stuTableState, $scope.myCrmCustomerStudentFilter).then(function (result) {

                    $scope.resultList = result.data;
                    $scope.stuTableState.pagination.numberOfPages = result.numberOfPages;
                    //因为是根据学生id查询的，所以只有一条结果
                    $scope.detail = $scope.resultList[0];
                    $scope.detail.group_no = $scope.detail.name; //弹窗班级名回显
                    //学员排课类型为1
                    $scope.detail.type = 1;
                    //通过学生时间表排课，进入排课页面后，默认精准时间排课，并且设置日期
                    $scope.date = date;
                    //获取科目信息
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
            }

            /**
             * 通过老师时间表排课，自动将老师置为所选老师，可以修改
             */
            $scope.showSelectedTeacherPaikeView = function (teacherId, teacherName, date) {
                //每次打开排课界面时，都清除rootScope中存放的教师信息
                $rootScope.coursePlanFilter = undefined;
                $scope.date = undefined;
                $scope.type = 1;
                $scope.now = $scope.type;
                $scope.modalTitle = "在读学员查询";
                $scope.selectedTeacherId = teacherId;
                $scope.selectedTeacherName = teacherName;
                $scope.date = date;
                $scope.addModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/coursePlan/leadsStudent.plan.html',
                    show: true,
                    backdrop: 'static'
                });
            }
            $scope.showSelectedTeacherPaikeView2 = function (teacherId, teacherName, date) {
                $rootScope.coursePlanFilter = undefined;
                $scope.date = undefined;
                $scope.type = 3;
                $scope.now = $scope.type;
                $scope.modalTitle = "意向客户查询";
                $scope.selectedTeacherId = teacherId;
                $scope.selectedTeacherName = teacherName;
                $scope.date = date;
                $scope.addModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/coursePlan/leadsStudent.plan.html',
                    show: true,
                    backdrop: 'static'
                });
            }

            /**
             * 获取leads学生一对多的信息
             */
            $scope.myCrmCustomerStudentFilter = {};

            function getLeadsStudentInfo(tableState) {
                $scope.isLoading = true;
                $scope.stuTableState = tableState;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;
                $scope.resultList = {};
                // 展示学员列表
                if ($scope.type == 1) {
                    $scope.myCrmCustomerStudentFilter = {};
                    $scope.myCrmCustomerStudentFilter.state = 1;
                    OrderService.listStudent(start, number, $scope.stuTableState, $scope.myCrmCustomerStudentFilter).then(function (result) {

                        $scope.resultList = result.data;
                        $scope.stuTableState.pagination.numberOfPages = result.numberOfPages;
                        $scope.isLoading = false;
                    });
                } else if ($scope.type == 2) {
                    $scope.myCrmCustomerStudentFilter = {};
                    // 展示一对多的列表
                    CustomerStudentGroupService.listGroupStudents(start, number, tableState, $scope.myCrmCustomerStudentFilter).then(function (result) {
                        $scope.resultList = result.data;
                        tableState.pagination.numberOfPages = result.numberOfPages;
                        $scope.isLoading = false;
                    });
                    CustomerStudentCourseService.getAllGrade().then(function (result) {
                        $scope.omsGrade = result;
                    });

                } else if ($scope.type == 3) {
                    $scope.myCrmCustomerStudentFilter = {};
                    // 展示试听leads的列表
                    //LeadsStudentService.list(start, number, $scope.stuTableState,$scope.myCrmCustomerStudentFilter).then(function (result) {
                    $scope.myCrmCustomerStudentFilter.state = 2;
                    OrderService.listStudent(start, number, $scope.stuTableState, $scope.myCrmCustomerStudentFilter).then(function (result) {
                        $scope.resultList = result.data;
                        $scope.stuTableState.pagination.numberOfPages = result.numberOfPages;
                        $scope.isLoading = false;
                    });
                } else if ($scope.type == 4) {
                    $scope.myCrmCustomerStudentFilter.status = 0;
                    var filter = {
                        size: 0,
                        start: 0,
                        schoolId: AuthenticationService.currentUser().school_id
                    }
                    if ($scope._lsm_ == 1) {
                        filter.size = number
                        filter.start = start
                    }
                    var promise = ClassManagementService.getClassesByFilter(filter);
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
                                $scope.resultList = $scope.MyCrmCustomerStudentClassList;
                                $scope.stuTableState.pagination.numberOfPages = response.data.pages;
                            }
                            $scope.isLoading = false;
                        },
                        function (error) {
                        });
                }
            }

            /**
             * 输入内容500ms内没有录入内容自动查询
             */
            $scope.keyUpFlag = null
            $scope.hasresult = false;
            $scope.autoGetLeadsStudentInfoByFilter = function () {
                $scope.hasresult = true;
                clearTimeout($scope.keyUpFlag)
                $scope.keyUpFlag = setTimeout(function () {
                    $scope.getLeadsStudentInfoByFilter()
                }, 500)
            }

            /**
             * 条件查询
             */
            function getLeadsStudentInfoByFilter() {
                $scope.isLoading = true;
                if (!$scope.stuTableState) {
                    $scope.stuTableState = {};
                    $scope.stuTableState.pagination = {};
                }
                $scope.stuTableState.pagination.start = 0;
                $scope.stuTableState.pagination.number = 10;
                var pagination = $scope.stuTableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;
                $scope.resultList = {};
                // 条件查询leads 学生 一对多的列表
                if ($scope.type == 1) {
                    //CustomerStudentService.list(start, number, $scope.stuTableState,$scope.myCrmCustomerStudentFilter).then(function (result) {
                    $scope.myCrmCustomerStudentFilter.state = 1;
                    OrderService.listStudent(start, number, $scope.stuTableState, $scope.myCrmCustomerStudentFilter).then(function (result) {
                        $scope.resultList = result.data;
                        $scope.stuTableState.pagination.numberOfPages = result.numberOfPages;
                        $scope.isLoading = false;
                    });
                } else if ($scope.type == 2) {
                    number = 1000;
                    $scope.stuTableState.search = {
                        predicateObject: {
                            pageNum: 0,
                            pageSize: 0
                        }
                    };
                    CustomerStudentGroupService.listGroupStudents(start, number, $scope.stuTableState, $scope.myCrmCustomerStudentFilter).then(function (result) {
                        $scope.resultList = result.data;
                        $scope.stuTableState.pagination.numberOfPages = result.numberOfPages;
                        $scope.isLoading = false;
                    });
                    //获取所有的年级
                    CustomerStudentCourseService.getAllGrade().then(function (result) {
                        $scope.omsGrade = result;
                    });
                } else if ($scope.type == 3) {
                    //LeadsStudentService.list(start, number, $scope.stuTableState,$scope.myCrmCustomerStudentFilter).then(function (result) {
                    $scope.myCrmCustomerStudentFilter.state = 2;
                    console.log($scope.myCrmCustomerStudentFilter);
                    OrderService.listStudent(start, number, $scope.stuTableState, $scope.myCrmCustomerStudentFilter).then(function (result) {
                        $scope.resultList = result.data;
                        $scope.stuTableState.pagination.numberOfPages = result.numberOfPages;
                        $scope.isLoading = false;
                    });
                }
            }


            /**
             * 关闭排课的弹框
             */
            function canclePlanModal() {
                $scope.recordCoursePlanModal.hide();
            }

            /**
             * 转向排课的页面
             */
            $scope.banzuStudent = '';
            // TODO:此函数搬到app/js/controllers/sos/course-plan-operate-controller.js:2951 function forwardPlanPage()

            $scope.forwardPlanPage = function () {
                debugger;
                $scope.hasresult = false;
                // 得到学生的id
                var index = ''
                if (arguments.length == 2) {
                    index = arguments[1]
                    for (var i = 0, max = $scope[arguments[0]].length; i < max; i++) {
                        $scope[arguments[0]][i].selectTrue = i == index ? true : false
                    }
                } else {
                    index = $("input[name='studentRadio']:checked").val();
                }
                if (index == undefined) {
                    if ($scope.type == 2) {
                        SweetAlert.swal('请选择要排课的一对多');
                        return;
                    } else {
                        SweetAlert.swal('请选择要排课的学生');
                        return;
                    }
                }
                console.log($scope.resultList[index])


                // $scope.detail = angular.copy($scope.resultList[index]);
                // $scope.order_rule=$scope.detail.order_rule;

                $scope.detail = $scope.resultList[index];
                console.log($scope.detail);
                $scope.order_rule = $scope.detail.order_rule;

                // 封装order
                $scope.hasresult = false;
                $scope.showCreat = 1;

                // 将type封装到对象中
                $scope.detail.type = $scope.type;

                if ($scope.selectedTeacherId) {
                    $rootScope.coursePlanFilter = {};
                    $rootScope.coursePlanFilter.teacherName = $scope.selectedTeacherName;
                    $rootScope.coursePlanFilter.teacherID = $scope.selectedTeacherId;
                }


                if ($scope.type == 3) {
                    // 获取leads的可排课时信息
                    $scope.order_rule = 1;
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
                    //             templateUrl: 'partials/sos/customer/modal.newcoursePlanInfo.html',
                    //             show: true,
                    //             backdrop: "static"
                    //         });
                    //     });
                    // })


                    CustomerStudentCourseService.getLeadsCoursePlan($scope.detail.phone).then(function (result) {

                        if (result.plan_available_num) {
                            $scope.plan_available_num = result.plan_available_num;
                            // 获取科目信息
                            CommonService.getSubjectIdSelect().then(function (result) {
                                $scope.omsSubject = result.data;
                                $scope.recordCoursePlanModal = $modal({
                                    scope: $scope,
                                    templateUrl: 'partials/sos/customer/modal.newcoursePlanInfo.html',
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
                            $scope.alreadyPkListModal = $modal({
                                scope: $scope,
                                templateUrl: 'partials/sos/customer/modal.alreadyPkList.html',
                                show: true,
                                backdrop: "static"
                            });
                        }
                    })
                } else if ($scope.type == 2) {
                    // 一对多排课，要加载一对多的订单课程的信息
                    var start = 0, number = 10;
                    CustomerStudentCourseService.getCRMCustomerGroupInfoByGroupID(start, number, $scope.detail.id).then(function (result) {
                        $scope.CGoupStudentCourseList = result.data.groupStudentList;
                        $scope.CustomerStudentCourseList = result.data.groupOrderCourseList;
                        $scope.schoolName = result.data.schoolName;
                        /*$scope.plan_available_num = $scope.CustomerStudentCourseList[0].plan_available_num;
                         $scope.courseName = $scope.CustomerStudentCourseList[0].course_type_name;*/
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
                } else if ($scope.type == 4) {
                    // 班级排课

                    $scope.coursePlanModalTitle = "班级排课";
                    //使用适配器模式将ngClick类似的命名规则转为ng_click

                    $scope.detail = angular.copy(getObject($scope.resultList[index]));
                    console.log($scope.detail)
                    // 将type封装到对象中
                    $scope.detail.type = 7;

                    // 获取科目信息
                    CommonService.getSubjectIdSelect().then(function (result) {
                        $scope.omsSubject = result.data;


                        // setTimeout(function () {
                        //     console.log($("#subjectId option"));
                        //
                        //     $("#subjectId option").each(function () {
                        //         if( $(this).attr("value") == "number:"+$scope.resultList[index].subjectId ){
                        //             $(this).attr("selected",true);
                        //             $scope.selectSubject();
                        //         }else{
                        //             $(this).attr("selected",false);
                        // 	}
                        //     })
                        //
                        // },500)
                        // if($scope.recordCoursePlanModal){
                        //     $scope.recordCoursePlanModal.hide();
                        // }
                        // $scope.recordCoursePlanModal = $modal({
                        //     scope: $scope,
                        //     templateUrl: 'partials/sos/customer/modal.coursePlanInfo.html',
                        //     show: true,
                        //     backdrop: "static"
                        // });

                    });
                } else {
                    if ($scope.recording) {
                        $scope.coursePlanModalTitle = '记录上课'
                    }
                    $scope.plan_available_num = ''
                    // 获取科目信息
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
             * 创建意向客户
             */
            function createLeads() {
                var title = "添加意向客户信息";
                $scope.detail = {};
                $scope.modalTitle1 = title;
                $scope.addModal1 = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/coursePlan/leads.create.plan.html',
                    show: true,
                    backdrop: 'static'
                });
            }


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
                if ($scope.detail != undefined) {
                    $scope.detail.phone = null;
                }
            }


            // 变更一级媒体渠道时change事件
            $scope.detail = {};
            $scope.mediaChannel1List = [];
            $scope.mediaChannel2List = [];

            function mediaChannel1ChangeForUpdate() {
                if ($scope.detail.media_channel_id_1) {
                    CommonService.getMediaChannel($scope.detail.media_channel_id_1).then(function (result) {
                        $scope.mediaChannel2List = result.data;
                    });
                } else {
                    $scope.mediaChannel2List = [];
                }
                $scope.detail.media_channel_id_2 = null;
            }

            /**
             * 获取leads的年级渠道的基本信息，用于页面的展示
             */
            function getLeadsBasicInfo(tableState) {
                //获取所有的年级
                CustomerStudentCourseService.getAllGrade().then(function (result) {
                    $scope.omsGrade = result;
                });
                //获取一级渠道信息
                CommonService.getMediaChannel(0).then(function (result) {
                    $scope.mediaChannel1List = result.data;
                });
            }

            /**
             * 转向创建leads并进行排课的页面
             */
            function forwardCreateLeadAndPlanPage() {
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
                    $scope.mediaChannel2List = [];
                    $scope.CrmLeadsStudentVoForCreate = {};

                    //跳到详情页
                    if (data.data.id) {
                        var crm_student_id = data.data.id;
                        $scope.detail = data.data;

                        $scope.detail.crm_student_id = crm_student_id;
                        LeadsStudentService.detail($scope.detail).then(function (result) {
                            $scope.detail = result;
                            $scope.detail.type = 3;
                            $scope.detail.group_no = $("#leadsName").val();
                            $scope.hasresult = false;
                            $scope.onlyread = true;
                            // CustomerStudentCourseService.getLeadsCoursePlan($scope.detail.phone).then(function (result) {
                            //     $scope.CLeadsCourseTimeList = result.leadsCourseTime.list;
                            //     if ($scope.CLeadsCourseTimeList[0] != undefined) {
                            //         $scope.plan_available_num = $scope.CLeadsCourseTimeList[0].plan_available_num;
                            //     } else {
                            //         $scope.plan_available_num = 4;
                            //     }
                            //     // 获取科目信息
                            //     CommonService.getSubjectIdSelect().then(function (result) {
                            //         $scope.addModal1.hide();
                            //         $scope.omsSubject = result.data;
                            //         $scope.recordCoursePlanModal = $modal({
                            //             scope: $scope,
                            //             templateUrl: 'partials/sos/customer/modal.coursePlanInfo.html',
                            //             show: true,
                            //             backdrop: "static"
                            //         });
                            //     });
                            // })

                            CustomerStudentCourseService.getLeadsCoursePlan($scope.detail.phone).then(function (result) {

                                if (result.plan_available_num) {
                                    $scope.plan_available_num = result.plan_available_num;
                                    // 获取科目信息
                                    CommonService.getSubjectIdSelect().then(function (result) {
                                        $scope.addModal1.hide();
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
                                    $scope.alreadyPkListModal = $modal({
                                        scope: $scope,
                                        templateUrl: 'partials/sos/customer/modal.alreadyPkList.html',
                                        show: true,
                                        backdrop: "static"
                                    });
                                }

                            })
                        })

                    } else {
                        SweetAlert.swal("创建Leads失败");
                    }

                }, function (error) {
                    SweetAlert.swal("创建Leads失败");
                });
            }

            /**
             * 重置
             */
            function resetFilter() {
                $scope.myCrmCustomerStudentFilter = {};
            }

            (function init() {
                //$scope.leadsRepeatAlert = false;
                $scope.quickOmsCoursePlanId = undefined;
                if (check_null($routeParams.type) && !$scope.addModal) {
                    $scope.showPaikeView($routeParams.type);//打开 弹窗试听排课 medal
                }
                //
                if (check_null($routeParams.omsCoursePlanId)) {
                    $scope.quickOmsCoursePlanId = $routeParams.omsCoursePlanId;//打开 弹窗试听排课 medal
                }
                /**
                 * 快捷方式进来
                 */
                if ($routeParams.dateTime && (Date.now() - $routeParams.dateTime < 1000 * 60 * 5)) {
                    if ($routeParams.v3 == 1) {
                        if (!$scope.modalForImport && $rootScope.showPermissions('LeadsImportModalDownload')) {
                            $scope.showImportModal()
                        }
                    } else if ($routeParams.v3 == 2) {
                        if (!$scope.isTeacherOrTeacherMaster) {
                            $scope.recordClass(1)
                        }
                    }
                }
            })();

            /**
             * 判断当前登录用户是否为教师
             */
            $scope.isTeacher = function () {
                var isTeacher = false;
                if (AuthenticationService.currentUser().position_id == Constants.PositionID.TEACHER
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.YSB_TEACHER
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.YSP_TEACHER
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.YSGJ_TEACHER
                ) {
                    isTeacher = true;
                }
                return isTeacher;
            }
            /**
             * 判断当前登录用户是否为教务主管
             */
            $scope.isTeacherMaster = function () {
                var isTeacherMaster = false;
                if (AuthenticationService.currentUser().position_id == Constants.PositionID.TEACHER_MASTER) {
                    isTeacherMaster = true;
                }
                return isTeacherMaster;
            }
            $scope.isShowPaikeViewAll = isShowPaikeViewAll

            /**
             * 判断当前登录用户是否是校长或运营岗位
             * @returns {boolean}
             */
            function isShowPaikeViewAll() {
                var isOpen = false
                if (AuthenticationService.currentUser().position_id == Constants.PositionID.STUDENT_CHIEF
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.STUDENT_CHIEF_OFFICER
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.TEACHER_MASTER
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.HEADMASTER
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.YSP_HEADMASTER
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.YSB_HEADMASTER
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.YSGJ_HEADMASTER
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.YSP_CHENGZHANGGUWEN
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.YSB_GUIHUASHI
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.YSGJ_ZHUJIAO
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.YSP_CHENGZHANGGUWEN_MASTER
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.YSGJ_ZHUJIAO_MASTER
                ) {
                    isOpen = true
                }
                return isOpen;
            }

            /**
             * 判断当前登录用户是否为营销岗位
             * @returns {boolean}
             */
            $scope.isShowPaikeViewTrial = function () {
                var isOpen = false
                if (AuthenticationService.currentUser().position_id == Constants.PositionID.COURSE_CHIEF_OFFICER
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.COURSE_OFFICER
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.CALLCENTER
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.CALLCENTER_MASTER
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.YX_SHEN
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.YSGJ_STUDENT_CHIEF_OFFICER
                    || AuthenticationService.currentUser().position_id == Constants.PositionID.YSGJ_COURSE_OFFICER
                ) {
                    isOpen = true
                }
                return isOpen;
            }


            /************************************************
             *                                               点名上课
             ***********************************************/
            /**
             * 弹框
             */
            function showCallNameCourseModal(row) {
                $scope.classCoursePlan = row;
                $scope.modalhCallNameCourseTitle = '点名上课';
                $scope.modalhCallNameCourseModel = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/coursePlan/model.callnamecourse.html?' + new Date().getTime(),
                    show: true,
                    backdrop: "static"
                });

            };

            /**
             * 撤销上课
             */
            $scope.cancelCallName = function cancelCallName(row) {
                var promise = ClassStudentAttendenceService.cancelCallStudentNames(row);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal("撤销上课失败，请重试", "error");
                        return false;
                    } else {
                        SweetAlert.swal("撤销上课成功", "success");
                        if ($scope.myCoursePlanRecordTableState) {
                            $scope.ClasscallServerrecord($scope.myCoursePlanRecordTableState);
                        }
                        if (location.hash == '#/sos-admin/school_times') {
                            $scope.getSchoolsTimes()
                        } else if ($scope.getTeacherTimes && typeof ($scope.getTeacherTimes) == 'function') {
                            $scope.getTeacherTimes();
                        } else {
                            angular.element("#refe").click();
                        }
                    }
                });
            }

            /**
             * 缺席原因
             */
            $scope.absenceReasons = [
                {id: '0', name: '出游'},
                {id: '1', name: '恶劣天气'},
                {id: '2', name: '个人原因'},
                {id: '3', name: '老师请假'},
                {id: '4', name: '临时调课'},
                {id: '5', name: '生病'}
            ]

            /**
             * @method 计算选中的个数
             * @param
             * @return
             */
            $scope.checkboxNum = checkboxNum;
            $scope.ChuQinglen = 0;
            $scope.JIFeelen = 0;

            function checkboxNum() {
                setTimeout(function () {
                    var ChuQinglen1 = $("input[name='hkChuQing']:checked").length;
                    var JIFeelen1 = $("input[name='hkJiFee']:checked").length;
                    $scope.$apply(function () {
                        $scope.ChuQinglen = ChuQinglen1;
                        $scope.JIFeelen = JIFeelen1;
                    });

                }, 200)

            };

            //全选出勤和计费
            $scope.checkHuQingAll = checkHuQingAll;
            $scope.allm = false;

            function checkHuQingAll(allm) {
                $scope.allm = !$scope.allm;
                if (allm) {
                    $("input[name='hkChuQing']").prop('checked', 'checked');
                    $("input[name='hkChuQing']").prev().addClass('active');
                } else {
                    $("input[name='hkChuQing']").prop('checked', '');
                    $("input[name='hkChuQing']").prev().removeClass('active');
                }
            };

            $scope.changeSelct = function changeSelct(key) {
                // if (!key) {
                //     key = 'removeAbnormal';
                // }

                if (key) {
                    $scope.mtSeach[key] = !$scope.mtSeach[key];
                }

                $scope.callServerrecordFilterChange();
            }

            /*$scope.$watch('mtSeach',function () {

             },true)*/

            function oneTomorepaike() {
                $scope.coursePlanModalTitle = '一对多排课'
                $scope.onlyread = false;
                $scope.hasresult = '';
                $scope.myCrmCustomerStudentFilter = {};
                $scope.banzuStudent = "";
                $scope.banzuBelongs = "";
                $scope.detail = ""
                showPaikeView(2);
                $scope.plusModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/customer/modal.coursePlanInfo.html',
                    show: true,
                    backdrop: 'static'
                });
            }

            function classespaike() {
                $scope.hasresult = '';
                showPaikeView(4);
                $scope.banjiName = '';
                $scope.banzhurenName = '';
                $scope.detail = {}
                $scope.detail.type = 7;
                $scope.detail.class_time_json = '{}';
                $scope.recordCoursePlanModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/customer/modal.coursePlanInfo.html',
                    show: true,
                    backdrop: "static"
                });
            }

            //上课时间查看列表
            $scope.courseSee = function (row) {
                $scope.coursemultiplemakearry = []
                if (row.teacher_name != '') {
                    for (var i = 0; i < (row.teacher_name).split(' ').length; i++) {
                        var detail = {};
                        detail.subject = (row.subject_name).split(' ')[i]
                        detail.subjectid = (row.subject_id).split(' ')[i]
                        detail.teacher = (row.teacher_name).split(' ')[i]
                        detail.startTime = new Date((row.startTime).split(',')[i])
                        detail.endTime = new Date((row.endTime).split(',')[i])
                        detail.teacher_charging = (row.teacher_charging).split(' ')[i]
                        $scope.coursemultiplemakearry.push(detail)
                    }

                    console.log($scope.coursemultiplemakearry)

                    $scope.modalhCallNameCourseTitle = '查看';
                    $scope.modalhCallNameCourseModel = $modal({
                        scope: $scope,
                        templateUrl: 'partials/sos/coursePlan/model.coursesee.html?' + new Date().getTime(),
                        show: true,
                        backdrop: "static"
                    });
                } else {
                    SweetAlert.swal('暂无数据');
                }
            };

            //教师手机号查看
            $scope.teacherSee = function (row) {
                $scope.coursemultiplemakearry = []
                if (row.teacher_name != '') {
                    for (var i = 0; i < (row.teacher_name).split(' ').length; i++) {
                        var detail = {};
                        detail.subject = (row.subject_name).split(' ')[i]
                        detail.subjectid = (row.subject_id).split(' ')[i]
                        detail.teacher = (row.teacher_name).split(' ')[i]
                        detail.startTime = (row.startTime).split(',')[i]
                        detail.endTime = (row.endTime).split(',')[i]
                        detail.mobile = (row.mobile).split(' ')[i]
                        $scope.coursemultiplemakearry.push(detail)
                    }

                    console.log($scope.coursemultiplemakearry)
                    $scope.modalhCallNameCourseTitle = '查看';
                    $scope.modalhCallNameCourseModel = $modal({
                        scope: $scope,
                        templateUrl: 'partials/sos/coursePlan/model.teachersee.html?' + new Date().getTime(),
                        show: true,
                        backdrop: "static"
                    });
                } else {

                    SweetAlert.swal('暂无数据');

                }
            };
            //多科编辑函数
            $scope.multipleshowEditCoursePlan = function (row, type) {

                console.log(row)
                $scope.coursemultiplemakearry = []
                if (row.teacher_name != '') {
                    for (var i = 0; i < (row.teacher_name).split(' ').length; i++) {
                        var detail = {};
                        detail.subjectName = (row.subject_name).split(' ')[i]
                        detail.subjectId = (row.subject_id).split(' ')[i]
                        detail.teacherName = (row.teacher_name).split(' ')[i]
                        detail.teacherId = (row.user_id).split(' ')[i]
                        detail.startTime = new Date((row.startTime).split(',')[i]).Format("hh:mm");
                        detail.startTime2 = new Date((row.startTime).split(',')[i])
                        detail.endTime = new Date((row.endTime).split(',')[i]).Format("hh:mm");
                        detail.mobile = (row.mobile).split(' ')[i]
                        detail.schoolId = row.school_id
                        detail.id = row.id
                        detail.classId = row.class_id
                        $scope.timecousewill = new Date((row.startTime).split(',')[0]).Format("yyyy-MM-dd");
                        var linktime = (new Date((row.endTime).split(',')[i]).getTime() - new Date((row.startTime).split(',')[i]).getTime()) / 3600 / 1000
                        if (linktime == 0.5) {
                            detail.timelong = '1';
                        } else if (linktime == 1) {
                            detail.timelong = '2';
                        } else if (linktime == 1.5) {
                            detail.timelong = '3';
                        } else if (linktime == 2) {
                            detail.timelong = '4';
                        } else if (linktime == 2.5) {
                            detail.timelong = '5';
                        } else if (linktime == 3) {
                            detail.timelong = '6';
                        } else {
                            detail.timelong = '7';
                        }


                        $scope.coursemultiplemakearry.push(detail)
                    }

                    $scope.timelinkedit = $scope.coursemultiplemakearry[0].startTime2.Format("yyyy-MM-dd");

                    console.log($scope.timelinkedit)
                }
                //获取全部教师的列表
                CommonService.getSubjectIdSelect().then(function (result) {

                    $scope.multipleSubjectdisplayed = {}
                    $scope.multipleSubjectdisplayed = result.data;
                    console.log($scope.multipleSubjectdisplayed)
                });
                $scope.modalTitle = '班级排课编辑';
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/coursePlan/modal.multipleeditcourseplan.html',
                    show: true
                });
            }

            //
            // $scope.showAddMultipleCoursePlan = function () {
            //     //添加上课计划的入口
            //
            //     $scope.coursePlanEntrance = "editCoursePlan";
            //     $scope.addMultipleCourseTitle = "添加上课时间";
            //     $scope.addMultipleCoursePlanTimeModal = $modal({
            //         scope: $scope,
            //         templateUrl: 'partials/sos/class/modal.addClassMultipleSubjectCoursePlanTime.html',
            //         show: true,
            //         backdrop: "static"
            //     });
            // }

            //input 获取教师的select
            $scope.clickgetteacherselect = function (row, type) {
                var tableState = {
                    pagination: {},
                    search: {},
                    sort: {}
                }
                tableState.search.schoolId = row.schoolId;
                tableState.search.subjectId = row.subjectId;
                tableState.pagination.number = 0;
                tableState.pagination.start = 0;
                CustomerStudentCourseService.getCSShooleTeacherByFiltersNew(0, 0, tableState, {}).then(function (result) {
                    // $scope.classMultipleSubjectCourseTeacherFilter = null;
                    // $scope.LessonTimeList[listIndex].teacher = result.data.studentTeachers.list;
                    // // if($scope.LessonTimeList[listIndex].multipleCourseSelectTime){
                    // $scope.LessonTimeList[listIndex].multipleCourseSelectTime.teacherIndex = null;
                    // // }
                    row.linkteacherist = result.data.studentTeachers.list;

                    console.log(row.linkteacherist)
                    $scope.isLoading = false;
                });
            }


            $scope.TIME_SIZE1 = [
                {id: 1, name: '0.5小时'}, {id: 7, name: '40分钟'}, {id: 2, name: '1小时'}, {id: 3, name: '1.5小时'}, {
                    id: 4,
                    name: '2小时'
                }, {
                    id: 5,
                    name: '2.5小时'
                }, {id: 6, name: '3小时'},
            ];


            $scope.getMultipleCourseEndTime = function (row, listIndex, type) {
                var time = new Date($scope.timelinkedit + ' ' + row.startTime);
                // var timestampStart = _getTimestampByWeekAndTimeNew(dayOfWeek + 1, changeWhichOne.time);
                // changeWhichOne.timestampBaseStart = timestampStart;
                var timestampStart = time.getTime();
                if (row.timelong == 7) {
                    var timestampEnd = timestampStart + ((4 / 3) * 60 * 30 * 1000);
                } else {
                    var timestampEnd = timestampStart + ((row.timelong) * 60 * 30 * 1000);
                }
                $scope.coursemultiplemakearry[listIndex].endTime = new Date(timestampEnd).Format("hh:mm");
            }

            //多科目编辑的删除功能

            $scope.multipledeletePlans = function (list, type) {//0 表示删除一个  1全部删除
                SweetAlert.swal({
                        title: "确定要删除吗？",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true
                    }, function (confirm) {
                        if (confirm) {

                            $scope.coursemultiplemakearry.splice(type, 1);

                        }
                    }
                );
            }
            //班类多科的班级保存按钮

            $scope.multipleEditCoursePlanNow = function () {

                for (var i = 0; i < $scope.coursemultiplemakearry.length; i++) {
                    $scope.coursemultiplemakearry[i].startTime = new Date($scope.timelinkedit + " " + $scope.coursemultiplemakearry[i].startTime)
                    $scope.coursemultiplemakearry[i].endTime = new Date($scope.timelinkedit + " " + $scope.coursemultiplemakearry[i].endTime)
                    $scope.coursemultiplemakearry[i].start = $scope.coursemultiplemakearry[i].startTime.getTime()
                    $scope.coursemultiplemakearry[i].end = $scope.coursemultiplemakearry[i].endTime.getTime()
                }
                $scope.courplanedit = {
                    id: $scope.coursemultiplemakearry[0].id,
                    type: 12,
                    classId: $scope.coursemultiplemakearry[0].classId,
                    courseTimes: $scope.coursemultiplemakearry
                }

                console.log($scope.courplanedit)

                for (var i = 0; i < $scope.courplanedit.courseTimes.length; i++) {
                    if (_ifNotOneDay($scope.courplanedit.courseTimes[i].startTime, $scope.courplanedit.courseTimes[i].endTime)) {
                        SweetAlert.swal('排课时间不能跨天');
                        return false;
                    }


                }


                var promise = CoursePlanService.EditCoursePlanNow($scope.courplanedit);

                promise.then(function (result) {
                    var response = result;
                    $scope.ClasscallServerrecord($scope.myCoursePlanRecordTableState);
                    if (response.status == 'SUCCESS') {
                        $scope.startTime = null;
                        $scope.endTime = null;
                        SweetAlert.swal(result.data);
                        $scope.dataLoading = false;
                        $scope.modal.hide();
                        if ($scope.EditType == 2) {//刷新我的意向客户详情排课列表
                            $scope.callServer1($scope.myCoursePlanTableState);
                        } else if ($scope.EditType == 1) {//刷新一对一排课列表
                            $scope.showListView();
                        } else if ($scope.EditType == 3) {//刷新学员详情排课列表
                            if ($scope.myCoursePlanTableState) {
                                $scope.callServer1($scope.myCoursePlanTableState);
                            }
                            if ($scope.coursePlanRecordTableState) {
                                $scope.callCoursePlanServer($scope.coursePlanRecordTableState);
                            }
                        } else if ($scope.EditType == 4) {
                            if ($scope.myCoursePlanRecordTableState) {
                                $scope.ListencallServerrecord($scope.myCoursePlanRecordTableState);
                            }
                        }
                        else if ($scope.EditType == 5) {
                            $scope.ClasscallServerrecord($scope.myCoursePlanRecordTableState);
                        }
                        else if ($scope.EditType == 6) {
                            $scope.GroupcallServerrecord($scope.GroupCoursePlanRecordTableState);
                        }
                        else {


                        }
                        try {
                            $rootScope.getRemindsData(4, 2, 1);//刷新提醒列表
                            $scope.getTeacherTimes();
                            $scope.getSchoolsTimes();
                        } catch (e) {

                        }
                    } else if (response.status == 'FAILURE') {
                        var data = response.data;

                        $scope.warningStudentList = data;
                        $scope.startTime = null;
                        $scope.endTime = null;
                        // 如果是字符串，直接alert
                        var confilct = 'partials/sos/customer/modal.conflict.coursePlan.html';
                        if ($scope.OmsCoursePlanVoForEdit.type == 7) {
                            confilct = 'partials/sos/coursePlan/modal.conflict.class.html';
                        }
                        if (typeof $scope.warningStudentList == "string") {
                            SweetAlert.swal(data);
                            return;
                        } else {
                            if ($scope.warningStudentList.length > 0) {
                                if ($scope.OmsCoursePlanVoForEdit.order_rule == 2) {
                                    $scope.OmsCoursePlanVoForEdit.plan_available_num = $scope.OmsCoursePlanVoForEdit.plan_available_num + ($scope.select.timeSize + 1) * 0.5
                                } else {
                                    $scope.OmsCoursePlanVoForEdit.plan_available_num = $scope.OmsCoursePlanVoForEdit.plan_available_num + $scope.select.timeSize * 0.5
                                }

                                $scope.confilctModalTitle = "排课时间冲突列表";
                                $scope.recordModal = $modal({
                                    scope: $scope,
                                    templateUrl: confilct,
                                    show: true,
                                    backdrop: "static"
                                });
                            }
                        }
                    }
                }, function (error) {
                    SweetAlert.swal("编辑排课失败");
                    $scope.dataLoading = false;
                });

            }

            //多科点名上课的按钮
            $scope.multipleShowCallNameCourseModal = function (row) {

                $scope.classCoursePlan = row;
                $scope.coursemultiplemakearry = [];
                if (row.teacher_name != '') {
                    for (var i = 0; i < (row.teacher_name).split(' ').length; i++) {
                        var detail = {};
                        detail.subject = (row.subject_name).split(' ')[i]
                        detail.subjectid = (row.subject_id).split(' ')[i]
                        detail.teacher = (row.teacher_name).split(' ')[i]
                        detail.startTime = new Date((row.startTime).split(',')[i])
                        detail.endTime = new Date((row.endTime).split(',')[i])
                        detail.jifeiflag = (row.teacher_charging).split(' ')[i] == '0' ? false : true;
                        $scope.coursemultiplemakearry.push(detail)
                    }
                }
                $scope.jifeiallcount = 0;
                for (var i = 0; i < $scope.coursemultiplemakearry.length; i++) {
                    if ($scope.coursemultiplemakearry[i].jifeiflag) {
                        $scope.jifeiallcount += 1;
                    }
                }
                $scope.modalhCallNameCourseTitle = '点名上课';
                $scope.modalhCallNameCourseModel = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/coursePlan/model.numtiplecallnamecourse.html?' + new Date().getTime(),
                    show: true,
                    backdrop: "static"
                });

            };

            $scope.noxiao = function noxiao(row) {
                if (row.jifeiflag) {
                    row.jifeiflag = true;
                    $scope.jifeiallcount += 1;
                } else {
                    row.jifeiflag = false;
                    $scope.jifeiallcount -= 1;
                }
            }
            $scope.allcheck = function allcheck(type) {

                console.log(type)
                if (type) {
                    for (var i = 0; i < $scope.coursemultiplemakearry.length; i++) {
                        $scope.coursemultiplemakearry[i].jifeiflag = true;
                    }
                    $scope.jifeiallcount = $scope.coursemultiplemakearry.length;
                } else {
                    for (var i = 0; i < $scope.coursemultiplemakearry.length; i++) {
                        $scope.coursemultiplemakearry[i].jifeiflag = false;
                    }
                    $scope.jifeiallcount = 0
                }
            }
            //点名上课的功能在 calss-manahger -ctr
            //一对多的 试听排课模块

            $scope.New_showPaikeViewmore = function (type) {
                // $scope.recording = ''
                $scope.deleteAllMt()
                $scope.coursePlanModalTitle = '一对多试听排课'
                // $scope.showCreat=0;
                $scope.hasresult = false;
                $scope.detail.name = "";
                $scope.detail.belong_user_name = "";
                $scope.type = type;
                var title = "";
                var url = "";
                //每次打开排课界面时，都清除rootScope中存放的教师信息
                $rootScope.coursePlanFilter = undefined;
                $scope.date = undefined;
                $scope.now = type
                if ($scope.modalAlready && $scope.modalAlready.$isShown) {
                    $scope.modalAlready.hide()
                }
                if (1 == type) {
                    //  07-21------------------s
                    //title="在读学员查询";
                    title = "选择要排课的学生";
                    $scope.detail.type = 1;
                    $scope.myCrmCustomerStudentFilter.state = 1;
                } else if (2 == type) {
                    title = "在读学员一对多查询";
                } else if (3 == type) {
                    title = "意向客户查询";
                    $scope.detail.type = 3;
                    $scope.now = 3;
                    $scope.myCrmCustomerStudentFilter.state = 2;
                } else if (4 == type) {
                    title = "选择要排课的班级";
                    $scope.addModal.hide()
                }

                $scope.type = type;
                $scope.modalTitle = title;
                if ($scope.addModal && $scope.addModal.$isShown && 4 != type) {
                    // $scope.addModal.hide()
                    // $scope.autoGetLeadsStudentInfoByFilter()
                } else {

                    $scope.addModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/sos/customer/modal.newcoursePlanInfomore.html?V=' + Date.now(),
                        show: true,
                        backdrop: 'static'
                    });
                }
                //初始化课程
                CommonService.getSubjectIdSelect().then(function (result) {
                    $scope.omsSubject = result.data;
                });
                //初始化年级
                CommonService.getGradeIdSelect().then(function (result) {
                    $scope.gradeIds = result.data;
                });
                $scope.teachername = {
                    type: type
                }
                $scope.teachernow();

            }
            $scope.MyCrmCustomerStudentListOk = [];
            $scope.addmorefreepk = function () {
                $scope.addModalfree = $modal({
                    scope: $scope,
                    width: '1000px',
                    templateUrl: 'partials/sos/customer/modal.morepk.html?V=' + Date.now(),
                    show: true,
                    backdrop: 'static'
                });
            }
            //初始化学员性质
            $scope.groupTypeList = [
                {id: 1, name: '学员'},
                {id: 2, name: '意向客户'}
            ];
            //获取学员列表
            //学员的重置功能
            $scope.searchReset = searchReset

            function searchReset() {
                for (var key in $scope.myCrmCustomerStudentListForAddGroupFilter) {
                    if ($scope.myCrmCustomerStudentListForAddGroupFilter.hasOwnProperty(key)) {
                        switch (key) {
                            default:
                                delete $scope.myCrmCustomerStudentListForAddGroupFilter[key]
                                break;
                        }
                    }
                }
                ;
                $scope.getMyCrmCustomerStudentListForAddGroup($scope.studentListForAddGroupTableState)
            }

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
                CustomerStudentGroupService.yiduiduoshitingSearch(start, number, tableState, $scope.myCrmCustomerStudentListForAddGroupFilter).then(function (result) {

                    $scope.MyCrmCustomerStudentListForAddGroup = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isMyCrmCustomerStudentListForAddGroupLoading = false;
                    if ($scope.MyCrmCustomerStudentListForAddGroup.length) {
                        for (var i = 0; i < $scope.MyCrmCustomerStudentListForAddGroup.length; i++) {
                            for (var j = 0; j < $scope.MyCrmCustomerStudentListOk.length; j++) {
                                if ($scope.MyCrmCustomerStudentListForAddGroup[i].crm_student_id == $scope.MyCrmCustomerStudentListOk[j].crm_student_id) {
                                    $scope.MyCrmCustomerStudentListForAddGroup[i].select = 1;
                                    $scope.MyCrmCustomerStudentListOk[j].planAvailableNum = $scope.MyCrmCustomerStudentListForAddGroup[i].planAvailableNum;
                                    $scope.MyCrmCustomerStudentListOk[j].LeastCourseNum = $scope.MyCrmCustomerStudentListForAddGroup[i].LeastCourseNum;
                                }
                            }

                        }
                    }

                    // _isSelectMt()
                });
            };
            //穿梭框效果
            $scope.selectOneMt = function (student) {
                if ($scope._look_mt) {
                    return false
                }
                if (!student.select) {
                    student.select = 1
                    $scope.MyCrmCustomerStudentListOk.push(angular.copy(student));
                }
                else {//如果是取消选中
                    $scope.deleteOneMt(student);
                }
            }
            $scope.deleteOneMt = function deleteOneMt(student) {
                if ($scope._look_mt) {
                    return false
                }
                for (var i = 0, len = $scope.MyCrmCustomerStudentListOk.length; i < len; i++) {
                    if (student.crm_student_id == $scope.MyCrmCustomerStudentListOk[i].crm_student_id) {
                        try {
                            $scope.MyCrmCustomerStudentListOk.splice(i, 1)
                        } catch (e) {
                        }
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

            //判断的2-9个学生一对多排课提示
            $scope.btnTrue = function () {
                if ($scope.MyCrmCustomerStudentListOk.length > 9) {
                    SweetAlert.swal('一对多试听一对多最多只能选择9人', '请重试', 'error');
                    return false;
                }
                if ($scope.MyCrmCustomerStudentListOk.length < 2) {
                    SweetAlert.swal('一对多试听一对多最少要选择2人', '请重试', 'error');
                    return false;
                }
                $scope.addModalfree.hide();
            }


            //选择列的功能
            $scope.$editColListonebyone = [
                {
                    id: 1,
                    name: '学生姓名',
                    select: 1
                },
                {
                    id: 2,
                    name: '学习顾问',
                    select: 1
                },
                {
                    id: 3,
                    name: '课程详情',
                    select: 1
                },
                /*{
                    id: 3,
                    name: '类型',
                    select: 1
                },*/
                {
                    id: 4,
                    name: '消课状态',
                    select: 1
                },
                {
                    id: 5,
                    name: '年级',
                    select: 1
                },
                {
                    id: 6,
                    name: '排课类型',
                    select: 1
                },
                {
                    id: 7,
                    name: '科目',
                    select: 1
                },
                {
                    id: 8,
                    name: '上课时间',
                    select: 1
                },
                {
                    id: 9,
                    name: '课时数',
                    select: 1
                },
                {
                    id: 10,
                    name: '任课老师',
                    select: 1
                },
                {
                    id: 11,
                    name: '课程标题',
                    select: 1
                },
                {
                    id: 12,
                    name: '课前预习',
                    select: 1
                }, {
                    id: 13,
                    name: '备课笔记',
                    select: 1
                },
                {
                    id: 14,
                    name: '课后作业',
                    select: 1
                },
                {
                    id: 15,
                    name: '消课人',
                    select: 1
                }, {
                    id: 16,
                    name: '消课时间',
                    select: 1
                },
                {
                    id: 17,
                    name: '取消原因',
                    select: 1
                },
                {
                    id: 18,
                    name: '操作',
                    select: 1
                }
                /*{
                    id: 5,
                    name: '课程类型',
                    select: 1
                },

                {
                    id: 7,
                    name: '课时性质',
                    select: 1
                },


                {
                    id: 10,
                    name: '计费金额',
                    select: 1
                },

                {
                    id: 12,
                    name: '排课课时',
                    select: 1
                },
                {
                    id: 13,
                    name: '折算系数',
                    select: 1
                },


                {
                    id: 16,
                    name: '全职/兼职',
                    select: 0
                },
                {
                    id: 17,
                    name: '教师电话',
                    select: 0
                },


                {
                    id: 22,
                    name: '消课终端',
                    select: 0
                },*/


            ]

            $scope.$editColListonebymore = [
                {
                    id: 1,
                    name: '一对多名称',
                    select: 1
                },
                {
                    id: 2,
                    name: '学生姓名',
                    select: 1
                },
                {
                    id: 3,
                    name: '学习顾问',
                    select: 1
                },
                {
                    id: 4,
                    name: '一对多人数',
                    select: 1
                },
                //{
                //    id: 5,
                //    name: '类型',
                //    select: 1
                //},
                {
                    id: 5,
                    name: '消课状态',
                    select: 1
                },
                {
                    id: 6,
                    name: '课程详情',
                    select: 1
                },
                {
                    id: 7,
                    name: '科目',
                    select: 1
                },
                {
                    id: 8,
                    name: '上课时间',
                    select: 1
                },
                {
                    id: 9,
                    name: '课时数',
                    select: 1
                },
                {
                    id: 10,
                    name: '任课老师',
                    select: 1
                },
                /*{
                    id: 12,
                    name: '全职/兼职',
                    select: 0
                },
                {
                    id: 13,
                    name: '教师电话',
                    select: 0
                },*/
                {
                    id: 11,
                    name: '	课程标题',
                    select: 1
                },
                {
                    id: 12,
                    name: '课前预习',
                    select: 1
                },
                {
                    id: 13,
                    name: '备课笔记',
                    select: 1
                },
                {
                    id: 14,
                    name: '课后作业',
                    select: 1
                },
                /*{
                    id: 18,
                    name: '消课终端',
                    select: 0
                },*/
                {
                    id: 15,
                    name: '消课人',
                    select: 1
                }, {
                    id: 16,
                    name: '消课时间',
                    select: 1
                },
                {
                    id: 17,
                    name: '取消原因',
                    select: 1
                },
                {
                    id: 18,
                    name: '操作',
                    select: 1
                }
            ]

            function initChooseList(type) {
                $scope._showCol = false;
                $scope.selectCol = selectCol;
                $scope.$editColCss = ''
                //  当前状态是否全选
                $scope.isAll = false
                //  将配置项保存到h5本地存储
                if (type == 'coursePlanrecord') {
                    $scope.colListLength = $scope.$editColListonebymore.length
                    if (localStorage['$editColListonebymore'] == 'undefined' || !localStorage['$editColListonebymore']) {
                        localSave($scope.$editColListonebymore);
                    }
                } else if (type == 'record') {
                    $scope.colListLength = $scope.$editColListonebyone.length
                    if (localStorage['$editColListonebyone'] == 'undefined' || !localStorage['$editColListonebyone']) {
                        localSave($scope.$editColListonebyone);
                    }
                }

                /**
                 * 保存到本地
                 * @param datas
                 */
                function localSave(datas) {
                    if (type == 'coursePlanrecord') {
                        localStorage.setItem('$editColListonebymore', JSON.stringify(datas))
                    } else if (type == 'record') {
                        localStorage.setItem('$editColListonebyone', JSON.stringify(datas))
                    }

                }

                function initCol() {
                    if (type == 'coursePlanrecord') {
                        $scope.lEditColList = JSON.parse(localStorage['$editColListonebymore'])
                    } else if (type == 'record') {
                        $scope.lEditColList = JSON.parse(localStorage['$editColListonebyone'])
                    }

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
                    console.log(index)
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
                        $isShowCol.find('tr th').eq(index - 1).removeClass('hide')
                        hideOrShow()
                    } else {
                        $isShowCol.find('tr th').eq(index - 1).addClass('hide')
                        hideOrShow()
                    }

                    function hideOrShow() {
                        for (var i = 0; i < max; i++) {
                            if (isShow) {
                                //
                                $tr[i].cells[index - 1].hidden = false//.removeClass('hide')//.find('td').eq(index)
                            } else {
                                $tr[i].cells[index - 1].hidden = true//.addClass('hide')
                            }
                        }
                    }
                }

                /**
                 * 恢复编辑列
                 */
                $scope.reastCol = reastCol

                function reastCol() {
                    if (type == 'coursePlanrecord') {
                        $scope.lEditColList = $scope.$editColListonebymore;
                    } else if (type == 'record') {
                        $scope.lEditColList = $scope.$editColListonebyone;
                    }
                    localSave($scope.lEditColList)
                    initCol()
                }


                //为了选择列功能实现
                function resatList() {
                    var ele = angular.element('#body').scroll()
                }

                initCol();
                resatList();
            }

            //  TODO:选则列功能
            $scope.showCol = showCol

            /**
             * 打开或关闭编辑列
             * @param arg
             */

            function showCol(arg, type) {


                if (arg) {

                    reastPosition();
                }
                $scope._showCol = arg;
            }

            /**********************************************************************************************************/
        }
    ]);
//一对多试听的控制器
