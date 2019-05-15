var app = angular.module("demo", ["ngRoute"]);
var API = 'http://127.0.0.1:8000/api/auth';
app.constant("baseUrl", "http://localhost:63343/demo");
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
        .when("/list", {
            templateUrl: "list.html",
            controller: "listCtrl"
        })
        .when('/logout', {
            templateUrl: "logout.html",
            controller: "logoutCtrl"
        })
});

//register controller
app.controller("registerCtrl", function ($scope, $http, $location) {
    window.scrollTo(0, 0);
    if (sessionStorage.token) {
        $location.path('/list');
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
                console.log(response);
                Swal.fire(
                    'Register successfully!',
                    'Please check your email when accepted.',
                    'success'
                );
                console.log($scope.member);
                lrform.reset();
                setTimeout(function () {
                    window.location.replace("#!login");
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
    if (sessionStorage.accessToken) {
        $location.path('/list');
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
                    window.location.replace("#!list");
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

//logout controller
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
                window.location.replace("#!register");
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

//list user controller
app.controller("listCtrl", function ($scope, $location, $http) {
    window.scrollTo(0, 0);
    var url = "";
    var auth = "";
    if (!sessionStorage.token) {
        $location.path('/register');
    } else {
        url = 'http://127.0.0.1:8000/api/auth/user';
        auth = sessionStorage.token;
    }
    $scope.user = [];
    $http({
        method: 'GET',
        url: url,
        headers: {
            'Authorization': 'Bearer ' + auth
        }
    }).then(function successCallback(responce) {
        console.log(responce.data);
        $scope.listUser = responce.data;
        // if ($scope.listUser.length > 6) {
        //     for (var i = 0; i < 6; i++) {
        //         $scope.user.push(($scope.listUser));
        //         $scope.user = $scope.user.reverse();
        //     }
        // } else {
        //     $scope.user = $scope.listUser
        // }
    }, function errorCallback(response) {
        // console.log(response)
    });
});


