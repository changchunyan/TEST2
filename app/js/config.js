/**
 * The config module.
 */
angular.module('config', []).factory('config', function () {
    return config;
});

var QINIU_HR_IMG_DOMAIN = 'http://hr.yws.ywservice.com/HR-IMG';//'http://7xotem.com2.z0.glb.qiniucdn.com/HR-IMG';
var QINIU_HR_TRAINING_DOMAIN = 'http://hr.yws.ywservice.com/HR-TRAINING/';
var QINIU_O2O_DOMIAN = 'http://o2o.yws.ywservice.com/';//'http://7xp3tv.com2.z0.glb.qiniucdn.com/';
var QINIU_TR_DOMIN = 'http://7xp08b.com1.z0.glb.clouddn.com/';
var QINIU_ADMIN_DOMIN = 'ohwfy9zru.bkt.clouddn.com';

//  统计图像
var STATISTICS_1 = 'http://123.59.170.141:8088'
var STATISTICS_1_PARAM = '17'
var STATISTICS_2 = 'http://123.59.170.141:8088'
var STATISTICS_2_PARAM = '25'
var STATISTICS_SCHOOL_PARAM = '26'
var STATISTICS_3_PARAM = '22'

//系统常量

var Constants = {
    "PositionID": {
        "HEADMASTER": 79, //校长Id
        "FINANCIAL_AFFAIRS": 6, //财务Id
        "TEACHER": 35, //教师ID
        "STUDENT_CHIEF_OFFICER": 87, //学习顾问主管
        "COURSE_OFFICER": 40,//课程顾问
        "COURSE_CHIEF_OFFICER": 41,//课程顾问主管
        "CALLCENTER_MASTER": 23,//呼叫主管
        "TEACHER_MASTER": 38,//教务主管
        "YX_SHEN": 199,//营销管培生
        "O2O_OPERATION_SPECIALIST": 217,//o2o运营专员
        "STUDENT_CHIEF": 86, //学习顾问
        "CALLCENTER": 24,//呼叫专员
        "YUNYING_MANAGEMENT_TRAINING": 212,//运营管培生
        "YSB_GUIHUASHI": 231,//优胜班规划师
        "YSGJ_ZHUJIAO_MASTER": 238,//优胜国际助教主管
        "YSGJ_ZHUJIAO": 239,//优胜国际助教
        "YSB_HEADMASTER": 226, //优胜班校长
        "YSGJ_HEADMASTER": 235, //优胜国际校长
        "YSGJ_STUDENT_CHIEF_OFFICER": 236, //优胜国际营销主管
        "YSGJ_COURSE_OFFICER": 237, //优胜国际课程顾问
        "YSGJ_TEACHER": 242, //优胜国际教师
        "KEP_TEACHER": 251, //科学派教师
        "YSB_TEACHER": 234, //优胜班教师
        "YSP_HEADMASTER": 228, //优胜派校长
        "YSP_FINANCIAL": 229,//优胜派审核兼行政
        "YSP_CHENGZHANGGUWEN_MASTER": 227,//优胜派教务主管
        "YSP_CHENGZHANGGUWEN": 220,//优胜派成长顾问
        "YSP_TEACHER": 230, //优胜派教师（素养教师）
        "KXP_HEADMASTER": 250, //科学派校长
        "KXP_FINANCIAL": 252, //科学派财务
        "YSB_FINANCIAL": 232 //优胜班财务
    },
    "DepartmentID": {
        "ZONGBU": 415,//总部
        "WANGLUOYINGXIAOBU": 466 //网络营销部
    },
    "MediaChannel": {
        "CHANNEL4": 4,//媒体渠道
        "CHANNEL8": 8//o2o线上
    },
    "DEFAULT_IMG_URL": QINIU_O2O_DOMIAN + 'courseimage/2876.jpeg',//默认优惠券图片
    "CourseTypeId": {
        "OneToOneCourse": 11,//一对一课程类型ID
        "SPECIALCOURSE": 12//专项课课程类型ID
    },
    "OnlineCourseType": [
        {"id": 11, "name": "一对一"}, {"id": 12, "name": "专项课"}
    ],
    "StudentStatus": [{"name": "在读", "value": 1}, {"name": "结课", "value": 2}, {"name": "停课", "value": 3}, {
        "name": "退费",
        "value": 4
    }, {"name": "转课", "value": 5}],
    "StudentStatusForUpdate": [{"name": "在读", "value": 1}, {"name": "停课", "value": 3}],
    "USER": {
        'HEADER_IMG': 'img/logo/logo.png'//当前用户默认头像（if profile 为空时）
    },
    //线上的
    "UnhandleDepartment": 469,
    "UnhandlePosition": 178,
    //83的
    // "UnhandleDepartment" : 513,
    //"UnhandlePosition" :    178
    "schoolPositions": JSON.parse('["校长","校区审核","人事专员","营销主管","运营主管","教务主管","市场专员","呼叫专员","课程顾问","学习顾问","教师","营销管培生","运营管培生"]'),
    "YSPPositions": JSON.parse('["优胜派校长","优胜派审核兼行政","成长顾问","优胜派教务主管","优胜派教师"]'),
    "YSBPositions": JSON.parse('["优胜班校长","优胜班规划师","优胜班财务","优胜班市场","优胜班教师"]'),
    "YSGJPositions": JSON.parse('["国际部校长","国际部营销主管","国际部课程顾问","助教主管","助教","国际部财务","国际部市场","国际部教师"]')
};

