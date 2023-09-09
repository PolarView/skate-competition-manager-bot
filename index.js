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

let isAdmin = false;

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

  let { data, error } = await supabase.from("competitions").select("admin_pass").single();

  if (message === data.admin_pass) isAdmin = true;
  console.log(isAdmin);
  if (isAdmin) {
    if (!message && message === "/start") {
      // Ignore non-text or empty messages
      return;
    }

    if (message === "/open_street_registration") {
      try {
        const { data, error } = await supabase
          .from("competitions")
          .update({ isStreetRegistrationOpen: true })
          .eq("isCurrent", true)
          .select();

        if (data) {
          await bot.sendMessage(chatId, "Регистрация стрит открыта");
        }
      } catch (err) {
        console.log(err, "during /open_street_registration");
      }
    }

    if (message === "/close_street_registration") {
      try {
        const { data, error } = await supabase
          .from("competitions")
          .update({ isStreetRegistrationOpen: false })
          .eq("isCurrent", true)
          .select();
        if (data) {
          await bot.sendMessage(chatId, "Регистрация стрит закрыта");
        }
      } catch (err) {
        console.log(err, "during /close_street_registration");
      }
    }

    if (message === "/close_park_registration") {
      try {
        const { data, error } = await supabase
          .from("competitions")
          .update({ isParkRegistrationOpen: false })
          .eq("isCurrent", true)
          .select();

        if (data) {
          await bot.sendMessage(chatId, "Регистрация парк закрыта");
        }
      } catch (err) {
        console.log(err, "during /close_park_registration");
      }
    }
    if (message === "/open_park_registration") {
      try {
        const { data, error } = await supabase
          .from("competitions")
          .update({ isParkRegistrationOpen: true })
          .eq("isCurrent", true)
          .select();

        if (data) {
          await bot.sendMessage(chatId, "Регистрация парк открыта");
        }
      } catch (err) {
        console.log(err, "during /open_park_registration");
      }
    }
  }
});

bot.on("callback_query", async (msg) => {
  const callBackQueryData = msg.data;
  const chatId = msg.message.chat.id;
});

console.log("Bot is running...");
