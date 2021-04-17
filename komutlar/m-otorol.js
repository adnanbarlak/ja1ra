const Discord = require("discord.js")
const db = require("quick.db");

exports.run = (client, message, args) => {
    let komut = args[0]
  let byhackrol = args[1]
  
  const byhack2 = new Discord.MessageEmbed()
  .setDescription("Otorol " +byhackrol+ " Olarak Ayarlandı")
  const byhack1 = new Discord.MessageEmbed()
  .setDescription(`
  **Otorol Ayarlamak İçin " b!otorol ayarla @rol"
  
  Otorol Sıfırlamak İçin " b!otorol sıfırla"
  
  Otorol Mesajı Ayarlamak İçin "b!otorol mesaj "
  
  Otorol Kanalı Ayarlamak İçin "b!otorol kanal #kanal "**`)
  
  if(!komut) return message.channel.send(byhack1)
  if(komut === 'ayarla') {
    let rol = message.mentions.roles.first()
    if(!rol) return message.reply("Lütfen Bir Rol Etiketleyiniz")
    db.set(`otorol_${message.guild.id}`, rol.id);
    message.channel.send(byhack2)
    return
  }
  if(komut === 'sıfırla'){
    db.delete(`otorol_${message.guild.id}`);
    db.delete(`otokanal_${message.guild.id}`);
    db.delete(`otomesaj_${message.guild.id}`);
    message.reply("Otorol Başarıyla Sıfırlandı")
    return
  }
  
  if(komut === 'mesaj'){
    let otomesaj = args.slice(1).join(' ');
    if(!otomesaj) return message.reply("Lütfen Bir Mesaj Yazınız")
    db.set(`otomesaj_${message.guild.id}`, otomesaj);
    message.channel.send("Başarılya Ayarlandı Canım")
    return
  }
  
  if(komut === 'kanal') {
    let kanal = message.mentions.channels.first()
    if(!kanal) return message.channel.send("Nere Göndereyim")
    db.set(`otokanal_${message.guild.id}`,kanal.id)
    message.channel.send("iyi ayarladın he")
    return
  }
  
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 3
}

exports.help = {
  name: 'otorol'
};