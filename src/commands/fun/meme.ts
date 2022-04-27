import { Command, CommandCategories }       from "../../handlers/command";
import { SlashCommandBuilder }              from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Vibey }                from "../../handlers/client";
import axios, { AxiosResponse } from "axios";


export default class Meme extends Command {
    public category: CommandCategories = 'FUN';

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName('meme')
            .setDescription('Generate a fresh meme from the internet.');
    };

    async handle( interaction: CommandInteraction, client: Vibey ) {
        try {
            const response: AxiosResponse<any> = await axios.get(`${process.env.REDDIT_API}wholesomememes`);
            await interaction.deferReply();

            const embed: MessageEmbed = new MessageEmbed()
                //.setAuthor(`${response.data.title}`, `${interaction.user.avatarURL()}`, `${response.data.postLink}`)
                .setTitle(response.data.title)
                .setImage(response.data.url as string)
                .setColor('RANDOM');

            await interaction.followUp({embeds: [embed]});
        } catch( e ) {
            await interaction.reply({
                content  : "There was an error in executing the command. I have told the developers about it.",
                ephemeral: true
            });
            return;
        }
    }
}