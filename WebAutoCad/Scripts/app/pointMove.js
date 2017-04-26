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
        if(e.which != 1){
            return;
        }
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