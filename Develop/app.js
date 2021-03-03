var Manager = require("./lib/Manager");
var Engineer = require("./lib/Engineer");
var Intern = require("./lib/Intern");
var inquirer = require("inquirer");
var path = require("path");
var fs = require("fs");

var OUTPUT_DIR = path.resolve(__dirname, "output");
var outputPath = path.join(OUTPUT_DIR, "team.html");

var render = require("./lib/htmlRenderer");

var teammates = [];

var questions = [
    {
        type: "input",
        name: "name",
        message: "Please enter employee name:"
    },
    {
        type: "input",
        name: "id",
        message: "Please enter employee ID number:"
    },
    {
        type: "input",
        name: "email",
        message: "Please enter employee e-mail address:"
    },
    {
        type: "list",
        name: "role",
        message: "What role does the employee play on the team?",
        choices: [{
            name: "Manager"
        },
        {
            name: "Engineer"
        },
        {
            name: "Intern"
        }]
    },
    {
        type: "input",
        name: "phoneNumber",
        message: "Please enter manager's phone number:",
        when: (answers) => {
            return answers.role === "Manager";
        }
    },
    {
        type: "input",
        name: "github",
        message: "Please enter engineer's github username:",
        when: (answers) => {
            return answers.role === "Engineer";
        }
    },
    {
        type: "input",
        name: "school",
        message: "What is the name of the school you're attending?",
        when: (answers) => {
            return answers.role === "Intern";
        }
    }
];
function promptUser() {

   inquirer.prompt(questions).then((response) => {
       if (response.role === "Manager") {
           const newManager = new Manager(response.name, response.id, response.email, response.phoneNumber);
           teammates.push(newManager);
       }
       else if (response.role === "Engineer") {
           const newEngineer = new Engineer(response.name, response.id, response.email, response.github);
           teammates.push(newEngineer);
       }
       else if (response.role === "Intern") {
           const newIntern = new Intern(response.name, response.id, response.email, response.school);
           teammates.push(newIntern);
       }
       newEmployee();
   });
};

function newEmployee() {
    inquirer.prompt([
        {
            type:"confirm",
            name:"newEmployee",
            message:"Would you like to add another employee?",
            default:true
        }
    ]).then((answers) => {
        if (answers.newEmployee) {
            promptUser();
        }
        else {
            const html = render(teammates);
            fs.writeFile(outputPath, html, (err) => {
                if (err) throw err;
            })
        }
    })
}

promptUser();