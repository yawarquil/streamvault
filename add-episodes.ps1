# Episode Import Helper Script
$showSlug = Read-Host "Enter show slug (e.g., stranger-things)"
$seasonNumber = Read-Host "Enter season number (e.g., 1)"

Write-Host "Paste episode URLs (one per line). Type 'done' when finished" -ForegroundColor Yellow

$episodes = @()
$episodeNum = 1

while ($true) {
    $url = Read-Host "Episode $episodeNum URL (or 'done')"
    if ($url -eq 'done') { break }
    
    if ($url -match '/d/([^/]+)') {
        $fileId = $Matches[1]
        $episodes += @{
            title = "Episode $episodeNum"
            episodeNumber = $episodeNum
            seasonNumber = [int]$seasonNumber
            description = "Episode $episodeNum"
            duration = 45
            videoUrl = "https://drive.google.com/file/d/$fileId/preview"
        }
        Write-Host "Added Episode $episodeNum" -ForegroundColor Green
        $episodeNum++
    }
}

$importData = @{ showSlug = $showSlug; episodes = $episodes }
$json = $importData | ConvertTo-Json -Depth 10
$outputFile = "C:\Users\yawar\Desktop\StreamVault\bulk-imports\$showSlug.json"
$json | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "File created: $outputFile" -ForegroundColor Green
Write-Host "Episodes: $($episodes.Count)" -ForegroundColor Cyan
