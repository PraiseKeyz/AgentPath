export type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export const getTimeLeft = (targetDate: Date): TimeLeft => {
  const difference = targetDate.getTime() - Date.now()

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

export const formatCountdownUnit = (value: number) => String(value).padStart(2, '0')
