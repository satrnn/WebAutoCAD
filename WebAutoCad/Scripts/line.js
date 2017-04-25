

var lineManager = {
    lines: [],

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
        newline.label.textContent = getCurrentLabel();
        newline.label.setAttribute("text-anchor", "middle");
        
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

        $("table tbody").append("<tr data-lineid=\""+newline.id+"\"><td>"+newline.label.textContent+"</td></tr>")

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
    }
}

function PointMove(line, nr, x, y)
{
    this.Obj = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.Obj.setAttribute("cx", x);
    this.Obj.setAttribute("cy", y);
    this.Obj.setAttribute("r", 10);
    this.Obj.setAttribute("id", line.id + "_" + nr);
    this.Obj.setAttribute("fill", "red");
    this.Obj.setAttribute("stroke", "none");
    this.Obj.setAttribute("class", "point");

    this.Obj.addEventListener("mousedown", function(e){
        e.stopPropagation();

        var _thisPoint = lineManager.findPoint(this.getAttribute("id"));

        var shadowline = document.createElementNS("http://www.w3.org/2000/svg", "line");
        shadowline.setAttribute("class", "line creating");
        if(_thisPoint.Number == 1){
            shadowline.setAttribute("x1", _thisPoint.Line.x2);
            shadowline.setAttribute("y1", _thisPoint.Line.y2);
        }
        if(_thisPoint.Number == 2){
            shadowline.setAttribute("x1", _thisPoint.Line.x1);
            shadowline.setAttribute("y1", _thisPoint.Line.y1);
        }

        shadowline.setAttribute("x2", e.offsetX);
        shadowline.setAttribute("y2", e.offsetY);

        layer[0].appendChild(shadowline);

        dragElemnt = {
            point: _thisPoint,
            shadow: shadowline,
        };
    });

    line.group.appendChild(this.Obj);

    this.X = x;
    this.Y = y;
    this.Line = line;
    this.Number = nr;

    this.Delete = function()
    {
        this.Obj.parentNode.removeChild(this.Obj);
    }

    this.Move = function(x, y)
    {
        this.X = x;
        this.Y = y;
        this.Obj.setAttribute("cx", x);
        this.Obj.setAttribute("cy", y);
    }

    this.MoveEndLine = function(x, y){
        if(this.Number == 1)
            this.Line.move1(x, y);
        if(this.Number == 2)
            this.Line.move2(x, y);
    }
}

function Line()
{
    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0;
    this.y2 = 0;

    this.id = "";

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

        this.label.setAttribute("x", (parseFloat(this.x1) + parseFloat(this.x2))/2);
        this.label.setAttribute("y", (parseFloat(this.y1) + parseFloat(this.y2))/2 - 5);
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

        this.label.setAttribute("x", (parseFloat(this.x1) + parseFloat(this.x2))/2);
        this.label.setAttribute("y", (parseFloat(this.y1) + parseFloat(this.y2))/2 - 5);

    }


};
