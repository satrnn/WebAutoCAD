var modeEnum = {
    SELECT : 0,
    LINES : 1
}

var mode = modeEnum.SELECT; //select

$("#btn-select").click(function(){
    mode = modeEnum.SELECT;
    $("#btn-select").addClass("active");
    $("#btn-line").removeClass("active");
});
$("#btn-line").click(function(){
    mode = modeEnum.LINES;
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
        itemsManager.onContextMenu(event);
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
    if(mode == modeEnum.LINES && !shadowMoveEndPoint.isShadow())
    {
        shadowMoveEndPoint.start(e.offsetX, e.offsetY);
    }
    else if(mode == modeEnum.SELECT){
        layerSelected.startSelect(e.offsetX, e.offsetY);
    }
});

svg[0].addEventListener("mouseup", function(e){
    
    e.stopPropagation();
    if(layerSelected.isSelecting()){
        layerSelected.endSelect(e.offsetX, e.offsetY);
    }
    

    shadowMoveEndPoint.stop(e.offsetX, e.offsetY);
    shadow.stop(e.offsetX, e.offsetY);
});

svg[0].addEventListener("mousemove", function(e){
    e.preventDefault();

    if(shadowMoveEndPoint.isShadow())
    {
        shadowMoveEndPoint.move(e.offsetX, e.offsetY);
    }
    else if(layerSelected.isSelecting())
    {
        layerSelected.moveSelect(e.offsetX, e.offsetY)
    } 
    else if(shadow.isShadow())
    {
        shadow.move(e.offsetX, e.offsetY);
    }
});

$(window).on('keyup', function (evt)
{
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