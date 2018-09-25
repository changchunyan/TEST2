/**
 * The reminds service.
 * @version 1.0
 */
angular.module('ywsApp').factory('RemindsService', ['$http', '$q', 'config','SweetAlert',
    function($http, $q, config,SweetAlert) {
		var service = {};
		var getTimestamp=new Date().getTime();
		service.getOrderRemindsList = getOrderRemindsList;//订单收费、审核提醒的列表
		service.getOrderRemindDetail = getOrderRemindDetail;// 订单提醒查看详细信息
		service.getMsgCount = getMsgCount;// 获取信息条数
		service.setNextRemindsTime=setNextRemindsTime;//提醒设置
		service.getAllotRemindDetail = getAllotRemindDetail;//获取分配提醒详情
		service.getAllotStudentList = getAllotStudentList;//查询分配学员列表
		service.reAllotStudent = reAllotStudent;//重新分配学员
		service.update = update;//更新提醒
        service.setNextRemindsTime=setNextRemindsPastCoursePlanTime;
		/**
		 * 重新分配学员
		 */
		function reAllotStudent(params){
			var deferred = $q.defer();
            $http.post(config.endpoints.sos.reminds+'/reAllotStudent',params).success(function (data) {
                deferred.resolve({
                    data:data
                })
            }).error(function (response, status, headers, config) {
                deferred.reject(response.error);
            })
            return deferred.promise;
		}

		/**
		 * 查询分配学员列表
		 */
		function getAllotStudentList(filter){
			var deferred = $q.defer();
            $http.post(config.endpoints.sos.reminds+'/getAllotStudentList',filter).success(function (data) {
                deferred.resolve({
                    data:data
                })
            }).error(function (response, status, headers, config) {
                deferred.reject(response.error);
            })
            return deferred.promise;
		}

        /**
         * 获取信息条数
         */
        function getMsgCount(){
            var deferred = $q.defer();
            $http.get(config.endpoints.sos.getMsgCount+'?time='+getTimestamp).success(function (data) {
                deferred.resolve({
                    data:data
                })
            }).error(function (response, status, headers, config) {
                console.log('Failed to get CustomerStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            })
            return deferred.promise;
        }
		/**
		 * 订单收费、审核提醒列表
		 */
		function getOrderRemindsList(getDataParam)
			{
				var deferred = $q.defer();
			/*if (!params.search.predicateObject) {
				params.search.predicateObject = {};
				params.search.predicateObject.pageNum = start / number + 1;
				params.search.predicateObject.pageSize = number;
			} else {
				params.search.predicateObject.pageNum = start / number + 1;
				params.search.predicateObject.pageSize = number;
			}*/
			//var pageStartNum = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
			//var pageSizenum = pagination.number || 10;
			//$scope.remindFilter.tableState = tableState	;
            //$scope.remindFilter.pageNum = pageStartNum	;//params.search.predicateObject.pageNum;
			//$scope.remindFilter.pageSize = pageSizenum;//params.search.predicateObject.pageSize;
			$http.post(config.endpoints.sos.reminds + '/queryForPage?time='+getTimestamp, getDataParam).success(function (response, status, headers, config) {
				deferred.resolve({
					data: response.data,
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
		 * 订单消息提醒-查看详细
		 */
		function getOrderRemindDetail(rowId){
			var deferred = $q.defer();
			$http.post(config.endpoints.sos.reminds+'/detail',rowId).success(function(response, status, headers, config) {
				deferred.resolve({
					data: response.data
				});
			}).error(function(response, status, headers, config) {
					console.log('Failed to get CustomerStudent : ' + JSON.stringify(response));
					deferred.reject(response.error);
				}
			);
			return deferred.promise;
		}

		function getAllotRemindDetail(rowId){
			var deferred = $q.defer();
			$http.post(config.endpoints.sos.reminds+'/allotRemindDetail',rowId).success(function(response, status, headers, config) {
				deferred.resolve({
					data: response.data
				});
			}).error(function(response, status, headers, config) {
					console.log('Failed to get CustomerStudent : ' + JSON.stringify(response));
					deferred.reject(response.error);
				}
			);
			return deferred.promise;
		}

		//设置下次提醒
		function setNextRemindsTime(obj) {
			var deferred = $q.defer();
			$http.post(config.endpoints.sos.reminds+'/update',obj).success(function(response, status, headers, config) {
				deferred.resolve({
					data: response
				});
			}).error(function(response, status, headers, config) {
					console.log('Failed to get CustomerStudent : ' + JSON.stringify(response));
					deferred.reject(response.error);
				}
			);
			return deferred.promise;
		}

            //消课设置下次提醒
        function setNextRemindsPastCoursePlanTime(obj) {
            var deferred = $q.defer();
            $http.post(config.endpoints.sos.reminds+'/update',obj).success(function(response, status, headers, config) {
                deferred.resolve({
                    data: response
                });
            }).error(function(response, status, headers, config) {
                    console.log('Failed to get CustomerStudent : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

		//更新提醒
		function update(obj) {
			var deferred = $q.defer();
			$http.post(config.endpoints.sos.reminds+'/update',obj)
				.success(function(response, status, headers, config) {
					deferred.resolve({
						data: response
					});
				})
				.error(function(response, status, headers, config) {
					console.log('Failed to get CustomerStudent : ' + JSON.stringify(response));
					deferred.reject(response.error);
				});
			return deferred.promise;
		}
		return service;
	}
]);


