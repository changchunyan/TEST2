/**
 * The dictionary management service.
 *
 * @author zhiqing
 * @version 1.0
 */
angular.module('ywsApp').factory(
    'DictionaryService', ['$http', '$q', 'config',
        function($http, $q, config) {
            var service = {};
            service.list = list;
            service.update = update;
            service.getSubjectGroup = getSubjectGroup;

            /**
             * Get the dictionary parameters.
             */
            function list(){
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.dictionary)
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
             * Update the dictionary parameters.
             */
            function update(dict){
                var deferred = $q.defer();
                $http.put(config.endpoints.hr.dictionary, dict)
                    .success(function(response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function(response, status, headers, config) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            function getSubjectGroup() {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.dictionary + '/subjectGroup')
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
