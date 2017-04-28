var mode = 0; //select
$("#btn-select").click(function(){
    mode = 0;
    $("#btn-select").addClass("active");
    $("#btn-line").removeClass("active");
});
$("#btn-line").click(function(){
    mode = 1;
    $("#btn-line").addClass("active");
    $("#btn-select").removeClass("active");
});

function ResetFi()
{
    $("#fi_1,#fi_2,#fi_3").hide();
    var type = $("#type")[0];
    var fi = type.options[type.selectedIndex].dataset.fi;
    $(fi).show();
}
ResetFi();

$("#type").change(function(e){
    ResetFi();

    lineManager.updateSelectedLines();
});

$("#fi_1").change(function(e){
    lineManager.updateSelectedLines();
});

$("#fi_2").change(function(e){
    lineManager.updateSelectedLines();
});

$("#fi_3").change(function(e){
    lineManager.updateSelectedLines();
});

$("#leng").change(function(e){
    lineManager.updateSelectedLines();
});

var svg = $("svg");
var layer = $("#layer1");

var dragElemnt = null;

var idIterator = 0;

function getCurrentLabel(){
    var leng = $("#leng").val();
    if(leng == "")
        leng = 0;

    return $("#type").val() + " " + leng + "[m]";

}

svg[0].addEventListener("contextmenu", function(event){
    event.preventDefault();
    event.stopPropagation();
    $(".popover").remove();
    if(event.target.nodeName === "svg"){

    } 
    else
    {
        lineManager.onContextMenu(event);
    }

    return false;
});

svg[0].addEventListener("mousedown", function(e)
{
    $(".popover").remove();
    if(e.which != 1)
    {
        return;
    }
    if(e.target.tagName == "text")
    {
        lineManager.selectObj(e.target.parentNode);
        return;
    }
    if(mode == 1 && dragElemnt == null)
    {
        var shadowline = document.createElementNS("http://www.w3.org/2000/svg", "line");
        shadowline.setAttribute("class", "line creating");
        shadowline.setAttribute("x1", e.offsetX);
        shadowline.setAttribute("y1", e.offsetY);
        
        shadowline.setAttribute("x2", e.offsetX);
        shadowline.setAttribute("y2", e.offsetY);

        layer[0].appendChild(shadowline);

        dragElemnt = {
            line: null,
            shadow: shadowline,
        };
    }
    else if(mode == 0){
        layerSelected.startSelect(e.offsetX, e.offsetY);
    }
});

svg[0].addEventListener("mouseup", function(e){
    
    e.stopPropagation();
    if(layerSelected.isSelecting()){
        layerSelected.endSelect(e.offsetX, e.offsetY);
    }
    else if(mode == 1 && dragElemnt != null && dragElemnt.shadow != null)
    {
        var x1 = dragElemnt.shadow.getAttribute("x1");
        var y1 = dragElemnt.shadow.getAttribute("y1");
        
        var x2 = dragElemnt.shadow.getAttribute("x2");
        var y2 = dragElemnt.shadow.getAttribute("y2");

        if(x1 == x2 && y1 == y2){
            
        }
        else
        {
            if(dragElemnt.point == null){
                var newLine = lineManager.addLine(x1, y1, x2, y2);
                lineManager.select(newLine.id);
            }
            else
            {
                dragElemnt.point.MoveEndLine(x2, y2);
            }
        }
    }
    else
    {
        if(dragElemnt != null && dragElemnt.point != null)
        {
            var x2 = dragElemnt.shadow.getAttribute("x2");
            var y2 = dragElemnt.shadow.getAttribute("y2");
            dragElemnt.point.MoveEndLine(x2, y2);
        }
    }


    if(dragElemnt != null && dragElemnt.shadow != null)
    {
        dragElemnt.shadow.parentNode.removeChild(dragElemnt.shadow);
    }
        
    dragElemnt = null;
});

svg[0].addEventListener("mousemove", function(e){
    e.preventDefault();

    if(dragElemnt != null)
    {
        dragElemnt.shadow.setAttribute("x2", e.offsetX);
        dragElemnt.shadow.setAttribute("y2", e.offsetY);
    }
    else if(layerSelected.isSelecting())
    {
        layerSelected.moveSelect(e.offsetX, e.offsetY)
    }
});
$(window).on('keyup', function (evt){
    if(evt.keyCode == 46)
    {
        lineManager.deleteSelected();
    }
 });

$(document).click(function(e){
    $(".popover").remove();
}).contextmenu(function(e){
    $(".popover").remove();
});