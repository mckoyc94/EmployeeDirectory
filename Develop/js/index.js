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
        console.log("Results: ", results.action)
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
    if (type === 'employee') {
        let name = answer.split(" ")
        let lastName = name[1]
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
                query = `DELETE FROM ${table} WHERE ${where} = "${answer}"`
                
                if (type === 'Employee'){
                    query = `DELETE FROM ${table} WHERE ${where} = "${lastName}"`
                }
                console.log(`${answer} was deleted from ${table}`)
                initiateHome()
            } else if (action === "Update"){
                updateEmployee()
            } else {
                initiateHome()
            }
        })
    })
}

const updateEmployee = () => {

}

const addtoDatabase = () => {
    inquirer.prompt({
        name: "adding",
        message: "What Database would you like to add to?",
        choices: ["Employees", "Department", "Role"],
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
                console.log(employee)
                
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
                connection.query(`INSERT INTO deparment (department) VALUES "${res.newDept}"`, (err, results) =>{
                    if (err) throw err;
                    console.log(`${res.newDept} added to Department table`)
                    initiateHome()
                })
            })
        } else {
            inquirer.prompt({

            })
        }

    })
}