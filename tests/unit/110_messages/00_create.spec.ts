import { test }               from "@japa/runner"
import { messageModel }  from "App/Common/model";
import Message           from "QRCP/Sphere/_Chat/Message/Message";
import MessageAttributes from "QRCP/Sphere/_Chat/Message/MessageAttributes";
import MessageService    from "QRCP/Sphere/_Chat/Message/MessageService";
import { Success }            from "@sofiakb/adonis-response";

const conversationId = "ttotototo--user-id-test"
const senderId = "user-id-test"

test.group("Messages 00 create", () => {
    test("Store message", async ({ assert }) => {

        const attributes: MessageAttributes = {
            content: "heyyyy cousin",
            sender: senderId,
            conversationId: conversationId
        }

        const message: Message | null = await messageModel().store(attributes)

        assert.isNotNull(message);
        assert.instanceOf(message, Message);
        assert.equal(message?.content, "heyyyy cousin");
        assert.equal(message?.sender, senderId);
    });

    test("Store message service", async ({ assert }) => {

        const attributes: MessageAttributes = {
            content: "heyyyy cousin 2",
            conversationId
        }

        const messageService = new MessageService()
        const messageServiceResult = await messageService.store(attributes, senderId)

        const message = messageServiceResult.data

        assert.isNotNull(messageServiceResult);
        assert.instanceOf(messageServiceResult, Success);
        assert.isNotNull(message);
        assert.instanceOf(message, Message);
        assert.equal(message?.content, "heyyyy cousin 2");
        assert.equal(message?.sender, senderId);
    });

})
