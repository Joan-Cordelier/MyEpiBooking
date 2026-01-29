import 'package:flutter/material.dart';

class BurgerMenu extends StatelessWidget {
  final VoidCallback onClose;
  final void Function(String route) onNavigate;

  const BurgerMenu({
    super.key,
    required this.onClose,
    required this.onNavigate,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF221C7D),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SizedBox(
            height: 72,
            child: Align(
              alignment: Alignment.centerRight,
              child: IconButton(
                onPressed: onClose,
                icon: const Icon(
                  Icons.close,
                  color: Colors.white,
                  size: 30,
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),
          _MenuItem(
            label: 'Accueils',
            onTap: () => onNavigate('/'),
          ),
          const SizedBox(height: 16),
          _MenuItem(
            label: 'Nouvelle Reservation',
            onTap: () => onNavigate('/newBooking'),
          ),
          const SizedBox(height: 16),
          _MenuItem(
            label: 'mes Reservation',
            onTap: () => onNavigate('/myReservations'),
          ),
          const SizedBox(height: 16),
          _MenuItem(
            label: 'Salles',
            onTap: () => onNavigate('/rooms'),
          ),
        ],
      ),
    );
  }
}

class _MenuItem extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const _MenuItem({
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 4.0),
        child: Text(
          label,
          textAlign: TextAlign.right,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}
