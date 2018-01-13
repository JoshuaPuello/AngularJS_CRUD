var app = angular.module("myApp", ["ngRoute","LocalStorageModule","cp.ngConfirm"]);

app.config(function($routeProvider){
    $routeProvider
    .when("/",{
        controller: "myCtrl",
        templateUrl: "templates/home.html"
    })
    .when("/add",{
        controller: "myCtrl",
        templateUrl: "templates/add.html"
    })
    .when("/edit",{
        controller: "myCtrl",
        templateUrl: "templates/edit.html"
    })
    .when("/delete",{
        controller: "myCtrl",
        templateUrl: "templates/delete.html"
    })
});

app.controller("myCtrl", function($scope, localStorageService, $ngConfirm){
    
    if (localStorageService.get("crud")){
        $scope.data = localStorageService.get("crud");
    } else {
        $scope.data = [];
    }

    $scope.$watchCollection("data",function(newValue,oldValue){
        localStorageService.set("crud",$scope.data);
    });

    $scope.$watchCollection("selectedE",function(newValue,oldValue){
        for (var i in $scope.data){
            if ($scope.data[i].nombre == newValue){
                $scope.editNombre = $scope.data[i].nombre;
                $scope.editEdad = $scope.data[i].edad;
                $scope.editSalario = $scope.data[i].salario;
            }
        }
    });

    $scope.addData = function(){
        if (!$scope.checkAdd()){
            $scope.notification('Error','¡Debe completar todos los campos!','red'); 
        } else {
            if ($scope.checkDuplicates($scope.nombre)){
                $scope.notification('Error','¡Ya existen registros con ese nombre!','red'); 
            } else {
                $scope.data.push(
                    {nombre: $scope.nombre, edad: $scope.edad, salario: $scope.salario}
                );
                $scope.notification('Éxito','¡Datos guardados correctamente!','green');   
                $scope.redirect(); 
            }
        }
    };

    $scope.editData = function(){
        if ($scope.selectedE != null){
            var editNombre = $scope.selectedE;
            for (var i in $scope.data){
                if ($scope.data[i].nombre == editNombre){
                    if (!$scope.checkEdit()){
                        $scope.notification('Error','¡Debe completar todos los campos!','red'); 
                    } else {
                        $scope.data[i].nombre = $scope.editNombre;
                        $scope.data[i].edad = $scope.editEdad;
                        $scope.data[i].salario = $scope.editSalario;
                        localStorageService.set("crud",$scope.data);
                        $scope.redirect();
                        $scope.notification('Éxito','¡Datos modificados correctamente!','green');
                        $scope.redirect();
                        break;
                    }
                }
            }
        }
    };

    $scope.deleteData = function(){
        if ($scope.selectedE != null){
            var editNombre = $scope.selectedE;
            var array = $scope.data.filter(elem => elem.nombre != editNombre);
            $scope.data = array;
            $scope.notification('Éxito','¡Datos eliminados correctamente!','green');
            $scope.redirect();
        }
    };

    $scope.cleanData = function(){
        $ngConfirm({
            title: 'Cuidado!',
            content: '¿Continuar eliminando todos los datos?',
            type: 'red',
            typeAnimated: true,
            buttons: {
                accepted: {
                    text: 'Continuar',
                    btnClass: 'btn-red',
                    action: function(){
                        $scope.data = [];
                        $scope.notification('Éxito','¡Datos eliminados correctamente!','green');
                        $scope.redirect();
                    }
                },
                close: {
                    text: 'Cancelar',
                    btnClass: 'btn-dark',
                    function () {

                    }
                }
            }
        });
    }

    $scope.populate = function(){
        $scope.data.push(
            {nombre: 'Joshua', edad: '16', salario: '4400000'},
            {nombre: 'Sham', edad: '17', salario: '500000'},
            {nombre: 'Niza', edad: '23', salario: '3500000'}
        );
    };

    $scope.redirect = function(){
        window.location = "#!";
    }

    $scope.notification = function(title_1,content_1,color_1){
        $ngConfirm({
            title: title_1,
            content: content_1,
            type: color_1,
            typeAnimated: true,
            buttons: {
                close: {
                    text: 'Cerrar',
                    btnClass: 'btn-' + color_1,
                    action: function(){
                    }
                }
            }
        });
    };

    $scope.checkAdd = function(){
        if ($scope.nombre == null || 
        $scope.edad == null ||
        $scope.salario == null){
            return false;
        } else return true;
    };

    $scope.checkEdit = function(){
        if ($scope.editNombre == null || 
        $scope.editEdad == null ||
        $scope.editSalario == null){
            return false;
        } else return true;
    };

    $scope.checkDuplicates = function(name){
        var res = $scope.data.find(elem => elem.nombre == name);
        if (res != null) return true;
    };
});