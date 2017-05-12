var projects = {
    _projects: [],
    $projectCointeiner: $("#projects"), 
    getAll: function(){
        $.ajax({
            type: "GET",
            url: "api/WebAutoCAD.php",
            dataType: 'json',
            data: { },
            success: function(data)
            {
                projects._projects = data;
                projects.drawList();
            },
            error: function(x, y, z)
            {
                alert(x.responseText);
            },
	    });
    },
    drawList: function()
    {
        _this = this;

        this.$projectCointeiner.html("");
        for(var i = 0; i< this._projects.length; i++)
        {
            var project = this._projects[i];

             $li = $("<li data-id=\"" + project.id + "\" >" + project.name + "</li>");
             $li.click(function(e)
             {
                 var id = e.target.dataset.id;
                 _this.loadProject(id);
             });
             this.$projectCointeiner.append($li);
        }
    },
    loadProject: function (id){
        for(var i = 0; i < this._projects.length ;i++)
        {
            var project = this._projects[i];

            this.$projectCointeiner.hide();
            editorObj.loadProject(project);
            return;
        }
    },
    init: function(){
        this.getAll();
        this.$projectCointeiner.show();
        editorObj.hide();
    }
}