"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 04/05/2022 at 10:47
 * File src/Common/Service
 */

import { Result }                      from "@sofiakb/adonis-response";
import { chunk, each, size }           from "lodash"
import Log                             from "QRCP/Sphere/Common/Log";
import Model                           from "QRCP/Sphere/Common/Model";
import { ClassConstructor }            from "class-transformer";
import { FieldPath, OrderByDirection } from "@google-cloud/firestore";


export default class Service {

    public model

    constructor(model?: ClassConstructor<Model>) {
        if (model)
            this.model = new model
    }

    public async all() {
        return Result.success(await this.model.all());
    }

    public async findById(id: number | string, columnID = "id") {
        return this.findOneBy(columnID, id);
    }

    public async findBy(column: string, value: unknown) {
        try {
            const data = await this.model.where(column, value) || []
            return Result.success(data)
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }
    }

    public async findOneBy(column: string, value: unknown) {
        try {
            const data = (await this.model.where(column, value))[0] || null
            return data === null ? Result.notFound(`La ressource #${value} demandée n'existe pas.`) : Result.success(data)
        } catch (e) {
            Log.error(e, true)
            return Result.error()
        }
    }

    public async search(query, searchable: string[] = []) {
        if (size(searchable) === 0 || searchable === null)
            searchable = this.model?.searchable || []
        query = `%${query}%`.toLowerCase().trim()

        if (query === "")
            return Result.success(await this.model.all())

        let queryBuilder = this.model
            .query()

        each(searchable, item => queryBuilder = queryBuilder.orWhere(item, "LIKE", query))

        return Result.success(await queryBuilder)
    }

    public async paginate(page = 1, limit = 10, orderBy?: Nullable<string>, orderDirection?: Nullable<OrderByDirection>) {

        /*page = parseInt(page.toString())
        if (page === 0)
            page = 1
        // page = Math.max(page - 1, 0)

        limit = parseInt(limit.toString())*/

        return this.paginateData(await this.model.limit(page > 0 ? page * limit : limit).orderBy(orderBy ?? "id", orderDirection ?? "asc").get(), page, limit)
        // const data = await this.model.limit(limit).offset(page * limit, orderBy, orderDirection).get()

        /*const total = data.length;
        const latest = Math.ceil(total / limit);

        return Result.success({
            page : page,
            data : chunk(data, limit)[page - 1] ?? null,//: await this.model.limit(limit).offset(page * limit, orderBy, orderDirection).get(),
            first: 0,
            latest,
            per  : limit,
            prev : page <= 0 ? null : page,
            next : page + 1 >= latest ? null : page + 2,
            total
        });*/
    }

    public async paginateData(data: any[], page = 1, limit = 10) {

        page = parseInt(page.toString())
        if (page === 0)
            page = 1
        // page = Math.max(page - 1, 0)

        limit = parseInt(limit.toString())

        const total = data?.length ?? 0;
        const latest = Math.ceil(total / limit);

        return Result.success({
            page : page,
            data : chunk(data, limit)[page - 1] ?? null,//: await this.model.limit(limit).offset(page * limit, orderBy, orderDirection).get(),
            first: 0,
            latest,
            per  : limit,
            prev : page <= 0 ? null : page,
            next : page + 1 >= latest ? null : page + 2,
            total
        });
    }

    public async store(data: any) {
        try {
            const result = await this.model.store(data)
            if (result.id)
                return Result.success(result)
            throw new Error("Error while saving")
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }
    }

    public async update(value: unknown, updatable) {
        try {
            const data = await this.model.update(value, updatable)
            return Result.success(data)
        } catch (e) {
            Log.error(e, true)
            return Result.notFound(`La ressource #${value} demandée n'existe pas.`)
        }
    }

    public async destroy(value: unknown) {
        try {
            return Result.success(await this.model.delete(value))
        } catch (e) {
            Log.error(e, true)
            return Result.notFound(`La ressource #${value} demandée n'existe pas.`)
        }
    }

    public async groupBy(column: string | FieldPath) {
        try {
            const data = await this.model.groupBy(column) || []
            return Result.success(data)
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }
    }

}
