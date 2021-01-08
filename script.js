"use strict"

/**
 * @typedef {Object} Settings
 * @property {Number} pomLength The pomodoro length in minutes
 * @property {Number} breakLength The break length in minutes
 * @property {Number} longBreakLength The long break length in minutes
 */


 /** 
  * @typedef {Object} User
  * @property {string} name
  * @property {Object.<string, Project>} projectsList
  * @property {Object} settings
  * @property {number} settings.pomLength
  * @property {number} settings.breakLength
  * @property {number} settings.longBreakLength
  */
/**
 * @typedef {Object.<string, Project>} ProjectsList
 */

/** Class to create a user */
class User {
    /**
     * Create a user 
     * @param {string} name 
     */
    constructor(name) {
        this.name = name;
        this.settings = Object.assign({}, defaultSettings);
        this.activeProject = new Project("unassigned");
        this.projectsList = {};
        this.projectsList["unassigned"] = this.activeProject;
        this.activePom = new Pomodoro(this.settings.pomLength, this.activeProject);
    }

    /**
     * Initialise and return a new Session Object
     * @return {Session}
     */
    newSession() {
        this.session = new Session(this);
        gui.updateDisplay();
        return this.session;
    }

    /**
     * Initialises a new Pomodoro with this.settings.pomLength and this.activeProject, 
     * sets it to this.activePom, and returns the Pomodoro 
     * @return {Pomodoro}
     */
    newPomodoro() {
        this.activePom = new Pomodoro(this.settings.pomLength, this.activeProject);
        gui.updateDisplay();
        @return this.activePom;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    getProjectCount() {
        return Object.keys(this.projectsList).length;
    }

    getProjectsList() {
        return this.projectsList;
    }

    getProjectFromName(projectName) {
        return this.projectsList[projectName];
    }

    getActiveProject() {
        return this.activeProject;
    }

    /** Sets this.activeProject and this.activePom.project to provided Project Object
     * @param {Project} project
     */
    setActiveProject(project) {
        this.activeProject = project;
        this.activePom.project = project;
        gui.updateDisplay();
    }

    getActivePom() {
        return this.activePom;
    }

    setActivePom(pomodoro) {
        this.activePom = pomodoro;
        gui.updateDisplay();
    }

    getSettings() {
        return this.settings;
    }

    setSettings(pomLength, breakLength, longBreakLength) {
        this.settings.pomLength = pomLength;
        this.settings.breakLength = breakLength;
        this.settings.longBreakLength = longBreakLength;
        gui.updateDisplay();
    }

    getPomLength() {
        return this.settings.pomLength;
    }

    setPomLength(pomLength) {
        this.settings.pomLength = pomLength;
        this.activePom.setLength(pomLength);
        gui.updateDisplay();
    }

    getBreakLength() {
        return this.settings.breakLength;
    }

    setBreakLength(breakLength) {
        this.settings.breakLength = breakLength;
        gui.updateDisplay();
    }

    getLongBreakLength() {
        return this.settings.longBreakLength;
    }

    setLongBreakLength(length) {
        this.settings.longBreakLength = length;
        gui.updateDisplay();
    }

    createNewProject = () => {
        let projectName = prompt("Name the project");
        let newProject;
        while (this.projectExists(projectName)) {
            projectName = prompt("Project already Exists. Pick another name.")
        }
        if (confirm(`Create new project: ${projectName}?`)) {
            newProject = new Project(projectName);
        }
        this.addProject(newProject);
        if (confirm(`Switch to ${newProject.getName()}?`)) {
            this.setActiveProject(newProject);
        }
        gui.updateDisplay();
        return newProject;
    }

    addProject(project) {
        this.projectsList[project.name] = project;
        gui.updateDisplay();
    }

    projectExists(projectName) {
        return projectName in this.projectsList;
    }
}


/**
 * A Session represents the current session from when the page loads, to when the user quits.
 * The session keeps track of the currently active project, loads and updates the users projects list and custom settings
 * The Session keeps track of all completed pomodoros and project progress.
 * @typedef {Object} Session
 * @property {Date} timestamp
 */

class Session {

