
//var feeling_color = "#000000";
var feeling_color = "#000000";
title = document.getElementById("title");
title.style.color = feeling_color;

var first_name = document.getElementById("first_name");
var last_name = document.getElementById("last_name");

function parseFLNames(first_name, last_name) {

	f_name = first_name;
	f_name = f_name.slice(0, 1).toUpperCase() + f_name.slice(1, f_name.length).toLowerCase();
	l_name = last_name;
	l_name = l_name.slice(0, 1).toUpperCase() + l_name.slice(1, l_name.length).toLowerCase();

	final_name = f_name + l_name;
	information = {'nodes': [], 'links': []};
	var last_letter = null;
	for (var i = 0; i < final_name.length; i++) {
		var new_letter = final_name[i];
		if (last_letter != null) {
			new_connection = {'source': i - 1,
							  'target': i}
			information['links'].push(new_connection);
		}
		var new_node = {'name': new_letter, 'id': i};
		information['nodes'].push(new_node)
		var last_letter = new_letter;
	}
	return information;
}

function get_names() {
	information = parseFLNames(first_name.value, 
		                       last_name.value);
	return information;
}

var dataset = null;
var g_color = null;