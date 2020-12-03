const Discord = require('discord.js');
 
exports.run = (bot, message, args) => {
 
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`Você precisa de permissão para poder executar este comando`)
 
    let membro = message.mentions.users.first()
    if (!membro) return message.reply(`mencione um membro`)
 
    let motivo = args.slice(1).join(" ");
    if (!motivo) return message.reply(`escreva um motivo`)
 
    const embed = new Discord.MessageEmbed()
 
    .setTitle(`ADVERTÊNCIA`)
    .setColor('#FF0000')
    .setFooter(`Staff responsavel: ${message.author.username}`, message.author.avatarURL)
    .setDescription(motivo)
 
    message.delete().catch(O_o => {});
    membro.send(embed)
    message.channel.send(`** O USUARIO FOI ADVERTIDO **`)
 
}
 
exports.help = {
    name: 'warn'
}