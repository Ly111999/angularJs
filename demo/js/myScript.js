var app = angular.module("demo", ["ngRoute"]);
var API = 'http://127.0.0.1:8000/api/';
app.constant("baseUrl", "http://localhost:63343/demo");
app.config(function ($routeProvider) {
    $routeProvider
        .when("/register", {
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
        // .when('/', {
        //     templateUrl: "job/list.html",
        //     controller: "logoutCtrl"
        // })
        .when('/', {
            templateUrl: "job/create.html",
            controller: "logoutCtrl"
        })
        .when('/edit', {
            templateUrl: "job/edit.html",
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
                url: API + 'auth/register',
                data: $scope.member
            }).then(function successCallback(response) {
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
            });
        }
    }
});

//login controller
app.controller('loginCtrl', function ($scope, $http, $location) {
    window.scrollTo(0, 0);
    if (sessionStorage.token) {
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
                url: API + 'auth/login',
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
            });
        }
    }
});

//logout controller
app.controller('logoutCtrl', function ($scope, $http) {
    $scope.logout = function () {
        $http({
            method: 'GET',
            url: API + 'auth/logout',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            }
        }).then(function successCallback(response) {
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
        url = API + 'auth/user';
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
        $scope.listUser = responce.data;
        $scope.user = $scope.listUser;
    }, function errorCallback(response) {
        Swal.fire(
            'Not found!',
            response.data.message,
            'error'
        );
    });

    //delete user
    $scope.delete = function (id) {
        Swal.fire({
            title: "Delete",
            text: "Are you sure you want to delete this post?",
            type: 'warning',
            buttons: true,
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: 'Ok',
            CancelButtonText: 'Cancel',
            buttonsStyling: false
        }).then(function (confirm) {
            if (confirm) {
                $http({
                    method: 'DELETE',
                    url: API + "auth/" + id,
                    headers: {
                        'Authorization': 'Bearer ' + auth
                    }
                }).then(function successCallback(response) {
                    for (i in $scope.listUser.data) {
                        if ($scope.listUser.data[i].id === id) {
                            $scope.listUser.data.splice(i, 1);
                        }
                    }
                    Swal.fire(
                        'Delete successfully!',
                        'Hello',
                        'success'
                    );

                }, function errorCallback(response) {
                    Swal.fire(
                        'Fail',
                        response.data.message,
                        'error'
                    );
                });
            }
        });
    }
});

// create job controller
app.controller('createCtrl', function ($scope, $http) {
    window.scrollTo(0, 0);
    $scope.job = {
        "title":"",
        "company":"",
        "description":"",
        "location":""
    };

    $scope.create = function () {
        if ($scope.lrform.$valid) {
            $http({
                method: 'POST',
                url: API + 'job',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Authorization': 'Bearer ' + sessionStorage.getItem("token")
                }
            }).then(function successCallback(response) {
                Swal.fire(
                    'Create successfully!',
                    'Hello',
                    'success'
                );
                console.log($scope.job);
                lrform.reset();
                setTimeout(function () {
                    window.location.replace("#!edit");
                }, 2 * 1000);
            }, function errorCallback(response) {
                console.log($scope.job);
                Swal.fire(
                    'Create fail!',
                    response.message,
                    'error'
                );
            });
        }
    }
});





