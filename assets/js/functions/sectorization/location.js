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

var arrayBusinesses = Array();
var arraySectors = Array();
var arrayCities = Array();
var arrayPersons = Array();

function loadData(data) {
    data = data.split(/\r?\n|\r/);

    var afilado=0;
    var numberEmployees = 0;
    var income=0;

    for (var i = 0; i < data.length; i++){
        arrayBusinesses.push(data[i].split(';'));

        if (!isNaN(data[i].split(';')[11])) {
            income = income + parseInt(data[i].split(';')[11], 10);
        }

        if (data[i].split(';')[14] != undefined) {
            numberEmployees = numberEmployees + parseInt(data[i].split(';')[14],10);
            
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

    countSector();
    countCity();
    ordenCities();
    table(arrayCities, arrayCities[0].name);
    graphCities(createDataset(arrayCities));
    countPerson();
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
                position: 'bottom',
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

function table(dataset, nameCity) {
    var table = document.getElementById('dataTable');

    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }

    var TotalSector=0;
    for (var i = 0; i < dataset.length; i++) {
        TotalSector=TotalSector+dataset[i].quantity;
    }

    var tblBody = document.createElement("tbody");

    for (var i = 0; i < dataset.length; i++) {
        var tr = document.createElement("tr");
        tr.className = "gradeA";
        var textCity = document.createTextNode(nameCity);

        var textSector = document.createTextNode(dataset[i].name);
        var sector = document.createElement("td");
        sector.appendChild(textSector);
        var textQuantity = document.createTextNode(dataset[i].quantity);
        var quantity = document.createElement("td");
        quantity.appendChild(textQuantity);
        var porcentaje=Number.parseFloat(((dataset[i].quantity/TotalSector)*100)).toFixed(1);
        var textPercent = document.createTextNode(porcentaje);
        var percent = document.createElement("td");
        percent.appendChild(textPercent);


        tr.appendChild(sector);
        tr.appendChild(quantity);
        tr.appendChild(percent);
        tblBody.appendChild(tr);
    }

    table.appendChild(tblBody);
}

function createDataset(arrayGraph) {
    var dataset = Array();
	var total=0;
	for(var j = 0; j < arrayGraph.length; j++){
		total=total+arrayGraph[j].quantity;		
	}
		
    var color = Chart.helpers.color;
    var colorNames = Object.keys(window.chartColors);
    for (var i = 0; i < 10; i++) {
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

function porcentualPersons(){
    for (var i = 0; i < arrayPersons.length; i++){
        arrayPersons[i].quantity = (arrayPersons[i].quantity * 100) / arrayBusinesses.length;
    }
}

$.ajax({
    url: 'assets/data/dataset.csv',
    dataType: 'text',
    contentType: 'charset-utf-8'
}).done(loadData);