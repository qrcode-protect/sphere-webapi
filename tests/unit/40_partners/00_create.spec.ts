import { test }                from "@japa/runner"
import { partnerModel }         from "App/Common/model";
import Partner                  from "QRCP/Sphere/Partner/Partner";
import PartnerAttributes        from "QRCP/Sphere/Partner/PartnerAttributes";
import DuplicateEntryException from "QRCP/Sphere/Exceptions/DuplicateEntryException";
import PartnerService           from "QRCP/Sphere/Partner/PartnerService";
import { Success }             from "@sofiakb/adonis-response";

test.group("Partners 00 create", () => {
    test("Store partner", async ({ assert }) => {

        const attributes: PartnerAttributes = {
            avatar     : "", description: "",
            certificate: "", companyName: "qrcode-protect", siret: "",
            firstname  : "sOfi-àne",
            lastname   : "ak-bly",
            email      : "sofiane.AkblY.partner@gmail.com",
            phone      : "+331.23.456.78/9",
            activityId : "strest"
        }

        const partner = await partnerModel().store(new Partner(attributes))

        assert.isNotNull(partner);
        assert.instanceOf(partner, Partner);
        assert.equal(partner.firstname, "sofi-àne")
        assert.equal(partner.lastname, "ak-bly")
        assert.equal(partner.email, "sofiane.akbly.partner@gmail.com")
        assert.equal(partner.username, "sakbly")
        assert.equal(partner.phone, "0123456789")
        assert.equal(partner.partnerNumber, "PRT-00YLB987")
    });

    test("Store duplicate partner", async ({ assert }) => {

        const attributes: PartnerAttributes = {
            avatar     : "", description: "",
            certificate: "", companyName: "qrcode-protect", siret: "",
            firstname  : "sOfi-àne",
            lastname   : "ak-bly",
            email      : "sofiane.AkblY.partner@gmail.com",
            phone      : "+341.23.456.78/9",
            activityId : "strest"
        }

        try {
            await partnerModel().store(new Partner(attributes));
            assert.isTrue(false);
        } catch (e) {
            assert.instanceOf(e, DuplicateEntryException);
        }

    });

    test("Store partner service", async ({ assert }) => {

        const attributes: PartnerAttributes = {
            avatar     : "", description: "",
            certificate: "", companyName: "qrcode-protect", siret: "",
            firstname  : "sOfi-àne",
            lastname   : "ak-bly2",
            email      : "sofiane.AkblY2.partner@gmail.com",
            phone      : "+332.23.456.78/9",
            activityId : "strest2"
        }

        const partnerService = new PartnerService()
        const partnerServiceResult = await partnerService.store(new Partner(attributes))

        const partner = partnerServiceResult.data

        assert.isNotNull(partnerServiceResult);
        assert.instanceOf(partnerServiceResult, Success);
        assert.instanceOf(partner, Partner)
        assert.equal(partner.firstname, "sofi-àne")
        assert.equal(partner.lastname, "ak-bly")
        assert.equal(partner.email, "sofiane.akbly2.partner@gmail.com")
        assert.equal(partner.username, "sakbly")
        assert.equal(partner.phone, "0223456789")
        assert.equal(partner.uid, partner.id)
    });

    // test("Store partner controller", async ({ assert,client }) => {
    //
    //     /*const attributes: PartnerAttributes = {
    //         certificate: "", companyName: "qrcode-protect", siret: "",
    //         firstname  : "sOfi-àne",
    //         lastname   : "ak-bly2",
    //         email      : "sofiane.AkblY3@gmail.com",
    //         phone      : "+332.23.456.78/9",
    //         activityId : "strest2"
    //     }
    //
    //
    //     const response = await client.post("/api/v1/partners")
    //
    //
    //     console.log(response)*/
    //
    //     /*response.assertStatus(200)
    //     response.assertBodyContains({ hello: 'world' })*/
    //
    //     /*const partnerService = new PartnerController()
    //     const partnerServiceResult = await partnerService.store(new Partner(attributes))
    //
    //     const partner = partnerServiceResult.data
    //
    //     assert.isNotNull(partner);
    //     assert.instanceOf(partner, Partner);
    //     assert.equal(partner.firstname, "sofi-àne")
    //     assert.equal(partner.lastname, "ak-bly")
    //     assert.equal(partner.email, "sofiane.akbly2@gmail.com")
    //     assert.equal(partner.username, "sakbly")
    //     assert.equal(partner.phone, "0223456789")*/
    // });
})
