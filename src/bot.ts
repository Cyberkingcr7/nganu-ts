
import fs from 'fs'
import CFonts from 'cfonts'
import { Boom } from '@hapi/boom'
import P from 'pino'
import makeWASocket, { AnyMessageContent, Browsers,AnyWASocket, delay, DisconnectReason, fetchLatestBaileysVersion, getContentType, isJidGroup, jidNormalizedUser, makeInMemoryStore, useSingleFileAuthState } from '@adiwajshing/baileys'
import moment from 'moment'
import chalk from 'chalk';
import path from 'path'
const gradient = require('gradient-string');


// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it
const store = makeInMemoryStore({ logger: P().child({ level: 'debug', stream: 'store' }) })
store.readFromFile('./baileys_store_multi.json')
// save every 10s
setInterval(() => {
	store.writeToFile('./baileys_store_multi.json')
}, 10_000)
let jid:any;
let type:any;
const color = (text:any, color:any) => {
	return !color ? chalk.green(text) : color.startsWith('#') ? chalk.hex(color)(text) : chalk.keyword(color)(text);
};
if (!fs.existsSync('./usersJid.json')) {
    fs.writeFileSync('./usersJid.json', JSON.stringify([]), 'utf-8')
}

let chatsJid = JSON.parse(fs.readFileSync('./usersJid.json', 'utf-8'))
const owner = '24455555'
function bgColor(text: string, color: string) {
	return !color
		? chalk.bgGreen(text)
		: color.startsWith('#')
			? chalk.bgHex(color)(text)
			: chalk.bgKeyword(color)(text);
}
const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json')

// start a connection
const start = async() => {
	// fetch latest version of WA Web
	const { version, isLatest } = await fetchLatestBaileysVersion()
	console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)
	CFonts.say(`Welcome to Bnh`, {
        font: 'console',
        align: 'center',
        gradient: ['#DCE35B', '#45B649'],
        transitionGradient: true,
    });

	const { version: WAVersion } = await fetchLatestBaileysVersion()
    console.log(color('[SYS]', 'cyan'), `Package Version`, color(`v1`, '#009FF0'));
    console.log(color('[SYS]', 'cyan'), `WA Version`, color(WAVersion.join('.'), '#38ef7d'));

	const bnh = makeWASocket({
		version,
		logger: P({ level: 'silent' }),
		printQRInTerminal: true,
		auth: state,
		browser: Browsers.macOS('Safari'),
		// implement to handle retries
	
		}
	)

	store.bind(bnh.ev)

	const sendMessageWTyping = async(msg: AnyMessageContent, jid: string) => {
		await bnh.presenceSubscribe(jid)
		await delay(500)

		await bnh.sendPresenceUpdate('composing', jid)
		await delay(2000)

		await bnh.sendPresenceUpdate('paused', jid)

		await bnh.sendMessage(jid, msg)
	}
    
	bnh.ev.on('chats.set', (item:any) => console.log(`recv ${item.chats.length} chats (is latest: ${item.isLatest})`))
	bnh.ev.on('messages.set', (item:any) => console.log(`recv ${item.messages.length} messages (is latest: ${item.isLatest})`))
	bnh.ev.on('contacts.set', (item:any) => console.log(`recv ${item.contacts.length} contacts`))

	bnh.ev.on('messages.upsert', async (m:any)=> {
		console.log(JSON.stringify(m, undefined, 2))
        
		const msg = m.messages[0]
        
	})
