var socket = io.connect('http://' + document.domain + ':' + location.port);
var rawData = []
var timestamp = []
var firstPackage = true;
var MaxNumOfPoints = 500;
var chart;
var graphData = []
var numOfPoints = 17
var channelsNames;
var fs = 0;

$("#con-status").html("disconnected")
$("#con-status").addClass("text-danger")
$("#numOfPkg").html(numOfPoints)
$("#numOfPkgRange").val(numOfPoints)

$("#numOfPkgRange").on('input', function () {
    numOfPoints = $("#numOfPkgRange").val()
    $("#numOfPkg").html(numOfPoints)
})

$("#MaxOfPointsRange").val(MaxNumOfPoints)
$("#MaxOfPoints").html(MaxNumOfPoints)

$("#MaxOfPointsRange").on('input', function () {
    MaxNumOfPoints = $("#MaxOfPointsRange").val()
    $("#MaxOfPoints").html(MaxNumOfPoints)
})

<<<<<<< Updated upstream
function transpose(a) {
    if (a[0] && a[0].map) {
        return a[0].map(function (_, c) { return a.map(function (r) { if (r) return r[c]; }); });
    }
}

=======
>>>>>>> Stashed changes
const initGraph = (channels) => {
    var newValue = rawData.shift();
    var time = timestamp.shift();

<<<<<<< Updated upstream
    channels.forEach((channel, idx) => {
        $("#channels").append(`<div class="row"><div class="col-sm-1" style="padding: 30px;">${channel}</div><div class="col-sm-10" id=${channel}></div></div>`)
        graphData.push({
            x: [time],
            y: [newValue[idx]],
            type: 'line',
            name: channel,
            mode: channel,
            line: {
                color: COLORS[idx]
            }
        })
        var layout = {
            // title: 'EEG data',
            // autosize: false,
            height: 100,
            margin: {
                l: 50,
                r: 50,
                b: 0,
                t: 0,
                pad: 2
              },
            showlegend: false
        };

        Plotly.newPlot(channel, [graphData[idx]], layout, { displayModeBar: false, staticPlot: true, responsive: true })
    });
=======
    chart = new Chart(document.getElementById('chart').getContext('2d'), {
        type: "line",
        data: {
            datasets: [{
                data: [{
                    x: 0,
                    y: 20
                }, {
                    x: 1,
                    y: -10
                }, {
                    x: 2,
                    y: 10
                }]
            }]
        },
        options: {
            elements: {
                line: {
                    tension: 0 // disables bezier curves
                }
            },
            animation: {
                duration: 0,
            },
            tooltips: {
                enabled: false
            }
        }
    })
>>>>>>> Stashed changes
}

const addData = () => {
    // console.log("teste")
    var dateToAdd = []
    var time = []

    const size = rawData.length
    for (let i = 0; i < size; i++) {
        dateToAdd.push(rawData.shift());
        time.push(timestamp.shift());
        // cnt++;
    }

<<<<<<< Updated upstream
    dateToAdd = transpose(dateToAdd);
    channelsNames.forEach((channel, idx) => {
        var channelData = [dateToAdd[idx]]
        if (channelData) {
            Plotly.extendTraces(channel, { y: channelData, x: [time] }, [0])
=======

    dateToAdd = [dateToAdd];
    // console.log(dateToAdd)
    if (dateToAdd) {
        // dateToAdd.forEach((channel, idx) => {
        timeForEachPoint.push(time)
        // })
        Plotly.extendTraces('chart', { y: dateToAdd, x: timeForEachPoint }, indices)

        // console.log(graphData)
        while (graphData[0].y.length > MaxNumOfPoints) {
            // for (let i = 0; i < numOfPoints; i++) {
            graphData.forEach(channel => channel.y.shift())
            // }
>>>>>>> Stashed changes
        }
    })
    while (graphData[0].y.length > MaxNumOfPoints) {
        // for (let i = 0; i < numOfPoints; i++) {
        graphData.forEach(channel => channel.y.shift())
        // }
    }
}

socket.on('connect', () => {
    $("#con-status").html("connected")
    $("#con-status").removeClass("text-danger").addClass("text-success")
})

socket.on('disconnect', () => {
    $("#con-status").html("disconnected")
    $("#con-status").removeClass("text-success").addClass("text-danger")
})

socket.on('eeg', function (msg) {
    data = JSON.parse(msg)
    rawData = rawData.concat(data.eeg);
    timestamp = timestamp.concat(data.timestamp)
    fs = data.fs
    $("#fs").html(fs)

    // console.log(data.eeg.length)

    if (firstPackage) {
        channelsNames = data.channels;
        initGraph(data.channels)
        console.log(data.eeg.length)
        console.log(channelsNames)
        firstPackage = false
    }

    if (rawData.length >= numOfPoints) {
        // addData(chart, rawData)
        rawData = []
    }
})