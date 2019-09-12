angular.module('ethExplorer')
    .controller('transactionInfosCtrl', function ($rootScope, $scope, $location, $routeParams,$q) {

       var web3 = $rootScope.web3;
	
        $scope.init=function()
        {
            $scope.txId=$routeParams.transactionId;

            if($scope.txId!==undefined) { // add a test to check if it match tx paterns to avoid useless API call, clients are not obliged to come from the search form...

                getTransactionInfos()
                    .then(function(result){

                    var txResult = result.txResult;
                    var txRecieptResult = result.txRecieptResult;
                        //TODO Refactor this logic, asynchron calls + services....
                        var number = web3.eth.blockNumber;

                    $scope.result = txResult;

                    if(txResult.blockHash!==undefined){
                        $scope.blockHash = txResult.blockHash;
                    }
                    else{
                        $scope.blockHash ='pending';
                    }
                    if(txResult.blockNumber!==undefined){
                        $scope.blockNumber = txResult.blockNumber;
                    }
                    else{
                        $scope.blockNumber ='pending';
                    }
                    $scope.from = txResult.from;
                    $scope.gas = txResult.gas;
                    $scope.gasPrice = txResult.gasPrice.c[0] + " WEI";
                    $scope.hash = txResult.hash;
                    $scope.input = txResult.input; // that's a string
                    $scope.nonce = txResult.nonce;
                    $scope.to = txResult.to;
                    $scope.transactionIndex = txResult.transactionIndex;
                    $scope.ethValue = txResult.value.c[0] / 10000; 
                    $scope.txprice = (txResult.gas * txResult.gasPrice)/1000000000000000000 + " ETH";
                    $scope.status = txRecieptResult.status;
                    $scope.gasUsed = txRecieptResult.gasUsed;
                    $scope.contractAddress = txRecieptResult.contractAddress;
                    $scope.logs = txRecieptResult.logs;
                    if($scope.blockNumber!==undefined){
                        $scope.conf = number - $scope.blockNumber;
                        if($scope.conf===0){
                            $scope.conf='unconfirmed'; //TODO change color button when unconfirmed... ng-if or ng-class
                        }
                    }
                        //TODO Refactor this logic, asynchron calls + services....
                    if($scope.blockNumber!==undefined){
                        var info = web3.eth.getBlock($scope.blockNumber);
                        if(info!==undefined){
                            $scope.time = info.timestamp;
                        }
                    }

                });

            }



            else{
                $location.path("/"); // add a trigger to display an error message so user knows he messed up with the TX number
            }


            function getTransactionInfos(){
                var deferred = $q.defer();

                web3.eth.getTransaction($scope.txId,function(txError, txResult) {
                    if(!txError){

                      web3.eth.getTransactionReceipt($scope.txId, function(txRecieptError, txRecieptResult) {
                        if(!txRecieptError){
                          deferred.resolve({txResult, txRecieptResult});
                        }
                        else{
                          deferred.reject(txRecieptError);
                        }
                      });
                    }
                    else{
                        deferred.reject(txError);
                    }
                });
                return deferred.promise;

            }



        };
        $scope.init();

    });
