import { test }                from "@japa/runner"
import { memberModel }         from "App/Common/model";
import Member                  from "QRCP/Sphere/Member/Member";
import MemberAttributes        from "QRCP/Sphere/Member/MemberAttributes";
import DuplicateEntryException from "QRCP/Sphere/Exceptions/DuplicateEntryException";
import MemberService           from "QRCP/Sphere/Member/MemberService";
import { Success }             from "@sofiakb/adonis-response";

test.group("Members 00 create", () => {
    test("Store member", async ({ assert }) => {

        const attributes: MemberAttributes = {
            certificate: "", companyName: "qrcode-protect", siret: "",
            firstname  : "sOfi-àne",
            lastname   : "ak-bly",
            email      : "sofiane.AkblY@gmail.com",
            phone      : "+331.23.456.78/9",
            activityId : "strest"
        }

        const member = await memberModel().store(new Member(attributes))

        assert.isNotNull(member);
        assert.instanceOf(member, Member);
        assert.equal(member.firstname, "sofi-àne")
        assert.equal(member.lastname, "ak-bly")
        assert.equal(member.email, "sofiane.akbly@gmail.com")
        assert.equal(member.username, "sakbly")
        assert.equal(member.phone, "0123456789")
    });

    test("Store duplicate member", async ({ assert }) => {

        const attributes: MemberAttributes = {
            certificate: "", companyName: "qrcode-protect", siret: "",
            firstname  : "sOfi-àne",
            lastname   : "ak-bly",
            email      : "sofiane.AkblY@gmail.com",
            phone      : "+341.23.456.78/9",
            activityId : "strest"
        }

        try {
            await memberModel().store(new Member(attributes));
            assert.isTrue(false);
        } catch (e) {
            assert.instanceOf(e, DuplicateEntryException);
        }

    });

    test("Store member service", async ({ assert }) => {

        const attributes: MemberAttributes = {
            certificate: "", companyName: "qrcode-protect", siret: "",
            firstname  : "sOfi-àne",
            lastname   : "ak-bly2",
            email      : "sofiane.AkblY2@gmail.com",
            phone      : "+332.23.456.78/9",
            activityId : "strest2"
        }

        const memberService = new MemberService()
        const memberServiceResult = await memberService.store(new Member(attributes))

        const member = memberServiceResult.data

        assert.isNotNull(memberServiceResult);
        assert.instanceOf(memberServiceResult, Success);
        assert.instanceOf(member, Member)
        assert.equal(member.firstname, "sofi-àne")
        assert.equal(member.lastname, "ak-bly")
        assert.equal(member.email, "sofiane.akbly2@gmail.com")
        assert.equal(member.username, "sakbly")
        assert.equal(member.phone, "0223456789")
    });

    // test("Store member controller", async ({ assert,client }) => {
    //
    //     /*const attributes: MemberAttributes = {
    //         certificate: "", companyName: "qrcode-protect", siret: "",
    //         firstname  : "sOfi-àne",
    //         lastname   : "ak-bly2",
    //         email      : "sofiane.AkblY3@gmail.com",
    //         phone      : "+332.23.456.78/9",
    //         activityId : "strest2"
    //     }
    //
    //
    //     const response = await client.post("/api/v1/members")
    //
    //
    //     console.log(response)*/
    //
    //     /*response.assertStatus(200)
    //     response.assertBodyContains({ hello: 'world' })*/
    //
    //     /*const memberService = new MemberController()
    //     const memberServiceResult = await memberService.store(new Member(attributes))
    //
    //     const member = memberServiceResult.data
    //
    //     assert.isNotNull(member);
    //     assert.instanceOf(member, Member);
    //     assert.equal(member.firstname, "sofi-àne")
    //     assert.equal(member.lastname, "ak-bly")
    //     assert.equal(member.email, "sofiane.akbly2@gmail.com")
    //     assert.equal(member.username, "sakbly")
    //     assert.equal(member.phone, "0223456789")*/
    // });
})
