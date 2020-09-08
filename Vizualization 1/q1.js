var svg = d3.select("svg"),
      margin = {top: 40, right: 90, bottom: 140, left: 50},
      width = 800 - margin.left - margin.right,
      height = 660 - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleBand()
      .rangeRound([0, width])
      .padding(0.2)
      .align(0.9);

  var y = d3.scalePow()
      .exponent(0.4)
      .rangeRound([height, 0]);

  var z = d3.scaleOrdinal()
          .range([ "#1DDE4C", "#C70039"]);

  var stack = d3.stack();

  d3.csv("https://raw.githubusercontent.com/sabby2436/Dataset/master/q1data.csv", function(error, data) {
    if (error) throw error;

    var data_nest = d3.nest()
                      .key(function(d){
                          return d.Slider
                      })
                      .entries(data);

    data = data_nest.filter(function(d){ return d.key == 0})[0].values;
    
    var cat = ["first","second"];

    x.domain(data.map(function(d) { return d.x; }));
    y.domain([0, 5000]).nice();
    z.domain(cat); 

    g.selectAll(".serie")
      .data(stack.keys(cat)(data))
      .enter().append("g")
        .attr("class", "serie")
        .attr("fill", function(d) {return z(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.x); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth());

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .style("font", "10px sans-serif")
        .call(d3.axisBottom(x))
        .selectAll("text")
           .attr("transform","rotate(-90)")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .style("text-anchor", "end");
    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 60) + ")")
      .style("text-anchor", "middle")
      .text("Countries");

    g.append("g")
        .attr("class", "axis axis--y")
        .attr("transform","translate(" + width + ",0)")
        .call(d3.axisRight(y).ticks(10, "s"))
      .append("text")
        .text("Disbursement")
        .text("In Million $")
        .attr("x", 42)
        .attr("y", y(y.ticks(5).pop()))
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .attr("fill", "#000");
    
    svg.append("text")
      .attr("transform", "rotate(90)")
      .attr("y", 800 - margin.right)
      .attr("x",800 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Value");
    

    d3.select("input")
      .on("input", changed)
      .on("change", changed);

    function changed() {
      var value = this.value;

      g.selectAll(".serie")
        .data(stack.keys(cat)(data_nest.filter(function(d){return +d.key == value})[0].values))
        .selectAll("rect")
        .data(function(d) { return d; })
        .transition()
        .duration(500) 
        .delay(function(d,i){return i*100})     
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("x", function(d) { return x(d.data.x); })
        .attr("y", function(d) { return y(d[1]); })
  }
    
    
svg.append("circle").attr("cx",60).attr("cy",50).attr("r", 6).style("fill", "#1DDE4C")
svg.append("circle").attr("cx",60).attr("cy",70).attr("r", 6).style("fill", "#C70039")
svg.append("text").attr("x", 80).attr("y", 50).text("Donated").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 80).attr("y", 70).text("Received").style("font-size", "15px").attr("alignment-baseline","middle")
  

  });