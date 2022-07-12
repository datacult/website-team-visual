// The svg
const svg = d3.select(".map-content-wrapper").append('svg').attr('class','map');

    if (window.outerWidth > 900){
        // var width = 1000, height = 325, d_width = width/2.75, d_height = height/1.4, scl = 2, view = 'desktop';
        var width = 900, height = 300, d_width = width/2.4, d_height = height/1.4, scl = 1.85, view = 'desktop';
        svg.attr('viewBox','0 0 '+width+' '+height);
    } else {
        var width = 300, height = 350, d_width = width/1.35, d_height = height/2.1, scl = 1, view = 'mobile';
        svg.attr('viewBox','0 0 '+width+' '+height);
    }

// Map and projection
const projection = d3.geoMercator()
    .scale(width / scl / Math.PI)
    .translate([d_width, d_height])

// Load external data and boot
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then( function(data) {


var countries = ['Canada','USA','Nigeria','Mexico','England','Germany','Brazil']
    // Draw the map
    svg.append("g")
        .selectAll(".country")
        .data(data.features)
        .join("path")
            .attr('class','country')
            .attr("fill", "#efefef")
            .attr("d", d3.geoPath()
            .projection(projection)
            )
            .style("stroke", "#fafafa")
            .style('stroke-width',1.25)
            .style('opacity',.8)
            .attr('id', function(d) {
                var txt;
				countries.includes(d.properties.name)  ? txt = 'hover': txt = 'still';
				return txt
				})

    let mouseOver = function(d) {
        d3.selectAll("#hover")
            .transition()
            .duration(200)
            .style("opacity", .5)
        d3.selectAll("#still")
            .transition()
            .duration(200)
            .style("opacity", .5)
        d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 1)
        }
    
    let mouseLeave = function(d) {
        d3.selectAll("#hover")
            .transition()
            .duration(200)
            .style("opacity", .8)
        d3.selectAll("#still")
            .transition()
            .duration(200)
            .style("opacity", .8)
        d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", .8)
        }

    svg.selectAll('#hover').attr("fill","#99B0F9")
    .on("mouseover", mouseOver )
    .on("mouseleave", mouseLeave );

    var defs = svg.append('defs');

var gradient = defs.append('linearGradient')
.attr('id', 'svgGradient')
.attr('x1', '0%')
.attr('x2', view == 'mobile' ? '0%': '100%')
.attr('y1', '0%')
.attr('y2', view == 'mobile' ? '100%': '0%');

gradient.append('stop')
.attr('offset', '0%')
.attr('stop-color', '#FAFAFA')
.attr('stop-opacity', 0);

gradient.append('stop')
.attr('offset', '30%')
.attr('stop-color', '#FAFAFA')
.attr('stop-opacity', .6);

gradient.append('stop')
.attr('offset', '100%')
.attr('stop-color', '#FAFAFA')
.attr('stop-opacity', 1);

var rect_size =  view == 'mobile' ? height/2: width/2.1;
svg.append('rect')
    .attr('height',view == 'mobile' ? rect_size: height)
    .attr('width',view == 'mobile' ? width : rect_size)
    .attr('x',view == 'mobile' ? 0: width-rect_size)
    .attr('y',view == 'mobile' ? height-rect_size : 0)
    .attr('fill','url(#svgGradient)');
    
var txt_x = view == 'mobile' ? 20:width-rect_size+50

var txt = svg.append('text')
        .attr('x', txt_x)
        .attr('y',view == 'mobile' ? height*.75:height/2-22)
        .attr('alignment-baseline','middle')
        .style('font-family','Inter')
        .style('font-size',view == 'mobile' ? 12 : 14)
        .style('font-weight',400)


txt.append('tspan')
.attr('x',txt_x)
.attr('dy','0')
.text('Our team is a well coordinated, all-remote')

txt.append('tspan')
.attr('x',txt_x)
.attr('dy','1.36em')
.text('operation with expertise in analytics')

txt.append('tspan')
.attr('x',txt_x)
.attr('dy','1.36em')
.text('engineering, data visualization, strategy,')

txt.append('tspan')
.attr('x',txt_x)
.attr('dy','1.36em')
.text('and organizational change.')

})