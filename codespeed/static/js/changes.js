function getConfiguration() {
    return {
        tre: $("#trend option:selected").val(),
        rev: $("#revision option:selected").val(),
        exe: $("input[name='executable']:checked").val(),
        env: $("input[name='environment']:checked").val()
    };
}

function permalinkToTimeline(benchmark, environment) {
    window.location=timeline_url + "?ben=" + benchmark + "&env=" + environment;
}

function colorTable() {
    //color two colums to the right starting with index = last-1
    // Each because there is one table per units type
    $(".tablesorter").each(function() {
        // Find column index of the current change column (one before last)
        var index = $(this).find("thead tr th").length -2;
        var lessisbetter = $(this).find("th:eq(1) label").text();
        $(this).find(":not(thead) > tr").each(function() {
            var change = $(this).children("td:eq("+index+")").text().slice(0, -1);
            var trend = $(this).children("td:eq("+(index+1)+")").text().slice(0, -1);
            // Check whether less is better
            if (lessisbetter === "False") {
                change = -change;
                trend = -trend;
            }
            //Color change column
            $(this).children("td:eq("+index+")").addClass(getColorcode(-change, changethres, -changethres));
            //Color trend column
            $(this).children("td:eq("+(index+1)+")").addClass(getColorcode(-trend, trendthres, -trendthres));
        });
    });
}

function updateTable() {
    colorTable();
    //Add permalink events to table rows
    $(".tablesorter > tbody > tr").each(function() {
        $(this).click(function () {
            var environment = $("input[name='environment']:checked").val();
            permalinkToTimeline($(this).children("td:eq(0)").text(), environment);
        });
    });
    //Add hover effect to rows
    $(".tablesorter > tbody > tr > td").hover(function() {
        $(this).parents('tr').addClass('highlight');
    }, function() {
        $(this).parents('tr').removeClass('highlight');
    });
    //Configure table as tablesorter
    $(".tablesorter").tablesorter({widgets: ['zebra']});
}

function refreshContent() {
    var h = $("#content").height();//get height for loading text
    $("#contentwrap").fadeOut("fast", function() {
        $(this).show();
        $(this).html(getLoadText("Loading...", h, true));
        $(this).load("table/", $.param(getConfiguration()), function(responseText) { updateTable(); });
    });
}

function changerevisions() {
    // This function repopulates the revision selectbox everytime a new
    // executable is selected that corresponds to a different project.
    var executable = $("input[name='executable']:checked").val();
    if (projectmatrix[executable] !== currentproject) {
        $("#revision").html(revisionboxes[projectmatrix[executable]]);
        currentproject = projectmatrix[executable];

        //Give visual cue that the select box has changed
        var bgc = $("#revision").parent().parent().css("backgroundColor");
        $("#revision").parent()
            .animate({ backgroundColor: "#9DADC6" }, 200, function() {
            // Animation complete.
            $(this).animate({ backgroundColor: bgc }, 1500);
        });
    }
    refreshContent();
}
