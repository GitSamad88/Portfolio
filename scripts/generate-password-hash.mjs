// Run with: npm run hash-password
// Type a password, get back a hash to paste into ADMIN_PASSWORD_HASH
// in your .env.local (and later, your Vercel project's env variables).

import readline from "node:readline";
import bcrypt from "bcryptjs";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("Choose your admin password: ", (password) => {
  if (!password || password.length < 6) {
    console.log("\nPlease use at least 6 characters. Run the command again.");
    rl.close();
    return;
  }
  const hash = bcrypt.hashSync(password, 10);
  const encoded = Buffer.from(hash, "utf8").toString("base64");
  console.log("\nAdd this line to your .env.local file:\n");
  console.log(`ADMIN_PASSWORD_HASH=${encoded}\n`);
  rl.close();
});
