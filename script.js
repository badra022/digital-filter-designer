var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;    

// make initial poles and zeros state
let points = d3.range(1, 10).map(function(i) {
    return [0, 50 + Math.random() * (height - 100)];
});

// generate x and y axis ranges
var x = d3.scaleLinear()
    .rangeRound([0, width]);
var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var xAxis = d3.axisBottom(x),
    yAxis = d3.axisLeft(y);


let drag = d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
        
svg.append('rect')
    .attr('class', 'zoom')
    .attr('cursor', 'move')
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

 var focus = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(d3.extent(points, function(d) { return d[0]; }));
y.domain(d3.extent(points, function(d) { return d[1]; }));


focus.selectAll('circle')
    .data(points)
    .enter()
    .append('circle')
    .attr('r', 5.0)
    .attr('cx', function(d) { return x(d[0]);  })
    .attr('cy', function(d) { return y(d[1]); })
    .style('cursor', 'pointer')
    .style('stroke', 'black')
    .style('fill', 'blue');

focus.selectAll('circle')
        .call(drag);

focus.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + height/2 + ')')
    .call(xAxis.ticks(0));
    
focus.append('g')
    .attr('class', 'axis axis--y')
    .attr('transform', 'translate(' + width/2 + ',0)')
    .call(yAxis.ticks(0));

focus.append('g')
    .append('circle')
    .style('stroke', 'red')
    .style('fill', 'none')
    .attr('r', 100.0)
    .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');


var Z = new Array(100);
var freqAxis = new Array(100);

for(let i = 0; i < 100; i++){
    Z[i] = math.complex(math.cos(math.PI * (i/100)), math.sin(math.PI * (i/100)));
    freqAxis[i] = math.PI * (i/100);
}

var magResponse = new Array;
var phaseResponse = new Array;

function drawResponses() {
    for(let i = 0; i < 100; i++){
        let magPoint = math.complex(0,0);
        let phasePoint = math.complex(0,0);
        for(let j = 0; j < zeros.length; j++){
            magPoint *= math.abs(math.subtract(Z[i], math.complex(zeros[j][0], zeros[j][1])))
            phasePoint *= math.atan(math.subtract(Z[i], math.complex(zeros[j][0], zeros[j][1])))
        }
        for(let j = 0; j < poles.length; j++){
            magPoint /= math.abs(math.subtract(Z[i], math.complex(poles[j][0], poles[j][1])))
            phasePoint /= math.atan(math.subtract(Z[i], math.complex(poles[j][0], poles[j][1])))
        }
        magResponse.push(magPoint);
        phaseResponse.push(phasePoint);
    }

    // normalize
    var maxMag = Math.max(...magResponse);
    var maxPhase = Math.max(...phaseResponse);
    for(let i = 0; i < magResponse; i++) {
        magResponse[i] /= maxMag;
        phaseResponse[i] /= maxPhase;
    }

    let magData = [];
    let phaseData = [];

    for(let i = 0; i < 100; i++){
        magData.push([freqAxis[i], magResponse[i]]);
        phaseData.push([freqAxis[i], phaseResponse[i]]);
    }

    // plot mag_response
	var container = document.getElementById('mag_response');
    graph = Flotr.draw(container, [ magData ], { yaxis: { max : 0, min : -120 } });
    
    // plot phase_response
    var container = document.getElementById('phase_response');
    graph = Flotr.draw(container, [ phaseData ], { yaxis: { max : 60, min : -60 } });
}