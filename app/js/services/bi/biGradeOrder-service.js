/**
 * The biGradeOrder service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiGradeOrderService', ['$http', '$q', 'config',
    function ($http, $q, config) {
        var service = {};
        service.getPageList = getPageList;
        service.getAllList = getAllList;
        service.getSummaryAllList = getSummaryAllList;
        service.getChannelGradeSummary = getChannelGradeSummary;
        service.getChannelGradeSummaryV2 = getChannelGradeSummaryV2;

        /**
         * 获取分页后的年级订单统计的信息
         */
        function getPageList(model) {
            var deferred = $q.defer();
            $http.post(config.endpoints.bi.biGradeOrder + "/queryForPage", model)
                .success(function (response, status, headers, config) {
                    deferred.resolve({
                        data: response.data,
                        numberOfPages: response.data.pages
                    });
                })
                .error(function (response, status, headers, config) {
                        deferred.reject(response.error);
                    }
                );
            return deferred.promise;
        }

        /**
         * 获取所有年级段明细
         */
        function getAllList(model) {
            var deferred = $q.defer();
            $http.post(config.endpoints.bi.biGradeOrder + "/queryByModel", model)
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
         * 查询汇总的记录，不进行分页，展示所有的年级段
         */
        function getSummaryAllList(model) {
            var deferred = $q.defer();
            $http.post(config.endpoints.bi.biGradeOrder + "/queryForSummary", model)
                .success(function (response, status, headers, config) {
                    deferred.resolve({
                        data: response.data
                    });
                })
                .error(function (response, status, headers, config) {
                    deferred.reject(response.error);
                });
            return deferred.promise;
        }

        function getChannelGradeSummary(departmentId, startDate, endDate, depType) {
            var deferred = $q.defer();
            $http.get(config.endpoints.bi.biChannelGrade + "/summary?departmentId=" + departmentId + "&startDate=" + startDate + "&endDate=" + endDate + '&depType=' + depType)
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

        function getChannelGradeSummaryV2(params) {
            var deferred = $q.defer();
            $http.post(config.endpoints.bi.biGradeOrder + "/queryForGradePage", params)
                .success(function (response, status, headers, config) {
                    deferred.resolve({
                        data: response.data || {}
                    });
                })
                .error(function (response, status, headers, config) {
                        deferred.reject(response.error);
                    }
                );
            return deferred.promise;
        }

        return service;
    }
]);
