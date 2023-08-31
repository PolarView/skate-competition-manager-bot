const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const axios = require("axios");
const { google } = require("googleapis");
const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPERBASE_URL;
const supabaseKey = process.env.SUPERBASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

let auth;
let googleSheets;
let spreadsheetId;

const googleApiInitialize = async () => {
  // google api intiallization
  auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  googleSheets = google.sheets({ version: "v4", auth: client });

  spreadsheetId = "1eED-7pFb_yj_RlfDciCfr7NStskXmLunt2s9Yo4valo";
};

googleApiInitialize();

// Replace 'YOUR_BOT_TOKEN' with your actual bot token from BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

bot.setMyCommands([
  { command: "/create_competition", description: "Показать информацию о вас" },
  { command: "/close_park_registration", description: "Закрыть регистрацию в парке" },
  { command: "/open_park_registration", description: "Открыть регистрацию на улице" },
  { command: "/close_street_registration", description: "Закрыть регистрацию на улице" },
  { command: "/open_street_registration", description: "Открыть регистрацию на улице" },
  { command: "/show_all_participants", description: "Показать всех участников" },
  {
    command: "/is_participant_registered",
    description: "Проверить зарегистрирован ли участник по имени и фамилии или айди"
  }
]);

// Listen for incoming messages
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;

  if (message === "/start") {
    await bot.sendMessage(chatId, "hi");
  }

  if (message === "/createCompetition") {
    await bot.sendMessage(chatId, "hi");
  }

  if (!message && message === "/start") {
    // Ignore non-text or empty messages
    return;
  }
});

bot.on("callback_query", async (msg) => {
  const callBackQueryData = msg.data;
  const chatId = msg.message.chat.id;
});

console.log("Bot is running...");
