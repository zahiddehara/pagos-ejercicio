angular.module("transfersApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    transfers: function(Transfers) {
                        return Transfers.getTransfers();
                    }
                }
            })
            .when("/new/transfer", {
                controller: "NewTransferController",
                templateUrl: "transfer-form.html"
            })
            .when("/transfer/:transferId", {
                controller: "EditTransferController",
                templateUrl: "transfer.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Transfers", function($http) {
        this.getTransfers = function() {
            return $http.get("/transfers").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("No se encontraron transferencias.");
                });
        }
        this.createTransfer = function(transfer) {
            return $http.post("/transfers", transfer).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("No se pudo realizar el pago.");
                    alert(response.data.error);
                    console.log(response);
                });
        }
        this.getTransfer = function(transferId) {
            var url = "/transfers/" + transferId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("No se pudo encontrar la transferencia.");
                });
        }
        
        this.deleteTransfer = function(transferId) {
            var url = "/transfers/" + transferId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("No se pudo eliminar la transferencia.");
                    console.log(response);
                });
        }
    })
    .controller("ListController", function(transfers, $scope) {
        $scope.transfers = transfers.data;
    })
    .controller("NewTransferController", function($scope, $location, Transfers) {
        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveTransfer = function(transfer) {
            Transfers.createTransfer(transfer).then(function(doc) {
                var transferUrl = "/transfer/" + doc.data._id;
                $location.path(transferUrl);
            }, function(response) {
                alert(response);
            });
        }

        $scope.checkCcType = function() {
            var re = {
                Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
                Mastercard: /^5[1-5][0-9]{14}$/
            }

            for(var key in re) {
                if(re[key].test($scope.transfer.ccNumber)) {
                    $scope.transfer.ccType = key;
                }
            }
        }
    })
    .controller("EditTransferController", function($scope, $routeParams, Transfers) {
        Transfers.getTransfer($routeParams.transferId).then(function(doc) {
            $scope.transfer = doc.data;
        }, function(response) {
            alert(response);
        });

        $scope.back = function() {
            $scope.editMode = false;
            $scope.transferFormUrl = "";
        }

        $scope.deleteTransfer = function(transferId) {
            Transfers.deleteTransfer(transferId);
        }
    });