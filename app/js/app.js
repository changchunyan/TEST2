'use strict';

var ywsApp = angular.module('ywsApp', ['ngRoute', 'ngCookies', 'config', 'base64', 'mgcrea.ngStrap', 'LocalStorageModule', 'ywsFilters', 'ywsFilters2',
    'oitozero.ngSweetAlert', 'treeControl', 'smart-table', 'angular-echarts', 'angularFileUpload', 'angulartics', 'angulartics.baidu', 'angular-popups',
    'mobile-angular-ui', 'chart.js', 'mwl.calendar']);

ywsApp.config(['$routeProvider', '$httpProvider', '$analyticsProvider', function ($routeProvider, $httpProvider, $analyticsProvider) {
    // Initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }
    /*$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
     $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
     $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';*/

    $routeProvider.when('/login', {
        templateUrl: 'partials/login.html?' + new Date().getTime(),
        controller: 'LoginController'
    }).when('/unChrome', {
        templateUrl: 'partials/unChrome.html?' + new Date().getTime(),
        controller: ''
    }).when('/system-admin', {
        templateUrl: 'partials/admin/admin.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/system-admin/role', {
        templateUrl: 'partials/admin/roles.html?' + new Date().getTime(),
        controller: 'RoleManagementController'
    }).when('/system-admin/help', {
        templateUrl: 'partials/admin/help.html?' + new Date().getTime(),
        controller: 'HelpManagementController'
    }).when('/system-admin/permission', {
        templateUrl: 'partials/admin/permissions.html?' + new Date().getTime(),
        controller: 'PermissionManagementController'
    }).when('/system-admin/productMaintenance', {//产品维护
        templateUrl: 'partials/admin/productMaintenance/list.html?' + new Date().getTime(),
        controller: 'PermissionManagementController'
    }).when('/system-admin/projectSetting', {
        templateUrl: 'partials/admin/projectSetting.html?' + new Date().getTime(),
        controller: 'ProjectSettingController'
    }).when('/system-admin/userPrize', {
        templateUrl: 'partials/base/userPrize/userPrize.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/system-admin/version', {//版本管理后台
        templateUrl: 'partials/admin/version.html?' + new Date().getTime(),
        controller: ''
    }).when('/version-show', {//版本管理前台
        templateUrl: 'partials/admin/versionShow.html?' + new Date().getTime(),
        controller: 'VersionShowController'
    }).when('/hr-admin', {
        templateUrl: 'partials/hr/hr.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/hr-admin/department', {
        templateUrl: 'partials/hr/department/departments.html?' + new Date().getTime(),
        controller: 'DepartmentManagementController'
    }).when('/hr-admin/changePersonalInfo/:userId', {
        ///sos_admin/customer_student_course/:id/:type
        templateUrl: 'partials/change-personal-info.html?' + new Date().getTime(),
        controller: 'EmployeeManagementController'
    }).when('/hr-admin/employee', {
        templateUrl: 'partials/hr/employee/employees.html?' + new Date().getTime(),
        controller: 'EmployeeManagementController'
    }).when('/hr-admin/payroll', {
        // 工资条
        templateUrl: 'partials/hr/employee/payroll/index.html?' + new Date().getTime(),
        controller: 'EmployeePayrollController'
    }).when('/hr-admin/payroll/:id/:type', {
        // 工资条查看或者編輯,传工资条id，type:查看（detail）|编辑（update）
        templateUrl: 'partials/hr/employee/payroll/edit.html?' + new Date().getTime(),
        controller: 'EmployeePayrollController'
    }).when('/hr-admin/payroll/me', {
        // 查看我的工资条
        templateUrl: 'partials/hr/employee/payroll/me.html?' + new Date().getTime(),
        controller: 'EmployeePayrollController'
    }).when('/hr-admin/employee/:type', {
        templateUrl: 'partials/hr/employee/employees.html?' + new Date().getTime(),
        controller: 'EmployeeManagementController'
    }).when('/hr-admin/dimission', {
        templateUrl: 'partials/hr/employee/dimissionEmployee.html?' + new Date().getTime(),
        controller: 'EmployeeManagementController'
    }).//异动管理2

    when('/hr-admin/change', {
        templateUrl: 'partials/hr/employee/employee-changes.html?' + new Date().getTime(),
        controller: 'ChangeManagementController'
    }).//岗位管理
    when('/hr-admin/positionManagement', {
        templateUrl: 'partials/hr/position/positionManagement.html?' + new Date().getTime(),
        controller: 'PositionManagementController'
    }).//人员角色管理
    when('/hr-admin/employeeRole', {
        templateUrl: 'partials/hr/employee/employeeRole.html?' + new Date().getTime(),
        controller: 'EmployeeRoleController'
    }).//岗位角色管理
    when('/hr-admin/positionRole', {
        templateUrl: 'partials/hr/position/positionRole.html?' + new Date().getTime(),
        controller: 'PositionRoleController'
    }).//字典表管理
    when('/hr-admin/dictionaryManagement', {
        templateUrl: 'partials/hr/dictionary/dictionary.html?' + new Date().getTime(),
        controller: 'DictionaryController'
    }).//培训类别管理
    when('/hr-admin/trainingTypeManagement', {
        templateUrl: 'partials/hr/training/trainingTypeManagement.html?' + new Date().getTime(),
        controller: 'TrainingManagementController'
    }).//培训管理
    when('/hr-admin/trainingManagement', {
        templateUrl: 'partials/hr/training/trainingManagement.html?' + new Date().getTime(),
        controller: 'TrainingManagementController'
    }).//个人培训中心
    when('/hr-admin/personalTrainingCenter', {
        templateUrl: 'partials/hr/training/personalTrainingCenter.html?' + new Date().getTime(),
        controller: 'TrainingManagementController'
    }).//人才管理
    when('/hr-admin/talentManagement', {
        templateUrl: 'partials/hr/talent/talent.html?' + new Date().getTime(),
        controller: 'TalentManagementController'
    }).when('/hr-admin/talentManagement/:type', {////打开 弹窗添加人才 medal
        templateUrl: 'partials/hr/talent/talent.html?' + new Date().getTime(),
        controller: 'TalentManagementController'
    }).//招聘管理
    when('/hr-admin/recruitmentManagement', {
        templateUrl: 'partials/hr/recruitment/recruitmentManagement.html?' + new Date().getTime(),
        controller: 'RecruitmentManagementController'
    }).when('/hr-admin/recruitmentTalent/:recruitmentId', {
        templateUrl: 'partials/hr/recruitment/recruitmentTalent.html?' + new Date().getTime(),
        controller: 'RecruitmentTalentController'
    }).when('/hr-admin/recruitmentTalentDetail/:talentId/:recruitmentId', {
        templateUrl: 'partials/hr/recruitment/talent.detail.html?' + new Date().getTime(),
        controller: 'RecruitmentTalentController'
    }).when('/hr-admin/RecruitmentTeamDataStatistics', {
        templateUrl: 'partials/hr/talent/RecruitmentTeamDataStatistics.html?' + new Date().getTime(),
        controller: 'TalentManagementController'
    }).when('/hr-admin/RecruitmentPersonalDataStatistics', {
        templateUrl: 'partials/hr/talent/RecruitmentPersonalDataStatistics.html?' + new Date().getTime(),
        controller: 'TalentManagementController'
    }).when('/hr-admin/salaryBasic', {
        templateUrl: 'partials/hr/wagBasicData/wagBasicData.index.html?' + new Date().getTime(),
        controller: 'WagBasicDataController'
    }).when('/hr-admin/empSalaryBasic/:departmentId', {
        templateUrl: 'partials/hr/wagBasicData/wagEmpBasis.html?' + new Date().getTime(),
        controller: 'WagClassTimeDetailController'
    }).when('/salary-manager', {
        templateUrl: 'partials/salary/salary.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/salary-manager/salaryBasic', {
        templateUrl: 'partials/salary/wagBasicData/BasicDataCollect.html?' + new Date().getTime(),
        controller: 'WagBasicDataController'
    })./*when('/salary-manager/salaryBasic',{
         templateUrl: 'partials/salary/wagBasicData/wagBasicData.index.html?'+new Date().getTime(),
         controller: 'WagBasicDataController'
         }).*/
    when('/salary-manager/empSalaryBasic/:departmentId', {
        templateUrl: 'partials/salary/wagBasicData/wagEmpBasis.html?' + new Date().getTime(),
        controller: 'WagClassTimeDetailController'
    }).when('/', {
        templateUrl: 'partials/v3.index/index.html?' + new Date().getTime(),
        controller: ''
    }).when('/sos-admin', {
        //redirectTo:'/crm-admin/leads_student'
        templateUrl: 'partials/sos/sos.index.guide.html?' + new Date().getTime()
    }).when('/fb-admin', {
        templateUrl: 'partials/sos/fb.index.guide.html?' + new Date().getTime()
    }).when('/sos-admin/invitationCommunication', {
        templateUrl: 'partials/sos/invitationCommunication/invitationCommunications.html?' + new Date().getTime(),
        controller: 'InvitationCommunicationController'
    }).when('/fb-admin/invitationDetail', {
        templateUrl: 'partials/sos/invitationDetail/invitationDetails.html?' + new Date().getTime(),
        controller: 'InvitationDetailController'
    }).when('/fb-admin/InvitationChild', {
        templateUrl: 'partials/sos/invitationDetail/invitationDetails.html?' + new Date().getTime(),
        controller: 'InvitationDetailController'
    }).when('/fb-admin/InvitationChild/:type', {
        templateUrl: 'partials/sos/invitationDetail/invitationDetails.html?' + new Date().getTime(),
        controller: 'InvitationDetailController'
    }).when('/fb-admin/InvitationBrandZB', {
        templateUrl: 'partials/sos/invitationDetail/invitationDetailsBrand.html?' + new Date().getTime(),
        controller: 'InvitationDetailController'
    }).when('/fb-admin/InvitationBrandXQ', {
        templateUrl: 'partials/sos/invitationDetail/invitationDetailsBrandOther.html?' + new Date().getTime(),
        controller: 'InvitationDetailController'
    }).when('/fb-admin/leads_student_myself', {
        templateUrl: 'partials/sos/leads/list.myself.html?' + new Date().getTime(),
        controller: 'LeadsStudentController'
    }).when('/fb-admin/leads_student_myself/:leads_id', {
        templateUrl: 'partials/sos/leads/list.myself.html?' + new Date().getTime(),
        controller: 'LeadsStudentController'
    }).when('/fb-admin/leads_student', {
        templateUrl: 'partials/sos/leads/list.html?' + new Date().getTime(),
        controller: 'LeadsStudentController'
    }).when('/fb-admin/special_distribute', {
        templateUrl: 'partials/sos/leads/list.special.html?' + new Date().getTime(),
        controller: 'LeadsStudentController'
    }).when('/fb-admin/batch_special_distribute', {
        templateUrl: 'partials/sos/leads/list.special.batch.html?' + new Date().getTime(),
        controller: 'LeadsStudentController'
    }).when('/fb-admin/mine_special_distribute', {
        templateUrl: 'partials/sos/leads/list.mine.special.html?' + new Date().getTime(),
        controller: 'LeadsStudentController'
    }).when('/fb-admin/mine_batch_special_distribute', {
        templateUrl: 'partials/sos/leads/list.mine.special.batch.html?' + new Date().getTime(),
        controller: 'LeadsStudentController'
    }).when('/fb-admin/leads_student/:leads_id', {
        templateUrl: 'partials/sos/leads/list.html?' + new Date().getTime(),
        controller: 'LeadsStudentController'
    }).when('/fb-admin/leads_student_receive', {
        templateUrl: 'partials/sos/leads/list.receive.html?' + new Date().getTime(),
        controller: 'LeadsStudentController'
    }).when('/fb-admin/leads_student_zongbu', {
        templateUrl: 'partials/sos/leads/list.zongbu.html?' + new Date().getTime(),
        controller: 'LeadsStudentController'
    }).when('/fb-admin/leads_student_allot', {
        templateUrl: 'partials/sos/leads/list.allot.html?' + new Date().getTime(),
        controller: 'LeadsStudentController'
    }).when('/fb-admin/leads_student/:leads_id', {
        templateUrl: 'partials/sos/leads/list.html?' + new Date().getTime(),
        controller: 'LeadsStudentController'
    }).when('/fb-admin/leads_student_receive', {
        templateUrl: 'partials/sos/leads/list.receive.html?' + new Date().getTime(),
        controller: 'LeadsStudentController'
    }).when('/fb-admin/leads_student_zongbu', {
        templateUrl: 'partials/sos/leads/list.zongbu.html?' + new Date().getTime(),
        controller: 'LeadsStudentController'
    }).when('/fb-admin/leads_student_allot', {
        templateUrl: 'partials/sos/leads/list.allot.html?' + new Date().getTime(),
        controller: 'LeadsStudentController'
    }).when('/sos-admin/customer_student', {
        templateUrl: 'partials/sos/customer/list.html?' + new Date().getTime(),
        controller: 'CustomerStudentController'
    }).when('/sos-admin/customer_group', {
        templateUrl: 'partials/sos/customer/list.group.html?' + new Date().getTime(),
        controller: 'CustomerStudentController'
    }).when('/sos-admin/customer_group/:group_id', {
        templateUrl: 'partials/sos/customer/list.group.html?' + new Date().getTime(),
        controller: 'CustomerStudentController'
    }).when('/sos-admin/customer_student/:student_id', {
        templateUrl: 'partials/sos/customer/list.html?' + new Date().getTime(),
        controller: 'CustomerStudentController'
    }).when('/sos-admin/customer_student/:type/:student_id/:phone', {
        templateUrl: 'partials/sos/customer/list.html?' + new Date().getTime(),
        controller: 'CustomerStudentController'
    }).when('/fb-admin/order', {
        templateUrl: 'partials/sos/order/list.html?' + new Date().getTime(),
        controller: 'OrderManagementController'
    }).when('/sos-admin/orderData', {
        templateUrl: 'partials/sos/order/listData.html?' + new Date().getTime(),
        controller: 'OrderDataManagementController'
    }).when('/fb-admin/changePlatform', {
        templateUrl: 'partials/sos/order/crmChangePlatform.list.html?' + new Date().getTime(),
        controller: 'CrmChangePlatformController'
    }).when('/fb-admin/order/:type', {
        templateUrl: 'partials/sos/order/list.html?' + new Date().getTime(),
        controller: 'OrderManagementController'
    }).when('/fb-admin/orderRestitution', {
        templateUrl: 'partials/sos/order/list.restitution.html?' + new Date().getTime(),
        controller: 'OrderManagementController'
    }).when('/fb-admin/orderTransfer', {
        templateUrl: 'partials/sos/order/list.transfer.html?' + new Date().getTime(),
        controller: 'OrderManagementController'
    }).when('/fb-admin/paymentRecord', {
        templateUrl: 'partials/sos/order/paymentRecord.html?' + new Date().getTime(),
        controller: 'OrderManagementController'
    }).when('/sos-admin/refund', {
        templateUrl: 'partials/sos/refund/list.html?' + new Date().getTime(),
        controller: 'RefundManagementController'
    }).when('/sos-admin/carryForward', {
        templateUrl: 'partials/sos/order/carryForwardList.html?' + new Date().getTime(),
        controller: 'OrderManagementController'
    }).when('/sos-admin/teacher', {
        templateUrl: 'partials/sos/teacher/list.html?' + new Date().getTime(),
        controller: 'TeacherManagementController'
    }).when('/sos-admin/teacher/edit/:teacherId', {
        templateUrl: 'partials/sos/teacher/edit.html?' + new Date().getTime(),
        controller: 'TeacherManagementController'
    })./* when('/crm/lead', {
         templateUrl: 'partials/hr/employees.html?'+new Date().getTime(),
         controller: 'LeadsManagementController'
         }).*/
    when('/sos_admin/customer_student_course/:id/:type', {
        templateUrl: 'partials/sos/customer/students.coursePlanInfo.html?' + new Date().getTime(),
        controller: 'CustomerStudentCourseController'
    })./*          //运营管理
         when('/sos-admin',{
         templateUrl: 'partials/sos/oms.index.html?'+new Date().getTime(),
         controller: 'OmsIndexController'
         }).*/

    when('/sos-admin/product', {
        templateUrl: 'partials/sos/product/index.html?' + new Date().getTime(),
        controller: 'ProductController'
    }).when('/sos-admin/product_onLine', {
        templateUrl: 'partials/sos/product/index_onLine.html?' + new Date().getTime(),
        controller: 'ProductController'
    }).when('/sos-admin/course_plan', {
        templateUrl: 'partials/sos/coursePlan/record.html?' + new Date().getTime(),
        controller: 'CoursePlanController'
    }).when('/sos-admin/class_hour_warning', {
        templateUrl: 'partials/sos/coursePlan/classHourWarning.html?' + new Date().getTime()
    }).when('/sos-admin/group_course_plan', {
        templateUrl: 'partials/sos/coursePlan/coursePlanrecord.html?' + new Date().getTime(),
        controller: 'CoursePlanController'
    }).when('/sos-admin/class_course_plan', {
        templateUrl: 'partials/sos/coursePlan/classCoursePlanrecord.html?' + new Date().getTime(),
        controller: 'CoursePlanController'
    }).when('/sos-admin/snp_course_plan_list', {
        templateUrl: 'partials/sos/coursePlan/snpClassCoursePlanrecord.html?' + new Date().getTime(),
        controller: 'SNPCoursePlanController'
    }).when('/sos-admin/activity_course_plan', {
        templateUrl: 'partials/sos/coursePlan/ActivityCoursePlan.html?' + new Date().getTime(),
        controller: 'CoursePlanController'
    }).when('/sos-admin/supplement_course', {
        templateUrl: 'partials/sos/coursePlan/supplementCourseList.html?' + new Date().getTime(),
        controller: 'CoursePlanController'
    }).when('/fb-admin/CoursePlan_Listen', {
        templateUrl: 'partials/sos/invitationDetail/CoursePlanListen.html?' + new Date().getTime(),
        controller: 'CoursePlanController'
    }).when('/fb-admin/CoursePlan_Listenmore', {
        templateUrl: 'partials/sos/invitationDetail/CoursePlanListenMultiple.html?' + new Date().getTime(),
        controller: 'CoursePlanMultipleController'
    }).when('/fb-admin/CoursePlan_Listen/:omsCoursePlanId', {
        templateUrl: 'partials/sos/invitationDetail/CoursePlanListen.html?' + new Date().getTime(),
        controller: 'CoursePlanController'
    }).when('/sos-admin/teacher_unavailable_time', {
        templateUrl: 'partials/sos/coursePlan/teacherUnavailableTime.html?' + new Date().getTime(),
        controller: 'TeacherUnavailableController'
    }).when('/sos-admin/course_plan/:type', {
        templateUrl: 'partials/sos/coursePlan/record.html?' + new Date().getTime(),
        controller: 'CoursePlanController'
    }).when('/sos-admin/course_plan/plan/:id/:type', {
        templateUrl: 'partials/sos/coursePlan/plan.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/sos-admin/teacher_times', {//显示 teachers 的排课时间
        templateUrl: 'partials/sos/coursePlan/teacherTimes.html?' + new Date().getTime(),
        controller: ''
    }).when('/sos-admin/school_times', {//显示 校区 的排课时间
        templateUrl: 'partials/sos/coursePlan/schoolTimes.html?' + new Date().getTime(),
        controller: ''
    }).when('/fb-admin/teacher_times', {//显示 teachers 的排课时间@李世明 2016-10-13 页面从原来的partials/sos/invitationDetail/teacherTimes.html改为现在的partials/sos/coursePlan/teacherTimes.html
        templateUrl: 'partials/sos/coursePlan/teacherTimes.html?' + new Date().getTime(),
        controller: ''
    }).when('/sos-admin/teacher_times_id/:id/:name', {//显示 teachers 的排课时间
        templateUrl: 'partials/sos/coursePlan/teacherTimes.html?' + new Date().getTime(),
        controller: ''
    }).when('/sos-admin/customer_times/:flag', {//显示 学员 的排课时间，flag区分要返回的页面
        templateUrl: 'partials/sos/coursePlan/customerTimes.html?' + new Date().getTime(),
        controller: ''
    }).when('/sos-admin/customer_times_id/:id/:name', {//显示 学员 的排课时间，flag区分要返回的页面
        templateUrl: 'partials/sos/coursePlan/customerTimes.html?' + new Date().getTime(),
        controller: ''
    }).when('/sos-admin/class', {//班级管理
        templateUrl: 'partials/sos/class/list.html?' + new Date().getTime(),
        controller: 'ClassManagementController'
    }).when('/sos-admin/snp_class', { // 托管班管理
        templateUrl: 'partials/sos/class/list-snp.html?' + new Date().getTime(),
        controller: 'SNPClassManagementController'
    }).when('/sos-admin/chargingScheme', {//计费方案
        templateUrl: 'partials/sos/crmChargingScheme/crmChargingScheme.index.html?' + new Date().getTime(),
        controller: 'CrmChargingSchemeController'
    }).when('/personal-admin', {//个人中心
        templateUrl: 'partials/pc/pc.index.html?' + new Date().getTime()
    }).when('/personal-admin/PersonalHandouts', {//个人备课笔记
        templateUrl: 'partials/pc/personalHandouts.html?' + new Date().getTime(),
        controller: 'PersonalCenterController'
    }).when('/personal-admin/PersonalHomework', {//个人作业库
        templateUrl: 'partials/pc/personalHomework.html?' + new Date().getTime(),
        controller: 'PersonalCenterController'
    }).//校区目标
    when('/fb-admin/schoolGoalEntrance/', {
        templateUrl: 'partials/sos/fb.index.guide.html?' + new Date().getTime(),
        controller: 'SchoolGoalController'
    }).when('/fb-admin/classExperience', {//体验课管理
        templateUrl: 'partials/sos/class/experience/list.html?' + new Date().getTime(),
        controller: ''
    }).// o2o
    when('/o2o-admin', {
        templateUrl: 'partials/o2o/o2o.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/o2o-admin/order', {
        templateUrl: 'partials/o2o/order/list.html?' + new Date().getTime(),
        controller: 'O2oOrderManagementController'
    }).when('/o2o-admin/o2ocourse_plan', {
        templateUrl: 'partials/o2o/coursePlan/record.html?' + new Date().getTime(),
        controller: 'O2oCoursePlanController'
    }).//when('/o2o-admin/coupon',{
    //  templateUrl: 'partials/o2o/coupon/list.html?'+new Date().getTime(),
    //  controller: ''
    //}).
    when('/o2o-admin/coupon', {
        templateUrl: 'partials/o2o/coupon/list2.html?' + new Date().getTime(),
        controller: 'CouponControllerV2'
    }).when('/o2o-admin/coupon/edit/:id', {
        templateUrl: 'partials/o2o/coupon/add2.html?' + new Date().getTime(),
        controller: 'CouponControllerV2Add'
    }).when('/o2o-admin/coupon/view/:id', {
        templateUrl: 'partials/o2o/coupon/view.html?' + new Date().getTime(),
        controller: 'CouponControllerV2Add'
    }).when('/o2o-admin/membershipCard', {
        templateUrl: 'partials/o2o/membershipCard/list.html?' + new Date().getTime(),
        controller: ''
    }).when('/o2o-admin/info', {
        templateUrl: 'partials/o2o/info/index.html?' + new Date().getTime(),
        controller: ''
    }).when('/o2o-admin/Course', {
        templateUrl: 'partials/o2o/info/InfoCourse.html?' + new Date().getTime(),
        controller: ''
    }).when('/o2o-admin/integral', {
        templateUrl: 'partials/o2o/info/integral.html?' + new Date().getTime(),
        controller: ''
    }).when('/bd-admin', {
        //redirectTo:'/bd-admin/'
        templateUrl: 'partials/bd/bd.index.html?' + new Date().getTime()
    }).when('/bd-admin/leads_list', {
        templateUrl: 'partials/bd/leads/list.html?' + new Date().getTime(),
        controller: 'BdLeadsController'
    }).when('/bd-admin/leads_list/:bak', {
        templateUrl: 'partials/bd/leads/list.html?' + new Date().getTime(),
        controller: 'BdLeadsController'
    }).when('/bd-admin/lead/:id', {
        templateUrl: 'partials/bd/leads/lead.html?' + new Date().getTime(),
        controller: 'BdLeadController'
    }).when('/bd-admin/lead/:id/:bak', {
        templateUrl: 'partials/bd/leads/lead.html?' + new Date().getTime(),
        controller: 'BdLeadController'
    }).when('/bd-admin/lead_edit/:id', {
        templateUrl: 'partials/bd/leads/lead_edit.html?' + new Date().getTime(),
        controller: 'BdLeadEditController'
    }).when('/bd-admin/lead_edit/:id/:bak', {
        templateUrl: 'partials/bd/leads/lead_edit.html?' + new Date().getTime(),
        controller: 'BdLeadEditController'
    }).when('/bd-admin/invitation_list', {
        templateUrl: 'partials/bd/invitation/list.html?' + new Date().getTime(),
        controller: 'BdInvitationController'
    }).when('/bd-admin/franchiser_list', {
        templateUrl: 'partials/bd/franchiser/list.html?' + new Date().getTime(),
        controller: 'BdFranchisersController'
    }).when('/bd-admin/franchiser/:id', {
        templateUrl: 'partials/bd/franchiser/franchiser.html?' + new Date().getTime(),
        controller: 'BdFranchiserController'
    }).when('/bd-admin/franchiser_edit/:id', {
        templateUrl: 'partials/bd/franchiser/franchiser_edit.html?' + new Date().getTime(),
        controller: 'BdFranchiserEditController'
    }).when('/application/:id', {
        templateUrl: 'partials/application.html?' + new Date().getTime(),
        controller: 'BdApplicationEditController'
    }).when('/bd-admin/application_detail/:id', {
        templateUrl: 'partials/bd/application/view.html?' + new Date().getTime(),
        controller: 'BdApplicationController'
    }).//文件管理
    when('/file-admin', {
        templateUrl: 'finder/fileManagement.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/file-admin/file_management', {
        templateUrl: 'finder/fileManagement.html?' + new Date().getTime(),
        controller: ''
    }).//数据统计分析
    when('/bi-admin/', {
        templateUrl: 'partials/bi/bi.index.html?' + new Date().getTime(),
        controller: ''
    }).//渠道签约
    when('/bi-admin/channelOrder', {
        templateUrl: 'partials/bi/biChannelOrder/biChannelOrder.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/bi-admin/gradeOrder', {
        templateUrl: 'partials/bi/biGradeOrder/biGradeOrder.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/bi-admin/channelGrade', {
        templateUrl: 'partials/bi/biChannelGrade/biChannelGrade.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/bi-admin/gradeStatistics', {
        templateUrl: 'partials/bi/biChannelGrade/biGradeStatistics.index.html?' + new Date().getTime(),
        controller: ''
    }).//续推消课
    when('/bi-admin/continuousConsumeCourse', {
        templateUrl: 'partials/bi/biContinuousConsumeCourse/biContinuousConsumeCourse.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/bi-admin/gradeSubjectConsume', {
        templateUrl: 'partials/bi/biGradeSubjectConsume/biGradeSubjectConsume.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/bi-admin/education_colligate', {
        templateUrl: 'partials/bi/biEducationColligateCourse/biEducationColligateCourse.index.html?' + new Date().getTime(),
        controller: 'BiEducationColligateCourseController'
    }).when('/bi-admin/biClassTeachingManagement', {
        templateUrl: 'partials/bi/biClassTeachingManagement/biClassTeachingManagement.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/bi-admin/biRetentionRecommendation', {
        templateUrl: 'partials/bi/biRetentionRecommendation/biRetentionRecommendation.index.html?' + new Date().getTime(),
        controller: ''
    }).//产品统计
    when('/bi-admin/productOrder', {
        templateUrl: 'partials/bi/biProductOrder/biProductOrder.index.html?' + new Date().getTime(),
        controller: ''
    }).//外呼统计
    when('/bi-admin/communication', {
        templateUrl: 'partials/bi/biCommunication/biCommunication.index.html?' + new Date().getTime(),
        controller: ''
    }).//课程顾问业绩
    when('/bi-admin/courseAdvisorProcess', {
        templateUrl: 'partials/bi/biCourseAdvisorProcess/biCourseAdvisorProcess.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/bi-admin/marketerAchievement', {
        templateUrl: 'partials/bi/biMarketerAchievement/biMarketerAchievement.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/bi-admin/studentTeacherCommunication', {
        templateUrl: 'partials/bi/studentTeacherCommunication/studentTeacherCommunication.index.html?' + new Date().getTime(),
        controller: 'BiStudentTeacherCommunicationController'
    }).when('/bi-admin/invitation', {
        templateUrl: 'partials/bi/biInvitation/biInvitation.index.html?' + new Date().getTime(),
        controller: 'BiInvitationController'
    }).when('/bi-admin/learningComment', {
        templateUrl: 'partials/bi/biLearningComment/biLearningComment.index.html?' + new Date().getTime(),
        controller: 'BiLearningCommentController'
    }).//O2O用户统计
    when('/bi-admin/o2oNum', {
        templateUrl: 'partials/bi/biO2oNum/biO2oNum.index.html?' + new Date().getTime(),
        controller: ''
    }).//O2O订单统计
    when('/bi-admin/o2oOrder', {
        templateUrl: 'partials/bi/biO2oOrder/biO2oOrder.index.html?' + new Date().getTime(),
        controller: ''
    }).//学管业绩
    when('/bi-admin/schoolManagementPerformence', {
        templateUrl: 'partials/bi/biSchoolManagementPerformence/biSchoolManagementPerformence.index.html?' + new Date().getTime(),
        controller: ''
    }).//一对一校区业绩
    when('/bi-admin/schoolPerformence', {
        templateUrl: 'partials/bi/biSchoolPerformence/biSchoolPerformence.index.html?' + new Date().getTime(),
        controller: ''
    }).//一对一校区进度
    when('/bi-admin/schoolPerformenceProgress', {
        templateUrl: 'partials/bi/biSchoolPerformenceProgress/biSchoolPerformenceProgress.index.html?' + new Date().getTime(),
        controller: ''
    }).//素养业绩
    when('/bi-admin/schoolPerformenceForSY', {
        templateUrl: 'partials/bi/biSchoolPerformence/biSchoolPerformenceForSY.index.html?' + new Date().getTime(),
        controller: ''
    }).//素养进度
    when('/bi-admin/schoolPerformenceProgressForSY', {
        templateUrl: 'partials/bi/biSchoolPerformenceProgress/biSchoolPerformenceProgress.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/bi-admin/classHour', {
        templateUrl: 'partials/bi/biClassHour/biClassHour.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/bi-admin/schoolLeads', {
        templateUrl: 'partials/bi/biSchoolLeads/biSchoolLeads.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/bi-admin/consumeAnalysis', {
        templateUrl: 'partials/bi/biConsumeAnalysis/biConsumeAnalysis.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/bi-admin/teacherConsumeAnalysis', {
        templateUrl: 'partials/bi/biTeacherConsumeAnalysis/biTeacherConsumeAnalysis.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/bi-admin/classCourse', {
        templateUrl: 'partials/bi/biClassCourse/biClassCourse.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/bi-admin/teacherConsumeReport', {
        templateUrl: 'partials/bi/biTeacherReport/biTeacherReport.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/bi-admin/subjectGroupReport', {
        templateUrl: 'partials/bi/biTeacherReport/biSubjectGroup.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/bi-admin/teacherConsumeMonthlyReport', {
        templateUrl: 'partials/bi/biTeacherMonthlyReport/biTeacherMonthlyReport.index.html?' + new Date().getTime(),
        controller: ''
    }).//客户来源分布
    when('/bi-admin/customerSourceDistribution', {
        templateUrl: 'partials/bi/biCustomerSourceDistribution/biCustomerSourceDistribution.index.html?' + new Date().getTime(),
        controller: ''
    }).//外呼统计
    when('/bi-admin/outboundPhoneStatistics', {
        templateUrl: 'partials/bi/biOutboundPhoneStatistics/biOutboundPhoneStatistics.index.html?' + new Date().getTime(),
        controller: 'BiOutboundPhoneController'
    }).//一对一校区确认收入统计
    when('/bi-admin/confirmIncome', {
        templateUrl: 'partials/bi/biConfirmIncome/biConfirmIncome.index.html?' + new Date().getTime(),
        controller: ''
    })./* 帮助管理**/
    when('/help', {
        templateUrl: 'partials/help/help.html?' + new Date().getTime(),
        controller: 'helpController'
    }).when('/event', {
        templateUrl: 'partials/event/event.html?' + new Date().getTime(),
        controller: 'eventController'
    }).
    /**工作流**/
    when('/workflowManager-admin', {
        templateUrl: 'partials/workFlow/workFlow.index.html?' + new Date().getTime(),
        controller: ''
    }).when('/workflowManager-admin/all_workflow', {
        templateUrl: 'partials/workFlow/all/list.html?' + new Date().getTime(),
        controller: ''
    }).when('/workflowManager-admin/detail_workflow/:id/:type', {
        templateUrl: 'partials/workFlow/detail.html?' + new Date().getTime(),
        controller: ''
    }).when('/workflowManager-admin/detail_workflow/:id', {
        templateUrl: 'partials/workFlow/detail.html?' + new Date().getTime(),
        controller: ''
    }).when('/workflowManager-admin/sponsor_workflow', {
        templateUrl: 'partials/workFlow/sponsor/list.html?' + new Date().getTime(),
        controller: ''
    }).when('/workflowManager-admin/solve_workflow', {
        templateUrl: 'partials/workFlow/solve/list.html?' + new Date().getTime(),
        controller: ''
    }).when('/workflowManager-admin/star_workflow', {
        templateUrl: 'partials/workFlow/star/list.html?' + new Date().getTime(),
        controller: ''
    }).when('/workflowManager-admin/add_workflow', {
        templateUrl: 'partials/workFlow/add/add.html?' + new Date().getTime(),
        controller: ''
    }).when('/mobile/user', {
        templateUrl: 'partials/mobile/user.html?' + new Date().getTime(),
        controller: ''
    }).when('/mobile/callConsole/:phone/:status/:crm_student_id', {
        templateUrl: 'partials/mobile/callConsole.html?' + new Date().getTime(),
        controller: ''
    })./*教研系统路由*/
    when('/tars', {
        templateUrl: 'partials/tars/index.html?' + new Date().getTime()
    }).when('/tars/que/lib', {
        templateUrl: 'partials/tars/pre.notes/index.html?' + new Date().getTime(),
        controller: ''
    }).when('/tars/paper/lib', {
        templateUrl: 'partials/tars/paper.lib/index.html?' + new Date().getTime(),
        controller: ''
    }).when('/tars/my/que', {
        templateUrl: 'partials/tars/my.que/index.html?' + new Date().getTime(),
        controller: ''
    }).when('/tars/pre/notes', {
        templateUrl: 'partials/tars/pre.notes/index.html?' + new Date().getTime(),
        controller: ''
    }).otherwise({
        redirectTo: '/login'
    });

}]);

ywsApp.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider.setStorageType('sessionStorage');//将localStorage改为sessionStorage
    localStorageServiceProvider.setPrefix('com.youwin.yws');
}]);

ywsApp.config(['calendarConfig', function (calendarConfig) {
    moment.locale('zh-cn');
    calendarConfig.dateFormatter = 'moment';
    calendarConfig.i18nStrings.weekNumber = '第{week}周';
}]);

/**
 * http 拦截器
 * cy 对于静态资源缓存问题处理  是在服务器 通过运维手段控制 当前设置为：不缓存任何
 */
ywsApp.factory('httpRequestInterceptor', function (localStorageService, $base64, $location, $q) {
    return {
        'request': function (config) {
            if ($location.url().indexOf('/application') == -1) {//处理 白名单
                var user = localStorageService.get('user');
                var token = localStorageService.get('token');
                if (!user || !token) {
                    delete config.headers['Authorization'];
                    localStorageService.clearAll();
                    $location.url('/login');
                } else {
                    config.headers['Authorization'] = 'bearer ' + $base64.encode(user.account + ':' + token);
                }
            }
            //config.url = config.url +'?v='+new Date().getTime();
            if (!angular.element('.mt-slide').length) {
                //  关闭数说定时器
                try {
                    if (setLetBegin == null && config.url.indexOf('/dataCount') > -1) {
                        return false
                    }
                    clearInterval(setLetBegin)
                    setLetBegin = null
                } catch (e) {
                }
            }
            return config;
        },
        'response': function (response) {
            var isTimeout = false;
            var timestamp = localStorageService.get('timestamp');
            if (check_null(timestamp) && timestamp + 1000 * 60 * 60 * 6 < new Date().getTime()) {//判断是否超时
                isTimeout = true;

            }
            if (($location.url().indexOf('/application') == -1) && isTimeout) {//处理 白名单
                delete response.headers['Authorization'];
                localStorageService.clearAll();//清空所有的
                $location.url('/login');//跳转到登陆页面
                localStorageService.set('isTimeout', true);//
            }
            localStorageService.set('timestamp', new Date().getTime());//记录当前时间戳
            return response;
        },
        'responseError': function (response) {
            debugger
            return $q.reject(response);
            /*if(response.status != 200){
             if($location.url() != '/login'){
             delete response.headers['Authorization'];
             localStorageService.clearAll();
             $location.url('/login');
             localStorageService.set('isTimeout',true);
             var deferred = $q.defer(),
             req = {
             config: response.config,
             deferred: deferred
             };
             $rootScope.$broadcast('event:loginRequired');
             return deferred.promise;
             }
             return $q.reject(response);
             }*/
        }
    };
});

/**
 * loading 拦截器
 */
ywsApp.factory('loadingInterceptor', ['$rootScope', '$timeout', '$location', '$q', function ($rootScope, $timeout, $location, $q) {
    $rootScope.app = {
        counterRequest: 1,
        counterResponse: 1
    };
    var responseLoading = function () {
        $timeout(function () {
            if ($rootScope.app.counterResponse >= $rootScope.app.counterRequest) {
                $rootScope.ywsLoading = false;
            }
        }, 500);
        //console.log($location.url());
        if ($location.url() == '/') {
            $timeout(function () {
                $rootScope.ywsLoading = false;
            }, 0);
        }

    };
    var loadingInterceptor = {
        request: function (config) {
            $rootScope.app.counterRequest += 1;
            if ($location.url() != '/login' && config.url.indexOf('/dataCount') == -1 && config.url.indexOf('partials/sos/coursePlan/modal.planTimeDetail.html') == -1) {//设置白名单
                $rootScope.ywsLoading = true;
            } else {
                $rootScope.ywsLoading = false;
            }
            if (config.url.indexOf("/queryByModel") > -1 || (config.url.indexOf("/orders") > -1 && config.url.indexOf("total") > -1)) {
                $rootScope.ywsLoading = false
                $rootScope.uploadLoading = true
            }
            //console.log($rootScope.app.counterRequest+'---'+$rootScope.ywsLoading);
            //config.requestTimestamp = new Date().getTime();
            return config;
        },
        response: function (response) {
            $rootScope.app.counterResponse += 1;
            responseLoading();
            $rootScope.uploadLoading = false
            //console.log($rootScope.app.counterResponse+'---'+$rootScope.ywsLoading);
            //response.config.responseTimestamp = new Date().getTime();
            return response;
        },
        requestError: function (config) {
            $rootScope.ywsLoading = false;
            $rootScope.uploadLoading = false
            return $q.reject(response);
        },
        responseError: function (response) {
            $rootScope.ywsLoading = false;
            $rootScope.uploadLoading = false
            $rootScope.app.counterRequest = 0;
            return $q.reject(response);
        }

    };
    return loadingInterceptor;
}]);
ywsApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
    $httpProvider.interceptors.push('loadingInterceptor');
    //     $httpProvider.defaults.headers["api-token"] = "a6gi7md3d2c7d97nt31c08hf9k";
}]);

ywsApp.config(['ChartJsProvider', function (ChartJsProvider) {
    ChartJsProvider.setOptions({maintainAspectRatio: false});
}]);

ywsApp.run(function (AuthenticationService, $location, $rootScope, config, $http, $modal, SweetAlert, localStorageService, EmployeeService, ProductService, $window) {

    /**
     * Composes the menu from user's roles.
     *
     * @param path the path of the new page, used to set the current active menu item
     * @return an object representing the menu structure
     */
    function composeMenu(path) {
        //before composes the menu, refresh the currentUser
        $rootScope.currentUser = AuthenticationService.currentUser();
        $rootScope.hasRightToSwitchSchool = false;
        $rootScope.currentUser.roles.forEach(function (i, index) {
            i.permissions.forEach(function (j) {
                if (j.name == 'ChooseSchoolLogin') {
                    $rootScope.hasRightToSwitchSchool = true;
                }
            })
        })


        var menu = [];
        menu.push({
            text: '首页',
            href: '#/',
            active: path === '/'
        });

        // var currentRole = null;
        var currentPermission = null;
        //先获取当前用户的所有角色的所有权限，取并集，无重复
        var permissionList = [];
        angular.forEach(AuthenticationService.currentUser().roles, function (role) {
            angular.forEach(role.permissions, function (permission) {
                var exist = false;
                angular.forEach(permissionList, function (element) {
                    if (element.name === permission.name) {
                        exist = true;
                    }
                });
                if (exist == false) {
                    permissionList.push(permission);
                }
                exist = false;
            })
        });
        //根据角色的权限遍历一级菜单，将其加入menu
        if (path.indexOf("/sos_admin/customer_student_course") === 0 || path.indexOf("/sos-admin/course_plan/plan") === 0) {
            var arry = path.split("/");
            // 进入到leads菜单，否则进入学员菜单
            if (3 == arry[arry.length - 1]) {
                path = "/fb-admin/leads_student";
            } else {
                path = "/sos-admin/customer_student";
            }
        }
        //对一级菜单 添加顺序
        angular.forEach(config.menu, function (men) {
            angular.forEach(permissionList, function (permission) {
                if (permission.name && config.menu[permission.name] == men) {
                    var active = path.indexOf(config.menu[permission.name].path) === 0;
                    menu.push({
                        text: config.menu[permission.name].name,
                        href: '#' + config.menu[permission.name].path,
                        active: active
                    });
                    if (active) {
                        //设置当前角色，用于确定下面要加载的二级菜单
                        currentPermission = permission;
                    }
                }
            })
        });

        if (currentPermission) {
            menu.subMenu = [];
            var index = -1;
            //根据用户所有的角色权限，遍历menu[currentPermission.name]下所有的二级菜单
            angular.forEach(config.menu[currentPermission.name].children, function (child1) {
                angular.forEach(permissionList, function (permission) {
                    if (config.menu[currentPermission.name].children[permission.name] && config.menu[currentPermission.name].children[permission.name] == child1) {
                        index = index + 1;
                        menu.subMenu[index] = ({
                            text: config.menu[currentPermission.name].children[permission.name].name,
                            href: '#' + config.menu[currentPermission.name].children[permission.name].path,
                            active: config.menu[currentPermission.name].children[permission.name].path === path,
                            icon: config.menu[currentPermission.name].children[permission.name].icon,
                            name: permission.name
                        });

                        //判断config.menu[currentPermission].children[permission] 有children配置,如果有，再去遍历所有的角色权限，判断是否加载三级菜单
                        if (config.menu[currentPermission.name].children[permission.name].children) {
                            var tIndex = -1;
                            menu.subMenu[index].subMenu = [];
                            angular.forEach(config.menu[currentPermission.name].children[permission.name].children, function (child3) {
                                angular.forEach(permissionList, function (tpermission) {
                                    if (config.menu[currentPermission.name].children[permission.name].children[tpermission.name] && config.menu[currentPermission.name].children[permission.name].children[tpermission.name] == child3) {
                                        tIndex = tIndex + 1;
                                        menu.subMenu[index].subMenu[tIndex] = ({
                                            text: config.menu[currentPermission.name].children[permission.name].children[tpermission.name].name,
                                            href: '#' + config.menu[currentPermission.name].children[permission.name].children[tpermission.name].path,
                                            active: config.menu[currentPermission.name].children[permission.name].children[tpermission.name].path === path,
                                            name: tpermission.name
                                        });
                                    }
                                });
                            });

                        }
                    }
                });
            });
        }
        //二三级菜单需要去重
        return menu;
    }

    /**
     * Route change start handler.
     *
     * It does authorization and authentication at client side.
     * It redirects to login page if user has not login yet.
     * It redirects to home page if user is trying to access a location which he does not have access to.
     *
     * Also it composes the menu for the new page and store it in $rootScope.
     */
    function onRouteChangeStart() {//cy 当且仅当路由发生改变时 才会触发
        //console.log('On route change start : ' + $location.path() + ', authenticated = ' + AuthenticationService.authenticated());

        $rootScope.isChrome = true;
        $rootScope.setVersions = 'v=1000';
        $rootScope.authenticated = AuthenticationService.authenticated();
        var sys = _getBrowserInfo();

        if (!_getBrowserInfo()) {//判断是否是chrome浏览器
            $rootScope.isChrome = false;
        } else {
            $rootScope.isChrome = true;
        }
        if (_isMobile()) {
            $rootScope.isMobile = true;
            $rootScope.isChrome = true;
        } else {
            $rootScope.isMobile = false;
        }
        if (!$rootScope.isChrome) {
            $location.url('/unChrome');
            $rootScope.authenticated = false;
        } else if (!$rootScope.authenticated) {
            if ($location.url().indexOf('/application') == -1) {
                if (localStorageService.get('isTimeout')) {//cy 超时 刷新index.html及所有资源 （默认为空，也就是false）
                    location.reload();
                }
                $location.url('/login');
            }
        } else if ($location.url() === '/login') {
            $rootScope.menu = composeMenu($location.path());
            if ($rootScope.isMobile) {
                $location.url('/fb-admin/leads_student_myself');//mobile 页面登陆后的入口页面
            } else {
                $location.url('/');
            }

        } else {
            $rootScope.menu = composeMenu($location.path());
        }
    }

    /**
     * 判断是否是手机浏览器
     * @returns {boolean}
     * @private
     */
    function _isMobile() {
        var sUserAgent = navigator.userAgent.toLowerCase();

        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";

        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";

        var bIsMidp = sUserAgent.match(/midp/i) == "midp";

        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";

        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";

        var bIsAndroid = sUserAgent.match(/android/i) == "android";

        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";

        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return true;
            alert('手机');

        } else {
            return false;
            alert('pc');
        }
        ;

    }

    /**
     * 判断 浏览器
     * @returns {{}}
     * @private
     */
    function _getBrowserInfo() {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
            (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
                (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                            (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

        if (Sys.chrome) {
            return true;
        }
        ;
        return false;
    }

    /**
     * Logout.
     */
    function logout() {
        //console.log("Logging out");
        var promise = AuthenticationService.logout();
        promise.then(function (msg) {
            $rootScope.viewsCopy = {}
            $rootScope.indexUrlCopy = ''
            sessionStorage.removeItem('viewsCopy')
            sessionStorage.removeItem('indexUrlCopy')
            sessionStorage.removeItem('jumpELearningUrl')
            sessionStorage.removeItem('__departments__')
            $location.url('/login');
        }, function (error) {
            console.log("Logging out failed: " + error);
            $location.url('/login');
        });
    }

    /**
     * Change current user's password.
     */
    function changePassword() {
        $rootScope.pwdModalTitle = '修改密码';
        $rootScope.pwdModal = $modal({
            scope: $rootScope,
            templateUrl: 'partials/modal.changePassword.html?' + new Date().getTime(),
            show: true,
            backdrop: false
        });
    }

    function save() {
        if ($rootScope.password.new.length < 6) {
            //密码长度小于6
            SweetAlert.swal('密码长度不能小于6位！', '请重试', 'error');
            return false;
        }
        else if ($rootScope.password.new != $rootScope.password.confirm) {
            //两次输入的新密码不同
            SweetAlert.swal('两次输入的新密码不同！', '请重试', 'error');
            return false;
        }
        var promise = AuthenticationService.changePassword($rootScope.password);
        promise.then(function (msg) {
            $rootScope.password = {};
            SweetAlert.swal('修改密码成功！', 'success');
            $rootScope.pwdModal.hide();
        }, function (error) {
            $rootScope.password = {};
            SweetAlert.swal('修改密码失败！', 'error');
            $rootScope.pwdModal.hide();
        });
    }

    function changePersonalInfo() {
        var userId = AuthenticationService.currentUser().id;
        $location.path("/hr-admin/changePersonalInfo/" + userId);
    }

    /**
     * Shows loading indicator.
     */
    function showLoading() {
        $rootScope.loadingModal = $modal({
            scope: $rootScope,
            templateUrl: 'partials/modal.loading.html?' + new Date().getTime(),
            show: true,
            backdrop: false
        });
    }

    /**
     * Hides loading indicator.
     */
    function hideLoading() {
        $rootScope.loadingModal.hide();
    }

    /**
     * Change the current user's landline
     */
    function changeLandline() {
        $rootScope.landline = AuthenticationService.currentUser().landline;
        $rootScope.pwdModalTitle = '修改座机号';
        $rootScope.pwdModal = $modal({
            scope: $rootScope,
            templateUrl: 'partials/modal.changeLandline.html?' + new Date().getTime(),
            show: true,
            backdrop: false
        });
    }

    function saveLandline(landline) {
        //先判断座机号是否重复
        if (landline == $rootScope.landline) {
            if ($rootScope.pwdModal) {
                $rootScope.pwdModal.hide();
            }
            if ($rootScope.isMobile) {
                $location.url('/fb-admin/leads_student_myself');
            }
        } else if (landline == undefined || landline == "") {
            var promise = AuthenticationService.changeLandline(landline);
            promise.then(function (msg) {
                localStorageService.set('landline', landline);
                $rootScope.landline = landline;
                SweetAlert.swal('修改座机号成功！', 'success');
                if ($rootScope.pwdModal) {
                    $rootScope.pwdModal.hide();
                }
                if ($rootScope.isMobile) {
                    $location.url('/fb-admin/leads_student_myself');
                }

            }, function (error) {
                $rootScope.landline = {};
                SweetAlert.swal('修改座机号失败！', 'error');
                if ($rootScope.pwdModal) {
                    $rootScope.pwdModal.hide();
                }
            });
        } else {
            var temp = [];
            temp.landline = landline;
            temp.employmentStatus = 0;
            var promise = EmployeeService.getDuplicateEmployees(temp, 0, 10);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                } else {
                    var data = {};
                    data.data = response.data.list;
                    data.numberOfPages = response.data.pages
                    if (data.data.length > 0) {
                        SweetAlert.swal("座机号已经存在，请重新输入", '请重试', 'error');
                    } else {
                        var promise2 = AuthenticationService.changeLandline(landline);
                        promise2.then(function (msg) {
                            localStorageService.set('landline', landline);
                            $rootScope.landline = landline;
                            SweetAlert.swal('修改座机号成功！', 'success');
                            if ($rootScope.pwdModal) {
                                $rootScope.pwdModal.hide();
                            }
                            if ($rootScope.isMobile) {
                                $location.url('/fb-admin/leads_student_myself');
                            }
                        }, function (error) {
                            $rootScope.landline = {};
                            SweetAlert.swal('修改座机号失败！', 'error');
                            if ($rootScope.pwdModal) {
                                $rootScope.pwdModal.hide();
                            }
                        });
                    }
                }
            });
        }
    }

    function _forNavFalse(menu) {
        for (var i = 0; i < menu.length; i++) {
            if (menu[i].active == true) {
                var _nav = menu[i];
                _nav.active = false;
                /* if(nav.href == _nav.href){
                 nav.href = true;
                 }*/
                if (check_null(_nav.subMenu) && _nav.subMenu.length > 0) {
                    for (var j = 0; j < _nav.subMenu.length; j++) {
                        _forNavFalse(_nav.subMenu[j]);
                    }
                }
            }
        }
        console.log(menu);
    }

    function setSelectedMenu(nav, menu) {
        /*   console.log(nav);
         console.log(menu);
         _forNavFalse($rootScope.menu.subMenu);
         nav.active = true;
         menu.active = true;*/

    }

    $rootScope.$on('$routeChangeStart', onRouteChangeStart);
    $rootScope.showLoading = showLoading;
    $rootScope.hideLoading = hideLoading;
    $rootScope.logout = logout;
    $rootScope.changePassword = changePassword;
    $rootScope.save = save;
    $rootScope.password = {};
    $rootScope.changeLandline = changeLandline;
    $rootScope.saveLandline = saveLandline;
    $rootScope.changePersonalInfo = changePersonalInfo;
    // $rootScope.reg_mobile = /^((\(\d{3}\))|(\d{3}\-))?13\d{9}|14[57]\d{8}|15\d{9}|18\d{9}|17[03678]\d{8}$/;//手机号码校验
    $rootScope.reg_mobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;//手机号码校验
    $rootScope.reg_decimal = /^(\d{1,5}|\d{1,5}\.\d{1,2}|\d{1,5}\.\d)$/;//至多两位小数的正整数
    $rootScope.setSelectedMenu = setSelectedMenu;
    //  正在表达式
    $rootScope.doubleNumReg = /^([1-9][0-9]{0,7}|0)(\.[0-9]{1,2})?$/
    $rootScope.doubleNumReg0 = /^([1-9][0-9]{0,7}|0)(\.[0-9]{1,2})?$/
    $rootScope.intNumReg = /^[0-9]*[1-9][0-9]*$/
    $rootScope.fn = ''
    $rootScope.argument = ''
    $rootScope.initIndex = function (argument, fn) {
        $rootScope.fn($rootScope.argument)
    };


    Array.prototype.traversal = function (el, obj) {
        for (var i in this) {
            Object.assign(this[i], obj);
            if (this[i][el]) {
                if (this[i][el].constructor === Array) {
                    this[i][el].traversal(el, obj);
                }
            }
        }
    }


    $rootScope.chooseStep1 = function (row, index) {
        $rootScope.step2 = [];
        $rootScope.step3 = [];
        $rootScope.step4 = [];
        if (row.children && row.isSchool == 0) {
            $rootScope.step1Index = index;
            $rootScope.step2 = $rootScope.step1[index].children;
        } else {
            $rootScope.toJumpSchoolName = row.name;
            $rootScope.step1Index = null;
            $rootScope.curDepartId = row.id;
            $rootScope.passrowdModal = $modal({
                scope: $rootScope,
                templateUrl: 'partials/v3.index/password.html?' + new Date().getTime(),
                show: true
            });
        }

    }
    $rootScope.chooseStep2 = function (row, index) {
        $rootScope.step3 = [];
        $rootScope.step4 = [];
        if (row.children && row.isSchool == 0) {
            $rootScope.step2Index = index;
            $rootScope.step3 = $rootScope.step2[index].children;
        } else {
            $rootScope.toJumpSchoolName = row.name;
            $rootScope.step2Index = null;
            $rootScope.curDepartId = row.id;
            $rootScope.passrowdModal = $modal({
                scope: $rootScope,
                templateUrl: 'partials/v3.index/password.html?' + new Date().getTime(),
                show: true
            });
        }
    }
    $rootScope.chooseStep3 = function (row, index) {
        if (row.children && row.isSchool == 0) {
            $rootScope.step3Index = index;
            $rootScope.step4 = $rootScope.step3[index].children;
        } else {
            $rootScope.toJumpSchoolName = row.name;
            $rootScope.curDepartId = row.id;
            $rootScope.passrowdModal = $modal({
                scope: $rootScope,
                templateUrl: 'partials/v3.index/password.html?' + new Date().getTime(),
                show: true
            });
        }
    }
    $rootScope.chooseStep4 = function (row, index) {
        if (row && (index != void 0)) {
            if (!row.children && row.isSchool == 1) {
                $rootScope.curDepartId = row.id;
            }
            $rootScope.back = ''
        } else {
            $rootScope.back = 'back';
        }
        if (row) {
            $rootScope.toJumpSchoolName = row.name;
        } else {
            $rootScope.toJumpSchoolName = localStorageService.get("department").name;
        }
        $rootScope.passrowdModal = $modal({
            scope: $rootScope,
            templateUrl: 'partials/v3.index/password.html?' + new Date().getTime(),
            show: true
        });
    }

    $rootScope.$watch("specifySchoolModal.$isShown", function (old, newval) {
        if (old != newval) {
            $rootScope.step1 = [];
            $rootScope.step2 = [];
            $rootScope.step3 = [];
            $rootScope.step4 = [];
            $rootScope.step1Index = null;
            $rootScope.step2Index = null;
            $rootScope.step3Index = null;
        }
    })

    $rootScope.submitSwitchScholl = function (switchSchoolPassword) {
        var params = {
            account: $rootScope.currentUser.account,
            password: switchSchoolPassword,
            originDepartId: $rootScope.latestDepartmentId ? $rootScope.latestDepartmentId : $rootScope.currentUser.department.id,
            curDepartId: $rootScope.curDepartId ? $rootScope.curDepartId : ($rootScope.latestDepartmentId ? $rootScope.latestDepartmentId : $rootScope.currentUser.department.id),
            back: $rootScope.back
        }
        AuthenticationService.chooseSchool(params).then(function (response) {
            if (response.status == "SUCCESS") {
                // $rootScope.isModyfied = 1;//修改时间的权限
                localStorageService.set('isModyfied', response.data.isModyfied);
                localStorageService.set('user', response.data.user);
                localStorageService.set('roles', response.data.roles);
                localStorageService.set('token', response.data.session.token);
                localStorageService.set('position_id', response.data.position_id);
                localStorageService.set('department_id', response.data.department_id);
                localStorageService.set('school_id', response.data.school_id);
                localStorageService.set('landline', response.data.landline);
                localStorageService.set('profile', response.data.profile);
                localStorageService.set('positionName', response.data.positionName);
                localStorageService.set('department', response.data.department);
                $rootScope.latestDepartmentId = response.data.origin_department_id;
                $rootScope.back = null;
                if ($rootScope.isMobile) {
                    $location.url('/fb-admin/leads_student_myself');
                    if (AuthenticationService.currentUser().landline) {
                        $rootScope.landline = parseInt(AuthenticationService.currentUser().landline);
                    }
                } else {
                    $location.url('/');
                    $window.location.reload();
                    // window.location.href = '/'
                }

                _initCoefficient();
            } else {
                SweetAlert.swal("密码错误");
            }
        })
    }

    function _initCoefficient() {
        var filter = {};
        var promise = ProductService.getCoefficientList(filter);
        promise.then(function (data) {
            coefficients = [];
            for (var i = 0; i < data.data.length; i++) {
                coefficients.push({
                    'a': data.data[i].coefficientCourseCode,
                    'b': data.data[i].coefficientClassCode,
                    'coefficient': data.data[i].coefficientValue
                });
            }
            sessionStorage.removeItem("coefficients");

            sessionStorage.setItem("coefficients", JSON.stringify(coefficients));
        }, function (error) {
        });
    }

    $rootScope.searchSpecify = function (changeSchoolName, schoolNature) {
        var params = {
            name: changeSchoolName,
            schoolNature: schoolNature
        }
        AuthenticationService.getSchool(params).then(function (response) {
            if (response.status == "SUCCESS") {
                $rootScope.step1 = [];
                $rootScope.step2 = [];
                $rootScope.step3 = [];
                $rootScope.step4 = [];
                $rootScope.isBUCluster = false;
                if (response.data.schoolList.length != 0) {
                    if (response.data.schoolList[0].isBUCluster == true) {
                        $rootScope.isBUCluster = true;
                        response.data.schoolList[0].children.forEach(function (i, index) {
                            switch (i.name) {
                                case "一对一直营事业部":
                                    $rootScope.zhiyingList = i.children;
                                    $rootScope.zhiyingList.traversal("children", {"isSelected": "false"});
                                    break;
                                case "一对一直盟事业部":
                                    $rootScope.zhimengList = i.children;
                                    $rootScope.zhimengList.traversal("children", {"isSelected": "false"});
                                    break;
                                default:
                                    break;
                            }
                            if (schoolNature == 1) {
                                $rootScope.step1 = $rootScope.zhiyingList;
                            } else if (schoolNature == 3) {
                                $rootScope.step1 = $rootScope.zhimengList;
                            }
                        })
                    } else if (response.data.schoolList[0].isBU == true) {
                        $rootScope.isBU = true;
                        var result = response.data.schoolList[0];
                        var name = response.data.schoolList[0].name;
                        if (name == "一对一直营事业部") {
                            $rootScope.zhiyingList = result.children;
                            $rootScope.zhiyingList.traversal("children", {"isSelected": "false"});
                        }
                        if (name == "一对一直盟事业部") {
                            $rootScope.zhimengList = result.children;
                            $rootScope.zhimengList.traversal("children", {"isSelected": "false"});
                        }
                        if (schoolNature == 1) {
                            $rootScope.step1 = $rootScope.zhiyingList;
                        } else if (schoolNature == 3) {
                            $rootScope.step1 = $rootScope.zhimengList;
                        }
                    } else {
                        $rootScope.step1 = response.data.schoolList;
                        $rootScope.step1.traversal("children", {"isSelected": "false"});
                    }
                }
            }
        })
    }
    $rootScope.changeSchoolNature = function (schoolNature) {
        $rootScope.schoolNature = schoolNature;
        $rootScope.step1 = [];
        $rootScope.step2 = [];
        $rootScope.step3 = [];
        $rootScope.step4 = [];
        if (schoolNature == 1) {
            $rootScope.step1 = $rootScope.zhiyingList;
        } else if (schoolNature == 3) {
            $rootScope.step1 = $rootScope.zhimengList;
        }
    }
    $rootScope.switchToSchool = function (position_id) {
        AuthenticationService.spacifySchool(position_id).then(function (response) {
            $rootScope.schoolNature = 1;
            if (response.status == "SUCCESS") {
                $rootScope.specifySchoolModal = $modal({
                    scope: $rootScope,
                    templateUrl: 'partials/v3.index/specify.html',
                    show: true
                });
            } else {
                SweetAlert.swal("权限验证失败");
            }
        })
    }
    $rootScope.jumpELearningUrl = ''
    $rootScope.jumpELearning = function () {
        // var winHandler = window.open('', '_blank');
        var jumpELearningUrl = sessionStorage.getItem('jumpELearningUrl')
        if (jumpELearningUrl) {
            $rootScope.jumpELearningUrl = jumpELearningUrl
            return false
        }
        //跳转到培训和考试系统
        $http.get(config.endpoints.hr.root + "/department_and_employee_open_access/getAccessToken")
            .success(function (response, status, headers, config) {
                // window.location = "http://e-learning.youwinedu.com/signIn.php?token="+response.data;
                // window.open("http://e-learning.youwinedu.com/signIn.php?token="+response.data);
                $rootScope.jumpELearningUrl = "http://e-learning.youwinedu.com/signIn.php?token=" + response.data;
                sessionStorage.setItem('jumpELearningUrl', $rootScope.jumpELearningUrl)

            })
            .error(function (response, status, headers, config) {
                // deferred.reject(response);
                console.log('培训系统地址获取失败')
                $rootScope.jumpELearning()
            });
    }
    if (localStorageService.get('token')) {
        $rootScope.jumpELearning()
    }
    var viewsCopy = sessionStorage.removeItem('viewsCopy')
    var indexUrlCopy = sessionStorage.getItem('indexUrlCopy')
    $rootScope.indexUrlCopy = indexUrlCopy
    $rootScope.viewsCopy = viewsCopy || {}

    // 20180825添加上课途径
    $rootScope.inClassOptions = [
        {id:0,name:'校区上课'},
        {id:1,name:'到家上课'},
        {id:2,name:'在线上课'}
    ]
});

/**
 * 日期格式化
 * @param data
 * @returns {string}
 */
function getFormatData(data) {
    return data ? [data.getFullYear(), is2length(data.getMonth() + 1), is2length(data.getDate())].join('-') : ''
}

/**
 * 判断长度
 * @param numb
 * @returns {string}
 * 返回2位
 */
function is2length(numb) {
    return numb.toString().length == 2 ? numb : (0 + '' + numb)
}

var mtResultIcon = {
    success: 'img/success-ok.png',
    warning: 'img/icon/util/jgao.png',
    modalHtml: 'optimize/modal/result/index-html.html',
    html: 'optimize/modal/result/index.html'
}
/**
 * 抽奖
 */
var prizeOpen = function () {
    var html = $('<div class="prize" id="prize" style="">' +
        '<div class="prize-modal" style="background: rgba(0,0,0,.3);z-index: 10000;top: 0;left: 0;width:100%;height:100%;position: fixed"></div>' +
        '<div class="prize-img" style="z-index: 10001;top: 50%;left: 50%;width:100%;height:100%;position: fixed;text-align: center;margin-left: -300px;margin-top: -300px;width:600px;">' +
        '<img src="./img/prize.png">' +
        '</div>' +
        '</div>').on('click', function () {
        $(this).remove()
        clearTimeout(timer)
    })
    $('body').append(html)
    var timer = setTimeout(function () {
        $('#prize').remove()
    }, 5000)

}
// 所有的有查询按钮的地方  按回车触发查询
$("body").delegate("input", "keydown", function (e) {
    if (e.keyCode == 13) {
        if ($("#keydown-query")) {
            $("#keydown-query").click();
            $("#keydown-query2").click();
        } else {
            $("#refe").click();
        }


    }
})
$("body").keydown(function (e) {
    if (e.keyCode == 13) {
        if ($("#keydown-query")) {
            $("#keydown-query").click();
            $("#keydown-query2").click();
        } else {
            $("#refe").click();
        }
    }
})