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
            addtoDatabase()
        } else {
            connection.end();
        }
    
    })
}

//Shows User Table of All Employees with Roles and Depts
const viewAll = () => {
    //builds query to veiw all
    let query = `SELECT e.id, e.first_name, e.last_name, title, department.department, CONCAT(m.first_name,' ', m.last_name) as "Manager" 
    FROM employees e
    INNER JOIN role ON role.id = e.role_id 
    INNER JOIN department ON department.id = role.department_id
    LEFT JOIN employees m ON e.manager_id = m.id`

    //Returns table of Employees
    connection.query(query, (err, result) => {
        if (err) throw err;
        console.table(result)
        //Returns User to Main Screen
        initiateHome()
    })
}

//Shows User Specific table based on User choice
const nextQuestion = (view) => {
    //Creates global variables to be referenced later in function
    let query = '';
    let list = '';

    //Determines which query and list to display based on User's choice
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

    //Retrieves data from specified table
    connection.query(query, (err, result) => {
        if (err) throw err;
        //Returns list of options for User to choose next action
        inquirer.prompt({
            name:"choice",
            type: "list",
            choices: list(result),
            message: `Which ${view} would you like to look at?`
        }).then(res => {
            answer = res.choice
            //New Function passes values through
            updateOrDelete(view, answer)
        })
    })
    
}

// Prompts User with options to delete from database or update employee info
const updateOrDelete = (type, answer) => {
    // Global function variables
    let questions = []
    let chosenQuery = ""
    let table =""
    let where =""
    let lastName =""

    // Determines what values to use based off previous choices
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

    // Runs MySQL code to prompt User
    connection.query(chosenQuery, (err, results) => {
        if (err) console.log(err);
        // Shows User information they asked for
        console.table(results)
        
        // Offers User a chance to delete or update current item
        inquirer.prompt({
            message: "What would you like to do?",
            type: "list",
            choices: questions,
            name: "nextStep"
        }).then(res => {
            let action = res.nextStep

            // Runs action based off User answer
            if (action === "Delete"){
                // Informs User the delete is permanent and prompts for a confirm before executing code
                inquirer.prompt({
                    name: "confirm",
                    message: `This will permantly delete this ${type} and anything associated with it. Are you sure you want to proceed?`,
                    type: "confirm"
                }).then(choice => {
                    // runs Delete query to MySQL
                    if (choice.confirm){
                        query = `DELETE FROM ${table} WHERE ${where} = "${answer}"`
                        
                        if (type === 'employee'){
                            query = `DELETE FROM ${table} WHERE ${where} = "${lastName}"`
                        }
                        // Deletes Item and Returns to Main Page
                        connection.query(query, (err) =>{
                            if (err) throw err;
                            console.log(`${answer} was deleted from ${table}`)
                            console.log("query: ", query)
                            initiateHome()
                        })
                    // User aborts and is returned to Main Page
                    } else {initiateHome()}
                })
            // Passes values through to new function
            } else if (action === "Update"){
                console.log("last Name: ", lastName)
                updateEmployee(lastName)
            // Returns User to Main Page
            } else {
                initiateHome()
            }
        })
    })
}

// Takes in employee value and allows User to update specific section of Database
const updateEmployee = (employee) => {
    // Takes passed Value and looks up full employee information
    connection.query(`SELECT * FROM employees WHERE last_name = "${employee}"`, (err, res) => {
        if (err) throw err;
        // Asks User what should be changed
        inquirer.prompt({
            name: "column",
            type: "list",
            message: "What would you like to change?",
            choices: ["First Name", "Last Name", "Position", "Nothing"]
        }).then(answer => {
            //Updates First Name
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
            // Updates Last Name
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
            // Updates Position
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
                        connection.query(`UPDATE employees SET role_id = ${roleID} WHERE last_name = "${res[0].last_name}"`, err => {
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

// Allows User to add new information
const addtoDatabase = () => {
    // Prompts User to choose what table to add to
    inquirer.prompt({
        name: "adding",
        message: "What Database would you like to add to?",
        choices: ["Employees", "Department", "Role", "Back"],
        type: "list"
    }).then(res => {
        let answer = res.adding
        
        // Prompts User to add data about new entry 
        if (answer === "Employees"){
            let roleList = ""
            // Creates List of Roles to assign to employee
            connection.query("SELECT title FROM role", (err, result) => {
                if (err) throw err ;
                roleList = (answer) =>{
                      let choiceArr = []
                      for (let i = 0; i < answer.length; i++){
                          choiceArr.push(answer[i].title)
                      }
                      return choiceArr
                }  
                
                // Prompts User to input data
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
                    // Variables to Insert values into table
                    let {firstName, lastName, manager} = employee
                    let managerName = manager.split(" ")
                    let managerLast = managerName[1]
                    firstName = firstName.trim()
                    lastName = lastName.trim()

                    // Processes role_id from User choice
                    connection.query(`Select * FROM role WHERE title = "${employee.title}"`, (err, role) => {
                        if (err) throw err;
                        let roleId =role[0].id
                        // Processed manager_id from User choice
                        connection.query( `SELECT * FROM employees WHERE last_name = "${managerLast}"`, (err, manage) =>{
                            if (err) throw err;
                            let managerId = manage[0].id
                            // Adds Employee to Database and returns User to Main Page
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
            // Prompts User to add new department
            inquirer.prompt({
                name: "newDept",
                type: "input",
                message: "What's the name of the new department?"
            }).then(res => {
                // Inserts new department into database and returns User to Main Page
                connection.query(`INSERT INTO department (department) VALUES ("${res.newDept}")`, (err, results) =>{
                    if (err) throw err;
                    console.log(`${res.newDept} added to Department table`)
                    initiateHome()
                })
            })
        } else if (answer === "Role"){ 
            // Creates list of departments to assign to new role          
            connection.query("SELECT department FROM department", (err, result) => {
                if (err) throw err ;
                deptList = (answer) =>{
                      let choiceArr = []
                      for (let i = 0; i < answer.length; i++){
                          choiceArr.push(answer[i].department)
                      }
                      return choiceArr
                }

                // Prompts User to add a new role
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

                    // Processes department_id from User choice
                    connection.query(`SELECT * FROM department WHERE department = "${dept}"`, (err, dep) =>{
                        if (err) throw err;
                        let deptID = dep[0].id;

                        // Adds new role to database and returns User to Main Page
                        connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${title}","${salary}","${deptID}")`, (err, cb) =>{
                            if (err) throw err;
                            console.log(`${title} added to Role table`)
                            initiateHome()
                        })
                    })
                })
            })
        // Returns User to Main Page
        } else {initiateHome()}
        
    })
}