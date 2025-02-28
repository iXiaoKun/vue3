import { solarToLunar } from 'lunar-calendar';

export const getAge = (person: { birthday: string; isLunar: boolean }) => {
  const today = new Date();
  if (!person.isLunar) {
    const [year, month, day] = person.birthday.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const ageDiff = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return ageDiff - 1;
    }
    return ageDiff;
  }

  const lunarToday = solarToLunar(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const [lunarBirthYear, lunarBirthMonth, lunarBirthDay] = person.birthday.split('-').map(Number);
  let age = lunarToday.lunarYear - lunarBirthYear;

  if (lunarToday.lunarMonth < lunarBirthMonth || 
      (lunarToday.lunarMonth === lunarBirthMonth && lunarToday.lunarDay < lunarBirthDay)) {
    age--;
  }

  return age;
};