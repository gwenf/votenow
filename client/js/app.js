$(document).ready(function(){

    var myApp = angular.module('myApp', ['ngRoute']);

    myApp.controller('ChoiceCtrl', function ($scope) {
        $scope.choices = [];

        $scope.addChoice = function () {
            if ($scope.choiceBody) {
                $scope.choices.shift({
                    body: $scope.choiceBody
                });
                $scope.choiceBody = null;
            }
        }
    });

    //$('.love').append('<p>what up</p>');


});