///// CONTROL ELEMENTS /////
version = 'ForecastDualKc_v0.3';
console.log('Running ' + version);

// Initialize Materialize controls
document.addEventListener('DOMContentLoaded', function() {
    M.FormSelect.init(document.querySelectorAll('select'));
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    M.Collapsible.init(document.querySelectorAll('.collapsible'));

    // Disable all sliders on page load to prevent simualtions with no data
    document.querySelectorAll('.custom-slider').forEach(item => {
        item.setAttribute('disabled', true)
    })
});


// Read climate data
let climateInputElement = document.getElementById("climateInput");
climateInputElement.addEventListener('change', function (){
    try{
        climate = []; // Reset array
        readClimate()
    } catch(err){
        document.getElementById("errorModalMsg").innerText = err.message;
    }
}, false);


// Read observations data
let observationsInputElement = document.getElementById("observationsInput");
observationsInputElement.addEventListener('change', function(){
    try{
        observations = []; // Reset array
        readObservations()
    } catch(err){
        document.getElementById("errorModalMsg").innerText = err.message;
    }
}, false);


// Load example dataset
let loadExampleDatasetBtn = document.getElementById('loadExampleDatasetBtn');
loadExampleDatasetBtn.addEventListener('click', loadExampleDataset)

function loadExampleDataset(){
    fetch('ForecastDualKc_v0.3/dataset/example_field_settings_inputs_ForecastDualKc.json')
    .then( results=>results.text() )
    .then( data=>runUploadProject(JSON.parse(data)))
}

// Input box project name
let projectNameElement = document.getElementById('projectName');

// Input dateset description
let projectDescriptionElement = document.getElementById('projectDescription');

// Input box latitude
let latitudeElement = document.getElementById('latitude');

// Input box altitude
let altitudeElement = document.getElementById('altitude');

// Input xaxis variable
let  xAxisVariableMenu = document.getElementById('xAxisVariableMenu');
xAxisVariableMenu.addEventListener('change', run);

// Visualize scenarios
let visualizeScenarios = document.getElementById('visualizeScenarios');
visualizeScenarios.addEventListener('change', run);

// Assimilate soil moisture observations
let assimilateSoilMoistureObservations = document.getElementById('assimilateSoilMoistureObservations');
assimilateSoilMoistureObservations.addEventListener('change', run);

// Assimilate canopy cover observations
let assimilateCanopyCoverObservations = document.getElementById('assimilateCanopyCoverObservations');
assimilateCanopyCoverObservations.addEventListener('change', run);

// Input constant root depth
let constantRootDepth = document.getElementById('constantRootDepth');
constantRootDepth.addEventListener('change', run);

// Input constant plant height
let constantPlantHeight = document.getElementById('constantPlantHeight');
constantPlantHeight.addEventListener('change', run);

// Slider planting and forecasting date
var managementDatesSlider = document.getElementById('managementDates');
let plantingDateSliderValue = document.getElementById('plantingDateSliderValue');
let forecastingDateSliderValue = document.getElementById('forecastingDateSliderValue');
noUiSlider.create(managementDatesSlider, { connect: true, range:{min:timestamp(2020,0,1), max:timestamp(2020,11,31)}, step: 86400000, start: [timestamp(2020,1,1), timestamp(2020,9,1)] });
managementDatesSlider.noUiSlider.on('update', function (values, handle) { 
    if(handle == 0){ 
        plantingDateSliderValue.innerHTML = 'Planting Date: ' + formatDateSlider(parseInt(values[handle]));
    } else {
        forecastingDateSliderValue.innerHTML = 'Forecasting Date: ' + formatDateSlider(parseInt(values[handle]));
    }
});



// Slider depth surface layer
let surfaceDepthSlider = document.getElementById('surfaceDepth');
let surfaceDepthSliderValue = document.getElementById('surfaceDepthSliderValue');
noUiSlider.create(surfaceDepthSlider, { start: 0.15, range: {'min': 0.01, 'max': 0.3}, step: 0.01, format: wNumb({decimals: 2}) });
surfaceDepthSlider.noUiSlider.on('update', function (values, handle) { surfaceDepthSliderValue.innerHTML = 'Depth Surface Layer (m): ' + values[handle]; });


// Slider readily evaporable water
let readilyEvaporableWaterSlider = document.getElementById('readilyEvaporableWater');
let readilyEvaporableWaterSliderValue = document.getElementById('readilyEvaporableWaterSliderValue');
noUiSlider.create(readilyEvaporableWaterSlider, { start: 0.3, range: {'min': 0, 'max': 1}, step: 0.05, format: wNumb({decimals: 2}) });
readilyEvaporableWaterSlider.noUiSlider.on('update', function (values, handle) { readilyEvaporableWaterSliderValue.innerHTML = 'Readily Evaporable Water: ' + values[handle]; });


// Slider theta initial surface
let thetaInitialSurfaceSlider = document.getElementById('thetaInitialSurface');
let thetaInitialSurfaceSliderValue = document.getElementById('thetaInitialSurfaceSliderValue');
noUiSlider.create(thetaInitialSurfaceSlider, { start: 0.29, range: {'min': 0, 'max': 0.5}, step: 0.01, format: wNumb({decimals: 2}) });
thetaInitialSurfaceSlider.noUiSlider.on('update', function (values, handle) { thetaInitialSurfaceSliderValue.innerHTML = 'Initial Surface Soil Moisture (m<sup>3</sup>/m<sup>3</sup>): ' + values[handle]; });


// Slider theta initial rootzone
let thetaInitialRootzoneSlider = document.getElementById('thetaInitialRootzone');
let thetaInitialRootzoneSliderValue = document.getElementById('thetaInitialRootzoneSliderValue');
noUiSlider.create(thetaInitialRootzoneSlider, { start: 0.29, range: {'min': 0, 'max': 0.5}, step: 0.01, format: wNumb({decimals: 2}) });
thetaInitialRootzoneSlider.noUiSlider.on('update', function (values, handle) { thetaInitialRootzoneSliderValue.innerHTML = 'Initial Rootzone Soil Moisture (m<sup>3</sup>/m<sup>3</sup>): ' + values[handle]; });


// Slider lower limit
let lowerLimitSlider = document.getElementById('lowerLimit');
let lowerLimitSliderValue = document.getElementById('lowerLimitSliderValue');
noUiSlider.create(lowerLimitSlider, { start: 0.18, range: {'min': 0, 'max': 0.25}, step: 0.01, format: wNumb({decimals: 2}) });
lowerLimitSlider.noUiSlider.on('update', function (values, handle) { lowerLimitSliderValue.innerHTML = 'Lower Limit (m<sup>3</sup>/m<sup>3</sup>): ' + values[handle]; });


// Slider upper limit
let upperLimitSlider = document.getElementById('upperLimit');
let upperLimitSliderValue = document.getElementById('upperLimitSliderValue');
noUiSlider.create(upperLimitSlider, { start: 0.31, range: {'min': 0.25, 'max': 0.5}, step: 0.01, format: wNumb({decimals: 2}) });
upperLimitSlider.noUiSlider.on('update', function (values, handle) { upperLimitSliderValue.innerHTML = 'Upper Limit (m<sup>3</sup>/m<sup>3</sup>): ' + values[handle]; });


// Slider residue cover
let residueCoverSlider = document.getElementById('residueCover');
let residueCoverSliderValue = document.getElementById('residueCoverSliderValue');
noUiSlider.create(residueCoverSlider, { start: 10, range: {'min': 0, 'max': 100}, step: 1, format: wNumb({decimals: 0}) });
residueCoverSlider.noUiSlider.on('update', function (values, handle) { residueCoverSliderValue.innerHTML = 'Residue Cover (%): ' + values[handle]; });


// Slider wetted fraction by irrigation
let wettedFractionSlider = document.getElementById('wettedFraction');
let wettedFractionSliderValue = document.getElementById('wettedFractionSliderValue');
noUiSlider.create(wettedFractionSlider, { start: 1, range: {'min': 0, 'max': 1}, step: 0.1, format: wNumb({decimals: 1}) });
wettedFractionSlider.noUiSlider.on('update', function (values, handle) { wettedFractionSliderValue.innerHTML = 'Fraction Wetted Area: ' + values[handle]; });


