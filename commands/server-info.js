  
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "server-info",
    category: "extra",
    run: async (client, message, args) => {
        let region;
        switch (message.guild.region) {
            case "europe":
                region = '🇪🇺 Europe';
                break;
            case "us-east":
                region = '🇺🇸 Us-East'
                break;
            case "us-west":
                region = '🇺🇸 Us-West';
                break;
            case "us-south":
                region = '🇺🇸 Us-South'
                break;
            case "us-central":
                region = '🇺🇸 Us-Central'
                break;

            case "brazil":
                region = ':flag_br: Brasil'
                break;
        }

        const embed = new MessageEmbed()
            .setThumbnail(message.guild.iconURL({dynamic : true}))
            .setColor('#FFA500')
            .setTitle(`${message.guild.name} server stats`)
            .addFields(
                {
                    name: "Fundador: ",
                    value: message.guild.owner.user.tag,
                    inline: true
                },
                {
                    name: "Membros: ",
                    value: `${message.guild.memberCount}`,
                    inline: true
                },
                {
                    name: "Membros Online: ",
                    value: `${message.guild.members.cache.filter(m => m.user.presence.status == "online").size}`,
                    inline: true
                },
                {
                    name: "Quantia de Bots: ",
                    value: `${message.guild.members.cache.filter(m => m.user.bot).size}`,
                    inline: true
                },
                {
                    name: "Data de Criação do Servidor: ",
                    value: message.guild.createdAt.toLocaleDateString("br-pt"),
                    inline: true
                },
                {
                    name: "Quantia de Regras: ",
                    value: `${message.guild.roles.cache.size}`,
                    inline: true,
                },
                {
                    name: `🗺 Região: `,
                    value: region,
                    inline: true
                },
                {
                    name: `Verificação: `,
                    value: message.guild.verified ? 'Este servidor é verificado' : `Este servidor não é verificado`,
                    inline: true
                },
                {
                    name: 'Boosters: ',
                    value: message.guild.premiumSubscriptionCount >= 1 ? `Este servidor tem  ${message.guild.premiumSubscriptionCount} Boosters` : `Este servidor não tem boosters`,
                    inline: true
                },
                {
                    name: "Emojis: ",
                    value: message.guild.emojis.cache.size >= 1 ? `Este servidor tem ${message.guild.emojis.cache.size} emojis!` : 'There are no emojis' ,
                    inline: true
                }
            )
        await message.channel.send(embed)
    }
}