function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var bacData= data.samples
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var bacResults= bacData.filter(bacID => bacID.id == sample);
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var desSample = data.metadata.filter(dID => dID.id == sample);
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var bResult = bacResults[0];
    console.log(bResult);
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var dResult = desSample[0];
    console.log(dResult);
    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = bResult.otu_ids;
    console.log(otu_ids);
    var otu_labels = bResult.otu_labels;
    // console.log(otu_labels);
    var sample_values= bResult.sample_values;
    console.log(sample_values);
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var washingFreq = parseFloat(dResult.wfreq);
    console.log(washingFreq);

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse()
    console.log(yticks);
    var xticks = sample_values.slice(0,10).reverse()
    // Deliverable 1: 8. Create the trace for the bar chart. 
     var barData = {
      x : xticks,
      y : yticks,
      type: "bar",
      orientation: "h"
      };

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = { title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Sample Size"},
      yaxis:{title: "Labels"}

    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar',[barData], barLayout);
    // Deliverable 2: 1. Create the trace for the bubble chart.
    var bubbleData= {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker:{ color: otu_ids,
                size: sample_values}
      
    };
    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {title:"Bacteria Culture Per Sample",
    hovermode: "closest",
    xaxis: {title:"OTU ID" }
  }
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",[bubbleData],bubbleLayout);
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var guageChart = {
    
      title: {text: "Belly Button Washing Frequency Per Week"},
      gauge: { 
        axis: {range: [0,10]},
        bar: {color: "black"},
        steps: [ { range:[0,5], color: "coral"},
                  {range:[2,4], color: "lightgreen"},
                  {range:[4,6], color: "yellow"},
                  {range:[6,8], color: "cyan"},
                  {range:[8,10], color: "pink"}],
                  threshold: {
                    line: { color: "red", width: 4 },
                    thickness: 0.75,
                    value: 9}
      },
      value: washingFreq,
      mode: "gauge+number",
      type: "indicator"
    
  };
    // Deliverable 3: 5. Create the layout for the gauge chart.

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",[guageChart]);
  });
}
init();