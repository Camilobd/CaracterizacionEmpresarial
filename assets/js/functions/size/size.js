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


var arraySize = Array();
var arraySector = Array();

function loadData(data) {
    data = data.split(/\r?\n|\r/);

    var afilado=0;
    var numberEmployees = 0;
    var jobs = 0;
    var little=0;
    var middle=0;
    var micro=0;
    var total=0;

    total=data.length;

    for (var i = 0; i < data.length; i++){

        if (data[i].split(';')[15]=='MICRO'){
            micro=micro+1;
        }else if (data[i].split(';')[15]=='MEDIANA'){
            middle=middle+1;
        }

        if (validateSize(data[i].split(';')[15],data[i].split(';')[10]) == false){
            var newSize = new Object();
            newSize.nameSector=data[i].split(';')[10];
            newSize.name = data[i].split(';')[15];
            newSize.size = sizeNumber(data, data[i].split(';')[15],data[i].split(';')[10]);
            arraySize.push(newSize);
        }

        if (validateSector(data[i].split(';')[10]) == false){
            var newSector = new Object();
            var nameSector=data[i].split(';')[10];
            newSector.nameSector=nameSector;
            newSector.size = sizeNumber(data, data[i].split(';')[15] ,data[i].split(';')[10]);
            arraySector.push(newSector);
        }

    }

    little=total-micro-middle;
    document.getElementById('Pequeña').innerHTML = little;
    document.getElementById('Micro').innerHTML = micro;
    document.getElementById('Mediana').innerHTML = middle;
    document.getElementById('Total').innerHTML = total+ "  - Empresarios registrados";

    ordenArray(arraySize);
    ordenArraySector(arraySector);
    table(arraySize);
    graphsize(arraySize, arraySector);

}

function sizeNumber(data, name, sector) {
    var cont=0;
    for (var i = 0; i < data.length; i++){
        if (sector==data[i].split(';')[10] && data[i].split(';')[15]==name){
            cont=cont+1;
        }
    }
    return cont;
}

function loadArray(dataset,datasector,tamano) {
    var arrayData = Array();
    for (var i = 0; i < datasector.length; i++){
        for (var j = 0; j < dataset.length; j++){


            if (dataset[j].nameSector==datasector[i].nameSector && dataset[j].name==tamano){
                var newData = new Object();
                newData.nameSector=dataset[j].nameSector+" - "+dataset[j].name;
                newData.size = dataset[j].size;
                arrayData.push(newData);

            }
        }

    }


    return arrayData;
}

function graphsize(dataset,dataSector){

    var arrayMicro = Array();
    var arrayMediana = Array();
    var arrayPequeña = Array();

    arrayMicro=loadArray(dataset,dataSector,"MICRO");
    arrayMediana=loadArray(dataset,dataSector,"MEDIANA");
    arrayPequeña=loadArray(dataset,dataSector,"PEQUEÑA");


    var barChartData = {
        labels: [dataSector[0].nameSector.substr(0,30),
            dataSector[1].nameSector.substr(0,30),
            dataSector[2].nameSector.substr(0,30),
            dataSector[3].nameSector.substr(0,30),
            dataSector[4].nameSector.substr(0,30),
            dataSector[5].nameSector.substr(0,30)
        ],
        datasets: [{
            label: 'Micro',
            backgroundColor: window.chartColors.red,
            data: [
                arrayMicro[0].size,
                arrayMicro[1].size,
                arrayMicro[2].size,
                arrayMicro[3].size,
                arrayMicro[4].size,
                arrayMicro[5].size
            ]
        }, {
            label: 'Pequeña',
            backgroundColor: window.chartColors.blue,
            data: [
                arrayPequeña[0].size,
                arrayPequeña[1].size,
                arrayPequeña[2].size,
                arrayPequeña[3].size,
                arrayPequeña[4].size,
                arrayPequeña[5].size
            ]
        }, {
            label: 'Mediana',
            backgroundColor: window.chartColors.green,
            data: [
                arrayMediana[0].size,
                arrayMediana[1].size,
                arrayMediana[2].size,
                arrayMediana[3].size,
                arrayMediana[4].size,
                arrayMediana[5].size

            ]
        }]

    };

    var ctx = document.getElementById('canvas').getContext('2d');

        window.myBar = new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {

                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                responsive: true,
                legend: {
                    position: 'top',
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                    }
                }
            }
        });


}

function table(dataset) {
    var table = document.getElementById('dataTable');


    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }1

    var total=0;
    for (var i = 0; i < dataset.length; i++) {
        total=total+dataset[i].size;
    }

    var tblBody = document.createElement("tbody");

    for (var i = 0; i < dataset.length; i++) {
        var tr = document.createElement("tr");
        tr.className = "gradeA";

        var textSector = document.createTextNode(dataset[i].nameSector);
        var sector = document.createElement("td");
        sector.appendChild(textSector);
        var textSize = document.createTextNode(dataset[i].name);
        var nameSize = document.createElement("td");
        nameSize.appendChild(textSize);
        var textQuantity = document.createTextNode(dataset[i].size);
        var quantity = document.createElement("td");
        quantity.appendChild(textQuantity);
        var porcentaje=Number.parseFloat(((dataset[i].size/total)*100)).toFixed(1);
        var textPercent = document.createTextNode(porcentaje);
        var percent = document.createElement("td");
        percent.appendChild(textPercent);


        tr.appendChild(sector);
        tr.appendChild(nameSize);
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

function validateSize(size, sector) {
    var validate = new Boolean(false);
    for (var i = 0; i < arraySize.length; i++){
        if (arraySize[i].name == size &&arraySize[i].nameSector == sector ){
            validate = true;
            i = arraySize.length;
        }
    }
    return validate;
}
function validateSector(sector) {
    var validate = new Boolean(false);
    for (var i = 0; i < arraySector.length; i++){
        if (arraySector[i].nameSector == sector ){
            validate = true;
            i = arraySector.length;
        }
    }
    return validate;
}


function ordenArray(array) {
    array.sort(function (a, b) {
        if (a.name < b.name) {
            return 1;
        }
        if (a.name > b.name) {
            return -1;
        }
        return 0;
    });
}

function ordenArraySector(array) {
    array.sort(function (a, b) {
        if (a.size < b.size) {
            return 1;
        }
        if (a.size > b.size) {
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