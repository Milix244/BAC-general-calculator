// Script

// STRUCTURE AND FUNCTIONALITY
// 1. Calculation of one european grade into the german grade system
// 2. Calculation of one german grade into the european grade system
// 3. multi step form, multiple slides
//   3a. step functionality
//     3aa. localStorage current step
//   3b. back and next button
//   3c. progress bar
// 4. Checkbox System with all possible subjects for S7 (SLIDE 1)
//   4a. calculate the validity for next
//   4b. localStorage
// 5. BAC subject chosing through checkboxes (SLIDE 2)
//   5a. calculate the validity for next
//   5b. localStorage
// 6. S7 Grades (SLIDE 3)
//   6a. a table with A, B, Written, Oral and its subject
//   6b. calculate validity for next
//   6c. localStorage
// 7. Final mark (SLIDE 4)
//   7a. Calculation of BAC mark
//   7b. Calculation of BAC mark into the german grading system

// 1. EUROPEAN GRADE --> GERMAN GRADE SYSTEM
// ESM (2019): https://www.eursc.eu/Documents/2014-03-D-25-de-16.1.pdf#page=13
// Oberstufe Punktesystem: https://de.wikipedia.org/wiki/Vorlage:Punktesystem_der_gymnasialen_Oberstufe
// KMK Punktesystem (2021): https://www.kmk.org/fileadmin/Dateien/pdf/Bildung/AllgBildung/176_Vereinb-S-II-Abi_2021-02-18.pdf#page=23
// e = European grade in "Vomhundertsatz", E = Abipunkte (0-900), N = German grade

const esgrade = document.getElementById("esgrade");
const choicepl = document.getElementById("limchoice");

// Eventlistener
esgrade.addEventListener("input", function () {
  document.getElementById("problemgrade").innerHTML = "";
});

// Eventlistener 2
esgrade.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    document.getElementById("problemgrade").innerHTML = "";
    if (inputvalidity()) {
      initialisation();
    }
  }
});

// Eventlistener 3
choicepl.addEventListener("change", function (event) {
  if (inputvalidity()) {
    initialisation();
  }
});

// check for input validity
function inputvalidity() {
  if (esgrade.value === "") {
    document.getElementById("germangrade").innerHTML =
      `<p>German Grade System:</p>`;
    document.getElementById("germanpunkte").innerHTML =
      `<p>German "Punktesystem":</p>`;
    document.getElementById("problemgrade").innerHTML = "Please give an input";
  } else if (Number(esgrade.value) <= 10 && Number(esgrade.value) >= 0) {
    return true;
  } else {
    document.getElementById("germangrade").innerHTML =
      `<p>German Grade System:</p>`;
    document.getElementById("germanpunkte").innerHTML =
      `<p>German "Punktesystem":</p>`;
    document.getElementById("problemgrade").innerHTML =
      "Please only give numbers in the range of 0.00-10.00";
  }
}

// Variables + function calls
function initialisation() {
  const grade = Number(esgrade.value);
  const formatgrade = Math.round(grade * 100) / 10;
  let abipunkte; // almost not useful btw
  let germangrade;
  let germanpunkte;
  let ntgermanpunkte;

  // Debug
  console.log(grade, formatgrade);

  abipunkte = Math.round(calcabipunkte(formatgrade));
  germangrade = Math.trunc(calcgermangrade(abipunkte) * 10) / 10;
  ntgermanpunkte = Math.round(calcgermangrade(abipunkte) * 100) / 100;
  germanpunkte =
    Math.round(calcgermanpunkte(Math.round(formatgrade)) * 100) / 100;

  // Debug
  console.log(
    "abipunkte zsm",
    abipunkte,
    "germangrade",
    germangrade,
    "germanpunkte",
    germanpunkte,
  );

  document.getElementById("germangrade").innerHTML =
    `<p>German Grade System: <b>${germangrade} ( ~ ${ntgermanpunkte}, ~ ${abipunkte}/900)</b></p>`;
  document.getElementById("germanpunkte").innerHTML =
    `<p>German "Punktesystem": <b>${germanpunkte}/15</b></p>`;
}

// "Punktesystem (0-900)"
function calcabipunkte(e) {
  if (e >= 50) {
    return 12 * e - 300;
  } else if (e < 50) {
    return 6 * e;
  }
}