// Slider curve number
let curveNumberSlider = document.getElementById('curveNumber');
let curveNumberSliderValue = document.getElementById('curveNumberSliderValue');
noUiSlider.create(curveNumberSlider, { start: 80, range: {'min': 50, 'max': 100}, step: 1, format: wNumb({decimals: 0}) });
curveNumberSlider.noUiSlider.on('update', function (values, handle) { curveNumberSliderValue.innerHTML = 'Curve Number: ' + values[handle]; });


// Slider of duration of crop stages
let stagesDurationSlider = document.getElementById('stagesDuration');
let iniSliderValue = document.getElementById('iniSliderValue');
let devSliderValue = document.getElementById('devSliderValue');
let midSliderValue = document.getElementById('midSliderValue');
let lateSliderValue = document.getElementById('lateSliderValue');
noUiSlider.create(stagesDurationSlider, { start:[150, 1000, 1400, 2000, 2400], connect:[true, true, true, true, true, false], range:{'min':0, 'max':2800}, step: 10, margin: 0, format: wNumb({decimals: 0}) });
stagesDurationSlider.noUiSlider.on('update', function (values, handle) { 
    if(handle == 0){ 
        emergenceSliderValue.innerHTML = 'Emergence: ' + values[handle] + ' thermal units';
    } else if (handle == 1){
        iniSliderValue.innerHTML = 'Initial stage: ' + values[handle] + ' thermal units';
    } else if (handle == 2){
        devSliderValue.innerHTML = 'Development stage: ' + values[handle] + ' thermal units';
    } else if(handle == 3){
        midSliderValue.innerHTML = 'Middle stage: ' + values[handle] + ' thermal units';
    } else {
        lateSliderValue.innerHTML = 'Late stage: ' + values[handle] + ' thermal units';
    }
});

var stagesDurationConnect = stagesDurationSlider.querySelectorAll('.noUi-connect');
var stagesDurationClasses = ['emergence-color','ini-color', 'dev-color', 'mid-color', 'late-color'];
for (var i = 0; i < stagesDurationConnect.length; i++) {
    stagesDurationConnect[i].classList.add(stagesDurationClasses[i]);
}


// Slider Kc Ini
let KcbIniSlider = document.getElementById('KcbIni');
let KcbIniSliderValue = document.getElementById('KcbIniSliderValue');
noUiSlider.create(KcbIniSlider, { start: 0.15, range: {'min': 0, 'max': 1}, step:0.01, format: wNumb({decimals: 2}) });
KcbIniSlider.noUiSlider.on('update', function (values, handle) {KcbIniSliderValue.innerHTML = 'Kcb Ini: ' + values[handle]; });

// Slider Kcb Mid
let KcbMidSlider = document.getElementById('KcbMid');
let KcbMidSliderValue = document.getElementById('KcbMidSliderValue');
noUiSlider.create(KcbMidSlider, { start: 1.15, range: {'min': 0, 'max': 1.3}, step:0.01, format: wNumb({decimals: 2}) });
KcbMidSlider.noUiSlider.on('update', function (values, handle) { KcbMidSliderValue.innerHTML = 'Kcb Mid: ' + values[handle]; });

// Slider Kcb End
let KcbEndSlider = document.getElementById('KcbEnd');
let KcbEndSliderValue = document.getElementById('KcbEndSliderValue');
noUiSlider.create(KcbEndSlider, { start: 0.4, range: {'min': 0, 'max': 1}, step:0.01, format: wNumb({decimals: 2}) });
KcbEndSlider.noUiSlider.on('update', function (values, handle) { KcbEndSliderValue.innerHTML = 'Kcb End: ' + values[handle]; });


// Slider base temperature
let baseTempSlider = document.getElementById('baseTemp');
let baseTempSliderValue = document.getElementById('baseTempSliderValue');
noUiSlider.create(baseTempSlider, { start: 0, range: {'min': -5, 'max': 18}, step: 1, format: wNumb({decimals: 0}) });
baseTempSlider.noUiSlider.on('update', function (values, handle) { baseTempSliderValue.innerHTML = 'Tbase: ' + values[handle] + ' &#8451'; });


// Slider upper temperature
let upperTempSlider = document.getElementById('upperTemp');
let upperTempSliderValue = document.getElementById('upperTempSliderValue');
noUiSlider.create(upperTempSlider, { start: 35, range: {'min': 30, 'max': 45}, step: 1, format: wNumb({decimals: 0}) });
upperTempSlider.noUiSlider.on('update', function (values, handle) { upperTempSliderValue.innerHTML = 'Tupper: ' + values[handle] + ' &#8451'; });


// Slider maximum plant height
let plantHeightSlider = document.getElementById('plantHeight');
let plantHeightSliderValue = document.getElementById('plantHeightSliderValue');
noUiSlider.create(plantHeightSlider, { start: 1, range: {'min': 0.1, 'max': 3}, step: 0.1, format: wNumb({decimals: 1}) });
plantHeightSlider.noUiSlider.on('update', function (values, handle) { plantHeightSliderValue.innerHTML = 'Max. Plant Height (m): ' + values[handle]; });


// Slider maximum root depth
let rootDepthSlider = document.getElementById('rootDepth');
let rootDepthSliderValue = document.getElementById('rootDepthSliderValue');
noUiSlider.create(rootDepthSlider, { start: 1.2, range: {'min': 0.3, 'max': 3}, step: 0.1, format: wNumb({decimals: 1}) });
rootDepthSlider.noUiSlider.on('update', function (values, handle) { rootDepthSliderValue.innerHTML = 'Max. Root Depth (m): ' + values[handle]; });


// Slider yield response index
let yieldResponseSlider = document.getElementById('yieldResponse');
let yieldResponseSliderValue = document.getElementById('yieldResponseSliderValue');
noUiSlider.create(yieldResponseSlider, { start: 1.2, range: {'min': 0.7, 'max': 1.5}, step: 0.05, format: wNumb({decimals: 2}) });
yieldResponseSlider.noUiSlider.on('update', function (values, handle) { yieldResponseSliderValue.innerHTML = 'Yield Response Factor: ' + values[handle]; });


// Slider yield Potential
let yieldPotentialSlider = document.getElementById('yieldPotential');
let yieldPotentialSliderValue = document.getElementById('yieldPotentialSliderValue');
noUiSlider.create(yieldPotentialSlider, { start: 7, range: {'min': 1.0, 'max': 10}, step: 0.1, format: wNumb({decimals: 1}) });
yieldPotentialSlider.noUiSlider.on('update', function (values, handle) { yieldPotentialSliderValue.innerHTML = 'Yield Potential: ' + values[handle] + ' Mg/ha'; });


// Slider pTab
let pTabSlider = document.getElementById('pTab');
let pTabSliderValue = document.getElementById('pTabSliderValue');
noUiSlider.create(pTabSlider, { start: 0.5, range: {'min': 0.1, 'max': 0.8}, step: 0.05, format: wNumb({decimals: 2}) });
pTabSlider.noUiSlider.on('update', function (values, handle) { pTabSliderValue.innerHTML = 'pTab: ' + values[handle]; });


// Export Data
let exportBtn = document.getElementById("exportBtn");
exportBtn.addEventListener('click', exportProject);

function exportProject(){
    collectModelSettingsFromDOM()
    let filename = geolocation.name + '_';
    let exportData = {};
    if(document.getElementById('exportSettingsBox').checked){
        exportData.settings = {geolocation,soil,plant,management,options};
        filename += 'settings_'
    }

    if(document.getElementById('exportInputsBox').checked){
        exportData.inputs = {climate,observations};
        filename += 'inputs_'
    }

    if(document.getElementById('exportOutputsBox').checked){
        exportData.outputs = {...outputs};
        exportData.outputs = roundValuesJson(exportData.outputs);
        exportData.stats = {...stats};
        exportData.stats = roundValuesJson(exportData.stats);
        filename += 'outputs_'
    }
    exportData.version = 'File generated with ' + version + ' - ' + new Date().toISOString();
    exportBtn.download =  filename + 'ForecastDualKc.json';
    exportBtn.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData));
}

function roundValuesJson(J){
    for(let key in J){
        for(let i=0; i<J[key].length; i++){
            if(J[key][i].hasOwnProperty('y')){
                for(let j=0; j<J[key][i].y.length; j++){
                    J[key][i].y[j] = Math.round(J[key][i].y[j]*100)/100
                }
            }
        }
    }
    return J;
}


// Import Data
let importBtn = document.getElementById("importBtn");
importBtn.addEventListener('change', importProject, false);

function importProject(e){
    const reader = new FileReader();
    reader.readAsText(importBtn.files[0]);
    reader.onload = function(){ 
        runUploadProject(JSON.parse(reader.result));
    }
}

