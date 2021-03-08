const Discord = require('discord.js');//
const client = new Discord.Client();//
const ayarlar = require('./ayarlar.json');//
const chalk = require('chalk');//
const moment = require('moment');//
var Jimp = require('jimp');//
const { Client, Util } = require('discord.js');//
const fs = require('fs');//
const db = require('wio.db');//
const express = require('express');//
require('./util/eventLoader.js')(client);//
const path = require('path');//
const snekfetch = require('snekfetch');//
//

var prefix = ayarlar.prefix;//
//
const log = message => {//
    console.log(`${message}`);//
};

client.commands = new Discord.Collection();//
client.aliases = new Discord.Collection();//
fs.readdir('./komutlar/', (err, files) => {//
    if (err) console.error(err);//
    log(`${files.length} komut yüklenecek.`);//
    files.forEach(f => {//
        let props = require(`./komutlar/${f}`);//
        log(`Yüklenen komut: ${props.help.name}.`);//
        client.commands.set(props.help.name, props);//
        props.conf.aliases.forEach(alias => {//
            client.aliases.set(alias, props.help.name);//
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};



client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }

    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });
client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});
client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);

//-----------------------GİRENE-ROL-VERME----------------------\\     

client.on("guildMemberAdd", member => {
  member.roles.add('800779218354307111'); // UNREGİSTER ROLÜNÜN İDSİNİ GİRİN
});

//-----------------------GİRENE-ROL-VERME----------------------\\     
client.on("ready", () => {
  client.channels.cache.get("812309542427688991").join();
})
//-----------------------OTO-TAG-----------------------\\    

client.on("userUpdate", async (stg, yeni) => {
  var sunucu = client.guilds.cache.get('800779217879957515'); // Buraya Sunucu ID
  var uye = sunucu.members.cache.get(yeni.id);
  var tag = "✧"; // Buraya Ekip Tag
  var tagrol = "800779218380128354"; // Buraya Ekip Rolünün ID
  var logKanali = "800779225975750672"; // Loglanacağı Kanalın ID

const isim = db.fetch(`ilkisim_${uye.id}`)
const yaş = db.fetch(`ilkyas_${uye.id}`)
const sohbet = '806171287054581760'


  if (!sunucu.members.cache.has(yeni.id) || yeni.bot || stg.username === yeni.username) return;
  if ((yeni.username).includes(tag) && !uye.roles.cache.has(tagrol)) {
    try {
		
		uye.setNickname(`✧ ${isim} | ${yaş}`)
      await uye.roles.add(tagrol);
      await uye.send(`Tagımızı aldığın için teşekkürler! Aramıza hoş geldin.`);
      await client.channels.cache.get(logKanali).send(new Discord.MessageEmbed()
	  .setColor('GREEN')
	  .setDescription(`${yeni} adlı üye tagımızı alarak aramıza katıldı!`));
	  
    } catch (err) { console.error(err) };
  };
  
  if (!(yeni.username).includes(tag) && uye.roles.cache.has(tagrol)) {
    try {


 await uye.roles.remove(uye.roles.cache.filter(rol => rol.position >= sunucu.roles.cache.get(tagrol).position));
 uye.setNickname(`✦ ${isim} | ${yaş}`)
      await uye.send(`
Tagımızı bıraktığın için genel rollerin dışında tüm rollerin alındı!
Tagımızı tekrar alıp aramıza katılmak istersen
Tagımız: **${tag}**
	  `);
      await client.channels.cache.get(logKanali).send(new Discord.MessageEmbed()
	  .setColor('RED')
	  .setDescription(`${yeni} adlı üye tagımızı bırakarak aramızdan ayrıldı!`));
    } catch(err) { console.error(err) };
  };
});

//-----------------------OTO-TAG-----------------------\\    

//-----------------------HOŞ-GELDİN-MESAJI----------------------\\     

client.on("guildMemberAdd", member => {  
    const kanal = member.guild.channels.cache.find(r => r.id === "805209822521327616");
    const register = "<@&800779218430459951> <@&800779218430459952>"
    let user = client.users.cache.get(member.id);
    require("moment-duration-format");
      const kurulus = new Date().getTime() - user.createdAt.getTime();  
   
    var kontrol;
  if (kurulus < 1296000000) kontrol = 'Hesap Durumu: Güvenilir Değil'
  if (kurulus > 1296000000) kontrol = 'Hesap Durumu: Güvenilir Gözüküyor'
    moment.locale("tr");
      const strigalog = new Discord.MessageEmbed()
      .setAuthor(member.guild.name)
  .setDescription("**Hoşgeldin! <@" + member + "> Seninle \`" + member.guild.memberCount + "\` Kişiyiz.\n\nMüsait olduğunda Confirmed Odalarından Birine Geçip Kaydını Yaptırabilirsin. \n\n<@&800779218430459948> seninle ilgilenicektir. \n\nHesabın Oluşturulma Tarihi: " + moment(member.user.createdAt).format("`YYYY DD MMMM dddd`") +  "\n\n"  + kontrol + "\n\nTagımızı alarak `✧` bize destek olabilirsin.**\n")
   .setImage("https://i.pinimg.com/originals/ed/2b/9f/ed2b9fd4497b184ba5043c0a34214a55.gif")
   kanal.send(strigalog)   
     kanal.send(register).then(x => x.delete({timeout: 1000})); 
	 member.roles.add('800779218354307111')
  });
  
//-----------------------HOŞ-GELDİN-MESAJI----------------------\\     


//-----------------------OTO-TAG-----------------------\\     

 /*
 message.delete().catch(O_o=>{});
.then(x => x.delete({timeout: 1000}));

client.channels.cache.get('806171287054581760').send(`${yeni} isimli üyemiz ✧ tagımızı aldı.`).then(x => x.delete({timeout: 10000}));
client.channels.cache.get('806171287054581760').send(`${yeni} isimli üyemiz ✧ tagımızı çıkardı.`).then(x => x.delete({timeout: 10000}));
*/
