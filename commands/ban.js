const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "ban",
    category: "moderation",
    run: async (client, message, args) => {
        if (!message.member.hasPermission('BAN_MEMBERS')) {
            return message.channel.send(`Você precisa de permissão para poder executar este comando`)
        }
        if (!args[0]) {
            return message.channel.send(`Mencione o usuario!`)
        }
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        try {
            await member.ban();
            await message.channel.send(`${member} foi banido do servidor!`)
        } catch (e) {
            return message.channel.send(`Este usuario não se encontra no servidor!`)
        }

    }
}