import { test }                                from "@japa/runner"
import { memberModel, tenderModel, userModel } from "App/Common/model";
import { Success }                             from "@sofiakb/adonis-response";
import MemberAttributes                        from "QRCP/Sphere/Member/MemberAttributes";
import MemberService                           from "QRCP/Sphere/Member/MemberService";
import Member                                  from "QRCP/Sphere/Member/Member";
import TenderAttributes                        from "QRCP/Sphere/Tender/TenderAttributes";
import moment                                  from "moment";
import Tender                                  from "QRCP/Sphere/Tender/Tender";
import TenderService                           from "QRCP/Sphere/Tender/TenderService";

test.group("Tenders 00 create", () => {


    test("Init tender test", async ({ assert }) => {

        const memberAttributes: MemberAttributes = {
            activityId : "",
            certificate: "",
            companyName: "",
            email      : "sofiane.akbly.tender@qrcode-protect.com",
            firstname  : "adhérent",
            lastname   : "test",
            phone      : undefined,
            siret      : "",
            id         : "member-test-create-tender"
        }

        const memberService = new MemberService()
        const memberServiceResult = await memberService.store(new Member(memberAttributes))
        const member: Member | any = memberServiceResult.data

        assert.isNotNull(memberServiceResult);
        assert.instanceOf(memberServiceResult, Success);
        assert.instanceOf(member, Member)


        test("Store tender", async ({ assert }) => {

            const attributes: TenderAttributes = {
                address    : {
                    id           : "address-tender",
                    street_number: 335,
                    address      : "rue boulevard hayez",
                    address2     : "appartement 142",
                    zipcode      : "59500",
                    city         : "douai",
                },
                amount     : 100,
                beginAt    : moment(),
                description: "description",
                endAt      : moment(),
                file       : "",
                tender     : null,
                member,
                reporter   : "test-id"
            }

            const tender: Tender | null = await tenderModel().store(attributes)

            assert.isNotNull(tender);
            assert.instanceOf(tender, Tender);
            assert.equal(tender?.description, "description");
            assert.equal(tender?.amount, 100);
        }).tags([ "create-tender" ]);

        test("Store tender service", async ({ assert }) => {

            const attributes: TenderAttributes = {
                address    : {
                    id           : "address-tender",
                    street_number: 335,
                    address      : "rue boulevard hayez",
                    address2     : "appartement 142",
                    zipcode      : "59500",
                    city         : "douai",
                },
                amount     : 100,
                beginAt    : moment(),
                description: "description",
                endAt      : moment(),
                file       : "",
                tender     : null,
                member,
            }

            const tenderService = new TenderService()
            const tenderServiceResult = await tenderService.store(attributes, { tender: null }, "test-id")

            const tender = tenderServiceResult.data

            assert.isNotNull(tenderServiceResult);
            assert.instanceOf(tenderServiceResult, Success);
            assert.isNotNull(tender);
            assert.instanceOf(tender, Tender);
            assert.equal(tender?.description, "description");
        }).tags([ "create-tender" ]);

        test("Clean member & partner & conversation", async () => {
            await memberModel().delete(member.id)
            await userModel().delete(member.uid)
        }).tags([ "create-tender" ]);

    }).tags([ "create-tender" ]);


})
