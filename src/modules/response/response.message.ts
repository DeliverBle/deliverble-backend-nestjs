export const message = {
  // 기본 에러 메시지
  NULL_VALUE: '필요한 값이 없습니다.',
  FORBIDDEN: 'Forbidden',
  DUPLICATED: 'Duplicated',
  NOT_FOUND: '존재하지 않는 자원',
  BAD_REQUEST: '잘못된 요청',
  INTERNAL_SERVER_ERROR: '서버 내부 오류',
  EXCEED_PAGE_INDEX:
    '요청한 페이지 번호가 존재하는 인덱스 개수를 넘어섰습니다.',
  NULL_VALUE_TOKEN: '토큰이 없습니다.',
  INVALID_TOKEN: '만료된 토큰입니다.',
  INVALID_PASSWORD: '비밀번호 오류',

  // 인증, 인가 로직
  AUTHENTICATION_SUCCESS: '유저 인증 성공',
  AUTHENTICATION_FAIL: '유저 인증 실패',

  // 유저, Favorite
  READ_USER_SUCCESS: '유저 조회 성공',
  TOGGLE_FAVORITE_NEWS_SUCCESS: '좋아하는 뉴스 토글 성공',

  // 뉴스
  CREATE_NEWS_SUCCESS: '뉴스 생성 성공',
  READ_ALL_NEWS_SUCCESS: '모든 뉴스 조회 성공',
  UPDATE_NEWS_SUCCESS: '뉴스 수정 성공',
  DELETE_NEWS_SUCCESS: '뉴스 삭제 성공',
  SEARCH_NEWS_SUCCESS: '영상 검색 결과 조회 성공',
  RECOMMENDED_NEWS_SUCCESS: '추천 영상 조회 성공',
  FAVORITE_NEWS_SUCCESS: '즐겨찾는 영상 조회 성공',
  DETAIL_NEWS_SUCCESS: '영상 조회 성공',
  ADD_TAG_TO_NEWS_SUCCESS: '뉴스 태그 추가 성공',
  READ_NEWS_DETAIL_SUCCESS: '뉴스 학습 상세 정보 조회 성공',
  SPEECH_GUIDE_NEWS_SUCCESS: '스피치 가이드 영상 조회 성공',
  SPEECH_GUIDE_NEWS_DETAIL_SUCCESS: '스피치 가이드 상세 정보 조회 성공',
  SAVE_SIMILAR_NEWS: '비슷한 영상 조회 성공',
  HISTORY_SUCCESS: '내 학습 기록 조회 성공',

  // 태그
  CREATE_TAG_SUCCESS: '태그 생성 성공',
  READ_ALL_TAGS_SUCCESS: '모든 태그 조회 성공',
  DELETE_TAG_SUCCESS: '태그 삭제 성공',

  // 스크립트
  CREATE_SCRIPT_SUCCESS: '스크립트 생성 성공',
  READ_ALL_SCRIPTS_SUCCESS: '모든 스크립트 조회 성공',
  DELETE_SCRIPT_SUCCESS: '스크립트 삭제 성공',
  UPDATE_SCRIPT_NAME_SUCCESS: '스크립트 이름 수정 성공',
  // 스크립트 에러
  NOT_EXISTING_SCRIPT: '없는 스크립트의 id로 요청했습니다.',
  FULL_SCRIPTS_COUNT: '스크립트의 개수가 너무 많아, 더이상 생성할 수 없습니다.',
  NOT_OWNER_OF_SCRIPT: '로그인한 유저가 해당 스크립트를 가지고 있지 않습니다.',
  NOT_REMOVABLE_SCRIPT: '스크립트가 1개이므로 삭제할 수 없습니다.',
  // 녹음 에러
  NOT_FOUND_SCRIPT: '해당 스크립트가 없습니다.',
  NOT_FOUND_RECORDING: '해당 녹음이 없습니다.',
  CREATE_RECORDING_SUCCESS: '녹음 생성 성공',
  DELETE_RECORDING_SUCCESS: '녹음 삭제 성공',

  // 문장
  CREATE_SENTENCE_SUCCESS: '문장 생성 성공',
  UPDATE_SENTENCE_SUCCESS: '문장 수정 성공',
  // 문장 에러
  NOT_EXISTING_ORDER: '없는 문장 번호로 요청했습니다.',

  // 메모
  CREATE_MEMO_SUCCESS: '메모 생성 성공',
  UPDATE_MEMO_SUCCESS: '메모 수정 성공',
  DELETE_MEMO_SUCCESS: '메모 삭제 성공',
  // 메모 에러
  NOT_EXISTING_MEMO: '없는 메모의 id로 요청했습니다.',

  // 더미
  CREATE_SCRIPT_DEFAULT_SUCCESS: '기본 스크립트 생성 성공',
  READ_SCRIPT_DEFAULT_SUCCESS: '기본 스크립트 조회 성공',
  DELETE_SCRIPT_DEFAULT_SUCCESS: '기본 스크립트 삭제 성공',
  CREATE_SENTENCE_DEFAULT_SUCCESS: '기본 문장 생성 성공',
  UPDATE_SENTENCE_DEFAULT_SUCCESS: '기본 문장 수정 성공',
  DELETE_SENTENCE_DEFAULT_SUCCESS: '기본 문장 삭제 성공',

  CREATE_SCRIPT_GUIDE_SUCCESS: '스피치 가이드 스크립트 생성 성공',
  READ_SCRIPT_GUIDE_SUCCESS: '스피치 가이드 스크립트 조회 성공',
  DELETE_SCRIPT_GUIDE_SUCCESS: '스피치 가이드 스크립트 삭제 성공',
  CREATE_SENTENCE_GUIDE_SUCCESS: '스피치 가이드 문장 생성 성공',
  UPDATE_SENTENCE_GUIDE_SUCCESS: '스피치 가이드 문장 수정 성공',
  DELETE_SENTENCE_GUIDE_SUCCESS: '스피치 가이드 문장 삭제 성공',

  CREATE_MEMO_GUIDE_SUCCESS: '스피치 가이드 메모 생성 성공',
  DELETE_MEMO_GUIDE_SUCCESS: '스피치 가이드 메모 삭제 성공',
};
