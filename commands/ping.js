const { MessageEmbed } = require('discord.js');
module.exports = {
  name: "ping",
  category: "info",
  description: "Returns Latency and API Ping",
  timeout: 10000,
    run: async (client, message, args) => {
      const msg = await message.channel.send("Pinging...");
      const Embed = new MessageEmbed()
        .setTitle("Pong! 🏓")
        //.setAuthor(`${message.author.username}` , message.author.displayAvatarURL())
        .setDescription(
          `⌛ **Ping do Server** ${Math.floor(
            msg.createdTimestamp - message.createdTimestamp
          )}ms\n⏲️ **Ping da API** ${Math.round(client.ws.ping)}`
        )
        .setColor('#FFA500');
      msg.edit(Embed);
      msg.edit("\u200b");
    }
};