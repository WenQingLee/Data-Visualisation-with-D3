queue()
    .defer(d3.csv, "data/Salaries.csv")
    .await(createGraph)
    
function createGraph(error, salaryData){
    
    var ndx = crossfilter(salaryData)
    
    var dim = ndx.dimension(dc.pluck('sex'))
    
    // var genderDistribution=ndx.dimension(dc.pluck('sex')).group
    
    var genderDistribution=dim.group()
    
    dc.barChart("#gender-distribution")
        .width(400)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(genderDistribution)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Gender")
        .yAxis().ticks(20);
    
    dc.renderAll();
    
}

