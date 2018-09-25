/**
 * Created by 毅 on 2016/5/16.
 */
ywsApp.controller('sosGuideController',
    ['$scope', '$modal', '$rootScope','$location','$timeout', 'SweetAlert','workbenchSvc','WorkFlowService',
        function($scope, $modal, $rootScope,$location,$timeout, SweetAlert,workbenchSvc,WorkFlowService) {
            $scope.views = {
            };//存放页面显示参数
            $scope.lableDateOne = {}
            /**
             * 配置参数
             * @type {*[]}
             */
            $scope.lableDate = [
                //  课程顾问关键业务数据配置
                {
                    titleH1:'课程顾问关键业务',
                    id:40,
                    titleH2:
                        [
                            {
                                title:'新签',
                                datas:[
                                    {
                                        btn:'新增意向客户',
                                        // //width:{'width':'240px'},
                                        href:'#/fb-admin/leads_student_myself/add',
                                        tip:'点击进入我的意向客户，进行新增意向客户操作'
                                    },
                                    {
                                        btn:'拨打客户电话',
                                        //width:{'width':'240px'},
                                        href:'#/fb-admin/leads_student_myself',
                                        tip:'点击进入我的意向客户，进行拨打电话操作'
                                    },{
                                        btn:'新增邀约',
                                        href:'#/fb-admin/InvitationChild/1',
                                        tip:'点击进入邀约到访管理，进行新增邀约操作'
                                    },{
                                        btn:'试听排课',
                                        href:'#/sos-admin/course_plan/3',
                                        tip:'点击进入排课消课管理，进行试听排课操作'
                                    },{
                                        btn:'添加订单',
                                        href:'#/fb-admin/order/1',
                                        tip:'点击进入订单管理，进行添加订单操作'
                                    }
                                ]
                            }
                        ]
                    
                },
                //  营销主管关键业务
                {
                    titleH1:'课程顾问关键业务',
                    id:41,
                    titleH2:[
                        {
                            title:'团队',
                            datas:[
                                {
                                    btn:'批量分配客户',
                                    href:'#/fb-admin/leads_student/batch',
                                    tip:'点击进入校区意向客户，进行批量分配客户操作'
                                },
                                {
                                    btn:'分配客户',
                                    href:'#/fb-admin/leads_student/one',
                                    tip:'点击进入校区意向客户，进行分配客户操作'
                                },{
                                    btn:'确认到访',
                                    href:'#/fb-admin/InvitationChild',
                                    tip:'点击进入邀约到访管理，进行确认到访操作'
                                },{
                                    btn:'查看营销报表',
                                    href:'#/bi-admin/channelOrder',
                                    tip:'点击进入CRM数据统计，查看营销报表'
                                }
                            ]
                        },
                        {
                            title:'新签',
                            datas:[
                                {
                                    btn:'新增意向客户',
                                    //width:{'width':'240px'},
                                    href:'#/fb-admin/leads_student_myself/add',
                                    tip:'点击进入我的意向客户，进行新增意向客户操作'
                                },
                                {
                                    btn:'拨打客户电话',
                                    //width:{'width':'240px'},
                                    href:'#/fb-admin/leads_student_myself',
                                    tip:'点击进入我的意向客户，进行拨打电话操作'
                                },{
                                    btn:'新增邀约',
                                    href:'#/fb-admin/InvitationChild/1',
                                    tip:'点击进入邀约到访管理，进行新增邀约操作'
                                },{
                                    btn:'试听排课',
                                    href:'#/sos-admin/course_plan/3',
                                    tip:'点击进入排课消课管理，进行试听排课操作'
                                },{
                                    btn:'添加订单',
                                    href:'#/fb-admin/order/1',
                                    tip:'点击进入订单管理，进行添加订单操作'
                                }
                            ]
                        }
                    ]
                },
                //  学习顾问关键业务
                {
                    titleH1:'学习顾问关键业务',
                    id:86,
                    titleH2:[
                        {
                            title:'学员服务',
                            datas:[
                                {
                                    btn:'拨打学员电话',
                                    //width:{'width':'240px'},
                                    href:'#/sos-admin/customer_student',
                                    tip:'点击进入学员管理，进行拨打电话操作'
                                },
                                {
                                    btn:'学员排课',
                                    href:'#/sos-admin/course_plan/1',
                                    tip:'点击进入排课消课管理，进行学员排课操作'
                                },{
                                    btn:'学员消课',
                                    href:'#/sos-admin/course_plan',
                                    tip:'点击进入排课消课管理，进行消课操作'
                                },{
                                    btn:'添加续费',
                                    href:'#/fb-admin/order/1',
                                    tip:'点击进入订单管理，进行添加订单操作'
                                }
                            ]
                        },
                        {
                            title:'推荐',
                            datas:[
                                {
                                    btn:'新增意向客户',
                                    //width:{'width':'240px'},
                                    href:'#/fb-admin/leads_student_myself/add',
                                    tip:'点击进入我的意向客户，进行新增意向客户操作'
                                },
                                {
                                    btn:'拨打客户电话',
                                    //width:{'width':'240px'},
                                    href:'#/fb-admin/leads_student_myself',
                                    tip:'点击进入我的意向客户，进行拨打电话操作'
                                },{
                                    btn:'新增邀约',
                                    href:'#/fb-admin/InvitationChild/1',
                                    tip:'点击进入邀约到访管理，进行新增邀约操作'
                                },{
                                    btn:'试听排课',
                                    href:'#/sos-admin/course_plan/3',
                                    tip:'点击进入排课消课管理，进行试听排课操作'
                                },{
                                    btn:'添加订单',
                                    href:'#/fb-admin/order/1',
                                    tip:'点击进入订单管理，进行添加订单操作'
                                }
                            ]
                        }
                    ]
                },
                //  运营主管关键业务
                {
                    titleH1:'运营主管关键业务',
                    id:87,
                    titleH2:[
                        {
                            title:'团队',
                            datas:[
                                {
                                    btn:'分配学员',
                                    href:'#/sos-admin/customer_student/add',
                                    tip:'点击进入学员管理，进行分配学员操作'
                                },
                                {
                                    btn:'确认到访',
                                    href:'#/fb-admin/InvitationChild',
                                    tip:'点击进入邀约到访管理，进行确认到访操作'
                                },{
                                    btn:'查看学管报表',
                                    href:'#/bi-admin/continuousConsumeCourse',
                                    tip:'点击进入CRM数据统计，查看学管报表'
                                }
                            ]
                        },
                        {
                            title:'学员服务',
                            datas:[
                                {
                                    btn:'拨打学员电话',
                                    //width:{'width':'240px'},
                                    href:'#/sos-admin/customer_student',
                                    tip:'点击进入学员管理，进行拨打电话操作'
                                },{
                                    btn:'学员排课',
                                    href:'#/sos-admin/course_plan/1',
                                    tip:'点击进入排课消课管理，进行学员排课操作'
                                },{
                                    btn:'学员消课',
                                    href:'#/sos-admin/course_plan',
                                    tip:'点击进入排课消课管理，进行消课操作'
                                },{
                                    btn:'添加续费',
                                    href:'#/fb-admin/order/1',
                                    tip:'点击进入订单管理，进行添加订单操作'
                                }
                            ]
                        },
                        {
                            title:'推荐',
                            datas:[
                                {
                                    btn:'新增意向客户',
                                    //width:{'width':'240px'},
                                    href:'#/fb-admin/leads_student_myself/add',
                                    tip:'点击进入我的意向客户，进行新增意向客户操作'
                                },
                                {
                                    btn:'拨打客户电话',
                                    //width:{'width':'240px'},
                                    href:'#/fb-admin/leads_student_myself',
                                    tip:'点击进入我的意向客户，进行拨打电话操作'
                                },{
                                    btn:'新增邀约',
                                    href:'#/fb-admin/InvitationChild/1',
                                    tip:'点击进入邀约到访管理，进行新增邀约操作'
                                },{
                                    btn:'试听排课',
                                    href:'#/sos-admin/course_plan/3',
                                    tip:'点击进入排课消课管理，进行试听排课操作'
                                },{
                                    btn:'添加订单',
                                    href:'#/fb-admin/order/1',
                                    tip:'点击进入订单管理，进行添加订单操作'
                                }
                            ]
                        }
                    ]
                },
                //  呼叫专员关键业务
                {
                    titleH1:'呼叫专员关键业务',
                    id:24,
                    titleH2:[
                        {
                            title:'新签',
                            datas:[
                                {
                                    btn:'新增意向客户',
                                    //width:{'width':'240px'},
                                    href:'#/fb-admin/leads_student_myself/add',
                                    tip:'点击进入我的意向客户，进行新增意向客户操作'
                                },
                                {
                                    btn:'拨打客户电话',
                                    //width:{'width':'240px'},
                                    href:'#/fb-admin/leads_student_myself',
                                    tip:'点击进入我的意向客户，进行拨打电话操作'
                                },{
                                    btn:'新增邀约',
                                    href:'#/fb-admin/InvitationChild/1',
                                    tip:'点击进入邀约到访管理，进行新增邀约操作'
                                },{
                                    btn:'试听排课',
                                    href:'#/sos-admin/course_plan/3',
                                    tip:'点击进入排课消课管理，进行试听排课操作'
                                },{
                                    btn:'添加订单',
                                    href:'#/fb-admin/order/1',
                                    tip:'点击进入订单管理，进行添加订单操作'
                                }
                            ]
                        },{
                            title:'招聘',
                            datas:[
                                {
                                    btn:'新增人才',
                                    href:'#/hr-admin/talentManagement/1',
                                    tip:'点击进入人才管理，进行新增人才操作'
                                },
                                {
                                    btn:'新增招聘节点',
                                    href:'#/hr-admin/talentManagement',
                                    tip:'点击进入人才管理，进行编辑人才操作'
                                }
                            ]
                        }
                    ]
                },
                //  校长关键业务
                {
                    titleH1:'校长关键业务',
                    id:79,
                    titleH2:[
                        {
                            title:'人力资源',
                            datas:[
                                {
                                    btn:'添加人才',
                                    href:'#/hr-admin/talentManagement/1',
                                    tip:'点击进入人才管理，进行新增人才操作'
                                },
                                {
                                    btn:'办理入职',
                                    href:'#/hr-admin/employee/1',
                                    tip:'点击进入员工管理，进行办理入职操作'
                                },{
                                    btn:'添加员工',
                                    href:'#/hr-admin/employee/2',
                                    tip:'点击进入员工管理，进行添加员工操作'
                                },{
                                    btn:'办理异动',
                                    href:'#/hr-admin/employee/2',
                                    tip:'点击进入员工管理，进行办理异动操作'
                                },{
                                    btn:'办理离职',
                                    href:'#/hr-admin/employee/2',
                                    tip:'点击进入员工管理，进行修改员工操作'
                                }
                            ]
                        },{
                            title:'业务',
                            datas:[
                                {
                                    btn:'批量分配客户',
                                    //width:{'width':'240px'},
                                    href:'#/fb-admin/leads_student/batch',
                                    tip:'点击进入校区意向客户，进行批量分配客户操作'
                                },
                                {
                                    btn:'分配客户',
                                    href:'#/fb-admin/leads_student/one',
                                    tip:'点击进入校区意向客户，进行分配客户操作'
                                },
                                {
                                    btn:'分配学员',
                                    href:'#/sos-admin/customer_student/add',
                                    tip:'点击进入学员管理，进行分配学员操作'
                                }
                                ,{
                                    btn:'确认到访',
                                    href:'#/fb-admin/InvitationChild',
                                    tip:'点击进入邀约到访管理，进行确认到访操作'
                                }
                            ]
                        },
                        {
                            title:'统计',
                            datas:[
                                {
                                    btn:'添加月目标',
                                    //width:{'width':'224px'},
                                    href:'#/fb-admin/schoolGoalEntrance',
                                    tip:'点击添加校区业绩月目标'
                                },{
                                    btn:'查看营销报表',
                                    //width:{'width':'240px'},
                                    href:'#/bi-admin/channelOrder',
                                    tip:'点击进入CRM数据统计，查看营销报表'
                                },{
                                    btn:'查看学管报表',
                                    //width:{'width':'240px'},
                                    href:'#/bi-admin/continuousConsumeCourse',
                                    tip:'点击进入CRM数据统计，查看学管报表'
                                },
                                {
                                    btn:'查看教务报表',
                                    href:'#/bi-admin/education_colligate',
                                    tip:'点击进入CRM数据统计，查看教务报表'
                                }
                            ]
                        },
                    ]
                }
            ]
            /**
             * 判断控制台显示 by 岗位
             */
            function _isViewsByRole(){
                $scope.POSITION_ID = angular.copy($rootScope.currentUser.position_id);
                if(judgePosition($scope.POSITION_ID) == false){//如果没有控制台显示 则显示背景大图
                    $scope.views.background = true;
                }
            }

            /**
             * 通过判断岗位  选择显示
             * @param id
             * @returns {boolean}
             */
            function judgePosition(id){
                /**
                 * 获取数据
                 * @param id
                 * @returns {*}
                 */
                var getOneData = function (id) {
                    for (var i = 0 , max = $scope.lableDate.length;i<max;i++){
                        if($scope.lableDate[i].id==id){
                            return $scope.lableDate[i];
                        }
                    }
                };
                switch (id){
                    case 40:$scope.lableDateOne = getOneData(id)
                        break;
                    case 41:$scope.lableDateOne = getOneData(id)
                        break;
                    case 86:$scope.lableDateOne = getOneData(id)
                        break;
                    case 87:$scope.lableDateOne = getOneData(id)
                        break;
                    case 24:$scope.lableDateOne = getOneData(id)
                        break;
                    case 79:$scope.lableDateOne = getOneData(id)
                        break;
                }
                if(id == 205){//一对一经理
                    $scope.views.oneToOne = true;
                    return true;
                }

                /*  if(id == 12){//教师
                 return true
                 $scope.views.jiaoshi = true;
                 }*/
                if(id == 38){//教务主管 38
                    $scope.views.jiaoshiMaster = true;
                    return true;

                }

                if(id == 9){//城市总监 9
                    $scope.views.chengshiMaster = true;
                    return true;
                }
                if(id==202 || id==201){//执行董事202 || 董事长201
                    /*if(id==202 || id==201){//线上岗位id 执行董事202 || 董事长201*/
                    $scope.views.director = true;
                    return true;
                }
                return false;
            }

            /*************************************************************************************************************
             * *********************************************************************************************************/
            (function init(angular){
                _isViewsByRole();
                /* $(window).resize(function(){//页面大小改变时 重新加载页面 因为
                 location.reload();
                 });*/
                $timeout(function(){
                    $("[data-toggle='tooltip']").tooltip();
                },1000);
            })(angular);

        }]);