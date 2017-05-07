var tableManager = {
    data: {

    },
    addRow: function(line)
    {
        //$row =  $("<tr data-lineid=\""+line.id+"\"><td>"+line.state.type + " "+ line.state.fi+"</td><td>"+line.state.leng+" [m]</td></tr>");
        //$row.click(function(){
        //    var id = this.dataset.lineid;
        //    lineManager.select(id);
        //});
        //$("table tbody")
        //    .append($row);
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
    updateRow: function(line)
    {
        this.data[line.id].state = line.state;
        if(line.group != null){
            this.data[line.id].groupId = line.group.id;
        }
        else
        {
            this.data[line.id].groupId = null;
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
    summary: function(){
        var sum = {};
        var groups = {};
        var ungroups = [];

        for(var prop in this.data)
        {
            var data = this.data[prop];
            if(data != undefined)
            {
                var key = data.state.type+"_" + data.state.fi;
                if(sum[key] == undefined)
                {
                    sum[key] = parseFloat(data.state.leng);
                }
                else
                    sum[key] += parseFloat(data.state.leng);
                
                if(data.groupId == undefined || data.groupId == null)
                {
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
                }
            }
        }
        
        $("table tbody").html("");

        for(var group in groups)
        {
            $row =  $("<tr><td>Grupa:</td><td></td></tr>");
            $("table tbody")
                .append($row);

            for(var item in groups[group].items)
            {
                var line = groups[group].items[item];

                $row =  $("<tr data-lineid=\""+line.lineId+"\"><td>"+line.state.type + " "+ line.state.fi+"</td><td>"+line.state.leng+" [m]</td></tr>");
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

            $row =  $("<tr data-lineid=\""+line.lineId+"\"><td>"+line.state.type + " "+ line.state.fi+"</td><td>"+line.state.leng+" [m]</td></tr>");
            $row.click(function(){
                var id = this.dataset.lineid;
                lineManager.select(id);
            });
            $("table tbody")
                .append($row);
        }


        $("#summary").html("");
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