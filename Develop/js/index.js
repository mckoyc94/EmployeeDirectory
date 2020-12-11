// Requirements
const inquirer = require('inquirer')
const mysql = require('mysql')
const table = require('console.table')

// Established Connection to MySQL
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "3lonAlum!aLps",
    database: "theRockClub"
});

// Starts Connection
connection.connect(err => {
      if(err) throw err;
      console.log("Welcome to the Rock Club Employee Directory!")
      // Starts App
      initiateHome()
})

//Initial Actions for User to Take
const userActions = ['View All Employees', 'View Department', 'View Role', 'View Specific Employee', 'Add to Database', 'Quit' ]

const initiateHome = () => {
    // Gives User options
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: userActions
    }).then(results => {
        let action = results.action
        
        //Sends User to next screen based off their choice
        if (action === userActions[0]) {
            viewAll()
        } else if (action === userActions[1]){
            nextQuestion('department')
        } else if (action === userActions[2]){
            nextQuestion('role')
        } else if (action === userActions[3]){
            nextQuestion('employees')
        } else if (action === userActions[4]) {
            console.log('Edit Database')
            addtoDatabase()
        } else {
            connection.end();
        }
    
    })
}

const viewAll = () => {
    let query = `SELECT e.id, e.first_name, e.last_name, title, department.department, CONCAT(m.first_name,' ', m.last_name) as "Manager" 
    FROM employees e
    INNER JOIN role ON role.id = e.role_id 
    INNER JOIN department ON department.id = role.department_id
    LEFT JOIN employees m ON e.manager_id = m.id`

    connection.query(query, (err, result) => {
        if (err) throw err;
        console.table(result)
        initiateHome()
    })
}

const nextQuestion = (view) => {
    let query = '';
    let list = '';
    if (view === 'department'){
        query = `SELECT department FROM ${view}`
        list = (answer) => {
            let choiceArr = []
            for (let i = 0; i < answer.length; i++){
                choiceArr.push(answer[i].department)
            }
            return choiceArr
        }
    } else if (view === 'role'){
        query = `SELECT title FROM ${view}`
        list = (answer) => {
            let choiceArr = []
            for (let i = 0; i < answer.length; i++){
                choiceArr.push(answer[i].title)
            }
            return choiceArr
        }
    } else {
        query = `SELECT first_name, last_name FROM ${view}`;
        view = 'employee';
        list = (answer) => {
            let choiceArr = []
            for (let i = 0; i < answer.length; i++){
                let firstName = answer[i].first_name
                let lastName = answer[i].last_name
                let employee = firstName + " " + lastName
                choiceArr.push(employee)
            }
            return choiceArr
        }
    }
    connection.query(query, (err, result) => {
        if (err) throw err;
        inquirer.prompt({
            name:"choice",
            type: "list",
            choices: list(result),
            message: `Which ${view} would you like to look at?`
        }).then(res => {
            answer = res.choice
            updateOrDelete(view, answer)
        })
    })
    
}

