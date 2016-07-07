var express = require('express');
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
var SECRET = '28W*?jolly**//¡¡¡????deamon-secret';
var router = express.Router();
var nodemailer = require('nodemailer');

var Client = require('node-rest-client').Client;
var client = new Client();

///////////////////// Acceso a las Rutas de lado del Servidor ////////////////////////////


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


function decid(cadena){
  var str = [];
  var a = 0;
  for (var i = cadena.length -1; i > 0; i--) {
    if(i >= 13){
      str[a] = cadena.charAt(i);
      a++;
    }else{
      break;
    }
  }

  return str[1]+str[2]+str[0]+str[3];

}

router.post('/infrest', function(req, res, next) {
  
  	var url = 'http://23.21.227.246/cloud-vehicle/rest/appmovil/vehiculos/findInfoVehiculoByNumeroSerie?numeroSerie='+ req.body.serie;
 	
  	client.get(url, function (data, response) {

  	  
   		if(data.numeroSerie !== null){

         var id = decid(data.numeroSerie);
         console.log(id);
        
          if(req.body.pwd == id){
   				
   				   var user = {
   					    serie: data.numeroSerie,
		 			      idserie: id
   				   }

   				   var token = jwt.sign(user,SECRET);

   				   res.json({
		 			      success: true,
                idserie: id,
		 			      serie: data.numeroSerie,
		 		        marca:data.marca,
		 			      linea:data.linea,
		 			      modelo: data.modelo,
		 			      transmicion:data.tipoTransmision,
		 			      combustible:data.tipoCombustible,
		 			      conductor:data.nombreConductor,
                cliente: data.nombreCliente,
                inicioA: data.inicioArrendamiento,
                finA: data.finArrendamiento,
                aseguradora: data.nombreAseguradora,
                poliza: data.numeroPoliza,
                inicioP: data.fechaInicioPoliza,
                finP: data.fechaFinPoliza,
		 			      token: token
    			   });

   			  }else{
   				   res.json({
				 	      success: false,
				 	      msg:'Mal autenticado'
    			   });
   			  }

   			
   		}else{
   			res.json({
		 	success: false,
		 	msg:'sin datos'
    		});
   		}
    	
	});
});


router.post('/infPoli', function(req, res, next) {
  
  	var url = 'http://23.21.227.246/cloud-vehicle/rest/appmovil/documentosVehiculo/generateDocumentoPolizaVehiculoByNumeroSerie?numeroSerie='+ req.body.serie;
  	client.get(url, function (data, response) {

 		if(data.length !== 0){

   				res.json({
		 			  success: true,
		 			  link: data,
		 		  });
 		}else{
   			res.json({
		 	    success: false,
		 	    msg:'sin datos'
    		});
   	}
    	
	});
});


/* Ruta para descifrar token y validar usuario*/

router.post('/users',function(req, res, next){
	var token  = null;
	var comodin = req.headers.authorization;

	if(comodin!=null){

		var authorization = req.headers.authorization.split(" ");
	

		if(authorization.length === 2){
			var key = authorization[0];
			var val = authorization[1];
			if(/^Bearer$/i.test(key)){
				token = val.replace(/"/g, "");
				jwt.verify(token,SECRET,function(err,decoded){
					if(err){
						res.status(401).json('Wrong in the decoded');
					}else{
						console.log(decoded);
						res.status(200).json(decoded);
					}
				})
			}
		}else{
			res.status(401).json('Wrong with authorization headers');	
		}
	}else{
		res.status(401).json('Without Credentials');
	}
});



/* Ruta para Enviar Mensaje por Correo*/

router.post('/mail', function(req, res) {

	var transporter = nodemailer.createTransport({
    	service: 'Gmail',
    	auth: {
        	user: 'fleetmobliejhl@gmail.com',
        	pass: 'temp0ral'
    	}
	});
 
	var mailData = {
    	from: 'fleetmobliejhl@gmail.com',
    	to: req.body.aquien,
    	subject: req.body.titulo,
    	text: req.body.msg
   
	};

	transporter.sendMail(mailData, function(err, info){
    	if(err) {
      		console.log(err);
    	}else{
      		return res.json(201).json('Mail Send success');;
    	}
  	});
  		
});




module.exports = router;
