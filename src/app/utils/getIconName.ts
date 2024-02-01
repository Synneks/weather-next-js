export function getIconName(iconName: string, dateTimeString: string): string {
  const dateTime = new Date(dateTimeString);
  const hour = dateTime.getHours();
  const isDayTime = hour >= 6 && hour < 18;
  return isDayTime ? iconName.replace(/.$/, 'd') : iconName.replace(/.$/, 'n');
}
