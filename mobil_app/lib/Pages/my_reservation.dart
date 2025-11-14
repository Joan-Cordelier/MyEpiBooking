import 'package:flutter/material.dart';
import '../Widget/app_shell.dart';

class MyReservationsPage extends StatelessWidget {
  const MyReservationsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final reservations = [
      {
        'room': '601',
        'date': '12/03',
        'time': '14h / 15h',
        'activity': 'travail',
        'description': '',
      },
      {
        'room': '601',
        'date': '12/03',
        'time': '14h / 15h',
        'activity': 'travail',
        'description': '',
      },
    ];

    return AppShell(
      title: 'Mes Reservation',
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.25),
                offset: const Offset(0, 8),
                blurRadius: 16,
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Table(
              border: TableBorder.all(
                color: Colors.grey.shade400,
                width: 0.7,
              ),
              columnWidths: const {
                0: FlexColumnWidth(1),
                1: FlexColumnWidth(1),
                2: FlexColumnWidth(1),
                3: FlexColumnWidth(1.2),
                4: FlexColumnWidth(1.8),
              },
              children: [
                const TableRow(
                  decoration: BoxDecoration(
                    color: Color(0xFFF5F5F5),
                  ),
                  children: [
                    _HeaderCell('Salle'),
                    _HeaderCell('Date'),
                    _HeaderCell('Heure'),
                    _HeaderCell('Activité'),
                    _HeaderCell('Descriptif'),
                  ],
                ),
                ...reservations.map(
                  (res) => TableRow(
                    children: [
                      _DataCell(res['room']!),
                      _DataCell(res['date']!),
                      _DataCell(res['time']!),
                      _DataCell(res['activity']!),
                      _DataCell(res['description']!),
                    ],
                  ),
                ),
                for (int i = 0; i < 6; i++)
                  const TableRow(
                    children: [
                      _EmptyCell(),
                      _EmptyCell(),
                      _EmptyCell(),
                      _EmptyCell(),
                      _EmptyCell(),
                    ],
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _HeaderCell extends StatelessWidget {
  final String label;
  const _HeaderCell(this.label);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(6.0),
      child: Center(
        child: Text(
          label,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 12,
          ),
        ),
      ),
    );
  }
}

class _DataCell extends StatelessWidget {
  final String value;
  const _DataCell(this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(6.0),
      child: Text(
        value,
        style: const TextStyle(fontSize: 12),
        textAlign: TextAlign.center,
      ),
    );
  }
}

class _EmptyCell extends StatelessWidget {
  const _EmptyCell();

  @override
  Widget build(BuildContext context) {
    return const SizedBox(height: 32);
  }
}