function runUploadProject(data){
    if(data.hasOwnProperty('settings') & data.hasOwnProperty('inputs')){
        setSettings(data.settings);
        climate = data.inputs.climate;
        observations = data.inputs.observations;
        run()
    } else if(data.hasOwnProperty('settings') & !data.hasOwnProperty('inputs')){
        alert('Your project file only contains settings. Please load climate and current observations first.')
    } else {
        alert('There was an error loading your data. File might have the wrong format.')
    } 
}



///// EVENTLISTENERS /////
document.querySelectorAll('.custom-slider').forEach(item => {
    item.noUiSlider.on('change', run);
})


// ENABLE DISABLE SLIDERS
function enableSliders(){
    document.querySelectorAll('.custom-slider').forEach(item => {
        item.removeAttribute('disabled');
    })
    document.getElementById('landing').style.display = 'none';
    document.getElementById('plotArea').style.display = 'block';
    document.getElementById('xAxisVariableMenu').parentElement.parentElement.parentElement.style.display = 'block';
}


///// GLOBAL VARIABLES /////
let settings = {};
let outputs = {};
let stats = {};
let plant = {};
let soil = {};
let management = {};
let geolocation = {};
let options = {};
let observations = [];
let climate = [];
let observationsHaveBeenLoaded = false;
let isPlotLoaded = false;


///// PARSE CLIMATE DATA FILE /////
function readClimate (){
    collectModelSettingsFromDOM()
    const reader = new FileReader();
    reader.onload = function(e){ 
       let lines = reader.result.split('\n');

        // Start from second array. First array is for the headers
        for(let i=1; i<lines.length; i++){
            if(lines[i].length > 0){
                let values = lines[i].split(',');
                climate.push( { year:parseInt(values[0]), month:parseInt(values[1]), day:parseInt(values[2]), 
                    tempMax:parseFloat(values[3]), tempMin:parseFloat(values[4]), 
                    rhMax:parseFloat(values[5]), rhMin:parseFloat(values[6]),
                    solarRad:parseFloat(values[7]), windSpeed:parseFloat(values[8]),
                    precip:parseFloat(values[9])} );
            }
        };
        for(let i=0; i<climate.length; i++){ climate[i].tempAvg = Math.round( (climate[i].tempMax + climate[i].tempMin)/2 * 100)/100 }
        for(let i=0; i<climate.length; i++){ climate[i].date = new Date(climate[i].year, climate[i].month-1, climate[i].day).getTime() }
        for(let i=0; i<climate.length; i++){ climate[i].doy = getDayOfYear(climate[i].date) }
        for(let i=0; i<climate.length; i++){ climate[i].ETref = computeReferenceET(geolocation,climate[i], 'grass')}
        M.toast({html: 'Climate loaded!'})
        e.target.value = '';

        observationsInputElement.disabled = false;
        if(observationsHaveBeenLoaded){run()}

    }
    reader.readAsText(climateInputElement.files[0])
}


///// PARSE OBSERVATIONS DATA FILE /////
function readObservations (){
    collectModelSettingsFromDOM()
    const reader = new FileReader();
    reader.onload = function(e){ 
        let lines = reader.result.split('\n');
        let headers = lines[0].split(',');
        
        if(headers.length > 14){
            M.toast({html: 'Too many variables in spreadsheet'})
            document.getElementById('observationsFileName').value = ''; 
        }

        // Start from second array. First array is for the headers
        for(let i=1; i<lines.length; i++){
            if(lines[i].length > 0){
                let values = lines[i].split(',');
                observations.push( { year:parseInt(values[0]), month:parseInt(values[1]), day:parseInt(values[2]), 
                                tempMax:parseFloat(values[3]), tempMin:parseFloat(values[4]), 
                                rhMax:parseFloat(values[5]), rhMin:parseFloat(values[6]),
                                solarRad:parseFloat(values[7]), windSpeed:parseFloat(values[8]),
                                precip:parseFloat(values[9]), irrigation: parseFloat(values[10]), surfaceSoilWaterObs:parseFloat(values[11]), 
                                rootzoneSoilWaterObs:parseFloat(values[12]), canopyCoverObs:parseFloat(values[13]) } )
            }
        }

        for(let i=0; i<observations.length; i++){ observations[i].tempAvg = Math.round( (observations[i].tempMax + observations[i].tempMin)/2 * 100)/100 }
        for(let i=0; i<observations.length; i++){ observations[i].date = new Date(observations[i].year, observations[i].month-1, observations[i].day).getTime() }
        for(let i=0; i<observations.length; i++){ observations[i].doy = getDayOfYear(observations[i].date) }
        for(let i=0; i<observations.length; i++){ observations[i].ETref = computeReferenceET(geolocation, observations[i], 'grass')}

        M.toast({html: 'Observations loaded!'})
        e.target.value = '';

        let L = observations.length-1;
        let N = Math.max(L-15,0);
        let startDate = timestamp(observations[0].year, observations[0].month, observations[0].day);
        let endDate = timestamp(observations[L].year, observations[L].month, observations[L].day);
        let forecastDate = timestamp(observations[N].year, observations[N].month, observations[N].day);

        // Update management slider with observations boundaries
        managementDatesSlider.noUiSlider.updateOptions( {range: {'min': startDate, 'max': endDate} }); // Update the range of the date slider       
        managementDatesSlider.noUiSlider.set([startDate,forecastDate]); // Set the date slider using the first and last dates of the observations dataset
        
        observationsHaveBeenLoaded = true;
        run()
    }
    reader.readAsText(observationsInputElement.files[0])
}



///// DEFINE MAIN FUNCTION /////
//createPlots()
function run(){
    collectModelSettingsFromDOM()
    model()
    updatePlots()
    enableSliders()
    addFieldObservationsToPlot()
}


///// COLLECT UP MODEL settings /////
function collectModelSettingsFromDOM(){
    geolocation = { name: projectNameElement.value,
                    description: projectDescriptionElement.value,
                    altitude: parseFloat(altitudeElement.value), 
                    latitude: parseFloat(latitudeElement.value),
    };

    plant = {KcbIni: parseFloat(KcbIniSlider.noUiSlider.get()),
            KcbMid: parseFloat(KcbMidSlider.noUiSlider.get()),
            KcbEnd: parseFloat(KcbEndSlider.noUiSlider.get()),
            baseTempeature: parseFloat(baseTempSlider.noUiSlider.get()),
            upperTempeature: parseFloat(upperTempSlider.noUiSlider.get()),
            emergenceThermalUnits: parseFloat(stagesDurationSlider.noUiSlider.get()[0]),
            iniThermalUnits: parseFloat(stagesDurationSlider.noUiSlider.get()[1]),
            devThermalUnits: parseFloat(stagesDurationSlider.noUiSlider.get()[2]),
            midThermalUnits: parseFloat(stagesDurationSlider.noUiSlider.get()[3]),
            lateThermalUnits: parseFloat(stagesDurationSlider.noUiSlider.get()[4]),
            pTab: parseFloat(pTabSlider.noUiSlider.get()),
            plantHeight: parseFloat(plantHeightSlider.noUiSlider.get()),
            rootDepth: parseFloat(rootDepthSlider.noUiSlider.get()),
            yieldResponse: parseFloat(yieldResponseSlider.noUiSlider.get()),
            yieldPotential: parseFloat(yieldPotentialSlider.noUiSlider.get())
    };
    
    soil = {readilyEvaporableWater: parseFloat(readilyEvaporableWaterSlider.noUiSlider.get()),
            surfaceDepth: parseFloat(surfaceDepthSlider.noUiSlider.get()),
            residueCover: parseFloat(residueCoverSlider.noUiSlider.get()),
            lowerLimit: parseFloat(lowerLimitSlider.noUiSlider.get()),
            upperLimit: parseFloat(upperLimitSlider.noUiSlider.get()),
            thetaInitialSurface: parseFloat( thetaInitialSurfaceSlider.noUiSlider.get()),
            thetaInitialRootzone: parseFloat(thetaInitialRootzoneSlider.noUiSlider.get()),
            wettedFraction: parseFloat(wettedFractionSlider.noUiSlider.get()),
            curveNumber: parseFloat(curveNumberSlider.noUiSlider.get())
    };
        
    management = {plantingDate: new Date(parseInt(managementDatesSlider.noUiSlider.get()[0])), 
                  forecastingDate: new Date(parseInt(managementDatesSlider.noUiSlider.get()[1])),
                  plantingToForecast: ( parseInt(managementDatesSlider.noUiSlider.get()[1]) - parseInt(managementDatesSlider.noUiSlider.get()[0]) )/86400000,
                  endDate: managementDatesSlider.noUiSlider.options.range.max
    };

    options = {
        visualizeScenarios: visualizeScenarios.checked,
        assimilateCanopyCoverObservations: assimilateCanopyCoverObservations.checked,
        assimilateSoilMoistureObservations: assimilateSoilMoistureObservations.checked,
        constantRootDepth: constantRootDepth.checked,
        constantPlantHeight: constantPlantHeight.checked
    };

}

