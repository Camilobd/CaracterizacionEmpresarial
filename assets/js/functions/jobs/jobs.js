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
* [11]   INGRESOS
* [14]   AFILIADO
*
* */

var arrayBusinesses = Array();
var arraySectors = Array();
var arrayCities = Array();

function loadData(data) {
    data = data.split(/\r?\n|\r/);
    var afilado=0;
    var numberEmployees = 0;
    var jobs = 0;

    for (var i = 0; i < data.length; i++){
        arrayBusinesses.push(data[i].split(';'));

        if (!isNaN(data[i].split(';')[14])) {
            jobs = jobs + parseInt(data[i].split(';')[14], 10);
        }
        if (validateSector(data[i].split(';')[10]) == false){
            var sector = new Object();
            sector.name = data[i].split(';')[10];
            sector.jobs = 0;
            arraySectors.push(sector);
        }
        if (validateCity(data[i].split(';')[5]) == false){
            var newCity = new Object();
            newCity.name = data[i].split(';')[5];
            newCity.jobs = 0;
            arrayCities.push(newCity);
        }
    }



    document.getElementById('jobs').innerHTML = new Intl.NumberFormat().format(jobs);

    countSector();
    ordenArray(arraySectors);
    table(arraySectors, arrayCities[0].name);
    graphSector(createDataset(arraySectors));
    countCity();
    graphCities();
}

function graphSector(dataset) {
    var barChartData = {
        labels: ['Empleados'],
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

function table(dataset, nameCity) {
    var table = document.getElementById('dataTable');

    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }

    var TotalSector=0;
    for (var i = 0; i < dataset.length; i++) {
        TotalSector=TotalSector+dataset[i].jobs;
    }

    var tblBody = document.createElement("tbody");

    for (var i = 0; i < dataset.length; i++) {
        var tr = document.createElement("tr");
        tr.className = "gradeA";
        var textCity = document.createTextNode(nameCity);

        var textSector = document.createTextNode(dataset[i].name);
        var sector = document.createElement("td");
        sector.appendChild(textSector);
        var textQuantity = document.createTextNode(dataset[i].jobs);
        var quantity = document.createElement("td");
        quantity.appendChild(textQuantity);
        var porcentaje=Number.parseFloat(((dataset[i].jobs/TotalSector)*100)).toFixed(2);
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
    var color = Chart.helpers.color;
    var colorNames = Object.keys(window.chartColors);

    var total=0;
    for(var j = 0; j < arrayGraph.length; j++){
        total=total+arrayGraph[j].jobs;
    }


    for (var i = 0; i < 6; i++) {
        var porcentaje=Number.parseFloat(((arrayGraph[i].jobs/total)*100)).toFixed(1);
        var colorName = colorNames[dataset.length % colorNames.length];
        var dsColor = window.chartColors[colorName];
        var newDataset = {
            label: arrayGraph[i].name+" : "+porcentaje+"% ",
            backgroundColor: color(dsColor).alpha(0.5).rgbString(),
            borderColor: dsColor,
            borderWidth: 1,
            data: [arrayGraph[i].jobs]
        };
        dataset.push(newDataset);
    }

    return dataset;
}

function graphCities() {
    var total1=0;
    for(var j = 0; j < arrayCities.length; j++){
        total1=total1+arrayCities[j].jobs;
    }

    var config = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    arrayCities[0].jobs,
                    arrayCities[1].jobs,
                    arrayCities[2].jobs,
                    arrayCities[3].jobs,
                    arrayCities[4].jobs,
                    arrayCities[5].jobs,
                    arrayCities[6].jobs
                ],
                backgroundColor: [
                    '#ffcc56',
                    '#ff9f40',
                    '#ff6384',
                    '#4bc0c0',
                    '#36a3eb',
                    '#FFB2E6',
                    '#565656'
                ]
            }],
            labels: [
                arrayCities[0].name+" : "+(Number.parseFloat(((arrayCities[0].jobs/total1)*100)).toFixed(1))+"% ",
                arrayCities[1].name+" : "+(Number.parseFloat(((arrayCities[1].jobs/total1)*100)).toFixed(1))+"% ",
                arrayCities[2].name+" : "+(Number.parseFloat(((arrayCities[2].jobs/total1)*100)).toFixed(1))+"% ",
                arrayCities[3].name+" : "+(Number.parseFloat(((arrayCities[3].jobs/total1)*100)).toFixed(1))+"% ",
                arrayCities[4].name+" : "+(Number.parseFloat(((arrayCities[4].jobs/total1)*100)).toFixed(1))+"% ",
                arrayCities[5].name+" : "+(Number.parseFloat(((arrayCities[5].jobs/total1)*100)).toFixed(1))+"% ",
                arrayCities[6].name+" : "+(Number.parseFloat(((arrayCities[6].jobs/total1)*100)).toFixed(1))+"% "
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

function countSector() {
    for (var i = 0; i < arrayBusinesses.length; i++){
        for (var j = 0; j < arraySectors.length; j++){
            if (arraySectors[j].name == arrayBusinesses[i][10]){
                if (!isNaN(arrayBusinesses[i][14])){
                    arraySectors[j].jobs = arraySectors[j].jobs + (parseInt(arrayBusinesses[i][14], 10));
                }
            }
        }
    }
}


function countCity() {
    for (var i = 0; i < arrayBusinesses.length; i++){
        for (var j = 0; j < arrayCities.length; j++){
            if (arrayCities[j].name == arrayBusinesses[i][5]){
                if (!isNaN(arrayBusinesses[i][14])){
                    arrayCities[j].jobs = arrayCities[j].jobs + (parseInt(arrayBusinesses[i][14], 10));
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


function ordenArray(array) {
    array.sort(function (a, b) {
        if (a.jobs < b.jobs) {
            return 1;
        }
        if (a.jobs > b.jobs) {
            return -1;
        }
        return 0;
    });
}

function porcentualCities(){
    for (var i = 0; i < arrayPersons.length; i++){
        arrayCities[i].jobs = (arrayCities[i].jobs * 100) / arrayBusinesses.length;
    }
}

$.ajax({
    url: 'assets/data/dataset.csv',
    dataType: 'text',
    contentType: 'charset-utf-8'
}).done(loadData);