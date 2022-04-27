import { Command, CommandCategories }                  from "../../handlers/command";
import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CommandInteraction, User }                    from "discord.js";
import { Vibey }                                       from "../../handlers/client";
import axios, { AxiosResponse }                        from "axios";

export default class Compliment extends Command {
    public category: CommandCategories = "API";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("compliment")
            .setDescription("Compliment someone!")
            .addUserOption(( user: SlashCommandUserOption )=>
                user
                    .setName("user")
                    .setRequired(false)
                    .setDescription("The user to compliment")
            );
    }

    async handle( interaction: CommandInteraction, client: Vibey ) {
        const user: ( User | null ) = interaction.options.getUser("user");

        try {
            const res: AxiosResponse<any> = await axios.get<string>(process.env.COMPLIMENT_API as string);

            if( user ) {
                await interaction.reply(`<@!${ user.id }>, ${ res.data.compliment }`);
            }

            await interaction.reply(res.data.compliment);
        } catch( e ) {
            await interaction.reply({
                content  : "There was an error in executing the command. I have told the developers about it.",
                ephemeral: true
            });
            return;
        }
    }
}