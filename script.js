"use strict"

/**
 * A Pomodoro is an object with properties: datestamp, project, length, clock, complete
 * @typedef {Object} Pomodoro
 * @property {Date} datestamp A datestamp
 * @property {Project} project The associated Project Object
 * @property {number} length The pomodoro length in minutes
 * @property {number} clock The time remaining on the pomodoro in ms
 * @property {boolean} complete True if clock is 0
 * @example {
 *  datestamp: 1607970035642,
 *  project: {Project},
 *  length: 25,
 *  elapsed: 0,
 *  complete: false,
 * }
 */
class Pomodoro {

    constructor(length, project) {
        this.project = project;
        this.datestamp = new Date();
        this.length = new Date(length * 60 * 1000);
        this.clock = new Date(length * 60 * 1000);
        this.complete = false;
    }

    clockToString() {
        return `${this.clock.getMinutes() < 10 ? "0" : ""}${this.clock.getMinutes()}:${this.clock.getSeconds() < 10 ? "0" : ""}${this.clock.getSeconds()}`;
    }

    isComplete() {
        return this.complete;
    }

    updateDisplay() {
        clockDisplay.innerText = `${this.clock.getMinutes() < 10 ? "0" : ""}${this.clock.getMinutes()}:${this.clock.getSeconds() < 10 ? "0" : ""}${this.clock.getSeconds()}`;
    }

    resetTimer() {
        this.clock = this.length;
        this.updateDisplay();
    }

    startTimer() {
        this.timer = setInterval(() => this.updateClock(), 1000);
    }

    stopTimer() {
        clearInterval(this.timer);
    }

    completeTimer() {
        clearInterval(this.timer);
        this.complete = true;
        this.project.addPom();
    }

    updateClock() {
        this.clock.setTime(this.clock.getTime() - 1000)
        if (this.clock <= 0) {
            this.completeTimer();
        }
        this.updateDisplay();
    }
}

/**
 * A Project is an object with properties: name, level, poms
 * @typedef {Object} Project
 * @property {string} name
 * @property {number} level
 * @property {number} poms
 * @example {
 * name: "Coding",
 * level: 1,
 * poms: 10
 * }
 */
class Project {

    constructor(name) {
        this.name = name;
        this.level = 1;
        this.poms = 39;
    }

    setLevel(level) {
        this.level = n;
    }

    getLevel() {
        return this.level;
    }

    setPoms(poms) {
        this.poms = n;
    }

    getPoms() {
        return this.poms;
    }

    addPom() {
        this.poms += 1;
        if (this.poms >= 40) {
            this.levelUp();
            this.poms = 0;
        }
        this.updateDisplay();
    }

    updateDisplay() {
        displayProject.innerText = currentProject.name + ' Lvl ' + currentProject.level;
        displayPoms.innerText = 'Poms: ' + currentProject.poms;
        clockDisplay.innerText = currentPom.clockToString();
    }

    levelUp() {
        this.level += 1;
    }

    workOnProject() {
        let pom = new Pomodoro(pomLength);
        if (pom.startTimer()) {
            this.addPom();
            updateDisplay();
        };
    }
}





/* SET UP ENVIRONMENT */

let displayProject = document.getElementById('display-project');
let displayPoms = document.getElementById('display-poms');
let clockDisplay = document.getElementById('clock-display');
let startButton = document.getElementById('start-button');
let stopButton = document.getElementById('stop-button');
let resetButton = document.getElementById('reset-button');
let workButton = document.getElementById('work-button');

let currentProject = new Project("Coding");
let pomLength = 0.1;
let currentPom = new Pomodoro(pomLength, currentProject);

let startTimer = currentPom.startTimer.bind(currentPom);
let stopTimer = currentPom.stopTimer.bind(currentPom);
let resetTimer = currentPom.resetTimer.bind(currentPom);

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

currentProject.updateDisplay();

/* TESTS */

function testProject() {
    let test = new Project("test");
    let currentProject = test;
    let pomLength = { minutes: 0, seconds: 10 };
    updateDisplay();
}

function testAnonPom() {
    pom = new Pomodoro(10);
}