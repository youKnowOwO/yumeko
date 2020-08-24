import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import { Message, MessageEmbed } from "discord.js";
import { DeclareCommand } from "@yumeko/decorators";
import { load } from "cheerio";
import { stripIndents } from "common-tags";

interface WeatherResponseCurrent {
    temperature: number;
    skycode: string;
    skytext: string;
    date: string;
    observationtime: string;
    observationpoint: string;
    feelslike: number;
    humidity: string;
    winddisplay: string;
    day: string;
    shortday: string;
    windspeed: string;
    icon: string;
    precip: string;
    degree: string;
}

@DeclareCommand("weather", {
    aliases: ["weather"],
    description: {
        content: "Check The weather status in the location",
        usage: "weather <location>",
        examples: ["weather japan"]
    },
    category: "util",
    args: [
        {
            identifier: "location",
            match: "rest",
            type: "string",
            prompt: "Which location do you want to know ?"
        }
    ]
})
export default class WeatherCommand extends Command {
    public async exec(msg: Message, { location }: { location: string }): Promise<Message> {
        const weather = await this.getWeather(location);
        if (!weather) return msg.ctx.send("🚫 No result found");
        const embed = new MessageEmbed()
            .setColor(this.client.config.color)
            .setAuthor(`${weather.skytext}`, weather.icon)
            .setDescription(stripIndents`
                Location: **${weather.observationpoint}**
                Temprature: **${weather.temperature} ${weather.degree}**
                Feels Like: **${weather.feelslike} ${weather.degree}**
                Humidity: **${weather.humidity}**
                Precip: **${weather.precip}**
                Windspeed: **${weather.windspeed}**
            `);
        return msg.ctx.send(embed);
    }

    public async getWeather(location: string, degree = "C"): Promise<WeatherResponseCurrent | void> {
        degree = degree.toUpperCase();
        try {
            const { text } = await request.get("http://weather.service.msn.com/find.aspx")
                .query({
                    src: "outlook",
                    weadegreetype: degree,
                    culture: "en-US",
                    weasearchstr: location
                });
            const $ = load(text);
            const data = $("weatherdata > weather").first();
            const result: WeatherResponseCurrent = data.find("current").first().attr() as any;
            if (!result.observationpoint) return undefined;
            result.icon = `http://blob.weather.microsoft.com/static/weather4/en-us/law/${result.skycode}.gif`;
            data.find("forecast").each((_, e) => {
                const { date, precip } = $(e).attr();
                if (date !== result.date) return undefined;
                result.precip = `${precip}%`;
            });
            result.temperature = Number(result.temperature);
            result.feelslike = Number(result.feelslike);
            result.humidity = `${result.humidity}%`;
            result.degree = `°${degree}`;
            return result;
        } catch {
            return undefined;
        }
    }
}