    constructor(user) {
        this.user = user;
        this.timestamp = new Date();
        this.sessionPoms = [];
        gui.addEvents();
    }

    /**
     * Adds event listeners to GUI elements bound to user.activePom
     */

}

/**
 * The Skill class produces Skill Objects which represent a top level learning project which tracks ONLY the number 
 * of completed pomodoros and the overall skill level achieved. Skills can never be 'completed' as Projects can.
 * @class Skill
 * @param {string} name The name of the project
 * @param {number} level The level on this project (a level represents 40 completed pomodoros)
 * @param {number} pomCount The number of completed pomodoros from 0 - 40
 * @param {Array} pomsList An Object containing references to all completed pomodoros for this skill/project indexed by id
 * @param {Date} startDate The timestamp of the first pomodoro on this project
 * @example {
 * name: "Coding",
 * level: 1,
 * poms: 10
 * }
 */
class Skill {

    constructor(name, startDate = new Date(), level = 0, pomCount = 0, pomsList = [[]]) {
        this.name = name;
        this.startDate = startDate;
        this.level = level;
        this.pomCount = pomCount;
        this.pomsList = pomsList;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setLevel(level) {
        this.level = level;
    }

    getLevel() {
        return this.level;
    }

    levelUp() {
        alert(`${this.name} Level Up!!`)
        this.level += 1;
        gui.updateDisplay();
    }

    getPomCount() {
        return this.pomsList[this.level].length;
    }

    getWorkingPomsList() {
        return this.pomsList[this.level];
    }

    /**
     * Takes a completed Pomodoro object, sets Pomodoro.project to user.activeProject, 
     * and adds it to the projects Pomodoro list
     * @param {Pomodoro} pomodoro A pomodoro object  
     * @return {boolean} Returns true if successful
     */
    addPom(pomodoro) {
        if (pomodoro.isComplete() == false) return false;
        pomodoro.project = user.activeProject;
        let pomIndex = this.pomsList[this.level].push(pomodoro) - 1;
        this.pomCount = this.pomsList[this.level].length;
        pomodoro.setLocation(this.level, pomIndex)
        if (this.pomsList[this.level].length >= 40) {
            this.levelUp();
        }
        gui.updateDisplay();
        return true;
    }

    /**
     * Takes in a Level and an array index and removes the pomodoro at that position
     */
    removePom(level, index) {
        this.pomsList[level].splice(index, 1);
        this.pomCount = this.pomsList[level].length;
        gui.updateDisplay();
    }
}

/**
 * A Project is an Object inheriting from Skill representing a learning project which has a known point of completion. 
 * @class Project
 * @extends Skill
 * @param {string} name The name of the project
 * @param {number} level The level on this project (a level represents 40 completed pomodoros)
 * @param {number} poms The number of completed pomodoros from 0 - 40
 * @param {number} estimate The estimated time to complete the project
 * @param {boolean} completed True if Project is complete
 * @example {
 * name: "Coding",
 * level: 1,
 * poms: 10
 * }
 */
class Project extends Skill {

    constructor(name) {
        super(name);
    }

}

/**
 * A Pomodoro is an Object representing a countdown timer that counts down from a given length of time to 0 and 
 * then flags itself as complete. Each instance of a Pomodoro is associated with an instance of a Project.
 * A pomodoro should have 
 * @class Pomodoro 
 * @param {number} length The pomodoro length in minutes
 * @param {Project} project The associated Project Object
 * @param {Date} datestamp A datestamp of when the Pomodoro was first started
 * @param {number} remaining The time remaining on the pomodoro in ms
 * @param {boolean} complete True if the pomodoro is complete (the clock has reached 0)
 * @example {
 *  startTime: 1607970035642,
 *  project: {Project},
 *  length: 25,
 *  endTime: 1607970035642;
 *  remaining: 6000,
 *  completed: false,
 * }
 */
class Pomodoro {
    /**
     */
    constructor(length, started = false, completed = false, remaining = length * 60 * 1000) {
        this.length = length;
        this.started = started;
        this.completed = completed;
        this.remaining = remaining;
        this.location;
        this.startTime;
        this.timerId;
    }

    getLength() {
        return this.length;
    }