var onLineCourseFlag = 8;//线上产品标识
var zengKeSubjectFlag = 16;//赠课科目
var coursePlanParams = {};//排课参数
var config = {
    'endpoints': {
        'login': admin_server + 'auth/login',
        'logout': admin_server + 'auth/logout',
        'captcha': admin_server + 'captcha',
        'admin': {
            'role': admin_server + 'roles',
            'permission': admin_server + 'permissions',
            'user': admin_server + 'users',
            'projectSetting': admin_server + 'projectSetting',
            'help': admin_server + 'helpManagerController',
            'version': admin_server + 'versionsController'
        },
        'hr': {
            'root': hr_server,
            'department': hr_server + 'departments',
            'salary': hr_server + 'salary',
            'position': hr_server + 'positions',
            'employee': hr_server + 'employees',
            'employee_role': hr_server + 'employee_roles',
            'positions_management': hr_server + 'positions',
            'position_roles': hr_server + 'position_roles',
            'dictionary': hr_server + 'dictionary',
            'ddictionary': hr_server + 'ddictionary',
            'training': hr_server + 'trainings',
            'recruitment': hr_server + 'recruitments',
            'talent': hr_server + 'talents',
            'recruitmentneed': hr_server + 'recruitmentneeds',
            'checkAuthority': hr_server + 'chooseSchoolLogin'
        },
        'sos': {
            'common': crm_server + 'common',
            'InvitationCommunication': crm_server + 'invitationCommunication',
            'InvitationRemind': crm_server + 'invitationRemind',
            'InvitationDetail': crm_server + 'invitationDetail',
            'LeadsStudent': crm_server + 'leadsStudent',
            'CustomerStudent': crm_server + 'customerStudent',
            'CustomerStudentGroup': crm_server + 'customerStudentGroup',
            'order': crm_server + 'orders',
            'getCustomerListByName': crm_server + 'customerStudent/getCustomerListByName',
            'batchUpdate': crm_server + 'orders/batchUpdate',
            'subOrders': function (id) {
                return crm_server + 'orders/' + id + '/slaveOrders'
            },
            'changePlatform': crm_server + "changePlatform",
            'reminds': crm_server + 'reminds',
            'getMsgCount': crm_server + '/reminds/getOrderRemindsCountByFilter',
            'refund': crm_server + 'orders',
            'orderCourse': crm_server + 'orders/course',
            'orderPayment': crm_server + 'orders/payment',
            'teachingCourse': crm_server + 'orders/teachingCourse',
            'studentAuditionTeachingList': crm_server + 'orders/studentAuditionTeachingList',
            'toAddOrder': crm_server + 'orders/toAddOrder',
            'customerStudentCourse': crm_server + 'customerStudentCourse',
            'teacher': crm_server + 'teacher',
            'product': oms_server + 'product',
            'course_plan': oms_server + 'course_plan',
            'getTeacherTimes': oms_server + 'course_plan/CoursePlanInfo',//查询教师时间
            'st': oms_server + 'course_plan/CoursePlanCanlarda',//查询教师和老师时间

            'getSchoolsTimes': oms_server + 'course_plan/SchoolForCoursePlans',//查询校区时间

            'coursePlan': oms_server + 'course_plan/CoursePlan',
            'creatCoursePlan': oms_server + 'course_plan/CreatCoursePlan',
            'creatCourseAlready': oms_server + 'course_plan/markCoursePlan',
            'deletePlans': oms_server + 'course_plan/updatefordelete',
            'updateLeadsStudent': crm_server + 'leadsStudent/updateLeadsStudent',//更新意向客户信息
            'updatePhoneException': crm_server + 'leadsStudent/changePhoneException',//更改电话异常状态
            'findPhoneException': crm_server + 'leadsStudent/findPhoneException',//更改电话异常状态
            'schoolGoal': crm_server + 'schoolGoal',
            'crmStudentClass': crm_server + 'crmStudentClass',
            'crmStudentClassAttendence': crm_server + 'crmStudentClassAttendence',
            'crmStudentClassRecord': crm_server + 'crmStudentClassRecord',
            'crmStudentCallRecord': crm_server + 'crmStudentCallRecord',
            'crmChargingScheme': crm_server + 'crmChargingScheme',
            'crmStudentCourseAttendenceSupplement': crm_server + 'crmStudentCourseAttendenceSupplement', //补、体验课管理
            'pdfUrl': crm_server + 'contract/pdf',
            'docxUrl': crm_server + 'contract/docx',
            'contract': crm_server + "contract/"
        },
        /* 'oms':{
         'product': oms_server + 'product',
         'course_plan': oms_server + 'course_plan',
         'coursePlan':oms_server+'course_plan/CoursePlan',
         'creatCoursePlan':oms_server+'course_plan/CreatCoursePlan'
         },*/
        'o2o': {
            'orders': o2o_server + 'orders',
            'orderMembershipCard': o2o_server + 'orderMembershipCards',
            'coupon': o2o_server + 'coupons',
            'teacher': o2o_server + 'teacher',
            'membershipCard': o2o_server + 'membershipCard',
            'info': o2o_server + 'info',
            'integealList': o2o_server + 'credit/records',
            'integealRulesList': o2o_server + '/credit/rules',
            'rulesAdd': o2o_server + '/credit/rule',
            'rulesUpdate': o2o_server + 'credit//rules/group',
            'rulesGroupById': o2o_server + '/credit/rules/group/',
            'favourite': o2o_server + 'favourite'
        },
        'bd': {
            'Leads': bd_server + 'leads',
            'Remind': bd_server + 'remind',
            'Communication': bd_server + 'communication',
            'Invitation': bd_server + 'invitation',
            'Franchiser': bd_server + 'franchiser',
            'Common': bd_server + 'common',
            'Application': bd_server + 'application'
        },
        'bi': {
            'biChannelOrder': bi_server + 'biChannelOrder',
            'biRetentionRecommendation': bi_server + 'biRetentionRecommendation',
            'biContinuousConsumeCourse': bi_server + 'biContinuousConsumeCourse',
            'biContinuousConsumeGrade': bi_server + 'biContinuousConsumeGrade',
            'biEducationColligateCourse': bi_server + 'biEducationColligateCourse',
            'biGradeOrder': bi_server + 'biGradeOrder',
            'biStudentConsumeCourse': bi_server + 'biStudentConsumeCourse',
            'biSujectConsumeCourse': bi_server + 'biSujectConsumeCourse',
            'biCommunication': bi_server + 'biCommunication',
            'biCourseAdvisorProcess': bi_server + 'biCourseAdvisorProcess',
            'biMarketerAchievement': bi_server + 'biMarketerAchievement',
            'biStudentTeacherCommunication': bi_server + 'biStudentTeacherCommunication',
            'biProductOrder': bi_server + 'biProductOrder',
            'biLearningComment': bi_server + 'biLearningComment',
            'biO2oNum': bi_server + 'biO2oNum',
            'biO2oOrder': bi_server + 'biO2oOrder',
            'biSchoolManagementPerformence': bi_server + 'biSchoolManagementPerformence',
            'biSchoolPerformence': bi_server + 'biSchoolPerformence',
            'biSchoolPerformenceProgress': bi_server + 'biSchoolPerformenceProgress',
            'biClassHour': bi_server + 'biClassHour',
            'biSchoolLeads': bi_server + 'biSchoolLeads',
            'biConsumeAnalysis': bi_server + 'biConsumeAnalysis',
            'biTeacherConsumeAnalysis': bi_server + 'biTeacherConsumeAnalysis',
            'biClassCourse': bi_server + 'biClassCourse',
            'biCustomerSource': bi_server + 'biCustomerSource',
            'biOutboundPhone': bi_server + 'biOutboundPhone',
            'biConfirmIncome': bi_server + 'biConfirmIncome',
            'biTeacherReport': bi_server + 'biTeacherReport',
            'biChannelGrade': bi_server + 'biChannelGrade',
            'biClassTeachingManagement': bi_server + 'biClassTeachingManagement',
            'biGradeSubjectConsume': bi_server + 'biGradeCourseConsume',
        },
        'workbench': {
            'remindTypeList': admin_server + 'workbench/' + 'remindTypeList',//提醒
            'dataCountList': admin_server + 'workbench/' + 'dataCount',//个人和团队汇总数据
            'dataCountDetailList': admin_server + 'workbench/' + 'dataCountDetail', // 数据走势图表
            'sortedTopTen': admin_server + 'workbench/' + 'sortedTopTen', //top10
            'mingxiList': admin_server + 'workbench/' + 'dataDetail'//明细
        },
        'workFlow': {
            'getProcesses': work_flow_server + 'workflow/' + 'getprocesses',//流程列表
            'startProcess': work_flow_server + 'workflow/' + 'startprocessbykey',//开始一个流程
            'getProcessesDetail': work_flow_server + 'workflow/' + 'gettaskbyid',//得到流程详情
            'deleteProcess': work_flow_server + 'workflow/' + 'deleteprocessbytaskid',//删除一个流程
            'getSponsorLists': work_flow_server + 'workflow/' + 'getmyinitprocesses',//我发起
            'getSolveLists': work_flow_server + 'workflow/' + 'getmyhandleprocesses',//我处理 type
            'getStarLists': work_flow_server + 'workflow/' + 'getstarprocesses',//星标
            'getFlowAddDes': work_flow_server + 'workflow/' + 'getkeys',//发起工作流
            'getFlowAddSubmit': work_flow_server + 'workflow/' + 'startprocessbykey',//发起工作流提交返回
            'starlowRoute': work_flow_server + 'workflow/' + 'addstar',//
            'cancelStarFlowRoute': work_flow_server + 'workflow/' + 'deletestar',//
            'kuaiFlowRoute': work_flow_server + 'workflow/' + 'addurgent',//
            'cancelKuaiFlowRoute': work_flow_server + 'workflow/' + 'deleteurgent',//取消加急
            'submitNextStep': work_flow_server + 'workflow/' + 'proceedtask',//下一步
            'saveDraft': work_flow_server + 'workflow/' + 'savedraft', //保存
            'proceedAndSaveDraft': work_flow_server + 'workflow/' + 'proceedtaskandsavedraft', //下一步并保存
            'submitBeach': work_flow_server + 'workflow/' + 'batchproceed', //批量处理
            'uploadFile': work_flow_server + 'workflow/' + 'uploadfile',
            'getBaseUrl': work_flow_server + 'workflow/' + 'baseurl',
            //工作台台显示
            'getWorkStart': work_flow_server + 'workflow/' + 'getworkbenchmyinit ',//我发起
            'getWorkDeal': work_flow_server + 'workflow/' + 'getworkbenchmytodo ',// 待我办
            'getWorkFinish': work_flow_server + 'workflow/' + 'getworkbenchmydone ',// 我已办
            'getWorkStar': work_flow_server + 'workflow/' + 'getworkbenchmystar '//星标
        },
        'personalCenter': {
            'personalCenter': crm_server + "/personalCenter",
        }

        /* service.statFlowRoute = statFlowRoute;//收藏
         service.cancelStatFlowRoute = cancelStatFlowRoute;//取消收藏收藏
         service.kuaiFlowRoute = kuaiFlowRoute;//加急
         service.cancelKuaiFlowRoute = cancelKuaiFlowRoute;//取消加急*/
    },
    'menu': {
        'SystemManager': {
            'name': '系统管理',
            'path': '/system-admin',
            'children': {
                'RoleManagement': {
                    'name': '角色管理',
                    'icon': 'img/icon/system/role.png',
                    'path': '/system-admin/role'
                },
                'PermissionManagement': {
                    'name': '权限管理',
                    'icon': 'img/icon/system/permission.png',
                    'path': '/system-admin/permission'
                },
                'ProjectSettingManagement': {
                    'name': '参数管理',
                    'icon': 'img/icon/system/permission.png',
                    'path': '/system-admin/projectSetting'
                },
                'HelpManagement': {
                    'name': '帮助管理',
                    'icon': 'img/icon/system/permission.png',
                    'path': '/system-admin/help'
                },
                'UserPrizeQuery': {
                    'name': '中奖查询',
                    'icon': 'img/icon/system/permission.png',
                    'path': '/system-admin/userPrize'
                },
                'VersionManagement': {
                    'name': '版本管理',
                    'icon': 'img/icon/system/permission.png',
                    'path': '/system-admin/version'
                },
            }
        },
        'ForegroundBusiness': {
            'name': '前台业务',
            'path': '/fb-admin',
            'children': {
                'SchoolGoal': {
                    'name': '校区目标',
                    'icon': 'img/icon/sos/coursePlan.png',
                    'path': '/fb-admin/schoolGoal',
                    'children': {
                        'SchoolGoalEntrance': {
                            'name': '校区目标录入',
                            'path': '/fb-admin/schoolGoalEntrance'
                        }
                    }
                },
                'LeadsStudentManagement': {
                    'name': '意向客户管理',
                    'icon': 'img/icon/sos/leadsStudent.png',
                    'path': '/fb-admin/leads_student',
                    'children': {
                        'myselfLeads': {
                            'name': '我的意向客户',
                            'icon': 'img/icon/sos/leadsStudent.png',
                            'path': '/fb-admin/leads_student_myself'
                        },
                        'schoolListView': {
                            'name': '校区意向客户',
                            'icon': 'img/icon/sos/leadsStudent.png',
                            'path': '/fb-admin/leads_student'
                        },
                        'InvitationChild': {
                            'name': '邀约到访管理',
                            'icon': 'img/icon/sos/leadsStudent.png',
                            'path': '/fb-admin/InvitationChild'
                        },
                        'receiveLeadsStudent': {
                            'name': '领取意向客户',
                            'icon': 'img/icon/sos/leadsStudent.png',
                            'path': '/fb-admin/leads_student_receive'
                        },
                        'zongbuLeadsListView': {
                            'name': '总部意向客户',
                            'icon': 'img/icon/sos/leadsStudent.png',
                            'path': '/fb-admin/leads_student_zongbu'
                        },
                        'allotLeadsListView': {
                            'name': '已分配意向客户',
                            'icon': 'img/icon/sos/leadsStudent.png',
                            'path': '/fb-admin/leads_student_allot'
                        }
                    }
                },
                'InvitationDetailManagement': {
                    'name': '试听管理 ',
                    'icon': 'img/icon/sos/invitationDetail.png',
                    'path': '/fb-admin/invitationDetail',
                    'children': {
                        'InvitationBrandZB': {
                            'name': '总部邀约到访',
                            'icon': 'img/icon/sos/leadsStudent.png',
                            'path': '/fb-admin/InvitationBrandZB'
                        },
                        'InvitationBrandXQ': {
                            'name': '校区邀约到访',
                            'icon': 'img/icon/sos/leadsStudent.png',
                            'path': '/fb-admin/InvitationBrandXQ'
                        },
                        'CoursePlanListen': {
                            'name': '一对一试听管理',
                            'path': '/fb-admin/CoursePlan_Listen'
                        },
                        'CoursePlanListenMultiple': {
                            'name': '一对多试听管理',
                            'path': '/fb-admin/CoursePlan_Listenmore'
                        },
                        'ClassExperience': {
                            'name': '体验课管理',
                            'path': '/fb-admin/classExperience'
                        },
                        'CoursePlanManagementInvitat': {
                            'name': '老师时间表',
                            'path': '/fb-admin/teacher_times'
                        }
                    }
                },
                'OrderManagement': {
                    'name': '订单管理',
                    'icon': 'img/icon/sos/order.png',
                    'path': '/fb-admin/order',
                    'children': {
                        'OrderNormalList': {
                            'name': '普通订单列表',
                            'path': '/fb-admin/order'
                        },
                        'OrderTransferList': {
                            'name': '转课订单列表',
                            'path': '/fb-admin/orderRestitution'
                        },
                        'OrderRestitutionList': {
                            'name': '返课订单列表',
                            'path': '/fb-admin/orderTransfer'
                        },
                        'PaymentRecordList': {
                            'name': '交费记录查询',
                            'path': '/fb-admin/paymentRecord'
                        },
                        'ChangePlatformList': {
                            'name': '转平台记录查询',
                            'path': '/fb-admin/changePlatform'
                        },
                    }
                },
            }
        },
        'StudentBusiness': {
            'name': '学员教务',
            'path': '/sos-admin',
            'children': {
                'CustomerStudentManagement': {
                    'name': '在读学员管理',
                    'icon': 'img/icon/sos/customerStudent.png',
                    'path': '/sos-admin/customer_student',
                    'children': {
                        'CustomerStudentList': {
                            'name': '学员管理',
                            'path': '/sos-admin/customer_student'
                        },
                        'StudentCoursePlanManagement': {
                            'name': '学生时间表',
                            'path': '/sos-admin/customer_times/backToPlan'
                        },
                        'GroupList': {
                            'name': '一对多管理',
                            'path': '/sos-admin/customer_group'
                        },
                        'ClassManagement': {
                            'name': '班级管理',
                            'path': '/sos-admin/class'
                        },
                        'SNPClassManagement': {
                            'name': '托管管理',
                            'path': '/sos-admin/snp_class'
                        }
                    }
                },
                'CoursePlanManagement': {
                    'name': '排课消课管理',
                    'icon': 'img/icon/sos/coursePlan.png',
                    'path': '/sos-admin/course_plan',
                    'children': {
                        'CoursePlanList': {
                            'name': '一对一消课管理',
                            'path': '/sos-admin/course_plan'
                        },
                        'GropuCoursePlanList': {
                            'name': '一对多消课管理',
                            'path': '/sos-admin/group_course_plan'
                        },
                        'ClassHourWarning': {
                            'name': '课时预警',
                            'path': '/sos-admin/class_hour_warning'
                        },
                        'ClassCoursePlanList': {
                            'name': '班级排课消课',
                            'path': '/sos-admin/class_course_plan'
                        },
                        'ActivityCoursePlanList': {
                            'name': '活动消课',
                            'path': '/sos-admin/activity_course_plan'
                        },
                        'SupplementCourseManagement': {
                            'name': '补课管理',
                            'path': '/sos-admin/supplement_course'
                        },
                        'TeacherCoursePlanManagement': {
                            'name': '老师时间表',
                            'path': '/sos-admin/teacher_times'
                        },
                        'schoolPlanManagement': {
                            'name': '校区时间表',
                            'path': '/sos-admin/school_times'
                        },
                        'teacherUnavailableTime': {
                            'name': '不可排课时间管理',
                            'path': '/sos-admin/teacher_unavailable_time'
                        },
                        'SNPCoursePlanList': {
                            'name': '托管记录',
                            'path': '/sos-admin/snp_course_plan_list'
                        }
                    }
                },
                'RefundManagement': {
                    'name': '学费变更管理',
                    'icon': 'img/icon/sos/refund.png',
                    'path': '/sos-admin/refund',
                    'children': {
                        'carryForwardList': {
                            'name': '结转管理',
                            'path': '/sos-admin/carryForward'
                        },
                        'RefundList': {
                            'name': '退费管理',
                            'path': '/sos-admin/refund'
                        }
                    }
                },
                'OrderDataManagement': {
                    'name': '订单数据管理',
                    'icon': 'img/icon/sos/order.png',
                    'path': '/sos-admin/orderData',
                    'children': {
                        'OrderDataList': {
                            'name': '修改剩余课时',
                            'path': '/sos-admin/orderData'
                        }
                    }
                },
                'TeacherManagement': {
                    'name': 'APP展示管理',
                    'icon': 'img/icon/sos/refund.png',
                    'path': '/sos-admin/teacher',
                    'children': {
                        'TeacherList': {
                            'name': 'APP展示管理',
                            'path': '/sos-admin/teacher'
                        },
                        'ProductListOnLine': {
                            'name': 'APP课程管理',
                            'path': '/sos-admin/product_onLine'
                        },
                    }
                },
                'ProductManagement': {
                    'name': '产品课程管理 ',
                    'icon': 'img/icon/sos/product.png',
                    'path': '/sos-admin/product',
                    'children': {
                        'ProductList': {
                            'name': '产品课程管理',
                            'path': '/sos-admin/product'
                        },
                        'ChargingScheme': {
                            'name': '计费方案管理',
                            'path': '/sos-admin/chargingScheme'
                        }
                    }
                },
            }
        },
        'O2OManager': {
            'name': 'O2O管理系统',
            'path': '/o2o-admin',
            'children': {
                'O2OOrderManagement': {
                    'name': 'O2O订单管理',
                    'icon': 'img/icon/sos/leadsStudent.png',
                    'path': '/o2o-admin/order'
                },
                'CouponManagement': {
                    'name': '优惠券管理',
                    'icon': 'img/icon/sos/leadsStudent.png',
                    'path': '/o2o-admin/coupon'
                },
                /* 'MembershipCardManagement': {
                 'name': '会员卡管理',
                 'path': '/o2o-admin/membershipCard'
                 },*/
                'O2OCoursePlanManagement': {
                    'name': '排课管理',
                    'icon': 'img/icon/sos/leadsStudent.png',
                    'path': '/o2o-admin/o2ocourse_plan'
                },
                'InfoManagement': {
                    'name': '轮播管理',
                    'icon': 'img/icon/sos/leadsStudent.png',
                    'path': '/o2o-admin/info'
                },
                'InfoCourse': {
                    'name': '课程推荐管理',
                    'icon': 'img/icon/sos/leadsStudent.png',
                    'path': '/o2o-admin/Course'
                },
                'integralManagement': {
                    'name': '积分管理',
                    'icon': 'img/icon/sos/leadsStudent.png',
                    'path': '/o2o-admin/integral'
                }
            }
        },
        'HRManager': {
            'name': '人力资源',
            'path': '/hr-admin',
            'children': {
                'DepartmentManagement': {
                    'name': '组织架构管理',
                    'path': '/hr-admin/department',
                    'icon': 'img/icon/hr/zuzhijiagou.png',
                    'children': {
                        'DepartmentManagement': {
                            'name': '组织架构管理',
                            'path': '/hr-admin/department'
                        }
                    }
                },
                'PersonnelInformationManagement': {
                    'name': '人员信息管理',
                    'path': '/hr-admin/employee',
                    'icon': 'img/icon/hr/renliziyuanxitong.png',
                    'children': {
                        'EmployeeManagement': {
                            'name': '员工管理',
                            'path': '/hr-admin/employee'
                        },
                        'DimissionManagement': {
                            'name': '离职管理',
                            'path': '/hr-admin/dimission'
                        },
                        'ChangeManagement': {
                            'name': '异动管理',
                            'path': '/hr-admin/change'
                        },
                        'PayrollManagement': {
                            'name': '工资条',
                            'path': '/hr-admin/payroll'
                        }
                    }
                },
                'HrSystemManagement': {
                    'name': '人力资源系统管理',
                    'path': '/hr-admin/employee1',
                    'icon': 'img/icon/hr/renliziyuanxitong.png',
                    'children': {
                        'EmployeeRoleManagement': {
                            'name': '人员角色管理',
                            'path': '/hr-admin/employeeRole'
                        },
                        'PositionRoleManagement': {
                            'name': '岗位角色管理',
                            'path': '/hr-admin/positionRole'
                        },
                        'PositionManagement': {
                            'name': '岗位管理',
                            'path': '/hr-admin/positionManagement'
                        }
                    }
                },
                'DictionaryManagement': {
                    'name': '字典维护',
                    'path': '/hr-admin/dictionaryManagement',
                    'icon': 'img/icon/hr/zidianweihu.png',
                    'children': {
                        'DictionaryManagement': {
                            'name': '字典维护',
                            'path': '/hr-admin/dictionaryManagement'
                        }
                    }
                },
                'TrainingManagement': {
                    'name': '培训管理',
                    'path': '/hr-admin/allTrainingManagement',
                    'icon': 'img/icon/hr/peixunguanli.png',
                    'children': {
                        'TrainingTypeManagement': {
                            'name': '培训类别管理',
                            'path': '/hr-admin/trainingTypeManagement'
                        },
                        'TrainingContentManagement': {
                            'name': '培训管理',
                            'path': '/hr-admin/trainingManagement'
                        },
                        'PersonalTrainingCenter': {
                            'name': '个人培训中心',
                            'path': '/hr-admin/personalTrainingCenter'
                        }
                    }
                },
                'RecruitmentManagement': {
                    'name': '招聘管理',
                    'path': '/hr-admin/RecruitmentManagement',
                    'icon': 'img/icon/hr/zhaopin.png',
                    'children': {
                        'TalentManagement': {
                            'name': '人才管理',
                            'path': '/hr-admin/talentManagement'
                        },
                        'RecruitmentNeedManagement': {
                            'name': '招聘需求管理',
                            'path': '/hr-admin/recruitmentManagement'
                        },
                        'RecruitmentTeamDataStatistics': {
                            'name': '招聘数据汇总统计',
                            'path': '/hr-admin/RecruitmentTeamDataStatistics'
                        },
                        'RecruitmentPersonalDataStatistics': {
                            'name': '个人招聘数据统计',
                            'path': '/hr-admin/RecruitmentPersonalDataStatistics'
                        },
                        //'InvitationVisitManagement' :{
                        //    'name' : '邀约诺访管理',
                        //    'path' : '/hr-admin/invitationVisitManagement'
                        //}
                    }
                },
                'SalaryManagement': {
                    'name': '薪酬绩效',
                    'path': '/hr-admin/salaryBasic',
                    'icon': 'img/icon/hr/zhaopin.png',
                    'children': {
                        'BasicSalaryManagement': {
                            'name': '基础数据统计',
                            'path': '/hr-admin/salaryBasic'
                        }/*,
                         'EmpBasicSalaryManagement':{
                         'name': '员工薪酬基础数据',
                         'path': '/hr-admin/empSalaryBasic'
                         }*/
                    }
                }


            }
        },
        'BdManagement': {
            'name': '招商客户关系管理',
            'path': '/bd-admin',
            'children': {
                'BdLeadsManagement': {
                    'name': 'Leads管理',
                    'path': '/bd-admin/leads_list'
                },
                'BdFranchiserManagement': {
                    'name': '加盟信息管理',
                    'path': '/bd-admin/franchiser_list'
                },
                'BdInvitationManagement': {
                    'name': '邀约管理',
                    'path': '/bd-admin/invitation_list'
                }
            }
        },
        'BIManagement': {
            'name': '数据统计',
            'path': '/bi-admin',
            'children': {
                'BISchoolStatistics': {
                    'name': '校区业绩',
                    'path': '/bi-admin/school_statistics',
                    'icon': 'img/icon/bi/yingxiao.png',
                    'children': {
                        'BISchoolPerformence': {
                            'name': '业绩总表',
                            'path': '/bi-admin/schoolPerformence'
                        },
                        'BISchoolPerformenceProgress': {
                            'name': '目标进度',
                            'path': '/bi-admin/schoolPerformenceProgress'
                        },
                        'BISchoolPerformenceForSY': {
                            'name': '业绩总表',
                            'path': '/bi-admin/schoolPerformenceForSY'
                        },
                        'BISchoolPerformenceProgressForSY': {
                            'name': '目标进度',
                            'path': '/bi-admin/schoolPerformenceProgressForSY'
                        },
                        'BIConfirmIncome': {
                            'name': '确认收入',
                            'path': '/bi-admin/confirmIncome'
                        }
                    }
                },
                'BIMarketStatistics': {
                    'name': '营销报表',
                    'path': '/bi-admin/market_statistics',
                    'icon': 'img/icon/bi/yingxiao.png',
                    'children': {
                        'BISchoolLeads': {
                            'name': '客户信息',
                            'path': '/bi-admin/schoolLeads'
                        },
                        'BICustomerSourceDistribution': {
                            'name': '客户来源',
                            'path': '/bi-admin/customerSourceDistribution'
                        },
                        'BIOutboundPhoneStatistics': {
                            'name': '外呼统计',
                            'path': '/bi-admin/outboundPhoneStatistics'
                        },
                        'BIClassCourse': {
                            'name': '课程类型',
                            'path': '/bi-admin/classCourse'
                        },
                        // 'BIProductOrder':{
                        //     'name': '产品类型',
                        //     'path':'/bi-admin/productOrder'
                        // },
                        'BIChannelOrder': {
                            'name': '渠道签约',
                            'path': '/bi-admin/channelOrder'
                        },
                        //                        'BICommunication': {
                        //                            'name': '外呼统计',
                        //                            'path': '/bi-admin/communication'
                        //                        },
                        'BICourseAdvisorProcess': {
                            'name': '顾问业绩',
                            'path': '/bi-admin/courseAdvisorProcess'
                        },
                        'BiMarketerAchievement': {
                            'name': '市场业绩',
                            'path': '/bi-admin/marketerAchievement'
                        },
                        'BIGradeOrder': {
                            'name': '渠道年级',
                            'path': '/bi-admin/channelGrade'
                        },
                        'BiGradeStatistics': {
                            'name': '年级统计',
                            'path': '/bi-admin/gradeStatistics'
                        },
                        'BIO2oNum': {
                            'name': 'O2O用户统计',
                            'path': '/bi-admin/o2oNum'
                        },
                        'BIO2oOrder': {
                            'name': 'O2O订单统计',
                            'path': '/bi-admin/o2oOrder'
                        }
                    }
                },
                'BIEducationStatistics': {
                    'name': '教务报表',
                    'path': '/bi-admin/education_statistics',
                    'icon': 'img/icon/bi/jiaowu.png',
                    'children': {
                        'BIEducationColligate': {
                            'name': '教务综合',
                            'path': '/bi-admin/education_colligate'
                        },
                        'BiClassTeachingManagement': {
                            'name': '教务综合',
                            'path': '/bi-admin/biClassTeachingManagement'
                        },
                        'BiStudentTeacherCommunication': {
                            'name': '教师评价',
                            'path': '/bi-admin/studentTeacherCommunication'
                        },
                        'BiClassHour': {
                            'name': '课时统计',
                            'path': '/bi-admin/classHour'
                        },
                        'BiTeacherConsumeReport': {
                            'name': '教务日常',
                            'path': '/bi-admin/teacherConsumeReport'
                        },
                        'BiSubjectGroupReport': {
                            'name': '教务日常',
                            'path': '/bi-admin/subjectGroupReport'
                        },
                        'BiTeacherConsumeMonthlyReport': {
                            'name': '教务月报',
                            'path': '/bi-admin/teacherConsumeMonthlyReport'
                        },
                        'BiGradeSubjectConsume': {
                            'name': '年级学科消课',
                            'path': '/bi-admin/gradeSubjectConsume'
                        },
                        'BiRetentionRecommendation': {
                            'name': '年级学科续推',
                            'path': '/bi-admin/biRetentionRecommendation'
                        },
                        'BiConsumeAnalysis': {
                            'name': '消课分析-学生',
                            'path': '/bi-admin/consumeAnalysis'
                        },
                        'BiTeacherConsumeAnalysis': {
                            'name': '消课分析-教师',
                            'path': '/bi-admin/teacherConsumeAnalysis'
                        }
                    }
                },
                'BILearningStatistics': {
                    'name': '学管报表',
                    'path': '/bi-admin/learning_statistics',
                    'icon': 'img/icon/bi/xueguan.png',
                    'children': {
                        'BIContinuousConsumeCourse': {
                            'name': '续推消课',
                            'path': '/bi-admin/continuousConsumeCourse'
                        },
                        'BILearningComment': {
                            'name': '学管评价',
                            'path': '/bi-admin/learningComment'
                        },
                        'BISchoolManagementPerformence': {
                            'name': '学管业绩',
                            'path': '/bi-admin/schoolManagementPerformence'
                        }
                    }
                }
            }
        },

        'SalaryManagement': {
            'name': '薪酬管理',
            'path': '/salary-manager',
            'children': {
                'SalaryManagement': {
                    'name': '薪酬管理',
                    'path': '/salary-manager',
                    'icon': 'img/icon/bi/yingxiao.png',
                    'children': {
                        'OtherSalaryManagement': {
                            'name': '其他薪酬',
                            'path': '/salary-manager/othersalary'
                        },
                        'SalarySatisfactionResearch': {
                            'name': '满意度调查表',
                            'path': '/salary-manager/satisfactionResearch '
                        },
                        'SalaryHandOutList': {
                            'name': '薪酬发放列表',
                            'path': '/salary-manager/salaryHandOut'
                        },

                        'BasicSalaryManagement': {
                            'name': '基础数据统计',
                            'path': '/salary-manager/salaryBasic'
                        },
                        'EmployyerKpiList': {
                            'name': '员工kpi列表',
                            'path': '/salary-manager/empKpiList'
                        },
                        'MasterKpiList': {
                            'name': '主管kpi列表',
                            'path': '/salary-managern/masterKpiList'
                        },
                        'SalaryAnswerQues': {
                            'name': '答疑课统计',
                            'path': '/salary-manager/answerQues'
                        },
                        'SchoolAchievement': {
                            'name': '校区业绩目标',
                            'path': '/salary-manager/schoolAchievement'
                        }
                    }
                }
            }
        },


        'FileManagementSystem': {
            'name': '文档管理系统',
            'path': '/file-admin',
            'children': {
                'FileManagement': {
                    'name': '文档管理',
                    'path': '/file-admin/file_management'
                }
            }
        },
        'WorkflowManager': {
            'name': '工作流',
            'path': '/workflowManager-admin',
            'children': {
                'AllWorkflowManager': {
                    'name': '全部',
                    'path': '/workflowManager-admin/all_workflow',
                    'icon': 'img/icon/workFlow/all.png'
                },
                'SponsorWorkflowManager': {
                    'name': '我发起的',
                    'path': '/workflowManager-admin/sponsor_workflow',
                    'icon': 'img/icon/workFlow/sponsor.png'

                },
                'SolveWorkflowManager': {
                    'name': '我处理的',
                    'path': '/workflowManager-admin/solve_workflow',
                    'icon': 'img/icon/workFlow/solve.png'

                },
                'StarWorkflowManager': {
                    'name': '星标',
                    'path': '/workflowManager-admin/star_workflow',
                    'icon': 'img/icon/workFlow/star.png'
                },
                'AddWorkflowManager': {
                    'name': '发起工作流',
                    'path': '/workflowManager-admin/add_workflow',
                    'icon': 'img/icon/sos/teacher.png'
                }

            }
        },
        'PersonalCenter': {
            'name': '个人中心',
            'path': '/personal-admin',
            'children': {
                'PersonalDatabase': {
                    'name': '个人资料库',
                    'path': '/personal-admin/personal_database',
                    'icon': 'img/icon/sos/coursePlan.png',
                    'children': {
                        'PersonalHandouts': {
                            'name': '个人备课笔记',
                            'path': '/personal-admin/PersonalHandouts'
                        },
                        'PersonalHomework': {
                            'name': '个人作业库',
                            'path': '/personal-admin/PersonalHomework'
                        }
                    }
                }
            }
        },
        /*Teaching and research system*/
        'TaRS': {
            'name': '教研系统',
            'path': '/tars',
            'children': {
                'preNotes': {
                    'name': '备课笔记库',
                    'path': '/tars/pre/notes',
                    'icon': 'img/tars/bk-lib.png'
                },
                'queLib': {
                    'name': '试题库',
                    'path': '/tars/que/lib',
                    'icon': 'img/tars/st-lib.png'
                },
                'paperLib': {
                    'name': '试卷库',
                    'path': '/tars/paper/lib',
                    'icon': 'img/tars/sj-lib.png'
                },
                'myQue': {
                    'name': '我的组卷',
                    'path': '/tars/my/que',
                    'icon': 'img/tars/my-zj.png'
                }
            }
        }
    },
    'flag': {
        'onLineCourseFlag': 8 //线上产品标识
    }
};
var mtModal = {
    add: 'optimize/modal/order/add.html',
    detail: 'optimize/modal/order/detail.html',
    addProtocol: 'optimize/modal/order/addProtocol.html',
    addV2: 'partials/v2.order/add.html'
}
/**
 * 获取计费方案通过师资id和年级
 * @param row
 * 前端传递的schemeJson 字符串
 * @param id
 * 师资id
 * @param gradeId
 * 年级
 * @returns {string}
 * price
 */
