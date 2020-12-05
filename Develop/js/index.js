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
            console.log('View Department')
            nextQuestion('department')
        } else if (action === userActions[2]){
            console.log('View Role')
            nextQuestion('role')
        } else if (action === userActions[3]){
            console.log('View Employee')
            nextQuestion('employees')
        } else if (action === userActions[4]) {
            console.log('Edit Database')
            connection.end();
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
    let column = '';
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
            console.log(res.choice)
            initiateHome()
        })
    })
    
}