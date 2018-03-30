/**
 * Created by farid on 8/25/2016.
 */
function process(name, startPoint, memNeed) {
    this.name = name;
    this.memNeed = memNeed;
    this.startPoint = startPoint;
}

var processes = {};
var list = [];
var readyQueue = ['p1','p2','p3','p4','p5'];
var memorySize = 0;
var memUnit = 0;

function addProcess(pn, ps, pm) {
    var t = new process(pn, ps, pm);
    processes[t.name] = {};
    processes[t.name].name = t.name;
    processes[t.name].memNeed = t.memNeed;
    processes[t.name].startPoint = t.startPoint;
}
function linkList(nodeName, nodeStart,units ) {
    this.nodeName = nodeName;
    this.nodeStart  = nodeStart;
    this.units = units;
}

function addNode(n, ns, u) {
    var t = new linkList(n, ns, u);
    var temp = [];
    for(var item in t)
    {
        temp.push(t[item]);
    }
    return temp;
}

function sortNumber(a,b) {
    return a - b;
}

//function that create link list from the processes situation...
function createList() {
    var pr = document.getElementById('process');
    var trs = pr.getElementsByTagName('tr');
    var td;
    var temp = [];
    var temp2 = [];
    for (var i = 1; i < 6; i++) {
        temp2 = [];
        for (var j = 0; j < 3; j++) {
            temp2.push(trs[i].getElementsByTagName('td')[j].textContent);
        }
        temp.push(temp2);
    }
    for (var item in temp) {
        processes[temp[item][0]] = {};
        processes[temp[item][0]].name = temp[item][0];
        processes[temp[item][0]].startPoint = parseInt(temp[item][1]);
        processes[temp[item][0]].memNeed = parseInt(temp[item][2]);
    }
    //main, contain the processes that exist in main memory
    var main = temp.filter(function (d) {
        return d[1] != -1;
    });

    //make list...
    var units = parseInt(memorySize / memUnit);
    var maintemp = [];
    if (main.length != 0) {
        maintemp = main.sort(function (a, b) {
            return a[1] - b[1];
        });
        var lastEnd = 0;
        for (var item in maintemp) {
            if (item == 0) {
                if (maintemp[0][1] == 0) {
                    list.push(addNode('P', 0, maintemp[0][2]));
                }
                else {
                    list.push(addNode('H', 0, maintemp[0][1]));
                    list.push(addNode('P', maintemp[0][1], parseInt(maintemp[0][2])));
                }
                lastEnd = parseInt(maintemp[0][2]) + parseInt(maintemp[0][1]);
            }
            else {
                if (maintemp[item][1] == lastEnd) {
                    list.push(addNode('P', maintemp[item][1], parseInt(maintemp[item][2])));
                }
                else {
                    list.push(addNode('H', lastEnd, (maintemp[item][1] - lastEnd)));
                    list.push(addNode('P', maintemp[item][1], parseInt(maintemp[item][2])));
                }
                lastEnd = parseInt(maintemp[item][2]) + parseInt(maintemp[item][1]);
            }
            if (item == maintemp.length - 1 && lastEnd < units) {
                list.push(addNode('H', lastEnd, units - lastEnd));
            }
        }
    }
}

//addProcess('p1',12,20);(name,number of units that process need,start point of process in memory by units)
addProcess("p1", -1, 2);
addProcess("p2", -1, 4);
addProcess("p3", 20, 10);
addProcess("p4", 12, 4);
addProcess("p5", -1, 2);


