'use strict';

/**
 * The event controller.
 *
 */

angular.module('ywsApp').controller('eventController', ['$scope','$routeParams','$q','EventService',function ($scope,$routeParams,$q,EventService) {

    $scope.cellIsOpen = false;
    $scope.calendarView = 'month';
    $scope.events = [];
    $scope.date = new Date();
    $scope.title = 'test';

    $scope.getEvents = function() {
      $scope.cellIsOpen = false;
      var startDate = moment($scope.date).startOf('month');
      var endDate = moment(startDate).endOf('month');

      EventService.getEvents(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')).then(function(response) {
        var events = [];
        for (var i = 0; i < response.data.length; i++) {
          events.push({
            title: response.data[i].name,
            startsAt: new Date(response.data[i].startDate),
            endsAt: new Date(response.data[i].endDate)
          });
        }
        $scope.events = events;
      });
    }

    $scope.getEvents();
}
]);
