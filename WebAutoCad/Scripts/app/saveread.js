$("#btn-save").click(function(event){
	//przygotowanie danych do zapisu
    var dane = [];
	for (var i = 0; i<lineManager.lines.length; i++)
	{
		var line = lineManager.lines[i];
		
		var dana = {
		 x1: line.x1,
		 x2: line.x2,
		 y1: line.y1,
		 y2: line.y2,
		 state: line.state,
		};
		dane.push(dana);
	}
	lineManager.lines;
	
	
	
	$.ajax({
		type: "POST",
		url: "api/WebAutoCAD.php",
		dataType: 'json',
		data: { "dane": dane },
		success: function(data)
		{
			alert("Sukces");
		},
		error: function(x, y, z)
		{
			alert(x.responseText);
		},
	})
	
})