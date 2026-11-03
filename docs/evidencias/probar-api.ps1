[CmdletBinding()]
param(
    [string]$ApiBaseUrl = 'http://127.0.0.1:4002'
)

$ErrorActionPreference = 'Stop'
$apiUri = [Uri]$ApiBaseUrl
if ($apiUri.Host -notin @('localhost', '127.0.0.1') -or $apiUri.Port -ne 4002) {
    throw 'Por seguridad, esta evidencia solo admite una instancia local de pruebas en el puerto 4002.'
}
$ApiRoot = $ApiBaseUrl.TrimEnd('/') + '/api'
$RunId = [Guid]::NewGuid().ToString('N').Substring(0, 12)
$TestEmail = "evidencia-$RunId@kudo.local"
$TestPassword = [Guid]::NewGuid().ToString('N') + [Guid]::NewGuid().ToString('N')
$Headers = @{}
$Results = [System.Collections.Generic.List[object]]::new()

function Protect-ResponseValue {
    param([object]$Value)

    if ($null -eq $Value) { return $null }
    if ($Value -is [string]) { return $Value }
    if ($Value -is [System.Collections.IDictionary]) {
        $safe = [ordered]@{}
        foreach ($key in $Value.Keys) {
            if ($key -match '^(token|email|password|passwordHash)$') {
                $safe[$key] = '[OCULTO]'
            } elseif ($key -match '^(id|userId|goalId)$') {
                $safe[$key] = '[ID_OCULTO]'
            } else {
                $safe[$key] = Protect-ResponseValue $Value[$key]
            }
        }
        return $safe
    }
    if ($Value -is [System.Array]) {
        return ,@($Value | ForEach-Object { Protect-ResponseValue $_ })
    }
    if ($Value -is [pscustomobject]) {
        $safe = [ordered]@{}
        foreach ($property in $Value.PSObject.Properties) {
            if ($property.Name -match '^(token|email|password|passwordHash)$') {
                $safe[$property.Name] = '[OCULTO]'
            } elseif ($property.Name -match '^(id|userId|goalId)$') {
                $safe[$property.Name] = '[ID_OCULTO]'
            } else {
                $safe[$property.Name] = Protect-ResponseValue $property.Value
            }
        }
        return $safe
    }
    return $Value
}

function Invoke-KudoRequest {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Path,
        [int]$ExpectedStatus,
        [object]$Body,
        [switch]$Authenticated
    )

    $requestHeaders = @{}
    if ($Authenticated) {
        if (-not $script:Headers.Authorization) { throw 'La sesión de prueba aún no está autenticada.' }
        $requestHeaders.Authorization = $script:Headers.Authorization
    }
    $request = @{
        Uri         = $script:ApiRoot + $Path
        Method      = $Method
        Headers     = $requestHeaders
        ContentType = 'application/json'
        TimeoutSec  = 20
        ErrorAction = 'Stop'
    }
    if ($null -ne $Body) { $request.Body = $Body | ConvertTo-Json -Depth 10 -Compress }

    $response = Invoke-WebRequest @request
    $json = if ($response.Content) { $response.Content | ConvertFrom-Json } else { $null }
    $record = [PSCustomObject]@{
        runId          = $script:RunId
        endpoint       = $Name
        method         = $Method
        url            = $request.Uri
        expectedStatus = $ExpectedStatus
        actualStatus   = [int]$response.StatusCode
        passed         = ([int]$response.StatusCode -eq $ExpectedStatus)
        body           = Protect-ResponseValue $json
    }
    $script:Results.Add($record)
    return $json
}

# Inicia el backend de prueba en PORT=4002 con DATABASE_URL apuntando solo a kudo_test.
# Cada ejecución crea una cuenta y registros únicos en esa base de pruebas.
$null = Invoke-KudoRequest -Name 'GET /api/health' -Method 'GET' -Path '/health' -ExpectedStatus 200
if (-not $Results[0].passed) { throw 'El backend no respondió correctamente en /api/health.' }

$register = Invoke-KudoRequest -Name 'POST /api/auth/register' -Method 'POST' -Path '/auth/register' -ExpectedStatus 201 -Body @{
    email = $TestEmail; password = $TestPassword; name = "Cuenta Evidencia $RunId"; age = 25; currency = 'GTQ'; expenseCategories = @('Comida', 'Pruebas')
}
$login = Invoke-KudoRequest -Name 'POST /api/auth/login' -Method 'POST' -Path '/auth/login' -ExpectedStatus 200 -Body @{ email = $TestEmail; password = $TestPassword }
$script:Headers.Authorization = 'Bearer ' + $login.token
$null = Invoke-KudoRequest -Name 'GET /api/auth/me' -Method 'GET' -Path '/auth/me' -ExpectedStatus 200 -Authenticated

$date = [DateTime]::UtcNow.ToString("yyyy-MM-dd'T'HH:mm:ss.fff'Z'")
$month = [DateTime]::UtcNow.ToString('yyyy-MM')
$null = Invoke-KudoRequest -Name 'POST /api/transactions' -Method 'POST' -Path '/transactions' -ExpectedStatus 201 -Authenticated -Body @{
    title = "Gasto temporal $RunId"; category = 'Pruebas'; type = 'EXPENSE'; amount = 1.25; date = $date; paymentMethod = 'Efectivo'
}
$null = Invoke-KudoRequest -Name 'GET /api/transactions' -Method 'GET' -Path '/transactions?limit=100' -ExpectedStatus 200 -Authenticated
$null = Invoke-KudoRequest -Name 'POST /api/budgets' -Method 'POST' -Path '/budgets' -ExpectedStatus 201 -Authenticated -Body @{
    category = 'Pruebas'; monthlyLimit = 100; month = $month
}
$null = Invoke-KudoRequest -Name 'GET /api/budgets' -Method 'GET' -Path "/budgets?month=$month" -ExpectedStatus 200 -Authenticated
$deadline = [DateTime]::UtcNow.AddDays(90).ToString("yyyy-MM-dd'T'HH:mm:ss.fff'Z'")
$null = Invoke-KudoRequest -Name 'POST /api/goals' -Method 'POST' -Path '/goals' -ExpectedStatus 201 -Authenticated -Body @{
    name = "Meta Evidencia $RunId"; target = 250; deadline = $deadline
}
$null = Invoke-KudoRequest -Name 'GET /api/goals' -Method 'GET' -Path '/goals' -ExpectedStatus 200 -Authenticated

$Results | ConvertTo-Json -Depth 20
if (@($Results | Where-Object { -not $_.passed }).Count -gt 0) { exit 1 }
