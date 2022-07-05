import { test }                                                                  from "@japa/runner"
import { conversationModel, memberModel, messageModel, partnerModel, userModel } from "App/Common/model";
import Message
                                                                                 from "QRCP/Sphere/_Chat/Message/Message";
import MessageAttributes
                                                                                 from "QRCP/Sphere/_Chat/Message/MessageAttributes";
import MessageService
                                                                                 from "QRCP/Sphere/_Chat/Message/MessageService";
import { Success }                                                               from "@sofiakb/adonis-response";

import MemberAttributes       from "QRCP/Sphere/Member/MemberAttributes";
import MemberService          from "QRCP/Sphere/Member/MemberService";
import Member                 from "QRCP/Sphere/Member/Member";
import PartnerAttributes      from "QRCP/Sphere/Partner/PartnerAttributes";
import PartnerService         from "QRCP/Sphere/Partner/PartnerService";
import Partner                from "QRCP/Sphere/Partner/Partner";
import Conversation           from "QRCP/Sphere/_Chat/Conversation/Conversation";
import ConversationAttributes from "QRCP/Sphere/_Chat/Conversation/ConversationAttributes";
import ConversationService    from "QRCP/Sphere/_Chat/Conversation/ConversationService";

test.group("Messages 00 create", () => {


    test("Init message test", async ({ assert }) => {

        const memberAttributes: MemberAttributes = {
            activityId : "",
            certificate: "",
            companyName: "",
            email      : "sofiane.akbly@qrcode-protect.com",
            firstname  : "adhérent",
            lastname   : "test",
            phone      : undefined,
            siret      : "",
            id         : "member-test-create-message"
        }

        const memberService = new MemberService()
        const memberServiceResult = await memberService.store(new Member(memberAttributes))
        const member: Member | any = memberServiceResult.data

        assert.isNotNull(memberServiceResult);
        assert.instanceOf(memberServiceResult, Success);
        assert.instanceOf(member, Member)

        const partnerAttributes: PartnerAttributes = {
            activityId : "",
            certificate: "",
            description: "",
            avatar: "",
            companyName: "",
            email      : "contact.sofiakb@gmail.com",
            firstname  : "partenaire",
            lastname   : "test",
            phone      : undefined,
            siret      : "",
            id         : "partner-test-create-message"
        }

        const partnerService = new PartnerService()
        const partnerServiceResult = await partnerService.store(new Partner(partnerAttributes))
        const partner: Partner | any = partnerServiceResult.data

        assert.isNotNull(partnerServiceResult);
        assert.instanceOf(partnerServiceResult, Success);
        assert.instanceOf(partner, Partner)

        const conversationAttributes: ConversationAttributes = {
            users      : [ partner.uid, member.uid ],
            userCreator: member.uid
        }

        const conversationService = new ConversationService()
        const conversationServiceResult = await conversationService.store(conversationAttributes, member.uid)

        const conversation = conversationServiceResult.data

        assert.isNotNull(conversationServiceResult);
        assert.instanceOf(conversationServiceResult, Success);
        assert.isNotNull(conversation);
        assert.instanceOf(conversation, Conversation);


        test("Store message", async ({ assert }) => {

            const attributes: MessageAttributes = {
                content       : "heyyyy cousin",
                sender        : member.uid,
                conversationId: conversation.id
            }

            const message: Message | null = await messageModel().store(attributes)

            assert.isNotNull(message);
            assert.instanceOf(message, Message);
            assert.equal(message?.content, "heyyyy cousin");
            assert.equal(message?.sender, member.uid);
        }).tags([ "create-message" ]);

        test("Store message service", async ({ assert }) => {

            const attributes: MessageAttributes = {
                content       : "heyyyy cousin 2",
                conversationId: conversation.id
            }

            const messageService = new MessageService()
            const messageServiceResult = await messageService.store(attributes, partner.uid)

            const message = messageServiceResult.data

            assert.isNotNull(messageServiceResult);
            assert.instanceOf(messageServiceResult, Success);
            assert.isNotNull(message);
            assert.instanceOf(message, Message);
            assert.equal(message?.content, "heyyyy cousin 2");
            assert.equal(message?.sender, partner.uid);
        }).tags([ "create-message" ]);

        test("Clean member & partner & conversation", async () => {
            await userModel().delete(member.uid)
            await userModel().delete(partner.uid)
            await memberModel().delete(member.id)
            await partnerModel().delete(partner.id)
            await conversationModel().delete(conversation.id)
        }).tags([ "create-message" ]);

    }).tags([ "create-message" ]);


})
