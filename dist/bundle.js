/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var headDiv = document.getElementById("area0");
var mapDiv = document.getElementById("area1");   
var chartDiv = document.getElementById("area2");

var svg = d3.select("#area0").append("svg")
.attr("width", headDiv.clientWidth)
.attr("height", headDiv.clientHeight);

svg.append('text')
  .attr('x', 10)
  .attr('y', 40)
  .attr('class', 'title')
  .text('Earthquakes in the History');

svg.append('text')
  .attr('x', 400)
  .attr('y', 40)
  .attr('class', 'subtitle')
  .text('Data from USGS Earthquake Hazards Program');



//menu 
var legend=d3.select("#menu").append('svg')
    .attr("height", 60)

//legend
legend.append("rect")
      .attr("x", 5)
      .attr("y", 10)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill",'Coral')

legend.append("text")
      .attr("x", 35)
      .attr("y", 23)
			.style("fill",'DimGray')
      .text("mag<=6")

legend.append("rect")
      .attr("x", 5)
      .attr("y", 35)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill",'Crimson')

legend.append("text")
      .attr("x", 35)
      .attr("y", 48)
			.style("fill",'DimGray')
      .text("mag>6")

  
//control
d3.select("#menu").append('div')
		.attr("class","help")
		.text("Move your mouse over the circles and bars for more information, brush the bar area to select the range of years to display ");






//map
var tooltipdiv = d3.select("body")
	.append("div")
	.attr("class", "tooltip");  

var formatTime = d3.timeFormat("%Y");   
var parseYear  = d3.timeParse("%Y") 
var parseTime  = d3.timeParse("%Y-%m-%d")  
  
var svgMap = d3.select("#area1").append("svg")
.attr("width",  mapDiv.clientWidth)
.attr("height",  mapDiv.clientHeight)
.attr("id", "map");
//.attr("transform", "translate(" + -150 + "," + 50 + ")");

//const projection = d3.geoOrthographic();
  var projection = d3.geoEquirectangular()
    .scale(170)
    .translate([mapDiv.clientWidth / 2, mapDiv.clientHeight / 2])
    .precision(.1);

  var path = d3.geoPath()
    .projection(projection);



var start=-1;
var end=-1;
var mag=-1;

const initialScale = projection.scale()*1.2;
//const geoPath = d3.geoPath().projection(projection);
let moving = false;
const rValue = d => (d.rms)*1000;

const rScale = d3.scaleSqrt().range([2, 4]);

