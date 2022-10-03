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
var arraySubSectors = Array();
var arrayCities = Array();
var barChartData;
var nameCity;

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

    countSector(arrayCities[0].name);
    addOptions('cities', arrayCities);
    document.getElementById('sectors').innerHTML = arraySectors[0].name;
    addOptions('sectors', arraySectors);
    nameCity = arrayCities[0].name;
    ordenArray(arraySectors);
    countSubSector(arrayCities[0].name, arraySectors[0].name);
    ordenArray(arraySubSectors);
    
    

	var TotalSector=0;
    for (var i = 0; i < arraySubSectors.length; i++) {
        TotalSector=TotalSector+arraySubSectors[i].quantity;
    }
    	
	var todo = arraySectors[0].name+" - "+ TotalSector+" Registros";
    document.getElementById('TotalSector').innerHTML = todo;
    table(arraySubSectors, arrayCities[0].name, arraySectors[0].name);
	
    graphSector(createDataset(arraySubSectors));
}

function graphSector(dataset) {
    var barChartData = {
        labels: ['Subsectores Economicos'],
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
        labels: ['Subsectores Economicos'],
        datasets: dataset
    };

    window.myBar.data = barChartData;
    window.myBar.update();
}

function table(dataset, nameCity, nameSector) {
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
        var city = document.createElement("td");
        city.appendChild(textCity);
        var textSector = document.createTextNode(nameSector);
        var sector = document.createElement("td");
        sector.appendChild(textSector);
        var textSubSector = document.createTextNode(dataset[i].name);
        var subSector = document.createElement("td");
        subSector.appendChild(textSubSector);
        var textQuantity = document.createTextNode(dataset[i].quantity);
        var quantity = document.createElement("td");
        quantity.appendChild(textQuantity);
		var porcentaje=Number.parseFloat(((dataset[i].quantity/TotalSector)*100)).toFixed(1);
		console.log(TotalSector);
		console.log(porcentaje);
		var textPercent = document.createTextNode(porcentaje);
		var percent = document.createElement("td");
		percent.appendChild(textPercent);
		
        
		tr.appendChild(city);
        tr.appendChild(sector);
        tr.appendChild(subSector);
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
    console.log(limitGraph);
    for (var i = 0; i < limitGraph; i++) {
        var colorName = colorNames[dataset.length % colorNames.length];
		var porcentaje=Number.parseFloat(((arrayGraph[i].quantity/total)*100)).toFixed(1);
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

function countSector(nameCity) {
    for (var i = 0; i < arrayBusinesses.length; i++){
        if (arrayBusinesses[i][5] == nameCity){
            if (validateSector(arrayBusinesses[i][10]) == false){
                var sector = new Object();
                sector.name = arrayBusinesses[i][10];
                sector.quantity = 1;
                arraySectors.push(sector);
            } else {
                for (var j = 0; j < arraySectors.length; j++){
                    if (arraySectors[j].name == arrayBusinesses[i][10]){
                        arraySectors[j].quantity = arraySectors[j].quantity + 1;
                    }
                }
            }
        }
    }
}

function countSubSector(nameCity, sector) {
    for (var i = 0; i < arrayBusinesses.length; i++){
        if (arrayBusinesses[i][5] == nameCity && arrayBusinesses[i][10] == sector){
            if (validateSubSector(arrayBusinesses[i][9]) == false){
                var subSector = new Object();
                subSector.name = arrayBusinesses[i][9];
                subSector.quantity = 1;
                arraySubSectors.push(subSector);
            } else {
                for (var j = 0; j < arraySubSectors.length; j++){
                    if (arraySubSectors[j].name == arrayBusinesses[i][9]){
                        arraySubSectors[j].quantity = arraySubSectors[j].quantity + 1;
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

function validateSubSector(subSector) {
    var validate = new Boolean(false);
    for (var i = 0; i < arraySubSectors.length; i++){
        if (arraySubSectors[i].name == subSector){
            validate = true;
            i = arraySubSectors.length;
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

function ordenArray(array) {
    array.sort(function (a, b) {
        if (a.quantity < b.quantity) {
            return 1;
        }
        if (a.quantity > b.quantity) {
            return -1;
        }
        return 0;
    });
}

function selectCity(arrayCities){
    sector = arrayCities[arrayCities.selectedIndex].value;
    arraySectors = Array();
    countSector(arrayCities[arrayCities.selectedIndex].value);
    ordenArray(arraySectors);
    document.getElementById('sectors').innerHTML = '<option value="">Seleccione un sector...</option>';
    addOptions('sectors', arraySectors);
    nameCity = arrayCities[arrayCities.selectedIndex].value;
}

function selectSector(arraySectors){
	arraySubSectors = Array();
    countSubSector(nameCity, arraySectors[arraySectors.selectedIndex].value);
    ordenArray(arraySubSectors);
	var TotalSector=0;
    for (var i = 0; i < arraySubSectors.length; i++) {
        TotalSector=TotalSector+arraySubSectors[i].quantity;
    }
	var todo;
    todo=arraySectors[arraySectors.selectedIndex].value+" - "+ TotalSector + " Registros"
	document.getElementById('TotalSector').innerHTML = todo;
    table(arraySubSectors, nameCity, arraySectors[arraySectors.selectedIndex].value);
    updateGraphSector(createDataset(arraySubSectors));
}

$.ajax({
    url: 'assets/data/dataset.csv',
    dataType: 'text',
    contentType: 'charset-utf-8'
}).done(loadData);