function main() {
    Element.prototype.remove = function () {
        this.parentElement.removeChild(this);
    };
    NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
        for (var i = this.length - 1; i >= 0; i--) {
            if (this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    };
    //start
    var x = document.getElementById('mainWindow');
    x.style.visibility = 'hidden';
    //submit event handler...
    var sub = document.getElementsByName('submit');
    sub[0].onclick = function () {
        x.style.visibility = 'visible';
        var star = document.getElementsByTagName('input');
        memorySize = parseInt(star[0].value);
        memUnit = parseInt(star[1].value);
        document.getElementsByClassName("start").remove();
        //showDisk(memorySize,memUnit);
        showProcess();
        showQueue();
        createList();
        return false;
    };

    function showProcess() {
        var processTemp = [];
        for (var item in processes) {
            processTemp.push([item, processes[item].startPoint, processes[item].memNeed]);
        }
        var columnNames = ['Process', 'Start Point', 'Memory Need'];
            var tableProcess = Table()
         .on('edit', function (d) {
             processTemp = d;
         });
        function updateTableProcess(_data) {
            d3.select("#process .table")
                .datum(_data)
                .call(tableProcess);
        }
        updateTableProcess([processTemp, columnNames]);
        d3.select('.reset-button')
            .on("mouseup", function (d, i) {
                updateTableProcess([processTemp, columnNames]);
                var processes = {};
                for(var item in processTemp) {
                    processes[processTemp[item][0]] = {};
                    processes[processTemp[item][0]].name  = processTemp[item][0];
                    processes[processTemp[item][0]].startPoint = parseInt(processTemp[item][1]);
                    processes[processTemp[item][0]].memNeed = parseInt(processTemp[item][2]);
                }
                list = [];

                createList();
                var x = document.getElementById('queue');
                var y= x.getElementsByTagName('tr')[0];
                var m = y.getElementsByTagName('td');
                var mainW = document.getElementById('mainWindow');
                if(mainW.getElementsByTagName('svg')[0]){
                    mainW.getElementsByTagName('svg')[0].remove();
                }
                showMemory(processTemp);
                dynamicPartition();
            });
    }
    function dynamicPartition() {
        var x = document.getElementById('algorithm');
        x.style.visibility = 'visible';
        x.getElementsByTagName('div')[0].onclick = function () {
            var checkedRadio;
            var rad = x.getElementsByTagName('input');
            for (var item in rad) {
                if (rad[item].checked) {
                    checkedRadio = rad[item].value;
                    break;
                }
            }
            var holes = [];
            holes = list.filter(function (d) {
                return (d[0] == 'H');
            });
            var next1 = document.getElementById('nextstep');
            document.getElementById('algorithm').style.visibility = 'hidden';
            next1.style.visibility = 'visible';
            switch (checkedRadio) {
                case "first":
                    firstPlace(holes);
                    break;
                case "best":
                    bestPlace(holes);
                    break;
                case "worst":
                    worstPlace(holes);
                    break;
            }
        };
    }

        function firstPlace(holes) {
            var flag= false;
            var pr = [];
            var cpuProcess = readyQueue.pop();
            var processInMem = processInMemory();

            for(var item in processInMem){
                if(processInMem[item][0] == cpuProcess){
                    flag = true;
                    break;
                }
            }
            readyQueue.unshift(cpuProcess);
            showQueue();
            if(!flag) {
                for (var item in holes) {
                    if (holes[item][2] >= processes[cpuProcess].memNeed) {
                        processes[cpuProcess].startPoint = holes[item][1];
                        pr = [];
                        showProcess();
                        for (var item in processes) {
                            pr.push([item, processes[item].startPoint, processes[item].memNeed]);
                        }
                        list = [];
                        createList();
                        showMemory(pr);
                        break;
                    }
                }
            }
            else
                alert('its in mem');
        }
        function bestPlace(holes) {
            var flag= false;
            var pr = [];
            var cpuProcess = readyQueue.pop();
            var processInMem = processInMemory();

            for(var item in processInMem){
                if(processInMem[item][0] == cpuProcess){
                    flag = true;
                    break;
                }
            }
            readyQueue.unshift(cpuProcess);
            showQueue();
            if(!flag) {
                holes.sort(function (a,b) {
                    return a[2]-b[2];
                });
                for (var item in holes) {
                    if (holes[item][2] >= processes[cpuProcess].memNeed) {
                        processes[cpuProcess].startPoint = holes[item][1];
                        pr = [];
                        showProcess();
                        for (var item in processes) {
                            pr.push([item, processes[item].startPoint, processes[item].memNeed]);
                        }
                        list = [];
                        createList();
                        showMemory(pr);
                        break;
                    }
                }
            }
            else
                alert('its in mem');
        }
        function worstPlace(holes) {
            var flag= false;
            var pr = [];
            var cpuProcess = readyQueue.pop();
            var processInMem = processInMemory();

            for(var item in processInMem){
                if(processInMem[item][0] == cpuProcess){
                    flag = true;
                    break;
                }
            }
            readyQueue.unshift(cpuProcess);
            showQueue();
            if(!flag) {
                holes.sort(function (a, b) {
                    return a[2]-b[2];
                }).reverse();
                for (var item in holes) {
                    if (holes[item][2] >= processes[cpuProcess].memNeed) {
                        processes[cpuProcess].startPoint = holes[item][1];
                        pr = [];
                        showProcess();
                        for (var item in processes) {
                            pr.push([item, processes[item].startPoint, processes[item].memNeed]);
                        }
                        list = [];
                        createList();
                        showMemory(pr);
                        break;
                    }
                }
            }
            else
                alert('its in mem');
        }

    function processInMemory() {
        var pro = [];
        for(var item in processes){
            pro.push([item,processes[item].startPoint,processes[item].memNeed]);
        }
        var proTemp2 = [];
        proTemp2 = pro.filter(function (d) {
            return (d[1] != -1);
        });
        return proTemp2;
    }

    function showQueue() {
        var x = document.getElementById('queue');
        var y= x.getElementsByTagName('tr')[0];
        var m = y.getElementsByTagName('td');
        for(var item in m){
            m[item].contentEditable = true;
            m[item].textContent = readyQueue[item];
        }
        m[4].style.borderRight = '0px';
        y.style.height = '30px';
    }

    function showMemory(processTemp) {
        var mainW = document.getElementById('mainWindow');
        if(mainW.getElementsByTagName('svg')[0]){
            mainW.getElementsByTagName('svg')[0].remove();
        }
        var temp = list.filter(function (d) {
            return d[0] == 'P';
        });
        var barHeight = 10;
        var units = memorySize/memUnit;
        var x = d3.scale.linear()
            .domain([0, units])
            .range([0, 400]);

        var svgContainer = d3.select("#mainWindow").append("svg")
            .attr("width", 200)
            .attr("height", 400)
            .attr('fill', "blue")
            .style('float','right')
            .style('margin-top','-120px')
            .style('margin-right','50px')
            .style('border-radius' , '4px');
        //alert(x(30));

        svgContainer.append("rect")
            .attr("x", 0)
            .attr("y", 0 )
            .attr('width',200)
            .attr('height',400)
            .attr('fill', "lightblue");

        var bar = svgContainer.selectAll("g")
            .data(temp)
            .enter().append("g")
            .attr(
                "transform", function(d) {
                    return "translate(" + 0 +"," + x(d[1]) + ")";
                });
        bar.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr('width',200)
            .attr('height',function (d) {
                return x(d[2]);
            })
            .attr('fill', "steelblue")
            .style('stroke','black')
            .style('stroke-width','1px');

        var proTemp = [];
        proTemp = processTemp.filter(function (d) {
            return (d[1] != -1);
        });


        bar.append("text")
            .attr("x", 98)
            .attr("y", function (d) {
                return x(d[2])/2;
            })
            .attr("dy", ".35em")
            .attr('fill','black')
            .text(function(d) {
                for(var item in proTemp){
                    if(proTemp[item][1] == d[1] && item<=4){
                        return proTemp[item][0];
                    }
                }
            });

    }
}
window.onload = function () {
    main();
};