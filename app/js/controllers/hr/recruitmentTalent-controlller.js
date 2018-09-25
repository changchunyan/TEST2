/**
 * Created by zhiqing on 2015/11/5.
 */
'use strict';

/**
 * The position maintenance controller.
 *
 * @author czq
 * @version 1.0
 */
angular.module('ywsApp').controller('RecruitmentTalentController', [
    '$scope', '$modal', '$rootScope', 'SweetAlert','$routeParams','RecruitmentManagementService','AuthenticationService','EmployeeService','TalentService',
    function($scope,   $modal,   $rootScope,   SweetAlert, $routeParams ,RecruitmentManagementService,AuthenticationService,EmployeeService,TalentService) {
        //function declaration
        $scope.getRecruitmentPoints = getRecruitmentPoints;
        $scope.getTalentByFilter = getTalentByFilter;
        $scope.reset = reset;
        $scope.getTalentList = getTalentList;
        $scope.init = init;
        $scope.updateRecruitmentSchedule = updateRecruitmentSchedule;
        $scope.showOperatorInfo = showOperatorInfo;
        $scope.talentToEmployee = talentToEmployee;

        //execute functions at first load
        $scope.getRecruitmentPoints();

        //从url中解析参数，如果放在init中再解析，会有延迟，第一次进度简历库 列表为空
        $scope.recruitment = {};
        if($routeParams.recruitmentId != undefined) {
            $scope.recruitment.id = $routeParams.recruitmentId;
        }
        $scope.talent = {};
        if($routeParams.talentId != undefined) {
            $scope.talent.id = $routeParams.talentId;
        }
        /**
         * 在获取recruitmentPoints后，初始化参数
         */
        function init(){
            if($routeParams.recruitmentId != undefined){
                var promise = RecruitmentManagementService.getRecruitmentByFilter($scope.recruitment,0,10);
                promise.then(function(response) {
                    if(response.status == "FAILURE"){
                        SweetAlert.swal( response.data,"请重试","error");
                    }
                    else{
                        $scope.recruitment = response.data.list[0];
                    }
                }, function(error) {
                    SweetAlert.swal('获取招聘信息失败', 'error');
                });
            }
            if($routeParams.talentId != undefined){
                $scope.temp = {};
                $scope.temp.id = $routeParams.talentId;
                var promise = TalentService.findByFilter($scope.temp,0, 10);
                promise.then(function(response) {
                    if(response.status == "FAILURE"){
                        SweetAlert.swal( response.data,"请重试","error");
                    }
                    else{
                        var result = {};
                        result.data = response.data.list;
                        result.numberOfPages = response.data.pages;
                        $scope.talent = result.data[0];
                        angular.forEach($scope.talent.recruitmentSchedule, function(p, index){
                            var promise2 = RecruitmentManagementService.getUserByUserId($scope.talent.recruitmentSchedule[index].createdBy)
                                .then(function(response2) {
                                    if(response2.status == "FAILURE"){
                                        SweetAlert.swal( response2.data,"请重试","error");
                                    }
                                    else{
                                        $scope.talent.recruitmentSchedule[index].operator = response2.data.name;
                                    }
                                }, function(error) {
                                    SweetAlert.swal('连接后台服务失败', '请重试', 'error');
                                }
                            );
                            $scope.talent.recruitmentSchedule[index].scheduleDate = new Date($scope.talent.recruitmentSchedule[index].scheduleDate).Format("yyyy-MM-dd hh:mm:ss");
                        })
                    }
                }, function(error) {
                    SweetAlert.swal('获取人才信息失败', 'error');
                });
            }
        }

        /**
         * 获取招聘流程节点
         */
        function getRecruitmentPoints(){
            var promise = RecruitmentManagementService.getRecruitmentPoints()
                .then(function(response) {
                    if(response.status == "FAILURE"){
                        SweetAlert.swal( response.data,"请重试","error");
                    }
                    else{
                        $scope.recruitmentPoints = response.data;
                        $scope.temp = [];
                        angular.forEach($scope.recruitmentPoints,function(p,index){
                            if(p.name != "简历初选" && p.name !="转让"){
                                $scope.temp.push(p);
                            }
                        });
                        $scope.recruitmentPoints = angular.copy($scope.temp);
                        init();
                    }
                }, function(error) {
                    SweetAlert.swal('获取招聘流程失败', '请重试', 'error');
                }
            );
        }

        /**
         * 保存，针对节点的改动。
         */
        function updateRecruitmentSchedule (){
            var isRecruited = false;
            if($scope.talent.recruitmentSchedule){
                angular.forEach($scope.talent.recruitmentSchedule,function(p,index){
                    if(p.recruitmentNode.name == "待入职"){
                        isRecruited = true;
                        return;
                    }
                });
            }
            if(isRecruited == true){
                SweetAlert.swal({
                    title: "您已经将此人的招聘流程中添加了【待入职】节点，如果确认无误，请点击【保存】按钮。",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '保存',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function(confirm) {
                    talentToEmployee($scope.talent);
                })
            }
            else{
                var bak = angular.copy($scope.talent.recruitmentSchedule);
                angular.forEach(bak, function(p,index){
                    p.scheduleDate = new Date(p.scheduleDate);
                });
                var promise = RecruitmentManagementService.updateRecruitmentSchedule(bak)
                    .then(function(response) {
                        if(response.status == "FAILURE"){
                            SweetAlert.swal( response.data,"请重试","error");
                        }
                        else{
                            var data = response.data;
                            $scope.talent.recruitmentSchedule = data;
                            angular.forEach($scope.talent.recruitmentSchedule, function(p, index){
                                var promise2 = RecruitmentManagementService.getUserByUserId($scope.talent.recruitmentSchedule[index].createdBy)
                                    .then(function(response2) {
                                        if(response2.status == "FAILURE"){
                                            SweetAlert.swal( response2.data,"请重试","error");
                                        }
                                        else{
                                            $scope.talent.recruitmentSchedule[index].operator = response2.data.name;
                                        }
                                    }, function(error) {
                                        SweetAlert.swal('连接后台服务失败', '请重试', 'error');
                                    }
                                );
                                $scope.talent.recruitmentSchedule[index].scheduleDate = new Date($scope.talent.recruitmentSchedule[index].scheduleDate).Format("yyyy-MM-dd hh:mm:ss");
                            })
                            SweetAlert.swal('修改成功', 'success');
                        }
                    }, function(error) {
                        SweetAlert.swal('修改失败', '请重试', 'error');
                    }
                );
            }
        }

        function talentToEmployee(employee) {
            //人才弹框---最上方6个input框
            $scope.employee = {};
            $scope.employee.user = {};
            $scope.employee.user.name = employee.name;
            $scope.employee.user.email = employee.mail;
            $scope.employee.idNumber = employee.id_number;
            $scope.employee.mobile = employee.tel;
            $scope.employee.birthDate = employee.birthday;
            $scope.employee.user.gender = employee.gender;

            //人才弹框---招聘信息tab
            $scope.employee.department = employee.department;
            $scope.employee.position = employee.position;

            //人才弹框---基本信息tab
            $scope.employee.ethnic = employee.ethnic;
            $scope.employee.teacherGrade = employee.teacher_grade;
            $scope.employee.age = employee.age;
            $scope.employee.highestEducationInstitute = employee.highest_education_institute;
            $scope.employee.major = employee.major;
            $scope.employee.latestEducationStartDate = employee.entrance_date;
            $scope.employee.graduationDate = employee.graduation_date;
            $scope.employee.educationDegree = employee.education_degree;//可能需要转换，这边是1-8
            $scope.employee.educationDegreeType = employee.education_degree_type;//可能需要转换，从1-2
            $scope.employee.registeredResidenceType = employee.registered_residence_type;//需要转换1-3
            $scope.employee.registeredResidence = employee.registered_residence;
            $scope.employee.provinceCode = employee.province_code;
            $scope.employee.cityCode = employee.city_code;
            $scope.employee.areaCode = employee.area_code;
            $scope.employee.address = employee.address;

            //人才弹框---工作经历tab
            $scope.employee.workingExperienceList = employee.hrWorkingExperiences;

            //人才弹框---应聘意向tab，不用保存在员工信息中

            //人才弹框---认证相关tab
            //图片要重新上传。因为空间不一样了。HR-IMG{talentId}变为HR-IMG{employeeId}
            $scope.employee.identityType = employee.identity_type;
            $scope.employee.identityNumber = employee.identity_number;
            $scope.employee.imageIdentity = employee.image_identity;
            $scope.employee.imageTeacher = employee.image_teacher;
            $scope.employee.imageEducation = employee.image_education;
            $scope.employee.imageProfessional =employee.image_professional;

            //人才弹框---其他tab
            $scope.employee.characteristics = employee.talent_characteristic;
            if(employee.talent_characteristic){
                $scope.employee.characteristics = [];
                angular.forEach(employee.talent_characteristic,function(p,index){
                    var temp = {};
                    temp.id = p.teaching_characteristic_id;
                    $scope.employee.characteristics.push(temp);
                });
            }
            $scope.employee.signature = employee.signature;
            $scope.employee.profile = employee.profile;
            $scope.employee.teachingAchievementList = employee.teaching_achievement;

            //信息拷贝完全后，添加一个状态为待入职（employee_status=2）的员工
            $scope.employee.employmentStatus = 2;
            $scope.employee.talentId = employee.id;
            var promise = EmployeeService.add($scope.employee);
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                    return false;
                }
                else{
                    var data = response.data;
                    $scope.employee.id = data.id;
                    if(employee.image_identity){
                        var newFileName = "HR-IMG" + data.id + "/" + employee.image_identity;
                        var oldFileName = "HR-IMG" + employee.id + "/" + employee.image_identity;
                        TalentService.copy(newFileName,oldFileName);
                    }
                    if(employee.image_teacher){
                        var newFileName = "HR-IMG" + data.id + "/" + employee.image_teacher;
                        var oldFileName = "HR-IMG" + employee.id + "/" + employee.image_teacher;
                        TalentService.copy(newFileName,oldFileName);
                    }
                    if(employee.image_education){
                        var newFileName = "HR-IMG" + data.id + "/" + employee.image_education;
                        var oldFileName = "HR-IMG" + employee.id + "/" + employee.image_education;
                        TalentService.copy(newFileName,oldFileName);
                    }
                    if(employee.image_professional){
                        var newFileName = "HR-IMG" + data.id + "/" + employee.image_professional;
                        var oldFileName = "HR-IMG" + employee.id + "/" + employee.image_professional;
                        TalentService.copy(newFileName,oldFileName);
                    }
                    if(employee.profile){
                        var newFileName = "HR-IMG" + data.id + "/" + employee.profile;
                        var oldFileName = "HR-IMG" + employee.id + "/" + employee.profile;
                        TalentService.copy(newFileName,oldFileName);
                    }
                    //在图片预览时候，已经将新增的图片封装在newImgList对象中了
                    if(employee.teaching_achievement != undefined){
                        angular.forEach(employee.teaching_achievement, function(q){
                            if(q.achievementImages != undefined){
                                angular.forEach(q.achievementImages, function(p,index){
                                    var length = employee.id.toString().length
                                    var fileName = p.substring(p.indexOf("com/HR-IMG")+11+length);
                                    var newFileName = "HR-IMG" + data.id + "/" + fileName;
                                    var oldFileName = "HR-IMG" + employee.id + "/" + fileName;
                                    TalentService.copy(newFileName,oldFileName);
                                })
                            }
                        })
                    }
                    var bak = angular.copy($scope.talent.recruitmentSchedule);
                    angular.forEach(bak, function(p,index){
                        p.scheduleDate = new Date(p.scheduleDate);
                    });
                    var promise1 = RecruitmentManagementService.updateRecruitmentSchedule(bak)
                        .then(function(response) {
                            if(response.status == "FAILURE"){
                                SweetAlert.swal( response.data,"请重试","error");
                            }
                            else{
                                var data = response.data;
                                $scope.talent.recruitmentSchedule = data;
                                angular.forEach($scope.talent.recruitmentSchedule, function(p, index){
                                    var promise2 = RecruitmentManagementService.getUserByUserId($scope.talent.recruitmentSchedule[index].createdBy)
                                        .then(function(response2) {
                                            if(response2.status == "FAILURE"){
                                                SweetAlert.swal( response2.data,"请重试","error");
                                            }
                                            else{
                                                $scope.talent.recruitmentSchedule[index].operator = response2.data.name;
                                            }
                                        }, function(error) {
                                            SweetAlert.swal('连接后台服务失败', '请重试', 'error');
                                        }
                                    );
                                    $scope.talent.recruitmentSchedule[index].scheduleDate = new Date($scope.talent.recruitmentSchedule[index].scheduleDate).Format("yyyy-MM-dd hh:mm:ss");
                                })
                                SweetAlert.swal('修改成功', 'success');
                            }
                        }, function(error) {
                            SweetAlert.swal('修改失败', '请重试', 'error');
                        }
                    );
                    $scope.employee = {};
                    return true;
                }
            }, function(error) {
                $scope.employee = {};
                return false;
            });
        }

        /**
         * Get the list at first load.
         */
        function getTalentList(tableState){
            $scope.gTableState = tableState;
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            var promise = RecruitmentManagementService.getTalentByFilter($scope.recruitment.id,$scope.talent,$scope.start, $scope.number);
            promise.then(function (response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    var result = {};
                    result.data = response.data.list;
                    result.numberOfPages = response.data.pages
                    $scope.talents = result.data;
                    $scope.setGender();
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                }
            }, function(error) {
               SweetAlert.swal('获取人才信息失败', 'error');
            });
        }

        /**
         * Get the list by filter.
         */
        function getTalentByFilter(){
            $scope.isLoading = true;
            $scope.gTableState.pagination.start=0;
            $scope.pagination = $scope.gTableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            var promise = RecruitmentManagementService.getTalentByFilter($scope.recruitment.id,$scope.talent,$scope.start, $scope.number);
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    var result = {};
                    result.data = response.data.list;
                    result.numberOfPages = response.data.pages
                    $scope.talents = result.data;
                    $scope.setGender();
                    $scope.gTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                }
            }, function(error) {
                SweetAlert.swal('获取人才信息失败', 'error');
            });
        }

        /**
         * 设置性别
         */
        $scope.setGender = function(){
            //设置性别
            angular.forEach($scope.talents,function(e){
                if(e.gender == "1"){
                    e.gender = "男";
                }
                else{
                    e.gender = "女";
                }
            })
        }

        /**
         * 重置搜索框为空
         */
        function reset(){
            $scope.talent = {};
        }

        /**
         * 新增节点
         */
        $scope.add=function(){
           // var object = new Object();
            var obj = new Object();
            obj.operator = AuthenticationService.currentUser().name;
            obj.groupId = $scope.talent.recruitmentSchedule[0].groupId;
            obj.talentId = $scope.talent.recruitmentSchedule[0].talentId;
            obj.status = 1;
            obj.createdBy = AuthenticationService.currentUser().id;
            obj.createdAt = new Date();
            obj.isDeleted = 0;
            obj.scheduleDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
            //每次新增节点时，应该放到第一位，方便编辑，待保存之后，再去根据时间顺序排序，不过这个排序都在后台server端处理了。不用再单独处理。
            $scope.talent.recruitmentSchedule.unshift(obj);
        }

        /**
         * 删除节点
         * @param idx
         */
        $scope.del=function(idx){
            if($scope.talent.recruitmentSchedule[idx].id == undefined){
                //如果是新增的节点删除，直接从list中删除
                $scope.talent.recruitmentSchedule.splice(idx,1);
            }
            else {
                SweetAlert.swal({
                        title: "请谨慎操作！",
                        text: '确定要删除该流程节点吗？',
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true,
                        showLoaderOnConfirm: true
                    }, function (confirm) {
                        if (confirm) {
                            var promise = RecruitmentManagementService.deleteRecruitmentSchedule($scope.talent.recruitmentSchedule[idx])
                                .then(function (response) {
                                    if(response.status == "FAILURE"){
                                        SweetAlert.swal( response.data,"请重试","error");
                                    }
                                    else{
                                        $scope.talent.recruitmentSchedule.splice(idx, 1);
                                        SweetAlert.swal('删除成功', 'success');
                                    }
                                }, function (error) {
                                    SweetAlert.swal('删除失败', '请重试', 'error');
                                }
                            );
                        }
                    }
                );
            }
        }

        $scope.uploadFile = function(){
            var file = $scope.myFile;
            var f = document.getElementById("file").files[0],
                r = new FileReader();
            r.onloadend = function(e){
                var data = e.target.result;
                var uploadUrl = "/fileUpload";
                RecruitmentManagementService.uploadFileToUrl(data, f.name, uploadUrl);
            }
            r.readAsDataURL(f);
        };

        /**
         * 文件下载
         */
        $scope.download = function(hrTalent){
            angular.forEach(hrTalent.recruitmentSchedule, function(p,index){
                p.scheduleDate = new Date(p.scheduleDate);
                if(p.visitTime != null){
                    p.visitTime = new Date(p.visitTime);
                }
            });
            if(hrTalent.historyTalents){
                angular.forEach(hrTalent.historyTalents,function(p){
                    angular.forEach(p.recruitmentSchedule,function(q){
                        q.scheduleDate = new Date(q.scheduleDate);
                        if(q.visitTime != null){
                            q.visitTime = new Date(q.visitTime);
                        }
                    })
                });
            }
            if(hrTalent.newHistoryTalent && hrTalent.newHistoryTalent.recruitmentSchedule){
                angular.forEach(hrTalent.newHistoryTalent.recruitmentSchedule,function(p, index){
                    p.scheduleDate = new Date(p.scheduleDate);
                    if(p.visitTime != null){
                        p.visitTime = new Date(p.visitTime);
                    }
                });
            }
            if(hrTalent.hrWorkingExperiences){
                angular.forEach(hrTalent.hrWorkingExperiences,function(p){
                    p.entrance_date = new Date(p.entrance_date);
                    if(p.departure_date != null){
                        p.departure_date = new Date(p.departure_date);
                    }
                });
            }
            TalentService.download(hrTalent);
        }

        /**
         * 显示操作人具体信息
         * @param userId
         */
        function showOperatorInfo(userId){
            $scope.employee = {};
            $scope.employee.user = {};
            $scope.employee.user.id=userId;
            var promise = EmployeeService.getEmployeesByFilters($scope.employee,0,10)
                .then(function (response) {
                    if(response.status == "FAILURE"){
                        SweetAlert.swal( response.data,"请重试","error");
                    }
                    else{
                        var result = {};
                        result.data = response.data.list;
                        result.numberOfPages = response.data.pages
                        $scope.employee = result.data[0];
                        $scope.showDetailView($scope.employee);
                    }
                }, function (error) {
                    SweetAlert.swal('获取操作人信息失败', '请重试', 'error');
                }
            );
        }

        /**
         * Show the detail information of the selected employee.
         * @param employee
         */
        $scope.showDetailView = function(employee){
            $scope.employee = employee;
            employee.birthDate = employee.birthDate == null ? null : new Date(employee.birthDate);
            employee.hiringDate = employee.hiringDate == null ? null : new Date(employee.hiringDate);
            employee.graduationDate = employee.graduationDate == null ? null : new Date(employee.graduationDate);
            employee.trialEndDate  = employee.trialEndDate == null ? null : new Date(employee.trialEndDate);
            employee.paymentStartDate = employee.paymentStartDate == null ? null : new Date(employee.paymentStartDate);
            employee.contractStartDate = employee.contractStartDate == null ? null : new Date(employee.contractStartDate);
            employee.contractEndDate = employee.contractEndDate == null ? null : new Date(employee.contractEndDate);
            employee.latestEducationStartDate = employee.latestEducationStartDate == null ? null : new Date(employee.latestEducationStartDate);
            employee.latestEducationEndDate = employee.latestEducationEndDate == null ? null : new Date(employee.latestEducationEndDate);
            $scope.detailTabs = [
                {title:'基本信息', template: 'partials/hr/employee/basic-info-detail.html'},
                {title:'职位信息', template: 'partials/hr/employee/position-info-detail.html'},
                {title:'薪资信息', template: 'partials/hr/employee/salary-info-detail.html'}
            ];
            $scope.detailModalTitle = '查看员工详细信息';
            $scope.detailModal = $modal({scope: $scope, templateUrl: 'partials/hr/employee/modal.employee.detail.html', show: true });
        }

    }
]);
