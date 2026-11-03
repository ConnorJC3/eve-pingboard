import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('events', table => {
        table.string('corp_ticker', 8).nullable().defaultTo(null)
        table.string('alliance_ticker', 8).nullable().defaultTo(null)

    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('events', table => {
        table.dropColumn('corp_ticker')
        table.dropColumn('alliance_ticker')
    })
}