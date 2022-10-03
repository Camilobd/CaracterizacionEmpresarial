/*
* [0]   ID
* [1]   PROPONENTE
* [2]   ORGANIZACION
* [3]   FEC-MATRICULA
* [4]   FEC-RENOVACION
* [5]   MUNICIPIO
* [6]   SECCION CIIU
* [7]   CODIGO CIIU
* [8]   DESCRIPCION CIIU
* [9]   SUBSECTOR
* [10]   SECTOR
* [11]  ACTIVOS
* [12]
* [13]   AFILIADO
* [14]   EMPLEADOS
*
* */

var arrayBusinesses = new Array();
var arraySectors = new Array();
var arrayCities = new Array();
var arrayPersons = new Array();
var arrayEcosistema = new  Array();
var arrayNameEcosistema = [];
var arrayCIIU = [];

function loadDataEcosistema(data) {
    data = data.split(/\r?\n|\r/);

    for (var i = 0; i < data.length; i++) {
        var ecositema = new Object();
        ecositema.name = data[i].split(';')[0];
        ecositema.code = data[i].split(';')[1];
        arrayEcosistema.push(ecositema);

        if (validateEcosistema(data[i].split(';')[0]) == false){
            arrayNameEcosistema.push(data[i].split(';')[0]);
        }
    }

    reloadCodeCIIU(arrayNameEcosistema[1]);

    $.ajax({
        url: 'assets/data/dataset.csv',
        dataType: 'text',
        contentType: 'charset-utf-8'
    }).done(loadData);
}

function loadData(data) {
    data = data.split(/\r?\n|\r/);
    var afilado = 0;
    var numberEmployees = 0;
    var income = 0;

    for (var i = 0; i < data.length; i++){
        if (arrayCIIU.indexOf(data[i].split(';')[7]) != -1) {
            arrayBusinesses.push(data[i].split(';'));
            if (!isNaN(data[i].split(';')[11])) {
                income = income + parseInt(data[i].split(';')[11], 10);
            }

            if (data[i].split(';')[14] != undefined) {
                numberEmployees = numberEmployees + parseInt(data[i].split(';')[14],10);
            }

            if (data[i].split(';')[13] == 'AFILIADO'){
                afilado++;
            }

            if (validateSector(data[i].split(';')[10]) == false){
                var sector = new Object();
                sector.name = data[i].split(';')[10];
                sector.quantity = 0;
                arraySectors.push(sector);
            }
            if (validateCity(data[i].split(';')[5]) == false){
                var newCity = new Object();
                newCity.name = data[i].split(';')[5];
                newCity.quantity = 0;
                arrayCities.push(newCity);
            }
            if (validatePerson(data[i].split(';')[2]) == false){
                var person = new Object();
                person.name = data[i].split(';')[2];
                person.quantity = 0;
                arrayPersons.push(person);
            }
        }
    }

    document.getElementById('numBusiness').innerHTML = arrayBusinesses.length;
    document.getElementById('numberEmployess').innerHTML = numberEmployees;
    document.getElementById('numeroAfiliados').innerHTML = afilado;
    document.getElementById('ecosistemas').innerHTML = '<option value="">Seleccione un sector...</option>';
    addOptions('ecosistemas', arrayNameEcosistema);


    countSector();
    countCity();
    ordenCities();
    if (arrayCities.length > 0) {
        graphCities(createDataset(arrayCities));
        countPerson();
        graphPersons();
        porcentualPersons();
    }
}