// ///// FAO-56 MODEL /////
function model(){

    // Pre-allocate objects
    outputs.xAxisMode;
    outputs.soilWater = [];
    outputs.soilWaterDeficit = [];
    outputs.canopyCover = [];
    outputs.thermalUnitsCumulative = [];
    outputs.precipCumulative = [];
    outputs.ETrefCumulative = [];
    outputs.ETcropCumulative = [];
    outputs.evaporationCumulative = [];
    outputs.evaporation = [];
    outputs.transpiration = [];
    outputs.transpirationCumulative = [];
    outputs.grainYield = [];

    let k = 0, L = climate.length;
    while(k < L){
        if (climate[k].month === (management.plantingDate.getMonth()+1) && climate[k].day === management.plantingDate.getDate() && (k+250) < climate.length){
            let inGrowingSeason = true;

            // Declare model variables
            let n = 0;
            let growingSeasonDays = [];
            let growingSeasonDate = [];
            let ETref;
            let rhMin;
            let precip;
            let windSpeed;
            let tempAvg;
            let irrigation = [];
            let E = [];
            let T = [];
            let evaporationCumulative = [];
            let transpirationCumulative = []
            let fc = [];
            let ETcrop = [];
            let Ke = [];
            let Kcb = [];
            let Ks = [];
            let RO = [];
            let De = [];
            let DPe = [];
            let Dr = [];
            let DPr = [];
            let soilWater = [];
            let soilWaterDeficit = [];
            let Z = [];
            let TAW = [];
            let thermalUnits;
            let thermalUnitsCumulative = [];
            let h = [];
            let precipCumulative = [];
            let ETrefCumulative = [];
            let ETcropCumulative = [];
            let transpirationCumulativeNoStress = [];
            let Kc = [];
            let REW;
            let TEW;
            let few;
            let Kr;
            let KcMax;
            let RAW;
            let depletionOfNewRootLength;
            let grainYield;
            let simulationDate;

            // Compute constant evaporation variables
            TEW = 1000 * (soil.upperLimit - 0.5*soil.lowerLimit) * soil.surfaceDepth; // Eq. 73, FAO-56 total evaporable water (Renamed TEW for potential)
            TEW = TEW - TEW * soil.residueCover/100 * (0.05/0.1); // Reduce TEW by 5% for every 10% residue cover (See Chapter 11: Surface covered by dead vegetation)
            REW = soil.readilyEvaporableWater*TEW; // REW is limited to be less than or equal to TEW

            while (inGrowingSeason){
                if(n < management.plantingToForecast){
                    ETref = observations[n].ETref;
                    tempMax = observations[n].tempMax;
                    tempAvg = observations[n].tempAvg;
                    tempMin = observations[n].tempMin;
                    rhMax = observations[n].rhMax;
                    rhMin = observations[n].rhMin;
                    precip = observations[n].precip;
                    windSpeed = observations[n].windSpeed;
                    irrigation[n] = observations[n].irrigation;
                } else {
                    ETref = climate[k].ETref;
                    tempMax = climate[k].tempMax;
                    tempAvg = climate[k].tempAvg;
                    tempMin = climate[k].tempMin;
                    rhMax = climate[k].rhMax;
                    rhMin = climate[k].rhMin;
                    precip = climate[k].precip;
                    windSpeed = climate[k].windSpeed;
                    irrigation[n] = 0;
                }

                simulationDate = management.plantingDate.getTime() + 86400000 * n;
                growingSeasonDate[n] = formatDatePlotly(simulationDate);
                growingSeasonDays[n] = n;

                if(simulationDate >= plant.startDormant && simulationDate <= plant.endDormant){ isDormant=true } else { isDormant=false }

                // Initial conditions
                if (n == 0){
                    thermalUnits = computeThermalUnits(tempAvg, plant.baseTempeature, plant.upperTempeature); 
                    thermalUnitsCumulative[n] = thermalUnits;
                    if(options.constantRootDepth){ Z[n] = plant.rootDepth; } else { Z[n] = 0; }
                    if(options.constantPlantHeight){ h[n] = plant.plantHeight; } else { h[n] = 0; }
                    if(precip > 0) { RO[n] = computeRunoff(precip, soil.curveNumber) } else { RO[n] = 0}; // Runoff based on the curve number method
                    De[n] = 1000 * (soil.upperLimit - soil.thetaInitialSurface) * soil.surfaceDepth; // initial depletion of surface layer
                    De[n] = Math.max(De[n], 0);        // Eq. 78, FAO-56 Limits to De
                    De[n] = Math.min(De[n], TEW);      // Eq. 78
                    if (De[n] < REW) {Kr = 1} else {Kr = (TEW - De[n])/(TEW - REW)} // Eq. 74, FAO-56, evaporation reduction coefficient
                    DPe[n]= Math.max(0, (precip-RO[n]) + irrigation/soil.wettedFraction - De[n]); // Eq. 79, FAO-56
                    Kcb[n] = 0;
                    KcMax = Math.max((1.2 + [0.04 * (windSpeed - 2) - 0.004*(rhMin-45)] * (h[n]/3)**0.3), Kcb[n] + 0.05); // Eq. 72, FAO-56
                    fc[n] = 0;
                    few = Math.min(1 - fc[n], soil.wettedFraction);
                    Ke[n] = Math.min(Kr * (KcMax - Kcb[n]), few * KcMax); // Eq. 71, FAO-56, soil evaporation coefficient
                    p = plant.pTab + 0.04 * (5 - Kcb[n] * ETref); // Fig. 41, FAO-56
                    p = Math.min(p, 0.8); // Fig. 41, FAO-56
                    p = Math.max(0.1, p); // Fig. 41, FAO-56
                    TAW[n] = 1000 * (soil.upperLimit - soil.lowerLimit) * Z[n];   // Eq. 82, FAO-56, total available water (mm).
                    RAW = p * TAW[n]; // Eq. 83, FAO-56, readily plant available water capacity (mm)
                    Dr[n]  = 1000 * (soil.upperLimit - soil.thetaInitialRootzone) * Z[n];  // Initial depletion of root zone
                    Dr[n]  = Math.min(Dr[n],TAW[n]);    // Set Max Dr0: Dr0 cannot exceed TAW:  physically this cannot happen, but may arise when initial soil water content is low
                    //Dr[n]  = Math.max(Dr[n],0);
                    if (Dr[n] < RAW) {Ks[n] = 1} else {Ks[n] = (TAW[n] - Dr[n]) / (TAW[n] - RAW)} // Eq. 84, FAO-56, transpiration reduction factor
                    ETcrop[n] = (Ks[n] * Kcb[n] + Ke[n]) * ETref; // Eq. 80, FAO-56, total crop water use for the day (mm)
                    DPr[n] = Math.max(0, (precip - RO[n]) + irrigation[n] - ETcrop[n] - Dr[n]);  // Eq. 88, FAO-56, drainage of water from the bottom of the root zone
                    
                    // Additional metrics
                    E[n] = Ke[n] * ETref; // Soil evaporation (mm)
                    T[n] = Ks[n] * Kcb[n] * ETref; // Transpiration on first day.
                    evaporationCumulative[n] = E[n];
                    transpirationCumulative[n] = T[n];
                    soilWater[n] = (soil.upperLimit * Z[n] * 1000) - Dr[n];
                    soilWaterDeficit[n] = Dr[n] - RAW;
                    precipCumulative[n] = precip;
                    ETrefCumulative[n] = ETref;
                    ETcropCumulative[n] = ETcrop[n];
                    transpirationCumulativeNoStress[n] = Kcb[n] * ETref;
                    Kc[n] = Kcb[n] + Ke[n];
    
                } else {

                    // Simulate days 2 to harvest date
                    thermalUnits = computeThermalUnits(tempAvg, plant.baseTempeature, plant.upperTempeature);
                    thermalUnitsCumulative[n] = thermalUnitsCumulative[n-1] + thermalUnits;
                    if(options.constantRootDepth){ Z[n] = plant.rootDepth; } else { Z[n] = Math.min( thermalUnitsCumulative[n]/plant.devThermalUnits*plant.rootDepth, plant.rootDepth); }
                    if(options.constantPlantHeight){ h[n] = plant.plantHeight; } else {  h[n] = Math.min( thermalUnitsCumulative[n]/plant.devThermalUnits*plant.plantHeight, plant.plantHeight); }                       
                   
                    Kcb[n] = getKcbCurveValue(thermalUnitsCumulative[n], plant.emergenceThermalUnits, plant.iniThermalUnits, plant.devThermalUnits, plant.midThermalUnits, plant.lateThermalUnits, plant.KcbIni, plant.KcbMid, plant.KcbEnd)
                    if(Kcb[n] > 0.45){ Kcb[n] = (Kcb[n] + [0.04 * (windSpeed - 2) - 0.004*(rhMin-45)] * (h[n]/3)**0.3) }; // FAO Eq. 70. Correct tabulated Kcb by local conditions
                    KcMax = Math.max((1.2 + [0.04 * (windSpeed - 2) - 0.004*(rhMin - 45)] * (h[n]/3)**0.3), Kcb[n] + 0.05); // Eq. 72, FAO-56
                   
                    if(thermalUnitsCumulative[n] < plant.emergenceThermalUnits){
                        fc[n] = 0;
                    } else if (thermalUnitsCumulative[n] >= plant.emergenceThermalUnits && thermalUnitsCumulative[n] < plant.devThermalUnits){
                        fc[n] = Math.min( fc[n-1] + thermalUnits/(plant.devThermalUnits - plant.emergenceThermalUnits),0.99)
                    } else if (thermalUnitsCumulative[n] >= plant.devThermalUnits && thermalUnitsCumulative[n] < plant.midThermalUnits){
                        fc[n] = fc[n-1];
                    } else {
                        fc[n] = Math.max(fc[n-1] + (Kcb[n] - Kcb[n-1]), 0);
                        //fc[n] = Math.max(fc[n-1] - thermalUnits/(plant.lateThermalUnits - plant.midThermalUnits), 0);
                    }

                    few = Math.min(1 - fc[n], soil.wettedFraction);
                    if (De[n-1] < REW) {
                        Kr = 1
                    } else {
                        Kr = (TEW - De[n-1])/(TEW - REW); // Eq. 74, FAO-56, evaporation reduction coefficient. 
                        //Kr = Math.min( REW/ETref, 0.15*(TEW - De[n-1])/(TEW - REW) ); // Torres and Calera 2010
                    } 
                    Ke[n] = Math.min(few * KcMax, Kr * (KcMax - Kcb[n])); // Eq. 71, FAO-56, soil evaporation coefficient
                    if(precip > 0) { RO[n] = computeRunoff(precip, soil.curveNumber) } else { RO[n] = 0}; // Runoff based on the curve number method
                    DPe[n]= Math.max(0, (precip - RO[n]) + irrigation[n]/soil.wettedFraction - De[n-1]); // Eq. 79, FAO-56 Drainage of water from the bottom of the evaporating layer
                    De[n] = De[n-1] - (precip - RO[n]) - irrigation[n]/soil.wettedFraction +  (Ke[n] * ETref)/few + DPe[n]; // Eq. 77, FAO-56, Evaporative layer depletion. E = (Ke[n] * ETref)
                    De[n] = Math.min(TEW, De[n]); // Depletion cannot exceed TEW, required because F is not constrained. TEW was TEW[i]
                    p = plant.pTab + 0.04 * (5 - Kcb[n] * ETref); // Fig. 41, FAO-56
                    p = Math.min(p, 0.8); // Fig. 41, FAO-56
                    p = Math.max(0.1, p); // Fig. 41, FAO-56
                    TAW[n] = 1000 * (soil.upperLimit - soil.lowerLimit) * Z[n];   // Eq. 82, FAO-56, total available water (mm). 
                    RAW = p * TAW[n]; // Eq. 83, FAO-56, readily plant available water capacity (mm)
                    if (Dr[n-1] < RAW) {Ks[n] = 1} else {Ks[n] = (TAW[n] - Dr[n-1]) / (TAW[n] - RAW)} // Eq. 84, FAO-56, transpiration reduction factor
                    ETcrop[n] = (Ks[n] * Kcb[n] + Ke[n]) * ETref; // Eq. 80, FAO-56, total crop water use for the day (mm)
                    DPr[n] = Math.max((precip - RO[n]) + irrigation[n] - ETcrop[n] - Dr[n-1], 0);  // Eq. 88, FAO-56, drainage of water from the bottom of the root zone
                    depletionOfNewRootLength = 1000 * (soil.upperLimit - (soil.upperLimit + soil.lowerLimit)/2 ) * (Z[n] - Z[n-1]); // Estimate additional deficit of new root length. See Box 5 in Example 38
                    Dr[n] = Dr[n-1] - (precip - RO[n]) - irrigation[n] + ETcrop[n] + DPr[n] + depletionOfNewRootLength;// Eq. 85, FAO-56, root zone depletion at the end of the day
                    //Dr[n] = Math.max(Dr[n], 0); // Eq. 85, FAO-56
                    Dr[n] = Math.min(Dr[n], TAW[n]); // Eq. 86, FAO-56

                    // Additional metrics
                    E[n] = Ke[n] * ETref; // Soil evaporation (mm)
                    T[n] = Ks[n] * Kcb[n] * ETref; // Estimated crop transpiration
                    evaporationCumulative[n] = evaporationCumulative[n-1] + E[n];
                    transpirationCumulative[n] = transpirationCumulative[n-1] + T[n];
                    soilWater[n] = (soil.upperLimit * Z[n] * 1000) - Dr[n];
                    soilWaterDeficit[n] = Dr[n] - RAW;
                    precipCumulative[n] = precipCumulative[n-1] + precip;
                    ETrefCumulative[n] = ETrefCumulative[n-1] + ETref;
                    ETcropCumulative[n] = ETcropCumulative[n-1] + ETcrop[n];
                    transpirationCumulativeNoStress[n] = transpirationCumulativeNoStress[n-1] + Kcb[n] * ETref;
                    Kc[n] = Kcb[n] + Ke[n];
                }

                // Assimilate Field Observations
                if(assimilateSoilMoistureObservations.checked && n < management.plantingToForecast){
                    if(!isNaN(observations[n].surfaceSoilWaterObs) & typeof observations[n].surfaceSoilWaterObs === 'number'){
                        De[n] = (soil.upperLimit * soil.surfaceDepth) - observations[n].surfaceSoilWaterObs;
                        De[n] = Math.max(De[n],0);
                    }
                    if(!isNaN(observations[n].rootzoneSoilWaterObs) & typeof observations[n].rootzoneSoilWaterObs  === 'number'){
                        Dr[n] = (soil.upperLimit * plant.rootDepth * 1000) - observations[n].rootzoneSoilWaterObs;
                    }
                }

                if(assimilateCanopyCoverObservations.checked && n < management.plantingToForecast){
                    if(!isNaN(observations[n].canopyCoverObs) & typeof observations[n].canopyCoverObs === 'number'){
                        fc[n] = observations[n].canopyCoverObs/100;
                    }
                }

                
                // Terminate growing season and save results
                if(thermalUnitsCumulative[n] >= plant.lateThermalUnits || k+1 >= climate.length){

                    // Compute grain yield
                    grainYield = plant.yieldPotential * (1 - plant.yieldResponse * (1 - transpirationCumulative[n]/transpirationCumulativeNoStress[n])); // Similar to Eq. 90, FAO-56 (based on FAO-33)
                    grainYield = Math.max(grainYield,0);
                    //grainYield =  transpirationCumulative[n] * 20/1000;

                    // Save output variables
                    let currentYear = climate[k].year;
                    if(xAxisVariableMenu.value === 'date'){
                        xVariable = growingSeasonDate;
                    } else if (xAxisVariableMenu.value === 'daysAfterPlanting'){
                        xVariable = growingSeasonDays;
                    } else {
                        xVariable = thermalUnitsCumulative;
                    }

                    // Save outputs
                    lineColor = "rgba(220, 220, 220, 0.7)";
                    outputs.xAxisMode = xAxisVariableMenu.value;
                    outputs.ETcropCumulative.push({x:xVariable, y:ETcropCumulative, mode:'line', name:"Y"+currentYear, showlegend: false, line: {color: lineColor}});
                    outputs.ETrefCumulative.push({x:xVariable, y:ETrefCumulative, mode:'line', name:"Y"+currentYear, showlegend: false, line: {color: lineColor}});
                    outputs.precipCumulative.push({x:xVariable, y:precipCumulative, mode:'line', name:"Y"+currentYear, line: {color: lineColor}});
                    outputs.soilWater.push({x:xVariable, y:soilWater, mode:'line', name:"Y"+currentYear, line: {color: lineColor} });
                    outputs.canopyCover.push({x:xVariable, y:fc, mode:'line', name:"Y"+currentYear, line: {color: lineColor}});
                    outputs.thermalUnitsCumulative.push({x:xVariable, y:thermalUnitsCumulative, mode:'line', name:"Y"+currentYear, line: {color: lineColor}});
                    outputs.grainYield.push({x:currentYear, y:grainYield})
                    outputs.evaporationCumulative.push({x:xVariable, y:evaporationCumulative, mode:'line', name:"Y"+currentYear, showlegend: false, line: {color: lineColor}});
                    outputs.transpirationCumulative.push({x:xVariable, y:transpirationCumulative, mode:'line', name:"Y"+currentYear, showlegend: false, line: {color: lineColor}});
                    outputs.soilWaterDeficit.push({x:xVariable, y:soilWaterDeficit, mode:'line', name:"Y"+currentYear, showlegend: false, line: {color: lineColor}});
                    outputs.evaporation.push({x:xVariable, y:E, mode:'line', name:"Y"+currentYear, showlegend: false, line: {color: lineColor}});
                    outputs.transpiration.push({x:xVariable, y:T, mode:'line', name:"Y"+currentYear, showlegend: false, line: {color: lineColor}});
                    inGrowingSeason = false; // This will break the current while loop
                }

                // Increase counters
                n += 1; // Growing season counter
                k += 1; // Climate data counter

            } // End of while for growing season
        }
        k += 1;
    } // End while for climate
    summaryStats()
}


