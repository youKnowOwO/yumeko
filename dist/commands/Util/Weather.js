"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const discord_js_1 = require("discord.js");
const decorators_1 = require("@yumeko/decorators");
const cheerio_1 = require("cheerio");
const common_tags_1 = require("common-tags");
let default_1 = class extends Command_1.default {
    async exec(msg, { location }) {
        const weather = await this.getWeather(location);
        if (!weather)
            return msg.ctx.send("🚫 No result found");
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.client.config.color)
            .setAuthor(`${weather.skytext}`, weather.icon)
            .setDescription(common_tags_1.stripIndents `
                Location: **${weather.observationpoint}**
                Temprature: **${weather.temperature} ${weather.degree}**
                Feels Like: **${weather.feelslike} ${weather.degree}**
                Humidity: **${weather.humidity}**
                Precip: **${weather.precip}**
                Windspeed: **${weather.windspeed}**
            `);
        return msg.ctx.send(embed);
    }
    async getWeather(location, degree = "C") {
        degree = degree.toUpperCase();
        try {
            const { text } = await node_superfetch_1.default.get("http://weather.service.msn.com/find.aspx")
                .query({
                src: "outlook",
                weadegreetype: degree,
                culture: "en-US",
                weasearchstr: location
            });
            const $ = cheerio_1.load(text);
            const data = $("weatherdata > weather").first();
            const result = data.find("current").first().attr();
            if (!result.observationpoint)
                return undefined;
            result.icon = `http://blob.weather.microsoft.com/static/weather4/en-us/law/${result.skycode}.gif`;
            data.find("forecast").each((_, e) => {
                const { date, precip } = $(e).attr();
                if (date !== result.date)
                    return undefined;
                result.precip = `${precip}%`;
            });
            result.temperature = Number(result.temperature);
            result.feelslike = Number(result.feelslike);
            result.humidity = `${result.humidity}%`;
            result.degree = `°${degree}`;
            return result;
        }
        catch {
            return undefined;
        }
    }
};
default_1 = __decorate([
    decorators_1.DeclareCommand("weather", {
        aliases: ["weather"],
        description: {
            content: "Check The weather status in the location",
            usage: "weather <location>",
            examples: ["weather japan"]
        },
        category: "utility",
        args: [
            {
                identifier: "location",
                match: "rest",
                type: "string",
                prompt: "Which location do you want to know ?"
            }
        ]
    })
], default_1);
exports.default = default_1;
