
# setup.ps1

# 1) 스크립트 위치(프로젝트 루트)로 이동
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# 2) 생성할 폴더 목록
$dirs = @(
  'public',
  'src\assets\images','src\assets\styles',
  'src\components\Header','src\components\GameContainer','src\components\Grid',
  'src\components\Controls','src\components\ScoreBoard','src\components\TimeGauge','src\components\ScoreModal',
  'src\contexts','src\hooks','src\utils'
)

# 3) 폴더 생성
foreach ($d in $dirs) {
  New-Item -ItemType Directory -Path $d -Force | Out-Null
}

# 4) 생성할 파일 목록
$files = @(
  'public\index.html','public\favicon.ico',
  'src\App.jsx','src\index.jsx',
  '.gitignore','README.md',
  'src\assets\styles\global.css',
  'src\contexts\README.md','src\hooks\README.md','src\utils\README.md'
)

# 5) 빈 파일 생성
foreach ($f in $files) {
  New-Item -ItemType File -Path $f -Force | Out-Null
}

# 6) 컴포넌트별 파일 생성
$comps = @('Header','GameContainer','Grid','Controls','ScoreBoard','TimeGauge','ScoreModal')
foreach ($c in $comps) {
  $base = "src\components\$c"
  New-Item -ItemType File -Path "$base\$c.jsx" -Force | Out-Null
  New-Item -ItemType File -Path "$base\$c.module.css" -Force | Out-Null
  if ($c -eq 'Grid') {
    New-Item -ItemType File -Path "$base\Cell.jsx" -Force | Out-Null
  }
}

Write-Host "파일 생성 완료!"