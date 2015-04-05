(function() {

    var app = angular.module('mahjonggApp', ['ngRoute', 'ngWebstorage']);

    app.config(function($routeProvider) {
        $routeProvider
            .when('/',
            {
                templateUrl: 'game.html'
            })
            .when('/override', {
                templateUrl: 'override.html'
            })
            .when('/configure', {
                templateUrl: 'configure.html'
            });
    });

    app.directive('ngConfirm',
        function()
        {
            return {
                restrict: 'A',
                link: function(scope, element, attr)
                {
                    element.bind('click', function (event)
                    {
                        if (window.confirm(attr.ngConfirm))
                        {
                            scope.$apply(attr.ngConfirmAction)
                        }
                    });
                }
            };
        });

    app.factory('players', function ($rootScope, $webstorage) {
        var webstorage = $webstorage($rootScope, 'local');
        return webstorage.bind('players', 'players', function () {
            var defaultValue = [];
            for (var i = 0; i < 4; i++) {
                var player =
                {
                    name: "Player " + (i + 1),
                    score: 1000
                }
                defaultValue.push(player);
            }
            return defaultValue;
        });
    });

    app.factory('game', function ($rootScope, $webstorage) {
        var webstorage = $webstorage($rootScope, 'local');
        return webstorage.bind('game', 'game',
            {
                round: 0,
                east: 0
            });
    });

    app.controller('MainCtrl', function()
    {
    });

    app.controller('GameCtrl', function ($scope, players, game)
    {
        $scope.endRound = function()
        {
            var winner = parseInt($scope.inputWinner);
            console.log("Round " + game.round + ", winner is " + players[winner].name);
            for (var i = 0; i < 4; i++)
            {
                console.log("Hand of " + players[i].name + " is " + players[i].currentHand);
            }
            for (var i = 0; i < 4; i++)
            {
                var name1 = players[i].name;
                for (var j = 0; j < 4; j++)
                {
                    var name2 = players[j].name;
                    if (i == j || j == winner)
                    {
                        continue;
                    }
                    var payment = parseInt(players[i].currentHand);
                    if (i == game.east || j == game.east) {
                        payment *= 2;
                    }
                    console.log(name2 + " pays " + payment + " to " + name1);
                    players[i].score = parseInt(players[i].score) + payment;
                    players[j].score = parseInt(players[j].score) - payment;
                }
            }
            game.round++;
            if (game.east != winner)
            {
                game.east = (game.east + 1) % 4;
            }
            delete $scope.inputWinner;
            for (var i = 0; i < 4; i++)
            {
                delete players[i].currentHand;
            }
        }

        $scope.newGame = function()
        {
            for (var i = 0; i < 4; i++)
            {
                players[i].score = 1000;
            }
            game.east = 0;
        }
    });

    app.controller('ConfigureCtrl', function ($scope, players) {
    });

    app.controller('OverrideCtrl', function ($scope, $location, players, game) {
        $scope.overridePlayers = players;
        $scope.validate = function (clickEvent) {
            var sum = 0;
            $scope.overridePlayers.forEach(function (e) {
                sum += parseInt(e.score);
            });
            if (sum != 4000) {
                $scope.errorMessage = "Sum is " + sum + " but should be 4000";
                return;
            }
            $location.path("/");
        }
        $scope.game = game;
    });

})();