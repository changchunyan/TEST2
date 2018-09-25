'use strict';

/* Directives */

angular.module('ywsApp')
    .directive('navMenu', ['$parse', '$compile', function ($parse, $compile) {
        return {
            restrict: 'E',
            scope: true,
            link: function (scope, element, attrs) {
                scope.$watch(attrs.menuData, function (val) {
                    var text = '<div class="navbar navbar-default">';
                    text += '<div id="navbar" class="navbar-collapse" style="padding-left:20px;overflow:hidden;">';
                    text += '<ul class="nav navbar-nav">';
                    text += '<li><img src="img/main/logo.png" class="s_logo" /></li>';
                    text += '<li ng-repeat="node in ' + attrs.menuData + '" ng-class="{active:node.active && node.active == true}">';
                    text += '<span ng-if="node.active == true" class="s_arrow"></span>';
                    text += '<a ng-href="{{node.href}}" target="{{node.target}}">{{node.text}}</a>';
                    text += '</li>';


                    text += '</ul>';
                    text += '</div>';
                    text += '</div>';
                    var template = angular.element(text);
                    var linkFunction = $compile(template);
                    linkFunction(scope);
                    element.html(null).append(template);
                }, true);
            }
        };
    }])
    .directive('navSide', ['$compile', function ($compile) {
        function getHeaderImg(scope) {
            return scope.currentUser.profile || Constants.USER.HEADER_IMG;
        }

        return {
            restrict: 'E',
            scope: true,
            link: function (scope, element, attrs) {
                scope.$watch(attrs.menuData, function (val) {
                    var text = '<ul class="nav nav-pills nav-stacked s_ul_left">';
                    text += '<img ng-src="' + getHeaderImg(scope) + '" class="s_user_pic" >';
                    text += '<li ng-repeat="node in ' + attrs.menuData + '" ng-class="{active:node.active && node.active==true}">';
                    text += '<img ng-src="{{node.icon}}" class="s_little_icon" />';
                    text += '<a ng-href="{{node.href}}" target="{{node.target}}">{{node.text}}</a>';
                    text += '<img src="img/icon/right.png" class="s_right_icon" />';
                    text += '</li>';
                    text += '</ul>';
                    var template = angular.element(text);
                    var linkFunction = $compile(template);
                    linkFunction(scope);
                    element.html(null).append(template);
                }, true);
            }
        };
    }])
    .directive('mtTabs', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: { tabel: '=', index: '=', url: '=' },
            template: '<div class="mt-tabs"><ul><li ng-repeat="el in tabel" ng-if="el.show" ng-class="{\'active\':el.select}" ng-click="changeMtTabs($index)">{{el.title}}</li></ul></div>',
            replace: false,
            link: function (scope, element, attr) {
                /**
                 * 设置切入点，执行查询前进行tabel切换操作
                 * @param index
                 * 当前高亮tabel的索引
                 */
                scope.changeMtTabs = function (index) {
                    if (angular.isFunction(scope.tabel[index].clickFun))
                        scope.tabel[index].clickFun()
                    scope.index = index
                    //  切换高亮操作
                    for (var i = 0, len = scope.tabel.length; i < len; i++) {
                        if (i != index) {
                            scope.tabel[i].select = 0
                        } else {
                            scope.tabel[i].select = 1
                            scope.url = scope.tabel[i].url
                        }
                    }

                }
            }
        };
    })
    .directive('tabs', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: { paneChanged: '&' },
            controller: ["$scope", function ($scope) {
                var panes = $scope.panes = [];

                $scope.select = function (pane) {
                    angular.forEach(panes, function (pane) {
                        pane.selected = false;
                    });
                    pane.selected = true;
                    $scope.paneChanged({ selectedPane: pane });
                }

                this.addPane = function (pane) {
                    if (panes.length == 0) {
                        $scope.select(pane);
                    }
                    if (pane.active && pane.active === 'true') {
                        $scope.select(pane);
                    }
                    panes.push(pane);
                }
            }],
            template: '<div class="tabbable">' +
            '<ul class="nav nav-tabs" ng-if="panes.length">' +
            '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">' +
            '<a href="" ng-click="select(pane)" ng-class="{true: \'color-red\', false: \'\'}[pane.flag]">{{pane.title}}</a>' +
            '</li>' +
            '</ul>' +
            '<div class="tab-content" ng-transclude></div>' +
            '</div>',
            replace: true
        };
    })
    .directive('pane', function () {
        return {
            require: '^tabs',
            restrict: 'ECMA',
            transclude: true,
            scope: { title: '@', flag: '@', active: '@' },
            link: function (scope, element, attrs, tabsCtrl) {
                tabsCtrl.addPane(scope);
            },
            template: '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
            '</div>',
            replace: true
        };
    })
    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }])

    .directive('setNoEdit', function () {//set-no-edit="" is-edit="true"
        return {
            restrict: 'AE',
            replace: false,
            template: '',
            scope: {
                isEdit: '=isEdit'
            },
            link: function (scope, ele, attr) {
                if (typeof (attr.isEdit) != undefined && attr.isEdit != null)
                    //;
                    //var isEdit = attr.isEdit;
                    if (!scope.isEdit) {
                        ele.children().each(function (index, element) {
                            $(this).find('input').attr("disabled", "disabled");
                            $(this).find('button').attr("disabled", "disabled");
                            $(this).find('textarea').attr("disabled", "disabled");
                        });
                        ele.children().each(function (index, element) {
                            $(this).find('select').attr("disabled", "disabled");
                        });
                    }
            }
        }
    })

    .directive('imgModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {
                var model = $parse(attrs.imgModel);
                var modelSetter = model.assign;
                element.bind('change', function (event) {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                    var file = (event.srcElement || event.target).files[0];
                    scope.getFile(file);
                });
            }
        };
    }])
    .directive('treeView', [function () {
        return {
            restrict: 'E',
            templateUrl: '/treeView.html',
            scope: {
                treeData: '=',
                canChecked: '=',
                textField: '@',
                itemClicked: '&',
                itemCheckedChanged: '&',
                itemTemplateUrl: '@',
                containNode: '='//包含的节点集
            },
            controller: ['$scope', function ($scope) {
                $scope.itemExpended = function (item, $event) {
                    item.$$isExpend = !item.$$isExpend;
                    $event.stopPropagation();
                };

                $scope.getItemIcon = function (item) {
                    var isLeaf = $scope.isLeaf(item);
                    if (isLeaf) {
                        return 'fa fa-leaf';
                    }
                    return item.$$isExpend ? 'fa fa-minus' : 'fa fa-plus';
                };

                $scope.isLeaf = function (item) {
                    return !item.children || !item.children.length;
                };
                $scope.containsPermission = function (permission) {
                    var found = false;
                    if ($scope.containNode.permissions) {
                        angular.forEach($scope.containNode.permissions, function (p, index) {
                            if (permission.id == p.id) {
                                found = true;
                                return;
                            }
                        });
                    }
                    return found;
                };
                $scope.warpCallback = function (callback, item, $event) {
                    ($scope[callback] || angular.noop)({
                        $item: item,
                        $event: $event
                    });
                };
            }]
        };
    }])
    .directive('ywsBaseLists', [function () {
        return {
            restrict: 'AE',
            scope: {
                callList: '&'
            },
            controller: function ($scope) {
                this.getList = $scope.callList;
                this.getList();

            }
        };
    }])
    // <yws-pagination page-size="Page.pageSize" page-current="Page.pageCurrent" page-on-select="callCouponList()" ></yws-pagination>
    .directive('ywsPagination', [function () {//分页组件
        return {
            restrict: 'E',
            template: '<nav class="center-block">' +
            '<ul class="pagination">' +
            '<li ng-repeat="page in pages" ng-class="{active: page.pageCurrent==pageCurrent}" ><a href="" ng-click="selectPage(page)">{{page.pageCurrent}}</a></li>' +
            '</ul></nav>',
            scope: {
                pageSize: '=pageSize',
                pageCurrent: '=pageCurrent',
                pageItems: '=pageItems',
                pageOnSelect: '='
            },
            controller: function ($scope, $element) {
            },
            replace: false,
            require: '^ywsBaseLists',
            link: function (scope, element, attr, controllerInstance) {
                scope.$watch('pageSize', function (value) {
                    var size = value;
                    scope.pageCurrent = scope.pageCurrent || 1;
                    if (typeof size != 'undefined' && size != null) {
                        scope.pages = [];
                        for (var i = 1; i <= size; i++) {
                            var page = {
                                pageItems: scope.pageItems,
                                pageCurrent: i
                            };
                            scope.pages.push(page);
                        }
                    }
                });
                scope.selectPage = function (index) {
                    scope.pageCurrent = index.pageCurrent;
                    scope.tableState = {
                        pageItems: scope.pageItems,
                        pageCurrent: index.pageCurrent
                    };
                    scope.pageOnSelect(scope.tableState);

                };
                scope.selectPage({ pageCurrent: 1 });

            }
        }
    }])
    /****************************smart-table 分页组件之多页控件*****************************************/
    /*<tfoot>
     <tr>
     <td class="text-center" st-pagination="" st-items-by-page="10" st-template="partials/util/pagination.custom.html" colspan="12"></td>
     </tr>
     </tfoot>*/
    .directive('pageSelect', function () {
        return {
            restrict: 'E',
            template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
            link: function (scope, element, attrs) {
                scope.$watch('currentPage', function (c) {
                    window.__inpinputPage = c
                    scope.inputPage = c;
                });
            }
        }
    })
    /***************************表单校验****************************************************/
    .directive('formRange', function () {
        return {
            require: 'ngModel',
            scope: {
                max: '=max',
                min: '=min'
            },
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.push(function (viewValue) {
                    if (check_null(scope.min) || check_null(scope.max)) {
                        if (viewValue >= scope.min || viewValue <= scope.max) {
                            ctrl.$setValidity('formRange', true);
                            return viewValue;
                        } else {
                            ctrl.$setValidity('formRange', false);
                            return viewValue;
                        }
                    } else {
                        ctrl.$setValidity('formRange', true);
                        return viewValue;
                    }

                });
            }
        }
    })
    .directive('datePicker', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                minDate: '@',
                maxDate: '@'
            },
            link: function (scope, element, attr, ngModel) {
                element.val(ngModel.$viewValue);
                function onpicking(dp) {
                    var date = dp.cal.getNewDateStr();
                    scope.$apply(function () {
                        ngModel.$setViewValue(new Date(date));
                    });
                }

                element.bind('click', function () {
                    WdatePicker({
                        onpicking: onpicking,
                        dateFmt: 'yyyy-MM-dd',
                        minDate: (scope.minDate || '%y-%M-%d'),
                        maxDate: (scope.maxDate || '%y-%M-%d'),
                    })
                });
            }
        };
    })
    //冒泡窗口1 example: <a title="Content." data-toggle="tooltip" data-placement="bottom" data-html="true" tooltip></a>
    .directive('tooltip', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(element).hover(function () {
                    $(element).tooltip('show');
                }, function () {
                    $(element).tooltip('hide');
                });
            }
        };
    })//  TODO:By Lism【侯-01-评分17】老师/学生时间表，时间段移入展示操作选项tooltip指令
    .directive('mtToolTip', function () {
        var _html = '<a>{{afternoon.start_time |date:"HH:mm"}}-{{afternoon.end_time |date:"HH:mm"}}</a><div class="mt-toolTip" style="display: none;">' +
            '<ul class="mt-chide">' +
            '<li ng-if="afternoon.pasttype==5 || afternoon.pasttype==6 || afternoon.pasttype==1 || afternoon.pasttype==2 || afternoon.pasttype==7 || afternoon.pasttype==8">' +
            '<a ng-click="tcl.showPlanDetail(afternoon)">查看</a>' +
            '</li>' +
            '<li ng-if="!isTeacherMaster() && !isTeacher() && afternoon.pasttype==5">' +
            '<a ng-click="yesconsume(afternoon)">消课</a>' +
            '</li>' +
            '<li ng-if="!isTeacherMaster() && !isTeacher() && afternoon.pasttype==5">' +
            '<a ng-click="showEditCoursePlan(afternoon)">编辑</a>' +
            '</li>' +
            '   <li ng-if="!isTeacherMaster() && !isTeacher() && afternoon.pasttype==5">' +
            '   <a ng-click="remove(afternoon)">删除</a>' +
            '   </li>' +
            '   <li ng-if="!isTeacherMaster() && !isTeacher() && afternoon.pasttype==6 && afternoon.is_satisfied!=0">' +
            '   <a ng-click="addUnsatisfied(afternoon,0)">取消</a>' +
            '   </li>' +
            '   <li ng-if="!isTeacherMaster() && !isTeacherMaster2() && !isTeacherMaster3() && !isTeacher() && afternoon.pasttype==3">' +
            '   <a ng-click="showSelectedTeacherPaikeView(personsData[0].teacherID, personsData[0].teachername, noots.date)">排课</a>' +
            '   </li>' +
            '   <li ng-if="!isTeacherMaster() && !isTeacher() && afternoon.pasttype==3">' +
            '   <a ng-click="showSelectedTeacherPaikeView2(personsData[0].teacherID, personsData[0].teachername, noots.date)">排试听课</a>' +
            '    </li>' +
            '   </ul>'
        if (window.location.hash == '#/sos-admin/customer_times/backToPlan') {
            _html = '<a>{{afternoon.start_time |date:"HH:mm"}}-{{afternoon.end_time |date:"HH:mm"}}</a><div class="mt-toolTip" style="display: none;">' +
                '<ul class="mt-chide">' +
                '<li ng-if="afternoon.pasttype==5 || afternoon.pasttype==6 || afternoon.pasttype==1 || afternoon.pasttype==2 || afternoon.pasttype==7 || afternoon.pasttype==8">' +
                '<a ng-click="tcl.showPlanDetail(afternoon)" >查看</a>' +
                '</li>' +
                '<li ng-if="!isTeacherMaster() && !isTeacher() && afternoon.pasttype==5">' +
                '<a ng-click="yesconsume(afternoon)" >消课</a>' +
                '</li>' +
                '<li ng-if="!isTeacherMaster() && !isTeacher() && afternoon.pasttype==5">' +
                '<a ng-click="showEditCoursePlan(afternoon)" >编辑</a>' +
                '</li>' +
                '<li ng-if="!isTeacherMaster() && !isTeacher() && afternoon.pasttype==5">' +
                '<a ng-click="remove(afternoon)" >删除</a>' +
                '</li>' +
                '<li ng-if="!isTeacherMaster() && !isTeacher() && afternoon.pasttype==6 && afternoon.is_satisfied!=0">' +
                '<a ng-click="addUnsatisfied(afternoon,0)" >取消</a>' +
                '</li>' +
                '<li ng-if="!isTeacherMaster() && !isTeacher() && afternoon.pasttype==3">' +
                '<a ng-click="showSelectedStudentPaikeView(personsData[0].studentId, noots.date)" >排课</a>' +
                '</li></ul>'
        }
        return {
            restrict: 'A',
            template: _html,
            replace: false,
            link: function (scope, element, attrs) {
                $(element).hover(function () {
                    var _this = $(this)
                    _this.find('.mt-toolTip').css({
                        top: _this.offset().top,
                        left: (_this.offset().left + _this.width() + 3)
                    }).show()
                }, function () {
                    $(this).find('.mt-toolTip').hide();
                })
            }
        }
    }).directive('tooltip', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(element).hover(function () {
                    $(element).tooltip('show');
                }, function () {
                    $(element).tooltip('hide');
                });
            }
        };
    })//  TODO:By Lism【侯-01-评分17】老师/学生时间表，时间段移入展示操作选项tooltip指令
    .directive('mtTimeToolTip', function () {
        return {
            restrict: 'A',
            templateUrl: 'partials/toolTip/main.html',
            replace: false,
            link: function (scope, element, attrs) {
                $(element).hover(function () {
                    var _this = $(this),
                        windowWidth = $(window).width(),
                        left = _this.offset().left,
                        thisWidth = _this.width(),
                        _hasClass = _this.find('.mt-time-toolTip')

                    // console.log($(this))
                    /**
                     * 解释：窗口宽度应该等于当前元素的left+tooltip的宽度+滚动条宽度+有边距+当前元素的宽度，如果后者大则会出现滚动条
                     * 40:滚动条宽度，20：右边padding
                     */
                    if (windowWidth < left + _hasClass.width() + 40 + 20 + thisWidth) {//windowWidth<left+thisWidth+120
                        if (_hasClass.hasClass('has-class')) {
                            _hasClass.find('.tool-left').addClass('tool-right').removeClass('tool-left')
                            left = left - _hasClass.width()
                        } else {
                            left = left + thisWidth + 3 - 34
                        }
                    } else {
                        left = left + thisWidth + 3
                    }
                    var dateTimeId = $('#dateTimeModal')
                    var top = _this.offset().top
                    if (dateTimeId.length) {
                        left = left - dateTimeId.offset().left
                        top = top - dateTimeId.offset().top - 50
                    }
                    _this.find('.mt-time-toolTip').css({
                        top: top,
                        left: left
                    })
                    return false
                })
                /*, function () {
                 $(this).find('.mt-time-toolTip').hide();
                 }*/
            }
        }
    })
    /**
     * 用于 BI 模块的检索。注意，这个 directive 依赖 BiBaseController，所以它必须在 BiBaseController 内。
     */
    .directive('search', function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/bi/directives/search.html',
            scope: {
                departmentClicked: '&onDepartmentClicked',
                department: '=department',
                searchModel: '=searchModel',
                isSchoolUser: '=isSchoolUser',
                provinces: '=provinces',
                provinceChanged: '&onProvinceChanged',
                cities: '=cities',
                searchClicked: '&onSearch',
                resetClicked: '&onReset',
                hideEndDate: '=hideEndDate',
                hideProvinceAndCity: '=hideProvinceAndCity',
                hideSchoolType: '=hideSchoolType'
            }
        };
    })
    /**
     * ng-hover属性指令使用说明
     * 1.在元素标签里加上ng-hover
     * 2.参数：[data-class]可选
     *  （1）什么时候需要参数？
     *      当hover状态时作用于其他元素之上时给ng-hover所在元素上加上data-class='你想作用元素的类名'，然后再dataAll参数中配置_class:'雷鸣'
     *  （2）什么时候不需要参数？
     *      当hover状态时作用于当前元素时无需参数，默认作用于当前元素
     * 3.在dataAll数组中配置函数
     *  （1）hoverTO:hover状态时要执行的函数，然后再指令中编写对应的函数
     *  （2）moveTO：移开鼠标时要执行的函数，此函数可选
     */
    .directive('ngHover', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var dataAll = [{ _class: 'msg-list', hoverTO: showMsgList, moveTO: hideMsgList }],
                    data = {},
                    _$this = $(element),
                    _aClass = _$this.attr('data-class'),
                    _class = ''
                function init() {
                    for (var i = 0, max = dataAll.length; i < max; i++) {
                        if (_$this.hasClass(dataAll[i]._class) || dataAll[i]._class == _aClass) {
                            data = dataAll[i]
                            _class = data._class ? ('.' + data._class) : element
                            break
                        }
                    }
                }
                init()
                /**
                 * 展开消息提示框
                 */
                function showMsgList() {
                    $(_class).stop(true).show(300)
                    $('.h2-i').hide()
                    _$this.css({ right: 0 })
                    // $('.msg-close').show().siblings().hide()
                }

                /**
                 * 收起消息提示框
                 */
                function hideMsgList(obj) {
                    $(_class).stop(true).hide(300)
                    $('.h2-i').show()
                    // $('.msg-close').stop(true).hide(300).siblings().stop(true).show(300)
                    // $(_class).hide()
                    _$this.css({ right: -18 })
                }
                function defaultHover() {
                    console.log('请正确使用ng-hover指令')
                }

                /**
                 * hover||mouseleave
                 */
                _$this.hover(function () {
                    try {
                        data.hoverTO()
                    } catch (e) {
                        console.log('请移除————' + $(element) + '————次元素上ng-hover,以免影响网站性能')
                    }
                }/*, function () {
                 try{
                 data.moveTO()
                 }catch (e){
                 defaultHover()
                 }
                 }*/)
                $('.msg-list').mouseleave(function () {
                    try {
                        data.moveTO()
                        return false
                    } catch (e) {
                        defaultHover()
                    }
                })/*
                 $('.h2-close').click(function () {
                 data.moveTO()
                 })*/
            }
        }
    })
    .directive('mtHasOpen', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var NewSet = null,
                    _$this = $(element),
                    msgNav = $('.msg-nav')
                _$this.on('click', function () {
                    msgNav.css({ 'z-index': -10 })
                    NewSet = setInterval(function () {
                        if (!_$this.parent().hasClass('open')) {
                            clearInterval(NewSet)
                            NewSet = null
                            msgNav.css({ 'z-index': 2000 })
                        }
                    }, 1000)
                })
            }
        }
    })
    //冒泡窗口2 example：<a data-content="Content." data-placement="top" webui-popover></a>
    .directive('webuiPopover', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(element).webuiPopover({ trigger: 'hover' });
            }
        };
    })
    .directive('vrSelect', function () {
        return {
            restrict: 'A',
            scope: {
                changeFun: '=changefun'
            },
            link: function (scope, element, attrs) {
                var $this = $(element)
                $this.click(function () {
                    $(this).prev().click()
                })

                /**
                 * 转为整数
                 * @param numb
                 * @returns {Number}
                 * 返回10进制
                 */
                function getIntager(numb) {
                    return parseInt(numb, 10)
                }

                /**
                 * 返回日期
                 * @param arg
                 * @returns {number}
                 */
                function getDate(arg) {
                    var oneDay = 24 * 60 * 60 * 1000,
                        beforeAndAfer = arg * oneDay,
                        atLast = new Date().getTime() + beforeAndAfer
                    if (arguments[1]) {
                        atLast = arguments[1].getTime() + beforeAndAfer
                    }
                    return new Date(atLast)
                }

                /**
                 * 渲染到页面：渲染日期
                 * @param _parent
                 * @param date
                 * @param today
                 */
                function setVal(_parent, date, today) {
                    if (arguments.length == 4) {
                        _parent.find('input').eq(1).val(getFormatData(date.monday))
                        _parent.find('input').eq(2).val(getFormatData(date.sunday))
                    } else {
                        _parent.find('input').eq(1).val(getFormatData(date))
                        _parent.find('input').eq(2).val(getFormatData(today ? today : date))
                    }
                }

                /**
                 * 渲染到页面:渲染数字
                 * @param _parent
                 * @param start
                 * @param end
                 */
                function setValNumber(_parent, start, end) {
                    _parent.find('input').eq(1).val(start)
                    _parent.find('input').eq(2).val(end)
                }

                function setValAndReqNow(arg) {
                    //  今天周几
                    var isNow = new Date().getDay(),
                        //  通过今天计算出本周一对应的日期
                        monday = getDate(-getIntager(isNow) + 1),
                        //  通过今天计算出本周天对应的日期
                        sunday = getDate(7 - isNow),
                        diff = 0
                    switch (arg) {
                        case 1:    //  本周
                            if (!isNow) {
                                //如果今天是周天(符合国情就当是本周吧)
                                monday = getDate(-6)
                                sunday = getDate(isNow)
                            } else {
                                //如果不是周天按正常的计算
                                monday = getDate(-getIntager(isNow) + 1)
                                sunday = getDate(7 - isNow)
                            }
                            break;
                        case 2: //  下周
                            if (!isNow) {
                                //  计算出周天离今天还有几天
                                diff = getIntager(isNow)
                                //  计算出下周一日期
                                monday = getDate(diff + 1)
                                //  计算出下周日日期
                                sunday = getDate(7 + diff)
                            } else {
                                //  计算出周天离今天还有几天
                                diff = 7 - getIntager(isNow)
                                //  计算出下周一日期
                                monday = getDate(diff + 1)
                                //  计算出下周日日期
                                sunday = getDate(7 + diff)
                            }
                            break;
                        case 3: //  上周
                            if (!isNow) {
                                //如果今天是周天(符合国情就当是本周吧)
                                //  计算出上周周天离今天还有几天
                                diff = getIntager(isNow + 7)
                                //  计算出下周一日期
                                monday = getDate(-(6 + diff))
                                //  计算出下周日日期
                                sunday = getDate(-diff)
                            } else {
                                //如果不是周天按正常的计算
                                //  计算出上周周天离今天还有几天
                                diff = getIntager(isNow)
                                //  计算出下周一日期
                                monday = getDate(-(6 + diff))
                                //  计算出下周日日期
                                sunday = getDate(-diff)
                            }



                            break;
                        case 4: //  本月
                            /*************************************************
                             * 月末计算规则：
                             * 获取当前月份然后得到下个月1号对应的时间戳减去一天的时间戳
                             *************************************************/
                            diff = getMonthMt()
                            //  获取下个月初
                            var end = getYearMt() + '-' + is2length((diff + 1)) + '-01'
                            //  获取下个月初
                            //  本月初
                            monday = getNowMonthFrist(diff)//new Date(getYearMt()+'-'+is2length((diff))+'-01')
                            //  本月末
                            sunday = getDate(-1, getNowMonthEnd(diff + 1))//getDate(-1,new Date(end))
                            break;
                        case 5: //  上月
                            diff = getMonthMt()
                            //  获取下个月初
                            //  上月初
                            monday = getNowMonthFrist(diff - 1, -1)
                            //  上月月末
                            sunday = getDate(-1, getNowMonthEnd(diff), -1)
                            break;
                        case 6: //  下月
                            diff = getMonthMt()
                            //  获取下个月初
                            //  下月初
                            monday = getNowMonthFrist(diff + 1, 1)
                            //  下月月末
                            sunday = getDate(-1, getNowMonthEnd(diff + 2), 1)
                            break;
                    }
                    /*************************************************
                     * 本月日期区间计算规则：
                     * ----本月一号减去一天的时间戳-----
                     * 月末计算规则：
                     * 获取当前月份然后得到下个月1号对应的时间戳减去一天的时间戳
                     *************************************************/

                    return {
                        monday: monday,
                        sunday: sunday
                    }
                }

                //  获取当前月份
                function getMonthMt() {
                    return getIntager(new Date().getMonth()) + 1
                }

                /**
                 * 返回准确的年月，确保上查询上一月和下一月的时候年份和月份不合适
                 * @param month
                 * @returns {{thisMonth: number, year: number}}
                 */
                function accurateYAndM(month) {
                    var year = 0,
                        thisMonth = 0
                    if (month == 0 && arguments[1] == -1) {
                        year = getYearMt() - 1
                        thisMonth = 12
                    } else if (month == 13 && arguments[1] == 1) {
                        year = getYearMt() + 1
                        thisMonth = 1
                    } else if (month == 13 && arguments.length == 1) {
                        year = getYearMt() + 1
                        thisMonth = 1
                    } else {
                        year = getYearMt()
                        thisMonth = month
                    }
                    return {
                        thisMonth: thisMonth,
                        year: year
                    }
                }

                //  获取当前X月初日期
                function getNowMonthFrist(month) {
                    var yAndM = accurateYAndM(month)
                    return new Date(yAndM.year + '-' + is2length(yAndM.thisMonth) + '-01')
                }

                //  获取当前X月末日期
                function getNowMonthEnd(month) {
                    var yAndM = accurateYAndM(month)
                    return new Date(yAndM.year + '-' + is2length(yAndM.thisMonth) + '-01')
                }

                //  获取当前年份
                function getYearMt() {
                    return getIntager(new Date().getFullYear())
                }

                $('body').on('click', function () {
                    var $this = $('.select-option')
                    // console.log(_$event,$(event)[0].currentTarget.className)
                    if ($this.length && window._$event != $(event)[0].currentTarget.className) {
                        event.stopPropagation();
                        $this.remove()
                        return false
                    }
                })
                $this.on('click', 'div', function (e) {
                    try {
                        event.stopPropagation();
                        window._$event = $(event)[0].currentTarget.className
                    } catch (e1) {
                        e.stopPropagation();
                        window._$event = $(e)[0].currentTarget.className
                    }
                    //  获取input元素
                    var __this = $(this),
                        __liText = '请选择'
                    if (__this.attr('class')) {
                        if (!__this.hasClass('three-1')) {
                            return false
                        } else {
                            __liText = '不限'
                        }
                    }
                    /*if($(document).find('.select-option').length){
                     $(document).find('.select-option').remove()
                     }*/
                    //  获取数据
                    var __data = $.parseJSON($this.attr('data-mt')),
                        //  获取input元素的宽度用于构造下拉框
                        __width = __this.width() + 2 + 'px',
                        //  获取input元素的高度用于构造下拉框
                        __height = __this.height() + 'px',
                        //  获取input距离top的距离
                        __top = __this.offset().top + parseInt(__height, 10) + 'px',
                        //  获取input距离left的距离
                        __left = __this.offset().left + 'px',
                        //  构造下拉选项
                        getLi = function () {
                            var __li = '<li data-id=" " style="height:24px;line-height: 24px;margin: 0;text-align: center;width:100% !important;">' + __liText + '</li>'
                            for (var __i = 0, __max = __data.length; __i < __max; __i++) {
                                var dataId = __data[__i].id || __data[__i].value
                                if(__data[__i].id==0 && typeof  __data[__i].value =='undefined'){dataId=__data[__i].id}
                                __li += '<li data-id="' + dataId + '" style="height:24px;line-height: 24px;margin: 0;text-align: center;width:100% !important;">' + __data[__i].name + '</li>'
                            }
                            return __li
                        },
                        //  构建html
                        __div = $('<div class="select-option" style="width:' + __width + ';top:' + __top + ';left: ' + __left + ';position:fixed;height:auto;border:1px solid #4e83e7;border-top:2px solid #4e83e7;overflow:hidden;z-index: 10000;color: #898989;font-size: 12px;max-height: 200px;overflow-y: auto;background: #fff;">' + getLi() + '</div>').hide().on('mouseenter', 'li', function () {
                            $(this).css({ 'background': '#4e83e7', color: '#fff' })
                        }).on('mouseleave', 'li', function () {
                            $(this).css({ 'background': 'none', color: '#898989' })
                        }).on('click', 'li', function () {
                            var _this = $(this),
                                _id = _this.attr('data-id'),
                                _parent = _this.parent().parent('.mt-three')
                            // $this.find('input').eq(0).focus().val(_id).end().end().find('div').eq(0).html(_this.text())
                            $this.find('input').focus().val(_id).end().find('div').eq(0).html(_this.text())
                            if (_parent) {
                                switch (getIntager(_id)) {
                                    case 1:
                                        setVal(_parent, new Date())
                                        break;
                                    case 2:
                                        setVal(_parent, getDate(-1))
                                        break;
                                    case 3:
                                        setVal(_parent, getDate(-2), new Date())
                                        break;
                                    case 4:
                                        setVal(_parent, getDate(-6), new Date())
                                        break;
                                    case 5:
                                        setVal(_parent, '', getDate(-7))//new Date()
                                        break;
                                    case 6:
                                        setVal(_parent, '', getDate(-30))
                                        break;
                                    case 7:
                                        setVal(_parent, '', '')
                                        break;
                                    case 8:
                                        setVal(_parent, '', '')
                                        break;
                                    case 9:
                                        setVal(_parent, getDate(1))
                                        break;
                                    case 10:
                                        setVal(_parent, setValAndReqNow(1), '', '')
                                        break;
                                    case 11:
                                        setVal(_parent, setValAndReqNow(2), '', '')
                                        break;
                                    case 12:
                                        setVal(_parent, setValAndReqNow(3), '', '')
                                        break;
                                    case 13:
                                        setVal(_parent, setValAndReqNow(4), '', '')
                                        break;
                                    case 14:
                                        setVal(_parent, setValAndReqNow(5), '', '')
                                        break;
                                    case 15:
                                        setVal(_parent, setValAndReqNow(6), '', '')
                                        break;
                                    case 16:
                                        setValNumber(_parent, 0, 0)
                                        break;
                                    case 17:
                                        setValNumber(_parent, 0, 10)
                                        break;
                                    case 18:
                                        setValNumber(_parent, 11, 30)
                                        break;
                                    case 19:
                                        setValNumber(_parent, 11, 20)
                                        break;
                                    case 20:
                                        setValNumber(_parent, 21, 30)
                                        break;
                                    case 21:
                                        setValNumber(_parent, 31, 100)
                                        break;
                                    case 22:
                                        setValNumber(_parent, 0, 25)
                                        break;
                                    case 23:
                                        setValNumber(_parent, 26, 35)
                                        break;
                                    case 24:
                                        setValNumber(_parent, 36, 45)
                                        break;
                                    case 25:
                                        setValNumber(_parent, 45, '')
                                        break;
                                    case 26:
                                        setValNumber(_parent, 0, 19)
                                        break;
                                    case 27:
                                        setValNumber(_parent, 20, 49)
                                        break;
                                    case 28:
                                        setValNumber(_parent, 50, 99)
                                        break;
                                    case 29:
                                        setValNumber(_parent, 100, 199)
                                        break;
                                    case 30:
                                        setValNumber(_parent, 200, '')
                                        break;
                                    case 31:
                                        setValNumber(_parent, 0, 9999)
                                        break;
                                    case 32:
                                        setValNumber(_parent, 10000, 29999)
                                        break;
                                    case 33:
                                        setValNumber(_parent, 30000, 49999)
                                        break;
                                    case 34:
                                        setValNumber(_parent, 50000, 99999)
                                        break;
                                    case 35:
                                        setValNumber(_parent, 100000, '')
                                        break;
                                    default:
                                        setVal(_parent, '', '')
                                        break;
                                }
                            }
                            __div.remove()
                            // $this.find('input').eq(0).change().blur()这句能解决首先点击日期控件，然后不选择日期，直接选择下拉框后自动出现日历选择框问题
                            $this.find('input').change().blur()//.end().not(':frist').change().blur()
                            if (scope.changeFun) {
                                scope.changeFun()
                            }
                        })
                    $(document).find('.select-option').slideUp().remove()
                    $this.append(__div.show(200))
                })
            }
        }
    })
    .directive('w72', function () {
        return {
            restrict: 'A',
            scope: {
                index: '=index'
            },
            link: function (scope, element, attrs) {
                if (scope.index > 11) {
                    $(element).addClass('w-72')
                }
                if (scope.index == 15) {
                    $(element).addClass('mr-14 ml-0')
                }
            }
        }
    })
    .directive('mtAbs', function () {
        return {
            restrict: 'A',
            scope: { index: '=index' },
            link: function (scope, element, attrs) {
                var $mbodyH = $('#getHeight').height(),
                    $this = $(element),
                    $thisH = $this.outerHeight(),
                    $thisL = $this.prev().offset().left - $this.outerWidth(),
                    $thisT = $this.prev().offset().top,
                    $pH = $this.parent().parent().outerHeight()
                if ($(window).height() - $pH - 100 < $thisT) {
                    $this.css({ 'left': $thisL, 'position': 'fixed', 'top': $thisT - $this.outerWidth() }).find('.sj').addClass('sj-top')/*'top':$thisT-$this.outerWidth()+$this.prev().height(),*/
                } else {
                    $this.css({ 'left': $thisL, 'position': 'fixed', 'top': $thisT })
                }
            }
        }
    })
    .directive('crmClass', function () {
        return {
            restrict: 'E',
            scope: { index: '=index', courseId: '=courseid', selectCourseId: '=selectcourseid', selectIndex: '=selectindex', classModal: '@' ,locked:'=locked'},
            transclude: true,
            replace: false,
            templateUrl: 'partials/sos/order/selectCrmClass.html?v=' + new Date().getTime(),
            link: function (scope, element, attrs) {
                function getClassModal() {
                    var classModal = scope.classModal
                    var parent = scope.$parent
                    while (!classModal && parent) {
                        classModal = parent.classModal
                        parent = parent.$parent
                    }
                    if (classModal) {
                        scope.classModal = classModal
                    }
                }
                getClassModal()
                console.log(scope.selectCourseId,scope.courseId,scope.selectIndex)
                scope.selectCourseId = scope.courseId
                scope.selectIndex = scope.index
            }
        }
    })
    .directive('uploadLoading', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(element).css({ 'height': $(window).outerHeight(), 'z-index': 100000 })
            }
        }
    })
    .directive('eventListenerScroll', function () {
        return {
            restrict: 'A',
            scope: {
                reastPosition: '&'
            },
            link: function (scope, element, attrs) {
                $(window).on('scroll', function () {
                    console.log(1)
                })
            }
        }
    })
    .directive('ngInput', [function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attrs) {
                element.on('input', oninput);
                scope.$on('$destroy', function () {//销毁的时候取消事件监听
                    element.off('input', oninput);
                });
                function oninput(event) {
                    scope.$evalAsync(attrs['ngInput'], { $event: event, $value: this.value });
                }
            }
        }
    }]);