const updateOrDelete = (type, answer) => {
    let questions = []
    let chosenQuery = ""
    let table =""
    let where =""
    let lastName =""
    if (type === 'employee') {
        let name = answer.split(" ")
        lastName = name[1]
        table = "employees"
        where = "last_name"
        questions = ["Update", "Delete", "Home"]
        chosenQuery = `SELECT e.id, e.first_name, e.last_name, title, department.department, CONCAT(m.first_name,' ', m.last_name) as "Manager" 
        FROM employees e
        INNER JOIN role ON role.id = e.role_id 
        INNER JOIN department ON department.id = role.department_id
        LEFT JOIN employees m ON e.manager_id = m.id
        WHERE e.last_name = "${lastName}"`
    } else if (type === 'department') {
        table = type
        where = type
        questions = ["Delete", "Home"]
        chosenQuery = `SELECT e.id, e.first_name, e.last_name, title, department.department, CONCAT(m.first_name,' ', m.last_name) as "Manager" 
        FROM employees e
        INNER JOIN role ON role.id = e.role_id 
        INNER JOIN department ON department.id = role.department_id
        LEFT JOIN employees m ON e.manager_id = m.id
        WHERE ${where} = "${answer}"`
    } else {
        table = "role"
        where = "title"
        questions = ["Delete", "Home"]
        chosenQuery = `SELECT e.id, e.first_name, e.last_name, title, department.department, CONCAT(m.first_name,' ', m.last_name) as "Manager" 
        FROM employees e
        INNER JOIN role ON role.id = e.role_id 
        INNER JOIN department ON department.id = role.department_id
        LEFT JOIN employees m ON e.manager_id = m.id
        WHERE title = "${answer}"`
    }

    connection.query(chosenQuery, (err, results) => {
        if (err) console.log(err);
        console.table(results)
        
        inquirer.prompt({
            message: "What would you like to do?",
            type: "list",
            choices: questions,
            name: "nextStep"
        }).then(res => {
            let action = res.nextStep

            if (action === "Delete"){
                inquirer.prompt({
                    name: "confirm",
                    message: `This will permantly delete this ${type} and anything associated with it. Are you sure you want to proceed?`,
                    type: "confirm"
                }).then(choice => {
                    if (choice.confirm){
                        query = `DELETE FROM ${table} WHERE ${where} = "${answer}"`
                        
                        if (type === 'employee'){
                            query = `DELETE FROM ${table} WHERE ${where} = "${lastName}"`
                        }
                        connection.query(query, (err) =>{
                            if (err) throw err;
                            console.log(`${answer} was deleted from ${table}`)
                            console.log("query: ", query)
                            initiateHome()
                        })
                    } else {initiateHome()}
                })
            } else if (action === "Update"){
                console.log("last Name: ", lastName)
                updateEmployee(lastName)
            } else {
                initiateHome()
            }
        })
    })
}

const updateEmployee = (employee) => {
    connection.query(`SELECT * FROM employees WHERE last_name = "${employee}"`, (err, res) => {
        if (err) throw err;
        console.log(res)
        inquirer.prompt({
            name: "column",
            type: "list",
            message: "What would you like to change?",
            choices: ["First Name", "Last Name", "Position", "Nothing"]
        }).then(answer => {
            console.log("answer :", answer)
            console.log[answer.column]
            if (answer.column === "First Name"){
                inquirer.prompt({
                    name: "change",
                    type: "input"
                }).then(name => {
                    connection.query(`UPDATE employees SET first_name = "${name.change}" WHERE id = ${res[0].id}`, (err, cb) =>{
                        if (err) throw err;
                        console.log(`${res[0].first_name} ${res[0].last_name} has successfully changed name to ${name.change} ${res[0].last_name}`)
                        initiateHome()
                    })
                })
            } else if (answer.column === "Last Name"){
                inquirer.prompt({
                    name: "change",
                    type: "input"
                }).then(name => {
                    connection.query(`UPDATE employees SET last_name = "${name.change}" WHERE id = ${res[0].id}`, (err, cb) =>{
                        if (err) throw err;
                        console.log(`${res[0].first_name} ${res[0].last_name} has successfully changed name to ${res[0].first_name} ${name.change} `)
                        initiateHome()
                    })
                })
            } else if (answer.column === "Position"){
                connection.query(`SELECT * FROM role`, (err, result) => {
                    newArray = (answer) =>{
                        let choiceArr = []
                        for (let i = 0; i < answer.length; i++){
                            choiceArr.push(answer[i].title)
                        }
                        return choiceArr
                    } 
                    
                    let roleList = newArray(result)
                    
                    inquirer.prompt({
                        name: "change",
                        type: "list",
                        choices: roleList,
                        message: "What position would you like to change to?"
                    }).then(postition => {
                        let roleID = 1
                        for (let i = 0; i < result.length; i++ ){
                            if (postition.change === result[i].title){
                                roleID = result[i].id
                            }
                        }
                        
                        console.log("roleID :", roleID)
                        connection.query(`UPDATE employees SET role_id = ${roleID} `, err => {
                            if (err) throw err;
                            console.log(`${res[0].first_name} ${res[0].last_name} has successfully changed postition to ${postition.change}`)
                            initiateHome()
                        })
                    })
                })
            } else {initiateHome()}
        })
    })
}

