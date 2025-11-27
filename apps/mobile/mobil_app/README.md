# epi_booking

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.

## Launcher icon (developer guide)

This project uses `flutter_launcher_icons` to generate the platform icons.
To add or replace the app icon:

1. Place your 1024x1024 icon at `assets/icon/app_icon.png` (recommended PNG transparent background).
2. Optionally, add `assets/icon/app_icon_foreground.png` and set `adaptive_icon_background` in `pubspec.yaml` for Android adaptive icons.
3. Run the following from the `mobil_app` folder:

```powershell
flutter pub get
flutter pub run flutter_launcher_icons:main
```

This will update the Android `mipmap-*` folders and the iOS `AppIcon.appiconset`.
