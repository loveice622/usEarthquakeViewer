var width = 960,
    height = 550;
  
margin = {right: 50, left: 50}

var projection = d3.geoAlbers()
    .rotate([96, 0])
    .center([-.6, 35.7])
    .parallels([37.5, 45.5])
    .scale(800)
    .translate([width / 2, height / 2])
    .precision(.1);

var path = d3.geoPath()
    .projection(projection);

var graticule = d3.geoGraticule()
    .extent([[-98 - 45, 38 - 45], [-98 + 45, 38 + 45]])
    .step([5, 5]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
  
svg.append('text')
        .attr('class', 'head')
        .attr('x', 230)
        .attr('y', 20)
        .text('USA earthquake data from year 1900');
  

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

d3.json("https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/us.json", function(error, us) {
  if (error) throw error;

  svg.insert("path", ".graticule")
      .datum(topojson.feature(us, us.objects.land))
      .attr("class", "land")
      .attr("d", path);



  svg.insert("path", ".graticule")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "state-boundary")
      .attr("d", path);
});
  
  
var parseTime  = d3.timeParse("%Y-%m-%d")   
var formatTime = d3.timeFormat("%Y");    
  
d3.csv("data/us-earthquake-from1900.csv", function(d){
    


    
   // range to operate on
var extent = d3.extent(d, function(d){ 
    return parseTime(d.time.split('T')[0]); 
});
   
  // console.log(extent)
   
  formatDate = d3.timeFormat("%Y");
    
   // scale function
   var x = d3.scaleTime()
      .domain(extent)
      .range([0, width-100])
      .clamp(true);


    // initial value
    var startValue = x(new Date('2012-03-20'));
    startingValue = new Date('2012-03-20');
    

   // var x = d3.scaleLinear()
     //   .domain([0, 180])
       // .range([0, width])
        //.clamp(true);

    var slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + (height-100) + ")");

    slider.append("text")
    .attr("x",0)
    .attr("y",-20)
    .text("Show earthquakes before selected year")
    
    
    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", function() { updateData(x.invert(d3.event.x),d); }));

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
      .selectAll("text")
      .data(x.ticks(10))
      .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatDate(d); });

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 10);

    function updateData(h,d) 
    {
      console.log(formatDate(h))
           
      handle.attr("cx", x(h));
      
      svg.selectAll('circle[class=scatter]').remove()
      
      for(i = 0; i < d.length; i ++){
    
           var mystring =d[i].time
           filterYear=parseTime(mystring.split('T')[0])
           //console.log(formatTime(d.time))
           
           //if(formatTime(filterYear)==formatTime(h))
           if(parseInt(formatTime(filterYear))<=parseInt(formatTime(h)))
           
            {

              svg.append("circle")
                .attr("cx", projection([d[i].longitude,d[i].latitude])[0])
                .attr("cy", projection([d[i].longitude,d[i].latitude])[1])
                .attr("r", (d[i].mag-5)*4)
                .style("fill", "red")
                .attr("class", "scatter")

              }
            }
           
    }

    
})
