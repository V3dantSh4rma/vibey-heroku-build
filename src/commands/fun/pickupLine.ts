import { Command, CommandCategories }                  from "../../handlers/command";
import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CommandInteraction, User }                    from "discord.js";
import { Vibey }                                       from "../../handlers/client";
import axios, { AxiosResponse }                        from "axios";

export default class PickupLine extends Command {

    public category: CommandCategories = "FUN";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("pickup_line")
            .setDescription("Receive a pickup line.")
            .addUserOption(( cmd: SlashCommandUserOption )=>
                cmd
                    .setName("user")
                    .setDescription("The user you want to use pickup lines on.")
                    .setRequired(false)
            );
    };

    async handle( interaction: CommandInteraction, client: Vibey ) {
        try {
            const res: AxiosResponse<any> = await axios.get<string>(process.env.PICKUPLINE_API as string);
            const user: ( User | null )   = interaction.options.getUser("user");

            if( user ) {
                await interaction.reply(`<@!${ user.id }>, ${ res.data.line }`);
            }

            await interaction.reply(`${ res.data.line }`);
        } catch( e ) {
            await interaction.reply({
                content  : "There was an error in executing the command. I have told the developers about it.",
                ephemeral: true
            });
            return;
        }
    }
}