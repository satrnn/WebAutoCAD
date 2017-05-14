var projects = {
    currentProjectId: null,
    currentProjectName: null,
    _projects: [],
    $projectCointeiner: $("#projects"), 
    $projectListCointeiner: $("#projectList tbody"), 
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
        this.$projectListCointeiner.html("");
        for(var i = 0; i< this._projects.length; i++)
        {
            var project = this._projects[i];
            $deleteBtn = $("<a href=\"#\" class=\"btn btn-danger btn-xs\"><span class=\"glyphicon glyphicon-remove\"></span></a>");
            $deleteBtn.click(function(e){
                e.preventDefault();
                e.stopPropagation();
                var row = $(this).closest("tr")[0];
                var id = row.dataset.id;

                _this.displayModalDeleteProject(id);
            });

            $li = $("<tr data-id=\"" + project.id + "\" ><td>" + project.name + "</td><td>" + project.lastUpdate +"</td><td class=\"text-right\"></td></tr>");
            $li.find(".text-right").append($deleteBtn);
            $li.click(function(e)
            {
                 var id = this.dataset.id;
                 _this.loadProject(id);
            });
            this.$projectListCointeiner.append($li);
        }
    },
    displayModalDeleteProject: function(id)
    {
        var project = this.find(id);
        var deleteProjectId = id;
        var modal = $("#myModal");
        modal.find(".modal-body").html("<p>Czy na pewno usunąć <strong>" + project.name + "</strong>?</p>");
        modal.find(".modal-title").text("Usuwanie projektu");
        modal.find(".btn-action")
            .off()
            .click(function(){
                modal.modal('hide');
                projects.deleteProject(deleteProjectId);
            });
        modal.modal('show');
    },
    deleteProject: function(id)
    {
         $.ajax({
            type: "POST",
            url: "api/WebAutoCAD.php",
            dataType: 'json',
            data: { 
                id: id,
                delete: true,
            },
            success: function(data)
            {
                projects.refresh();
            },
            error: function(x, y, z)
            {
                alert(x.responseText);
            },
	    });
    },
    find : function(id)
    {
        for(var i = 0; i < this._projects.length ;i++)
        {
            var project = this._projects[i];
            if(project.id == id)
            {
                return project;
            }
        }
    },
    loadProject: function (id)
    {
        var project = this.find(id);

        this.$projectCointeiner.hide();
        
        this.currentProjectId = project.id;
        this.currentProjectName = project.name;
        
        editorObj.loadProject(project);
        
    },
    createNewProject: function()
    {
        this.$projectCointeiner.hide();
        this.currentProjectId = null;
        this.currentProjectName = "Projekt";
        editorObj.loadProject();
    },
    show: function (){
         this.$projectCointeiner.show();
    },
    refresh: function()
    {
        this.getAll();
        this.$projectCointeiner.show();
        editorObj.hide();
    },
    init: function(){
        $("#btn-create-project").click(function(e){
            projects.createNewProject();
        });
        this.refresh();
    }
}