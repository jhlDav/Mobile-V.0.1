
'use strict';

angular.module('inicio')

.controller('login', ['$scope','consumoPeticion','$routeParams','$location','$timeout', function ($scope,consumoPeticion,$routeParams,$location,$timeout) {
	
    $scope.showHints = true;
    $scope.error=false;
    $scope.tiempo=false;
    
    $scope.obtener= function(){
        $scope.error=false;
        $scope.tiempo=true;
        
        var user = {
          pwd: $scope.cliente.numero,
          serie: $routeParams.serie
        }
        
        consumoPeticion.getPr(user); 
        consumoPeticion.getPr2(user); 
    
        $timeout(function(){       
            
            console.log(consumoPeticion.inf.success);
            console.log(consumoPeticion.linkP.success);
            if(consumoPeticion.inf.success !== false && consumoPeticion.inf.token !== 'undefined' ){
              window.localStorage.setItem("token",consumoPeticion.inf.token); 
              $location.path('/usuario/inf');
            }else{
              $scope.error=true; 
              $scope.showHints = true; 
              $scope.tiempo=false;
            }

        },1000);
      


    }
}]);