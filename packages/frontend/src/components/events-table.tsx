import clsx from 'clsx'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { Button, Form, Table } from 'react-bootstrap'
import { ApiEventEntry } from '@ping-board/common'
import { RegionLink } from './region-link'
import { RelativeTime } from './relative-time'
import { SolarSystemLink } from './solar-system-link'
import { Time } from './time'
import './events-table.scss'

export interface EventsTableProps {
  showResultColumn?: boolean
  canEdit?: boolean
  onEdit?: (event: ApiEventEntry) => void
  events: ApiEventEntry[]
}

type EventFilterColumn =
  | 'system'
  | 'region'
  | 'priority'
  | 'structure'
  | 'type'
  | 'standing'
  | 'corp_ticker'
  | 'alliance_ticker'
  | 'relativeTime'
  | 'localTime'
  | 'eveTime'
  | 'result'
  | 'notes'

type EventFilters = Partial<Record<EventFilterColumn, string>>

function getFilterValue(event: ApiEventEntry, column: EventFilterColumn): string {
  switch (column) {
    case 'relativeTime':
    case 'localTime':
      return dayjs(event.time).format('YYYY-MM-DD HH:mm')
    case 'eveTime':
      return dayjs(event.time).utc().format('YYYY-MM-DD HH:mm')
    default:
      return String(event[column] ?? '')
  }
}

export function EventsTable({
                              showResultColumn = false,
                              canEdit = false,
                              onEdit,
                              events,
                            }: EventsTableProps): JSX.Element {
  const [filters, setFilters] = useState<EventFilters>({})

  const getRowClass = (event: ApiEventEntry): string => {
    const time = Date.parse(event.time)
    const now = Date.now()
    if (Math.abs(time - now) < 1000 * 60 * 60) {
      return 'present'
    }
    return time > now ? 'future' : 'past'
  }

  const filteredEvents = useMemo(() => {
    const activeFilters = Object.entries(filters)
      .map(([column, value]) => [column as EventFilterColumn, value.trim().toLowerCase()] as const)
      .filter(([, value]) => value.length > 0)

    if (activeFilters.length === 0) {
      return events
    }

    return events.filter(event => activeFilters.every(([column, value]) =>
      getFilterValue(event, column).toLowerCase().includes(value)
    ))
  }, [events, filters])

  const updateFilter = (column: EventFilterColumn, value: string) => {
    setFilters(current => ({
      ...current,
      [column]: value,
    }))
  }

  const renderFilter = (column: EventFilterColumn, label: string): JSX.Element => (
    <Form.Control
      size="sm"
      value={filters[column] ?? ''}
      placeholder={label}
      aria-label={`Filter by ${label}`}
      onChange={event => updateFilter(column, event.target.value)}
    />
  )

  return (
    <Table hover size="sm" variant="dark" responsive className="events-table">
      <thead>
      <tr className="events-filter-row">
        <th>{renderFilter('system', 'System')}</th>
        <th>{renderFilter('region', 'Region')}</th>
        <th>{renderFilter('priority', 'Priority')}</th>
        <th>{renderFilter('structure', 'Structure')}</th>
        <th>{renderFilter('type', 'Type')}</th>
        <th>{renderFilter('standing', 'Standing')}</th>
        <th>{renderFilter('corp_ticker', 'Corp')}</th>
        <th>{renderFilter('alliance_ticker', 'Alliance')}</th>
        <th>{renderFilter('relativeTime', 'Relative Time')}</th>
        <th>{renderFilter('localTime', 'Local Time')}</th>
        <th>{renderFilter('eveTime', 'EVE Time')}</th>
        {showResultColumn && <th>{renderFilter('result', 'Result')}</th>}
        <th>{renderFilter('notes', 'Notes')}</th>
        {canEdit && <th>Action</th>}
      </tr>
      </thead>
      <tbody>
      {filteredEvents.length === 0 && (
        <tr>
          <td colSpan={12 + (+showResultColumn) + (+canEdit)}>
            No Events
          </td>
        </tr>
      )}
      {filteredEvents.map(event => (
        <tr key={event.id} className={clsx('event-row', getRowClass(event))}>
          <th scope="row"><SolarSystemLink system={event.system}/></th>
          <td><RegionLink system={event.system} region={event.region}/></td>
          <td>{event.priority}</td>
          <td>{event.structure}</td>
          <td>{event.type}</td>
          <td>{event.standing}</td>
          <td>{event.corp_ticker}</td>
          <td>{event.alliance_ticker}</td>
          <td><RelativeTime time={event.time}/></td>
          <td><Time time={event.time}/></td>
          <td><Time time={dayjs(event.time).utc()} format="YYYY-MM-DD HH:mm" asLink/></td>
          {showResultColumn && (
            <td>{event.result}</td>
          )}
          <td className="event-notes">{event.notes}</td>
          {canEdit && (
            <td>
              <Button size="sm" onClick={() => onEdit?.(event)}>
                <i className="bi-pencil"/> Edit
              </Button>
            </td>
          )}
        </tr>
      ))}
      </tbody>
    </Table>
  )
}