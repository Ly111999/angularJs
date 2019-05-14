var app = angular.module("demo", ["ngRoute"]);
app.constant("baseUrl","http://localhost:63343/demo");
app.config(function ($routeProvider) {

    var route = "/demo";
    $routeProvider
        .when("/", {
            templateUrl: "register.html",
            controller: "registerCtrl"
        })
        .when("/login", {
            templateUrl: "login.html",
            controller: "loginCtrl"
        })
        // .when("/", {
        //     templateUrl: "list.html",
        //     controller: "listCtrl"
        // })
        .when('/logout', {
            template: "logout.html",
            controller: "logoutCtrl"
        })
});

//register controller
app.controller("registerCtrl", function ($scope, $http, $location) {
    window.scrollTo(0, 0);
    if (Cookies.get('access-token')) {
        $location.path('/')
    }
    if (sessionStorage.accessToken) {
        $location.path('/')
    }

    $scope.member = {
        "name": "",
        "email": "",
        "password": ""
    };

    $scope.register = function () {
        if ($scope.lrform.$valid) {
            $http({
                method: 'POST',
                url: 'http://127.0.0.1:8000/api/auth/register',
                data: $scope.member
            }).then(function successCallback(response) {
                Swal.fire(
                    'Register successfully!',
                    'Please check your email when accepted.',
                    'success'
                );
                lrform.reset();
                setTimeout(function () {
                    window.location.replace("/demo/login.html");
                }, 2 * 1000);
            }, function errorCallback(response) {
                Swal.fire(
                    'Register fail!',
                    response.message,
                    'error'
                );
                console.log($scope.member);
            });
        }
    }
});

//login controller
app.controller('loginCtrl', function ($scope, $http, $location) {
    window.scrollTo(0, 0);
    if (Cookies.get('access-token')) {
        $location.path('/')
    }
    if (sessionStorage.accessToken) {
        $location.path('/')
    }

    $scope.member = {
        "email": "",
        "password": ""
    };

    $scope.login = function () {
        if ($scope.lrform.$valid) {
            $http({
                method: 'POST',
                url: 'http://127.0.0.1:8000/api/auth/login',
                data: $scope.member
            }).then(function successCallback(response) {
                Swal.fire(
                    'Login successfully!',
                    'Hello',
                    'success'
                );
                console.log($scope.member);
                lrform.reset();
                sessionStorage.setItem('token', response.data.token);
                sessionStorage.setItem('expires_at', response.data.expires_at);
                setTimeout(function () {
                    // $location.path('/logout');
                    window.location.replace("/logout");
                }, 2 * 1000);
            }, function errorCallback(response) {
                Swal.fire(
                    'Login fail!',
                    response.message,
                    'error'
                );
                console.log($scope.member);
            });
        }
    }
});

//logout
app.controller('logoutCtrl', function ($scope, $http) {
    $scope.logout = function () {
        $http({
            method: 'GET',
            url: 'http://127.0.0.1:8000/api/auth/logout',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            }
        }).then(function successCallback(response) {
            console.log(response);
            Swal.fire(
                'Logout successfully!',
                'Hello',
                'success'
            );
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('expires_at');
            setTimeout(function () {
                window.location.replace("/demo/register.html");
            }, 2 * 1000);
        }, function errorCallback(response) {
            Swal.fire(
                'Logout fail!',
                response.message,
                'error'
            );
        });
    }
});

