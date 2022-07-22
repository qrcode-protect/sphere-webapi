"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 22/07/2022 at 15:17
 * File tests/unit/140_products/utils
 */


import ProductAttributes from "QRCP/Sphere/Product/ProductAttributes";
import { Success }       from "@sofiakb/adonis-response";
import Log               from "QRCP/Sphere/Common/Log";
import Product           from "QRCP/Sphere/Product/Product";
import ProductService    from "QRCP/Sphere/Product/ProductService";

export const productAttributes: ProductAttributes = {
    id         : "test-id",
    label      : "Visseries & chose23",
    avatar     : "test",
    description: "description",
    categoryId : "test-product-id",
    quantity   : 90.6,
    price      : 100.6,
}

export const productService = new ProductService()

export const productStoreService = async () => await productService.store(productAttributes, "test-product-id")
export const productUpdateService = async (id: string) => await productService.update(id, { label: "Visserie modifiée 36" }, "test-product-id")

export const testProductService = (productServiceResult, product, { assert, label, name }: TestProduct): boolean => {

    try {
        assert.isNotNull(productServiceResult);
        assert.instanceOf(productServiceResult, Success);
        testProduct(product, { assert, label, name })
        return true
    } catch (e) {
        Log.error(e, true)
        return false
    }
}
export const testProductUpdateService = (productServiceResult, product, {
    assert,
    label,
    name
}: TestProduct): boolean => {
    return testProductService(productServiceResult, product, {
        assert,
        label: label ?? "visserie modifiée 36",
        name : name ?? "visserie-modifiée-36"
    })
}

interface TestProduct {
    assert,
    label?: string,
    name?: string,
}

export const testProduct = (product, { assert, label, name }: TestProduct): boolean => {

    try {
        assert.isNotNull(product);
        assert.instanceOf(product, Product);
        assert.equal(product?.id, "test-id");
        assert.equal(product?.label, label ?? "visseries & chose23");
        assert.equal(product?.description, "description");
        assert.equal(product?.name, name ?? "visseries-chose23-test-product-id");
        assert.equal(product?.categoryId, "test-product-id");
        assert.equal(product?.quantity, 90);
        assert.equal(product?.price, 100.6);
        return true
    } catch (e) {
        Log.error(e, true)
        return false
    }
}
