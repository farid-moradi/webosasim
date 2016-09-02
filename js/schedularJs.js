/**
 * Created by farid on 5/9/2016.
 */
var x = {}

function process(pName, pStartTime, pServiceTime) {
    this.pName = pName;
    this.pStartTime = pStartTime;
    this.pServiceTime = pServiceTime;
}

var proccesses = {};


    var x = 0;
//function which is going to be a handler for create new process button...


function arrayEqual(ar1,ar2) {
    /*        if(ar1.length==0 && ar2.length == 0)
     return true;*/
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
    var flag = true;
    for(var item in array)
    {
        if(arrayEqual(array[item],item3)){
            return item;
        }
    }
}
function addProcess(pn, ps, pe) {
    var t = new process(pn, ps, pe);
    //t.tableCreate();
    proccesses[t.pName] = {};
    proccesses[t.pName].pName = t.pName;
    proccesses[t.pName].pStartTime = t.pStartTime;
    proccesses[t.pName].pServiceTime = t.pServiceTime;
    proccesses[t.pName].showProcess = t.showProcess;
    proccesses[t.pName].tableCreate = t.tableCreate;
}
//مشکل اعداد بالاتر از 10
//مشکل شروع اولین پروسه بیشتر از صفر فقط برای SRT
addProcess("p1", 0, 3);
addProcess("p2", 10, 5);
addProcess("p3", 8, 8);
addProcess("p4", 11, 8);
addProcess("p5", 0, 4);



var x2 = document.getElementsByClassName("chart");
x2[0].style.visibility = "hidden";

var x3 = document.getElementById("showP");
x3.style.visibility = "hidden";


function showCanvas(data) {


    //var data = [['p1', 0, 4], ['p2', 4, 7], ['p3', 7, 10], ['p4', 10, 16], ['p5', 16, 21], ['p5', 21, 24], ['p3', 24, 30], ['p1', 30, 34]];
    var x2 = document.getElementsByClassName("chart");
    x2[0].style.visibility = "visible";

    x2[0].innerHTML = "";

    var width = 800,
        barHeight = 25;


    var x = d3.scale.linear()
        .domain([0, data[data.length - 1][2]])
        .range([0, width]);



    var chart = d3.select(".chart")
        .attr("width", width)
        .attr("height", barHeight * data.length);



    /*    var bar2 = chart.selectAll("g")
     .data(data)
     .enter().append("g")
     .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

     bar2.append("rect")
     .attr("width", 800)
     .attr("height", barHeight - 1)
     .attr('fill','lightblue');*/

    var test = [];
    var bar = chart.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr(
            "transform", function(d, i) {
                test = data.filter(function (ite) {
                    return (ite[0] == d[0]);
                });
                if (test.length > 1)
                {
                    return "translate(" + x(d[1]) +"," + data.indexOf(test[0]) * barHeight + ")";
                }
                else
                    return "translate(" + x(d[1]) +"," + i * barHeight + ")";
            });

    bar.append("rect")
        .attr("width", function (d) {
            return x(d[2]-d[1]);
        })
        .attr("height", barHeight - 1)
        .attr('fill', "steelblue");

    bar.append("text")
        .attr("x", function(d) { return (x(d[2]-d[1]) /2)+4;})
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function(d) { return d[0]; });

    bar.append("text")
        .attr("x", function(d) {
            return x(d[2]-d[1])-3;})
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function(d) { return d[2]; });

}

