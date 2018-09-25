'use strict';

/**
 * The reminds controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('RemindsController', [
    '$scope', '$modal', '$filter', '$rootScope', 'SweetAlert', 'RemindsService', 'OrderService','localStorageService', 'CommonService', 'CustomerStudentService',
    function ($scope, $modal, $filter, $rootScope, SweetAlert, RemindsService, OrderService,localStorageService, CommonService, CustomerStudentService) {

        $scope.canViewAllot = function canViewAllot(){
            var canViewAllot=false;
            if(sessionStorage.getItem('com.youwin.yws.position_id')==Constants.PositionID.HEADMASTER
                || sessionStorage.getItem('com.youwin.yws.position_id')==Constants.PositionID.STUDENT_CHIEF_OFFICER
                || sessionStorage.getItem('com.youwin.yws.position_id')==Constants.PositionID.YSP_HEADMASTER
                || sessionStorage.getItem('com.youwin.yws.position_id')==Constants.PositionID.YSB_HEADMASTER
                || sessionStorage.getItem('com.youwin.yws.position_id')==Constants.PositionID.YSGJ_HEADMASTER
                || sessionStorage.getItem('com.youwin.yws.position_id')==Constants.PositionID.YSGJ_STUDENT_CHIEF_OFFICER){
                canViewAllot=true;
            }
            return canViewAllot;
        }
        $scope.canViewPastRemind = function canViewPastRemind(){
            var canViewAllot=false;
            if(sessionStorage.getItem('com.youwin.yws.position_id')==Constants.PositionID.HEADMASTER
                || sessionStorage.getItem('com.youwin.yws.position_id')==Constants.PositionID.STUDENT_CHIEF_OFFICER
                || sessionStorage.getItem('com.youwin.yws.position_id')==Constants.PositionID.YSP_HEADMASTER
                || sessionStorage.getItem('com.youwin.yws.position_id')==Constants.PositionID.YSB_HEADMASTER
                || sessionStorage.getItem('com.youwin.yws.position_id')==Constants.PositionID.YSGJ_HEADMASTER
                || sessionStorage.getItem('com.youwin.yws.position_id')==Constants.PositionID.YSGJ_STUDENT_CHIEF_OFFICER){
                canViewAllot=true;
            }
            return canViewAllot;
        }

        // 定义参数对象
        $scope.remindsTitle1 = '订单收费';
        $scope.remindsTitle2 = '订单审核';
        $scope.remindsTitle3 = '学员分配';
        $scope.remindsTitle4 = '消课';

        //  收费统计
        $scope.chargeRemindCount = 0;

        //  审核统计
        $scope.checkRemindCount = 0;

        //  学员分配
        $scope.allotRemindCount = 0;

        //  消课
        $scope.pastRemindCount = 0;

        //收费提醒数据对象
        $rootScope.remindsFeeObj = [];

        //详情对象
        $rootScope.remindsFeeDetail = {};

        //交费形式
        $rootScope.orderCategory = '';//1普通，3充值

        //交费该订单的id
        $rootScope.orderCategoryId = '';

        $rootScope.remindsEveryNum = 0;

        $rootScope.getRemindsInfo = getRemindsInfo;
        $rootScope.getRemindsData = getRemindsData;
        $rootScope.showSetRemindsTimeBox = showSetRemindsTimeBox;
        $rootScope.setTimeDay = setTimeDay;
        $rootScope.setTimeClose = setTimeClose;

        //点击切换tab
        $scope.RemindsTabTitle = RemindsTabTitle;

        $rootScope.remindsTimeSetOk = remindsTimeSetOk;
        //时间重置
        $rootScope.setisTimeChoose = setisTimeChoose;

        //不在提醒的弹出
        $rootScope.setTimeNoReminds = setTimeNoReminds;

        //不在提醒弹出后确定
        $rootScope.chooseNoReminds = chooseNoReminds;

        //不在提醒弹出后取消
        $rootScope.setTimeNoRemindCancle = setTimeNoRemindCancle;
        //收费弹窗
        $rootScope.openShouFeeAlert = openShouFeeAlert;
        $rootScope.payMentMoney = payMentMoney;
        //分页
        $scope.hSelectedPage = hSelectedPage;

        //提醒时间设置弹窗的消失
        $scope.setTimeBoxIsHide=setTimeBoxIsHide;

        //获取提醒条数
        $scope.getMsgCount=getMsgCount;

        //设置的时间变量
        $scope.remindsTimeVal = '';

        //  总计
        $scope.MSGALLTOTAL = 0;

        /**
         * 获取信息条数
         * @param   num：提心条数种类 1收费提醒，2审核提醒，3分配提醒，9所有之和，10除了收费之外的总和
         */
        function getMsgCount(num) {
            RemindsService.getMsgCount().then(function (data) {
                var datas = data.data.data;
                //收费提醒的个数

                $scope.chargeRemindCount = datas.chargeRemindCount;
                //审核提醒的个数
                $scope.checkRemindCount = datas.checkRemindCount;
                //分配提醒的个数
                $scope.allotRemindCount = datas.allotRemindCount;
                //消课个数
                $scope.pastRemindCount = datas.pastPlanCount;
                if(num==1){
                        $scope.MSGALLTOTAL= $scope.chargeRemindCount+Number($scope.pastRemindCount);
                }else if(num==2){
                    $scope.MSGALLTOTAL= Number($scope.checkRemindCount)+Number($scope.pastRemindCount);
                }else if(num==4){
                    $scope.MSGALLTOTAL= Number($scope.allotRemindCount)+Number($scope.pastRemindCount);
                }
                else if(num==9){
                    $scope.MSGALLTOTAL= Number($scope.chargeRemindCount) + Number($scope.checkRemindCount) + Number($scope.allotRemindCount)+Number($scope.pastRemindCount);
                }else if(num==10){
                    $scope.MSGALLTOTAL= Number($scope.allotRemindCount) + Number($scope.checkRemindCount)+Number($scope.pastRemindCount);
                }

                var objArg = {
                    chargeRemindCount:$scope.chargeRemindCount,
                    checkRemindCount:$scope.checkRemindCount,
                    allotRemindCount:$scope.allotRemindCount,
                    pastRemindCount:$scope.chargeRemindCount,
                    MSGALLTOTAL:$scope.chargeRemindCount
                }
                // 接受对象,将大于100的数字显示为'...'
                _getPont3(objArg)
            })
        }
        $scope.titleNum = {}
        /**
         * 接受对象,将大于100的数字显示为'...'
         * @param arg
         *
         * @private
         */
        function _getPont3(arg) {
            for(var key in arg){
                // $scope[key] = $scope[key].toString().length>2?('...'):$scope[key]
                if($scope[key].toString().length>2){
                    $scope.titleNum[key] = $scope[key]
                    $scope[key] = '...'
                }
            }
        }
        /**
         * 获取每条提示的详情
         *  @param   rowId：每条提示的id
         */

        $scope.isRowSelectedId = 0;
        $scope.remingdsRowObj  ={};//修改时候需要传入的对象row
        function getRemindsInfo(rowId) {
            $scope.isRowSelectedId = rowId;
            var Idobj = {};
            Idobj.remindID = rowId;
            RemindsService.getOrderRemindDetail(Idobj).then(function (data) {
                var rowDetailMessage = data.data;
                $scope.remingdsRowObj=rowDetailMessage;
                $rootScope.remindsFeeDetail = rowDetailMessage;
            }, function (data) {

            });
        }

        $scope.getAllotRemindsInfo = function(row){
            $scope.isRowSelectedId = row.id;
            if(row.remind_type===31){
                $rootScope.remindsFeeDetail=row.content;
                return;
            }
            var Idobj = {};
            Idobj.remindID = row.id;
            Idobj.remindTitle = row.remind_title;
            RemindsService.getAllotRemindDetail(Idobj).then(function (data) {
                var rowDetailMessage = data.data;
                $scope.remingdsRowObj=rowDetailMessage;
                $rootScope.remindsFeeDetail = rowDetailMessage;
            }, function (data) {

            });
        }

         $scope.getPastCoursePlanInfo = function(row){
            $scope.isRowSelectedId = row.id;
            var Idobj = {};
            Idobj.remindID = row.id;
            Idobj.remindTitle = row.remind_title;
            $scope.remingdsRowObj=row;
            $rootScope.remindsFeeDetail = row;
        }

        /**
         * 获取提醒列表
         *  @param  remindsType：提醒类型;isPersonal:个人还是部门;pageNum:页数
         */
        $scope.hTotalPages = 0;//总页数
        $scope.hCurentPages = 1;//当前页数
        $rootScope.hkSelectedKinds = 1;
        $rootScope.isHasData = false;
        function getRemindsData(remindsType, isPersonal, pageNum) {
            var promise = OrderService.masterSlaveRelation();
            promise.then(function(result){
                $scope.masterSlaveRelation=result;
            })

            if(remindsType==0){
                return;
            }
            $scope.hCurentPages = pageNum;
            $rootScope.hkSelectedKinds = isPersonal;
            $rootScope.remindFilter = {
                remind_type: remindsType,//1是收费提醒，2是审核提醒,3是学员分配提醒,4是消课提醒
                pageNum: pageNum,
                pageSize: 10,
                isPersonal: isPersonal//1是个人，2是部门
            };
            // RemindsService.getOrderRemindsList($scope.remindFilter).then(function (successData) {
            //     $scope.hTotalPages = successData.data.pages;//总页数
            //     var remindsFee = successData.data.list;//数组对象，包含每一个提示信息
            //     $rootScope.remindsObj = {};
            //     $rootScope.remindsObj = remindsFee;
            //     $rootScope.remindsEveryNum = remindsFee.length;
            //     if ($rootScope.remindsEveryNum == 0||remindsFee[0]==null) {
            //         $rootScope.isHasData = false;
            //         //$scope.pastRemindCount=0;
            //     } else {
            //         //校长和运营主管能看【分配】和【审核】提醒，也就是校长能看所有提醒，运营主管能看除了收费提醒以外的所有提醒
            //         if($scope.isHxiaozhang){
            //             getMsgCount(9);//计算总和
            //         }
            //         else if($scope.isHYunyinzhuguan){
            //             getMsgCount(10);//计算除了收费以外的其他提醒总和
            //         }
            //         else{
            //             getMsgCount(1);
            //         }
            //         //渲染默认的第一条详情
            //         $rootScope.isHasData = true;
            //         var rowId = remindsFee[0].id;
            //         if($scope.remindFilter.remind_type == 3){
            //             $scope.getAllotRemindsInfo(remindsFee[0]);
            //         }
            //         else if($scope.remindFilter.remind_type == 4){
            //             $scope.getPastCoursePlanInfo(remindsFee[0]);
            //         }
            //         else{
            //             getRemindsInfo(rowId,$rootScope.remindsObj[0]);
            //         }
            //     }
            // }, function (data) {});

        }

        var _payDate = '';
        function _getOrderCopy() {
            var data = angular.copy($scope.order)
            $scope.payDate = _payDate
            return data
        }

        /**
         * 订单交费确定
         *  @param orderId：订单id  ，orderCategory:支付类型，  payNum:支付金额
         *
         */
        function payMentMoney(orderId, orderCategory, payNum,payDate) {
            if (payNum == '' || payNum == undefined){
                SweetAlert.swal('输入金额不能为空');
                return false;
            }else if(payNum<=0){
                SweetAlert.swal('输入金额不能小于0');
                return false;
            }else if(payNum>Number($rootScope.remindsFeeDetail.realTotalAmount-$rootScope.remindsFeeDetail.realPayAmount).toFixed(2)){
                SweetAlert.swal('输入金额不能大于尾款金额');
                return false;
            }
            if (payDate == null){
                SweetAlert.swal('交费日期不能为空');
                return;
            }
            _payDate = $scope.payDate;
            OrderService.getOrderPayments(0,1000,$scope.remindsFeeDetail.order_no).then(function(result) {
                if (result.data.length > 0) {
                    var maxPayDate = result.data[0].payDate;
                    if (maxPayDate > new Date(payDate).getTime()) {
                        SweetAlert.swal('本次支付时间不能小于上次支付时间！');
                        $scope.payDate = _payDate;
                        _getOrderCopy();
                        return;
                    }
                }

                var obj = {id: orderId, supplementaryFee: payNum, orderStatus: 2,payDate:payDate};
                if (orderCategory == 1) {
                    OrderService.charge(obj).then(function (data) {
                        SweetAlert.swal('操作成功');
                        try{
                            $scope.getIndexData(5)
                            $scope.getIndexData(3)
                            // row.is_past = 1
                        }catch (e){}
                        if ($scope.modalForStudentList) {
                            $scope.modalForStudentList.hide();
                        }
                        $rootScope.hkSelectedKinds=$rootScope.isRemindsContentShow==2?2:$rootScope.hkSelectedKinds;
                        getRemindsData($rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds,1);
                        //校长和运营主管能看【分配】和【审核】提醒，也就是校长能看所有提醒，运营主管能看除了收费提醒以外的所有提醒
                        if($scope.isHxiaozhang){
                            getMsgCount(9);//计算总和
                        }
                        else if($scope.isHYunyinzhuguan){
                            getMsgCount(10);//计算除了收费以外的其他提醒总和
                        }
                        else{
                            getMsgCount(1);
                        }
                        /*if($rootScope.isRemindsContentShow==2&&$scope.isHxiaozhang||$rootScope.isRemindsContentShow==1&&$scope.isHxiaozhang){//校长
                            getMsgCount(3);
                        }else if($rootScope.isRemindsContentShow==2&&$scope.isHxiaoquzhuguan||$rootScope.isRemindsContentShow==1&&$scope.isHxiaoquzhuguan){
                            getMsgCount(2);
                        }else{
                            getMsgCount(1);
                        }*/
                    }, function (data) {
                        SweetAlert.swal('操作失败');

                    });
                } else if (orderCategory == 3) {
                    OrderService.chargeTopup(obj).then(function (data) {
                        SweetAlert.swal('操作成功');
                        if ($scope.modalForStudentList) {
                            $scope.modalForStudentList.hide();
                            $rootScope.hkSelectedKinds=$rootScope.isRemindsContentShow==2?2:$rootScope.hkSelectedKinds;
                            getRemindsData($rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds,1);
                            try{
                                $scope.getIndexData(5)
                                $scope.getIndexData(3)
                                // row.is_past = 1
                            }catch (e){}
                        };
                        if($scope.isHxiaozhang){
                            getMsgCount(9);//计算总和
                        }
                        else if($scope.isHYunyinzhuguan){
                            getMsgCount(10);//计算除了收费以外的其他提醒总和
                        }
                        else{
                            getMsgCount(1);
                        }
                        if($rootScope._getIndexData_){
                            $rootScope._getIndexData_(5)
                        }
                    }, function (data) {
                        SweetAlert.swal('操作失败');
                    })
                };

            })

        }

        /**
         * 点击切换对应的tab
         *  @param  num当前的提醒类型的种类id
         */

        function RemindsTabTitle(num) {
            $rootScope.isRemindsContentShow = num;
            $scope.hCurentPages = 1;//当前页数
            num==1?getRemindsData(num, 1, 1):getRemindsData(num, 2, 1);

        }

        /**
         * 点击弹出窗口 并且渲染数据
         *  @param  num当前的提醒类型的种类id
         */
        $rootScope.isRemindsContentShow = 0;//默认进来需要哪个提醒显示，
        $scope.showRemindingListModal = function (num) {
            $rootScope.isRemindsContentShow = num;
            $scope.hCurentPages = 1;
            if(!$scope.modalForRemindsList||!$scope.modalForRemindsList.$isShown){
            	$scope.modalTitleForRemindingList = '提醒中心';
            	$scope.modalForRemindsList = $modal({
            		scope: $scope,
            		templateUrl: 'partials/sos/product/order.message.reminding.html',
            		show: true
            	});
            }
            if(num == 1){
                getRemindsData(1, 1, 1);
            }
            else if(num == 2){
                getRemindsData(2, 2, 1);
            }
            else if(num == 3){
                getRemindsData(3, 2, 1);
            }
            else if(num == 4){
                getRemindsData(4, 2, 1);
            }
            //num == 1 ? getRemindsData(1, 1, 1) : getRemindsData(2, 2, 1);
            if($scope.isHxiaozhang){
                getMsgCount(9);//计算总和
            }

            else if($scope.isHYunyinzhuguan){
                getMsgCount(10);//计算除了收费以外的其他提醒总和
            }
            else{
                getMsgCount(1);
            }
        };

        /**
         * 提醒设置
         *  @param
         */

        $scope.isShowBox = false;
        function showSetRemindsTimeBox($event) {
            $event.stopPropagation();
            $scope.isShowBox = true;
        }

        /**
         * 时间设置
         *  @param num：当前点击的天数
         */

        $scope.isTimeChoose = 0;
        function setTimeDay(num) {
            $scope.isTimeChoose = num;
            $scope.remindsTimeVal = GetDateStr(num);

        }

        function setisTimeChoose() {
            $scope.isTimeChoose = 0;
        }
        /**
         * 返回今天之后的第几天
         *  @param AddDayCount:天数
         */
        function GetDateStr(AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1;//获取当前月份的日期
            var d = dd.getDate();
            return (y + "-" + m + "-" + d);
        }

        /**
         * 时间设置确定
         *  @param id:当前订单的id
         */

        function remindsTimeSetOk(id,$event) {
            $event.stopPropagation();
            var time = $('.hk-date-set').val();
            if (time == '') return false;
            var remindTime = new Date(time.replace(/-/g, '/')).getTime();
            var dateObj = {
                id: id,
                remindTime: remindTime,
                isDeleted: 0
            };

               if($scope.remindsFeeDetail.omsCoursePlanId){
                    dateObj = {
                        referenceId: $scope.remindsFeeDetail.omsCoursePlanId,
                        remindTime: remindTime,
                        remindType:4,
                        isDeleted: 0
                 };
               }

            RemindsService.setNextRemindsTime(dateObj).then(function (data) {
                if (data.data.status == 'SUCCESS') {
                    $scope.isShowBox = false;
                    $scope.isTimeChoose = 0;
                    $scope.remindsTimeVal = '';
                }
                SweetAlert.swal('操作成功');
                $rootScope.hkSelectedKinds=$rootScope.isRemindsContentShow==2?2:$rootScope.hkSelectedKinds;
                getRemindsData( $rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds,1);
                if($scope.isHxiaozhang){
                    getMsgCount(9);//计算总和
                }
                else if($scope.isHYunyinzhuguan){
                    getMsgCount(10);//计算除了收费以外的其他提醒总和
                }
                else{
                    getMsgCount(1);
                }
            }, function (data) {
                SweetAlert.swal('操作失败');
            });
            return false;

        }


        /**
         * @method 点击其他位置时间设置弹框消失
         * @param  事件对$event
         * @return
         */

        function setTimeBoxIsHide($event){
            var tar=$event.target;
            while(tar){
                if(tar.id&tar.id=='setTimeAlert'||tar.id&tar.id=='setTimeAlert2'){
                    $scope.isShowBox = true;
                    return false;
                }
                tar=tar.parentNode;
            }
            $scope.isShowBox = false;
            $scope.isTimeChoose = 0;
            $scope.remindsTimeVal = '';
            $scope.isSetTimelist=true;

        };

        /**
         * 提醒设置关闭
         *  @param
         */

        $scope.isSetTimelist = true;
        function setTimeClose($event) {
            $event.stopPropagation();
            $scope.isTimeChoose = 0;
            $scope.remindsTimeVal = '';
            $scope.isShowBox = false;
            return false;

        }

        /**
         * 不在提醒弹出窗口
         *  @param
         */
        function setTimeNoReminds($event) {
            $event.stopPropagation();
            $scope.isSetTimelist = !$scope.isSetTimelist;
            return false
        }

        /**
         * 不在提醒确定
         *  @param id:当前的订单id
         */
        function chooseNoReminds(id) {
            var dateObj = {
                id: id,
                isDeleted: 1
            };
            if($scope.remindsFeeDetail.omsCoursePlanId){
                    dateObj = {
                        referenceId: $scope.remindsFeeDetail.omsCoursePlanId,
                        remindType:4,
                        isDeleted: 1
                 };
            }
            RemindsService.setNextRemindsTime(dateObj).then(function (data) {
                if (data.data.status == 'SUCCESS') {
                    $scope.isShowBox = false;
                    $scope.isSetTimelist = !$scope.isSetTimelist;
                    $scope.isTimeChoose = 0;
                    $scope.remindsTimeVal = '';
                }
                SweetAlert.swal('操作成功');
                $rootScope.hkSelectedKinds=$rootScope.isRemindsContentShow==2?2:$rootScope.hkSelectedKinds;
                getRemindsData( $rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds,1);
                if($scope.isHxiaozhang){
                    getMsgCount(9);//计算总和
                }
                else if($scope.isHYunyinzhuguan){
                    getMsgCount(10);//计算除了收费以外的其他提醒总和
                }else if($scope.remindFilter.remind_type == 4){
                      $rootScope.getRemindsData(4, 2, 1);
                }
                else{
                    getMsgCount(1);
                }
            }, function (data) {
                SweetAlert.swal('操作失败');
            });
            return false
        }
        /**
         * 不在提醒的取消
         *  @param
         */
        function setTimeNoRemindCancle() {
            $scope.isSetTimelist = !$scope.isSetTimelist;
            return false
        }

        /**
         * 交费弹窗
         *  @param
         */

        function openShouFeeAlert() {
            $scope.modalTitleForShouFeeAlert = '收费';
            //$scope.payDate = new Date();
            $scope.modalForStudentList = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/product/reminds.shoufeiAlert.html',
                show: true
            });
            return false

        }


        /**
         * 分页函数
         *  @param  remindsType：提醒类型;isPersonal:个人还是部门;pageNum:页数
         */
        function hSelectedPage(remindsType, isPersonal, pageNum) {
            $scope.hCurentPages = Number(pageNum);
            if (pageNum < 1 || pageNum > $scope.hTotalPages||pageNum=='') {  //输入页数小于1页或者输入页数大于总页或者为空
                if(pageNum < 1){
                    $scope.hCurentPages=1
                }else if( pageNum > $scope.hTotalPages){
                    $scope.hCurentPages=$scope.hTotalPages;
                }
                return false;
            } else{
                getRemindsData(remindsType, isPersonal, pageNum);
            }

        }

        $scope.positionIdList = [{id:86, name:"学习顾问"}, {id:87, name:"运营主管"}, {id:212, name:"运营管培生"}, {id:79, name:"校长"}];
        $scope.methods = [{id:1, name:"分配给"}, {id:2, name:"保持当前"}];

        /**
         * 分配学员弹框
         */
        $scope.showAllotStudentView = function(row){
            if(row.employmentStatus==null){
                CommonService.getAllPositionsByOrgId().then(function (result) {
                    $scope.allAllotPositionDL = result.data;
                });
                $scope.modalTitleDL = '本校区分配所属人';
                $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/customer/modal.distributeFromList.html', show: true,backdrop:'static'});
            }else{
                $scope.getAllSelected();
                $scope.studentFilter = {};
                $scope.employeeFilter = {};
                $scope.employeeFilter.state = 1;
                $scope.studentFilter.remindID = row.remindID;
                $scope.allotModalTitle = '学员分配';
                $scope.toBeAllotedStudentList = [];
                $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/product/modal.allotStudent.html', show: true,backdrop:'static'});
            }
        }

        /**
         * 查询分配提醒对应的学员
         */
        $scope.studentFilter = {};
        $scope.getAllotStudentList = function(tableState){
            if($scope.studentFilter.state == ""){
                $scope.studentFilter.state = undefined;
            }
            $scope.isAllSelected = false;
            $scope.toBeAllotedStudentList = [];
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            $scope.studentFilter.pageNum = start / number + 1;
            $scope.studentFilter.pageSize = number;
            $scope.studentListTableState = tableState;
            RemindsService.getAllotStudentList($scope.studentFilter).then(function (result) {
                $scope.studentList = result.data.data.list;
                tableState.pagination.numberOfPages = result.data.data.pages;
            }, function (data) {

            });
        }

        /**
         * 全选与全反选
         */
        $scope.selectAllStudent = function(){
            if(!$scope.isAllSelected){
                $scope.isAllSelected = true;
                var exist = false;
                angular.forEach($scope.studentList, function(p, index){
                    exist = false;
                    angular.forEach($scope.toBeAllotedStudentList, function(q, index1){
                        if(p.id == q.id){
                            exist = true;
                            return;
                        }
                    });
                    if(exist == false){
                        p.isSelected = true;
                        $scope.toBeAllotedStudentList.push(p);
                    }
                });
            }
            else{
                $scope.isAllSelected = false;
                angular.forEach($scope.studentList, function(p, index){
                    exist = false;
                    angular.forEach($scope.toBeAllotedStudentList, function(q, index1){
                        if(p.id == q.id){
                            p.isSelected = false;
                            $scope.toBeAllotedStudentList.splice(index1, 1);
                            exist = true;
                            return;
                        }
                    });
                });
            }
        }

        /**
         * 点选复选框后
         */
        $scope.selectStudent = function(row){
            //判断是否选中集合中，如果在，则去掉
            var exist = false;
            angular.forEach($scope.toBeAllotedStudentList, function(p, index){
                if(p.id == row.id){
                    $scope.toBeAllotedStudentList.splice(index, 1);
                    exist = true;
                    return;
                }
            });
            if(!exist){
                angular.forEach($scope.studentList, function(p, index){
                    if(p.id == row.id){
                        $scope.toBeAllotedStudentList.push(p);
                        row.isSelected = true;
                        return;
                    }
                });
            }
            else{
                row.isSelected = false;
            }
        }

        /**
         * 判断学员是否被选中
         */
        $scope.isSelected = function(row){
            var exist = false;
            angular.forEach($scope.toBeAllotedStudentList, function(p, index){
                if(p.id == row.id){
                    exist = true;
                    return;
                }
            });
            if(exist){
                row.isSelected = true;
            }
            else {
                row.isSelected = false;
            }
            return exist;
        }

        $scope.gradeIds = [];
        $scope.getAllSelected = function getAllSelected() {
            CommonService.getGradeIdSelect().then(function (result) {
                $scope.gradeIds = result.data;
            });
            CommonService.getMediaChannel(0).then(function (result) {
                $scope.mediaChannel1List = result.data;
            });
        };

        $scope.mediaChannel1ChangeForFilter = function(){
            if($scope.studentFilter.mediaChannelId1){
                CommonService.getMediaChannel($scope.studentFilter.mediaChannelId1).then(function (result) {
                    $scope.mediaChannel2List = result.data;
                });
            }else{
                $scope.mediaChannel2List = [];
            }
        }

        $scope.allAllotUserDL = [];
        $scope.allotCrmCustomerStudentFilter = {};
        $scope.positionChangeForAllotDL = function () {
            if ($scope.allotCrmCustomerStudentFilter.position_id) {
                CommonService.getAllUserByOrgIdAndPositionId($scope.allotCrmCustomerStudentFilter.position_id).then(function (result) {
                    $scope.allAllotUserDL = result.data;
                });
            } else {
                $scope.allAllotUserDL = [];
            }
            if ($scope.employeeFilter && $scope.employeeFilter.positionId) {
                CommonService.getAllUserByOrgIdAndPositionId($scope.employeeFilter.positionId).then(function (result) {
                    $scope.allAllotUserDL = result.data;
                });
            } else {
                $scope.allAllotUserDL = [];
            }
        }

        $scope.continueAllot = function(){
            //清空数组
            $scope.toBeAllotedStudentList = [];
            $scope.employeeFilter.positionId = null;
            $scope.employeeFilter.userId = null;
            $scope.infoModal.hide();
            try{
                $scope.getIndexData(5)
            }catch (e){}
        }

        $scope.hideAllotModal = function(){
            //需要关闭【学院分配】弹框，同时刷新该条提醒;
            getRemindsData( $rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds,1);
            if($scope.isHxiaozhang){
                getMsgCount(9);//计算总和
            }
            else if($scope.isHYunyinzhuguan){
                getMsgCount(10);//计算除了收费以外的其他提醒总和
            }
            else{
                getMsgCount(1);
            }
            $scope.modal.hide();
            $scope.infoModal.hide();
        }

        $scope.allRemains = function(){
            //保持当前
            SweetAlert.swal({
                title: "该操作将使学生的所属人保持为此员工，其他人无法查看学生或排课。是否确定？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: true
            }, function(confirm) {
                if (confirm) {
                    var param = {};
                    param.belongUserId = $scope.remindsFeeDetail.referenceId;
                    param.flag = 3;
                    param.list = $scope.studentList;
                    RemindsService.reAllotStudent(param).then(function(response){
                        angular.forEach($scope.studentList, function(q, index1){
                            q.state = 1;
                        });
                        $scope.mtStutas = 1;
                        $scope.continueStatus = true;
                        $scope.successContent = "成功分配" +　response.data.data.doneCount　+ "名学员，剩余" + response.data.data.undoCount + "人，是否继续分配？";
                        $scope.infoModal = $modal({
                            scope: $scope,
                            templateUrl: 'partials/common/modal.success.html',
                            show: true
                        });
                    });
                }
            });
        }

        $scope.allotStudent = function(){
            if($scope.employeeFilter.state == 2){
                //保持当前
                SweetAlert.swal({
                    title: "该操作将使学生的所属人保持为此员工，其他人无法查看学生或排课。是否确定？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function(confirm) {
                    if (confirm) {
                        if($scope.toBeAllotedStudentList.length > 0){
                            //有选择学员，则需要去更新处理状态
                            var param = {};
                            param.belongUserId = $scope.remindsFeeDetail.referenceId;
                            param.flag = 1;
                            param.list = $scope.toBeAllotedStudentList;
                            RemindsService.reAllotStudent(param).then(function(response){
                                angular.forEach($scope.studentList, function(p, index){
                                    angular.forEach($scope.toBeAllotedStudentList, function(q, index1){
                                        if(p.id == q.id){
                                            p.state = 1;
                                            p.belong_user_id = $scope.employeeFilter.userId;
                                            angular.forEach($scope.allAllotUserDL, function(t, index2){
                                                if(t.id == $scope.employeeFilter.userId){
                                                    p.belong_user_name = t.name;
                                                    return;
                                                }
                                            });
                                            return;
                                        }
                                    });
                                });

                                $scope.mtStutas = 1;
                                $scope.continueStatus = true;
                                $scope.successContent = "成功分配" +　$scope.toBeAllotedStudentList.length　+ "名学员，剩余" + response.data.data.undoCount + "人，是否继续分配？";
                                $scope.infoModal = $modal({
                                    scope: $scope,
                                    templateUrl: 'partials/common/modal.success.html',
                                    show: true
                                });
                                /*
                                var undoCount = response.data.data;
                                SweetAlert.swal({
                                    title: "成功分配" +　$scope.toBeAllotedStudentList.length　+ "名学员，剩余" + undoCount + "人，是否继续分配？",
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: '#DD6B55',
                                    confirmButtonText: '继续分配',
                                    cancelButtonText: '否',
                                    closeOnConfirm: true
                                }, function(confirm) {
                                    if (confirm) {
                                        //清空数组
                                        $scope.toBeAllotedStudentList = [];
                                        $scope.employeeFilter.positionId = null;
                                        $scope.employeeFilter.userId = null;
                                    }
                                    else{
                                        //需要关闭【学院分配】弹框，同时刷新该条提醒;
                                        getRemindsData( $rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds,1);
                                        if($scope.isHxiaozhang){
                                            getMsgCount(9);//计算总和
                                        }
                                        else if($scope.isHYunyinzhuguan){
                                            getMsgCount(10);//计算除了收费以外的其他提醒总和
                                        }
                                        else{
                                            getMsgCount(1);
                                        }
                                        $scope.modal.hide();
                                    }
                                });*/
                            });
                        }

                    }
                });
            }
            //重新为学员分配所属人
            else if($scope.employeeFilter.state == 1){
                if($scope.toBeAllotedStudentList.length > 0){
                    //有选择学员，则需要去更新处理状态
                    var param = {};
                    param.belongUserId = $scope.employeeFilter.userId;
                    param.flag = 2;
                    param.list = $scope.toBeAllotedStudentList;
                    RemindsService.reAllotStudent(param).then(function(response){
                        angular.forEach($scope.studentList, function(p, index){
                            angular.forEach($scope.toBeAllotedStudentList, function(q, index1){
                                if(p.id == q.id){
                                    p.state = 1;
                                    p.belong_user_id = $scope.employeeFilter.userId;
                                    angular.forEach($scope.allAllotUserDL, function(t, index2){
                                        if(t.id == $scope.employeeFilter.userId){
                                            p.belong_user_name = t.name;
                                            return;
                                        }
                                    });
                                    return;
                                }
                            });
                        });
                        var undoCount = response.data.data;
                        SweetAlert.swal({
                            title: "成功分配" +　$scope.toBeAllotedStudentList.length　+ "名学员，剩余" + response.data.data.undoCount + "人，是否继续分配？",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: '#DD6B55',
                            confirmButtonText: '继续分配',
                            cancelButtonText: '否',
                            closeOnConfirm: true
                        }, function(confirm) {
                            if (confirm) {
                                //清空数组
                                $scope.toBeAllotedStudentList = [];
                                $scope.employeeFilter.positionId = null;
                                $scope.employeeFilter.userId = null;
                            }
                            else{
                                //需要关闭【学院分配】弹框，同时刷新该条提醒;
                                getRemindsData( $rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds,1);
                                if($scope.isHxiaozhang){
                                    getMsgCount(9);//计算总和
                                }
                                else if($scope.isHYunyinzhuguan){
                                    getMsgCount(10);//计算除了收费以外的其他提醒总和
                                }
                                else{
                                    getMsgCount(1);
                                }
                                $scope.modal.hide();
                            }
                        });
                    });
                }
            }
        }

        $scope.allotModalHide = function (){
            getRemindsData( $rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds,1);
            if($scope.isHxiaozhang){
                getMsgCount(9);//计算总和
            }
            else if($scope.isHYunyinzhuguan){
                getMsgCount(10);//计算除了收费以外的其他提醒总和
            }
            else{
                getMsgCount(1);
            }
            $scope.modal.hide();
        }

        /**
         * 分配学员
         */
        $scope.distributePerson=function(){
            if (!$scope.allotCrmCustomerStudentFilter.user_id) {
                SweetAlert.swal("未选择员工");
                return;
            }
            var AllotCrmCustomerStudentVo = {};
            AllotCrmCustomerStudentVo.studentList = [];
            var student={};
            student.crm_student_id=$scope.remindsFeeDetail.studentId;
            student.phone=$scope.remindsFeeDetail.studentPhone;
            AllotCrmCustomerStudentVo.studentList.push(student);
            AllotCrmCustomerStudentVo.user_id=$scope.allotCrmCustomerStudentFilter.user_id;
            var promise=CustomerStudentService.saveAllot(AllotCrmCustomerStudentVo);
            promise.then(function (data) {
                $scope.allotCrmCustomerStudentFilter = {};
                $scope.allAllotPositionDL = [];
                $scope.allAllotUserDL = [];
                var reminds={};
                reminds.id=$scope.remindsFeeDetail.remindID;
                reminds.remindStatus=2;
                reminds.isDeleted=0;
                //更新提醒状态
                RemindsService.update(reminds).then(function (result){
                    SweetAlert.swal("分配成功！在读学员的所属人可在学员管理菜单中查到此在读学员");
                    //需要关闭【学院分配】弹框，同时刷新该条提醒;
                    getRemindsData( $rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds,1);
                    if($scope.isHxiaozhang){
                        getMsgCount(9);//计算总和
                    }
                    else if($scope.isHYunyinzhuguan){
                        getMsgCount(10);//计算除了收费以外的其他提醒总和
                    }
                    else{
                        getMsgCount(1);
                    }
                    if($rootScope._getIndexData_){
                        $rootScope._getIndexData_(5)
                    }
                    $scope.modal.hide();
                });
            }, function (error) {
                SweetAlert.swal("分配学生失败");
            });
        }

        /**
         * 保持当前所属人
         * @param detail
         */
        $scope.keepNow=function keepNow(detail){
            SweetAlert.swal({
                title: "将保留学员当前所属人，所属人为" + detail.studentUserName + "。是否确定？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: true,
                closeOnConcel: true
            }, function(confirm) {
                if (confirm) {
                    var reminds={};
                    reminds.id=detail.remindID;
                    reminds.remindStatus=2;
                    reminds.isDeleted=0;
                    //更新提醒状态
                    RemindsService.update(reminds).then(function (result){
                        $scope.mtStutas=1;
                        $scope.successContent="操作成功";
                        $modal({
                            scope: $scope,
                            templateUrl: 'partials/common/modal.success.html',
                            show: true
                        });
                        //需要关闭【学院分配】弹框，同时刷新该条提醒;
                        getRemindsData( $rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds,1);
                        if($scope.isHxiaozhang){
                            getMsgCount(9);//计算总和
                        }
                        else if($scope.isHYunyinzhuguan){
                            getMsgCount(10);//计算除了收费以外的其他提醒总和
                        }
                        else{
                            getMsgCount(1);
                        }
                    });
                }
            });
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

        //判断当前用户是否为课程顾问
        $scope.isKechengguwen=false;
        $scope.isKeChengGuWenOrMaster = function () {
            //console.log(localStorageService.get('position_id'));
            if (localStorageService.get('position_id') == Constants.PositionID.COURSE_OFFICER) {//不是校长
                $scope.isKechengguwen=true;
            } else {
                return false;
            }
        }

        //判断当前用户是否为营销管培生
        $scope.isYinxiaoguangpeisheng=false;
        $scope.isYingXiaoGuanPeiSheng = function(){
            if (localStorageService.get('position_id') == Constants.PositionID.YX_SHEN) {
                $scope.isYinxiaoguangpeisheng=true;
            } else {
                return false;
            }
        }


        //判断当前用户是否为学习顾问
        $scope.isXuexiguwen=false;
        $scope.isXueXiGuWen = function(){
            if (localStorageService.get('position_id') == Constants.PositionID.STUDENT_CHIEF) {
                $scope.isXuexiguwen=true;
            } else {
                return false;
            }
        }

        //判断当前用户是否为运营管培生
        $scope.isYunyingguanpeisheng=false;
        $scope.isYunYingGuanPeiSheng = function(){
            if (localStorageService.get('position_id') == Constants.PositionID.YUNYING_MANAGEMENT_TRAINING) {
                $scope.isYunyingguanpeisheng=true;
            } else {
                return false;
            }
        }
        // 判断当前用户是否为校长
        $scope.isHxiaozhang=false;
        $scope.isHXiaoZhang = function(){
            if (localStorageService.get('position_id') == Constants.PositionID.HEADMASTER) {
                $scope.isHxiaozhang=true;
            } else {
                return false;
            }
        }
        //判断当前用户是否为校区主管
        $scope.isHxiaoquzhuguan=false;
        $scope.isHXiaoQuZhuGuan = function(){
            if (localStorageService.get('position_id') == Constants.PositionID.FINANCIAL_AFFAIRS) {
                $scope.isHxiaoquzhuguan=true;
            } else {
                return false;
            }
        }
        //判断当前用户是否为营销主管
        $scope.isHYinxiaozhuguan=false;
        $scope.isHYinXiaoZhuGuan = function(){
            if (localStorageService.get('position_id') == Constants.PositionID.COURSE_CHIEF_OFFICER) {
                $scope.isHYinxiaozhuguan=true;
            } else {
                return false;
            }
        }
        //判断当前用户是否为运营主管
        $scope.isHYunyinzhuguan=false;
        $scope.isHYunYinZhuGuan = function(){
            if (localStorageService.get('position_id') == Constants.PositionID.STUDENT_CHIEF_OFFICER) {
                $scope.isHYunyinzhuguan=true;
            } else {
                return false;
            }
        }
        $scope.isXiaoZhangShow=false;
        $scope.isXiaoQuZhuGuanShow=false;
        $scope.isShowWitchReminds=false;
        $scope.isShenHeRemindsShow=false;
        $scope.isAllotRemindsShow = false;
        $scope.isPastRemindsShow=false;
        $scope.isHXiaoZhang();
        $scope.isHYinXiaoZhuGuan();
        $scope.isHYunYinZhuGuan();
        $scope.isKeChengGuWenOrMaster();
        $scope.isYingXiaoGuanPeiSheng();
        $scope.isXueXiGuWen();
        $scope.isYunYingGuanPeiSheng();
        $scope.isHXiaoQuZhuGuan();
        //判断当前用户是不是这七个中的一个，如果是再可以展示提醒消息以及提醒类型
        if($scope.isHYunyinzhuguan||$scope.isHYinxiaozhuguan||$scope.isHxiaozhang||$scope.isYunyingguanpeisheng||$scope.isXuexiguwen||$scope.isYinxiaoguangpeisheng||
            $scope.isKechengguwen){//如果是这七大类则显示交费提醒和消课提醒
            $scope.isPastRemindsShow=true;
            if($scope.isHxiaozhang){//如果是这一类可以显示审核提醒
                $scope.isShenHeRemindsShow=true;
                $scope.isShowWitchReminds=true;
                $scope.isAllotRemindsShow=true;
                getMsgCount(9);
            }else if($scope.isHYunyinzhuguan){//只有分配提醒
                $scope.isShowWitchReminds=false;
                $scope.isShenHeRemindsShow=false;
                $scope.isAllotRemindsShow=true;
                getMsgCount(10);
            }
            else{
                $scope.isShowWitchReminds=true;
                $scope.isShenHeRemindsShow=false;
                $scope.isAllotRemindsShow=false;
                getMsgCount(1);
            }
        }else if($scope.isHxiaoquzhuguan){//如果是校区主管，只有审核提醒
            $scope.isShenHeRemindsShow=true;
            $scope.isShowWitchReminds=false;
            $scope.isAllotRemindsShow=false;
            getMsgCount(1);
        } else{
            $scope.isShowWitchReminds=false;
            $scope.isShenHeRemindsShow=false;
            $scope.isAllotRemindsShow=false;

        }
    }
]);