///// PLOTS /////
function summaryStats(){

    // Compute cumulative probability yield
    let yieldN = outputs.grainYield.length;
    let yieldXProb = [];
    let yieldYProb = [];
    for(let i=0; i<yieldN; i++){
        yieldXProb.push(outputs.grainYield[i].y);
        //yieldYProb.push((i+1)/yieldN);
        yieldYProb.push( 1 - ((i+1)/yieldN));
    }
    yieldXProb = yieldXProb.sort();
    let grainYieldCumulativeProbability = {x:yieldXProb, y:yieldYProb, mode:'line'};

    let xForecasts = outputs.soilWater[0].x; // Simplified solution in line with inputVar[0] in percentile()

    // Soil Water
    let soilWater25 = {x: xForecasts, y:computeTrend(outputs.soilWater, 25), mode:'line', line: {color: "rgb(255, 23, 68)", dash: 'dot'}, name: "Lower Bound"};
    let soilWater50 = {x: xForecasts, y:computeTrend(outputs.soilWater, 50), mode:'line', line: {color: "rgb(255, 23, 68)"}, name: "Median Soil Water"};
    let soilWater75 = {x: xForecasts, y:computeTrend(outputs.soilWater, 75), mode:'line', line: {color: "rgb(255, 23, 68)", dash: 'dot'}, fill: "tonexty", fillcolor: "rgba(68, 68, 68, 0.2)", name: "Upper Bound"};
    stats.soilWater = [soilWater25, soilWater75, soilWater50];

    // Soil Water Deficit
    let soilWaterDeficit25 = {x: xForecasts, y:computeTrend(outputs.soilWaterDeficit, 25), mode:'line', line: {color: "rgb(255, 23, 68)", dash: 'dot'}, name: "Lower Bound"};
    let soilWaterDeficit50 = {x: xForecasts, y:computeTrend(outputs.soilWaterDeficit, 50), mode:'line', line: {color: "rgb(255, 23, 68)"}, name: "Median Soil Water Deficit"};
    let soilWaterDeficit75 = {x: xForecasts, y:computeTrend(outputs.soilWaterDeficit, 75), mode:'line', line: {color: "rgb(255, 23, 68)", dash: 'dot'}, fill: "tonexty", fillcolor: "rgba(68, 68, 68, 0.2)", name: "Upper Bound"};
    stats.soilWaterDeficit = [soilWaterDeficit25, soilWaterDeficit75, soilWaterDeficit50];

    // Canopy Cover
    let canopyCover25 = {x: xForecasts, y:computeTrend(outputs.canopyCover, 25), mode:'line', line: {color: "rgb(0, 150, 0)", dash: 'dot'}, name: "Lower Bound"};
    let canopyCover50 = {x: xForecasts, y:computeTrend(outputs.canopyCover, 50), mode:'line', line: {color: "rgb(0, 150, 0)"}, name: "Median Canopy Cover"};
    let canopyCover75 = {x: xForecasts, y:computeTrend(outputs.canopyCover, 75), mode:'line', line: {color: "rgb(0, 150, 0)", dash: 'dot'}, fill: "tonexty", fillcolor: "rgba(68, 68, 68, 0.2)", name: "Upper Bound"};
    stats.canopyCover = [canopyCover25, canopyCover75, canopyCover50];

    // ETcrop Cumulative
    let ETcropCumulative25 = {x: xForecasts, y:computeTrend(outputs.ETcropCumulative, 25), mode:'line', line: {color: "rgb(255, 23, 68)", dash: 'dot'}, name: "Lower Bound", showlegend: false};
    let ETcropCumulative50 = {x: xForecasts, y:computeTrend(outputs.ETcropCumulative, 50), mode:'line', line: {color: "rgb(255, 23, 68)"}, name: "Median ETcrop"};
    let ETcropCumulative75 = {x: xForecasts, y:computeTrend(outputs.ETcropCumulative, 75), mode:'line', line: {color: "rgb(255, 23, 68)", dash: 'dot'}, fill: "tonexty", fillcolor: "rgba(68, 68, 68, 0.2)", name: "Upper Bound", showlegend: false};
    stats.ETcropCumulative = [ETcropCumulative25, ETcropCumulative75, ETcropCumulative50];

    // ETref Cumulative
    let ETrefCumulative25 = {x: xForecasts, y:computeTrend(outputs.ETrefCumulative, 25), mode:'line', line: {color: "rgb(219, 6, 226)", dash: 'dot'}, name: "Lower Bound", showlegend: false};
    let ETrefCumulative50 = {x: xForecasts, y:computeTrend(outputs.ETrefCumulative, 50), mode:'line', line: {color: "rgb(219, 6, 226)"}, name: "Median ETref"};
    let ETrefCumulative75 = {x: xForecasts, y:computeTrend(outputs.ETrefCumulative, 75), mode:'line', line: {color: "rgb(219, 6, 226)", dash: 'dot'}, fill: "tonexty", fillcolor: "rgba(68, 68, 68, 0.2)", name: "Upper Bound", showlegend: false};
    stats.ETrefCumulative = [ETrefCumulative25, ETrefCumulative75, ETrefCumulative50];

    // Precip Cumulative
    let precipCumulative25 = {x: xForecasts, y:computeTrend(outputs.precipCumulative, 25), mode:'line', line: {color: "rgb(68, 23, 225)", dash: 'dot'}, name: "Lower Bound"};
    let precipCumulative50 = {x: xForecasts, y:computeTrend(outputs.precipCumulative, 50), mode:'line', line: {color: "rgb(68, 23, 225)"}, name: "Median Precipitation"};
    let precipCumulative75 = {x: xForecasts, y:computeTrend(outputs.precipCumulative, 75), mode:'line', line: {color: "rgb(68, 23, 225)", dash: 'dot'}, fill: "tonexty", fillcolor: "rgba(68, 68, 68, 0.2)", name: "Upper Bound"};
    stats.precipCumulative = [precipCumulative25, precipCumulative75, precipCumulative50];

    // Thermal Units Cumulative
    let thermalUnitsCumulative25 = {x: xForecasts, y:computeTrend(outputs.thermalUnitsCumulative, 25), mode:'line', line: {color: "rgb(230, 81, 0)", dash: 'dot'}, name: "Lower Bound"};
    let thermalUnitsCumulative50 = {x: xForecasts, y:computeTrend(outputs.thermalUnitsCumulative, 50), mode:'line', line: {color: "rgb(230, 81, 0)"}, name: "Median Thermal Units"};
    let thermalUnitsCumulative75 = {x: xForecasts, y:computeTrend(outputs.thermalUnitsCumulative, 75), mode:'line', line: {color: "rgb(230, 81, 0)", dash: 'dot'}, fill: "tonexty", fillcolor: "rgba(68, 68, 68, 0.2)", name: "Upper Bound"};
    stats.thermalUnitsCumulative = [thermalUnitsCumulative25, thermalUnitsCumulative75, thermalUnitsCumulative50];

    // Evaporation Cumulative
    let evaporationCumulative25 = {x: xForecasts, y:computeTrend(outputs.evaporationCumulative, 25), mode:'line', line: {color: "rgb(255, 23, 68)", dash: 'dot'}, name: "Lower Bound", showlegend: false};
    let evaporationCumulative50 = {x: xForecasts, y:computeTrend(outputs.evaporationCumulative, 50), mode:'line', line: {color: "rgb(255, 23, 68)"}, name: "Median Evaporation"};
    let evaporationCumulative75 = {x: xForecasts, y:computeTrend(outputs.evaporationCumulative, 75), mode:'line', line: {color: "rgb(255, 23, 68)", dash: 'dot'}, fill: "tonexty", fillcolor: "rgba(68, 68, 68, 0.2)", name: "Upper Bound", showlegend: false};
    stats.evaporationCumulative = [evaporationCumulative25, evaporationCumulative75, evaporationCumulative50];

    // Transpiration Cumulative
    let transpirationCumulative25 = {x: xForecasts, y:computeTrend(outputs.transpirationCumulative, 25), mode:'line', line: {color: "rgb(0, 150, 0)", dash: 'dot'}, name: "Lower Bound", showlegend: false};
    let transpirationCumulative50 = {x: xForecasts, y:computeTrend(outputs.transpirationCumulative, 50), mode:'line', line: {color: "rgb(0, 150, 0)"}, name: "Median Transpiration"};
    let transpirationCumulative75 = {x: xForecasts, y:computeTrend(outputs.transpirationCumulative, 75), mode:'line', line: {color: "rgb(0, 150, 0)", dash: 'dot'}, fill: "tonexty", fillcolor: "rgba(68, 68, 68, 0.2)", name: "Upper Bound", showlegend: false};
    stats.transpirationCumulative = [transpirationCumulative25, transpirationCumulative75, transpirationCumulative50];

    // Yield Cumulative Probability
    stats.grainYieldCumulativeProbability = [grainYieldCumulativeProbability];
}

