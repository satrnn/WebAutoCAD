var svg = $("svg");
var layer = $("#layer1");

var dragElemnt = null;
var startPoint = null;

var idIterator = 0;

function createPoint(x, y)
{
    var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");//.createElement("");
    rect.setAttribute("x", x - 5);
    rect.setAttribute("y", y - 5);
    rect.setAttribute("class", "point");
    rect.setAttribute("height", 10);
    rect.setAttribute("width", 10);

    rect.addEventListener("mousedown", function(e){
        e.stopPropagation();
        dragElemnt = this;
    });
    rect.addEventListener("click", function(e){
        e.stopPropagation();
        this.setAttribute("class", "point active");
    });

    return rect;

}

function addPoint(x, y)
{
    var rect = createPoint(x, y);
    layer[0].appendChild(rect);

    return rect;
}

function addLine(x, y)
{
    var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var startPoint = createPoint(x, y);
    var endPoint = createPoint(x, y);
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    
    path.setAttribute("class", "line");
    path.setAttribute("d", "M " + x +"," + y);

    group.setAttribute("id", "line"+idIterator++);

    group.appendChild(path);
    group.appendChild(startPoint);
    group.appendChild(endPoint);
    

    layer[0].appendChild(group);
    return {
        group: group,
        startPoint: startPoint,
        endPoint: endPoint,
        line: path,
    };
}

svg[0].addEventListener("mousedown", function(e)
{
    var line = addLine(e.offsetX, e.offsetY);
    dragElemnt = line.endPoint;
});

svg[0].addEventListener("mouseup", function(e){
    e.stopPropagation();
    dragElemnt = null;
});

svg[0].addEventListener("mousemove", function(e){
    
    if(dragElemnt != null){
        dragElemnt.setAttribute("x", e.offsetX - 5);
        dragElemnt.setAttribute("y", e.offsetY - 5);

        var line = dragElemnt.parentNode.querySelectorAll("path")[0];
        var points = dragElemnt.parentNode.querySelectorAll("rect");
        var x1 = parseFloat(points[0].getAttribute("x")) + 5;
        var y1 = parseFloat(points[0].getAttribute("y")) + 5;
        var x2 = parseFloat(points[1].getAttribute("x")) + 5;
        var y2 = parseFloat(points[1].getAttribute("y")) + 5;
        line.setAttribute("d", "M "+x1 + ","+y1+" " +x2 + ","+y2)
    }
    else
    {
        //startPoint = addPoint(e.offsetX, e.offsetY);

    }
});