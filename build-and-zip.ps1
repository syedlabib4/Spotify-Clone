# Set error preference to stop on any errors
$ErrorActionPreference = "Stop"

Write-Host "=== 1. Building React Frontend ===" -ForegroundColor Green
cd frontend
# Set Vite environment variable to route API requests to /api
$env:VITE_API_URL = "/api"
npm install
npm run build
Remove-Item env:VITE_API_URL
cd ..

Write-Host "=== 2. Creating Temporary Release Folder ===" -ForegroundColor Green
$BuildDir = "eb-build-temp"
if (Test-Path $BuildDir) {
    Remove-Item -Recurse -Force $BuildDir
}
New-Item -ItemType Directory -Path $BuildDir | Out-Null

# Copy root package.json and lockfile
Copy-Item "package.json" $BuildDir
if (Test-Path "package-lock.json") {
    Copy-Item "package-lock.json" $BuildDir
}

# Copy backend files
Write-Host "Copying backend folder..."
Copy-Item -Recurse "backend" $BuildDir
# Remove backend node_modules and local .env to keep zip clean
if (Test-Path "$BuildDir/backend/node_modules") {
    Remove-Item -Recurse -Force "$BuildDir/backend/node_modules"
}
if (Test-Path "$BuildDir/backend/.env") {
    Remove-Item -Force "$BuildDir/backend/.env"
}

# Copy pre-built frontend files (excluding node_modules and src to minimize file size)
Write-Host "Copying pre-built frontend..."
New-Item -ItemType Directory -Path "$BuildDir/frontend" | Out-Null
Copy-Item -Recurse "frontend/dist" "$BuildDir/frontend"

# Copy .platform config if it exists
if (Test-Path ".platform") {
    Write-Host "Copying .platform configuration..."
    Copy-Item -Recurse ".platform" $BuildDir
}

Write-Host "=== 3. Zipping Deployment Package ===" -ForegroundColor Green
$ZipFile = "spotify-eb-deployment.zip"
if (Test-Path $ZipFile) {
    Remove-Item $ZipFile
}
# Compress the temp folder contents into the root zip file using tar with zip format to avoid backslash path separator issues on Linux/AWS
tar -c --format zip -f $ZipFile -C $BuildDir .

Write-Host "=== 4. Cleaning Up ===" -ForegroundColor Green
Remove-Item -Recurse -Force $BuildDir

Write-Host "Success! Upload '$ZipFile' to your Elastic Beanstalk environment." -ForegroundColor Cyan
