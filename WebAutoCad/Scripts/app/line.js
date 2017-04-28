

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
    onContextMenu: function(event)
    {
        var line = lineManager.find(event.target.parentNode.getAttribute("id"));
        lineManager.select(line.id);
        var $popover = $("<ul>");
        $popover.addClass("popover");
        $popover.css({ left: event.pageX, top:event.pageY});
        $deleteBtn = $("<a data-lineid=\""+line.id+"\" href=\"#\">Usuń</a>");
        $deleteBtn.click(function(){
            var id = this.dataset.lineid;
            lineManager.deleteById(id);
        });
        $deleteBtn.appendTo("<li></li>")
        $popover.append($deleteBtn);

        $("body").append($popover);
    }
}

function Line()
{
    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0;
    this.y2 = 0;

    this.id = "";
    this.state = {
        leng: "0",
        type: "",
        fi: "0"
    };

    this.group = null;
    this.line = null;
    this.clickable = null;
    this.point1 = null;
    this.point2 = null;

    this.Select = function()
    {
        this.clickable.setAttribute("class","clickable select");
        $(".line_options").addClass("active");

        if(this.point1 != null)
            this.point1.Delete();

        this.point1 = new PointMove(this, 1, this.x1, this.y1);

        if(this.point2 != null)
            this.point2.Delete();

        this.point2 = new PointMove(this, 2, this.x2, this.y2);
        tableManager.select(this);
    }

    this.isSelected = function(){
        return this.clickable.getAttribute("class") == "clickable select";
    }

    this.Unselect = function()
    {
        this.clickable.setAttribute("class","clickable");

        if(this.point1 != null)
        {
            this.point1.Delete();
            this.point1 = null;
        }
        if(this.point2 != null)
        {
            this.point2.Delete();
            this.point2 = null;
        }
        tableManager.unselect(this);
    }

    this.move2 = function(x, y)
    {
        this.x2 = x;
        this.y2 = y;
        this.clickable.setAttribute("x2", x);
        this.clickable.setAttribute("y2", y);
        
        this.line.setAttribute("x2", x);
        this.line.setAttribute("y2", y);

        if(this.point2 != null)
        {
            this.point2.Move(x, y);
        }

        this.moveLabel();
    }

    this.move1 = function(x, y)
    {
        this.x1 = x;
        this.y1 = y;
        this.clickable.setAttribute("x1", x);
        this.clickable.setAttribute("y1", y);

        this.line.setAttribute("x1", x);
        this.line.setAttribute("y1", y);

        if(this.point1 != null)
        {
            this.point1.Move(x, y);
        }

        this.moveLabel();
    }

    this.moveLabel = function(){
        this.label.setAttribute("x", (parseFloat(this.x1) + parseFloat(this.x2))/2);
        this.label.setAttribute("y", (parseFloat(this.y1) + parseFloat(this.y2))/2 - 5);
    }

    this.setState= function(data){
        this.state = jQuery.extend({}, data);;
        var text = this.state.type + " fi"+ this.state.fi + " " + this.state.leng + "[m]";
        this.label.textContent = text;
    }

    this.delete = function(){
        tableManager.deleteRow(this);

        this.point1.Delete();
        this.point2.Delete();

        this.group.parentNode.removeChild(this.group);
    }

};