function updatePlots(){
    config = {modeBarButtonsToRemove: ['hoverCompareCartesian', 'lasso2d'], responsive: true};

    Plotly.react('plotSoilWater', stats.soilWater, { yaxis: {title: "Rootzone Soil Water (mm)"}, autosize: true, showlegend: false, hovermode:'closest', margin: {l:80, r:20, t:10, b:80} }, config);
    Plotly.react('plotSoilWaterDeficit', stats.soilWaterDeficit, { yaxis: {title: "Rootzone Soil Water Deficit (mm)"}, autosize: true, showlegend: false, hovermode:'closest', margin: {l:80, r:20, t:10, b:80} }, config);
    Plotly.react('plotCanopyCover', stats.canopyCover, { yaxis: {title: "Fraction Canopy Cover"}, autosize: true, showlegend: false, hovermode:'closest', margin: {l:80, r:20, t:10, b:80} }, config);
    Plotly.react('plotETCumulative', stats.ETcropCumulative, { yaxis: {title: "Cumulative ET (mm)"}, autosize: true, showlegend: true, legend: {x: 1, xanchor: 'right', y: 1.1, orientation:"h"}, hovermode:'closest', margin: {l:80, r:20, t:10, b:80} }, config);
    Plotly.react('plotPrecipCumulative', stats.precipCumulative, { yaxis: {title: "Cumulative Precipitation (mm)"}, autosize: true, showlegend: false, hovermode:'closest', margin: {l:80, r:20, t:10, b:80} }, config);
    Plotly.react('plotThermalUnitsCumulative', stats.thermalUnitsCumulative, { yaxis: {title: "Thermal Units (C-day)"}, autosize: true, showlegend: false, hovermode:'closest', margin: {l:80, r:20, t:10, b:80} }, config);
    Plotly.react('plotETPartitionCumulative', stats.evaporationCumulative, { yaxis: {title: "ET components (mm)"}, autosize: true, showlegend: true, legend: {x: 1, xanchor: 'right', y: 1.1, orientation:"h"}, hovermode:'closest', margin: {l:80, r:20, t:10, b:80} }, config);
    Plotly.react('plotGrainYield', stats.grainYieldCumulativeProbability, { xaxis: {title: "Estimated Grain Yield (Mg/ha)"}, yaxis: {title: "1 - Cumulative Probability"}, autosize: true, showlegend: false, hovermode:'closest', margin: {l:80, r:20, t:10, b:80} }, config);
    
    Plotly.addTraces('plotETCumulative', stats.ETrefCumulative);
    Plotly.addTraces('plotETPartitionCumulative', stats.transpirationCumulative);

    if(visualizeScenarios.checked){
        let N = [...Array(outputs.soilWater.length).keys()]; // generate values from 0 to N-1 using new notation
        Plotly.addTraces('plotSoilWater', outputs.soilWater, N);
        Plotly.addTraces('plotSoilWaterDeficit', outputs.soilWaterDeficit, N);
        Plotly.addTraces('plotCanopyCover', outputs.canopyCover, N);
        Plotly.addTraces('plotETCumulative', outputs.ETcropCumulative, N);
        Plotly.addTraces('plotETCumulative', outputs.ETrefCumulative, N);
        Plotly.addTraces('plotPrecipCumulative', outputs.precipCumulative, N);
        Plotly.addTraces('plotThermalUnitsCumulative', outputs.thermalUnitsCumulative, N);
        Plotly.addTraces('plotETPartitionCumulative', outputs.evaporationCumulative, N);
        Plotly.addTraces('plotETPartitionCumulative', outputs.transpirationCumulative, N);
    }
}


