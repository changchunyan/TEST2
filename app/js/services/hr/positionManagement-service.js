/**
 * The position management service.
 *
 * @author czq
 * @version 1.0
 */
angular.module('ywsApp').factory(
    'PositionManagementService', ['$http', '$q', 'config',
        function($http, $q, config) {
            var service = {};
            service.list = list;
            service.add = add;
            service.remove = remove;
            service.edit = edit;
            service.getPositionByFilter = getPositionByFilter;

            /**
             * Get the position list for page.
             * @param position  the position condition
             * @param start     start
             * @param number    size
             * @returns {*}
             */
            function getPositionByFilter(position,start,number){
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.positions_management + "/getPositionsByFilter?position="
                    + JSON.stringify(position)+ '&start=' + start + '&number=' + number)
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
             * Adds position.
             * @param position the position
             * @return the promise
             */
            function add(position) {
                var deferred = $q.defer();
                $http.post(config.endpoints.hr.positions_management, position)
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
             * Edit position.
             * @param position
             */
            function edit(position){
                var deferred = $q.defer();
                $http.put(config.endpoints.hr.positions_management + '/' + position.id, position)
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
             * Removes position.
             * @param position the position
             * @return the promise
             */
            function remove(position) {
                var deferred = $q.defer();
                $http.delete(config.endpoints.hr.positions_management + '/' + position.id)
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
             * Gets the list of positions.
             * @return the promise
             */
            function list() {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.positions_management + "/getAllPositions")
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

