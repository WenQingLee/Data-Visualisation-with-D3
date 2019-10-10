queue()
    .defer(d3.csv, "data/Salaries.csv")
    .await(createGraph)

function createGraph(error, salaryData) {

    var ndx = crossfilter(salaryData)

    // To convert the salaries to integers otherwise it will not work in averageSalary function
    salaryData.forEach(function(d) {
        d.salary = parseInt(d.salary)
        d.yrs_service = parseInt(d["yrs.service"]);
    })
    
    // yearsData.forEach(function(d){
    //     d.yrs.service = parseInt(d.yrs.service)
    // })
    

    // To show gender distribution graph
    showGenderDistribution(ndx)

    // To show discipline type selection
    disciplineType(ndx)

    // To show the average salary
    averageSalary(ndx)
    
    // To show the rank type distribution
    rankType(ndx)
    
    // To show percentage for professors for each gender
    percentageThatAreProfessors(ndx, "Male", "#percent-of-male-professors")
    percentageThatAreProfessors(ndx, "Female", "#percent-of-female-professors")
    
    // To show percentage of assistant professors for each gender
    percentageThatAreAsstProfessors(ndx, "Male", "#percent-of-male-asst-professors")
    percentageThatAreAsstProfessors(ndx, "Female", "#percent-of-female-asst-professors")
    
    // To show percentage of associate professors for each gender
    percentageThatAreAssocProfessors(ndx, "Male", "#percent-of-male-assoc-professors")
    percentageThatAreAssocProfessors(ndx, "Female", "#percent-of-female-assoc-professors")

    // To show the correlation between years and salary
    yearsAndSalary(ndx)

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
        .yAxisLabel("Number")
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

    // Updated add function where p is the accumulator and v is the value added
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
        .yAxisLabel("Salary (in dollars)")
        .yAxis().ticks(4);

}