function addFieldObservationsToPlot(){
    let soilWaterObs = {x:[], y:[], mode:'markers', name:'Observation'};
    for(let i=0; i<observations.length; i++){
        if(!isNaN(observations[i].rootzoneSoilWaterObs) & typeof observations[i].rootzoneSoilWaterObs === 'number'){
            soilWaterObs.x.push( formatDatePlotly(observations[i].date)); 
            soilWaterObs.y.push(observations[i].rootzoneSoilWaterObs); 
        }
    }
    Plotly.addTraces('plotSoilWater', soilWaterObs);

    let canopyCoverObs = {x:[], y:[], mode:'markers', name:'Observation', marker: {color: "rgb(0, 150, 0)"} };
    for(let i=0; i<observations.length; i++){
        if(!isNaN(observations[i].canopyCoverObs) & typeof observations[i].canopyCoverObs === 'number'){
            canopyCoverObs.x.push( formatDatePlotly(observations[i].date)); 
            canopyCoverObs.y.push(observations[i].canopyCoverObs/100); 
        }
    }
    Plotly.addTraces('plotCanopyCover', canopyCoverObs)
}



///// HELPER FUNCTIONS /////
function computeReferenceET(geolocation,atmos,cover='grass') {
    const atmPressure = 101.3 * ((293 - 0.0065 * geolocation.altitude) / 293)**5.26;
    const Cp = 0.001013; // Approx. for average atmospheric conditions
    const epsilon =  0.622;
    const lamda = 2.45;
    const gamma = (Cp * atmPressure) / (epsilon * lamda); // Approx. 0.000665

    // Wind speed
    const windHeight = 1.5; // Most common height in [meters]
    let windSpeed2m = atmos.windSpeed * (4.87 / Math.log((67.8 * windHeight) - 5.42));  // Eq. 47, FAO-56 windHeight in [m]

    // Air humidity
    const eTmax = 0.6108 * Math.exp(17.27 * atmos.tempMax / (atmos.tempMax + 237.3)); // Eq. 11, //FAO-56
    const eTmin = 0.6108 * Math.exp(17.27 * atmos.tempMin / (atmos.tempMin + 237.3));
    const es = (eTmax + eTmin) / 2;

    // Vapor pressure
    const delta = 4098 * (0.6108 * Math.exp(17.27 * atmos.tempAvg / (atmos.tempAvg + 237.3))) / (atmos.tempAvg + 237.3)**2;
    let ea = (eTmin * (atmos.rhMax / 100) + eTmax * (atmos.rhMin / 100)) / 2;

    // Solar radiation
    const dr = 1 + 0.033 * Math.cos(2 * Math.PI * atmos.doy/365);  // Eq. 23, FAO-56
    const phi = Math.PI / 180 * geolocation.latitude; // Eq. 22, FAO-56
    const d = 0.409 * Math.sin((2 * Math.PI * atmos.doy/365) - 1.39);
    const omega = Math.acos(-Math.tan(phi) * Math.tan(d));
    const Gsc = 0.0820; // Approx.
    const Ra = 24 * 60 / Math.PI * Gsc * dr * (omega * Math.sin(phi) * Math.sin(d) + Math.cos(phi) * Math.cos(d) * Math.sin(omega));

    // Clear Sky Radiation: Rso (MJ/m2/day)
    const Rso =  (0.75 + (2 * 10**-5) * geolocation.altitude) * Ra; // Eq. 37, FAO-56

    // Rs/Rso = relative shortwave radiation (limited to <= 1.0)
    const alpha = 0.23; // 0.23 for hypothetical grass reference crop
    const Rns = (1 - alpha) * atmos.solarRad; // Eq. 38, FAO-56
    const sigma  = 4.903 * 10**-9;
    const maxTempK = atmos.tempMax + 273.16;
    const minTempK = atmos.tempMin + 273.16;
    const Rnl =  sigma * (maxTempK**4 + minTempK**4) / 2 * (0.34 - 0.14 * Math.sqrt(ea)) * (1.35 * (atmos.solarRad / Rso) - 0.35); // Eq. 39, FAO-56
    const Rn = Rns - Rnl; // Eq. 40, FAO-56

    // Soil heat flux density
    const G = 0; // Eq. 42, FAO-56 soil heat flux is assumed to be 0 for daily time steps  [MJ/m2/day]

    // Define cover
    let coverConstant;
    if(cover === 'grass'){coverConstant = 900} else if (cover === 'alfalfa'){coverConstant = 1600}

    // ETo calculation
    let ETo = (0.408 * delta * (Rn - G) + gamma * (coverConstant / (atmos.tempAvg + 273)) * windSpeed2m * (es - ea)) / (delta + gamma * (1 + 0.34 * windSpeed2m));
    return Math.round(ETo*100)/100;
}


