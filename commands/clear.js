  
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "clear",
    category: "moderation",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) // sets the permission
            return message.channel.send(
                `Você não pode excluir mensagens, ${message.author.username}` // returns this message to user with no perms
            );
        if (!args[0]) {
            return message.channel.send(`Ensira um numero de 1 a 100, não posso excluir 0 mensagens.`)
        }

        let deleteAmount;

        if (parseInt(args[0]) > 100 ) {
            deleteAmount = 100;
        } else {
            deleteAmount = parseInt(args[0]);
        }

        await message.channel.bulkDelete(deleteAmount, true);

        const embed = new MessageEmbed()
            .setTitle(`Chat limpo`)
            //.setThumbnail(message.author.displayAvatarURL())
            .setDescription(`O chat foi limpo com sucesso `) //${deleteAmount}`)
            .setFooter( message.author.username, message.author.displayAvatarURL())
            .setColor('#FFA500')
        await message.channel.send(embed)
    }
}