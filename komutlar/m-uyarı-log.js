const Discord = require('discord.js')
const db = require('quick.db')

exports.run = async(client , message , args) => {
if(!message.member.hasPermission("ADMINISTRATOR")) 
    return message.channel.send(message.author + " **Bu Komutu Kullanabılmek İçin `Yönetici` Yetkisine Sahip Olman Lazım !**")
if(!args[0]) return message.channel.send("**Uyarı Sistemi İçin `+uyarı-sistemi` yazınız.**")
if(args[0] === "log") {
let kanal = message.mentions.channels.first()
if(!kanal) return message.channel.send("**Lütfen Bir Kanal Belirtin. Örneğin : +uyarı log #kanal**")
db.set(`uyarılog.${message.guild.id}` , kanal.id)
message.channel.send(`**Başarıyla ${kanal} uyarı log olarak ayarlandı !**`)

}
if(args[0] === "limit") {
    let limit = args[1]
    if(!limit) return message.channel.send("**Lütfen Bir Limit Belirtin !**")
    if(!isNaN(limit)) return message.channel.send("**Limit Sadece Sayı Olmaktadır !**")
    db.set(`uyarı-limit.${message.guild.id}` , limit)
    message.channel.send("**Başarıyla Limit **`" + limit + "` **olarak ayarlandı !**")
    if(args[1] === "log sıfırla") {
        if(!db.has(`uyarı-limit.${message.guild.id}`)) return message.channel.send("**Bu Sistem Raten Kapalı !**")
        db.delete(`uyarı-limit.${message.guild.id}`)
        message.channel.send("**Başarıyla Uyarı Limit Sıfırlandı !**")
    }
}
  
if(args[0] === "sıfırla") {
    let sıfırla = args[1]
        db.delete(`uyarılog.${message.guild.id}`)
        message.channel.send("**Başarıyla uyarı log sıfırlandı !**")
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
  };
  
  exports.help = {
    name: 'uyarı',
  };