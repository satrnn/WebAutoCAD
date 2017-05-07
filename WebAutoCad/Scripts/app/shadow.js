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

            if(element.line.group != null)
            {
                groups[element.line.group.id] = element.line.group;
            }
        }

        for(groupId in groups){
            groups[groupId].select();
        }

        var layerShadow = document.getElementById("layerShadow");
        this._elements = [];

    }

}