    setLength(mins) {
        this.length = mins;
        this.remaining = mins * 60 * 1000;
        gui.updateClockDisplay(this.remaining);
    }

    isStarted() {
        return this.started;
    }

    getStartTime() {
        return this.startTime;
    }

    isComplete() {
        return this.completed;
    }

    getRemaining() {
        return this.remaining;
    }

    setRemaining(ms) {
        this.remaining = ms;
    }

    setProject(project) {
        this.project = project;
    }

    getProject() {
        return this.project;
    }

    setLocation(level, index) {
        this.location = [level, index];
    }

    getLocation() {
        return this.location;
    }


    /**
     * Starts a countdown timer from pomodoro.length to 0, updates the clock display every second. 
     * Disables the start button
     * On completion runs pomodoro.complete()
     * Returns true if timer begun successfully
     * @return {Boolean}
     */
    start() {
        this.started = true;
        this.startTime = new Date();
        gui.start.setAttribute("disabled", true);
        function tick() {
            this.remaining -= 1000;
            gui.updateClockDisplay(this.remaining);
            if (this.remaining > 0) {
                this.timerId = setTimeout(tick, 1000);
            } else {
                this.complete();
            };
        }
        tick = tick.bind(this);
        this.timerId = setTimeout(tick, 1000);
    }

    /**
     * Stops the timer, re-enables the start button
     */
    stop() {
        clearTimeout(this.timerId);
        gui.start.removeAttribute("disabled");
    }

    /** Resets the timer to pomodoro.length */
    reset() {
        this.stop();
        this.remaining = this.length * 60000;
        this.started = false;
        gui.updateClockDisplay(this.remaining);
    }

    /**
     * Marks the pomodoro as complete then runs assign()
     * @return {Boolean} true if successful
     */
    complete() {
        this.stop();
        this.completed = true;
        this.project.addPom(this);
        user.newPomodoro();
        gui.updateDisplay();
    }

