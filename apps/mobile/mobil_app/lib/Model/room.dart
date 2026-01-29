class Room {
  final String id;
  final String name;
  final String? description;
  final int capacity;
  final String campusId;
  final bool isActive;
  final String? photo;
  final String? floor;

  Room({
    required this.id,
    required this.name,
    this.description,
    required this.capacity,
    required this.campusId,
    this.isActive = true,
    this.photo,
    this.floor,
  });

  factory Room.fromJson(Map<String, dynamic> json) {
    print('Room.fromJson: $json');
    
    // L'id Prisma est directement l'id
    final id = (json['id'] ?? '').toString();
    
    print('Room parsed - id: $id, name: ${json['name']}');
    
    return Room(
      id: id,
      name: json['name'] ?? '',
      description: json['description'],
      capacity: json['capacity'] ?? 0,
      campusId: (json['campusId'] ?? '').toString(),
      isActive: json['state'] == 'RESERVABLE',
      photo: json['photo'],
      floor: json['floor'],
    );
  }

  String get apiId => id;
}
