// Script

// STRUCTURE AND FUNCTIONALITY
// 1. Calculation of one grade into the german grade system
// 2. multi step form, multiple slides
//   2a. step functionality
//     2aa. localStorage current step
//   2b. back and next button
//   2c. progress bar
// 3. Checkbox System with all possible subjects for S7 (SLIDE 1)
//   3a. calculate the validity for next
//   3b. localStorage
// 4. BAC subject chosing through checkboxes (SLIDE 2)
//   4a. calculate the validity for next
//   4b. localStorage
// 5. S7 Grades (SLIDE 3)
//   5a. a table with A, B, Written, Oral and its subject
//   5b. calculate validity for next
//   5c. localStorage
// 6. Final mark (SLIDE 4)
//   6a. Calculation of BAC mark
//   6b. Calculation of BAC mark into the german grading system

// 1. ONE GRADE --> GERMAN GRADE SYSTEM
// ESM (from 2019): https://www.eursc.eu/Documents/2014-03-D-25-de-16.1.pdf#page=13
// Oberstufe Punktesystem: https://de.wikipedia.org/wiki/Vorlage:Punktesystem_der_gymnasialen_Oberstufe
// other Punktesystem: 

const esgrade = document.getElementById("esgrade");

// Eventlistener
esgrade.addEventListener("input", function(){
    document.getElementById("problemgrade").innerHTML = "";
})

// Eventlistener 2
esgrade.addEventListener("keydown", function(event){
        if(event.key == "Enter"){
        document.getElementById("problemgrade").innerHTML = "";
        if (inputvalidity()){
            initialisation();
        }
    }
})

// check for input validity
function inputvalidity(){
    if (Number(esgrade.value) <= 10 && Number(esgrade.value) >= 0){
        return true;
    }
    else {
        document.getElementById("problemgrade").innerHTML = "Please only give numbers in the range of 0.00-10.00";
    }
}

// Variables + function calls
function initialisation(){
    const grade = Number(esgrade.value);
    const formatgrade = Math.round(grade*100)/10;
    let abipunkte; // almost not useful btw 
    let germangrade;
    let germanpunkte;
    let roundedgermanpunkte;

    // Debug
    console.log(grade, formatgrade);

    abipunkte = Math.round(calcabipunkte(formatgrade));
    germangrade = Math.round(calcgermangrade(abipunkte)*100)/100;
    germanpunkte = Math.round(calcgermanpunkte(Math.round(formatgrade))*100)/100;
    
    // Debug
    console.log("abipunkte zsm", abipunkte, "germangrade", germangrade, "germanpunkte", germanpunkte, "roundedgermanpunkte", roundedgermanpunkte);

    document.getElementById("germangrade").innerHTML = 
    `
    <p>German Grade System: ${germangrade} </p>
    `
    document.getElementById("germanpunkte").innerHTML = 
    `
    <p>German "Punkte" System: ${germanpunkte}/15</p> 
    `
}

// "Punktesystem (0-900)"
function calcabipunkte(e){
    if (e >= 50) {
        return 12*e-300;
    }
    else if (e < 50){
        return 6*e;
    }
}

// "Note 0.67-4.00 and approximation of 4.01-6.00"
function calcgermangrade(E){
    if (E >= 300){
        return 17/3-E/180;
    }
    else{
        return 6-E/150;
    }
}

// "Notenschlüssel" for "Punkte 0-15" 
// Approximation of "Punkte", cuz "Notenschlüssel" may vary (here 50% passing limit from wiki link)
function calcgermanpunkte(e){

    let currentlim = document.getElementById("limchoice").value

    const thresholds40 = [0, 20, 27, 33, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95]
    const thresholds45 = [0, 24, 32, 39, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 94, 98]
    const thresholds50 = [0, 30, 37, 43, 50, 56, 61, 67, 72, 76, 81, 85, 88, 92, 94, 98]
    
    let currentthresh;

    if(currentlim == 40){
        currentthresh = thresholds40;
    }
    else if(currentlim == 45){
        currentthresh = thresholds45;
    }
    else{
        currentthresh = thresholds50;
    }

    //Debug
    console.log("Threshold", currentlim, currentthresh)

    let result = 0;
    for (let i = 0; i < currentthresh.length; i++) {
        if (e >= currentthresh[i]) {
        result = i;
        }
        else{
            break;
        }
    }
    return result;
}