var mode = 0; //select
$("#btn-select").click(function(){
    mode = 0;
});
$("#btn-line").click(function(){
    mode = 1;
});


var svg = $("svg");
var layer = $("#layer1");

var dragElemnt = null;

var idIterator = 0;
/*
function createPoint(x, y)
{
    var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
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

}*/

function selectLine(node)
{
    $(".line_options").show();
}

function addLine(x, y)
{
    var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    
    line.setAttribute("class", "line creating");
    line.setAttribute("x1", x);
    line.setAttribute("y1", y);
    line.setAttribute("x2", x);
    line.setAttribute("y2", y);

    group.setAttribute("id", "line"+idIterator++);

    group.appendChild(line);

    layer[0].appendChild(group);

    line.addEventListener("click", function(e){
        e.stopPropagation();
        selectLine(this);
    });

    return {
        group: group,
        line: line,
    };
}

svg[0].addEventListener("mousedown", function(e)
{
    if(mode == 1)
    {
        var line = addLine(e.offsetX, e.offsetY);
        dragElemnt = line;
    }
});

svg[0].addEventListener("mouseup", function(e){
    e.stopPropagation();
    if(mode == 1)
    {
        var x1 = dragElemnt.line.getAttribute("x1");
        var y1 = dragElemnt.line.getAttribute("y1");
        
        var x2 = dragElemnt.line.getAttribute("x2");
        var y2 = dragElemnt.line.getAttribute("y2");

        if(x1 == x2 && y1 == y2){
            dragElemnt.group.parentNode.removeChild(dragElemnt.group);
        }
        else
        {
            dragElemnt.line.setAttribute("class", "line");
            selectLine(dragElemnt);
        }
    }
   
    dragElemnt = null;
});

svg[0].addEventListener("mousemove", function(e){
    
    if(dragElemnt != null){
        dragElemnt.line.setAttribute("x2", e.offsetX);
        dragElemnt.line.setAttribute("y2", e.offsetY);
    }
    else
    {
        //startPoint = addPoint(e.offsetX, e.offsetY);

    }
});