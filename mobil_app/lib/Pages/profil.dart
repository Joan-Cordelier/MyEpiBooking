import 'package:flutter/material.dart';
import '../Widget/app_shell.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return AppShell(
      title: 'Profil',
      child: const Center(
        child: Text('Page profil (à compléter)'),
      ),
    );
  }
}
