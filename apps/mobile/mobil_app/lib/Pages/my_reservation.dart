import 'package:flutter/material.dart';
import '../Widget/app_shell.dart';
import '../Service/api_service.dart';
import '../Service/auth_service.dart';

class MyReservationsPage extends StatefulWidget {
  const MyReservationsPage({super.key});

  @override
  State<MyReservationsPage> createState() => _MyReservationsPageState();
}

class _MyReservationsPageState extends State<MyReservationsPage> {
  List<dynamic> reservations = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchReservations();
  }

  Future<void> _fetchReservations() async {
    try {
      final token = await AuthService.getToken();
      if (token != null) {
        final data = await ApiService.fetchMyReservations(token);
        setState(() {
          reservations = data;
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() => isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur lors du chargement: $e')),
        );
      }
    }
  }

  String _formatDate(String dateString) {
    final date = DateTime.parse(dateString);
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}';
  }

  String _formatTime(String dateString) {
    final date = DateTime.parse(dateString);
    return '${date.hour.toString().padLeft(2, '0')}h';
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return AppShell(
        title: 'Mes Réservations',
        child: const Center(child: CircularProgressIndicator()),
      );
    }

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
                      _DataCell(res['room']['name'] ?? 'N/A'),
                      _DataCell(_formatDate(res['startDate'])),
                      _DataCell('${_formatTime(res['startDate'])} / ${_formatTime(res['endDate'])}'),
                      _DataCell(res['type'] ?? 'N/A'),
                      _DataCell(res['title'] ?? ''),
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
