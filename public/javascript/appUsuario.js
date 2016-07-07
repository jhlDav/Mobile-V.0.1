'use strict';

angular.module('inicio')

.controller('usuarioctrl', ['$scope','consumoPeticion','$routeParams','$mdDialog','$timeout','$filter', function ($scope,consumoPeticion,$routeParams,$mdDialog,$timeout,$filter) {
      
    $scope.serie = consumoPeticion.inf.serie;
    $scope.nombre = consumoPeticion.inf.conductor;
    $scope.ncliente = consumoPeticion.inf.cliente ;
    $scope.marca = consumoPeticion.inf.marca;
    $scope.modelo = consumoPeticion.inf.modelo;
    $scope.linea = consumoPeticion.inf.linea;
    $scope.transmicion = consumoPeticion.inf.transmicion;
    $scope.combustible = consumoPeticion.inf.combustible;
    $scope.inicio = $filter('date')(new Date(consumoPeticion.inf.inicioA),'dd-MM-yyyy');
    $scope.fin = $filter('date')(new Date(consumoPeticion.inf.finA),'dd-MM-yyyy');;
    $scope.aseguradora = consumoPeticion.inf.aseguradora;
    $scope.poliza = consumoPeticion.inf.poliza;
    $scope.inicioP = $filter('date')(new Date(consumoPeticion.inf.inicioP),'dd-MM-yyyy');
    $scope.finP=$filter('date')(new Date(consumoPeticion.inf.finP),'dd-MM-yyyy');

    if(consumoPeticion.linkP.success === true){
        var linkPoliza = "";
        for (var i = 0; i < consumoPeticion.linkP.link.data.length; i++) {
            linkPoliza = linkPoliza + String.fromCharCode(consumoPeticion.linkP.link.data[i]);
        };
        console.log(linkPoliza);
    
        $scope.dpoliza= "http://23.21.227.246/cloud-vehicle/tmp/"+linkPoliza;
    }else{
        $scope.dpoliza= "http://23.21.227.246/cloud-vehicle/tmp/";
    }
    window.localStorage.removeItem("token"); 
 
//////////////////////////////////////////Servicios///////////////////////////////////////////////////////////
    $scope.servicio = [];
     
    $scope.items=[1,2,3,4,5,6,7,8,9,10];
    $scope.hora='9:00';  
    $scope.horas = ('9:00 10:00 11:00 12:00 13:00 14:00 15:00 16:00 17:00 18:00').split(' ').map(function(hora) {
     return {abbrev:hora};
    });

    $scope.myDate = new Date();
    
    var date = getDate($scope.myDate);

    function getDate (myDate){

        var dd = myDate.getDate();
        var mm = myDate.getMonth()+1;
        var yyyy = myDate.getFullYear();
        
        if(dd<10) {
            dd='0'+dd
        } 

        if(mm<10) {
            mm='0'+mm
        } 

      return yyyy+'-'+mm+'-'+dd;
    }

    $scope.minDate = new Date(
        $scope.myDate.getFullYear(),
        $scope.myDate.getMonth() - 2,
        $scope.myDate.getDate()
    );
  
    $scope.maxDate = new Date(
        $scope.myDate.getFullYear(),
        $scope.myDate.getMonth() + 2,
        $scope.myDate.getDate()
    );
    
    $scope.onlyWeekendsPredicate = function(date) {
        var day = date.getDay();
        return day === 1 || day === 2 || day === 3 || day === 4 || day === 5;
    }
    
  /////////////// FUNCION LEVANTAR SERVICIOS ////////////////////////////////////////  

  $scope.obt = function(ev){
      var nfolio = Math.floor((Math.random() * 10000) + 1);
      var servicio = {
              folio: nfolio,
              idcliente:id,
              ncliente: $scope.ncliente,
              nombre: $scope.nombre,
              serie:$scope.serie,
              servicio: $scope.infservicio,
              direccion: $scope.direccion,
              fecha: date,
              hora: $scope.hora+':00',
              kilometraje:$scope.kilometraje,
              telefono:$scope.telefono,
              mail:$scope.email,
              stat: 'Solicitado',
              aquien: 'dbecerra@jhl.mx',
              titulo: 'SOLICITUD DE SERVICIO CLIENTE '+ $scope.ncliente,
              msg:'Estimado JollyAdmin, se ha levantado una solicitud de servicio con el folio: '+nfolio+', los datos del servicio son los que se describen a continuacion: \n\n\n'+
                  'Serie: '+$scope.serie+',\n'+
                  'Cliente: '+$scope.ncliente+',\n'+
                  'Nombre: '+$scope.nombre+',\n'+
                  'Servicio: '+$scope.infservicio+',\n'+
                  'Direccion: '+$scope.direccion+',\n'+
                  'Fecha: '+date+',\n'+
                  'Hora: '+$scope.hora+':00'+',\n'+
                  'Kilometraje: '+$scope.kilometraje+',\n'+
                  'Telefono: '+$scope.telefono+',\n'+
                  'Mail: '+$scope.email+'.\n\n\n'+
                  'Favor de darle seguimiento al servicio y ponerse en contacto con el usuario lo más pronto posible. \n\nExcelente Dia..'
      }

      consumoPeticion.getMsg(servicio)
      .success(function(data){
            
          $mdDialog.show(
            $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('Servicio Levantado')
              .textContent('Su solicitud fue enviada, el ejecutivo de cuenta se pondra en contacto con usted. Muchas gracias')
              .ok('OK!')
              .targetEvent(ev)
          );

          if($scope.servicios) {
              $scope.servicios.$setPristine();
              $scope.servicios.$setUntouched();
              $scope.infservicio='';
              $scope.direccion='';
              $scope.kilometraje = '';
              $scope.fecha='';
              $scope.telefono='';
              $scope.email='';
          } 
              
      })
      .error(function(err){
          $mdDialog.show(
              $mdDialog.alert()
                  .clickOutsideToClose(true)
                  .title('Servicio No levantado')
                  .textContent('Su solicitud fue rechazada, por favor comunicarte al telefono 5550048424')
                  .ok('OK!')
                  .targetEvent(ev)
          );
      });

  }
  
}]);