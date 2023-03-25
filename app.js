import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

// import { saveAs } from './node_modules/file-saver/src/FileSaver.js';

// Prediction stuff
let gotRight = 0;
let predictGoodDelayed = 0
let predictWrongDelayed = 0
let predictGoodOnTime = 0
let predictWrongOnTime = 0

// Import data and state ignored and training labels

// const csvFile = "./data/airlines_delay_500.csv"
const csvFile = "./data/airlines_delay_2000.csv"
// const csvFile = "./data/airlines_delay.csv"
const trainingLabel = "Class"  
const ignored = [
    "Flight", 
    // "Time",
    // "Length",
    // "Airline",
    // "AirportFrom",
    // "AirportTo",
    // "DayOfWeek"
]  

//load the csv data as json
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)   // gebruik deze data om te trainen
    })
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    //shuffle data to make sure the data is trustworthy
    data.sort(() => (Math.random() - 0.5))
    
    //prepare test and trainingdata
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)
    
    // maak het algoritme aan
    let decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,
        categoryAttr: trainingLabel,
        maxTreeDepth: 50
    })
   
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())
    

    // todo : bereken de accuracy met behulp van alle test data
    function testFlight(flight) {
        // kopie van flight maken, zonder het "Class" label
        const flightWithoutLabel = { ...flight }
        delete flightWithoutLabel.Class
    
        // prediction
        let prediction = decisionTree.predict(flightWithoutLabel)

        // vergelijk de prediction met het echte label
        if (prediction == flight.Class) {
            if (prediction == 1) {
                //top-predictdelay_left-actualdelay
                predictGoodDelayed++
            } else {
                //top-predictontime_left-actualontime
                predictGoodOnTime++
            }
            gotRight++
        } else {
            if (prediction == 0) {
                //top-predictdelay_left-actualontime
                predictWrongDelayed++
            } else {
                //top-predictontime_left-actualdelay
                predictWrongOnTime++
            }
        }
    }
    
    for (const flight of testData) {
        testFlight(flight)
    }

    document.getElementById('accuracy').innerHTML = `Accuracy: ${gotRight / testData.length} - Got Right: ${gotRight}; Out of total: ${testData.length}`

    document.getElementById('top-predictdelay_left-actualdelay').innerHTML = predictGoodDelayed
    document.getElementById('top-predictdelay_left-actualontime').innerHTML = predictWrongDelayed
    document.getElementById('top-predictontime_left-actualdelay').innerHTML = predictWrongOnTime
    document.getElementById('top-predictontime_left-actualontime').innerHTML = predictGoodOnTime

        
    document.getElementById('saveButton').addEventListener('click', () => {
        let fileName = 'model.json';

        let fileToSave = new Blob([decisionTree.stringify()], {
            type: 'application/json',
            name: fileName
        });

        saveAs(fileToSave, fileName);
    })
}


loadData()