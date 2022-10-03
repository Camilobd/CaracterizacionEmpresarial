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
* */

var arrayBusinesses  = Array();
var arraySectors = Array();
var arrayCities = Array();
var barChartData;
var totalBusinesses = 0;

function loadData(data) {
    data = data.split(/\r?\n|\r/);

    for (var i = 0; i < data.length; i++){
        arrayBusinesses.push(data[i].split(';'));
        if (validateCity(data[i].split(';')[5]) == false){
            var city = new Object();
            city.name = data[i].split(';')[5];
            city.quantity = 0;
            arrayCities.push(city);
        }
    }

    addOptions('cities', arrayCities);
    countSector(arrayCities[0].name);
    document.getElementById('city').innerHTML = arrayCities[0].name + ', ' + totalBusinesses + ' negocios';
    ordenSector();
    table(arraySectors, arrayCities[0].name);
    graphSector(createDataset(arraySectors));
	
	document.getElementById('city').innerHTML = arrayCities[0].name + ', ' + totalBusinesses + ' registros';
	
}

function graphSector(dataset) {
    var barChartData = {
        labels: ['Sectores'],
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

function updateGraphSector(dataset) {
    var barChartData = {
        labels: ['Sectores'],
        datasets: dataset
    };

    window.myBar.data = barChartData;
    window.myBar.update();
}

function table(dataset, nameCity) {
    var table = document.getElementById('dataTable');

    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
	
    var tblBody = document.createElement("tbody");

    for (var i = 0; i < dataset.length; i++) {
        var tr = document.createElement("tr");
        tr.className = "gradeA";
        var textCity = document.createTextNode(nameCity);
        var city = document.createElement("td");
        city.appendChild(textCity);
        var textSector = document.createTextNode(dataset[i].name);
        var sector = document.createElement("td");
        sector.appendChild(textSector);
        var textQuantity = document.createTextNode(dataset[i].quantity);
        var quantity = document.createElement("td");
		quantity.appendChild(textQuantity);
		var porcentaje=Number.parseFloat(((dataset[i].quantity/totalBusinesses)*100)).toFixed(1);
		var textPercent = document.createTextNode(porcentaje);
		var percent = document.createElement("td");
		percent.appendChild(textPercent);
        
        tr.appendChild(city);
        tr.appendChild(sector);
        tr.appendChild(quantity);
		tr.appendChild(percent);
        tblBody.appendChild(tr);
    }

    table.appendChild(tblBody);
}

function createDataset(arrayGraph) {
    var dataset = Array();
    var color = Chart.helpers.color;
    var colorNames = Object.keys(window.chartColors);
    var limitGraph = 0;
	
	var total=0;
	for(var j = 0; j < arrayGraph.length; j++){
		total=total+arrayGraph[j].quantity;
	}
	
    if (arrayGraph.length > 6) {
        limitGraph = 6;
    } else {
        limitGraph = arrayGraph.length;
    }
    for (var i = 0; i < limitGraph; i++) {
        var colorName = colorNames[dataset.length % colorNames.length];
        var dsColor = window.chartColors[colorName];
		var porcentaje=Number.parseFloat(((arrayGraph[i].quantity/total)*100)).toFixed(1);
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

function countSector(nameCity) {
    for (var i = 0; i < arrayBusinesses.length; i++){
        if (arrayBusinesses[i][5] == nameCity){
            if (validateSector(arrayBusinesses[i][10]) == false){
                var sector = new Object();
                sector.name = arrayBusinesses[i][10];
                sector.quantity = 1;
                arraySectors.push(sector);
				totalBusinesses++;
            } else {
                for (var j = 0; j < arraySectors.length; j++){
					if (arraySectors[j].name == arrayBusinesses[i][10]){
						arraySectors[j].quantity = arraySectors[j].quantity + 1;
						totalBusinesses++;
                        
                    }
					
                }
				
            }
        }
    }
	
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

function addOptions(domElement, array) {
    var select = document.getElementsByName(domElement)[0];
    for (value in array) {
        var option = document.createElement("option");
        option.text = array[value].name;
        select.add(option);
    }
}

function ordenSector() {
    arraySectors.sort(function (sectorA, sectorB) {
        if (sectorA.quantity < sectorB.quantity) {
            return 1;
        }
        if (sectorA.quantity > sectorB.quantity) {
            return -1;
        }
        return 0;
    });
}

function clearSectors() {
    for (var i = 0; i < arraySectors.length; i++){
        arraySectors[i].quantity = 0;
    }
}

function selectCity(arrayCities){
    arraySectors = Array();
    totalBusinesses = 0;
    clearSectors();
	
    countSector(arrayCities[arrayCities.selectedIndex].value);
	console.log("Valor total: "+totalBusinesses);
    ordenSector();
    table(arraySectors, arrayCities[arrayCities.selectedIndex].value);
    updateGraphSector(createDataset(arraySectors));
	
	document.getElementById('city').innerHTML = arrayCities[arrayCities.selectedIndex].value + ', ' + totalBusinesses + ' Registros';
}

$.ajax({
    url: 'assets/data/dataset.csv',
    dataType: 'text',
    contentType: 'charset-utf-8'
}).done(loadData);