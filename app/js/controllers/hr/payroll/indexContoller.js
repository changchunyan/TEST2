/**
 * Created by 李世明 on 2018/5/19.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:
 */
angular.module('ywsApp').controller('EmployeePayrollController', [
    '$scope', '$modal', '$rootScope', 'SweetAlert', "fileReader", "$routeParams", "$location", "FileUploader", "$base64", "localStorageService", "EmployeePayrollService",
    function ($scope, $modal, $rootScope, SweetAlert, fileReader, $routeParams, $location, FileUploader, $base64, localStorageService, EmployeePayrollService) {
        $scope.payrollItems = []
        var nowDate = new Date()
        $scope.params = {
            month: [nowDate.getFullYear(), (nowDate.getMonth() < 10 ? ('0' + nowDate.getMonth()) : nowDate.getMonth())].join('-')
        }
        $scope.downloadUrl = hr_server + 'salary/template/' + localStorageService.get('school_id') + '/user/' + localStorageService.get('userId')
        // 获取工资条列表
        $scope.findPayrollItems = function (tableState) {
            $scope.isLoading = true;
            if (!tableState) {
                tableState = {
                    pagination: {}
                }
            }
            $scope.tableState = tableState;
            $scope.pagination = tableState.pagination;
            if (!$scope.pagination) {
                $scope.pagination = {};
            }
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            EmployeePayrollService.findPayrollItems($scope.start, $scope.number).then(function (result) {
                if (result.data != null) {
                    // console.log(result.data);
                    $scope.payrollItems = result.data || [];
                } else {
                    $scope.payrollItems = [];
                }

                tableState.pagination = tableState.pagination || {}
                tableState.pagination.numberOfPages = result.numberOfPages;
                $scope.isLoading = false;
            });
        }
        // 下载工资条模板
        $scope.downloadTem = function () {
            // EmployeePayrollService.downloadTem().then(function (result) {
            //     var list = []
            //     var datas = result.data.data
            //     for (var i = 0, len = datas.length; i < len; i++) {
            //         var item = datas[i]
            //         list.push({
            //             position_name: item.position.name,
            //             user_name: item.user.name,
            //             account: item.user.account
            //         })
            //     }
            //     exportExcel(list)
            // })
            var params = localStorageService.get('userId') + localStorageService.get('school_id')
            EmployeePayrollService.download(params).then(function (result) {
                var a = document.createElement('a');
                a.download = '工资条导入模板.xlsx';
                a.href = result.data
                a.click()
            })
        }

        // 工资条总计
        $scope.totalPayroll = {}
        var totalPayrollKeys = ['basePay', 'performancePay', 'allowance', 'bonus', 'reissue', 'dayoff', 'fineLate', 'penalty', 'findSuit', 'insurance', 'housingFund', 'insuranceFundSum', 'grossPay', 'finalPay', 'tax']

        function exportExcel(list) {
            var titleName = '工资条导入模板'
            var summaryExportTableStyle = {
                sheetid: titleName,
                headers: true,
                caption: {title: titleName + ' \t\t *岗位、姓名、系统账号不可更改  除备注外，其他列均为必填项，没有填0    ',},
                column: {style: 'font-size:14px; text-align:left;;height:30px;font-weight: normal;background:#DDD9C4;'},
                columns: [
                    {columnid: 'position_name', title: '岗位'},
                    {columnid: 'user_name', title: '姓名'},
                    {columnid: 'account', title: '系统账号'},
                    {columnid: 'base_pay', title: '固定工资'},
                    {columnid: 'performance_pay', title: '绩效工资'},
                    {columnid: 'allowance', title: '补贴'},
                    {columnid: 'bonus', title: '奖金及提成'},
                    {columnid: 'reissue', title: '补发'},
                    {columnid: 'dayoff', title: '请假/缺勤'},
                    {columnid: 'fine_late', title: '迟到/早退扣款'},
                    {columnid: 'penalty', title: '罚款'},
                    {columnid: 'find_suit', title: '工服'},
                    {columnid: 'insurance', title: '社保'},
                    {columnid: 'housing_fund', title: '公积金'},
                    {columnid: 'insurance_fund_sum', title: '社保公积金合计'},
                    {columnid: 'gross_pay', title: '应发工资'},
                    {columnid: 'final_pay', title: '个税'},
                    {columnid: 'tax', title: '实发工资'},
                    {columnid: 'remark', title: '备注'}
                ],
                row: {
                    style: function (sheet, row, rowidx) {
                        //'background:' + (rowidx % 2 ? '#E1FFFF' : '#F0E68C') +
                        return ';height:26px';
                    }
                },
                cells: {
                    style: 'font-size:13px; text-align:left;border:1px solid #888888;'
                }
            };
            alasql('SELECT * INTO XLS("' + titleName + '.xls", ?) FROM ?', [summaryExportTableStyle, list]);
        }

        // 查看工资表或者编辑
        $scope.payrollItemDetailList = []
        $scope.payrollId = $routeParams.id
        $scope.type = $routeParams.type
        $scope.typeText = $routeParams.type == 'update' ? '编辑' : '查看'
        // 创建月度工资表
        $scope.createMonthPayroll = function () {
            $scope.createMonthPayrollModal = $modal({
                scope: $scope,
                templateUrl: 'partials/hr/employee/payroll/create.html?v=' + Date.now(),
                show: true
            });
        }

        var payrollState = false

        // 检查是否发送
        function checkMonthId(id) {
            payrollState = false
            for (var i = 0, len = $scope.payrollItems.length; i < len; i++) {
                var detail = $scope.payrollItems[i]
                if (id == detail.month_id && detail.state) {
                    return '/detail'
                } else if (id == detail.month_id && !detail.state) {
                    payrollState = true
                }
            }
            return '/update'
        }

        function savePayrollMouth(id, route) {
            if (payrollState) {
                hideMonthPayrollModal()
                $location.path("/hr-admin/payroll/" + id + route)
            } else {
                EmployeePayrollService.savePayrollMouth(id).then(function (data) {
                    if (data.status = "SUCCESS") {
                        hideMonthPayrollModal()
                        $location.path("/hr-admin/payroll/" + id + route)
                    } else if (data.status = "FAILURE") {
                        SweetAlert.swal(data.data || data.error);
                    } else {
                        SweetAlert.swal('创建月度工资表失败，请重试');
                    }

                }).catch(function (reason) {
                    SweetAlert.swal('创建月度工资表失败，请重试');
                })
            }
        }

        function hideMonthPayrollModal() {
            if ($scope.createMonthPayrollModal) {
                $scope.createMonthPayrollModal.hide()
            }
        }

        // 保存月度工资表，并且去编辑
        $scope.saveMonthPayroll = function () {
            if ($scope.params.month) {
                var id = $scope.params.month.split('-').join('')
                var route = checkMonthId(id)
                if (route == '/update') {
                    // 保存数据
                    savePayrollMouth(id, route)
                } else {
                    hideMonthPayrollModal()
                    $location.path("/hr-admin/payroll/" + id + route)
                }
            } else {
                SweetAlert.swal("请选择发薪月度");
                return false
            }
            // 先保存创建的月度工资，然后再跳转路由
            // var id // 这个id是保存完创建的工资表之后后台返回的

        }
        // 跳转查看或者编辑列表
        $scope.detailMonthPayrollList = function (id, type) {
            $location.path("/hr-admin/payroll/" + id + "/" + (type || 'update'))
        }

        // 总计
        function setTotalPayroll() {
            $scope.totalPayroll = {}
            for (var i = 0, len = $scope.payrollItemDetailList.length; i < len; i++) {
                for (var keyi = 0, keylen = totalPayrollKeys.length; keyi < keylen; keyi++) {
                    var key = totalPayrollKeys[keyi]
                    var totalKey = key + 'Total'
                    if (key == 'housingFund') {
                    }
                    $scope.totalPayroll[totalKey] = ($scope.totalPayroll[totalKey] || 0) + ($scope.payrollItemDetailList[i][key] || 0)
                }
            }
            console.log($scope.totalPayroll)
        }

        $scope.findPayrollItemDetailList = function () {
            $scope.payrollItemDetailList = []
            var id = $scope.payrollId || $routeParams.id
            EmployeePayrollService.findPayrollItemDetailList(id).then(function (result) {
                if (result.data.status === "SUCCESS") {
                    $scope.payrollItemDetailList = result.data.data || []
                    validataIsNil()
                    setTimeout(function () {
                        $("[data-toggle='tooltip']").tooltip();
                    }, 1000);
                    setTotalPayroll()
                } else {
                    SweetAlert.swal(result.data.error || "获取数据失败");
                }

            }).catch(function (reason) {
                SweetAlert.swal(reason.error || '获取列表错误');
            })
        }
        // 获取我的工资条列表
        $scope.findMePayrollList = function () {
            $scope.payrollItemDetailList = []
            EmployeePayrollService.findMePayrollList().then(function (result) {
                if (result.data.status === "SUCCESS") {
                    $scope.payrollItemDetailList = result.data.data
                    validataIsNil()
                    setTimeout(function () {
                        $("[data-toggle='tooltip']").tooltip();
                    }, 1000);
                } else {
                    SweetAlert.swal(result.data.error || "获取数据失败");
                }

            }).catch(function (reason) {
                SweetAlert.swal(reason.error || '获取列表错误');
            })
        }
        $scope.findSchoolName = function(row) {
            EmployeePayrollService.findMeSchoolName(row.schoolId).then(function (result) {
                if (result.data.status === "SUCCESS") {
                    row.schoolName = result.data.data.name
                }

            })
        }
        // 编辑具体某位员工的工资条
        $scope.editPayrollByRow = function (row) {
            $scope.payrollEdit = angular.copy(row)
            $scope.editPayrollByRowModal = $modal({
                scope: $scope,
                templateUrl: 'partials/hr/employee/payroll/edit.payroll.html?v=' + Date.now(),
                show: true
            });
        }
        // 保存编辑后员工的工资单，然后刷新列表
        $scope.savePayrollByRow = function () {
            // 校验数据
            //
            // 成功之后调用后台保存
            EmployeePayrollService.savePayrollByRow($scope.payrollEdit).then(function (result) {
                if (result.more.status === "SUCCESS") {
                    SweetAlert.swal("修改成功");
                    $scope.editPayrollByRowModal.hide()
                    $scope.findPayrollItemDetailList()
                    // 验证是否可以发送工资条件
                    // validataIsNil()
                } else {
                    SweetAlert.swal(result.more.error || "修改失败");
                }

            }).catch(function (reason) {
                SweetAlert.swal(reason.error || "修改失败");
            })
        }

        // 发送工资条前提示
        $scope.sendPayrollConfirm = function () {
            $scope.sendPayrollConfirmModal = $modal({
                scope: $scope,
                templateUrl: 'partials/hr/employee/payroll/send.confirm.html?v=' + Date.now(),
                show: true
            });
        }

        // 发送工资条
        $scope.sendPayrollById = function () {
            // id 从路由获取 $scope.payrollId
            EmployeePayrollService.sendPayrollById($scope.payrollId).then(function (result) {
                if (result.more.status === "SUCCESS") {
                    SweetAlert.swal("发送成功");
                    // 成功之后
                    $scope.sendPayrollConfirmModal.hide()
                    setTimeout(function () {
                        $scope.historyBack()
                    }, 3000)
                } else {
                    SweetAlert.swal(result.more.error || "发送失败");
                }
            })
            // 这里执行发送ajax


        }
        var validataKeys = ['positionName', 'userName', 'account'].concat(totalPayrollKeys)

        // 发送前验证是否还有未填写的数据
        function validataIsNil() {
            if (!$scope.payrollItemDetailList.length) {
                $scope.canSend = true
                return
            }
            for (var i = 0, len = $scope.payrollItemDetailList.length; i < len; i++) {
                var item = $scope.payrollItemDetailList[i]
                for (var keyi = 0, keylen = validataKeys.length; keyi < keylen; keyi++) {
                    var key = validataKeys[keyi]
                    if (!item[key] && item[key] !== 0) {
                        $scope.canSend = true
                        return;
                    }
                }
            }
            $scope.canSend = false
        }

        validataIsNil()
        $scope.historyBack = function () {
            history.go(-1)
        }


        /*******************************************************Leads导入start*******************************************************/
        //导入  LiuHr
        $scope.checkSuccess = false;    //是否校验成功，控制‘校验’和‘确认导入’按钮的显示
        $scope.step = 1;    //初始化步骤
        $scope.percentage = 17; //初始化进度
        $scope.importComplete = false;
        $scope.importSuccess = false;
        //弹出导入框
        $scope.showUploadModal = function () {
            $scope.modalLeadingInTitle = '导入';
            $scope.modalForImport = $modal({
                scope: $scope,
                templateUrl: 'partials/hr/employee/payroll/modal.import.html',
                show: true
            });
            //监听模态框hide时，重置状态
            $scope.$watch("modalForImport.$isShown", function (old, newval) {
                if (old != newval) {
                    $scope.hideUploadModal();
                }
            })
        }
        //重置input type=file的样式，弹出选择文件
        $scope.chooseFile = function () {
            $("input[type=file]").trigger("click");
        };

        //上传导入信息,验证接口
        var uploader1 = $scope.uploader1 = new FileUploader({
            url: hr_server + 'salary/check',
            // url: hr_server + 'salary/' + $scope.payrollId,
            headers: {
                'Authorization': 'bearer ' + $base64.encode(localStorageService.get('user').account + ':' + localStorageService.get('token')),
            }
            // ,
            // queueLimit: 1
        });

        // FILTERS 只允许单个文件上传
        uploader1.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                if (this.queue.length >= 1) {
                    SweetAlert.swal("一次只能上传一个文件");
                }
                return this.queue.length < 1;

            }
        });

        // CALLBACKS
        uploader1.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        };

        //添加一个文件
        uploader1.onAfterAddingFile = function (fileItem) {
            //判断后缀
            //取到后缀
            var fileExtend = fileItem.file.name.substring(fileItem.file.name.lastIndexOf('.')).toLowerCase();
            //if(fileExtend != '.xls' && fileExtend != '.xlsx'){
            if (fileExtend != '.xlsx') {
                SweetAlert.swal('上传文档模板错误，请上传正确的《工资条导入模板》，将文件另存为.xlsx的文件格式再导入');
                fileItem.remove();
                //输入框文件名置空
                $scope.fileName = '';
                return false;
            } else if (fileItem.file.size / 1024 / 1024 > 2) {
                SweetAlert.swal('请选择文件大小小于2M的文件');
                return false;
            } else {
                //输入框显示文件名
                $scope.fileName = fileItem.file.name;
            }
        };

        //添加多个文件
        uploader1.onAfterAddingAll = function (addedFileItems) {
        };

        uploader1.onProgressItem = function (fileItem, progress) {
            $rootScope.ywsLoading = true;
        };

        $scope.payrollItemValidataSuccess = []

        uploader1.onCompleteItem = function (fileItem, response, status, headers) {
            //数据校验成功
            // console.log(response)
            //校验的状态值
            console.log(response)
            // 数据校验成功
            if (response.status === 'SUCCESS') {
                $scope.checkStatus = 200
                $scope.payrollItemValidataSuccess = response.data
            } else if (response.status === 'FAILURE') {
                $scope.checkStatus = 500
                if (response.data) {
                    $scope.checkStatusDescriptionList = response.data.split('&')
                    // 以下内容后台处理
                    // var len = $scope.checkStatusDescriptionList.length
                    // if (!$scope.checkStatusDescriptionList[len - 1]) {
                    //     $scope.checkStatusDescriptionList.splice(len - 1, 1)
                    // }
                } else {
                    $scope.checkStatusDescription = '校验excel中发生错误，系统没有返回错误信息';
                }
            } else {
                $scope.checkError = true;
                $scope.checkStatusDescription = '校验excel中发生错误，未收到响应结果';
            }
            /*
            if (response.data != null) {
                 debugger
                 $scope.checkStatus = response.data.checkStatus;
                 switch ($scope.checkStatus) {
                     case 1: //文档格式错误
                         //校验后状态的描述
                         $scope.checkStatusDescription = '上传文档模板错误，请上传正确的《意向客户导入模板》';
                         break;
                     case 2://文档内容为空
                         $scope.checkStatusDescription = '文档内容为空';
                         break;
                     case 3://文档超过5000条
                         $scope.checkStatusDescription = '文档过大，单次导入不能超过5000条';
                         break;
                     case 4: //总数和错误相等
                         //校验错误数
                         $scope.checkFormatErrorCount = response.data.formatErrorCount;
                         //校验总数
                         $scope.checkTotalCount = response.data.totalCount;
                         //变量绑定，用于导出错误信息
                         $scope.statisticsModelsAll = response.data.failList;
                         $scope.checkStatusDescription = null;
                         break;
                     case 5://校验excel发生错误
                         $scope.checkError = true;
                         $scope.checkStatusDescription = '校验excel中发生错误';
                         break;
                     case 6://校验成功，允许导入
                         //校验成功的列表
                         $scope.listStu = response.data.listStu;
                         //校验错误数
                         $scope.checkFormatErrorCount = response.data.formatErrorCount;
                         //校验总数
                         $scope.checkTotalCount = response.data.totalCount;
                         //变量绑定，用于导出错误信息
                         $scope.statisticsModelsAll = response.data.failList;
                         $scope.checkStatusDescription = '确定导入，错误信息不会导入系统';
                         break;
                     case 7:
                         $scope.checkError = true;
                         $scope.checkStatusDescription = '校验excel发生错误，未找到需要导入的信息';
                         break;
                     default:
                         $scope.checkError = true;
                         $scope.checkStatusDescription = '校验excel中发生错误,未收到响应码';
                         break;
                 }
             } else {
                 $scope.checkError = true;
                 $scope.checkStatusDescription = '校验excel中发生错误，未收到响应结果';
             }
             */

            $scope.checkSuccess = true;
            //设置步骤
            $scope.step = 2;
            //设置进度
            $scope.percentage = 75;
            $rootScope.ywsLoading = false;
        };


        //取消后清空文件列表
        $scope.hideUploadModal = function () {
            //清空文件列表
            uploader1.clearQueue();
            $scope.fileName = '';
            //设置步骤
            $scope.step = 1;
            //设置进度
            $scope.percentage = 25;
            //显示"校验"按钮
            $scope.checkSuccess = false;
            $scope.importComplete = false;
            //校验excel发生错误
            $scope.checkError = false;
            $scope.importSuccess = false;
        }
        //确认导入
        $scope.confirmImportFile = function () {
            EmployeePayrollService.uploadExcelDoc($scope.payrollId, $scope.payrollItemValidataSuccess).then(function (data) {
                //导入后清空文件列表
                uploader1.clearQueue();
                //导入完成，导入按钮禁用
                console.log(data)
                $scope.importComplete = true;
                $scope.importSuccess = true;
                if (data.more.status = "SUCCESS") {
                    $scope.findPayrollItemDetailList()
                    //设置步骤
                    $scope.step = 3;
                    //设置进度
                    $scope.percentage = 100;
                    $scope.importStatusDescription = '共' + $scope.payrollItemValidataSuccess.length + '条工资条，数据导入完毕'
                } else if (data.more.status = "FAILURE") {
                    $scope.importStatusDescription = data.more.data || data.more.error;
                } else {
                    $scope.importStatusDescription = '导入数据失败，请重新导入'
                }

                $rootScope.ywsLoading = false;
            }).catch(function (reason) {
                $scope.importStatusDescription = '网络请求异常'
            })
        }
    }
]);