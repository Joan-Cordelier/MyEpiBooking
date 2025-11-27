import 'package:flutter/material.dart';
import 'app_header.dart';
import 'burger_menu.dart';

class AppShell extends StatefulWidget {
  final String title;
  final Widget child;

  const AppShell({
    super.key,
    required this.title,
    required this.child,
  });

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  bool _isMenuOpen = false;

  void _toggleMenu() {
    setState(() {
      _isMenuOpen = !_isMenuOpen;
    });
  }

  void _navigateAndClose(String route) {
    setState(() {
      _isMenuOpen = false;
    });
    Navigator.pushNamed(context, route);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            // Fond + header + contenu de la page
            Container(
              width: double.infinity,
              height: double.infinity,
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Color(0xFF1A1580),
                    Color(0xFF3B26FF),
                  ],
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  AppHeader(
                    title: widget.title,
                    isMenuOpen: _isMenuOpen,
                    onProfilePressed: () {
                      _navigateAndClose('/profile');
                    },
                    onMenuPressed: _toggleMenu,
                  ),
                  // le contenu spécifique à chaque page
                  Expanded(child: widget.child),
                ],
              ),
            ),

            // Menu burger par-dessus
            if (_isMenuOpen)
              Positioned(
                right: 0,
                top: 0,
                bottom: 0,
                width: MediaQuery.of(context).size.width / 2,
                child: BurgerMenu(
                  onClose: _toggleMenu,
                  onNavigate: _navigateAndClose,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
