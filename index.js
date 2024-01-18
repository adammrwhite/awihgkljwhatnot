const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const firebaseToken =
  "AAAAH3hEiJA:APA91bFbX59Z_yt08e23sx3iPB8saFGD9q_RWDcA_dW2Hz_TpyWQdHZ7iKufrTp9DckiiWcaFzGjFjcy8IwuwwBhjjoKahB8H6uJVOngvekOA7gx989VZd0wzLi32FKKs1ONVs6PmH3y";

app.post("/send-notification", (req, res) => {
  const deviceToken = req.body.deviceToken;

  // تأخير الإرسال لمدة دقيقة واحدة (60000 مللي ثانية)
  setTimeout(() => {
    axios
      .post(
        "https://fcm.googleapis.com/fcm/send",
        {
          to: deviceToken,
          notification: {
            title: "المراجعة الاولى",
            body: "افتح التطبيق لتراجع المراجعة الاولى",
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `key=${firebaseToken}`,
          },
        },
      )
      .then((response) => {
        // إرسال الإشعار الثاني بعد 15 ثانية
        setTimeout(() => {
          axios
            .post(
              "https://fcm.googleapis.com/fcm/send",
              {
                to: deviceToken,
                notification: {
                  title: "المراجعة الثانية",
                  body: "افتح التطبيق لتراجع المراجعة الثانية",
                },
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `key=${firebaseToken}`,
                },
              },
            )
            .then((secondResponse) => {
              // إرسال الإشعار الثالث بعد 35 ثانية
              setTimeout(() => {
                axios
                  .post(
                    "https://fcm.googleapis.com/fcm/send",
                    {
                      to: deviceToken,
                      notification: {
                        title: "المراجعة الثالثة",
                        body: "افتح التطبيق لتراجع المراجعة الثالثة",
                      },
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `key=${firebaseToken}`,
                      },
                    },
                  )
                  .then((thirdResponse) => {
                    res.send("Notification sent successfully three times");
                  })
                  .catch((thirdError) => {
                    res
                      .status(500)
                      .send("Error sending the third notification");
                  });
              }, 604800); // تأخير لمدة 35000 مللي ثانية (35 ثانية)
            })
            .catch((secondError) => {
              res.status(500).send("Error sending the second notification");
            });
        }, 345600); // تأخير لمدة 15000 مللي ثانية (15 ثانية)
      })
      .catch((error) => {
        res.status(500).send("Error sending notification");
      });
  }, 86400); // تأخير لمدة 60000 مللي ثانية (1 دقيقة)
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
