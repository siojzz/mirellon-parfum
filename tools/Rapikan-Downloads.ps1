# ==============================================================================
# SCRIPT PEMBERSIH & PENGELOMPOK DOWNLOADS (POWERSHELL ENGINE)
# ==============================================================================

# 1. Cari Lokasi Folder Downloads yang Sebenarnya
$downloadsPath = $null

try {
    $regKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders"
    $regVal = (Get-ItemProperty -Path $regKey -ErrorAction SilentlyContinue)."{374DE290-123F-4565-9164-39C4925E467B}"
    if ($regVal) {
        $downloadsPath = [System.Environment]::ExpandEnvironmentVariables($regVal)
    }
} catch {}

if (-not $downloadsPath -or -not (Test-Path -LiteralPath $downloadsPath)) {
    $downloadsPath = Join-Path -Path $env:USERPROFILE -ChildPath "Downloads"
}

# 2. Konfigurasi Kategori dan Ekstensi
$categories = [ordered]@{
    "Dokumen"              = @(".pdf", ".docx", ".doc", ".xlsx", ".xls", ".pptx", ".ppt", ".txt", ".csv", ".epub", ".odt", ".rtf", ".md")
    "Gambar"               = @(".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico", ".tiff", ".heic", ".psd", ".ai", ".raw")
    "Video"                = @(".mp4", ".mkv", ".avi", ".mov", ".wmv", ".flv", ".webm", ".m4v", ".3gp")
    "Musik & Audio"        = @(".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a", ".wma", ".mid")
    "Aplikasi & Installer" = @(".exe", ".msi", ".apk", ".iso", ".bat", ".cmd")
    "Arsip & Zip"          = @(".zip", ".rar", ".7z", ".tar", ".gz", ".bz2", ".xz")
    "Kode & Data"          = @(".json", ".xml", ".sql", ".html", ".css", ".js", ".py", ".java", ".cpp", ".c", ".php", ".ts", ".ipynb")
}

$ignoredExtensions = @(".tmp", ".crdownload", ".part", ".download", ".opdownload")
$ignoredFileNames  = @("desktop.ini", "thumbs.db", "Rapikan-Downloads.bat", "Rapikan-Downloads.ps1", "Jalankan-Rapikan-Downloads.bat")

function Get-UniqueDestinationPath {
    param(
        [string]$destinationFolder,
        [string]$originalFileName
    )
    
    $targetPath = [System.IO.Path]::Combine($destinationFolder, $originalFileName)
    if (-not [System.IO.File]::Exists($targetPath)) {
        return $targetPath
    }

    $nameOnly = [System.IO.Path]::GetFileNameWithoutExtension($originalFileName)
    $extOnly  = [System.IO.Path]::GetExtension($originalFileName)
    
    $counter = 1
    do {
        $newName = "$nameOnly ($counter)$extOnly"
        $targetPath = [System.IO.Path]::Combine($destinationFolder, $newName)
        $counter++
    } while ([System.IO.File]::Exists($targetPath))

    return $targetPath
}