// "Note 0.67-4.00 and approximation of 4.01-6.00"
function calcgermangrade(E) {
  if (E >= 300) {
    return 17 / 3 - E / 180;
  } else {
    return 6 - E / 150;
  }
}

// "Notenschlüssel" for "Punkte 0-15"
// Approximation of "Punkte", cuz "Notenschlüssel" may vary (here 40% passing limit as standard)
function calcgermanpunkte(e) {
  let currentlim = document.getElementById("limchoice").value;

  const thresholds40 = [
    0, 20, 27, 33, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
  ];
  const thresholds45 = [
    0, 24, 32, 39, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 94, 98,
  ];
  const thresholds50 = [
    0, 30, 37, 43, 50, 56, 61, 67, 72, 76, 81, 85, 88, 92, 94, 98,
  ];

  let currentthresh;

  if (currentlim == 40) {
    currentthresh = thresholds40;
  } else if (currentlim == 45) {
    currentthresh = thresholds45;
  } else {
    currentthresh = thresholds50;
  }

  //Debug
  console.log("Threshold", currentlim, currentthresh);

  let result = 0;
  for (let i = 0; i < currentthresh.length; i++) {
    if (e >= currentthresh[i]) {
      result = i;
    } else {
      break;
    }
  }
  return result;
}

// 2. GERMAN GRADE --> EUROPEAN GRADE
// (same references as 1.)

const gergrade = document.getElementById("gergrade");

// Eventlistener
gergrade.addEventListener("input", function () {
  document.getElementById("problemgrade2").innerHTML = "";
});

// Eventlistener 2
gergrade.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    document.getElementById("problemgrade2").innerHTML = "";
    if (inputvalidity2()) {
      initialisation2();
    }
  }
});

function inputvalidity2() {
  if (gergrade.value === "") {
    document.getElementById("esgrade2").innerHTML =
      `<p>European Grade System:</p>`;
    document.getElementById("problemgrade2").innerHTML = "Please give an input";
  } else if (
    Math.trunc(Number(gergrade.value) * 10) / 10 >= 0.6 &&
    Number(gergrade.value) <= 6
  ) {
    return true;
  } else {
    document.getElementById("esgrade2").innerHTML =
      `<p>European Grade System:</p>`;
    document.getElementById("problemgrade2").innerHTML =
      "Please only give numbers in the range of 0.6-6.0";
  }
}

function initialisation2() {
  const cgrade = Number(gergrade.value);
  const formgrade = Math.trunc(cgrade * 10) / 10;
  let maxeusgrade;
  let mineusgrade;

  maxeusgrade = Math.trunc(maxcalceusgrade(formgrade) * 10) / 100;
  mineusgrade = Math.trunc(mincalceusgrade(formgrade) * 10) / 100;

  //Debug
  console.log(" min", mineusgrade, "max", maxeusgrade);

  document.getElementById("esgrade2").innerHTML =
    `<p>European Grade System: <b>from ${mineusgrade} to ${maxeusgrade}</b></p>`;
}

function maxcalceusgrade(N) {
  if (N >= 0.67 && N <= 4) {
    return (180 * (17 / 3 - N) + 300) / 12;
  } else if (N < 0.67) {
    return 10;
  } else {
    return (150 * (6 - N)) / 6;
  }
}

function mincalceusgrade(N) {
  minN = Number(N.toFixed(1) + "9");
  if (minN >= 0.67 && minN <= 4) {
    return (180 * (17 / 3 - minN) + 300) / 12;
  } else if (minN < 0.67) {
    return 10;
  } else if (minN > 6.0) {
    return 0;
  } else {
    return (150 * (6 - minN)) / 6;
  }
}

// 3. MULTI STEP FORM

// step functionality
// back and next button
// progress bar
// localStorage current step

// 4. CHECKBOX SYSTEM SUBJECTS S7 (SLIDE 1)
// Reverse coding from: https://thinkin.co/edu/
// Reference: https://www.eursc.eu/BasicTexts/2019-04-D-13-en-10.pdf#page=9

let currenthours;
const doc = (id) => document.getElementById(id);
const problemsub1 = document.getElementById("problemsub1");
const allboxes = document.querySelectorAll(".box");

// Eventlistener to every box
allboxes.forEach((box) => {
  box.addEventListener("change", validitycheckboxes);
});

// Eventlistener 2
allboxes.forEach((box) => {
  box.addEventListener("change", calccurrenthours);
});

