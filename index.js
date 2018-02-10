widths = {'datetime': 13,'city': 10,'state': 3,'country': 6,'shape': 13,'durationMinutes': 15,'comments': 50}

var counter = 0 //to keep track of items that pass search
var headers = [] //list of data object properties
var searchIDs = [] //
var searchCriteria = [] // pairs of properties and corresponding search criteria
var resultsPerPage = 100
var pageNum = 1 // current page displayed


addHead(dataSet[1]) // populate column headers and headers variable from dataSet item
console.log(headers)
dataSet.forEach(addRow); // populate initial table
pageBar() // populate page bar at bottom


d3.select('#search').on('click',function () {
    pageNum = 1; // set page number back to first page
    startSearch() // apply filters to populate table
});

function addRow(dataObject, index) {
    counter += 1
    //populate based on pageNumber
    if (((pageNum - 1)*resultsPerPage > counter) || (counter > pageNum*resultsPerPage)) {
        return null
    };
    
    //console.log(dataObject);
    //select table body and create row to insert into body
    var $tbody = document.querySelector('tbody');
    var $tr = document.createElement('tr');

    //populate table by pulling from headers to ensure columns line up
    headers.forEach(key => {
        
        var $td = document.createElement('td');
        

        try {
            $td.innerHTML = dataObject[key];
            //console.log(key + ' - ' + dataObject[key]);
        } catch (error) {
            console.log(error)
        }
        
        $tr.appendChild($td);
    });
    //updateProgress(counter, dataLength)
    //updateProgress wont work without passing subSet.length info in some way
    
    $tbody.appendChild($tr);
};


function addHead(dataObject) {
    //populate table headers and search bar for each of dataObjects properties
    var $thead = document.querySelector('thead');
    var $tr = document.createElement('tr');
    var $searchBar = d3.select('#searchBar')
    var width = 100/(Object.keys(dataObject).length+1)


    for (var key in dataObject) {
        var $th = document.createElement('th');
        $th.style = 'width:'+ widths[key]+ '%;'
        $th.innerHTML = key;
        headers.push(key) //create ordered list of headers
        //console.log(key + ' - ' + dataObject[key]);
        $tr.appendChild($th);
        //build search box
        addInputBox($searchBar, key, width)
    };
    //<button type="submit" class="btn btn-default">Submit</button>
    console.log(headers)
    $submitButton = $searchBar.append('button').attr('id','search').attr('type','submit').classed("btn btn-default",true).attr('style','width:'+width+'%').html('Search')
    $thead.appendChild($tr);
};

//$dateSearch.addEventListener()

function addInputBox(container, criteria, width) {
    //insert search box at top of table
    $input = container.append('input')
    var ID = criteria + 'Search'
    searchIDs.push(ID)
    $input.attr('id', ID)
        .attr('placeholder', criteria)
        .attr('type', 'text')
        .classed('form-control', true)
        .attr('style','width:'+width+'%; display:inline')

}

/*function updateProgress(count, tot){
    $prog = d3.select('.progress-bar')
    $prog.attr('style', `width:${Math.ceil(count/tot)*100}%;`)
}*/

function startSearch() {
    counter = 0;

    searchCriteria = [];
    headers.forEach(getSearchCriteria);
    d3.select('tbody').selectAll('tr').remove();
    console.log(Date());
    dataSet.forEach(dataObject => {
        //console.log(dataObject)
        filterData(dataObject);
    });
    
    //console.log(Date());
    console.log(`${counter} results`)

    pageBar();
    
};

function pageBar() {
    d3.select('.pagination').selectAll('li').remove()
    if (resultsPerPage < counter) {
        d3.select('#pageNums')
            .append('ul')
                .classed('pagination', true)
                .attr('style', 'white-space:nowrap;')
        for (var ii = 1; ii < (counter/resultsPerPage)+1; ii++) {
            //console.log(ii)
            d3.select('.pagination')
                .append('li')
                    .attr('style','display: inline-block')
                    .attr('id', `page${ii}li`)
                    .append('a')
                    .attr('id', `page${ii}`)
                    .html(ii);

            d3.select(`#page${ii}`).on('click', function () {
                pageNum = +d3.select(this).html();
                console.log(pageNum)
                startSearch();
                d3.select(`#page${pageNum}li`).classed("active", true)
            });
        };
    };
}

function getSearchCriteria(header) {
    //console.log('containsSearch ('+ID+')');
    value = d3.select('#'+header+'Search').node().value.toLowerCase().trim();
    if (value) {
        console.log(header + ' ' + value);
        searchCriteria.push([header,value])
    };
    
};

function filterData(dataObject) {
    var flag = true
    for(var index in searchCriteria){
        //console.log(searchCriteria[index])
        try {
            if ((dataObject[searchCriteria[index][0]].toLowerCase().trim().indexOf(searchCriteria[index][1]) == -1) || (!dataObject)) {
                //console.log(dataObject[searchCriteria[index][0]].toLowerCase().trim().indexOf(searchCriteria[index][1]))
                flag = false
            }
        } catch (error) {
            if ((dataObject[searchCriteria[index][0]] == searchCriteria[index][1]) || (!dataObject)) {
                flag = false
            }

        }
        
    }
    //console.log(flag)
    if (flag) {addRow(dataObject)}
}

