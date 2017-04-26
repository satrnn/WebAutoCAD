var tableManager = {
    addRow: function(line)
    {
        $("table tbody")
            .append("<tr data-lineid=\""+line.id+"\"><td>"+line.label.textContent+"</td></tr>");
    },
    updateRow: function(line)
    {

    },
    deleteRow: function(line)
    {

    },
    select: function(line)
    {

    },
    unselect: function(line)
    {
        
    }

}