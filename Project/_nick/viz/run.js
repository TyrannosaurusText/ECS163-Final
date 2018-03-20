function StartUp ()
{
    document.getElementById('permit-select').addEventListener('change', MakeHeatmap);
    document.getElementById('permit-toggle').addEventListener('input', MakeHeatmap);
    MakeHeatmap();
}

function MakeHeatmap ()
{
    var permit = document.getElementById('permit-select').value;
    var toggle = document.getElementById('permit-toggle').checked;
    document.getElementById('heatmap-voronoi').innerHTML = '';
    heatmap.MakeHeatmap(permit, toggle);
}

StartUp();