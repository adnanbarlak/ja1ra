const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async (client, message, args) => {

  const kayitk = await db.fetch(`kayıtk_${message.guild.id}`)
  const tag = " ";
  if(kayitk == null) return message.channel.send('Kayıt Sistemi eklemek için <`-kayıt-rol @rol`/`-kayıt-kanal #kanal`/`-kayıt-log #kanal`> şeklinde ekleyebilirsiniz. ');
  if (message.channel.id !== kayitk) return message.channel.send(`Kayıt Kanalı <#${kayitk}> Şuanda Burası !`);
  if (kayitk == true) return; 
  if (kayitk == false) return message.channel.send(`Kayıt Sistemi Aktif değil`);
 
  let user = message.member
  let guild = message.guild
  let isim = args[0];
  if (!isim) return message.channel.send(`İsmini girmelisin.`)
  
  user.setNickname(`${tag} ${isim} `)
  user.roles.add(db.fetch(`kayıt_${message.guild.id}`))
  message.channel.send(`${message.author} Sunucuya Başarıyla Kayıt oldun !`)
  message.guild.channels.cache.get(db.fetch(`kayıtlog_${message.guild.id}`)).send(`<a:kayit:707928076926976061> ${message.author} Adlı kullanıcı Başarılı Şekilde Kayıt Oldu ! <a:oldu:707928398902853713> `);

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0,
  kategori: "yetkili"
}

exports.help = {
  name: 'kayıt',
  description: "Sunucuya kayıtolmaya yarar",
  usage: 'kayıt <isim> <yaş>'
}