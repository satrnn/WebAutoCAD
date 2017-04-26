var tableManager = {
    data: {},
    addRow: function(line)
    {
        $row =  $("<tr data-lineid=\""+line.id+"\"><td>"+line.label.textContent+"</td></tr>");
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
        $row.find("td").text(line.label.textContent);

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
                if(sum[data.type] == undefined)
                {
                    sum[data.type] = parseFloat(data.leng);
                }
                else
                    sum[data.type] += parseFloat(data.leng);
            }
        }
        $("#summary").html("");
        for(var prop in sum)
        {
             $("#summary").append("<li>"+ prop + " "+ sum[prop]+"[m] </li>");
        }
       
    }
}