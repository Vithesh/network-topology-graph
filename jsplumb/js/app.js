/**
 * Created with JetBrains WebStorm.
 * User: vithesh
 * Date: 21/8/13
 * Time: 2:05 PM
 * To change this template use File | Settings | File Templates.
 */

/*global d3*/
var app = {};
app.graphPlotter = (function () {
    "use strict";

    function indexOfLink(links, searchLink) {
        var index = -1;
        links.forEach(function (val, i) {
            if (val.source === searchLink.source && val.target === searchLink.target) {
                index = i;
                return false;
            }
        });
        return index;
    }

    function indexOfNode(groupedData, nodeName) {
        var index = -1;
        groupedData.forEach(function (val, i) {
            if (val.key === nodeName) {
                index = i;
                return false;
            }
        });
        return index;
    }

    function colorCode(log) {
        return "#FFF";
    }

    function collect(machineData) {
        var logs = [];

        d3.map(machineData).forEach(function (key, value) {
            value.forEach(function (val) {
                logs.push(val);
            });
        });

        return logs;
    }

    function groupData(logs, sources, groupByLabel1, groupByLabel2) {
        var result = d3.nest()
            .key(function (d) {
                return d[groupByLabel1];
            })
            .key(function (d) {
                return d[groupByLabel2];
            })
            .entries(logs);
        sources.forEach(function (source) {
            if (indexOfNode(result, source.name) === -1) {
                result.push({"key": source.name, "values": []});
            }
        });
        return result;
    }

    function isLinked(links, source, target) {
        var elementIndex, reverseElementIndex;
        elementIndex = indexOfLink(links, {"source": source, "target": target, "value": 1});
        reverseElementIndex = indexOfLink(links, {"source": target, "target": source, "value": 1});
        if (elementIndex === -1 && reverseElementIndex === -1) {
            return false;
        }
        return true;
    }

    function generateSourcesAndLinks(logs, label1, label2) {
        var nodeList = [],
            nodes = [],
            links = [],
            parentNodesList = [], parentNodes = [],
            result = {};

        logs.forEach(function (log) {
            var sourceIndex, targetIndex,
                value1 = log[label1],
                value2 = log[label2];

            if (value1 !== undefined && value2 !== undefined) {
                sourceIndex = nodeList.indexOf(value1);
                targetIndex = nodeList.indexOf(value2);

                if (sourceIndex === -1) {
                    nodeList.push(value1);
                    sourceIndex = nodeList.length - 1;
                }
                if (value1 !== value2) {
                    if (targetIndex === -1) {
                        nodeList.push(value2);
                        targetIndex = nodeList.length - 1;
                    }
                    if (!isLinked(links, sourceIndex, targetIndex)) {
                        links.push({"source": sourceIndex, "target": targetIndex, "value": 1});
                        parentNodesList[targetIndex] = ( parentNodesList[targetIndex] === undefined) ? 1 : parentNodesList[targetIndex]+1 ;
                    }
                }
            }

        });

        nodeList.forEach(function (node, index) {
            nodes.push({"name": node, "group": index});

            if(!parentNodesList[index])
                parentNodesList[index] = 0;

        });
        parentNodesList.forEach(function (links, index) {

            if(!parentNodes[links])
                parentNodes[links] = [];
            parentNodes[links].push(index)

        });

        result.nodes = nodes;
        console.log('total nodes : ' + nodes.length);
        result.links = links;
        result.sortedNodes = parentNodes ;
        return result;
    }


    function createNode(row, column, maxRows, maxColumns, ip_address , container , settings ) {
        var d = document.createElement("div");
        d.className = 'node-container';
        var span = document.createElement("span");
        span.className = "nodeText";
        var text = document.createTextNode(ip_address);
        span.appendChild(text);
        d.appendChild(span);
        document.getElementById(container).appendChild(d);
        var id = '' + ((new Date().getTime()));
        d.setAttribute("id", id);

        var w = screen.width - 162, h = screen.height - 162;
        var x = (0.2 * w) + Math.floor(Math.random()*(0.5 * w));
        var y = (0.2 * h) + Math.floor(Math.random()*(0.6 * h));
        d.style.top= y + 'px';
        d.style.left= x + 'px';

        var pos =  $("#"+container).position(), h = $("#"+container).height(), w = $("#"+container).width();
        var availWidth = parseFloat(w - pos.left )/maxColumns , availHeight = parseFloat(h-pos.top)/maxRows ;
        var dh = 1, dw = 1;
        var eachNodeHeight = 120;
        if(availHeight < eachNodeHeight){
            var x = pos.left + availWidth*column ;
            var y = pos.top +  eachNodeHeight*row + availHeight/2 //+ Math.random()*dh;
        }else{
            var x = pos.left + availWidth*column + availWidth/2 //+ Math.random()*dw;
            var y = pos.top +  availHeight*row + availHeight/2 //+ Math.random()*dh;
        }

        jsPlumb.animate(id, {left:y, top:x}, { duration:1400, easing:'easeOutBack' });
        return {d:d, id:id};
    }

    function renderForceDirectedGraph(settings, graphData, updatedData, container) {
        var node,
            link,
            graph,
            force;

        $("#" + container).css({height:settings.graphHeight,width:settings.graphWidth});

        for(var row = 0 ; row < graphData.sortedNodes.length ; row++){

            if( !graphData.sortedNodes[row] ) continue;

            for(var  col = 0 ; col < graphData.sortedNodes[row].length ; col++){

                var nodeIndex = graphData.sortedNodes[row][col];
                var node = graphData.nodes[nodeIndex];
                var newNode = createNode( row, col, graphData.sortedNodes.length, graphData.sortedNodes[row].length, node.name , container , settings );
                var DropOptions = {
                    tolerance:"touch",
                    hoverClass:"dropHover",
                    activeClass:"dragActive"
                };

                var styleStrokeColor = "#B64031";

                jsPlumb.addEndpoint(newNode.id, {
                    endpoint:["Image", { src:'css/images/node.png',cssClass : 'node',hoverClass :''  }],
                    isSource:true,
                    connector : "Straight",
                    maxConnections:graphData.nodes.length,
                    isTarget:true,
                    connectorStyle:{ strokeStyle:styleStrokeColor, lineWidth:1 },
                    dropOptions : DropOptions,
                    paintStyle:{ fillStyle:styleStrokeColor },
                    hoverPaintStyle:{ fillStyle:"red" },
                    connectorPaintStyle:{ strokeStyle:"blue", lineWidth:10 },
                    connectorHoverPaintStyle:{ strokeStyle:"red", outlineColor:"yellow", outlineWidth:1 }
                });

                jsPlumb.draggable(newNode.id);
                node.id = newNode.id;
            }
        }

        for(var key in graphData.links){
            link = graphData.links[key];

            var source = graphData.nodes[link.source].id ;
            var target = graphData.nodes[link.target].id ;

            jsPlumb.connect({
                source:source,
                target:target,
                connector : "Straight",
                cssClass:"c1",
                endpoint:"Blank",
                endpointClass:"c1Endpoint",
                anchors:["BottomCenter"],
                paintStyle:{
                    lineWidth:1,
                    strokeStyle:"#31b631"
                }
            });

        }

        return ;
    }

    return {
        plot: function (plotObj) {
            var logs = collect(plotObj.data),
                settings = {
                    nodeWidth: 20,
                    nodeHeight: 20,
                    nodeRadius: 10,
                    indent: 10,
                    graphWidth: 1024,
                    graphHeight: 1024,
                    columns: [],
                    colorBy: colorCode
                },
                groupedData,
                forceGraphData;

            d3.map(plotObj.options).forEach(function (key, value) {
                settings[key] = value;
            });

            jsPlumb.doWhileSuspended(function() {
                forceGraphData = generateSourcesAndLinks(logs, plotObj.link1, plotObj.link2);

                groupedData = groupData(logs, forceGraphData.nodes, plotObj.link1, plotObj.group);

                renderForceDirectedGraph(settings, forceGraphData, groupedData, plotObj.container);

                console.log('end ' + new Date());
            }, true);

        }
    };
})();

window.graphPlumb = {
    init : function() {

        // setup jsPlumb defaults.
        jsPlumb.importDefaults({
            DragOptions : { cursor: 'pointer', zIndex:2000 },
            PaintStyle : { strokeStyle:'#666' },
            EndpointStyle : { width:20, height:16, strokeStyle:'#666' },
            Endpoint : "Rectangle",
            Anchors : ["TopCenter", "TopCenter"]
        });

    }
};
