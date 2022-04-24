export const useCurrentTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}
