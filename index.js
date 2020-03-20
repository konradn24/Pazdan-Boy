const Discord = require('discord.js');
const bot = new Discord.Client();

const jsonfile = require('jsonfile');

const prefix = "!";

var onlineMembersChannelID, onlineMembersChannelName, onlineMembersStatistic = false;
var membersChannelID, membersChannelName, membersStatistic = false;
var lastMemberChannelID, lastMemberChannelName, lastMember = "Pazdan-Boy", lastMemberStatistic = false;
var dateChannelID, dateChannelName, dateStatistic = false;
var administrationChannelID, administrationChannelName, administrationStatistic = false;
let admins, onlineUsers;

bot.on('ready', () =>{
    console.log('Jestem aktywny!');

    bot.user.setActivity('!pomoc', {type: 'WATCHING'});
})

bot.on('message', msg=>{
    var server = msg.guild;
    var member = msg.member;
    var content = msg.content;
    var channel = msg.channel;

    if(dateStatistic) updateDate(server);

    let args = content.substring(prefix.length).split(" ");

    switch(args[0]) {
        case "czesc": {
            channel.send("Witaj " + member + "!");
            break;
        }

        case "statystyki": {
            channel.send(`> Statystyka nr. 1 (osoby online): ${onlineMembersStatistic}`);
            channel.send(`> Statystyka nr. 2 (ilość członków serwera): ${membersStatistic}`);
            channel.send(`> Statystyka nr. 3 (nowy użytkownik): ${lastMemberStatistic}`);
            channel.send(`> Statystyka nr. 4 (data): ${dateStatistic}`);
            channel.send(`> Statystyka nr. 5 (ilość osób w zarządzie): ${administrationStatistic}`);
            break;
        }

        case "pomoc": {
            channel.send("> **czesc** - sprawdza czy bot działa poprawnie (jeżeli odpowie - wszystko jest w porządku)\n > **statystyki** - informuje ile kanałów statystyk jest aktywnych\n > **ustaw-kanal *<numer statystyki>* *<nazwa kanału>*** - przypisuje podany kanał do statystyki oznaczonej numerem\n > **usun-kanal *<nazwa kanału>*** - przestaje wyświetlać statystyki na podanym kanale");
            channel.send("**** \n `NUMERY STATYSTYK` \n ****");
            channel.send("> **1** - ilość aktywnych członków serwera.");
            channel.send("> **2** - sumaryczna ilość członków serwera.");
            channel.send("> **3** - nowy użytkownik na serwerze.");
            channel.send("> **4** - aktualna data.");
            channel.send("> **5** - ilość osób w zarządzie.");
            break;
        }

        case "ustaw-kanal": {
            if(!args[1]) channel.send("Podaj numer statystyki, a następnie nazwę kanału! Wpisz **!pomoc**, jeżeli jej potrzebujesz.");
            else if(!args[2]) channel.send("Po numerze statystyki podaj nazwę kanału do którego chcesz ją przypisać! Wpisz **!pomoc**, jeżeli jej potrzebujesz.");

            var channelName = "";
            if(args[2]) {
                for(var i = 2; i < args.length; i++) {
                    channelName += args[i] + " ";
                }

                channelName = channelName.substr(0, channelName.length - 1);
            }

            if(args[1] == 1) {
                if(server.channels.find("name", `${channelName}`) != null) {
                    onlineMembersChannelID = server.channels.find("name", `${channelName}`).id;

                    channel.send(`Ustawiono identyfikator kanału statystyki nr. 1 jako ${onlineMembersChannelID} (była nazwa: ${channelName})`);

                    onlineUsers = server.members.filter(member => member.presence.status === "online");

                    server.channels.find("name", `${channelName}`).setName(`Osoby online: ${onlineUsers.size}`); onlineMembersChannelName = `Osoby online: ${onlineUsers.size}`;
                    onlineMembersStatistic = true;
                } else if(args[2]) channel.send(`Podano nieprawidłową nazwę kanału: ${channelName} !`);
            } else if(args[1] == 2) {
                if(server.channels.find("name", `${channelName}`) != null) {
                    membersChannelID = server.channels.find("name", `${channelName}`).id;

                    channel.send(`Ustawiono identyfikator kanału statystyki nr. 2 (ilość użytkowników) jako ${membersChannelID} (była nazwa: ${channelName})`);

                    server.channels.find("name", `${channelName}`).setName(`Czołgiści: ${server.memberCount}`); membersChannelName = `Czołgiści: ${server.memberCount}`;
                    membersStatistic = true;
                } else if(args[2]) channel.send(`Podano nieprawidłową nazwę kanału: ${channelName} !`);
            } else if(args[1] == 3) {
                if(server.channels.find("name", `${channelName}`) != null) {
                    lastMemberChannelID = server.channels.find("name", `${channelName}`).id;

                    channel.send(`Ustawiono identyfikator kanału statystyki nr. 3 (nowy użytkownik) jako ${lastMemberChannelID} (była nazwa: ${channelName})`);

                    server.channels.find("name", `${channelName}`).setName(`Nowy czołgista: ${lastMember}`); lastMemberChannelName = `Nowy czołgista: ${lastMember}`;
                    lastMemberStatistic = true;
                } else if(args[2]) channel.send(`Podano nieprawidłową nazwę kanału: ${channelName} !`);
            } else if(args[1] == 4) {
                if(server.channels.find("name", `${channelName}`) != null) {
                    dateChannelID = server.channels.find("name", `${channelName}`).id;

                    channel.send(`Ustawiono identyfikator kanału statystyki nr. 4 (aktualna data) jako ${dateChannelID} (była nazwa: ${channelName})`);

                    server.channels.find("name", `${channelName}`).setName(`Data: 0`); dateChannelName = `Data: 0`;
                    dateStatistic = true;
                } else if(args[2]) channel.send(`Podano nieprawidłową nazwę kanału: ${channelName} !`);
            } else if(args[1] == 5) {
                if(server.channels.find("name", `${channelName}`) != null) {
                    administrationChannelID = server.channels.find("name", `${channelName}`).id;

                    channel.send(`Ustawiono identyfikator kanału statystyki nr. 5 (ilość moderatorów) jako ${administrationChannelID} (była nazwa: ${channelName})`);

                    // for(var i = 0; i < server.members.size; i++) if(server.members._array[i].roles.find("name", "I🛑 ZARZĄD") != null) admins++;
                    admins = server.members.filter(function(x) {
                        return x.roles.find("name", "I🛑 ZARZĄD") != null;
                    });
                    server.channels.find("name", `${channelName}`).setName(`Osoby w zarządzie: ${admins.size}`); administrationChannelName = `Osoby w zarządzie: ${admins.size}`;
                    administrationStatistic = true;
                } else if(args[2]) channel.send(`Podano nieprawidłową nazwę kanału: ${channelName} !`);
            } else if(args[1]) channel.send(`Nieprawidłowy numer statystyki! Wpisz **!pomoc**, jeżeli potrzebujesz pomocy.`);

            break;
        }

        case "usun-statystyke": {
            if(!args[1]) channel.send("Podaj numer statystyki, którą chcesz usunąc! Wpisz **!pomoc**, aby ją uzyskać.");

            if(args[1] = 1) {
                if(onlineMembersStatistic) {
                    server.channels.find("name", `${onlineMembersChannelName}`).setName("1");

                    onlineMembersStatistic = false;
                    onlineMembersChannelID = 0;
                    onlineMembersChannelName = "";
                } else channel.send("Ta statystyka nie jest aktywna! Aby zobaczyć aktywne statystyki wpisz **!statystyki**.");
            } else if(args[1] = 2) {
                if(membersStatistic) {
                    server.channels.find("name", `${membersChannelName}`).setName("2");

                    membersStatistic = false;
                    membersChannelID = 0;
                    membersChannelName = "";
                } else channel.send("Ta statystyka nie jest aktywna! Aby zobaczyć aktywne statystyki wpisz **!statystyki**.");
            } else if(args[1] = 3) {
                if(lastMemberStatistic) {
                    server.channels.find("name", `${lastMemberChannelName}`).setName("3");

                    lastMemberStatistic = false;
                    lastMemberChannelID = 0;
                    lastMemberChannelName = "";
                } else channel.send("Ta statystyka nie jest aktywna! Aby zobaczyć aktywne statystyki wpisz **!statystyki**.");
            } else if(args[1] = 4) {
                if(dateStatistic) {
                    server.channels.find("name", `${dateChannelName}`).setName("4");

                    dateStatistic = false;
                    dateChannelID = 0;
                    dateChannelName = "";
                } else channel.send("Ta statystyka nie jest aktywna! Aby zobaczyć aktywne statystyki wpisz **!statystyki**.");
            } else if(args[1] = 5) {
                if(administrationStatistic) {
                    server.channels.find("name", `${administrationChannelName}`).setName("5");

                    administrationStatistic = false;
                    administrationChannelID = 0;
                    administrationChannelName = "";
                } else channel.send("Ta statystyka nie jest aktywna! Aby zobaczyć aktywne statystyki wpisz **!statystyki**.");
            } else if(args[1]) channel.send("Nieprawidłowy numer statystyki!");

            break;
        }
    }
});

