#!/usr/bin/env pwsh

Write-Output "Running tests with coverage..."
pnpm test:coverage

if ($LASTEXITCODE -eq 0) {
    Write-Output "Tests passed!"
    Write-Output "Coverage report is available in ./coverage/lcov-report/index.html"
    
    # Open the coverage report in default browser if on Windows
    if ($IsWindows) {
        Start-Process "./coverage/lcov-report/index.html"
    }
} else {
    Write-Output "Some tests failed. Please check the test output for details."
    exit 1
}
