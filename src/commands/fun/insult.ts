import { Command, CommandCategories }                  from "../../handlers/command";
import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CommandInteraction, User }                    from "discord.js";
import { Vibey }                                       from "../../handlers/client";
import axios, { AxiosResponse }                        from "axios";

export default class Insult extends Command {
    public category: CommandCategories = "FUN";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("insult")
            .setDescription("Insult yourself or your dear ones.")
            .addUserOption(( user: SlashCommandUserOption )=>{
                return user
                    .setName("user")
                    .setDescription("The user you want to insult.")
                    .setRequired(false);
            });
    }

    async handle( interaction: CommandInteraction, client: Vibey ) {
        try {
            const res: AxiosResponse<any> = await axios.get<string>(process.env.INSULT_API as string);
            const user: ( User | null )   = interaction.options.getUser("user");

            if( user ) {
                await interaction.reply(`<@!${ user.id }>, ${ res.data.insult }`);
            }

            await interaction.reply(`${ res.data.insult }`);
        } catch( e ) {
            await interaction.reply({
                content  : "There was an error in executing the command. I have told the developers about it.",
                ephemeral: true
            });
            return;
        }
    }
}