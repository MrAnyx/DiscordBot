const Discord = require('discord.js') //on import le module Discord.js
const https = require('https')
const botConfig = require('./botConfig.json')//on import le fichier avec les tokens
const badWords = require('./badWords.json') //fichier json pour stocker les mots interdits
//ajouter un console.log pour toutes les commandes du bot
// ajouter l'api strawpoll pour faire des sondages directe avec le bot

//ajouter des fichier mp3 à lire avec une fonction .play
//ajouter la librairie ytdl-core pour lire les videos youtube en audio

const bot = new Discord.Client() // création du client discord

bot.on('ready', () =>{
  console.log('The bot is running')
})

bot.on('message', (message) => {
  var array = message.content.split(' ')//on split le message si il y a plusieurs arguments

  if(array[0] === '.filtre'){
    if(array[1] === 'on'){
      filtre = "on"
      console.log('Le filtre de langage a été activé');
    }
    else if(array[1] === 'off'){
      filtre = "off"
      console.log('Le filtre de langage a été desactivé');
    }
    else{
      message.channel.send('**La commande est incorrecte**')
    }
  }


  if(array[0] === '.ping'){ //si l'utilisateur écrit ".ping"
      message.reply('pong') // le bot répond pong
  }

  //ajouter des points de troll genre plus on se spam, plus on en a
  if(array[0] === '.troll'){ //si l'utilisateur écrit ".troll"
    for (var i = 0; i < array[1]; i++) {
      message.author.send('troll') //on lui envoye en DM "troll" n fois
      .then(console.log('messages envoyés'))
      .catch(console.error())
    }
  }

  if(array[0] === '.meteo'){
    https.get(`https://api.openweathermap.org/data/2.5/weather?appid=${meteo.id}&units=metric&q=`+array[1], (resp) =>{
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        message.delete()
        let meteo = JSON.parse(data)
        console.log(message.author.username + ' a cherché la météo à ' + array[1]);
        try {
          message.reply(`Il fait actuellement ${meteo.main.temp}°C à ${meteo.name} avec un taux d'humidité de ${meteo.main.humidity}%`)
        } catch (e) {
          message.reply("La ville n'a pas été trouvée on n'existe pas")
        }
      });

    }).on("error", (err) => {
      console.log("Erreur : " + err.message);
    });
  }

  if (message.content.startsWith('.dm ')) {
    mention = message.mentions.users.first()
    if(mention == null){return;}
    message.delete()
    mentionMessage = message.content.slice(3)
    mention.send(mentionMessage)
    console.log(`${message.author.username} a mentionné ${message.mentions.users.first().username} pour lui envoyer un DM"`);

  }

  if(array[0] === './/'){
    message.channel.send('/////////////////////////////////////////////////////////////////////////', {tts:true})
  }

  if(array[0] === '.avatar'){
    message.reply(message.author.avatarURL)
  }

  if(array[0] === '.purge'){
    if(isNaN(array[1])){message.channel.send('**Veuillez entrer un nombre de message(s) à purger**')}
    else if(array[1] > 1000){message.channel.send('**Entrez un nombre valide (<1000)**')}
    else {
      message.channel.bulkDelete(array[1])
      .then(message.channel.send(`**${array[1]} ont été supprimés du salon ${message.channel.name}**`))
      console.log(`${message.author.username} a supprimé ${array[1]} message(s)`);
    }
  }

  if(filtre === 'on'){
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < badWords.length; j++) {
        if(array[i].toLowerCase() === badWords[j]){
          console.log(`Le mot ${badWords[j]} a été cité par ${message.author.username}`);
          message.delete().then(message.reply(`**Un mot interdit a été cité dans votre message. Veuillez ne pas reproduire cet acte.**`))
        }
      }
    }
  }


});



bot.on('guildMemberAdd', (member) =>{ //envoye un message aux nouvelles personnes du serveur
  member.send(`Bienvenue ${member.displayName} dans le serveur de MrAnyx`)
  console.log(`${member.displayName} a rejoint le serveur`);
  console.log(member);
})


bot.on('ready', function() { //on dit que le bot joue a un jeu
  bot.user.setActivity('Mon créateur me maltraite')
  .then(console.log("L'avatar du Bot a été changé avec succès"))
  .catch(console.error())

})


bot.login(botConfig.id)
