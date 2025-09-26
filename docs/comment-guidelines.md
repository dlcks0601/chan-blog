# 코드 주석 가이드라인

개발 생산성을 높이는 실용적 주석 작성법입니다.

## 핵심 철학

### "코드가 설명하지 못하는 것만 문서화"
- **What(무엇)**: 코드 자체가 설명
- **Why(왜)**: 주석으로 설명
- **How(어떻게)**: 복잡할 때만 주석으로 설명

### "3-2-1 원칙"
- **3줄 이하**: 함수 문서화는 핵심만 3줄 내외
- **2개 예시**: 기본 사용법 + 특수 케이스
- **1개 패턴**: 가장 자주 사용되는 패턴 우선

## 즉시 제거 대상 ❌

### 자명한 주석들
```typescript
// 사용자 정보를 저장한다
const userInfo = { name, email };

// 버튼 컴포넌트
export const Button = () => {};

// 색상을 설정한다
setColor('red');

/**
 * 유저 인터페이스를 위한 버튼 컴포넌트
 * 직관적이고 사용하기 쉬운 인터랙션을 제공합니다
 * 일관된 디자인 시스템을 구축할 수 있습니다
 */
```

### 반복적인 JSX 구조 주석
```typescript
{/* 헤더 */}
<Header />

{/* 메인 콘텐츠 */}
<Main />

{/* 푸터 */}
<Footer />
```

## 필수 문서화 대상 ✅

### 1. 비즈니스 로직과 제약사항
```typescript
// 애플 정책상 iOS에서만 Face ID 사용 가능
const biometricType = Platform.OS === 'ios' ? 'face-id' : 'fingerprint';

// 점수 계산: (기본점수 × 가중치) + 레벨보너스
const finalScore = baseScore * weight + getLevelBonus(level);

// 3초 이상 대기시 UX상 로딩 스피너 표시 필요
if (loadingTime > 3000) showSpinner();
```

### 2. 외부 의존성 특이사항
```typescript
// react-native-reanimated 특성상 매 렌더마다 새로 생성하면 안됨
const animatedValue = useSharedValue(0);

// Expo SDK 50+ 에서만 지원하는 API
const result = await ExpoCamera.requestPermissions();

// Math.random()을 useEffect에서 실행하여 SSR 하이드레이션 오류 방지
useEffect(() => {
  setSpheres(generateRandomSpheres());
}, []);
```

### 3. 임시 해결책 및 향후 개선사항
```typescript
// TODO: 성능 최적화 필요 - 큰 리스트에서 느림 (이슈 #123)
const filteredData = data.filter(heavyOperation);

// FIXME: Android에서 간헐적 크래시 발생 (버전 0.76.5)
// HACK: 임시방편 - API 응답 형태 변경 예정
const normalizedData = response.data?.items || [];
```

### 4. 복잡한 상태 관리
```typescript
// 결제 상태 흐름: pending → processing → (success | failed)
// failed 상태에서는 3회까지 재시도 가능
const [paymentState, setPaymentState] = useState('pending');

// 전역 상태와 로컬 상태 동기화 - 네트워크 재연결시 충돌 방지
useEffect(() => {
  if (isOnline && hasLocalChanges) {
    syncWithServer();
  }
}, [isOnline]);
```

## JSX 구조 주석 특별 규칙

### 허용되는 구조 주석 ✅
**100줄 이상 컴포넌트에서 기능적 의미가 있는 경우만:**

```typescript
{/* 하단 고정 버튼 - safe area 포함 */}
<View className="absolute bottom-0" style={{ paddingBottom: insets.bottom }}>

{/* 조건부 렌더링: 프리미엄 사용자만 표시 */}
{isPremium && <PremiumFeatures />}

{/* 스크롤 컨테이너 - 하단 버튼 공간 확보 */}
<ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

{/* 절대 위치 오버레이 - 이미지 위에 표시 */}
<View className="absolute inset-0 bg-black/50">
```

### 제거 대상 구조 주석 ❌
```typescript
{/* 탭 */}
<TabView />

{/* 이미지 */}
<Image source={uri} />

{/* 텍스트 */}
<Text>내용</Text>

{/* 버튼 그룹 */}
<View className="flex-row">
  <Button />
  <Button />
</View>
```

## 문서화 템플릿

### 공개 API 컴포넌트
```typescript
/**
 * NFT 투표 카드 컴포넌트
 *
 * 블록체인 투표 데이터를 표시하고 사용자 투표를 처리합니다.
 *
 * @example
 * <VoteCard
 *   nftId="123"
 *   onVote={(option) => handleVote(option)}
 * />
 */
export function VoteCard({ nftId, onVote }: Props) {
```

### 커스텀 훅
```typescript
/**
 * 블록체인 투표 관리 훅
 *
 * 투표 제출과 FANC 토큰 보상을 자동 처리합니다.
 *
 * @example
 * const { vote, isLoading } = useVoting('collection-123');
 * await vote({ option: 'yes', amount: 100 });
 */
export function useVoting(collectionId: string) {
```

