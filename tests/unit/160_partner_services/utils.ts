"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 22/07/2022 at 15:17
 * File tests/unit/140_partner_services/utils
 */


import PartnerServiceAttributes from "QRCP/Sphere/PartnerService/PartnerServiceAttributes";
import { Success }              from "@sofiakb/adonis-response";
import Log                      from "QRCP/Sphere/Common/Log";
import PartnerService           from "QRCP/Sphere/PartnerService/PartnerService";
import PartnerServiceService    from "QRCP/Sphere/PartnerService/PartnerServiceService";

export const partnerServiceAttributes: PartnerServiceAttributes = {
    id         : "test-id",
    label      : "Visseries & chose23",
    avatar     : "test",
    description: "description",
    partnerId  : "test-partner-id",
    price      : 100.50
}

export const partnerServiceService = new PartnerServiceService()

export const partnerServiceStoreService = async () => await partnerServiceService.store(partnerServiceAttributes, "test-partner-id")
export const partnerServiceUpdateService = async (id: string) => await partnerServiceService.update(id, { label: "Visserie modifiée 36" }, "test-partner-id")

export const testPartnerServiceService = (partnerServiceServiceResult, partnerService, {
    assert,
    label,
    name, active
}: TestPartnerService): boolean => {

    try {
        assert.isNotNull(partnerServiceServiceResult);
        assert.instanceOf(partnerServiceServiceResult, Success);
        testPartnerService(partnerService, { assert, label, name, active })
        return true
    } catch (e) {
        Log.error(e, true)
        return false
    }
}
export const testPartnerServiceUpdateService = (partnerServiceServiceResult, partnerService, {
    assert,
    label,
    name, active
}: TestPartnerService): boolean => {
    return testPartnerServiceService(partnerServiceServiceResult, partnerService, {
        assert,
        label: label ?? "visserie modifiée 36",
        name : name ?? "visserie-modifiée-36",
        active
    })
}

interface TestPartnerService {
    assert,
    label?: string,
    name?: string,
    active?: boolean
}

export const testPartnerService = (partnerService, { assert, label, name, active }: TestPartnerService): boolean => {

    try {
        assert.isNotNull(partnerService);
        assert.instanceOf(partnerService, PartnerService);
        assert.equal(partnerService?.id, "test-id");
        assert.equal(partnerService?.label, label ?? "visseries & chose23");
        assert.equal(partnerService?.description, "description");
        assert.equal(partnerService?.name, name ?? "visseries-chose23-test-partner-id");
        assert.equal(partnerService?.partnerId, "test-partner-id");
        assert.equal(partnerService?.active, typeof active === "undefined" ? true: active);
        assert.equal(partnerService?.price, 100.5);
        return true
    } catch (e) {
        Log.error(e, true)
        return false
    }
}
