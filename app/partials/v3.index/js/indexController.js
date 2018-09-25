/**
 * Created by 李世明 on 2017/2/22 0022.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:v3.indexController
 */
angular.module('ywsApp').controller('V3IndexController', ['$scope', '$rootScope', '$location', 'localStorageService', '$sce', 'V3IndexServer', function ($scope, $rootScope, $location, localStorageService, $sce, V3IndexServer) {
    var _version = Date.now()
    $scope.getEvents = function () {
        var startDate = new Date();
        var endDate = new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000));
        V3IndexServer.getEvents(startDate.Format('yyyy-MM-dd'), endDate.Format('yyyy-MM-dd')).then(function (response) {
            $scope.events = response.data;
            // console.log($scope.events);
        });
    }

    $scope.getEvents();

    /*
    * 版本公告
    * */
    $scope.getIndexData = function (type) {
        V3IndexServer.findIndexData(type).then(function (data) {
            $scope['indexData' + type] = data.data.data
            //今日排课排序
            if (type == 4) {
                //by函数接受一个成员名字符串和一个可选的次要比较函数做为参数
                //并返回一个可以用来包含该成员的对象数组进行排序的比较函数
                //当o[age] 和 p[age] 相等时，次要比较函数被用来决出高下
                var by = function (name, minor) {
                    return function (o, p) {
                        var a, b;
                        if (o && p && typeof o === 'object' && typeof p === 'object') {
                            a = o[name];
                            b = p[name];
                            if (a === b) {
                                return typeof minor === 'function' ? minor(o, p) : 0;
                            }
                            if (typeof a === typeof b) {
                                return a < b ? -1 : 1;
                            }
                            return typeof a < typeof b ? 1 : -1;
                        } else {
                            thro("error");
                        }
                    }
                }
                if (data.data.data.coursePlans) {
                    data.data.data.coursePlans.sort(by('start_time', by('end_time', by('createDate'))));
                }
                /*var i = 0
                data.data.data.coursePlans.sort(function (a,b) {
                    console.log(++i)
                    if(a.id===2361674||b.id===2361674){

                    }
                    if(a.start_time-b.start_time<0){
                        return 0
                    }else if(a.start_time-b.start_time>0){
                        return 1
                    }else{
                        if(a.end_time-b.end_time<0){
                            return 0
                        }else if(a.end_time-b.end_time>0){
                            return 1
                        }else{
                            if(a.createDate-b.createDate<0){
                                return 0
                            }else if(a.createDate-b.createDate>0){
                                return 1
                            }
                        }
                    }
                })*/
            }
            // setData(type,data)
        })
        $rootScope._getIndexData_ = $scope.getIndexData
    }
    $scope.isShow = function (arg) {
        return (!arg && arg != 0) ? 'x' : 'y'
    }
    $scope.getIndexData(2)
    $scope.indexUrls = [
        {
            id: 6,
            url: 'partials/workbench/wb.xiaozhang.html',
            title: '校区审核',
            statTitle: '校区数据'
        }, {
            id: 40,
            url: 'partials/workbench/wb.kecheng.html',
            title: '课程顾问',
            statTitle: '个人数据'
        }, {
            id: 41,
            url: 'partials/workbench/wb.kechengMaster.html',
            title: '营销主管',
            statTitle: '营销团队数据'
        }, {
            id: 79,
            url: 'partials/workbench/wb.xiaozhang.html',
            title: '校长',
            statTitle: '校区数据'
        },
        // 1对1事业部总经理	205	全国服务评价数据,多事业部/事业部/城市/区域运营管理者	33,24
        // 20180530修改74/81
        {
            id: -1,
            url: 'partials/workbench/wb.xiaozhang.html',
            title: '1对1事业部总经理',
            statTitle: '校区数据',
            roles: [74, 81, 39]
            // ,
            // isShool: 0
        },
        // 全国营销高级经理	206	多事业部/事业部/城市/区域运营管理者	24
        // {
        //     id: 206,
        //     url: 'partials/workbench/wb.xiaozhang.html',
        //     title: '全国营销高级经理',
        //     statTitle: '校区数据',
        //     roles: [24]
        //     // ,
        //     // isSchool: 0
        // },
        // 出纳新加20180526
        // {
        //     id: 354,
        //     url: 'partials/workbench/wb.xiaozhang.html',
        //     title: '出纳',
        //     statTitle: '校区数据'
        // },

        {
            id: 86,
            url: 'partials/workbench/wb.xuexi.html',
            title: '学习顾问',
            statTitle: '个人数据'
        }, {
            id: 87,
            url: 'partials/workbench/wb.xuexiMaster.html',
            title: '运营主管',
            statTitle: '运营团队数据'
        }, {
            id: 35,
            url: 'partials/workbench/wb.jiaoshi.html',
            title: '教师',
            oldData: true
        }, {
            id: 38,
            url: 'partials/workbench/wb.jiaoshiMaster.html',
            title: '教务主管',
            oldData: true
        }, {
            id: 355,
            url: 'partials/workbench/wb.xiaozhang.html',
            title: '校区审查管理员',
            statTitle: '校区数据'
        }
    ];
    $scope.indexUrl = ''
    $scope.views = {}
    $rootScope.viewsCopy = {}
    $scope.setDateTime = function () {
        $scope.dateTime = Date.now()
    }
    $scope.setDateTime()

    /**
     * 判断控制台显示 by 岗位
     */
    function _isViewsByRole() {
        $scope.POSITION_ID = angular.copy($rootScope.currentUser.position_id);
        if (judgePosition(-1) == false) {

        } else if (judgePosition($scope.POSITION_ID) == false) {//如果没有控制台显示 则显示背景大图
            $scope.views.background = true;
            $rootScope.viewsCopy.background = 1;
            sessionStorage.setItem('viewsCopy', 1)
        }
        // if (judgePosition($scope.POSITION_ID) == false && judgePosition(-1) == false) {
        //     $scope.views.background = true;
        //     $rootScope.viewsCopy.background = 1;
        //     sessionStorage.setItem('viewsCopy', 1)
        // }
    }

    _isViewsByRole()

    /**
     * 通过判断岗位  选择显示页面
     * @param id
     * @returns {boolean}
     */
    function judgePosition(id) {
        var getIndexUrlById = function () {
            for (var i = 0, max = $scope.indexUrls.length; i < max; i++) {
                // console.log($scope.indexUrls[i].id, id)
                if ($scope.indexUrls[i].id == -1) {
                    var _roles = $scope.indexUrls[i].roles
                    var _local_roles = localStorageService.get('roles')
                    var department = localStorageService.get('department') || {}
                    for (var _i = 0, _len = _roles.length; _i < _len; _i++) {
                        for (var _li = 0, _llen = _local_roles.length; _li < _llen; _li++) {
                            if (_local_roles[_li].id == _roles[_i] && department.isSchool) {
                                $scope.indexUrl = $scope.indexUrls[i].url
                                $rootScope.indexUrlCopy = $scope.indexUrls[i].url
                                sessionStorage.setItem('indexUrlCopy', $scope.indexUrls[i].url)
                                $scope.statTitle = $scope.indexUrls[i].statTitle
                                $scope.oldData = $scope.indexUrls[i].oldData

                                return false
                            }
                        }
                    }
                } else if (id == $scope.indexUrls[i].id) {
                    $scope.indexUrl = $scope.indexUrls[i].url
                    $rootScope.indexUrlCopy = $scope.indexUrls[i].url
                    sessionStorage.setItem('indexUrlCopy', $scope.indexUrls[i].url)
                    $scope.statTitle = $scope.indexUrls[i].statTitle
                    $scope.oldData = $scope.indexUrls[i].oldData

                    return false
                }
            }
        }
        switch (id) {
            case 35:
                $rootScope._dataCount = true
                getIndexUrlById(id)
                break;
            case 79:
                $rootScope._dataCount = true
                getIndexUrlById(id)
                break;
            case 205:
                getIndexUrlById(id)
                break;
            case 86:
                $rootScope._dataCount = true
                getIndexUrlById(id)
                break;
            case 87:
                $rootScope._dataCount = true
                getIndexUrlById(id)
                break;
            case 40:
                getIndexUrlById(id)
                break;
            case 41:
                getIndexUrlById(id)
                break;
            case 38:
                getIndexUrlById(id)
                break;
            case 9:
                getIndexUrlById(id)
                break;
            case 6:
                getIndexUrlById(id)
                break;
            case 202:
                getIndexUrlById(id)
                break;
            case 201:
                getIndexUrlById(id)
                break;
            case 90:
                getIndexUrlById(id)
                break;
            case 207:
                getIndexUrlById(id)
                break;
            case 51:
                getIndexUrlById(id)
                break;
            // 新加20180526
            // case 354:
            //     // $rootScope._dataCount = true
            //     getIndexUrlById(id)
            //     break;
            // 新加20180526
            // case 205:
            //     getIndexUrlById(id)
            //     break;
            // // 新加20180526
            // case 206:
            //     getIndexUrlById(id)
            //     break;
            case -1:
                $rootScope._dataCount = true
                getIndexUrlById(id)
                break;
            case 355:
                $rootScope._dataCount = true
                getIndexUrlById(id)
                break;
        }
    }

    $scope.moreIndexData = {}

    /**
     *
     需求背景：
     校长及主管可在首页查看当前业绩，但不能查看到任务的完成进度，需要到数据统计中查看，不够直观。

     使用人：
     校长、营销主管、运营主管

     */
    function moreIndexDatas() {
        var date = new Date()
        var day = 24 * 60 * 60 * 1000
        var begin = new Date(date.getFullYear(), date.getMonth(), 1)
        var end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        //  {"startTime":"2018-04-30T16:00:00.000Z","endTime":"2018-05-30T16:00:00.000Z","schoolType":"1","schoolProvince":110000,"schoolCity":110200,"timeScope":"单月","statTime":"2018-05-12","start":0,"size":10,"departmentId":1}

        V3IndexServer.findIndexDataMore(
            {
                departmentId: sessionStorage.getItem('com.youwin.yws.department_id'),
                timeScope: "单月",
                schoolType: '',
                size: 10,
                start: 0,
                schoolProvince: '',
                schoolCity: '',
                statTime: [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'),
                startTime: begin,
                endTime: end
            }
        ).then(function (data) {
            $scope.moreIndexData = data.data.data.list[0] || {}
            if ($scope.moreIndexData.marketGoal == 0) {
                $scope.moreIndexData.marketRatio = '---';
                $scope.moreIndexData.marketBalance = '---';
            }
            if ($scope.moreIndexData.managementGoal == 0) {
                $scope.moreIndexData.managementRatio = '---';
                $scope.moreIndexData.managementBalance = '---';
            }
            if ($scope.moreIndexData.managementGoal == 0 || $scope.moreIndexData.marketGoal == 0) {
                $scope.moreIndexData.totalRatio = '---';
                $scope.moreIndexData.totalBalance = '---';
            }
            if ($scope.moreIndexData.consumeGoal == 0) {
                $scope.moreIndexData.consumeRatio = '---';
                $scope.moreIndexData.consumeBalance = '---';
            }
        })
    }

    if ($scope.POSITION_ID === 79 || $scope.POSITION_ID === 87 || $scope.POSITION_ID === 41) {
        moreIndexDatas()
    }
    $(document).find('.modal').remove()

}])//版本公告
    .directive('announcement', ['$parse', '$compile', function ($parse, $compile) {
        return {
            restrict: 'E',
            scope: true,
            link: function (scope, element, attrs) {
                scope.getIndexData(attrs.type)
                scope.$parent.$watch(attrs.datas, function (newVal) {
                    var _html = ''
                    if (newVal) {
                        _html = '<div class="announcement br-4 margin-top20">' +
                            '<div class="cont">' +
                            '<h4>版本公告</h4>' +
                            '<p class="ti-28">{{' + attrs.datas + '.version.introduction}}</p>' +
                            '<a href="#/version-show" class="a-more">查看详情</a>' +
                            '</div>' +
                            '<footer></footer>' +
                            '</div>'

                    } else {
                        _html = '<div class="announcement br-4 margin-top20">' +
                            '<div class="cont">' +
                            '<h4>版本公告</h4>' +
                            '<p class="loading"></p>' +
                            '</div>' +
                            '<footer></footer>' +
                            '</div>'
                    }
                    var template = angular.element(_html);
                    var linkFunction = $compile(template);
                    linkFunction(scope);
                    element.html(template);
                }, true)
            }
        }
    }])
    //帮助指南
    .directive('help', ['$parse', '$compile', function ($parse, $compile) {
        return {
            restrict: 'E',
            scope: true,
            link: function (scope, element, attrs) {
                scope.getIndexData(attrs.type)
                scope.$parent.$watch(attrs.datas, function (newVal) {
                    var _html = ''
                    if (newVal) {
                        _html = '<div class="help-Tab margin-top20">' +
                            '<h4 class="icon-berfor icon-help h4-bbr">帮助指南 <a href="#/help" class="a-more fr">帮助中心</a></h4><div class="of">' +
                            '<ul class="showList" style="overflow-y: auto">' +
                            '<li class="icon-berfor icon-radius" ng-repeat="el in  ' + attrs.datas + '.helpList"><a href="#/help?v3=1&detail={{el}}">{{el.contentTitle}}</a></li></ul></div></div>'

                    } else {
                        _html = '<div class="help-Tab margin-top20">' +
                            '<h4 class="icon-berfor icon-help h4-bbr">帮助指南 <a href="#/help" class="a-more fr">帮助中心</a></h4>' +
                            '<ul class="showList tc"><img src="bower_components/webui-popover/img/loading.gif">' +
                            '</ul></div>'
                    }
                    var template = angular.element(_html);
                    var linkFunction = $compile(template);
                    linkFunction(scope);
                    element.html(template);
                }, true)
            }
        }
    }])
    //待办提醒
    .directive('upcoming', ['$parse', '$compile', '$sce', function ($parse, $compile, $sce) {
        return {
            restrict: 'E',
            scope: true,
            link: function (scope, element, attrs) {
                scope.getIndexData(attrs.type)
                scope.$parent.$watch(attrs.datas, function (newVal) {
                    var _html = ''
                    if (newVal) {
                        _html = '<div class="help-Tab margin-top20" ng-class="{\'notice-0\':!' + attrs.datas + '.noticeData.length}">' +
                            '<h4 class="icon-berfor icon-msg h4-bbr">待办提醒 <a id="msg_center" class="a-more fr">提醒中心</a></h4><div>' +
                            '<ul class="showList"> <li ng-repeat="el in ' + attrs.datas + '.noticeData" class="icon-berfor icon-radius icon-bg-gray"><a tragger-click="{{el.type}}"><b>{{el.number}}</b>{{el.noticeTile}}</a></li></ul></div></div>'
                        /*ng-click="showRemindingListModal(el.type)"*/
                    } else {
                        _html = '<div class="help-Tab margin-top20">' +
                            '<h4 class="icon-berfor icon-msg h4-bbr">待办提醒 <a id="msg_center" class="a-more fr">提醒中心</a></h4><div>' +
                            '<ul class="showList tc"> ' +
                            '<img src="bower_components/webui-popover/img/loading.gif">' +
                            '</ul></div></div>'
                    }
                    var template = angular.element(_html);
                    var linkFunction = $compile(template);
                    linkFunction(scope);
                    element.html(template);
                }, true)
            }
        }
    }])
    //本周签单
    .directive('signThisweek', ['$parse', '$compile', function ($parse, $compile) {
        return {
            restrict: 'E',
            scope: true,
            link: function (scope, element, attrs) {
                scope.getIndexData(attrs.type)
                scope.$parent.$watch(attrs.datas, function (newVal) {
                    var _html = ''
                    if (newVal) {
                        _html = '<div class="col-lg-6">' +
                            '<div class="sighing-bill margin-top20">' +
                            '<h4 class="icon-berfor icon-week h4-bbr">本周签单 <a href="#/fb-admin/order" class="a-more fr">订单管理</a></h4>' +
                            '<div class="overflow-x" ng-class="{\'order-0\':!' + attrs.datas + '.orderData.length}">' +
                            '<table class="table mt-table1" ng-controller="OrderManagementController as sss">' +
                            '<tr class="thead"><th>学生姓名</th><th>签单金额</th><th>签单人</th><th>是否清款</th><th>操作</th></tr>' +
                            '<tr ng-repeat="el in ' + attrs.datas + '.orderData"> <td>' +
                            '<div ng-if="el.hasSlaveInfos" ng-click="getSuborders(el)"><img src="img/more.png?v=1.0" style="width: 20px;">&nbsp;{{el.studentName}}</div>' +
                            '                            <div ng-if="!el.hasSlaveInfos" >{{el.studentName}}</div>' +
                            '</td> <td>{{el.realTotalAmount}}</td> <td>{{el.achievementPerson}}</td> <td><span class="has-pay" ng-if="!el.payAllDueAmount">已清款</span><span class="not-pay" ng-if="el.payAllDueAmount">未清款</span></td> <td><a ng-if="el.orderCategory == 1" ng-click="detailOrder(el)">详情</a><a  ng-if="el.orderCategory == 2" ng-click="detailOrderOTO(el)">详情</a><a  ng-if="el.orderCategory == 3" ng-click="detailOrder(el)">详情</a></td></tr></table>' +
                            '</div></div></div>'

                    } else {
                        _html = '<div class="col-lg-6">' +
                            '<div class="sighing-bill margin-top20">' +
                            '<h4 class="icon-berfor icon-week h4-bbr">本周签单 <a href="#/fb-admin/order" class="a-more fr">订单管理</a></h4>' +
                            '<div class="overflow-x">' +
                            '<table class="table mt-table1">' +
                            '<tr class="thead"><th>学生姓名</th><th>签单金额</th><th>签单人</th><th>是否清款</th><th>操作</th></tr>' +
                            '<tr> <td colspan="5" class="tc">' +
                            '<img src="bower_components/webui-popover/img/loading.gif"></td></tr></table>' +
                            '</div></div></div>'
                    }
                    var template = angular.element(_html);
                    var linkFunction = $compile(template);
                    linkFunction(scope);
                    element.html(template);
                }, true)
            }
        }
    }])
    //今日上课
    .directive('todayClass', ['$parse', '$compile', function ($parse, $compile) {
        return {
            restrict: 'E',
            scope: true,
            link: function (scope, element, attrs) {
                scope.getIndexData(attrs.type)
                scope.$parent.$watch(attrs.datas, function (newVal) {
                    var _html = ''
                    if (newVal) {/*<!--<th>操作</th>-->*/
                        _html = '<div class="col-lg-6"> <div class="tody-lesson margin-top20"> <h4 class="icon-berfor icon-today h4-bbr">今日上课 <a href="#/sos-admin/course_plan" class="a-more fr">排课消课管理 </a></h4> <div class="overflow-x" ng-class="{\'class-0\':!' + attrs.datas + '.coursePlans.length}"> <table class="table mt-table1" ng-controller="CoursePlanController as dsfdfs">' +
                            '<tr class="thead"> <th>学生/一对多</th> <th>上课时间</th> <th>老师</th> <th>消课</th>  </tr>' +
                            '<tr ng-repeat="el in ' + attrs.datas + '.coursePlans" ng-if="el.id ||el.groupId"> <td>{{el.student_name||el.groupName}}</td> <td>{{el.start_time|date:"HH:mm"}}-{{el.end_time|date:"HH:mm"}}</td> <td>{{el.teacher_name||el.teacherName}}</td> <td><span class="has-pay" ng-if="el.is_past||el.isPast">已消课</span><span class="not-pay" ng-if="!el.is_past&&!el.isPast">未消课</span></td></tr>' +
                            '</table> </div> </div> </div>'
                        /*<td>' +
                                                    '<div ng-if="el.type==2||el.type==9">' +
                                                    '<a ng-if="el.is_satisfied!=0&&el.isPast==1&&el.type!=3" ng-click="getClassPorintList(el)">打印</a><a ng-if="el.isPast==0" ng-click="yesconsume2(el,6)">消课</a>' +
                                                    '</div>' +
                                                    '<div ng-if="el.type!=2&&el.type!=9">' +
                                                    '<a ng-if="el.is_satisfied!=0&&el.is_past==1&&el.type!=3" ng-click="chromePrintForOne2One(el)">打印</a><a ng-if="el.is_past==0" ng-click="yesconsumeForOne2One(el)">消课</a>' +
                                                    '</div>' +
                                                    '</td>*/
                    } else {
                        _html = '<div class="col-lg-6"> <div class="tody-lesson margin-top20"> <h4 class="icon-berfor icon-today h4-bbr">今日上课 <a href="#/sos-admin/course_plan" class="a-more fr">排课消课管理 </a></h4> <div class="overflow-x"> <table class="table mt-table1">' +
                            '<tr class="thead"> <th>学生/一对多</th> <th>上课时间</th> <th>老师</th> <th>消课</th> <th>操作</th> </tr>' +
                            '<tr> <td colspan="5"><img src="bower_components/webui-popover/img/loading.gif">' +
                            '</td></tr>' +
                            '</table> </div> </div> </div>'
                    }
                    var template = angular.element(_html);
                    var linkFunction = $compile(template);
                    linkFunction(scope);
                    element.html(template);
                }, true)
            }
        }
    }])
;
$(document).on('click', '#msg_center', function () {
    $('.msg-list').find('.msg-icon').eq(0).click()
})
