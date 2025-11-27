# PowerShell script to generate launcher icons for the Flutter app
# Usage: run this from the root of the mobil_app folder or pass -WorkingDirectory.

Write-Output "Running flutter pub get and flutter_launcher_icons..."
flutter pub get
flutter pub run flutter_launcher_icons:main

Write-Output "Launcher icon generation complete. Check android/ and ios/ assets to verify results."