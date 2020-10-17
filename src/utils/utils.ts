import { Moment } from "moment-timezone"
import moment from "moment-timezone"

// This returns a timezone aware moment object. If there is a trailing "Z"
// the date string is assumed to be UTC, else it defaults to "America/Los_Angeles"
export const dateStringToMomentDate = (dateString: string): Moment => {
    if (dateString[dateString.length - 1].toLowerCase() === "z") {
        // This is UTC date
        return moment.utc(dateString)
    } else {
        return moment.tz(dateString, "America/Los_Angeles")
    }
}

export const momentToDate = (momentDate: Moment): Date => {
    const dateStr = momentDate.format()
    const out = new Date(dateStr)
    return out
}

export const dateToMoment = (date: Date): Moment => {
    return moment(date)
}

//return a moment for the current time
export const getNow = () => {
    return moment()
}
