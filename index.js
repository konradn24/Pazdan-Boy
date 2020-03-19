const Discord = require('discord.js');
const bot = new Discord.Client();

const jsonfile = require('jsonfile');

const token = "";

const prefix = "!";

var onlineMembersChannelID, onlineMembersChannelName;
var membersChannelID, membersChannelName;
var lastMemberChannelID, lastMemberChannelName, lastMember = "Pazdan-Boy";
var dateChannelID, dateChannelName;
var administrationChannelID, administrationChannelName;
let admins, onlineUsers;

bot.on('ready', () =>{
    console.log('Jestem aktywny!');
})

bot.on('message', msg=>{
    var server = msg.guild;
    var member = msg.member;
    var content = msg.content;
    var channel = msg.channel;

    if(dateChannelName != null) updateDate(server);

    let args = content.substring(prefix.length).split(" ");

    switch(args[0]) {
        case "czesc": {
            channel.send("Witaj " + member + "!");
            break;
        }

        case "pomoc": {
            channel.send("> **czesc** - sprawdza czy bot działa poprawnie (jeżeli odpowie - wszystko jest w porządku)\n > **statystyki** - informuje ile kanałów statystyk jest aktywnych\n > **ustaw-kanal *<numer statystyki>* *<nazwa kanału>*** - przypisuje podany kanał do statystyki oznaczonej numerem (konieczne jest ID kanału!)");
            channel.send("**** \n `NUMERY STATYSTYK` \n ****");
            channel.send("> **1** - ilość aktywnych członków serwera.");
            break;
        }

        case "ustaw-kanal": {
            if(args[1] == 1) {
                onlineMembersChannelID = server.channels.find("name", `${args[2]}`).id;

                channel.send(`Ustawiono identyfikator kanału statystyki nr. 1 jako ${onlineMembersChannelID} (była nazwa: ${args[2]})`);

                onlineUsers = server.members.filter(member => member.presence.status === "online");

                server.channels.find("name", `${args[2]}`).setName(`Osoby online: ${onlineUsers.size}`); onlineMembersChannelName = `Osoby online: ${onlineUsers.size}`;
            } else if(args[1] == 2) {
                membersChannelID = server.channels.find("name", `${args[2]}`).id;

                channel.send(`Ustawiono identyfikator kanału statystyki nr. 2 (ilość użytkowników) jako ${membersChannelID} (była nazwa: ${args[2]})`);

                server.channels.find("name", `${args[2]}`).setName(`Osoby: ${server.memberCount}`); membersChannelName = `Osoby: ${server.memberCount}`;
            } else if(args[1] == 3) {
                lastMemberChannelID = server.channels.find("name", `${args[2]}`).id;

                channel.send(`Ustawiono identyfikator kanału statystyki nr. 3 (nowy użytkownik) jako ${lastMemberChannelID} (była nazwa: ${args[2]})`);

                server.channels.find("name", `${args[2]}`).setName(`Nowa osoba: ${lastMember}`); lastMemberChannelName = `Nowa osoba: ${lastMember}`;
            } else if(args[1] == 4) {
                dateChannelID = server.channels.find("name", `${args[2]}`).id;

                channel.send(`Ustawiono identyfikator kanału statystyki nr. 4 (aktualna data) jako ${dateChannelID} (była nazwa: ${args[2]})`);

                server.channels.find("name", `${args[2]}`).setName(`Data: 0`); dateChannelName = `Data: 0`;
            } else if(args[1] == 5) {
                administrationChannelID = server.channels.find("name", `${args[2]}`).id;

                channel.send(`Ustawiono identyfikator kanału statystyki nr. 5 (ilość moderatorów) jako ${administrationChannelID} (była nazwa: ${args[2]})`);

                // for(var i = 0; i < server.members.size; i++) if(server.members._array[i].roles.find("name", "I🛑 ZARZĄD") != null) admins++;
                admins = server.members.filter(function(x) {
                    return x.roles.find("name", "I🛑 ZARZĄD") != null;
                });
                server.channels.find("name", `${args[2]}`).setName(`Osoby w zarządzie: ${admins.size}`); administrationChannelName = `Osoby w zarządzie: ${admins.size}`;
            }

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
    if(administrationChannelName != null) member.guild.channels.find("name", `${administrationChannelName}`).setName(`Osoby w zarządzie: ${admins.size}`); administrationChannelName = `Osoby w zarządzie: ${admins.size}`;
});

bot.on("guildMemberAdd", member => {
    if(membersChannelName != null) {
        member.guild.channels.find("name", `${membersChannelName}`).setName(`Osoby: ${member.guild.memberCount}`);
        membersChannelName = `Osoby: ${member.guild.memberCount}`;
    }

    if(lastMemberChannelName != null) {
        lastMember = member.displayName;
        member.guild.channels.find("name", `${lastMemberChannelName}`).setName(`Nowa osoba: ${lastMember}`); lastMemberChannelName = `Nowa osoba: ${lastMember}`;
    }
});

bot.on("guildMemberRemove", member => {
    if(membersChannelName != null) {
        member.guild.channels.find("name", `${membersChannelName}`).setName(`Osoby: ${member.guild.memberCount}`); 
        membersChannelName = `Osoby: ${member.guild.memberCount}`;
    }
});

function updateDate(guild) {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth();
    var year = today.getFullYear();
    if(guild.channels.find("name", dateChannelName) != null) { guild.channels.find("name", dateChannelName).setName(`Data: ${day}.${month+1}.${year}`); dateChannelName = `Data: ${day}.${month+1}.${year}`; }
    if(guild.channels.find("name", dateChannelName) == null) console.log(dateChannelName);
}

bot.login(token);
