import { Command, CommandCategories }       from "../../handlers/command";
import { SlashCommandBuilder }              from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Vibey }                            from "../../handlers/client";
import axios, { AxiosResponse }             from "axios";

export default class Dog extends Command {
    public category: CommandCategories = "API";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("dog")
            .setDescription("Receive a random Dog picture from the internet. 🐶 ");
    }

    async handle( interaction: CommandInteraction, client: Vibey ): Promise<void> {
        try {
            const res: AxiosResponse<any> = await axios.get<string>(process.env.DOG_API as string);

            const embed: MessageEmbed = new MessageEmbed()
                .setTitle(":dog:")
                .setTimestamp()
                .setColor("RANDOM")
                .setImage(res.data.message as string);

            await interaction.reply({ embeds: [ embed ] });
        } catch( e ) {
            await interaction.reply({
                content  : "There was an error in executing the command. I have told the developers about it.",
                ephemeral: true
            });
            return;
        }
    }
}