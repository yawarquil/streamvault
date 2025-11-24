# Delete Season Script
# Deletes all episodes for a specific season of a show

$showId = "3d34d92d-66b7-4645-a165-94a0e2223ff7"  # Stranger Things
$seasonNumber = 1

Write-Host "Logging in to admin..." -ForegroundColor Cyan

# Login to get token
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body '{"username":"admin","password":"streamvault2024"}'

$token = $loginResponse.token

Write-Host "Deleting Stranger Things Season $seasonNumber..." -ForegroundColor Yellow

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/shows/$showId/seasons/$seasonNumber" `
    -Method Delete `
    -Headers @{
        "x-admin-token" = $token
    }

if ($response.success) {
    Write-Host "SUCCESS: Deleted $($response.deleted) episodes from Season $($response.season)" -ForegroundColor Green
} else {
    Write-Host "ERROR: Failed to delete season" -ForegroundColor Red
}
