"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 10:54
 * File src/Network/Network
 */

import Model               from "QRCP/Sphere/Common/Model";
import NetworkAttributes   from "QRCP/Sphere/_Network/Network/NetworkAttributes";
import { each }            from "lodash";
import Department          from "QRCP/Sphere/_Network/Department/Department";
import { name, normalize } from "App/Common/string";

export default class Network extends Model {
    id?: string
    name?: string
    departments?: any[]
    active?: boolean = true

    constructor(attributes?: NetworkAttributes) {
        super({ collectionName: "networks", model: Network });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }

    public async all(): Promise<any[]> {
        return (await super.orderBy("name", "asc").get()) ?? [];
    }

    public async findActive(): Promise<any[]> {
        return (await super.whereSnapshot("active", true).orderBy("name", "asc").get()) ?? [];
    }

    async casting(data): Promise<any> {
        const documentsRefs = await this.collection.doc(data.id).collection("departments").orderBy("code", "asc").get();

        const departments: any[] = [];
        for (const documentSnapshot of documentsRefs.docs) {
            departments.push(await (new Department()).casting(documentSnapshot.data()));
        }

        const networkData = { ...data, departments }

        return super.casting(networkData);
    }

    async store(data: NetworkAttributes): Promise<any> {

        const batch = this.instance.batch()

        const networkName = data.name ? normalize(name(data.name, "-")) : null


        const network = networkName ? this.collection.doc(networkName) : this.collection.doc()

        batch.set(network, {
            id       : network.id,
            name     : data.name,
            active   : typeof data.active === "undefined" ? true : data.active,
            createdAt: Model._now(),
            updatedAt: Model._now(),
        })

        each(data.departments, item => {
            const department = network.collection("departments").doc(name(item.name, "-"))
            batch.set(department, {
                code: item.code,
                name: item.name
            })
        })

        await batch.commit()

        return await this.casting((await (await this.collection.doc(network.id)).get()).data());
    }
}
