/**
 * The biConfirmIncome service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiConfirmIncomeService', ['$http', '$q', 'config',
    function($http, $q, config) {
	var service = {};
	service.getPageList = getPageList;
	service.getAllList = getAllList;
	/*service.getPageListModel = getPageListModel;*/
	service.getPage=getPage;
	service.getPageAllList=getPageAllList;
  service.getSchoolConfirmInfo = getSchoolConfirmInfo;
	//方法实现

  function getSchoolConfirmInfo(schoolId, startDate, endDate) {
      var deferred = $q.defer();
      $http.get(config.endpoints.bi.biConfirmIncome + '/querySchoolConfirmIncome?schoolId=' + schoolId + '&startTime=' + startDate + '&endTime=' +endDate)
        .success(function(response, status, headers, config) {
          deferred.resolve({
                data: response.data,
              });
        })
        .error(function(response, status, headers, config) {
          deferred.reject(response.error);
        });
      return deferred.promise;
  }

	/**
	 * 获取分页后的渠道签约信息
	 */
	function getPageList(model) {
        var deferred = $q.defer();
        $http.post(config.endpoints.bi.biConfirmIncome + "/queryForPage", model)
          .success(function(response, status, headers, config) {
        	  deferred.resolve({
                  data: response.data,
                  numberOfPages: response.data.pages
                });
          })
          .error(function(response, status, headers, config) {
            deferred.reject(response.error);
          }
        );
        return deferred.promise;
    }
	/**
	 * 实时获取统计信息
	 */
 	service.getConfirmInfos=function(model) {
        var deferred = $q.defer();
        $http.post(config.endpoints.bi.biConfirmIncome + "", model)
          .success(function(response, status, headers, config) {
        	  deferred.resolve({
                  data: response.data,
                  numberOfPages: response.data.pages
                });
          })
          .error(function(response, status, headers, config) {
            deferred.reject(response.error);
          }
        );
        return deferred.promise;
    }
	/**
	 * 获取所有的
	 */
	function getAllList(model) {
		var deferred = $q.defer();
		$http.post(config.endpoints.bi.biConfirmIncome + "/queryByModel", model)
			.success(function(response, status, headers, config) {
				deferred.resolve({
					data: response.data
				});
			})
			.error(function(response, status, headers, config) {
				deferred.reject(response.error);
			}
		);
		return deferred.promise;
	}

	/**
	 * 获取分页后的渠道签约信息
	 *//*
	function getPageListModel(model) {
        var deferred = $q.defer();
        $http.post(config.endpoints.bi.biConfirmIncome + "/queryForPageDetail", model)
          .success(function(response, status, headers, config) {
        	  deferred.resolve({
                  data: response.data,
                  numberOfPages: response.data.pages
                });
          })
          .error(function(response, status, headers, config) {
            deferred.reject(response.error);
          }
        );
        return deferred.promise;
    }
    */

	  /**
     * Gets the page of orders.
     * @return the promise
     */
    function getPage(start, number,biConfirmIncome) {
        //;
        if(!biConfirmIncome){
        	biConfirmIncome={};
        }
        var deferred = $q.defer();
        $http.get(config.endpoints.bi.biConfirmIncome + "/queryForPageDetail"+ '?orderJson='+JSON.stringify(biConfirmIncome))
            .success(function(response, status, headers, config) {
                deferred.resolve({
                    data: response.data.list,
                    numberOfPages: response.data.pages,
                    total:response.data.total
                });
            })
            .error(function(response, status, headers, config) {
                console.log('Failed to get orders : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }


    /**
	 * 获取所有的
	 */
	function getPageAllList(model) {
		var deferred = $q.defer();
		$http.get(config.endpoints.bi.biConfirmIncome + "/queryByModelDetail"+ '?orderJson='+JSON.stringify(model))
			.success(function(response, status, headers, config) {
				deferred.resolve({
					data: response.data
				});
			})
			.error(function(response, status, headers, config) {
				deferred.reject(response.error);
			}
		);
		return deferred.promise;
	}
	return service;
	}
]);
