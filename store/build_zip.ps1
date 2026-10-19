# Empacota a extensao para a Chrome Web Store.
# So os arquivos de runtime + as licencas (a AGPL exige entregar copia da
# licenca junto com o programa distribuido). Nada de store/, test/, docs/.
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = Split-Path -Parent $PSScriptRoot
$ver = (Get-Content (Join-Path $root "manifest.json") -Raw | ConvertFrom-Json).version
$out = Join-Path $PSScriptRoot "luciola-extension-$ver.zip"

$files = @(
  "manifest.json", "background.js", "content.js", "content_ytchat.js",
  "LICENSE", "LICENSE-MODEL.md",
  "src/clean.js", "src/model.js", "src/tfidf.js",
  "model/luciola_linear_v5.json",
  "popup/popup.html", "popup/popup.js",
  "icons/icon16.png", "icons/icon48.png", "icons/icon128.png",
  "_locales/en/messages.json", "_locales/pt_BR/messages.json"
)

foreach ($f in $files) {
  $p = Join-Path $root $f
  if (-not (Test-Path $p)) { throw "faltando no repo: $f" }
}

if (Test-Path $out) { [IO.File]::Delete($out) }
$zip = [System.IO.Compression.ZipFile]::Open($out, "Create")
try {
  foreach ($f in $files) {
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
      $zip, (Join-Path $root $f), $f) | Out-Null
  }
} finally { $zip.Dispose() }

$zip = [System.IO.Compression.ZipFile]::OpenRead($out)
$n = $zip.Entries.Count
$zip.Dispose()
"$out"
"$n entradas | $([math]::Round((Get-Item $out).Length / 1MB, 2)) MB | versao $ver"
