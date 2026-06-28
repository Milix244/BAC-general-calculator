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
    roundedgermanpunkte = Math.round(germanpunkte)
    
    // Debug
    console.log("abipunkte zsm", abipunkte, "germangrade", germangrade, "germanpunkte", germanpunkte, "roundedgermanpunkte", roundedgermanpunkte);
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

// "Note 0.67-4.00"
function calcgermangrade(E){
    if (E >= 300){
        return 17/3-E/180;
    }
    else{
        return 6-E/150;
    }
}

// "Punkte 0-15" 
// Approximation der Punkte, da Notenschlüssel variieren (hier 40% Bestehensgrenze laut WIKI)
function calcgermanpunkte(e){
    if (e >= 50) {
        return 0.2*e-4;
    }
    else if (e < 50){
        return -0.0000033608367*e**(4) + 0.0002201502202*e**(3) - 0.0012986704653*e**(2) + 0.0148000148*e;
    }
}