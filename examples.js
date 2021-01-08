// Data Examples

/**
 * @type Skill
 */
let unassigned = {
    name: "unassigned",
    level: 0,
    pomCount: 0,
    pomsList: [pom1, pom2],
    startDate: Date.now(),
}

/**
@type Skill
*/
let coding = {
    name: "Coding",
    level: 0,
    pomCount: 0,
    pomsList: [pom3, pom4],
}

/**
@type Session
*/
let session = {
    timestamp: new Date(),
    projectsList: {
        unassigned: unassigned,
        coding: coding, 
    },
    activeProject: coding,
    pomLength: 25,
    currentPom: currentPom,
}
/** 
@type Pomodoro
*/
let pom1 = {
    length: 25,
    project: unassigned,

}