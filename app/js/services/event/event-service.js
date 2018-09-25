/**
 * Created by cuizb on 2016/12/8.
 * help service
 */
'use strict';

angular.module('ywsApp').factory(
    'EventService', ['$http', '$q',
        function($http, $q) {

            var service = {};

            service.getEvents = getEvents;

            function getEvents(startDate, endDate) {
                var deferred = $q.defer();
                $http.get(crm_server + "/event?startDate=" + startDate + "&endDate=" + endDate)
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
