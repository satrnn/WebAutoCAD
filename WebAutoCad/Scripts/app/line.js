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
    this.isInRect = function(x1, y1, x2, y2)
    {
        var isx;
        var isy;
        if(x1 > x2){
            isx = x1 > this.x1 && x1 > this.x2 &&  x2 < this.x1 && x2 < this.x2;
        }
        else
        {
            isx = x1 < this.x1 && x1 < this.x2 &&  x2 > this.x1 && x2 > this.x2;
        }

        if(y1 > y2){
            isy = y1 > this.y1 && y1 > this.y2 && y2 < this.y1 && y2 < this.y2;
        }
        else
        {
            isy =  y1 < this.y1 && y1 < this.y2 && y2 > this.y1 && y2 > this.y2;
        }

        return isx && isy; 

    },
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
