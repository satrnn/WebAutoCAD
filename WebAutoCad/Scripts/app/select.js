var layerSelected = {
    layer: $("#layerSelect")[0],
    selectDOM: null,
    start: {
        x: 0,
        y: 0,
    },
    startSelect: function(x, y)
    {
        layerSelected.selectDOM = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        layerSelected.selectDOM.setAttribute("stroke", "#000000");
        layerSelected.selectDOM.setAttribute("stroke-dasharray", "5, 5");
        layerSelected.selectDOM.setAttribute("stroke-width", "0.7px");
        layerSelected.selectDOM.setAttribute("fill", "none");
        layerSelected.selectDOM.setAttribute("x", x);
        layerSelected.selectDOM.setAttribute("y", y);
        layerSelected.selectDOM.setAttribute("width", 0);
        layerSelected.selectDOM.setAttribute("height", 0);

        layerSelected.layer.appendChild(layerSelected.selectDOM);

        layerSelected.start.x = x;
        layerSelected.start.y = y;

        lineManager.select(null);
    },
    moveSelect: function(x, y){
        if(layerSelected.selectDOM != null)
        {
            var newx = 0;
            var width = 0;
            var newy = 0;
            var height = 0;
            if(layerSelected.start.x > x)
            {
                newx = x; 
                width = layerSelected.start.x - x;
            }
            else
            {
                newx =  layerSelected.start.x;
                width = x - layerSelected.start.x;
            }

            if(layerSelected.start.y > y)
            {
                newy = y; 
                height = layerSelected.start.y - y;
            }
            else
            {
                newy =  layerSelected.start.y;
                height = y - layerSelected.start.y;
            }

            layerSelected.selectDOM.setAttribute("x", newx);
            layerSelected.selectDOM.setAttribute("width", width);
            layerSelected.selectDOM.setAttribute("y", newy);
            layerSelected.selectDOM.setAttribute("height", height);
        }
    },
    endSelect: function(x, y)
    {
        if(layerSelected.selectDOM != null)
        {
            layerSelected.layer.removeChild(layerSelected.selectDOM);

            while (layerSelected.layer.firstChild) {
                layerSelected.layer.removeChild(layerSelected.layer.firstChild);
            }

            lineManager.selectInRect(layerSelected.start.x, layerSelected.start.y, x, y);
        }

        layerSelected.selectDOM = null;
    },
    isSelecting: function() {
        return layerSelected.selectDOM != null;
    }
}