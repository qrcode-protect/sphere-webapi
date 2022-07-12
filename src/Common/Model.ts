"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 04/05/2022 at 10:51
 * File src/Common/Model
 */

import Application                   from "@ioc:Adonis/Core/Application"
import {
    CollectionReference,
    DocumentData,
    DocumentReference,
    DocumentSnapshot,
    FieldPath,
    Firestore,
    OrderByDirection,
    Query,
    QueryDocumentSnapshot,
    QuerySnapshot,
    WhereFilterOp
}                                    from "@google-cloud/firestore";
import { ClassConstructor }          from "class-transformer";
import { firestore }                         from "firebase-admin";
import { Dictionary, groupBy, pickBy, size } from "lodash";
import Partner                               from "QRCP/Sphere/Partner/Partner";

interface ModelConstructor {
    collectionName: string;
    firebaseAppName?: string;
    model: ClassConstructor<any>;
}

export default class Model {
    collection: CollectionReference;
    instance: Firestore;
    firebaseAppName?: string;
    model: ClassConstructor<any>;

    snapshot: Nullable<Query<DocumentData>>;

    constructor({ collectionName, firebaseAppName, model }: ModelConstructor) {
        this.firebaseAppName = firebaseAppName;
        this.instance = Application.container.use("db");
        this.collection = this.instance.collection(collectionName);
        this.model = model;
    }

    _objectModel() {
        return new this.model()
    }

    createWithAttributes(attributes) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const object: any = this;
        if (object && attributes) {
            Object.keys(attributes).forEach((key) => object[key] = attributes[key]);
        }

        const item = [
            // "collection",
            // "instance",
            // "firebaseAppName",
            // "model",
        ];

        item.forEach((attribute) => delete object[attribute]);

        return object;
    }

    cleanup(data) {
        const object: any = new this.model(data);

        const item = [
            "collection",
            "instance",
            "firebaseAppName",
            "model",
        ];

        item.forEach((attribute) => delete object[attribute]);

        return object;
    }

    static _now(): Date {
        return firestore.Timestamp.now().toDate()
    }

    async all(): Promise<any[]> {
        const documentsRefs = await this.collection.listDocuments();
        const object = this._objectModel()

        const results: (typeof object)[] = [];
        for (const documentSnapshot of documentsRefs) {
            results.push(await this.casting((await documentSnapshot.get()).data()));
        }
        return results;
    }

    async store(data): Promise<any> {
        if (!data.id) {
            data.id = "";
        }

        data.createdAt = Model._now();
        data.updatedAt = Model._now();

        data = pickBy(data, v => v !== undefined)

        const documentReference: DocumentReference = await (data.id && data.id.trim() !== "" ? this.collection.doc(data.id) : this.collection.doc());
        await documentReference.set({ ...this.cleanup(data), id: documentReference.id })

        // await documentReference.update({ id: documentReference.id })
        return await this.casting({ ...data, id: documentReference.id, });
    }

    async update(docID: string, data, force = false): Promise<any> {
        if (!docID || docID.trim() === "")
            return null;

        const documentReference: DocumentReference = (await this.collection.doc(docID))
        data.updatedAt = Model._now();
        delete data.createdAt
        data = pickBy(data, v => v !== undefined)
        if (force) {
            await documentReference.set({ ...this.cleanup(data) })
        } else {
            await documentReference.update({ ...this.cleanup(data) })
        }

        return this.doc(docID)
    }

    async delete(docID: string): Promise<boolean> {
        if (!docID || docID.trim() === "")
            return false;

        return new Promise<boolean>((resolve, reject) => {
            this.collection.doc(docID)
                .delete()
                .then(() => resolve(true))
                .catch(() => reject(false))
        })

    }

    async casting(data) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        return (new this.model()).createWithAttributes(data);
    }

    // async docs() {
    //     return (await this.collection.docs()).docs.map((doc: QueryDocumentSnapshot) => await this.casting(doc.data()))
    // }

    async doc(docID: string) {
        if (!docID || docID.trim() === "")
            return null;
        const documentData: DocumentSnapshot = await (await this.collection.doc(docID)).get()
        return documentData.exists ? await this.casting(documentData.data()) : null;
    }

    async where(column: string, value: string | any[] | number | boolean | null | Date, operator: WhereFilterOp = "=="): Promise<any[] | null> {
        let snapshot: QuerySnapshot;

        if (this.snapshot)
            snapshot = await this.snapshot.where(column, operator, value).get()
        else
            snapshot = await this.collection.where(column, operator, value).get();
        if (snapshot.empty) {
            return null;
        }
        return await Promise.all(snapshot.docs.map(async (doc: QueryDocumentSnapshot<DocumentData>) => await this.casting(doc.data())))
    }

    whereSnapshot(column: string, value: string | any[] | number | boolean | null | Date, operator: WhereFilterOp = "=="): this {
        this.snapshot = (this.snapshot ?? this.collection).where(column, operator, value)
        return this;
    }

    public async findOneBy(column: string, value: string): Promise<any> {
        const data = await this.where(column, value)
        return data ? data[0] || null : data
    }

    async get(snapshot?: QuerySnapshot): Promise<any[] | null> {

        if (this.snapshot) {
            snapshot = await this.snapshot.get()
        }

        this.snapshot = null

        if (!snapshot || snapshot.empty) {
            return null;
        }

        return await Promise.all(snapshot.docs.map(async (doc: QueryDocumentSnapshot<DocumentData>) => await this.casting(doc.data())))
    }

    orderBy(fieldPath: string | FieldPath, directionStr?: OrderByDirection): this {
        this.snapshot = (this.snapshot ?? this.collection).orderBy(fieldPath, directionStr)

        return this
    }

    async groupBy(fieldPath: string | FieldPath) {
        const orderedResult = await this.orderBy(fieldPath).get()
        let result: Nullable<Dictionary<any[]>> = null

        if (orderedResult && orderedResult.length) {
            result = groupBy(orderedResult, fieldPath)
        }

        return result;
    }

    async count() {
        return size(await this.collection.listDocuments())
    }

    async truncate() {
        const items: Partner[] = await this.all()

        if (items.length > 0) {

            // await Drive.put(`backup/truncate/${moment().format("YYYYMMDDHHmmss")}.json`, JSON.stringify(items))

            for (const item of items) {
                await this.delete(item.id);
            }
        }
    }
}