let m:any
	
	bnh.ev.on('connection.update', (update:any) => {
		const { connection, lastDisconnect } = update;
        if (connection === 'connecting') {
            console.log(color('[SYS]', '#009FFF'), color(moment().format('DD/MM/YY HH:mm:ss'), '#A1FFCE'), color(`Bnh is Authenticating...`, '#f12711'));
        } else if (connection === 'close') {
            const log = (msg:any) => console.log(color('[SYS]', '#009FFF'), color(moment().format('DD/MM/YY HH:mm:ss'), '#A1FFCE'), color(msg, '#f64f59'));
            const statusCode = lastDisconnect.error ? new Boom(lastDisconnect)?.output.statusCode : 0;

            console.log(lastDisconnect.error);
            if (statusCode === DisconnectReason.badSession) { log(`You didnt scan qr code`); start(); }
            else if (statusCode === DisconnectReason.connectionClosed) { log('Connection closed, reconnecting....'); start() }
            else if (statusCode === DisconnectReason.connectionLost) { log('Connection lost, reconnecting....'); start() }
            else if (statusCode === DisconnectReason.connectionReplaced) { log('Connection Replaced, Another New Session Opened, Please Close Current Session First'); process.exit() }
            else if (statusCode === DisconnectReason.loggedOut) { log(`Device Logged Out, Please Delete session.json and Scan Again.`); process.exit(); }
            else if (statusCode === DisconnectReason.restartRequired) { log('Restart required, restarting...'); start(); }
            else if (statusCode === DisconnectReason.timedOut) { log('Connection timedOut, reconnecting...'); start(); }
            else {
                console.log(lastDisconnect.error); start()
            }
        } else if (connection === 'open') {
            console.log(color('[SYS]', '#009FFF'), color(moment().format('DD/MM/YY HH:mm:ss'), '#A1FFCE'), color(`Bnh is now Connected...`, '#38ef7d'));
        }
    });
	// listen for when the auth credentials is updated
	bnh.ev.on('creds.update', saveState)
	store.bind(bnh.ev)
let q:any

    bnh.ev.on('messages.upsert', async (msg:any) => {
        try {
           

          let client:any   
let sock : AnyWASocket
    let from:any  
    
            let msgType:any
            let type = client.msgType = getContentType(m.message);
            const body = (type === 'conversation') ? m.message.conversation : (type == 'imageMessage') ? m.message.imageMessage.caption : (type == 'videoMessage') ? m.message.videoMessage.caption : (type == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (m.message.listResponseMessage.singleSelectReply.selectedRowId || m.message.buttonsResponseMessage.selectedButtonId || m.text) : ''
            let t = client.timestamp = m.messageTimestamp
            let isGroupMsg = isJidGroup(from)
            let sender = m.sender
            const isOwner = (sender)
            let pushname = client.pushname = m.pushName
            const botNumber = bnh.user.id
            const groupId = isGroupMsg ? from : ''
            let groupMetadata = await bnh.groupMetadata(groupId) 
            let groupMembers = isGroupMsg ? groupMetadata.participants : []
            let groupAdmins = groupMembers.filter(v => v.admin !== null).map(x => x.id)
            let isGroupAdmin = groupAdmins.includes(sender)
            let isBotGroupAdmin = groupAdmins.includes(jidNormalizedUser(botNumber))
            let formattedTitle = isGroupMsg ? groupMetadata.subject : ''
            const prefix = '#'
            const arg = body.substring(body.indexOf(' ') + 1)
            let args = body.trim().split(/ +/).slice(1);
            let flags = [];
            let isCmd = client.isCmd = body.startsWith(prefix);
            let cmd = client.cmd = isCmd ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null
            let url = args.length !== 0 ? args[0] : '';

            for (let i of args) {
                if (i.startsWith('--')) flags.push(i.slice(2).toLowerCase())
            }

            const logEvent = (text: any) => {
                if (!isGroupMsg) {
                    console.log(bgColor(color('[EXEC]', 'black'), '#38ef7d'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), '#A1FFCE'), gradient.summer(`[${text}]`), bgColor(color(type, 'black'), 'cyan'), '~> from', gradient.cristal(pushname))
                }
                if (isGroupMsg) {
                    console.log(bgColor(color('[EXEC]', 'black'), '#38ef7d'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), '#A1FFCE'), gradient.summer(`[${text}]`), bgColor(color(type, 'black'), 'cyan'), '~> from', gradient.cristal(pushname), 'in', gradient.fruit(formattedTitle))
                }
            }

            // store user jid to json file
            if (isCmd) {
                if (isGroupMsg) {
                    if (!chatsJid.some(((x: any) => x == from))) {
                        chatsJid.push(from)
                        fs.writeFileSync('./db/usersJid.json', JSON.stringify(chatsJid), 'utf-8')
                    }
                }
                if (!chatsJid.some(((x: any) => x == sender))) {
                    chatsJid.push(sender)
                    fs.writeFileSync('./db/usersJid.json', JSON.stringify(chatsJid), 'utf-8')
                }
            }
  

    } catch (err) {
        console.log(err)
        
    
    }
})}
start()
  
