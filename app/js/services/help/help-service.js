/**
 * Created by cuizb on 2016/12/8.
 * help service
 */
'use strict';

angular.module('ywsApp').factory(
    'HelpService', ['$http', '$q',
        function($http, $q) {

            var service = {};

            service.getAllHelpInfo = getAllHelpInfo;

            function getAllHelpInfo() {
                var deferred = $q.defer();
                $http.get(config.endpoints.admin.help+"/topicList")
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
