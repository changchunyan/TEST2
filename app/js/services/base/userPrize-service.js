/**
 * The userPrize service.
 * @version 1.0
 */
angular.module('ywsApp').factory('UserPrizeService', ['$http', '$q',
    function($http, $q) {
		var service = {};
		service.addOrUpdate = addOrUpdate;
		service.queryForPage = queryForPage;

		/**
		 * 增加或更新中奖信息
		 */
		function addOrUpdate(model) {
		  var deferred = $q.defer();
		  $http.post(admin_server+'userPrize/addOrUpdate', model)
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
		 * 查询中奖信息
		 */
		function queryForPage(model) {
	      var deferred = $q.defer();
	      $http.post(admin_server+'userPrize/queryForPage', model)
	          .success(function(response, status, headers, config) {
	            deferred.resolve(response);
	          })
	          .error(function(response, status, headers, config) {
	            deferred.reject(response);
	          }
	      );
	      return deferred.promise;
	    }

		return service;
	}
]);
