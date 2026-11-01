import { Form } from 'react-bootstrap'
import './date-time-range-filter.scss'

export interface DateTimeRangeValue {
  from: string
  to: string
}

export interface DateTimeRangeFilterProps {
  label: string
  value: DateTimeRangeValue
  onChange: (value: DateTimeRangeValue) => void
}

export function DateTimeRangeFilter({
                                      label,
                                      value,
                                      onChange,
                                    }: DateTimeRangeFilterProps): JSX.Element {
  return (
    <div className="date-time-range-filter" aria-label={`Filter by ${label}`}>
      <div className="date-time-range-filter-inputs">
        <Form.Group className="date-time-range-filter-field">
          <Form.Control
            size="sm"
            type="datetime-local"
            value={value.from}
            aria-label={`${label} from`}
            onChange={event => onChange({ ...value, from: event.target.value })}
          />
        </Form.Group>
        <div> -- </div>
        <Form.Group className="date-time-range-filter-field">
          <Form.Control
            size="sm"
            type="datetime-local"
            value={value.to}
            aria-label={`${label} to`}
            onChange={event => onChange({ ...value, to: event.target.value })}
          />
        </Form.Group>
      </div>
    </div>
  )
}
