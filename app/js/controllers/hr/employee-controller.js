'use strict';

/**
 * The employee management controller.
 *
 * @author ywu
 * @version 1.0
 */
angular.module('ywsApp').controller('EmployeeManagementController', [
    '$scope', '$modal', '$rootScope', 'SweetAlert', 'CommonService', 'DepartmentService', 'PositionService', 'EmployeeService', 'DictionaryService', 'AuthenticationService', "TalentService", "fileReader", "RecruitmentManagementService", "$routeParams", "$location", "FileUploader", "$base64", "localStorageService", "CustomerStudentCourseService",
    function ($scope, $modal, $rootScope, SweetAlert, CommonService, DepartmentService, PositionService, EmployeeService, DictionaryService, AuthenticationService, TalentService, fileReader, RecruitmentManagementService, $routeParams, $location, FileUploader, $base64, localStorageService, CustomerStudentCourseService) {

        $scope.getAllDepartments = getAllDepartments;
        $scope.saveEmployee = saveEmployee;
        $scope.showEmployeeView = showEmployeeView;
        $scope.getEmployeesByFilters = getEmployeesByFilters;
        $scope.reset = reset;
        $scope.removeEmployee = removeEmployee;
        $scope.getServingEmployees = getServingEmployees;
        $scope.getDimissionEmployees = getDimissionEmployees;
        $scope.getAllDimissionEmployees = getAllDimissionEmployees;
        $scope.getToBeRecruitedEmployees = getToBeRecruitedEmployees;

        /** add employee related functions **/
        $scope.showAddView = showAddView;
        $scope.hideAddView = hideAddView;
        $scope.showEditView = showEditView;
        $scope.hideEditView = hideEditView;
        $scope.showDetailView = showDetailView;
        $scope.showSelectDepartment = showSelectDepartment;
        $scope.selectDepartment = selectDepartment;
        $scope.departmentSelected = departmentSelected;
        $scope.deptToPos = deptToPos;
        $scope.getPositions = getPositions;
        $scope.updateEmployee = updateEmployee;
        $scope.getResidenceType = getResidenceType;
        $scope.getEmploymentLevel = getEmploymentLevel;
        $scope.getDictionary = getDictionary;
        $scope.resetPassword = resetPassword;
        $scope.containsSubject = containsSubject;
        $scope.getAllSubjects = getAllSubjects;
        $scope.toggleSubject = toggleSubject;
        $scope.containsSubjectOnload = containsSubjectOnload;
        $scope.getAllDictData = getAllDictData;
        $scope.addWorkHistory = addWorkHistory;
        $scope.getIdentityType = getIdentityType;
        $scope.getGrade = getGrade;
        $scope.getTeachingCharacteristic = getTeachingCharacteristic;
        $scope.getAllProvince = getAllProvince;
        $scope.getCityByProvince = getCityByProvince;
        $scope.getAreaByCity = getAreaByCity;
        $scope.showSupplyView = showSupplyView;
        $scope.showRecruitmentSchedule = showRecruitmentSchedule;
        $scope.hideScheduleView = hideScheduleView;
        $scope.showTalentDetailView = showTalentDetailView;
        $scope.hideTalentDetailView = hideTalentDetailView;
        $scope.DateToStr = DateToStr;
        $scope.pattern = pattern;
        $scope.download = download;
        $scope.hideInfoView = hideInfoView;
        $scope.checkMobile = checkMobile;
        $scope.deleteWorkingExperience = deleteWorkingExperience;
        $scope.doAdd = doAdd;
        $scope.doUpdate = doUpdate;
        $scope.deleteAchievementImg = deleteAchievementImg;
        $scope.deleteAchievement = deleteAchievement;
        $scope.getRecruitmentPoints = getRecruitmentPoints;
        $scope.dateFormat = dateFormat;
        $scope.oneKeyTransfer = oneKeyTransfer;
        $scope.inputResignationReason = inputResignationReason;
        $scope.saveReason = saveReason;
        $scope.dateFormat_yyyyMM = dateFormat_yyyyMM;
        $scope.getAllEmployeesByFilters = getAllEmployeesByFilters;
        $scope.reRecruited = reRecruited;
        $scope.saveDeptPos = saveDeptPos;
        $scope.showDimissionDetailView = showDimissionDetailView;
        $scope.getSubjectGroup = getSubjectGroup;

        $scope.employee = {};
        $scope.employee.user = {};
        $scope.employee.department = {};
        $scope.newChange = {};
        $scope.newChange.departmentBefore = {};
        $scope.newChange.departmentAfter = {};
        $scope.se = {};
        $scope.de = {};
        $scope.tbre = {};
        $scope.ade = {};
        $scope.subjectGroups = [];

        //参数初始化
        $scope.hrTalent = {};
        $scope.hrTalent.department = {};
        $scope.hrTalent.historyTalents = {};
        $scope.hrTalent.newHistoryTalent = {};

        // retrieve the departments at first loading
        $scope.getAllDepartments();
        //show the tab view.
        $scope.showEmployeeView();
        $scope.getDictionary();
        $scope.getAllSubjects();
        $scope.getAllDictData();
        $scope.getIdentityType();
        $scope.getGrade();
        $scope.getTeachingCharacteristic();
        $scope.getAllProvince();
        $scope.getRecruitmentPoints();
        $scope.getSubjectGroup();
        $('.collapse').collapse();

        function getSubjectGroup() {
            DictionaryService.getSubjectGroup().then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.error, "请重试", "error");
                } else {
                    $scope.subjectGroups = response.data;
                }
            });
        }

        $scope.getAge = getAge;
        function getAge() {
            if ($scope.employee.birthDate) {
                var y1 = new Date($scope.employee.birthDate).getFullYear();
                var y2 = new Date().getFullYear();
                var m1 = new Date($scope.employee.birthDate).getMonth();
                var m2 = new Date().getMonth();
                var d1 = new Date($scope.employee.birthDate).getDate();
                var d2 = new Date().getDate();
                if (m1 < m2 || (m1 == m2 && d1 <= d2)) {
                    $scope.employee.age = y2 - y1;
                }
                else {
                    $scope.employee.age = y2 - y1 - 1;
                }


                if ($scope.employee.age < 0) {
                    $scope.employee.age = undefined;
                }
            }
        }


        $scope.cancle = function () {
            SweetAlert.swal({
                title: "是否要返回首页？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: true
            }, function (confirm) {
                if (confirm) {
                    $location.url("/");
                }
                else {
                    //do nothing
                }
            });
        }


        $scope.trained = function (employee) {
            SweetAlert.swal({
                title: "请谨慎操作！",
                text: '確定要将该待入职员工设置为参培过吗？',
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: true,
                showLoaderOnConfirm: true
            }, function (confirm) {
                if (confirm) {
                    var promise = EmployeeService.trained(employee.id);
                    promise.then(function (response) {
                        if (response.status == "FAILURE") {
                            SweetAlert.swal(response.data, "请重试", "error");
                            return false;
                        }
                        else {
                            getEmployeesByFilters(2);
                            SweetAlert.swal("参培成功", "确定", "success");
                        }

                    });
                }
            });
        }


        $scope.getExportAllResignationEmployees = function (temp, total) {
            //这里传的start和size都是0，不分页
            temp.total = total;
            var promise = EmployeeService.getAllEmployeesByFilters(temp, 0, 0);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    $scope.isLoading = false;
                    $scope.listModels = response.data;
                    //针对每条记录，都需要去设置其员工姓名，入职日期，部门性质
                    var size = $scope.listModels.length;
                    if (size == 0) {
                        SweetAlert.swal("无任何结果可以导出", "请重试", "info");
                        return false;
                    }
                    angular.forEach($scope.listModels, function (p, index) {
                        p.index = index + 1;//序号
                        p.departmentName = p.department == null ? " " : p.department.name;//部门名称
                        p.name = p.user.name;//姓名
                        p.positionName = p.position == null ? " " : p.position.name;//岗位
                        p.mobile = p.mobile == null ? "" : p.mobile;//联系方式 mobile
                        p.hiringDate = p.hiringDate == null ? "" : new Date(p.hiringDate).Format("yyyy-MM-dd");//入职日期
                        p.resignationDate = p.resignationDate == null ? "" : new Date(p.resignationDate).Format("yyyy-MM-dd");//离职日期
                        p.workingDate = $scope.getWorkingDate(p.hiringDate);//工龄
                        p.resignationReasonType = (p.resignationReasonType == null || p.resignationReasonType == 0) ? "" : $scope.dictData.resignationReasonType[p.resignationReasonType - 1].name;//离职原因
                        p.resignationReason = p.resignationReason == null ? "" : p.resignationReason;//原因描述
                        p.resignationByName = p.resignationByName == null ? "" : p.resignationByName;//经办人
                    });
                    $scope.doResignationExport(temp);
                }
            });
        }

        $scope.getExportEmployeesInfo = function (temp, total) {
            //这里传的start和size都是0，不分页
            temp.total = total;
            var promise = EmployeeService.getEmployeesByFilters(temp, 0, 0);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    $scope.isLoading = false;
                    $scope.listModels = response.data;
                    //针对每条记录，都需要去设置其员工姓名，入职日期，部门性质
                    var size = $scope.listModels.length;
                    if (size == 0) {
                        SweetAlert.swal("无任何结果可以导出", "请重试", "info");
                        return false;
                    }
                    angular.forEach($scope.listModels, function (p, index) {
                        p.index = index + 1;//序号
                        p.employerName = (p.employer == null || p.employer == 0) ? " " : $scope.dictData.employer[p.employer - 1].name; //合同签署单位
                        p.departmentName = p.department == null ? " " : p.department.name;//部门名称
                        p.name = p.user.name;//姓名
                        p.positionName = p.position == null ? " " : p.position.name;//岗位
                        p.allSubjectName = " ";//教学科目
                        if (p.subject) {
                            var idAll = p.subject;
                            if (idAll != undefined) {
                                $scope.subjects.id = idAll.split(",");
                                angular.forEach($scope.subjects.id, function (p1) {
                                    angular.forEach($scope.subjects, function (q) {
                                        if (p1 == q.id) {
                                            p.allSubjectName = p.allSubjectName + " " + q.name;
                                            return;
                                        }
                                    })
                                });
                            }
                        }
                        p.employmentLevelName = (p.employmentLevel == null || p.employmentLevel == 0) ? "" : $scope.dictData.employmentLevel[p.employmentLevel].name;//职级
                        p.starLevelName = (p.starLevel == null || p.starLevel == 0) ? "" : $scope.dictData.starLevel[p.starLevel - 1].name;//星级
                        p.mobile == null ? "" : p.mobile;//联系方式 mobile
                        p.genderName = p.user.gender == null ? "" : (p.user.gender == 0 ? "女" : "男");
                        p.maritalStatusName = (p.maritalStatus == null || p.maritalStatus == 0) ? "" : $scope.dictData.maritalStatus[p.maritalStatus - 1].name;//婚姻状况
                        p.ethnic = p.ethnic == null ? "" : p.ethnic;//民族
                        p.idNumber = p.idNumber == null ? "" : p.idNumber;//身份证号码
                        p.birthDateStr = p.birthDate == null ? "" : new Date(p.birthDate).Format("yyyy-MM-dd");//生日
                        p.age = p.age == null ? "" : p.age;//年龄
                        p.workingYears = p.workingYears == null ? "" : p.workingYears;//司龄
                        p.email = p.user.email == null ? "" : p.user.email;//邮箱
                        p.educationDegreeName = (p.educationDegree == null || p.educationDegree == 0) ? "" : $scope.dictData.educationDegree[p.educationDegree - 1].name;//学历
                        p.highestEducationInstituteName = p.highestEducationInstitute == null ? "" : p.highestEducationInstitute;//毕业院校
                        p.educationDegreeTypeName = (p.educationDegreeType == null || p.educationDegreeType == 0) ? "" : $scope.dictData.educationDegreeType[p.educationDegreeType - 1].name;//取得方式
                        p.major = (p.major == null) ? "" : p.major;//专业
                        p.highestEducationTime = "";
                        if (p.latestEducationStartDate == null) {
                            p.highestEducationTime = (p.graduationDate == null ? "" : "~ 至" + new Date(p.graduationDate).Format("yyyy-MM-dd"));
                        }
                        else {
                            p.highestEducationTime = new Date(p.latestEducationStartDate).Format("yyyy-MM-dd");
                            var temp = (p.graduationDate == null ? " 至 ~" : (" 至 " + new Date(p.graduationDate).Format("yyyy-MM-dd")));
                            p.highestEducationTime = p.highestEducationTime + temp;
                        }
                        p.registeredResidenceTypeName = (p.registeredResidenceType == null || p.registeredResidenceType == 0) ? "" : $scope.dictData.registeredResidenceType[p.registeredResidenceType - 1].name;//户口性质
                        //p.registeredResidence = p.registeredResidence == null ? "" : p.registeredResidence;//户口地址
                        p.address = p.address == null ? "" : p.address;//现住址
                        p.lastWorkingExperience = "";
                        if (p.workingExperienceList && p.workingExperienceList.length > 0) {
                            p.lastWorkingExperience = p.workingExperienceList[0].company;
                        }//最近一次工作经历
                        p.emergencyContactName = p.emergencyContactName == null ? "" : p.emergencyContactName;//紧急联系人
                        p.emergencyContactRelationshipName = (p.emergencyContactRelationship == null || p.emergencyContactRelationship == 0) ? "" : $scope.dictData.emergencyContactRelationship[p.emergencyContactRelationship - 1].name;//紧急联系人关系
                        p.emergencyContactNumber = p.emergencyContactNumber == null ? " " : p.emergencyContactNumber;//紧急联系人电话
                        p.trialAllSalary = (p.trialBasicSalary == null ? "无底薪" : (p.trialBasicSalary + "底薪")) + " + " + (p.trailPerformance == null ? "无绩效" : (p.trailPerformance + "绩效")) + "+" + (p.trailCommission == null ? "无提成" : p.trailCommission);//试用期薪资
                        p.AllSalary = (p.basicSalary == null ? "无底薪" : (p.basicSalary + "底薪")) + " + " + (p.performance == null ? "无绩效" : (p.performance + "绩效")) + "+" + (p.commission == null ? "无提成" : p.commission);;//转正薪资
                        p.hiringDateStr = p.hiringDate == null ? "" : new Date(p.hiringDate).Format("yyyy-MM-dd");//入职日期
                        p.trialEndDateStr = p.trialEndDate == null ? "" : new Date(p.trialEndDate).Format("yyyy-MM-dd");//转正日期
                        p.employmentTypeName = (p.employmentType == null || p.employmentType == 0) ? " " : $scope.dictData.employmentType[p.employmentType - 1].name;//在职状态
                        p.contractTypeName = (p.contractType == null || p.contractType == 0) ? " " : $scope.dictData.contractType[p.contractType - 1].name;//合同类型
                        p.contractPeriod = p.contractPeriod == null ? " " : p.contractPeriod;//合同期限（月）
                        p.contractStartDateStr = p.contractStartDate == null ? "" : new Date(p.contractStartDate).Format("yyyy-MM-dd");//合同签订日期
                        p.contractEndDateStr = p.contractEndDate == null ? "" : new Date(p.contractEndDate).Format("yyyy-MM-dd");//合同终止日期
                        p.holidays = "0天";//年假天数（根据合同开始时间，满半年，3天，满一年，5天）
                        if (p.contractStartDate) {
                            var dateNow = new Date();// 获取当前时间
                            dateNow.setMonth(dateNow.getMonth() - 6);// 将日期调整到半年前
                            if (p.contractStartDate < dateNow) {
                                //半年前今天大，表示是入职超过半年
                                var dateNow2 = new Date();// 获取当前时间
                                dateNow2.setFullYear(dateNow2.getFullYear() - 1);// 将日期调整到一年前
                                if (p.contractStartDate < dateNow2) {
                                    //一年前今天大，表示是入职超过一年
                                    p.holidays = "5天";
                                }
                                else {
                                    //介于半年和一年之间
                                    p.holidays = "3天";
                                }
                            }
                        }
                        p.channel1 = p.channel1 == null ? "" : p.channel1;
                        p.channel2 = p.channel2 == null ? "" : p.channel2;
                        p.channel3 = p.channel3 == null ? "" : p.channel3;
                        p.channel = p.channel1 + p.channel2 + p.channel3;
                        p.provinceName = p.provinceName == null ? "" : p.provinceName;
                        p.cityName = p.cityName == null ? "" : p.cityName;
                        p.areaName = p.areaName == null ? "" : p.areaName;
                    });
                    $scope.doExport(temp);
                }
            });
        }

        /**
         * 导出花名册
         */
        $scope.exportToExcel = function () {
            //导出异动的时候，去查询所有符合条件的list
            var temp = angular.copy($scope.sFilter);
            if (temp == null) {
                temp = {};
            }
            temp.employmentStatus = 0;
            if (temp.subject) {
                temp.subject = temp.subject.id;
            }
            var promise1 = EmployeeService.getEmployeesByFilters(temp, 0, 10);
            promise1.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    var total = response.data.total;
                    $scope.getExportEmployeesInfo(temp, total);
                }
            });

        }

        /**
         * 导出离职列表
         */
        $scope.exportResignationToExcel = function () {
            $scope.ade.employmentStatus = 1;
            var temp = angular.copy($scope.ade);
            var promise1 = EmployeeService.getAllEmployeesByFilters(temp, 0, 10);
            promise1.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    var total = response.data.total;
                    $scope.getExportAllResignationEmployees(temp, total);
                }
            });

        }

        /**
         * 离职员工导出
         */
        $scope.doResignationExport = function (temp) {
            var titleName = "查询条件：";
            var searchCondition = "";
            var exportTableStyle = {
                sheetid: titleName,
                headers: true,
                //caption: {title: titleName + searchCondition, style:'height:30px;'},
                column: { style: 'font-size:16px; text-align:left;' },
                columns: [
                    { columnid: 'index', title: '序号' },
                    { columnid: 'name', title: '姓名' },
                    { columnid: 'mobile', title: '手机号' },
                    { columnid: 'departmentName', title: '所属机构' },
                    { columnid: 'positionName', title: '所属岗位' },
                    { columnid: 'hiringDate', title: '入职日期' },
                    { columnid: 'resignationDate', title: '离职日期' },
                    { columnid: 'workingDate', title: '工龄' },
                    { columnid: 'resignationReasonType', title: '离职原因' },
                    { columnid: 'resignationReason', title: '原因描述' },
                    { columnid: 'resignationByName', title: '经办人' },
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
            alasql('SELECT * INTO XLS("员工离职列表.xls", ?) FROM ?', [exportTableStyle, $scope.listModels]);
        }

        /**
         * 真正的导出函数
         */
        $scope.doExport = function (temp) {
            var titleName = "查询条件：";
            var searchCondition = "";
            var exportTableStyle = {
                sheetid: titleName,
                headers: true,
                //caption: {title: titleName + searchCondition, style:'height:30px;'},
                column: { style: 'font-size:16px; text-align:left;' },
                columns: [
                    { columnid: 'index', title: '序号' },
                    { columnid: 'employerName', title: '合同签署单位' },
                    { columnid: 'departmentName', title: '部门/校区' },
                    { columnid: 'name', title: '姓名' },
                    { columnid: 'positionName', title: '岗位' },
                    { columnid: 'allSubjectName', title: '教学科目' },
                    { columnid: 'employmentLevelName', title: '职级' },
                    { columnid: 'starLevelName', title: '星级' },
                    { columnid: 'mobile', title: '联系方式' },
                    { columnid: 'genderName', title: '性别' },
                    { columnid: 'maritalStatusName', title: '婚姻状态' },
                    { columnid: 'ethnic', title: '民族' },
                    { columnid: 'idNumber', title: '身份证号码' },
                    { columnid: 'birthDateStr', title: '生日' },
                    { columnid: 'age', title: '年龄' },
                    { columnid: 'workingYears', title: '司龄' },
                    { columnid: 'email', title: '邮箱' },
                    { columnid: 'educationDegreeName', title: '学历' },
                    { columnid: 'highestEducationInstituteName', title: '毕业院校' },
                    { columnid: 'educationDegreeTypeName', title: '取得方式' },
                    { columnid: 'major', title: '专业' },
                    { columnid: 'highestEducationTime', title: '学习起止时间' },
                    { columnid: 'registeredResidenceTypeName', title: '户口性质' },
                    { columnid: 'provinceName', title: '户口所在省' },
                    { columnid: 'cityName', title: '户口所在市' },
                    { columnid: 'areaName', title: '户口所在县（区）' },
                    //{columnid:'registeredResidence',title: '户口地址'},
                    { columnid: 'address', title: '现住址' },
                    { columnid: 'lastWorkingExperience', title: '最近一次工作经历' },
                    { columnid: 'emergencyContactName', title: '紧急联系人' },
                    { columnid: 'emergencyContactRelationshipName', title: '紧急联系人关系' },
                    { columnid: 'emergencyContactNumber', title: '紧急联系人电话' },
                    { columnid: 'trialAllSalary', title: '试用期薪资' },
                    { columnid: 'AllSalary', title: '转正薪资' },
                    { columnid: 'channel', title: '招聘渠道' },
                    { columnid: 'hiringDateStr', title: '入职日期' },
                    { columnid: 'trialEndDateStr', title: '转正日期' },
                    { columnid: 'employmentTypeName', title: '在职状态' },
                    { columnid: 'contractTypeName', title: '合同类型' },
                    { columnid: 'contractPeriod', title: '合同期限（月）' },
                    { columnid: 'contractStartDateStr', title: '合同签订日期' },
                    { columnid: 'contractEndDateStr', title: '合同终止日期' },
                    { columnid: 'holidays', title: '年假天数' },
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
            alasql('SELECT * INTO XLS("员工花名册.xls", ?) FROM ?', [exportTableStyle, $scope.listModels]);
        }

        /**
         * 离职管理查看详细，不能查看薪资信息
         * @param employee
         */
        function showDimissionDetailView(employee) {
            $scope.employee = employee;
            /*employee.birthDate = employee.birthDate == null ? null : new Date(employee.birthDate);
            employee.hiringDate = employee.hiringDate == null ? null : new Date(employee.hiringDate);
            employee.graduationDate = employee.graduationDate == null ? null : new Date(employee.graduationDate);
            employee.trialEndDate  = employee.trialEndDate == null ? null : new Date(employee.trialEndDate);
            employee.paymentStartDate = employee.paymentStartDate == null ? null : new Date(employee.paymentStartDate);
            employee.contractStartDate = employee.contractStartDate == null ? null : new Date(employee.contractStartDate);
            employee.contractEndDate = employee.contractEndDate == null ? null : new Date(employee.contractEndDate);
            employee.latestEducationStartDate = employee.latestEducationStartDate == null ? null : new Date(employee.latestEducationStartDate);
            employee.latestEducationEndDate = employee.latestEducationEndDate == null ? null : new Date(employee.latestEducationEndDate);*/
            deptToPos();
            //每次要打开详细界面时，都要判断一下之前配置的教学特点
            $scope.toggleCharacteristic();
            //确定一下市和县列表选项
            if ($scope.employee.provinceCode != undefined) {
                var promise = DepartmentService.getCityByProvince($scope.employee.provinceCode);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                        return false;
                    }
                    else {
                        $scope.cities = response.data;
                    }
                }, function (error) {
                });
            }
            if ($scope.employee.cityCode != undefined) {
                var promise = DepartmentService.getAreaByCity($scope.employee.cityCode);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                        return false;
                    }
                    else {
                        $scope.areas = response.data;
                    }
                }, function (error) {
                });
            }
            $scope.detailTabs = [
                { id: 1, title: '基本信息', template: 'partials/hr/employee/basic-info-detail.html' + dateStrop },
                { id: 2, title: '职位信息', template: 'partials/hr/employee/position-info.html' + dateStrop },
                { id: 3, title: '工作经历', template: 'partials/hr/employee/work-history-detail.html' + dateStrop },
                { id: 4, title: '认证相关', template: 'partials/hr/employee/confirm-detail.html' + dateStrop },
                { id: 5, title: '其他', template: 'partials/hr/employee/other-detail.html' + dateStrop }
            ];
            $scope.detailModalTitle = '查看员工详细信息'
            $scope.employee.hiringDate = new Date($scope.employee.hiringDate).Format("yyyy-MM-dd");
            $scope.detailModal = $modal({ scope: $scope, templateUrl: 'partials/hr/employee/modal.employee.detail.html' + dateStrop, show: true, backdrop: 'static' });
        }

        /**
         * 离职员工重新待入职
         * @param employee
         */
        function reRecruited(employee) {
            //弹框填写重新入职后所属的部门岗位
            $scope.employee = angular.copy(employee);
            $scope.employee.department = undefined;
            $scope.employee.position = undefined;
            $scope.deptPosModalTitle = '选择待入职部门和岗位';
            $scope.deptPosModal = $modal({ scope: $scope, templateUrl: 'partials/hr/employee/modal.department.position.html' + dateStrop, show: true, backdrop: "static" });
        }

        /**
         * 保存选择的待入职部门岗位
         */
        function saveDeptPos() {
            //将员工状态改为[离职直接待入职]
            $scope.employee.employmentStatus = 3;
            if ($scope.employee.workingExperienceList) {
                angular.forEach($scope.employee.workingExperienceList, function (p, index) {
                    if (p.departure_date) {
                        p.departure_date = new Date(p.departure_date);
                    }
                    if (p.entrance_date) {
                        p.entrance_date = new Date(p.entrance_date);
                    }
                });
            }
            var promise = EmployeeService.update($scope.employee);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    getAllEmployeesByFilters();
                    $scope.deptPosModal.hide();
                    SweetAlert.swal('直接待入职成功', 'success');
                }
            }, function (error) {
                $scope.deptPosModal.hide();
            }
            );
        }

        /**
         * 获取所有离职员工
         * @param tableState
         */
        function getAllDimissionEmployees(tableState) {
            $scope.ade.employmentStatus = 1;
            $scope.gadTableState = tableState;
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            var promise = EmployeeService.getAllEmployeesByFilters($scope.ade, $scope.start, $scope.number);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    var data = {};
                    data.data = response.data.list;
                    data.numberOfPages = response.data.pages
                    $scope.allDimissionEmployees = data.data;
                    dateFormat_yyyyMM($scope.allDimissionEmployees);
                    $scope.generateImgPreviewSrc($scope.allDimissionEmployees);
                    angular.forEach($scope.allDimissionEmployees, function (p, index) {
                        if (p.talentId) {
                            var talent = {};
                            talent.id = p.talentId;
                            var promise = TalentService.findByFilter(talent, 0, 1);
                            promise.then(function (response) {
                                if (response.status == "FAILURE") {
                                    SweetAlert.swal(response.data, "请重试", "error");
                                }
                                else {
                                    var result = {};
                                    result.data = response.data.list;
                                    result.numberOfPages = response.data.pages;
                                    dateFormat(result.data[0]);
                                    p.talent = result.data[0];
                                    $scope.generateImgPreviewSrc2(p.talent);
                                }
                            }, function (error) {
                                SweetAlert.swal('获取待入职人才列表失败', '请重试', 'error');
                            });
                        }
                    });
                    tableState.pagination.numberOfPages = data.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                }
            }, function (error) {
            });
        }

        function getAllEmployeesByFilters() {
            $scope.ade.employmentStatus = 1;
            $scope.temp = angular.copy($scope.ade);
            //$scope.gadTableState.pagination.start=0;
            $scope.gadTableState.pagination.start = 0;
            $scope.pagination = $scope.gadTableState.pagination;
            $scope.isLoading = true;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            var promise = EmployeeService.getAllEmployeesByFilters($scope.temp, $scope.start, $scope.number);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    var data = {};
                    data.data = response.data.list;
                    data.numberOfPages = response.data.pages;
                    $scope.allDimissionEmployees = data.data;
                    dateFormat_yyyyMM($scope.allDimissionEmployees);//将工作经历中的时间转换为yyyy-MM格式
                    $scope.generateImgPreviewSrc($scope.allDimissionEmployees);
                    angular.forEach($scope.allDimissionEmployees, function (p, index) {
                        if (p.talentId) {
                            var talent = {};
                            talent.id = p.talentId;
                            var promise = TalentService.findByFilter(talent, 0, 1);
                            promise.then(function (response) {
                                if (response.status == "FAILURE") {
                                    SweetAlert.swal(response.data, "请重试", "error");
                                }
                                else {
                                    var result = {};
                                    result.data = response.data.list;
                                    result.numberOfPages = response.data.pages;
                                    dateFormat(result.data[0]);
                                    p.talent = result.data[0];
                                    $scope.generateImgPreviewSrc2(p.talent);
                                }
                            }, function (error) {
                                SweetAlert.swal('获取待入职人才列表失败', '请重试', 'error');
                            });
                        }
                    });
                    $scope.gadTableState.pagination.numberOfPages = data.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                }
            }, function (error) {
            });
        }

        /**
         * 一键转移员工到未处理部门
         * @param employee
         */
        function oneKeyTransfer(employee) {
            SweetAlert.swal({
                title: "确定要将该员工转移至未处理部门吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: true
            }, function (confirm) {
                if (confirm) {
                    if (!employee.position) {
                        employee.position = {};
                    }
                    employee.department.id = Constants.UnhandleDepartment;
                    employee.position.id = Constants.UnhandlePosition;
                    var promise = EmployeeService.update(employee);
                    promise.then(function (response) {
                        if (response.status == "FAILURE") {
                            SweetAlert.swal(response.data, "请重试", "error");
                        }
                        else {
                            //处理后需要更新 列表数据
                            getEmployeesByFilters(0);
                            getEmployeesByFilters(1);
                            getEmployeesByFilters(2);
                            SweetAlert.swal('转移成功', 'success');
                        }
                    }, function (error) {
                        SweetAlert.swal('转移失败', 'error');
                    }
                    );
                }
            }
            );
            if (!employee.department) {
                employee.department = {};
            }
        }

        /**
         * 获取招聘流程节点
         */
        function getRecruitmentPoints() {
            var promise = RecruitmentManagementService.getRecruitmentPoints()
                .then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        $scope.allRecruitmentPoints = response.data;
                        $scope.initRecruitmentPoints = [];
                        $scope.initRecruitmentPointsRequired = [];
                        angular.forEach($scope.allRecruitmentPoints, function (p, index) {
                            if (p.name != "简历初选" && p.name != "待入职" && p.name != "转让" && p.name != "已入职") {
                                $scope.initRecruitmentPoints.push(p);
                            }
                            if (p.name != "简历初选" && p.name != "转让" && p.name != "已入职") {
                                $scope.initRecruitmentPointsRequired.push(p);
                            }
                        });
                    }
                }, function (error) {
                    SweetAlert.swal('获取招聘流程失败', '请重试', 'error');
                }
                );
        }

        /**
         * Delete the employee achievement's image.
         * @param index the index in the achievement list
         * @param pos   the image position, limited 1 - 3
         */
        function deleteAchievementImg(index, pos) {
            var templist = $scope.employee.teachingAchievementList.slice(index, index + 1);
            var temp = templist[0];
            if (pos == 1) {
                temp.achievementImg1 = null;
            }
            else if (pos == 2) {
                temp.achievementImg2 = null;
            }
            else if (pos == 3) {
                temp.achievementImg3 = null;
            }
        }

        /**
         * Delete achievement by index.
         * @param index the index
         */
        function deleteAchievement(index) {
            $scope.employee.teachingAchievementList.splice(index, 1)
        }

        function deleteWorkingExperience(index) {
            //$scope.employee.workingExperienceList
            if ($scope.employee.workingExperienceList) {
                $scope.employee.workingExperienceList.splice(index, 1);
            }
        }

        $scope.checkIsExist = function () {
            if ($scope.employee.mobile.length != 11 || !$scope.employee.mobile.match($rootScope.reg_mobile)) {
                //非法手机号
                SweetAlert.swal("请输入合法手机号", '请重试', 'error');
                return false;
            }
            else {
                //判断手机号是否重复
                var temp = [];
                temp.mobile = $scope.employee.mobile;
                temp.existId = $scope.employee.id;
                //temp.employmentStatus = 0;
                var promise = EmployeeService.getDuplicateEmployees(temp, 0, 10);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        var data = {};
                        data.data = response.data.list;
                        data.numberOfPages = response.data.pages
                        var result = data.data;
                        if (result.length > 0) {
                            //根据手机号和员工id去库里查询
                            SweetAlert.swal("此手机号已存在于系统中，请去员工列表中查询。", '请重试', 'error');
                            return false;
                        }
                    }
                }, function (error) {
                });
            }
        }

        /**
         * 检测手机号是否合法，是否重复
         * @returns {boolean}
         */
        function checkMobile(status) {
            //var reg = /^((\(\d{3}\))|(\d{3}\-))?13\d{9}|14[57]\d{8}|15\d{9}|18\d{9}|178\d{8}$/ ;
            if ($scope.employee.mobile.length != 11 || !$scope.employee.mobile.match($rootScope.reg_mobile)) {
                //非法手机号
                SweetAlert.swal("请输入合法手机号", '请重试', 'error');
                $scope.isExist = true;
                return true;
            }
            else {
                //判断手机号是否重复
                var temp = [];
                temp.mobile = $scope.employee.mobile;
                temp.employmentStatus = 0;
                var promise = EmployeeService.getDuplicateEmployees(temp, 0, 10);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        var data = {};
                        data.data = response.data.list;
                        data.numberOfPages = response.data.pages
                        var result = data.data;
                        if (result.length > 0) {
                            //根据手机号去库里查询，如果有记录，那么再判断是否为当前修改的用户
                            var found = false;
                            if ($scope.employee.id && $scope.employee.mobile) {
                                //修改用户
                                angular.forEach(result, function (p, index) {
                                    if (p.id != $scope.employee.id) {
                                        found = true;
                                        return false;
                                    }
                                });
                                if (found == true) {
                                    SweetAlert.swal("此手机号已存在于系统中，请去员工列表中查询。", '请重试', 'error');
                                    // $scope.employee.mobile = null;
                                    return true;
                                }
                                else {
                                    if (status == -1) {
                                        //添加员工
                                        doAdd();
                                    }
                                    else {
                                        doUpdate(status);
                                    }
                                    return false;
                                }
                            }
                            else if ($scope.employee.mobile) {
                                //如果是新增的用户，那么直接提示有重复。
                                if (result.length > 0) {
                                    SweetAlert.swal("手机号已经存在，请重新输入", '请重试', 'error');
                                    // $scope.employee.mobile = null;
                                    return true;
                                }
                            }
                        }
                        else {
                            //如果从库里没查到记录，那么就没有重复记录
                            if (status == -1) {
                                //添加员工
                                doAdd();
                            }
                            else {
                                doUpdate(status);
                            }
                            return;
                        }
                    }
                }, function (error) {
                });
            }
        }

        function doAdd() {
            $scope.employee.groupTeacher = $scope.groupTeacher;
            //检查座机号是否唯一
            //身份证
            if ($scope.employee.workingExperienceList) {
                angular.forEach($scope.employee.workingExperienceList, function (p, index) {
                    if (p.departure_date) {
                        p.departure_date = new Date(p.departure_date);
                    }
                    if (p.entrance_date) {
                        p.entrance_date = new Date(p.entrance_date);
                    }
                });
            }
            var imgIdentity = document.getElementById("identity").files[0];
            if (imgIdentity != null) {
                $scope.employee.imageIdentity = imgIdentity.name;
            }
            //教师资格证
            var imgTeacher = document.getElementById("teacher").files[0];
            if (imgTeacher != null) {
                $scope.employee.imageTeacher = imgTeacher.name;
            }
            //学历认证
            var imgEducation = document.getElementById("education").files[0];
            if (imgEducation != null) {
                $scope.employee.imageEducation = imgEducation.name;
            }
            //专业资格证
            var imgProfessional = document.getElementById("professional").files[0];
            if (imgProfessional != null) {
                $scope.employee.imageProfessional = imgProfessional.name;
            }
            //头像
            var imgProfile = document.getElementById("profile").files[0];
            if (imgProfile != null) {
                //var fname = $scope.GetFileNameNoExt(imgProfile.name);
                var fname = encodeURI(imgProfile.name);
                //fname = fname + $scope.getFileExt(imgProfile.name);
                $scope.employee.profile = fname;
            }
            if ($scope.employee.landline) {
                var temp = [];
                temp.landline = $scope.employee.landline;
                temp.employmentStatus = 0;
                //var promise = EmployeeService.getDuplicateEmployees(temp,0, 10);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        var data = {};
                        data.data = response.data.list;
                        data.numberOfPages = response.data.pages
                        if (data.data.length > 0) {
                            SweetAlert.swal("座机号已经存在，请重新输入", '请重试', 'error');
                            return false;
                        }
                        else {
                            $scope.employee.employmentStatus = 0;
                            var promise2 = EmployeeService.add($scope.employee);
                            promise2.then(function (response) {
                                if (response.status == "FAILURE") {
                                    SweetAlert.swal(response.data, "请重试", "error");
                                    return false;
                                }
                                else {
                                    SweetAlert.swal('添加成功', 'success');
                                    hideAddView();
                                    var data = response.data;
                                    imageUpload($scope.employee.imageIdentity, imgIdentity, data);//身份证
                                    imageUpload($scope.employee.imageTeacher, imgTeacher, data);//教师证
                                    imageUpload($scope.employee.imageEducation, imgEducation, data);//学位证
                                    imageUpload($scope.employee.imageProfessional, imgProfessional, data);//专业资格证
                                    if (imgProfile) {
                                        imageUpload(imgProfile.name, imgProfile, data);//头像
                                        //imageUpload($scope.employee.profile, imgProfile, data);//头像
                                    }
                                    if ($scope.employee.teachingAchievementList != undefined) {
                                        angular.forEach($scope.employee.teachingAchievementList, function (q) {
                                            if (q.img1 != undefined) {
                                                imageUpload(q.img1.name, q.img1, $scope.employee);
                                            }
                                            if (q.img2 != undefined) {
                                                imageUpload(q.img2.name, q.img2, $scope.employee);
                                            }
                                            if (q.img3 != undefined) {
                                                imageUpload(q.img3.name, q.img3, $scope.employee);
                                            }
                                        })
                                    }
                                    $scope.employee = {};
                                    getEmployeesByFilters(0);
                                }
                            }, function (error) {
                                SweetAlert.swal('添加失败', '请重试', 'error');
                                hideAddView();
                            });
                        }
                    }
                })
            }
            else {
                $scope.employee.employmentStatus = 0;
                var promise2 = EmployeeService.add($scope.employee);
                $rootScope.sb = true
                promise2.then(function (response) {
                    $rootScope.sb = false
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        SweetAlert.swal('添加成功', 'success');
                        hideAddView();
                        var data = response.data;
                        imageUpload($scope.employee.imageIdentity, imgIdentity, data);//身份证
                        imageUpload($scope.employee.imageTeacher, imgTeacher, data);//教师证
                        imageUpload($scope.employee.imageEducation, imgEducation, data);//学位证
                        imageUpload($scope.employee.imageProfessional, imgProfessional, data);//专业资格证
                        imageUpload($scope.employee.profile, imgProfile, data);//头像
                        //在图片预览时候，已经将新增的图片封装在newImgList对象中了
                        if ($scope.employee.teachingAchievementList != undefined) {
                            angular.forEach($scope.employee.teachingAchievementList, function (q) {
                                if (q.img1 != undefined) {
                                    imageUpload(q.img1.name, q.img1, data);
                                }
                                if (q.img2 != undefined) {
                                    imageUpload(q.img2.name, q.img2, data);
                                }
                                if (q.img3 != undefined) {
                                    imageUpload(q.img3.name, q.img3, data);
                                }
                            })
                        }
                        $scope.employee = {};
                        getEmployeesByFilters(0);
                    }
                }, function (error) {
                    $rootScope.sb = false
                    SweetAlert.swal('添加失败', '请重试', 'error');
                    hideAddView();
                });
            }
        }

        function doUpdate(status) {

            var oldEmploymentStatus = $scope.employee.employmentStatus;
            var talent = null;
            if ($scope.employee.talentId != null) {
                talent = angular.copy($scope.employee.talent);
            }
            if (talent) {
                angular.forEach(talent.recruitmentSchedule, function (p, index) {
                    p.scheduleDate = new Date(p.scheduleDate);
                });
            }
            $scope.employee.groupTeacher = $scope.groupTeacher;
            //如果是招聘待入职的，那么需要修改对应人才的流程状态
            // 加入【已入职】节点，时间为【保存时间】，描述为【已入职】，该组招聘状态置为结束
            if ($scope.employee.landline) {
                var temp = [];
                temp.landline = $scope.employee.landline;
                //temp.employmentStatus = status;
                var promise = EmployeeService.getDuplicateEmployees(temp, 0, 10);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        var data = {};
                        data.data = response.data.list;
                        data.numberOfPages = response.data.pages
                        if (data.data.length > 0) {
                            var found = false;
                            if ($scope.employee.id) {
                                angular.forEach(data.data, function (p, index) {
                                    if (p.id != $scope.employee.id) {
                                        found = true;
                                        return;
                                    }
                                });
                                if (found == true) {
                                    SweetAlert.swal("座机号已经存在，请重新输入", '请重试', 'error');
                                    //$scope.employee.landline = null;
                                    return;
                                }
                                else {
                                    var oldEmploymentStatus = $scope.employee.employmentStatus;
                                    $scope.employee.employmentStatus = status == 4 ? 0 : status;
                                    var e = angular.copy($scope.employee);
                                    var promise2 = EmployeeService.update($scope.employee);
                                    promise2.then(function (response) {
                                        if (response.status == "FAILURE") {
                                            SweetAlert.swal(response.data, "请重试", "error");
                                        }
                                        else {
                                            var data = response.data;
                                            //先将该员工所有的异动纪录标记为 已删除
                                            var promise = EmployeeService.deleteChangeByEmployeeId(e.id);
                                            promise.then(function (response) {
                                                if (response.status == "FAILURE") {
                                                    SweetAlert.swal(response.data, "请重试", "error");
                                                    return false;
                                                }
                                                else {
                                                    //更新异动信息
                                                    if (e.changes) {
                                                        angular.forEach(e.changes, function (p, index) {
                                                            //无id的，证明是新增的，才需要去操作
                                                            var promise = EmployeeService.saveChange(p);
                                                            promise.then(function (response) {
                                                                if (response.status == "FAILURE") {
                                                                    SweetAlert.swal(response.data, "请重试", "error");
                                                                    return false;
                                                                }
                                                            });
                                                        });
                                                    }
                                                }
                                            });
                                            if (oldEmploymentStatus == "招聘待入职") {
                                                //如果是【招聘待入职】，那么为对应的人才需要新增【已入职】节点，同时该组招聘结束
                                            }
                                            if (status != 4) {
                                                //修改成功后需要更新 列表数据
                                                getEmployeesByFilters(0);
                                                getEmployeesByFilters(1);
                                                getEmployeesByFilters(2);
                                                SweetAlert.swal('修改成功', 'success');
                                            }
                                            else if (status == 4) {
                                                $rootScope.currentUser.name = $scope.employee.user.name;
                                                SweetAlert.swal('修改个人信息成功', '确定', 'success');
                                                $location.url('/');
                                            }
                                        }
                                    }, function (error) {
                                        //验证座机号重复错误
                                        SweetAlert.swal('修改失败', '请重试', 'error');
                                    });
                                    if (status != 4) {
                                        hideEditView();
                                    }
                                }
                            }
                        }
                        else {
                            $scope.employee.employmentStatus = status == 4 ? 0 : status;
                            var e = angular.copy($scope.employee);
                            var promise2 = EmployeeService.update($scope.employee);
                            promise2.then(function (response) {
                                if (response.status == "FAILURE") {
                                    SweetAlert.swal(response.data, "请重试", "error");
                                }
                                else {
                                    var data = response.data;
                                    //先将该员工所有的异动纪录标记为 已删除
                                    var promise = EmployeeService.deleteChangeByEmployeeId(e.id);
                                    promise.then(function (response) {
                                        if (response.status == "FAILURE") {
                                            SweetAlert.swal(response.data, "请重试", "error");
                                            return false;
                                        }
                                        else {
                                            //更新异动信息
                                            if (e.changes) {
                                                angular.forEach(e.changes, function (p, index) {
                                                    //无id的，证明是新增的，才需要去操作
                                                    var promise = EmployeeService.saveChange(p);
                                                    promise.then(function (response) {
                                                        if (response.status == "FAILURE") {
                                                            SweetAlert.swal(response.data, "请重试", "error");
                                                            return false;
                                                        }
                                                    });
                                                });
                                            }
                                        }
                                    });
                                    if (status != 4) {
                                        //修改成功后需要更新 列表数据
                                        getEmployeesByFilters(0);
                                        getEmployeesByFilters(1);
                                        getEmployeesByFilters(2);
                                        SweetAlert.swal('修改成功', 'success');
                                    }
                                    else if (status == 4) {
                                        $rootScope.currentUser.name = $scope.employee.user.name;
                                        SweetAlert.swal('修改个人信息成功', '确定', 'success');
                                        $location.url('/');
                                    }
                                }
                            }, function (error) {
                                //验证座机号重复错误
                                SweetAlert.swal('修改失败', '请重试', 'error');
                            });
                            if (status != 4) {
                                hideEditView();
                            }
                        }
                    }
                })
            }
            else {
                var e = angular.copy($scope.employee);
                $scope.employee.employmentStatus = status == 4 ? 0 : status;
                var promise2 = EmployeeService.update($scope.employee);
                promise2.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        var data = response.data;
                        //先将该员工所有的异动纪录标记为 已删除
                        var promise = EmployeeService.deleteChangeByEmployeeId(e.id);
                        promise.then(function (response) {
                            if (response.status == "FAILURE") {
                                SweetAlert.swal(response.data, "请重试", "error");
                                return false;
                            }
                            else {
                                //更新异动信息
                                if (e.changes) {
                                    angular.forEach(e.changes, function (p, index) {
                                        //无id的，证明是新增的，才需要去操作
                                        var promise = EmployeeService.saveChange(p);
                                        promise.then(function (response) {
                                            if (response.status == "FAILURE") {
                                                SweetAlert.swal(response.data, "请重试", "error");
                                                return false;
                                            }
                                        });
                                    });
                                }
                            }
                        });

                        if (oldEmploymentStatus == "招聘待入职") {
                            var obj = new Object();
                            obj.executor = AuthenticationService.currentUser().name;
                            obj.groupId = talent.recruitmentSchedule[0].groupId;
                            obj.talentId = talent.recruitmentSchedule[0].talentId;
                            obj.status = 1;
                            obj.scheduleDate = new Date();
                            obj.createdBy = AuthenticationService.currentUser().id;
                            obj.createdAt = new Date();
                            obj.scheduleDescription = "已入职";
                            obj.scheduleName = "已入职";
                            obj.isDeleted = 0;
                            talent.recruitmentSchedule.unshift(obj);
                            var promise1 = TalentService.addFinishNode(talent);
                            promise1.then(function (response) {
                                if (response.status == "FAILURE") {
                                    SweetAlert.swal(response.data, "请重试", "error");
                                }
                            }, function (error) {
                                SweetAlert.swal('为该员工对应的人才添加已入职节点失败', '请重试', 'error');
                                return false;
                            });
                        }
                        if (status != 4) {
                            //修改成功后需要更新 列表数据
                            getEmployeesByFilters(0);
                            getEmployeesByFilters(2);
                            SweetAlert.swal('修改成功', 'success');
                        }
                        else if (status == 4) {
                            $rootScope.currentUser.name = $scope.employee.user.name;
                            SweetAlert.swal('修改个人信息成功', '确定', 'success');
                            $location.url('/');
                        }
                    }
                }, function (error) {
                    SweetAlert.swal('修改失败', '请重试', 'error');
                });
                if (status != 4) {
                    hideEditView();
                }
            }
        }

        /**
         * 隐藏查看待入职人员的详细信息
         */
        function hideInfoView() {
            $scope.hrTalent = {};
            $scope.infoModal.hide();
        }

        /**
         * 简历下载
         */
        function download(hrTalent) {
            TalentService.download(hrTalent);
        }

        function DateToStr(date) {
            date = new Date(date);
            var year = date.getFullYear();
            var month = pattern(date.getMonth() + 1);
            var day = pattern(date.getDate());
            var dateStr = year + "-" + month + "-" + day;
            return dateStr;
        }

        function pattern(str) {
            str = new String(str);
            if (str.length < 2)
                return "0" + str;
            else
                return str;
        }

        function showTalentDetailView(hrTalent) {
            hrTalent.birthday = hrTalent.birthday == null ? null : (new Date(hrTalent.birthday));
            hrTalent.available_date = hrTalent.available_date == null ? null : (new Date(hrTalent.available_date));
            hrTalent.entrance_date = hrTalent.entrance_date == null ? null : (new Date(hrTalent.entrance_date));
            hrTalent.graduation_date = hrTalent.graduation_date == null ? null : (new Date(hrTalent.graduation_date));
            hrTalent.available_date = hrTalent.available_date == null ? null : (new Date(hrTalent.available_date));
            hrTalent.last_company_departure_date = hrTalent.last_company_departure_date == null ? null : (new Date(hrTalent.last_company_departure_date));
            if (hrTalent.hrWorkingExperiences != undefined) {
                angular.forEach(hrTalent.hrWorkingExperiences, function (p, index) {
                    hrTalent.hrWorkingExperiences[index].departure_date = new Date(hrTalent.hrWorkingExperiences[index].departure_date).Format("yyyy-MM");
                    hrTalent.hrWorkingExperiences[index].entrance_date = new Date(hrTalent.hrWorkingExperiences[index].entrance_date).Format("yyyy-MM");
                })
            }

            var promise = PositionService.list(hrTalent.department_id);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                    return false;
                }
                else {
                    $scope.positions = response.data;
                }
            }, function (error) {
            });
            $scope.hrTalent = angular.copy(hrTalent);
            $scope.infoTabs = [
                { id: 1, title: '招聘信息', template: 'partials/hr/talent/recruit-info-readonly.html' + dateStrop },
                { id: 2, title: '基本信息', template: 'partials/hr/talent/basic-info-readonly.html' + dateStrop },
                { id: 3, title: '工作经历', template: 'partials/hr/talent/work-history-readonly.html' + dateStrop },
                { id: 4, title: '应聘意向', template: 'partials/hr/talent/job-intention-readonly.html' + dateStrop },
                { id: 5, title: '认证相关', template: 'partials/hr/talent/confirm-readonly.html' + dateStrop },
                { id: 6, title: '其他', template: 'partials/hr/talent/other-readonly.html' + dateStrop }
            ];
            $scope.infoModalTitle = '查看人才';
            $scope.infoModal = $modal({ scope: $scope, templateUrl: 'partials/hr/talent/modal.talent.info.html' + dateStrop, show: true, backdrop: "static" });
        }

        function hideTalentDetailView() {
            $scope.hrTalent = {};
            $scope.infoModal.hide();
        }
        /**
         * 招聘流程弹窗
         */
        function showRecruitmentSchedule(hrTalent) {
            $scope.hrTalent = angular.copy(hrTalent);
            $scope.recruitmentScheduleModalTitle = '招聘记录';
            $scope.recruitmentScheduleModal = $modal({ scope: $scope, templateUrl: 'partials/hr/employee/modal.talent.detail.html' + dateStrop, show: true, backdrop: "static" });
        }

        function hideScheduleView() {
            $scope.recruitmentScheduleModal.hide();
        }
        /**
         * Show the view supply employee information.
         * @param employee
         */
        function showSupplyView(employee) {
            angular.forEach(employee.workingExperienceList, function (p, index) {
                p.entrance_date = p.entrance_date == null ? null : new Date(p.entrance_date);
                p.departure_date = p.departure_date == null ? null : new Date(p.departure_date);
            })
            $scope.employee = angular.copy(employee);
            if (!$scope.employee.teachingAchievementList) {
                var obj = new Object();
                $scope.employee.teachingAchievementList = [];
                $scope.employee.teachingAchievementList.push(obj);
            }
            deptToPos();
            //$scope.employee.salary = undefined;
            //每次要打开编辑界面时，都要判断一下之前配置的教学特点
            $scope.toggleCharacteristic();
            //确定一下市和县列表选项
            if ($scope.employee.provinceCode != undefined) {
                var promise = DepartmentService.getCityByProvince($scope.employee.provinceCode);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                        return false;
                    }
                    else {
                        $scope.cities = response.data;
                    }
                }, function (error) {
                });
            }
            if ($scope.employee.cityCode != undefined) {
                var promise = DepartmentService.getAreaByCity($scope.employee.cityCode);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                        return false;
                    }
                    else {
                        $scope.areas = response.data;
                    }
                }, function (error) {
                });
            }
            $scope.editTabs = [
                { id: 1, title: '基本信息', template: 'partials/hr/employee/basic-info.html' + dateStrop },
                { id: 2, title: '职位信息', template: 'partials/hr/employee/position-info.html' + dateStrop },
                //                {id:3,title:'薪资信息', template: 'partials/hr/employee/salary-info.html'+dateStrop},
                { id: 4, title: '工作经历', template: 'partials/hr/employee/work-history.html' + dateStrop },
                { id: 5, title: '认证相关', template: 'partials/hr/employee/confirm.html' + dateStrop },
                { id: 6, title: '其他', template: 'partials/hr/employee/other.html' + dateStrop }
            ];
            $scope.editModalTitle = '补充员工详细信息';
            $scope.editModal = $modal({ scope: $scope, templateUrl: 'partials/hr/employee/modal.employee.supply.html' + dateStrop, show: true, backdrop: 'static' });
        }

        function getToBeRecruitedEmployees(tableState) {
            //get the to be recruited employees.
            $scope.tbre.employmentStatus = 2;
            $scope.grTableState = tableState;
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            var promise = EmployeeService.getEmployeesByFilters($scope.tbre, $scope.start, $scope.number);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    var result = {};
                    result.data = response.data.list;
                    result.numberOfPages = response.data.pages;
                    $scope.toBeRecruitedEmployees = result.data;
                    dateFormat_yyyyMM($scope.toBeRecruitedEmployees);
                    $scope.generateImgPreviewSrc($scope.toBeRecruitedEmployees);
                    angular.forEach($scope.toBeRecruitedEmployees, function (p, index) {
                        if (p.talentId) {
                            var talent = {};
                            talent.id = p.talentId;
                            var promise = TalentService.findByFilter(talent, 0, 1);
                            promise.then(function (response) {
                                if (response.status == "FAILURE") {
                                    SweetAlert.swal(response.data, "请重试", "error");
                                }
                                else {
                                    var result = {};
                                    result.data = response.data.list;
                                    result.numberOfPages = response.data.pages;
                                    dateFormat(result.data[0]);
                                    p.talent = result.data[0];
                                    $scope.generateImgPreviewSrc2(p.talent);
                                }
                            }, function (error) {
                                SweetAlert.swal('获取待入职人才列表失败', '请重试', 'error');
                            });
                        }
                    });
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                }
            }, function (error) {
            });
        }

        /**
         * 将时间戳转化为yyyy-MM-dd hh:mm:ss格式
         * @param p
         */
        function dateFormat(p) {
            if (p.recruitmentSchedule) {
                angular.forEach(p.recruitmentSchedule, function (q, index) {
                    p.recruitmentSchedule[index].scheduleDate = new Date(p.recruitmentSchedule[index].scheduleDate).Format("yyyy-MM-dd hh:mm:ss");
                })
            }
            if (p.historyTalents) {
                angular.forEach(p.historyTalents, function (q, index) {
                    angular.forEach(p.historyTalents[index].recruitmentSchedule, function (p1, index1) {
                        p.historyTalents[index].recruitmentSchedule[index1].scheduleDate = new Date(p.historyTalents[index].recruitmentSchedule[index1].scheduleDate).Format("yyyy-MM-dd hh:mm:ss");
                    });
                })
            }
        }

        $scope.generateImgPreviewSrc2 = function (p) {
            if (p.image_identity) {
                p.imageIdentitySrc = QINIU_HR_IMG_DOMAIN + p.id + "/" + p.image_identity;
            }
            if (p.image_teacher) {
                p.imageTeacherSrc = QINIU_HR_IMG_DOMAIN + p.id + "/" + p.image_teacher;
            }
            if (p.image_education) {
                p.imageEducationSrc = QINIU_HR_IMG_DOMAIN + p.id + "/" + p.image_education;
            }
            if (p.image_professional) {
                p.imageProfessionalSrc = QINIU_HR_IMG_DOMAIN + p.id + "/" + p.image_professional;
            }
            if (p.profile) {
                p.imageProfileSrc = QINIU_HR_IMG_DOMAIN + p.id + "/" + p.profile;
            }

            if (p.teaching_achievement) {
                //教学成果可以有多个。
                angular.forEach(p.teaching_achievement, function (q, index) {
                    q.achievementImages = [];
                    var str = angular.copy(q.picture);
                    //多个图片拼接规则是用 | 分割
                    while (true) {
                        if (str == null) {
                            break;
                        }
                        else if (str.indexOf("|") == -1) {
                            q.achievementImages.push(QINIU_HR_IMG_DOMAIN + p.id + "/" + str);
                            str = null;
                            continue;
                        }
                        var temp = str.substring(0, str.indexOf("|"));
                        temp = QINIU_HR_IMG_DOMAIN + p.id + "/" + temp;
                        q.achievementImages.push(temp);
                        str = str.substring(str.indexOf("|") + 1, str.length);
                    }
                })
            }
        }

        /**
         * 获取所有省份
         */
        function getAllProvince() {
            var promise = DepartmentService.getAllProvince();
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    $scope.provinces = response.data;
                }
            }, function (error) {
                SweetAlert.swal("获取省列表失败", "请重试", "error");
            });
        }

        /**
         * 根据省份code获取市
         * @param pcode province code
         */
        function getCityByProvince(pcode) {
            if (pcode == null) {
                $scope.cities = null;
            }
            else {
                var promise = DepartmentService.getCityByProvince(pcode);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                        return false;
                    }
                    else {
                        $scope.cities = response.data;
                    }
                }, function (error) {
                    SweetAlert.swal("获取市列表失败", "请重试", "error");
                });
            }
        }

        /**
         * 根据市code获取县
         * @param ccode city code
         */
        function getAreaByCity(ccode) {
            if (ccode == null) {
                $scope.areas = null;
            }
            else {
                var promise = DepartmentService.getAreaByCity(ccode);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        $scope.areas = response.data;
                    }
                }, function (error) {
                    SweetAlert.swal("获取地区列表失败", "请重试", "error");
                });
            }
        }

        /**
         * 调价教学成果
         */
        $scope.addTeachingAchievement = function () {
            var obj = new Object();
            if ($scope.employee.teachingAchievementList == undefined) {
                $scope.employee.teachingAchievementList = [];
            }
            $scope.employee.teachingAchievementList.push(obj);
        }

        /**
         * 确定button是否选中
         */
        $scope.toggleCharacteristic = function () {
            //优先将$scope.characteristics全置false
            angular.forEach($scope.characteristics, function (p, index) {
                p.selected = false;
            })
            angular.forEach($scope.employee.characteristics, function (p, index) {
                angular.forEach($scope.characteristics, function (q, index2) {
                    if (p.id == q.id) {
                        q.selected = true;
                        return;
                    }
                })
            })
        }

        /**
         * 判断教学特点多选状态
         * @param para
         */
        $scope.checkItem = function (para) {
            //先判断之前是否选中
            //toggleCharacteristic(characteristic)
            if (para.selected) {
                para.selected = false;
            }
            else {
                para.selected = true;
            }
            $scope.updateCharacteristic(para);
        }

        /**
         * 更新教学特点状态
         * @param para
         */
        $scope.updateCharacteristic = function (para) {
            if ($scope.employee.characteristics == undefined) {
                $scope.employee.characteristics = [];
            }
            if (para.selected) {
                if ($scope.employee.characteristics.length >= 5) {
                    SweetAlert.swal("教学特点不能超过5个！");
                    para.selected = false;
                    return;
                }
                else {
                    //如果是选中，那么要加入 该员工的特点集
                    //para.teaching_characteristic_id = para.id;
                    $scope.employee.characteristics.push(para);
                }
            }
            else {
                //如果变成没有选中，那么需要从该人才的特点集中删除
                angular.forEach($scope.employee.characteristics, function (p, index) {
                    if (p.id == para.id) {
                        $scope.employee.characteristics.splice(index, 1);
                    }
                })
            }
        }

        /**
         * 获取教学特点
         */
        function getTeachingCharacteristic() {
            var promise = TalentService.getTeachingCharacteristic()
                .then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        $scope.characteristics = response.data;
                    }
                }, function (error) {
                    SweetAlert.swal('获取教学特点失败', '请重试', 'error');
                }
                );
        }
        /**
         * 图片预览
         * @param file
         */
        $scope.getFile = function (file) {
            var imgIdentity = document.getElementById("identity").files[0];
            if (imgIdentity != null) {
                fileReader.readAsDataUrl(imgIdentity, $scope)
                    .then(function (result) {
                        $scope.employee.imageIdentitySrc = result;
                    });
            }
            var imgTeacher = document.getElementById("teacher").files[0];
            if (imgTeacher != null) {
                fileReader.readAsDataUrl(imgTeacher, $scope)
                    .then(function (result) {
                        $scope.employee.imageTeacherSrc = result;
                    });
            }
            var imgEducation = document.getElementById("education").files[0];
            if (imgEducation != null) {
                fileReader.readAsDataUrl(imgEducation, $scope)
                    .then(function (result) {
                        $scope.employee.imageEducationSrc = result;
                    });
            }
            var imgProfessional = document.getElementById("professional").files[0];
            if (imgProfessional != null) {
                fileReader.readAsDataUrl(imgProfessional, $scope)
                    .then(function (result) {
                        $scope.employee.imageProfessionalSrc = result;
                    });
            }
            var imgProfile = document.getElementById("profile").files[0];
            if (imgProfile != null) {
                fileReader.readAsDataUrl(imgProfile, $scope)
                    .then(function (result) {
                        $scope.employee.imageProfileSrc = result;
                    });
            }
            //教学成果
            if ($scope.employee.teachingAchievementList) {
                angular.forEach($scope.employee.teachingAchievementList, function (p, index) {
                    if (p.img1 != null) {
                        fileReader.readAsDataUrl(p.img1, $scope)
                            .then(function (result) {
                                p.img1Src = result;
                                //var fname = $scope.GetFileNameNoExt(p.img1.name);
                                var fname = encodeURI(p.img1.name);
                                //fname = fname + $scope.getFileExt(p.img1.name);
                                p.achievementImg1 = fname;
                            });
                    }
                    if (p.img2 != null) {
                        fileReader.readAsDataUrl(p.img2, $scope)
                            .then(function (result) {
                                p.img2Src = result;
                                //var fname = $scope.GetFileNameNoExt(p.img2.name);
                                var fname = encodeURI(p.img2.name);
                                //fname = fname + $scope.getFileExt(p.img2.name);
                                p.achievementImg2 = fname;
                            });
                    }
                    if (p.img3 != null) {
                        fileReader.readAsDataUrl(p.img3, $scope)
                            .then(function (result) {
                                p.img3Src = result;
                                //var fname = $scope.GetFileNameNoExt(p.img3.name);
                                var fname = encodeURI(p.img3.name);
                                //fname = fname + $scope.getFileExt(p.img3.name);
                                p.achievementImg3 = fname;
                            });
                    };
                });
            }
        };

        //取文件名不带后缀
        $scope.GetFileNameNoExt = function (filepath) {
            if (filepath != "") {
                var names = filepath.split("\\");
                var pos = names[names.length - 1].lastIndexOf(".");
                return names[names.length - 1].substring(0, pos);
            }
        }

        $scope.getFileExt = function (file_name) {
            var result = /\.[^\.]+/.exec(file_name);
            return result;
        }

        //针对每一条人才记录，生成图片预览地址
        $scope.generateImgPreviewSrc = function (employees) {
            angular.forEach(employees, function (p, index) {
                if (p.imageIdentity) {
                    p.imageIdentitySrc = QINIU_HR_IMG_DOMAIN + p.id + "/" + p.imageIdentity;
                }
                if (p.imageTeacher) {
                    p.imageTeacherSrc = QINIU_HR_IMG_DOMAIN + p.id + "/" + p.imageTeacher;
                }
                if (p.imageEducation) {
                    p.imageEducationSrc = QINIU_HR_IMG_DOMAIN + p.id + "/" + p.imageEducation;
                }
                if (p.imageProfessional) {
                    p.imageProfessionalSrc = QINIU_HR_IMG_DOMAIN + p.id + "/" + p.imageProfessional;
                }
                if (p.profile) {
                    p.imageProfileSrc = QINIU_HR_IMG_DOMAIN + p.id + "/" + p.profile;
                }

                if (p.teachingAchievementList) {
                    //教学成果可以有多个。
                    angular.forEach(p.teachingAchievementList, function (q, index) {
                        if (q.achievementImg1 != null) {
                            q.img1Src = QINIU_HR_IMG_DOMAIN + p.id + "/" + q.achievementImg1;
                        }
                        if (q.achievementImg2 != null) {
                            q.img2Src = QINIU_HR_IMG_DOMAIN + p.id + "/" + q.achievementImg2;
                        }
                        if (q.achievementImg3 != null) {
                            q.img3Src = QINIU_HR_IMG_DOMAIN + p.id + "/" + q.achievementImg3;
                        }
                    })
                }
            })
        }

        /**
         * 上传图片
         * @param imageName 图片名称名称
         * @param f		图片
         * @param hrTalent	主要是为了获取人才id
         */
        function imageUpload(imageName, f, employee) {
            if (f == null)
                return;
            var r = new FileReader();
            r.onloadend = function (e) {
                var data = e.target.result;
                var uploadFileDir = "HR-IMG" + employee.id + "/";
                TalentService.uploadImageToUrl(data, imageName, uploadFileDir);
            }
            r.readAsDataURL(f);
        }

        /**
         * 获取认证证件类型
         */
        function getIdentityType() {
            var promise = TalentService.getIdentityType();
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    $scope.identityTypes = response.data;
                }
            }, function (error) {
                SweetAlert.swal("获取证件类型失败", "请重试", "error");
            });
        }
        /**
         * 获取年级段信息
         */
        function getGrade() {
            var promise = TalentService.getGrade();
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    $scope.grades = response.data;
                }
            }, function (error) {
                SweetAlert.swal("获取年级段失败", "请重试", "error");
            });
        }

        /**
         * 添加工作经历
         */
        function addWorkHistory() {
            if ($scope.employee.workingExperienceList == undefined || $scope.employee.workingExperienceList == 0 ||
                $scope.employee.workingExperienceList[0].company != undefined) {
                var obj = new Object();
                if ($scope.employee.workingExperienceList == undefined) {
                    $scope.employee.workingExperienceList = [];
                }
                $scope.employee.workingExperienceList.unshift(obj);
            }
        }

        /**
         * 获取所有字典数据
         */
        function getAllDictData() {
            var promise = EmployeeService.getAllDictData();
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    $scope.dictData = response.data;
                }
            }, function (error) {
                SweetAlert.swal("获取字典数据失败", "请重试", "error");
            });
        }

        function getDictionary() {
            var promise = DictionaryService.list();
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    $scope.dictionary = response.data;
                }
            }, function (error) {
            });
        }
        /**
         * Get ResidenceType
         * @param type
         */
        function getResidenceType() {
            calc();
        }

        /**
         * Get employee level
         */
        function getEmploymentLevel() {
            calc();
        }

        /**
         * Calculate housing foud and social security.
         */
        function calc() {
            var base = 0;
            if ($scope.employee.employmentLevel == null || $scope.employee.employmentLevel == ""
                || $scope.employee.employmentLevel == 1) {
                //将社保和公积金置为0
                $scope.employee.socialSecurityStatus = null;
                $scope.employee.housingFundStatus = null;
                $scope.employee.socialSecurityBase = 0;
                $scope.employee.housingFundBase = 0;
                $scope.employee.socialSecurityEmployerAmount = 0;
                $scope.employee.socialSecuritySelfAmount = 0;
                $scope.employee.housingFundEmployerAmount = 0;
                $scope.employee.housingFundSelfAmount = 0;
            }
            else {
                switch ($scope.employee.employmentLevel) {
                    case 2:
                    case 3:
                    case 4:
                        base = 2585;
                        break;
                    case 5:
                    case 6:
                        base = 2800;
                        break;
                    case 7:
                    case 8:
                    case 9:
                        base = 4000;
                        break;
                    case 10:
                        base = 6000;
                        break;
                    default:
                        break;
                }
                var defauleBase = base > 3878 ? base : 3878;
                $scope.employee.socialSecurityBase = base;
                $scope.employee.socialSecurityEmployerAmount =
                    base * $scope.dictionary.pensionRateCompany +
                    base * $scope.dictionary.unemploymentRateCompany +
                    defauleBase * $scope.dictionary.medicalRateCompany +
                    defauleBase * $scope.dictionary.maternityRateCompany +
                    defauleBase * $scope.dictionary.injuryRateCompany;

                $scope.employee.socialSecuritySelfAmount =
                    base * $scope.dictionary.pensionRatePersonal +
                    defauleBase * $scope.dictionary.medicalRatePersonal + 3 +
                    defauleBase * $scope.dictionary.maternityRatePersonal +
                    defauleBase * $scope.dictionary.injuryRatePersonal;
                //城镇户口，个人还需缴纳失业保险
                if ($scope.employee.registeredResidenceType == 1 || $scope.employee.registeredResidenceType == 3) {
                    $scope.employee.socialSecuritySelfAmount +=
                        base * $scope.dictionary.unemploymentRatePersonal;
                }
                $scope.employee.socialSecurityEmployerAmount = toDecimal($scope.employee.socialSecurityEmployerAmount);
                $scope.employee.socialSecuritySelfAmount = toDecimal($scope.employee.socialSecuritySelfAmount);
                //公积金部分
                $scope.employee.housingFundBase = 1954;
                $scope.employee.housingFundEmployerAmount = $scope.employee.housingFundBase * 0.12;
                $scope.employee.housingFundSelfAmount = $scope.employee.housingFundBase * 0.12;
                $scope.employee.housingFundEmployerAmount = toDecimal2($scope.employee.housingFundEmployerAmount);
                $scope.employee.housingFundSelfAmount = toDecimal2($scope.employee.housingFundEmployerAmount);
            }
        }

        /**
         * 四舍五入 取整
         * @param x
         * @returns {number}
         */
        function toDecimal2(x) {
            return Math.round(x)
        }

        /**
         * 四舍五入强制保留2位小数
         * @param x the var to be patterned
         * @returns {string}
         */
        function toDecimal(x) {
            var f = parseFloat(x);
            if (isNaN(f)) {
                return;
            }
            f = Math.round(x * 100) / 100;
            return f;
        }

        /**
         * Gets all departments for the current user's organization and render as a tree.
         */
        function getAllDepartments() {
            var promise = DepartmentService.list(AuthenticationService.currentUser().organization.id);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    $scope.departments = response.data;
                    if (response.data && response.data.length == 1 && response.data[0].isSchool == 1) {
                        if (!$scope.employee) {
                            $scope.employee = {};
                        }
                        $scope.employee.department = response.data[0];
                        $scope.getPositions(response.data[0].id);
                    }

                }
            }, function (error) {
            });
        }

        /**
         * Gets all positions for the given department.
         * @param departmentId the department id
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
         * Shows the add employee view.
         */
        function showAddView() {
            $scope.groupTeacher = [];
            $scope.employee = {
                salaryStandardList: []
            };
            /*       $scope.isAdding = true;*/
            if ($scope.departments && $scope.departments.length == 1 && $scope.departments[0].isSchool == 1) {
                //$scope.employee={};
                $scope.employee.department = $scope.departments[0];
                $scope.getPositions($scope.departments[0].id);
            }

            angular.forEach($scope.characteristics, function (p, index) {
                p.selected = false;
            })
            $scope.addTabs = [
                { id: 1, title: '基本信息', flag: 'true', template: 'partials/hr/employee/basic-info.html' + dateStrop },
                { id: 2, title: '职位信息', flag: 'true', template: 'partials/hr/employee/position-info.html' + dateStrop },
                //                {id:3,title:'薪资信息',flag:'true', template: 'partials/hr/employee/salary-info.html'+dateStrop},
                { id: 3, title: '工作经历', flag: 'false', template: 'partials/hr/employee/work-history.html' + dateStrop },
                { id: 4, title: '认证相关', flag: 'false', template: 'partials/hr/employee/confirm.html' + dateStrop },
                { id: 5, title: '其他', flag: 'false', template: 'partials/hr/employee/other.html' + dateStrop }
            ];
            $scope.addModalTitle = '添加员工(绿色字体为添加老师信息时必要填的信息)';
            $scope.addModal = $modal({ scope: $scope, templateUrl: 'partials/hr/employee/modal.employee.add.html' + dateStrop, show: true, backdrop: 'static' });
            EmployeeService.getTeachingGrade().then(function (response) {
                if (response.status = "SUCCESS") {
                    $scope.gradeList = response.data;
                }
            })

        }

        /**
         * Shows the job and quit employee view
         */
        function showEmployeeView() {
            $scope.isShow = true;
            /*$scope.employeeTabs = [
                //{id:0,title:'待入职', template: 'partials/hr/employee/serving-officer.html'+dateStrop},
                {id:1,title:'在职', template: 'partials/hr/employee/serving-officer.html'+dateStrop},
                {id:2,title:'离职', template: 'partials/hr/employee/resigning-employee.html'+dateStrop},
                {id:3,title:'待入职', template: 'partials/hr/employee/be-recruited-employee.html'+dateStrop}
            ];*/
        }

        /**
         * Hides the add view.
         */
        function hideAddView() {
            $scope.addModal.hide();
            //$scope.employee={};
        }

        /**
         * Hides the edit view.
         */
        function hideEditView() {
            if ($scope.editModal) {
                $scope.editModal.hide();
            }

            $scope.employee = {};

        }

        /**
         * Saves the current employee.
         */
        function saveEmployee() {





            if ($scope.employee.position && $scope.employee.position.id == 35 && !$scope.employee.subject) {
                SweetAlert.swal('教师岗位必须填写科目信息', '请重试', 'error');
                return false;
            }

            if ($scope.employee.profile && $scope.employee.profile.name) {
                if (!/\.(jpg|jpeg|png|JEPG|JPG|PNG)$/.test($scope.employee.profile.name)) {
                    SweetAlert.swal('教师头像文件类型必须是jpeg,jpg,png中的一种', '请重试', 'error');
                    return false;
                }
            }
            if ($scope.subjects.id) {
                $scope.subjects.id = null;
            }
            if ($scope.employee.subject == "") {
                $scope.employee.subject = null;
            }
            var reg_num = /^\d+(\.\d+)?$/;

            if ($scope.employee.salaryStandardList && $scope.employee.position.id == 35 && $scope.employee.partFull == 1) {
                $scope.employee.salaryStandard = JSON.stringify($scope.employee.salaryStandardList);
                if ($scope.employee.salaryStandardList.length == 0 || !$scope.employee.salaryStandardList) {
                    SweetAlert.swal('请添加薪资标准');
                    return false;
                }
                if ($scope.employee.partFull == 1 && $scope.employee.position.id == 35 && $scope.employee.salaryStandardList.length > 0) {
                    for (var j = 0; j < $scope.employee.salaryStandardList.length; j++) {
                        if (!$scope.employee.salaryStandardList[j].gradeId && $scope.employee.salaryStandardList[j].gradeId != 0) {
                            SweetAlert.swal('请选择年级');
                            return false;
                        } else if (!$scope.employee.salaryStandardList[j].unitPrice && $scope.employee.salaryStandardList[j].unitPrice != 0 || !reg_num.test($scope.employee.salaryStandardList[j].unitPrice)) {
                            SweetAlert.swal('请填写单价,且单价只能为数字');
                            return false;
                        }

                    }
                    delete $scope.employee.salaryStandardList;
                }
            }

            if ($scope.employee.gradeCourseFeeList) {
                var legal = true;
                angular.forEach($scope.employee.gradeCourseFeeList, function (p, index) {
                    if (p.courseFee && !$rootScope.reg_decimal.test(p.courseFee) && p.courseFee.length > 10) {
                        SweetAlert.swal('课时费只能是小于100000的数字，且至多2位小数', '请重试', 'error');
                        legal = false;
                        return;
                    }
                });
                if (legal == false) {
                    return false;
                }
            }
            if ($scope.employee.workingExperienceList) {
                var legal = true;
                angular.forEach($scope.employee.workingExperienceList, function (p, index) {
                    if (!p.company || p.company.length > 10) {
                        SweetAlert.swal('工作经历中的公司名不能为空，且长度不超过10个字', '请重试', 'error');
                        legal = false;
                        return;
                    }
                    else if (!p.description || p.description.length > 140) {
                        SweetAlert.swal('工作经历中的工作描述不能为空，且长度不超过140个字', '请重试', 'error');
                        legal = false;
                        return;
                    }
                    else if (p.salary && !reg_num.test(p.salary)) {
                        SweetAlert.swal('工作经历中的工资只能为数字', '请重试', 'error');
                        legal = false;
                        return;
                    }
                    else if (!p.entrance_date) {
                        SweetAlert.swal('工作经历中的入职时间不能为空', '请重试', 'error');
                        legal = false;
                        return;
                    }
                    else if (p.up_to_now) {
                        p.departure_date = undefined;
                    }
                    else if (p.departure_date) {
                        var date1 = new Date(p.entrance_date);
                        var date2 = new Date(p.departure_date);
                        if (date1 > date2) {
                            SweetAlert.swal('工作经历中的入职时间不能比离职时间晚', '请重试', 'error');
                            legal = false;
                            return;
                        }
                    }
                });
                if (legal == false) {
                    return false;
                }
            }
            //教学成果验证
            if ($scope.employee.teachingAchievementList) {
                var legal = true;
                angular.forEach($scope.employee.teachingAchievementList, function (p, index) {
                    if (!p.name || p.name.length > 10) {
                        SweetAlert.swal('教学成果标题不能为空，且字数不能超过10个', '请重试', 'error');
                        legal = false;
                        return;
                    }
                    else if (!p.description || p.description.length > 140) {
                        SweetAlert.swal('教学成果描述不能为空，且字数不能超过140个', '请重试', 'error');
                        legal = false;
                        return;
                    }
                    else if (!p.achievementImg1 && !p.achievementImg2 && !p.achievementImg3) {
                        SweetAlert.swal('教学成果图片至少选择一张', '请重试', 'error');
                        legal = false;
                        return;
                    }
                });
                if (legal == false) {
                    return false;
                }
            }
            if ($scope.employee.signature && $scope.employee.signature.length > 20) {
                SweetAlert.swal('个性签名不能超过20个字', '请重试', 'error');
                return false;
            }
            var reg_CN = /^[\u4e00-\u9fa5]{2,30}$/;
            var reg_EN = /^[a-zA-Z\/ ]{2,30}$/;
            var reg_int = /^\d+$/;　　//正整数
            var reg_num = /^\d+(\.\d+)?$/;

            if (!$scope.employee.user || $scope.employee.user.name == "" || $scope.employee.user.name == null) {
                SweetAlert.swal('员工姓名不能为空', '请重试', 'error');
                return false;
            }
            else if (!reg_CN.test($scope.employee.user.name) && !reg_EN.test($scope.employee.user.name)) {
                SweetAlert.swal('员工姓名必须为中文或者字母,长度30以内', '请重试', 'error');
                return false;
            }
            //else if($scope.employee.user.email == "" || $scope.employee.user.email == null){
            //    SweetAlert.swal('请确认邮箱信息正确', '请重试', 'error');
            //    return false;
            //}

            else if ($scope.employee.mobile == "" || $scope.employee.mobile == null) {
                SweetAlert.swal('手机号不能为空', '请重试', 'error');
                return false;
            }
            else if (!$scope.employee.department || $scope.employee.department.name == "" || $scope.employee.department.name == null) {
                SweetAlert.swal('员工部门/校区不能为空', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.position == "" || $scope.employee.position == null) {
                SweetAlert.swal('员工岗位不能为空', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.partFull == "" || $scope.employee.partFull == null) {
                SweetAlert.swal('员工兼职/全职信息不能为空', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.characteristics != null && $scope.employee.characteristics.length > 5) {
                SweetAlert.swal("教学特点不能超过5个！");
                return false;
            }
            else if (($scope.employee.teachingYears && !reg_int.test($scope.employee.teachingYears)) || $scope.employee.teachingYears > 1000) {
                SweetAlert.swal('教龄字段必须为数字，且必须是小于1000的正整数', '请重试', 'error');
                return false;
            }
            else if (($scope.employee.age && !reg_int.test($scope.employee.age)) || $scope.employee.age > 1000) {
                SweetAlert.swal('年龄字段必须为数字，且必须是小于1000的正整数', '请重试', 'error');
                return false;
            }
            else if (($scope.employee.workingYears && !reg_int.test($scope.employee.workingYears)) || $scope.employee.workingYears > 1000) {
                SweetAlert.swal('司龄字段必须为数字，且必须是小于1000的正整数', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.trialBasicSalary && !reg_num.test($scope.employee.trialBasicSalary)) {
                SweetAlert.swal('试用期底薪必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.basicSalary && !reg_num.test($scope.employee.basicSalary)) {
                SweetAlert.swal('转正后底薪必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.trailPerformance && !reg_num.test($scope.employee.trailPerformance)) {
                SweetAlert.swal('试用期绩效必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.performance && !reg_num.test($scope.employee.performance)) {
                SweetAlert.swal('转正后绩效必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.socialSecurityBase && !reg_num.test($scope.employee.socialSecurityBase)) {
                SweetAlert.swal('社保基数必须是数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.socialSecuritySelfAmount && !reg_num.test($scope.employee.socialSecuritySelfAmount)) {
                SweetAlert.swal('社保个人缴纳金额必须是数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.socialSecurityEmployerAmount && !reg_num.test($scope.employee.socialSecurityEmployerAmount)) {
                SweetAlert.swal('社保公司承担金额必须是数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.housingFundBase && !reg_num.test($scope.employee.housingFundBase)) {
                SweetAlert.swal('公积金基数必须是数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.housingFundSelfAmount && !reg_num.test($scope.employee.housingFundSelfAmount)) {
                SweetAlert.swal('公积金个人承担金额必须是数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.housingFundEmployerAmount && !reg_num.test($scope.employee.housingFundEmployerAmount)) {
                SweetAlert.swal('公积金公司承担金额必须是数字', '请重试', 'error');
                return false;
            }

            else if ($scope.employee.internshipBasicSalary && !reg_num.test($scope.employee.internshipBasicSalary)) {
                SweetAlert.swal('实习期底薪必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.internshipPerformance && !reg_num.test($scope.employee.internshipPerformance)) {
                SweetAlert.swal('实习期绩效必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.internshipBasicSalaryFloat && !reg_num.test($scope.employee.internshipBasicSalaryFloat)) {
                SweetAlert.swal('实习期浮动底薪必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.trailBasicSalaryFloat && !reg_num.test($scope.employee.trailBasicSalaryFloat)) {
                SweetAlert.swal('试用期浮动底薪必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.basicSalaryFloat && !reg_num.test($scope.employee.basicSalaryFloat)) {
                SweetAlert.swal('转正后浮动底薪必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.internshipClassHourDuty && !reg_num.test($scope.employee.internshipClassHourDuty)) {
                SweetAlert.swal('实习期义务课时必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.trailClassHourDuty && !reg_num.test($scope.employee.trailClassHourDuty)) {
                SweetAlert.swal('试用期义务课时必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.classHourDuty && !reg_num.test($scope.employee.classHourDuty)) {
                SweetAlert.swal('转正后义务课时必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.internshipOtherSalary && !reg_num.test($scope.employee.internshipOtherSalary)) {
                SweetAlert.swal('实习期其他薪资必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.trailOtherSalary && !reg_num.test($scope.employee.trailOtherSalary)) {
                SweetAlert.swal('试用期其他薪资必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.otherSalary && !reg_num.test($scope.employee.otherSalary)) {
                SweetAlert.swal('转正后其他薪资必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.contractPeriod && !reg_num.test($scope.employee.contractPeriod)) {
                SweetAlert.swal('合同期限必须为数字', '请重试', 'error');
                return false;
            } else if ($scope.employee.partFull == 2 && (!$scope.employee.salary || !reg_num.test($scope.employee.salary))) {
                SweetAlert.swal('转正后薪资不能为空，且必须为数字', '请重试', 'error');
                return false;
            } else if ($scope.employee.hiringDate == "" || $scope.employee.hiringDate == null) {
                SweetAlert.swal('入职日期不能为空', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.isSubjectLeader == true && (!$scope.groupTeacher || $scope.groupTeacher.length == 0)) {
                SweetAlert.swal('组内教师不能为空', '请重试', 'error');
                return false;
            }
            //else if($scope.employee.employer == "" || $scope.employee.employer == null){
            //    SweetAlert.swal('合同签署单位不能为空', '请重试', 'error');
            //    return false;
            //}
            //else if($scope.employee.contractType == "" || $scope.employee.contractType == null){
            //    SweetAlert.swal('合同类型不能为空', '请重试', 'error');
            //    return false;
            //}
            else {
                checkMobile(-1);
            }
        }

        /**
         * 修改员工时，如果勾选了离职，则弹框填写离职原因
         * @param status
         */
        function inputResignationReason(status) {


            if ($scope.employee.position && $scope.employee.position.id == 35 && !$scope.employee.subject) {
                SweetAlert.swal('教师岗位必须填写科目信息', '请重试', 'error');
                return false;
            }
            if ($scope.employee.profile && $scope.employee.profile.name) {
                if (!/\.(jpg|jpeg|png|JEPG|JPG|PNG)$/.test($scope.employee.profile.name)) {
                    SweetAlert.swal('教师头像文件类型必须是jpeg,jpg,png中的一种', '请重试', 'error');
                    return false;
                }
            }
            var reg_num = /^\d+(\.\d+)?$/;
            var reg_int = /^\d+$/;　　//正整数
            if ($scope.employee.position.id == 35 && $scope.employee.partFull == 1) {
                if (!$scope.employee.salaryStandardList) {
                    SweetAlert.swal('请添加薪资标准');
                    return;
                } else {
                    $scope.employee.salaryStandard = JSON.stringify($scope.employee.salaryStandardList);
                    debugger;
                    if ($scope.employee.salaryStandardList.length == 0 || !$scope.employee.salaryStandardList) {
                        SweetAlert.swal('请添加薪资标准');
                        return false;
                    } else if ($scope.employee.partFull == 1 && $scope.employee.position.id == 35) {
                        for (var j = 0; j < $scope.employee.salaryStandardList.length; j++) {
                            if (!$scope.employee.salaryStandardList[j].gradeId && $scope.employee.salaryStandardList[j].gradeId != 0) {
                                SweetAlert.swal('请选择年级');
                                return false;
                            } else if ((!$scope.employee.salaryStandardList[j].unitPrice && $scope.employee.salaryStandardList[j].unitPrice != 0) || (!reg_num.test($scope.employee.salaryStandardList[j].unitPrice))) {
                                SweetAlert.swal('请填写单价,且单价只能为数字');
                                return false;
                            }
                        }
                        delete $scope.employee.salaryStandardList;
                    }
                }
            }


            if ($scope.employee.gradeCourseFeeList) {
                var legal = true;
                angular.forEach($scope.employee.gradeCourseFeeList, function (p, index) {
                    if (p.courseFee && !$rootScope.reg_decimal.test(p.courseFee)) {
                        SweetAlert.swal('课时费只能是小于100000的数字，且至多2位小数', '请重试', 'error');
                        legal = false;
                        return;
                    }
                });
                if (legal == false) {
                    return false;
                }
            }
            if ($scope.employee.workingExperienceList) {
                var legal = true;
                angular.forEach($scope.employee.workingExperienceList, function (p, index) {
                    if (!p.company || p.company.length > 10) {
                        SweetAlert.swal('工作经历中的公司名不能为空，且长度不超过10个字', '请重试', 'error');
                        legal = false;
                        return;
                    }
                    else if (!p.description || p.description.length > 140) {
                        SweetAlert.swal('工作经历中的工作描述不能为空，且长度不超过140个字', '请重试', 'error');
                        legal = false;
                        return;
                    }
                    else if (p.salary && !reg_num.test(p.salary)) {
                        SweetAlert.swal('工作经历中的工资只能为数字', '请重试', 'error');
                        legal = false;
                        return;
                    }
                    else if (!p.entrance_date) {
                        SweetAlert.swal('工作经历中的入职时间不能为空', '请重试', 'error');
                        legal = false;
                        return;
                    }
                    else if (p.up_to_now) {
                        p.departure_date = undefined;
                    }
                    else if (p.departure_date) {
                        var date1 = new Date(p.entrance_date);
                        var date2 = new Date(p.departure_date);
                        if (date1 > date2) {
                            SweetAlert.swal('工作经历中的入职时间不能比离职时间晚', '请重试', 'error');
                            legal = false;
                            return;
                        }
                    }
                });
                if (legal == false) {
                    return false;
                }
            }
            //教学成果验证
            if ($scope.employee.teachingAchievementList) {
                var legal = true;
                angular.forEach($scope.employee.teachingAchievementList, function (p, index) {
                    if (!p.name || p.name.length > 10) {
                        SweetAlert.swal('教学成果标题不能为空，且字数不能超过10个', '请重试', 'error');
                        legal = false;
                        return;
                    }
                    else if (!p.description || p.description.length > 140) {
                        SweetAlert.swal('教学成果描述不能为空，且字数不能超过140个', '请重试', 'error');
                        legal = false;
                        return;
                    }
                    else if (!p.achievementImg1 && !p.achievementImg2 && !p.achievementImg3) {
                        SweetAlert.swal('教学成果图片至少选择一张', '请重试', 'error');
                        legal = false;
                        return;
                    }
                });
                if (legal == false) {
                    return false;
                }
            }
            if ($scope.employee.signature && $scope.employee.signature.length > 20) {
                SweetAlert.swal('个性签名不能超过20个字', '请重试', 'error');
                return false;
            }
            var reg_CN = /^[\u4e00-\u9fa5]{2,30}$/;
            var reg_EN = /^[a-zA-Z\/ ]{2,30}$/;
            if ($scope.employee.user.name == "" || $scope.employee.user.name == null) {
                SweetAlert.swal('员工姓名不能为空', '请重试', 'error');
                return false;
            }
            else if (!reg_CN.test($scope.employee.user.name) && !reg_EN.test($scope.employee.user.name)) {
                SweetAlert.swal('员工姓名必须为中文或者字母,长度30以内', '请重试', 'error');
                return false;
            }
            //else if($scope.employee.user.email == "" || $scope.employee.user.email == null){
            //    SweetAlert.swal('请确认邮箱信息正确', '请重试', 'error');
            //    return false;
            //}
            //            else if($scope.employee.idNumber == "" || $scope.employee.idNumber == null){
            //                SweetAlert.swal('身份证号不能为空', '请重试', 'error');
            //                return false;
            //            }
            else if ($scope.employee.mobile == "" || $scope.employee.mobile == null) {
                SweetAlert.swal('手机号不能为空', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.department.name == "" || $scope.employee.department.name == null) {
                SweetAlert.swal('员工部门/校区不能为空', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.position == "" || $scope.employee.position == null) {
                SweetAlert.swal('员工岗位不能为空', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.partFull == "" || $scope.employee.partFull == null) {
                SweetAlert.swal('员工兼职/全职信息不能为空', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.characteristics != null && $scope.employee.characteristics.length > 5) {
                SweetAlert.swal("教学特点不能超过5个！");
                return false;
            }
            else if (($scope.employee.teachingYears && !reg_int.test($scope.employee.teachingYears)) || $scope.employee.teachingYears > 1000) {
                SweetAlert.swal('教龄字段必须为数字，且必须是小于1000的正整数', '请重试', 'error');
                return false;
            }
            else if (($scope.employee.age && !reg_int.test($scope.employee.age)) || $scope.employee.age > 1000) {
                SweetAlert.swal('年龄字段必须为数字，且必须是小于1000的正整数', '请重试', 'error');
                return false;
            }
            else if (($scope.employee.workingYears && !reg_int.test($scope.employee.workingYears)) || $scope.employee.workingYears > 1000) {
                SweetAlert.swal('司龄字段必须为数字，且必须是小于1000的正整数', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.trialBasicSalary && !reg_num.test($scope.employee.trialBasicSalary)) {
                SweetAlert.swal('试用期底薪必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.basicSalary && !reg_num.test($scope.employee.basicSalary)) {
                SweetAlert.swal('转正后底薪必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.trailPerformance && !reg_num.test($scope.employee.trailPerformance)) {
                SweetAlert.swal('试用期绩效必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.performance && !reg_num.test($scope.employee.performance)) {
                SweetAlert.swal('转正后绩效必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.socialSecurityBase && !reg_num.test($scope.employee.socialSecurityBase)) {
                SweetAlert.swal('社保基数必须是数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.socialSecuritySelfAmount && !reg_num.test($scope.employee.socialSecuritySelfAmount)) {
                SweetAlert.swal('社保个人缴纳金额必须是数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.socialSecurityEmployerAmount && !reg_num.test($scope.employee.socialSecurityEmployerAmount)) {
                SweetAlert.swal('社保公司承担金额必须是数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.housingFundBase && !reg_num.test($scope.employee.housingFundBase)) {
                SweetAlert.swal('公积金基数必须是数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.housingFundSelfAmount && !reg_num.test($scope.employee.housingFundSelfAmount)) {
                SweetAlert.swal('公积金个人承担金额必须是数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.housingFundEmployerAmount && !reg_num.test($scope.employee.housingFundEmployerAmount)) {
                SweetAlert.swal('公积金公司承担金额必须是数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.internshipBasicSalary && !reg_num.test($scope.employee.internshipBasicSalary)) {
                SweetAlert.swal('实习期底薪必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.internshipPerformance && !reg_num.test($scope.employee.internshipPerformance)) {
                SweetAlert.swal('实习期绩效必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.internshipBasicSalaryFloat && !reg_num.test($scope.employee.internshipBasicSalaryFloat)) {
                SweetAlert.swal('实习期浮动底薪必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.trailBasicSalaryFloat && !reg_num.test($scope.employee.trailBasicSalaryFloat)) {
                SweetAlert.swal('试用期浮动底薪必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.basicSalaryFloat && !reg_num.test($scope.employee.basicSalaryFloat)) {
                SweetAlert.swal('转正后浮动底薪必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.internshipClassHourDuty && !reg_num.test($scope.employee.internshipClassHourDuty)) {
                SweetAlert.swal('实习期义务课时必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.trailClassHourDuty && !reg_num.test($scope.employee.trailClassHourDuty)) {
                SweetAlert.swal('试用期义务课时必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.classHourDuty && !reg_num.test($scope.employee.classHourDuty)) {
                SweetAlert.swal('转正后义务课时必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.internshipOtherSalary && !reg_num.test($scope.employee.internshipOtherSalary)) {
                SweetAlert.swal('实习期其他薪资必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.trailOtherSalary && !reg_num.test($scope.employee.trailOtherSalary)) {
                SweetAlert.swal('试用期其他薪资必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.otherSalary && !reg_num.test($scope.employee.otherSalary)) {
                SweetAlert.swal('转正后其他薪资必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.contractPeriod && !reg_num.test($scope.employee.contractPeriod)) {
                SweetAlert.swal('合同期限必须为数字', '请重试', 'error');
                return false;
            }
            // else if(!$scope.employee.salary || !reg_num.test($scope.employee.salary)){
            //     SweetAlert.swal('转正后薪资不能为空，且必须为数字', '请重试', 'error');
            //     return false;
            // }
            else if ($scope.employee.partFull == 2 && (!$scope.employee.salary || !reg_num.test($scope.employee.salary))) {
                SweetAlert.swal('转正后薪资不能为空，且必须为数字', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.hiringDate == "" || $scope.employee.hiringDate == null) {
                SweetAlert.swal('入职日期不能为空', '请重试', 'error');
                return false;
            }
            else if ($scope.employee.isSubjectLeader == true && (!$scope.groupTeacher || $scope.groupTeacher.length == 0)) {
                SweetAlert.swal('组内教师不能为空', '请重试', 'error');
                return false;
            }
            //else if($scope.employee.employer == "" || $scope.employee.employer == null){
            //    SweetAlert.swal('合同签署单位不能为空', '请重试', 'error');
            //    return false;
            //}
            //else if($scope.employee.contractType == "" || $scope.employee.contractType == null){
            //    SweetAlert.swal('合同类型不能为空', '请重试', 'error');
            //    return false;
            //}
            if (status == 4) {
                updateEmployee(4);
            }
            else {
                updateEmployee(0);
            }
        }

        function saveReason() {
            if ($scope.resignation.resignationReason != null && $scope.resignation.resignationReason.length > 50) {
                SweetAlert.swal('原因描述不能超过50个字', '请重试', 'error');
                return false;
            }
            $scope.employee.resignationReason = $scope.resignation.resignationReason;
            $scope.employee.resignationReasonType = $scope.resignation.resignationReasonType;
            $scope.employee.resignationDate = $scope.resignation.resignationDate;
            $scope.reasonModal.hide();
            //保存完离职原因后，添加一条工作经历
            if ($scope.employee.workingExperienceList == undefined || $scope.employee.workingExperienceList == 0 ||
                $scope.employee.workingExperienceList[0].company != undefined) {
                var obj = new Object();
                if ($scope.employee.workingExperienceList == undefined) {
                    $scope.employee.workingExperienceList = [];
                }
                obj.company = "优胜教育";
                if ($scope.employee.position) {
                    obj.position = $scope.employee.position.name;
                }
                obj.entrance_date = $scope.employee.hiringDate;
                obj.departure_date = new Date();
                obj.description = "在优胜工作";
                $scope.employee.workingExperienceList.unshift(obj);
            }
            $scope.employee.isDeparture = true;
            // $scope.employee.resignationDate = new Date();
            $scope.departure();
        }
        $scope.getWorkingDate = function (date) {

            if (date == null || new Date(date) > new Date()) {
                return "尚未入职";
            }
            var days = (new Date().getTime() - new Date(date).getTime()) / 24 / 60 / 60 / 1000;
            return parseInt(days / 365) + "年" + parseInt(days % 365 / 30) + "月" + parseInt(days % 30) + "天";
        };


        $scope.departure = function () {
            if ($scope.employee.workingExperienceList) {
                angular.forEach($scope.employee.workingExperienceList, function (p, index) {
                    if (p.departure_date) {
                        p.departure_date = new Date(p.departure_date);
                    }
                    if (p.entrance_date) {
                        p.entrance_date = new Date(p.entrance_date);
                    }
                });
            }
            $scope.employee.employmentStatus = 0;
            $scope.employee.resignationBy = $rootScope.currentUser.id;
            var promise = EmployeeService.update($scope.employee);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    response.data.employmentStatus = 1;
                    var promise1 = EmployeeService.remove(response.data);
                    promise1.then(function (response) {
                        if (response.status == "FAILURE") {
                            SweetAlert.swal(response.data, "请重试", "error");
                            return false;
                        }
                        else {
                            $scope.employee = {};
                            SweetAlert.swal("离职成功", "success");
                            getEmployeesByFilters(0);
                            getEmployeesByFilters(1);
                        }

                    }, function (error) {
                    });
                }
            });
        }

        /**
         * Update the selected employee's information.
         * @returns {boolean}
         */
        function updateEmployee(status) {

            if ($scope.employee.position && $scope.employee.position.id == 35 && !$scope.employee.subject) {
                SweetAlert.swal('教师岗位必须填写科目信息', '请重试', 'error');
                return false;
            }
            /*if($scope.employee.employmentType = null){
             $scope.employee.employmentType = undefined;
             }*/
            if ($scope.employee.workingExperienceList) {
                angular.forEach($scope.employee.workingExperienceList, function (p, index) {
                    if (p.departure_date) {
                        p.departure_date = new Date(p.departure_date);
                    }
                    if (p.entrance_date) {
                        p.entrance_date = new Date(p.entrance_date);
                    }
                });
            }
            //身份证
            var imgIdentity = document.getElementById("identity").files[0];
            if (imgIdentity != null) {
                $scope.employee.imageIdentity = imgIdentity.name;
            }
            //教师资格证
            var imgTeacher = document.getElementById("teacher").files[0];
            if (imgTeacher != null) {
                $scope.employee.imageTeacher = imgTeacher.name;
            }
            //学历认证
            var imgEducation = document.getElementById("education").files[0];
            if (imgEducation != null) {
                $scope.employee.imageEducation = imgEducation.name;
            }
            //专业资格证
            var imgProfessional = document.getElementById("professional").files[0];
            if (imgProfessional != null) {
                $scope.employee.imageProfessional = imgProfessional.name;
            }
            //头像
            var imgProfile = document.getElementById("profile").files[0];
            if (imgProfile != null) {
                //var fname = $scope.GetFileNameNoExt(imgProfile.name);
                var fname = encodeURI(imgProfile.name);
                //fname = fname + $scope.getFileExt(imgProfile.name);
                $scope.employee.profile = fname;
            }
            imageUpload($scope.employee.imageIdentity, imgIdentity, $scope.employee);//身份证
            imageUpload($scope.employee.imageTeacher, imgTeacher, $scope.employee);//教师证
            imageUpload($scope.employee.imageEducation, imgEducation, $scope.employee);//学位证
            imageUpload($scope.employee.imageProfessional, imgProfessional, $scope.employee);//专业资格证
            if (imgProfile) {
                imageUpload(imgProfile.name, imgProfile, $scope.employee);//头像
            }
            //imageUpload($scope.employee.profile, imgProfile, $scope.employee);//头像
            //在图片预览时候，已经将新增的图片封装在newImgList对象中了
            if ($scope.employee.teachingAchievementList != undefined) {
                angular.forEach($scope.employee.teachingAchievementList, function (q) {
                    if (q.img1 != null) {
                        imageUpload(q.img1.name, q.img1, $scope.employee);
                    }
                    if (q.img2 != null) {
                        imageUpload(q.img2.name, q.img2, $scope.employee);
                    }
                    if (q.img3 != null) {
                        imageUpload(q.img3.name, q.img3, $scope.employee);
                    }
                })
            }
            checkMobile(status);
        }

        /**
         * Get all serving employees.
         */
        function getServingEmployees(tableState) {
            //set the serving employee's search condition to default, then set the employeeStatus to 0
            $scope.gsTableState = tableState;
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            $scope.se.employmentStatus = 0;
            if ($scope.se.subject) {
                $scope.se.subject = $scope.se.subject.id;
            }
            var promise = EmployeeService.getEmployeesByFilters($scope.se, $scope.start, $scope.number);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    var result = {};
                    result.data = response.data.list;
                    result.numberOfPages = response.data.pages
                    $scope.employees = result.data;
                    dateFormat_yyyyMM($scope.employees);
                    $scope.generateImgPreviewSrc($scope.employees);
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                }
            }, function (error) {
            });
        }

        /**
         * Get all dimission employees.
         */
        function getDimissionEmployees(tableState) {
            //set the dimission employee's search condition to default, then set the employeeStatus to 1
            $scope.de.employmentStatus = 1;
            if ($scope.de.subject) {
                $scope.de.subject = $scope.de.subject.id;
            }
            $scope.gdTableState = tableState;
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            var promise = EmployeeService.getEmployeesByFilters($scope.de, $scope.start, $scope.number);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    var result = {};
                    result.data = response.data.list;
                    result.numberOfPages = response.data.pages
                    $scope.dimissionEmployees = result.data;
                    dateFormat_yyyyMM($scope.dimissionEmployees);
                    $scope.generateImgPreviewSrc($scope.dimissionEmployees);
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                }
            }, function (error) {
            });
        }

        /**
         * Get employee list by filter.
         * @param flag refer to 在职/离职
         */
        function getEmployeesByFilters(flag) {
            if (flag == 0) {
                $scope.se.employmentStatus = 0;
                $scope.se.department = angular.copy($scope.employee.department);
                $scope.temp = angular.copy($scope.se);
                $scope.sFilter = angular.copy($scope.se);
                if ($scope.se.subject) {
                    $scope.temp.subject = $scope.se.subject.id;
                }
                $scope.gsTableState.pagination.start = 0;
                $scope.pagination = $scope.gsTableState.pagination;
            }
            else if (flag == 1) {
                $scope.de.employmentStatus = 1;
                $scope.de.department = angular.copy($scope.employee.department);
                $scope.temp = angular.copy($scope.de);
                if ($scope.de.subject) {
                    $scope.temp.subject = $scope.de.subject.id;
                }
                $scope.gdTableState.pagination.start = 0;
                $scope.pagination = $scope.gdTableState.pagination;
            }
            else if (flag == 2) {
                $scope.tbre.employmentStatus = 2;
                $scope.tbre.department = angular.copy($scope.employee.department);
                $scope.temp = angular.copy($scope.tbre);
                if ($scope.tbre.subject) {
                    $scope.temp.subject = $scope.tbre.subject.id;
                }
                $scope.grTableState.pagination.start = 0;
                $scope.pagination = $scope.grTableState.pagination;
            }
            $scope.isLoading = true;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            var promise = EmployeeService.getEmployeesByFilters($scope.temp, $scope.start, $scope.number);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    var result = {};
                    result.data = response.data.list;
                    result.numberOfPages = response.data.pages
                    if (flag == 0) {
                        $scope.employees = result.data;
                        dateFormat_yyyyMM($scope.employees);//将工作经历中的时间转换为yyyy-MM格式
                        $scope.generateImgPreviewSrc($scope.employees);
                        $scope.gsTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.isLoading = false;
                    }
                    else if (flag == 1) {
                        $scope.dimissionEmployees = result.data;
                        dateFormat_yyyyMM($scope.dimissionEmployees);//将工作经历中的时间转换为yyyy-MM格式
                        $scope.generateImgPreviewSrc($scope.dimissionEmployees);
                        $scope.gdTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.isLoading = false;
                    }
                    else if (flag == 2) {
                        $scope.toBeRecruitedEmployees = result.data;
                        dateFormat_yyyyMM($scope.toBeRecruitedEmployees);//将工作经历中的时间转换为yyyy-MM格式
                        $scope.generateImgPreviewSrc($scope.toBeRecruitedEmployees);
                        angular.forEach($scope.toBeRecruitedEmployees, function (p, index) {
                            if (p.talentId) {
                                var talent = {};
                                talent.id = p.talentId;
                                var promise = TalentService.findByFilter(talent, 0, 1);
                                promise.then(function (response) {
                                    if (response.status == "FAILURE") {
                                        SweetAlert.swal(response.data, "请重试", "error");
                                    }
                                    else {
                                        var result = {};
                                        result.data = response.data.list;
                                        result.numberOfPages = response.data.pages;
                                        p.talent = result.data[0];
                                        dateFormat(p.talent);
                                        $scope.generateImgPreviewSrc2(p.talent);
                                    }
                                }, function (error) {
                                    SweetAlert.swal('获取待入职人才列表失败', '请重试', 'error');
                                });
                            }
                        });
                        $scope.grTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.isLoading = false;
                    }
                }
            }, function (error) {
            });
        }

        /**
         * Reset the search form.
         * @param flag the flag which refers to 在职/离职(0/1)
         */
        function reset(flag) {
            if (flag == 0) {
                $scope.se = {};
                $scope.se.user = {};
                $scope.se.department = {};
            }
            else if (flag == 1) {
                $scope.de = {};
                $scope.de.user = {};
                $scope.de.department = {};
            }
            else if (flag == 2) {
                $scope.tbre = {};
                $scope.tbre.user = {};
                $scope.tbre.department = {};
            }
            else if (flag == 3) {
                $scope.ade = {};
                $scope.ade.user = {};
                $scope.ade.department = {};
            }
            if ($scope.departments.length == 1 && $scope.departments[0].isSchool == 1) {
                $scope.employee.department = $scope.departments[0];
            }
            else {
                $scope.employee.department = {};
            }
        }

        /**
         * Shows select department dialog.
         */
        function showSelectDepartment() {
            $scope.modalTitle = '选择机构';
            $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/hr/department/modal.department.html' + dateStrop, show: true, backdrop: 'static' });
            //如果是校区或者大区人员，那么要限定部门，校区的部门限定
            $scope.modalDepartments = angular.copy($scope.departments);
        }

        /**
         * Triggered when department is selected.
         * @param node node
         */
        function selectDepartment(node) {
            $scope.newDepartment = findSelectedDepartment($scope.departments, node.id);
        }

        /**
         * When show the edit view or detail view , this function will show the positions in the given department.
         */
        function deptToPos() {
            if ($scope.employee.department) {
                $scope.getPositions($scope.employee.department.id);
            }
        }

        /**
         * Triggered when department is selected.
         */
        function departmentSelected() {
            $scope.employee.department = $scope.newDepartment;
            $scope.newChange.departmentAfter = $scope.newDepartment;
            $scope.getPositions($scope.newDepartment.id);
            $scope.modal.hide();
        }

        /**
         * Recursively find the department with the given id.
         * @param departments the departments to start with
         * @param id the id of department to find
         * @return the department, or false if not found
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
         * Edit the selected employee information.
         * @param employee
         */
        function showEditView(employee) {
            EmployeeService.getTeachingGrade().then(function (response) {
                if (response.status = "SUCCESS") {
                    $scope.gradeList = response.data;
                }
            })
            $scope.salaryStandard = {};
            $scope.employee = angular.copy(employee);
            console.log(employee);

            if ($scope.employee.partFull == 1 && $scope.employee.position.id == 35) {
                $scope.employee.salaryStandardList = [];
                if ($scope.employee.salaryStandard && $scope.employee.salaryStandard.constructor == String) {
                    $scope.employee.salaryStandardList = JSON.parse($scope.employee.salaryStandard)
                }
            }

            $scope.isAddChange = false;
            $scope.groupTeacher = angular.copy(employee.groupTeacher);
            deptToPos();
            //每次要打开编辑界面时，都要判断一下之前配置的教学特点
            $scope.toggleCharacteristic();
            //确定一下市和县列表选项
            if ($scope.employee.provinceCode != undefined) {
                var promise = DepartmentService.getCityByProvince($scope.employee.provinceCode);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                        return false;
                    }
                    else {
                        $scope.cities = response.data;
                    }
                }, function (error) {
                });
            }
            if ($scope.employee.cityCode != undefined) {
                var promise = DepartmentService.getAreaByCity($scope.employee.cityCode);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                        return false;
                    }
                    else {
                        $scope.areas = response.data;
                    }
                }, function (error) {
                });
            }
            /*$scope.editTabs = [
               /!* {id:1,title:'基本信息', template: 'partials/hr/employee/basic-info.html'+dateStrop},
                {id:2,title:'职位信息', template: 'partials/hr/employee/position-info-edit.html'+dateStrop},
                {id:3,title:'薪资信息', template: 'partials/hr/employee/salary-info-edit.html'+dateStrop},
                {id:4,title:'工作经历', template: 'partials/hr/employee/work-history.html'+dateStrop},
                {id:5,title:'异动信息', template: 'partials/hr/employee/person-change.html'+dateStrop},
                {id:6,title:'认证相关', template: 'partials/hr/employee/confirm.html'+dateStrop},
                {id:7,title:'其他', template: 'partials/hr/employee/other.html'+dateStrop}*!/
                {id:1,title:'基本信息',flag:'true', template: 'partials/hr/employee/basic-info.html'+dateStrop},
                {id:2,title:'职位信息',flag:'true', template: 'partials/hr/employee/position-info.html'+dateStrop},
                {id:3,title:'薪资信息',flag:'true', template: 'partials/hr/employee/salary-info.html'+dateStrop},
                {id:4,title:'工作经历',flag:'false', template: 'partials/hr/employee/work-history.html'+dateStrop},
                {id:5,title:'认证相关',flag:'false', template: 'partials/hr/employee/confirm.html'+dateStrop},
                {id:6,title:'其他',flag:'false', template: 'partials/hr/employee/other.html'+dateStrop}
            ];*/
            $scope.changePart();
            $scope.editModalTitle = '修改员工详细信息(绿色字体为添加老师信息时必要填的信息)';
            $scope.editModal = $modal({ scope: $scope, templateUrl: 'partials/hr/employee/modal.employee.edit.html' + dateStrop, show: true, backdrop: 'static' });
        }
        var dateStrop = '?v=' + new Date().getTime()
        $scope.changePart = function () {
            if ($scope.employee.partFull == 2) {
                var _aay = [
                    { id: 1, flag: 'true', title: '基本信息', template: 'partials/hr/employee/basic-info.html' + dateStrop },
                    { id: 2, flag: 'true', title: '职位信息', template: 'partials/hr/employee/position-info.html' + dateStrop },
                    //                    {id:3, flag:'false',title:'薪资信息', template: 'partials/hr/employee/salary-info.html'+dateStrop},
                    { id: 3, flag: 'false', title: '工作经历', template: 'partials/hr/employee/work-history.html' + dateStrop },
                    { id: 4, flag: 'false', title: '认证相关', template: 'partials/hr/employee/confirm.html' + dateStrop },
                    { id: 5, flag: 'false', title: '其他', template: 'partials/hr/employee/other.html' + dateStrop }

                    /*  {id:1,title:'基本信息', template: 'partials/hr/employee/basic-info.html'+dateStrop},
                      {id:2,title:'职位信息', template: 'partials/hr/employee/position-info.html'+dateStrop},
                      {id:3,title:'薪资信息', template: 'partials/hr/employee/salary-info.html'+dateStrop},
                      {id:4,title:'工作经历', template: 'partials/hr/employee/work-history.html'+dateStrop},
                      {id:5,title:'认证相关', template: 'partials/hr/employee/confirm.html'+dateStrop},
                      {id:6,title:'其他', template: 'partials/hr/employee/other.html'+dateStrop}*/


                ];
                var _aay2 = [
                    { id: 1, flag: 'true', title: '基本信息', template: 'partials/hr/employee/basic-info.html' + dateStrop },
                    { id: 2, flag: 'true', title: '职位信息', template: 'partials/hr/employee/position-info-edit.html' + dateStrop },
                    //                    {id:3, flag:'false',title:'薪资信息', template: 'partials/hr/employee/salary-info-edit.html'+dateStrop},
                    { id: 3, flag: 'false', title: '工作经历', template: 'partials/hr/employee/work-history.html' + dateStrop },
                    { id: 4, flag: 'false', title: '异动信息', template: 'partials/hr/employee/person-change.html' + dateStrop },
                    { id: 5, flag: 'false', title: '认证相关', template: 'partials/hr/employee/confirm.html' + dateStrop },
                    { id: 6, flag: 'false', title: '其他', template: 'partials/hr/employee/other.html' + dateStrop }

                ];
                $scope.editTabs = _aay2;
                $scope.addTabs = _aay;
            } else {
                var _aay = [
                    { id: 1, flag: 'true', title: '基本信息', template: 'partials/hr/employee/basic-info.html' + dateStrop },
                    { id: 2, flag: 'true', title: '职位信息', template: 'partials/hr/employee/position-info.html' + dateStrop },
                    //                    {id:3,flag:'false',title:'薪资信息', template: 'partials/hr/employee/salary-info.html'+dateStrop},
                    { id: 3, flag: 'false', title: '工作经历', template: 'partials/hr/employee/work-history.html' + dateStrop },
                    { id: 4, flag: 'false', title: '认证相关', template: 'partials/hr/employee/confirm.html' + dateStrop },
                    { id: 5, flag: 'false', title: '其他', template: 'partials/hr/employee/other.html' + dateStrop }

                ];
                var _aay2 = [
                    { id: 1, flag: 'true', title: '基本信息', template: 'partials/hr/employee/basic-info.html' + dateStrop },
                    { id: 2, flag: 'true', title: '职位信息', template: 'partials/hr/employee/position-info-edit.html' + dateStrop },
                    //                    {id:3,flag:'false',title:'薪资信息', template: 'partials/hr/employee/salary-info-edit.html'+dateStrop},
                    { id: 3, flag: 'false', title: '工作经历', template: 'partials/hr/employee/work-history.html' + dateStrop },
                    { id: 4, flag: 'false', title: '异动信息', template: 'partials/hr/employee/person-change.html' + dateStrop },
                    { id: 5, flag: 'false', title: '认证相关', template: 'partials/hr/employee/confirm.html' + dateStrop },
                    { id: 6, flag: 'false', title: '其他', template: 'partials/hr/employee/other.html' + dateStrop }

                ];
                $scope.editTabs = _aay2;
                $scope.addTabs = _aay;
            }

        };

        /**
         * 修改员工时才会去加载异动列表
         */
        $scope.getEmployeeChanges = function (tableState) {
            $scope.ecTableState = tableState;
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            var filter = {};
            filter.employeeId = $scope.employee.id;
            var promise = EmployeeService.getEmployeeChanges(filter, $scope.start, $scope.number);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    var data = {};
                    data.data = response.data.list;
                    data.numberOfPages = response.data.pages
                    $scope.employee.changes = data.data;
                    tableState.pagination.numberOfPages = data.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                }
            });
        }

        /**
         * 为员工新增异动
         */
        $scope.addPersonalChange = function (employee) {
            //带入异动前信息
            $scope.employee = employee;
            $scope.newChange.departmentBefore = angular.copy($scope.employee.department);
            $scope.newChange.positionBefore = angular.copy($scope.employee.position);
            $scope.newChange.basicSalaryBefore = angular.copy($scope.employee.basicSalary);
            $scope.newChange.performanceBefore = angular.copy($scope.employee.performance);
            $scope.newChange.commissionBefore = angular.copy($scope.employee.commission);
            $scope.newChange.courseLevelBefore = angular.copy($scope.employee.courseType);
            $scope.newChange.basicSalaryFloatBefore = angular.copy($scope.employee.basicSalaryFloat);
            $scope.newChange.classHourDutyBefore = angular.copy($scope.employee.classHourDuty);
            $scope.newChange.otherSalaryBefore = angular.copy($scope.employee.otherSalary);
            $scope.newChange.employmentLevelBefore = angular.copy($scope.employee.employmentLevel);
            $scope.addchangeModalTitle = '修改员工详细信息(绿色字体为添加老师信息时必要填的信息)';
            $scope.addchangeModal = $modal({ scope: $scope, templateUrl: 'partials/hr/employee/change-add.html' + dateStrop, show: true, backdrop: 'static' });
            //备份岗位list，用于取消新增异动后还原数据
            $scope.positionsBak = angular.copy($scope.positions);
            /*$scope.positions = {};*/
        }

        /**
         * 取消新增异动
         */
        $scope.cancleChange = function () {
            //还原岗位信息
            $scope.employee.department = angular.copy($scope.newChange.departmentBefore);
            $scope.employee.position = angular.copy($scope.newChange.positionBefore);
            $scope.positions = angular.copy($scope.positionsBak);
            $scope.newChange = {};
            $scope.newChange.departmentBefore = {};
            $scope.newChange.departmentAfter = {};
            $scope.addchangeModal.hide();
        }

        /**
         * 保存异动（暂未入库）
         */
        $scope.saveChange = function () {
            //新增异动后，顺便修改员工对应信息
            var reg_num = /^\+?[1-9]*[1-9][0-9]*$/;//正整数
            if ($scope.newChange.basicSalaryAfter && (!reg_num.test($scope.newChange.basicSalaryAfter) || $scope.newChange.basicSalaryAfter > 100000000)) {
                SweetAlert.swal('底薪只能为小于100000000的正整数', '请重试', 'error');
                return;
            }
            if ($scope.newChange.performanceAfter && (!reg_num.test($scope.newChange.performanceAfter) || $scope.newChange.performanceAfter > 100000000)) {
                SweetAlert.swal('绩效只能为小于100000000的正整数', '请重试', 'error');
                return;
            }
            if ($scope.newChange.basicSalaryFloatAfter && (!reg_num.test($scope.newChange.basicSalaryFloatAfter) || $scope.newChange.basicSalaryFloatAfter > 100000000)) {
                SweetAlert.swal('浮动底薪只能为小于100000000的正整数', '请重试', 'error');
                return;
            }
            if ($scope.newChange.classHourDutyAfter && (!reg_num.test($scope.newChange.classHourDutyAfter) || $scope.newChange.classHourDutyAfter > 100000000)) {
                SweetAlert.swal('义务课时只能为小于100000000的正整数', '请重试', 'error');
                return;
            }
            if ($scope.newChange.otherSalaryAfter && (!reg_num.test($scope.newChange.otherSalaryAfter) || $scope.newChange.otherSalaryAfter > 100000000)) {
                SweetAlert.swal('其他薪资只能为小于100000000的正整数', '请重试', 'error');
                return;
            }
            if ($scope.newChange.commissionAfter && $scope.newChange.commissionAfter.length > 128) {
                SweetAlert.swal('提成不能超过128个字符', '请重试', 'error');
                return;
            }
            if ($scope.newChange.remark && $scope.newChange.remark.length > 1024) {
                SweetAlert.swal('备注不能超过1024个字符', '请重试', 'error');
                return;
            }
            $scope.employee.department = $scope.newChange.departmentAfter;
            $scope.employee.position = $scope.newChange.positionAfter;
            $scope.employee.courseType = $scope.newChange.courseLevelAfter;
            $scope.employee.basicSalary = $scope.newChange.basicSalaryAfter;
            $scope.employee.performance = $scope.newChange.performanceAfter;
            $scope.employee.commission = $scope.newChange.commissionAfter;
            $scope.employee.basicSalaryFloat = $scope.newChange.basicSalaryFloatAfter;
            $scope.employee.classHourDuty = $scope.newChange.classHourDutyAfter;
            $scope.employee.otherSalary = $scope.newChange.otherSalaryAfter;
            $scope.employee.employmentLevel = $scope.newChange.employmentLevelAfter;
            //设置异动执行时间和对应的员工id
            $scope.newChange.executeDate = new Date();
            $scope.newChange.employeeId = $scope.employee.id;
            //放入员工异动列表
            if (!$scope.employee.changes) {
                $scope.employee.changes = [];
            }
            $scope.employee.changes.unshift($scope.newChange);
            //清空信息，关闭弹窗
            $scope.addchangeModal.hide();
            $scope.newChange = {};
            $scope.newChange.departmentBefore = {};
            $scope.newChange.departmentAfter = {};
            if ($scope.employee.workingExperienceList) {
                angular.forEach($scope.employee.workingExperienceList, function (p, index) {
                    if (p.departure_date) {
                        p.departure_date = new Date(p.departure_date);
                    }
                    if (p.entrance_date) {
                        p.entrance_date = new Date(p.entrance_date);
                    }
                });
            }
            $scope.doUpdate(0);
        }

        $scope.removeChange = function (index) {
            SweetAlert.swal({
                title: "确定要删除该异动信息吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: true
            }, function (confirm) {
                if (confirm) {
                    if ($scope.employee.changes && index == 0) {
                        //如果是删除最新的异动信息，那么需要将部门岗位等关联信息一并修改为之前的
                        $scope.employee.department = $scope.employee.changes[index].departmentBefore;
                        $scope.employee.position = $scope.employee.changes[index].positionBefore;
                        $scope.employee.courserType = $scope.employee.changes[index].courseLevelBefore;
                        $scope.employee.basicSalary = $scope.employee.changes[index].basicSalaryBefore;
                        $scope.employee.performance = $scope.employee.changes[index].performanceBefore;
                        $scope.employee.commission = $scope.employee.changes[index].commissionBefore;
                        $scope.employee.basicSalaryFloat = $scope.employee.changes[index].basicSalaryFloatBefore;
                        $scope.employee.classHourDuty = $scope.employee.changes[index].classHourDutyBefore;
                        $scope.employee.otherSalary = $scope.employee.changes[index].otherSalaryBefore;

                        $scope.getPositions($scope.employee.department.id);
                        $scope.employee.changes.splice(index, 1);
                    }
                    else if ($scope.employee.changes && index > 0) {
                        //如果删除的异动不是最新的，那么不需要去维护员工相应信息
                        $scope.employee.changes.splice(index, 1);
                    }
                }
            }
            );
        }

        /**
         * Show the detail information of the selected employee.
         * @param employee
         */
        function showDetailView(employee) {
            EmployeeService.getTeachingGrade().then(function (response) {
                if (response.status = "SUCCESS") {
                    $scope.gradeList = response.data;
                }
            })
            $scope.employee = employee;
            if ($scope.employee.salaryStandard && $scope.employee.salaryStandard.constructor == String) {
                $scope.employee.salaryStandardList = JSON.parse($scope.employee.salaryStandard);
            }
            $scope.groupTeacher = angular.copy(employee.groupTeacher);
            deptToPos();
            //每次要打开详细界面时，都要判断一下之前配置的教学特点
            $scope.toggleCharacteristic();
            //确定一下市和县列表选项
            if ($scope.employee.provinceCode != undefined) {
                var promise = DepartmentService.getCityByProvince($scope.employee.provinceCode);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                        return false;
                    }
                    else {
                        $scope.cities = response.data;
                    }
                }, function (error) {
                });
            }
            if ($scope.employee.cityCode != undefined) {
                var promise = DepartmentService.getAreaByCity($scope.employee.cityCode);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                        return false;
                    }
                    else {
                        $scope.areas = response.data;
                    }
                }, function (error) {
                });
            }
            $scope.detailTabs = [
                { id: 1, title: '基本信息', template: 'partials/hr/employee/basic-info-detail.html' + dateStrop },
                { id: 2, title: '职位信息', template: 'partials/hr/employee/position-info-detail.html' + dateStrop },
                //                {id:3,title:'薪资信息', template: 'partials/hr/employee/salary-info-detail.html'+dateStrop},
                { id: 4, title: '工作经历', template: 'partials/hr/employee/work-history-detail.html' + dateStrop },
                { id: 5, title: '异动信息', template: 'partials/hr/employee/person-change-detail.html' + dateStrop },
                { id: 6, title: '认证相关', template: 'partials/hr/employee/confirm-detail.html' + dateStrop },
                { id: 7, title: '其他', template: 'partials/hr/employee/other-detail.html' + dateStrop }
            ];
            $scope.detailModalTitle = '查看员工详细信息';
            $scope.detailModal = $modal({ scope: $scope, templateUrl: 'partials/hr/employee/modal.employee.detail.html' + dateStrop, show: true, backdrop: 'static' });
        }

        /**
         * 激活企业邮箱，弹出框显示用户名和邮箱
         * @param employee
         */
        function activeEmail(employee) {
            //todo
        }

        /**
         * remove the selected employee
         * @param employee
         */
        function removeEmployee(employee) {
            $scope.employee = angular.copy(employee);
            $scope.resignation = {};
            $scope.reasonModalTitle = '填写离职原因';
            $scope.reasonModal = $modal({ scope: $scope, templateUrl: 'partials/hr/employee/modal.resignation.reason.html' + dateStrop, show: true, backdrop: 'static' });
            /*SweetAlert.swal({
                    title: "该员工确定要离职吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function(confirm) {
                    if (confirm) {
                    	$scope.employee = angular.copy(employee);
                    	$scope.reasonModalTitle = '填写离职原因';
                        $scope.reasonModal = $modal({scope: $scope, templateUrl: 'partials/hr/employee/modal.resignation.reason.html'+dateStrop, show: true,backdrop:'static'});
                        var promise = EmployeeService.remove(employee);
                        promise.then(function(response) {
                            if(response.status == "FAILURE"){
                                SweetAlert.swal( response.data,"请重试","error");
                            }
                            else{
                                //删除时需要重新加载在职离职员工
                                $scope.employee = {};
                                getEmployeesByFilters(0);
                                getEmployeesByFilters(1);
                            }
                        }, function(error) {
                        });
                    }
                }
            );*/
        }

        /**
         * Set the employee's password to default password.
         * @param employee
         */
        function resetPassword(employee) {
            SweetAlert.swal({
                title: "确定要重置该员工的密码吗？",
                type: "warning",
                showCancelButton: true,
                /* confirmButtonColor: '#DD6B55',*/
                confirmButtonColor: '#fe9900',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: true
            }, function (confirm) {
                if (confirm) {
                    if (employee.workingExperienceList) {
                        angular.forEach(employee.workingExperienceList, function (p, index) {
                            p.entrance_date = new Date(p.entrance_date);
                            if (p.departure_date) {
                                p.departure_date = new Date(p.departure_date);
                            }
                        });
                    }
                    var promise = EmployeeService.resetPassword(employee);
                    promise.then(function (response) {
                        if (response.status == "FAILURE") {
                            SweetAlert.swal(response.data, "请重试", "error");
                        }
                        else {
                            SweetAlert.swal('重置密码成功', 'success');
                        }
                    }, function (error) {
                        SweetAlert.swal('重置密码失败', 'error');
                    });
                }
            }
            );
        }

        /**
         * Gets all subjects from server side.
         */
        function getAllSubjects() {
            var promise = CommonService.getSubjectIdSelect();
            promise.then(function (response) {
                console.log(response);
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    $scope.subjects = response.data;
                }
            },
                function (error) {
                });
        }

        /**
         * Checks whether the given subject is in the current employee's subject list.
         * @param subject the subject to check
         * @return true if it contains, otherwise false
         */
        function containsSubject(subject) {
            var found = false;
            if ($scope.employee.subject) {
                var idAll = $scope.employee.subject;
                if (idAll != undefined) {
                    $scope.subjects.id = idAll.split(",");
                    angular.forEach($scope.subjects.id, function (p) {
                        if (p == subject.id) {
                            found = true;
                        }
                    });
                }
            }
            return found;
        }

        function containsSubjectOnload(subject) {
            var found = false;
            $scope.subjects.id = [];
            if ($scope.employee.subject) {
                var idAll = $scope.employee.subject;
                if (idAll != undefined) {
                    $scope.subjects.id = idAll.split(",");
                    angular.forEach($scope.subjects.id, function (p) {
                        if (p == subject.id) {
                            found = true;
                        }
                    });
                }
            }
            return found;
        }

        /**
         * 将时间戳转化为yyyy-MM-dd hh:mm:ss格式
         * @param p
         */
        function dateFormat_yyyyMM(employees) {
            angular.forEach(employees, function (p, index) {
                if (p.graduationDate) {
                    p.graduationDate = new Date(p.graduationDate).Format("yyyy-MM-dd");
                }
                if (p.latestEducationStartDate) {
                    p.latestEducationStartDate = new Date(p.latestEducationStartDate).Format("yyyy-MM-dd");
                }
                if (p.birthDate) {
                    p.birthDate = new Date(p.birthDate).Format("yyyy-MM-dd");
                }
                if (p.hiringDate) {
                    p.hiringDate = new Date(p.hiringDate).Format("yyyy-MM-dd");
                }
                if (p.trialEndDate) {
                    p.trialEndDate = new Date(p.trialEndDate).Format("yyyy-MM-dd");
                }
                if (p.contractStartDate) {
                    p.contractStartDate = new Date(p.contractStartDate).Format("yyyy-MM-dd");
                }
                if (p.contractEndDate) {
                    p.contractEndDate = new Date(p.contractEndDate).Format("yyyy-MM-dd");
                }
                if (p.workingExperienceList) {
                    angular.forEach(p.workingExperienceList, function (q, index) {
                        if (p.workingExperienceList[index].departure_date != null) {
                            p.workingExperienceList[index].departure_date = new Date(p.workingExperienceList[index].departure_date).Format("yyyy-MM");
                        }
                        p.workingExperienceList[index].entrance_date = new Date(p.workingExperienceList[index].entrance_date).Format("yyyy-MM");
                    })
                }
            });
        }

        /**
         * Toggles subject inclusion.
         * @param subject the subject
         */
        function toggleSubject(subject) {
            if (containsSubject(subject)) {
                angular.forEach($scope.subjects.id, function (p, index) {
                    if (p == subject.id) {
                        $scope.subjects.id.splice(index, 1);
                        return;
                    }
                });
            }
            else {
                if (!$scope.subjects.id) {
                    $scope.subjects.id = [];
                }
                $scope.subjects.id.push(subject.id);
            }
            $scope.employee.subject = $scope.subjects.id.join(",");
        }

        $scope.recruitmentChannel = [
            {
                "name": "校招",
                "child": [
                    {
                        "name": "校园大使",
                        "child": []
                    },
                    {
                        "name": "双选会",
                        "child": []
                    }
                ]
            },
            {
                "name": "社招",
                "child": [
                    {
                        "name": "招聘网站",
                        "child": [
                            { "name": "智联招聘" },
                            { "name": "前程无忧" },
                            { "name": "58同城" },
                            { "name": "赶集网" },
                            { "name": "猎聘网" },
                            { "name": "中华英才" },
                            { "name": "大街网" },
                            { "name": "脉脉" },
                            { "name": "邮箱" },
                            { "name": "后台400" }
                        ]
                    },
                    {
                        "name": "人才市场招聘会",
                        "child": []
                    },
                    {
                        "name": "内部推荐",
                        "child": []
                    },
                    {
                        "name": "外部猎头",
                        "child": []
                    }
                ]
            }
        ];

        // configure the tree
        $scope.treeOptions = {
            nodeChildren: 'children',
            dirSelectable: true,
            allowDeselect: false
        }

        /******************************************* 员工导入start *************************************/
        $scope.domain = "";
        if ($location.host().indexOf("localhost") != -1) {//返回大于等于0的整数值，若不包含"localhost"则返回"-1。);
            $scope.domain = "http://" + $location.host() + ":8000/app";
        } else {
            $scope.domain = "http://" + $location.host();
        }

        //导入员工弹框
        $scope.showImportModal = function () {
            $scope.modalTitleForImport = '导入员工';
            $scope.modalForImport = $modal({ scope: $scope, templateUrl: 'partials/hr/employee/modal.importEmployees.html' + dateStrop, show: true, backdrop: 'static' });
        }

        //上传导入信息
        var uploader = $scope.uploader = new FileUploader({
            url: config.endpoints.hr.employee + "/importEmployees",
            headers: {
                'Authorization': 'bearer ' + $base64.encode(localStorageService.get('user').account + ':' + localStorageService.get('token')),
            }
        });

        // FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function (item, options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS
        uploader.onWhenAddingFileFailed = function (item, filter, options) {
            //console.info('onWhenAddingFileFailed', item, filter, options);
        };

        //添加一个文件
        uploader.onAfterAddingFile = function (fileItem) {
            //判断后缀
            var fileExtend = fileItem.file.name.substring(fileItem.file.name.lastIndexOf('.')).toLowerCase();
            if (fileExtend != '.xlsx') {
                SweetAlert.swal('请选择后缀名为xlsx格式的excel模版文件');
                fileItem.remove();
                return false;
            }
        };

        //添加多个文件
        uploader.onAfterAddingAll = function (addedFileItems) {
            //console.info('onAfterAddingAll', addedFileItems);
        };

        uploader.onProgressItem = function (fileItem, progress) {
            $rootScope.ywsLoading = true;
        };

        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            if (response.status == 'SUCCESS') {
                if (response.data.formatErrorLine == null) {
                    response.data.formatErrorLine = "无";
                }
                if (response.data.repeatPhoneLine == null) {
                    response.data.repeatPhoneLine = "无";
                }
                SweetAlert.swal(
                    "数据总数:" + response.data.totalCount + " " +
                    ";\n成功条数:" + response.data.successCount + " " +
                    ";\n失败条数:" + response.data.failCount + " " +
                    ";\n电话重复:" + response.data.repeatPhone + " " +
                    ";\n格式错误:" + response.data.formatErrorCount + " " +
                    ";\n电话重复行数为:" + response.data.repeatPhoneLine + " " +
                    ";\n格式错误行数为:" + response.data.formatErrorLine + " ;"
                );
                fileItem.remove();
                getEmployeesByFilters(0);
            } else {
                SweetAlert.swal(response.data.msg);
                fileItem.remove();
            }
            $rootScope.ywsLoading = false;
        };

        ; (function init(angular) {
            $scope.data = {};
            if ($routeParams.userId != null) {
                //alert($routeParams.userId);
                var temp = {};
                temp.user = {};
                temp.employmentStatus = 0;
                temp.user.id = $routeParams.userId;
                var promise = EmployeeService.getEmployeesByFilters(temp, 0, 10);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        var result = {};
                        result.data = response.data.list;
                        dateFormat_yyyyMM(result.data);//将工作经历中的时间转换为yyyy-MM格式
                        $scope.generateImgPreviewSrc(result.data);
                        $scope.employee = result.data[0];
                        //$scope.employee = angular.copy(employee);
                        deptToPos();
                        //每次要打开编辑界面时，都要判断一下之前配置的教学特点
                        $scope.toggleCharacteristic();
                        //确定一下市和县列表选项
                        if ($scope.employee.provinceCode != undefined) {
                            var promise = DepartmentService.getCityByProvince($scope.employee.provinceCode);
                            promise.then(function (response) {
                                if (response.status == "FAILURE") {
                                    SweetAlert.swal(response.data, "请重试", "error");
                                    return false;
                                }
                                else {
                                    $scope.cities = response.data;
                                }
                            }, function (error) {
                            });
                        }
                        if ($scope.employee.cityCode != undefined) {
                            var promise = DepartmentService.getAreaByCity($scope.employee.cityCode);
                            promise.then(function (response) {
                                if (response.status == "FAILURE") {
                                    SweetAlert.swal(response.data, "请重试", "error");
                                    return false;
                                }
                                else {
                                    $scope.areas = response.data;
                                }
                            }, function (error) {
                            });
                        }
                        $scope.personalInfoTabs = [
                            { id: 1, title: '基本信息', template: 'partials/hr/employee/basic-info-personal-edit.html' + dateStrop },
                            { id: 2, title: '职位信息', template: 'partials/hr/employee/position-info-personal-edit.html' + dateStrop },
                            { id: 4, title: '工作经历', template: 'partials/hr/employee/work-history.html' + dateStrop },
                            { id: 6, title: '认证相关', template: 'partials/hr/employee/confirm.html' + dateStrop },
                            { id: 7, title: '其他', template: 'partials/hr/employee/other.html' + dateStrop }
                        ];
                    }
                });
            };
            if (check_null($routeParams.type)) {
                if ($routeParams.type == 1) {
                    $scope.employeeTabs = [
                        //{id:0,title:'待入职', template: 'partials/hr/employee/serving-officer.html'+dateStrop},
                        { id: 3, title: '待入职', template: 'partials/hr/employee/be-recruited-employee.html' + dateStrop },
                        { id: 1, title: '在职', template: 'partials/hr/employee/serving-officer.html' + dateStrop },
                        { id: 2, title: '离职', template: 'partials/hr/employee/resigning-employee.html' + dateStrop },

                    ];
                } else if ($routeParams.type == 2) {
                    $scope.employeeTabs = [
                        //{id:0,title:'待入职', template: 'partials/hr/employee/serving-officer.html'+dateStrop},
                        { id: 1, title: '在职', template: 'partials/hr/employee/serving-officer.html' + dateStrop },
                        { id: 2, title: '离职', template: 'partials/hr/employee/resigning-employee.html' + dateStrop },
                        { id: 3, title: '待入职', template: 'partials/hr/employee/be-recruited-employee.html' + dateStrop }
                    ];
                } else if ($routeParams.type == 3) {
                    $scope.employeeTabs = [
                        //{id:0,title:'待入职', template: 'partials/hr/employee/serving-officer.html'+dateStrop},

                        { id: 2, title: '离职', template: 'partials/hr/employee/resigning-employee.html' + dateStrop },
                        { id: 3, title: '待入职', template: 'partials/hr/employee/be-recruited-employee.html' + dateStrop },
                        { id: 1, title: '在职', template: 'partials/hr/employee/serving-officer.html' + dateStrop },
                    ];
                } else {
                    $scope.employeeTabs = [
                        //{id:0,title:'待入职', template: 'partials/hr/employee/serving-officer.html'+dateStrop},
                        { id: 1, title: '在职', template: 'partials/hr/employee/serving-officer.html' + dateStrop },
                        { id: 2, title: '离职', template: 'partials/hr/employee/resigning-employee.html' + dateStrop },
                        { id: 3, title: '待入职', template: 'partials/hr/employee/be-recruited-employee.html' + dateStrop }
                    ];
                }
            } else {
                $scope.employeeTabs = [
                    //{id:0,title:'待入职', template: 'partials/hr/employee/serving-officer.html'+dateStrop},
                    { id: 1, title: '在职', template: 'partials/hr/employee/serving-officer.html' + dateStrop },
                    { id: 2, title: '离职', template: 'partials/hr/employee/resigning-employee.html' + dateStrop },
                    { id: 3, title: '待入职', template: 'partials/hr/employee/be-recruited-employee.html' + dateStrop }
                ];
            }
        })(angular);

        /**
         * 增加年级课时费
         */
        $scope.addCourseFee = function () {
            if (!$scope.employee.gradeCourseFeeList) {
                $scope.employee.gradeCourseFeeList = [];
            }
            var obj = new Object();
            $scope.employee.gradeCourseFeeList.unshift(obj);
        }

        /**
         * 删除index对应年级段课时费
         */
        $scope.deleteCourseFee = function (index) {
            if ($scope.employee.gradeCourseFeeList) {
                $scope.employee.gradeCourseFeeList.splice(index, 1);
            }
        }

        $scope.showTeacherSelectModal = function () {
            $scope.teacherFilter = {};
            $scope.teacherFilter.isNotSubjectLeader = 1;
            $scope.groupTeacherBak = angular.copy($scope.groupTeacher);
            $scope.teacherModelTitle = "添加组内教师";
            $scope.teacherModal = $modal({ scope: $scope, templateUrl: 'partials/hr/employee/modal.teacherSelect.html' + dateStrop, show: true, backdrop: 'static' });
        }

        /**
         * 加载老师列表
         */
        $scope.getTeachersList = function (tableState) {
            if ($scope.employee.department) {
                $scope.teacherFilter.schoolId = $scope.employee.department.id;
            }
            $scope.teacherTableState = tableState;
            $scope.isrendLoading = true;
            $scope.pagination = $scope.teacherTableState.pagination;
            var start = $scope.pagination.start || 0;
            var number = $scope.pagination.number || 10;
            CustomerStudentCourseService.getCSShooleTeacherByFiltersNew(start, number, tableState, $scope.teacherFilter).then(function (result) {
                $scope.teacherList = result.data.studentTeachers.list;
                $scope.teacherTableState.pagination.numberOfPages = result.numberOfPages;
                $scope.isLoading = false;
            });
        }

        /**
         * 按时间段查询教师的列表
         */
        $scope.getTeachersListByFilter = function () {
            $scope.isLoading = true;
            if ($scope.employee.department) {
                $scope.teacherFilter.schoolId = $scope.employee.department.id;
            }
            var pagination = $scope.teacherTableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            CustomerStudentCourseService.getCSShooleTeacherByFiltersNew(start, number, $scope.teacherTableState, $scope.teacherFilter).then(function (result) {
                $scope.teacherList = result.data.studentTeachers.list;
                $scope.teacherTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.isLoading = false;
            });
        }
        //teacherName

        $scope.selectTeacher = function (row) {
            if ($scope.groupTeacher == undefined) {
                $scope.groupTeacher = [];
            }
            var isExist = false;
            angular.forEach($scope.groupTeacher, function (p, index) {
                if (row.userId == p.userId) {
                    isExist = true;
                    $scope.groupTeacher.splice(index, 1)
                }
            })
            if (!isExist) {
                $scope.groupTeacher.push(row);
            }
        }

        $scope.isSelected = function (userId) {
            if ($scope.groupTeacher == undefined) {
                $scope.groupTeacher = [];
            }
            var isSelected = false;
            angular.forEach($scope.groupTeacher, function (p, index) {
                if (userId == p.userId) {
                    isSelected = true;;
                }
            })
            return isSelected;
        }

        $scope.cancleSelect = function () {
            $scope.groupTeacher = angular.copy($scope.groupTeacherBak);
            $scope.teacherModal.hide();
        }

        $scope.salaryStandard = {};
        $scope.addSalaryStandard = function () {
            console.log($scope.salaryStandard.unitPrice)
            if (!$scope.salaryStandard.gradeId && $scope.salaryStandard.gradeId != 0) {
                warningAlert("请选择年级");
                return;
            } else if (!$scope.salaryStandard.unitPrice && $scope.salaryStandard.unitPrice != 0) {
                warningAlert("单价应大于0，小于1000");
                return;
            }
            if(!$scope.employee.salaryStandardList){
                $scope.employee.salaryStandardList = [];
            }
            $scope.employee.salaryStandardList.push($scope.salaryStandard);
            $scope.salaryStandard = {};
        }
        $scope.deleteSalaryStandard = function (index) {
            $scope.employee.salaryStandardList.splice(index, 1);
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

    }
]);