    reassign(projectName) {
        let oldProject = this.project;
        let newProject;
        this.project = newProject;
        return true;
    }

}



let defaultSettings = {
    pomLength: 25,
    breakLength: 5,
    longBreakLength: 15,
}


/* SET UP ENVIRONMENT */

let gui = {
    clock: document.getElementById('clock-display'),
    start: document.getElementById('start-button'),
    stop: document.getElementById('stop-button'),
    reset: document.getElementById('reset-button'),
    unassignedPoms: document.getElementById('unassigned-poms'),
    project: document.getElementById('project-display'),
    level: document.getElementById('level-display'),
    projectsList: document.getElementById('projects-list'),
    poms: document.getElementById('poms-display'),
    newProject: document.getElementById('new-project-button'),
    projectsDiv: document.getElementById('projects-div'),
    lengthInput: document.getElementById('pom-length-input'),
    breakInput: document.getElementById('break-length-input'),
    projectSelect: document.getElementById('project-select'),
    projectSelectDropdown: document.getElementById('project-select-dropdown'),

    addEvents: function () {
        this.start.addEventListener('click', () => user.activePom.start());
        this.stop.addEventListener('click', () => user.activePom.stop());
        this.reset.addEventListener('click', () => user.activePom.reset());
        this.newProject.addEventListener('click', user.createNewProject);
        //FIX ME
        function changeLengthInput() {
            user.setPomLength(this.value);
        }
        this.lengthInput.addEventListener('change', changeLengthInput);
        function changeProjectDropdown() {
            user.setActiveProject(user.getProjectFromName(this.value));
        }
        this.projectSelectDropdown.addEventListener('change', changeProjectDropdown);
    },

    updateClockDisplay: function (remaining) {
        this.clock.innerText = timeToString(remaining);
    },

    updateDisplay: function () {
        // ACTIVE PROJECT
        let activeProject = user.getActiveProject();
        activeProject.getName() == "unassigned" ? this.project.innerText = "No Project Selected" : this.project.innerText = activeProject.getName();
        this.level.innerText = `${activeProject.getName() == "unassigned" ? "" : " Level " + activeProject.getLevel()}`;
        while (this.poms.firstChild) {
            this.poms.removeChild(this.poms.firstChild);
        }
        for (let i = 0; i < activeProject.getPomCount(); i++) {
            let pomodoro = activeProject.getWorkingPomsList()[i];
            this.poms.appendChild(this.makeCrystal(pomodoro));
            if (i > 0 && i % 10 == 0) {
                let tens = document.createElement('span');
                tens.innerText = ' ' + p;
                this.poms.appendChild(tens);
            }
        }

        // TIMER
        this.lengthInput.value = user.getPomLength();
        this.breakInput.value = user.getBreakLength();

        // PROJECTS LIST
        while (this.projectsList.firstChild) {
            this.projectsList.removeChild(this.projectsList.firstChild);
        }
        // FIX ME:
        while (this.projectSelectDropdown.firstChild) {
            this.projectSelectDropdown.removeChild(this.projectSelectDropdown.firstChild);
        }
        for (let projectName in user.projectsList) {
            let project = user.getProjectFromName(projectName);
            let projectDiv = document.createElement('div');
            projectDiv.classList.add('project-div');
            let projectTitle = document.createElement('h3');
            projectTitle.innerText = project.name + ' Lvl ' + project.level;
            projectTitle.classList.add('project-title');
            projectDiv.appendChild(projectTitle);
            let pomsTable = document.createElement('table');
            let row = document.createElement('tr');
            for (let i = 0; i < 40; i++) {
                let cell = document.createElement('td');
                cell.classList.add('pom-cell');
                if (i < project.getPomCount()) cell.classList.add('filled');
                row.appendChild(cell);
            }
            pomsTable.appendChild(row);
            projectDiv.appendChild(pomsTable);
            this.projectsList.appendChild(projectDiv);

            // PROJECT DROPDOWN
            let option = document.createElement('option');
            option.value = project.getName();
            option.text = project.getName();
            if (user.getActiveProject().getName() == option.value) {
                option.setAttribute('selected', true);
            }
            this.projectSelectDropdown.add(option);
        }
        if (user.getProjectCount() == 0) {
            this.projectsDiv.classList.add('inactive');
            this.projectSelect.classList.add('inactive');
        } else {
            this.projectsDiv.classList.remove('inactive');
            this.projectSelect.classList.remove('inactive');
        }
        this.updateClockDisplay(user.activePom.remaining);
    },

    /**
     * Creates and returns a crystal HTML element which is clickable
     * clicking on the crystal runs a function to reassign it to a different project
     * @param {Pomodoro} pomodoro 
     * @return {Element} Returns a 
     */
    makeCrystal: function (pomodoro) {
        let crystal = document.createElement('i');
        crystal.classList.add('fa');
        crystal.classList.add('fa-diamond');
        const ariaHidden = document.createAttribute('aria-hidden');
        ariaHidden.value = "true";
        crystal.setAttributeNode(ariaHidden);
        crystal.pomodoro = pomodoro;
        crystal.addEventListener('click', this.reassignCrystal);
        return crystal;
    },

    reassignCrystal: function () {
        let oldProject = this.pomodoro.getProject();
        let newProject = user.createNewProject();
        /*         let newProjectName = prompt("Which Project?");
                if (user.projectExists(newProjectName)) {
                    newProject = user.getProjectsList()[newProjectName];
                } else {
                    newProject = user.addProject(newProjectName);
                } */
        oldProject.removePom(...this.pomodoro.getLocation());
        this.pomodoro.setProject(newProject);
        newProject.addPom(this.pomodoro);
        user.setActiveProject(newProject);
        gui.updateDisplay();
    }
}

/**
 * Takes in the time in minutes and returns a string formatted mm:ss 
 * @param {number} time The time in ms
 * @return {string} String formatted mm:ss
 */
function timeToString(time) {
    let minutes = Math.floor(time / 60000);
    let seconds = Math.floor((time / 1000) - (minutes * 60));
    /*         function minutes(timestamp) {
                return Math.floor(timestamp / 60000);
            }
            function seconds(timestamp) {
                return Math.floor(timestamp / 1000);
            } */
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

let user;
if (!user) {
    user = new User("anon");
}
let session = user.newSession();
gui.updateDisplay();
/* TESTS */
