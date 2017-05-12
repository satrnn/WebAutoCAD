var itemsManager = {
    onContextMenu: function(event)
    {
        var line = lineManager.find(event.target.parentNode.getAttribute("id"));
        if(!line.isSelected()){
            lineManager.select(line.id);
        }
        
        var $popover = $("<ul>");
        $popover.addClass("popover");
        $popover.css({ left: event.pageX, top:event.pageY});
        $deleteBtn = $("<a data-lineid=\""+line.id+"\" href=\"#\">Usuń</a>");
        $deleteBtn.click(function(){
            var id = this.dataset.lineid;
            lineManager.deleteSelected();
        });
        $deleteBtn.appendTo("<li></li>");

        $groupBtn = $("<a data-lineid=\""+line.id+"\" href=\"#\">Grupuj</a>");
        $groupBtn.click(function(){
            var id = this.dataset.lineid;
            itemsManager.groupSelected();
        });
        $groupBtn.appendTo("<li></li>")

        $popover.append($groupBtn);

        var selected = lineManager.findSelected();
        if(groupManager.hasGroups(selected))
        {
            $ungroupBtn = $("<a data-lineid=\""+line.id+"\" href=\"#\">Rozgrupuj</a>");
            $ungroupBtn.click(function(){
                var id = this.dataset.lineid;
                itemsManager.ungroupSelected();
            });
            $ungroupBtn.appendTo("<li></li>")

            $popover.append($ungroupBtn);
        }
        

        $popover.append($deleteBtn);

        $("body").append($popover);
    },
    groupSelected: function(){
        var selected = lineManager.findSelected();
        groupManager.createGroup(selected);
    },
    ungroupSelected: function(){
        var selected = lineManager.findSelected();
        groupManager.ungroup(selected);
    },
    
};

