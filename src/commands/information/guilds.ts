import { Command, CommandCategories }                    from "../../handlers/command";
import { SlashCommandBuilder }                           from "@discordjs/builders";
import { CommandInteraction, Guild, MessageEmbed, User } from "discord.js";
import { Vibey }                                         from "../../handlers/client";

export default class Guilds extends Command {
    public category: CommandCategories = "INFORMATION";

    builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("guilds")
            .setDescription("Get the total guilds I am in.");
    }

    async handle( interaction: CommandInteraction, client: Vibey ) {
        try {
            const guilds: Array<any> = [];

            client.guilds.cache.forEach(( g: Guild )=>{
                let user: ( User | undefined ) = client.users.cache.get(g.ownerId);
                guilds.push(new Object({ name: g.name, owner: user?.username + "#" + user?.discriminator }));
            });

            const embed: MessageEmbed = new MessageEmbed()
                .setTitle("Total Guilds")
                .setColor("RANDOM")
                .setTimestamp()
                .setDescription(`\`\`\`${ guilds.map(a=>a.name + " - " + a.owner).join("\n") }\`\`\``);

            await interaction.reply({ embeds: [ embed ] });
        } catch( e: any ) {
            await interaction.reply({
                content  : "There was an error in executing the command. I have told the developers about it.",
                ephemeral: true
            });
            return;
        }
    }
}