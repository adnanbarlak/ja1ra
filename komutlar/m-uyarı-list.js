const Discord = require('discord.js');
const db = require('quick.db');


exports.run = async(client , message ,args)=> {
    let kullanıcı = message.mentions.members.first() || message.author;

let toplam = await db.fetch(`${message.guild.id}.uyarı.${kullanıcı.id}`);
let sebepler = await db.fetch(`${message.guild.id}.sebepler.${kullanıcı.id}`)
const embed = new Discord.MessageEmbed()
.setDescription(`
    **Toplam \`${toplam}\` uyarısı var !**
   \`Sebepler\`
    ${sebepler.map(e => e).join(" \n ")}
    `)

message.channel.send(embed)
};
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
  };
  
  exports.help = {
    name: 'uyarı-list',
  };