/*.directive("bingModel", [function() {
 return {
 restrict: "A",
 require: 'ngModel',
 link: function (scope, element, attrs,ctl) {
 console.log(scope.row.md);
 /!* ctrl.$setViewValue(element.html());*!/
 /!* scope.$watch("str", function(val) {
 console.log(val);
 //element.html(scope.$eval(val));
 });*!/
 }
 };
 }])*/
/**
 * 日期初始化
 */
/* .directive('dateDefault', function($parse, $timeout) {
 return {
 scope: {
 },
 require: 'ngModel',
 link: function(scope, element, attrs, ngModel) {
 var isEmpty = true;
 ngModel.$formatters.push(function(n) {

 isEmpty = false;
 return n;
 });
 var date = (new Date()).Format("yyyy-MM-dd");
 var cur = ngModel.$modelValue;

 if(ngModel.$isEmpty(ngModel)){
 ngModel.$setViewValue(date);
 ngModel.$setValidity('formRange', true);
 ngModel.$render();
 }


 /!*name.shift();*!/
 /!* $timeout(function step() {
 var cur = ngModel.$modelValue;
 ngModel.$setViewValue(cur + name[0]);
 ngModel.$render();

 name.shift();

 if(name.length) {
 $timeout(step, 1000);
 }
 });*!/
 }
 };
 })*/
;
