const Discord = require('discord.js');
const db = require('quick.db');


exports.run = async(client , message ,args)=> {

    db.delete(`numara.${message.guild.id}`);
  
  const embed = new Discord.MessageEmbed()
.addField("Başarıyla Sıfırlandı")
message.channel.send(embed)
};
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 3
  };
  
  exports.help = {
    name: 'ticket-sıfırla',
  };