// import { test }          from "@japa/runner"
// import Conversation          from "QRCP/Sphere/_Chat/Conversation/Conversation";
// import { conversationModel } from "App/Common/model";
// import Env               from "@ioc:Adonis/Core/Env";
// import Drive             from "@ioc:Adonis/Core/Drive";
// import moment            from "moment";
//
// test.group("Conversations 99 cleanup", () => {
//     test("Cleanup conversation", async ({ assert }) => {
//
//         if (Env.get("NODE_ENV") === "test") {
//             const conversations: Conversation[] = await conversationModel().all()
//
//             if (conversations.length > 0) {
//
//                 await Drive.put(`backup/conversations/${moment().format("YYYYMMDDHHmmss")}.json`, JSON.stringify(conversations))
//
//                 for (const conversation of conversations) {
//                     assert.isTrue(await conversationModel().delete(conversation.id));
//                 }
//             }
//         }
//     });
// })
