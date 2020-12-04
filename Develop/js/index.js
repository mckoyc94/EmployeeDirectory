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

const initiateHome = () => {
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: ['Veiw All Employees', 'Veiw Employees by Department', 'Veiw Employees by Role', 'Veiw Employees by Manager', 'Add to Database', 'Quit' ]
    }).then(results => {
        console.log("Results: ", results )
    })
}