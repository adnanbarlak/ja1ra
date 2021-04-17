

const Discord = require('discord.js');
const client = new Discord.Client();
const db = require('quick.db')

exports.run = async (client, message, args) => {

  if (!message.guild) {
  const ozelmesajuyari = new Discord.MessageEmbed()
  .setColor(0xFF0000)
  .setTimestamp()
  .setAuthor(message.author.username, message.author.avatarURL)
  .addField(':warning: **Uyarı** :warning:', '`uyar` **adlı komutu özel mesajlarda kullanamazsın.**')
  return message.author.sendEmbed(ozelmesajuyari); }
  let guild = message.guild
  let reason = args.slice(1).join(' ');
  let user = message.mentions.users.first();
  if (reason.length < 1) return message.reply('**Uyarı Sebebini Belirtmedin!**');
  if (message.mentions.users.size < 1) return message.reply('**Kimi Uyaracağını Yazmadın!**').catch(console.error);
  db.add(`${message.guild.id}.uyarı.${user.id}` , 1)
  db.push(`${message.guild.id}.sebepler.${user.id}` , reason)
  let toplam = await db.fetch(`${message.guild.id}.uyarı.${user.id}`);
  let log = await db.fetch(`uyarılog.${message.guild.id}`);
  if(!log) return message.channel.send("Lütfen Uyarı Log Kanalı Ayarla.")
  if(log) {
      let kanal = message.guild.channels.cache.get(log)
      const embed1 = new Discord.MessageEmbed()
  .setColor(0x00AE86)
  .setTimestamp()
  .addField('Eylem:', 'Uyarı verme')
  .addField('Uyarı Verilen Kullanıcı:', `${user.username}#${user.discriminator}`)
  .addField('Uyarı Veren Yetkili:', `${message.author.username}#${message.author.discriminator}`)
  .addField('Uyarı Sebep', reason)
  .addField("Toplam Uyarı" , toplam)
      
     kanal.send(embed1);
    
  }
  const embed = new Discord.MessageEmbed()
  .setColor(0xffff)
  .setTimestamp()
  .addField('Eylem:', 'Uyarı verme')
  .addField('Kullanıcı:', `${user.username}#${user.discriminator}`)
  .addField('Yetkili:', `${message.author.username}#${message.author.discriminator}`)
  .addField('Sebep', reason)
  .addField("Toplam Uyarı" , toplam)
  .addField('İpucu:', 'Uyarı Listesini Görmek İçin uyarı-list');
  return message.channel.send(embed);

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'uyar',
  description: 'İstediğiniz kişiyi uyarır.',
  usage: 'uyar [kullanıcı] [sebep]'
};