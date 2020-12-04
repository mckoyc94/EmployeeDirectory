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
            console.log('View All')
            initiateHome()
        } else if (action === userActions[1]){
            console.log('View Department')
            initiateHome()
        } else if (action === userActions[2]){
            console.log('View Role')
            initiateHome()
        } else if (action === userActions[3]){
            console.log('View Employee')
            initiateHome()
        } else if (action === userActions[4]) {
            console.log('Edit Database')
            connection.end();
        } else {
            connection.end();
        }
    
    })
}

const viewAll = () => {
    let query = 'SELECT * FROM employees'
}