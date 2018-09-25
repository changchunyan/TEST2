'use strict';
/**
 * The Refund management controller.
 * @author sunqc
 * @version 1.0
 */
angular.module('ywsApp').controller('RefundManagementController', ['$scope', '$modal', '$rootScope','$routeParams', 'SweetAlert','OrderService','CommonService','OrderTransferService','CustomerStudentService','AuthenticationService',
                                                                   'CrmChargingSchemeService','CoursePlanService','CustomerStudentCourseService',
    function($scope, $modal, $rootScope, $routeParams,SweetAlert,OrderService,CommonService, OrderTransferService,CustomerStudentService,AuthenticationService,CrmChargingSchemeService,CoursePlanService,CustomerStudentCourseService) {
        function warningAlert(title) {
            SweetAlert.swal({
                title: title,
                type: "warning",
                showCancelButton: false,
                confirmButtonText: '确定',
                closeOnConfirm: true
            })
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
        $scope.auditOrder = auditOrder;
        $scope.detailOrder = detailOrder;
        $scope.Cancellation= Cancellation;
        $scope.subjectIds = [{name:'语文',id:1},{name:'英语',id:2}];
        $scope.gradeIds = [{name:'小学一年级',id:1},{name:'小学二年级',id:2}];
        $scope.courseTypeIds = [{name:'全优课程',id:1},{name:'金牌课程',id:2}];
        $scope.orderTypeSelect = [{name:'新签',id:1},{name:'续费',id:2},{name:'返课',id:3},{name:'推荐',id:5}];
        $scope.orderStatusSelect =  [{name:'录入订单',id:1},{name:'支付定金',id:2},{name:'审核通过',id:3},{name:'审核未通过',id:4},{name:'已退单',id:5}];
        $scope.orderNo;
        $scope.order={};
        $scope.orderSearch={};
        $scope.okonclick=false;
        //质量主管 的 岗位信息获取
        $scope.qualityManagerId = AuthenticationService.currentUser().position_id

        console.log($scope.qualityManagerId)
        //撤销审核
        function Cancellation(row){
            $scope.order = angular.copy(row);
            SweetAlert.swal({
                    title: "是否撤销审核?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function(isConfirm){
                    if (isConfirm) {
                        var promise = OrderService.deleteauditRefund($scope.order);
                        promise.then(function(result) {
                            if(result.status == 'FAILURE'){
                                swal('撤销退费审核失败');
                            }else{
                                swal('撤销退费审核成功');
                                $scope.refreshTabs();
                            }

                        })
                    }else{
                        swal('您点击了取消');
                    }
                })
        }

        //初始化订单中包含的课程相关总计信息(总课时 总金额)
        $scope.initData = function initData(){
            $scope.order.totalOriginalNum=0;
            $scope.order.totalPrice=0;
            $scope.order.supplementaryFee=0;
            angular.forEach($scope.order.orderCourses, function(data,index,array){
                $scope.order.totalOriginalNum= $scope.order.totalOriginalNum+data.originalNum;
                $scope.order.totalPrice = $scope.order.totalPrice+(data.originalNum *data.actualPrice );
            });
        };

        function detailOrder(obj) {
            obj.refundDate = new Date(obj.refundDate);
            $scope.order = angular.copy(obj);
            $scope.modalTitle = '查看';
            $scope.auditRefundModal = $modal({scope: $scope, templateUrl: 'partials/sos/refund/detail.html', show: true });
            $scope.getOrderCourses();
            $scope.getOrderPayments();
        }
        //张宏杰 充值课时订单的动态添加，并且实现批量退费和 前台表单验证

        //张宏杰 后台传入的数组
        $scope.chongzhi=[];
        //张宏杰 控制前台submit的按钮 disabled
        $scope.noclick=true;
        //张宏杰 点击checkbox逐条添加 做到三条
        $scope.applyRefund = function applyRefund(refundOrder){
            refundOrder.okonclick=false;
            refundOrder.partialRefundFlag = 0;
             if(refundOrder.selected){
                 if($scope.chongzhi.length>2){
                     SweetAlert.swal("最多可以点击三个", '', 'warning');
                     // refundOrder.selected=false;
                 }else{
                     $scope.chongzhi.push(refundOrder);
                 }
                }else{
                    $scope.chongzhi = $scope.chongzhi.filter(function(x){return x.orderNo != refundOrder.orderNo});
                }
                if($scope.chongzhi.length>0){
                    $scope.noclick=false;
                }
            // refundOrder.remark = false;
            // refundOrder.modalTitle = "申请退费";
            refundOrder.crmStudentId = $scope.detail.crm_student_id;
            refundOrder.originOrderNo= refundOrder.orderNo;
            refundOrder.crmStudentId = $scope.detail.crm_student_id;
            refundOrder.privilegeRatio =  Number((refundOrder.realTotalAmount * 100 / (refundOrder.privilegeAmount+refundOrder.realTotalAmount)).toFixed(1)) ;
            if(refundOrder.orderCategory == 3){
                refundOrder.orderRefundCategory = 3;
                refundOrder.okread=false;
            }else{
                refundOrder.orderRefundCategory = 1;
                refundOrder.okread=true;
                // 需要根据订单信息查询出订单子表的信息在退费的页面进行展示
                _getAllOrderCourses(refundOrder);
            }

        };

        /**
         * 张宏杰 获取选择订单的课程子表的信息
         */
        function _getAllOrderCourses(refundOrder){
            var filter = {};
            filter.crmCustomerStudentId = $scope.detail.crm_student_id;
            var orderNos = refundOrder.originOrderNo;
            if(orderNos.length > 0){
                filter.customCondition = " and s.order_no = '" + orderNos +"' ";
                CustomerStudentCourseService.getOrderCourseList(filter).then(function (result) {
                    refundOrder.orderCourses = result.studentOrder;
                    // $scope.refundOrder.orderCourses = result.studentOrder;
                });
            }
        }

        /**
         * 张宏杰 输入扣减课时，自动计算退费的金额
         */
        $scope.changeRefundCourseNum = function (row,arrnext,num){
            $scope.legalFlag = false;
            if(row.refundCourseNum==undefined || row.refundCourseNum==0){
                row.refundCourseNum="";
                $scope.legalFlag = true;
            }
            if(row.refundCourseNum > row.plan_available_num){
                $scope.legalFlag = true;
                SweetAlert.swal("扣减课时不能大于可排课时");
                row.refundCourseNum="";
                row.refundCourseAmout=0;
                arrnext.reduceCourseNum=0;
                arrnext.refundAmount=0;
                return false;
            }
            row.refundCourseAmout = row.actual_price * row.refundCourseNum;
            if(row.courseBuyUnit == 3){
                row.refundCourseAmout = row.actual_price * row.refundCourseNum / row.currentRegularTimes;
            }else{
                row.refundCourseAmout = row.actual_price * row.refundCourseNum;
            }
            var refundAmountTemp = 0;
            var refundCourseTemp = 0;
            var refundcompare = 0;
            for(var j = 0 ,len1 = arrnext.orderCourses.length ; j<len1;j++){
                if( arrnext.orderCourses[j].refundCourseAmout==undefined){
                    arrnext.orderCourses[j].refundCourseAmout=0;
                }
                if(arrnext.orderCourses[j].refundCourseNum==undefined){
                    arrnext.orderCourses[j].refundCourseNum=0;
                }
                refundcompare = refundcompare + arrnext.orderCourses[j].course_num;
                refundAmountTemp = refundAmountTemp + arrnext.orderCourses[j].refundCourseAmout;
                refundCourseTemp = refundCourseTemp + arrnext.orderCourses[j].refundCourseNum;
            }
            // 扣减总课时
            arrnext.reduceCourseNum = Number(refundCourseTemp);
            // arrnext.refundAmount = Number(refundAmountTemp.toFixed(2));
            //自动增加课时输入的验证全部退费功能
            if(refundcompare==refundCourseTemp){
                SweetAlert.swal({
                        title: "确认全部退费?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确认",
                        cancelButtonText: "取消",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    },
                    function(isConfirm){
                        if (isConfirm) {
                            arrnext.allreturncheck=true;
                            $scope.allreturncheck(arrnext);
                            swal("全部退费按钮被选中");
                        }else {
                            if(arrnext.orderRefundCategory ==1 ) {
                                arrnext.refundCourseNum = 0;
                                arrnext.refundAmount = 0;
                                arrnext.reduceAccountAmount = 0;
                                arrnext.reduceCourseNum = 0;
                                for (var i = 0; i < arrnext.orderCourses.length; i++) {
                                    arrnext.orderCourses[i].refundCourseNum = 0;
                                    arrnext.orderCourses[i].refundCourseAmout = 0;
                                }
                                $scope.legalFlag = true;
                            }else{
                                arrnext.refundAmount = 0;
                                arrnext.reduceAccountAmount = 0;
                                $scope.legalFlag = true;
                            }
                            swal("没有选择全部退费");
                        }
                    })

            }
            arrnext.refundAmount = Number((refundAmountTemp*arrnext.privilegeRatio/100).toFixed(2));
            // 若扣减课时=可排课时，则为全部退费，需要改变订单状态
            if(arrnext.reduceCourseNum == arrnext.totalPlanAvailableNum){
                arrnext.partialRefundFlag = 1;
            }else{
                arrnext.partialRefundFlag = 0;
            }
        }

        /**
         * 张宏杰 选择-退费原因 判定
         */
        $scope.changing = function changing(arrnext){
            arrnext.remark = false;
            if(arrnext.refundReasonType == 9){
                arrnext.remark = true;
            }
        }
        /**
         * 张宏杰 充值订单需要根据退费金额，算下扣减的账户金额
         */
        $scope.islegalRefundAmount = function islegalRefundAmount(arrnext){
            // // 充值订单判断
            // if(arrnext.orderCategory == 3){
            //     $scope.legalFlag = false;
            //     // 判断充值订单的退费金额    和  可排金额 * 折扣率
            //     var tempAmount = Number((arrnext.avaliableAmount * arrnext.realTotalAmount / arrnext.totalPrice).toFixed(2)) ;
            //     // 计算扣减金额
            //     arrnext.reduceAccountAmount =Number((arrnext.refundAmount * arrnext.totalPrice / arrnext.realTotalAmount).toFixed(2));
            //     // 退费金额不能大于 实际的钱
            //     if(arrnext.refundAmount > tempAmount){
            //         $scope.legalFlag = true;
            //         SweetAlert.swal("退费金额不能大于实际交费可排金额");
            //         arrnext.refundAmount=0;
            //         arrnext.reduceAccountAmount=0;
            //         return false;
            //     }
            //     if(arrnext.refundAmount <= 0){
            //         $scope.legalFlag = true;
            //         SweetAlert.swal("退费金额要大于0");
            //         arrnext.refundAmount=0;
            //         arrnext.reduceAccountAmount=0;
            //         return false;
            //     }
            //     // 标识是否是全部退费
            //     if(arrnext.refundAmount == tempAmount){
            //         arrnext.partialRefundFlag = 1;
            //     }else{
            //         arrnext.partialRefundFlag = 0;
            //     }
            // }


            if(!arrnext.allreturncheck) {
                if (arrnext.orderRefundCategory == 3) {
                   $scope.legalFlag = false;
                    // 判断充值订单的退费金额    和  可排金额 * 折扣率
                    var tempAmount = Number((arrnext.avaliableAmount * arrnext.realTotalAmount / arrnext.totalPrice).toFixed(2)) ;
                    // 计算扣减金额
                    arrnext.reduceAccountAmount =Number((arrnext.refundAmount * arrnext.totalPrice / arrnext.realTotalAmount).toFixed(2));
                    // 退费金额不能大于 实际的钱
                    if(arrnext.refundAmount > tempAmount){
                        $scope.legalFlag = true;
                        SweetAlert.swal("退费金额不能大于实际交费可排金额");
                        arrnext.refundAmount=0;
                        arrnext.reduceAccountAmount=0;
                        return false;
                    }
                    if(arrnext.refundAmount == tempAmount){
                        SweetAlert.swal({
                                title: "确认全部退费?",
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "确认",
                                cancelButtonText: "取消",
                                closeOnConfirm: false,
                                closeOnCancel: false
                            },
                            function(isConfirm){
                                if (isConfirm) {
                                    arrnext.allreturncheck=true;
                                    $scope.allreturncheck(arrnext);
                                    swal("全部退费按钮被选中");
                                }else {
                                    if(arrnext.orderRefundCategory ==1 ) {
                                        arrnext.refundCourseNum = 0;
                                        arrnext.refundAmount = 0;
                                        arrnext.reduceAccountAmount = 0;
                                        arrnext.reduceCourseNum = 0;
                                        for (var i = 0; i < arrnext.orderCourses.length; i++) {
                                            arrnext.orderCourses[i].refundCourseNum = 0;
                                            arrnext.orderCourses[i].refundCourseAmout = 0;
                                        }
                                        $scope.legalFlag = true;
                                    }else{
                                        arrnext.refundAmount = 0;
                                        arrnext.reduceAccountAmount = 0;
                                        $scope.legalFlag = true;
                                    }
                                    swal("没有选择全部退费");
                                }
                            })
                    }
                    if(arrnext.refundAmount <= 0){
                        $scope.legalFlag = true;
                        SweetAlert.swal("退费金额要大于0");
                        arrnext.refundAmount=0;
                        arrnext.reduceAccountAmount=0;
                        return false;
                    }

                }else{
                    var refundAmountTemp = 0;
                    var refundCourseTemp = 0;
                    for (var j = 0, len1 = arrnext.orderCourses.length; j < len1; j++) {
                        if (arrnext.orderCourses[j].refundCourseAmout == undefined) {
                            arrnext.orderCourses[j].refundCourseAmout = 0;
                        }
                        if (arrnext.orderCourses[j].refundCourseNum == undefined) {
                            arrnext.orderCourses[j].refundCourseNum = 0;
                        }

                        if( arrnext.orderCourses[j].courseBuyUnit==3){
                            arrnext.orderCourses[j].refundCourseAmout=arrnext.orderCourses[j].refundCourseNum*(arrnext.orderCourses[j].actual_price/arrnext.orderCourses[j].regularTimes);
                        }else{
                            arrnext.orderCourses[j].refundCourseAmout= arrnext.orderCourses[j].refundCourseNum* arrnext.orderCourses[j].actual_price
                        }
                        refundAmountTemp = refundAmountTemp + arrnext.orderCourses[j].refundCourseAmout;
                    }
                    // 扣减总课时
                    if(arrnext.refundAmount>refundAmountTemp*arrnext.privilegeRatio/100){
                        SweetAlert.swal("退费金额不能大于扣减金额");
                        arrnext.refundAmount=refundAmountTemp*arrnext.privilegeRatio/100;
                        // arrnext.allreturncheck=true;
                        // $scope.allreturncheck(arrnext);
                        $scope.legalFlag = true;
                    }



                }


            }//这里是判断数否全部选中结束
            else{
                if(arrnext.orderRefundCategory == 3){
                    if(arrnext.refundAmount>  arrnext.reduceAccountAmount){
                        SweetAlert.swal("退费金额不能大于实际交费可排金额");
                        arrnext.refundAmount=0;
                        $scope.legalFlag = true;
                    }
                    if(arrnext.refundAmount>0){
                        $scope.legalFlag=false;
                    }
                }

                if(arrnext.orderRefundCategory == 1){
                    if(arrnext.refundAmount==0){
                        $scope.legalFlag = true;
                    }else{
                        $scope.legalFlag = false;
                    }
                    if( arrnext.refundAmount>   arrnext.maxkeshijine){
                        SweetAlert.swal("不能超过最大剩余金额");
                        arrnext.refundAmount=0;
                        $scope.legalFlag = true;
                    }


                }


            }






















        }

        //全部退费
        $scope.allreturncheck=function allreturncheck(arrnext){
            //选中开始
            arrnext.okonclick=true;
            if(arrnext.allreturncheck){

                if(arrnext.orderRefundCategory ==1 ){
                    var refundAmountTemp = 0;
                    var refundCourseTemp = 0;
                    for (var j = 0, len1 = arrnext.orderCourses.length; j < len1; j++) {
                        if (arrnext.orderCourses[j].refundCourseAmout == undefined) {
                            arrnext.orderCourses[j].refundCourseAmout = 0;
                        }
                        if (arrnext.orderCourses[j].refundCourseNum == undefined) {
                            arrnext.orderCourses[j].refundCourseNum = 0;
                        }
                        arrnext.orderCourses[j].refundCourseNum = arrnext.orderCourses[j].course_num;
                        if( arrnext.orderCourses[j].courseBuyUnit==3){
                            arrnext.orderCourses[j].refundCourseAmout=arrnext.orderCourses[j].course_num*arrnext.orderCourses[j].actual_price/arrnext.orderCourses[j].original_num
                        }else{
                            arrnext.orderCourses[j].refundCourseAmout=arrnext.orderCourses[j].course_num* arrnext.orderCourses[j].actual_price
                        }
                        refundAmountTemp = refundAmountTemp + arrnext.orderCourses[j].refundCourseAmout;
                        refundCourseTemp = refundCourseTemp + arrnext.orderCourses[j].refundCourseNum;
                    }
                    // 扣减总课时
                    arrnext.partialRefundFlag = 1;
                    arrnext.maxkeshijine=refundAmountTemp;
                    arrnext.reduceCourseNum = Number(refundCourseTemp);
                    arrnext.refundAmount = Number((refundAmountTemp * arrnext.privilegeRatio / 100).toFixed(2));
                }else if(arrnext.orderRefundCategory ==3){
                    // 计算扣减金额、退费金额 = 充值订单剩余金额
                    // 
                    // arrnext.refundAmount =arrnext.additionalAmount;
                    // arrnext.reduceAccountAmount= Number((arrnext.refundAmount / arrnext.realTotalAmount *  arrnext.totalPrice).toFixed(2)) ;
                    // arrnext.koujianzhongzhi= arrnext.reduceAccountAmount;

                    arrnext.reduceAccountAmount= arrnext.additionalAmount;
                    var tempAmount = Number(( arrnext.avaliableAmount *  arrnext.realTotalAmount /  arrnext.totalPrice).toFixed(2)) ;
                    arrnext.koujianzhongzhi= arrnext.reduceAccountAmount;
                    // 计算扣减金额
                    arrnext.refundAmount =Number(( arrnext.reduceAccountAmount / arrnext.totalPrice *  arrnext.realTotalAmount).toFixed(2));
                    arrnext.partialRefundFlag = 1;
                }
                $scope.legalFlag = false;
            }else{

                arrnext.partialRefundFlag = 0;
                arrnext.okonclick=false;

//点击不全部退费，恢复到原始版本
                if(arrnext.orderRefundCategory ==1 ) {
                    arrnext.refundCourseNum = 0;
                    arrnext.refundAmount = 0;
                    arrnext.reduceAccountAmount = 0;
                    arrnext.reduceCourseNum = 0;
                    for (var i = 0; i < arrnext.orderCourses.length; i++) {
                        arrnext.orderCourses[i].refundCourseNum = 0;
                        arrnext.orderCourses[i].refundCourseAmout = 0;
                    }
                    $scope.legalFlag = true;
                }else{
                    arrnext.refundAmount = 0;
                    arrnext.reduceAccountAmount = 0;
                    $scope.legalFlag = true;
                }
            }



            //    选中结束

        }
        //全选回复只读的
                $scope.huifu=function huifu(){
                    $scope.okonclick=false;
                }
        //全部退费扣减充值的判定
        $scope.koujianchong=function koujianchong(arrnext){
            if(arrnext.reduceAccountAmount>  arrnext.additionalAmount){
                SweetAlert.swal("扣减充值不能超过最大值");
                arrnext.reduceAccountAmount= 0;
            }

            if(arrnext.reduceAccountAmount >=  arrnext.additionalAmount) {
                SweetAlert.swal({
                        title: "确认全部退费?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确认",
                        cancelButtonText: "取消",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    },
                    function(isConfirm){
                        if (isConfirm) {
                            arrnext.allreturncheck=true;
                            $scope.allreturncheck(arrnext);
                            swal("全部退费按钮被选中");
                        }else {
                            if(arrnext.orderRefundCategory ==1 ) {
                                arrnext.refundCourseNum = 0;
                                arrnext.refundAmount = 0;
                                arrnext.reduceAccountAmount = 0;
                                arrnext.reduceCourseNum = 0;
                                for (var i = 0; i < arrnext.orderCourses.length; i++) {
                                    arrnext.orderCourses[i].refundCourseNum = 0;
                                    arrnext.orderCourses[i].refundCourseAmout = 0;
                                }
                                $scope.legalFlag = true;
                            }else{
                                arrnext.refundAmount = 0;
                                arrnext.reduceAccountAmount = 0;
                                $scope.legalFlag = true;
                            }
                            swal("没有选择全部退费");
                        }
                    })

            }


            // if(arrnext.reduceAccountAmount> arrnext.koujianzhongzhi){
            //     SweetAlert.swal("扣减控制不能超过最大值");
            //     arrnext.reduceAccountAmount=arrnext.koujianzhongzhi;
            // }




        }

        /**
         * 确认退费
         * 没选择原因不让提交
         * 订单号  退费类型    退费原因--判断是类型9的话 得获得textarea里的值
         */

        $scope.refundConfirm = function refundConfirm(arrnext){
            // if (arrnext.refundReasonType == ""||arrnext.refundReason == null) {
            //     SweetAlert.swal("请选择退费原因");
            //     return false;
            // }
            OrderService.applyRefundBatch($scope.chongzhi).then(function (result) {
                SweetAlert.swal('操作成功');
                $scope.refreshCustomerOrderDetail();
                $scope.chongzhi=[];
                $scope.noclick=true;
            });
        }




        function auditOrder(obj) {
            /*obj.refundDate = new Date(obj.refundDate);*/

            $scope.order = angular.copy(obj);
            $scope.orderOther = angular.copy(obj);
            //退费余额和消耗余额维护在代码中--资料费880
            //消耗课时计算  充值类订单库里没有维护该字段
            if(obj.orderRefundCategory == 3){

            	CoursePlanService._detail($scope.order.orderChargingId).then(function(result){
            		var chargingScheme = eval(result.schemeJson);
            		for(var i=0;i<chargingScheme.length;i++){
            			if(chargingScheme[i].id==$scope.order.orderTeacherLevel){
            				var priceList = chargingScheme[i].prices;
            				for(var j=0;j<priceList.length;j++){
            					if(priceList[j].gradeId==$scope.order.gradeId){
            						var consumeTotal = $scope.order.totalPrice-$scope.order.additionalAmount;
        		                    var num = Math.floor(consumeTotal / priceList[j].price);
        		                    var cnx = consumeTotal % priceList[j].price;
            						if(cnx!=0){
            							//1小时课程
            							if($scope.order.orderRule==1){
                							consumeTotal / priceList[j].price> 0.5 ? num+1 : num+0.5;
                						}else{
            								num++;
                						}
        							}
            						$scope.order.rechargeConsumeNum = num ;
            						break;
            					}
            				}
            				break;
            			}
            		}
            	})
            }
            $scope.modalTitle = '审核';
            $scope.order.contractStartDate = new Date($scope.order.contractStartDate).Format("yyyy-MM-dd");
            if($scope.order.refundDate){//退费日期
                $scope.order.refundDate = new Date($scope.order.refundDate).Format("yyyy-MM-dd");
            }
            $scope.order.contractEndDate = new Date($scope.order.contractEndDate).Format("yyyy-MM-dd");
            $scope.order.refundDate = new Date().Format("yyyy-MM-dd");
            $scope.auditRefundModal = $modal({scope: $scope, templateUrl: 'partials/sos/refund/audit.html', show: true });
            $scope.getOrderCourses();
            $scope.getOrderPayments();


            /*if(obj.orderRefundCategory == 2){
                $scope.order = angular.copy(obj);
                $scope.modalTitle = '审核';
                $scope.order.contractStartDate = new Date($scope.order.contractStartDate).Format("yyyy-MM-dd");
                if($scope.order.refundDate){//退费日期
                    $scope.order.refundDate = new Date($scope.order.refundDate).Format("yyyy-MM-dd");
                }
                $scope.order.contractEndDate = new Date($scope.order.contractEndDate).Format("yyyy-MM-dd");
                $scope.order.refundDate = new Date().Format("yyyy-MM-dd");
                $scope.auditRefundModal = $modal({scope: $scope, templateUrl: 'partials/sos/refund/auditTopup.html', show: true });
                $scope.getOrderCourses();
                $scope.getOrderPayments();
            }*/


        }



        //获取订单下的全部课程列表信息
        $scope.callServerOrderCourse = function callServerOrderCourse(tableState) {
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            OrderService.getPageOfOrderCourse($scope.start, $scope.number,$scope.orderNo, tableState).then(function (result) {
                $scope.orderCourses = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.isLoading = false;
            });
        };

        //订单的课程信息列表
        $scope.getOrderCourses = function getOrderCourses() {
            OrderService.getOrderCourses($scope.start, $scope.number,$scope.order.orderNo,$scope.order.crmStudentId).then(function (result) {
                $scope.order.orderCourses = result.data;
                $scope.initData();
            });
        };

        $scope.getOrderCoursesUpdate = function getOrderCoursesUpdate() {
            OrderService.getOrderCourses($scope.start, $scope.number,$scope.order.orderNo,$scope.order.crmStudentId).then(function (result) {
                $scope.order.orderCourses = result.data;
                $scope.initData();
            });
        };

        //订单的缴费记录信息列表
        $scope.getOrderPayments = function getOrderPayments() {
            OrderService.getOrderPayments($scope.start, $scope.number,$scope.order.orderNo).then(function (result) {
                $scope.orderPayments = result.data;
            });
        };

        //获取课程类型 年级 科目 下拉菜单
        $scope.callServerOrderCourseSelect = function callServerOrderCourseSelect() {
            OrderService.getSubjectIdSelect().then(function (result) {
                $scope.subjectIds = result.data;
            });
            OrderService.getGradeIdSelect().then(function (result) {
                $scope.gradeIds = result.data;
            });
            OrderService.getCourseTypeIdSelect().then(function (result) {
                $scope.courseTypeIds = result.data;
            });
        };

        //刷新列表
        $scope.refreshTabs = function refreshTabs(){
            var tableState ={'pagination':{},'search':{'predicateObject':{}}};
            $scope.callServerOneTab(tableState);
        }

        /**
         * 判断是否为线上运营人员岗位
         */
        $scope.isO2OOperationSpecialist = function(){
            var isO2OOperationSpecialist = false;
              if(AuthenticationService.currentUser().position_id == Constants.PositionID.O2O_OPERATION_SPECIALIST){
                  isO2OOperationSpecialist = true;
              }
              return isO2OOperationSpecialist;
        }

        //普通订单
        $scope.callServerOneTab = function callServerOneTab(tableState) {
            $scope.isLoading = true;
            $scope.orderFlag = 1;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            OrderService.getApplyRefundPage($scope.start, $scope.number,$scope.orderFlag, tableState.search.predicateObject).then(function (result) {
                $scope.oneOrders = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.isLoading = false;
                /**
                 * 快捷方式进来
                 */
                if($routeParams.dateTime&&(Date.now()-$routeParams.dateTime<1000*60*5)&&!$scope.isGo) {
                    if ($routeParams.v3==1) {
                        $scope.isGo = true
                        if (!$scope.isO2OOperationSpecialist() && !$scope.studentModal) {
                            $scope.refundApply()
                        }
                    }
                }
            });
        };

        /*************************************	退费申请start	****************************************/
        /**
         * 学员列表弹框
         */
        $scope.refundApply = function(){
            $scope.refundAbleOrders = [];
            $scope.hasresult = false;
            $scope.nameOrphone = '';
        	$scope.selectedStudentId = null;
        	$scope.selectedStudentName = null;
        	$scope.chongzhi=[];
        	if($scope.chongzhi.length==0){
        	    $scope.noclick=true;
            }
        	$scope.studentModalTitle = "学员查询";
            $scope.studentModal = $modal({scope: $scope, templateUrl: 'partials/sos/refund/modal.student.html', show: true,backdrop:'static'});
        }

        /**
         * 学生客户列表
         */
        $scope.myCrmCustomerStudentFilter = {}; //学生客户过滤器
        $scope.MyCrmCustomerStudentList =  [];
        $scope.getMyCrmCustomerStudentList = function callServer(tableState) {
        	$scope.myCrmCustomerStudentListTableState = tableState;
        	$scope.isLoading = true;
        	var pagination = tableState.pagination;
        	var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
        	var number = pagination.number || 10;  // Number of entries showed per page.
        	CustomerStudentService.list(start, number, tableState,$scope.myCrmCustomerStudentFilter).then(function (result) {
        		$scope.MyCrmCustomerStudentList = result.data;
        		tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
        		$scope.isLoading = false;
        	});
        };
        $scope.hasresult = false;
        $scope.mohuSearch = function () {
            $scope.hasresult = true;
            clearTimeout(_mohuTime);
            $scope.chongzhi=[];
            if($scope.chongzhi.length==0){
                $scope.noclick=true;
            }
            var _mohuTime = setTimeout(function () {
                $scope.MyCrmCustomerStudentListByFilter();
            },400)
        }
        $scope.MyCrmCustomerStudentListByFilter = function(){
        	 /*$scope.myCrmCustomerStudentListTableState.pagination.start=0;*/

        	 if(!$scope.myCrmCustomerStudentListTableState) {
                 $scope.myCrmCustomerStudentListTableState = {
                     pagination: {
                         start: 0,
                         number: 0,
                     }
                 }
             }

             $scope.pagination = $scope.myCrmCustomerStudentListTableState.pagination;
             $scope.isLoading = true;
             var start = 0;
             var number = 99999;
             CustomerStudentService.list(start, number, $scope.myCrmCustomerStudentListTableState,$scope.myCrmCustomerStudentFilter).then(function (result) {
         		$scope.MyCrmCustomerStudentList = result.data;
         		$scope.myCrmCustomerStudentListTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
         		$scope.isLoading = false;
         	});
        }

        $scope.reset = function(){
            $scope.myCrmCustomerStudentFilter = {}; //学生客户过滤器
        }

        /**
         * 申请退费弹框
         */
        $scope.doRefundToSelectedStudent = function(data){
            $scope.hasresult = false;
            $scope.myCrmCustomerStudentFilter.nameOrPhone = data.name;
        	  $scope.selectedStudentId = data.crm_student_id;
            $scope.detail=data
            $scope.callServerNormalOrderTab();
        	// if($scope.selectedStudentId){
        	// 	$scope.refundApplyModalTitle = "退费申请";
             //    $scope.refundApplyModal = $modal({scope: $scope, templateUrl: 'partials/sos/refund/modal.refund.apply.html', show: true,backdrop:'static'});
        	// }
        	// else{
        	// 	SweetAlert.swal("请选中学生后再点击此按钮", '', 'warning');
        	// 	return false;
        	// }

        }

        /**
         * 加载可退费订单列表
         */
        $scope.callServerNormalOrderTab = function callServerNormalOrderTab(tableState) {
        	if($scope.selectedStudentId){
        		angular.forEach($scope.MyCrmCustomerStudentList, function(p, index){
        			if(p.crm_student_id == $scope.selectedStudentId){
        				$scope.selectedStudentName = p.name;
        				return;
        			}
        		});
        		$scope.orderFlag = 10;
        		if(tableState){
                    $scope.re_pagination = tableState.pagination;
                    $scope.start = $scope.re_pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    $scope.number = $scope.re_pagination.number || 10;  // Number of entries showed per page.
                }else{
                    $scope.start = 0;
                    $scope.number = 10;
                }
        		OrderService.getPage($scope.start, $scope.number,$scope.orderFlag, {'crmStudentId':$scope.selectedStudentId}).then(function (result) {
        			$scope.refundAbleOrders = result.data;
        			if(tableState){
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    }
        		});
        	}
        };

        /**
         * 对选中的订单记录，进行【申请退费】
         */
        $scope.refundOrder = {};
        $scope.doRefund = function(){
        	var isSelected = false;
        	angular.forEach($scope.refundAbleOrders, function(p, index){
        		if(p.selected != undefined && p.selected == true){
        			isSelected = true;
        			return;
        		}
        	});
        	if(isSelected == false){
        		 SweetAlert.swal('请选择要退费的订单，再点击【申请退费】按钮', '', 'warning');
        		 return false;
        	}

        	$scope.remark = false;
        	$scope.modalTitle = "退费原因";
        	$scope.orderNoList = [];
        	angular.forEach($scope.refundAbleOrders, function(p, index){
        		if(p.selected != undefined && p.selected == true){
        			$scope.orderNoList.push(p.orderNo);
        		}
        	});
        	console.info($scope.orderNoList);
        	$scope.modal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/customer/modal.returnFei.Reason.html',
                show: true
            });

        	/*SweetAlert.swal({
                title: "确定要对所选记录申请退费吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#fe9900',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: true
    		}, function(confirm) {
                if (confirm) {
                	var orderNoList = [];
                	angular.forEach($scope.refundAbleOrders, function(p, index){
                		if(p.selected != undefined && p.selected == true){
                			orderNoList.push(p.orderNo);
                		}
                	});
                	OrderService.applyRefundBatch(orderNoList).then(function (response) {
        				SweetAlert.swal(response.data);
        				$scope.refreshCustomerOrderDetail();
                    });
                }
            });*/
        }



        /**
         * 刷新退费申请列表
         */
        $scope.refreshCustomerOrderDetail = function refreshCustomerOrderDetail(){
            var tableState ={'pagination':{},'search':{'predicateObject':{}}};
            $scope.callServerNormalOrderTab(tableState);
            $scope.callServerOneTab(tableState);
        }
        /*************************************	退费申请end	****************************************/

        /**
         * 取消退费
         */
        $scope.cancleRefund = function(row){
        	SweetAlert.swal({
                title: "确定要撤销退费吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#fe9900',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: true
    		}, function(confirm) {
                if (confirm) {
                	OrderService.cancleRefund(row).then(function (response) {
                		if(response.status == "SUCCESS"){
                			successAlert("操作成功");
                		}
                		else{
                			warningAlert(response.data);
                		}
        				$scope.refreshCustomerOrderDetail();
                    });
                }
            });
        }
    }
]).controller('OrderRefundController', ['$scope', '$modal', '$rootScope', 'SweetAlert','OrderService',
    function($scope, $modal, $rootScope, SweetAlert,OrderService) {
        $scope.isOmsCourse = false;
        $scope.orderRefundTypeSelect = [{name:'现金',id:1},{name:'转账',id:2},{name:'支票',id:3}];
        $scope.order.originOrderNo=1;
        $scope.order.materialFee=880;
        /**
         * 退费审核
         */
        $scope.auditRefund = function auditRefund() {
            $scope.order.originOrderNo=$scope.order.orderNo;
            OrderService.getOrderPayments(0,1000,$scope.order.orderNo).then(function(result){
                if(result.data.length>0) {
                    var maxPayDate = result.data[0].payDate;
                    if (maxPayDate > new Date($scope.order.refundDate).getTime() ) {
                        SweetAlert.swal('退费日期小于上次交费日期，请重新输入！');
                        return;
                    }
                }
                if(new Date($scope.order.contractStartDate).getTime() > new Date($scope.order.refundDate).getTime()){
                    SweetAlert.swal('退费日期小于订单签约时间，请重新输入！');
                    return;
                }


                SweetAlert.swal({
                    title: "退费金额："+$scope.order.refundAmount+"元\n"+"退费日期："+$scope.order.refundDate +"\n是否确认退款通过？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: ' #fe9900',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        var promise = OrderService.auditRefund($scope.order.orderNo,$scope.order);
                        promise.then(function(result) {
                            //;
                            var data = result.data;
                            if(data.status == "SUCCESS"){
                                // 有排课记录
                                /*if(data.data == 'refundDateLessCourse'){
                                    SweetAlert.swal('退费日期小于最近一次上课日期，请重新输入');
                                    return;
                                }else if(data.data == "refundDateLessContract"){
                                    SweetAlert.swal('退费日期小于合同开始日期，请重新输入');
                                    return;
                                }else{
                                    SweetAlert.swal('操作成功');
                                    $scope.auditRefundModal.hide();
                                    $scope.refreshTabs();
                                }*/
                                SweetAlert.swal('操作成功');
                                $scope.auditRefundModal.hide();
                                $scope.refreshTabs();
                            }
                        }, function(error) {
                            // $scope.dataLoading = false;
                            SweetAlert.swal('操作失败');
                            $scope.auditRefundModal.hide();
                        });
                    }else{
                    }
                })

            })

        };

        $scope.showOmsCourse = function showOmsCourse() {
            $scope.isOmsCourse = true;
        };

        $scope.getOmsCoursePlanPage = function getOmsCoursePlanPage(tableState) {
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            OrderService.getOmsCoursePlanPage($scope.start, $scope.number,$scope.order.orderNo, tableState.search.predicateObject).then(function (result) {
                $scope.coursePlans = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.isLoading = false;
            });
        };


    }
]);
