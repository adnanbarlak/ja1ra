

const { MessageAttachment } = require("discord.js");
const canvacord = require("canvacord");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
  
  
  let seyit = await db.fetch(`lvl_${message.author.id}_${message.guild.id}`)|| 0;
  let hyperion = await db.fetch(`xp_${message.author.id}_${message.guild.id}`) || 0;
  let asunack = Math.floor(Math.pow(seyit / 0.1, 2));

  //let herkes = client.db.all().filter(i => i.ID.startsWith("xp_")).sort((a, b) => b.data - a.data);
  let seviye = await db.fetch(`lvl_${message.author.id}_${message.guild.id}`)|| 0; 



  const card = new canvacord.Rank()          
    .setUsername(user.username)
    .setDiscriminator(user.discriminator)
    .setRank(seviye)
    .setLevel(seyit)
    .setCurrentXP(hyperion)
    .setRequiredXP(asunack)
    .setStatus(user.presence.status)
    .setAvatar(user.displayAvatarURL({ format: "png", size: 1024 }));

  const img = await card.build();
  
  return message.channel.send(new MessageAttachment(img, "rank.png"));
};

exports.conf = {
  aliases: ['seviye'],
  guildOnly: true,
  enabled: true,
  permLevel: 0
};

exports.help = {
  name: "rankcard",
  usage: "@user",
  description: "Etiketlediğiniz kişinin veya sizin levelinizi gösterir"
};