function loadTwo(data) {
    arrayBusinesses = new Array();
    arraySectors = new Array();
    arrayCities = new Array();
    arrayPersons = new Array();
    data = data.split(/\r?\n|\r/);
    var afilado=0;
    var numberEmployees = 0;
    var income=0;

    for (var i = 0; i < data.length; i++){
        if (arrayCIIU.indexOf(data[i].split(';')[7]) != -1) {
            arrayBusinesses.push(data[i].split(';'));

            if (!isNaN(data[i].split(';')[11])) {
                income = income + parseInt(data[i].split(';')[11], 10);
            }

            if (data[i].split(';')[14] != undefined) {
                numberEmployees = numberEmployees + parseInt(data[i].split(';')[14],10);
            }

            if (data[i].split(';')[13] == 'AFILIADO'){
                afilado++;
            }

            if (validateSector(data[i].split(';')[10]) == false){
                var sector = new Object();
                sector.name = data[i].split(';')[10];
                sector.quantity = 0;
                arraySectors.push(sector);
            }
            if (validateCity(data[i].split(';')[5]) == false){
                var newCity = new Object();
                newCity.name = data[i].split(';')[5];
                newCity.quantity = 0;
                arrayCities.push(newCity);
            }
            if (validatePerson(data[i].split(';')[2]) == false){
                var person = new Object();
                person.name = data[i].split(';')[2];
                person.quantity = 0;
                arrayPersons.push(person);
            }
        }
    }

    document.getElementById('numBusiness').innerHTML = arrayBusinesses.length;
    document.getElementById('numberEmployess').innerHTML = numberEmployees;
    document.getElementById('numeroAfiliados').innerHTML = afilado;


    countSector();
    countCity();
    ordenCities();
    updateGraph(createDataset(arrayCities));
    countPerson();
    graphPersons();
    porcentualPersons();
}

function graphCities(dataset) {
    var barChartData = {
        labels: ['Municipios'],
        datasets: dataset
    };

    var ctx = document.getElementById('canvas').getContext('2d');
    window.myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
            responsive: true,
            legend: {
                position: 'right',
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function graphPersons(dataPersons) {
	
	var total1=0;
	for(var j = 0; j < arrayPersons.length; j++){
		total1=total1+arrayPersons[j].quantity;		
	}
    var config = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    arrayPersons[0].quantity,
                    arrayPersons[1].quantity,
                    arrayPersons[2].quantity,
                    arrayPersons[3].quantity,
                    arrayPersons[4].quantity
                ],
                backgroundColor: [
                    window.chartColors.red,
                    window.chartColors.orange,
                    window.chartColors.yellow,
                    window.chartColors.green,
                    window.chartColors.blue,
                ]
            }],
            labels: [
                arrayPersons[0].name+" : "+(Number.parseFloat(((arrayPersons[0].quantity/total1)*100)).toFixed(1))+"% ",
                arrayPersons[1].name+" : "+(Number.parseFloat(((arrayPersons[1].quantity/total1)*100)).toFixed(1))+"% ",
                arrayPersons[2].name+" : "+(Number.parseFloat(((arrayPersons[2].quantity/total1)*100)).toFixed(1))+"% ",
                arrayPersons[3].name+" : "+(Number.parseFloat(((arrayPersons[3].quantity/total1)*100)).toFixed(1))+"% ",
                arrayPersons[4].name+" : "+(Number.parseFloat(((arrayPersons[4].quantity/total1)*100)).toFixed(1))+"% "
            ]
        },
        options: {
            responsive: true,
            legend: {
                position: 'right',
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };
	

    var ctx = document.getElementById('chart-area').getContext('2d');
    window.myDoughnut = new Chart(ctx, config);
}

function createDataset(arrayGraph) {
    var dataset = Array();
	var total=0;
	for(var j = 0; j < arrayGraph.length; j++){
		total=total+arrayGraph[j].quantity;		
	}
		
    var color = Chart.helpers.color;
    var colorNames = Object.keys(window.chartColors);
    for (var i = 0; i < 7; i++) {
		var porcentaje=Number.parseFloat(((arrayGraph[i].quantity/total)*100)).toFixed(1);
		
        var colorName = colorNames[dataset.length % colorNames.length];
        var dsColor = window.chartColors[colorName];
        var newDataset = {
            label: arrayGraph[i].name+" : "+porcentaje+"% ",
            backgroundColor: color(dsColor).alpha(0.5).rgbString(),
            borderColor: dsColor,
            borderWidth: 1,
            data: [arrayGraph[i].quantity]
			
        };
        dataset.push(newDataset);
    }

    return dataset;
}

