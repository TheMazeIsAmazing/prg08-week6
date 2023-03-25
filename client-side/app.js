import { DecisionTree } from "../training-side/libraries/decisiontree.js"

function loadSavedModel() {
    fetch("./models/model.json")
        .then((response) => response.json())
        .then((model) => modelLoaded(model))
}

function modelLoaded(model) {
    let decisionTree = new DecisionTree(model)

    // test om te zien of het werkt
    let passenger = { Sex: "male", Age: 22, SibSp: 2, Parch: 2 }
    let prediction = decisionTree.predict(passenger)
    console.log("predicted " + prediction)
}