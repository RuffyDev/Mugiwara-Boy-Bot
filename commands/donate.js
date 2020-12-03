const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    const embed = new Discord.MessageEmbed()

    .setTitle("Obrigado pela sua doação")
    .setColor("#00FF00")
    .setDescription(`PagSeguro:https://pag.ae/7WdNc_dVr \n Paypal:https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=A96ANNRM6XLSJ&source=url
    
    `)

    message.channel.send(embed);
}

module.exports.config = {
    name: "donate",
    accessableby: "Members",
    aliases: []
}
