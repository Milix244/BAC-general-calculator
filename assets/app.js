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
// Offiziell KMK (2018): https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2018/2018_06_14-Richtlinien-EuropSchulen.pdf#page=4
// Oberstufe Punktesystem: https://de.wikipedia.org/wiki/Vorlage:Punktesystem_der_gymnasialen_Oberstufe
// KMK Punktesystem (2021): https://www.kmk.org/fileadmin/Dateien/pdf/Bildung/AllgBildung/176_Vereinb-S-II-Abi_2021-02-18.pdf#page=23
// e = European grade in "Vomhundertsatz", E = Abipunkte (0-900), N = German grade

const doc = (id) => document.getElementById(id);
const esgrade = doc("esgrade");
const choicepl = doc("limchoice");

// Eventlistener
esgrade.addEventListener("input", function () {
  doc("problemgrade").innerHTML = "";
});

// Eventlistener 2
esgrade.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    doc("problemgrade").innerHTML = "";
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
    doc("germangrade").innerHTML = `<p>German Grade System:</p>`;
    doc("germanpunkte").innerHTML = `<p>German "Punktesystem":</p>`;
    doc("problemgrade").innerHTML = "Please give an input";
  } else if (Number(esgrade.value) <= 10 && Number(esgrade.value) >= 0) {
    return true;
  } else {
    doc("germangrade").innerHTML = `<p>German Grade System:</p>`;
    doc("germanpunkte").innerHTML = `<p>German "Punktesystem":</p>`;
    doc("problemgrade").innerHTML =
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

  doc("germangrade").innerHTML =
    `<p>German Grade System: <b>${germangrade} ( ~ ${ntgermanpunkte}, ~ ${abipunkte}/900)</b></p>`;
  doc("germanpunkte").innerHTML =
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
  let currentlim = doc("limchoice").value;

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

const gergrade = doc("gergrade");

// Eventlistener
gergrade.addEventListener("input", function () {
  doc("problemgrade2").innerHTML = "";
});

// Eventlistener 2
gergrade.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    doc("problemgrade2").innerHTML = "";
    if (inputvalidity2()) {
      initialisation2();
    }
  }
});

function inputvalidity2() {
  if (gergrade.value === "") {
    doc("esgrade2").innerHTML = `<p>European Grade System:</p>`;
    doc("problemgrade2").innerHTML = "Please give an input";
  } else if (
    Math.trunc(Number(gergrade.value) * 10) / 10 >= 0.6 &&
    Number(gergrade.value) <= 6
  ) {
    return true;
  } else {
    doc("esgrade2").innerHTML = `<p>European Grade System:</p>`;
    doc("problemgrade2").innerHTML =
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

  doc("esgrade2").innerHTML =
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
const problemsub1 = doc("problemsub1");
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
  doc("tothours").innerHTML = `${currenthours}`;
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
    doc("next1").disabled = false;
  } else {
    doc("next1").disabled = true;
  }
}

// localStorage

// 5. BAC SUBJECT CHECKBOXES (SLIDE 2)
// reference: https://www.eursc.eu/de/European-Schools/European-Baccalaureate#:~:text=Die%20Pr%C3%BCfungen%20zum%20Europ%C3%A4ischen%20Abitur

// Eventlistener 1
doc("next1").addEventListener("click", function () {
  calcoptions();
  validityselect();
});

// Eventlistener 2
document.querySelectorAll(".selectgr").forEach((selectgr) => {
  selectgr.addEventListener("change", validityselect);
});

// Reset all options
function resetopts() {
  doc("written1").innerHTML = "";
  doc("written2").innerHTML = "";
  doc("written3").innerHTML = "";
  doc("written4").innerHTML = "";
  doc("written5").innerHTML = "";
  doc("oral1").innerHTML = "";
  doc("oral2").innerHTML = "";
  doc("oral3").innerHTML = "";
  doc("written1").disabled = false;
  doc("written2").disabled = false;
  doc("written3").disabled = false;
  doc("written4").disabled = false;
  doc("written5").disabled = false;
  doc("oral1").disabled = false;
  doc("oral2").disabled = false;
  doc("oral3").disabled = false;
}

// reset problems
function resetproblems() {
  doc("problemstep2").innerHTML = "";
}

// Written 1 + Oral 1
function calcwrittenoral1() {
  if (doc("L1A").checked) {
    doc("written1").add(new Option("L1A", "L1A"));
    doc("written1").disabled = true;
    doc("oral1").add(new Option("L1A", "L1A"));
    doc("oral1").disabled = true;
  } else {
    doc("written1").add(new Option("L1", "L1"));
    doc("written1").disabled = true;
    doc("oral1").add(new Option("L1", "L1"));
    doc("oral1").disabled = true;
  }
}

// Written 2
function calcwritten2() {
  if (doc("L2A").checked) {
    doc("written2").add(new Option("L2A", "L2A"));
    doc("written2").disabled = true;
  } else {
    doc("written2").add(new Option("L2", "L2"));
    doc("written2").disabled = true;
  }
}

// Oral2
function calcoral2() {
  if (doc("L2A").checked) {
    doc("oral2").add(new Option("L2A", "L2A"));
  } else {
    doc("oral2").add(new Option("L2", "L2"));
  }
  if (doc("GE2").checked) {
    doc("oral2").add(new Option("GE2", "GE2"));
  } else {
    doc("oral2").add(new Option("GE4", "GE4"));
  }
  if (doc("HI2").checked) {
    doc("oral2").add(new Option("HI2", "HI2"));
  } else {
    doc("oral2").add(new Option("HI4", "HI4"));
  }
}

