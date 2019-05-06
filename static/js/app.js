function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(sampleData) {
    console.log(sampleData)
    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_metadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sampleData).forEach(([key, value]) => {
      sample_metadata.append("h5").text(`${key}: ${value}`);
  })
}
)}


    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(`/samples/${sample}`).then(function(sampleData) {
      console.log(sampleData)
      const otu_id= sampleData.otu_ids
      const otu_labels= sampleData.otu_labels
      const sample_values= sampleData.sample_values

      const trace={
          mode:"markers",
          x:otu_id,
          y:sample_values,
          text:otu_labels,
          marker:{
            color:otu_id,
            colorscale:'Earth',
            size:sample_values
          }
        }

      const bdata=[trace]
      const blayout={
          width:1500,
          height:500,
          margin:{
            t:50,
            l :200},
          hovermode:'closest',
          xaxis:{title:"Otu Id"}
      }
      Plotly.plot("bubble",bdata,blayout)
  

    const pdata=[{
      values: sample_values.slice(0,10),
      labels:otu_id.slice(0,10),
      hovertext:otu_id.slice(0,10),
      hoverinfo:'hovertext',
      type:'pie'
  }]
    const playout={
      margin:{t:10,l:20}
    }
    Plotly.plot("pie",pdata,playout)

  })  
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text("BB_"+ sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