function getDayOfYear(date) {
    let januaryFirst = new Date("1-Jan-" + new Date(date).getFullYear());
    let doy = Math.floor((date - januaryFirst + 86400000)/86400000);
    return doy;
}

function getKcbCurveValue(time,emg,ini,dev,mid,late,KcbIni,KcbMid,KcbEnd) {
    if(time <= emg){
        Kcb = 0;
    } else if(time > emg & time <= ini){
        Kcb = KcbIni;
    } else if (time > ini && time <= dev){
        Kcb = KcbIni + (time-ini)/(dev-ini) * (KcbMid-KcbIni);
    } else if (time > dev && time <= mid){
        Kcb = KcbMid;
    } else {
        Kcb = KcbMid + (time-mid)/(late-mid) * (KcbEnd-KcbMid);
    }
    return Math.min(Math.max(Kcb,0),KcbMid);
}

function timestamp(year,month,day) {
    return new Date(year,month-1,day).getTime();
}


function formatDateSlider(dateInMilli) {
    // Input date must be in milliseconds
    date = new Date(dateInMilli);
    let year = date.getFullYear().toString();
    let month  = date.getMonth();
    let day =  date.getDate().toString();
    let monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return day + '-' + monthShortNames[month] + '-' + year;
  }

function formatDatePlotly(dateInMilli) {
    date = new Date(dateInMilli);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if(day < 10) { day = '0' + day; } 
    if(month < 10) { month = '0' + month; } 
    return year.toString() + '-' + month + '-' + day;
}


function computeRunoff(P,CN) {
    let RO;
    const S02 = 25400 / CN - 254; // Maximum soil moisture retention after runoff begins.
    const S005 = 1.33 * S02**1.15;
    const lambda = 0.05; // Hawkins, 2002.
    const Ia = S005 * lambda; // Initial abstraction (Ia). Rainfall before runoff starts to occur.
    if (P <= Ia) { RO = 0; } else { RO = (P - 0.05 * S005)**2 / (P + 0.95 * S005); }
    return RO
}


function computeThermalUnits(Tavg,Tbase,Tupper){
    // Thermal Units based on Method 1 (McMaster, G.S. and Wilhelm, W., 1997) 
    Tavg = Math.max(Tavg,Tbase);
    Tavg = Math.min(Tavg,Tupper);
    return Tavg - Tbase;
}

function percentile(arr,p){
    arr.sort(function(a, b){return a - b});
    let idx = Math.max(Math.round(arr.length*p/100) - 1, 0);
    return arr[idx];
}

function computeTrend(inputVar,p){
    let summaryStat = [];
    for (let i = 0; i < inputVar[0].y.length; i++){
      let iterVec = [];
      for (let j = 0; j < inputVar.length; j++) {
          if(i <= inputVar[j].y.length){
            iterVec.push(inputVar[j].y[i]);
          }
      }
      summaryStat[i] = percentile(iterVec,p);
    }
    return summaryStat;
}


function setSettings(settings){
    // Plant
    KcbIniSlider.noUiSlider.set([settings.plant.KcbIni]);
    KcbMidSlider.noUiSlider.set([settings.plant.KcbMid]);
    KcbEndSlider.noUiSlider.set([settings.plant.KcbEnd]);
    baseTempSlider.noUiSlider.set([settings.plant.baseTempeature]);
    upperTempSlider.noUiSlider.set([settings.plant.upperTempeature]);
    stagesDurationSlider.noUiSlider.set([settings.plant.emergenceThermalUnits,
                                         settings.plant.iniThermalUnits,
                                         settings.plant.devThermalUnits,
                                         settings.plant.midThermalUnits,
                                         settings.plant.lateThermalUnits]);
    pTabSlider.noUiSlider.set([settings.plant.pTab]);
    plantHeightSlider.noUiSlider.set([settings.plant. plantHeight]);
    rootDepthSlider.noUiSlider.set([settings.plant.rootDepth]);
    yieldResponseSlider.noUiSlider.set([settings.plant.yieldResponse]);
    yieldPotentialSlider.noUiSlider.set([settings.plant.yieldPotential]);

    // Soil
    readilyEvaporableWaterSlider.noUiSlider.set([settings.soil.readilyEvaporableWater])
    surfaceDepthSlider.noUiSlider.set([settings.soil.surfaceDepth])
    residueCoverSlider.noUiSlider.set([settings.soil.residueCover])
    lowerLimitSlider.noUiSlider.set([settings.soil.lowerLimit])
    upperLimitSlider.noUiSlider.set([settings.soil.upperLimit])
    thetaInitialSurfaceSlider.noUiSlider.set([settings.soil.thetaInitialSurface])
    thetaInitialRootzoneSlider.noUiSlider.set([settings.soil.thetaInitialRootzone])
    wettedFractionSlider.noUiSlider.set([settings.soil.wettedFraction])
    curveNumberSlider.noUiSlider.set([settings.soil.curveNumber])

    // Location
    projectNameElement.innerText = settings.geolocation.name;
    projectDescriptionElement.innerText = settings.geolocation.description;
    latitudeElement.innerText = settings.geolocation.latitude;
    altitudeElement.innerText = settings.geolocation.altitude;

    // Management
    let startDate = new Date(settings.management.plantingDate).getTime() ;
    let forecastDate = new Date(settings.management.forecastingDate).getTime();
    let endDate = new Date(settings.management.endDate).getTime();
    managementDatesSlider.noUiSlider.updateOptions( {range: {'min': startDate, 'max': endDate} }); // Update the range of the date slider       
    managementDatesSlider.noUiSlider.set([startDate,forecastDate]);

    // Options
    visualizeScenarios.checked = settings.options.visualizeScenarios;
    assimilateCanopyCoverObservations.checked = settings.options.assimilateCanopyCoverObservations;
    assimilateSoilMoistureObservations.checked = settings.options.assimilateSoilMoistureObservations; 
    constantRootDepth.checked = settings.options.constantRootDepth;
    constantPlantHeight.checked = settings.options.constantPlantHeight; 

}