// Written 3
function calcwritten3() {
  if (doc("MA5").checked) {
    doc("written3").add(new Option("MA5", "MA5"));
    doc("written3").disabled = true;
  } else {
    doc("written3").add(new Option("MA3", "MA3"));
    doc("written3").disabled = true;
  }
}

// Oral 3
function calcoral3() {
  if (doc("MAA").checked) {
    doc("oral3").add(new Option("MAA", "MAA"));
    doc("oral3").disabled = true;
  } else {
    document
      .querySelectorAll(".periods4:checked:not(.GE):not(.HI):not(.PH)")
      .forEach((checkbox) => {
        document
          .getElementById("oral3")
          .add(new Option(checkbox.id, checkbox.id));
      });
    document
      .querySelectorAll(".PH:checked, #STS:checked")
      .forEach((checkbox) => {
        document
          .getElementById("oral3")
          .add(new Option(checkbox.id, checkbox.id));
      });
  }
}

// Written 4 & 5
function calcwritten45() {
  document.querySelectorAll(".periods4:checked").forEach((checkbox) => {
    document
      .getElementById("written4")
      .add(new Option(checkbox.id, checkbox.id));
    document
      .getElementById("written5")
      .add(new Option(checkbox.id, checkbox.id));
  });
}

// calculate options
function calcoptions() {
  resetopts();
  calcwrittenoral1();
  calcwritten2();
  calcoral2();
  calcwritten3();
  calcoral3();
  calcwritten45();
}

// check fot duplicate written 4 & 5
function check45() {
  if (doc("written4").value === doc("written5").value) {
    doc("problemstep2").innerHTML +=
      `<p>Written options 4 and 5 are the same</p>`;
    return false;
  }
  return true;
}

// check for duplicates written oral
function checkoralwritten() {
  if (
    doc("oral3").value === doc("written4").value ||
    doc("oral3").value === doc("written5").value
  ) {
    const dupe = doc("oral3").value;
    doc("problemstep2").innerHTML += `<p>${dupe} can't be written and oral</p>`;
  }
}

// calculate the validity for next
function validityselect() {
  resetproblems();
  check45();
  checkoralwritten();
  if (doc("problemstep2").children.length === 0) {
    doc("next2").disabled = false;
  } else {
    doc("next2").disabled = true;
  }
}

// Back2 Btn
doc("back2").addEventListener("click", function () {
  resetproblems();
  resetopts();
  doc("next2").disabled = true;
});

// localStorage

// 6. S7 GRADES TABLE (SLIDE 3)

// Eventlistener 1
doc("next2").addEventListener("click", function () {
  resettable();
  addrows();
  //Debug
  console.log(document.querySelectorAll(".grinput").length);

  // Eventlistener 2
  document.querySelectorAll(".grinput").forEach((grinput) => {
    //debug
    console.log("listener added to", grinput.id);

    grinput.addEventListener("input", function () {
      //debug
      console.log("input event fired", grinput.id);
      validitytable();
    });
  });
});

function resettable() {
  doc("gradestable").innerHTML = `
    <tr id="header">
      <th><b>Subject</b></th>
      <th><b>A-Mark</b></th>
      <th><b>B-Mark</b></th>
      <th><b>Written</b></th>
      <th><b>Oral</b></th>
      <th><b>Final Note</b></th>
    </tr>
  `;
}

// a table with A, B, Written, Oral and its subject
function addrows() {
  document.querySelectorAll(".box:checked:not(#Religion)").forEach((box) => {
    doc("gradestable").insertAdjacentHTML(
      "beforeend",
      `
      <tr>
        <td>${box.id}</td>
        <td id="${box.id}amark">
          <input type="number" id="${box.id}amarkinput" class="amarkinput grinput" min="0" max="10" step="0.1">
        </td>
        <td id="${box.id}bmark">
          <input type="number" id="${box.id}bmarkinput" class="bmarkinput grinput" min="0" max="10" step="0.1">
        </td>
        <td id="${box.id}written"></td>
        <td id="${box.id}oral"></td>
        <td id="${box.id}final">0.00</td>
      </tr>
    `,
    );
  });
  document.querySelectorAll(".written").forEach((selectgr) => {
    doc(selectgr.value + "written").innerHTML =
      `<input type="number" id="${selectgr.value}writteninput" class="writteninput grinput" min="0" max="10" step="0.1">`;
  });
  document.querySelectorAll(".oral").forEach((selectgr) => {
    doc(selectgr.value + "oral").innerHTML =
      `<input type="number" id="${selectgr.value}oralinput" class="oralinput grinput" min="0" max="10" step="0.1">`;
  });
}

// validity all cells
function validitytable() {
  let empty = false;
  let outOfRange = false;

  document.querySelectorAll(".grinput").forEach((grinput) => {
    if (grinput.value === "") {
      empty = true;
    } else if (Number(grinput.value) < 0 || Number(grinput.value) > 10) {
      outOfRange = true;
    }
  });

  if (empty) {
    doc("tableproblem").innerHTML =
      `<p>Please input all grades in a valid format</p>`;
    doc("next3").disabled = true;
  } else if (outOfRange) {
    doc("tableproblem").innerHTML = `<p>Only input numbers 0.00 - 10.00</p>`;
    doc("next3").disabled = true;
  } else {
    doc("tableproblem").innerHTML = "";
    doc("next3").disabled = false;
  }
}

// localStorage

// 7. CALCULATE BAC (SLIDE 4)
// reference genereal calc: https://www.eursc.eu/BasicTexts/2015-05-D-12-de-50.pdf#page=15
// reference 2: https://www.eursc.eu/BasicTexts/2015-05-D-12-de-50.pdf#page=49
// C = Vornote (50%), E = Written BAC (35$), O = Oral BAC (15%)
// A = A-Note, B = B-Note

// Eventlistener
doc("next3").addEventListener("click", function () {});

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
