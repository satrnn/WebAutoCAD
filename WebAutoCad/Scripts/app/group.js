function Group()
{
    this.id = null;
    this.lines = [];
    this.frame = null;

    this.state = {
        name: "",
        multiplier: 1,
    }

    this.setName = function(value){
        this.state.name = value;
        tableManager.updateRows(this.lines);
    }

    this.setMultiplier = function(value){
        this.state.multiplier = parseFloat(value);
        tableManager.updateRows(this.lines);
    }

    this.addLine = function(line)
    {
        this.lines.push(line);
    }
    this.deleteLine = function(line)
    {
        for(var i = 0; i < this.lines.length; i++)
        {
            if(line.id == this.lines[i].id){
                this.lines.splice(i, 1);
                break;
            }
        }

        if(this.lines.length == 0){
            this.delete();
        }
    }
    this.select = function()
    {
        this.showFrame();
        for (var i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];

            line.select(false);
        }
    }

    this.showFrame = function()
    {
        if(this.lines.length == 0)
        {
            return;
        }

        var x1 = 9999, x2 = 0, y1 = 9999, y2 = 0;
        
        for (var i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            
            if(line.getLeft() < x1)
            {
                x1 = line.getLeft();
            }
            if(line.getRight() > x2)
            {
                x2 = line.getRight();
            }
            
            if(line.getTop() < y1)
            {
                y1 = line.getTop();
            }
            if(line.getBottom() > y2)
            {
                y2 = line.getBottom();
            }
        }

        if(this.frame == null)
        {
            this.frame = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            this.frame.setAttribute("stroke", "#bde3ff");
            this.frame.setAttribute("stroke-width", "0.7px");
            this.frame.setAttribute("fill", "none");
            layer[0].appendChild(this.frame);
        }
        
        this.frame.setAttribute("x", x1);
        this.frame.setAttribute("y", y1);
        this.frame.setAttribute("width", x2 - x1);
        this.frame.setAttribute("height", y2 - y1);
    }

    this.unselect = function()
    {
         for (var i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            line.unselect();
         }

        if(this.frame != null)
        {
            this.frame.parentNode.removeChild(this.frame);
        }
        this.frame = null;
    }

    this.delete = function()
    {
        if(this.frame != null)
        {
            this.frame.parentNode.removeChild(this.frame);
        }
        this.frame = null;
    }
}