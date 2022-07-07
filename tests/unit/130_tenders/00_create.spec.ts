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

const tenderService = new TenderService()

const tenderStoreService = async (member: Member) => {
    const attributes: TenderAttributes = {
        title      : "Test tender",
        address    : {
            id           : "address-tender",
            street_number: 335,
            address      : "rue boulevard hayez",
            address2     : "appartement 142",
            zipcode      : "59500",
            city         : "douai",
            lat          : 0,
            lng          : 0
        },
        amount     : 100,
        beginAt    : moment(),
        description: "description",
        endAt      : moment(),
        file       : "",
        tender     : null,
        member,
    }

    return await tenderService.store(attributes, { tender: null }, "test-id")
}


const testStoreService = (tenderServiceResult, tender, { assert }): boolean => {

    try {
        assert.isNotNull(tenderServiceResult);
        assert.instanceOf(tenderServiceResult, Success);
        assert.isNotNull(tender);
        assert.instanceOf(tender, Tender);
        assert.equal(tender?.description, "description");
        assert.isFalse(tender.active);
        assert.isFalse(tender.available);
        return true
    } catch (e) {
        return false
    }
}

const fetchTender = async (tender: Tender) => tender.id ? await tenderModel().findOneBy("id", tender.id) : null

test.group("Tenders 00 create", () => {


    test("Init tender test", async ({ assert }) => {

        const memberAttributes: MemberAttributes = {
            premium: true,
            activityId : "",
            certificate: "",
            companyName: "",
            email      : "sofiane.akbly.tender@qrcode-protect.com",
            firstname  : "adhérent",
            lastname   : "test",
            phone      : undefined,
            siret      : "",
            id         : "member-test-tender-unit"
        }

        const memberService = new MemberService()
        const memberServiceResult = await memberService.store(new Member(memberAttributes))
        const member: Member | any = memberServiceResult.data

        assert.isNotNull(memberServiceResult);
        assert.instanceOf(memberServiceResult, Success);
        assert.instanceOf(member, Member)


        test("Store tender", async ({ assert }) => {

            const attributes: TenderAttributes = {
                title      : "Test tender",
                address    : {
                    id           : "address-tender",
                    street_number: 335,
                    address      : "rue boulevard hayez",
                    address2     : "appartement 142",
                    zipcode      : "59500",
                    city         : "douai",
                    lat          : 0,
                    lng          : 0
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
        }).tags([ "tender-unit" ]);

        test("Store tender service", async ({ assert }) => {

            const tenderServiceResult = await tenderStoreService(member)
            const tender = tenderServiceResult.data
            assert.isTrue(testStoreService(tenderServiceResult, tender, { assert }))

        }).tags([ "tender-unit" ]);


        test("Validate tender service", async ({ assert }) => {

            const tenderServiceResult = await tenderStoreService(member)
            const tender = tenderServiceResult.data
            assert.isTrue(testStoreService(tenderServiceResult, tender, { assert }))

            await tenderService.validate(tender.id)
            const tmpTender = (await fetchTender(tender))
            assert.isNotNull(tmpTender)
            assert.isTrue(tmpTender.active)
            assert.isTrue(tmpTender.available)
        }).tags([ "tender-unit" ]);

        test("Deny tender service", async ({ assert }) => {

            const tenderServiceResult = await tenderStoreService(member)
            const tender = tenderServiceResult.data
            assert.isTrue(testStoreService(tenderServiceResult, tender, { assert }))

            await tenderService.deny(tender.id)
            const tmpTender = (await fetchTender(tender))
            assert.isNull(tmpTender)
            // assert.isFalse(tmpTender.active)
            // assert.isFalse(tmpTender.available)
        }).tags([ "tender-unit" ]);

        test("Block tender service", async ({ assert }) => {

            const tenderServiceResult = await tenderStoreService(member)
            const tender = tenderServiceResult.data
            assert.isTrue(testStoreService(tenderServiceResult, tender, { assert }))

            await tenderService.block(tender.id)
            const tmpTender = (await fetchTender(tender))
            assert.isNotNull(tmpTender)
            assert.isFalse(tmpTender.available)
        }).tags([ "tender-unit" ]);

        test("Unblock tender service", async ({ assert }) => {

            const tenderServiceResult = await tenderStoreService(member)
            const tender = tenderServiceResult.data
            assert.isTrue(testStoreService(tenderServiceResult, tender, { assert }))

            await tenderService.unblock(tender.id)
            const tmpTender = (await fetchTender(tender))
            assert.isNotNull(tmpTender)
            assert.isTrue(tmpTender.available)
        }).tags([ "tender-unit" ]);

        test("Clean member & partner & conversation", async () => {
            await memberModel().delete(member.id)
            await userModel().delete(member.uid)
        }).tags([ "tender-unit" ]);

    }).tags([ "tender-unit" ]);


})
