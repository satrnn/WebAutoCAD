var tableManager = {
    data: {

    },
    addRow: function(line)
    {
        this.data[line.id] = {
            state: line.state,
            lineId: line.id,
        };

        if(line.group != null){
            this.data[line.id].groupId = line.group.id;
        }
        else
        {
            this.data[line.id].groupId = null;
        }

        this.updateRow(line);
    },
    _updateRow: function(line)
    {
        this.data[line.id].state = line.state;
        if(line.group != null){
            this.data[line.id].groupId = line.group.id;
            this.data[line.id].group = line.group.state;
        }
        else
        {
            this.data[line.id].groupId = null;
            this.data[line.id].group = null;
        }
    },
    updateRow: function(line)
    {
        this._updateRow(line);
        this.summary();
    },
    updateRows: function(lines)
    {
        for(var i in lines){
            this._updateRow(lines[i]);
        }
        this.summary();
    },
    deleteRow: function(line)
    {
        delete this.data[line.id];
        this.summary();
    },
    select: function(line)
    {
        $row = tableManager.find(line.id);
        $row.addClass("active");

        this.data[line.id].isActive = true;
    },
    unselect: function(line)
    {
        $row =  tableManager.find(line.id);
        $row.removeClass("active");

        this.data[line.id].isActive = false;
    },
    find: function(lineid){
        return $("table tbody tr[data-lineid='"+lineid+"']");
    },
    sum : {
        _sum: {},
        reset: function() {
            this._sum = {};
        },
        add: function(data) {
            var key = data.type+"_" + data.fi;
            if(this._sum[key] == undefined)
            {
                this._sum[key] = parseFloat(data.leng);
            }
            else
                this._sum[key] += parseFloat(data.leng);
        },
        addMultiple: function (data, multiple){
            var key = data.type+"_" + data.fi;
            if(this._sum[key] == undefined)
            {
                this._sum[key] = parseFloat(data.leng) * parseFloat(multiple);
            }
            else
                this._sum[key] += parseFloat(data.leng) * parseFloat(multiple);
        },
        getAll: function(){
            return this._sum;
        }
    },
    summary: function(){
        var groups = {};
        var ungroups = [];
        this.sum.reset();

        for(var prop in this.data)
        {
            var data = this.data[prop];
            if(data != undefined)
            {
                if(data.groupId == undefined || data.groupId == null)
                {
                    this.sum.add(data.state);
                    ungroups.push(data);
                }
                else
                {
                    if(groups[data.groupId] == undefined){
                        groups[data.groupId] = {
                            items: [],
                        }
                    }
                    groups[data.groupId].items.push(data);
                    groups[data.groupId].state = data.group;

                    this.sum.addMultiple(data.state, data.group.multiplier);
                }
            }
        }
        
        $("table tbody").html("");

        for(var group in groups)
        {
            var gr = groups[group];
            $row =  $("<tr><td>" + gr.state.name + " (x" + gr.state.multiplier + "):</td><td></td></tr>");
            $("#lines-table tbody")
                .append($row);

            for(var item in gr.items)
            {
                var line = gr.items[item];

                $row =  $("<tr class=\"subGroup hovered\" data-lineid=\""+line.lineId+"\"><td>"+line.state.type + " "+ line.state.fi+"</td><td>"+line.state.leng+" [m]</td></tr>");
                if(line.isActive)
                {
                    $row.addClass("active");
                }
                
                $row.click(function(){
                    var id = this.dataset.lineid;
                    lineManager.select(id);
                });
                $("table tbody")
                    .append($row);
            }

        }
        

        $row =  $("<tr><td>ccc:</td><td></td></tr>");
        $("table tbody")
            .append($row);

        for(var item in ungroups)
        {
            var line = ungroups[item];

            $row =  $("<tr class=\"hovered\" data-lineid=\""+line.lineId+"\"><td>"+line.state.type + " "+ line.state.fi+"</td><td>"+line.state.leng+" [m]</td></tr>");
            if(line.isActive)
            {
                $row.addClass("active");
            }
            
            $row.click(function(){
                var id = this.dataset.lineid;
                lineManager.select(id);
            });
            $("table tbody")
                .append($row);
        }


        $("#summary").html("");
        var sum = this.sum.getAll();
        for(var prop in sum)
        {
            if(sum[prop] == 0)
            {
                continue;
            }
            var temp = prop.split("_");
            $("#summary").append("<li>"+ temp[0]+ " " + temp[1] + " <strong>"+ sum[prop]+"[m]</strong> </li>");
        }
       
    }
}