var tableManager = {
    data: {},
    addRow: function(line)
    {
        $row =  $("<tr data-lineid=\""+line.id+"\"><td>"+line.state.type + " "+ line.state.fi+"</td><td>"+line.state.leng+" [m]</td></tr>");
        $row.click(function(){
            var id = this.dataset.lineid;
            lineManager.select(id);
        });
        $("table tbody")
            .append($row);

        this.data[line.id] = line.state;
        this.summary();
    },
    updateRow: function(line)
    {
        $row = tableManager.find(line.id);
        $row.find("td")[0].innerText = line.state.type + " "+ line.state.fi; //.text(line.label.textContent);
        $row.find("td")[1].innerText = line.state.leng+" [m]";
         this.data[line.id] = line.state;
         this.summary();
    },
    deleteRow: function(line)
    {
        $row = tableManager.find(line.id);
        $row.remove();

        delete  this.data[line.id];
         this.summary();
    },
    select: function(line)
    {
        $row = tableManager.find(line.id);
        $row.addClass("active");
    },
    unselect: function(line)
    {
        $row =  tableManager.find(line.id);
        $row.removeClass("active");
    },
    find: function(lineid){
        return $("table tbody tr[data-lineid='"+lineid+"']");
    },
    summary: function(){
        var sum = {};

        for(var prop in tableManager.data)
        {
            var data = tableManager.data[prop];
            if(data != undefined)
            {
                var key = data.type+"_" + data.fi;
                if(sum[key] == undefined)
                {
                    sum[key] = parseFloat(data.leng);
                }
                else
                    sum[key] += parseFloat(data.leng);
            }
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