const { MessageEmbed } = require('discord.js')
const os = require('os')
module.exports = {
    name: "info",
    category: "bot",
    run: async (client, message, args) => {
        const embed = new MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle('Informações')
            .setColor('#FFA500')
            .addFields(
                {
                    name: '🌐 Servidores',
                    value: `Estou em ${client.guilds.cache.size} servidores.`,
                    inline: true
                },
                {
                    name: '📺 Canais',
                    value: `Servindo ${client.channels.cache.size} canais.`,
                    inline: true
                },
                {
                    name: '👥 Usuarios',
                    value: `Conversando com ${client.users.cache.size} nakamas`,
                    inline: true
                },
                {
                    name: '⏳ Ping',
                    value: `${Math.round(client.ws.ping)}ms`,
                    inline: true
                },
              
            )
            .setFooter(`Criado por : ${message.author.tag}`, message.author.displayAvatarURL())

        await message.channel.send(embed)
    }
}