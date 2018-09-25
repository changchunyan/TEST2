/**
 * The order service.
 * @author sunqc
 * @version 1.0
 */
angular.module('ywsApp').factory('OrderService', ['$http', '$q', 'config', 'SweetAlert', function ($http, $q, config, SweetAlert) {
    var service = {};
    service.excelPaymentList = excelPaymentList;
    service.getPaymentList = getPaymentList;
    service.list = list;
    service.listData = listData;
    service.add = add;
    service.addAndNewLead = addAndNewLead;
    service.checkPhone = checkPhone;
    service.edit = edit;
    service.batchUpdate = batchUpdate;
    service.editData = editData;
    service.charge = charge;
    service.getPage = getPage;
    service.getSuborders = getSuborders;
    service.getPageO2O = getPageO2O;
    service.getList = getList;
    service.getDataPage = getDataPage;
    service.getApplyRefundPage = getApplyRefundPage;
    service.getOmsCoursePlanPage = getOmsCoursePlanPage;
    service.applyRefund = applyRefund;
    service.applyRefundBatch = applyRefundBatch;
    service.auditRefund = auditRefund;
    service.getPageOfOrderCourse = getPageOfOrderCourse;
    service.getOrderCourses = getOrderCourses;
    service.getOrderPayments = getOrderPayments;
    service.getOrderServicePayment = getOrderServicePayment;
    service.getTeachingCourse = getTeachingCourse;
    service.getOrderCourse = getOrderCourse;
    service.getStudentAuditionTeachingList = getStudentAuditionTeachingList;
    service.getCourseTypeIdSelect = getCourseTypeIdSelect;
    service.getContractorPositionSelect = getContractorPositionSelect;
    service.getGradeIdSelect = getGradeIdSelect;
    service.getSubjectIdSelect = getSubjectIdSelect;
    service.updateStatus = updateStatus;
    service.getCustomerPaymentsPage = getCustomerPaymentsPage;
    service.getCustomerOrderTransferAvailables = getCustomerOrderTransferAvailables;
    service.getCustomerOrderRestitutionAvailables = getCustomerOrderRestitutionAvailables;
    service.getCustomerOrderTransferOrders = getCustomerOrderTransferOrders;
    service.getCustomerOrderRestitutionOrders = getCustomerOrderRestitutionOrders;
    service.orderNoExist = orderNoExist;
    service.listStudent = listStudent;
    service.getContractorPositionsSelect = getContractorPositionsSelect;
    service.getCustomerBelongersSelect = getCustomerBelongersSelect;
    service.getContractorsSelect = getContractorsSelect;
    service.deleteCoursePlanByOrderCourseId = deleteCoursePlanByOrderCourseId;

    service.addRestitution = addRestitution;
    service.editRestitution = editRestitution;
    service.editRestitutionBack = editRestitutionBack;

    service.addTopup = addTopup;
    service.editTopup = editTopup;
    service.chargeTopup = chargeTopup;
    service.updateStatusTopup = updateStatusTopup;

    service.getOrderCourseList = getOrderCourseList;

    service.cancleRefund = cancleRefund;
    service.getEmployeesByDepartPosition = getEmployeesByDepartPosition;// 获取某部门指定岗位的员工信息
    service.getOrderTransferInfo = getOrderTransferInfo;
    service.getOrderAchievementRatios = getOrderAchievementRatios;

    service.hasOmsCoursePlanByOrderNo = hasOmsCoursePlanByOrderNo;
    service.addPlatformRecord = addPlatformRecord;
    service.getCrmPlatformList = getCrmPlatformList;
    service.auditChangePlatform = auditChangePlatform;
    service.auditPlatformRecordTemp = auditPlatformRecordTemp;
    service.changePlatformBack = changePlatformBack;
    service.queryChangePlatform = queryChangePlatform;
    // 先收费功能
    service.saveOrderFirstCharge = saveOrderFirstCharge;
    service.editFirstChargeOrder = editFirstChargeOrder;
    // 模糊搜索
    service.vagueSearch = vagueSearch;
    service.recommendSearch = recommendSearch;
    service.getRecommendStudentByOrderId = getRecommendStudentByOrderId;
    service.lisitentlistStudent = lisitentlistStudent;
    // 订单结转
    service.createCarryForwardOrder = createCarryForwardOrder;
    service.carryForwardOrderRevoke = carryForwardOrderRevoke;
    service.carryForwardOrderBack = carryForwardOrderBack;
    service.detail = detail;
    service.editCarryOrder = editCarryOrder;
    service.carryOrderAudit = carryOrderAudit;
    //调取主从关系的 数据
    service.masterSlaveRelation = masterSlaveRelation;
    //撤销审核
    service.deleteauditRefund = deleteauditRefund;

    //拿服务器时间
    service.getServeDate = getServeDate;

    service.addBatch = addBatch;
    service.pdfUrl = pdfUrl;
    service.docxUrl = docxUrl;
    service.checkAllOrderStatus = checkAllOrderStatus;
    // 多订单在订单列表中展示订单的总数据
    service.getMoreDataByOrderId = getMoreDataByOrderId;

    function pdfUrl(orderNo) {
        return config.endpoints.sos.pdfUrl + '?orderNo=' + orderNo;
    }

    function docxUrl(orderNo) {
        return config.endpoints.sos.docxUrl + '?orderNo=' + orderNo;
    }

    function checkAllOrderStatus(orderNo) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.contract + '/check/order?orderNo=' + orderNo)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 查列表
     */
    function getCrmPlatformList(start, number, params, filter) {
        var deferred = $q.defer();
        if (!params.search.predicateObject) {
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        } else {
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        }
        filter.pageNum = params.search.predicateObject.pageNum;
        filter.pageSize = params.search.predicateObject.pageSize;
        $http.post(config.endpoints.sos.order + '/getCrmPlatformList', filter)
            .success(function (response, status, headers, config) {
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 插入一条转平台记录
     */
    function addPlatformRecord(platform) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + '/addPlatformRecord', platform)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 根据订单号判断是否有已消和已排
     */
    function hasOmsCoursePlanByOrderNo(orderNo) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/hasOmsCoursePlanByOrderNo?orderNo=' + orderNo)
            .success(function (response, status, headers, config) {
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 根据id撤销退费申请
     */
    function cancleRefund(row) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + '/cancleRefund', row)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response);
                }
            );
        return deferred.promise;
    }

    function addRestitution(obj) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + '/restitution', obj)
            .success(function (response, status, headers, config) {
                //console.log("Created order : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to create order : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function editRestitution(obj) {
        var deferred = $q.defer();
        $http.put(config.endpoints.sos.order + '/restitution', obj)
            .success(function (response, status, headers, config) {
                //console.log("Updated order : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to update order : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function editRestitutionBack(obj) {
        var deferred = $q.defer();
        $http.put(config.endpoints.sos.order + '/restitutionBack', obj)
            .success(function (response, status, headers, config) {
                //console.log("Updated order : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to update order : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }


    function deleteCoursePlanByOrderCourseId(id) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/deleteCoursePlanByOrderCourseId?id=' + id)
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: status
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to applyRefund : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }


    function getContractorsSelect(positionId) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common + '/contractors?positionId=' + positionId)
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 根据部门和岗位查询员工信息
     */
    function getEmployeesByDepartPosition(map) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.common + '/getDepartPositionEmployees', map)
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;

    }

    function getCustomerBelongersSelect(orderNo) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common + '/customerBelongers')
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function getContractorPositionsSelect() {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common + '/contractorPositions')
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }


    function getContractorPositionSelect(params) {
        if (!params) {
            params = {};
        }
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/teachingCourseType?params=' + JSON.stringify(params))
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function listStudent(start, number, params, filter) {
        var deferred = $q.defer();
        //console.dir(params.search.predicateObject);
        if (!params.search.predicateObject) {
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        } else {
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        }
        filter.pageNum = params.search.predicateObject.pageNum;
        filter.pageSize = params.search.predicateObject.pageSize
        $http.post(config.endpoints.sos.order + '/liststudent', filter).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
                console.log('Failed to get CustomerStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    // 试听排课模糊搜索查找学生列表函数
    function lisitentlistStudent(filter) {
        var deferred = $q.defer();
        filter.pageNum = 1;
        filter.pageSize = 20;
        $http.post(config.endpoints.sos.order + '/liststudent', filter).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
                console.log('Failed to get CustomerStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    // 模糊搜索
    function vagueSearch(filter) {
        var deferred = $q.defer();
        filter.pageNum = 1;
        filter.pageSize = 20;
        // delete filter.state
        $http.post(config.endpoints.sos.order + '/liststudent', filter).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list
            });
        }).error(function (response, status, headers, config) {
                console.log('Failed to get CustomerStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    // 查询推荐人列表
    function recommendSearch(name) {
        var deferred = $q.defer();
        // delete filter.state
        $http.post(config.endpoints.sos.getCustomerListByName, {
            name: name
        }).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data
            });
        }).error(function (response, status, headers, config) {
                console.log('Failed to get CustomerStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    // 查询推荐人
    function getRecommendStudentByOrderId(id) {
        var deferred = $q.defer();
        // delete filter.state
        $http.get(config.endpoints.sos.order + '/' + id + '/recommendStudentInfo').success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data
            });
        }).error(function (response, status, headers, config) {
                console.log('Failed to get CustomerStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 合同编号不存在
     * @param {*} orderNo
     */
    function orderNoExist(orderNo) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/exist/' + orderNo)
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * Gets the page of orders.
     * @return the promise
     */
    function getCustomerPaymentsPage(start, number, extParams) {
        //;
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/paymentCustomer/' + extParams + '?start=' + start + '&number=' + number)
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data.list,
                    numberOfPages: response.data.pages
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * Gets the page of orders.
     * @return the promise
     */
    function getDataPage(start, number, orderFlag, order) {
        if (!order) {
            order = {};
        }
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/listData?start=' + start + '&number=' + number + '&orderFlag=' + orderFlag + '&orderJson=' + JSON.stringify(order))
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: response.data.list,
                    numberOfPages: response.data.pages
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * Gets the page of orders.
     * @return the promise
     */
    function getPage(start, number, orderFlag, order) {
        if (!order) {
            order = {};
        }
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '?start=' + start + '&number=' + number + '&orderFlag=' + orderFlag + '&orderJson=' + JSON.stringify(order))
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: response.data.list,
                    numberOfPages: response.data.pages,
                    total: response.data.total
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 通过主合同id获取子订单列表
     * @param id
     * @returns {Promise}
     */
    function getSuborders(id) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.subOrders(id))
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function getPageO2O(start, number, crmStudentId) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/geto2olist' + '?start=' + start + '&number=' + number + '&crmStudentId=' + crmStudentId)
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                //deferred.resolve(response.data);
                deferred.resolve({
                    data: response.data.list,
                    numberOfPages: response.data.pages,
                    total: response.data.total
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function getList(start, number, orderFlag, order) {
        if (!order) {
            order = {};
        }
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '?start=' + start + '&number=' + number + '&orderFlag=' + orderFlag + '&orderJson=' + JSON.stringify(order))
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response);
                }
            );
        return deferred.promise;
    }

    function getApplyRefundPage(start, number, orderFlag, order) {
        if (!order) {
            order = {};
        }
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/listApplyRefund?start=' + start + '&number=' + number + '&params=' + JSON.stringify(order))
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: response.data.list,
                    numberOfPages: response.data.pages
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function applyRefund(refundOrder) {
        var deferred = $q.defer();
        $http.put(config.endpoints.sos.order + '/applyRefund', refundOrder)
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: status
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to applyRefund : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function applyRefundBatch(refundOrderList) {
        var deferred = $q.defer();
        $http.put(config.endpoints.sos.order + '/applyRefundBatch', refundOrderList)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to applyRefundBatch : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function getOmsCoursePlanPage(start, number, orderNo, order) {
        if (!order) {
            order = {};
        }
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/getOmsCoursePlanPage/' + orderNo + '?start=' + start + '&number=' + number + '&params=' + JSON.stringify(order))
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: response.data.list,
                    numberOfPages: response.data.pages
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function auditRefund(orderNo, order) {
        if (!order) {
            order = {};
        }
        var deferred = $q.defer();
        $http.put(config.endpoints.sos.order + '/auditRefund/' + orderNo, order)
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: response
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    //推销审核
    function deleteauditRefund(order) {
        var deferred = $q.defer();
        $http.put(config.endpoints.sos.order + '/repealRefundAudit/', order)
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: response
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 获取leads可以转课的订单
     * @return the promise
     */
    function getCustomerOrderTransferOrders(params) {
        // ;
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/transferOrders/' + params)
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 获取leads可以转课的订单
     * @return the promise
     */
    function getCustomerOrderRestitutionOrders(params) {
        // ;
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/restitutionOrders/' + params)
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 获取leads可以赠课的订单
     * @return the promise
     */
    function getCustomerOrderRestitutionAvailables(params) {
        // ;
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/restitutionAvailable/' + params)
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 获取leads可以转课的订单
     * @return the promise
     */
    function getCustomerOrderTransferAvailables(params) {
        // ;
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/transferAvailable/' + params)
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 根据订单号获取该订单所有课程列表
     * @return the promise
     */
    function getOrderCourses(start, number, orderNo, crmStudentId) {
        // ;
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.orderCourse + '/' + orderNo + '?start=' + start + '&number=' + number + '&crmStudentId=' + crmStudentId)
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 获取订单的业绩分配比例信息
     */
    function getOrderAchievementRatios(orderId, relationType) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + "/getOrderachievementRatio?orderId=" + orderId + "&relationType=" + relationType)
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 根据订单号获取该订单所有缴费记录
     * @return the promise
     */
    function getOrderPayments(start, number, orderNo) {
        // ;
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.orderPayment + '/' + orderNo + '?start=' + start + '&number=' + number)
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 根据订单号获取该订单所有缴费记录
     * @return the promise
     */
    function getOrderServicePayment(orderNo) {
        // ;
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.orderPayment + '/' + orderNo + '?serviceType=1')
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 根据订单号获取该订单所有缴费记录
     * @return the promise
     */

    /* function getOrderPayments(start, number, orderNo) {
         // ;
         var deferred = $q.defer();
         $http.get(config.endpoints.sos.refund + '/' + orderNo + '/orderAmount?start=' + start + '&number=' + number)
             .success(function (response, status, headers, config) {
                 debugger
                 //console.log("orders : " + JSON.stringify(response));
                 deferred.resolve({
                     data: response.data
                 });
             })
             .error(function (response, status, headers, config) {
                     //console.log('Failed to get orders : ' + JSON.stringify(response));
                     deferred.reject(response.error);
                 }
             );
         return deferred.promise;
     }*/

    /**
     * 根据条件获取该订单所有缴费记录
     * @return the promise
     */
    function getPaymentList(start, number, params, filter) {
        var deferred = $q.defer();
        if (!params.search.predicateObject) {
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        } else {
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        }
        filter.pageNum = params.search.predicateObject.pageNum;
        filter.pageSize = params.search.predicateObject.pageSize;
        $http.post(config.endpoints.sos.order + '/getPaymentList', filter).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
                console.log('Failed to get CustomerStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function excelPaymentList(filter) {
        filter.pageNum = null;
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + '/getPaymentList', filter).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
                console.log('Failed to get CustomerStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 获取课程类型下拉菜单
     * @return the promise
     */
    function getSubjectIdSelect() {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/teachingSubject')
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function getGradeIdSelect(params) {
        if (!params) {
            params = {};
        }
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/teachingGrade?params=' + JSON.stringify(params))
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function getCourseTypeIdSelect(params) {
        if (!params) {
            params = {};
        }
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/teachingCourseType?params=' + JSON.stringify(params))
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }


    /**
     * 根据课程类型 年级 产品科目 获取该课程产品的详细信息
     * @return the promise
     */
    function getStudentAuditionTeachingList(crmStudentId) {
        //alert('getStudentAuditionTeachingList');
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.studentAuditionTeachingList + '?crmStudentId=' + crmStudentId)
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 根据课程类型 年级 产品科目 获取该课程产品的详细信息
     * @return the promise
     */
    function getOrderCourse(productId, courseTypeId, gradeId, subjectId) {
        //;alert('getOrderCourse');
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.teachingCourse + '?gradeId=' + gradeId + '&subjectId=' + subjectId + '&courseTypeId=' + courseTypeId + '&productId=' + productId)
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 根据课程类型 年级 产品科目 获取该课程产品的详细信息
     * @return the promise
     */
    function getTeachingCourse(gradeId, subjectId, courseTypeId) {
        //;alert('getTeachingCourse');
        var deferred = $q.defer();
        //$http.get(config.endpoints.sos.teachingCourse)
        $http.get(config.endpoints.sos.teachingCourse + '?gradeId=' + gradeId + '&subjectId=' + subjectId + '&courseTypeId=' + courseTypeId)
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * Gets the page of orders.
     * @return the promise
     */
    function getPageOfOrderCourse(start, number, orderNo, params) {
        //;
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.orderCourse + '/' + orderNo + '?start=' + start + '&number=' + number)
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                //deferred.resolve(response.data);
                deferred.resolve({
                    data: response.data.list,
                    numberOfPages: response.data.pages
                });
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * Gets the list of orders.
     * @return the promise
     */
    function listData(organizationId, orderFlag) {
        //console.log('list');
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/listData?organizationId=' + organizationId + '&orderFlag=' + orderFlag)
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * Gets the list of orders.
     * @return the promise
     */
    function list(organizationId, orderFlag) {
        //console.log('list');
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '?organizationId=' + organizationId + '&orderFlag=' + orderFlag)
            .success(function (response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function addBatch(orders) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + '/batch', orders)
            .success(function (response, status, headers, config) {
                if (response.status === 'SUCCESS') {
                    deferred.resolve(response.data);
                } else {
                    debugger
                    deferred.reject(response.error);
                }
            })
            .error(function (response, status, headers, config) {
                deferred.reject(response.error);
            });
        return deferred.promise;
    }

    /**
     * Adds order as root.
     * @param root the root node
     * @return the promise
     */
    function add(obj) {
        if (!obj.crmStudentId) {
            SweetAlert.swal({
                title: "请选择学生！",
                type: "warning",
                showCancelButton: false,
                confirmButtonText: '确定',
                closeOnConfirm: true
            })
            return false;
        }
        var deferred = $q.defer();
        var param = angular.copy(obj)
        // if(param.contractEndDate.indexOf('-')&&param.contractEndDate.length===10){
        //     param.contractEndDate = new Date(param.contractEndDate+' 00:00:00')
        //     param.contractStartDate = new Date(param.contractStartDate+' 00:00:00')
        // }
        $http.post(config.endpoints.sos.order, param)
            .success(function (response, status, headers, config) {
                //console.log("Created order : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to create order : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function addTopup(obj) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + '/topup', obj)
            .success(function (response, status, headers, config) {
                //console.log("Created order : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to create order : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function addAndNewLead(obj) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + "/addwithlead", obj)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response);
                }
            );
        return deferred.promise;
    }

    function checkPhone(phone) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + "/checkphone?phone=" + phone)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response);
                }
            );
        return deferred.promise;
    }

    /**
     * Edits order.
     * @param order the order
     * @return the promise
     */
    function updateStatus(order, orderStatus, refundAmount, ext) {
        var deferred = $q.defer();
        var orderFilter = {
            "id": order.id,
            "nakedContract": order.nakedContract,
            "orderNo": order.orderNo,
            "orderStatus": orderStatus,
            "refundAmount": refundAmount,
            "ext": ext
        }
        $http.put(config.endpoints.sos.order + '/status/' + order.orderNo, orderFilter)
            .success(function (response, status, headers, config) {
                //console.log("Updated order : " + JSON.stringify(response));
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to update order : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * Edits order.
     * @param order the order
     * @return the promise
     */
    function updateStatusTopup(order, orderStatus, refundAmount, ext) {
        var deferred = $q.defer();
        var orderFilter = {
            "id": order.id,
            "nakedContract": order.nakedContract,
            "orderNo": order.orderNo,
            "orderStatus": orderStatus,
            "refundAmount": refundAmount,
            "ext": ext
        }
        $http.put(config.endpoints.sos.order + '/status/topup/' + order.orderNo, orderFilter)
            .success(function (response, status, headers, config) {
                //console.log("Updated order : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to update order : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * charge order.
     * @param charge the order
     * @return the promise
     */
    function charge(obj) {
        var deferred = $q.defer();
        $http.put(config.endpoints.sos.order + '/charge', obj)
            .success(function (response, status, headers, config) {
                //console.log("Updated order : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to update order : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * charge order.
     * @param charge the order
     * @return the promise
     */
    function chargeTopup(obj) {
        var deferred = $q.defer();
        $http.put(config.endpoints.sos.order + '/charge/topup', obj)
            .success(function (response, status, headers, config) {
                //console.log("Updated order : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to update order : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * Edits order.
     * @param order the order
     * @return the promise
     */
    function editData(obj, orderCourseArray) {
        // 将要修改的订单子表id赋值到ext扩展字段中
        obj.ext = orderCourseArray.toString();
        var deferred = $q.defer();
        $http.put(config.endpoints.sos.order + '/data/' + obj.orderNo, obj)
            .success(function (response, status, headers, config) {
                //console.log("Updated order : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to update order : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;

        /*var deferred = $q.defer();
        $http.put(config.endpoints.sos.order + '/data/' + obj.orderNo, obj)
            .success(function(response, status, headers, config) {
                //console.log("Updated order : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to update order : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;*/
    }

    /**
     * Edits order.
     * @param order the order
     * @return the promise
     */
    function edit(obj) {
        var deferred = $q.defer();
        $http.put(config.endpoints.sos.order + '/' + obj.id, obj)
            .success(function (response, status, headers, config) {
                //console.log("Updated order : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                    //console.log('Failed to update order : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * Edits order.
     * @param order the order
     * @return the promise
     */
    function batchUpdate(arr) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.batchUpdate, arr)
            .success(function (response, status, headers, config) {
                //console.log("Updated order : " + JSON.stringify(response));
                if (response.status === 'SUCCESS') {
                    deferred.resolve(response.data);
                } else {
                    deferred.reject(response.error);
                }
            })
            .error(function (response, status, headers, config) {
                //console.log('Failed to update order : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }).catch(function (reason) {
        });
        return deferred.promise;
    }

    /**
     * Edits order.
     * @param order the order
     * @return the promise
     */
    function editTopup(obj) {
        var deferred = $q.defer();
        $http.put(config.endpoints.sos.order + '/topup/' + obj.id, obj)
            .success(function (response, status, headers, config) {
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                deferred.reject(response.error);
            });
        return deferred.promise;
    }

    /**
     * 获取订单课程集合
     */
    function getOrderCourseList(map) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + '/getOrderCourseList', map)
            .success(function (response, status, headers, config) {
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 获取单个订单的转课的信息
     */
    function getOrderTransferInfo(map) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + '/getOrderTransferInfo', map)
            .success(function (response, status, headers, config) {
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 审核通过-转平台（最终审核通过）
     */
    function auditChangePlatform(map) {
        var deferred = $q.defer();
        $http.put(config.endpoints.sos.order + '/auditPlatformRecord/' + map.id, map)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 审核通过-转平台=转出审核
     */
    function auditPlatformRecordTemp(map) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + '/auditPlatformRecordTemp', map)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 撤销转平台
     */
    function changePlatformBack(map) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + '/revokePlatformRecord', map)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function queryChangePlatform(map) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + '/queryChangePlatform', map)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function saveOrderFirstCharge(order) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + "/addOrderFirstCharge", order)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response);
                }
            );
        return deferred.promise;
    }

    function editFirstChargeOrder(order) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + "/editFirstChargeOrder", order)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response);
                }
            );
        return deferred.promise;
    }

    /**
     * 创建结转订单
     */
    function createCarryForwardOrder(order) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + "/carryForwardOrder", order)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response);
                }
            );
        return deferred.promise;
    }

    /**
     * 撤销结转
     */
    function carryForwardOrderRevoke(order) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + "/carryForwardOrderRevoke", order)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response);
                }
            );
        return deferred.promise;
    }

    /**
     * 结转退单
     */
    function carryForwardOrderBack(order) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + "/carryForwardOrderBack", order)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response);
                }
            );
        return deferred.promise;
    }

    /**
     * 获取单条订单
     */
    function detail(order) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + "/detail", order)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response);
                }
            );
        return deferred.promise;
    }

    /**
     * 结转订单-转入
     */
    function editCarryOrder(order) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + '/carryOrderUpdate', order)
            .success(function (response, status, headers, config) {
                if (response.status == 'FAILURE') {
                    deferred.reject(response.error);
                } else {
                    deferred.resolve(response.data);
                }
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 结转记录-审核
     */
    function carryOrderAudit(order) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order + '/carryOrderAudit', order)
            .success(function (response, status, headers, config) {
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    //主从关系
    function masterSlaveRelation(order) {
        var deferred = $q.defer();
        $http.get(config.endpoints.hr.ddictionary + '/OrderMasterSlaveRelation', order)
            .success(function (response, status, headers, config) {
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }


    function getServeDate(order) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/getOrderSignTime')
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function getMoreDataByOrderId(id) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/' + id + '/classAndAmountInfos')
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    return service;
}]);