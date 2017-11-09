# **Earthquakes in the History**
Author: Bing Zhao Nov 11, 2017
[**_Link for demo_**](https://loveice622.github.io/usEarthquakeViewer/)

## 1. Introduction
An earthquake is the shaking of the surface of the Earth, resulting from the sudden release of energy in the Earth's lithosphere that creates seismic waves. Earthquakes can range in size from those that are so weak that they cannot be felt to those violent enough to toss people around and destroy whole cities.
This project is a visualization of earthquake incidents on the earth from last century. The motivation of this project is to help people to understand more about the geographic distribution of the earthquakes on the earth. Meanwhile, it can also be used as a scientific research or teaching materials of studying the seismic activities in particular area.  
The following tasks and questions will drive the visualization and interaction decisions for this project:

- Where are the locations of earthquakes and is there any distribution pattern on the map?  Shows the places with the most frequently or biggest earthquake incidents on the map.

- Shows the trend of the earthquake by time from the year 1975. Which are the years with the most frequently earthquakes or biggest earthquakes happened? 

## 2. Dataset
The data I propose to visualize for my project is earthquake incidents on the earth from year 1975 to year 2017, since the earthquake data of many counties is not complete or missing before the year 1975. The data is searched from USGS Earthquake Hazards Program, which is part of the National Earthquake Hazards Reduction Program (NEHRP), established by U.S. Congress in 1977. Below is the dataset summary:
Data table summary: 
19870 rows
22 columns
3052 kB
![2](https://user-images.githubusercontent.com/25095189/32582820-b1346dd6-c4be-11e7-88df-a3822ea1c15f.png)

## 3. Sketches
A sketch is made in early with the data only in the range of American. 
![3](https://user-images.githubusercontent.com/25095189/32582967-553f28d0-c4bf-11e7-99f9-f6ecc79706dc.jpg)
- The locations of earthquake incidences are plot on the map by given latitude and longitude pairs in the dataset.   
- The scatters on the map should contain the information of earthquake rms and magnitude by changing the size and color of the scatters. 
- A XY line chart is in the bottom of the map which shows the year in X and count in Y. The user is allowed to drag the window along the X on the line chart and the corresponding data of the year in the range of the window will be reflected on the map.
- A combo box with the choice of hidden the earthquake data by selecting the minimum visible magnitude will be located on the upper right corner of the map. 
- There is play button that will automatically update map along the time after pressed.

## 4. Prototype
![1](https://user-images.githubusercontent.com/25095189/32581084-6a63376e-c4b6-11e7-82fd-5f5c1a083178.png)
### Scatters Plot on the Map
- Map: A world map is used 
- Mark: the scatters are denotes the incidents of the earthquake. 
- Location: the scatters are merged on the map based on the pairs of latitude and longitude of each earthquake incidents.
- Scatter Color: represent the magnitude level of the earthquake. 
- Scatter Size: represent the rms value of the earthquake.
- Zoom: user can zoom-in or zoom-out the map by using the scroll of the mouse
- Details-on-demand: show the earthquake details when mouse hovers on the certain scatter point.
![4](https://user-images.githubusercontent.com/25095189/32583723-31807440-c4c3-11e7-8ee4-8533881d8a04.png)

### Bar Chart 
- X axis: Year from 1975 to 2017
- Y axis: the numbers of the earthquakes 
- Bar Color: represent the magnitude level of the earthquake.
- Brush: User can use brush to select the data in specific range of the years to display
![6](https://user-images.githubusercontent.com/25095189/32584881-a56e616e-c4c8-11e7-8f78-3a0e69bb5c94.png)
- Tips: shows remark of the bar when mouse hovers on the certain bar
![5](https://user-images.githubusercontent.com/25095189/32583864-981899ee-c4c3-11e7-93f9-04e7cf02b67a.png)

### Menu
- Animation Control:  Replay Animation or Stop Animation
- Filter: Apply a magnitude filter to select the data in a specific magnitude range

### Animation
The scatter will be drawn on the map in the time sequence according to the time of earthquake incidents. User can replay or stop the animation via the button in the menu.
 
## 4. Reference
Data Source: [The USGS Earthquake Hazards Program](https://earthquake.usgs.gov/earthquakes/search/).

Inspired by: [Curran Kelleher’s Block-Cities on the Globe](https://bl.ocks.org/curran/115407b42ef85b0758595d05c825b346)

[Anthony Skelton-Earthquake Animation](https://anthonyskelton.com/2016/d3-js-earthquake-visualizations/)

[Mike Bostock’s Block-Brush Snapping](https://bl.ocks.org/mbostock/6232537)

## 5. Development

This project uses NPM and Webpack. To get started, clone the repository and install dependencies like this:

```
cd dataviz-project-template
npm install
```

You'll need to build the JavaScript bundle using WebPack, using this command:

```
npm run build
```

To see the page run, you'll need to serve the site using a local HTTP server.

```
npm install -g http-server
http-server
```

Now the site should be available at localhost:8080.

For automatic refreshing during development, you can start the Webpack Dev Server like this:

```
npm run serve
```
