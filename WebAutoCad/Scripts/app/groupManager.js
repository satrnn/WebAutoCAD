var groupPanel = {
    _$panel: $("#group_options"),
    init: function(){
        this.refresh();
        
         $("#group_name").change(function(event){
             var groups = groupManager.getSelectedGroups();

             for(var i in groups){
                groups[i].setName(this.value);
             }
         });
         $("#group_multiplier").change(function(event){
             var groups = groupManager.getSelectedGroups();
             
             for(var i in groups){
                groups[i].setMultiplier(this.value);
             }
         });
    },
    refresh: function()
    {
        var groups = groupManager.getSelectedGroups();
        if(groups.length == 0)
        {
            this._$panel.hide();
        }
        else
        {
            this._$panel.show();

            $("#group_name").val(groups[0].state.name);
            $("#group_multiplier").val(groups[0].state.multiplier);
        }
    }

}


var groupManager = {
    _idIterator: 0,
    //groups: [],
    createGroup: function (selectedLines)
    {
        var newGroup = new Group();
        var id = this._idIterator++;
        newGroup.id = "group_" + id;
        newGroup.state.name = "Gruupa " + id;
        var oldGroups = {};

        for(var i = 0 ; i < selectedLines.length; i++)
        {
            if(selectedLines[i].group != null)
            {
                oldGroups[selectedLines[i].group.id] = selectedLines[i].group;
            }

            newGroup.addLine(selectedLines[i]);
            selectedLines[i].group = newGroup;

            tableManager.updateRow(selectedLines[i]);
        }

        for(groupId in oldGroups)
        {
            oldGroups[groupId].delete();
        }

        newGroup.select();

        groupPanel.refresh();
        return newGroup;
    },
    ungroup: function (selectedLines)
    {   
        var oldGroups = {};

        for(var i = 0 ; i < selectedLines.length; i++)
        {
            if(selectedLines[i].group != null)
            {
                oldGroups[selectedLines[i].group.id] = selectedLines[i].group;
            }

            selectedLines[i].group = null;

            tableManager.updateRow(selectedLines[i]);
        }

        for(groupId in oldGroups){
            oldGroups[groupId].delete();
        }

        groupPanel.refresh();
    },
    hasGroups: function(selectedLines)
    {    
        for(var i = 0 ; i < selectedLines.length; i++)
        {
            if(selectedLines[i].group != null)
            {
                return true;
            }
        }

        return false;
    },
    getSelectedGroups: function()
    {
        var slectedLines = lineManager.findSelected();
        var groups = {};
        for(var i = 0; i < slectedLines.length; i++)
        {
            var group = slectedLines[i].group;
            if(group != null)
            {
                groups[group.id] = group;
            }
        }
        var arr = Object.keys(groups).map(function (key) { return groups[key]; });
        return arr;
    }
}