const addtoDatabase = () => {
    inquirer.prompt({
        name: "adding",
        message: "What Database would you like to add to?",
        choices: ["Employees", "Department", "Role", "Back"],
        type: "list"
    }).then(res => {
        let answer = res.adding

        if (answer === "Employees"){
            let roleList = ""
            
            connection.query("SELECT title FROM role", (err, result) => {
                if (err) throw err ;
                roleList = (answer) =>{
                      let choiceArr = []
                      for (let i = 0; i < answer.length; i++){
                          choiceArr.push(answer[i].title)
                      }
                      return choiceArr
                }  
                
                inquirer.prompt([{
                    name: "firstName",
                    type: "input",
                    message: "First Name?"
                },{
                    name: "lastName",
                    type: "input",
                    message: "Last Name?"
                },{
                    name: "title",
                    type: "list",
                    choices: roleList(result),
                    message: "What is their position?"
                }, {
                    name: "manager",
                    type: "list",
                    choices: ["Jordan Pacheco", "Jenny Fryer", "Daniel Gruza", "Xavier Torriente"]
                }]).then(employee => {
                    let {firstName, lastName, manager} = employee
                    let managerName = manager.split(" ")
                    let managerLast = managerName[1]
                    firstName = firstName.trim()
                    lastName = lastName.trim()

                    connection.query(`Select * FROM role WHERE title = "${employee.title}"`, (err, role) => {
                        if (err) throw err;
                        let roleId =role[0].id
                        connection.query( `SELECT * FROM employees WHERE last_name = "${managerLast}"`, (err, manage) =>{
                            if (err) throw err;
                            let managerId = manage[0].id
                            connection.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", ${roleId}, ${managerId})`, (err, add) => {
                                if (err) throw err;
                                console.log(`${firstName} ${lastName} has been added to Employees table`)
                                initiateHome()
                            })
                        })
                    })
                })
            })
        } else if (answer === "Department"){
            inquirer.prompt({
                name: "newDept",
                type: "input",
                message: "What's the name of the new department?"
            }).then(res => {
                connection.query(`INSERT INTO department (department) VALUES ("${res.newDept}")`, (err, results) =>{
                    if (err) throw err;
                    console.log(`${res.newDept} added to Department table`)
                    initiateHome()
                })
            })
        } else if (answer === "Role"){           
            connection.query("SELECT department FROM department", (err, result) => {
                if (err) throw err ;
                deptList = (answer) =>{
                      let choiceArr = []
                      for (let i = 0; i < answer.length; i++){
                          choiceArr.push(answer[i].department)
                      }
                      return choiceArr
                }

                inquirer.prompt([{
                    name: "title",
                    type: "input",
                    message: "What's the name of the new role?"
                },{
                    name:"salary",
                    type: "number",
                    message: "How much do they make a year?"
                },{
                    name: "dept",
                    type: "list",
                    choices: deptList(result),
                    message: "What Department does it belong to?"
                }]).then(role => {
                    let {title, salary, dept} = role
                    connection.query(`SELECT * FROM department WHERE department = "${dept}"`, (err, dep) =>{
                        if (err) throw err;
                        let deptID = dep[0].id;
                        connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${title}","${salary}","${deptID}")`, (err, cb) =>{
                            if (err) throw err;
                            console.log(`${title} added to Role table`)
                            initiateHome()
                        })
                    })
                })
            })
        } else {initiateHome()}
        
    })
}