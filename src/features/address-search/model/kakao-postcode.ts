export interface KakaoPostcodeData {
  zonecode: string;
  userSelectedType: 'R' | 'J';
  roadAddress: string;
  jibunAddress: string;
}

export interface PostcodeSelection {
  postalCode: string;
  address: string;
}

interface KakaoPostcodeOptions {
  oncomplete: (data: KakaoPostcodeData) => void;
  onclose?: () => void;
}

interface KakaoPostcodeInstance {
  open: () => void;
}

declare global {
  interface Window {
    kakao?: {
      Postcode: new (options: KakaoPostcodeOptions) => KakaoPostcodeInstance;
    };
  }
}

export function toPostcodeSelection(data: KakaoPostcodeData): PostcodeSelection {
  return {
    postalCode: data.zonecode,
    address: data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress,
  };
}

export function openKakaoPostcode({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (selection: PostcodeSelection) => void;
}) {
  if (typeof window === 'undefined' || !window.kakao?.Postcode) {
    throw new Error('우편번호 검색 서비스를 불러오지 못했습니다.');
  }

  let hasSelectedAddress = false;
  const postcode = new window.kakao.Postcode({
    oncomplete: (data) => {
      hasSelectedAddress = true;
      onSelect(toPostcodeSelection(data));
    },
    onclose: () => {
      if (!hasSelectedAddress) onClose();
    },
  });
  postcode.open();
}
