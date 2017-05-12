var shadowMoveEndPoint = {
     _dragElemnt: null,

    // czy trwa ruch
    isShadow: function(){
        return this._dragElemnt != null && this._dragElemnt.shadow != null;
    },

    isMovingPoint: function(){
        return this.isShadow() && this._dragElemnt.point != null;
    },

    start: function(x, y){
        var shadowline = document.createElementNS("http://www.w3.org/2000/svg", "line");
        shadowline.setAttribute("class", "line creating");
        shadowline.setAttribute("x1", x);
        shadowline.setAttribute("y1", y);
        
        shadowline.setAttribute("x2", x);
        shadowline.setAttribute("y2", y);

        editorObj.appendLayer(shadowline);
       

        this._dragElemnt = {
            shadow: shadowline,
        };
    },

    startPoint: function (point, x, y)
    {
        this.start(x, y);
        if(point.Number == 1){
            this._dragElemnt.shadow.setAttribute("x1", point.Line.x2);
            this._dragElemnt.shadow.setAttribute("y1", point.Line.y2);
        }
        if(point.Number == 2){
            this._dragElemnt.shadow.setAttribute("x1", point.Line.x1);
            this._dragElemnt.shadow.setAttribute("y1", point.Line.y1);
        }

        this._dragElemnt.point = point;
    },


    move: function(x, y){
        this._dragElemnt.shadow.setAttribute("x2", x);
        this._dragElemnt.shadow.setAttribute("y2", y);
    },

    stop: function(x, y)
    {
        if(mode == modeEnum.LINES && this.isShadow())
        {
            var x1 = this._dragElemnt.shadow.getAttribute("x1");
            var y1 = this._dragElemnt.shadow.getAttribute("y1");
            
            var x2 = this._dragElemnt.shadow.getAttribute("x2");
            var y2 = this._dragElemnt.shadow.getAttribute("y2");

            if(x1 == x2 && y1 == y2)
            {
                lineManager.unselect();
            }
            else
            {
                if(this._dragElemnt.point == null)
                {
                    var newLine = lineManager.addLine(x1, y1, x2, y2);
                    lineManager.select(newLine.id);
                }
            }
        }

        if(this.isMovingPoint())
        {
            this._dragElemnt.point.MoveEndLine(x, y);
        }

        if(this._dragElemnt != null && this._dragElemnt.shadow != null)
        {
            this._dragElemnt.shadow.parentNode.removeChild(this._dragElemnt.shadow);
            this._dragElemnt.shadow = null;
        }
        
        this._dragElemnt = null;
    },


}

var shadow = {
    _elements: [],
    _start: {
        x: 0,
        y: 0,
    },
    create: function(lines)
    {
        var layerShadow = document.getElementById("layerShadow");
        for(var i = 0; i < lines.length; i++)
        {
            var line = lines[i];
            
            var shadowline = document.createElementNS("http://www.w3.org/2000/svg", "line");
            shadowline.setAttribute("class", "shadow");
            shadowline.setAttribute("x1", line.x1);
            shadowline.setAttribute("y1", line.y1);
        
            shadowline.setAttribute("x2", line.x2);
            shadowline.setAttribute("y2", line.y2);

            layerShadow.appendChild(shadowline);

            this._elements.push({
                line: line,
                shadowline: shadowline
            });
        }

    },
    start: function(x, y){
        shadow._start.x = x;
        shadow._start.y = y;
    },
    isShadow: function(){
        return this._elements.length != 0;
    },
    move: function(x, y)
    {
        var vectorX = x - this._start.x;
        var vectorY = y - this._start.y;

        for(var i = 0; i < this._elements.length; i++)
        {
            var element = this._elements[i];

            element.shadowline.setAttribute("x1", parseFloat(element.line.x1) + vectorX);
            element.shadowline.setAttribute("y1", parseFloat(element.line.y1) + vectorY);
        
            element.shadowline.setAttribute("x2", parseFloat(element.line.x2) + vectorX);
            element.shadowline.setAttribute("y2", parseFloat(element.line.y2) + vectorY);

        }
    },
    stop: function(x, y){
        var vectorX = x - this._start.x;
        var vectorY = y - this._start.y;

        var groups = {};

        for(var i = 0; i < this._elements.length; i++)
        {
            var element = this._elements[i];
            element.line.move1(parseFloat(element.line.x1) + vectorX, parseFloat(element.line.y1) + vectorY);
            element.line.move2(parseFloat(element.line.x2) + vectorX, parseFloat(element.line.y2) + vectorY);

            element.shadowline.parentNode.removeChild(element.shadowline);
            element.shadowline == null;

            if(element.line.group != null)
            {
                groups[element.line.group.id] = element.line.group;
            }
        }

        for(groupId in groups){
            groups[groupId].showFrame();
        }

        var layerShadow = document.getElementById("layerShadow");
        this._elements = [];

    }

}