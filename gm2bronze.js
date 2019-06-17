const fs = require('fs')
const path = require('path');
const heroprotocol = require('./heroprotocol-node/');

console.log(heroprotocol)

function copyLosses(losses) {
  losses.forEach((file) => {
    console.log(file)
    fs.copyFileSync(file, path.join('./losers', path.basename(file)))
  })
}

async function findLosers(dir) {
  let replays = fs.readdirSync(dir).filter((file) => {
    return file.includes('StormReplay')
  }).map((file) => {
    return path.join(dir, file)
  })

  let losses = []

  for (var i = 0; i < replays.length; i++) {
    const replay = replays[i]
    console.log(replay)
    const report = await heroprotocol.details(replay)
    const players = report.details.m_playerList
    players.forEach((player) => {
      if (player.m_name === 'EasonG' && player.m_result === 2) {
        losses.push(replay)
      }
    })
  }

  console.log(losses)
  fs.writeFileSync('./losses.json', JSON.stringify(losses))
  copyLosses(losses)

  
}

findLosers(process.argv[2])