// bot.on("presenceUpdate", member => {
//     console.log(onlineMembersChannelName);

//     onlineUsers = member.guild.members.filter(member => member.presence.status === "online");

//     if(onlineMembersChannelName != null) member.guild.channels.find("name", `${onlineMembersChannelName}`).setName(`Osoby online: ${onlineUsers.size}`); onlineMembersChannelName = `Osoby online: ${onlineUsers.size}`;
// });

bot.on("guildMemberUpdate", member => {
    admins = member.guild.members.filter(function(x) {
        return x.roles.find("name", "I🛑 ZARZĄD") != null;
    });
    if(administrationStatistic) member.guild.channels.find("name", `${administrationChannelName}`).setName(`Osoby w zarządzie: ${admins.size}`); administrationChannelName = `Osoby w zarządzie: ${admins.size}`;
});

bot.on("guildMemberAdd", member => {
    if(membersStatistic) {
        member.guild.channels.find("name", `${membersChannelName}`).setName(`Czołgiści: ${member.guild.memberCount}`);
        membersChannelName = `Czołgiści: ${member.guild.memberCount}`;
    }

    if(lastMemberStatistic) {
        lastMember = member.displayName;
        member.guild.channels.find("name", `${lastMemberChannelName}`).setName(`Nowy czołgista: ${lastMember}`); lastMemberChannelName = `Nowy czołgista: ${lastMember}`;
    }
});

bot.on("guildMemberRemove", member => {
    if(membersStatistic) {
        member.guild.channels.find("name", `${membersChannelName}`).setName(`Czołgiści: ${member.guild.memberCount}`); 
        membersChannelName = `Czołgiści: ${member.guild.memberCount}`;
    }
});

function updateDate(guild) {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth();
    var year = today.getFullYear();
    if(guild.channels.find("name", dateChannelName) != null) { guild.channels.find("name", dateChannelName).setName(`Data: ${day}.${month+1}.${year}`); dateChannelName = `Data: ${day}.${month+1}.${year}`; }
}

bot.login(process.env.BOT_TOKEN);
