var WIDTH = 800;
var HEIGHT = 675;
var MARGIN = { TOP: 40, BOTTOM: 40, LEFT: 50, RIGHT: 50 };

var width = WIDTH - MARGIN.RIGHT - MARGIN.LEFT;
var height = HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;

const FILEPATH = 'dataset.json';

const container = d3.select('#container')
  .append('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT)
  .append('g')
    .attr('transform',
        `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);


const circleScale = d3.scaleSqrt()
                      .domain([0, 20000])
                      .range([5, 30]);

var marked = [];

const ticked = () => {

    simulation.alphaTarget(0.3).restart();

    container.selectAll('.node')
        .attr('transform', node => `translate(${node.x}, ${node.y})`);

    container.selectAll('.node-link')
             .attr('x1', link => link.source.x)
             .attr('y1', link => link.source.y)
             .attr('x2', link => link.target.x)
             .attr('y2', link => link.target.y);

    let all_nodes = simulation.nodes()

    all_nodes.forEach((node) => {

      if (node.x < 0) {
        node.x = 0;
        node.vx = 0;
      }

      else if (node.x > WIDTH - 110) {
        node.x = WIDTH - 110;
        node.vx = 0;
      }

      if (node.y < 10) {
        node.y = 10;
        node.vy = 0;
      }

      if (node.y > HEIGHT - 150) {
        node.y = HEIGHT - 150;
        node.vy = 0;
      }

    })



};

const tooltip =  d3.select('.tooltip');

const tooltip_text = d3.select('.tooltip_text');

const simulation = d3.forceSimulation()
                     .force('center', d3.forceCenter(width/2, height/2))
                     .force('collision', d3.forceCollide().radius(d => 95))
                     .force('charge', d3.forceManyBody().strength(-100))
                     .force('link', d3.forceLink().id(node => node.id));

function new_distance(d){
	if (d.target.name.toLowerCase() == d.target.name) {
		return 150;
	}
	return 300;
};

function mouse_out(data) {
  d3.selectAll('.node-link')
    .style('stroke', '#4C4C4C')
    .style('stroke-width', 1)
    .style('opacity', '1');
}


const dragstarted = (node) => {
  if (!d3.event.active) {
    simulation.alphaTarget(0.3).restart();
  };
  node.vx = 0;
  node.vy = 0;
  node.fx = d3.event.x;
  node.fy = d3.event.y;

}

const dragged = (node) => {

  if (d3.event.x > 0 && d3.event.x < WIDTH - 100) {
      node.fx = d3.event.x;
      };

  if (d3.event.y > 0 && d3.event.y < HEIGHT - 50) {
      node.fy = d3.event.y;
      };

}

const dragended = (node) => {
  release_node(node)
}

async function release_node(node) {
  simulation.alphaTarget(0.3).restart();
  node.fx = null;
  node.fy = null;
  await new Promise(resolve => setTimeout(resolve, 300));
  simulation.alphaTarget(0.0);
}

function select_extra_size() {
  extra = [0, 4, 4, 8, 8, 16];
  selection = extra[Math.floor(Math.random() * extra.length)];
  return selection;
}

function get_colors(data) {

  function transform_ascii(number) {
  console.log(number);
  upper_limit = 10;
  lower_limit = 20;
  total_limit = upper_limit + lower_limit;
  number = (number - 64) * ((255 - total_limit) / 26) + lower_limit;
  return number;
  }

  nodes = data['nodes']
  uppers = [];
  for (var i = 0; i < nodes.length; i++) {
    node = nodes[i]
    if (node.name.toUpperCase() == node.name) {
      uppers.push(node);
    }
  }
  red = transform_ascii(uppers[0].name.charCodeAt(0));
  blue = transform_ascii(nodes[nodes.length - 1].name.toUpperCase().charCodeAt(0));
  green = transform_ascii(uppers[1].name.charCodeAt(0));
  return [red, green, blue];
}

function create_rgb(colors) {
  return d3.rgb(colors[0], colors[1], colors[2]);
}

function create_graph () {  

  if (dataset == null) {
  	dataset = parseFLNames('Mi', 'Sitio');
  };
  g_color = get_colors(dataset);
  console.log(g_color);

  d3.select('h1').attr('fill', g_color);

  simulation.nodes(dataset.nodes)
            .on('tick', ticked)
            .force('link')
            .links(dataset.links)
            .distance(new_distance);

  simulation.alphaTarget(0.3).restart();

  container.selectAll('.line')
           .data(dataset.links)
           .enter()
           .append('g')
           .append('line')
           .attr('class', 'node-link')
           .attr('x1', link => link.source.x)
           .attr('y1', link => link.source.y)
           .attr('x2', link => link.target.x)
           .attr('y2', link => link.target.y)
           .attr('marker-start', link => 'url(#marker-14)');

  const nodes = container.selectAll('.node')
                         .data(dataset.nodes)
                         .enter()
                         .append('g')
                         .attr('class', 'node')
                         
  const circles = nodes.append('circle')
                         .attr('r', d => {return 30 + select_extra_size()})
                         .attr('stroke', 'white')
                         .attr('fill', create_rgb(g_color))
                         .call(d3.drag()
                         .on("start", dragstarted)
                         .on("drag", dragged)
                         .on("end", dragended))
                         .on('mouseover', d => mouse_on(d))
                         .on('mouseout', d => mouse_out(d))
                         .on('click', d => release_node(d))
                         .on('dblclick', d => double_click_selection(d));


  const texts = nodes.append('text')
  					.text(node => node.name)
  					.attr('dy', 9)
  					.attr('dx', 0)
  					.attr('fill', 'white')
  					.style('font-size', '34px')
  					.style('font-family', 'Roboto Condensed')
  					.style('text-anchor', 'middle')
  					.on('mouseover', d => mouse_on(d))
                      .on('mouseout', d => mouse_out(d))
                      .on('click', d => release_node(d))
                      .on('dblclick', d => double_click_selection(d));

}

create_graph();

function destroy_graph () {
  d3.selectAll('.node').remove();
  d3.selectAll('line').remove();
}

function mouse_on(data) {

  // Connected to the node
  var adjacent = d3.selectAll('.node-link')
    .filter(function(d) {return data.id == d.target.id || data.id == d.source.id;})
    .style('stroke', '#58CB40')
    .style('stroke-width', 1);


  // The rest
  var rest = d3.selectAll('.node-link')
               .filter(function(d) { 
                return !(data.id == d.target.id || data.id == d.source.id)})
               .style('opacity', '0.2');
}