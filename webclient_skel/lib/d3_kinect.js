var kinect_d3 = function(){
    //"use strict";

    var that = this;

    that.canvas;
    that.canw = 1000;
    that.canh = 1000;
    that.jitter_buffer = 0.25;

    that.last_coords = [-1, -1, -1];
    that.threshes = [1000, 1000, 3000];
    that.colors = ["red", "blue", "orange", "pink", "black"];
    that.limb_scaling = {
        SKEL_HEAD: 1.5,
        SKEL_LEFT_ELBOW: 0.5,
        SKEL_RIGHT_ELBOW: 0.5,
        SKEL_LEFT_KNEE: 0.5,
        SKEL_RIGHT_KNEE: 0.5,
        SKEL_LEFT_HAND: 0.75,
        SKEL_RIGHT_HAND: 0.75,
        SKEL_LEFT_FOOT: 0.75,
        SKEL_RIGHT_FOOT: 0.75,
    };

    that.x_range = d3.scale.linear()
                          .domain([1000, -1000])
                          .range([0, that.canh]);
    
    that.y_range = d3.scale.linear()
                          .domain([1000, -1000])
                          .range([0, that.canw]);
    
    that.z_range = d3.scale.linear()
                          .domain([0, 7000])
                          .range([that.canw / 7, 2]);

    that.color_range = d3.scale.linear()
                          .domain([0, 7000])
                          .range(["red", "black"]);
    
    that.mood_color_range = d3.scale.linear()
                              .domain([1000, -1000])
                              .range(["gold", "blue"])

    that.init = function(){
        that.canvas = d3.select("#viz")
             .append("svg:svg")
             // set width and height attributes
             .attr("width", that.canw)
             .attr("height", that.canh);
        that.draw();
        that.wave_count = 0;
    };

    that.draw = function(){
        /*that.canvas
          .append("svg:circle")
          .attr("class", "circ")
          .attr("r", 10)
          .attr("cx", 200)
          .attr("cy", 200);*/
    };

    that.move_circle = function(coords, joint){

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

        if (joint == "SKEL_RIGHT_HAND"){
            document.body.style.background = that.mood_color_range(y);
        }

        var scale_factor = that.limb_scaling[joint] ? that.limb_scaling[joint] : 1;

        var circ = that.canvas.selectAll("#" + joint)
                      .data([1]);
        circ              
            .enter()
            .append("svg:circle")
            .attr("id", joint);
        circ
            .attr("r", that.z_range(z) * scale_factor)
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

    //_.throttle(that.grow_circle)
    eve.on("kinect.wave", that.next_color)
    eve.on("kinect.joint_move", that.move_circle)

    return that;
}
