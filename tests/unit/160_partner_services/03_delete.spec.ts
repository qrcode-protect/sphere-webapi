import { test }                                           from "@japa/runner"
import { partnerServiceModel }                           from "App/Common/model";
import PartnerService                                    from "QRCP/Sphere/PartnerService/PartnerService";
import { partnerServiceAttributes, testPartnerService } from "./utils";

test.group("Product services 02 delete", () => {
    test("Delete partnerService model", async ({ assert }) => {

        const partnerService: PartnerService | null = await partnerServiceModel().store(partnerServiceAttributes)
        assert.isTrue(testPartnerService(partnerService, { assert }))

        assert.isTrue((await partnerServiceModel().delete(partnerService.id)))
    }).tags([ "partner-service-unit" ]);

    /*test("Delete partnerService service", async ({ assert }) => {

        const partnerService: PartnerService | null = await partnerServiceModel().store(partnerServiceAttributes)
        assert.isTrue(testPartnerService(partnerService, { assert }))

        try {
            const partnerServiceServiceResult = await partnerServiceDeleteService(partnerService?.id)
            const partnerServiceDelete = partnerServiceServiceResult.data
            assert.isTrue(testPartnerServiceService(partnerServiceServiceResult, partnerServiceDelete, { assert }))
        } catch (e) {
            Log.error(e, true)
        }

    }).tags([ "partner-service-unit" ]);*/
})
