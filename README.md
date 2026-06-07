# Data Structure Visualizer

자료구조 수업에서 배운 내용을 직접 조작하며 이해할 수 있는 인터랙티브 웹사이트입니다.

## 실행 방법

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

브라우저에서 아래 주소를 엽니다.

```text
http://127.0.0.1:8000/
```

## 구현 자료구조

- Stack: push, pop, top, overflow, underflow
- Queue: enqueue, dequeue, front, rear, empty 상태
- Linked List: 노드 삽입, 삭제, 검색, 포인터 시각화
- Binary Search Tree: insert, search, inorder traversal, 경로 하이라이트

## 주요 기능

- `index.html`, `about.html` 2개 페이지 구성
- 상단 카드형 자료구조 선택 메뉴
- 입력값 기반 연산 실행
- D3.js 기반 시각화 렌더링
- Bootstrap Reboot 기반 기본 스타일 정리
- 부드러운 하이라이트 애니메이션
- 현재 동작 설명 표시
- 시간복잡도 표
- 반응형 대시보드 UI
