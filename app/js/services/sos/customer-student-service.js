'use strict';


/**
 * 学生客户service
 * @author zhangyf@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').factory('CustomerStudentService',  ['$http', '$q', 'config','$filter', '$timeout','$rootScope',function($http, $q, config, $filter, $timeout,$rootScope) {

    var service = {};
    service.list = list;
    service.simpleList=simpleList;
    service.getCustomerAmountInfos=getCustomerAmountInfos;
    service.warningList=warningList;
    service.create = create;
    service.update = update;
    service.remove = remove;
    service.detail = detail;
    service.saveAllot = saveAllot;
    service.exchangeBalance = exchangeBalance;
    service.getExchangeBalancePage = getExchangeBalancePage;
    service.updateCustomerExceptionStatus = updateCustomerExceptionStatus;
    service.dataCount = dataCount;
    service.confirmShowLeftClassHour = confirmShowLeftClassHour;
    service.getStudentListForTeacher = getStudentListForTeacher;
    service.savePack = savePack;
    service.uploadFile = uploadFile;
    service.getPackByFilter = getPackByFilter;
    service.getOne2OneCoursePlans = getOne2OneCoursePlans;

    /**
     * 已存在资料包列表
     */
    function getPackByFilter(start, number,params, filter) {
        var deferred = $q.defer();
        if(!params.search){
            params.search = {};
        }
        if(!params.search.predicateObject){
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }else{
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }
        filter.pageNum = params.search.predicateObject.pageNum;
        filter.pageSize = params.search.predicateObject.pageSize;
        $http.post(config.endpoints.sos.CustomerStudent+'/getPackByFilter',filter).success(function(response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function(response, status, headers, config) {
                console.log('Failed to get CustomerStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }
    
    /**
     * 上传文件
     */
    function uploadFile(data, name, uploadFileName){
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.CustomerStudent + "/uploadFile", name + "/r/n" + uploadFileName + "/r/n" + data)
            .success(function(response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function(response, status, headers, config) {
                deferred.reject(response);
            }
        );
        return deferred.promise;
    } 
    /**
     * 保存课前预习资料
     */
    function savePack(pack){
    	var deferred = $q.defer();
    	$http.post(config.endpoints.sos.CustomerStudent+'/savePack',pack)
    		.success(function(response, status, headers, config) {
    			deferred.resolve(response);
    		})
    		.error(function(response, status, headers, config) {
                deferred.reject(response);
            }
        );
        return deferred.promise;
    }
    
    /**
     * 确认显示剩余课时
     */
    function confirmShowLeftClassHour(studentId){
    	var deferred = $q.defer();
    	$http.post(config.endpoints.sos.CustomerStudent+'/confirmShowLeftClassHour',studentId)
    		.success(function(response, status, headers, config) {
    			deferred.resolve(response);
    		})
    		.error(function(response, status, headers, config) {
                deferred.reject(response);
            }
        );
        return deferred.promise;
    }

    /**
     * 客户列表
     */
    function getStudentListForTeacher(start, number,params, filter) {
        var deferred = $q.defer();
        if(!params.search){
            params.search = {};
        }
        if(!params.search.predicateObject){
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }else{
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }
        filter.pageNum = params.search.predicateObject.pageNum;
        filter.pageSize = params.search.predicateObject.pageSize
        $http.post(config.endpoints.sos.CustomerStudent+'/getStudentListForTeacher',filter).success(function(response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function(response, status, headers, config) {
                console.log('Failed to get CustomerStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }
    
    /**
     * 客户列表
     */
    function list(start, number, params,filter) {
        var deferred = $q.defer();
        //console.dir(params.search.predicateObject);
        if(!params.search){
            params.search = {};
        }
        if(!params.search.predicateObject){
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }else{
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }
        filter.pageNum = params.search.predicateObject.pageNum;
        filter.pageSize = params.search.predicateObject.pageSize
        $http.post(config.endpoints.sos.CustomerStudent+'/list',filter).success(function(response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function(response, status, headers, config) {
                console.log('Failed to get CustomerStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }
    /**
     * 客户列表
     */
    function simpleList(start, number, params,filter) {
        var deferred = $q.defer();
        //console.dir(params.search.predicateObject);
        if(!params.search){
            params.search = {};
        }
        if(!params.search.predicateObject){
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }else{
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }
        filter.pageNum = params.search.predicateObject.pageNum;
        filter.pageSize = params.search.predicateObject.pageSize
        $http.post(config.endpoints.sos.CustomerStudent+'/simple',filter).success(function(response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function(response, status, headers, config) {
                console.log('Failed to get CustomerStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 客户列表
     */
    function getCustomerAmountInfos(crmStudentIds) {
        var deferred = $q.defer();

        $http.post(config.endpoints.sos.CustomerStudent+'/amountInfos',crmStudentIds).success(function(response, status, headers, config) {
            deferred.resolve({
                data: response.data
            });
        }).error(function(response, status, headers, config) {
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }
    /**
     * 课时预警客户列表
     */
    function warningList(start, number, params,filter) {
        var deferred = $q.defer();
        //console.dir(params.search.predicateObject);
        if(!params.search){
            params.search = {};
        }
        if(!params.search.predicateObject){
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }else{
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }
        filter.pageNum = params.search.predicateObject.pageNum;
        filter.pageSize = params.search.predicateObject.pageSize
        $http.post(config.endpoints.sos.CustomerStudent+'/warningList',filter).success(function(response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function(response, status, headers, config) {
                console.log('Failed to get Warning CustomerStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function updateCustomerExceptionStatus(id,customerExceptionStatus) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.CustomerStudent+'/updatecustomerexceptionstatus?id=' + id + "&customerExceptionStatus=" + customerExceptionStatus).success(function(response, status, headers, config) {
            deferred.resolve(response);
        })
          .error(function(response, status, headers, config) {
              deferred.reject(response);
          }
        );
        return deferred.promise;
    }

    /**
     * 创建客户
     */
    function create(CrmCustomerStudentVo) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.CustomerStudent+'/create', CrmCustomerStudentVo).success(function(response, status, headers, config) {
            //console.log("Created : " + JSON.stringify(response));
            deferred.resolve(response.data);
        })
            .error(function(response, status, headers, config) {
                console.log('Failed to create CustomerStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 更新客户
     */
    function update(CustomerStudent) {
        var deferred = $q.defer();
        //console.log(CustomerStudent);
        $http.post(config.endpoints.sos.CustomerStudent + '/update', CustomerStudent).success(function(response, status, headers, config) {
            //console.log("Updated : " + JSON.stringify(response));
            deferred.resolve(response);
        })
        .error(function(response, status, headers, config) {
                console.log('Failed to update CustomerStudent : ' + JSON.stringify(response));
                deferred.reject(response.update);
            }
        );
        return deferred.promise;
    }


    /**
     * 删除客户
     * @param CustomerStudent
     * @returns {*}
     */
    function remove(CustomerStudent) {
        var deferred = $q.defer();
        $http.delete(config.endpoints.sos.CustomerStudent + '/delete/' + CustomerStudent.crm_student_id).success(function(response, status, headers, config) {
            //console.log("Deleted : " + JSON.stringify(response));
            deferred.resolve(response.data);
        })
            .error(function(response, status, headers, config) {
                console.log('Failed to delete CustomerStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 查询客户详情
     * @param CustomerStudent
     */
    function detail(CustomerStudent){
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.CustomerStudent + '/detail/' + CustomerStudent.crm_student_id)
            .success(function(response, status, headers, config){
                //console.log("Detail : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config){
                console.log('Failed to get Detail : ' + JSON.stringify(response));
                deferred.reject(response.error);
            })
        return deferred.promise;
    }

    /**
     * 保存学生客户分配息息
     */
    function saveAllot(AllotCrmCustomerStudentVo) {
        //console.dir(AllotCrmCustomerStudentVo);
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.CustomerStudent+'/saveAllot', AllotCrmCustomerStudentVo).success(function(response, status, headers, config) {
            //console.log("Created : " + JSON.stringify(response));
            deferred.resolve(response.data);
        })
            .error(function(response, status, headers, config) {
                console.log('Failed to create AllotCustomerStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }
    
    /**
     * 学员兑换余额
     */
    function exchangeBalance(map){
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.CustomerStudent+'/exchangeBalance', map)
        	.success(function(response, status, headers, config) {
        		deferred.resolve(response.data);
        	})
            .error(function(response, status, headers, config) {
                console.log('Failed to exchange CustomerStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }
    
    /**
     * 获取兑换余额日志分页列表
     */
    function getExchangeBalancePage(model){
    	var deferred = $q.defer();
    	$http.post(config.endpoints.sos.CustomerStudent+'/getExchangeBalanceList', model)
	    	.success(function(response, status, headers, config) {
	    		deferred.resolve({
	                data: response.data.list,
	                numberOfPages: response.data.pages
	            });
	    	})
	        .error(function(response, status, headers, config) {
	            console.log('Failed to getExchangeBalanceList : ' + JSON.stringify(response));
	            deferred.reject(response.error);
	        }
	    );
    	return deferred.promise;
    }
    
    /**
     * 数说新图
     * type (1：查学员状态数 2：查学员年级数 3：查学员毕业年级数 4：学员订单和剩余课时数 5：剩余课时10小时30小时数 
     *              6:30天有消课的学生数 7：7天有消课的学生数 8：30天没有消课学生数 9：本月已消课学生数 10：没有续费和续费的学生数)
     */
    function dataCount(type,callBack){
    	// var deferred = $q.defer();
    	$http.post(config.endpoints.sos.CustomerStudent + '/dataCount?type=' + type)
    	.success(function(response, status, headers, config) {
            callBack(response)
    	})
    	.error(function(response, status, headers, config) {
    		console.log('Failed to dataCount : ' + JSON.stringify(response));
    	}
    	);
    }

    function getOne2OneCoursePlans(customerStudentId,type){
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.customerStudentCourse + '/getOne2OneCoursePlans?CustomerStudentId=' + customerStudentId + "&type=" + type)
            .success(function(response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function(response, status, headers, config) {

                }
            );
        return deferred.promise;
    }


    window.__CustomerStudentService = service
    return service;
}
]);
