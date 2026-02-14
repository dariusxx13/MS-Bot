const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  PermissionsBitField 
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: ["CHANNEL"]
});

// Your ID for ticket permissions
const OWNER_ID = "1013465647226835055";

// =================== READY ===================
client.on("clientReady", () => {
  console.log(`✅ Bot is online! Logged in as ${client.user.tag}`);
});

// =================== MESSAGE LISTENER ===================
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return; // ignore bots

  // =================== !pay ===================
  if (msg.content === "!pay") {
    const embed = new EmbedBuilder()
      .setColor("#009cde")
      .setTitle("💳 PAYMENT METHODS")
      .setImage("https://www.paypalobjects.com/webstatic/en_ZA/mktg/bnr/CEMEA_B2B_banners_revamp_offering_988x383_18mar_EN.jpg")
      .setDescription(`
━━━━━━━━━━━━━━━━━━━
### 💳 CARD PAYMENT
✅ Visa / Mastercard  
⚡ Instant & secure  
> *(Картой)*

### 🎁 GIFT CARDS
🎮 Steam / PayPal / USDT  
⚡ Instant delivery  
> *(Подарочные карты)*

### 💰 PAYPAL
🌍 Trusted worldwide  
🔒 Buyer protection  
> *(Пэйпал)*

🛒 Open a ticket to purchase  
> *(Откройте тикет для покупки)*  
⚡ Fast delivery guaranteed
`)
      .setFooter({ text: "Secure Payments • Trusted Service" });

    const buyButton = new ButtonBuilder()
      .setLabel("🛒 BUY NOW")
      .setEmoji("💳")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discord.com/channels/1471933918889512994/1471947343463977053");

    const row = new ActionRowBuilder().addComponents(buyButton);

    msg.channel.send({ embeds: [embed], components: [row] });
  }

  // =================== !faq ===================
  if (msg.content === "!faq") {
    const faqEmbed = new EmbedBuilder()
      .setColor("#f5a623")
      .setTitle("❓ FAQ")
      .setDescription(`
━━━━━━━━━━━━━━━━━━━
### 🛍 Products
**1️⃣ Is this a scam?**  
✅ We have video proofs with each product taken entirely by us. Refund if missing.  
> *(У нас есть видео подтверждения, возврат при проблеме.)*

**2️⃣ How fast do I get the product?**  
⚡ Delivered instantly, worst case 1 hour.  
> *(Доставляется мгновенно, максимум 1 час.)*

━━━━━━━━━━━━━━━━━━━
### ⚡ Services
**1️⃣ Can I pay after the service?**  
💳 Payment before completion.  
> *(Оплата до завершения сервиса.)*

**2️⃣ Chance to get banned for boosting?**  
🛡 <0.5%, VPN and safety measures.  
> *(Риск бана <0.5%, VPN и меры безопасности.)*
`)
      .setFooter({ text: "Premium Support • Trusted Service" });

    const faqButton = new ButtonBuilder()
      .setLabel("🛎 Open Ticket")
      .setEmoji("📩")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discord.com/channels/1471933918889512994/1471947343463977053");

    const row = new ActionRowBuilder().addComponents(faqButton);
    msg.channel.send({ embeds: [faqEmbed], components: [row] });
  }

  // =================== !rm ===================
  if (msg.content.toLowerCase() === "!rm") {
    const filter = m => m.author.id === msg.author.id;
    const channel = msg.channel;

    try {
      await channel.send("**💎 Review Maker | Let's create your premium review!**\nStep 1: Enter your **name / nickname**");
      const nameCollector = await channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
      const reviewerName = nameCollector.first().content;

      await channel.send("Step 2: Enter your **stars** (1-5)");
      const starsCollector = await channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
      let starsNum = parseInt(starsCollector.first().content);
      if (isNaN(starsNum) || starsNum < 1 || starsNum > 5) starsNum = 5;
      const stars = "⭐".repeat(starsNum);

      await channel.send("Step 3: Enter **order amount** (e.g., $38)");
      const amountCollector = await channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
      const orderAmount = amountCollector.first().content;

      await channel.send("Step 4: Enter your **review message**");
      const messageCollector = await channel.awaitMessages({ filter, max: 1, time: 120000, errors: ['time'] });
      const reviewMessage = messageCollector.first().content;

      const reviewEmbed = new EmbedBuilder()
        .setColor("#FFD700")
        .setTitle(`💬 Opinion by ${reviewerName}`)
        .setDescription(`
━━━━━━━━━━━━━━━━━━━━━━
**🌟 Stars:** ${stars} (${starsNum}/5)

**💰 Order Amount:** ${orderAmount}

**📝 Review Message:**
\`\`\`
${reviewMessage}
\`\`\`
━━━━━━━━━━━━━━━━━━━━━━
`)
        .setFooter({ text: `Submitted by ${msg.author.username} • Thank you for your feedback!` });

      const targetChannel = await client.channels.fetch("1471944843591680103");
      if (targetChannel?.isTextBased()) {
        await targetChannel.send({ embeds: [reviewEmbed] });
        await channel.send("✅ Your premium review has been successfully submitted!");
      } else {
        await channel.send("⚠ Could not find the review channel.");
      }

    } catch (err) {
      console.log(err);
      channel.send("⏰ You took too long. Review cancelled.");
    }
  }
});

