var groupManager = {
    _idIterator: 0,
    //groups: [],
    createGroup: function (selectedLines)
    {
        var newGroup = new Group();
        newGroup.id = "group_"+this._idIterator++;
        
        var oldGroups = {};

        for(var i = 0 ; i < selectedLines.length; i++)
        {
            if(selectedLines[i].group != null)
            {
                oldGroups[selectedLines[i].group.id] = selectedLines[i].group;
            }

            newGroup.addLine(selectedLines[i]);
            selectedLines[i].group = newGroup;
        }

        for(groupId in oldGroups){
            oldGroups[groupId].delete();
        }

        newGroup.select();

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
        }

        for(groupId in oldGroups){
            oldGroups[groupId].delete();
        }

        return newGroup;
    },
    hasGroups: function(selectedLines){
        
        for(var i = 0 ; i < selectedLines.length; i++)
        {
            if(selectedLines[i].group != null)
            {
                return true;
            }
        }

        return false;
    }
}