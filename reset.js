
// reseter 

var submit = document.getElementById("submit");
submit.onclick = full_reset;
to_reset = document.getElementById('container');


function full_reset() {
	dataset = get_names();
	destroy_graph();
	create_graph();
}

