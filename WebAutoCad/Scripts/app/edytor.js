
function editorManager() {
    var _this = this;
    var svg = $("svg");
    var layer = $("#layer1");

    this.modeEnum = {
        SELECT : 0,
        LINES : 1
    }

    this.mode = this.modeEnum.SELECT;

    this.resetFi = function()
    {
        $("#fi_1,#fi_2,#fi_3").hide();
        var type = $("#type")[0];
        var fi = type.options[type.selectedIndex].dataset.fi;
        $(fi).show();
    }
    this.hide = function(){
        $("#w-editor").hide();
    }
    this.show = function(){
        $("#w-editor").show();
    }
    this.init = function()
    {
        this.resetFi();

        $("#btn-select").click(function(){
            _this.mode = _this.modeEnum.SELECT;
            $("#btn-select").addClass("active");
            $("#btn-line").removeClass("active");
        });
        $("#btn-line").click(function(){
            _this.mode = _this.modeEnum.LINES;
            $("#btn-line").addClass("active");
            $("#btn-select").removeClass("active");
        });

        $("w-project-name").click(function(){

        });
        $("#type").change(function(e){
            _this.resetFi();

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
            if(_this.mode == _this.modeEnum.LINES && !shadowMoveEndPoint.isShadow())
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

        settingsModal.init();
    }
    this.setFormValues = function(state) {
         $("#type").val(state.type);
         $("#leng").val(state.leng);
        this.resetFi();
        var typeDom = $("#type")[0];
        var fi = typeDom.options[typeDom.selectedIndex].dataset.fi;
        $(fi).val(state.fi);
    }
    this.appendLayer = function(shadowline){
         layer[0].appendChild(shadowline);
    }
    this.clear = function()
    {
        lineManager.deleteAll();
    }

    this.loadProject = function(project)
    {
        this.clear();
        this.show();
        if(project != undefined && project.content != null)
        {
            var loadedGroups = groupManager.loadGroup(project.content.groups);
            for(var i = 0; i < project.content.lines.length; i++)
            {
                var line =  project.content.lines[i];
                lineManager.loadLine(line, loadedGroups);
            }
        }
        $("#w-project-name").text(projects.currentProjectName);
        
    }
    return this;
};

/*
function getCurrentLabel(){
    var leng = $("#leng").val();
    if(leng == "")
        leng = 0;

    return $("#type").val() + " " + leng + "[m]";

}*/



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


var settingsModal =  {
    init: function()
    {
        $('#settingsModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var modal = $(this);

            modal.find('.modal-title').text('Ustawienia');
            modal.find('.modal-body input').val(button.text());
        });

        $("#form-settings").submit(function(e){
             e.preventDefault();
             var modal = $('#settingsModal');
             modal.modal("hide");

             var projectName = modal.find('.modal-body input').val();
             $("#w-project-name").text(projectName);
             projects.currentProjectName = projectName;

             return false;
        });
    }
}