import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema.js";
import { eq, isNotNull, like, desc, and } from "drizzle-orm";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL");
    return;
  }
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection, { schema, mode: "default" });

  const slots = await db.select().from(schema.auctionSlots).where(isNotNull(schema.auctionSlots.groupId));
  
  const seen = new Set();
  const duplicateSlots = [];
  for (const slot of slots) {
     if (seen.has(slot.leaderUserId)) {
        duplicateSlots.push(slot.id);
     }
     seen.add(slot.leaderUserId);
  }
  
  for (const id of duplicateSlots) {
     console.log(`Cleaning slot ${id}`);
     await db.update(schema.auctionSlots).set({ groupId: null, leaderUserId: null, leaderUsername: "-", currentBid: "0 GRAM", bidAmount: 0 }).where(eq(schema.auctionSlots.id, id));
  }
  console.log(`Cleared ${duplicateSlots.length} duplicate slots.`);

  // Also let's clear bad groups just in case
  const badGroups = await db.select().from(schema.groupsCatalog).where(like(schema.groupsCatalog.title, "%-%"));
  for (const g of badGroups) {
      console.log(`Deleting group ${g.id} ${g.title}`);
      await db.delete(schema.groupsCatalog).where(eq(schema.groupsCatalog.id, g.id));
  }

  await connection.end();
}
run().catch(console.error);
