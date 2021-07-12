async function post(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

let timer = 10;
let score = 0;
let game = false;

function resetAll() {
  document.getElementById('info').style.display = 'inline-block';
  document.getElementById('clickButton').style.display = 'inline-block';
  document.getElementById('leaderboard').style.display = 'none';
  document.getElementById('clickButton').style.top = '50%';
  document.getElementById('clickButton').style.left = '50%';

  timer = 10;
  score = 0;
  game = false;

  updateTime(timer);
  updateScore(score);
}

function startGame() {
  resetAll();
  game = true;
  document.getElementById('info').style.display = 'none';
  let checkTime = setInterval(() => { 
    updateTime(--timer);
    if (timer <= 0) {
      clearInterval(checkTime);
      endGame();
    }
  }, 1000);
}

async function endGame() {
  game = false;
  await getScores();
  document.getElementById('total').innerHTML = `Your Score: ${score}`;
  document.getElementById('clickButton').style.display = 'none';
  document.getElementById('leaderboard').style.display = 'inline-block';
}

function updateButton(x, y) {
  document.getElementById('clickButton').style.top = `${y}%`;
  document.getElementById('clickButton').style.left = `${x}%`;
}

function updateScore(score) {
  document.getElementById('points').innerHTML = `Score: ${score}`;
}

function updateTime(time) {
  document.getElementById('time').innerHTML = `Time: ${time}`;
}

async function getRandom() {
  post('http://localhost:1337/', { command: 'random' })
  .then(data => {
    console.log(data); // JSON data parsed by `data.json()` call
    if (!game) {
      startGame();
      updateScore(++score);
      updateButton(data.x, data.y);
    } else {
      updateScore(++score);
      updateButton(data.x, data.y);
    }
  });
}

async function submitScore() {
  let name = document.getElementById('name').value;
  post('http://localhost:1337/', { command: 'submit', name: name, score: score })
  .then(data => {
    console.log(data); // JSON data parsed by `data.json()` call
    resetAll();
  });
}

async function getScores() {
  post('http://localhost:1337/', { command: 'getscore' })
  .then(data => {
    console.log(data); // JSON data parsed by `data.json()` call

    let leaderboard = document.getElementById('leaderboardList');
    leaderboard.innerHTML = "";

    for (let i = 0; i < 5; i++) {
      if(data.hasOwnProperty(i)){
        let place = i.toString();
        const newList = document.createElement('li');
        newList.innerHTML = `${data[place].name}: ${data[place].score} [${data[place].date}]`;

        leaderboard.appendChild(newList);
      }
    }
  });
}
