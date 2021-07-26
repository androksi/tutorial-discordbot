// Pacotes do NPM
const { Client, MessageEmbed } = require('discord.js');
const MTAClient = require('mtasa').Client;

// Configurações
const tokenString = require('./config/token');
const channelId = require('./config/channel');
const { ip, httpPort, username, password } = require('./config/mta');
const prefix = require('./config/prefix');
const guildId = require('./config/guild');

// Instância da aplicação
const app = new Client();

// Instância do servidor MTA
const mta = new MTAClient(ip, httpPort, username, password);

// Funções
async function sendInfoToMTAServer() {
    const vguild = app.guilds.cache.find(guild => guild.id === guildId);

    const members = vguild.members.cache.size;
    const checkInvites = await vguild.fetchInvites();
    const invite = checkInvites.find(invite => invite.maxAge === 0);
    const inviteCode = invite ? invite.code : 'Could not find an invite to get its code.';
    const guildName = vguild.name;

    try {
        const result = await mta.resources.discordapp.discordRequest("uuu", "Console", members, inviteCode, guildName);
    } catch (err) {
        console.log(err);
    }
}

// Eventos do Discord App
app.on('ready', () => {
    console.log('=> O BOT está funcionando.');

    sendInfoToMTAServer();
});

app.on('guildMemberAdd', () => {
    sendInfoToMTAServer();
});

app.on('guildMemberRemove', () => {
    sendInfoToMTAServer();
});

app.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    if (message.channel.id !== channelId) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member.hasPermission('ADMINISTRATOR')) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const admin = `${message.member.displayHexColor}${message.member.displayName}#${message.author.discriminator}`;

    if (command === 'settime') {
        try {
            const result = await mta.resources.discordapp.discordRequest(command, admin, args[0], args[1]);

            message.reply(result); // retornamos uma mensagem para quem executou o comando, com o resultado vindo do servidor
        } catch (err) {
            message.reply('um erro ocorreu ao tentar executar o comando. Verifique o console da sua aplicação.');
        }
    } else if (command === 'text') {
        try {
            const text = args.join(' ');
            const result = await mta.resources.discordapp.discordRequest(command, admin, text);

            message.reply(result); // retornamos uma mensagem para quem executou o comando, com o resultado vindo do servidor
        } catch (err) {
            message.reply('um erro ocorreu ao tentar executar o comando. Verifique o console da sua aplicação.');
        }
    } else if (command === 'status') {
        try {
            const result = await mta.resources.discordapp.discordRequest(command, admin);

            if (result !== null && typeof result === "object") {
                const { online, maxPlayers, serverName, serverIp, serverPort } = result;
                const embed = new MessageEmbed()
                    .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
                    .setTitle('Status do Servidor')
                    .addFields({
                        name: 'Nome do servidor',
                        value: serverName,
                        inline: true
                    }, {
                        name: 'Jogadores online',
                        value: `${online}/${maxPlayers}`,
                        inline: true
                    }, {
                        name: 'IP',
                        value: `mtasa://${serverIp}:${serverPort}`,
                    })
                    .setTimestamp();
                
                message.channel.send(embed);
            }
        } catch (err) {
            message.reply('um erro ocorreu ao tentar executar o comando. Verifique o console da sua aplicação.');
        }
    } else if (command === "mute") {
        try {
            const result = await mta.resources.discordapp.discordRequest(command, admin, args[0]);

            message.reply(result); // retornamos uma mensagem para quem executou o comando, com o resultado vindo do servidor
        } catch (err) {
            message.reply('um erro ocorreu ao tentar executar o comando. Verifique o console da sua aplicação.');
        }
    } else if (command === "givemoney") {
        try {
            const result = await mta.resources.discordapp.discordRequest(command, admin, args[0], args[1]);

            message.reply(result); // retornamos uma mensagem para quem executou o comando, com o resultado vindo do servidor
        } catch (err) {
            message.reply('um erro ocorreu ao tentar executar o comando. Verifique o console da sua aplicação.');
        }
    } else if (command === "cgroup") {
        try {
            const result = await mta.resources.discordapp.discordRequest(command, admin, args[0]);

            message.reply(result); // retornamos uma mensagem para quem executou o comando, com o resultado vindo do servidor
        } catch (err) {
            message.reply('um erro ocorreu ao tentar executar o comando. Verifique o console da sua aplicação.');
        }
    }
});

// Iniciar BOT
app.login(tokenString);
