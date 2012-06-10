var kinect_d3 = function(){
    //"use strict";

    var that = this;

    that.canvas;
    that.canw = 1000;
    that.canh = 800;

    that.gesture_activate_time = 1000;
    that.coord_buffer_length = 70;

    that.points = new Array();
    that.last_action_time;
    that.gesture_mode = false;

    that.x_range = d3.scale.linear()
                          .domain([1000, -1000])
                          .range([0, that.canh]);
    
    that.y_range = d3.scale.linear()
                          .domain([1000, -1000])
                          .range([0, that.canw]);
    
    that.z_range = d3.scale.linear()
                          .domain([0, 7000])
                          .range([2, that.canw / 2]);

    that.color_range = d3.scale.linear()
                          .domain([0, 7000])
                          .range(["red", "black"]);
    
    that.init = function(){
        that.canvas = d3.select("#viz")
             .append("svg:svg")
             // set width and height attributes
             .attr("width", that.canw)
             .attr("height", that.canh);
        that.draw();
        that.wave_count = 0;

        that.check_inactivity();
    };

    that.draw = function(){
        var points = that.canvas
            .selectAll(".circ")
            .data(that.points);
        
        points.enter()
            .append("svg:circle")
            .attr("class", "circ")
            .attr("stroke", "black");

        points
            .attr("fill", function(){ return (that.gesture_mode ? "red" : "#deebfa") })
            .attr("r", function(d) { return d[2] })
            .attr("cx", function(d) { return d[0] })
            .attr("cy", function(d) { return d[1] });
    };

    that.add_point = function(coords){
        that.points.push([x_range(coords[0]), 
                          y_range(coords[1]), 
                          z_range(coords[2])
                         ]);

        if (that.points.length > that.coord_buffer_length){
            that.points.shift();
        }
        that.last_action_time = Date.now();

        draw();
    }

    that.check_inactivity = function(){
        //console.log(Date.now(), that.last_action_time, that.gesture_activate)
        if (Date.now() - that.last_action_time > that.gesture_activate_time){
            that.last_action_time = Date.now();
            that.gesture_mode = that.gesture_mode ? false : true;
            draw();
        }
        setTimeout(function(){ check_inactivity() }, 100)
    }

    that.make_circle = function(x, y, z){
        that.canvas
            .append("svg:circle")
            .attr("class", "circ")
            .attr("r", 10)
            .attr("cx", 200)
            .attr("cy", 200);
    }

    //_.throttle(that.grow_circle)
    eve.on("kinect.wave", make_circle)
    eve.on("kinect.raisehand", that.add_point)
    eve.on("kinect.click", make_circle)

    return that;
}
