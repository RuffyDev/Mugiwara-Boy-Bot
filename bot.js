const { Client, VoiceChannel, Util, ReactionUserManager } = require('discord.js')
const ytdl = require('ytdl-core')
const YouTube = require ('simple-youtube-api')
const { PREFIX } = require('./config');
const config = require('./config');
const { title } = require('process');

const client = new Client ({ disableEveryone: true })

const youtube= new YouTube ('')

const queue = new Map()

client.on('message', async message => {
	if(message.author.bot) return
	if(!message.content.startsWith(PREFIX)) return

	const args = message.content.substring(PREFIX.length).split(" ")
	const searchString = args.slice(1).join('')
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : ''
	const serverQueue = queue.get(message.guild.id)


	if(message.content.startsWith(`${PREFIX}play`)) {
		const voiceChannel = message.member.voice.channel
		if(!voiceChannel) return message.channel.send("Você não está conectado a um canal de voz.")
		const permissions = voiceChannel.permissionsFor(message.client.user)
		if(!permissions.has('CONNECT')) return message.channel.send("Eu não tenho permissão para conectar.")
		if(!permissions.has("SPEAK")) return message.channel.send("Eu não tenho permissão para falar.")

		if(url.match('https://www.youtube.com/playlist')) {
			const playlist = await youtube.getPlaylist(url)
			const videos = await playlist.getVideos()
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id)
				await handleVideo(video2, message, voiceChannel, true)
			}
			message.channel.send(`A Playlist **${playlist.title}** foi adicionada a lista `)
			return undefined
		} else{ 

		try{
			var video = await youtube.getVideoByID(url)
		} catch{
			try{
				var videos = await youtube.searchVideos(searchString, 1)
				var video = await youtube.getVideoByID(videos[0].id)
			}catch {
				return message.channel.send("Não encontrei resultados")
			}
		}
		return handleVideo(video, message, voiceChannel)
 	 }
		 } else if (message.content.startsWith(`${PREFIX}stop`)) {
			 if(!message.member.voice.channel) return message.channel.send("Você não pode parar algo que não está tocando.")
			 if(!serverQueue) return message.channel.send("Não há nada tocando.")
			 serverQueue.songs = []
			 serverQueue.connection.dispatcher.end()
			 message.channel.send("🛑 Parou ")
			 return undefined
		 }else if (message.content.startsWith(`${PREFIX}skip`)) {
			 if(!message.member.voice.channel) return message.channel.send("Você não pode pular a música se não estiver conectado a uma canal de voz.")
			 if(!serverQueue) return message.channel.send("Não há nada tocando.")
			 serverQueue.connection.dispatcher.end()
			 message.channel.send("⏭️ Pulando")
			 return undefined
		 }/* else if (message.content.startsWith(`${PREFIX}volume`)) {
			 if(!message.member.voice.channel) return message.channel.send("Você não está conectado a um canal de voz.")
			 if(!serverQueue) return message.channel.send("Não a nada tocando")
			 if(!args[1]) return message.channel.send(`O nivel do volume atual é **${serverQueue.volume}**`)
			 if(isNaN(args[1])) return message.channel.send(`Este nivel de volume não é valido`)
			 serverQueue.volume = args[1]
			 serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5)
			 message.channel.send(`O volume foi mudado para **${args[1]}**`)
			 return undefined
		 }*/else if (message.content.startsWith(`${PREFIX}np`)) {
			 if(!serverQueue) return message.channel.send("Não há nada tocando.")
			 message.channel.send(`Tocando agora **${serverQueue.songs[0].title}**`)
			 return undefined
		 }else if (message.content.startsWith(`${PREFIX}queue`)){ 
		 if (!serverQueue) return message.channel.send("Não há nada tocando.")
		 message.channel.send(`
__**Lista de Muicas**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

**Tocando agora** ${serverQueue.songs[0].title}
		 `, {split: true })
		 return undefined 
		} else if (message.content.startsWith(`${PREFIX}pause`)){
			if(!message.member.voice.channel) return message.channel.send("Você não está conectado a um canal de voz.")
			if(!serverQueue) return message.channel.send("Não há nada tocando.")
			if(!serverQueue.playing) return message.channel.send("A música já esta pausada.")
			serverQueue.playing = false
			serverQueue.connection.dispatcher.pause()
			message.channel.send("A música foi pausada ⏸️.")
			return undefined
		}else if (message.content.startsWith(`${PREFIX}resume`)) {
			if(!message.member.voice.channel) return message.channel.send("Você não está conectado a um canal de voz.")
			if(!serverQueue) return message.channel.send("Não há nada tocando.")
			if(serverQueue.playing) return message.channel.send ("A música já está tocando.")
			serverQueue.playing = true
			serverQueue.connection.dispatcher.resume()
			message.channel.send("Retomando a música ▶️ .")
			return undefined
		}
		return undefined
})

async function handleVideo(video, message, voiceChannel, playlist = false) {
	const serverQueue = queue.get(message.guild.id)

	const song = {
		id: video.id,
		title: video.title,
		url: `https://www.youtube.com/watch?v=${video.id}`
	}

	if(!serverQueue) {
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 3,
			playing: true
		}
		queue.set(message.guild.id, queueConstruct)

		queueConstruct.songs.push(song)
	
		try {
			var connection = await voiceChannel.join()
			queueConstruct.connection = connection
			play(message.guild, queueConstruct.songs[0])
		} catch (error) {
			console.log(`Houve um erro de conexão no canal de voz: ${error}`)
			queue.delete(message.guild.id)
			return message.channel.send (`Aconteceu um erro de conexão: ${error}`)
		}
	} else {
		serverQueue.songs.push(song)
		if(playlist) return undefined
	else return message.channel.send (`**${song.title}** adicionada a lista`)
	}
	return undefined
}

function play(guild, song){
	const serverQueue = queue.get(guild.id)

	if(!song) {
		serverQueue.voiceChannel.leave()
		queue.delete(guild.id)
		return
	}

	const dispatcher = serverQueue.connection.play(ytdl(song.url))
	.on('finish', () => {
		serverQueue.songs.shift()
		play(guild, serverQueue.songs[0])
	})
	.on('error', error => {
		console.log(error)
	})
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)

serverQueue.textChannel.send(`Tocando agora **${song.title}** `)

}

client.on('warn', console.warn);
client.on('error', console.error);
client.on('ready', () => { 

	let actives = [
		//`ESTOU EM MANUTENÇÃO`
		`USE 'help PARA OBTER AJUDA`,
		`DESENVOLVIDO POR RUFFY#0001`,
		`VERSÃO 1.4 BETA`,
		`QUALQUER PROBLEMA OU SUGESTÃO ENTRE EM CONTATO COM O SUPORTE https://discord.gg/8jBJnKS`
	],
	i=0;
setInterval(() => client.user.setActivity(`${actives[i ++ % actives.length]}`, {
	type: "PLAYING" //PLAYING LISTENING
}), 5000);
	client.user
	.setStatus ("online")
	.catch(console.log);
console.log("O Rei dos Piratas está devolta")
});

client.on('message', message => {
	if (message.author.bot) return;
	if (message.channel.type == 'dm') return;
	if (!message.content.toLowerCase().startsWith(config.PREFIX.toLowerCase())) return;
	if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;

   const args = message.content
	   .trim().slice(config.PREFIX.length)
	   .split(/ +/g);
   const command = args.shift().toLowerCase();

   try {
	   
	   const commandFile = require(`./commands/${command}.js`)
	   commandFile.run(client, message, args);
   } catch (err) {
   //console.error('Erro:' + err);
 }
});
	

client.login('');