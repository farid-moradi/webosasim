function arrayEqual(ar1,ar2) {
    if(ar1.length !== ar2.length){
        return false;
    }
    for(var i = ar1.length;i--;){
        if(ar1[i] !== ar2[i])
            return false;
    }
    return true;
}
function isItemInArray(array, item3) {
    for(var item in array)
    {
        if(arrayEqual(array[item],item3)){
            return item;
        }
    }
}
function executeDeadLock() {
    var allocationTemp = [];
    var maxTemp = [];
    for(var item in allocationTemp)
    {
        allocationTemp[item]=[];
    }
    for(var item in maxTemp)
    {
        maxTemp[item]=[];
    }
    var x1 = document.getElementsByClassName("addProcess-button");
    x1[0].style.visibility = "visible";
    var x1 = document.getElementsByClassName("addResource-button");
    x1[0].style.visibility = "visible";
    var x1 = document.getElementsByClassName("graphshow-button");
    x1[0].style.visibility = "visible";
    var x1 = document.getElementsByClassName("banker-button");
    x1[0].style.visibility = "visible";

    var columnNames = ['Process'];
    for(var item in resources) {
        columnNames.push(resources[item]);
    }

    var text = '#Max .table';
    var text2 = 'Max';
    showTableMax(text,text2);


    text = '#Allocation .table';
    text2 = 'Allocation';
    showTableAllocation(text,text2);

    text = '#Existing .table';
    text2 = 'Existing';
    showTableExisting(text,text2);
    //Banker Algorithm and event handler...
    var bankerB = document.getElementsByClassName('banker-button')[0];
    var x = document.getElementById('algorithms');
    bankerB.onclick = function () {
        var selected = x.options[x.selectedIndex].value;
        if(selected == 'banker') {
            var bbut = document.getElementsByClassName('banker-button');
            bbut[0].style.pointerEvents = 'none';
            bbut[0].style.opacity = '0.4';
            var first = document.getElementById('firstInfo');
            var lin = document.createElement('hr');
            lin.style.marginTop = '14px';
            lin.style.backgroundColor = 'white';
            lin.style.color = 'white';
            insertAfter(lin, first);
            var sec = document.getElementById("secondInfo");
            var y = sec.getElementsByTagName('p');
            for (var i = 0; i < 3; i++) {
                y[i].style.visibility = 'visible';
            }

            text = '#Need .table';
            text2 = 'Need';
            showTableNeed(text, text2);

            text = '#Possessed .table';
            text2 = 'Possessed';
            showTablePossessed(text, text2);

            text = '#Available .table';
            text2 = 'Available';
            showTableAvailable(text, text2);

            //main Banker Algorithm...
            if(safetyExam(need, available, allocation)){
            resourceRequest();}
        }
        else if(selected == 'hafman')
            optionM2();

    }
}
//Resource Request Algorithm
function resourceRequest() {
    var x = document.getElementById('thirdInfo');
    x.style.visibility = 'visible';
    Request(request);
    var text = "#Request .table";
    showTableRequest(text);
    var mw = document.getElementById("mainWindow");
    mw.scrollTop = mw.scrollHeight;
    document.getElementsByClassName('request-button')[0].onclick = function () {
        this.style.visibility = 'hidden';

        //Step1 : check to see : Request[i] <= Need[i]
        var pr = request[0][0];
        var flag = true;
        for(var i = 1;i<= resources.length+1;i++){
            if(request[0][i] > need[pr][i]){
                flag = false;
            }
        }
        if (!flag) {
            alert("Requesting Process Fault...");
            return;
        }
         //Step2 : Request[i] <= Available
        else
        {
            flag = true;
            for(var i=0;i<resources.length;i++)
                if(request[0][i+1] > available[0][i])
                {
                    flag = false;
                }
            if (!flag){
                alert("Request Suspended...There Are Not Enough Resource.");
            }

            //When Request Accepted...
            else {
                pr = request[0][0];
                var parag = document.getElementById('explanation');
                for(var i=0;i<resources.length;i++)
                {
                    allocation[pr][i] += request[0][i+1];//allocation['p2'] = [1,0,0,0] and request['p2'] = ['p2',2,1,0,0] #example
                    need[pr][i+1] = need[pr][i+1] - request[0][i+1];//need ['p2'] = ['p2',1,1,1,1] #example
                    available[0][i] -= request[0][i+1];//available = [1,0,2,0]
                }
                if(safetyExam(need,available,allocation)) {
                    parag.innerHTML = "This State Is Safe..." + '<br>' + parag.innerText;

                    d3.select('#Available .table')
                        .selectAll('.row')
                        .selectAll('.cell')
                        .datum(available[0])
                        .text(function (d, i) {
                            if (parseInt(this.textContent) - d[i] == 0)
                                return this.textContent;
                            else {
                                this.style.color = 'red';
                                return d[i];
                            }
                        });
                    var neTemp = [];
                    for (var item in need) {
                        neTemp.push(need[item])
                    }
                    d3.select('#Need .table')
                        .selectAll('.row')
                        .selectAll('.cell')
                        .datum(neTemp)
                        .text(function (d, j, i) {
                            if (this.textContent - d[i][j] == 0 || j == 0)
                                return this.textContent;
                            else {
                                this.style.color = 'red';
                                return d[i][j];
                            }
                        })
                }
                else{
                    parag.innerHTML = "This State Is Not Safe...";
                    parag.style.color = 'red';
                    parag.style.marginLeft ='340px';


                    d3.select('#Available .table')
                        .selectAll('.row')
                        .selectAll('.cell')
                        .datum(available[0])
                        .text(function (d, i) {
                            if (parseInt(this.textContent) - d[i] == 0)
                                return this.textContent;
                            else {
                                this.style.color = 'red';
                                return d[i];
                            }
                        });
                    var neTemp = [];
                    for (var item in need) {
                        neTemp.push(need[item])
                    }
                    d3.select('#Need .table')
                        .selectAll('.row')
                        .selectAll('.cell')
                        .datum(neTemp)
                        .text(function (d, j, i) {
                            if (this.textContent - d[i][j] == 0 || j == 0)
                                return this.textContent;
                            else {
                                this.style.color = 'red';
                                return d[i][j];
                            }
                        })
                }
            }
        }
    };
    
}
//Safety Examine Algorithm...
function safetyExam(need, available, allocation) {
    var markProcess = [];
    var lessThanA = [];
    var flag;
    var needTemp = [];
    a = available[0].slice();

    var leftProcess = proccesses.slice();
    for(var j=0;j<proccesses.length;j++) {
        needTemp = [];
        lessThanA = [];

        //step1
        for (var item in leftProcess) {
            flag = true;
            needTemp = need[leftProcess[item]].slice(1, resources.length + 1);
            for (var i = 0; i < resources.length; i++) {
                if (needTemp[i] > a[i]) {
                    flag = false;
                }
            }
            if (flag) {
                lessThanA.push(need[leftProcess[item]][0]);
            }
        }

        //step2
        if(lessThanA.length != 0) {
            markProcess.push(lessThanA[0]);
            var index = leftProcess.indexOf(lessThanA[0]);
            leftProcess.splice(index, 1);
            for (var i = 0; i < resources.length; i++) {
                a[i] += parseInt(allocation[lessThanA[0]][i]);
            }
        }
    }

    var mw = document.getElementById("mainWindow");
    mw.scrollTop = mw.scrollHeight;
    var secend2 = document.getElementById("secondInfo");
    var parag = document.createElement('p');
    var parag1 = document.createElement('p');
    if(leftProcess.length == 0) {
        if(!(document.getElementById('explanation'))) {
            parag.innerHTML = "One Of The Safe Path Is : " + markProcess;
            parag.style.marginLeft = '300px';
            parag.style.marginTop = '0px';
            parag.style.marginBottom = '50px';
            parag.style.color = "blue";
            parag.style.fontSize = '20px';
            parag.id = 'explanation';
            insertAfter(parag, secend2);
        }
        return 1;
    }

    else {
        var thirdInfo = document.getElementById("thirdInfo");
        parag1.innerHTML = "There is no safe path";
        parag1.style.marginLeft = '340px';
        parag1.style.marginTop = '0px';
        parag1.style.marginBottom = '50px';
        parag1.style.color = "red";
        parag1.style.fontSize = '20px';
        parag1.id = 'explanation';
        insertAfter(parag1, secend2);
        thirdInfo.style.display = 'none';
        return 0;
    }
}
function showTableMax(idTemp,arr) {
    var maxTemp = [];
    var columnNames = ['Process'];
    for(var item in resources) {
        columnNames.push(resources[item]);
    }
    var tableMax = Table()
        .on('edit', function (d) {
            updateTableMax([d, columnNames]);
            for(var i=0; i<proccesses.length; i++){
                max[proccesses[i]] = d[i];
            }
        });
    function updateTableMax(_data) {
        d3.select(idTemp)
            .datum(_data)
            .call(tableMax);
        var y = document.getElementById(arr);
        var x = y.getElementsByClassName('cell');
        for(var i=0;i<((proccesses.length)*(resources.length+1));i++)
        {
            if(!(i%(resources.length+1)))
            {
                x[i].style.backgroundColor = 'steelblue';
            }
        }
    }
    for (var item in proccesses)
    {
        maxTemp.push(max[proccesses[item]]);
    }
    for (var item in maxTemp){
        if(maxTemp[item][0] != proccesses[item]) {
            maxTemp[item].unshift(proccesses[item]);
        }
    }
    updateTableMax([maxTemp, columnNames]);
}
function showTableAllocation(idTemp,arr) {
    var allocationTemp = [];
    var allocationTemp2 = [];
    var columnNames = ['Process'];
    for(var item in resources) {
        columnNames.push(resources[item]);
    }
    var tableAllocation = Table()
        .on('edit', function (d) {
            var y = document.getElementById(arr);
            var x = y.getElementsByClassName('cell');
            allocationTemp2 = [];
            for(var i=0;i<proccesses.length;i++){
                allocationTemp2[i]=[];
                for(var j=0;j<(resources.length)+1;j++){
                    allocationTemp2[i].push(x[(i*(resources.length + 1))+j].innerHTML);
                }
            }
            for(var i=0; i<proccesses.length; i++){
                allocation[proccesses[i]] = allocationTemp2[i];
            }
            updateTableAllocation([allocationTemp2, columnNames]);
        });
    function updateTableAllocation(_data) {
        d3.select(idTemp)
            .datum(_data)
            .call(tableAllocation);
        var y = document.getElementById(arr);
        var x = y.getElementsByClassName('cell');
        for(var i=0;i<((proccesses.length)*(resources.length+1));i++)
        {
            if(!(i%(resources.length+1)))
            {
                x[i].style.backgroundColor = 'steelblue';
            }
        }
    }
    for (var item in proccesses)
    {
        allocationTemp.push(allocation[proccesses[item]]);
    }
    for (var item in allocationTemp){
        if(allocationTemp[item][0] != proccesses[item]) {
            allocationTemp[item].unshift(proccesses[item]);
        }
    }
    updateTableAllocation([allocationTemp, columnNames]);

}
function showTableRequest(idTemp) {
    var columnNames = ['Process'];
    for(var item in resources) {
        columnNames.push(resources[item]);
    }
    var tableRequest = Table()
        .on('edit', function (d) {
            var row = document.getElementById("Request");
            var m = row.getElementsByClassName('row');
            var k = m[0].getElementsByClassName('cell');
            for(var item in k)
            {
                if(k[item].textContent != undefined) {
                    request[0][item] = k[item].textContent;
                }
            }
        });
    function updateTableRequest(_data) {
        d3.select(idTemp)
            .datum(_data)
            .call(tableRequest);
    }
        updateTableRequest([request, columnNames]);



}
function showTableExisting(idTemp,arr) {
    var columnNamesExisting = [];
    for(var item in resources) {
        columnNamesExisting.push(resources[item]);
    }
    var tableExisting = Table()
        .on('edit', function (d) {
            var row = document.getElementById(arr);
            var m = row.getElementsByClassName('row');
            var k = m[0].getElementsByClassName('cell');
            for(var item in k)
            {
                if(k[item].textContent != undefined) {
                    existing[0][item] = k[item].textContent;
                }
            }
        });
    function updateTableExisting(_data) {
        d3.select(idTemp)
            .datum(_data)
            .call(tableExisting);
    }
    updateTableExisting([existing, columnNamesExisting]);
}
function showTableNeed(idTemp,arr) {
    var columnNames = ['Process'];
    for(var item in resources) {
        columnNames.push(resources[item]);
    }
    for (var i = 0; i < proccesses.length; i++) {
        var needTemp2 = [];
        for (var j = 1; j <= resources.length; j++) {
            needTemp2[j-1] = max[proccesses[i]][j] - allocation[proccesses[i]][j];
        }
        need.push(needTemp2);
    }

    Need(need);
    var tableNeed = Table()
        .on('edit', function (d) {
        });
    function updateTableNeed(_data) {
        d3.select(idTemp)
            .datum(_data)
            .call(tableNeed);
        var y = document.getElementById(arr);
        var x = y.getElementsByClassName('cell');
        for(var i=0;i<((proccesses.length)*(resources.length+1));i++)
        {
            if(!(i%(resources.length+1)))
            {
                x[i].style.backgroundColor = 'steelblue';
            }
        }
    }
    var needTemp = [];
    for (var item in proccesses)
    {
        needTemp.push(need[proccesses[item]]);
    }

    for (var item in needTemp){
        if(needTemp[item][0] != proccesses[item]) {
            needTemp[item].unshift(proccesses[item]);
        }
    }
    updateTableNeed([needTemp, columnNames]);
}
function showTableAvailable(idTemp,arr) {
    var columnNamesExisting = [];
    for(var item in resources) {
        columnNamesExisting.push(resources[item]);
    }
    var avaiTemp = [];
    for(var i = 0;i<resources.length;i++)
    {
        avaiTemp[i] = existing[0][i] - possessed[0][i];
    }
    available.push(avaiTemp);
    var sum= 0;
    var posTemp = [];
    for(var i = 0;i< resources.length;i++)
    {
        sum = 0;
        for(var item in proccesses)
        {
            sum += allocation[proccesses[item]][i];
        }
        posTemp[i] = sum;
    }
    possessed.push(posTemp);
    var tableAvailable = Table()
        .on('edit', function (d) {
        });
    function updateTableAvailable(_data) {
        d3.select(idTemp)
            .datum(_data)
            .call(tableAvailable);
    }
    updateTableAvailable([available, columnNamesExisting]);

}
function showTablePossessed(idTemp,arr) {
    var sum= 0;
    var posTemp = [];
    for(var i = 0;i< resources.length;i++)
    {
        sum = 0;
        for(var item in proccesses)
        {
            sum += parseInt(allocation[proccesses[item]][i+1]);
        }
        posTemp[i] = sum;
    }
    possessed.push(posTemp);

    var columnNamesExisting = [];
    for(var item in resources) {
        columnNamesExisting.push(resources[item]);
    }
    var tablePossessed = Table()
        .on('edit', function (d) {

        });
    function updateTablePossessed(_data) {
        d3.select(idTemp)
            .datum(_data)
            .call(tablePossessed);
    }
    updateTablePossessed([possessed, columnNamesExisting]);


}

