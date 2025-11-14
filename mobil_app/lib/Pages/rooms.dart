import 'package:flutter/material.dart';
import '../Widget/app_shell.dart';

class RoomsPage extends StatelessWidget {
  const RoomsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final rooms = [
      {'room': '601', 'floor': '6 ème'},
      {'room': '801', 'floor': '8 ème'},
    ];

    return AppShell(
      title: 'Salles',
      child: Column(
        children: [
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Table(
                  border: TableBorder.all(
                    color: Colors.grey.shade400,
                    width: 0.7,
                  ),
                  columnWidths: const {
                    0: FlexColumnWidth(1),
                    1: FlexColumnWidth(1),
                  },
                  children: [
                    const TableRow(
                      decoration: BoxDecoration(
                        color: Color(0xFFF5F5F5),
                      ),
                      children: [
                        Padding(
                          padding: EdgeInsets.all(12.0),
                          child: Center(
                            child: Text(
                              'Salle',
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                        Padding(
                          padding: EdgeInsets.all(12.0),
                          child: Center(
                            child: Text(
                              'Étage',
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ],
                    ),
                    ...rooms.map(
                      (room) => TableRow(
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(12.0),
                            child: Center(child: Text(room['room']!)),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(12.0),
                            child: Center(child: Text(room['floor']!)),
                          ),
                        ],
                      ),
                    ),
                    // Lignes vides pour remplir
                    for (int i = 0; i < 4; i++)
                      const TableRow(
                        children: [
                          SizedBox(height: 40),
                          SizedBox(height: 40),
                        ],
                      ),
                  ],
                ),
              ),
            ),
          ),

          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
