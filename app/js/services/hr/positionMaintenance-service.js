/**
 * The position maintenance service.
 *
 * @author zhiqing
 * @version 1.0
 */
angular.module('ywsApp').factory(
    'PositionMaintenanceService', ['$http', '$q', 'config',
        function($http, $q, config) {
            var service = {};
            service.update = update;

            function update(department,positions){
                var deferred = $q.defer();
                $http.post(config.endpoints.hr.position  + '/' + department.id, positions)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            return service;
        }
    ]);
