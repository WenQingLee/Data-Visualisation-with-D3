queue()
    .defer(d3.csv, "data/Salaries.csv")
    .await(createGraph)

function createGraph(error, salaryData) {

    var ndx = crossfilter(salaryData)

    // To convert the salaries to integers otherwise it will not work in averageSalary function
    salaryData.forEach(function(d){
        d.salary=parseInt(d.salary)
    })


    // To show gender distribution graph
    showGenderDistribution(ndx)

    // To show discipline type selection
    disciplineType(ndx)

    // To show the average salary
    averageSalary(ndx)

    dc.renderAll();

}


function showGenderDistribution(ndx) {

    // To display gender distribution graph
    var dim = ndx.dimension(dc.pluck('sex'))

    // var genderDistribution=ndx.dimension(dc.pluck('sex')).group

    var genderDistribution = dim.group()

    dc.barChart("#gender-distribution")
        .width(400)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(genderDistribution)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        // .elasticY(true)
        .xAxisLabel("Gender")
        .yAxis().ticks(20);

}


// To display the discipline selection
function disciplineType(ndx) {
    var dim = ndx.dimension(dc.pluck('discipline'));
    var group = dim.group();

    dc.selectMenu("#discipline-type")
        .dimension(dim)
        .group(group);
}


// To display the average salary

function averageSalary(ndx) {
    var dim = ndx.dimension(dc.pluck('sex'));

    // The reduce function in crossfilter requires to define 3 functions, add, remove and initialisation
    // To change the default reduce function in crossfilter, the add and remove functions must be updated

    // Updated add function where p is the incremental and v is the value
    function addSalary(p, v) {
        p.count++;
        p.total += v.salary;
        p.average = p.total / p.count;
        return p;
    }

    // Updated remove function that accounts for p.count less than or equal to 0
    function removeSalary(p, v) {
        p.count--;

        if (p.count <= 0) {
            p.total = 0;
            p.average = 0;
        }
        else {
            p.total -= v.salary;
            p.average = p.total / p.count;
        }
        return p;
    }

    // initialisting the object
    function initialise() {
        return { count: 0, total: 0, average: 0 }
    }


    var averageSalary = dim.group().reduce(addSalary, removeSalary, initialise);


    // To show the chart
    dc.barChart("#average-salary")
        .width(400)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(averageSalary)
        .valueAccessor(function(d) {
            return d.value.average.toFixed(2);
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Gender")
        .yAxis().ticks(4);

}
