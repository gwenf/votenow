

    var pollApp = angular.module('myApp', []);

    pollApp.controller('choiceCtrl', ['$scope', function ($scope) {
        $scope.choices = []; //just for testing

        $scope.addChoice = function () {

            //add new choice
            if ($scope.choiceBody) {
                $scope.choices.push({
                    body: $scope.choiceBody
                });
                $scope.choiceBody = null;
            }
        }
    }]);

