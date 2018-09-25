/**
 * The position's role management service.
 *
 * @author zhiqing
 * @version 1.0
 */
angular.module('ywsApp').factory(
    'PositionRoleService', ['$http', '$q', 'config',
        function($http, $q, config) {
            var service = {};
            service.getPositionRoleByFilter = getPositionRoleByFilter;
            service.update = update;

            /**
             * Get the position's roles.
             * @param position
             * @returns {*}
             */
            function getPositionRoleByFilter(position,start,number){
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.position + "/getPositionRolesByFilter?position="
                    + JSON.stringify(position) +  '&start=' + start + '&number=' + number)
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
             * Save the position's role.
             * @param position_role
             * @returns {*}
             */
            function update(position_role){
                var deferred = $q.defer();
                $http.put(config.endpoints.hr.position + '/positionID=' + position_role.positionId ,position_role)
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
