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

var mapDiv = document.getElementById("area1");   
var chartDiv = document.getElementById("area2");

var tooltipdiv = d3.select("body")
	.append("div")
	.attr("class", "tooltip");  

var formatTime = d3.timeFormat("%Y");   
var parseYear  = d3.timeParse("%Y") 
var parseTime  = d3.timeParse("%Y-%m-%d")  
  
var svgMap = d3.select("#area1").append("svg")
.attr("width",  mapDiv.clientWidth)
.attr("height",  mapDiv.clientHeight)
.style('background-color', '#222')
//.attr("transform", "translate(" + -150 + "," + 50 + ")");

     
const path = svgMap.append('path').attr('stroke', 'gray');
const citiesG = svgMap.append('g');
const projection = d3.geoOrthographic();
const initialScale = projection.scale();
const geoPath = d3.geoPath().projection(projection);
let moving = false;
const rValue = d => (d.mag-5)*100;

const rScale = d3.scaleSqrt().range([0, 5]);

var commaFormat = d3.format(',');


var tip = d3.tip()
.attr('class', 'd3-tip')
.offset([-10, 0])
.html(d => `${d.place}:${d.mag}`);
svgMap.call(tip);

    d3.queue()
      .defer(d3.json, 'https://unpkg.com/world-atlas@1/world/110m.json')
      .defer(d3.json, 'https://unpkg.com/world-atlas@1/world/50m.json')
      .defer(d3.csv, 'data/earthquake.csv')
      .await((error, world110m, world50m, eqdata) => {
        const countries110m = topojson
          .feature(world110m, world110m.objects.countries);
        const countries50m = topojson
          .feature(world50m, world50m.objects.countries);
      
      
      
      
        rScale.domain([0, d3.max(eqdata, rValue)]);
      
        allData=[]
      
        eqdata.forEach(d => {
             
          d.radius = rScale(rValue(d));
          allData.push(d)
           //console.log(d.radius)
        });
      
             
      var filterData=allData
      
      function updateData(data)
      {

        console.log('update...')


        path.attr('d', geoPath(moving ? countries110m : countries50m));
        const k = Math.sqrt(projection.scale() / 200);

          const point = {
            type: 'Point',
            coordinates: [0, 0]
          };
        
       
          
          data.forEach(d => {
                    
            point.coordinates[0] = d.longitude;
            point.coordinates[1] = d.latitude;
            d.projected = geoPath(point) ? projection(point.coordinates) : null;
                      
          });
          
         
          const circles = citiesG.selectAll('circle')
            .data(data.filter(d => d.projected));
          circles.enter().append('circle')
            .merge(circles)
              .attr('cx', d => d.projected[0])
              .attr('cy', d => d.projected[1])
              .attr('fill', 'Coral')
              .attr('fill-opacity', 0.2)
              .attr('r', d => d.radius*k)
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide);
         
          circles.exit().remove();
        

      }
         
        updateData(filterData);

        let rotate0, coords0;
        const coords = () => projection.rotate(rotate0)
          .invert([d3.event.x, d3.event.y]);

        svgMap
          .call(d3.drag()
            .on('start', () => {
              rotate0 = projection.rotate();
              coords0 = coords();
              moving = true;
            })
            .on('drag', () => {
              const coords1 = coords();
              projection.rotate([
                rotate0[0] + coords1[0] - coords0[0],
                rotate0[1] + coords1[1] - coords0[1],
              ])
               updateData(filterData);
            })
            .on('end', () => {
              moving = false;
              updateData(filterData);
            })
            // Goal: let zoom handle pinch gestures (not working correctly).
            .filter(() => !(d3.event.touches && d3.event.touches.length === 2))
          )
          .call(d3.zoom()
            .on('zoom', () => {
              projection.scale(initialScale * d3.event.transform.k);
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
        
 
        
 // XY chart and brush--------------------------------------------------------------------
        
        
        var margin = {top: 25, right: 25, bottom: 25, left: 25},
          w = chartDiv.clientWidth- margin.left - margin.right,
          h = chartDiv.clientHeight- margin.top - margin.bottom;
      
      
      
        var grouped=getGroupedData(allData)
  
        //grouped.forEach(function(d){console.log(d.year,d.value7) })

        var yMax = d3.max(grouped, function(d){return d.value;});

         // X range to operate on
        var extent = d3.extent(grouped, function(d){ 
            return parseYear(d.year); 
        });

        //console.log(extent)

          // scale function
         var x = d3.scaleTime()
            .domain(extent)
            .range([0, w-100])
            .clamp(true);


         var y = d3.scaleLinear()
          .domain([0, yMax])
          .range([h, 0]);

          var xAxis = d3.axisBottom()
          .scale(x)
          .ticks(d3.timeYear, 5)
          .tickSize(5)
          .tickFormat(function() { return null; })


          var chartBrush = d3.brushX()
          .extent([[0, 0], [w, h]])
          .on("end", brushended);

 //draw     
        var svgChart = d3.select("#area2").append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top +")");
      
      
       svgChart.append("g")
      .attr("class", "brush")
      .call(chartBrush)
      .selectAll("rect")
      .attr("height", h)
      .attr("transform", "translate( 0,-1)");
  
  
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
    var textTooltip = "<strong>"+formatTime(d.year)+'</strong><br /> mag>5.5: '+d.value+'<br /> mag>6.0: ' +d.value7;
    tooltipdiv.html(textTooltip)
      .style("top", d3.event.pageY - 20 + "px")
      .style("left", d3.event.pageX + 20 + "px")
      .style("visibility", "visible");  
    //console.log(d3.event.pageY,d3.event.pageX)
  })
	.on("mouseout", function(){tooltipdiv.style("visibility", "hidden"); });
				
  


  bar.append("rect") //found
    .attr("width", 3)
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return y(0) - y(d.value); })
    .style("fill", "#E88D0C")

  bar.append("rect") //fell
    .attr("width", 3)
    .attr("y", function(d) {return y(d.value7); })
    .attr("height", function(d) { return y(0) -y(d.value7); })
    .style("fill", "red")
   
    
    
  
   svgChart.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + h + ")")
            .call(d3.axisBottom(x)
                .ticks(20)
                .tickPadding(0))
            .attr("text-anchor", null)
       
   function brushended() {
          if (!d3.event.sourceEvent) return; // Only transition after input.
          if (!d3.event.selection) return; // Ignore empty selections.
          var d0 = d3.event.selection.map(x.invert),
              d1 = d0.map(d3.timeYear.round);

          // If empty when rounded, use floor & ceil instead.
          if (d1[0] >= d1[1]) {
            d1[0] = d3.timeYear.floor(d0[0]);
            d1[1] = d3.timeYear.offset(d1[0]);
          }
     
                   
          filterData=filter(d1[0],d1[1],allData)
          updateData(filterData)
          d3.select(this).transition().call(d3.event.target.move, d1.map(x));
     
          
        }

      
 });


function filter(start, end, data)
{
  var filtered=[]
  
   for(i = 0; i < data.length; i ++){
     
     var mystring =data[i].time
     filterYear=parseTime(mystring.split('T')[0])
     
      if(parseInt(formatTime(filterYear))<=parseInt(formatTime(end)) &&
             parseInt(formatTime(filterYear))>=parseInt(formatTime(start)))
        {
          
          filtered.push(data[i])
        }
     
     
   }
  
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