import { test } from "@japa/runner"
import { partnerServiceModel } from "App/Common/model";
import PartnerService from "QRCP/Sphere/PartnerService/PartnerService";
import {
    partnerServiceAttributes,
    partnerServiceService,
    partnerServiceUpdateService,
    testPartnerService,
    testPartnerServiceService
} from "./utils";
import Log from "QRCP/Sphere/Common/Log";

test.group("Product services 02 update", () => {
    test("Update partnerService model", async ({ assert }) => {

        const partnerService: PartnerService | null = await partnerServiceModel().store(partnerServiceAttributes)
        assert.isTrue(testPartnerService(partnerService, { assert }))


        try {
            const partnerServiceUpdated: PartnerService | null = (await partnerServiceModel().update(partnerService.id, { label: "VISSERIE" }))
            assert.isTrue(testPartnerService(partnerServiceUpdated, { assert, label: "VISSERIE", name: "visserie" }))
        } catch (e) {
            Log.error(e, true)
        }

    }).tags([ "partner-service-unit" ]);

    test("Update partnerService service", async ({ assert }) => {

        const partnerService: PartnerService | null = await partnerServiceModel().store(partnerServiceAttributes)
        assert.isTrue(testPartnerService(partnerService, { assert }))

        try {
            const partnerServiceServiceResult = await partnerServiceUpdateService(partnerService?.id)
            const partnerServiceUpdate = partnerServiceServiceResult.data
            assert.isTrue(testPartnerServiceService(partnerServiceServiceResult, partnerServiceUpdate, { assert }))
        } catch (e) {
            Log.error(e, true)
        }

    }).tags([ "partner-service-unit" ]);

    test("Unblock partnerService service", async ({ assert }) => {

        const partnerService: PartnerService | null = await partnerServiceModel().store(partnerServiceAttributes)
        assert.isTrue(testPartnerService(partnerService, { assert }))

        try {
            const partnerServiceServiceResult = await partnerServiceService.unblock(partnerService?.id)
            const partnerServiceUpdate = partnerServiceServiceResult.data
            assert.isTrue(testPartnerServiceService(partnerServiceServiceResult, partnerServiceUpdate, {
                assert,
                active: true
            }))
        } catch (e) {
            Log.error(e, true)
        }

    }).tags([ "partner-service-unit" ]);

    test("Block partnerService service", async ({ assert }) => {

        const partnerService: PartnerService | null = await partnerServiceModel().store(partnerServiceAttributes)
        assert.isTrue(testPartnerService(partnerService, { assert }))

        try {
            const partnerServiceServiceResult = await partnerServiceService.block(partnerService?.id)
            const partnerServiceUpdate = partnerServiceServiceResult.data
            assert.isTrue(testPartnerServiceService(partnerServiceServiceResult, partnerServiceUpdate, {
                assert,
                active: false
            }))
        } catch (e) {
            Log.error(e, true)
        }

    }).tags([ "partner-service-unit" ]);
})