var getPrice = function (row, id, gradeId) {
    var list = JSON.parse(row.schemeJson)
    for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].id == id) {
            return (function (prices) {
                for (var g = 0, gLen = prices.length; g < gLen; g++) {
                    if (prices[g].gradeId == gradeId) {
                        return prices[g].price
                    }
                }
            })(list[i].prices)
        }
    }
}
/**
 * 根据计费方案id获取师资列表
 * @param row
 * 含schemeJson字符串和计费方案id的方案对象
 * @returns {null|Array|*}
 */
var getPricesList = function (row) {
    var obj = JSON.parse(row.schemeJson),
        id = obj.id,
        list = []
    for (var i = 0, len = obj.length; i < len; i++) {
        list.push({
            title: obj[i].title,
            id: obj[i].id
        })
    }
    return list
}

/**
 * 数组包含
 */
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

var coefficients = [];
var getCoefficient = function (a, b) {

    coefficients = JSON.parse(sessionStorage.getItem("coefficients"));

    if (coefficients)
    //折算系数呗砍掉  全部为1
        for (var i = 0; i < coefficients.length; i++) {
            if (coefficients[i].a === a && coefficients[i].b === b) {
                return 1;
            }
        }

    return 1;
}
// 所有的有查询按钮的地方  按回车触发查询
$("body").delegate("input", "keydown", function (e) {
    if (e.keyCode == 13) {
        $("#keydown-query").click();
        $("#refe").click();
    }
})
/**
 * 返回两位数
 * @param num
 * 出入数字
 * @returns {string}
 */
var get2Num = function (num) {
    return num < 10 ? ('0' + num) : num
}
/**
 * 返回格式化日期（yyyy-MM-DD）
 * @param date
 * 传入日期，new Date()类型
 * @returns {string}
 */
var getDateFormat = function (date) {
    if (!date.getFullYear) {
        date = new Date(date)
    }
    return [date.getFullYear(), get2Num(date.getMonth() + 1), get2Num(date.getDate())].join('-')
}
