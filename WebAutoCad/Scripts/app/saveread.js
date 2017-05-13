$("#btn-save").click(function(event){
	//przygotowanie danych do zapisu
    var linesData = [];
	for (var i = 0; i<lineManager.lines.length; i++)
	{
		var line = lineManager.lines[i];
		var groupId = null;
		if(line.group != null)
		{	
			groupId = line.group.id;
		}
			

		var dana = {
			x1: line.x1,
			x2: line.x2,
			y1: line.y1,
			y2: line.y2,
			state: line.state,
			groupId: groupId,
		};
		linesData.push(dana);
	}

	var groups = groupManager.getAllGroups();
	var groupsData = [];
	for (var i = 0; i< groups.length; i++)
	{
		var group = groups[i];
		
		var dana = {
			id: group.id,
			state: group.state
		};
		groupsData.push(dana);
	}

	$.ajax({
		type: "POST",
		url: "api/WebAutoCAD.php",
		dataType: 'json',
		data: {
			"id": projects.currentProjectId,
			"name": projects.currentProjectName,
			"dane": {
				"lines": linesData,
				"groups": groupsData,
			}
		},
		success: function(data)
		{
			if(data.success)
			{
				alert("Sukces");
				projects.currentProjectId = data.project.id;
			}
			
		},
		error: function(x, y, z)
		{
			alert(x.responseText);
		},
	})
	
})