// MAA, MA3, MA5
function MAcheck() {
  const A = doc("MAA").checked;
  const five = doc("MA5").checked;
  const three = doc("MA3").checked;

  let ok = true;

  if (five && three) {
    problemsub1.innerHTML += `<p id="MAA1">Not possible to have MA5 and MA3</p>`;
    ok = false;
  }

  if (A && !five) {
    problemsub1.innerHTML += `<p id="MAA2">MAA is only possible with MA5</p>`;
    ok = false;
  }

  if (!three && !five) {
    problemsub1.innerHTML += `<p id="MA">You at least need one MA</p>`;
    ok = false;
  }

  return ok;
}

// PH, GE, HI comp if not 4
function PHGEHIcheck() {
  const ge2 = doc("GE2").checked;
  const ge4 = doc("GE4").checked;
  const hi2 = doc("HI2").checked;
  const hi4 = doc("HI4").checked;
  const ph2 = doc("PH2").checked;
  const ph4 = doc("PH4").checked;

  let ok = true;

  if (!ge2 && !ge4) {
    problemsub1.innerHTML += `<p>You at least need one GE</p>`;
    ok = false;
  }
  if (!hi2 && !hi4) {
    problemsub1.innerHTML += `<p>You at least need one HI</p>`;
    ok = false;
  }
  if (!ph2 && !ph4) {
    problemsub1.innerHTML += `<p>You at least need one PH</p>`;
    ok = false;
  }

  return ok;
}

// MU, AR, PH, GE, HI Dupes
function dupescheck1() {
  const ge = document.querySelectorAll(".GE:checked").length;
  const hi = document.querySelectorAll(".HI:checked").length;
  const ph = document.querySelectorAll(".PH:checked").length;
  const ar = document.querySelectorAll(".AR:checked").length;
  const mu = document.querySelectorAll(".MU:checked").length;

  let ok = true;

  if (ge > 1) {
    problemsub1.innerHTML += `<p>Not possible to have more than one GE selected</p>`;
    ok = false;
  }

  if (hi > 1) {
    problemsub1.innerHTML += `<p>Not possible to have more than one HI selected</p>`;
    ok = false;
  }

  if (ph > 1) {
    problemsub1.innerHTML += `<p>Not possible to have more than one PH selected</p>`;
    ok = false;
  }

  if (ar > 1) {
    problemsub1.innerHTML += `<p>Not possible to have more than one AR selected</p>`;
    ok = false;
  }

  if (mu > 1) {
    problemsub1.innerHTML += `<p>Not possible to have more than one MU selected</p>`;
    ok = false;
  }

  return ok;
}

// ONL, L4
function ONLL4check() {
  const onl = doc("ONL").checked;
  const l4 = doc("L4").checked;

  let ok = true;

  if (onl && l4) {
    problemsub1.innerHTML += `<p>Not possible to have ONL and L4</p>`;
    ok = false;
  }

  return ok;
}

// STS comp, when no BIO, PHY, CHI

function STScheck() {
  const sts = doc("STS").checked;
  const bio = doc("BIO").checked;
  const phy = doc("PHY").checked;
  const chi = doc("CHI").checked;

  let ok = true;

  if (!sts && !bio && !phy && !chi) {
    problemsub1.innerHTML += `<p>You need at least one science course (STS, PHY, BIO, CHI)</p>`;
    ok = false;
  }
  if (sts && bio && phy && chi) {
    problemsub1.innerHTML += `<p>Too many science courses (STS, PHY, BIO, CHI)</p>`;
    ok = false;
  }

  return ok;
}

// LABOR Dupes

function Labordupecheck() {
  const lch = doc("LCH").checked;
  const lbi = doc("LBI").checked;
  const lph = doc("LPH").checked;

  let ok = true;

  if ((lch && lbi) || (lbi && lph) || (lch && lph)) {
    problemsub1.innerHTML += `<p>You cannot have multiple lab courses</p>`;
    ok = false;
  }

  return ok;
}

// LCH, LPH, LBI, CHI, PHY, BIO

