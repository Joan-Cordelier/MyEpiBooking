import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../Widget/app_shell.dart';
import '../Provider/auth_provider.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return AppShell(
      title: 'Profil',
      child: Consumer<AuthProvider>(
        builder: (context, auth, child) {
          final user = auth.user;
          if (user == null) {
            return const Center(child: Text('Utilisateur non connecté'));
          }
          return Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Nom: ${user.name ?? 'N/A'}'),
                Text('Prénom: ${user.firstName ?? 'N/A'}'),
                Text('Email: ${user.email}'),
                Text('Promotion: ${user.actualPromotion ?? 'N/A'}'),
                const SizedBox(height: 32),
                ElevatedButton(
                  onPressed: () async {
                    await auth.logout();
                    if (context.mounted) {
                      Navigator.of(context).pushReplacementNamed('/login');
                    }
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                  child: const Text('Se déconnecter'),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
