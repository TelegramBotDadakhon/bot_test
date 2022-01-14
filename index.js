const moment = require('moment');
const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, newGameOptions} = require('./options')

const token = '5026372571:AAGD0xtHlpuEKODJmEt7SDRv5op7rSZ6Dfg';

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatID) => {
    await bot.sendMessage(chatID, 'Сейчас я загадаю цифру от 0 до 9, а ты разгадай?')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatID] = randomNumber;
    await bot.sendMessage(chatID, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
    { command: '/start', description: 'Start' },
    { command: '/info', description: 'Your Name!' }, 
    { command: '/time', description: 'Time' },
    { command: '/game', description: 'Play'}
    ])

    bot.on('message', async msg => {
        const name = msg.from.first_name + ' ' + msg.from.last_name
        const last = Object.keys(msg).pop()
        const time = moment(msg[last].date).format('MMMM Do YYYY, h:mm:ss a')
        const text = msg.text
        const chatID = msg.chat.id
        console.log(msg);
        if (text === '/start') {
           await bot.sendMessage(chatID, '🌸')
           return bot.sendMessage(chatID, 'Добро пожаловать! Рад вас слишать! Вы на моем Телеграм-Боте! Спросите меня о чем угодно? Если не бот не ответит сразу => Оно объзательно ответит через некоторое время!')
        }
        if (text === '/info') {
           return bot.sendMessage(chatID, `Вас зовут ${name}, `)
        }
        if (text === '/time') {
            return bot.sendMessage(chatID, `Сейчас время: ${time}`)
        }
        if (text === '/game') {
            return startGame(chatID)
        }
        // bot.sendMessage(chatID, `Your write ${text}`)
        return bot.sendMessage(chatID, 'No commands found')

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatID = msg.message.chat.id
        if (data === '/again') {
            return startGame(chatID)
        }
        if (data === chats[chatID]) {
            return bot.sendSticker(chatID, 'https://tlgrm.ru/_/stickers/07b/eff/07beff76-e692-39e9-8d88-5fc7050cebea/3.webp') && bot.sendMessage(chatID, `Поздравляю, ты отгадал эту цифру: ${chats[chatID]}`, newGameOptions)
        } else {
            return bot.sendSticker(chatID, 'https://tlgrm.ru/_/stickers/07b/eff/07beff76-e692-39e9-8d88-5fc7050cebea/4.webp') && bot.sendMessage(chatID, `К сожалени. ты не угадал, бот загадал цифру: ${chats[chatID]}`, newGameOptions)
        }

    })
   
}

start();