// =================== ULTRA PRO TICKET SYSTEM ===================
const TICKET_CATEGORY = "1471947208763899904";

// ================= TICKET COMMAND =================
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  if (msg.content.toLowerCase() === "!ticket") {

    const ticketPanel = new EmbedBuilder()
      .setColor("#00BFFF")
      .setTitle("🎫 Open to Buy (Открыть для покупки)")
      .setImage("https://i.pinimg.com/736x/cf/ec/78/cfec78083dac39c0a7350989b88ba51a.jpg")
      .setDescription(`
━━━━━━━━━━━━━━━━━━━━━━

**Please choose your ticket type below**

🛒 **Products**  
For purchasing cheap cheats.
> *(Для покупки товаров)*

⚡ **Services**  
For boosting, guides, or service requests.  
> *(Для сервисов)*

━━━━━━━━━━━━━━━━━━━━━━
Our team will assist you shortly
`)
      .setFooter({ text: "Premium Support • Trusted Service" });

    const productsBtn = new ButtonBuilder()
      .setCustomId("ticket_products")
      .setLabel("Products")
      .setStyle(ButtonStyle.Primary);

    const servicesBtn = new ButtonBuilder()
      .setCustomId("ticket_services")
      .setLabel("Services")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(productsBtn, servicesBtn);

    msg.channel.send({ embeds: [ticketPanel], components: [row] });
  }
});


// ================= GLOBAL BUTTON HANDLER =================
client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;

  // ===== CREATE TICKET =====
  if (interaction.customId === "ticket_products" || interaction.customId === "ticket_services") {

    await interaction.deferReply({ ephemeral: true });

    const type = interaction.customId === "ticket_products" ? "products" : "services";

    // Prevent duplicate ticket
    const existing = interaction.guild.channels.cache.find(
      c => c.name === `${type}-${interaction.user.username}`
    );

    if (existing) {
      return interaction.editReply({ content: `❌ You already have a ticket: ${existing}` });
    }

    const ticketChannel = await interaction.guild.channels.create({
      name: `${type}-${interaction.user.username}`,
      type: 0,
      parent: TICKET_CATEGORY,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
        },
        {
          id: OWNER_ID,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
        },
        {
          id: interaction.client.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
        }
      ]
    });

    const welcome = new EmbedBuilder()
      .setColor("#00BFFF")
      .setTitle("🎫 Ticket Created Successfully")
      .setImage("https://i.pinimg.com/736x/cf/ec/78/cfec78083dac39c0a7350989b88ba51a.jpg")
      .setDescription(`
━━━━━━━━━━━━━━━━━━━━━━

Hello ${interaction.user} 👋

Please describe your request clearly.

⚡ Our team will respond shortly  
🚫 Do NOT spam  
📩 Stay in this ticket until resolved

━━━━━━━━━━━━━━━━━━━━━━
`);

    const closeBtn = new ButtonBuilder()
      .setCustomId("close_ticket")
      .setLabel("Close Ticket")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(closeBtn);

    await ticketChannel.send({ embeds: [welcome] });
    await ticketChannel.send({ components: [row] });

    interaction.editReply({ content: `✅ Ticket created: ${ticketChannel}` });
  }


  // ===== CLOSE TICKET =====
  if (interaction.customId === "close_ticket") {

    await interaction.deferReply({ ephemeral: true });

    const channel = interaction.channel;

    const closingEmbed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("🔒 Ticket Closing")
      .setDescription(`
━━━━━━━━━━━━━━━━━━━━━━

This ticket will be deleted in **5 seconds**

Thank you for using our service 💎

━━━━━━━━━━━━━━━━━━━━━━
`);

    await channel.send({ embeds: [closingEmbed] });

    interaction.editReply({ content: "Ticket closing..." });

    setTimeout(() => {
      channel.delete().catch(() => {});
    }, 5000);
  }
});
// =================== LOGIN ===================
client.login("MTQ3MjEzOTY4MDE3MzY1ODExMw.GIVdDZ.Fe_R6wDpVSoOfWoY4gXDTNdBF1SWyLLQtxi1A8");