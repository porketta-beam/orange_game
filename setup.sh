#!/usr/bin/env bash

# 프로젝트 루트로 이동
cd "$(dirname "$0")"

# 디렉터리 생성
mkdir -p public src/assets/images src/assets/styles \
         src/components/Header src/components/GameContainer src/components/Grid \
         src/components/Controls src/components/ScoreBoard src/components/TimeGauge src/components/ScoreModal \
         src/contexts src/hooks src/utils

# 파일 생성
# public
touch public/index.html public/favicon.ico

# 루트 JSX
touch src/App.jsx src/index.jsx

# 컴포넌트별 파일
for comp in Header GameContainer Grid Controls ScoreBoard TimeGauge ScoreModal; do
  comp_dir=src/components/$comp
  touch "$comp_dir/$comp.jsx"
  touch "$comp_dir/$comp.module.css"
  # Grid는 Cell.jsx 추가
  if [ "$comp" = "Grid" ]; then
    touch "$comp_dir/Cell.jsx"
  fi
done

# 전역 스타일
touch src/assets/styles/global.css

# Context, Hooks, Utils 폴더에 README 추가
touch src/contexts/README.md src/hooks/README.md src/utils/README.md

# Gitignore 및 README
touch .gitignore README.md

echo "파일 생성 완료!"