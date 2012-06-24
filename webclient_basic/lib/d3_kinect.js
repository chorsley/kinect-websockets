var kinect_d3 = function(){
    //"use strict";

    var that = this;

    that.canvas;
    that.canw = 500;
    that.canh = 500;
    that.jitter_buffer = 0.25;

    that.last_coords = [-1, -1, -1];
    that.threshes = [1000, 1000, 3000];
    that.colors = ["red", "blue", "orange", "pink", "black"];

    that.x_range = d3.scale.linear()
                          .domain([1000, -1000])
                          .range([0, that.canh]);
    
    that.y_range = d3.scale.linear()
                          .domain([1000, -1000])
                          .range([0, that.canw]);
    
    that.z_range = d3.scale.linear()
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
        that.wave_count = 0;
    };

    that.draw = function(){
        that.canvas
          .append("svg:circle")
          .attr("class", "circ")
          .attr("r", 10)
          .attr("cx", 200)
          .attr("cy", 200);
    };

    that.move_circle = function(coords){

        var x = coords[0],
            y = coords[1],
            z = coords[2];

        for (var i = 0; i < threshes.length; i++){
            //console.log(coords[i], threshes[i]);
            if (Math.abs(coords[i]) > threshes[i]){
                console.log("Outside range");
                console.log(coords);
                return;
            }
        }

        var circ = d3.selectAll(".circ")
                         .attr("r", that.z_range(z))
                         //.attr("fill", that.color_range(z))
                         .attr("cx", that.x_range(x))
                         .attr("cy", that.y_range(y))
    }

    that.next_color = function(){
        that.wave_count = that.wave_count + 1;
        d3.selectAll(".circ")
          .transition()
          .attr("fill", that.colors[that.wave_count % (that.colors.length - 1)]);
    }

    that.make_circle = function(){
        that.canvas
            .append("svg:circle")
            .attr("class", "circ")
            .attr("r", 10)
            .attr("cx", 200)
            .attr("cy", 200);
    }

    //_.throttle(that.grow_circle)
    eve.on("kinect.wave", that.next_color)
    eve.on("kinect.raisehand", that.move_circle)
    eve.on("kinect.click", that.make_circle)

    return that;
}
