## Introduction


This demo shows the D3 interaction with the time line slider. The x axis of the slider shows the date of data. User is able to drag the slider to change the date across the axis and the map will display the data in scatters before this date.  

Interaction element is refered from [Mike Bostock’s Blocks](https://bl.ocks.org/mbostock/6452972)


This data is from [The USGS Earthquake Hazards Program](https://earthquake.usgs.gov/earthquakes/search/).

This dataset is about U.S earthquake incidents from year 1900 which the magnitude of the earthquake are larger than 5.5

forked from <a href='http://bl.ocks.org/loveice622/'>loveice622</a>'s block: <a href='http://bl.ocks.org/loveice622/ef51da75b1c14f8373abb3162da3f0d9'>USA earthquake data from year 1900</a>



forked from <a href='https://bl.ocks.org/mbostock/'>Mike Bostock</a>'s block: <a href='https://bl.ocks.org/mbostock/3734308'>earth-USA earthquake data from year 1900</a>




A template project that uses Webpack and D3. Designed as a starting point for interactive data visualization projects that require JavaScript code to be organized across many files (as ES6 modules).

The starter code here is from [Stylized Scatter Plot with Color Legend](https://bl.ocks.org/curran/ecb09f2605c7fbbadf0eeb75da5f0a6b).

## Development

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
