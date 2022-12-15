import { Gender } from 'src/news/common/gender.enum';

export const transformKakaoGender = (genderRaw: string | undefined): Gender => {
  const genderMap = new Map([
    [undefined, Gender.UNSPECIFIED],
    ['male', Gender.MEN],
    ['female', Gender.WOMEN],
  ]);

  const gender: Gender = genderMap.get(genderRaw);
  return gender;
};

export const transformKakaoEmail = (emailRaw: string | undefined): string => {
  if (emailRaw === undefined) {
    return 'NO_EMAIL';
  }
  return emailRaw;
};
