"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 22/07/2022 at 15:17
 * File tests/unit/140_product_categories/utils
 */


import ProductCategoryAttributes from "QRCP/Sphere/ProductCategory/ProductCategoryAttributes";
import { Success }               from "@sofiakb/adonis-response";
import Log                       from "QRCP/Sphere/Common/Log";
import ProductCategory           from "QRCP/Sphere/ProductCategory/ProductCategory";
import ProductCategoryService    from "QRCP/Sphere/ProductCategory/ProductCategoryService";

export const productCategoryAttributes: ProductCategoryAttributes = {
    id         : "test-id",
    label      : "Visseries & chose23",
    avatar     : "test",
    description: "description",
    partnerId  : "test-partner-id"
}

export const productCategoryService = new ProductCategoryService()

export const productCategoryStoreService = async () => await productCategoryService.store(productCategoryAttributes, "test-partner-id")
export const productCategoryUpdateService = async (id: string) => await productCategoryService.update(id, { label: "Visserie modifiée 36" }, "test-partner-id")

export const testProductCategoryService = (productCategoryServiceResult, productCategory, { assert, label, name }: TestProductCategory): boolean => {

    try {
        assert.isNotNull(productCategoryServiceResult);
        assert.instanceOf(productCategoryServiceResult, Success);
        testProductCategory(productCategory, { assert, label, name })
        return true
    } catch (e) {
        Log.error(e, true)
        return false
    }
}
export const testProductCategoryUpdateService = (productCategoryServiceResult, productCategory, { assert, label, name }: TestProductCategory): boolean => {
    return testProductCategoryService(productCategoryServiceResult, productCategory, {assert, label: label ?? "visserie modifiée 36", name: name ?? "visserie-modifiée-36"})
}

interface TestProductCategory {
    assert,
    label?: string,
    name?: string,
}

export const testProductCategory = (productCategory, { assert, label, name }: TestProductCategory): boolean => {

    try {
        assert.isNotNull(productCategory);
        assert.instanceOf(productCategory, ProductCategory);
        assert.equal(productCategory?.id, "test-id");
        assert.equal(productCategory?.label, label ?? "visseries & chose23");
        assert.equal(productCategory?.description, "description");
        assert.equal(productCategory?.name, name ?? "visseries-chose23-test-partner-id");
        assert.equal(productCategory?.partnerId, "test-partner-id");
        return true
    } catch (e) {
        Log.error(e, true)
        return false
    }
}
