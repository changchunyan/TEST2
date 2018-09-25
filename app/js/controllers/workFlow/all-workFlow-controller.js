/**
 * Created by 毅 on 2016/3/20.
 */
var ywsApp = angular.module('ywsApp');
ywsApp.controller('AllWorkFlowCtl',
    ['$scope', '$modal', '$rootScope', '$location','SweetAlert','WorkFlowService','AuthenticationService',
        function($scope, $modal, $rootScope,$location, SweetAlert,WorkFlowService,AuthenticationService) {
            var oThis = this;
            $scope.getAllFlowLists = getAllFlowLists;//得到所有的工作流
            $scope.detailFlowRoute = detailFlowRoute;//通过id 跳转到工作流详情
            $scope.getSponsorLists = getSponsorLists;//我发起
            $scope.getSolveLists = getSolveLists;//我处理的
                $scope.getSolveListsType1 = getSolveListsType1;
                $scope.getSolveListsType2 = getSolveListsType2;
                $scope.getSolveListsType3 = getSolveListsType3;
                $scope.getSolveListsType4 = getSolveListsType4;

            $scope.getStarLists = getStarLists;//星标

            $scope.starFlowRoute = starFlowRoute;//收藏
            $scope.cancelStarFlowRoute = cancelStarFlowRoute;//取消收藏收藏
            $scope.kuaiFlowRoute = kuaiFlowRoute;//加急
            $scope.cancelKuaiFlowRoute = cancelKuaiFlowRoute;//取消加急

            $scope.changeCheckbox = changeCheckbox;
            $scope.ifChecked = ifChecked;//批量判断是否被选中

            $scope.submitBeach = submitBeach;

            $scope.ifBeach = ifBeach;

            /**
             * public final static int STATUS_PROCESSING = 1;//经行政
             public final static int STATUS_REFUSED = 2;//打回
             public final static int STATUS_PERFORMED = 3;//已处理
             public final static int STATUS_ENDED = 4;//结束
             public final static int STATUS_DELETED = 5;
             public final static int STATUS_DRAFT = 6;
             * @type {*[]}
             */
            $scope.flowStatusSELECT = [{name:'全部',id:0},{name:'处理中',id:1},{name:'被打回',id:2},{name:'已处理',id:3},{name:'已结束',id:4},{name:'已删除',id:5},{name:'草稿箱',id:6}];
            $scope.solveStatusSELECT = [{name:'全部',id:0},{name:'待我主办',id:1},{name:'我已主办',id:2},{name:'待我会签',id:3},{name:'我已会签',id:4}];


            /*********************************************************调用Service层********************************************************************************/
            /**
             * 得到所有的工作流
             * @param tableState
             */
            function getAllFlowLists(tableState){
                $scope.tableStateAll = tableState;
                $scope.getList = getAllFlowLists;
                var pagination = tableState.pagination;
                var start = pagination.start/pagination.number+1 || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                var type = tableState.search.predicateObject.filter.status || 0;

                WorkFlowService.getProcessesLists(start, number,type).then(function (result) {
                    $scope.allFlowLists = _dealResponseData(result.data);
                    tableState.pagination.numberOfPages = result.numberOfPages || 1;//set the number of pages so the pagination can update
                },function(err){
                    tableState.pagination.numberOfPages =  1;//set the number of pages so the pagination can update
                });
            }

            /**
             * 通过id 跳转到工作流详情
             * @param flow
             * @param type
             */
            function detailFlowRoute(flow,type){
                if(!check_null(type)){
                    type = 0;
                }
                if(check_null(flow.currentTaskId)){
                    $location.path('/workflowManager-admin/detail_workflow/'+flow.currentTaskId+'/'+type);
                }
            }


            /**
             * 我发起
             * @param tableState
             */
            function getSponsorLists(tableState){
                $scope.getList = getSponsorLists;
                $scope.tableStateAll = tableState;
                var pagination = tableState.pagination;
                var start = pagination.start/pagination.number+1 || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                var type = tableState.search.predicateObject.filterSponsor.status || 0;

                WorkFlowService.getOwnSponsorLists(start, number,type).then(function (result) {
                    $scope.sponsorLists = _dealResponseData(result.data);
                    tableState.pagination.numberOfPages = result.numberOfPages || 1;//set the number of pages so the pagination can update
                },function(err){
                    tableState.pagination.numberOfPages =  1;//set the number of pages so the pagination can update
                });

            }

            /**
             * 我处理的
             * @param tableState
             * @param type
             * @param callback
             */
            function getSolveLists(tableState,type,callback){
                $scope.getList = getSolveLists;
                $scope.tableStateAll = tableState;
                var pagination = tableState.pagination;
                var start = pagination.start/pagination.number+1 || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                if(typeof(type) != 'number'){
                    type = 0;
                }
                if(typeof(callback) != 'function'){
                    $scope.solveLists = {};
                    callback = function(data){
                        $scope.solveLists = data;
                    };
                }
                WorkFlowService.getOwnSolveLists(start, number,type).then(function (result) {
                    var list = _dealResponseData(result.data);
                    callback(list);
                    tableState.pagination.numberOfPages = result.numberOfPages || 1;//set the number of pages so the pagination can update
                },function(err){
                    tableState.pagination.numberOfPages =  1;//set the number of pages so the pagination can update
                });

            }
                function getSolveListsType1(tableState){
                    $scope.tableStateAllBy1 = tableState;
                    $scope.solveListsBy1 = {
                        name:1
                    };
                    $scope.tableStateLists.solveListTableState = tableState;
                    $scope.getSolveLists(tableState,1,function(data){
                        $scope.solveListsBy1 = data;
                    });
                }
                function getSolveListsType2(tableState){
                    $scope.tableStateAllBy2 = tableState;
                    $scope.solveListsBy2 = {
                    };
                    $scope.getSolveLists(tableState,2,function(data){
                        $scope.solveListsBy2 = data;
                    });
                }
                function getSolveListsType3(tableState){
                    $scope.tableStateAllBy3 = tableState;
                    $scope.solveListsBy3 = {
                        name:3
                    };
                    $scope.getSolveLists(tableState,3,function(data){
                        $scope.solveListsBy3 = data;
                    });
                }
                function getSolveListsType4(tableState){
                    $scope.tableStateAllBy4 = tableState;
                    $scope.getSolveLists(tableState,4,function(data){
                        $scope.solveListsBy4 = data;
                    });
                }

            /**
             * 星标列表
             * @param tableState
             */
            function getStarLists(tableState){
                $scope.getList = getStarLists;
                $scope.tableStateAll = tableState;
                var pagination = tableState.pagination;
                var start = pagination.start/pagination.number+1 || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                var type =  0;

                WorkFlowService.getStarLists(start, number,type).then(function (result) {
                    $scope.starLists = _dealResponseData(result.data);
                    tableState.pagination.numberOfPages = result.numberOfPages || 1;//set the number of pages so the pagination can update
                },function(err){
                    tableState.pagination.numberOfPages =  1;//set the number of pages so the pagination can update
                });

            }

            /**
             * 收藏
             * @param flow
             */
            function starFlowRoute(flow){
                if(check_null(flow.currentTaskId)){
                    var obj = {
                        id:flow.processId
                    };
                    WorkFlowService.starFlowRoute(obj).then(function (result) {
                        SweetAlert.swal("收藏成功");
                        if($scope.getList == getSolveLists){//使用tab 导致分页和查询列表函数变化
                            getSolveListsType1($scope.tableStateAllBy1);
                            getSolveListsType2($scope.tableStateAllBy2);
                        }else{
                            $scope.getList($scope.tableStateAll);
                        }

                    },function(err){
                        SweetAlert.swal("收藏失败")
                    });
                }
            }
            /**
             * 取消收藏收藏
             * @param flow
             */
            function cancelStarFlowRoute(flow){
                if(check_null(flow.currentTaskId)){
                    var obj = {
                        id:flow.processId
                    };
                    WorkFlowService.cancelStarFlowRoute(obj).then(function (result) {
                        SweetAlert.swal("取消成功");
                        $scope.getList($scope.tableStateAll);
                    },function(err){
                        SweetAlert.swal(err);
                    });
                }
            }

            /**
             * 加急
             * @param flow
             */
            function kuaiFlowRoute(flow){
                if(check_null(flow.currentTaskId)){
                    var obj = {
                        id:flow.processId
                    };
                    WorkFlowService.kuaiFlowRoute(obj).then(function (result) {
                        SweetAlert.swal("成功" );
                        if($scope.getList == getSolveLists){//使用tab 导致分页和查询列表函数变化
                            getSolveListsType1($scope.tableStateAllBy1);
                            getSolveListsType2($scope.tableStateAllBy2);
                        }else{
                            $scope.getList($scope.tableStateAll);
                        }
                    },function(err){
                        SweetAlert.swal("失败");
                        console.log(err);
                    });
                }
            }

            /**
             * 取消加急
             * @param flow
             */
            function cancelKuaiFlowRoute(flow){
                if(check_null(flow.currentTaskId)){
                    var obj = {
                        id:flow.processId
                    };
                    WorkFlowService.cancelKuaiFlowRoute(obj).then(function (result) {
                        swal("成功");
                        $scope.getList($scope.tableStateAll);
                    },function(err){
                        swal("失败");
                        console.log(err);
                    });
                }
            }

            function changeCheckbox(row){
                /*$scope.batchList.push(row.processId);*/
                var is = false;
                for(var i=0;i<$scope.batchList.length;i++){
                    if(row.currentTaskId == $scope.batchList[i] ){
                        $scope.batchList.splice(i,1);
                        is = true;
                    }
                }
                if(!is){
                    Array.prototype.push.call($scope.batchList,row.currentTaskId);
                }

            }

            /**
             * 批量判断是否被选中
             * @param row
             * @returns {boolean}
             */
            function ifChecked(row){
                var lists = $scope.batchList;
                for(var i=0;i<lists.length;i++){
                    if(row.currentTaskId == lists[i]){
                        return true;
                    }
                }
                return false;
            }

            /**
             * 提交批量
             */
            function submitBeach(){
                var obj = {
                    taskIds:''
                };
                for(var i=0;i<$scope.batchList.length;i++){
                    if(obj.taskIds){
                        obj.taskIds+=','+$scope.batchList[i];
                    }else{
                        obj.taskIds+=$scope.batchList[i];
                    }
                }
                if(obj.taskIds){
                    WorkFlowService.submitBeach(obj).then(function (result) {
                        if(result.data.status == 'FAILURE'){
                            SweetAlert.swal(result.data.error );
                        }else{
                            SweetAlert.swal('成功！');
                        }
                        $scope.getSolveListsType1( $scope.tableStateAllBy1);
                        $scope.getSolveListsType2( $scope.tableStateAllBy2);
                        $scope.batchList = [];
                    },function(err){
                        SweetAlert.swal("失败:"+err);
                        $scope.getSolveListsType1( $scope.tableStateAllBy1);
                        $scope.getSolveListsType2( $scope.tableStateAllBy2);
                        $scope.batchList = [];
                    });

                }else{
                    SweetAlert.swal("没有选中！");
                }
            }

            /**
             * 是否有批量权限
             * @returns {boolean}
             */
            function ifBeach(){
                return _ifPermission("batchOperation");
            }

           /* <option value="1">进行中</option>
                <option value="2">打回</option>
                <option value="3">已处理</option>
                <option value="4">结束</option>
                <option value="5">已删除</option>
                <option value="6">草稿</option>*/
            function _dealResponseData(lists){
                if(lists && lists.length>0) {
                    for (var i = 0; i < lists.length; i++) {
                        var nameData = '';
                        nameData += lists[i].name + ' -- ' + lists[i].initOperator;
                        var stepData = '';
                        if (lists[i].status == 1 || lists[i].status == 3) {
                            stepData += '由' + lists[i].initOperator + '发起';
                            if (lists[i].lastOperator) {
                                stepData += ', ' + lists[i].lastOperator + '处理'
                            }
                        } else if (lists[i].status == 2) {
                            stepData += lists[i].lastOperator + '打回';
                            if (lists[i].reason) {
                                stepData += '， 原因：' + lists[i].reason;
                            }

                        } else if (lists[i].status == 4) {
                            stepData += '由' + lists[i].initOperator + '发起';
                            if (lists[i].lastOperator) {
                                stepData += ', ' + lists[i].lastOperator + '结束'
                            }
                        } else if (lists[i].status == 2) {
                            stepData += '草稿';
                        } else if (lists[i].status == 5) {
                            stepData += '已删除:'+lists[i].deleteReason;
                        } else {
                            stepData += '其它';
                        }
                        lists[i].stepData = stepData;
                        lists[i].nameData = nameData;
                    }
                }
                return lists;

            }

            /**
             * 是否 有权限
             * @param name
             * @returns {boolean}
             * @private
             */
            function _ifPermission(name){
                var can = false;
                angular.forEach(AuthenticationService.currentUser().roles, function(role) {
                    angular.forEach(role.permissions, function(permission) {
                        if (permission.name === name) {
                            can = true;
                        }
                    });
                });
                return can;

            }

            (function init(angular){
                $scope.batchList = [];
                $scope.tableStateLists ={};//分页参数
            })(angular);


        }]);
