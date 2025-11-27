import 'package:flutter/material.dart';

class AppHeader extends StatelessWidget {
  final String title;
  final VoidCallback onProfilePressed;
  final VoidCallback onMenuPressed;
  final bool isMenuOpen;

  const AppHeader({
    super.key,
    required this.title,
    required this.onProfilePressed,
    required this.onMenuPressed,
    required this.isMenuOpen,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            onPressed: onProfilePressed,
            icon: const Icon(
              Icons.person_outline,
              color: Colors.white,
            ),
          ),
          Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.5,
            ),
          ),
          IconButton(
            onPressed: onMenuPressed,
            icon: Icon(
              isMenuOpen ? Icons.close : Icons.menu,
              color: Colors.white,
              size: 28,
            ),
          ),
        ],
      ),
    );
  }
}
