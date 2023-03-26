import { DecisionTree } from "../training-side/libraries/decisiontree.js"

let time = 7245
let length = 3275
let Airline = '9E'
let AirportFrom = 'ABE'
let AirportTo = 'ABI'
let DayOfWeek = 4


function loadSavedModel() {
    fetch("./models/model(1).json")
        .then((response) => response.json())
        .then((model) => modelLoaded(model))
}

function modelLoaded(model) {
    let decisionTree = new DecisionTree(model)

    // test om te zien of het werkt
    let flight = {
        Time: time, 
        Length: length, 
        Airline: Airline, 
        AirportFrom: AirportFrom,
        AirportTo: AirportTo,
        DayOfWeek: DayOfWeek,
    }
    let prediction = decisionTree.predict(flight)
    console.log("predicted " + prediction)

    if (prediction == 1) {
        document.getElementById('prediction').innerHTML = `I predict.... It will be DELAYED :(`
    } else {
        document.getElementById('prediction').innerHTML = `I predict.... It will be ON TIME :)`
    }
}

document.getElementById('time').addEventListener('change', (e) => {
    document.getElementById('timeLabel').innerHTML = `(${e.target.value})`
})

document.getElementById('length').addEventListener('change', (e) => {
    document.getElementById('lengthLabel').innerHTML = `(${e.target.value})`
})

document.getElementById('day').addEventListener('change', (e) => {
    document.getElementById('dayLabel').innerHTML = `(${e.target.value})`
})

document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault()
    time = document.getElementById('time').value
    length = document.getElementById('length').value
    Airline = document.getElementById('airline').value
    AirportFrom = document.getElementById('airportFrom').value
    AirportTo = document.getElementById('airportTo').value
    DayOfWeek = document.getElementById('day').value
    
    loadSavedModel()
})