var commaFormat = d3.format(',');

    d3.queue()
      .defer(d3.json, 'data/world-countries.json')
      .defer(d3.csv, 'data/earthquake.csv')
      .await((error, world, eqdata) => {
   
      
       var firstEnter=1;
      
       svgMap.selectAll("path")
        .data(world.features)
        .enter().append("path")
        .attr("d", path)
    
      
        rScale.domain([0, d3.max(eqdata, rValue)]);
      
        allData=[]
      
        eqdata.forEach(d => {
          
   //       if(isNaN(d.rms))
    //         d.rms=1
             
          d.radius = rScale(rValue(d));
          
                   
          if(Number(d.mag)>6)
             d.color="Crimson"
          else
             d.color="Coral"
             
          d.delay=(Number(d.time.split('-')[0])-1975)*800
          
          allData.push(d)
           //console.log(d.radius)
        });
      
             
      var filterData=allData
      
      function updateData(data)
      {

        console.log('update...')

        svgMap.selectAll("path").attr("d", path);
        //path.attr('d', geoPath(moving ? countries110m : countries50m));
        const k = Math.sqrt(projection.scale() / 200);

          const point = {
            type: 'Point',
            coordinates: [0, 0]
          };
        
       
          
          data.forEach(d => {
                    
            point.coordinates[0] = d.longitude;
            point.coordinates[1] = d.latitude;
            d.projected = path(point) ? projection(point.coordinates) : null;
                      
          });
          
         
          const circles = svgMap.selectAll('.quake-circle')
            .data(data.filter(d => d.projected));
          circles.enter().append('circle')
            .merge(circles)
              .attr('class', 'circle quake-circle')
              .attr('cx', d => d.projected[0])
              .attr('cy', d => d.projected[1])
              .attr('fill', d=>d.color)
              .attr('fill-opacity', 0.4)
              .attr('r', 0)
              .on("mouseover", function(d){            
                var textTooltip = "<strong>"+d.time+'</strong><br />Place: '+d.place+'<br /> Latitude:' +d.latitude +'<br /> Longitude:' +d.longitude+'<br /> Magnitude:' +d.mag +'<br /> rms:' +d.rms +'<br /> Depth:' +d.depth;
            
            tooltipdiv.html(textTooltip)
              .style("top", d3.event.pageY - 20 + "px")
              .style("left", d3.event.pageX + 20 + "px")
              .style("visibility", "visible");  
            //console.log(d3.event.pageY,d3.event.pageX)
          })
            .on("mouseout", function(){tooltipdiv.style("visibility", "hidden"); });
        
         
        circles.exit().remove();
        
        if(firstEnter==1)
        {
          
          const pulses =svgMap.selectAll('.pulse-circle')
          .data(data.filter(d => d.projected));
          pulses.enter().append('circle')
            .merge(circles)
            .attr('class', 'circle pulse-circle')
            .attr('cx', d => d.projected[0])
            .attr('cy', d => d.projected[1])
            .attr('fill', "white")
            .attr('fill-opacity', 0.5)
            .attr('r', 0)

          pulses.exit().remove();


          svgMap.selectAll('.pulse-circle')
            .data(data.filter(d => d.projected))
            .transition()
            .delay(d=>d.delay)
            .duration(2000)
            .attr('r',  d => d.radius*k*5)
            .style('opacity', 0)
            .remove()


          svgMap.selectAll('.quake-circle')
            .data(data.filter(d => d.projected))
            .transition()
            .delay(d=>d.delay)
            .duration(1000)
            .attr('r',  d => d.radius*k)
            .style('opacity', 40)

          firstEnter =0
        }
        else
        {
          svgMap.selectAll('.quake-circle')
          .data(data.filter(d => d.projected))
          .attr('r',  d => d.radius*k)
          .style('opacity', 40)
        }
        
      }
        projection.scale(initialScale)
        updateData(filterData);
      
         

        let rotate0, coords0;
        const coords = () => projection.rotate(rotate0)
          .invert([d3.event.x, d3.event.y]);

        svgMap
          .call(d3.zoom()
            .on('zoom', () => {
              projection.scale(initialScale * d3.event.transform.k);
              
               svgMap.selectAll('circle').remove()
               updateData(filterData);
            })
            .on('start', () => {
              moving = true;
            })
            .on('end', () => {
              moving = false;
               updateData(filterData);
            })
          )
        
//manu control

       var typeMenu = d3.select("#menu").append('div')
        .attr("class","typeMenu");

       typeMenu.append("div") //menu
        .attr("class","help")
        .text("Animation");
             
        typeMenu.append("div")
          .text("REPLAY")
          .attr("id","menuItem")
          .on("click", function(){

          svgMap.selectAll('circle').remove()
          firstEnter=1;
          updateData(filterData)
        });
      
      
      var found_fellMenu = d3.select("#menu").append('div')
      .attr("class","typeMenu");
		
      found_fellMenu.append("div") //menu
        .attr("class","help")
        .text("Magnitude Filter:");
      
      
      var found_fellList = [{name:'Mag>6',id:'big'},{name:'Mag<=6',id:'small'},{name:'All',id:'all'}];
		
      found_fellMenu.selectAll('#menuItem')
        .data(found_fellList)
        .enter()
        .append("div")
        .attr("id","menuItem")
        .attr("class",function(d){ if (d.id ==='all')return 'active last'; })
        .html(function(d){return d.name;})
        .on('click', function(d){
        d3.selectAll('.typeMenu #menuItem').classed('active',false); 
        switch (d.id){
          case 'big':
            d3.select(this).classed('active',true);
            
            mag=1
            filterData=filter(start,end,mag,allData)
            updateData(filterData)

            break;
          case 'small':
            d3.select(this).classed('active',true);
            mag=0
            filterData=filter(start,end,mag,allData)
            updateData(filterData)
            break;
          case 'all':
            d3.select(this).classed('active',true); 
            mag=-1
            filterData=filter(start,end,mag,allData)
            updateData(filterData)
            break;
        }
      });	
      

 // XY chart and brush--------------------------------------------------------------------
        
        
        var margin = {top: 10, right: 25, bottom: 15, left: 25},
          w = chartDiv.clientWidth- margin.left - margin.right,
          h = chartDiv.clientHeight- margin.top - margin.bottom;
      
      
      
        var grouped=getGroupedData(allData)
  
        //grouped.forEach(function(d){console.log(d.year,d.value7) })

        var yMax = d3.max(grouped, function(d){return d.value;});

         // X range to operate on
        var extent = d3.extent(grouped, function(d){ 
            return parseYear(d.year); 
        });

        console.log(extent)
        
   
          // scale function
         var x = d3.scaleTime()
            .domain(extent)
            .range([0, w-100])
           


         var y = d3.scaleLinear()
          .domain([0, yMax])
          .range([h, 0]);

          var xAxis = d3.axisBottom()
          .scale(x)
          .ticks(d3.timeYear, 5)
          .tickSize(5)
          .tickFormat(function() { return null; })
          
           var yAxis = d3.axisLeft()
          .scale(y)
          
                 
          var chartBrush = d3.brushX()
          .extent([[0, 0], [w, h]])
          .on("end", brushended);

 //draw     
        var svgChart = d3.select("#area2").append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top +")");
      
      
       var gbrush=svgChart.append("g")
      .attr("class", "brush")
      .call(chartBrush)

  
  
  var bar = svgChart.selectAll("#bar")
  .data(grouped)
  .enter().append("g")
  .each(function(d){ 
    
    d.year = parseYear(d.year);    
    d.value = d.value;
    d.value7=d.value7;
    //console.log(d.year)
    
  })	
  
  .attr("id", "bar")
  .attr("transform", function(d) { return "translate(" + x(d.year) + ",0)"; })	
  .attr("class","year")
  .on("mouseover", function(d){
    var textTooltip = "<strong>"+formatTime(d.year)+'</strong><br /> All Magnitude: '+d.value+'<br /> Magnitude>6.0: ' +d.value7;
    tooltipdiv.html(textTooltip)
      .style("top", d3.event.pageY - 20 + "px")
      .style("left", d3.event.pageX + 20 + "px")
      .style("visibility", "visible");  
    //console.log(d3.event.pageY,d3.event.pageX)
  })
	.on("mouseout", function(){tooltipdiv.style("visibility", "hidden"); });
				
  


  bar.append("rect") //found
    .attr("class","rect")
    .attr("width", w/45)
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return y(0) - y(d.value); })
    .style("fill", "Coral")
    .style("stroke", "white")
		.style("stroke-width", 0.5)
  

  bar.append("rect") //fell
    .attr("class","rect")
    .attr("width", w/45)
    .attr("y", function(d) {return y(d.value7); })
    .attr("height", function(d) { return y(0) -y(d.value7); })
    .style("fill", "Crimson")
    .style("stroke", "white")
		.style("stroke-width", 0.5)
   

  var longestDelay =d3.max(allData, d=>d.delay)
  
  var timeline = svgChart.append('line')
            .attr("x1", 0)
            .attr("y1", 10)
            .attr("x2", 0)
            .attr("y2", h)
            .style('stroke', 'white')
            .style('stroke-width', 3)
            .transition()
               .ease(d3.easeLinear)
             .duration(longestDelay + 1000)
             .attr('x1', x(parseYear(2016)))
   					 .attr('x2', x(parseYear(2016)))
  					.remove()
  
	svgChart.append("text")
		.text("Number of Earthquakes") 
		.attr("x", "20px")
		.attr("y", "20px")
		.attr("class","label")
		.style("fill","#FFF")
  
   
   svgChart.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + h + ")")
            .call(d3.axisBottom(x)
                .ticks(20)
                .tickPadding(0))
            .attr("text-anchor", null)
   
   
    svgChart.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y)
                .ticks(5)       
                .tickPadding(0))
            
       
   function brushended() {
          if (!d3.event.sourceEvent) return; // Only transition after input.
          if (!d3.event.selection) return; // Ignore empty selections.
     svgMap.selectAll('circle').remove()
          var d0 = d3.event.selection.map(x.invert),
              d1 = d0.map(d3.timeYear.round);

          // If empty when rounded, use floor & ceil instead.
          if (d1[0] >= d1[1]) {
            d1[0] = d3.timeYear.floor(d0[0]);
            d1[1] = d3.timeYear.offset(d1[0]);
          }
            
          start= d1[0]
          end = d1[1]
          
          filterData=filter(d1[0],d1[1],mag, allData)
          updateData(filterData)
          d3.select(this).transition().call(d3.event.target.move, d1.map(x));
     			
     			
   }

      
 });


