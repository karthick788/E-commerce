# Test Authentication Flow

# Configuration
$baseUrl = "http://localhost:3000"
$email = "test_$(Get-Date -Format "yyyyMMddHHmmss")@example.com"
$password = "Test@1234"
$name = "Test User"

# Enable TLS 1.2 for secure connections
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Function to make API requests
function Invoke-ApiRequest {
    [CmdletBinding()]
    param (
        [string]$Url,
        [string]$Method = "GET",
        [object]$Body = $null,
        [Microsoft.PowerShell.Commands.WebRequestSession]$Session = $null
    )
    
    $headers = @{
        "Content-Type" = "application/json"
        "Accept" = "application/json"
    }
    
    Write-Host "`n[DEBUG] Sending $Method request to $Url" -ForegroundColor Cyan
    if ($Body) {
        Write-Host "[DEBUG] Request body: $($Body | ConvertTo-Json -Depth 5)" -ForegroundColor Cyan
    }
    
    $params = @{
        Uri = $Url
        Method = $Method
        Headers = $headers
        SessionVariable = 'session'
        UseBasicParsing = $true
        MaximumRedirection = 0
        ErrorAction = 'Stop'
    }
    
    if ($Body) {
        $params["Body"] = $Body | ConvertTo-Json
    }
    
    if ($Session) {
        $params["WebSession"] = $Session
    }
    
    try {
        $response = Invoke-WebRequest @params -ErrorAction Stop
        
        Write-Host "[DEBUG] Response status: $($response.StatusCode)" -ForegroundColor Green
        if ($response.Content) {
            Write-Host "[DEBUG] Response content: $($response.Content)" -ForegroundColor Green
        }
        
        $content = $null
        try {
            $content = $response.Content | ConvertFrom-Json -ErrorAction Stop
        } catch {
            $content = $response.Content
        }
        
        return @{
            StatusCode = $response.StatusCode
            Content = $content
            Headers = $response.Headers
            Session = $session
            RawResponse = $response
        }
    } catch [System.Net.WebException] {
        $errorResponse = $_.Exception.Response
        $statusCode = if ($errorResponse) { [int]$errorResponse.StatusCode } else { 0 }
        $errorContent = $null
        
        try {
            if ($_.ErrorDetails) {
                $errorContent = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
            }
            if (-not $errorContent -and $_.Exception.Response) {
                $stream = $_.Exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($stream)
                $errorContent = $reader.ReadToEnd() | ConvertFrom-Json -ErrorAction SilentlyContinue
            }
        } catch {
            $errorContent = $_.Exception.Message
        }
        
        Write-Host "[ERROR] Request failed with status $statusCode" -ForegroundColor Red
        Write-Host "[ERROR] Details: $($_.Exception.Message)" -ForegroundColor Red
        if ($errorContent) {
            Write-Host "[ERROR] Error content: $($errorContent | ConvertTo-Json -Depth 5)" -ForegroundColor Red
        }
        
        return @{
            StatusCode = $statusCode
            Error = if ($errorContent) { $errorContent } else { $_.Exception.Message }
            Headers = if ($errorResponse) { $errorResponse.Headers } else { @{} }
            RawError = $_
        }
    }
}

# 1. Register a new user
Write-Host "[REGISTER] Testing registration..."

# First, check if the server is running
try {
    $healthCheck = Invoke-WebRequest -Uri $baseUrl -UseBasicParsing -ErrorAction Stop
    Write-Host "[DEBUG] Server is running" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Could not connect to server at $baseUrl" -ForegroundColor Red
    Write-Host "[ERROR] Make sure the Next.js development server is running with 'npm run dev'" -ForegroundColor Red
    exit 1
}

$registerData = @{
    name = $name
    email = $email
    password = $password
}

Write-Host "[DEBUG] Registering user with email: $email" -ForegroundColor Cyan
$registerResponse = Invoke-ApiRequest -Url "$baseUrl/api/auth/register" -Method "POST" -Body $registerData

if ($registerResponse.StatusCode -eq 201) {
    Write-Host "[SUCCESS] Registration successful!" -ForegroundColor Green
    Write-Host "   User ID: $($registerResponse.Content.user.id)"
    
    # 2. Login with credentials
    Write-Host "`n[LOGIN] Testing login..."
    $loginData = @{
        email = $email
        password = $password
    }
    
    $session = $null
    # First, get CSRF token
    $csrfResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/csrf" -UseBasicParsing -SessionVariable 'session'
    $csrfToken = ($csrfResponse.Content | ConvertFrom-Json).csrfToken

    # Add CSRF token to login data
    $loginData['csrfToken'] = $csrfToken
    $loginData['redirect'] = 'false'  # Don't redirect
    $loginData['json'] = 'true'       # Request JSON response
    
    # Set content type to form-urlencoded
    $headers = @{
        'Content-Type' = 'application/x-www-form-urlencoded'
        'Accept' = 'application/json'
    }
    
    # Convert body to form-urlencoded format
    $body = ($loginData.GetEnumerator() | ForEach-Object { 
        [System.Web.HttpUtility]::UrlEncode($_.Key) + '=' + [System.Web.HttpUtility]::UrlEncode($_.Value) 
    }) -join '&'
    
    try {
        $loginResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/callback/credentials?" -Method "POST" -Headers $headers -Body $body -WebSession $session -UseBasicParsing -MaximumRedirection 0 -ErrorAction Stop
        
        $loginResult = @{
            StatusCode = $loginResponse.StatusCode
            Content = $loginResponse.Content | ConvertFrom-Json -ErrorAction SilentlyContinue
            Headers = $loginResponse.Headers
            Session = $session
        }
        
        Write-Host "[SUCCESS] Login successful!" -ForegroundColor Green
        
        # 3. Get session
        Write-Host "`n[SESSION] Testing session..."
        $sessionResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/session" -WebSession $session -UseBasicParsing -ErrorAction Stop
        $sessionData = $sessionResponse.Content | ConvertFrom-Json
        
        if ($sessionData.user) {
            Write-Host "[SUCCESS] Session retrieved successfully!" -ForegroundColor Green
            Write-Host "   User: $($sessionData.user.email)"
            Write-Host "   Expires: $($sessionData.expires)"
        } else {
            Write-Host "[WARNING] No user in session" -ForegroundColor Yellow
        }
        
    } catch [System.Net.WebException] {
        $statusCode = [int]$_.Exception.Response.StatusCode
        $errorContent = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
        
        Write-Host "[ERROR] Login failed with status $statusCode" -ForegroundColor Red
        if ($errorContent) {
            Write-Host "   Error: $($errorContent | ConvertTo-Json -Depth 5)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "[ERROR] Registration failed with status $($registerResponse.StatusCode)" -ForegroundColor Red
    if ($registerResponse.Error) {
        Write-Host "   Error: $($registerResponse.Error | ConvertTo-Json -Depth 5)" -ForegroundColor Red
    }
}
