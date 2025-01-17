// Define a global array to store enemy IDs
let enemyIds = [];
const questions = {
    question1: "Is JavaScript a statically typed language?",
    answer1: "No",
    
    question2: "Does HTML stand for Hyper Text Markup Language?",
    answer2: "Yes",
    
    question3: "Is Python a compiled language?",
    answer3: "No",
    
    question4: "Does CSS stand for Cascading Style Sheets?",
    answer4: "Yes",
    
    question5: "Is Java primarily used for front-end web development?",
    answer5: "No",
    
    // Add more questions and answers as needed
};
//Enemy Values
var updateHealthEnemy = document.getElementById("EnemyHealth");
var updateHealth = document.getElementById("health");
var levelUpdate = document.getElementById("level");
var eHealth = 0;
var eAttack = 0;
var eDefense = 0;
let userLevel = 1;

// Add event listeners to the buttons
document.getElementById("move1").addEventListener("click", function() {
    Battle(5);
});
document.getElementById("move2").addEventListener("click", function() {
    Battle(15);
});
document.getElementById("move3").addEventListener("click", function() {
    Battle(25);
});
document.getElementById("move4").addEventListener("click", function() {
    Battle(45);
});
document.getElementById("run").addEventListener("click", Leave);

// Define global variables
let StartingHealth = 10;
let health = 10;

// Call the function to fetch enemies when the script is loaded
GetLevel();
GetEnemy();

function Question() {
    let random = Math.floor(Math.random() * 5);
    let answer = questions[`answer${random}`];
    let question = questions[`question${random}`];

    console.log("Question:", question);
    console.log("Answer:", answer);

    let response = prompt(question ? question.toLowerCase() : "Question not available");
    
    if (response === null || response === undefined) {
        console.log("Prompt cancelled or failed");
        return false; // or handle differently based on your requirements
    }

    if (response == answer) {
        return true;
    } else {
        return false;
    }
}

function Leave() {
    if (health < StartingHealth / 2) {
        alert("Running Away Failed");
    }
}

function GetEnemy() {
    // Fetch the Users Account Points First
    // Hard Coded Value for now
    console.log(userLevel);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        credentials: 'include',  // Include this line for cross-origin requests with credentials
        redirect: 'follow'
    };

    var api = "https://codemaxxers.stu.nighthawkcodingsociety.com/api/enemies"
    fetch(api, requestOptions)
    .then(response => response.json()) // Convert response to JSON format
    .then(result => {
        console.log(result); // Log the result for debugging purposes

        // Filter enemies based on user's level or lower
        let filteredEnemies = result.filter(enemy => parseInt(enemy.level) <= parseInt(userLevel));

        if (filteredEnemies.length > 0) {
            // Loop through filtered enemies to populate enemyIds array and update enemy health
            filteredEnemies.forEach(enemy => {
                enemyIds.push(enemy.id); // Add enemy ID to the array
            });

            // Get a random enemy ID from the enemyIds array
            let randomEnemyIndex = Math.floor(Math.random() * filteredEnemies.length);

            // Get the random enemy object
            let randomEnemy = filteredEnemies[randomEnemyIndex];

            // Updating Values depending on the fetched enemy
            eHealth = randomEnemy.health;
            eAttack = randomEnemy.attack;
            eDefense = randomEnemy.defense;

            updateHealthEnemy.innerHTML = `Enemy: ${eHealth}`;
        } else {
            console.log("No enemies found at or below user's level.");
        }
    })
    .catch(error => console.log('error', error));
}

function Battle(attack) {
    correct = Question();
    if (correct == true) {
        eHealth -= attack;
        updateHealthEnemy.innerHTML = `Enemy: ${eHealth}`;
    } else {
        health -= eAttack;
        updateHealth.innerHTML = `Player: ${health}`;
    }
    if (health <= 0) {
        window.location.href = "{{site.baseurl}}/islandmap";
    }
    if (eHealth <= 0) {
        
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };
        //Adding points to the account
        fetch("https://codemaxxers.stu.nighthawkcodingsociety.com/api/person/addPointsCSA?points=2", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
        //Re-direct to island
        window.location.href = "{{site.baseurl}}/islandmap";
        return;
    }
}

function GetLevel() {
  var requestOptions = {
    method: 'GET',
    mode: 'cors',
    cache: 'default',
    credentials: 'include',
  };

  fetch("https://codemaxxers.stu.nighthawkcodingsociety.com/api/person/jwt", requestOptions)
  //fetch("https://codemaxxers.stu.nighthawkcodingsociety.com/api/person/jwt", requestOptions)
    .then(response => {
            if (!response.ok) {
                const errorMsg = 'Login error: ' + response.status;
                console.log(errorMsg);

                switch (response.status) {
                    case 401:
                        alert("Please log into or make an account");
                        // window.location.href = "login";
                        break;
                    case 403:
                        alert("Access forbidden. You do not have permission to access this resource.");
                        break;
                    case 404:
                        alert("User not found. Please check your credentials.");
                        break;
                    // Add more cases for other status codes as needed
                    default:
                        alert("Login failed. Please try again later.");
                }

                return Promise.reject('Login failed');
            }
            return response.json();
            // Success!!!
        })
    .then(data => {
        userLevel = data.accountLevel; // Set the innerHTML to just the numeric value
        console.log(data.accountLevel);
        console.log(userLevel);
        levelUpdate.innerHTML = "Player Level:" + userLevel;
        return userLevel;
    })
    .catch(error => console.log('error', error));
}