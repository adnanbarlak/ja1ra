const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const moment = require('moment');
var Jimp = require('jimp');
const { Client, Util } = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const http = require('http');
const express = require('express');
require('./util/eventLoader.js')(client);
const path = require('path');
const snekfetch = require('snekfetch');

const app = express();

var prefix = ayarlar.prefix;

const log = message => {
    console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);

//---------------------------------KOMUTLAR---------------------------------\\


//------------yeni mute sistemi gelişmiş ----------------//

////DATABASE
const qdb = require('quick.db');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const sunucuadapter = new FileSync('./database/systems.json')

const sdb = low(sunucuadapter)

  sdb.defaults({mute: [], ban: [], kufurEngel: [], autorole: [], reklamEngel: [], security: [], counter: []})
  .write()

  sdb.read()
  
////////DATABASE-UPDATER
/*
client.on("message", async msg => {
  if(!msg.guild) return;
  
  db.add(`mesajsayi_${msg.author.id}`, 1);
});
*/
setInterval(function(){  
  sdb.read()
 },1000);


 client.on('ready', async () => {
  client.guilds.cache.forEach(async guild => {
  guild.members.cache.forEach(async member => {
  
    sdb.read()
    var muteverisi = sdb.get('mute').find({guild: guild.id, user: member.id}).value()
  
    if(muteverisi) {
      var mutebitiszamani = muteverisi.finishtime
      var mutekanali = muteverisi.channel
    } else {
      var mutebitiszamani = null;
      var mutekanali = null;
    }
  const ainterval = setInterval(async function(){
    sdb.read()
  if(mutebitiszamani && mutebitiszamani !== null && mutebitiszamani !== "INFINITY") {
    if(mutebitiszamani <= Date.now()) {
      clearInterval(ainterval)
      var muterole1 = qdb.fetch(`muteroluid_${guild.id}`);
      var muterole2 = guild.roles.cache.find(r => r.id === muterole1);
      if(member.roles.cache.has(muterole2.id)) await member.roles.remove(muterole2.id);
      var mutekanali2 = guild.channels.cache.find(c => c.id === mutekanali);
      if(mutekanali2) mutekanali2.send(`${member} Susturulması Açıldı!`)
      sdb.get('mute').remove(sdb.get('mute').find({guild: guild.id, user: member.id}).value()).write()   
    }
  }
  }, 6000)
      })
    })
  });


///////////--müzik---------



/////////---seviye------------///

client.on("message", async message => {
  let prefix = ayarlar.prefix;

  var id = message.author.id;
  var gid = message.guild.id;

  let hm = await db.fetch(`seviyeacik_${gid}`);
  let kanal = await db.fetch(`svlog_${gid}`);
  let xps = await db.fetch(`verilecekxp_${gid}`);
  let seviyerol = await db.fetch(`svrol_${gid}`);
  let rollvl = await db.fetch(`rollevel_${gid}`);

  if (!hm) return;
  if (message.content.startsWith(prefix)) return;
  if (message.author.bot) return;

  var xp = await db.fetch(`xp_${id}_${gid}`);
  var lvl = await db.fetch(`lvl_${id}_${gid}`);
  var xpToLvl = await db.fetch(`xpToLvl_${id}_${gid}`);

  if (!lvl) {
  
    if (xps) {
      db.set(`xp_${id}_${gid}`, xps);
    }
    db.set(`xp_${id}_${gid}`, 4);
    db.set(`lvl_${id}_${gid}`, 1);
    db.set(`xpToLvl_${id}_${gid}`, 100);
  } else {
    if (xps) {
      db.add(`xp_${id}_${gid}`, xps);
    }
    db.add(`xp_${id}_${gid}`, 4);

    if (xp > xpToLvl) {
      db.add(`lvl_${id}_${gid}`, 1);
      db.add(
        `xpToLvl_${id}_${gid}`,
        (await db.fetch(`lvl_${id}_${gid}`)) * 100
      );
      if (kanal) {
        client.channels.cache
          .get(kanal.id)
          .send(
            message.member.user.username +
              "** Seviye Atladı! Yeni seviyesi; `" +
              lvl +
              "` Tebrikler! :tada: **"
          );

  
      }
 
    }

    if (seviyerol) {
      if (lvl >= rollvl) {
        message.guild.member(message.author.id).roles.add(seviyerol);
        if (kanal) {
          client.channels.cache
            .get(kanal.id)
            .send(
              message.member.user.username +
                "** Seviyesi **" +
                rollvl +
                "** e ulaştı ve " +
                seviyerol +
                " Rolünü kazandı! :tada: **"
            );
        }
      }
    }
  }


});



///-----------otorol-------------///
client.on("guildMemberAdd", async member => {
  let rol = await db.fetch(`otorol_${member.guild.id}`)
  let kanal = await db.fetch(`otokanal_${member.guild.id}`)
  let mesaj = await db.fetch(`otomesaj_${member.guild.id}`)
  if(!rol){
    return
  }
member.roles.add(rol);
  
  
  if(!mesaj) return client.channels.cache.get(kanal).send('Başarıyla Rol Verildi',`${member.use}`,'Aramıza Hoşgeldin Can')
  if (mesaj) {
    var mesajs = mesaj.replace("-uye-", `${member.user}`).replace("-uyetag-", `${member.user.tag}`).replace("-rol-", `${member.guild.roles.cache.get(rol).name}`).replace("-server-", `${member.guild.name}`).replace("-uyesayisi-", `${member.guild.memberCount}`).replace("-botsayisi-", `${member.guild.members.cache.filter(m => m.user.bot).size}`).replace("-bolge-", `${member.guild.region}`).replace("-kanalsayisi-", `${member.guild.channels.size}`);
  
    return client.channels.cache.get(kanal).send(mesajs);
     }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === '!facebook') {
    msg.reply('**Sanırım Bunu Arıyorsun Dostum** https://www.facebook.com/BurakOyunda/');
  }
   if (msg.content.toLowerCase() === '!youtube') {
    msg.reply('**Sanırım Bunu Arıyorsun Dostum** https://www.youtube.com/user/MultiRawen');
  }
  if (msg.content.toLowerCase() === '!yt') {
    msg.reply('**Sanırım Bunu Arıyorsun Dostum** https://www.youtube.com/user/MultiRawen');
  }
  if (msg.content.toLowerCase() === '!discord') {
    msg.reply('**Sanırım Bunu Arıyorsun Dostum** https://discord.gg/burakoyunda');
  }
   if (msg.content.toLowerCase() === '!dc') {
    msg.reply('**Sanırım Bunu Arıyorsun Dostum** https://discord.gg/burakoyunda');
  }
  if (msg.content.toLowerCase() === '!younow') {
    msg.reply('**Sanırım Bunu Arıyorsun Dostum** https://www.younow.com/burakoyundavr');
  }
});