function filter(start, end, mag, data)
{
  var temp=[]
  var filtered=[]
  
  if(mag==-1)
    {
      temp=data
    }
  else
    {
      for(i = 0; i < data.length; i ++)
       {
         if(mag==0) //mag<6.0
           {
             if(Number(data[i].mag)<=6)
             {
               temp.push(data[i])
             }

           }
         else
           {
             if(Number(data[i].mag)>6)
             {
               temp.push(data[i])
             }
             
           }
       }
           
    }
  
  
  if(start==-1&&end==-1)
    {
      filtered=temp;
    }
  else
    {
      
      for(i = 0; i < temp.length; i ++)
      {

        var mystring =temp[i].time
        filterYear=parseTime(mystring.split('T')[0])

        if(parseInt(formatTime(filterYear))<=parseInt(formatTime(end)) &&
           parseInt(formatTime(filterYear))>=parseInt(formatTime(start)))
        {

          filtered.push(temp[i])
        }


      }
    }
  
  console.log("filter",formatTime(start),formatTime(end))
  console.log(filtered.length)
  
  return filtered
  
}


function getGroupedData(data)
{
   var grouped=[]
   
   var tempYear='NIL'
   
   var counts=0
   
   var counts7=0
   
    for(i = 0; i < data.length; i ++)
    {
    
        var strYear =data[i].time.split('-')[0]
        var mag     = parseFloat(data[i].mag)
        
        if(strYear==tempYear)
         {
             counts++
             if(mag>6.0)
               {
                 counts7++
               }
         }
        else
         {
            if(tempYear!='NIL')
             {
                var singleObj = {}
                singleObj['year'] =strYear;  //+'-01-01'; //data[i].time.split('T')[0];
                singleObj['value'] = counts; 
                singleObj['value7'] = counts7;
                grouped.push(singleObj)
             }
             
             tempYear = strYear
             counts=1
             counts7 =0
            
         }
                       
     }
   
   
   
   return grouped;
}





/***/ })
/******/ ]);