var lineManager = {
    _idIterator: 0,
    lines: [],
    /* Tworzenie nowej linii */
    addLine: function(x1, y1, x2, y2)
    {
        var newline = new Line();
        newline.container = document.createElementNS("http://www.w3.org/2000/svg", "g");
        newline.line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        newline.clickable = document.createElementNS("http://www.w3.org/2000/svg", "line");
        newline.label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        
        newline.line.setAttribute("class", "line");

        newline.clickable.setAttribute("class", "clickable");
        newline.clickable.setAttribute("stroke-width", "10px");
        newline.clickable.setAttribute("stroke-linecap", "round");
        
        newline.label.setAttribute("class", "label");
        newline.label.setAttribute("text-anchor", "middle");
        
        var data = lineManager.readInputs();

        newline.setState(data);

        newline.move1(x1, y1);
        newline.move2(x2, y2);
        
        newline.id = "line"+this._idIterator++;
        newline.container.setAttribute("id", newline.id);

        newline.container.appendChild(newline.clickable);
        newline.container.appendChild(newline.line);
        newline.container.appendChild(newline.label);
        
        newline.container.addEventListener("click", function(e){
            e.stopPropagation();
            var id = this.getAttribute("id");

            lineManager.select(id);
        });
        newline.container.addEventListener("mousedown", function(e){
            
            var id = this.getAttribute("id");
            var line = lineManager.find(id);

            if(line.isSelected())
            {
                e.stopPropagation();
                var selected = lineManager.findSelected();
                shadow.create(selected);
                shadow.start(e.offsetX, e.offsetY);
            }
            
        });
        editorObj.appendLayer(newline.container);
        lineManager.lines.push(newline);

        tableManager.addRow(newline);
        
        return newline;
    },
    loadLine: function(line)
    {
        var newLine = this.addLine(line.x1, line.y1, line.x2, line.y2);
        newLine.setState(line.state);
    },
    selectObj: function(obj){
        var id = obj.getAttribute("id");
        lineManager.select(id);
    },
    select: function(id)
    {
        var wasSelected = false;
        var selectedLine = this.find(id);
        if(selectedLine != null){
             wasSelected = selectedLine.isSelected();
        }

        for(var i= 0; i < this.lines.length; i++)
        {
            var line = lineManager.lines[i];
             
            if(line.group != null)
            {
                line.group.unselect();
            }
            else
                line.unselect();
        }

        if(selectedLine != null){
            if(selectedLine.group == null || wasSelected)
            {
                selectedLine.select(true);
                editorObj.setFormValues(selectedLine.state);
               

                if(selectedLine.group != null)
                {
                    selectedLine.group.showFrame();
                }
            }
            else
            {
                selectedLine.group.select();
            }
        }
        groupPanel.refresh();
    },
    selectInRect: function (x1, y1, x2, y2)
    {
        var linesInRect = [];
        for(var i= 0; i < lineManager.lines.length; i++)
        {
             var line = lineManager.lines[i];
             if(line.isInRect(x1, y1, x2, y2)){
                linesInRect.push(line);
             }
             else
             {
                line.unselect();
             }
        }
        if(linesInRect.length != 0)
        {
            if(linesInRect.length == 1 && linesInRect[0].group == null)
            {
                linesInRect[0].select(true);
            }
            else
            {
                for(var i= 0; i < linesInRect.length; i++)
                {
                    if(linesInRect[i].group == null){
                        linesInRect[i].select(false);
                    }
                    else
                    {
                        linesInRect[i].group.select();
                    }
                }
            }
            editorObj.setFormValues(linesInRect[0].state);
        }
        
        groupPanel.refresh();
    },
    unselect: function(){
        for(var i= 0; i < lineManager.lines.length; i++)
        {
            var line = lineManager.lines[i];
            line.unselect();
        }
        groupPanel.refresh();
    },
    find: function(id) {
        for(var i= 0; i < lineManager.lines.length; i++)
        {
            var line = lineManager.lines[i];
             if(line.id == id){
                return line;
             }
        }
    },
    index: function(id) {
        for(var i=0; i < lineManager.lines.length; i++)
        {
            var line = lineManager.lines[i];
             if(line.id == id){
                return i;
             }
        }
    },
    findPoint: function(id){
        var tmp = id.split("_");
        var line = lineManager.find(tmp[0]);
        var number = tmp[1];

        if(number == 1)
        {
            return line.point1;
        }
        if(number == 2)
        {
            return line.point2;
        }
    },

    findSelected: function()
    {
        var selected = [];
        for(var i = 0; i < lineManager.lines.length; i++)
        {
            var line = lineManager.lines[i];
             if(line.isSelected()){
                selected.push(line);
             }
        }
        return selected;
    },
    readInputs: function(){
        var leng = $("#leng").val();
        if(leng == "")
            leng = 0;

        var type = $("#type").val();
        var typeDom = $("#type")[0];
        var fi = typeDom.options[typeDom.selectedIndex].dataset.fi;
        var fiValue = $(fi).val();

        return {
            type: type,
            leng: leng,
            fi: fiValue,
        }
    },
    updateSelectedLines: function(){

        var data = lineManager.readInputs();

        var selected = lineManager.findSelected();
        for(var i = 0; i < selected.length; i++)
        {
            selected[i].setState(data);
            tableManager.updateRow(selected[i]);
        }
    },
    
    deleteById: function(id)
    {
        var line = lineManager.find(id);
        var i = lineManager.index(id);
        line.delete();
        if(line.group != null){
            line.group.deleteLine(line);
        }

        lineManager.lines.splice(i, 1);
        delete line;

        groupPanel.refresh();
    },
    deleteSelected: function()
    {
        var selected = lineManager.findSelected();
        for(var i = 0; i < selected.length; i++)
        {
            lineManager.deleteById(selected[i].id);
        }

        groupPanel.refresh();
    },
    deleteAll: function()
    {
        var selected = this.lines;
        for(var i = 0; i < selected.length; i++)
        {
            lineManager.deleteById(selected[i].id);
        }

        groupPanel.refresh();
    },
}