function Run-Cleaner {
    param([bool]$dryRun = $false)

    if (-not [System.IO.Directory]::Exists($downloadsPath)) {
        Write-Host "`n[ERROR] Folder Downloads tidak ditemukan di: $downloadsPath" -ForegroundColor Red
        return
    }

    Write-Host "`n========================================================" -ForegroundColor Cyan
    if ($dryRun) {
        Write-Host " [SIMULASI / PREVIEW] File yang akan dirapikan:" -ForegroundColor Yellow
    } else {
        Write-Host " [MEMPROSES] Memindahkan file ke folder kategori..." -ForegroundColor Green
    }
    Write-Host " Lokasi Folder: $downloadsPath" -ForegroundColor White
    Write-Host "========================================================" -ForegroundColor Cyan

    $dirInfo = New-Object System.IO.DirectoryInfo($downloadsPath)
    $allFiles = $dirInfo.GetFiles()

    $validFiles = @()
    foreach ($f in $allFiles) {
        if ($ignoredFileNames -contains $f.Name) { continue }
        if ($ignoredExtensions -contains $f.Extension.ToLower()) { continue }
        if (($f.Attributes -band [System.IO.FileAttributes]::Hidden) -or ($f.Attributes -band [System.IO.FileAttributes]::System)) { continue }
        $validFiles += $f
    }

    if ($validFiles.Count -eq 0) {
        Write-Host "`nFolder Downloads sudah bersih dan rapi! Tidak ada file baru yang perlu dipindahkan." -ForegroundColor Green
        return
    }

    $successCount = 0
    $failCount = 0

    foreach ($file in $validFiles) {
        $ext = $file.Extension.ToLower()
        $matchedCategory = $null

        foreach ($cat in $categories.Keys) {
            if ($categories[$cat] -contains $ext) {
                $matchedCategory = $cat
                break
            }
        }

        if (-not $matchedCategory) {
            $matchedCategory = "Lain-lain"
        }

        $targetFolder = [System.IO.Path]::Combine($downloadsPath, $matchedCategory)

        if ($dryRun) {
            Write-Host " -> [Rencana] " -NoNewline -ForegroundColor DarkYellow
            Write-Host "$($file.Name)" -NoNewline -ForegroundColor White
            Write-Host " ==> " -NoNewline -ForegroundColor Gray
            Write-Host "[$matchedCategory]" -ForegroundColor Magenta
            $successCount++
        } else {
            if (-not [System.IO.Directory]::Exists($targetFolder)) {
                try {
                    [System.IO.Directory]::CreateDirectory($targetFolder) | Out-Null
                } catch {
                    Write-Host " [GAGAL BUAT FOLDER] $matchedCategory : $_" -ForegroundColor Red
                    $failCount++
                    continue
                }
            }

            $finalPath = Get-UniqueDestinationPath -destinationFolder $targetFolder -originalFileName $file.Name

            try {
                [System.IO.File]::Move($file.FullName, $finalPath)
                Write-Host " [SUKSES] " -NoNewline -ForegroundColor Green
                Write-Host "$($file.Name)" -NoNewline -ForegroundColor White
                Write-Host " -> " -NoNewline -ForegroundColor Gray
                Write-Host "[$matchedCategory]" -ForegroundColor Magenta
                $successCount++
            } catch [System.IO.IOException] {
                Write-Host " [TERKUNCI] " -NoNewline -ForegroundColor Red
                Write-Host "$($file.Name) (Sedang dibuka aplikasi lain)" -ForegroundColor Yellow
                $failCount++
            } catch {
                Write-Host " [GAGAL] " -NoNewline -ForegroundColor Red
                Write-Host "$($file.Name) ($($_.Exception.Message))" -ForegroundColor DarkRed
                $failCount++
            }
        }
    }

    Write-Host "`n--------------------------------------------------------" -ForegroundColor Cyan
    if ($dryRun) {
        Write-Host "Total file yang siap dipindahkan: $successCount file" -ForegroundColor Yellow
    } else {
        Write-Host "Hasil: $successCount file berhasil dirapikan." -ForegroundColor Green
        if ($failCount -gt 0) {
            Write-Host "$failCount file gagal (mungkin sedang dibuka oleh program lain)." -ForegroundColor Yellow
        }
    }
    Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
}

Clear-Host
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "         PEMBERSIH & PENGATUR FOLDER DOWNLOADS          " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Folder Terdeteksi: $downloadsPath`n" -ForegroundColor Gray

Write-Host "Pilihan:" -ForegroundColor White
Write-Host " [1] RAPIKAN SEMUA FILE SEKARANG" -ForegroundColor Green
Write-Host " [2] PREVIEW / SIMULASI (Lihat apa saja yang akan dipindah)" -ForegroundColor Yellow
Write-Host " [3] Buka Folder Downloads di File Explorer" -ForegroundColor Cyan
Write-Host " [4] Keluar" -ForegroundColor Gray

$pilihan = Read-Host "`nKetik angka pilihan (1/2/3/4) lalu tekan ENTER"

switch ($pilihan.Trim()) {
    "1" { Run-Cleaner -dryRun $false }
    "2" { Run-Cleaner -dryRun $true }
    "3" { Invoke-Item -LiteralPath $downloadsPath }
    "4" { Write-Host "`nKeluar dari program. Terima kasih!" -ForegroundColor Yellow }
    default { Write-Host "`nPilihan tidak dikenal." -ForegroundColor Red }
}
