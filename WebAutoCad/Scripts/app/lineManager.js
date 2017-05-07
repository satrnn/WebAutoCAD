

var lineManager = {
    lines: [],

    /* Tworzenie nowej linii */
    addLine: function(x1, y1, x2, y2)
    {
        var newline = new Line();
        newline.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
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
        
        newline.id = "line"+idIterator++;
        newline.group.setAttribute("id", newline.id);

        newline.group.appendChild(newline.clickable);
        newline.group.appendChild(newline.line);
        newline.group.appendChild(newline.label);
        
        newline.clickable.addEventListener("click", function(e){
            e.stopPropagation();
            var id = this.parentNode.getAttribute("id");

            lineManager.select(id);
        });
        newline.clickable.addEventListener("mousedown", function(e){
            
            var id = this.parentNode.getAttribute("id");
            var line = lineManager.find(id);

            if(line.isSelected())
            {
                e.stopPropagation();
                var selected = lineManager.findSelected();
                shadow.create(selected);
                shadow.start(e.offsetX, e.offsetY);
            }
            
        });

        layer[0].appendChild(newline.group);

       
        lineManager.lines.push(newline);

        tableManager.addRow(newline);
        
        return newline;
    },
    selectObj: function(obj){
        var id = obj.getAttribute("id");
        lineManager.select(id);
    },
    select: function(id){
        for(var i= 0; i < lineManager.lines.length; i++)
        {
            var line = lineManager.lines[i];
             if(line.id == id){

                line.Select();
                $("#type").val(line.state.type);
                $("#leng").val(line.state.leng);
                ResetFi();
                var typeDom = $("#type")[0];
                var fi = typeDom.options[typeDom.selectedIndex].dataset.fi;
                $(fi).val(line.state.fi);
             }
             else
             {
                line.Unselect();
             }
        }
       
    },
    selectInRect: function (x1, y1, x2, y2)
    {
        var firstSelect = null;
        for(var i= 0; i < lineManager.lines.length; i++)
        {
            var line = lineManager.lines[i];
             if(line.isInRect(x1, y1, x2, y2)){

                line.Select();
                if(firstSelect == null)
                    firstSelect = line;
             }
             else
             {
                line.Unselect();
             }
        }

        if(firstSelect != null)
        {
            $("#type").val(firstSelect.state.type);
            $("#leng").val(firstSelect.state.leng);
            ResetFi();
            var typeDom = $("#type")[0];
            var fi = typeDom.options[typeDom.selectedIndex].dataset.fi;
            $(fi).val(firstSelect.state.fi);
        }
    },
    unselect: function(){
        for(var i= 0; i < lineManager.lines.length; i++)
        {
            var line = lineManager.lines[i];
            line.Unselect();
        }
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
        lineManager.lines.splice(i, 1);
        delete  line;
    },
    deleteSelected: function()
    {
        var selected = lineManager.findSelected();
        for(var i = 0; i < selected.length; i++)
        {
            lineManager.deleteById(selected[i].id);
        }
    },
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
            lineManager.deleteSelected();
        });
        $groupBtn.appendTo("<li></li>")

        $popover.append($groupBtn);
        $popover.append($deleteBtn);

        $("body").append($popover);
    }
}