// To show the graph breakdown by rank
function rankType(ndx) {

    var dim = ndx.dimension(dc.pluck("sex"));

    // Higher order functions to sort the different ranks
    var profByGender = rankByGender(dim, "Prof");
    var asstProfByGender = rankByGender(dim, "AsstProf");
    var assocProfByGender = rankByGender(dim, "AssocProf");

    // Supporting function for the higher order function using a custom reduce function

    function rankByGender(dimension, rank) {
        return dimension.group().reduce(
            // add function
            function(p, v) {
                p.total++;
                if (v.rank == rank) {
                    p.match++;
                }
                return p;
            },
            // reduce function
            function(p, v) {
                p.total--;
                if (v.rank == rank) {
                    p.match--;
                }
                return p;
            },
            // initialiser
            function() {
                return { total: 0, match: 0 };
            }
        );
    }
    
    // To show the rank distribution curve. note the stacked graphs and margins to the right for the legend
    // The value accessor determines the percentage
    dc.barChart("#rank-type")
        .width(400)
        .height(300)
        .dimension(dim)
        .group(profByGender, "Prof")
        .stack(asstProfByGender, "Asst Prof")
        .stack(assocProfByGender, "Assoc Prof")
        .valueAccessor(function(d) {
            if(d.value.total > 0) {
                return (d.value.match / d.value.total) * 100;
            } else {
                return 0;
            }
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .legend(dc.legend().x(320).y(20).itemHeight(15).gap(5))
        .margins({top: 10, right: 100, bottom: 30, left: 30});
        



}


// To determine the distribution of professors for each gender

function percentageThatAreProfessors(ndx, gender, element) {
    var percentageThatAreProf = ndx.groupAll().reduce(
        // Add
        function(p, v) {
            if (v.sex === gender) {
                p.count++;
                if(v.rank === "Prof") {
                    p.are_prof++;
                }
            }
            return p;
        },
        // Remove
        function(p, v) {
            if (v.sex === gender) {
                p.count--;
                if(v.rank === "Prof") {
                    p.are_prof--;
                }
            }
            return p;
        },
        // initialise
        function() {
            return {count: 0, are_prof: 0};    
        },
    );
    
    // To show the percentages based on the element input up to 2 decimal places
    dc.numberDisplay(element)
        .formatNumber(d3.format(".2%"))
        .valueAccessor(function (d) {
            if (d.count == 0) {
                return 0;
            } else {
                return (d.are_prof / d.count);
            }
        })
        .group(percentageThatAreProf)
}



// To determine the distribution of assistant professor for each gender

function percentageThatAreAsstProfessors(ndx, gender, element) {
    var percentageThatAreAsstProf = ndx.groupAll().reduce(
        // Add
        function(p, v) {
            if (v.sex === gender) {
                p.count++;
                if(v.rank === "AsstProf") {
                    p.are_asst_prof++;
                }
            }
            return p;
        },
        // Remove
        function(p, v) {
            if (v.sex === gender) {
                p.count--;
                if(v.rank === "AsstProf") {
                    p.are_asst_prof--;
                }
            }
            return p;
        },
        // initialise
        function() {
            return {count: 0, are_asst_prof: 0};    
        },
    );
    
    // To show the percentages based on the element input up to 2 decimal places
    dc.numberDisplay(element)
        .formatNumber(d3.format(".2%"))
        .valueAccessor(function (d) {
            if (d.count == 0) {
                return 0;
            } else {
                return (d.are_asst_prof / d.count);
            }
        })
        .group(percentageThatAreAsstProf)
}


// To determine the distribution of associate professor for each gender

function percentageThatAreAssocProfessors(ndx, gender, element) {
    var percentageThatAreAssocProf = ndx.groupAll().reduce(
        // Add
        function(p, v) {
            if (v.sex === gender) {
                p.count++;
                if(v.rank === "AssocProf") {
                    p.are_assoc_prof++;
                }
            }
            return p;
        },
        // Remove
        function(p, v) {
            if (v.sex === gender) {
                p.count--;
                if(v.rank === "AssocProf") {
                    p.are_assoc_prof--;
                }
            }
            return p;
        },
        // initialise
        function() {
            return {count: 0, are_assoc_prof: 0};    
        },
    );
    
    // To show the percentages based on the element input up to 2 decimal places
    dc.numberDisplay(element)
        .formatNumber(d3.format(".2%"))
        .valueAccessor(function (d) {
            if (d.count == 0) {
                return 0;
            } else {
                return (d.are_assoc_prof / d.count);
            }
        })
        .group(percentageThatAreAssocProf)
}


function yearsAndSalary(ndx) {
    
    // To define the gender color domain and ranges for male and female
    var genderColors = d3.scale.ordinal()
        .domain(["Female", "Male"])
        .range(["pink", "blue"]);
    
    // To get the data based on years of service and return a new group
    var eDim = ndx.dimension(dc.pluck("yrs_service"));
    var experienceDim = ndx.dimension(function(d) {
       return [d.yrs_service, d.salary, d.rank, d.sex];
    });
    var experienceSalaryGroup = experienceDim.group();
    
    // Selecting the min and max years of experice by finding the bottm and top items and the array location of 0, which is d.yrs_service
    var minExperience = eDim.bottom(1)[0].yrs_service;
    var maxExperience = eDim.top(1)[0].yrs_service;
    
    // To show the scatter plot diagram. change brushOn to false if the graph is not required to be interactive
    // The d.key is referencing to the data from experienceSalaryGroup which is derived from experienceDim
    dc.scatterPlot("#years-salary")
        .width(800)
        .height(400)
        .x(d3.scale.linear().domain([minExperience, maxExperience]))
        .brushOn(true)
        .symbolSize(8)
        .clipPadding(10)
        .xAxisLabel("Years Of Service")
        .title(function(d) {
            return d.key[2] + " earned " + d.key[1];
        })
        .colorAccessor(function (d) {
            return d.key[3];
        })
        .colors(genderColors)
        .dimension(experienceDim)
        .group(experienceSalaryGroup)
        .margins({top: 10, right: 50, bottom: 75, left: 75});
}