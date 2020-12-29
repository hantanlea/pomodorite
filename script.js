"use strict"

/**
 * A PomsList is an Object containing Pomodoro Objects indexed by their timestamp
 * @typedef {Object.<number, Pomodoro>} PomsList
 */

/**
 * A Skill is an Object representing a top level learning project which tracks ONLY the number of completed pomodoros and the overall
 * skill level achieved. Skills can never be 'completed' as Projects can.
 * @class Skill
 * @param {string} name The name of the project
 * @param {Session} session The Session object
 * @param {number} level The level on this project (a level represents 40 completed pomodoros)
 * @param {number} pomCount The number of completed pomodoros from 0 - 40
 * @param {PomsList} pomsList An Object containing references to all completed pomodoros for this skill/project indexed by id
 * @param {Date} startDate The timestamp of the first pomodoro on this project
 * @example {
 * name: "Coding",
 * level: 1,
 * poms: 10
 * }
 */
class Skill {

    constructor(name, session, level = 0, pomCount = 0, pomsList = {}) {
        this.name = name;
        this.session = session;
        this.level = level;
        this.pomCount = pomCount;
        this.pomsList = pomsList
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
    }

    setPoms(poms) {
        this.poms = poms;
    }

    getPoms() {
        return this.poms;
    }

    /**
     * Takes a completed Pomodoro object and adds it to the projects Pomodoro list and increments projects pomodoro count
     * @param {Pomodoro} pomodoro A pomodoro object  
     * @return {Undefined}
     */
    addPom(pomodoro) {
        if (pomodoro.isComplete == false) return;
        this.pomsList[pomodoro.timestamp] = pomodoro;
        this.pomCount += 1;
        this.startDate = pomodoro.getStartTime();
        if (this.pomCount >= 40) {
            this.levelUp();
            this.pomCount = 0;
        }
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
 * @param {Session} session The session Object
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
    constructor(length, project, session, started = false, completed = false, remaining = length * 60 * 1000) {
        this.length = length;
        this.session = session;
        this.project = project;
        this.started = started;
        this.completed = completed;
        this.remaining = remaining;
        this.startTime;
        this.timerId;
    }

    getLength() {
        return this.length;
    }

    setLength(length) {
        this.length = length;
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

    setRemaining(timestamp) {
        this.remaining = timestamp;
    }

    setLength(length) {
        this.length = length;
    }

    getLength() {
        return this.length;
    }

    setProject(project) {
        this.project = project;
    }

    getProject() {
        return this.project;
    }

    updateDisplay() {
        display.clock.innerText = display.timeToString(this.remaining);
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
        display.start.setAttribute("disabled", true);
        function tick() {
            this.remaining -= 1000;    
            this.updateDisplay();
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
        display.start.removeAttribute("disabled");
    }

    /** Resets the timer to pomodoro.length */
    reset() {
        this.stop();
        this.remaining = this.length * 60000;
        this.updateDisplay();
    }

    /**
     * Marks the pomodoro as complete then runs assign()
     * @return {Boolean} true if successful
     */
    complete() {
        this.stop();
        if (session.currentPom != this) { 
            alert('This pom is not session.currentPom');
            return false;
        } else if (session.activeProject != this.project) {
            alert(`This pom is attached to project: ${this.project} not session.activeProject: ${this.session.activeProject.name}`)
            return false;
        }
        this.completed = true;
        this.assign(this.project);
    }

    assign(project) {
        if (project.name == "unassigned") {
            let crystal = display.makeCrystal();
            let assignCrystal = () => this.clickCrystal.call(this, crystal);
            crystal.addEventListener('click', assignCrystal);
            display.unassignedPoms.appendChild(crystal);
        } else {
            project.addPom(this);
            this.session.nextPomodoro();
        }
        return true;
    }

    clickCrystal(crystal) {
        let projectName = prompt("Which Project?");
        if (session.projectExists(projectName)) {
            this.project.addPom(this);
        } else {
            let newProject = session.addProject(projectName);
            this.project = newProject;
            if (newProject) {
                newProject.addPom(this);
            }
        }
        crystal.parentNode.removeChild(crystal);
        this.session.nextPomodoro();
    }

}



/**
 * A Session represents the current session from when the page loads, to when the user quits.
 * The session keeps track of the currently active project, loads and updates the users projects list and custom settings
 * The Session keeps track of all completed pomodoros and project progress.
 * @typedef {Object} Session
 * @property {Date} timestamp
 * @property {Object} projectsList
 * @property {Project} activeProject
 * @property {number} pomLength
 * @property {Pomodoro} currentPom
 * @example {
 * timestamp: 1607970035642,
 * projectsList: {Coding: Project},
 * activeProject: {Project},
 * pomLength: 25,
 * currentPom: {Pomodoro}, }
 */

class Session {

    constructor() {

        this.projectsList = {};
        this.activeProject = new Project("unassigned", this);
        this.activeProject = new Project("Coding");
        this.activeProject.pomCount = 39;
        this.projectsList[this.activeProject.name] = this.activeProject;
        this.pomLength = 0.1;
        this.currentPom = new Pomodoro(this.pomLength, this.activeProject, this);
        this.assignButtons();
        this.updateDisplay();
    }

    assignButtons() {
        display.start.addEventListener('click', () => this.currentPom.start.call(this.currentPom));
        display.stop.addEventListener('click', () => this.currentPom.stop.call(this.currentPom));
        display.reset.addEventListener('click', () => this.currentPom.reset.call(this.currentPom));
        display.changeProject.addEventListener('click', () => this.changeProject.call(this));
    }

    updateDisplay() {
        display.project.innerText = this.activeProject.name 
        display.level.innerText = `${this.activeProject.name == "unassigned" ? "" : " Level " + this.activeProject.level}`;
        while (display.poms.firstChild) {
            display.poms.removeChild(display.poms.firstChild);
        }
        for (let i = 1; i <= this.activeProject.pomCount; i++) {
            display.poms.appendChild(display.makeCrystal());
            
            if (i > 0 && i % 10 == 0) {
                let tens = document.createElement('span');
                tens.innerText = ' ' + i;
                display.poms.appendChild(tens);
            }
        }
        while (display.projectsList.firstChild) {
            display.projectsList.removeChild(display.projectsList.firstChild);
        }
        for (let projectName in this.projectsList) {
            if (projectName == "unassigned") continue;
            let project = this.projectsList[projectName];
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
                if (i < project.pomCount) cell.classList.add('filled');
                row.appendChild(cell);
            } 
            pomsTable.appendChild(row);
            projectDiv.appendChild(pomsTable);
/*             let pomsDiv = document.createElement('div');
            pomsDiv.classList.add('poms-div');
            for (let i = 0; i < project.pomCount; i++) {
                let crystal = display.makeCrystal();
                pomsDiv.appendChild(crystal);
            } */
            display.projectsList.appendChild(projectDiv);
        }
        this.currentPom.updateDisplay();
    }

    nextPomodoro() {
        if (this.currentPom) this.activeProject = this.currentPom.project;
        this.currentPom = new Pomodoro(this.pomLength, this.activeProject, this);
        this.updateDisplay();
    }

    projectExists(project) {
        return project.name in this.projectsList;
    }

    changeProject(project) {
        if (!project) {
            let projectName = prompt("Which Project?");
            if (this.projectExists(projectName)) {
                project = this.projectsList[projectName];
            } else {
                project = session.addProject(projectName);
            }
        }
        this.activeProject = project;
        this.currentPom.setProject(project);
        this.updateDisplay();
    }

    addProject(projectName) {
        if (confirm(`Create new project: ${projectName}?`)) {
            let newProject = new Project(projectName);
            this.projectsList[newProject.name] = newProject;
            return newProject;
        } else {
            return false;
        }
    }



    /*     startPomodoro() {
            this.currentPom.start();
            function tick() {
                this.currentPom.setRemaining(this.currentPom.getRemaining() - 1000);    
                if (this.currentPom.getRemaining() > 0) {
                    timerId = setTimeout(tick, 1000);
                } else {
                    clearTimeout(timerId);
                    this.completePomodoro();
                };
                display.clock.innerText = display.timeToString(this.currentPom.getRemaining());
            }
            tick = tick.bind(this);
            let timerId = setTimeout(tick, 1000);
    
        } */

    /*     completePomodoro() {
            this.currentPom.markComplete();
            display.unassignedPoms.appendChild(this.crystal());
            let assignPom = this.assignPomodoro.bind(this);
            crystal.addEventListener('click', assignPom);
            crystal.addEventListener('click', () => display.unassignedPoms.removeChild(crystal));
            this.activeProject.addPom();
        } */

}

class User {

}





/* SET UP ENVIRONMENT */

let display = {
    clock: document.getElementById('clock-display'),
    start: document.getElementById('start-button'),
    stop: document.getElementById('stop-button'),
    reset: document.getElementById('reset-button'),
    unassignedPoms: document.getElementById('unassigned-poms'),
    project: document.getElementById('project-display'),
    level: document.getElementById('level-display'),
    projectsList: document.getElementById('projects-list'),
    poms: document.getElementById('poms-display'),
    changeProject: document.getElementById('change-project-button'),

    /**
     * Takes in the time in minutes and returns a string formatted mm:ss 
     * @param {number} time The time in ms
     * @return {string} String formatted mm:ss
     */
    timeToString: function (time) {
        let minutes = Math.floor(time / 60000);
        let seconds = Math.floor((time / 1000) - (minutes * 60));
        /*         function minutes(timestamp) {
                    return Math.floor(timestamp / 60000);
                }
                function seconds(timestamp) {
                    return Math.floor(timestamp / 1000);
                } */
        return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    },

    makeCrystal: function () {
        let crystal = document.createElement('i');
        crystal.classList.add('fa');
        crystal.classList.add('fa-diamond');
        const ariaHidden = document.createAttribute('aria-hidden');
        ariaHidden.value = "true";
        crystal.setAttributeNode(ariaHidden);
        return crystal;
    },


}

let session = new Session();



/* TESTS */
