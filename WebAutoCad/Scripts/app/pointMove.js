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
        shadowMoveEndPoint.startPoint(_thisPoint, e.offsetX, e.offsetY);
    });
    $("#layerPoints")[0].appendChild(this.Obj);

    this.X = x;
    this.Y = y;
    this.Line = line;
    this.Number = nr;

    this.Delete = function()
    {
        if(this.Obj != null && this.Obj.parentNode != null)
            this.Obj.parentNode.removeChild(this.Obj);

        this.Obj = null;
    }

    this.Move = function(x, y)
    {
        this.X = x;
        this.Y = y;
        if(this.Obj != null){
            this.Obj.setAttribute("cx", x);
            this.Obj.setAttribute("cy", y);
        }
        
    }

    this.MoveEndLine = function(x, y)
    {
        if(this.Number == 1)
            this.Line.move1(x, y);
        if(this.Number == 2)
            this.Line.move2(x, y);
    }
}