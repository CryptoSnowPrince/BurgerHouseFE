import dotenv from "dotenv";

dotenv.config();

export const secondsToTimes = (seconds) => {
    if (seconds > 0) {
        // Calculating the days, hours, minutes and seconds left
        const timeDays = Math.floor(seconds / (60 * 60 * 24))
        const timeHours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60))
        const timeMinutes = Math.floor((seconds % (60 * 60)) / 60)

        if (timeDays > 0) {
            return `${timeDays}Days and ${timeHours}Hours`
        } else {
            return `${timeHours}Hours and ${timeMinutes}Minutes`
        }
    }

    return `0Minutes`
}

export const secondsToTime = (seconds) => {
    if (seconds > 0) {
        // Calculating the days, hours, minutes and seconds left
        const timeDays = Math.floor(seconds / (60 * 60 * 24))
        const timeHours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60))
        const timeMinutes = Math.floor((seconds % (60 * 60)) / 60)

        if (timeDays > 0) {
            return `${timeDays}D : ${timeHours}H`
        } else {
            return `${timeHours}H : ${timeMinutes}M`
        }
    }

    return `0H : 0M`
}

export const secondsToHMS = (seconds) => {
    if (seconds > 0) {
        // Calculating the days, hours, minutes and seconds left
        const timeDays = Math.floor(seconds / (60 * 60 * 24))
        const timeHours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60))
        const timeMinutes = Math.floor((seconds % (60 * 60)) / 60)
        const timeSeconds = seconds % 60

        if (timeDays > 0) {
            return `${timeDays} D : ${timeHours} H`
        } else if (timeHours > 0) {
            return `${timeHours} H : ${timeMinutes} M`
        } else if (timeMinutes > 0) {
            return `${timeMinutes} M : ${timeSeconds} S`
        } else {
            return `${timeSeconds} S`
        }
    }

    return `0 H : 0 M`
}