function showPro() {
    var x2 = document.getElementById("showP");
    x2.style.visibility = "visible";
    var data =[];
    for(var item in proccesses){
        data.push([item,proccesses[item].pStartTime,proccesses[item].pServiceTime]);
    }

    var columnNames = ['Process', 'startTime', 'serviceTime'];
    // Charts
    var table = Table()
        .on('edit', function (d) {
            updateTable([d, columnNames]);
            data = d;
        });
    function updateTable(_data) {
        d3.select('.table')
            .datum(_data)
            .call(table);
    }
    updateTable([data, columnNames]);
    d3.select('.reset-button')
        .on("mouseup", function (d, i) {
            updateTable([data, columnNames]);
            for(var item in data) {
                proccesses[data[item][0]] = {};
                proccesses[data[item][0]].pName  = data[item][0];
                proccesses[data[item][0]].pStartTime = parseInt(data[item][1]);
                proccesses[data[item][0]].pServiceTime = parseInt(data[item][2]);
            }
                alert("done");
        });
    d3.select('.add-button')
        .on("mouseup", function (d, i) {
            data.push(["p", 0, 0]);
            updateTable([data, columnNames]);
        });
}
function showProcessButton() {
/*    var metadata = [];
    metadata.push({ name: "process", label: "Process",editable: true});
    metadata.push({ name: "startTime", label:"Start Time", datatype: "integer" ,editable: true});
    metadata.push({ name: "endTime", label: "End Time", editable: true});
    // a small example of how you can manipulate the object in javascript
    //alert(metadata[2].name.valueOf());
    var data = [];
    for(var item in proccesses) {
        data.push({id: item+1, values: {"process":proccesses[item].pName, "startTime": proccesses[item].pStartTime, "endTime": proccesses[item].pServiceTime}});
    }
    editableGrid = new EditableGrid("newTable");
    editableGrid.load({"metadata": metadata, "data": data});
    editableGrid.renderGrid("mainWindow", "testgrid");
    var x = document.createElement("div");
    var parent  = document.getElementById("mainWindow");
    x.innerHTML += "<form id=\"Form2\">" + "<button type=\"button\" id=\"saveProcess\">" + "ذخیره ی فرایند ها" + "<" + "/button>" + "<" + "/form>";
    parent.appendChild(x);
    x.style.float = "right";
    x.style.margin = "0px 120px 20px 20px";
    //x.childNodes[0][0].style.width = "70px";
    x.childNodes[0][0].style.marginTop = "0px";
    var s = document.getElementById("saveProcess");
    s.onclick = saveProcesses;

    //add button
    var y = document.createElement("div");
    var parent2  = document.getElementById("mainWindow");
    y.innerHTML += "<form id=\"Form3\">" + "<button type=\"button\" id=\"addProcess\">" + "فرایند جدید" + "<" + "/button>" + "<" + "/form>";
    parent2.appendChild(y);
    y.style.float = "right";
    y.style.margin = "0px 0px 20px 0px";
    //y.childNodes[0][0].style.width = "70px";
    y.childNodes[0][0].style.marginTop = "0px";
    var s = document.getElementById("addProcess");
    s.onclick = addProcessButton;*/

    return false;
}
function addProcessButton() {
    var x = 0;
    var text = "";
    for(var item in proccesses){
        x++;
    }
    x = "p" + parseInt(x+1);
    addProcess(x,0,0);
    showProcessButton();
}
function saveProcesses() {
    var farid = document.getElementById("saveProcess");
    var table = null;
    var stringId = "";
    var temp = 0;
    for(var item in proccesses)
    {
        temp = item+1;
        stringId = "newTable_" + temp;
        table = document.getElementById(stringId);
        addProcess(table.childNodes[0].textContent,parseInt(table.childNodes[1].textContent),parseInt(table.childNodes[2].textContent));
    }
}
function executeAlgorithm(){
    var go = document.getElementById("go");
    var select = document.getElementById("algorithms");
    var e = select.options[select.selectedIndex].text;
    switch(e){
        case "FCFS":
            FCFS();
            break;
        case "SJF":
            sjf();
            break;
        case "SRT":
            srt();
            break;
        case "HRRN":
            hrrn();
            break;
        case "RR":
            rr();
            break;
        case "test":
            test();
            break;
    }

    return false;
}
var sortable = [];
var queue = [];