function countSector() {
    for (var i = 0; i < arrayBusinesses.length; i++){
        for (var j = 0; j < arraySectors.length; j++){
            if (arraySectors[j].name == arrayBusinesses[i][10]){
                arraySectors[j].quantity = arraySectors[j].quantity + 1;
            }
        }
    }
}


function countCity() {
    for (var i = 0; i < arrayBusinesses.length; i++){
        for (var j = 0; j < arrayCities.length; j++){
            if (arrayCities[j].name == arrayBusinesses[i][5]){
                arrayCities[j].quantity = arrayCities[j].quantity + 1;
            }
        }
    }
}

function countPerson() {
    for (var i = 0; i < arrayBusinesses.length; i++){
        for (var j = 0; j < arrayPersons.length; j++){
            if (arrayPersons[j].name == arrayBusinesses[i][2]){
                arrayPersons[j].quantity = arrayPersons[j].quantity + 1;
            }
        }
    }
}

function getMaxSector() {
    var sector = arraySectors[0];
    for (var i = 0; i < arraySectors.length; i++){
        if (sector.quantity < arraySectors[i].quantity){
            sector = arraySectors[i];
        }
    }
    return sector;
}

function reloadCodeCIIU(ecositema) {
    arrayCIIU = [];
    for (var i = 0; i < arrayEcosistema.length; i++){
        if (arrayEcosistema[i].name == ecositema) {
            arrayCIIU.push(arrayEcosistema[i].code);
        }
    }
}

function validateEcosistema(name) {
    var validate = new Boolean(false);
    for (var i = 0; i < arrayNameEcosistema.length; i++){
        if (arrayNameEcosistema[i] == name){
            validate = true;
            i = arrayNameEcosistema.length;
        }
    }
    return validate;
}

function validateSector(sector) {
    var validate = new Boolean(false);
    for (var i = 0; i < arraySectors.length; i++){
        if (arraySectors[i].name == sector){
            validate = true;
            i = arraySectors.length;
        }
    }
    return validate;
}

function validateCity(city) {
    var validate = new Boolean(false);
    for (var i = 0; i < arrayCities.length; i++){
        if (arrayCities[i].name == city){
            validate = true;
            i = arrayCities.length;
        }
    }
    return validate;
}

function validatePerson(person) {
    var validate = new Boolean(false);
    for (var i = 0; i < arrayPersons.length; i++){
        if (arrayPersons[i].name == person){
            validate = true;
            i = arrayPersons.length;
        }
    }
    return validate;
}

function ordenCities() {
    arrayCities.sort(function (cityA, cityB) {
        if (cityA.quantity < cityB.quantity) {
            return 1;
        }
        if (cityA.quantity > cityB.quantity) {
            return -1;
        }
        return 0;
    });
}

function addOptions(domElement, array) {
    var select = document.getElementsByName(domElement)[0];
    for (value in array) {
        var option = document.createElement("option");
        option.text = array[value];
        select.add(option);
    }
}

function porcentualPersons(){
    for (var i = 0; i < arrayPersons.length; i++){
        arrayPersons[i].quantity = (arrayPersons[i].quantity * 100) / arrayBusinesses.length;
    }
}

function updateGraph(dataset) {
    var barChartData = {
        labels: ['Sectores'],
        datasets: dataset
    };

    window.myBar.data = barChartData;
    window.myBar.update();
}

function selectEcosistema(nameSelect){
    reloadCodeCIIU(arrayNameEcosistema[nameSelect.selectedIndex - 1]);
    $.ajax({
        url: 'assets/data/dataset.csv',
        dataType: 'text',
        contentType: 'charset-utf-8'
    }).done(loadTwo);
}

$.ajax({
    url: 'assets/data/datasetEcosistemas.csv',
    dataType: 'text',
    contentType: 'charset-utf-8'
}).done(loadDataEcosistema);