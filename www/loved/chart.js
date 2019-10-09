google.charts.load('current', {'packages': ['line']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var xh = new XMLHttpRequest();

    xh.onreadystatechange = () => {
        if (xh.readyState == 4 && xh.status == 200) {
            var data = JSON.parse(xh.responseText);
            var table = new google.visualization.DataTable();

            table.addColumn('date', 'Poll end date');
            table.addColumn('number', 'osu!');
            table.addColumn('number', 'osu!taiko');
            table.addColumn('number', 'osu!catch');
            table.addColumn('number', 'osu!mania');

            data = data.map(r => {
                r.poll_end = new Date(r.poll_end);
                r.poll_end.setHours(0, 0, 0);
                return r;
            }).sort((a, b) => {
                return a.poll_end.getTime() - b.poll_end.getTime();
            });

            var participationData = data;



            var newData = [];
            data.forEach(r => {
                var idx = newData.findIndex(other => other[0].getTime() === r.poll_end.getTime());
                var percentage = r.yes_count / (r.yes_count + r.no_count) * 100;

                if (idx === -1) {
                    idx = newData.length;
                    newData.push([r.poll_end, 0, 0, 0, 0, 0, 0, 0, 0]);
                }

                newData[idx][r.mode * 2 + 1] += percentage;
                newData[idx][r.mode * 2 + 2]++;
            });

            data = newData.map(r => {
                return [
                    r[0],
                    r[1] / r[2],
                    r[3] / r[4],
                    r[5] / r[6],
                    r[7] / r[8]
                ];
            });

            // Fix NaN values by averaging surrounding ones
            for (var idx = 0; idx < data.length; idx++) {
                for (var i = 1; i < 5; i++)
                    if (isNaN(data[idx][i])) {
                        if (idx === 0 || data[idx - 1][i] === NaN)
                            continue;

                        var jdx = idx + 1;
                        while (jdx < data.length && isNaN(data[jdx][i]))
                            jdx++;

                        if (jdx >= data.length)
                            continue;

                        for (var kdx = idx; kdx < jdx; kdx++)
                            data[kdx][i] = data[idx - 1][i] + (data[jdx][i] - data[idx - 1][i]) / (data[jdx][0].getTime() - data[idx - 1][0].getTime()) * (data[kdx][0].getTime() - data[idx - 1][0].getTime());
                    }
            }

            console.log(data);

            table.addRows(data);

            var options = {
                chart: {
                    title: 'Project Loved voting results',
                    subtitle: 'by percentage of Yes votes'
                },
                width: 1200,
                height: 700
            };
            var chart = new google.charts.Line(document.getElementById('chart'));

            chart.draw(table, google.charts.Line.convertOptions(options));
        }
    };

    xh.open("GET", "/loved/data.json", true);
    xh.send();
}
