'use strict';
/**
 * The fileReader.
 * @author sunqc@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').factory('fileReader', ["$q", function($q){
    var onLoad = function(reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var getReader = function(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        return reader;
    };

    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();
        var reader = getReader(deferred, scope);
        if(file){
            reader.readAsDataURL(file);
        }
        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };
}])
