const fs = require("fs");
const Twitter = require("twitter-lite");

async function updateTweet() {
 const client = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
 });

 try {
  const userTweets = await client.get("statuses/user_timeline", {
   screen_name: "blockenddev", // Twitter kullanıcı adınız
   count: 1,
  });

  if (userTweets && userTweets[0]) {
   const latestTweet = userTweets[0].text;

   const readmeContent = `##🐦 Latest Tweet \n${latestTweet}\n`;

   fs.writeFileSync("README.md", readmeContent, "utf-8");
   console.log("README.md updated with the latest tweet.");
  }
 } catch (error) {
  console.error("Error updating tweet in README:", error);
 }
}

updateTweet();
