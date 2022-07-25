import { test }                                                                                from "@japa/runner"
import { partnerServiceModel }                                                                from "App/Common/model";
import PartnerService
                                                                                                                   from "QRCP/Sphere/PartnerService/PartnerService";
import { partnerServiceAttributes, partnerServiceStoreService, testPartnerService, testPartnerServiceService } from "./utils";


test.group("ProductCategories 00 create", () => {


    test("Init partnerService test", async () => {

        test("Store partnerService", async ({ assert }) => {

            const partnerService: PartnerService | null = await partnerServiceModel().store(partnerServiceAttributes)

            assert.isTrue(testPartnerService(partnerService, { assert }))
        }).tags([ "partner-service-unit" ]);

        test("Store partnerService service", async ({ assert }) => {

            const partnerServiceServiceResult = await partnerServiceStoreService()
            const partnerService = partnerServiceServiceResult.data
            assert.isTrue(testPartnerServiceService(partnerServiceServiceResult, partnerService, { assert }))

        }).tags([ "partner-service-unit" ]);

    }).tags([ "partner-service-unit" ]);


})
