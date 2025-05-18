# PowerShell script: EVM Bytecode Disassembly & Analysis
# Prerequisite: go-ethereum's evm tool must be installed and in your PATH
# Usage: .\analyze_bytecode.ps1 -InputFile ..\crypto\usdt_raw.bin [-OutputFile usdt.opcodes] [-Stats]

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$InputFile,
    [Parameter(Mandatory=$false, Position=1)]
    [string]$OutputFile,
    [switch]$Stats
)

function Check-Dependency {
    if (-not (Get-Command evm -ErrorAction SilentlyContinue)) {
        Write-Error "The 'evm' tool is not installed or not in your PATH. Install with: go install github.com/ethereum/go-ethereum/cmd/evm@latest"
        exit 1
    }
}

function Check-InputFile {
    if (-not (Test-Path $InputFile)) {
        Write-Error "Input file '$InputFile' does not exist."
        exit 1
    }
}

Check-Dependency
Check-InputFile

# Disassemble
if ($OutputFile) {
    evm disasm --input "$InputFile" --format asm | Out-File -Encoding utf8 "$OutputFile"
    Write-Host "Disassembly written to $OutputFile"
} else {
    evm disasm --input "$InputFile" --format asm
}

# Optional: Opcode statistics
if ($Stats) {
    $lines = if ($OutputFile) { Get-Content $OutputFile } else { evm disasm --input "$InputFile" --format asm }
    $opcodes = $lines | Where-Object { $_ -match '^[0-9a-f]+:' } | ForEach-Object { ($_ -split '\s+')[1] }
    $stats = $opcodes | Group-Object | Sort-Object Count -Descending
    Write-Host "\nOpcode Frequency Stats:"
    $stats | Format-Table -Property Name,Count
}
