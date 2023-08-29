require("dotenv").config();
const fs = require("fs");
const Twitter = require("twitter-lite");

async function updateTweet() {
 const existingContent = fs.readFileSync("README.md", "utf-8");

 const client = new Twitter({
  version: "1.1", // API sürümünü belirtiyoruz
  extension: false,
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
 });

 console.log("Twitter client created with the following values:");
 console.log("Consumer Key:", process.env.TWITTER_API_KEY);
 console.log("Consumer Secret:", process.env.TWITTER_API_SECRET);
 console.log("Access Token Key:", process.env.TWITTER_ACCESS_TOKEN_KEY);
 console.log("Access Token Secret:", process.env.TWITTER_ACCESS_TOKEN_SECRET);
 try {
  const userTweet = await client.get(
   `users/show.json?user_id=1491506470948683777`
  );

  console.log(userTweet);
  const userTweetId = userTweet.status.id_str;
  const lastTweet = `https://twitter.com/blockenddev/status/${userTweetId}`;
  try {
   const response = await fetch("https://tweetpik.com/api/v2/images", {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
     authorization: `${process.env.TWEETPIK_API_KEY}`,
    },
    body: JSON.stringify({
     url: lastTweet,
     theme: "lightsOut",
     displayVerified: true,
     displayEmbeds: true,
     dimension: "autoHeight",
     contentWidth: 100,
     displayMetrics: true,
    }),
   });

   const data = await response.json();

   if (userTweet && userTweetId && data) {
    // Güncellemek istediğiniz kısmı bulun
    const startMarker = "## 🐦 Latest Tweet";
    const endMarker = "<!-- ![Last Tweet]() -->";

    const startIndex = existingContent.indexOf(startMarker);
    const endIndex = existingContent.indexOf(endMarker, startIndex);
    if (startIndex !== -1 && endIndex !== -1) {
     const newContent =
      existingContent.substring(0, startIndex) +
      "## 🐦 Latest Tweet \n" +
      `<a href="${lastTweet}" target="_blank"><img src="${data.url}" height=220 style="border-radius: 15px;"></a> \n` +
      existingContent.substring(endIndex);

     // README.md dosyasına yeni içeriği yazın
     fs.writeFileSync("README.md", newContent, "utf-8");
     console.log("README.md updated with the latest tweet.");
    } else {
     console.log("Tweet section not found in README.md");
    }
   }
   console.log(data);
  } catch (error) {
   console.log(error);
  }
 } catch (error) {
  console.error("Error updating tweet in README:", error);
 }
}

updateTweet();
