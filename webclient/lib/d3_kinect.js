var kinect_d3 = function(){
    var that = this;

    that.canvas;
    that.canw = 500;
    that.canh = 500;
    that.jitter_buffer = 0.25;

    that.last_coords = [-1, -1, -1];

    that.depth_range = d3.scale.linear()
                          .domain([0, 7000])
                          .range([2, that.canw]);

    that.color_range = d3.scale.linear()
                          .domain([0, 7000])
                          .range(["red", "black"]);
    
    that.init = function(){
        that.canvas = d3.select("#viz")
             .append("svg:svg")
             // set width and height attributes
             .attr("width", 500)
             .attr("height", 500);
        that.draw();
    }

    that.draw = function(){
        that.canvas
          .append("svg:circle")
          .attr("class", "circ")
          .attr("r", 10)
          .attr("cx", 200)
          .attr("cy", 200)
    }

    that.grow_circle = function(coords){

        var depth = coords[2];

        var circ = d3.select(".circ")
                         .attr("r", that.depth_range(coords[2]))
                         .attr("fill", that.color_range(coords[2]))
    }
    _.throttle(that.grow_circle)
    //eve.on("kinect.wave", that.grow_circle)
    eve.on("kinect.raisehand", that.grow_circle)

    return that;
}