### 유틸리티 함수
```typescript
/**
 * FANC 토큰 포맷팅 - 소수점 2자리 + 천단위 쉼표
 *
 * @example formatFANC(1234.567) // "1,234.57 FANC"
 */
export function formatFANC(amount: number): string {
```

## 주석 대신 개선 방법

### 컴포넌트 분리 우선
```typescript
// Before: 주석으로 구분
function VotePage() {
  return (
    <View>
      {/* 헤더 영역 - 30줄 */}
      {/* 투표 카드 리스트 - 80줄 */}
      {/* 하단 버튼 영역 - 20줄 */}
    </View>
  );
}

// After: 컴포넌트 분리
function VotePage() {
  return (
    <PageLayout>
      <VoteHeader />
      <VoteCardList />
      <VoteFooter />
    </PageLayout>
  );
}
```

### 의미있는 변수명 사용
```typescript
// Before: 주석으로 설명
const score = base * 1.5 + bonus; // 기본점수에 1.5배 가중치 적용 후 보너스 추가

// After: 변수명으로 설명
const SCORE_WEIGHT = 1.5;
const weightedScore = baseScore * SCORE_WEIGHT;
const finalScore = weightedScore + levelBonus;
```

### 함수 추출
```typescript
// Before: 주석으로 설명
// 복잡한 검증 로직: 이메일 형식 + 도메인 화이트리스트 확인
if (email.includes('@') && ALLOWED_DOMAINS.includes(email.split('@')[1])) {
  // ...
}

// After: 함수로 분리
if (isValidEmail(email) && isAllowedDomain(email)) {
  // ...
}
```

## 실무 체크리스트

### 주석 작성 전 확인사항
- [ ] 코드만 봐도 충분히 이해 가능한가?
- [ ] 함수/변수명이 목적을 명확히 드러내는가?
- [ ] 6개월 후 다른 개발자에게 도움이 될까?
- [ ] "당연한 얘기"를 하고 있지는 않나?

### 필수 문서화 대상
1. **공개 API** - 다른 개발자가 사용할 함수/컴포넌트
2. **복잡한 비즈니스 로직** - 계산 공식, 알고리즘
3. **외부 의존성 특이사항** - 라이브러리 제약, 플랫폼 차이점
4. **임시 해결책** - TODO, FIXME, HACK
5. **복잡한 상태 흐름** - 비동기 처리, 상태 동기화

## ESLint 규칙 설정

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // 자명한 주석 패턴 금지
    '@typescript-eslint/ban-ts-comment': 'error',

    // TODO/FIXME는 허용하되 이슈 번호 강제
    'no-warning-comments': [
      'warn',
      {
        terms: ['todo', 'fixme'],
        location: 'start',
        decoration: ['*', '!', '#']
      }
    ],

    // JSDoc 필수 항목 설정 (공개 API만)
    'jsdoc/require-description': ['error', {
      contexts: ['ExportNamedDeclaration']
    }],
    'jsdoc/require-example': ['error', {
      contexts: ['ExportNamedDeclaration']
    }]
  }
};
```

## 마이그레이션 가이드

### 1단계: 자명한 주석 제거 (1주)
```bash
# 일괄 삭제 스크립트
npm run lint:comments:fix
```

### 2단계: 핵심 API 문서화 (2주)
- 공개 컴포넌트/훅만 문서화
- 템플릿 사용해 일관성 유지

### 3단계: 점진적 개선 (지속)
- 새 코드는 가이드라인 적용
- 기존 코드는 수정시 개선

## 실제 적용 예시

### Before/After 비교

#### React 컴포넌트
```typescript
// ❌ Before: 과도한 문서화
/**
 * Button 컴포넌트
 *
 * 사용자 인터랙션을 위한 버튼 요소입니다.
 * 다양한 스타일과 크기를 지원하며, 접근성 가이드라인을 준수합니다.
 * 일관된 디자인 시스템 구축을 위해 variant 시스템을 사용합니다.
 *
 * @param variant - 버튼의 시각적 스타일을 결정합니다
 * @param size - 버튼의 크기를 설정합니다
 * @param children - 버튼 내부에 표시될 콘텐츠입니다
 * @param onPress - 버튼 클릭시 실행될 함수입니다
 */

// ✅ After: 필요한 정보만
/**
 * 공통 버튼 컴포넌트
 *
 * @example <Button variant="primary" onPress={handleSubmit}>Submit</Button>
 */
```

#### 비즈니스 로직 함수
```typescript
// ❌ Before: 형식적 문서화
/**
 * 사용자 점수를 계산하는 함수입니다.
 * 매개변수로 받은 값들을 이용해 최종 점수를 반환합니다.
 */

// ✅ After: 실제 도움되는 정보
/**
 * 투표 점수 계산 - (기본점수 × 1.2배) + 연속투표 보너스
 *
 * @example calculateVoteScore(100, 5) // 기본 100점, 연속 5일 = 125점
 */
```

---

**목표**: 개발 속도는 유지하면서 정말 필요한 정보는 놓치지 않는 균형점 찾기