function Laboroverlapcheck() {
  const lch = doc("LCH").checked;
  const lbi = doc("LBI").checked;
  const lph = doc("LPH").checked;
  const chi = doc("CHI").checked;
  const phy = doc("PHY").checked;
  const bio = doc("BIO").checked;

  let ok = true;

  if (lch && !chi) {
    problemsub1.innerHTML += `<p>You have to pick CHI in order to have LCH</p>`;
    ok = false;
  }
  if (lbi && !bio) {
    problemsub1.innerHTML += `<p>You have to pick BIO in order to have LBI</p>`;
    ok = false;
  }
  if (lph && !phy) {
    problemsub1.innerHTML += `<p>You have to pick PHY in order to have LPH</p>`;
    ok = false;
  }

  return ok;
}

// at least two 4periods
function fourperiodcheck() {
  const current4period = document.querySelectorAll(".periods4:checked").length;

  let ok = true;

  if (current4period < 2) {
    problemsub1.innerHTML += `<p>You need to have at least two 4 periods options</p>`;
    ok = false;
  }

  return ok;
}

// 29 non complementary
function noncomplementcheck() {
  const noncomplementary = document.querySelectorAll(
    ".compulsory:checked, .periods4:checked, .advanced:checked",
  );
  const noncomphours = [...noncomplementary].reduce(
    (sum, checkbox) => sum + Number(checkbox.value),
    0,
  );

  let ok = true;

  if (noncomphours < 29) {
    problemsub1.innerHTML += `<p>You need at least 29 periods of non complementary subjects</p>`;
    ok = false;
  }

  return ok;
}

// currenthours
function calccurrenthours() {
  const allcheckedboxes = document.querySelectorAll(".box:checked");
  currenthours = [...allcheckedboxes].reduce(
    (sum, checkbox) => sum + Number(checkbox.value),
    0,
  );

  console.log(currenthours);
  document.getElementById("tothours").innerHTML = `${currenthours}`;
  return currenthours;
}

// Max. time 40h, recommended max 35h, Min 31h
function maxmintime(h) {
  if (h >= 31 && h <= 35) {
    return true;
  } else if (h < 31) {
    problemsub1.innerHTML += `<p>You didn't reach the minimum amount of periods</p>`;
    return false;
  } else if (h > 40) {
    problemsub1.innerHTML += `<p>You have reached the maximum amount of periods</p>`;
    return false;
  } else {
    problemsub1.innerHTML += `<p>You are over the recommended amount of periods</p>`;
    return true;
  }
}

// calculate the validity for next, enabling btn
function validitycheckboxes() {
  problemsub1.innerHTML = "";
  if (
    MAcheck() &&
    PHGEHIcheck() &&
    dupescheck1() &&
    ONLL4check() &&
    STScheck() &&
    Labordupecheck() &&
    Laboroverlapcheck() &&
    fourperiodcheck() &&
    noncomplementcheck() &&
    maxmintime(calccurrenthours())
  ) {
    console.log("TRUEEEE");
    document.getElementById("next1").disabled = false;
  } else {
    console.log("NOOO");
    document.getElementById("next1").disabled = true;
  }
}

// localStorage

// 5. BAC SUBJECT CHECKBOXES (SLIDE 2)

// L1A, L2A

// calculate the validity for next
// localStorage

// 6. S7 GRADES TABLE (SLIDE 3)

// a table with A, B, Written, Oral and its subject
// calculate validity for next
// localStorage

// 7. CALCULATE BAC (SLIDE 4)
// reference genereal calc: https://www.eursc.eu/BasicTexts/2015-05-D-12-de-50.pdf#page=15
// reference 2: https://www.eursc.eu/BasicTexts/2015-05-D-12-de-50.pdf#page=49
// C = Vornote (50%), E = Written BAC (35$), O = Oral BAC (15%)
// A = A-Note, B = B-Note

// Eventlistener
document.getElementById("next3").addEventListener("click", function () {});

function calcall() {
  const A = calcavg();
  const B = calcavg();
  const C = calcC(A, B);
  const E = calcavg();
  const O = calcavg();
  const finalbac = calcfinalbac(C, E, O);
}

function calcavg(arr) {
  if (arr.length === 0) {
    return 0;
  }
  const sum = arr.reduce((acc, num) => {
    acc + num;
  }, 0);

  // Debug
  console.log("Sum ", sum, "Avg ", sum / arr.length);

  return sum / arr.length;
}

function calcC(A, B) {
  return Math.round((0.4 * A + 0.6 * B) * 10) / 10;
}

function calcfinalbac(C, E, O) {
  return Math.round((0.5 * C + 0.35 * E + 0.15 * O) * 100) / 100;
}