//FCFS ALGORITHM...
function FCFS() {
    var availabletime = 0;
    var text='';
    var end;
    var result = [];
    for(var item in proccesses){
        if(proccesses[item].pServiceTime>0) {
            sortable.push([item, proccesses[item].pStartTime, proccesses[item].pServiceTime]);
        }
    }
    sortable.sort(
        function (a, b) {
            return a[1]-b[1];
        }
    )
    for(var item in sortable){
        if(availabletime < sortable[item][1])
            availabletime = sortable[item][1];
        end = availabletime + sortable[item][2];
        text += "from " + availabletime + " to " + end + " for " + sortable[item][0] + "\n";
        result.push([sortable[item][0],availabletime,end]);
        availabletime = end;
    }
  //  alert(text);
    showCanvas(result);
    sortable = [];
}
//SJF ALGORITHM...
function sjf() {
    var readyQueue = [];
    var text = '';
    var index = 0;
    var end = 0;
    var flag = 0;
    var result = [];
    var testready = [];
    for(var item in proccesses){
        if(proccesses[item].pServiceTime >0) {
            sortable.push([item, proccesses[item].pStartTime, proccesses[item].pServiceTime]);
        }
    }
    sortable.sort(
        function (a, b) {
            return a[1]-b[1];
        }
    )
    for(var now = 0 ; sortable.length > 0;)
    {
        testready = readyQueue;
        readyQueue = sortable.filter(function (a) {
            return (a[1] <= now);
        })
        if(readyQueue.length != 0){
            readyQueue.sort(
                function (a, b) {
                    return a[2]-b[2];
                }
        )}
        if (!arrayEqual(testready,readyQueue) && readyQueue.length != 0) {
            end = now + readyQueue[0][2];
            text += "from " + now + " to " + end + " for " + readyQueue[0][0] + "\n";
            result.push([readyQueue[0][0],now,end]);
            index = sortable.indexOf(readyQueue[0]);
            sortable.splice(index, 1);
            now = end ;
        }
        else
            now++;
    }
    //alert(text);
    showCanvas(result);
}
//SRT ALGORITHM...
function srt() {
    var text = '';
    var timeslot1 = [];
    var integeratedTimeSlot = [];
    var start = 0;
    var end = 0;
    var p ;
    var j = 0;
    var flag = 0;
    var readyQueue = [];
    var result = [];
    for (var item in proccesses) {
        if(proccesses[item].pServiceTime > 0) {
            sortable.push([item, proccesses[item].pStartTime, proccesses[item].pServiceTime]);
        }
    }
    sortable.sort(
        function (a, b) {
            return a[1] - b[1];
        }
    )
    var counter = 0
    for(var item in proccesses)
    {
        counter += proccesses[item].pServiceTime;
    }
    for (var now = 0; now < counter || readyQueue.length >0 ; now++) {
        for (var k in sortable) {
            if (sortable[k][1] == now) {
                readyQueue.push([sortable[k][0],sortable[k][1],sortable[k][2]]);
            }
        }
        if (readyQueue.length == 0)
        {
            continue;
        }
        if(readyQueue.length != 0) {
            readyQueue.sort(
                function (a, b) {
                    return a[2] - b[2];
                }
            )
            timeslot1.push([now, readyQueue[0][0]]);
            if (readyQueue[0][2] > 0)
                readyQueue[0][2]--;
            if (readyQueue[0][2] == 0)
                readyQueue.splice(0, 1);
        }
    }
    start = timeslot1[0][0];
    end = start+1;
    for(var i=0;i<timeslot1.length;i++)
    {
        p = timeslot1[i][1];

        if(i !=timeslot1.length-1 && timeslot1[i+1][1] == p)
        {
            end= end+1;
        }
        else if (i == timeslot1.length-1)
        {
            integeratedTimeSlot.push([p,start,end]);
        }
        else{
            integeratedTimeSlot.push([p,start,end]);
            start = timeslot1[i+1][0];
            end = start+1;
        }
    }
    for(var item in integeratedTimeSlot){
        text += "from " + integeratedTimeSlot[item][1] + " to " + integeratedTimeSlot[item][2] + " for " + integeratedTimeSlot[item][0] + "\n";
        result.push([integeratedTimeSlot[item][0],integeratedTimeSlot[item][1],integeratedTimeSlot[item][2]]);
    }
    //alert(text);
    showCanvas(result);
    sortable = [];
}
//HRRN ALGORITHM...
function hrrn() {
    var readyQueue = [];
    var text = '';
    var index = 0;
    var end = 0;
    var flag = 0;
    var testready = [];
    var m = 0;//m=wait time / service time
    var waitTime = 0;
    var readyQueueWithW = [];
    var temp =[];
    var result = [];
    for(var item in proccesses){
        sortable.push([item,proccesses[item].pStartTime,proccesses[item].pServiceTime]);
    }
    sortable.sort(
        function (a, b) {
            return a[1]-b[1];
        }
    )
    var sumServiceTime = 0;
    for (var item in proccesses){
        sumServiceTime += proccesses[item].pServiceTime;
    }
    sumServiceTime += sortable[sortable.length-1][1];
    for(var now = 0 ;sortable.length !=0 || readyQueue.length != 0;)
    {
        testready = readyQueue;
        readyQueue = sortable.filter(function (a) {
            return (a[1] <= now);
        })
        for(var item in readyQueue)
        {
            waitTime = now - readyQueue[item][1];
            m = waitTime / readyQueue[item][2];
            readyQueueWithW.push([readyQueue[item][0],readyQueue[item][1],readyQueue[item][2],m])
        }
//alert(readyQueueWithW);
        if(readyQueueWithW.length != 0){
            readyQueueWithW.sort(
                function (a, b) {
                    return a[3]-b[3];
                }
            ).reverse()}
        if (!arrayEqual(testready,readyQueue) && readyQueue.length != 0) {
            end = now + readyQueueWithW[0][2];
            text += "from " + now + " to " + end + " for " + readyQueueWithW[0][0] + "\n";
            result.push([readyQueueWithW[0][0],now,end]);
            readyQueueWithW = readyQueueWithW.map(function (a) {
                return a.slice(0,a.length-1);
            });
            index = isItemInArray(sortable,readyQueueWithW[0]);
            sortable.splice(index, 1);
            now = end ;
            readyQueueWithW = [];
        }
        else
            now++;
    }
    //alert(text);
    showCanvas(result);
    sortable = [];
}
function rr() {
    var readyQueue = [];
    var text = '';
    var index = 0;
    var end = 0;
    var flag = 0;
    var quantum = 2;
    var remainTime = 0;//the difference between service time and quantum
    var readyQueueWithQuantum = [];
    var temp =[];
    var cpuProcess = [];//process that has cpu
    var result = [];
    for(var item in proccesses){
        sortable.push([item,proccesses[item].pStartTime,proccesses[item].pServiceTime]);
    }
    sortable.sort(
        function (a, b) {
            return a[1]-b[1];
        }
    )
    for(var now = 0; sortable.length != 0 || readyQueue.length != 0;)
    {
        for(var item in sortable){
            if(sortable[item][1] <= now)
                readyQueue.push(sortable[item]);
        }
        for(var item in readyQueue)
        {
            index = sortable.indexOf(readyQueue[item]);
            if(index != -1)
                sortable.splice(index,1);
        }
     //   alert(sortable);
       // alert(readyQueue);
        if(readyQueue.length != 0)
        {
            cpuProcess = readyQueue[0];
            if(cpuProcess[2]>quantum){
                end = now + quantum;
                text += "from " + now + " to " + end + " for " + cpuProcess[0] + "\n";
                result.push([cpuProcess[0],now,end]);
                now = end;
                remainTime = cpuProcess[2]-quantum;
                cpuProcess[2] = remainTime;
                readyQueue.push(cpuProcess);
                readyQueue.splice(0,1);
            }
            else if(cpuProcess[2]<= quantum) {
                end = now + cpuProcess[2];
                text += "from " + now + " to " + end + " for " + cpuProcess[0] + "\n";
                result.push([cpuProcess[0],now,end]);
                now = end;
                readyQueue.splice(0,1);
            }
        }
        else
            now++;
    }
    showCanvas(result);
    // alert(result);
    // alert(text);
}
function test() {
    var m = 4;
    var k =[2,3,4];
    k.push(6);
    alert(k);
}
window.onload = function () {
    showPro();
}