function optionM2() {
    alert("Not ready yet");

}
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
var x1 = document.getElementsByClassName("addProcess-button");
x1[0].style.visibility = "hidden";
var x1 = document.getElementsByClassName("addResource-button");
x1[0].style.visibility = "hidden";
var x1 = document.getElementsByClassName("graphshow-button");
x1[0].style.visibility = "hidden";
var x1 = document.getElementsByClassName("banker-button");
x1[0].style.visibility = "hidden";
var sec = document.getElementById("secondInfo");
var y = sec.getElementsByTagName('p');
for(var i=0;i<3;i++)
{
    y[i].style.visibility = 'hidden';
}

var proccesses = [];
var resources = [];
var max = [];
var allocation = [];
var need = [];
var existing = [];
var possessed = [];
var available = [];
var request = [];
request = [['p5',1,0,0,0]];
proccesses = ['p1','p2','p3','p4','p5'];
resources = ['r1','r2','r3','r4'];
var data = [[4,1,1,1],[0,2,1,2],[4,2,1,0],[1,1,1,1],[2,1,1,0]];
var data2 = [[3,0,1,1],[0,1,0,0],[1,1,1,0],[1,1,0,1],[0,0,0,0]];
function Max(data) {
    for(var i=0;i<proccesses.length;i++){
        for (var j= 0 ;j<resources.length;j++){
            if(j==0){
                max[proccesses[i]]=[];
                max[proccesses[i]].push(data[i][j]);
            }else{
                max[proccesses[i]].push(data[i][j]);
            }
        }
    }
}
function Allocation(data) {
    for(var i=0;i<proccesses.length;i++){
        for (var j= 0 ;j<resources.length;j++){
            if(j==0){
                allocation[proccesses[i]]=[];
                allocation[proccesses[i]].push(data[i][j]);
            }else{
                allocation[proccesses[i]].push(data[i][j]);
            }
        }
    }
}
function Need(data) {
    need = [];
    for(var i=0;i<proccesses.length;i++){
        for (var j= 0 ;j<resources.length;j++){
            if(j==0){
                need[proccesses[i]]=[];
                need[proccesses[i]].push(data[i][j]);
            }else{
                need[proccesses[i]].push(data[i][j]);
            }
        }
    }
}

//request should be like this :  [['p1',1,0,0,0]]
function Request(data) {
    for (var j= 0 ;j<resources.length+1;j++){
        if(j==0){
            request[data[0][0]]=[];
            request[data[0][0]].push(data[0][j]);
        }else{
            request[data[0][0]].push(data[0][j]);
        }
        }
}
function Existing1(data1) {
    existing = data1;
}
//first thing show on screen when page load

Max(data);
Allocation(data2);
Existing1([[6,3,4,2]]);

window.onload = function () {
    executeDeadLock();
};