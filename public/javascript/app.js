'use strict';
angular.module('inicio', [
  'ngRoute',
  'ngMaterial',
  'ngMessages',
  'angular-jwt'
])

.config(['$routeProvider','$httpProvider','jwtInterceptorProvider', function($routeProvider,$httpProvider,jwtInterceptorProvider) {
  
  jwtInterceptorProvider.tokenGetter = function(){
    return window.localStorage.getItem("token");
  }
  $httpProvider.interceptors.push("jwtInterceptor");

  $routeProvider
      .when('/:serie',{
          controller: 'login',
          templateUrl:'vistas/login.html'
      })
    
      .when('/usuario/inf',{
          controller: 'usuarioctrl',
          templateUrl: 'vistas/usuario.html',
          resolve: {
            antCargar: ['validar','consumoPeticion','$timeout',function(validar,consumoPeticion,$timeout){
         
              validar.obtToken()
              .then(function(data){
                var obj = angular.fromJson(data);
              
              })
              .catch(function(err){
                  console.log(err);
              })
            }]
          }
      })

      .when('/error/id',{
        controller:'',
        templateUrl: 'vistas/error.html'
      })
      
      .otherwise({redirectTo: '/'});
}])

.config(function($mdThemingProvider) {
  $mdThemingProvider.definePalette('miPaleta', {
    '50': 'FFCDD2',
    '100': 'F44336',
    '200': 'C5CAE9',
    '300': '3F51B5',
    '400': 'B71C1C',
    '500': '2E5597',
    '600': 'C5CAE9',
    '700': 'E8EAF6',
    '800': '9FA8DA',
    '900': '7986CB',
    'A100': 'FF5722',
    'A200': 'FF8A65',
    'A400': 'FF7043',
    'A700': 'F4511E'
   
  });
  $mdThemingProvider.theme('default')
    .primaryPalette('miPaleta',{
      'default': '500', 
      'hue-1': '400', 
      'hue-2': '200', 
      'hue-3': 'A100'
    })
    .accentPalette('orange', {
      'default':'500'
    });

})

.factory('consumoPeticion', function($http){
    
    var comun = {};   /*Objeto */
    comun.inf;  /*Arreglo*/
    comun.linkP;  /*Arreglo*/

//////////////////////////Seccion de Metodos Remotos consumir la inf de la Base de Datos Mysql/////////////////////

    /*Consumo para obtener inf del vehiculo*/
    comun.getPr = function(dat){
      return $http({
        method: 'POST',
        url: '/infrest',
        skipAuthorization: true,
        data: dat
      }).success(function(data){
          comun.inf = angular.copy(data);
          return comun.inf;
      })
    }

     /*Consumo para obtener link de poliza */
    comun.getPr2 = function(dat){
      return $http({
        method: 'POST',
        url: '/infPoli',
        skipAuthorization: true,
        data: dat
      }).success(function(data){
          comun.linkP = angular.copy(data);
          return comun.linkP;
      })
    }

 
/*Consumo para enviar mensaje por correo electronico*/
    comun.getMsg = function(inf){
      return $http({
        method: 'POST',
        url: '/mail',
        skipAuthorization: true,
        data: inf 
      });
    }

  return comun;
})

.factory('validar',function($q,$http,$location){
    return {
      obtToken: function (){
          var defered= $q.defer();
          var promise = defered.promise;
          $http({
              method: 'POST',
              url: '/users',
              skipAuthorization: false
          })
          .success(function(data){
              defered.resolve(data);
          })
          .error(function(err){
              defered.reject(err);
              $location.path('/error/id');
          });
        return promise;
      }
    }
});


