import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

// Prediction stuff
let gotRight = 0;
let predictGoodDelayed = 0
let predictWrongDelayed = 0
let predictGoodOnTime = 0
let predictWrongOnTime = 0

//
// DATA
//
// const csvFile = "./data/airlines_delay_500.csv"
const csvFile = "./data/airlines_delay.csv"
const trainingLabel = "Class"  
const ignored = [
    "Flight", 
    "Time",
    "Length",
    // "Airline",
    // "AirportFrom",
    // "AirportTo",
    "DayOfWeek"
]  

//
// laad csv data als json
//
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
    console.log(data);
    //shuffle data to make sure the data is trustworthy
    data.sort(() => (Math.random() - 0.5))
    //prepare test and trainingdata
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)
    console.log("testData", testData);
    // maak het algoritme aan
    console.log('The decisionTree is loading... Please wait up to 6 minutes...')

    let decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,
        categoryAttr: trainingLabel,
        maxTreeDepth: 35
    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    console.log('Making the decisionTree visual...')
    
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())


    //Maak een prediction met een sample uit de testdata
    console.log('Making some predictions...')

    

    // todo : bereken de accuracy met behulp van alle test data
    function testFlight(flight) {
        // kopie van flight maken, zonder het "Class" label
        const flightWithoutLabel = { ...flight }
        delete flightWithoutLabel.Class
    
        // prediction
        let prediction = decisionTree.predict(flightWithoutLabel)
        console.log(`flightPredictionNoLabel: ${prediction}`);
        
        console.log(flight);
        // vergelijk de prediction met het echte label
        if (prediction == flight.Class) {
            if (prediction == 1) {
                //topleft
                //top-predictdelay_left-actualdelay
                predictGoodDelayed++
            } else {
                //bottomright
                //top-predictdelay_left-actualontime
                predictGoodOnTime++
            }
            gotRight++
        } else {
            if (prediction == 0) {
                //topright
                //top-predictdelay_left-actualontime
                predictWrongDelayed++
            } else {
                //bottomleft
                //top-predictontime_left-actualdelay
                predictWrongOnTime++
            }
        }
    }
    
    for (const flight of testData) {
        console.log("Flight", flight);
        testFlight(flight)
    }

    console.log(`Accuracy: ${gotRight / testData.length} - Got Right: ${gotRight}; Out of total: ${testData.length}`)
    document.getElementById('accuracy').innerHTML = `Accuracy: ${gotRight / testData.length} - Got Right: ${gotRight}; Out of total: ${testData.length}`

    document.getElementById('top-predictdelay_left-actualdelay').innerHTML = predictGoodDelayed
    document.getElementById('top-predictdelay_left-actualontime').innerHTML = predictWrongDelayed
    document.getElementById('top-predictontime_left-actualdelay').innerHTML = predictWrongOnTime
    document.getElementById('top-predictontime_left-actualontime').innerHTML = predictGoodOnTime
}


loadData()