/**
 * Created by farid on 5/9/2016.
 */
function process(pName, pStartTime, pServiceTime) {
    this.pName = pName;
    this.pStartTime = pStartTime;
    this.pServiceTime = pServiceTime;
}

var proccesses = {};

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
function addProcess(pn, ps, pe) {
    var t = new process(pn, ps, pe);
    proccesses[t.pName] = {};
    proccesses[t.pName].pName = t.pName;
    proccesses[t.pName].pStartTime = t.pStartTime;
    proccesses[t.pName].pServiceTime = t.pServiceTime;
    proccesses[t.pName].showProcess = t.showProcess;
    proccesses[t.pName].tableCreate = t.tableCreate;
}
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
    var delay = 0;
    var temp;
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
        .attr("width", 0)
        .attr("height", barHeight - 1)
        .attr('fill', "steelblue")
        .transition()
        .delay(function () {
            temp = delay;
            delay += 1500;
            return temp;
        })
        .attr("width",function (d) {
            return x(d[2]-d[1]);
        })
        .duration(1500);

    bar.append("text")
        .attr("x", function(d) { return (x(d[2]-d[1]) /2)+4;})
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function(d) { return d[0]; })     

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
            for(var item in d) {
                proccesses[d[item][0]] = {};
                proccesses[d[item][0]].pName  = d[item][0];
                proccesses[d[item][0]].pStartTime = parseInt(d[item][1]);
                proccesses[d[item][0]].pServiceTime = parseInt(d[item][2]);
            }
            data = [];
            for(var item in proccesses){
                data.push([item,proccesses[item].pStartTime,proccesses[item].pServiceTime]);
            }
        });
    function updateTable(_data) {
        d3.select('.table')
            .datum(_data)
            .call(table);
    }
    updateTable([data, columnNames]);
    d3.select('.add-button')
        .on("mouseup", function (d, i) {
            data.push(["p", 0, 0]);
            updateTable([data, columnNames]);
        });
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
    }
    return false;
}
var sortable = [];

//FCFS ALGORITHM...
function FCFS() {
    var availabletime = 0;
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
    );
    for(var item in sortable){
        if(availabletime < sortable[item][1])
            availabletime = sortable[item][1];
        end = availabletime + sortable[item][2];
        result.push([sortable[item][0],availabletime,end]);
        availabletime = end;
    }
    showCanvas(result);
    sortable = [];
}
//SJF ALGORITHM...
function sjf() {
    var readyQueue = [];
    var index = 0;
    var end = 0;
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
    );
    for(var now = 0 ; sortable.length > 0;)
    {
        testready = readyQueue;
        readyQueue = sortable.filter(function (a) {
            return (a[1] <= now);
        });
        if(readyQueue.length != 0){
            readyQueue.sort(
                function (a, b) {
                    return a[2]-b[2];
                }
        )}
        if (!arrayEqual(testready,readyQueue) && readyQueue.length != 0) {
            end = now + readyQueue[0][2];
            result.push([readyQueue[0][0],now,end]);
            index = sortable.indexOf(readyQueue[0]);
            sortable.splice(index, 1);
            now = end ;
        }
        else
            now++;
    }
    showCanvas(result);
}
//SRT ALGORITHM...
function srt() {
    var timeslot1 = [];
    var integeratedTimeSlot = [];
    var p ;
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
    );
    var counter = 0;
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
            );
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
        result.push([integeratedTimeSlot[item][0],integeratedTimeSlot[item][1],integeratedTimeSlot[item][2]]);
    }
    showCanvas(result);
    sortable = [];
}
//HRRN ALGORITHM...
function hrrn() {
    var readyQueue = [];
    var index = 0;
    var end = 0;
    var testready = [];
    var m = 0;//m=wait time / service time
    var waitTime = 0;
    var readyQueueWithW = [];
    var result = [];
    for(var item in proccesses){
        sortable.push([item,proccesses[item].pStartTime,proccesses[item].pServiceTime]);
    }
    sortable.sort(
        function (a, b) {
            return a[1]-b[1];
        }
    );
    for(var now = 0 ;sortable.length !=0 || readyQueue.length != 0;)
    {
        testready = readyQueue;
        readyQueue = sortable.filter(function (a) {
            return (a[1] <= now);
        });
        for(var item in readyQueue)
        {
            waitTime = now - readyQueue[item][1];
            m = waitTime / readyQueue[item][2];
            readyQueueWithW.push([readyQueue[item][0],readyQueue[item][1],readyQueue[item][2],m])
        }
        if(readyQueueWithW.length != 0){
            readyQueueWithW.sort(
                function (a, b) {
                    return a[3]-b[3];
                }
            ).reverse()}
        if (!arrayEqual(testready,readyQueue) && readyQueue.length != 0) {
            end = now + readyQueueWithW[0][2];
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
    showCanvas(result);
    sortable = [];
}
function rr() {
    var readyQueue = [];
    var index = 0;
    var end = 0;
    var quantum = 2;
    var remainTime = 0;//the difference between service time and quantum
    var cpuProcess = [];//process that has cpu
    var result = [];
    for(var item in proccesses){
        sortable.push([item,proccesses[item].pStartTime,proccesses[item].pServiceTime]);
    }
    sortable.sort(
        function (a, b) {
            return a[1]-b[1];
        }
    );
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
        if(readyQueue.length != 0)
        {
            cpuProcess = readyQueue[0];
            if(cpuProcess[2]>quantum){
                end = now + quantum;
                result.push([cpuProcess[0],now,end]);
                now = end;
                remainTime = cpuProcess[2]-quantum;
                cpuProcess[2] = remainTime;
                readyQueue.push(cpuProcess);
                readyQueue.splice(0,1);
            }
            else if(cpuProcess[2]<= quantum) {
                end = now + cpuProcess[2];
                result.push([cpuProcess[0],now,end]);
                now = end;
                readyQueue.splice(0,1);
            }
        }
        else
            now++;
    }
    showCanvas(result);
}
window.onload = function () {
    showPro();
};