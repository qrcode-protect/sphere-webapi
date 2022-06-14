import { test }               from "@japa/runner"
import { conversationModel }  from "App/Common/model";
import Conversation           from "QRCP/Sphere/_Chat/Conversation/Conversation";
import ConversationAttributes from "QRCP/Sphere/_Chat/Conversation/ConversationAttributes";
import ConversationService    from "QRCP/Sphere/_Chat/Conversation/ConversationService";
import { Success }            from "@sofiakb/adonis-response";

const userId = "user-id-test"
test.group("Conversations 00 create", () => {
    test("Store conversation", async ({ assert }) => {


        const attributes: ConversationAttributes = {
            users      : [ "ttotototo", userId ],
            userCreator: userId
        }

        const conversation: Conversation | null = await conversationModel().store(attributes)

        assert.isNotNull(conversation);
        assert.instanceOf(conversation, Conversation);
    });

    test("Store conversation service", async ({ assert }) => {
        const memberId = userId
        const partnerId = "test-conversation-partner-id"

        const attributes: ConversationAttributes = {
            users      : [ partnerId, memberId ],
            userCreator: memberId
        }

        const conversationService = new ConversationService()
        const conversationServiceResult = await conversationService.store(attributes, memberId)

        const conversation = conversationServiceResult.data

        assert.isNotNull(conversationServiceResult);
        assert.instanceOf(conversationServiceResult, Success);
        assert.isNotNull(conversation);
        assert.instanceOf(conversation, Conversation);
    });

})
